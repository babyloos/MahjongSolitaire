import { create } from 'zustand';
import { TileInstance, tilesMatch } from '../game/tiles';
import { buildTiles, isFree, findHint, hasValidMoves } from '../game/logic';

interface GameState {
  tiles: TileInstance[];
  selected: string | null;
  pairsRemoved: number;
  isOver: boolean;
  isWon: boolean;
  hintIds: [string, string] | null;
  elapsedSec: number;
  bestSec: number;

  start: () => void;
  tap: (instanceId: string) => void;
  shuffle: () => void;
  tick: () => void;
  clearHint: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  tiles: [],
  selected: null,
  pairsRemoved: 0,
  isOver: false,
  isWon: false,
  hintIds: null,
  elapsedSec: 0,
  bestSec: 0,

  start: () => {
    set({
      tiles: buildTiles(),
      selected: null,
      pairsRemoved: 0,
      isOver: false,
      isWon: false,
      hintIds: null,
      elapsedSec: 0,
    });
  },

  tap: (instanceId) => {
    const { tiles, selected } = get();
    const tile = tiles.find(t => t.instanceId === instanceId);
    if (!tile || tile.removed) return;
    if (!isFree(tile, tiles)) return;

    // Clear hint on any tap
    set({ hintIds: null });

    if (!selected) {
      // Select this tile
      set({ tiles: tiles.map(t => ({ ...t, selected: t.instanceId === instanceId })), selected: instanceId });
      return;
    }

    if (selected === instanceId) {
      // Deselect
      set({ tiles: tiles.map(t => ({ ...t, selected: false })), selected: null });
      return;
    }

    const selTile = tiles.find(t => t.instanceId === selected)!;

    if (tilesMatch(selTile, tile)) {
      // Remove pair
      const newTiles = tiles.map(t =>
        t.instanceId === selected || t.instanceId === instanceId
          ? { ...t, removed: true, selected: false }
          : { ...t, selected: false }
      );
      const pairs = get().pairsRemoved + 1;
      const won = pairs === 72;
      const over = !won && !hasValidMoves(newTiles);
      const elapsed = get().elapsedSec;
      const best = get().bestSec;
      set({
        tiles: newTiles,
        selected: null,
        pairsRemoved: pairs,
        isWon: won,
        isOver: over,
        bestSec: won ? (best === 0 || elapsed < best ? elapsed : best) : best,
      });
    } else {
      // Switch selection to the new tile
      set({ tiles: tiles.map(t => ({ ...t, selected: t.instanceId === instanceId })), selected: instanceId });
    }
  },

  shuffle: () => {
    // Reshuffle remaining tile types onto remaining positions, preserving layout
    const { tiles } = get();
    const active = tiles.filter(t => !t.removed);
    const pool = active.map(t => ({ typeId: t.typeId, category: t.category, label: t.label }));
    // Fisher-Yates
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    let pi = 0;
    const newTiles = tiles.map(t => {
      if (t.removed) return t;
      const p = pool[pi++];
      return { ...t, typeId: p.typeId, category: p.category, label: p.label, selected: false };
    });
    set({ tiles: newTiles, selected: null, hintIds: null, isOver: false });
  },

  tick: () => {
    const { isOver, isWon } = get();
    if (!isOver && !isWon) set(s => ({ elapsedSec: s.elapsedSec + 1 }));
  },

  clearHint: () => set({ hintIds: null }),
}));

// Selector for hint action (called externally)
export function showHint() {
  const { tiles, hintIds } = useGameStore.getState();
  if (hintIds) {
    useGameStore.setState({ hintIds: null });
    return;
  }
  const pair = findHint(tiles);
  if (pair) {
    useGameStore.setState({ hintIds: [pair[0].instanceId, pair[1].instanceId] });
  }
}
