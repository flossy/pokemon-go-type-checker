import type { PokemonType, TypeInfo, MultiplierInfo } from '../types/pokemon'

// タイプごとの背景カラー
export const TYPE_TINT_COLORS: Record<PokemonType, string> = {
  normal:   '#a8a878',
  fire:     '#f08030',
  water:    '#6890f0',
  electric: '#f8d030',
  grass:    '#78c850',
  ice:      '#98d8d8',
  fighting: '#c03028',
  poison:   '#a040a0',
  ground:   '#e0c068',
  flying:   '#a890f0',
  psychic:  '#f85888',
  bug:      '#a8b820',
  rock:     '#b8a038',
  ghost:    '#705898',
  dragon:   '#7038f8',
  dark:     '#705848',
  steel:    '#b8b8d0',
  fairy:    '#ee99ac',
}

// ポケモンGOの倍率
export const SUPER_EFFECTIVE = 1.6        // こうかばつぐん
export const NOT_EFFECTIVE = 0.625        // いまひとつ
export const IMMUNE = 0.390625            // 効果なし（本編の無効 = 0.625^2）
export const NEUTRAL = 1                   // 等倍

// 18タイプの情報
export const TYPE_INFO: Record<PokemonType, TypeInfo> = {
  normal:   { id: 'normal',   name: 'ノーマル',   color: 'bg-gray-400',    textColor: 'text-gray-800', iconPath: '/icons/01.svg' },
  fire:     { id: 'fire',     name: 'ほのお',     color: 'bg-orange-500',  textColor: 'text-white',    iconPath: '/icons/02.svg' },
  water:    { id: 'water',    name: 'みず',       color: 'bg-blue-500',    textColor: 'text-white',    iconPath: '/icons/03.svg' },
  electric: { id: 'electric', name: 'でんき',     color: 'bg-yellow-400',  textColor: 'text-gray-800', iconPath: '/icons/04.svg' },
  grass:    { id: 'grass',    name: 'くさ',       color: 'bg-green-500',   textColor: 'text-white',    iconPath: '/icons/05.svg' },
  ice:      { id: 'ice',      name: 'こおり',     color: 'bg-cyan-300',    textColor: 'text-gray-800', iconPath: '/icons/06.svg' },
  fighting: { id: 'fighting', name: 'かくとう',   color: 'bg-red-700',     textColor: 'text-white',    iconPath: '/icons/07.svg' },
  poison:   { id: 'poison',   name: 'どく',       color: 'bg-purple-500',  textColor: 'text-white',    iconPath: '/icons/08.svg' },
  ground:   { id: 'ground',   name: 'じめん',     color: 'bg-amber-600',   textColor: 'text-white',    iconPath: '/icons/09.svg' },
  flying:   { id: 'flying',   name: 'ひこう',     color: 'bg-indigo-300',  textColor: 'text-gray-800', iconPath: '/icons/10.svg' },
  psychic:  { id: 'psychic',  name: 'エスパー',   color: 'bg-pink-500',    textColor: 'text-white',    iconPath: '/icons/11.svg' },
  bug:      { id: 'bug',      name: 'むし',       color: 'bg-lime-500',    textColor: 'text-white',    iconPath: '/icons/12.svg' },
  rock:     { id: 'rock',     name: 'いわ',       color: 'bg-stone-500',   textColor: 'text-white',    iconPath: '/icons/13.svg' },
  ghost:    { id: 'ghost',    name: 'ゴースト',   color: 'bg-violet-700',  textColor: 'text-white',    iconPath: '/icons/14.svg' },
  dragon:   { id: 'dragon',   name: 'ドラゴン',   color: 'bg-indigo-700',  textColor: 'text-white',    iconPath: '/icons/15.svg' },
  dark:     { id: 'dark',     name: 'あく',       color: 'bg-gray-800',    textColor: 'text-white',    iconPath: '/icons/16.svg' },
  steel:    { id: 'steel',    name: 'はがね',     color: 'bg-slate-400',   textColor: 'text-gray-800', iconPath: '/icons/17.svg' },
  fairy:    { id: 'fairy',    name: 'フェアリー', color: 'bg-pink-300',    textColor: 'text-gray-800', iconPath: '/icons/18.svg' },
}

// タイプの順番（表示用）
export const TYPE_ORDER: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

