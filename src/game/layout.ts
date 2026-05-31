// Classic pyramid layout: [layer, row, col] using 2-unit step
// Tile at (z, r, c) occupies space at (r, r+1) x (c, c+1) conceptually
// Coverage: tile at (z+1, r2, c2) covers (z, r, c) if |r2-r| < 2 AND |c2-c| < 2
// With 2-unit step, this means exact same position only
// Adjacent (left/right): col ± 2 at same layer and row

function makeLayer(
  z: number,
  rowStart: number,
  rowEnd: number,
  colStart: number,
  colEnd: number,
  rowStep = 2,
  colStep = 2
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let r = rowStart; r <= rowEnd; r += rowStep) {
    for (let c = colStart; c <= colEnd; c += colStep) {
      positions.push([z, r, c]);
    }
  }
  return positions;
}

// Layer 0: 8 rows × 10 cols = 80 tiles
// rows 0,2,4,6,8,10,12,14  cols 0,2,4,6,8,10,12,14,16,18
const L0 = makeLayer(0, 0, 14, 0, 18);

// Layer 1: 6 rows × 6 cols = 36 tiles
// rows 2,4,6,8,10,12  cols 4,6,8,10,12,14
const L1 = makeLayer(1, 2, 12, 4, 14);

// Layer 2: 4 rows × 4 cols = 16 tiles
// rows 4,6,8,10  cols 6,8,10,12
const L2 = makeLayer(2, 4, 10, 6, 12);

// Layer 3: 2 rows × 4 cols = 8 tiles
// rows 6,8  cols 6,8,10,12
const L3 = makeLayer(3, 6, 8, 6, 12);

// Layer 4: 2 rows × 2 cols = 4 tiles
// rows 6,8  cols 8,10
const L4 = makeLayer(4, 6, 8, 8, 10);

// Total: 80 + 36 + 16 + 8 + 4 = 144
export const LAYOUT: [number, number, number][] = [...L0, ...L1, ...L2, ...L3, ...L4];

// Board extents for rendering
export const BOARD_ROWS = 8;  // 0..14 step 2 = 8 positions
export const BOARD_COLS = 10; // 0..18 step 2 = 10 positions
export const MAX_LAYER = 4;
