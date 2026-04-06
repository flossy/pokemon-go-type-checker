import { describe, it, expect } from 'vitest'
import {
  TYPE_CHART,
  TYPE_INFO,
  TYPE_ORDER,
  TYPE_TINT_COLORS,
  SUPER_EFFECTIVE,
  NOT_EFFECTIVE,
  IMMUNE,
  NEUTRAL,
  getDefenseMultiplier,
  getComboDefenseMultiplier,
} from './typeChart'
import type { PokemonType } from '../types/pokemon'

describe('定数', () => {
  it('ポケモンGOの倍率が正しい', () => {
    expect(SUPER_EFFECTIVE).toBe(1.6)
    expect(NOT_EFFECTIVE).toBe(0.625)
    expect(IMMUNE).toBe(0.390625) // 0.625^2
    expect(NEUTRAL).toBe(1)
  })
})

describe('TYPE_ORDER', () => {
  it('18タイプすべてが含まれている', () => {
    expect(TYPE_ORDER).toHaveLength(18)
  })

  it('重複がない', () => {
    const unique = new Set(TYPE_ORDER)
    expect(unique.size).toBe(18)
  })
})

describe('TYPE_INFO', () => {
  it('全18タイプの情報が定義されている', () => {
    for (const type of TYPE_ORDER) {
      const info = TYPE_INFO[type]
      expect(info.id).toBe(type)
      expect(info.name).toBeTruthy()
      expect(info.color).toBeTruthy()
      expect(info.textColor).toBeTruthy()
      expect(info.iconPath).toContain('icons/')
    }
  })
})

describe('TYPE_TINT_COLORS', () => {
  it('全18タイプの色が定義されている', () => {
    for (const type of TYPE_ORDER) {
      expect(TYPE_TINT_COLORS[type]).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})

describe('TYPE_CHART', () => {
  it('全18×18の組み合わせが定義されている', () => {
    for (const attacker of TYPE_ORDER) {
      for (const defender of TYPE_ORDER) {
        const value = TYPE_CHART[attacker][defender]
        expect(value).toBeDefined()
        expect([SUPER_EFFECTIVE, NOT_EFFECTIVE, IMMUNE, NEUTRAL]).toContain(value)
      }
    }
  })

  // ポケモンGOの有名な相性をスポットチェック
  describe('代表的な相性チェック', () => {
    const cases: [PokemonType, PokemonType, number][] = [
      // ほのお → くさ = ばつぐん
      ['fire', 'grass', SUPER_EFFECTIVE],
      // みず → ほのお = ばつぐん
      ['water', 'fire', SUPER_EFFECTIVE],
      // くさ → みず = ばつぐん
      ['grass', 'water', SUPER_EFFECTIVE],
      // でんき → じめん = 効果なし (GO では 0.390625)
      ['electric', 'ground', IMMUNE],
      // ノーマル → ゴースト = 効果なし
      ['normal', 'ghost', IMMUNE],
      // かくとう → ゴースト = 効果なし
      ['fighting', 'ghost', IMMUNE],
      // どく → はがね = 効果なし
      ['poison', 'steel', IMMUNE],
      // じめん → ひこう = 効果なし
      ['ground', 'flying', IMMUNE],
      // エスパー → あく = 効果なし
      ['psychic', 'dark', IMMUNE],
      // ドラゴン → フェアリー = 効果なし
      ['dragon', 'fairy', IMMUNE],
      // ゴースト → ノーマル = 効果なし
      ['ghost', 'normal', IMMUNE],
      // ほのお → ほのお = いまひとつ
      ['fire', 'fire', NOT_EFFECTIVE],
      // ほのお → みず = いまひとつ
      ['fire', 'water', NOT_EFFECTIVE],
      // ノーマル → ノーマル = 等倍
      ['normal', 'normal', NEUTRAL],
      // はがね → フェアリー = ばつぐん
      ['steel', 'fairy', SUPER_EFFECTIVE],
      // フェアリー → ドラゴン = ばつぐん
      ['fairy', 'dragon', SUPER_EFFECTIVE],
    ]

    it.each(cases)('%s → %s = %s', (atk, def, expected) => {
      expect(TYPE_CHART[atk][def]).toBe(expected)
    })
  })
})

describe('getDefenseMultiplier', () => {
  it('攻撃タイプから防御タイプへの倍率を返す', () => {
    expect(getDefenseMultiplier('fire', 'grass')).toBe(SUPER_EFFECTIVE)
    expect(getDefenseMultiplier('water', 'water')).toBe(NOT_EFFECTIVE)
    expect(getDefenseMultiplier('normal', 'normal')).toBe(NEUTRAL)
  })
})

describe('getComboDefenseMultiplier', () => {
  it('空配列なら等倍を返す', () => {
    expect(getComboDefenseMultiplier('fire', [])).toBe(1)
  })

  it('単タイプなら通常の倍率を返す', () => {
    // ほのお攻撃 → くさ防御 = 1.6
    expect(getComboDefenseMultiplier('fire', ['grass'])).toBe(SUPER_EFFECTIVE)
  })

  it('複合タイプの倍率は掛け算される', () => {
    // ほのお攻撃 → くさ/はがね防御 = 1.6 × 1.6 = 2.56
    expect(getComboDefenseMultiplier('fire', ['grass', 'steel'])).toBeCloseTo(2.56)
  })

  it('弱点と耐性が相殺される', () => {
    // ほのお攻撃 → くさ/みず防御 = 1.6 × 0.625 = 1.0
    expect(getComboDefenseMultiplier('fire', ['grass', 'water'])).toBeCloseTo(1.0)
  })

  it('二重耐性が計算される', () => {
    // ほのお攻撃 → みず/いわ防御 = 0.625 × 0.625 = 0.390625
    expect(getComboDefenseMultiplier('fire', ['water', 'rock'])).toBeCloseTo(0.390625)
  })

  it('チームモード: 3体分（6タイプ）の累積倍率', () => {
    // くさが6つ → ほのお攻撃 = 1.6^6 = 16.777216
    const sixGrass: PokemonType[] = ['grass', 'grass', 'grass', 'grass', 'grass', 'grass']
    expect(getComboDefenseMultiplier('fire', sixGrass)).toBeCloseTo(16.777216)
  })
})
