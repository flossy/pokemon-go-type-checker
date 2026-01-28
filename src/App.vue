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
    <!-- メインコンテンツ -->
    <main class="container mx-auto px-4 pt-4 pb-8">
      <div class="max-w-4xl mx-auto space-y-3">
        <!-- ブロック1: タイプ選択（モードボタン付き） -->
        <section class="relative">
          <!-- モード切り替えボタン（上辺に重なる） -->
          <div class="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div class="inline-flex rounded-lg shadow-md overflow-hidden">
              <button
                :class="[
                  'px-4 py-2 text-sm font-medium transition-all border-r border-gray-300',
                  mode === 'defense'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                ]"
                @click="handleModeChange('defense')"
              >
                🛡️ ぼうぎょ
              </button>
              <button
                :class="[
                  'px-4 py-2 text-sm font-medium transition-all border-r border-gray-300',
                  mode === 'attack'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                ]"
                @click="handleModeChange('attack')"
              >
                ⚔️ こうげき
              </button>
              <button
                :class="[
                  'px-4 py-2 text-sm font-medium transition-all',
                  mode === 'team'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                ]"
                @click="handleModeChange('team')"
              >
                👥 チーム
              </button>
            </div>
          </div>

          <!-- タイプ選択グリッド -->
          <div class="bg-white rounded-xl p-6 pt-8">
            <TypeSelector
              v-model="selectedTypes"
              :mode="mode"
            />
          </div>
        </section>

        <!-- ブロック2: 選択表示 -->
        <section class="bg-white rounded-xl p-6">
          <SelectedTypes
            :selected-types="selectedTypes"
            :mode="mode"
            @deselect="deselectType"
            @clear="clearSelection"
          />
        </section>

        <!-- ブロック3: ダメージ倍率表示 -->
        <section class="bg-white rounded-xl overflow-hidden">
          <DamageVisualizer :selected-types="selectedTypes" :mode="mode" />
        </section>
      </div>
    </main>
  </div>
</template>
