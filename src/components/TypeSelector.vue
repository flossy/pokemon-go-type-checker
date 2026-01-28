<script setup lang="ts">
import type { PokemonType, CalcMode } from '../types/pokemon'
import { TYPE_ORDER } from '../data/typeChart'
import TypeIcon from './TypeIcon.vue'
import { computed } from 'vue'

interface Props {
  modelValue: PokemonType[]
  mode: CalcMode
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [types: PokemonType[]]
}>()

// モードごとの最大選択数
const currentMaxSelection = computed(() => {
  switch (props.mode) {
    case 'attack': return 1
    case 'defense': return 2
    case 'team': return 6
  }
})

// チームモードでは重複選択を許可
const allowDuplicates = computed(() => props.mode === 'team')

// 同じタイプの選択回数をカウント
function countType(type: PokemonType): number {
  return props.modelValue.filter(t => t === type).length
}

function toggleType(type: PokemonType) {
  const current = [...props.modelValue]

  if (allowDuplicates.value) {
    // チームモード: 重複許可（ただし同タイプは最大3つまで）
    const typeCount = countType(type)
    if (typeCount >= 3) {
      // 同じタイプが3つ以上あれば追加しない
      return
    }
    if (current.length < currentMaxSelection.value) {
      current.push(type)
    } else {
      // 最大数に達している場合、最初を削除して追加
      current.shift()
      current.push(type)
    }
  } else {
    // 攻撃/防御モード: 従来の動作
    const index = current.indexOf(type)
    if (index >= 0) {
      // 選択解除
      current.splice(index, 1)
    } else if (current.length < currentMaxSelection.value) {
      // 新規選択
      current.push(type)
    } else {
      // 最大数に達している場合、最初の選択を解除して新しいものを追加
      current.shift()
      current.push(type)
    }
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
