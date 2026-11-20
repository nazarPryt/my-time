<script setup lang="ts">
import type {
	EnglishQuizEvent,
	QuizLevel,
	QuizMode,
} from '@my-time/micro-frontends'
import { computed } from 'vue'
import { getPracticeMode } from '../catalog'
import { PracticeHub } from '../hub'
import { scoreFromEvent, usePracticeProgress } from '../progress'
import type { ModeContext } from '../shared/practice/practice-mode'
import ModeScreen from './components/mode-screen.vue'

const { mode, initialLevel, report } = defineProps<{
	/** `undefined` shows the hub. */
	mode: QuizMode | undefined
	initialLevel: QuizLevel
	report: (event: EnglishQuizEvent) => void
}>()

const { progress, recordScore } = usePracticeProgress()

const activeMode = computed(() => (mode ? getPracticeMode(mode) : null))

/** The host owns the URL; the new mode comes back as a prop. */
function navigate(next: QuizMode | null) {
	report({ type: 'mode-changed', mode: next })
}

const context = computed<ModeContext>(() => ({
	initialLevel,
	report(event) {
		report(event)
		const score = scoreFromEvent(event)
		if (score && mode) recordScore(mode, score)
	},
}))
</script>

<template>
	<div class="app-root">
		<ModeScreen
			v-if="activeMode"
			:mode="activeMode"
			:context="context"
			@back="navigate(null)"
		/>
		<PracticeHub v-else :progress="progress" @open="navigate" />
	</div>
</template>
