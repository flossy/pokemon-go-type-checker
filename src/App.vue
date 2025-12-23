<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PokemonType } from './types/pokemon'
import { TYPE_TINT_COLORS } from './data/typeChart'
import TypeSelector from './components/TypeSelector.vue'
import SelectedTypes from './components/SelectedTypes.vue'
import DamageVisualizer from './components/DamageVisualizer.vue'

const selectedTypes = ref<PokemonType[]>([])

function deselectType(type: PokemonType) {
  const index = selectedTypes.value.indexOf(type)
  if (index >= 0) {
    selectedTypes.value.splice(index, 1)
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
        <!-- ブロック1: タイプ選択 -->
        <section class="bg-white rounded-xl p-6">
          <TypeSelector v-model="selectedTypes" />
        </section>

        <!-- ブロック2: 選択表示 -->
        <section class="bg-white rounded-xl p-6">
          <SelectedTypes :selected-types="selectedTypes" @deselect="deselectType" />
        </section>

        <!-- ブロック3: ダメージ倍率表示 -->
        <section class="bg-white rounded-xl overflow-hidden">
          <DamageVisualizer :selected-types="selectedTypes" />
        </section>
      </div>
    </main>
  </div>
</template>
