import { dbEnabled, getTree, hashOwner } from "@/lib/server/db";

const ID = /^[A-Za-z0-9]{8}$/;

// the tree page polls this; the owner sends their key in a header (never in the URL)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID.test(id)) return Response.json({ error: "트리를 찾을 수 없어요." }, { status: 404 });
  if (!dbEnabled()) return Response.json({ error: "지금은 트리를 볼 수 없어요." }, { status: 503 });

  const key = req.headers.get("x-owner-key");
  try {
    const tree = await getTree(id, key ? hashOwner(key) : null);
    if (!tree) return Response.json({ error: "트리를 찾을 수 없어요." }, { status: 404 });
    return Response.json(tree, { headers: { "cache-control": "private, no-store" } });
  } catch (err) {
    console.error("get_tree failed", err);
    return Response.json({ error: "서버가 잠깐 바빠요." }, { status: 503 });
  }
}
