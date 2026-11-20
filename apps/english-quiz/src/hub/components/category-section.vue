<script setup lang="ts">
import type { QuizMode } from '@my-time/micro-frontends'
import type { PracticeMode } from '../../catalog'
import type { PracticeProgress } from '../../progress'
import ModeCard from './mode-card.vue'

defineProps<{
	title: string
	modes: readonly PracticeMode[]
	scores: PracticeProgress['scores']
}>()
const emit = defineEmits<{ open: [mode: QuizMode] }>()
</script>

<template>
	<section class="category-section">
		<h3 class="category-section-title">{{ title }}</h3>
		<ul class="category-section-grid">
			<li v-for="mode in modes" :key="mode.id">
				<ModeCard
					:mode="mode"
					:score="scores[mode.id]"
					@open="emit('open', mode.id)"
				/>
			</li>
		</ul>
	</section>
</template>
