import { defineTopic } from '../../define-topic'

export const superlativeDegreeOfAdjectives = defineTopic({
	id: 'superlative-degree-of-adjectives',
	level: 'intermediate',
	title: 'Superlative degree of adjectives',
	subtitle: 'Найвищий ступінь порівняння прикметників',
	rule: 'the + прикметник із -est або the most: the biggest, the most beautiful.',
	sentences: [
		{
			id: 'superlative-degree-of-adjectives-1',
			form: 'affirmative',
			prompt: 'Це найвища гора.',
			answer: 'This is the highest mountain.',
			traps: {
				highest: ['higher', 'high', 'most'],
			},
		},
		{
			id: 'superlative-degree-of-adjectives-2',
			form: 'affirmative',
			prompt: 'Вона найрозумніша в класі.',
			answer: 'She is the smartest in the class.',
			traps: {
				smartest: ['smarter', 'smart', 'most'],
			},
		},
	],
})
