import { defineTopic } from '../../define-topic'

export const articles = defineTopic({
	id: 'articles',
	level: 'beginner',
	title: 'Articles',
	subtitle: 'Артиклі',
	rule: 'a/an — один із багатьох або згаданий уперше; the — конкретний, уже відомий предмет.',
	sentences: [
		{
			id: 'articles-1',
			form: 'affirmative',
			prompt: 'У мене є собака.',
			answer: 'I have a dog.',
			traps: {
				a: ['an', 'the'],
			},
		},
		{
			id: 'articles-2',
			form: 'affirmative',
			prompt: 'Сонце яскраве.',
			answer: 'The sun is bright.',
			traps: {
				The: ['A', 'An'],
			},
		},
	],
})
