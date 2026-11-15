// buttons pinned to the bottom of the screen
export default function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent,rgb(15_20_34/0.95)_40px)] pt-10">
      <div className="pointer-events-auto mx-auto flex max-w-[440px] gap-2.5 px-4 pb-[calc(20px+env(safe-area-inset-bottom))]">{children}</div>
    </div>
  );
}
