import { addOrnament, dbEnabled, hashIp } from "@/lib/server/db";
import { badText, cleanKind, cleanMessage, cleanName, ipOf } from "@/lib/server/clean";

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[A-Za-z0-9]{8}$/.test(id)) return fail("트리를 찾을 수 없어요.", 404);
  if (!dbEnabled()) return fail("지금은 오너먼트를 달 수 없어요.", 503);

  let body: { kind?: unknown; author?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail("요청 형식이 이상해요.");
  }
  const kind = cleanKind(body.kind);
  if (!kind) return fail("오너먼트를 골라주세요.");
  const author = cleanName(body.author, 10);
  if (!author) return fail("이름은 한글·영어·숫자로 10자까지 쓸 수 있어요.");
  const message = cleanMessage(body.message);
  if (!message) return fail("메시지는 1~120자로 써주세요.");
  const bad = badText(author, message);
  if (bad) return fail(bad);

  try {
    const r = await addOrnament({ tree: id, kind, author, message, ipHash: hashIp(ipOf(req)) });
    if (!r.ok) {
      if (r.reason === "none") return fail("트리를 찾을 수 없어요.", 404);
      if (r.reason === "full") return fail("트리가 꽉 찼어요! 120개까지 달 수 있어요.", 409);
      return fail("잠깐 쉬었다가 달아주세요. 10분에 10개까지예요.", 429);
    }
    return Response.json({ ok: true, slot: r.slot });
  } catch (err) {
    console.error("add_ornament failed", err);
    return fail("서버가 잠깐 바빠요. 조금 있다 다시 해주세요.", 503);
  }
}
