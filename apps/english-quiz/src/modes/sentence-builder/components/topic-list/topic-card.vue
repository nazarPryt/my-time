<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/mfe-contracts'
import QuizIcon from '../../../../shared/ui/quiz-icon.vue'
import type { TopicSummary } from '../../model/types'

const TEST_IDS = ENGLISH_QUIZ_REMOTE_TEST_IDS.sentenceBuilder

defineProps<{ topic: TopicSummary }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
	<button
		type="button"
		class="topic-card"
		:data-testid="TEST_IDS.topicCard"
		@click="emit('select')"
	>
		<span class="topic-card-text">
			<span class="topic-card-title">{{ topic.title }}</span>
			<span class="topic-card-subtitle">{{ topic.subtitle }}</span>
		</span>
		<QuizIcon name="chevron-right" class="topic-card-chevron" />
	</button>
</template>
