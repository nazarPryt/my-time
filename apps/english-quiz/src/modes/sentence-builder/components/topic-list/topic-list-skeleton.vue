<script setup lang="ts">
import SkeletonBlock from '../../../../shared/ui/skeleton-block.vue'
import SkeletonStatus from '../../../../shared/ui/skeleton-status.vue'
import { TOPIC_LEVELS } from '../../model/types'

const CARDS_PER_LEVEL = 3
</script>

<template>
	<SkeletonStatus>
		<section class="topic-list">
			<div class="stack-sm">
				<SkeletonBlock width="9rem" height="1.25rem" />
				<SkeletonBlock width="16rem" height="0.875rem" />
			</div>
			<section v-for="level in TOPIC_LEVELS" :key="level">
				<SkeletonBlock
					class="level-section-title"
					width="6rem"
					height="0.75rem"
				/>
				<ul class="level-section-grid">
					<li v-for="card in CARDS_PER_LEVEL" :key="card">
						<div class="topic-card-skeleton">
							<span class="topic-card-text">
								<SkeletonBlock width="8rem" height="1rem" />
								<SkeletonBlock width="10rem" height="0.75rem" />
							</span>
							<SkeletonBlock width="1rem" height="1rem" />
						</div>
					</li>
				</ul>
			</section>
		</section>
	</SkeletonStatus>
</template>
