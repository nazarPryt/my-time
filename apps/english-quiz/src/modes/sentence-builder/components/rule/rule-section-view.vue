<script setup lang="ts">
import QuizIcon from '../../../../shared/ui/quiz-icon.vue'
import { RULE_SECTION_META } from '../../model/rule-sections'
import type { RuleSection } from '../../model/types'

defineProps<{ section: RuleSection }>()
</script>

<template>
	<article class="rule-section">
		<h3 class="rule-section-title">{{ RULE_SECTION_META[section.kind].label }}</h3>
		<p class="rule-section-explanation">{{ section.explanation }}</p>
		<ul class="rule-examples">
			<li v-for="example in section.examples" :key="example.text" class="rule-example">
				<QuizIcon name="book" class="rule-example-icon" />
				<span class="stack-sm">
					<span class="rule-example-text">{{ example.text }}</span>
					<span class="rule-example-translation">{{ example.translation }}</span>
				</span>
			</li>
		</ul>
	</article>
</template>
