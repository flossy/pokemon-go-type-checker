<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { PokemonType, TeamMember } from '../types/pokemon'
import { useTypeCalculator } from '../composables/useTypeCalculator'
import { TYPE_INFO } from '../data/typeChart'

interface Props {
  selectedTypes: PokemonType[]
  teamMembers?: TeamMember[]
  activeSlot?: number
}

const props = defineProps<Props>()

const selectedTypesRef = toRef(props, 'selectedTypes')
const modeRef = computed(() => 'team' as const)
const teamMembersRef = computed(() => props.teamMembers ?? [])
const { allWeakTypes, twoWeakTypes, hasSwitchInTypes } = useTypeCalculator(selectedTypesRef, modeRef, teamMembersRef)
const teamSize = computed(() => teamMembersRef.value.length)

const summaryCards = computed(() => {
  const cards = [
    {
      key: 'all-weak',
      title: '全員が弱いタイプ',
      description: '3体すべてが弱点になる攻撃タイプです。明確な一貫ができているので、まず警戒したい候補です。',
      emptyLabel: '今のところありません',
      items: sortHighRisk(allWeakTypes.value),
      color: 'bg-red-50 border-red-100',
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
    },
  ]

  if (teamSize.value === 3) {
    cards.push({
      key: 'two-weak',
      title: '2/3 が弱いタイプ',
      description: '3体のうち 2 体が弱点になる攻撃タイプです。明確な受け先は残るものの、圧をかけられやすい帯として見られます。',
      emptyLabel: '今のところありません',
      items: sortMediumRisk(twoWeakTypes.value),
      color: 'bg-amber-50 border-amber-100',
      titleColor: 'text-amber-900',
      textColor: 'text-amber-700',
    })
  }

  cards.push({
    key: 'has-switch-in',
    title: '受け先ありタイプ',
    description: '3体のうち少なくとも1体は等倍以下で受けられる攻撃タイプです。引き先候補の確認に使えます。',
    emptyLabel: 'まだ受け先は見つかっていません',
    items: sortSwitchIns(hasSwitchInTypes.value),
    color: 'bg-emerald-50 border-emerald-100',
    titleColor: 'text-emerald-900',
    textColor: 'text-emerald-700',
  })

  return cards
})

function getSafeOptionOpacity(multiplier: number): number {
  if (multiplier <= 0.390625) return 1
  if (multiplier <= 0.625) return 0.82
  return 0.58
}

function getWeakSlotClass(slot: number): string {
  if (slot === (props.activeSlot ?? 0)) {
    return 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/20'
  }

  return 'bg-amber-100 text-amber-800'
}

function sortHighRisk(items: typeof allWeakTypes.value) {
  return [...items].sort((a, b) =>
    b.totalMultiplier - a.totalMultiplier || b.weakCount - a.weakCount || a.type.localeCompare(b.type)
  )
}

function sortMediumRisk(items: typeof twoWeakTypes.value) {
  return [...items].sort((a, b) =>
    b.totalMultiplier - a.totalMultiplier ||
    compareSlotPriority(a.weakSlots, b.weakSlots) ||
    a.type.localeCompare(b.type)
  )
}

function sortSwitchIns(items: typeof hasSwitchInTypes.value) {
  return [...items].sort((a, b) =>
    bestSafeMultiplier(a.safeOptions) - bestSafeMultiplier(b.safeOptions) ||
    compareSlotPriority(a.safeSlots, b.safeSlots) ||
    a.type.localeCompare(b.type)
  )
}

function bestSafeMultiplier(options: Array<{ multiplier: number }>) {
  return options.reduce((best, option) => Math.min(best, option.multiplier), Number.POSITIVE_INFINITY)
}

function compareSlotPriority(left: number[], right: number[]) {
  const active = props.activeSlot ?? 0
  const leftHasActive = left.includes(active)
  const rightHasActive = right.includes(active)

  if (leftHasActive !== rightHasActive) {
    return leftHasActive ? -1 : 1
  }

  return left[0]! - right[0]!
}
</script>

<template>
  <div class="space-y-3">
    <div class="rounded-2xl border border-gray-200 bg-white/80 px-4 py-3">
      <div class="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
        <span class="font-semibold uppercase tracking-[0.18em] text-gray-400">Guide</span>
        <span class="rounded-full bg-gray-900 px-2 py-0.5 font-semibold text-white">P{{ (activeSlot ?? 0) + 1 }}</span>
        <span>現在フォーカス中のポケモン</span>
        <span class="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-500" :style="{ opacity: 0.58 }">等倍</span>
        <span class="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-500" :style="{ opacity: 0.82 }">耐性</span>
        <span class="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-500" :style="{ opacity: 1 }">強い耐性</span>
      </div>
    </div>

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
          class="rounded-2xl bg-white/90 px-2.5 py-2 shadow-sm"
        >
          <div class="inline-flex items-center gap-2">
            <img
              :src="TYPE_INFO[item.type].iconPath"
              :alt="TYPE_INFO[item.type].name"
              class="h-5 w-5 object-contain"
            />
            <span class="text-xs font-medium text-gray-700">
              {{ TYPE_INFO[item.type].name }}
            </span>
          </div>
          <div
            v-if="card.key === 'two-weak' && item.weakSlots.length > 0"
            class="mt-2 flex flex-wrap gap-1"
          >
            <span
              v-for="slot in item.weakSlots"
              :key="`${item.type}-weak-${slot}`"
              class="rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all"
              :class="getWeakSlotClass(slot)"
            >
              P{{ slot + 1 }}
            </span>
          </div>
          <div
            v-if="card.key === 'has-switch-in' && item.safeOptions.length > 0"
            class="mt-2 flex flex-wrap gap-1"
          >
            <span
              v-for="option in item.safeOptions"
              :key="`${item.type}-${option.slot}`"
              class="rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all"
              :class="option.slot === (activeSlot ?? 0)
                ? 'bg-gray-900 text-white shadow-sm ring-2 ring-gray-900/15'
                : 'bg-gray-100 text-gray-500'"
              :style="{ opacity: getSafeOptionOpacity(option.multiplier) }"
              :title="`P${option.slot + 1}: ${option.multiplier.toFixed(3)}x`"
            >
              P{{ option.slot + 1 }}
            </span>
          </div>
        </div>
      </div>

      <p v-else class="mt-3 text-xs text-gray-500">
        {{ card.emptyLabel }}
      </p>
    </article>
    </div>
  </div>
</template>
