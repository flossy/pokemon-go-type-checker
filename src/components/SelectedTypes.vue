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
  'update:mode': [mode: CalcMode]
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
  <div class="relative flex flex-col items-center gap-4 py-2">
    <!-- モード切り替えボタン -->
    <div class="flex gap-2">
      <button
        :class="[
          'px-4 py-2 text-sm font-medium transition-all shadow-sm rounded-lg',
          mode === 'defense'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
        @click="emit('update:mode', 'defense')"
      >
        🛡️ ぼうぎょ
      </button>
      <button
        :class="[
          'px-4 py-2 text-sm font-medium transition-all shadow-sm rounded-lg',
          mode === 'attack'
            ? 'bg-red-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
        @click="emit('update:mode', 'attack')"
      >
        ⚔️ こうげき
      </button>
      <button
        :class="[
          'px-4 py-2 text-sm font-medium transition-all shadow-sm rounded-lg',
          mode === 'team'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
        @click="emit('update:mode', 'team')"
      >
        👥 チーム
      </button>
    </div>

    <!-- 選択されたタイプ表示 -->
    <div class="flex items-start gap-2 flex-wrap justify-center">
      <template v-for="(type, index) in selectedTypes" :key="`${type}-${index}`">
        <div class="flex flex-col items-center">
          <TypeIcon :type="type" size="md" selected clickable @click="() => handleDeselect(type, index)" />
          <span class="text-xs text-gray-600 mt-1">{{ TYPE_INFO[type].name }}</span>
        </div>
        <span v-if="index < selectedTypes.length - 1" class="text-2xl text-gray-500 h-10 flex items-center">+</span>
      </template>
      <span v-if="selectedTypes.length === 0" class="text-gray-500">タイプを選択してください</span>
    </div>

    <!-- モードの説明 -->
    <div class="text-xs text-gray-500 text-center">
      <template v-if="mode === 'defense'">1体のタイプ（最大2つ）を選択</template>
      <template v-else-if="mode === 'attack'">攻撃技のタイプを1つ選択</template>
      <template v-else>チーム3体分のタイプ（最大6つ、重複可）を選択</template>
    </div>
  </div>
</template>
