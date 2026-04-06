<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PokemonType, CalcMode } from './types/pokemon'
import { TYPE_TINT_COLORS } from './data/typeChart'
import TypeSelector from './components/TypeSelector.vue'
import SelectedTypes from './components/SelectedTypes.vue'
import DamageVisualizer from './components/DamageVisualizer.vue'
import TeamInsights from './components/TeamInsights.vue'

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

const modeCopy = computed(() => {
  switch (mode.value) {
    case 'defense':
      return {
        title: '1体の受け相性を確認',
        description: '1体分のタイプを最大2つまで選んで、どの攻撃タイプに弱いか、どこを受けられるかを確認できます。',
      }
    case 'attack':
      return {
        title: '1タイプ技の通りを確認',
        description: '技タイプを1つ選ぶと、どの相手タイプに通りやすいかを一覧で見られます。',
      }
    case 'team':
      return {
        title: 'チーム全体の偏りを簡易診断',
        description: 'チームモードは選択した最大6タイプをまとめて集計し、累積弱点と受け先の有無を確認するモードです。3体を厳密に再現するというより、タイプ偏りの早見表として使えます。',
      }
  }
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

        <section class="bg-white rounded-xl p-6">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            {{ mode }}
          </p>
          <h1 class="mt-2 text-2xl font-semibold text-gray-900">
            {{ modeCopy.title }}
          </h1>
          <p class="mt-2 text-sm leading-6 text-gray-600">
            {{ modeCopy.description }}
          </p>
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

        <section
          v-if="mode === 'team' && selectedTypes.length > 0"
          class="bg-white rounded-xl p-6"
        >
          <div class="mb-4">
            <h2 class="text-lg font-semibold text-gray-900">チーム診断</h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">
              ここでは選択したタイプ群をまとめて見て、全体的に通されやすい攻撃タイプと、どこかで受けられる攻撃タイプを切り分けています。
            </p>
          </div>
          <TeamInsights :selected-types="selectedTypes" />
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
