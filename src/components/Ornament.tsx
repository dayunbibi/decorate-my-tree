/* eslint-disable @next/next/no-img-element -- small static svgs, next/image adds nothing here */
import { KIND_NAME, type Kind } from "@/lib/ornaments";

// the designer's ornament svgs live in public/ornaments/<kind>.svg (viewBox 48x48)
export default function Ornament({ kind, size, alt = false, className = "" }: { kind: Kind; size: number | string; alt?: boolean; className?: string }) {
  return (
    <img
      src={`/ornaments/${kind}.svg`}
      alt={alt ? KIND_NAME[kind] : ""}
      width={typeof size === "number" ? size : undefined}
      height={typeof size === "number" ? size : undefined}
      style={typeof size === "string" ? { width: size, height: size } : undefined}
      draggable={false}
      className={`block select-none ${className}`}
    />
  );
}
