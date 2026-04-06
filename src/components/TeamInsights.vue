<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { PokemonType } from '../types/pokemon'
import { useTypeCalculator } from '../composables/useTypeCalculator'
import { TYPE_INFO } from '../data/typeChart'

interface Props {
  selectedTypes: PokemonType[]
}

const props = defineProps<Props>()

const selectedTypesRef = toRef(props, 'selectedTypes')
const modeRef = computed(() => 'team' as const)
const { allWeakTypes, hasSwitchInTypes } = useTypeCalculator(selectedTypesRef, modeRef)

const summaryCards = computed(() => [
  {
    key: 'all-weak',
    title: '全員が弱いタイプ',
    description: '選択したタイプ全体で見て、全スロットが弱点になっている攻撃タイプです。',
    emptyLabel: '今のところありません',
    items: allWeakTypes.value,
    color: 'bg-red-50 border-red-100',
    titleColor: 'text-red-900',
    textColor: 'text-red-700',
  },
  {
    key: 'has-switch-in',
    title: '受け先ありタイプ',
    description: '選択したタイプの中に、等倍以下で受けられるタイプが1つ以上ある攻撃タイプです。',
    emptyLabel: 'まだ受け先は見つかっていません',
    items: hasSwitchInTypes.value,
    color: 'bg-emerald-50 border-emerald-100',
    titleColor: 'text-emerald-900',
    textColor: 'text-emerald-700',
  },
])
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2">
    <article
      v-for="card in summaryCards"
      :key="card.key"
      class="rounded-2xl border p-4"
      :class="card.color"
    >
      <h3 class="text-sm font-semibold" :class="card.titleColor">
        {{ card.title }}
      </h3>
      <p class="mt-1 text-xs leading-5" :class="card.textColor">
        {{ card.description }}
      </p>

      <div v-if="card.items.length > 0" class="mt-3 flex flex-wrap gap-2">
        <div
          v-for="item in card.items"
          :key="item.type"
          class="inline-flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1.5 shadow-sm"
        >
          <img
            :src="TYPE_INFO[item.type].iconPath"
            :alt="TYPE_INFO[item.type].name"
            class="h-5 w-5 object-contain"
          />
          <span class="text-xs font-medium text-gray-700">
            {{ TYPE_INFO[item.type].name }}
          </span>
        </div>
      </div>

      <p v-else class="mt-3 text-xs text-gray-500">
        {{ card.emptyLabel }}
      </p>
    </article>
  </div>
</template>
