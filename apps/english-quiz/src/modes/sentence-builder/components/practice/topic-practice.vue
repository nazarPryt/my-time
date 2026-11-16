<script setup lang="ts">
import { shallowRef } from 'vue'
import { useTopicPractice } from '../../composables/use-topic-practice'
import type { Topic } from '../../model/types'
import RulePage from '../rule/rule-page.vue'
import ProgressDots from './progress-dots.vue'
import SentenceExercise from './sentence-exercise.vue'
import TopicComplete from './topic-complete.vue'

const { topic } = defineProps<{ topic: Topic }>()
const emit = defineEmits<{ back: [] }>()

const {
	currentSentence,
	dots,
	finished,
	score,
	total,
	completeSentence,
	restart,
} = useTopicPractice(() => topic)

const ruleOpen = shallowRef(false)
</script>

<template>
	<RulePage
		v-if="ruleOpen"
		:title="topic.title"
		:sections="topic.rule"
		@close="ruleOpen = false"
	/>
	<!-- v-show, not v-if: the exercise keeps its picked words while the rule is open. -->
	<div v-show="!ruleOpen" class="topic-practice">
		<TopicComplete
			v-if="finished"
			:score="score"
			:total="total"
			@restart="restart"
			@back="emit('back')"
		/>
		<SentenceExercise
			v-else-if="currentSentence"
			:key="currentSentence.id"
			:sentence="currentSentence"
			@finish="completeSentence"
			@show-rule="ruleOpen = true"
		/>
		<ProgressDots :dots="dots" />
	</div>
</template>
