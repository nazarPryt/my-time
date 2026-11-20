<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/micro-frontends'
import { computed } from 'vue'
import type { PracticeMode } from '../../catalog'
import type { ModeScore } from '../../progress'
import QuizIcon from '../../shared/ui/quiz-icon.vue'
import { describeMode } from '../model/mode-details'
import ModeDetails from './mode-details.vue'

const { mode, score } = defineProps<{
	mode: PracticeMode
	score?: ModeScore
}>()
const emit = defineEmits<{ open: [] }>()

const details = computed(() => describeMode(mode, score))
</script>

<template>
	<button
		type="button"
		class="mode-card"
		:data-testid="ENGLISH_QUIZ_REMOTE_TEST_IDS.hub.modeCard(mode.id)"
		@click="emit('open')"
	>
		<span class="mode-card-text">
			<span class="mode-card-title">{{ mode.title }}</span>
			<span class="mode-card-description">{{ mode.description }}</span>
			<ModeDetails :details="details" />
		</span>
		<QuizIcon name="chevron-right" class="mode-card-chevron" />
	</button>
</template>
