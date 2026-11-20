import type { RandomSource, Round } from 'contracts'
import { pickRound } from './pick-round'
import { englishQuizRepository } from './repository'

export function createEnglishQuizService(random: RandomSource = Math.random) {
	return {
		listTopics: () => englishQuizRepository.listTopics(),

		/** Null for an unknown topic. */
		getTopic: (id: string) => englishQuizRepository.findTopic(id),

		/** A fresh random round on every call; null for an unknown topic. */
		getRound: async (topicId: string, size: number): Promise<Round | null> => {
			const bank = await englishQuizRepository.listSentences(topicId)
			if (bank.length === 0) return null
			return { topicId, sentences: pickRound(bank, size, random) }
		},
	}
}

export const englishQuizService = createEnglishQuizService()
