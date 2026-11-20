import {
	acceptedAnswers,
	answerWords,
	findPrefixConflict,
	parseAnswer,
	SENTENCE_FORMS,
	type Sentence,
	TOPIC_LEVELS,
} from '@my-time/contracts'
import type { TopicRecord } from './define-topic'

function duplicates(ids: readonly string[]): string[] {
	const seen = new Set<string>()
	return ids.filter((id) => seen.size === seen.add(id).size)
}

function sentenceProblems(sentence: Sentence): string[] {
	const problems: string[] = []
	const where = `sentence "${sentence.id}"`
	if (!SENTENCE_FORMS.includes(sentence.form)) {
		problems.push(`${where}: unknown form "${sentence.form}"`)
	}
	if (parseAnswer(sentence.answer).length < 2) {
		problems.push(`${where}: answer needs at least two words`)
	}

	let accepted: string[][]
	try {
		accepted = acceptedAnswers(sentence).map(answerWords)
	} catch (error) {
		return [...problems, `${where}: ${(error as Error).message}`]
	}
	if (sentence.accept) {
		const withoutAccept = acceptedAnswers({ answer: sentence.answer })
		if (accepted.length <= withoutAccept.length) {
			problems.push(`${where}: accept adds nothing beyond contractions`)
		}
		if (accepted.some((words) => words.length < 2)) {
			problems.push(`${where}: an accepted answer has fewer than two words`)
		}
	}
	const conflict = findPrefixConflict(accepted)
	if (conflict) {
		const [shorter, longer] = conflict
		problems.push(`${where}: "${shorter}" is the start of "${longer}"`)
	}

	const words = answerWords(parseAnswer(sentence.answer)).map((word) =>
		word.toLowerCase(),
	)
	for (const [key, traps] of Object.entries(sentence.traps ?? {})) {
		if (!words.includes(key.toLowerCase())) {
			problems.push(`${where}: trap key "${key}" is not a word of the answer`)
		}
		if (traps.some((trap) => trap.toLowerCase() === key.toLowerCase())) {
			problems.push(`${where}: trap for "${key}" repeats the word itself`)
		}
	}
	return problems
}

/**
 * Every rule the content must follow before it may be seeded; an empty list
 * means valid. The sync refuses to write content with problems.
 */
export function findContentProblems(topics: readonly TopicRecord[]): string[] {
	const problems: string[] = []
	const sentences = topics.flatMap((topic) => topic.sentences)

	for (const id of duplicates(topics.map((topic) => topic.id))) {
		problems.push(`topic id "${id}" is used more than once`)
	}
	for (const id of duplicates(sentences.map((sentence) => sentence.id))) {
		problems.push(`sentence id "${id}" is used more than once`)
	}
	for (const topic of topics) {
		const where = `topic "${topic.id}"`
		if (!TOPIC_LEVELS.includes(topic.level)) {
			problems.push(`${where}: unknown level "${topic.level}"`)
		}
		if (topic.sentences.length === 0) problems.push(`${where}: no sentences`)
		if (topic.rule.length === 0) problems.push(`${where}: no rule`)
		if (topic.rule.some((section) => section.examples.length === 0)) {
			problems.push(`${where}: a rule section has no examples`)
		}
	}
	for (const sentence of sentences) problems.push(...sentenceProblems(sentence))
	return problems
}
