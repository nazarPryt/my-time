<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/micro-frontends'
import { useTopicCatalog } from '../../composables/use-topic-catalog'
import LoadError from '../load-error.vue'
import LevelSection from './level-section.vue'
import TopicListSkeleton from './topic-list-skeleton.vue'

const TEST_IDS = ENGLISH_QUIZ_REMOTE_TEST_IDS.sentenceBuilder

const emit = defineEmits<{ select: [topicId: string] }>()

const { groups, pending, error, reload } = useTopicCatalog()
</script>

<template>
	<TopicListSkeleton v-if="pending" />
	<section v-else class="topic-list" :data-testid="TEST_IDS.topicList">
		<header class="stack-sm">
			<h2 class="title">Choose a topic</h2>
			<p class="muted">Build English sentences word by word.</p>
		</header>

		<LoadError v-if="error" @retry="reload" />
		<template v-else>
			<LevelSection
				v-for="group in groups"
				:key="group.level"
				:label="group.label"
				:topics="group.topics"
				@select="emit('select', $event)"
			/>
		</template>
	</section>
</template>
