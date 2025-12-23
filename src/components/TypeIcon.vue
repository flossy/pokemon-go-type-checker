<script setup lang="ts">
import type { PokemonType } from '../types/pokemon'
import { TYPE_INFO } from '../data/typeChart'
import { computed } from 'vue'

interface Props {
  type: PokemonType
  size?: 'sm' | 'md' | 'lg' | 'xl'
  selected?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selected: false,
  clickable: false,
})

const emit = defineEmits<{
  click: [type: PokemonType]
}>()

const typeInfo = computed(() => TYPE_INFO[props.type])

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8'
    case 'md': return 'w-12 h-12'
    case 'lg': return 'w-16 h-16'
    case 'xl': return 'w-20 h-20'
    default: return 'w-12 h-12'
  }
})

function handleClick() {
  if (props.clickable) {
    emit('click', props.type)
  }
}
</script>

<template>
  <button
    type="button"
    :class="[
      'flex items-center justify-center transition-all duration-300 ease-out',
      sizeClasses,
      clickable ? 'cursor-pointer hover:opacity-80 hover:scale-105' : 'cursor-default',
      selected ? 'opacity-100 scale-110' : 'opacity-50',
    ]"
    :disabled="!clickable"
    :title="typeInfo.name"
    @click="handleClick"
  >
    <img
      :src="typeInfo.iconPath"
      :alt="typeInfo.name"
      class="w-full h-full object-contain select-none"
    />
  </button>
</template>
