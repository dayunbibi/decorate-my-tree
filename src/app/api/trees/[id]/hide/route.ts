import { dbEnabled, hashOwner, hideOrnament } from "@/lib/server/db";

// the owner takes an ornament down
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const key = req.headers.get("x-owner-key");
  if (!/^[A-Za-z0-9]{8}$/.test(id) || !key) return Response.json({ error: "권한이 없어요." }, { status: 403 });
  if (!dbEnabled()) return Response.json({ error: "지금은 할 수 없어요." }, { status: 503 });

  let body: { id?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "요청 형식이 이상해요." }, { status: 400 });
  }
  if (typeof body.id !== "number" || !Number.isSafeInteger(body.id)) return Response.json({ error: "요청 형식이 이상해요." }, { status: 400 });

  try {
    const ok = await hideOrnament(id, hashOwner(key), body.id);
    return ok ? Response.json({ ok: true }) : Response.json({ error: "권한이 없어요." }, { status: 403 });
  } catch (err) {
    console.error("hide_ornament failed", err);
    return Response.json({ error: "서버가 잠깐 바빠요." }, { status: 503 });
  }
}
