<script setup lang="ts">
import type { PokemonType } from '../types/pokemon'
import { TYPE_INFO } from '../data/typeChart'
import TypeIcon from './TypeIcon.vue'

interface Props {
  selectedTypes: PokemonType[]
}

defineProps<Props>()

const emit = defineEmits<{
  'deselect': [type: PokemonType]
}>()

function handleDeselect(type: PokemonType) {
  emit('deselect', type)
}
</script>

<template>
  <div class="flex items-center justify-center overflow-hidden pt-2 pb-1">
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
</template>
