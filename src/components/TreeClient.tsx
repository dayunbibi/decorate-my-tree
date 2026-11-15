"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { KIND_NAME, KINDS, MAX_ORNAMENTS, OPEN_AT, type Kind, type Ornament as O, type Tree } from "@/lib/ornaments";
import { PER_PAGE, pageOf } from "@/lib/slots";
import { daysUntil, readMine, saveMine } from "@/lib/myTrees";
import { copyText } from "@/lib/copy";
import { hungOn, makeCardImage } from "@/lib/cardImage";
import TreeView from "./TreeView";
import Ornament from "./Ornament";
import { DownloadIcon, KeyIcon, LockIcon, NextIcon, OrnamentIcon, PrevIcon, ShareIcon } from "./Icons";

const AUTHOR_KEY = "my-author-name";
const AVATAR_COLORS = ["bg-ornament-red", "bg-pine", "bg-[#b9773e]"];

export default function TreeClient({ id, initial }: { id: string; initial: Tree }) {
  const [tree, setTree] = useState(initial);
  const [key, setKey] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [page, setPage] = useState(pageOf(initial.next));
  const [picked, setPicked] = useState<O | null>(null);
  const [hanging, setHanging] = useState(false);
  const [fresh, setFresh] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState("");
  const [days, setDays] = useState<number | null>(null);
  const [manual, setManual] = useState<{ title: string; link: string; note: string } | null>(null);
  const [showTree, setShowTree] = useState(false); // owner after Christmas: cards first, tree on request

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
      history.replaceState(null, "", location.pathname); // the welcome note only shows once
    }
    setDays(daysUntil(OPEN_AT));
    if (k) refresh(k);
    // only on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  }

  const treeUrl = () => `${location.origin}/t/${id}`;

  // phones: the share sheet. Otherwise copy, and if even that's blocked, show the link to copy by hand
  async function share() {
    const text = `내 트리를 꾸며줘 🎄 오너먼트 하나 달아줘! 메시지는 크리스마스에 열어볼게`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${tree.name}님의 트리`, text, url: treeUrl() });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // closed the share sheet
      }
    }
    if (await copyText(`${text} ${treeUrl()}`)) flash("링크를 복사했어요! 친구들한테 보내주세요");
    else setManual({ title: "트리 링크", link: treeUrl(), note: "꾹 눌러서 복사한 다음 친구들한테 보내주세요." });
  }

  async function copyKeyLink() {
    const link = `${treeUrl()}#k=${key}`;
    if (await copyText(link)) flash("열쇠 링크를 복사했어요. 나만 아는 곳에 저장해 두세요");
    else setManual({ title: "열쇠 링크", link, note: "꾹 눌러서 복사한 다음 메모장 같은 나만 보는 곳에 저장해 두세요. 친구한테는 보내지 마세요!" });
  }

  async function hide(o: O) {
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
    setPage(pageOf(slot));
    await refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const owner = tree.owner;
  const count = tree.ornaments.length;
  const full = tree.next >= MAX_ORNAMENTS;
  const pages = Math.max(1, pageOf(Math.max(0, tree.next - 1)) + 1, pageOf(tree.next) + (full ? 0 : 1));
  const freeHere = full ? 0 : Math.min((pageOf(tree.next) + 1) * PER_PAGE, MAX_ORNAMENTS) - tree.next;

  const toastEl = (
    <p role="status" className="pointer-events-none fixed inset-x-0 bottom-[110px] z-50 m-0 text-center">
      {toast && <span className="inline-block animate-sheet rounded-full border border-line bg-night-800 px-4 py-2.5 text-sm text-cream shadow-lg">{toast}</span>}
    </p>
  );

  // Dec 25, owner: one card at a time
  if (owner && tree.open && !showTree) {
    return (
      <>
        <Reveal tree={tree} onShowTree={() => setShowTree(true)} flash={flash} />
        {toastEl}
      </>
    );
  }

  // the people who hung ornaments, newest first, one bubble each
  const authors = [...new Set([...tree.ornaments].sort((a, b) => b.slot - a.slot).map((o) => o.author))];

  return (
    <>
      <header className="flex flex-col items-center text-center">
        {tree.open ? (
          <p className="chip m-0 bg-gold font-bold text-[#2a1a08]">12월 25일 · 메리 크리스마스</p>
        ) : (
          <p className="chip m-0 border border-gold/45 bg-gold/10 font-semibold text-gold">
            <LockIcon />
            {days === null ? "12월 25일에 열려요" : days === 0 ? "오늘 밤 열려요!" : `D-${days} · 12월 25일에 열려요`}
          </p>
        )}
        <h1 className="title mt-3 text-[34px] leading-[1.25] tracking-[-0.8px]">{tree.name}님의 트리</h1>
        <p className="m-0 mt-1 text-sm text-muted">
          오너먼트 <b className="font-bold text-gold">{count}</b>개 달렸어요{!full && <> · 빈자리 {freeHere}곳</>}
        </p>
      </header>

      <div className="relative mx-auto mt-1.5 w-full max-w-[360px]">
        <TreeView
          ornaments={tree.ornaments}
          page={page}
          next={full || owner ? null : tree.next}
          showEmpty
          fresh={fresh}
          onPick={setPicked}
          onNext={() => setHanging(true)}
          label={`${tree.name}님의 트리, 오너먼트 ${count}개`}
        />
      </div>

      {pages > 1 && (
        <div className="mt-1 flex items-center justify-center gap-4">
          <button type="button" className="flex size-11 items-center justify-center rounded-full border border-line bg-night-700" onClick={() => setPage((p) => p - 1)} disabled={page === 0} aria-label="이전 트리 페이지">
            <PrevIcon />
          </button>
          <span className="min-w-[52px] text-center text-sm font-semibold text-muted">
            <b className="text-cream">{page + 1}</b> / {pages}
          </span>
          <button type="button" className="flex size-11 items-center justify-center rounded-full border border-line bg-night-700" onClick={() => setPage((p) => p + 1)} disabled={page >= pages - 1} aria-label="다음 트리 페이지">
            <NextIcon />
          </button>
        </div>
      )}

      {authors.length > 0 && (
        <div className="mt-1.5 flex items-center justify-center gap-2.5">
          <div className="flex" aria-hidden="true">
            {authors.slice(0, 3).map((a, i) => (
              <span key={a} className={`flex size-7 items-center justify-center rounded-full border-2 border-night-900 text-xs font-bold text-on-ember ${AVATAR_COLORS[i]} ${i ? "-ml-2" : ""}`}>
                {[...a][0]}
              </span>
            ))}
            {authors.length > 3 && <span className="-ml-2 flex size-7 items-center justify-center rounded-full border-2 border-night-900 bg-night-700 text-[11px] font-semibold text-muted">+{authors.length - 3}</span>}
          </div>
          <p className="m-0 text-[13px] text-muted">
            <b className="font-semibold text-cream">{authors.slice(0, 3).join(", ")}</b>
            {authors.length > 3 ? ` 외 ${authors.length - 3}명이` : "님이"} 달아줬어요
          </p>
        </div>
      )}

      <div className="mt-auto flex w-full flex-col gap-3 pt-5">
        {owner ? (
          <>
            <Notice>
              {isNew ? (
                <>
                  트리가 생겼어요! 링크를 보내면 친구들이 오너먼트를 달아줘요. 메시지는 <b className="font-semibold text-cream">크리스마스에</b> 열려요.
                </>
              ) : tree.open ? (
                <>오너먼트를 누르면 메시지를 볼 수 있어요.</>
              ) : (
                <>
                  누가 달았는지는 지금도 보이고, 메시지는 <b className="font-semibold text-cream">크리스마스에</b> 열어볼 수 있어요.
                </>
              )}
            </Notice>
            {tree.open ? (
              <button type="button" className="btn" onClick={() => setShowTree(false)}>
                메시지 카드로 보기
              </button>
            ) : (
              <button type="button" className="btn" onClick={share}>
                <ShareIcon />
                링크 보내고 꾸며달라기
              </button>
            )}
            <button type="button" onClick={copyKeyLink} className="flex items-center justify-center gap-1.5 self-center px-2 py-1 text-sm font-medium text-muted">
              <KeyIcon size={16} />
              다른 기기용 열쇠 링크 복사
            </button>
          </>
        ) : (
          <>
            <Notice>
              {added ? (
                <>
                  달았어요! <b className="font-semibold text-cream">{tree.name}님이 크리스마스에</b> 읽을 수 있어요.
                </>
              ) : (
                <>
                  누가 달았는지는 지금도 보이지만, 메시지는 <b className="font-semibold text-cream">{tree.name}님만 크리스마스에</b> 열어볼 수 있어요.
                </>
              )}
            </Notice>
            <button type="button" className="btn" onClick={() => setHanging(true)} disabled={full}>
              <OrnamentIcon />
              {full ? "트리가 꽉 찼어요" : added ? "하나 더 달아주기" : "오너먼트 달아주기"}
            </button>
            <Link href="/" className="self-center px-2 py-1 text-sm font-medium text-muted no-underline">
              나도 내 트리 만들기 →
            </Link>
          </>
        )}
      </div>

      {toastEl}
      {picked && <Picked ornament={picked} tree={tree} onClose={() => setPicked(null)} onHide={hide} />}
      {manual && <ManualCopy {...manual} onClose={() => setManual(null)} />}
      {hanging && <HangSheet id={id} owner={tree.name} onClose={() => setHanging(false)} onDone={onHung} />}
    </>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 flex items-start gap-2 rounded-input border border-line bg-night-800/85 px-3.5 py-2.5 text-[13px] leading-normal text-muted">
      <LockIcon size={16} className="mt-0.5 flex-none text-gold" />
      <span>{children}</span>
    </p>
  );
}

