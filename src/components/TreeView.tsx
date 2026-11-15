/* eslint-disable @next/next/no-img-element -- static svg */
"use client";

import { type Ornament as O } from "@/lib/ornaments";
import { PER_PAGE, SPOTS, TREE_H, TREE_W, pageOf, spotOf } from "@/lib/slots";
import Ornament from "./Ornament";

type Props = {
  ornaments: O[];
  page?: number;
  next?: number | null; // slot the next ornament goes to (gold "+" ring)
  showEmpty?: boolean; // dashed circles on free spots
  fresh?: number | null; // slot that was just hung, drops in
  onPick?: (o: O) => void;
  onNext?: () => void;
  label: string;
};

// tree-base.svg with ornaments on top. Everything is in % of the 360x440 viewBox,
// so the whole layer scales together (300px on the home screen, smaller on narrow phones).
const pct = (x: number, y: number) => ({ left: `${(x / TREE_W) * 100}%`, top: `${(y / TREE_H) * 100}%` });

export default function TreeView({ ornaments, page = 0, next = null, showEmpty = false, fresh = null, onPick, onNext, label }: Props) {
  const here = ornaments.filter((o) => pageOf(o.slot) === page);
  const used = new Set(here.map((o) => spotOf(o.slot)));
  const nextSpot = next !== null && pageOf(next) === page ? spotOf(next) : null;

  return (
    <div className="relative aspect-[360/440] w-full" role="group" aria-label={label}>
      <img src="/tree/tree-base.svg" alt="" className="absolute inset-0 size-full select-none" draggable={false} />

      {showEmpty &&
        SPOTS.map(([x, y], i) =>
          used.has(i) || i === nextSpot || (page * PER_PAGE + i >= 120) ? null : (
            <span
              key={`e${i}`}
              aria-hidden="true"
              className="absolute -translate-1/2 rounded-full border-[1.5px] border-dashed border-[rgb(255_214_140/0.5)] text-center text-[rgb(255_214_140/0.7)]"
              style={{ ...pct(x, y), width: "7.8%", aspectRatio: "1" }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[clamp(10px,3vw,13px)] leading-none">+</span>
            </span>
          ),
        )}

      {nextSpot !== null && (
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          aria-label="다음 빈자리에 오너먼트 달기"
          className="absolute flex -translate-1/2 animate-glow items-center justify-center rounded-full border-2 border-gold bg-[rgb(244_190_79/0.18)] text-gold-soft disabled:opacity-100"
          style={{ ...pct(...SPOTS[nextSpot]), width: "9.4%", aspectRatio: "1" }}
        >
          <svg viewBox="0 0 24 24" className="w-1/2" aria-hidden="true">
            <path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {here.map((o) => {
        const [x, y] = SPOTS[spotOf(o.slot)];
        const inner = (
          <span className={`flex flex-col items-center ${o.slot === fresh ? "animate-hang" : "origin-top animate-sway"}`} style={o.slot === fresh ? undefined : { animationDelay: `${(o.slot % 7) * -0.6}s` }}>
            {/* 1px x 8px thread above the ornament */}
            <span className="w-px pb-[22%] bg-[rgb(255_228_170/0.6)]" aria-hidden="true" />
            <Ornament kind={o.kind} size="100%" />
          </span>
        );
        // spot is the ornament's center; the thread sits above it
        const style = { left: `${((x - 18) / TREE_W) * 100}%`, top: `${((y - 26) / TREE_H) * 100}%`, width: "10%" };
        return onPick ? (
          <button key={o.id} type="button" onClick={() => onPick(o)} className="absolute p-0" style={style} aria-label={`${o.author}님이 단 오너먼트`}>
            {inner}
          </button>
        ) : (
          <span key={o.id} className="absolute" style={style}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}
