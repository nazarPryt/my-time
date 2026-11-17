import { defineTopic } from '../../define-topic'

export const presentSimpleVsPresentContinuous = defineTopic({
	id: 'present-simple-vs-present-continuous',
	level: 'beginner',
	title: 'Present Simple vs Present Continuous',
	subtitle: 'Теперішній простий і теперішній тривалий час',
	rule: 'Present Simple — звички й факти; Present Continuous — те, що відбувається саме зараз.',
	sentences: [
		{
			id: 'present-simple-vs-present-continuous-1',
			form: 'affirmative',
			prompt: 'Він зазвичай ходить на роботу пішки.',
			answer: 'He usually walks to work.',
			traps: {
				walks: ['walk', 'walking', 'walked'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-2',
			form: 'affirmative',
			prompt: 'Сьогодні він їде автобусом.',
			answer: 'Today he is taking the bus.',
			traps: {
				taking: ['takes', 'take', 'took'],
			},
		},
	],
})
