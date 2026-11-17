import { defineTopic } from '../../define-topic'

export const futurePerfectContinuous = defineTopic({
	id: 'future-perfect-continuous',
	level: 'advanced',
	title: 'Future Perfect Continuous',
	subtitle: 'Майбутній доконано-тривалий час',
	rule: 'will have been + -ing — скільки часу дія триватиме до певного моменту в майбутньому.',
	sentences: [
		{
			id: 'future-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'Наступного року буде десять років, як я тут працюю.',
			answer: 'Next year I will have been working here for ten years.',
		},
		{
			id: 'future-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'До червня вона навчатиметься тут уже рік.',
			answer: 'By June she will have been studying here for a year.',
		},
	],
})
