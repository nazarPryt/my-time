import { defineTopics } from '../define-topics'

export const ADVANCED_TOPICS = defineTopics('advanced', [
	{
		id: 'tenses-with-present-meaning',
		title: 'Tenses with Present meaning',
		subtitle: 'Часи для вираження теперішнього',
		rule: 'Теперішнє виражають Present Simple, Continuous, Perfect і Perfect Continuous.',
		sentences: [
			["Я живу тут уже п'ять років.", 'I have lived here for five years.'],
			['Вона зараз розмовляє по телефону.', 'She is talking on the phone now.'],
		],
	},
	{
		id: 'participles',
		title: 'Participles',
		subtitle: 'Дієприкметники',
		rule: 'Participle I (-ing) — активна дія; Participle II (третя форма) — пасивний результат.',
		sentences: [
			[
				'Дівчинка, що сміється, — моя сестра.',
				'The laughing girl is my sister.',
				{ laughing: ['laughed', 'laughs', 'laugh'] },
			],
			[
				'Розбите вікно потребує ремонту.',
				'The broken window needs repair.',
				{ broken: ['breaking', 'broke', 'break'] },
			],
		],
	},
	{
		id: 'infinitive-and-gerund',
		title: 'Infinitive and Gerund',
		subtitle: 'Інфінітив і герундій',
		rule: 'Після одних дієслів іде інфінітив (want to go), після інших — герундій (enjoy going).',
		sentences: [
			['Я хочу піти.', 'I want to go.', { to: ['going', 'for', 'at'] }],
			[
				'Їй подобається читати.',
				'She enjoys reading.',
				{ reading: ['read', 'reads', 'to'] },
			],
		],
	},
	{
		id: 'inversion-ellipsis-substitution',
		title: 'Inversion, Ellipsis, Substitution',
		subtitle: 'Інверсія, еліпсис, заміна',
		rule: 'Інверсія змінює порядок слів для наголосу; еліпсис і заміна допомагають уникати повторів.',
		sentences: [
			[
				'Ніколи я такого не бачив.',
				'Never have I seen such a thing.',
				{ have: ['did', 'had', 'was'] },
			],
			['Я теж.', 'So do I.', { do: ['am', 'did', 'does'] }],
		],
	},
	{
		id: 'conditional-clauses',
		title: 'Conditional Clauses',
		subtitle: 'Умовні речення',
		rule: 'if + Present Simple → will (реальна умова); if + Past Simple → would (уявна умова).',
		sentences: [
			[
				'Якщо піде дощ, ми залишимося вдома.',
				'If it rains, we will stay at home.',
			],
			[
				'Якби я мав час, я б допоміг.',
				'If I had time, I would help.',
				{ would: ['will', 'had', 'did'] },
			],
		],
	},
	{
		id: 'past-perfect-continuous',
		title: 'Past Perfect Continuous',
		subtitle: 'Минулий доконано-тривалий час',
		rule: 'had been + -ing — дія тривала до певного моменту в минулому.',
		sentences: [
			[
				'Коли він прийшов, я чекав уже дві години.',
				'I had been waiting for two hours when he came.',
			],
			[
				'Вона була втомлена, бо працювала весь день.',
				'She was tired because she had been working all day.',
			],
		],
	},
	{
		id: 'sequence-of-tenses',
		title: 'Sequence of tenses',
		subtitle: 'Узгодження часів',
		rule: 'Якщо головне речення в минулому, час підрядного теж зсувається в минуле: is → was.',
		sentences: [
			[
				'Він сказав, що втомився.',
				'He said he was tired.',
				{ was: ['is', 'be', 'been'] },
			],
			[
				'Я думав, що ти знаєш.',
				'I thought you knew.',
				{ knew: ['know', 'knows', 'knowed'] },
			],
		],
	},
	{
		id: 'modal-verbs-shall-should',
		title: 'Modal verbs (Shall/Should)',
		subtitle: 'Модальні дієслова shall/should',
		rule: 'shall — пропозиція (Shall we go?); should — порада (You should rest).',
		sentences: [
			['Може, підемо?', 'Shall we go?'],
			[
				'Тобі слід відпочити.',
				'You should rest.',
				{ should: ['shall', 'would', 'did'] },
			],
		],
	},
	{
		id: 'modal-verbs-will-would',
		title: 'Modal verbs (Will/Would)',
		subtitle: 'Модальні дієслова will/would',
		rule: 'will — воля, обіцянка; would — ввічливе прохання або уявна ситуація.',
		sentences: [
			[
				'Чи не могли б ви зачинити двері?',
				'Would you close the door?',
				{ Would: ['Will', 'Should', 'Did'] },
			],
			['Я б випив кави.', 'I would like some coffee.'],
		],
	},
	{
		id: 'indirect-speech',
		title: 'Indirect speech',
		subtitle: 'Непряма мова',
		rule: 'Непряма мова передає чужі слова: часи зсуваються в минуле, займенники змінюються.',
		sentences: [
			[
				'Вона сказала, що кохає мене.',
				'She said that she loved me.',
				{ loved: ['loves', 'love', 'loving'] },
			],
			[
				'Він запитав, де я живу.',
				'He asked where I lived.',
				{ lived: ['live', 'lives', 'living'] },
			],
		],
	},
	{
		id: 'future-perfect-continuous',
		title: 'Future Perfect Continuous',
		subtitle: 'Майбутній доконано-тривалий час',
		rule: 'will have been + -ing — скільки часу дія триватиме до певного моменту в майбутньому.',
		sentences: [
			[
				'Наступного року буде десять років, як я тут працюю.',
				'Next year I will have been working here for ten years.',
			],
			[
				'До червня вона навчатиметься тут уже рік.',
				'By June she will have been studying here for a year.',
			],
		],
	},
	{
		id: 'future-continuous-vs-future-perfect-continuous',
		title: 'Future Continuous vs Future Perfect Continuous',
		subtitle: 'Майбутній тривалий і доконано-тривалий час',
		rule: 'Future Continuous — дія в процесі в певний момент; Future Perfect Continuous — її тривалість до цього моменту.',
		sentences: [
			['О шостій я ще працюватиму.', 'At six I will still be working.'],
			[
				'О шостій я працюватиму вже вісім годин.',
				'At six I will have been working for eight hours.',
			],
		],
	},
	{
		id: 'tenses-with-past-meaning',
		title: 'Tenses with Past meaning',
		subtitle: 'Часи для вираження минулого',
		rule: 'Минуле виражають Past Simple, Continuous, Perfect і Perfect Continuous.',
		sentences: [
			[
				'Учора я ходив у театр.',
				'Yesterday I went to the theatre.',
				{ went: ['go', 'gone', 'goed'] },
			],
			['Я спав, коли ти подзвонив.', 'I was sleeping when you called.'],
		],
	},
	{
		id: 'tenses-with-future-meaning',
		title: 'Tenses with future meaning',
		subtitle: 'Часи для вираження майбутнього',
		rule: 'Майбутнє виражають will, be going to, Present Continuous і Present Simple (розклади).',
		sentences: [
			['Я подзвоню тобі пізніше.', 'I will call you later.'],
			['Ми збираємося купити будинок.', 'We are going to buy a house.'],
		],
	},
	{
		id: 'past-perfect-passive',
		title: 'Past perfect passive',
		subtitle: 'Минулий доконаний час (пасив)',
		rule: 'had been + третя форма — дію над предметом завершено до моменту в минулому.',
		sentences: [
			[
				'Будинок уже був проданий.',
				'The house had already been sold.',
				{ sold: ['sell', 'selled', 'sells'] },
			],
			[
				'Лист написали ще до того, як він прийшов.',
				'The letter had been written before he came.',
			],
		],
	},
	{
		id: 'future-perfect-passive',
		title: 'Future perfect passive',
		subtitle: 'Майбутній доконаний час (пасив)',
		rule: 'will have been + третя форма — дію над предметом завершать до моменту в майбутньому.',
		sentences: [
			[
				'До понеділка звіт буде готовий.',
				'The report will have been finished by Monday.',
			],
			['Міст збудують до літа.', 'The bridge will have been built by summer.'],
		],
	},
	{
		id: 'present-past-continuous-passive',
		title: 'Present/Past Continuous Passive',
		subtitle: 'Теперішній і минулий тривалий час (пасив)',
		rule: 'am/is/are/was/were being + третя форма — дію над предметом виконують зараз або виконували тоді.',
		sentences: [
			[
				'Мою машину зараз ремонтують.',
				'My car is being repaired now.',
				{ being: ['been', 'be', 'is'] },
			],
			[
				'Коли ми приїхали, будинок фарбували.',
				'The house was being painted when we arrived.',
			],
		],
	},
	{
		id: 'sixteen-english-tenses',
		title: '16 English tenses',
		subtitle: '16 часів англійської мови',
		rule: 'Чотири групи (Simple, Continuous, Perfect, Perfect Continuous) у теперішньому, минулому, майбутньому та майбутньому в минулому.',
		sentences: [
			['Я працюю щодня.', 'I work every day.'],
			['Я працюватиму весь день.', 'I will be working all day.'],
		],
	},
])
