"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { KIND_NAME, KINDS, MAX_ORNAMENTS, OPEN_AT, PER_PAGE, type Kind, type Ornament, type Tree } from "@/lib/ornaments";
import { daysUntil, readMine, saveMine } from "@/lib/myTrees";
import TreeView from "./TreeView";
import OrnamentArt from "./OrnamentArt";
import BottomBar from "./BottomBar";

const AUTHOR_KEY = "my-author-name";

export default function TreeClient({ id, initial }: { id: string; initial: Tree }) {
  const [tree, setTree] = useState(initial);
  const [key, setKey] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [page, setPage] = useState(0);
  const [picked, setPicked] = useState<Ornament | null>(null);
  const [hanging, setHanging] = useState(false);
  const [fresh, setFresh] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState("");
  const [days, setDays] = useState<number | null>(null);

  const refresh = useCallback(
    async (ownerKey = key) => {
      try {
        const res = await fetch(`/api/trees/${id}`, { headers: ownerKey ? { "x-owner-key": ownerKey } : {}, cache: "no-store" });
        if (res.ok) setTree(await res.json());
      } catch {
        // keep showing what we have
      }
    },
    [id, key],
  );

  // owner key: from the 열쇠 링크 (#k=...) or from this device
  useEffect(() => {
    const fromLink = new URLSearchParams(location.hash.slice(1)).get("k");
    if (fromLink) {
      saveMine(id, fromLink, initial.name);
      history.replaceState(null, "", location.pathname + location.search); // don't leave the key in the address bar
    }
    const k = fromLink ?? readMine()[id]?.key ?? null;
    setKey(k);
    if (new URLSearchParams(location.search).get("new") === "1") {
      setIsNew(true);
      history.replaceState(null, "", location.pathname); // the welcome card only shows once
    }
    setDays(daysUntil(OPEN_AT));
    if (k) refresh(k);
    // only on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  const treeUrl = () => `${location.origin}/t/${id}`;

  async function share() {
    const text = `내 트리를 꾸며줘 🎄 오너먼트 하나 달아줘! 메시지는 크리스마스에 열어볼게`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${tree.name}님의 트리`, text, url: treeUrl() });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${treeUrl()}`);
      flash("링크를 복사했어요! 친구들한테 보내주세요");
    } catch (err) {
      if ((err as Error).name !== "AbortError") flash("복사가 안 됐어요. 주소창 링크를 직접 복사해 주세요");
    }
  }

  async function copyKeyLink() {
    try {
      await navigator.clipboard.writeText(`${treeUrl()}#k=${key}`);
      flash("열쇠 링크를 복사했어요. 나만 아는 곳에 저장해 두세요");
    } catch {
      flash("복사가 안 됐어요. 다시 눌러주세요");
    }
  }

  async function hide(o: Ornament) {
    const res = await fetch(`/api/trees/${id}/hide`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-owner-key": key ?? "" },
      body: JSON.stringify({ id: o.id }),
    });
    setPicked(null);
    if (res.ok) {
      setTree((t) => ({ ...t, ornaments: t.ornaments.filter((x) => x.id !== o.id) }));
      flash("오너먼트를 내렸어요");
    } else flash("내리지 못했어요. 다시 해주세요");
  }

  async function onHung(slot: number) {
    setHanging(false);
    setAdded(true);
    setFresh(slot);
    setPage(Math.floor(slot / PER_PAGE));
    await refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const count = tree.ornaments.length;
  const pages = Math.max(1, Math.ceil((Math.max(0, ...tree.ornaments.map((o) => o.slot)) + 1) / PER_PAGE));
  const owner = tree.owner;
  const full = tree.ornaments.some((o) => o.slot >= MAX_ORNAMENTS - 1);

  return (
    <>
      <header className="text-center">
        <span className="inline-block rounded-full bg-night-950/60 px-3 py-1.5 text-xs leading-none font-medium text-bulb-300 ring-1 ring-bulb-300/35 ring-inset">
          {tree.open ? "메리 크리스마스! 🎁" : days === null ? "12월 25일에 열려요" : days === 0 ? "오늘 열려요!" : `D-${days} · 12월 25일에 열려요`}
        </span>
        <h1 className="m-0 mt-3 font-display text-[34px] leading-tight font-bold text-bulb-100 [text-shadow:0_0_24px_rgb(255_210_122/0.4)]">
          {tree.name}님의 트리
        </h1>
        <p className="m-0 mt-1.5 text-[15px] text-muted">
          오너먼트 <span className="font-mono font-bold text-bulb-300">{count}</span>개 달렸어요
        </p>
      </header>

      <div className="relative mt-3">
        <TreeView ornaments={tree.ornaments} page={page} fresh={fresh} onPick={setPicked} label={`${tree.name}님의 트리, 오너먼트 ${count}개`} />
        {count === 0 && (
          <p className="absolute inset-x-0 top-[42%] m-0 text-center">
            <span className="inline-block rounded-full bg-night-950/85 px-4 py-2.5 text-[15px] font-semibold text-bulb-100 ring-1 ring-bulb-300/30">
              {owner ? "아직 텅 비었어요. 링크를 보내보세요!" : "첫 번째 오너먼트를 달아주세요!"}
            </span>
          </p>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-1 flex items-center justify-center gap-4">
          <button type="button" className="size-10 rounded-full bg-night-800 text-lg ring-1 ring-night-line" onClick={() => setPage((p) => p - 1)} disabled={page === 0} aria-label="이전 트리 페이지">
            ‹
          </button>
          <span className="font-mono text-sm text-muted">
            {page + 1} / {pages}
          </span>
          <button type="button" className="size-10 rounded-full bg-night-800 text-lg ring-1 ring-night-line" onClick={() => setPage((p) => p + 1)} disabled={page >= pages - 1} aria-label="다음 트리 페이지">
            ›
          </button>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {owner ? (
          <>
            {isNew && (
              <div className="card p-5 text-center">
                <p className="m-0 font-display text-xl font-bold text-bulb-100">트리가 생겼어요! 🎄</p>
                <p className="m-0 mt-2 text-sm leading-relaxed text-muted">아래 버튼으로 링크를 보내면 친구들이 오너먼트를 달아줄 수 있어요.</p>
              </div>
            )}
            <div className="card p-5">
              <p className="m-0 text-[15px] leading-relaxed">
                {tree.open ? (
                  <>오너먼트를 눌러서 메시지를 읽어보세요 💌</>
                ) : (
                  <>
                    누가 달았는지는 지금도 보이고, <b className="text-bulb-300">메시지는 크리스마스에</b> 열려요.
                  </>
                )}
              </p>
              <hr className="my-4 border-0 border-t border-dashed border-night-line" />
              <p className="m-0 text-sm font-semibold">🔑 열쇠 링크</p>
              <p className="m-0 mt-1 text-[13px] leading-relaxed text-muted">
                이 기기에선 자동으로 주인으로 열려요. 폰을 바꾸거나 다른 브라우저에서 열 땐 열쇠 링크가 필요해요. <b className="text-cream">친구한테는 보내지 마세요!</b>
              </p>
              <button type="button" className="btn btn-ghost mt-3 h-11 text-[15px]" onClick={copyKeyLink}>
                열쇠 링크 복사하기
              </button>
            </div>
          </>
        ) : (
          added && (
            <div className="card p-5 text-center">
              <p className="m-0 font-display text-xl font-bold text-bulb-100">오너먼트를 달았어요!</p>
              <p className="m-0 mt-2 text-sm leading-relaxed text-muted">{tree.name}님이 크리스마스에 읽을 수 있어요.</p>
              <Link href="/" className="mt-3 inline-block text-[15px] font-semibold text-bulb-300 underline underline-offset-4">
                나도 트리 만들기 →
              </Link>
            </div>
          )
        )}
      </div>

      <p role="status" className="fixed inset-x-0 bottom-[96px] z-30 m-0 text-center">
        {toast && <span className="inline-block animate-sheet rounded-full bg-night-950/90 px-4 py-2.5 text-sm text-cream ring-1 ring-night-line">{toast}</span>}
      </p>

      <BottomBar>
        {owner ? (
          <button type="button" className="btn" onClick={share}>
            🔗 링크 보내고 꾸며달라기
          </button>
        ) : (
          <>
            {added && (
              <Link href="/" className="btn btn-ghost w-[42%] text-base no-underline">
                내 트리 만들기
              </Link>
            )}
            <button type="button" className="btn flex-1" onClick={() => setHanging(true)} disabled={full}>
              {full ? "트리가 꽉 찼어요" : added ? "하나 더 달기" : "🎁 오너먼트 달아주기"}
            </button>
          </>
        )}
      </BottomBar>

      {picked && <Picked ornament={picked} tree={tree} onClose={() => setPicked(null)} onHide={hide} />}
      {hanging && <HangSheet id={id} owner={tree.name} onClose={() => setHanging(false)} onDone={onHung} />}
    </>
  );
}

// bottom sheet with a dark backdrop; Escape or tapping outside closes it
function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-night-950/70 backdrop-blur-[2px]" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-[440px] animate-sheet overflow-y-auto rounded-t-[24px] bg-night-800 px-5 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))] ring-1 ring-night-line outline-none"
      >
        {children}
      </div>
    </div>
  );
}

