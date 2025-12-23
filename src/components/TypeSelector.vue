<script setup lang="ts">
import type { PokemonType } from '../types/pokemon'
import { TYPE_ORDER } from '../data/typeChart'
import TypeIcon from './TypeIcon.vue'

interface Props {
  modelValue: PokemonType[]
  maxSelection?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxSelection: 2,
})

const emit = defineEmits<{
  'update:modelValue': [types: PokemonType[]]
}>()

function toggleType(type: PokemonType) {
  const current = [...props.modelValue]
  const index = current.indexOf(type)

  if (index >= 0) {
    // 選択解除
    current.splice(index, 1)
  } else if (current.length < props.maxSelection) {
    // 新規選択
    current.push(type)
  } else {
    // 最大数に達している場合、最初の選択を解除して新しいものを追加
    current.shift()
    current.push(type)
  }

  emit('update:modelValue', current)
}

function isSelected(type: PokemonType): boolean {
  return props.modelValue.includes(type)
}
</script>

<template>
  <div>
    <div class="grid grid-cols-6 gap-3 justify-items-center">
      <TypeIcon
        v-for="type in TYPE_ORDER"
        :key="type"
        :type="type"
        :selected="isSelected(type)"
        clickable
        @click="toggleType"
      />
    </div>
  </div>
</template>
