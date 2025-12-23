import { computed, type Ref } from 'vue'
import type { PokemonType, DamageResult } from '../types/pokemon'
import { TYPE_ORDER, getComboDefenseMultiplier, MULTIPLIER_INFO } from '../data/typeChart'

export function useTypeCalculator(selectedTypes: Ref<PokemonType[]>) {
  // 全タイプからの被ダメージ倍率を計算
  const damageResults = computed<DamageResult[]>(() => {
    if (selectedTypes.value.length === 0) return []

    return TYPE_ORDER.map(attackType => ({
      type: attackType,
      multiplier: getComboDefenseMultiplier(attackType, selectedTypes.value)
    }))
  })

  // 倍率カテゴリ別にグループ化
  const groupedResults = computed(() => {
    const groups: Record<string, DamageResult[]> = {}

    // 初期化
    MULTIPLIER_INFO.forEach(info => {
      groups[info.value.toString()] = []
    })

    // グループ化
    damageResults.value.forEach(result => {
      // 最も近い倍率カテゴリを見つける
      const category = findNearestCategory(result.multiplier)
      if (category !== null) {
        const key = category.toString()
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key]!.push(result)
      }
    })

    return groups
  })

  // 弱点タイプを取得
  const weaknesses = computed(() =>
    damageResults.value.filter(r => r.multiplier > 1)
  )

  // 耐性タイプを取得
  const resistances = computed(() =>
    damageResults.value.filter(r => r.multiplier < 1)
  )

  // 等倍タイプを取得
  const neutral = computed(() =>
    damageResults.value.filter(r => r.multiplier === 1)
  )

  return {
    damageResults,
    groupedResults,
    weaknesses,
    resistances,
    neutral,
  }
}

// 最も近い倍率カテゴリを見つける
function findNearestCategory(multiplier: number): number | null {
  const tolerance = 0.001

  for (const info of MULTIPLIER_INFO) {
    if (Math.abs(multiplier - info.value) < tolerance) {
      return info.value
    }
  }

  // 特殊ケース：三重耐性など
  if (multiplier < 0.3) return 0.244140625
  if (multiplier < 0.5) return 0.390625
  if (multiplier < 0.8) return 0.625
  if (multiplier < 1.3) return 1
  if (multiplier < 2) return 1.6
  return 2.56
}
