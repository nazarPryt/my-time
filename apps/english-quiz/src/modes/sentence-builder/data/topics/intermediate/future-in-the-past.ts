import { defineTopic } from '../../define-topic'

export const futureInThePast = defineTopic({
	id: 'future-in-the-past',
	level: 'intermediate',
	title: 'Future in the Past',
	subtitle: 'Майбутнє в минулому',
	rule: 'would + дієслово — майбутнє з погляду минулого: He said he would come.',
	sentences: [
		{
			id: 'future-in-the-past-1',
			form: 'affirmative',
			prompt: 'Він сказав, що прийде.',
			answer: 'He said he would come.',
			traps: {
				would: ['will', 'was', 'did'],
			},
		},
		{
			id: 'future-in-the-past-2',
			form: 'affirmative',
			prompt: 'Я знав, що вона подзвонить.',
			answer: 'I knew she would call.',
		},
	],
})
