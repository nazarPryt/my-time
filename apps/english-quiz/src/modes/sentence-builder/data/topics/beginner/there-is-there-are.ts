import { defineTopic } from '../../define-topic'

export const thereIsThereAre = defineTopic({
	id: 'there-is-there-are',
	level: 'beginner',
	title: 'There is / There are',
	subtitle: 'Конструкція There is / There are',
	rule: 'There is / There are повідомляє, що щось є (існує) в певному місці.',
	sentences: [
		{
			id: 'there-is-there-are-1',
			form: 'affirmative',
			prompt: 'У кімнаті є стілець.',
			answer: 'There is a chair in the room.',
		},
		{
			id: 'there-is-there-are-2',
			form: 'question',
			prompt: 'Чи є тут магазини?',
			answer: 'Are there any shops here?',
			traps: {
				Are: ['Is', 'Am', 'Do'],
			},
		},
	],
})
