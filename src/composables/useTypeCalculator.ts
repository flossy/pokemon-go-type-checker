import { computed, type Ref } from 'vue'
import type { PokemonType, DamageResult, CalcMode, TeamTypeDiagnostic } from '../types/pokemon'
import { TYPE_ORDER, getComboDefenseMultiplier, getDefenseMultiplier, MULTIPLIER_INFO, TYPE_CHART } from '../data/typeChart'

export function useTypeCalculator(selectedTypes: Ref<PokemonType[]>, mode: Ref<CalcMode>) {
  // 防御時：全タイプからの被ダメージ倍率を計算（1体、最大2タイプ）
  const defenseResults = computed<DamageResult[]>(() => {
    if (selectedTypes.value.length === 0) return []

    return TYPE_ORDER.map(attackType => ({
      type: attackType,
      multiplier: getComboDefenseMultiplier(attackType, selectedTypes.value)
    }))
  })

  // 攻撃時：選択したタイプの技で各タイプへの与ダメージ倍率を計算
  const attackResults = computed<DamageResult[]>(() => {
    if (selectedTypes.value.length === 0) return []

    const attackType = selectedTypes.value[0]! // 攻撃モードでは1つのタイプのみ
    return TYPE_ORDER.map(defenseType => ({
      type: defenseType,
      multiplier: TYPE_CHART[attackType][defenseType]
    }))
  })

  // チームモード：3体分（最大6タイプ）の合計倍率を計算
  // 同じタイプが複数あれば弱点が累積する
  const teamResults = computed<DamageResult[]>(() => {
    if (selectedTypes.value.length === 0) return []

    return TYPE_ORDER.map(attackType => ({
      type: attackType,
      multiplier: getComboDefenseMultiplier(attackType, selectedTypes.value)
    }))
  })

  // モードに応じて結果を切り替え
  const damageResults = computed<DamageResult[]>(() => {
    switch (mode.value) {
      case 'attack': return attackResults.value
      case 'defense': return defenseResults.value
      case 'team': return teamResults.value
    }
  })

  const teamDiagnostics = computed<TeamTypeDiagnostic[]>(() => {
    if (selectedTypes.value.length === 0) return []

    return TYPE_ORDER.map(attackType => {
      const slotMultipliers = selectedTypes.value.map(defenseType =>
        getDefenseMultiplier(attackType, defenseType)
      )

      return {
        type: attackType,
        totalMultiplier: getComboDefenseMultiplier(attackType, selectedTypes.value),
        weakCount: slotMultipliers.filter(multiplier => multiplier > 1).length,
        safeCount: slotMultipliers.filter(multiplier => multiplier <= 1).length,
      }
    })
  })

  const allWeakTypes = computed(() =>
    teamDiagnostics.value.filter(result => result.weakCount === selectedTypes.value.length)
  )

  const hasSwitchInTypes = computed(() =>
    teamDiagnostics.value.filter(result => result.safeCount > 0)
  )

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
    teamDiagnostics,
    allWeakTypes,
    hasSwitchInTypes,
  }
}

// 最も近い倍率カテゴリを見つける
function findNearestCategory(multiplier: number): number | null {
  const tolerance = 0.01

  // 完全一致チェック
  for (const info of MULTIPLIER_INFO) {
    if (Math.abs(multiplier - info.value) < tolerance) {
      return info.value
    }
  }

  // 範囲ベースで最も近いカテゴリを見つける
  // 耐性側（小さい順）
  if (multiplier < 0.08) return 0.05960464477539063  // ×0.06
  if (multiplier < 0.12) return 0.095367431640625    // ×0.10
  if (multiplier < 0.2) return 0.152587890625        // ×0.15
  if (multiplier < 0.32) return 0.244140625          // ×0.24
  if (multiplier < 0.5) return 0.390625              // ×0.39
  if (multiplier < 0.8) return 0.625                 // ×0.625
  if (multiplier < 1.3) return 1                     // ×1.0
  // 弱点側（大きい順）
  if (multiplier < 2.1) return 1.6                   // ×1.6
  if (multiplier < 3.3) return 2.56                  // ×2.56
  if (multiplier < 5.3) return 4.096                 // ×4.10
  if (multiplier < 8.5) return 6.5536                // ×6.55
  if (multiplier < 13.5) return 10.48576             // ×10.5
  return 16.777216                                   // ×16.8
}
