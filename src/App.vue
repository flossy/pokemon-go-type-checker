<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PokemonType, CalcMode } from './types/pokemon'
import { TYPE_TINT_COLORS } from './data/typeChart'
import TypeSelector from './components/TypeSelector.vue'
import SelectedTypes from './components/SelectedTypes.vue'
import DamageVisualizer from './components/DamageVisualizer.vue'

const selectedTypes = ref<PokemonType[]>([])
const mode = ref<CalcMode>('defense')

function deselectType(type: PokemonType, index?: number) {
  if (index !== undefined) {
    // チームモード: インデックス指定で削除
    selectedTypes.value.splice(index, 1)
  } else {
    // 攻撃/防御モード: タイプで検索して削除
    const idx = selectedTypes.value.indexOf(type)
    if (idx >= 0) {
      selectedTypes.value.splice(idx, 1)
    }
  }
}

// 選択をクリア
function clearSelection() {
  selectedTypes.value = []
}

// モード変更時の処理
function handleModeChange(newMode: CalcMode) {
  const prevMode = mode.value
  mode.value = newMode

  if (newMode === 'attack' && selectedTypes.value.length > 1) {
    // 攻撃モードでは1つだけ残す
    selectedTypes.value = [selectedTypes.value[0]!]
  } else if (newMode === 'defense' && prevMode === 'team' && selectedTypes.value.length > 2) {
    // チームモードから防御モードに戻る場合、2つまでに制限
    selectedTypes.value = selectedTypes.value.slice(0, 2)
  }
}

const backgroundStyle = computed(() => {
  const defaultColor = '#f3f4f6' // gray-100
  const types = selectedTypes.value

  if (types.length === 0) {
    return { background: `linear-gradient(135deg, ${defaultColor} 0%, ${defaultColor} 100%)` }
  }
  if (types.length === 1 && types[0]) {
    const color = TYPE_TINT_COLORS[types[0]]
    return { background: `linear-gradient(135deg, ${color} 0%, ${color} 100%)` }
  }
  // 2タイプ: グラデーション
  if (types[0] && types[1]) {
    const color1 = TYPE_TINT_COLORS[types[0]]
    const color2 = TYPE_TINT_COLORS[types[1]]
    return { background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)` }
  }
  return { background: `linear-gradient(135deg, ${defaultColor} 0%, ${defaultColor} 100%)` }
})
</script>

<template>
  <div class="min-h-screen text-gray-900 transition-all duration-1000 ease-in-out" :style="backgroundStyle">
    <!-- ステータスバー + ノッチ -->
    <div class="safe-area-top">
      <div class="flex justify-center">
        <div class="notch-tab bg-gray-900 px-4 py-2.5 rounded-b-2xl flex gap-2 whitespace-nowrap">
        <button
            :class="[
              'px-4 py-1.5 text-xs font-medium rounded-full transition-all',
              mode === 'defense'
                ? 'bg-white text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            ]"
            @click="handleModeChange('defense')"
          >
            ぼうぎょ
          </button>
          <button
            :class="[
              'px-4 py-1.5 text-xs font-medium rounded-full transition-all',
              mode === 'attack'
                ? 'bg-white text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            ]"
            @click="handleModeChange('attack')"
          >
            こうげき
          </button>
          <button
            :class="[
              'px-4 py-1.5 text-xs font-medium rounded-full transition-all',
              mode === 'team'
                ? 'bg-white text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            ]"
            @click="handleModeChange('team')"
          >
            チーム
          </button>
        </div>
      </div>
    </div>

    <!-- メインコンテンツ -->
    <main class="container mx-auto px-4 pb-8">
      <div class="max-w-4xl mx-auto space-y-3">
        <!-- タイプ選択グリッド（ノッチと重なるように負のマージン） -->
        <section class="bg-white rounded-xl p-6 pt-8 -mt-4">
          <TypeSelector
            v-model="selectedTypes"
            :mode="mode"
          />
        </section>

        <!-- 選択表示 -->
        <section class="bg-white rounded-xl p-6">
          <SelectedTypes
            :selected-types="selectedTypes"
            :mode="mode"
            @deselect="deselectType"
            @clear="clearSelection"
          />
        </section>

        <!-- ダメージ倍率表示 -->
        <section class="bg-white rounded-xl overflow-hidden">
          <DamageVisualizer :selected-types="selectedTypes" :mode="mode" />
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

/* メタボール風の逆角丸 */
.notch-tab {
  position: relative;
}

.notch-tab::before,
.notch-tab::after {
  content: '';
  position: absolute;
  top: -8px;
  width: 16px;
  height: 16px;
  background: transparent;
}

.notch-tab::before {
  left: -16px;
  border-top-right-radius: 16px;
  box-shadow: 8px 0 0 0 #111827;
}

.notch-tab::after {
  right: -16px;
  border-top-left-radius: 16px;
  box-shadow: -8px 0 0 0 #111827;
}
</style>
