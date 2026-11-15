"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readMine, saveMine, type Mine } from "@/lib/myTrees";
import { TreeIcon } from "./Icons";

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
    <form onSubmit={create} className="flex w-full flex-col gap-2.5">
      <label htmlFor="owner-name" className="text-[13px] font-semibold text-muted">
        트리 주인 이름
      </label>
      <div className="flex h-[52px] items-center rounded-[14px] border border-line bg-night-700 px-4 focus-within:border-gold">
        <input
          id="owner-name"
          className="min-w-0 flex-1 border-0 bg-transparent text-base text-cream outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          required
          placeholder="예) 다윤"
          autoComplete="nickname"
        />
        <span className="flex-none text-[15px] text-muted">님의 트리</span>
      </div>
      {error && (
        <p role="alert" className="m-0 text-sm text-[#ff8a7a]">
          {error}
        </p>
      )}
      <button type="submit" className="btn mt-1" disabled={busy}>
        <TreeIcon />
        {busy ? "트리 심는 중…" : "내 트리 만들기"}
      </button>
      {myIds.length > 0 && (
        <p className="m-0 flex flex-wrap justify-center gap-x-3 text-sm">
          {myIds.map((id) => (
            <Link key={id} href={`/t/${id}`} className="py-1 font-medium text-gold">
              {mine[id].name}님의 트리 보러 가기 →
            </Link>
          ))}
        </p>
      )}
    </form>
  );
}
