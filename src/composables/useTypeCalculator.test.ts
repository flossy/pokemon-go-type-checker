import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useTypeCalculator } from './useTypeCalculator'
import type { PokemonType, CalcMode } from '../types/pokemon'
import { IMMUNE } from '../data/typeChart'

describe('useTypeCalculator', () => {
  describe('防御モード', () => {
    it('タイプ未選択なら空配列を返す', () => {
      const types = ref<PokemonType[]>([])
      const mode = ref<CalcMode>('defense')
      const { damageResults } = useTypeCalculator(types, mode)
      expect(damageResults.value).toEqual([])
    })

    it('単タイプの被ダメージ倍率を正しく計算する', () => {
      const types = ref<PokemonType[]>(['fire'])
      const mode = ref<CalcMode>('defense')
      const { damageResults, weaknesses, resistances } = useTypeCalculator(types, mode)

      // 全18タイプ分の結果がある
      expect(damageResults.value).toHaveLength(18)

      // ほのおタイプの弱点: みず、じめん、いわ
      const weakTypes = weaknesses.value.map(r => r.type)
      expect(weakTypes).toContain('water')
      expect(weakTypes).toContain('ground')
      expect(weakTypes).toContain('rock')

      // ほのおタイプの耐性: ほのお、くさ、こおり、かくとう、むし、はがね、フェアリー
      const resistTypes = resistances.value.map(r => r.type)
      expect(resistTypes).toContain('fire')
      expect(resistTypes).toContain('grass')
      expect(resistTypes).toContain('ice')
      expect(resistTypes).toContain('steel')
      expect(resistTypes).toContain('fairy')
      expect(resistTypes).toContain('bug')
    })

    it('複合タイプの二重弱点を正しく計算する', () => {
      // みず/ひこう → でんき = 1.6 × 1.6 = 2.56
      const types = ref<PokemonType[]>(['water', 'flying'])
      const mode = ref<CalcMode>('defense')
      const { damageResults } = useTypeCalculator(types, mode)

      const electric = damageResults.value.find(r => r.type === 'electric')
      expect(electric?.multiplier).toBeCloseTo(2.56)
    })

    it('複合タイプで弱点と耐性が相殺される', () => {
      // みず/じめん → くさ = 1.6 × 1.6 = 2.56（四重弱点）
      // みず/じめん → でんき = 0.390625 × 1.6 = 0.625 (GO式: 無効 × ばつぐん)
      const types = ref<PokemonType[]>(['water', 'ground'])
      const mode = ref<CalcMode>('defense')
      const { damageResults } = useTypeCalculator(types, mode)

      const grass = damageResults.value.find(r => r.type === 'grass')
      expect(grass?.multiplier).toBeCloseTo(2.56) // 二重弱点

      const electric = damageResults.value.find(r => r.type === 'electric')
      // でんき→みず=1.6, でんき→じめん=0.390625(GO式無効)
      expect(electric?.multiplier).toBeCloseTo(1.6 * IMMUNE)
    })
  })

  describe('攻撃モード', () => {
    it('タイプ未選択なら空配列を返す', () => {
      const types = ref<PokemonType[]>([])
      const mode = ref<CalcMode>('attack')
      const { damageResults } = useTypeCalculator(types, mode)
      expect(damageResults.value).toEqual([])
    })

    it('攻撃タイプの与ダメージ倍率を正しく返す', () => {
      const types = ref<PokemonType[]>(['fire'])
      const mode = ref<CalcMode>('attack')
      const { damageResults, weaknesses } = useTypeCalculator(types, mode)

      expect(damageResults.value).toHaveLength(18)

      // ほのお技がばつぐんの相手: くさ、こおり、むし、はがね
      const effectiveTypes = weaknesses.value.map(r => r.type)
      expect(effectiveTypes).toContain('grass')
      expect(effectiveTypes).toContain('ice')
      expect(effectiveTypes).toContain('bug')
      expect(effectiveTypes).toContain('steel')
    })
  })

  describe('チームモード', () => {
    it('3体分の累積弱点を計算する', () => {
      // くさ×6 → ほのお攻撃 = 1.6^6
      const types = ref<PokemonType[]>(['grass', 'grass', 'grass', 'grass', 'grass', 'grass'])
      const mode = ref<CalcMode>('team')
      const { damageResults } = useTypeCalculator(types, mode)

      const fire = damageResults.value.find(r => r.type === 'fire')
      expect(fire?.multiplier).toBeCloseTo(16.777216)
    })

    it('全員が弱いタイプと受け先ありタイプを返す', () => {
      const types = ref<PokemonType[]>(['grass', 'ice'])
      const mode = ref<CalcMode>('team')
      const { allWeakTypes, hasSwitchInTypes, teamDiagnostics } = useTypeCalculator(types, mode)

      expect(allWeakTypes.value.map(r => r.type)).toContain('fire')
      expect(hasSwitchInTypes.value.map(r => r.type)).toContain('water')

      const fire = teamDiagnostics.value.find(r => r.type === 'fire')
      expect(fire).toMatchObject({
        weakCount: 2,
        safeCount: 0,
      })
    })
  })

  describe('groupedResults', () => {
    it('倍率カテゴリ別にグルーピングされる', () => {
      const types = ref<PokemonType[]>(['fire'])
      const mode = ref<CalcMode>('defense')
      const { groupedResults } = useTypeCalculator(types, mode)

      // 弱点グループ（×1.6）にみず・じめん・いわが含まれる
      const weakGroup = groupedResults.value['1.6']
      expect(weakGroup).toBeDefined()
      const weakTypes = weakGroup!.map(r => r.type)
      expect(weakTypes).toContain('water')
      expect(weakTypes).toContain('ground')
      expect(weakTypes).toContain('rock')
    })
  })

  describe('リアクティブ性', () => {
    it('selectedTypesの変更に追従する', () => {
      const types = ref<PokemonType[]>([])
      const mode = ref<CalcMode>('defense')
      const { damageResults } = useTypeCalculator(types, mode)

      expect(damageResults.value).toEqual([])

      types.value = ['water']
      expect(damageResults.value).toHaveLength(18)

      // みずタイプの弱点にくさとでんきが含まれる
      const weakTypes = damageResults.value.filter(r => r.multiplier > 1).map(r => r.type)
      expect(weakTypes).toContain('grass')
      expect(weakTypes).toContain('electric')
    })

    it('modeの変更に追従する', () => {
      const types = ref<PokemonType[]>(['fire'])
      const mode = ref<CalcMode>('defense')
      const { weaknesses } = useTypeCalculator(types, mode)

      // 防御モード: ほのおの弱点 = みず、じめん、いわ
      const defWeakTypes = weaknesses.value.map(r => r.type)
      expect(defWeakTypes).toContain('water')

      // 攻撃モードに変更: ほのお技のばつぐん = くさ、こおり、むし、はがね
      mode.value = 'attack'
      const atkWeakTypes = weaknesses.value.map(r => r.type)
      expect(atkWeakTypes).toContain('grass')
      expect(atkWeakTypes).toContain('steel')
      expect(atkWeakTypes).not.toContain('water') // みずは攻撃先としてはいまひとつ
    })
  })
})
