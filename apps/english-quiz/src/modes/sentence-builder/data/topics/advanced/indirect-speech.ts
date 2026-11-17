import { defineTopic } from '../../define-topic'

export const indirectSpeech = defineTopic({
	id: 'indirect-speech',
	level: 'advanced',
	title: 'Indirect speech',
	subtitle: 'Непряма мова',
	rule: 'Непряма мова передає чужі слова: часи зсуваються в минуле, займенники змінюються.',
	sentences: [
		{
			id: 'indirect-speech-1',
			form: 'affirmative',
			prompt: 'Вона сказала, що кохає мене.',
			answer: 'She said that she loved me.',
			traps: {
				loved: ['loves', 'love', 'loving'],
			},
		},
		{
			id: 'indirect-speech-2',
			form: 'affirmative',
			prompt: 'Він запитав, де я живу.',
			answer: 'He asked where I lived.',
			traps: {
				lived: ['live', 'lives', 'living'],
			},
		},
	],
})
