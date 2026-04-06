<script setup lang="ts">
import type { PokemonType, CalcMode, TeamSlots } from '../types/pokemon'
import { TYPE_INFO } from '../data/typeChart'
import TypeIcon from './TypeIcon.vue'
import TeamBuilder from './TeamBuilder.vue'

interface Props {
  selectedTypes: PokemonType[]
  mode: CalcMode
  activeTeamSlot?: number
  teamSlots?: TeamSlots
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'deselect': [type: PokemonType, index?: number]
  'clear': []
  'selectTeamSlot': [slot: number]
}>()

function handleDeselect(type: PokemonType, index?: number) {
  if (props.mode === 'team') {
    // チームモードではインデックス指定で削除
    emit('deselect', type, index)
  } else {
    emit('deselect', type)
  }
}
</script>

<template>
  <TeamBuilder
    v-if="mode === 'team'"
    :team-slots="teamSlots ?? [[], [], []]"
    :active-slot="activeTeamSlot ?? 0"
    @remove="(slot, typeIndex) => handleDeselect((teamSlots ?? [[], [], []])[slot]![typeIndex]!, slot * 2 + typeIndex)"
    @clear="emit('clear')"
    @select-slot="emit('selectTeamSlot', $event)"
  />

  <div v-else class="relative flex flex-col items-center gap-3 py-2">
    <!-- 選択されたタイプ表示 -->
    <div class="flex flex-wrap items-start justify-center gap-2 min-h-14">
      <template v-for="(type, index) in selectedTypes" :key="`${type}-${index}`">
        <div class="flex flex-col items-center">
          <TypeIcon :type="type" size="md" selected clickable @click="() => handleDeselect(type, index)" />
          <span class="text-[10px] text-gray-600 mt-0.5">{{ TYPE_INFO[type].name }}</span>
        </div>
        <span v-if="index < selectedTypes.length - 1" class="text-2xl text-gray-500 h-10 flex items-center">+</span>
      </template>
      <span v-if="selectedTypes.length === 0" class="text-gray-400">タイプを選択してください</span>
    </div>

    <!-- モードの説明 + クリアボタン -->
    <div class="flex items-center gap-4">
      <div class="text-xs text-gray-500">
        <template v-if="mode === 'defense'">1体のタイプ（最大2つ）を選択</template>
        <template v-else-if="mode === 'attack'">攻撃技のタイプを1つ選択</template>
        <template v-else>チームのタイプ傾向を見る簡易モードです。最大6タイプまで選べて、偏りと受け先をまとめて確認できます。</template>
      </div>
      <button
        v-if="selectedTypes.length > 0"
        class="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-all whitespace-nowrap"
        @click="emit('clear')"
      >
        ✕ クリア
      </button>
    </div>
  </div>
</template>
