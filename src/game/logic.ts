import { TileInstance, TileDef, TILE_DEFS, tilesMatch } from './tiles';
import { LAYOUT } from './layout';

export function isFree(tile: TileInstance, tiles: TileInstance[]): boolean {
  const active = tiles.filter(t => !t.removed && t.instanceId !== tile.instanceId);

  // Covered from above: same (row, col) at layer+1
  const coveredAbove = active.some(
    t => t.layer === tile.layer + 1 && t.row === tile.row && t.col === tile.col
  );
  if (coveredAbove) return false;

  // Left blocked: same layer and row, col = col - 2
  const blockedLeft = active.some(
    t => t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 2
  );

  // Right blocked: same layer and row, col = col + 2
  const blockedRight = active.some(
    t => t.layer === tile.layer && t.row === tile.row && t.col === tile.col + 2
  );

  return !blockedLeft || !blockedRight;
}

export function getFreeTiles(tiles: TileInstance[]): TileInstance[] {
  return tiles.filter(t => !t.removed && isFree(t, tiles));
}

export function hasValidMoves(tiles: TileInstance[]): boolean {
  const free = getFreeTiles(tiles);
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (tilesMatch(free[i], free[j])) return true;
    }
  }
  return false;
}

export function findHint(tiles: TileInstance[]): [TileInstance, TileInstance] | null {
  const free = getFreeTiles(tiles);
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (tilesMatch(free[i], free[j])) return [free[i], free[j]];
    }
  }
  return null;
}

export function buildTiles(): TileInstance[] {
  // Build pool of 144 type IDs
  const pool: { typeId: string; category: TileDef['category']; label: string }[] = [];
  for (const def of TILE_DEFS) {
    for (let i = 0; i < def.copies; i++) {
      pool.push({ typeId: def.typeId, category: def.category, label: def.label });
    }
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return LAYOUT.map(([layer, row, col], idx) => ({
    instanceId: `tile_${idx}`,
    typeId: pool[idx].typeId,
    category: pool[idx].category,
    label: pool[idx].label,
    layer,
    row,
    col,
    removed: false,
    selected: false,
  }));
}
