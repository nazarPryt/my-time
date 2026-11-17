import { defineTopic } from '../../define-topic'

export const inversionEllipsisSubstitution = defineTopic({
	id: 'inversion-ellipsis-substitution',
	level: 'advanced',
	title: 'Inversion, Ellipsis, Substitution',
	subtitle: 'Інверсія, еліпсис, заміна',
	rule: 'Інверсія змінює порядок слів для наголосу; еліпсис і заміна допомагають уникати повторів.',
	sentences: [
		{
			id: 'inversion-ellipsis-substitution-1',
			form: 'negative',
			prompt: 'Ніколи я такого не бачив.',
			answer: 'Never have I seen such a thing.',
			traps: {
				have: ['did', 'had', 'was'],
			},
		},
		{
			id: 'inversion-ellipsis-substitution-2',
			form: 'affirmative',
			prompt: 'Я теж.',
			answer: 'So do I.',
			traps: {
				do: ['am', 'did', 'does'],
			},
		},
	],
})
