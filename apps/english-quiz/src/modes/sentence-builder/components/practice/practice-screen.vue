<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/mfe-contracts'
import QuizIcon from '../../../../shared/ui/quiz-icon.vue'
import { useTopic } from '../../composables/use-topic'
import LoadError from '../load-error.vue'
import PracticeSkeleton from './practice-skeleton.vue'
import TopicPractice from './topic-practice.vue'

const TEST_IDS = ENGLISH_QUIZ_REMOTE_TEST_IDS.sentenceBuilder

const { topicId } = defineProps<{ topicId: string }>()
const emit = defineEmits<{ back: [] }>()

const { topic, pending, error, reload } = useTopic(() => topicId)
</script>

<template>
	<section class="practice-screen">
		<header class="practice-header">
			<button
				type="button"
				class="btn btn-ghost btn-sm"
				:data-testid="TEST_IDS.backToTopics"
				@click="emit('back')"
			>
				<QuizIcon name="arrow-left" :size="16" />
				Topics
			</button>
			<p v-if="topic" class="practice-topic">{{ topic.title }}</p>
		</header>

		<PracticeSkeleton v-if="pending" />
		<LoadError v-else-if="error || !topic" @retry="reload" />
		<TopicPractice
			v-else
			:key="topic.id"
			:topic="topic"
			@back="emit('back')"
		/>
	</section>
</template>
