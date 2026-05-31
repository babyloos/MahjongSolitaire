export type TileCategory = 'man' | 'pin' | 'sou' | 'wind' | 'dragon' | 'flower' | 'season';

export interface TileDef {
  typeId: string;
  category: TileCategory;
  label: string;
  copies: number;
}

export interface TileInstance {
  instanceId: string;
  typeId: string;
  category: TileCategory;
  label: string;
  layer: number;
  row: number;
  col: number;
  removed: boolean;
  selected: boolean;
}

// 34 regular types × 4 copies = 136 + 4 flowers + 4 seasons = 144
export const TILE_DEFS: TileDef[] = [
  // 万子 (Characters)
  { typeId: 'man1', category: 'man', label: '一', copies: 4 },
  { typeId: 'man2', category: 'man', label: '二', copies: 4 },
  { typeId: 'man3', category: 'man', label: '三', copies: 4 },
  { typeId: 'man4', category: 'man', label: '四', copies: 4 },
  { typeId: 'man5', category: 'man', label: '五', copies: 4 },
  { typeId: 'man6', category: 'man', label: '六', copies: 4 },
  { typeId: 'man7', category: 'man', label: '七', copies: 4 },
  { typeId: 'man8', category: 'man', label: '八', copies: 4 },
  { typeId: 'man9', category: 'man', label: '九', copies: 4 },
  // 筒子 (Circles)
  { typeId: 'pin1', category: 'pin', label: '①', copies: 4 },
  { typeId: 'pin2', category: 'pin', label: '②', copies: 4 },
  { typeId: 'pin3', category: 'pin', label: '③', copies: 4 },
  { typeId: 'pin4', category: 'pin', label: '④', copies: 4 },
  { typeId: 'pin5', category: 'pin', label: '⑤', copies: 4 },
  { typeId: 'pin6', category: 'pin', label: '⑥', copies: 4 },
  { typeId: 'pin7', category: 'pin', label: '⑦', copies: 4 },
  { typeId: 'pin8', category: 'pin', label: '⑧', copies: 4 },
  { typeId: 'pin9', category: 'pin', label: '⑨', copies: 4 },
  // 索子 (Bamboo)
  { typeId: 'sou1', category: 'sou', label: '1s', copies: 4 },
  { typeId: 'sou2', category: 'sou', label: '2s', copies: 4 },
  { typeId: 'sou3', category: 'sou', label: '3s', copies: 4 },
  { typeId: 'sou4', category: 'sou', label: '4s', copies: 4 },
  { typeId: 'sou5', category: 'sou', label: '5s', copies: 4 },
  { typeId: 'sou6', category: 'sou', label: '6s', copies: 4 },
  { typeId: 'sou7', category: 'sou', label: '7s', copies: 4 },
  { typeId: 'sou8', category: 'sou', label: '8s', copies: 4 },
  { typeId: 'sou9', category: 'sou', label: '9s', copies: 4 },
  // 风牌 (Winds)
  { typeId: 'wind_e', category: 'wind', label: '東', copies: 4 },
  { typeId: 'wind_s', category: 'wind', label: '南', copies: 4 },
  { typeId: 'wind_w', category: 'wind', label: '西', copies: 4 },
  { typeId: 'wind_n', category: 'wind', label: '北', copies: 4 },
  // 三元牌 (Dragons)
  { typeId: 'dragon_c', category: 'dragon', label: '中', copies: 4 },
  { typeId: 'dragon_h', category: 'dragon', label: '発', copies: 4 },
  { typeId: 'dragon_b', category: 'dragon', label: '白', copies: 4 },
  // 花牌 (Flowers) — any flower matches any other flower
  { typeId: 'flower1', category: 'flower', label: '梅', copies: 1 },
  { typeId: 'flower2', category: 'flower', label: '蘭', copies: 1 },
  { typeId: 'flower3', category: 'flower', label: '菊', copies: 1 },
  { typeId: 'flower4', category: 'flower', label: '竹', copies: 1 },
  // 季牌 (Seasons) — any season matches any other season
  { typeId: 'season1', category: 'season', label: '春', copies: 1 },
  { typeId: 'season2', category: 'season', label: '夏', copies: 1 },
  { typeId: 'season3', category: 'season', label: '秋', copies: 1 },
  { typeId: 'season4', category: 'season', label: '冬', copies: 1 },
];

export function tilesMatch(a: TileInstance, b: TileInstance): boolean {
  if (a.instanceId === b.instanceId) return false;
  if (a.category === 'flower' && b.category === 'flower') return true;
  if (a.category === 'season' && b.category === 'season') return true;
  return a.typeId === b.typeId;
}
