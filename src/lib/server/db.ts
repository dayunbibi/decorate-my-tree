// Talks to Supabase through its REST API (PostgREST) with plain fetch.
// The SQL functions it calls live in supabase/schema.sql.
import { createHmac, randomBytes } from "node:crypto";
import { OPEN_AT, type Kind, type Tree } from "@/lib/ornaments";

const URL = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
const KEY = process.env.SUPABASE_SECRET_KEY?.trim(); // sb_secret_..., server only

// only turn the DB on when both values look right (plain http only for a local test DB)
const looksLikeUrl = /^https:\/\/[^\s/]+$/.test(URL ?? "") || (process.env.NODE_ENV !== "production" && /^http:\/\/localhost:\d+$/.test(URL ?? ""));
const configured = !!URL && looksLikeUrl && !!KEY && !URL.includes(KEY);

if ((URL || KEY) && !configured) {
  console.warn("Supabase is off: SUPABASE_URL must look like https://xxxx.supabase.co and SUPABASE_SECRET_KEY must be set");
}

export function dbEnabled() {
  return configured;
}

const hmac = (label: string, value: string) => createHmac("sha256", KEY ?? "").update(`tree-${label}:${value}`).digest("hex");

// raw IPs are never stored. Same person -> same hash, but it can't be reversed
export const hashIp = (ip: string) => hmac("ip", ip);
// the owner's key stays in their browser; the DB only has this hash
export const hashOwner = (key: string) => hmac("owner", key);

const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function newTreeId() {
  return Array.from(randomBytes(8), (b) => ABC[b % ABC.length]).join("");
}
export function newOwnerKey() {
  return randomBytes(24).toString("base64url");
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: KEY!, "content-type": "application/json" },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
  } catch (err) {
    // fetch errors can include the full URL, so only keep the error type
    throw new Error(`Supabase ${fn} request failed (${err instanceof Error ? err.name : "unknown"})`);
  }
  if (!res.ok) throw new Error(`Supabase ${fn} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

type Result<R extends string> = { ok: true; slot?: number } | { ok: false; reason: R };

export function createTree(a: { id: string; name: string; ownerHash: string; ipHash: string }) {
  return rpc<Result<"ip" | "taken">>("create_tree", { p_id: a.id, p_name: a.name, p_owner_hash: a.ownerHash, p_ip_hash: a.ipHash });
}

export function addOrnament(a: { tree: string; kind: Kind; author: string; message: string; ipHash: string }) {
  return rpc<Result<"ip" | "full" | "none">>("add_ornament", {
    p_tree: a.tree,
    p_kind: a.kind,
    p_author: a.author,
    p_message: a.message,
    p_ip_hash: a.ipHash,
  });
}

export function getTree(tree: string, ownerHash: string | null) {
  return rpc<Tree | null>("get_tree", { p_tree: tree, p_owner_hash: ownerHash, p_open_at: OPEN_AT.toISOString() });
}

export function hideOrnament(tree: string, ownerHash: string, id: number) {
  return rpc<boolean>("hide_ornament", { p_tree: tree, p_owner_hash: ownerHash, p_id: id });
}
