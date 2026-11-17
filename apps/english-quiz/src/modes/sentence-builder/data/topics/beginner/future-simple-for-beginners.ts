import { defineTopic } from '../../define-topic'

export const futureSimpleForBeginners = defineTopic({
	id: 'future-simple-for-beginners',
	level: 'beginner',
	title: 'Future Simple for beginners',
	subtitle: 'Майбутній простий час для початківців',
	rule: 'Future Simple: will + дієслово — рішення та прогнози на майбутнє.',
	sentences: [
		{
			id: 'future-simple-for-beginners-1',
			form: 'affirmative',
			prompt: 'Я подзвоню тобі завтра.',
			answer: 'I will call you tomorrow.',
			traps: {
				will: ['would', 'am', 'was'],
			},
		},
		{
			id: 'future-simple-for-beginners-2',
			form: 'affirmative',
			prompt: 'Вони прийдуть пізніше.',
			answer: 'They will come later.',
			traps: {
				come: ['came', 'comes', 'coming'],
			},
		},
	],
})
