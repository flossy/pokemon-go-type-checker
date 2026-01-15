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
  <div class="flex items-center gap-6">
    <!-- 攻撃・防御モード切り替えスイッチ（固定幅） -->
    <div class="shrink-0">
      <div class="flex flex-col space-y-1 bg-gray-100 rounded-lg p-1">
        <button
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            !isAttackMode
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          ]"
          @click="emit('update:isAttackMode', false)"
        >
          ぼうぎょ
        </button>
        <button
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            isAttackMode
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          ]"
          @click="emit('update:isAttackMode', true)"
        >
          こうげき
        </button>
      </div>
    </div>

    <!-- 選択されたタイプ表示（中央配置） -->
    <div class="flex-1 flex items-center justify-center py-2">
      <div v-if="selectedTypes.length > 0" class="flex items-start gap-4">
        <template v-for="(type, index) in selectedTypes" :key="type">
          <div class="flex flex-col items-center">
            <TypeIcon :type="type" size="md" selected clickable @click="handleDeselect" />
            <span class="text-xs text-gray-600 mt-1">{{ TYPE_INFO[type].name }}</span>
          </div>
          <span v-if="index < selectedTypes.length - 1" class="text-2xl text-gray-500 h-10 flex items-center">+</span>
        </template>
      </div>

      <span v-else class="text-gray-500">Select a type</span>
    </div>

    <!-- バランス用ダミー要素（スイッチと同じ幅） -->
    <div class="shrink-0 invisible">
      <div class="flex flex-col space-y-1 bg-gray-100 rounded-lg p-1">
        <button class="px-4 py-2 rounded-md text-sm font-medium">
          ぼうぎょ
        </button>
        <button class="px-4 py-2 rounded-md text-sm font-medium">
          こうげき
        </button>
      </div>
    </div>
  </div>
</template>