function Picked({ ornament: o, tree, onClose, onHide }: { ornament: Ornament; tree: Tree; onClose: () => void; onHide: (o: Ornament) => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <Sheet label={`${o.author}님의 오너먼트`} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <OrnamentArt kind={o.kind} size={84} loop={false} />
        <p className="m-0 mt-2 text-sm text-muted">{KIND_NAME[o.kind]}</p>
        <p className="m-0 mt-1 font-display text-2xl font-bold text-bulb-100">from. {o.author}</p>
      </div>

      {o.message !== undefined ? (
        <p className="m-0 mt-4 rounded-xl bg-paper px-5 py-4 font-display text-[17px] leading-relaxed whitespace-pre-wrap text-paper-ink">{o.message}</p>
      ) : (
        <p className="m-0 mt-4 rounded-xl bg-night-950 px-5 py-4 text-center text-[15px] leading-relaxed text-muted">
          🔒 {tree.owner ? "메시지는 크리스마스에 열려요" : `메시지는 크리스마스에 ${tree.name}님만 볼 수 있어요`}
        </p>
      )}

      <div className="mt-5 flex gap-2.5">
        {tree.owner &&
          (confirm ? (
            <button type="button" className="btn btn-ghost w-[46%] text-base text-berry-300" onClick={() => onHide(o)}>
              진짜 내리기
            </button>
          ) : (
            <button type="button" className="btn btn-ghost w-[46%] text-base" onClick={() => setConfirm(true)}>
              트리에서 내리기
            </button>
          ))}
        <button type="button" className="btn flex-1" onClick={onClose}>
          닫기
        </button>
      </div>
    </Sheet>
  );
}

