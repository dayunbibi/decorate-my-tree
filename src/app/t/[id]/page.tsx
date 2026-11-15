import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { dbEnabled, getTree } from "@/lib/server/db";
import Snow from "@/components/Snow";
import TreeClient from "@/components/TreeClient";

type Props = { params: Promise<{ id: string }> };

// metadata and the page both need the tree; cache() makes it one DB call
const load = cache(async (id: string) => {
  if (!/^[A-Za-z0-9]{8}$/.test(id) || !dbEnabled()) return null;
  try {
    return await getTree(id, null);
  } catch (err) {
    console.error("get_tree failed", err);
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tree = await load((await params).id);
  if (!tree) return { title: "내 트리를 꾸며줘" };
  const title = `${tree.name}님의 트리를 꾸며줘 🎄`;
  const description = `오너먼트 ${tree.ornaments.length}개 달렸어요. 오너먼트 하나 달아주세요! 메시지는 크리스마스에 열려요.`;
  // the picture comes from ./opengraph-image.tsx (Next adds it on its own)
  return { title, description, openGraph: { title, description, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function TreePage({ params }: Props) {
  const { id } = await params;
  const tree = await load(id);
  if (!tree) notFound();

  return (
    <>
      <Snow />
      <main className="relative z-1 mx-auto flex min-h-dvh max-w-[440px] flex-col px-[15px] pt-6 pb-[calc(22px+env(safe-area-inset-bottom))]">
        <TreeClient id={id} initial={tree} />
      </main>
    </>
  );
}
