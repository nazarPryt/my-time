<script setup lang="ts">
import type { QuizLevel } from '@my-time/micro-frontends'
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/micro-frontends'
import { computed } from 'vue'

const TEST_IDS = ENGLISH_QUIZ_REMOTE_TEST_IDS.levelQuiz

const props = defineProps<{
	level: QuizLevel
	correct: number
	total: number
}>()
const emit = defineEmits<{ restart: []; changeLevel: [] }>()

const percent = computed(() => Math.round((props.correct / props.total) * 100))
const message = computed(() => {
	if (percent.value >= 90) return 'Excellent — you have this level nailed.'
	if (percent.value >= 60)
		return 'Good job! A little more practice and you are there.'
	return 'Keep going — repetition is how languages stick.'
})
</script>

<template>
	<section class="card stack summary" :data-testid="TEST_IDS.summary">
		<p class="muted">Level {{ level }} complete</p>
		<p class="score" aria-label="Score">
			<span :data-testid="TEST_IDS.scoreCorrect">{{ correct }}</span> /
			<span :data-testid="TEST_IDS.scoreTotal">{{ total }}</span>
		</p>
		<p>{{ message }}</p>
		<div class="row">
			<button type="button" class="btn btn-primary" @click="emit('restart')">Try again</button>
			<button type="button" class="btn" @click="emit('changeLevel')">Change level</button>
		</div>
	</section>
</template>
