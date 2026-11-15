"use client";

import { PER_PAGE, type Ornament } from "@/lib/ornaments";
import OrnamentArt from "./OrnamentArt";
import TreeArt, { SLOTS } from "./TreeArt";

type Props = {
  ornaments: Ornament[];
  page?: number;
  fresh?: number | null; // slot that was just hung, gets the drop-in animation
  onPick?: (o: Ornament) => void;
  label: string;
};

// The tree with its ornaments on top. One picture holds 20; more go on the next page.
export default function TreeView({ ornaments, page = 0, fresh = null, onPick, label }: Props) {
  const shown = ornaments.filter((o) => Math.floor(o.slot / PER_PAGE) === page);

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[360px]" role="group" aria-label={label}>
      <TreeArt />
      {shown.map((o) => {
        const [x, y] = SLOTS[o.slot % PER_PAGE];
        const style = { left: `${(x / 360) * 100}%`, top: `${(y / 480) * 100}%` };
        const art = (
          <span className={`block origin-top ${o.slot === fresh ? "animate-popin" : "animate-sway"}`} style={{ animationDelay: o.slot === fresh ? undefined : `${(o.slot % 7) * -0.5}s` }}>
            <OrnamentArt kind={o.kind} size={44} />
          </span>
        );
        return onPick ? (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(o)}
            className="absolute -mt-[26px] -ml-[22px] size-11 rounded-full p-0 transition-transform hover:scale-110"
            style={style}
            aria-label={`${o.author}님의 ${o.message ? "메시지 보기" : "오너먼트"}`}
          >
            {art}
          </button>
        ) : (
          <span key={o.id} className="absolute -mt-[26px] -ml-[22px]" style={style}>
            {art}
          </span>
        );
      })}
    </div>
  );
}
