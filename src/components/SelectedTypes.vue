<script setup lang="ts">
import type { PokemonType, CalcMode } from '../types/pokemon'
import { TYPE_INFO } from '../data/typeChart'
import TypeIcon from './TypeIcon.vue'

interface Props {
  selectedTypes: PokemonType[]
  mode: CalcMode
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'deselect': [type: PokemonType, index?: number]
  'clear': []
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
  <div class="relative flex flex-col items-center gap-3 py-2">
    <!-- 選択されたタイプ表示 -->
    <div class="flex items-start gap-2 flex-wrap justify-center min-h-14">
      <template v-for="(type, index) in selectedTypes" :key="`${type}-${index}`">
        <div class="flex flex-col items-center">
          <TypeIcon :type="type" size="md" selected clickable @click="() => handleDeselect(type, index)" />
          <span class="text-xs text-gray-600 mt-1">{{ TYPE_INFO[type].name }}</span>
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
        <template v-else>チーム3体分のタイプ（最大6つ、同タイプ3つまで）を選択</template>
      </div>
      <button
        v-if="selectedTypes.length > 0"
        class="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
        @click="emit('clear')"
      >
        ✕ クリア
      </button>
    </div>
  </div>
</template>
