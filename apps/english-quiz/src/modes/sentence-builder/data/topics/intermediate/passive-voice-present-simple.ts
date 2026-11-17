import { defineTopic } from '../../define-topic'

export const passiveVoicePresentSimple = defineTopic({
	id: 'passive-voice-present-simple',
	level: 'intermediate',
	title: 'Passive Voice - Present Simple',
	subtitle: 'Пасивний стан — теперішній простий час',
	rule: 'am/is/are + третя форма — важлива дія, а не той, хто її виконує.',
	sentences: [
		{
			id: 'passive-voice-present-simple-1',
			form: 'affirmative',
			prompt: 'Англійською розмовляють у багатьох країнах.',
			answer: 'English is spoken in many countries.',
			traps: {
				spoken: ['speak', 'spoke', 'speaking'],
			},
		},
		{
			id: 'passive-voice-present-simple-2',
			form: 'affirmative',
			prompt: 'Ці машини виробляють в Японії.',
			answer: 'These cars are made in Japan.',
			traps: {
				made: ['make', 'makes', 'maked'],
			},
		},
	],
})
