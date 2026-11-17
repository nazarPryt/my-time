import { defineTopic } from '../../define-topic'

export const futureContinuousVsFuturePerfectContinuous = defineTopic({
	id: 'future-continuous-vs-future-perfect-continuous',
	level: 'advanced',
	title: 'Future Continuous vs Future Perfect Continuous',
	subtitle: 'Майбутній тривалий і доконано-тривалий час',
	rule: 'Future Continuous — дія в процесі в певний момент; Future Perfect Continuous — її тривалість до цього моменту.',
	sentences: [
		{
			id: 'future-continuous-vs-future-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'О шостій я ще працюватиму.',
			answer: 'At six I will still be working.',
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'О шостій я працюватиму вже вісім годин.',
			answer: 'At six I will have been working for eight hours.',
		},
	],
})
