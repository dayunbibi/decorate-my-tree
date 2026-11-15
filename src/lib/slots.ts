// From the design handoff (tree/slots.json). Spots are in the tree's 360x440 viewBox,
// top tier to bottom tier: 2 + 3 + 4 + 5 + 6 = 20.
export const TREE_W = 360;
export const TREE_H = 440;
export const SPOTS: [number, number][] = [
  [160, 106], [202, 112],
  [124, 172], [178, 160], [232, 176],
  [102, 236], [150, 226], [206, 238], [256, 228],
  [84, 300], [132, 290], [182, 304], [232, 292], [278, 302],
  [62, 362], [110, 372], [158, 360], [206, 374], [254, 362], [300, 370],
];
export const PER_PAGE = SPOTS.length;

// The DB hands out slots 0, 1, 2… in order. This order spreads them around the tree
// instead of filling the top first.
const FILL_ORDER = [6, 10, 1, 17, 13, 2, 15, 8, 4, 12, 19, 5, 14, 0, 11, 9, 7, 16, 18, 3];

export const spotOf = (slot: number) => FILL_ORDER[slot % PER_PAGE];
export const pageOf = (slot: number) => Math.floor(slot / PER_PAGE);
