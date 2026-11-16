import { defineTopics } from '../define-topics'

export const INTERMEDIATE_TOPICS = defineTopics('intermediate', [
	{
		id: 'past-continuous',
		title: 'Past Continuous',
		subtitle: 'Минулий тривалий час',
		rule: 'was/were + -ing — дія тривала в певний момент у минулому.',
		sentences: [
			[
				'О десятій я спав.',
				'I was sleeping at ten.',
				{ was: ['were', 'am', 'is'] },
			],
			[
				'Що ви робили вчора ввечері?',
				'What were you doing last night?',
				{ were: ['was', 'did', 'are'] },
			],
		],
	},
	{
		id: 'present-perfect',
		title: 'Present Perfect',
		subtitle: 'Теперішній доконаний час',
		rule: 'have/has + третя форма дієслова — результат дії важливий зараз.',
		sentences: [
			[
				'Я вже поїв.',
				'I have already eaten.',
				{ eaten: ['ate', 'eat', 'eated'] },
			],
			[
				'Ти коли-небудь був у Лондоні?',
				'Have you ever been to London?',
				{ been: ['was', 'be', 'gone'] },
			],
		],
	},
	{
		id: 'past-perfect',
		title: 'Past Perfect',
		subtitle: 'Минулий доконаний час',
		rule: 'had + третя форма — дія завершилася раніше за іншу дію в минулому.',
		sentences: [
			[
				'Потяг уже поїхав.',
				'The train had already left.',
				{ left: ['leaved', 'leave', 'leaves'] },
			],
			[
				'Вона пішла ще до того, як я прийшов.',
				'She had left before I came.',
				{ came: ['come', 'comes', 'coming'] },
			],
		],
	},
	{
		id: 'future-in-the-past',
		title: 'Future in the Past',
		subtitle: 'Майбутнє в минулому',
		rule: 'would + дієслово — майбутнє з погляду минулого: He said he would come.',
		sentences: [
			[
				'Він сказав, що прийде.',
				'He said he would come.',
				{ would: ['will', 'was', 'did'] },
			],
			['Я знав, що вона подзвонить.', 'I knew she would call.'],
		],
	},
	{
		id: 'passive-voice-present-simple',
		title: 'Passive Voice - Present Simple',
		subtitle: 'Пасивний стан — теперішній простий час',
		rule: 'am/is/are + третя форма — важлива дія, а не той, хто її виконує.',
		sentences: [
			[
				'Англійською розмовляють у багатьох країнах.',
				'English is spoken in many countries.',
				{ spoken: ['speak', 'spoke', 'speaking'] },
			],
			[
				'Ці машини виробляють в Японії.',
				'These cars are made in Japan.',
				{ made: ['make', 'makes', 'maked'] },
			],
		],
	},
	{
		id: 'present-perfect-continuous',
		title: 'Present Perfect Continuous',
		subtitle: 'Теперішній доконано-тривалий час',
		rule: 'have/has been + -ing — дія почалася в минулому й триває досі.',
		sentences: [
			[
				'Я чекаю вже годину.',
				'I have been waiting for an hour.',
				{ waiting: ['wait', 'waited', 'waits'] },
			],
			[
				'Вона вчить англійську вже два роки.',
				'She has been learning English for two years.',
				{ has: ['have', 'is', 'was'] },
			],
		],
	},
	{
		id: 'adverbs',
		title: 'Adverbs',
		subtitle: 'Прислівники',
		rule: 'Прислівники описують, як відбувається дія; часто утворюються з -ly: quick → quickly.',
		sentences: [
			[
				'Він говорить повільно.',
				'He speaks slowly.',
				{ slowly: ['slow', 'slower', 'slowness'] },
			],
			[
				'Вона добре співає.',
				'She sings well.',
				{ well: ['good', 'goodly', 'better'] },
			],
		],
	},
	{
		id: 'passive-voice-past-simple',
		title: 'Passive Voice - Past Simple',
		subtitle: 'Пасивний стан — минулий простий час',
		rule: 'was/were + третя форма — пасивний стан у минулому.',
		sentences: [
			[
				'Цей міст збудували в 1990 році.',
				'This bridge was built in 1990.',
				{ built: ['build', 'builded', 'building'] },
			],
			[
				'Листи надіслали вчора.',
				'The letters were sent yesterday.',
				{ were: ['was', 'are', 'did'] },
			],
		],
	},
	{
		id: 'past-simple-vs-past-perfect',
		title: 'Past Simple vs Past Perfect',
		subtitle: 'Минулий простий і минулий доконаний час',
		rule: 'Past Simple — послідовні події; Past Perfect — те, що сталося раніше за іншу подію.',
		sentences: [
			[
				'Коли я прийшов, фільм уже почався.',
				'When I arrived the film had already started.',
				{ had: ['has', 'have', 'was'] },
			],
			['Я загубив ключ, який купив.', 'I lost the key that I had bought.'],
		],
	},
	{
		id: 'present-perfect-vs-present-perfect-continuous',
		title: 'Present Perfect vs Present Perfect Continuous',
		subtitle: 'Теперішній доконаний і доконано-тривалий час',
		rule: 'Present Perfect — результат дії; Present Perfect Continuous — її тривалість.',
		sentences: [
			[
				'Я написав три листи.',
				'I have written three letters.',
				{ written: ['wrote', 'write', 'writing'] },
			],
			['Я пишу листи весь ранок.', 'I have been writing letters all morning.'],
		],
	},
	{
		id: 'present-continuous-vs-present-perfect',
		title: 'Present Continuous vs Present Perfect',
		subtitle: 'Теперішній тривалий і теперішній доконаний час',
		rule: 'Present Continuous — дія відбувається зараз; Present Perfect — дія завершена, є результат.',
		sentences: [
			['Я роблю домашнє завдання.', 'I am doing my homework.'],
			[
				'Я зробив домашнє завдання.',
				'I have done my homework.',
				{ done: ['did', 'do', 'doing'] },
			],
		],
	},
	{
		id: 'passive-voice-future-simple',
		title: 'Passive Voice - Future Simple',
		subtitle: 'Пасивний стан — майбутній простий час',
		rule: 'will be + третя форма — пасивний стан у майбутньому.',
		sentences: [
			[
				'Роботу закінчать завтра.',
				'The work will be finished tomorrow.',
				{ be: ['is', 'are', 'been'] },
			],
			[
				'Тебе запросять.',
				'You will be invited.',
				{ invited: ['invite', 'invites', 'inviting'] },
			],
		],
	},
	{
		id: 'passive-voice-present-perfect',
		title: 'Passive Voice - Present Perfect',
		subtitle: 'Пасивний стан — теперішній доконаний час',
		rule: 'have/has been + третя форма — дію вже виконано, виконавець неважливий.',
		sentences: [
			[
				'Мою машину вкрали.',
				'My car has been stolen.',
				{ stolen: ['stole', 'steal', 'stealed'] },
			],
			[
				'Усі квитки вже продано.',
				'All the tickets have been sold.',
				{ sold: ['sell', 'selled', 'sells'] },
			],
		],
	},
	{
		id: 'wh-questions',
		title: 'Wh-questions',
		subtitle: 'Спеціальні питання',
		rule: 'Спеціальні питання починаються з who, what, where, when, why або how.',
		sentences: [
			[
				'Де ти живеш?',
				'Where do you live?',
				{ Where: ['What', 'When', 'Who'] },
			],
			[
				'Чому вона плаче?',
				'Why is she crying?',
				{ Why: ['What', 'Who', 'Which'] },
			],
		],
	},
	{
		id: 'present-perfect-vs-past-simple',
		title: 'Present Perfect vs Past Simple',
		subtitle: 'Теперішній доконаний і минулий простий час',
		rule: 'Present Perfect — без точного часу; Past Simple — з конкретним часом у минулому.',
		sentences: [
			[
				'Я бачив цей фільм.',
				'I have seen this film.',
				{ seen: ['saw', 'see', 'seed'] },
			],
			[
				'Я бачив його минулого тижня.',
				'I saw it last week.',
				{ saw: ['seen', 'see', 'seed'] },
			],
		],
	},
	{
		id: 'past-simple-vs-past-continuous',
		title: 'Past Simple vs Past Continuous',
		subtitle: 'Минулий простий і минулий тривалий час',
		rule: 'Past Continuous — тривала дія; Past Simple — коротка дія, що її перервала.',
		sentences: [
			['Я читав, коли він подзвонив.', 'I was reading when he called.'],
			[
				'Ми вечеряли, коли згасло світло.',
				'We were having dinner when the lights went out.',
			],
		],
	},
	{
		id: 'comparative-degree-of-adjectives',
		title: 'Comparative degree of adjectives',
		subtitle: 'Вищий ступінь порівняння прикметників',
		rule: 'Короткі прикметники + -er, довгі — з more: bigger, more interesting.',
		sentences: [
			[
				'Мій брат вищий за мене.',
				'My brother is taller than me.',
				{ taller: ['tall', 'tallest', 'more'] },
			],
			[
				'Ця книжка цікавіша.',
				'This book is more interesting.',
				{ more: ['most', 'much', 'very'] },
			],
		],
	},
	{
		id: 'superlative-degree-of-adjectives',
		title: 'Superlative degree of adjectives',
		subtitle: 'Найвищий ступінь порівняння прикметників',
		rule: 'the + прикметник із -est або the most: the biggest, the most beautiful.',
		sentences: [
			[
				'Це найвища гора.',
				'This is the highest mountain.',
				{ highest: ['higher', 'high', 'most'] },
			],
			[
				'Вона найрозумніша в класі.',
				'She is the smartest in the class.',
				{ smartest: ['smarter', 'smart', 'most'] },
			],
		],
	},
	{
		id: 'used-to',
		title: 'Used to',
		subtitle: 'Конструкція used to',
		rule: 'used to + дієслово — звичка в минулому, якої вже немає.',
		sentences: [
			[
				'Раніше я жив у Львові.',
				'I used to live in Lviv.',
				{ used: ['use', 'uses', 'using'] },
			],
			['Раніше він курив.', 'He used to smoke.'],
		],
	},
	{
		id: 'modal-verbs-must-have-to',
		title: 'Modal verbs (Must/Have to)',
		subtitle: 'Модальні дієслова must/have to',
		rule: "must — внутрішній обов'язок; have to — обов'язок через обставини.",
		sentences: [
			['Я мушу йти.', 'I must go.', { go: ['going', 'goes', 'went'] }],
			[
				'Їй доводиться рано вставати.',
				'She has to get up early.',
				{ has: ['have', 'must', 'is'] },
			],
		],
	},
	{
		id: 'modal-verbs-may-might',
		title: 'Modal verbs (May/Might)',
		subtitle: 'Модальні дієслова may/might',
		rule: 'may/might — можливість або дозвіл; might — менш імовірна можливість.',
		sentences: [
			['Можна мені увійти?', 'May I come in?'],
			[
				'Можливо, сьогодні піде дощ.',
				'It might rain today.',
				{ rain: ['rains', 'raining', 'rained'] },
			],
		],
	},
	{
		id: 'future-perfect',
		title: 'Future Perfect',
		subtitle: 'Майбутній доконаний час',
		rule: 'will have + третя форма — дія завершиться до певного моменту в майбутньому.',
		sentences: [
			["До п'ятниці я закінчу.", 'I will have finished by Friday.'],
			[
				'Коли ми приїдемо, вони вже поїдуть.',
				'They will have left by the time we arrive.',
			],
		],
	},
	{
		id: 'future-continuous',
		title: 'Future Continuous',
		subtitle: 'Майбутній тривалий час',
		rule: 'will be + -ing — дія триватиме в певний момент у майбутньому.',
		sentences: [
			[
				'Завтра о восьмій я працюватиму.',
				'I will be working at eight tomorrow.',
			],
			[
				'Ти користуватимешся машиною?',
				'Will you be using the car?',
				{ using: ['use', 'used', 'uses'] },
			],
		],
	},
	{
		id: 'prepositions',
		title: 'Prepositions',
		subtitle: 'Прийменники',
		rule: 'in — всередині, on — на поверхні, at — у точці або місці події.',
		sentences: [
			[
				'Ключі на столі.',
				'The keys are on the table.',
				{ on: ['in', 'at', 'under'] },
			],
			[
				'Я народився в травні.',
				'I was born in May.',
				{ in: ['on', 'at', 'by'] },
			],
		],
	},
	{
		id: 'verbs-with-prepositions',
		title: 'Verbs with prepositions',
		subtitle: 'Дієслова з прийменниками',
		rule: 'Деякі дієслова завжди вживаються з певним прийменником: listen to, wait for.',
		sentences: [
			[
				'Я слухаю музику.',
				'I am listening to music.',
				{ to: ['at', 'for', 'on'] },
			],
			[
				'Ми чекаємо на автобус.',
				'We are waiting for the bus.',
				{ for: ['to', 'at', 'on'] },
			],
		],
	},
	{
		id: 'phrasal-verbs',
		title: 'Phrasal verbs',
		subtitle: 'Фразові дієслова',
		rule: 'Фразове дієслово = дієслово + частка, і значення часто змінюється: give up — здаватися.',
		sentences: [
			['Не здавайся.', "Don't give up.", { up: ['in', 'on', 'off'] }],
			[
				'Я шукаю свої ключі.',
				'I am looking for my keys.',
				{ for: ['at', 'after', 'up'] },
			],
		],
	},
	{
		id: 'order-of-adjectives',
		title: 'Order of adjectives',
		subtitle: 'Порядок прикметників',
		rule: 'Порядок: думка → розмір → вік → форма → колір → походження → матеріал.',
		sentences: [
			['У неї гарна маленька собака.', 'She has a nice little dog.'],
			[
				'Він купив стару червону машину.',
				'He bought an old red car.',
				{ an: ['a', 'the'] },
			],
		],
	},
	{
		id: 'indefinite-pronouns',
		title: 'Indefinite pronouns',
		subtitle: 'Неозначені займенники',
		rule: 'some- у ствердженнях, any- у питаннях і запереченнях, no- означає «жоден».',
		sentences: [
			[
				'Хтось дзвонив.',
				'Somebody called.',
				{ Somebody: ['Anybody', 'Nobody', 'Everybody'] },
			],
			[
				'Я нічого не бачу.',
				"I can't see anything.",
				{ anything: ['something', 'nothing', 'everything'] },
			],
		],
	},
])
