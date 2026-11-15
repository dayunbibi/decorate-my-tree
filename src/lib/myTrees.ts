// Trees I made on this device: { [treeId]: { key, name } }.
// The key is what proves I'm the owner, so it only lives here and in my "열쇠 링크".
export type Mine = Record<string, { key: string; name: string }>;
const STORE = "my-trees";

export function readMine(): Mine {
  try {
    return JSON.parse(localStorage.getItem(STORE) || "{}") as Mine;
  } catch {
    return {};
  }
}

export function saveMine(id: string, key: string, name: string) {
  try {
    localStorage.setItem(STORE, JSON.stringify({ ...readMine(), [id]: { key, name } }));
  } catch {
    // private mode: the 열쇠 링크 is the backup
  }
}

// days left until the messages open (counts the opening day as D-day)
export function daysUntil(when: Date, now = new Date()) {
  return Math.max(0, Math.ceil((when.getTime() - now.getTime()) / 86_400_000));
}
