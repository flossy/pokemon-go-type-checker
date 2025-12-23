<script setup lang="ts">
import type { PokemonType } from '../types/pokemon'
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
  <div class="flex items-center justify-center overflow-hidden py-2">
    <div v-if="selectedTypes.length > 0" class="flex items-center gap-3">
      <template v-for="(type, index) in selectedTypes" :key="type">
        <TypeIcon :type="type" size="md" selected clickable @click="handleDeselect" />
        <span v-if="index < selectedTypes.length - 1" class="text-2xl text-gray-500">+</span>
      </template>
    </div>

    <span v-else class="text-gray-500">Select a type</span>
  </div>
</template>
