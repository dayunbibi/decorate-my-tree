import { KIND_NAME, type Ornament } from "./ornaments";

// "카드 저장": one message card as a 1080x1350 picture (4:5, fits Instagram and Threads)
const W = 1080;
const H = 1350;
const HAND = '"Nanum Pen Script", cursive';
const DISPLAY = '"Gowun Batang", serif';
const SANS = '"IBM Plex Sans KR", sans-serif';

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// break text into lines that fit, keeping Korean words together like word-break: keep-all
function wrap(c: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (c.measureText(test).width <= max || !line) line = test;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

export function hungOn(at?: string) {
  if (!at) return "";
  const d = new Date(at);
  return `${d.getMonth() + 1}월 ${d.getDate()}일에 달아줌`;
}

export async function makeCardImage(o: Ornament, owner: string): Promise<Blob> {
  await Promise.all([
    document.fonts.load(`60px ${HAND}`, o.message ?? ""),
    document.fonts.load(`700 40px ${DISPLAY}`, `from. ${o.author} ${owner}님의 트리 내 트리를 꾸며줘`),
    document.fonts.load(`28px ${SANS}`, `${KIND_NAME[o.kind]} · ${hungOn(o.at)}`),
  ]).catch(() => {});
  const art = await loadImage(`/ornaments/${o.kind}.svg`);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d")!;

  // night background with a warm glow
  c.fillStyle = "#0d1322";
  c.fillRect(0, 0, W, H);
  const glow = c.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.7);
  glow.addColorStop(0, "rgba(255,184,77,0.18)");
  glow.addColorStop(1, "rgba(255,184,77,0)");
  c.fillStyle = glow;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "rgba(255,255,255,0.6)";
  for (let i = 0; i < 70; i++) {
    c.beginPath();
    c.arc((i * 151) % W, (i * 97) % H, 1.5 + (i % 3), 0, Math.PI * 2);
    c.fill();
  }

  // the paper card, a little tilted like on screen
  const cardX = 110;
  const cardW = W - 220;
  c.font = `64px ${HAND}`;
  const lines = wrap(c, o.message ?? "", cardW - 140);
  const lineH = 84;
  const cardH = Math.max(560, 200 + lines.length * lineH + 150);
  const cardY = Math.max(300, (H - cardH) / 2 + 60); // centered, leaving room for the ornament and title

  c.save();
  c.translate(W / 2, cardY + cardH / 2);
  c.rotate((-1.2 * Math.PI) / 180);
  c.translate(-W / 2, -(cardY + cardH / 2));
  c.shadowColor = "rgba(0,0,0,0.45)";
  c.shadowBlur = 60;
  c.shadowOffsetY = 30;
  c.fillStyle = "#fbf4e6";
  c.beginPath();
  c.roundRect(cardX, cardY, cardW, cardH, 44);
  c.fill();
  c.shadowColor = "transparent";

  // ruled lines under the text
  c.strokeStyle = "rgba(122,101,83,0.22)";
  c.lineWidth = 2;
  for (let y = cardY + 200 + lineH - 18; y < cardY + cardH - 40; y += lineH) {
    c.beginPath();
    c.moveTo(cardX + 40, y);
    c.lineTo(cardX + cardW - 40, y);
    c.stroke();
  }

  c.textAlign = "center";
  c.fillStyle = "#7a6553";
  c.font = `500 28px ${SANS}`;
  c.fillText(`${KIND_NAME[o.kind]} · ${hungOn(o.at)}`, W / 2, cardY + 140);

  c.textAlign = "left";
  c.fillStyle = "#3b2a1f";
  c.font = `64px ${HAND}`;
  lines.forEach((line, i) => c.fillText(line, cardX + 70, cardY + 200 + (i + 1) * lineH - 30));

  c.textAlign = "right";
  c.fillStyle = "#b8352b";
  c.font = `700 44px ${DISPLAY}`;
  c.fillText(`from. ${o.author}`, cardX + cardW - 70, cardY + cardH - 60);
  c.restore();

  // ornament hanging on top of the card, with a soft glow
  const og = c.createRadialGradient(W / 2, cardY, 0, W / 2, cardY, 150);
  og.addColorStop(0, "rgba(255,200,110,0.55)");
  og.addColorStop(1, "rgba(255,200,110,0)");
  c.fillStyle = og;
  c.fillRect(W / 2 - 150, cardY - 150, 300, 300);
  c.drawImage(art, W / 2 - 100, cardY - 130, 200, 200);

  // footer
  c.textAlign = "center";
  c.fillStyle = "#fff6e6";
  c.font = `700 44px ${DISPLAY}`;
  c.fillText(`${owner}님의 트리`, W / 2, 150);
  c.fillStyle = "#aeb5c6";
  c.font = `28px ${SANS}`;
  c.fillText("내 트리를 꾸며줘 · decorate-my-tree.vercel.app", W / 2, H - 70);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));
}
