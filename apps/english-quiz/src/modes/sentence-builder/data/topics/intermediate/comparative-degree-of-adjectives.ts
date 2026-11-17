import { defineTopic } from '../../define-topic'

export const comparativeDegreeOfAdjectives = defineTopic({
	id: 'comparative-degree-of-adjectives',
	level: 'intermediate',
	title: 'Comparative degree of adjectives',
	subtitle: 'Вищий ступінь порівняння прикметників',
	rule: 'Короткі прикметники + -er, довгі — з more: bigger, more interesting.',
	sentences: [
		{
			id: 'comparative-degree-of-adjectives-1',
			form: 'affirmative',
			prompt: 'Мій брат вищий за мене.',
			answer: 'My brother is taller than me.',
			traps: {
				taller: ['tall', 'tallest', 'more'],
			},
		},
		{
			id: 'comparative-degree-of-adjectives-2',
			form: 'affirmative',
			prompt: 'Ця книжка цікавіша.',
			answer: 'This book is more interesting.',
			traps: {
				more: ['most', 'much', 'very'],
			},
		},
	],
})
