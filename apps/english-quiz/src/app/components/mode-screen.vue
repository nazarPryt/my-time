<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/micro-frontends'
import { computed } from 'vue'
import type { PracticeMode } from '../../catalog'
import type { ModeContext } from '../../shared/practice/practice-mode'
import ModeBreadcrumb from './mode-breadcrumb.vue'

const { mode, context } = defineProps<{
	mode: PracticeMode
	context: ModeContext
}>()
const emit = defineEmits<{ back: [] }>()

const modeProps = computed(() => mode.props?.(context) ?? {})
</script>

<template>
	<div
		class="mode-screen"
		:data-testid="ENGLISH_QUIZ_REMOTE_TEST_IDS.modeScreen.root"
	>
		<ModeBreadcrumb :title="mode.title" @back="emit('back')" />
		<!-- Keyed so a new mode starts fresh. -->
		<component :is="mode.component" :key="mode.id" v-bind="modeProps" />
	</div>
</template>
