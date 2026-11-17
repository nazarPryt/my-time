import { defineTopic } from '../../define-topic'

export const presentPerfectVsPastSimple = defineTopic({
	id: 'present-perfect-vs-past-simple',
	level: 'intermediate',
	title: 'Present Perfect vs Past Simple',
	subtitle: 'Теперішній доконаний і минулий простий час',
	rule: 'Present Perfect — без точного часу; Past Simple — з конкретним часом у минулому.',
	sentences: [
		{
			id: 'present-perfect-vs-past-simple-1',
			form: 'affirmative',
			prompt: 'Я бачив цей фільм.',
			answer: 'I have seen this film.',
			traps: {
				seen: ['saw', 'see', 'seed'],
			},
		},
		{
			id: 'present-perfect-vs-past-simple-2',
			form: 'affirmative',
			prompt: 'Я бачив його минулого тижня.',
			answer: 'I saw it last week.',
			traps: {
				saw: ['seen', 'see', 'seed'],
			},
		},
	],
})
