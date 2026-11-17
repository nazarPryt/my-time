import { defineTopic } from '../../define-topic'

export const passiveVoiceFutureSimple = defineTopic({
	id: 'passive-voice-future-simple',
	level: 'intermediate',
	title: 'Passive Voice - Future Simple',
	subtitle: 'Пасивний стан — майбутній простий час',
	rule: 'will be + третя форма — пасивний стан у майбутньому.',
	sentences: [
		{
			id: 'passive-voice-future-simple-1',
			form: 'affirmative',
			prompt: 'Роботу закінчать завтра.',
			answer: 'The work will be finished tomorrow.',
			traps: {
				be: ['is', 'are', 'been'],
			},
		},
		{
			id: 'passive-voice-future-simple-2',
			form: 'affirmative',
			prompt: 'Тебе запросять.',
			answer: 'You will be invited.',
			traps: {
				invited: ['invite', 'invites', 'inviting'],
			},
		},
	],
})
