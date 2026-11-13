<script setup lang="ts">
import { QUIZ_LEVELS, type QuizLevel } from '@my-time/mfe-contracts'
import { ref } from 'vue'
import { QUESTIONS_PER_QUIZ } from '../model/quiz-engine'

const props = defineProps<{ initialLevel: QuizLevel }>()
const emit = defineEmits<{ start: [level: QuizLevel] }>()

const LEVEL_LABELS: Record<QuizLevel, string> = {
	A2: 'Elementary',
	B1: 'Intermediate',
	B2: 'Upper-intermediate',
}

const level = ref<QuizLevel>(props.initialLevel)
</script>

<template>
	<section class="card stack">
		<div class="stack-sm">
			<h2 class="title">Test your English</h2>
			<p class="muted">
				{{ QUESTIONS_PER_QUIZ }} questions on grammar, vocabulary, phrasal verbs
				and prepositions. Pick your level to start.
			</p>
		</div>

		<div class="levels" role="radiogroup" aria-label="Level">
			<button
				v-for="option in QUIZ_LEVELS"
				:key="option"
				type="button"
				role="radio"
				class="level"
				:aria-checked="level === option"
				@click="level = option"
			>
				<span class="level-code">{{ option }}</span>
				<span class="level-name">{{ LEVEL_LABELS[option] }}</span>
			</button>
		</div>

		<button type="button" class="btn btn-primary" @click="emit('start', level)">
			Start quiz
		</button>
	</section>
</template>
