import { defineTopics } from '../define-topics'

export const BEGINNER_TOPICS = defineTopics('beginner', [
	{
		id: 'present-simple-for-beginners',
		title: 'Present Simple for beginners',
		subtitle: 'Теперішній простий час для початківців',
		rule: 'Present Simple описує звички й постійні факти: I work, she works.',
		sentences: [
			[
				'Я працюю вдома.',
				'I work at home.',
				{ work: ['works', 'worked', 'working'] },
			],
			[
				'Вона любить каву.',
				'She likes coffee.',
				{ likes: ['like', 'liked', 'liking'] },
			],
		],
	},
	{
		id: 'future-simple-for-beginners',
		title: 'Future Simple for beginners',
		subtitle: 'Майбутній простий час для початківців',
		rule: 'Future Simple: will + дієслово — рішення та прогнози на майбутнє.',
		sentences: [
			[
				'Я подзвоню тобі завтра.',
				'I will call you tomorrow.',
				{ will: ['would', 'am', 'was'] },
			],
			[
				'Вони прийдуть пізніше.',
				'They will come later.',
				{ come: ['came', 'comes', 'coming'] },
			],
		],
	},
	{
		id: 'present-continuous-for-beginners',
		title: 'Present Continuous for beginners',
		subtitle: 'Теперішній тривалий час для початківців',
		rule: 'Present Continuous: am/is/are + дієслово з -ing — дія відбувається зараз.',
		sentences: [
			[
				'Я читаю книжку.',
				'I am reading a book.',
				{ reading: ['read', 'reads', 'readed'] },
			],
			['Він зараз спить.', 'He is sleeping now.', { is: ['are', 'am', 'be'] }],
		],
	},
	{
		id: 'there-is-there-are-for-beginners',
		title: 'There is / There are for beginners',
		subtitle: 'Конструкція There is / There are для початківців',
		rule: 'There is — коли предмет один, there are — коли їх кілька.',
		sentences: [
			[
				'На столі є яблуко.',
				'There is an apple on the table.',
				{ is: ['are', 'am', 'be'] },
			],
			[
				'У парку є діти.',
				'There are children in the park.',
				{ are: ['is', 'am', 'be'] },
			],
		],
	},
	{
		id: 'present-simple',
		title: 'Present Simple',
		subtitle: 'Теперішній простий час',
		rule: [
			{
				kind: 'affirmative',
				explanation:
					'I/you/we/they + дієслово; he/she/it + дієслово із закінченням -s/-es.',
				examples: [
					{ text: 'I work every day.', translation: 'Я працюю щодня.' },
					{ text: 'She lives in Kyiv.', translation: 'Вона живе в Києві.' },
				],
			},
			{
				kind: 'question',
				explanation:
					'Do/Does + підмет + дієслово. Після does закінчення -s не додається.',
				examples: [
					{ text: 'How do you play?', translation: 'Як ти граєш?' },
					{ text: 'Where do they live?', translation: 'Де вони живуть?' },
					{ text: 'Does he know you?', translation: 'Він тебе знає?' },
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
					{ text: "I don't eat meat.", translation: "Я не їм м'яса." },
				],
			},
		],
		sentences: [
			[
				'Як ти граєш?',
				'How do you play?',
				{ play: ['plays', 'played', 'playing'] },
			],
			[
				'Йому не потрібна допомога.',
				"He doesn't need help.",
				{ "doesn't": ["don't", "isn't", "didn't"], need: ['needs', 'needed'] },
			],
		],
	},
	{
		id: 'past-simple',
		title: 'Past Simple',
		subtitle: 'Минулий простий час',
		rule: 'Past Simple — завершена дія в минулому: worked, went. Питання й заперечення — з did.',
		sentences: [
			[
				'Я бачив його вчора.',
				'I saw him yesterday.',
				{ saw: ['see', 'seen', 'seed'] },
			],
			[
				'Ми не ходили в кіно.',
				"We didn't go to the cinema.",
				{ go: ['went', 'gone', 'goes'] },
			],
		],
	},
	{
		id: 'future-simple',
		title: 'Future Simple',
		subtitle: 'Майбутній простий час',
		rule: "will + дієслово — обіцянки, прогнози, спонтанні рішення. Заперечення — won't.",
		sentences: [
			[
				'Я допоможу тобі.',
				'I will help you.',
				{ help: ['helps', 'helped', 'helping'] },
			],
			[
				'Вона не запізниться.',
				"She won't be late.",
				{ "won't": ["don't", "isn't", "wasn't"] },
			],
		],
	},
	{
		id: 'numerals',
		title: 'Numerals',
		subtitle: 'Числівники',
		rule: 'Кількісні числівники відповідають на питання «скільки?»: one, two, twenty-one.',
		sentences: [
			[
				'У мене два брати.',
				'I have two brothers.',
				{ two: ['second', 'twice', 'too'] },
			],
			[
				'Їй двадцять років.',
				'She is twenty years old.',
				{ twenty: ['twelve', 'twentieth'] },
			],
		],
	},
	{
		id: 'present-continuous',
		title: 'Present Continuous',
		subtitle: 'Теперішній тривалий час',
		rule: 'am/is/are + -ing — дія відбувається зараз або в цей період.',
		sentences: [
			[
				'Що ти робиш?',
				'What are you doing?',
				{ doing: ['do', 'does', 'done'] },
			],
			[
				'Вони зараз не працюють.',
				"They aren't working now.",
				{ "aren't": ["isn't", "don't", "doesn't"] },
			],
		],
	},
	{
		id: 'ordinal-numbers',
		title: 'Ordinal numbers',
		subtitle: 'Порядкові числівники',
		rule: 'Порядкові числівники: first, second, third, далі закінчення -th: fourth, fifth.',
		sentences: [
			[
				'Це мій перший день.',
				'It is my first day.',
				{ first: ['one', 'firstly', 'oneth'] },
			],
			[
				'Він живе на третьому поверсі.',
				'He lives on the third floor.',
				{ third: ['three', 'thirdth', 'threeth'] },
			],
		],
	},
	{
		id: 'personal-pronouns',
		title: 'Personal pronouns',
		subtitle: 'Особові займенники',
		rule: 'I, you, he, she, it, we, they — підмет; me, him, her, us, them — додаток.',
		sentences: [
			['Вона мене знає.', 'She knows me.', { me: ['I', 'my', 'mine'] }],
			['Ми бачили їх.', 'We saw them.', { them: ['they', 'their', 'theirs'] }],
		],
	},
	{
		id: 'articles',
		title: 'Articles',
		subtitle: 'Артиклі',
		rule: 'a/an — один із багатьох або згаданий уперше; the — конкретний, уже відомий предмет.',
		sentences: [
			['У мене є собака.', 'I have a dog.', { a: ['an', 'the'] }],
			['Сонце яскраве.', 'The sun is bright.', { The: ['A', 'An'] }],
		],
	},
	{
		id: 'there-is-there-are',
		title: 'There is / There are',
		subtitle: 'Конструкція There is / There are',
		rule: 'There is / There are повідомляє, що щось є (існує) в певному місці.',
		sentences: [
			['У кімнаті є стілець.', 'There is a chair in the room.'],
			[
				'Чи є тут магазини?',
				'Are there any shops here?',
				{ Are: ['Is', 'Am', 'Do'] },
			],
		],
	},
	{
		id: 'possessive-pronouns',
		title: 'Possessive pronouns',
		subtitle: 'Присвійні займенники',
		rule: 'my, your, his, her, its, our, their — перед іменником; mine, yours, ours… — без нього.',
		sentences: [
			['Це моя сумка.', 'This is my bag.', { my: ['me', 'mine', 'I'] }],
			['Ця книжка твоя.', 'This book is yours.', { yours: ['your', 'you'] }],
		],
	},
	{
		id: 'imperative-mood',
		title: 'Imperative mood',
		subtitle: 'Наказовий спосіб',
		rule: "Наказовий спосіб — дієслово без підмета: Open the door. Заперечення — Don't.",
		sentences: [
			[
				'Відчини вікно.',
				'Open the window.',
				{ Open: ['Opens', 'Opened', 'Opening'] },
			],
			[
				'Не запізнюйся.',
				"Don't be late.",
				{ "Don't": ["Doesn't", 'Not', 'No'] },
			],
		],
	},
	{
		id: 'to-be-going-to',
		title: 'To be going to',
		subtitle: 'Конструкція to be going to',
		rule: 'am/is/are going to + дієслово — заплановані дії та очевидні прогнози.',
		sentences: [
			[
				'Я збираюся вчити англійську.',
				'I am going to learn English.',
				{ going: ['go', 'gone', 'went'] },
			],
			['Збирається на дощ.', 'It is going to rain.'],
		],
	},
	{
		id: 'general-questions',
		title: 'General questions',
		subtitle: 'Загальні питання',
		rule: 'Загальні питання починаються з допоміжного дієслова й мають відповідь «так» або «ні».',
		sentences: [
			['Ти любиш чай?', 'Do you like tea?', { Do: ['Does', 'Are', 'Is'] }],
			['Вона вдома?', 'Is she at home?', { Is: ['Are', 'Does', 'Do'] }],
		],
	},
	{
		id: 'modal-verbs-can-could',
		title: 'Modal verbs (Can/Could)',
		subtitle: 'Модальні дієслова can/could',
		rule: 'can — можу, вмію зараз; could — міг у минулому або ввічливе прохання.',
		sentences: [
			[
				'Я вмію плавати.',
				'I can swim.',
				{ swim: ['swims', 'swimming', 'swam'] },
			],
			[
				'Чи не могли б ви мені допомогти?',
				'Could you help me?',
				{ Could: ['Would', 'Should', 'Did'] },
			],
		],
	},
	{
		id: 'present-simple-vs-present-continuous',
		title: 'Present Simple vs Present Continuous',
		subtitle: 'Теперішній простий і теперішній тривалий час',
		rule: 'Present Simple — звички й факти; Present Continuous — те, що відбувається саме зараз.',
		sentences: [
			[
				'Він зазвичай ходить на роботу пішки.',
				'He usually walks to work.',
				{ walks: ['walk', 'walking', 'walked'] },
			],
			[
				'Сьогодні він їде автобусом.',
				'Today he is taking the bus.',
				{ taking: ['takes', 'take', 'took'] },
			],
		],
	},
	{
		id: 'present-continuous-vs-present-simple-for-future',
		title: 'Present Continuous vs Present Simple for the future',
		subtitle: 'Теперішній тривалий і простий час для майбутнього',
		rule: 'Present Continuous — домовленості на майбутнє; Present Simple — розклади.',
		sentences: [
			['Завтра я зустрічаюся з Анною.', 'I am meeting Anna tomorrow.'],
			[
				'Потяг відправляється о шостій.',
				'The train leaves at six.',
				{ leaves: ['leave', 'left', 'leaving'] },
			],
		],
	},
])
