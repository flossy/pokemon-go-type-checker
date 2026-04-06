<script setup lang="ts">
import { computed } from 'vue'
import type { TeamSlots, TeamMember } from '../types/pokemon'
import { TYPE_INFO } from '../data/typeChart'
import TypeIcon from './TypeIcon.vue'

interface Props {
  teamSlots: TeamSlots
  activeSlot: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [slot: number, typeIndex: number]
  clear: []
  selectSlot: [slot: number]
}>()

const teamMembers = computed<TeamMember[]>(() => {
  return Array.from({ length: 3 }, (_, slot) => ({
    slot,
    types: props.teamSlots[slot] ?? [],
  }))
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-3 md:grid-cols-3">
      <button
        v-for="member in teamMembers"
        :key="member.slot"
        type="button"
        class="rounded-2xl border p-4 text-left transition-all"
        :class="member.slot === activeSlot
          ? 'border-gray-900 bg-gray-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'"
        @click="emit('selectSlot', member.slot)"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Pokemon {{ member.slot + 1 }}
            </p>
            <p class="mt-1 text-sm font-medium text-gray-800">
              {{ member.types.length === 0 ? 'タイプ未設定' : member.types.length === 1 ? '単タイプ' : '複合タイプ' }}
            </p>
          </div>
          <span
            class="rounded-full px-2 py-1 text-[10px] font-semibold"
            :class="member.slot === activeSlot ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'"
          >
            {{ member.slot === activeSlot ? '編集中' : '選択' }}
          </span>
        </div>

        <div class="mt-4 flex gap-3">
          <div
            v-for="typeIndex in 2"
            :key="typeIndex"
            class="flex min-h-20 flex-1 items-center justify-center rounded-2xl border border-dashed"
            :class="member.types[typeIndex - 1]
              ? 'border-gray-200 bg-white'
              : 'border-gray-300 bg-gray-50 text-gray-400'"
          >
            <div v-if="member.types[typeIndex - 1]" class="flex flex-col items-center gap-1">
              <TypeIcon
                :type="member.types[typeIndex - 1]!"
                size="md"
                selected
                clickable
                @click.stop="emit('remove', member.slot, typeIndex - 1)"
              />
              <span class="text-[10px] text-gray-600">
                {{ TYPE_INFO[member.types[typeIndex - 1]!].name }}
              </span>
            </div>
            <span v-else class="text-xs font-medium">
              タイプ {{ typeIndex }}
            </span>
          </div>
        </div>
      </button>
    </div>

    <div class="flex items-center justify-between gap-3">
      <p class="text-xs leading-5 text-gray-500">
        チームモードでは 3 体ぶんを個別に編集できます。編集中の枠を選んでから下のタイプ一覧を押してください。
      </p>
      <button
        v-if="teamSlots.some(types => types.length > 0)"
        type="button"
        class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 transition-all hover:bg-gray-200"
        @click="emit('clear')"
      >
        ✕ クリア
      </button>
    </div>
  </div>
</template>
