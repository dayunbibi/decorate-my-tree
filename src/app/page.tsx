import Snow from "@/components/Snow";
import TreeView from "@/components/TreeView";
import CreateTree from "@/components/CreateTree";
import Footer from "@/components/Footer";
import { KINDS, type Ornament } from "@/lib/ornaments";

// a few ornaments so the empty tree on the first screen doesn't look sad
const SAMPLE: Ornament[] = [0, 3, 5, 8, 10, 12, 15, 17, 19].map((slot, i) => ({
  id: slot,
  slot,
  kind: KINDS[i % KINDS.length],
  author: "",
}));

const STEPS = [
  ["트리 만들기", "이름만 쓰면 바로 생겨요"],
  ["링크 보내기", "친구, 가족이 오너먼트에 메시지를 달아요"],
  ["크리스마스에 열기", "12월 25일에 나만 읽을 수 있어요"],
];

export default function Home() {
  return (
    <>
      <Snow />
      <main className="relative z-1 mx-auto max-w-[440px] px-4 pt-10 pb-[120px]">
        <div className="text-center">
          <span className="inline-block rounded-full bg-night-950/60 px-3 py-1.5 text-xs leading-none font-medium text-bulb-300 ring-1 ring-bulb-300/35 ring-inset">
            향수병 게임즈 · 크리스마스 편
          </span>
          <h1 className="m-0 mt-4 font-display text-[44px] leading-[1.1] font-bold tracking-[-0.02em] text-bulb-100 [text-shadow:0_0_28px_rgb(255_210_122/0.45)]">
            내 트리를 꾸며줘
          </h1>
          <p className="m-0 mt-3 font-brush text-[26px] leading-none text-berry-300">멀리 있어도, 크리스마스엔 같이</p>
        </div>

        <div className="mt-4">
          <TreeView ornaments={SAMPLE} label="붕어빵, 호떡, 귤 오너먼트가 달린 크리스마스 트리 예시" />
        </div>

        <p className="m-0 mt-2 text-center text-[15px] leading-relaxed">
          유리 구슬 대신 붕어빵, 호떡, 귤로 꾸미는 트리.
          <br />
          친구들이 달아준 메시지는 크리스마스에 열려요.
        </p>

        <ol className="m-0 mt-6 grid list-none grid-cols-3 gap-2 p-0">
          {STEPS.map(([title, desc], i) => (
            <li key={title} className="card flex flex-col items-center gap-1.5 px-2 py-3.5 text-center shadow-none">
              <span className="flex size-7 items-center justify-center rounded-full bg-bulb-300 font-mono text-[13px] font-bold text-night-950">{i + 1}</span>
              <span className="text-sm font-semibold">{title}</span>
              <span className="text-xs leading-snug text-muted">{desc}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <CreateTree />
        </div>
        <Footer />
      </main>
    </>
  );
}
