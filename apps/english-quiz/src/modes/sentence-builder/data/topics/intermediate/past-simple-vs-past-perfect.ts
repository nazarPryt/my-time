import { defineTopic } from '../../define-topic'

export const pastSimpleVsPastPerfect = defineTopic({
	id: 'past-simple-vs-past-perfect',
	level: 'intermediate',
	title: 'Past Simple vs Past Perfect',
	subtitle: 'Минулий простий і минулий доконаний час',
	rule: 'Past Simple — послідовні події; Past Perfect — те, що сталося раніше за іншу подію.',
	sentences: [
		{
			id: 'past-simple-vs-past-perfect-1',
			form: 'affirmative',
			prompt: 'Коли я прийшов, фільм уже почався.',
			answer: 'When I arrived the film had already started.',
			traps: {
				had: ['has', 'have', 'was'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-2',
			form: 'affirmative',
			prompt: 'Я загубив ключ, який купив.',
			answer: 'I lost the key that I had bought.',
		},
	],
})
