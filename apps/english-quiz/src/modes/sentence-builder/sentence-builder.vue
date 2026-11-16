<script setup lang="ts">
import { shallowRef } from 'vue'
import PracticeScreen from './components/practice/practice-screen.vue'
import TopicList from './components/topic-list/topic-list.vue'

// Two screens, so plain local state is enough. If deep links are needed
// later, this is the one place to swap for a router.
const selectedTopicId = shallowRef<string | null>(null)
</script>

<template>
	<div class="sentence-builder">
		<PracticeScreen
			v-if="selectedTopicId"
			:topic-id="selectedTopicId"
			@back="selectedTopicId = null"
		/>
		<TopicList v-else @select="selectedTopicId = $event" />
	</div>
</template>
