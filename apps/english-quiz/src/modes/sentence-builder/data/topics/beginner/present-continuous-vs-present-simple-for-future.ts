import { defineTopic } from '../../define-topic'

export const presentContinuousVsPresentSimpleForFuture = defineTopic({
	id: 'present-continuous-vs-present-simple-for-future',
	level: 'beginner',
	title: 'Present Continuous vs Present Simple for the future',
	subtitle: 'Теперішній тривалий і простий час для майбутнього',
	rule: 'Present Continuous — домовленості на майбутнє; Present Simple — розклади.',
	sentences: [
		{
			id: 'present-continuous-vs-present-simple-for-future-1',
			form: 'affirmative',
			prompt: 'Завтра я зустрічаюся з Анною.',
			answer: 'I am meeting Anna tomorrow.',
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-2',
			form: 'affirmative',
			prompt: 'Потяг відправляється о шостій.',
			answer: 'The train leaves at six.',
			traps: {
				leaves: ['leave', 'left', 'leaving'],
			},
		},
	],
})
