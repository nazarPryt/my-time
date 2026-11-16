<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/mfe-contracts'

const TEST_IDS = ENGLISH_QUIZ_REMOTE_TEST_IDS.sentenceBuilder
defineProps<{ tiles: readonly string[] }>()
const emit = defineEmits<{ pick: [word: string] }>()
</script>

<template>
	<div
		class="word-tile-grid"
		role="group"
		aria-label="Word choices"
		:data-testid="TEST_IDS.wordTiles"
	>
		<button
			v-for="tile in tiles"
			:key="tile"
			type="button"
			class="word-tile"
			:data-testid="TEST_IDS.wordTile"
			@click="emit('pick', tile)"
		>
			{{ tile }}
		</button>
	</div>
</template>
