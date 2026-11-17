import { defineTopic } from '../../define-topic'

export const usedTo = defineTopic({
	id: 'used-to',
	level: 'intermediate',
	title: 'Used to',
	subtitle: 'Конструкція used to',
	rule: 'used to + дієслово — звичка в минулому, якої вже немає.',
	sentences: [
		{
			id: 'used-to-1',
			form: 'affirmative',
			prompt: 'Раніше я жив у Львові.',
			answer: 'I used to live in Lviv.',
			traps: {
				used: ['use', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-2',
			form: 'affirmative',
			prompt: 'Раніше він курив.',
			answer: 'He used to smoke.',
		},
	],
})
