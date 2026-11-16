<script setup lang="ts">
import type { EnglishQuizEvent, QuizLevel } from '@my-time/mfe-contracts'
import { ref } from 'vue'
import LevelPicker from './components/level-picker.vue'
import QuestionCard from './components/question-card.vue'
import QuizSummary from './components/quiz-summary.vue'
import { QUESTION_BANK } from './data/questions'
import {
	answer,
	currentQuestion,
	next,
	type QuizState,
	startQuiz,
	toResult,
} from './model/quiz-engine'

const props = defineProps<{
	initialLevel: QuizLevel
	report: (event: EnglishQuizEvent) => void
}>()

const quiz = ref<QuizState | null>(null)

function start(level: QuizLevel) {
	quiz.value = startQuiz(level, QUESTION_BANK)
	props.report({ type: 'quiz-started', level })
}

function choose(optionIndex: number) {
	if (quiz.value) quiz.value = answer(quiz.value, optionIndex)
}

function advance() {
	if (!quiz.value) return
	quiz.value = next(quiz.value)
	if (quiz.value.finished) {
		props.report({
			type: 'quiz-completed',
			result: toResult(quiz.value, new Date()),
		})
	}
}
</script>

<template>
	<div class="level-quiz">
		<LevelPicker v-if="!quiz" :initial-level="initialLevel" @start="start" />
		<QuizSummary
			v-else-if="quiz.finished"
			:level="quiz.level"
			:correct="quiz.correct"
			:total="quiz.questions.length"
			@restart="start(quiz.level)"
			@change-level="quiz = null"
		/>
		<QuestionCard
			v-else
			:key="currentQuestion(quiz).id"
			:question="currentQuestion(quiz)"
			:selected="quiz.selected"
			:position="quiz.index + 1"
			:total="quiz.questions.length"
			@answer="choose"
			@next="advance"
		/>
	</div>
</template>
