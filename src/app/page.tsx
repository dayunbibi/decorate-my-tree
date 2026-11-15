import Snow from "@/components/Snow";
import TreeView from "@/components/TreeView";
import CreateTree from "@/components/CreateTree";
import Footer from "@/components/Footer";
import type { Kind, Ornament } from "@/lib/ornaments";

// ornaments on the preview tree, same as the design's home screen
const SAMPLE: [number, Kind][] = [
  [0, "star"], [1, "ball"], [2, "bell"], [3, "gingerbread"], [4, "star"], [5, "candycane"],
  [6, "gift"], [7, "stocking"], [8, "ball"], [9, "snowman"], [10, "gingerbread"],
];
const PREVIEW: Ornament[] = SAMPLE.map(([slot, kind]) => ({ id: slot, slot, kind, author: "" }));

const STEPS = ["트리 만들기", "링크 보내기", "25일에 열어보기"];

export default function Home() {
  return (
    <>
      <Snow />
      <main className="relative z-1 mx-auto flex min-h-dvh max-w-[440px] flex-col items-center px-5 pt-7 pb-[calc(22px+env(safe-area-inset-bottom))]">
        <p className="chip m-0 border border-line bg-night-800/80 font-medium text-muted">향수병 게임즈 · 크리스마스 편</p>
        <h1 className="title mt-3.5 text-[40px] leading-[1.2] tracking-[-1px]">내 트리를 꾸며줘</h1>
        <p className="m-0 mt-1 font-hand text-[28px] leading-[1.1] text-gold">멀리 있어도, 크리스마스엔 같이</p>

        <div className="mt-2 w-[300px] max-w-full flex-none">
          <TreeView ornaments={PREVIEW} label="오너먼트가 달린 크리스마스 트리 예시" />
        </div>

        <ol className="m-0 mt-1.5 grid w-full list-none grid-cols-3 gap-2 p-0">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-col items-center gap-1 text-[13px] text-muted">
              <span className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-gold text-xs font-bold text-gold">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>

        <div className="mt-auto w-full pt-6">
          <CreateTree />
        </div>
        <Footer />
      </main>
    </>
  );
}
