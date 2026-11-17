import { defineTopic } from '../../define-topic'

export const passiveVoicePresentPerfect = defineTopic({
	id: 'passive-voice-present-perfect',
	level: 'intermediate',
	title: 'Passive Voice - Present Perfect',
	subtitle: 'Пасивний стан — теперішній доконаний час',
	rule: 'have/has been + третя форма — дію вже виконано, виконавець неважливий.',
	sentences: [
		{
			id: 'passive-voice-present-perfect-1',
			form: 'affirmative',
			prompt: 'Мою машину вкрали.',
			answer: 'My car has been stolen.',
			traps: {
				stolen: ['stole', 'steal', 'stealed'],
			},
		},
		{
			id: 'passive-voice-present-perfect-2',
			form: 'affirmative',
			prompt: 'Усі квитки вже продано.',
			answer: 'All the tickets have been sold.',
			traps: {
				sold: ['sell', 'selled', 'sells'],
			},
		},
	],
})
