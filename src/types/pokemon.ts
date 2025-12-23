// ポケモンのタイプ（18種類）
export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

// タイプ情報
export interface TypeInfo {
  id: PokemonType
  name: string        // 日本語名
  color: string       // 背景色（Tailwind）
  textColor: string   // テキスト色（Tailwind）
  iconPath: string    // アイコン画像パス
}

// ダメージ倍率の結果
export interface DamageResult {
  type: PokemonType
  multiplier: number
}

// 倍率カテゴリ
export type MultiplierCategory =
  | 0.244140625  // 三重耐性 (0.625^3)
  | 0.390625     // 二重耐性 (0.625^2)
  | 0.625        // 耐性
  | 1            // 等倍
  | 1.6          // 弱点
  | 2.56         // 二重弱点 (1.6^2)

// 倍率カテゴリ情報
export interface MultiplierInfo {
  value: number
  label: string
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}
