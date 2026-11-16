<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/mfe-contracts'
import { useSentenceAttempt } from '../../composables/use-sentence-attempt'
import type { Sentence } from '../../model/types'
import AnswerLine from './answer-line.vue'
import CorrectAnswer from './correct-answer.vue'
import WordTileGrid from './word-tile-grid.vue'
import WrongAnswer from './wrong-answer.vue'

const TEST_IDS = ENGLISH_QUIZ_REMOTE_TEST_IDS.sentenceBuilder

const { sentence } = defineProps<{ sentence: Sentence }>()
const emit = defineEmits<{
	finish: [firstTry: boolean]
	showRule: []
}>()

const { status, picked, checkedWords, isFirstTry, tiles, pick, undo, retry } =
	useSentenceAttempt(() => sentence)
</script>

<template>
	<div class="sentence-exercise">
		<h2 class="sentence-prompt">{{ sentence.prompt }}</h2>

		<CorrectAnswer
			v-if="status === 'correct'"
			:answer="sentence.answer"
			@next="emit('finish', isFirstTry)"
		/>

		<template v-else>
			<WrongAnswer
				v-if="status === 'wrong'"
				:words="checkedWords"
				@retry="retry"
			/>
			<template v-else>
				<AnswerLine :words="picked" @undo="undo" />
				<WordTileGrid :tiles="tiles" @pick="pick" />
			</template>

			<button
				type="button"
				class="btn btn-sm show-rule"
				:data-testid="TEST_IDS.showRule"
				@click="emit('showRule')"
			>
				Show rule
			</button>
		</template>
	</div>
</template>
