import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TileInstance } from '../game/tiles';
import { isFree } from '../game/logic';
import { BOARD_COLS, BOARD_ROWS, MAX_LAYER } from '../game/layout';
import { MahjongTile } from './MahjongTile';

interface Props {
  tiles: TileInstance[];
  hintIds: [string, string] | null;
  onTap: (id: string) => void;
}

const LAYER_OFFSET_X = 3;
const LAYER_OFFSET_Y = 3;

export function GameBoard({ tiles, hintIds, onTap }: Props) {
  const { width: screenWidth } = useWindowDimensions();

  // Calculate tile size to fit within screen
  const boardDesignWidth = BOARD_COLS * 30 + MAX_LAYER * LAYER_OFFSET_X;
  const scale = Math.min((screenWidth - 8) / boardDesignWidth, 1.4);
  const tileW = Math.floor(30 * scale);
  const tileH = Math.floor(38 * scale);

  const boardWidth = BOARD_COLS * tileW + MAX_LAYER * LAYER_OFFSET_X;
  const boardHeight = BOARD_ROWS * tileH + MAX_LAYER * LAYER_OFFSET_Y;

  const freeSet = useMemo(() => {
    const activeTiles = tiles.filter(t => !t.removed);
    const set = new Set<string>();
    activeTiles.forEach(t => {
      if (isFree(t, activeTiles)) set.add(t.instanceId);
    });
    return set;
  }, [tiles]);

  const hintSet = useMemo(() => new Set(hintIds ?? []), [hintIds]);

  // Sort by layer so higher-layer tiles render on top
  const sorted = useMemo(() =>
    [...tiles].filter(t => !t.removed).sort((a, b) => a.layer - b.layer),
    [tiles]
  );

  return (
    <View style={{ width: boardWidth, height: boardHeight }}>
      {sorted.map(tile => {
        const x = (tile.col / 2) * tileW + tile.layer * LAYER_OFFSET_X;
        const y = (tile.row / 2) * tileH - tile.layer * LAYER_OFFSET_Y + MAX_LAYER * LAYER_OFFSET_Y;
        return (
          <MahjongTile
            key={tile.instanceId}
            tile={tile}
            tileW={tileW}
            tileH={tileH}
            x={x}
            y={y}
            isFree={freeSet.has(tile.instanceId)}
            isHinted={hintSet.has(tile.instanceId)}
            onPress={onTap}
          />
        );
      })}
    </View>
  );
}