// bottom sheet over the dimmed page; Escape or tapping outside closes it
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
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[rgb(8_12_22/0.55)] backdrop-blur-[2px]" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[94dvh] w-full max-w-[440px] animate-sheet flex-col overflow-y-auto rounded-t-sheet border-t border-line bg-night-800 px-5 pt-2.5 pb-[calc(22px+env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgb(0_0_0/0.45)] outline-none"
      >
        <div className="h-1 w-10 flex-none self-center rounded-sm bg-line" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

// the handwritten card: ornament hanging on top, message on lined paper
function Card({ o, children }: { o: O; children: React.ReactNode }) {
  return (
    <article className="relative mt-[58px] w-full -rotate-[1.2deg]">
      <div className="absolute top-[-58px] left-1/2 z-1 -ml-[52px] flex size-[104px] items-center justify-center rounded-full bg-[radial-gradient(circle,rgb(255_200_110/0.55),rgb(255_200_110/0)_68%)]">
        <Ornament kind={o.kind} size={88} alt />
      </div>
      <div className="paper rounded-card px-[26px] pt-[52px] pb-[26px] shadow-[0_24px_50px_rgb(0_0_0/0.45),0_0_0_1px_rgb(122_101_83/0.2)]">
        <p className="m-0 text-center font-sans text-xs font-medium text-ink-soft">
          {KIND_NAME[o.kind]}
          {o.at && ` · ${hungOn(o.at)}`}
        </p>
        {children}
        <p className="m-0 mt-[18px] text-right font-display text-xl font-bold text-ink-red">from. {o.author}</p>
      </div>
    </article>
  );
}

