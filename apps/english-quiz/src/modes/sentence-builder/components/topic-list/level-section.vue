<script setup lang="ts">
import type { TopicSummary } from '../../model/types'
import TopicCard from './topic-card.vue'

defineProps<{
	label: string
	topics: readonly TopicSummary[]
}>()
const emit = defineEmits<{ select: [topicId: string] }>()
</script>

<template>
	<section class="level-section">
		<h3 class="level-section-title">{{ label }}</h3>
		<ul class="level-section-grid">
			<li v-for="topic in topics" :key="topic.id">
				<TopicCard :topic="topic" @select="emit('select', topic.id)" />
			</li>
		</ul>
	</section>
</template>
