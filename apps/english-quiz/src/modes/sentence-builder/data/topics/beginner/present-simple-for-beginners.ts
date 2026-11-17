import { defineTopic } from '../../define-topic'

export const presentSimpleForBeginners = defineTopic({
	id: 'present-simple-for-beginners',
	level: 'beginner',
	title: 'Present Simple for beginners',
	subtitle: 'Теперішній простий час для початківців',
	rule: 'Present Simple описує звички й постійні факти: I work, she works.',
	sentences: [
		{
			id: 'present-simple-for-beginners-1',
			form: 'affirmative',
			prompt: 'Я працюю вдома.',
			answer: 'I work at home.',
			traps: {
				work: ['works', 'worked', 'working'],
			},
		},
		{
			id: 'present-simple-for-beginners-2',
			form: 'affirmative',
			prompt: 'Вона любить каву.',
			answer: 'She likes coffee.',
			traps: {
				likes: ['like', 'liked', 'liking'],
			},
		},
	],
})
