import { createTree, dbEnabled, hashIp, hashOwner, newOwnerKey, newTreeId } from "@/lib/server/db";
import { badText, cleanName, ipOf } from "@/lib/server/clean";

const fail = (error: string, status = 400) => Response.json({ error }, { status });

// make a new tree; the owner key is only ever sent back once, here
export async function POST(req: Request) {
  if (!dbEnabled()) return fail("지금은 트리를 만들 수 없어요. 잠시 후에 다시 해주세요.", 503);

  let body: { name?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail("요청 형식이 이상해요.");
  }
  const name = cleanName(body.name, 12);
  if (!name) return fail("이름은 한글·영어·숫자로 12자까지 쓸 수 있어요.");
  const bad = badText(name);
  if (bad) return fail(bad);

  const key = newOwnerKey();
  const ipHash = hashIp(ipOf(req));
  try {
    // a clash in 62^8 ids is basically impossible, but retry once anyway
    for (let i = 0; i < 2; i++) {
      const id = newTreeId();
      const r = await createTree({ id, name, ownerHash: hashOwner(key), ipHash });
      if (r.ok) return Response.json({ id, key });
      if (r.reason === "ip") return fail("트리를 너무 많이 만들었어요. 한 시간 뒤에 다시 해주세요.", 429);
    }
    return fail("트리를 못 만들었어요. 다시 해주세요.", 503);
  } catch (err) {
    console.error("create_tree failed", err);
    return fail("서버가 잠깐 바빠요. 조금 있다 다시 해주세요.", 503);
  }
}
