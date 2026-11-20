<script setup lang="ts">
import { ENGLISH_QUIZ_REMOTE_TEST_IDS } from '@my-time/micro-frontends'
import { RULE_SECTION_META } from '../../model/rule-sections'
import type { RuleSection, RuleSectionKind } from '../../model/types'

const TEST_IDS = ENGLISH_QUIZ_REMOTE_TEST_IDS.sentenceBuilder

defineProps<{ sections: readonly RuleSection[] }>()
const active = defineModel<RuleSectionKind | undefined>({ required: true })
</script>

<template>
	<nav
		class="rule-sidebar"
		aria-label="Rule sections"
		:data-testid="TEST_IDS.ruleSections"
	>
		<button
			v-for="section in sections"
			:key="section.kind"
			type="button"
			class="rule-sidebar-item"
			:aria-current="active === section.kind ? 'true' : undefined"
			@click="active = section.kind"
		>
			<span class="rule-sidebar-symbol" aria-hidden="true">
				{{ RULE_SECTION_META[section.kind].symbol }}
			</span>
			{{ RULE_SECTION_META[section.kind].label }}
		</button>
	</nav>
</template>