function Picked({ ornament: o, tree, onClose, onHide }: { ornament: O; tree: Tree; onClose: () => void; onHide: (o: O) => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <Sheet label={`${o.author}님의 오너먼트`} onClose={onClose}>
      <div className="mt-4">
        <Card o={o}>
          {o.message !== undefined ? (
            <p className="m-0 mt-3.5 font-hand text-[30px] leading-[34px] whitespace-pre-line text-ink">{o.message}</p>
          ) : (
            <p className="m-0 mt-3.5 flex items-center justify-center gap-1.5 py-4 text-center font-hand text-[28px] leading-[34px] text-ink-soft">
              <LockIcon size={18} />
              {tree.owner ? "크리스마스에 열려요" : `${tree.name}님만 크리스마스에 열어봐요`}
            </p>
          )}
        </Card>
      </div>
      <div className={`mt-6 grid gap-2.5 ${tree.owner ? "grid-cols-[1fr_1fr]" : "grid-cols-1"}`}>
        {tree.owner &&
          (confirm ? (
            <button type="button" className="btn-ghost text-[#ff8a7a]" onClick={() => onHide(o)}>
              진짜 내리기
            </button>
          ) : (
            <button type="button" className="btn-ghost" onClick={() => setConfirm(true)}>
              트리에서 내리기
            </button>
          ))}
        <button type="button" className="btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </Sheet>
  );
}