// 倍率カテゴリ情報
export const MULTIPLIER_INFO: MultiplierInfo[] = [
  { value: 0.244140625, label: '×0.24', size: 'xs' },
  { value: 0.390625,    label: '×0.39', size: 'sm' },
  { value: 0.625,       label: '×0.625', size: 'md' },
  { value: 1,           label: '×1.0', size: 'lg' },
  { value: 1.6,         label: '×1.6', size: 'xl' },
  { value: 2.56,        label: '×2.56', size: '2xl' },
]

// タイプ相性チャート（攻撃タイプ → 防御タイプ）
// 行: 攻撃タイプ、列: 防御タイプ
// 値: 1 = 等倍, 1.6 = 効果抜群, 0.625 = いまひとつ, 0.390625 = 効果なし
type TypeChart = Record<PokemonType, Record<PokemonType, number>>

export const TYPE_CHART: TypeChart = {
  normal: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: NOT_EFFECTIVE, ghost: IMMUNE, dragon: 1, dark: 1, steel: NOT_EFFECTIVE, fairy: 1,
  },
  fire: {
    normal: 1, fire: NOT_EFFECTIVE, water: NOT_EFFECTIVE, electric: 1, grass: SUPER_EFFECTIVE, ice: SUPER_EFFECTIVE,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: SUPER_EFFECTIVE,
    rock: NOT_EFFECTIVE, ghost: 1, dragon: NOT_EFFECTIVE, dark: 1, steel: SUPER_EFFECTIVE, fairy: 1,
  },
  water: {
    normal: 1, fire: SUPER_EFFECTIVE, water: NOT_EFFECTIVE, electric: 1, grass: NOT_EFFECTIVE, ice: 1,
    fighting: 1, poison: 1, ground: SUPER_EFFECTIVE, flying: 1, psychic: 1, bug: 1,
    rock: SUPER_EFFECTIVE, ghost: 1, dragon: NOT_EFFECTIVE, dark: 1, steel: 1, fairy: 1,
  },
  electric: {
    normal: 1, fire: 1, water: SUPER_EFFECTIVE, electric: NOT_EFFECTIVE, grass: NOT_EFFECTIVE, ice: 1,
    fighting: 1, poison: 1, ground: IMMUNE, flying: SUPER_EFFECTIVE, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: NOT_EFFECTIVE, dark: 1, steel: 1, fairy: 1,
  },
  grass: {
    normal: 1, fire: NOT_EFFECTIVE, water: SUPER_EFFECTIVE, electric: 1, grass: NOT_EFFECTIVE, ice: 1,
    fighting: 1, poison: NOT_EFFECTIVE, ground: SUPER_EFFECTIVE, flying: NOT_EFFECTIVE, psychic: 1, bug: NOT_EFFECTIVE,
    rock: SUPER_EFFECTIVE, ghost: 1, dragon: NOT_EFFECTIVE, dark: 1, steel: NOT_EFFECTIVE, fairy: 1,
  },
  ice: {
    normal: 1, fire: NOT_EFFECTIVE, water: NOT_EFFECTIVE, electric: 1, grass: SUPER_EFFECTIVE, ice: NOT_EFFECTIVE,
    fighting: 1, poison: 1, ground: SUPER_EFFECTIVE, flying: SUPER_EFFECTIVE, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: SUPER_EFFECTIVE, dark: 1, steel: NOT_EFFECTIVE, fairy: 1,
  },
  fighting: {
    normal: SUPER_EFFECTIVE, fire: 1, water: 1, electric: 1, grass: 1, ice: SUPER_EFFECTIVE,
    fighting: 1, poison: NOT_EFFECTIVE, ground: 1, flying: NOT_EFFECTIVE, psychic: NOT_EFFECTIVE, bug: NOT_EFFECTIVE,
    rock: SUPER_EFFECTIVE, ghost: IMMUNE, dragon: 1, dark: SUPER_EFFECTIVE, steel: SUPER_EFFECTIVE, fairy: NOT_EFFECTIVE,
  },
  poison: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: SUPER_EFFECTIVE, ice: 1,
    fighting: 1, poison: NOT_EFFECTIVE, ground: NOT_EFFECTIVE, flying: 1, psychic: 1, bug: 1,
    rock: NOT_EFFECTIVE, ghost: NOT_EFFECTIVE, dragon: 1, dark: 1, steel: IMMUNE, fairy: SUPER_EFFECTIVE,
  },
  ground: {
    normal: 1, fire: SUPER_EFFECTIVE, water: 1, electric: SUPER_EFFECTIVE, grass: NOT_EFFECTIVE, ice: 1,
    fighting: 1, poison: SUPER_EFFECTIVE, ground: 1, flying: IMMUNE, psychic: 1, bug: NOT_EFFECTIVE,
    rock: SUPER_EFFECTIVE, ghost: 1, dragon: 1, dark: 1, steel: SUPER_EFFECTIVE, fairy: 1,
  },
  flying: {
    normal: 1, fire: 1, water: 1, electric: NOT_EFFECTIVE, grass: SUPER_EFFECTIVE, ice: 1,
    fighting: SUPER_EFFECTIVE, poison: 1, ground: 1, flying: 1, psychic: 1, bug: SUPER_EFFECTIVE,
    rock: NOT_EFFECTIVE, ghost: 1, dragon: 1, dark: 1, steel: NOT_EFFECTIVE, fairy: 1,
  },
  psychic: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: SUPER_EFFECTIVE, poison: SUPER_EFFECTIVE, ground: 1, flying: 1, psychic: NOT_EFFECTIVE, bug: 1,
    rock: 1, ghost: 1, dragon: 1, dark: IMMUNE, steel: NOT_EFFECTIVE, fairy: 1,
  },
  bug: {
    normal: 1, fire: NOT_EFFECTIVE, water: 1, electric: 1, grass: SUPER_EFFECTIVE, ice: 1,
    fighting: NOT_EFFECTIVE, poison: NOT_EFFECTIVE, ground: 1, flying: NOT_EFFECTIVE, psychic: SUPER_EFFECTIVE, bug: 1,
    rock: 1, ghost: NOT_EFFECTIVE, dragon: 1, dark: SUPER_EFFECTIVE, steel: NOT_EFFECTIVE, fairy: NOT_EFFECTIVE,
  },
  rock: {
    normal: 1, fire: SUPER_EFFECTIVE, water: 1, electric: 1, grass: 1, ice: SUPER_EFFECTIVE,
    fighting: NOT_EFFECTIVE, poison: 1, ground: NOT_EFFECTIVE, flying: SUPER_EFFECTIVE, psychic: 1, bug: SUPER_EFFECTIVE,
    rock: 1, ghost: 1, dragon: 1, dark: 1, steel: NOT_EFFECTIVE, fairy: 1,
  },
  ghost: {
    normal: IMMUNE, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: SUPER_EFFECTIVE, bug: 1,
    rock: 1, ghost: SUPER_EFFECTIVE, dragon: 1, dark: NOT_EFFECTIVE, steel: 1, fairy: 1,
  },
  dragon: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: SUPER_EFFECTIVE, dark: 1, steel: NOT_EFFECTIVE, fairy: IMMUNE,
  },
  dark: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: NOT_EFFECTIVE, poison: 1, ground: 1, flying: 1, psychic: SUPER_EFFECTIVE, bug: 1,
    rock: 1, ghost: SUPER_EFFECTIVE, dragon: 1, dark: NOT_EFFECTIVE, steel: 1, fairy: NOT_EFFECTIVE,
  },
  steel: {
    normal: 1, fire: NOT_EFFECTIVE, water: NOT_EFFECTIVE, electric: NOT_EFFECTIVE, grass: 1, ice: SUPER_EFFECTIVE,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: SUPER_EFFECTIVE, ghost: 1, dragon: 1, dark: 1, steel: NOT_EFFECTIVE, fairy: SUPER_EFFECTIVE,
  },
  fairy: {
    normal: 1, fire: NOT_EFFECTIVE, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: SUPER_EFFECTIVE, poison: NOT_EFFECTIVE, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: SUPER_EFFECTIVE, dark: SUPER_EFFECTIVE, steel: NOT_EFFECTIVE, fairy: 1,
  },
}

// 防御時の倍率を取得（攻撃タイプから防御タイプへの倍率）
export function getDefenseMultiplier(attackType: PokemonType, defenseType: PokemonType): number {
  return TYPE_CHART[attackType][defenseType]
}

// 複合タイプの防御倍率を計算
export function getComboDefenseMultiplier(attackType: PokemonType, defenseTypes: PokemonType[]): number {
  if (defenseTypes.length === 0) return 1

  return defenseTypes.reduce((multiplier, defType) => {
    return multiplier * getDefenseMultiplier(attackType, defType)
  }, 1)
}
