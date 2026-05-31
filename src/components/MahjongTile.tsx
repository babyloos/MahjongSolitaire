import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { TileInstance } from '../game/tiles';
import {
  TILE_BG, TILE_BORDER, TILE_SELECTED_BORDER, TILE_BLOCKED_BG,
  MAN_COLOR, PIN_COLOR, SOU_COLOR, HONOR_COLOR, FLOWER_COLOR, SEASON_COLOR,
} from '../constants/theme';

interface Props {
  tile: TileInstance;
  tileW: number;
  tileH: number;
  x: number;
  y: number;
  isFree: boolean;
  isHinted: boolean;
  onPress: (id: string) => void;
}

function getTextColor(category: TileInstance['category']): string {
  switch (category) {
    case 'man': return MAN_COLOR;
    case 'pin': return PIN_COLOR;
    case 'sou': return SOU_COLOR;
    case 'flower': return FLOWER_COLOR;
    case 'season': return SEASON_COLOR;
    default: return HONOR_COLOR;
  }
}

function getSuitLabel(category: TileInstance['category']): string {
  switch (category) {
    case 'man': return '万';
    case 'pin': return '';
    case 'sou': return '';
    case 'wind': return '風';
    case 'dragon': return '牌';
    case 'flower': return '花';
    case 'season': return '季';
  }
}

export const MahjongTile = React.memo(function MahjongTile({ tile, tileW, tileH, x, y, isFree, isHinted, onPress }: Props) {
  const fontSize = Math.floor(tileW * 0.45);
  const suitFontSize = Math.floor(tileW * 0.22);
  const bg = isFree ? TILE_BG : TILE_BLOCKED_BG;
  const borderColor = tile.selected ? TILE_SELECTED_BORDER : isHinted ? '#00ff88' : TILE_BORDER;
  const borderWidth = (tile.selected || isHinted) ? 2 : 1;
  const textColor = getTextColor(tile.category);

  return (
    <TouchableOpacity
      activeOpacity={isFree ? 0.7 : 1}
      onPress={() => isFree && onPress(tile.instanceId)}
      style={[
        styles.tile,
        {
          position: 'absolute',
          left: x,
          top: y,
          width: tileW,
          height: tileH,
          backgroundColor: bg,
          borderColor,
          borderWidth,
          borderRadius: 3,
          zIndex: tile.layer * 10,
          elevation: tile.layer * 2 + 1,
        },
      ]}
    >
      <Text style={[styles.label, { fontSize, color: textColor }]}>{tile.label}</Text>
      <Text style={[styles.suit, { fontSize: suitFontSize, color: textColor }]}>
        {getSuitLabel(tile.category)}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  label: {
    fontWeight: 'bold',
    lineHeight: undefined,
  },
  suit: {
    lineHeight: undefined,
    marginTop: -2,
  },
});