// last resort when the browser won't let us copy: show the link, already selected
function ManualCopy({ title, link, note, onClose }: { title: string; link: string; note: string; onClose: () => void }) {
  return (
    <Sheet label={title} onClose={onClose}>
      <h2 className="title mt-3.5 text-[22px] tracking-[-0.4px]">{title}</h2>
      <p className="m-0 mt-2 text-sm leading-relaxed text-muted">{note}</p>
      <textarea readOnly value={link} rows={3} aria-label={title} onFocus={(e) => e.currentTarget.select()} autoFocus className="field mt-4 resize-none py-3 text-sm leading-relaxed break-all" />
      <button type="button" className="btn mt-4" onClick={onClose}>
        닫기
      </button>
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
      <form onSubmit={submit} className="flex flex-col">
        <h2 className="title mt-3.5 text-[22px] tracking-[-0.4px]">{owner}님 트리에 뭘 달아줄까요?</h2>

        <fieldset className="m-0 mt-3.5 grid grid-cols-4 gap-2 border-0 p-0">
          <legend className="sr-only">오너먼트 종류</legend>
          {KINDS.map((k) => (
            <label
              key={k}
              className={`flex h-[84px] cursor-pointer flex-col items-center justify-center gap-1 rounded-tile border-[1.5px] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                kind === k ? "border-gold bg-gold/14" : "border-line bg-night-700"
              }`}
            >
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              <Ornament kind={k} size={44} />
              <span className={`text-xs font-medium whitespace-nowrap ${kind === k ? "text-gold-soft" : "text-muted"}`}>{KIND_NAME[k]}</span>
            </label>
          ))}
        </fieldset>

        <label htmlFor="author" className="mt-[18px] text-[13px] font-semibold text-muted">
          보내는 사람
        </label>
        <input id="author" className="field mt-1.5 h-12" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={10} required placeholder="이름 또는 별명" autoComplete="nickname" />

        <div className="mt-3.5 flex items-baseline justify-between">
          <label htmlFor="message" className="text-[13px] font-semibold text-muted">
            메시지 카드
          </label>
          <span className="text-xs text-faint">{message.length}/120</span>
        </div>
        <textarea
          id="message"
          className="paper mt-1.5 h-[116px] resize-none rounded-[14px] border-0 px-4 py-3 font-hand text-[26px] leading-[34px] shadow-[inset_0_0_0_1px_rgb(122_101_83/0.25)] outline-none placeholder:text-ink-soft/70 focus:shadow-[inset_0_0_0_2px_var(--color-gold)]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={120}
          required
          placeholder="크리스마스에 열어볼 한마디"
        />
        <p className="m-0 mt-2 flex items-center gap-1.5 text-xs text-faint">
          <LockIcon />
          {owner}님만, 크리스마스에 읽을 수 있어요
        </p>

        {error && (
          <p role="alert" className="m-0 mt-2 text-sm text-[#ff8a7a]">
            {error}
          </p>
        )}

        <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2.5">
          <button type="button" className="btn-ghost" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="btn" disabled={busy || !author.trim() || !message.trim()}>
            {busy ? "다는 중…" : `${KIND_NAME[kind]} 트리에 달기`}
          </button>
        </div>
      </form>
    </Sheet>
  );
}

