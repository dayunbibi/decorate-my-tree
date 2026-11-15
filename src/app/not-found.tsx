import Link from "next/link";
import Snow from "@/components/Snow";

export default function NotFound() {
  return (
    <>
      <Snow />
      <main className="relative z-1 mx-auto flex min-h-dvh max-w-[440px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="m-0 font-brush text-[30px] leading-none text-berry-300">어라?</p>
        <h1 className="m-0 font-display text-[28px] font-bold text-bulb-100">트리를 찾을 수 없어요</h1>
        <p className="m-0 text-[15px] text-muted">링크가 잘렸거나 잘못 복사됐을 수 있어요.</p>
        <Link href="/" className="btn mt-2 max-w-[280px] no-underline">
          🎄 내 트리 만들기
        </Link>
      </main>
    </>
  );
}
