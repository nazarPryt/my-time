import { defineTopic } from '../../define-topic'

export const modalVerbsWillWould = defineTopic({
	id: 'modal-verbs-will-would',
	level: 'advanced',
	title: 'Modal verbs (Will/Would)',
	subtitle: 'Модальні дієслова will/would',
	rule: 'will — воля, обіцянка; would — ввічливе прохання або уявна ситуація.',
	sentences: [
		{
			id: 'modal-verbs-will-would-1',
			form: 'question',
			prompt: 'Чи не могли б ви зачинити двері?',
			answer: 'Would you close the door?',
			traps: {
				Would: ['Will', 'Should', 'Did'],
			},
		},
		{
			id: 'modal-verbs-will-would-2',
			form: 'affirmative',
			prompt: 'Я б випив кави.',
			answer: 'I would like some coffee.',
		},
	],
})
