import { defineTopic } from '../../define-topic'

export const presentPerfectVsPresentPerfectContinuous = defineTopic({
	id: 'present-perfect-vs-present-perfect-continuous',
	level: 'intermediate',
	title: 'Present Perfect vs Present Perfect Continuous',
	subtitle: 'Теперішній доконаний і доконано-тривалий час',
	rule: 'Present Perfect — результат дії; Present Perfect Continuous — її тривалість.',
	sentences: [
		{
			id: 'present-perfect-vs-present-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'Я написав три листи.',
			answer: 'I have written three letters.',
			traps: {
				written: ['wrote', 'write', 'writing'],
			},
		},
		{
			id: 'present-perfect-vs-present-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'Я пишу листи весь ранок.',
			answer: 'I have been writing letters all morning.',
		},
	],
})
