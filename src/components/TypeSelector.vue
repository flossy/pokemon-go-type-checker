<script setup lang="ts">
import type { PokemonType, CalcMode, TeamSlots } from '../types/pokemon'
import { TYPE_ORDER } from '../data/typeChart'
import TypeIcon from './TypeIcon.vue'
import { computed } from 'vue'

interface Props {
  modelValue: PokemonType[]
  mode: CalcMode
  activeTeamSlot?: number
  teamSlots?: TeamSlots
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [types: PokemonType[]]
  'update:teamSlots': [teamSlots: TeamSlots]
}>()

// モードごとの最大選択数
const currentMaxSelection = computed(() => {
  switch (props.mode) {
    case 'attack': return 1
    case 'defense': return 2
    case 'team': return 6
  }
})

function toggleType(type: PokemonType) {
  if (props.mode === 'team') {
    const nextTeamSlots = updateTeamSelection(props.teamSlots ?? [[], [], []], props.activeTeamSlot ?? 0, type)
    emit('update:teamSlots', nextTeamSlots)
    emit('update:modelValue', flattenTeamSlots(nextTeamSlots))
    return
  }

  const current = [...props.modelValue]

  const index = current.indexOf(type)
  if (index >= 0) {
    current.splice(index, 1)
  } else if (current.length < currentMaxSelection.value) {
    current.push(type)
  } else {
    current.shift()
    current.push(type)
  }

  emit('update:modelValue', current)
}

function isSelected(type: PokemonType): boolean {
  return props.modelValue.includes(type)
}

function updateTeamSelection(teamSlots: TeamSlots, activeTeamSlot: number, type: PokemonType): TeamSlots {
  const currentMembers: TeamSlots = teamSlots.map(types => [...types]) as TeamSlots
  const member = [...(currentMembers[activeTeamSlot] ?? [])]
  const existingIndex = member.indexOf(type)

  if (existingIndex >= 0) {
    member.splice(existingIndex, 1)
  } else if (member.length < 2) {
    member.push(type)
  } else {
    return currentMembers
  }

  currentMembers[activeTeamSlot] = member
  return currentMembers
}

function flattenTeamSlots(teamSlots: TeamSlots): PokemonType[] {
  return teamSlots.flat()
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
