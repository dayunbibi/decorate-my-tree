"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readMine, saveMine, type Mine } from "@/lib/myTrees";
import BottomBar from "./BottomBar";

export default function CreateTree() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mine, setMine] = useState<Mine>({});

  useEffect(() => setMine(readMine()), []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/trees", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "트리를 못 만들었어요.");
      saveMine(data.id, data.key, name.trim());
      router.push(`/t/${data.id}?new=1`);
    } catch (err) {
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "인터넷 연결을 확인해 주세요.");
      setBusy(false);
    }
  }

  const myIds = Object.keys(mine);

  return (
    <div className="flex flex-col gap-3">
      <form id="create" onSubmit={create} className="card flex flex-col gap-3 p-5">
        <label htmlFor="owner-name" className="font-display text-[19px] leading-none font-bold">
          트리 주인 이름
        </label>
        <input
          id="owner-name"
          className="field h-12"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          required
          placeholder="친구들이 아는 이름이나 닉네임"
          autoComplete="nickname"
        />
        {error && (
          <p role="alert" className="m-0 text-sm text-berry-300">
            {error}
          </p>
        )}
        <p className="m-0 text-xs leading-relaxed text-dim">트리는 로그인 없이 만들어져요. 이 기기에 열쇠가 저장되고, 다른 기기용 열쇠 링크도 따로 드려요.</p>
      </form>

      {myIds.length > 0 && (
        <div className="card flex flex-col gap-1 p-4">
          <p className="m-0 text-sm font-semibold text-muted">이 기기에서 만든 트리</p>
          {myIds.map((id) => (
            <Link key={id} href={`/t/${id}`} className="flex h-11 items-center justify-between rounded-xl px-2 text-[15px] font-medium hover:bg-night-700">
              <span>{mine[id].name}님의 트리</span>
              <span className="text-bulb-300">보러 가기 →</span>
            </Link>
          ))}
        </div>
      )}

      {/* the submit button lives in the bottom bar, so it points at the form by id */}
      <BottomBar>
        <button type="submit" form="create" className="btn" disabled={busy || !name.trim()}>
          {busy ? "트리 심는 중…" : "🎄 내 트리 만들기"}
        </button>
      </BottomBar>
    </div>
  );
}
