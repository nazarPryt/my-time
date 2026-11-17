import { defineTopic } from '../../define-topic'

export const adverbs = defineTopic({
	id: 'adverbs',
	level: 'intermediate',
	title: 'Adverbs',
	subtitle: 'Прислівники',
	rule: 'Прислівники описують, як відбувається дія; часто утворюються з -ly: quick → quickly.',
	sentences: [
		{
			id: 'adverbs-1',
			form: 'affirmative',
			prompt: 'Він говорить повільно.',
			answer: 'He speaks slowly.',
			traps: {
				slowly: ['slow', 'slower', 'slowness'],
			},
		},
		{
			id: 'adverbs-2',
			form: 'affirmative',
			prompt: 'Вона добре співає.',
			answer: 'She sings well.',
			traps: {
				well: ['good', 'goodly', 'better'],
			},
		},
	],
})
