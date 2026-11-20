<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/micro-frontends'
import { computed, shallowRef } from 'vue'
import QuizIcon from '../../../../shared/ui/quiz-icon.vue'
import type { RuleSection, RuleSectionKind } from '../../model/types'
import RuleSectionView from './rule-section-view.vue'
import RuleSidebar from './rule-sidebar.vue'

const TEST_IDS = ENGLISH_QUIZ_REMOTE_TEST_IDS.sentenceBuilder

const { title, sections } = defineProps<{
	title: string
	sections: readonly RuleSection[]
}>()
const emit = defineEmits<{ close: [] }>()

const activeKind = shallowRef<RuleSectionKind | undefined>(sections[0]?.kind)
const activeSection = computed(
	() => sections.find((section) => section.kind === activeKind.value) ?? null,
)
</script>

<template>
	<section class="rule-page card">
		<header class="rule-page-header">
			<h2 class="title">{{ title }}</h2>
			<button
				type="button"
				class="btn btn-sm btn-icon"
				:data-testid="TEST_IDS.backToExercise"
				@click="emit('close')"
			>
				<QuizIcon name="arrow-left" :size="16" />
				Back to exercise
			</button>
		</header>
		<div class="rule-page-body">
			<RuleSidebar v-model="activeKind" :sections="sections" />
			<RuleSectionView v-if="activeSection" :section="activeSection" />
		</div>
	</section>
</template>
