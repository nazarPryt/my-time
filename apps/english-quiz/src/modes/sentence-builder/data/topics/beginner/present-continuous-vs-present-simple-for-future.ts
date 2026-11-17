import { defineTopic } from '../../define-topic'

export const presentContinuousVsPresentSimpleForFuture = defineTopic({
	id: 'present-continuous-vs-present-simple-for-future',
	level: 'beginner',
	title: 'Present Continuous vs Present Simple for the future',
	subtitle: 'Теперішній тривалий і простий час для майбутнього',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Present Continuous — особисті домовленості на майбутнє: вже узгоджено з іншими людьми, є час, місце, куплені квитки. Present Simple — розклади й графіки: потяги, рейси, фільми, уроки, години роботи магазинів.',
			examples: [
				{
					text: "I'm visiting my aunt on Sunday.",
					translation: 'У неділю я відвідую тітку.',
				},
				{
					text: 'The bus to the airport leaves at eight.',
					translation: 'Автобус до аеропорту відходить о восьмій.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Домовленість: am/is/are + дієслово з -ing (I'm meeting, she is flying). Розклад: дієслово в Present Simple, з -s/-es для he/she/it (the film starts, the shop opens).",
			examples: [
				{
					text: "We're having a barbecue with the neighbours on Sunday.",
					translation: 'У неділю ми смажимо шашлики із сусідами.',
				},
				{
					text: 'The gym opens at six.',
					translation: 'Спортзал відчиняється о шостій.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Домовленість: Am/Is/Are + підмет + дієслово з -ing. Розклад: Do/Does + підмет + дієслово без закінчення.',
			examples: [
				{
					text: 'Are you seeing Mark on Monday?',
					translation: 'Ти бачишся з Марком у понеділок?',
				},
				{
					text: 'What time does the play begin?',
					translation: 'О котрій починається вистава?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Домовленість: am not / isn't / aren't + дієслово з -ing. Розклад: don't/doesn't + дієслово без закінчення.",
			examples: [
				{
					text: "I'm not driving to the wedding.",
					translation: 'Я не їду на весілля машиною.',
				},
				{
					text: "The shop doesn't open tomorrow.",
					translation: 'Завтра магазин не відчиняється.',
				},
			],
		},
	],
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
		{
			id: 'present-continuous-vs-present-simple-for-future-3',
			form: 'affirmative',
			prompt: "Я зустрічаюся з Тарасом у п'ятницю ввечері.",
			answer: "I'm meeting Taras on Friday evening.",
			traps: {
				meeting: ['meet', 'meets', 'met'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-4',
			form: 'affirmative',
			prompt: 'Ми летимо до Риму в суботу.',
			answer: "We're flying to Rome on Saturday.",
			traps: {
				flying: ['fly', 'flies', 'flew'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-5',
			form: 'affirmative',
			prompt: 'Моя сестра виходить заміж у червні.',
			answer: 'My sister is getting married in June.',
			traps: {
				is: ['are', 'does', 'am'],
				getting: ['get', 'gets', 'got'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-6',
			form: 'affirmative',
			prompt: 'Мої батьки приїжджають у неділю.',
			answer: 'My parents are coming on Sunday.',
			accept: ['My parents are {coming|arriving} on Sunday.'],
			traps: {
				are: ['is', 'do', 'am'],
				coming: ['come', 'comes', 'came'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-7',
			form: 'affirmative',
			prompt: 'Я вечеряю з Іваном у четвер.',
			answer: "I'm having dinner with Ivan on Thursday.",
			traps: {
				having: ['have', 'has', 'had'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-8',
			form: 'affirmative',
			prompt: 'Вона грає в теніс з Оленою в понеділок.',
			answer: 'She is playing tennis with Olena on Monday.',
			accept: ["She's playing tennis with Olena on Monday."],
			traps: {
				is: ['are', 'does', 'am'],
				playing: ['play', 'plays', 'played'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-9',
			form: 'affirmative',
			prompt: 'Ми знайомимося з батьками Анни в суботу.',
			answer: "We're meeting Anna's parents on Saturday.",
			traps: {
				meeting: ['meet', 'meets', 'met'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-10',
			form: 'affirmative',
			prompt: 'Тарас переїжджає до Львова наступного місяця.',
			answer: 'Taras is moving to Lviv next month.',
			traps: {
				is: ['are', 'does', 'am'],
				moving: ['move', 'moves', 'moved'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-11',
			form: 'affirmative',
			prompt: 'Я відвідую Емму в лікарні в суботу.',
			answer: "I'm visiting Emma in hospital on Saturday.",
			accept: ["I'm visiting Emma {in|in the|at the} hospital on Saturday."],
			traps: {
				visiting: ['visit', 'visits', 'visited'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-12',
			form: 'affirmative',
			prompt: "Вони влаштовують вечірку в п'ятницю.",
			answer: "They're having a party on Friday.",
			accept: ["They're {having|throwing} a party on Friday."],
			traps: {
				having: ['have', 'has', 'had'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-13',
			form: 'affirmative',
			prompt: 'Я обідаю з Еммою завтра.',
			answer: "I'm having lunch with Emma tomorrow.",
			traps: {
				having: ['have', 'has', 'had'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-14',
			form: 'affirmative',
			prompt: 'Ми їдемо до Відня потягом у вівторок.',
			answer: "We're going to Vienna by train on Tuesday.",
			accept: [
				"We're {going|travelling|traveling} to Vienna by train on Tuesday.",
			],
			traps: {
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-15',
			form: 'affirmative',
			prompt: 'Я граю у футбол з Максом у середу.',
			answer: "I'm playing football with Max on Wednesday.",
			accept: ["I'm playing {football|soccer} with Max on Wednesday."],
			traps: {
				playing: ['play', 'plays', 'played'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-16',
			form: 'affirmative',
			prompt: 'Олена летить до Парижа в четвер.',
			answer: 'Olena is flying to Paris on Thursday.',
			traps: {
				is: ['are', 'does', 'am'],
				flying: ['fly', 'flies', 'flew'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-17',
			form: 'affirmative',
			prompt: 'Ми бачимося з Романом сьогодні ввечері.',
			answer: "We're seeing Roman tonight.",
			accept: ["We're {seeing|meeting} Roman {tonight|this evening}."],
			traps: {
				seeing: ['see', 'sees', 'saw'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-18',
			form: 'affirmative',
			prompt: 'Вони йдуть на концерт у неділю.',
			answer: "They're going to a concert on Sunday.",
			accept: ["They're going to {a|the} concert on Sunday."],
			traps: {
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-19',
			form: 'affirmative',
			prompt: 'Мій тато повертається з Берліна в неділю.',
			answer: 'My dad is coming back from Berlin on Sunday.',
			accept: [
				'My {dad|father} is {coming back|returning} from Berlin on Sunday.',
			],
			traps: {
				is: ['are', 'does', 'am'],
				coming: ['come', 'comes', 'came'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-20',
			form: 'affirmative',
			prompt: 'Ми переїжджаємо в новий будинок у березні.',
			answer: "We're moving to a new house in March.",
			accept: ["We're moving {to|into} a new house in March."],
			traps: {
				moving: ['move', 'moves', 'moved'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-21',
			form: 'affirmative',
			prompt: 'Іван починає нову роботу в понеділок.',
			answer: 'Ivan is starting a new job on Monday.',
			accept: ['Ivan is starting {a|his} new job on Monday.'],
			traps: {
				is: ['are', 'does', 'am'],
				starting: ['start', 'starts', 'started'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-22',
			form: 'affirmative',
			prompt: 'Ми з Анною йдемо в кіно в суботу.',
			answer: 'Anna and I are going to the cinema on Saturday.',
			accept: ['Anna and I are going to the {cinema|movies} on Saturday.'],
			traps: {
				are: ['is', 'am', 'do'],
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-23',
			form: 'affirmative',
			prompt: 'Вона вечеряє зі своїми батьками в неділю.',
			answer: 'She is having dinner with her parents on Sunday.',
			accept: ["She's having dinner with her parents on Sunday."],
			traps: {
				is: ['are', 'does', 'am'],
				having: ['have', 'has', 'had'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-24',
			form: 'affirmative',
			prompt: 'Ми зустрічаємося біля бібліотеки о восьмій.',
			answer: "We're meeting outside the library at eight.",
			accept: [
				"We're meeting {outside|near|in front of} the library at eight.",
			],
			traps: {
				meeting: ['meet', 'meets', 'met'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-25',
			form: 'affirmative',
			prompt: 'Він приходить на мою вечірку в суботу.',
			answer: 'He is coming to my party on Saturday.',
			accept: ["He's coming to my party on Saturday."],
			traps: {
				is: ['are', 'does', 'am'],
				coming: ['come', 'comes', 'came'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-26',
			form: 'affirmative',
			prompt: "Я зустрічаю Олену в аеропорту о дев'ятій.",
			answer: "I'm meeting Olena at the airport at nine.",
			traps: {
				meeting: ['meet', 'meets', 'met'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-27',
			form: 'affirmative',
			prompt: 'Наш рейс вилітає о десятій.',
			answer: 'Our flight leaves at ten.',
			accept: ['Our flight {leaves|departs|takes off} at ten.'],
			traps: {
				leaves: ['leave', 'left', 'leaving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-28',
			form: 'affirmative',
			prompt: 'Фільм починається о восьмій.',
			answer: 'The film starts at eight.',
			accept: ['The {film|movie} {starts|begins} at eight.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-29',
			form: 'affirmative',
			prompt: 'Супермаркет відчиняється о восьмій.',
			answer: 'The supermarket opens at eight.',
			traps: {
				opens: ['open', 'opened', 'opening'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-30',
			form: 'affirmative',
			prompt: 'Пошта зачиняється о шостій.',
			answer: 'The post office closes at six.',
			traps: {
				closes: ['close', 'closed', 'closing'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-31',
			form: 'affirmative',
			prompt: 'Концерт починається о пів на восьму.',
			answer: 'The concert starts at half past seven.',
			accept: ['The concert {starts|begins} at half past seven.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-32',
			form: 'affirmative',
			prompt: "Наш автобус прибуває о дев'ятій.",
			answer: 'Our bus arrives at nine.',
			traps: {
				arrives: ['arrive', 'arrived', 'arriving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-33',
			form: 'affirmative',
			prompt: 'Наш урок англійської починається о десятій.',
			answer: 'Our English lesson starts at ten.',
			accept: ['Our English {lesson|class} {starts|begins} at ten.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-34',
			form: 'affirmative',
			prompt: 'Матч починається о шостій.',
			answer: 'The match starts at six.',
			accept: ['The {match|game} {starts|begins} at six.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-35',
			form: 'affirmative',
			prompt: 'Навчальний рік починається у вересні.',
			answer: 'The school year starts in September.',
			accept: ['The {school|academic} year {starts|begins} in September.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-36',
			form: 'affirmative',
			prompt: 'Музей відчиняється о десятій.',
			answer: 'The museum opens at ten.',
			traps: {
				opens: ['open', 'opened', 'opening'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-37',
			form: 'affirmative',
			prompt: 'Концерт закінчується об одинадцятій.',
			answer: 'The concert ends at eleven.',
			accept: ['The concert {ends|finishes} at eleven.'],
			traps: {
				ends: ['end', 'ended', 'ending'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-38',
			form: 'affirmative',
			prompt: 'Наш потяг прибуває до Львова о пів на десяту.',
			answer: 'Our train arrives in Lviv at half past nine.',
			traps: {
				arrives: ['arrive', 'arrived', 'arriving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-39',
			form: 'affirmative',
			prompt: 'За розкладом потяг до Києва відправляється о сьомій.',
			answer: 'The train to Kyiv leaves at seven.',
			accept: ['The train to Kyiv {leaves|departs} at seven.'],
			traps: {
				leaves: ['leave', 'left', 'leaving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-40',
			form: 'affirmative',
			prompt: 'Моя зміна починається о шостій.',
			answer: 'My shift starts at six.',
			accept: ['My shift {starts|begins} at six.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-41',
			form: 'affirmative',
			prompt: "Пекарня зачиняється о дев'ятій.",
			answer: 'The bakery closes at nine.',
			traps: {
				closes: ['close', 'closed', 'closing'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-42',
			form: 'affirmative',
			prompt: 'Екскурсія починається о пів на одинадцяту.',
			answer: 'The tour starts at half past ten.',
			accept: ['The {tour|excursion} {starts|begins} at half past ten.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-43',
			form: 'affirmative',
			prompt: 'Конференція починається в понеділок.',
			answer: 'The conference starts on Monday.',
			accept: ['The conference {starts|begins} on Monday.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-44',
			form: 'affirmative',
			prompt: "Перший автобус відходить о п'ятій.",
			answer: 'The first bus leaves at five.',
			accept: ['The first bus {leaves|departs} at five.'],
			traps: {
				leaves: ['leave', 'left', 'leaving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-45',
			form: 'affirmative',
			prompt: 'Курс закінчується в травні.',
			answer: 'The course ends in May.',
			accept: ['The course {ends|finishes} in May.'],
			traps: {
				ends: ['end', 'ended', 'ending'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-46',
			form: 'affirmative',
			prompt: 'Наш рейс прибуває о пів на першу.',
			answer: 'Our flight arrives at half past twelve.',
			accept: ['Our flight {arrives|lands} at half past twelve.'],
			traps: {
				arrives: ['arrive', 'arrived', 'arriving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-47',
			form: 'affirmative',
			prompt: 'Басейн відчиняється о сьомій.',
			answer: 'The swimming pool opens at seven.',
			accept: ['The {swimming pool|pool} opens at seven.'],
			traps: {
				opens: ['open', 'opened', 'opening'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-48',
			form: 'affirmative',
			prompt: "Лекція починається о дев'ятій.",
			answer: 'The lecture starts at nine.',
			accept: ['The lecture {starts|begins} at nine.'],
			traps: {
				starts: ['start', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-49',
			form: 'affirmative',
			prompt: 'За розкладом пором відправляється о четвертій.',
			answer: 'The ferry leaves at four.',
			accept: ['The ferry {leaves|departs} at four.'],
			traps: {
				leaves: ['leave', 'left', 'leaving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-50',
			form: 'affirmative',
			prompt: 'Нова виставка відкривається в суботу.',
			answer: 'The new exhibition opens on Saturday.',
			traps: {
				opens: ['open', 'opened', 'opening'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-51',
			form: 'question',
			prompt: 'Що ти робиш у суботу?',
			answer: 'What are you doing on Saturday?',
			traps: {
				are: ['do', 'is', 'am'],
				doing: ['do', 'does', 'did'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-52',
			form: 'question',
			prompt: 'Ти щось робиш сьогодні ввечері?',
			answer: 'Are you doing anything tonight?',
			accept: ['Are you doing {anything|something} {tonight|this evening}?'],
			traps: {
				Are: ['Do', 'Is', 'Does'],
				doing: ['do', 'does', 'did'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-53',
			form: 'question',
			prompt: 'З ким ти зустрічаєшся завтра?',
			answer: 'Who are you meeting tomorrow?',
			accept: ['Who are you meeting {with|} tomorrow?'],
			traps: {
				are: ['do', 'is', 'does'],
				meeting: ['meet', 'meets', 'met'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-54',
			form: 'question',
			prompt: 'Куди ви летите в липні?',
			answer: 'Where are you flying in July?',
			accept: ['Where are you flying {to|} in July?'],
			traps: {
				are: ['do', 'is', 'does'],
				flying: ['fly', 'flies', 'flew'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-55',
			form: 'question',
			prompt: 'Коли ви переїжджаєте?',
			answer: 'When are you moving?',
			traps: {
				are: ['do', 'is', 'does'],
				moving: ['move', 'moves', 'moved'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-56',
			form: 'question',
			prompt: "Анна приходить на вечірку в п'ятницю?",
			answer: 'Is Anna coming to the party on Friday?',
			traps: {
				Is: ['Does', 'Are', 'Do'],
				coming: ['come', 'comes', 'came'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-57',
			form: 'question',
			prompt: 'Ви граєте в теніс з Іваном у неділю?',
			answer: 'Are you playing tennis with Ivan on Sunday?',
			traps: {
				Are: ['Do', 'Is', 'Does'],
				playing: ['play', 'plays', 'played'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-58',
			form: 'question',
			prompt: "Де ви вечеряєте в п'ятницю?",
			answer: 'Where are you having dinner on Friday?',
			traps: {
				are: ['do', 'is', 'does'],
				having: ['have', 'has', 'had'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-59',
			form: 'question',
			prompt: 'О котрій ти зустрічаєшся з Оленою?',
			answer: 'What time are you meeting Olena?',
			accept: ['What time are you meeting {with|} Olena?'],
			traps: {
				are: ['do', 'is', 'does'],
				meeting: ['meet', 'meets', 'met'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-60',
			form: 'question',
			prompt: 'Твої батьки приїжджають на Різдво?',
			answer: 'Are your parents coming for Christmas?',
			accept: ['Are your parents coming {for|at} Christmas?'],
			traps: {
				Are: ['Do', 'Is', 'Does'],
				coming: ['come', 'comes', 'came'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-61',
			form: 'question',
			prompt: 'Він грає з нами у футбол у суботу?',
			answer: 'Is he playing football with us on Saturday?',
			accept: ['Is he playing {football|soccer} with us on Saturday?'],
			traps: {
				Is: ['Does', 'Are', 'Do'],
				playing: ['play', 'plays', 'played'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-62',
			form: 'question',
			prompt: 'Вона летить до Лондона завтра?',
			answer: 'Is she flying to London tomorrow?',
			traps: {
				Is: ['Does', 'Are', 'Do'],
				flying: ['fly', 'flies', 'flew'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-63',
			form: 'question',
			prompt: 'Ти йдеш на концерт у суботу?',
			answer: 'Are you going to the concert on Saturday?',
			accept: ['Are you going to {the|a} concert on Saturday?'],
			traps: {
				Are: ['Do', 'Is', 'Does'],
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-64',
			form: 'question',
			prompt: 'Як ви добираєтеся до Праги в понеділок?',
			answer: 'How are you getting to Prague on Monday?',
			accept: [
				'How are you {getting|travelling|traveling} to Prague on Monday?',
			],
			traps: {
				are: ['do', 'is', 'does'],
				getting: ['get', 'gets', 'got'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-65',
			form: 'question',
			prompt: 'Хто приходить на вечерю сьогодні ввечері?',
			answer: 'Who is coming to dinner tonight?',
			accept: ["{Who is|Who's} coming {to|for} dinner {tonight|this evening}?"],
			traps: {
				is: ['are', 'does', 'do'],
				coming: ['come', 'comes', 'came'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-66',
			form: 'question',
			prompt: 'О котрій відправляється наш потяг?',
			answer: 'What time does our train leave?',
			accept: ['What time does our train {leave|depart}?'],
			traps: {
				does: ['do', 'is', 'did'],
				leave: ['leaves', 'left'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-67',
			form: 'question',
			prompt: 'Коли починається фільм?',
			answer: 'When does the film start?',
			accept: ['When does the {film|movie} {start|begin}?'],
			traps: {
				does: ['do', 'is', 'did'],
				start: ['starts', 'started'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-68',
			form: 'question',
			prompt: 'О котрій відчиняється банк?',
			answer: 'What time does the bank open?',
			traps: {
				does: ['do', 'is', 'did'],
				open: ['opens', 'opened'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-69',
			form: 'question',
			prompt: 'О котрій зачиняється супермаркет?',
			answer: 'What time does the supermarket close?',
			traps: {
				does: ['do', 'is', 'did'],
				close: ['closes', 'closed'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-70',
			form: 'question',
			prompt: 'Коли прибуває наш рейс?',
			answer: 'When does our flight arrive?',
			accept: ['When does our flight {arrive|land}?'],
			traps: {
				does: ['do', 'is', 'did'],
				arrive: ['arrives', 'arrived'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-71',
			form: 'question',
			prompt: 'О котрій починається концерт?',
			answer: 'What time does the concert start?',
			accept: ['What time does the concert {start|begin}?'],
			traps: {
				does: ['do', 'is', 'did'],
				start: ['starts', 'started'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-72',
			form: 'question',
			prompt: 'Коли закінчується урок?',
			answer: 'When does the lesson end?',
			accept: ['When does the {lesson|class} {end|finish}?'],
			traps: {
				does: ['do', 'is', 'did'],
				end: ['ends', 'ended'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-73',
			form: 'question',
			prompt: 'Потяг зупиняється у Вінниці?',
			answer: 'Does the train stop in Vinnytsia?',
			traps: {
				Does: ['Do', 'Is', 'Did'],
				stop: ['stops', 'stopped'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-74',
			form: 'question',
			prompt: 'Музей відчиняється в неділю?',
			answer: 'Does the museum open on Sunday?',
			traps: {
				Does: ['Do', 'Is', 'Did'],
				open: ['opens', 'opened'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-75',
			form: 'question',
			prompt: 'О котрій відходить останній автобус?',
			answer: 'What time does the last bus leave?',
			accept: ['What time does the last bus {leave|depart}?'],
			traps: {
				does: ['do', 'is', 'did'],
				leave: ['leaves', 'left'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-76',
			form: 'question',
			prompt: 'Коли починається твоя зміна?',
			answer: 'When does your shift start?',
			accept: ['When does your shift {start|begin}?'],
			traps: {
				does: ['do', 'is', 'did'],
				start: ['starts', 'started'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-77',
			form: 'question',
			prompt: "Фестиваль починається в п'ятницю?",
			answer: 'Does the festival start on Friday?',
			accept: ['Does the festival {start|begin} on Friday?'],
			traps: {
				Does: ['Do', 'Is', 'Did'],
				start: ['starts', 'started'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-78',
			form: 'question',
			prompt: 'О котрій закінчується матч?',
			answer: 'What time does the match end?',
			accept: ['What time does the {match|game} {end|finish}?'],
			traps: {
				does: ['do', 'is', 'did'],
				end: ['ends', 'ended'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-79',
			form: 'question',
			prompt: 'Коли прибуває автобус з Варшави?',
			answer: 'When does the bus from Warsaw arrive?',
			traps: {
				does: ['do', 'is', 'did'],
				arrive: ['arrives', 'arrived'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-80',
			form: 'question',
			prompt: 'Ваш літак вилітає о шостій?',
			answer: 'Does your plane leave at six?',
			accept: ['Does your plane {leave|depart|take off} at six?'],
			traps: {
				Does: ['Do', 'Is', 'Did'],
				leave: ['leaves', 'left'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-81',
			form: 'negative',
			prompt: 'Я не обідаю з Тарасом завтра.',
			answer: "I'm not having lunch with Taras tomorrow.",
			traps: {
				having: ['have', 'has', 'had'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-82',
			form: 'negative',
			prompt: 'Ми не йдемо на вечірку в суботу.',
			answer: "We aren't going to the party on Saturday.",
			accept: ["We're not going to the party on Saturday."],
			traps: {
				"aren't": ["don't", "isn't", "doesn't"],
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-83',
			form: 'negative',
			prompt: 'Анна не приходить на вечерю завтра.',
			answer: "Anna isn't coming to dinner tomorrow.",
			accept: ["Anna isn't coming {to|for} dinner tomorrow."],
			traps: {
				"isn't": ["doesn't", "aren't", "don't"],
				coming: ['come', 'comes', 'came'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-84',
			form: 'negative',
			prompt: 'Він не летить до Берліна в понеділок.',
			answer: "He isn't flying to Berlin on Monday.",
			accept: ["He's not flying to Berlin on Monday."],
			traps: {
				"isn't": ["doesn't", "aren't", "don't"],
				flying: ['fly', 'flies', 'flew'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-85',
			form: 'negative',
			prompt: 'Вони не переїжджають цього року.',
			answer: "They aren't moving this year.",
			accept: ["They're not moving this year."],
			traps: {
				"aren't": ["don't", "isn't", "doesn't"],
				moving: ['move', 'moves', 'moved'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-86',
			form: 'negative',
			prompt: 'Я не зустрічаюся з Іваном сьогодні ввечері.',
			answer: "I'm not meeting Ivan tonight.",
			accept: ["I'm not {meeting|seeing} Ivan {tonight|this evening}."],
			traps: {
				meeting: ['meet', 'meets', 'met'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-87',
			form: 'negative',
			prompt: 'Вона не грає в теніс з нами в неділю.',
			answer: "She isn't playing tennis with us on Sunday.",
			accept: ["She's not playing tennis with us on Sunday."],
			traps: {
				"isn't": ["doesn't", "aren't", "don't"],
				playing: ['play', 'plays', 'played'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-88',
			form: 'negative',
			prompt: 'Мої батьки не приїжджають на Різдво.',
			answer: "My parents aren't coming for Christmas.",
			accept: ["My parents aren't coming {for|at} Christmas."],
			traps: {
				"aren't": ["don't", "isn't", "doesn't"],
				coming: ['come', 'comes', 'came'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-89',
			form: 'negative',
			prompt: 'Ми не вечеряємо вдома в суботу.',
			answer: "We aren't having dinner at home on Saturday.",
			accept: [
				"{We aren't|We're not} {having dinner|eating} at home on Saturday.",
			],
			traps: {
				"aren't": ["don't", "isn't", "doesn't"],
				having: ['have', 'has', 'had'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-90',
			form: 'negative',
			prompt: 'Тарас не їде до Львова завтра.',
			answer: "Taras isn't going to Lviv tomorrow.",
			accept: ["Taras isn't {going|travelling|traveling} to Lviv tomorrow."],
			traps: {
				"isn't": ["doesn't", "aren't", "don't"],
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-91',
			form: 'negative',
			prompt: 'Наш потяг не зупиняється в Полтаві.',
			answer: "Our train doesn't stop in Poltava.",
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				stop: ['stops', 'stopped', 'stopping'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-92',
			form: 'negative',
			prompt: 'Музей не відчиняється в понеділок.',
			answer: "The museum doesn't open on Monday.",
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				open: ['opens', 'opened', 'opening'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-93',
			form: 'negative',
			prompt: 'Фільм не починається о сьомій.',
			answer: "The film doesn't start at seven.",
			accept: ["The {film|movie} doesn't {start|begin} at seven."],
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				start: ['starts', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-94',
			form: 'negative',
			prompt: "Супермаркет не зачиняється о дев'ятій.",
			answer: "The supermarket doesn't close at nine.",
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				close: ['closes', 'closed', 'closing'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-95',
			form: 'negative',
			prompt: 'Наш рейс не вилітає о шостій.',
			answer: "Our flight doesn't leave at six.",
			accept: ["Our flight doesn't {leave|depart|take off} at six."],
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				leave: ['leaves', 'left', 'leaving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-96',
			form: 'negative',
			prompt: 'Урок не закінчується о третій.',
			answer: "The lesson doesn't end at three.",
			accept: ["The {lesson|class} doesn't {end|finish} at three."],
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				end: ['ends', 'ended', 'ending'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-97',
			form: 'negative',
			prompt: 'Курс не починається в січні.',
			answer: "The course doesn't start in January.",
			accept: ["The course doesn't {start|begin} in January."],
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				start: ['starts', 'started', 'starting'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-98',
			form: 'negative',
			prompt: "Екскурсія не закінчується о п'ятій.",
			answer: "The tour doesn't end at five.",
			accept: ["The {tour|excursion} doesn't {end|finish} at five."],
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				end: ['ends', 'ended', 'ending'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-99',
			form: 'negative',
			prompt: 'Потяг не прибуває до Харкова о сьомій.',
			answer: "The train doesn't arrive in Kharkiv at seven.",
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				arrive: ['arrives', 'arrived', 'arriving'],
			},
		},
		{
			id: 'present-continuous-vs-present-simple-for-future-100',
			form: 'negative',
			prompt: 'Матч не починається о шостій.',
			answer: "The match doesn't start at six.",
			accept: ["The {match|game} doesn't {start|begin} at six."],
			traps: {
				"doesn't": ["isn't", "don't", "aren't"],
				start: ['starts', 'started', 'starting'],
			},
		},
	],
})
