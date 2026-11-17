import { defineTopic } from '../../define-topic'

export const presentSimple = defineTopic({
	id: 'present-simple',
	level: 'beginner',
	title: 'Present Simple',
	subtitle: 'Теперішній простий час',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				'I/you/we/they + дієслово; he/she/it + дієслово із закінченням -s/-es.',
			examples: [
				{
					text: 'I work every day.',
					translation: 'Я працюю щодня.',
				},
				{
					text: 'She lives in Kyiv.',
					translation: 'Вона живе в Києві.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Do/Does + підмет + дієслово. Після does закінчення -s не додається.',
			examples: [
				{
					text: 'How do you play?',
					translation: 'Як ти граєш?',
				},
				{
					text: 'Where do they live?',
					translation: 'Де вони живуть?',
				},
				{
					text: 'Does he know you?',
					translation: 'Він тебе знає?',
				},
			],
		},
		{
			kind: 'negative',
			explanation: "don't/doesn't + дієслово без закінчення.",
			examples: [
				{
					text: "He doesn't need help.",
					translation: 'Йому не потрібна допомога.',
				},
				{
					text: "It doesn't mean anything.",
					translation: 'Це нічого не означає.',
				},
				{
					text: "I don't eat meat.",
					translation: "Я не їм м'яса.",
				},
			],
		},
	],
	sentences: [
		{
			id: 'present-simple-1',
			form: 'question',
			prompt: 'Як ти граєш?',
			answer: 'How do you play?',
			traps: {
				play: ['plays', 'played', 'playing'],
			},
		},
		{
			id: 'present-simple-2',
			form: 'negative',
			prompt: 'Йому не потрібна допомога.',
			answer: "He doesn't need help.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				need: ['needs', 'needed'],
			},
		},
	],
})