function HangSheet({ id, owner, onClose, onDone }: { id: string; owner: string; onClose: () => void; onDone: (slot: number) => void }) {
  const [kind, setKind] = useState<Kind>("ball");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setAuthor(localStorage.getItem(AUTHOR_KEY) ?? "");
    } catch {
      // private mode
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/trees/${id}/ornaments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, author, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "오너먼트를 못 달았어요.");
      try {
        localStorage.setItem(AUTHOR_KEY, author.trim());
      } catch {
        // fine
      }
      onDone(data.slot);
    } catch (err) {
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "인터넷 연결을 확인해 주세요.");
      setBusy(false);
    }
  }

  return (
    <Sheet label={`${owner}님 트리에 오너먼트 달기`} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <h2 className="m-0 font-display text-[22px] leading-tight font-bold text-bulb-100">{owner}님 트리에 뭘 달아줄까요?</h2>

        <fieldset className="m-0 grid grid-cols-4 gap-2 border-0 p-0">
          <legend className="sr-only">오너먼트 고르기</legend>
          {KINDS.map((k) => (
            <label
              key={k}
              className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl py-2.5 ring-1 ring-inset has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bulb-300 ${
                kind === k ? "bg-bulb-300/12 ring-2 ring-bulb-300" : "bg-night-900 ring-night-line"
              }`}
            >
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              <OrnamentArt kind={k} size={40} loop={false} />
              <span className={`text-xs whitespace-nowrap ${kind === k ? "font-semibold text-bulb-300" : "text-muted"}`}>{KIND_NAME[k]}</span>
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="author" className="text-sm font-semibold">
            보내는 사람
          </label>
          <input id="author" className="field h-12" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={10} required placeholder="예: 상연, 엄마, 옆자리 동기" autoComplete="nickname" />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="message" className="text-sm font-semibold">
              메시지
            </label>
            <span className="font-mono text-xs text-dim">{message.length}/120</span>
          </div>
          <textarea
            id="message"
            className="field min-h-28 resize-none py-3 leading-relaxed"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={120}
            required
            placeholder="크리스마스에 열어볼 한마디"
          />
          <p className="m-0 text-xs text-dim">🔒 {owner}님만, 크리스마스에 읽을 수 있어요.</p>
        </div>

        {error && (
          <p role="alert" className="m-0 text-sm text-berry-300">
            {error}
          </p>
        )}

        <div className="flex gap-2.5">
          <button type="button" className="btn btn-ghost w-[34%] text-base" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="btn flex-1" disabled={busy || !author.trim() || !message.trim()}>
            {busy ? "다는 중…" : "트리에 달기"}
          </button>
        </div>
      </form>
    </Sheet>
  );
}
