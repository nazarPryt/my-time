import { defineTopic } from '../../define-topic'

export const pastPerfectPassive = defineTopic({
	id: 'past-perfect-passive',
	level: 'advanced',
	title: 'Past perfect passive',
	subtitle: 'Минулий доконаний час (пасив)',
	rule: 'had been + третя форма — дію над предметом завершено до моменту в минулому.',
	sentences: [
		{
			id: 'past-perfect-passive-1',
			form: 'affirmative',
			prompt: 'Будинок уже був проданий.',
			answer: 'The house had already been sold.',
			traps: {
				sold: ['sell', 'selled', 'sells'],
			},
		},
		{
			id: 'past-perfect-passive-2',
			form: 'affirmative',
			prompt: 'Лист написали ще до того, як він прийшов.',
			answer: 'The letter had been written before he came.',
		},
	],
})
