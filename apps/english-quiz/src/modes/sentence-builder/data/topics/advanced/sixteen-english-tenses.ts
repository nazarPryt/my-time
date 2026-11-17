import { defineTopic } from '../../define-topic'

export const sixteenEnglishTenses = defineTopic({
	id: 'sixteen-english-tenses',
	level: 'advanced',
	title: '16 English tenses',
	subtitle: '16 часів англійської мови',
	rule: 'Чотири групи (Simple, Continuous, Perfect, Perfect Continuous) у теперішньому, минулому, майбутньому та майбутньому в минулому.',
	sentences: [
		{
			id: 'sixteen-english-tenses-1',
			form: 'affirmative',
			prompt: 'Я працюю щодня.',
			answer: 'I work every day.',
		},
		{
			id: 'sixteen-english-tenses-2',
			form: 'affirmative',
			prompt: 'Я працюватиму весь день.',
			answer: 'I will be working all day.',
		},
	],
})
