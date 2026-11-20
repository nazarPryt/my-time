<script setup lang="ts">
import {
	ENGLISH_QUIZ_REMOTE_TEST_IDS,
	type QuizMode,
} from '@my-time/micro-frontends'
import { groupByCategory, PRACTICE_MODES } from '../catalog'
import type { PracticeProgress } from '../progress'
import CategorySection from './components/category-section.vue'

const { progress } = defineProps<{ progress: PracticeProgress }>()
const emit = defineEmits<{ open: [mode: QuizMode] }>()

const groups = groupByCategory(PRACTICE_MODES)
</script>

<template>
	<section
		class="practice-hub"
		:data-testid="ENGLISH_QUIZ_REMOTE_TEST_IDS.hub.root"
	>
		<header class="stack-sm">
			<h2 class="title">English practice</h2>
			<p class="muted">
				Pick an exercise. Your last scores are saved on this device.
			</p>
		</header>

		<CategorySection
			v-for="group in groups"
			:key="group.category.id"
			:title="group.category.title"
			:modes="group.modes"
			:scores="progress.scores"
			@open="emit('open', $event)"
		/>
	</section>
</template>
