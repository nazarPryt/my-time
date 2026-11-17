import { defineTopic } from '../../define-topic'

export const indefinitePronouns = defineTopic({
	id: 'indefinite-pronouns',
	level: 'intermediate',
	title: 'Indefinite pronouns',
	subtitle: 'Неозначені займенники',
	rule: 'some- у ствердженнях, any- у питаннях і запереченнях, no- означає «жоден».',
	sentences: [
		{
			id: 'indefinite-pronouns-1',
			form: 'affirmative',
			prompt: 'Хтось дзвонив.',
			answer: 'Somebody called.',
			traps: {
				Somebody: ['Anybody', 'Nobody', 'Everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-2',
			form: 'negative',
			prompt: 'Я нічого не бачу.',
			answer: "I can't see anything.",
			traps: {
				anything: ['something', 'nothing', 'everything'],
			},
		},
	],
})
