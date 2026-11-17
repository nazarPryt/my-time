import { defineTopic } from '../../define-topic'

export const passiveVoicePastSimple = defineTopic({
	id: 'passive-voice-past-simple',
	level: 'intermediate',
	title: 'Passive Voice - Past Simple',
	subtitle: 'Пасивний стан — минулий простий час',
	rule: 'was/were + третя форма — пасивний стан у минулому.',
	sentences: [
		{
			id: 'passive-voice-past-simple-1',
			form: 'affirmative',
			prompt: 'Цей міст збудували в 1990 році.',
			answer: 'This bridge was built in 1990.',
			traps: {
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-past-simple-2',
			form: 'affirmative',
			prompt: 'Листи надіслали вчора.',
			answer: 'The letters were sent yesterday.',
			traps: {
				were: ['was', 'are', 'did'],
			},
		},
	],
})
