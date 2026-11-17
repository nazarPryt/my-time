import { defineTopic } from '../../define-topic'

export const futurePerfectPassive = defineTopic({
	id: 'future-perfect-passive',
	level: 'advanced',
	title: 'Future perfect passive',
	subtitle: 'Майбутній доконаний час (пасив)',
	rule: 'will have been + третя форма — дію над предметом завершать до моменту в майбутньому.',
	sentences: [
		{
			id: 'future-perfect-passive-1',
			form: 'affirmative',
			prompt: 'До понеділка звіт буде готовий.',
			answer: 'The report will have been finished by Monday.',
		},
		{
			id: 'future-perfect-passive-2',
			form: 'affirmative',
			prompt: 'Міст збудують до літа.',
			answer: 'The bridge will have been built by summer.',
		},
	],
})
