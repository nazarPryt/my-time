import { defineTopic } from '../../define-topic'

export const presentContinuousVsPresentPerfect = defineTopic({
	id: 'present-continuous-vs-present-perfect',
	level: 'intermediate',
	title: 'Present Continuous vs Present Perfect',
	subtitle: 'Теперішній тривалий і теперішній доконаний час',
	rule: 'Present Continuous — дія відбувається зараз; Present Perfect — дія завершена, є результат.',
	sentences: [
		{
			id: 'present-continuous-vs-present-perfect-1',
			form: 'affirmative',
			prompt: 'Я роблю домашнє завдання.',
			answer: 'I am doing my homework.',
		},
		{
			id: 'present-continuous-vs-present-perfect-2',
			form: 'affirmative',
			prompt: 'Я зробив домашнє завдання.',
			answer: 'I have done my homework.',
			traps: {
				done: ['did', 'do', 'doing'],
			},
		},
	],
})
