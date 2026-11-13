<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '../model/types'

const props = defineProps<{
	question: Question
	selected: number | null
	position: number
	total: number
}>()
const emit = defineEmits<{ answer: [optionIndex: number]; next: [] }>()

const answered = computed(() => props.selected !== null)
const isCorrect = computed(() => props.selected === props.question.answerIndex)

function optionState(index: number) {
	if (!answered.value) return undefined
	if (index === props.question.answerIndex) return 'correct'
	if (index === props.selected) return 'wrong'
	return undefined
}
</script>

<template>
	<section class="card stack">
		<div class="meta">
			<span>Question {{ position }} of {{ total }}</span>
			<span class="chip">{{ question.topic }}</span>
		</div>
		<div
			class="progress"
			role="progressbar"
			:aria-valuenow="position"
			aria-valuemin="1"
			:aria-valuemax="total"
		>
			<div class="progress-fill" :style="{ width: `${(position / total) * 100}%` }" />
		</div>

		<h2 class="prompt">{{ question.prompt }}</h2>

		<div class="options">
			<button
				v-for="(option, index) in question.options"
				:key="option"
				type="button"
				class="option"
				:data-state="optionState(index)"
				:disabled="answered"
				@click="emit('answer', index)"
			>
				{{ option }}
			</button>
		</div>

		<div v-if="answered" class="feedback" :data-state="isCorrect ? 'correct' : 'wrong'" role="status">
			<strong>{{ isCorrect ? 'Correct!' : 'Not quite.' }}</strong>
			{{ question.explanation }}
		</div>

		<button v-if="answered" type="button" class="btn btn-primary" @click="emit('next')">
			{{ position === total ? 'See results' : 'Next question' }}
		</button>
	</section>
</template>