// Dec 25: the owner opens the messages one by one
function Reveal({ tree, onShowTree, flash }: { tree: Tree; onShowTree: () => void; flash: (m: string) => void }) {
  const cards = [...tree.ornaments].filter((o) => o.message !== undefined).sort((a, b) => a.slot - b.slot);
  const [i, setI] = useState(0);
  const [saving, setSaving] = useState(false);
  const o = cards[i];

  async function save() {
    if (!o) return;
    setSaving(true);
    try {
      const blob = await makeCardImage(o, tree.name);
      const file = new File([blob], `from-${o.author}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          return;
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      flash("카드를 저장했어요");
    } catch {
      flash("저장이 안 됐어요. 화면을 캡처해 주세요");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-46px)] flex-col items-center">
      <div aria-hidden="true" className="pointer-events-none absolute top-[126px] left-1/2 w-full max-w-[360px] -translate-x-1/2 opacity-22 blur-[2px]">
        <TreeView ornaments={tree.ornaments} label="" />
      </div>

      <p className="chip relative m-0 bg-gold font-bold text-[#2a1a08]">12월 25일 · 메리 크리스마스</p>
      <h1 className="title relative mt-3 text-center text-[30px] leading-[1.25] tracking-[-0.6px]">{tree.name}님의 트리가 열렸어요</h1>
      <p className="relative m-0 mt-1 text-sm text-muted">
        메시지 <b className="font-bold text-gold">{cards.length}</b>통 · 하나씩 열어보세요
      </p>

      {o ? (
        <>
          <div className="relative mt-auto w-full pt-10" key={o.id}>
            <div className="animate-sheet">
              <Card o={o}>
                <p className="m-0 mt-3.5 font-hand text-[34px] leading-[40px] whitespace-pre-line text-ink">{o.message}</p>
              </Card>
            </div>
          </div>

          <nav aria-label="메시지 넘기기" className="relative mt-[22px] mb-auto flex items-center gap-4">
            <button type="button" aria-label="이전 메시지" className="flex size-11 items-center justify-center rounded-full border border-line bg-night-700 text-cream" onClick={() => setI(i - 1)} disabled={i === 0}>
              <PrevIcon />
            </button>
            <span className="min-w-[52px] text-center text-sm font-semibold text-muted">
              <b className="text-cream">{i + 1}</b> / {cards.length}
            </span>
            <button type="button" aria-label="다음 메시지" className="flex size-11 items-center justify-center rounded-full border border-line bg-night-700 text-cream" onClick={() => setI(i + 1)} disabled={i >= cards.length - 1}>
              <NextIcon />
            </button>
          </nav>

          <div className="relative mt-6 grid w-full grid-cols-2 gap-2.5">
            <button type="button" className="btn-ghost" onClick={save} disabled={saving}>
              <DownloadIcon />
              {saving ? "만드는 중…" : "카드 저장"}
            </button>
            {i < cards.length - 1 ? (
              <button type="button" className="btn" onClick={() => setI(i + 1)}>
                다음 메시지
              </button>
            ) : (
              <button type="button" className="btn" onClick={onShowTree}>
                트리 보기
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="relative m-auto text-center font-hand text-[30px] text-muted">이번엔 메시지가 없었어요. 내년엔 꼭!</p>
      )}

      <button type="button" onClick={onShowTree} className="relative mt-3 px-2 py-1 text-sm font-medium text-muted">
        트리 전체 보기 →
      </button>
    </div>
  );
}
