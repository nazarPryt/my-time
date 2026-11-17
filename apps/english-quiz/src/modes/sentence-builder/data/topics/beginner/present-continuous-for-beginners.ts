import { defineTopic } from '../../define-topic'

export const presentContinuousForBeginners = defineTopic({
	id: 'present-continuous-for-beginners',
	level: 'beginner',
	title: 'Present Continuous for beginners',
	subtitle: 'Теперішній тривалий час для початківців',
	rule: 'Present Continuous: am/is/are + дієслово з -ing — дія відбувається зараз.',
	sentences: [
		{
			id: 'present-continuous-for-beginners-1',
			form: 'affirmative',
			prompt: 'Я читаю книжку.',
			answer: 'I am reading a book.',
			traps: {
				reading: ['read', 'reads', 'readed'],
			},
		},
		{
			id: 'present-continuous-for-beginners-2',
			form: 'affirmative',
			prompt: 'Він зараз спить.',
			answer: 'He is sleeping now.',
			traps: {
				is: ['are', 'am', 'be'],
			},
		},
	],
})
