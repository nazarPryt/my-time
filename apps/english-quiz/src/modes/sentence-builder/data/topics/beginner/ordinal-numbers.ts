import { defineTopic } from '../../define-topic'

export const ordinalNumbers = defineTopic({
	id: 'ordinal-numbers',
	level: 'beginner',
	title: 'Ordinal numbers',
	subtitle: 'Порядкові числівники',
	rule: 'Порядкові числівники: first, second, third, далі закінчення -th: fourth, fifth.',
	sentences: [
		{
			id: 'ordinal-numbers-1',
			form: 'affirmative',
			prompt: 'Це мій перший день.',
			answer: 'It is my first day.',
			traps: {
				first: ['one', 'firstly', 'oneth'],
			},
		},
		{
			id: 'ordinal-numbers-2',
			form: 'affirmative',
			prompt: 'Він живе на третьому поверсі.',
			answer: 'He lives on the third floor.',
			traps: {
				third: ['three', 'thirdth', 'threeth'],
			},
		},
	],
})
