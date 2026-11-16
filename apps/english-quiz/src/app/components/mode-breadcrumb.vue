<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/mfe-contracts'
import QuizIcon from '../../shared/ui/quiz-icon.vue'

defineProps<{ title: string }>()
const emit = defineEmits<{ back: [] }>()
</script>

<template>
	<nav class="mode-breadcrumb" aria-label="Breadcrumb">
		<button
			type="button"
			class="btn btn-ghost btn-sm"
			:data-testid="ENGLISH_QUIZ_REMOTE_TEST_IDS.modeScreen.backToHub"
			@click="emit('back')"
		>
			<QuizIcon name="arrow-left" :size="14" />
			All exercises
		</button>
		<span class="mode-breadcrumb-separator" aria-hidden="true">/</span>
		<span class="mode-breadcrumb-current" aria-current="page">{{ title }}</span>
	</nav>
</template>
