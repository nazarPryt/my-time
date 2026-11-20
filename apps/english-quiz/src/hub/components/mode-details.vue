<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/micro-frontends'
import type { ModeDetail, ModeDetailKind } from '../model/mode-details'

defineProps<{ details: readonly ModeDetail[] }>()

const DETAIL_TEST_IDS: Partial<Record<ModeDetailKind, string>> = {
	score: ENGLISH_QUIZ_REMOTE_TEST_IDS.hub.modeScore,
}
</script>

<template>
	<span class="mode-details">
		<span
			v-for="detail in details"
			:key="detail.kind"
			class="mode-detail"
			:data-testid="DETAIL_TEST_IDS[detail.kind]"
		>
			{{ detail.text }}
		</span>
	</span>
</template>
