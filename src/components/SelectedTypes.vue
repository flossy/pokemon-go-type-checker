<script setup lang="ts">
import type { PokemonType } from '../types/pokemon'
import { TYPE_INFO } from '../data/typeChart'
import TypeIcon from './TypeIcon.vue'

interface Props {
  selectedTypes: PokemonType[]
  isAttackMode: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'deselect': [type: PokemonType]
  'update:isAttackMode': [isAttackMode: boolean]
}>()

function handleDeselect(type: PokemonType) {
  emit('deselect', type)
}
</script>

<template>
  <div class="relative flex items-center justify-center py-2">
    <!-- ぼうぎょボタン（左側、右辺が三角に尖る） -->
    <button
      :class="[
        'absolute left-0 -translate-x-1/3 pl-4 pr-6 py-2 text-sm font-medium transition-all shadow-sm rounded-sm',
        !isAttackMode
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
      style="clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)"
      @click="emit('update:isAttackMode', false)"
    >
      ぼうぎょ
    </button>

    <!-- 選択されたタイプ表示（中央） -->
    <div class="flex items-start gap-4">
      <template v-for="(type, index) in selectedTypes" :key="type">
        <div class="flex flex-col items-center">
          <TypeIcon :type="type" size="md" selected clickable @click="handleDeselect" />
          <span class="text-xs text-gray-600 mt-1">{{ TYPE_INFO[type].name }}</span>
        </div>
        <span v-if="index < selectedTypes.length - 1" class="text-2xl text-gray-500 h-10 flex items-center">+</span>
      </template>
      <span v-if="selectedTypes.length === 0" class="text-gray-500">Select a type</span>
    </div>

    <!-- こうげきボタン（右側、左辺が三角に尖る） -->
    <button
      :class="[
        'absolute right-0 translate-x-1/3 pl-6 pr-4 py-2 text-sm font-medium transition-all shadow-sm rounded-sm',
        isAttackMode
          ? 'bg-red-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
      style="clip-path: polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 50%)"
      @click="emit('update:isAttackMode', true)"
    >
      こうげき
    </button>
  </div>
</template>
