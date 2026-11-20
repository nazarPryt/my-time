import { defineTopic } from '../../define-topic'

export const pastSimpleVsPastContinuous = defineTopic({
	id: 'past-simple-vs-past-continuous',
	level: 'intermediate',
	title: 'Past Simple vs Past Continuous',
	subtitle: 'Минулий простий і минулий тривалий час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Past Continuous (was/were + -ing) — тривала дія в процесі: у певний момент минулого (о восьмій, учора о цій порі) або коли її перервала інша дія. Past Simple — коротка завершена дія або послідовність дій. Українською підказує вид дієслова: «йшов», «читав» (недоконаний, у процесі) — Past Continuous; «прийшов», «прочитав» (доконаний) — Past Simple. When стоїть перед короткою дією, while — перед тривалою.',
			examples: [
				{
					text: 'I was ironing my shirt when the electricity went off.',
					translation: 'Я прасував сорочку, коли вимкнули електрику.',
				},
				{
					text: 'While she was running in the park, she lost her keys.',
					translation: 'Поки вона бігала в парку, вона загубила ключі.',
				},
				{
					text: 'He locked the car and walked to the shop.',
					translation: 'Він замкнув машину й пішов до магазину.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				'Past Continuous: I/he/she/it + was, you/we/they + were + дієслово з -ing. Past Simple: дієслово з -ed або друга форма неправильного дієслова.',
			examples: [
				{
					text: 'They were painting the kitchen at noon.',
					translation: 'Опівдні вони фарбували кухню.',
				},
				{
					text: 'The baby woke up when the dog barked.',
					translation: 'Дитина прокинулася, коли гавкнув пес.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Past Continuous: Was/Were + підмет + дієслово з -ing. Past Simple: Did + підмет + дієслово без закінчення.',
			examples: [
				{
					text: 'Were they swimming when the boat arrived?',
					translation: 'Вони плавали, коли приплив човен?',
				},
				{
					text: 'What did she order at the café?',
					translation: 'Що вона замовила в кафе?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Past Continuous: wasn't/weren't + дієслово з -ing. Past Simple: didn't + дієслово без закінчення. Дієслова стану (know, want, like) у Continuous не вживаються.",
			examples: [
				{
					text: "He wasn't wearing a coat when it started to snow.",
					translation: 'Він не мав на собі пальта, коли почав падати сніг.',
				},
				{
					text: "We didn't find the hotel at first.",
					translation: 'Спочатку ми не знайшли готель.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'past-simple-vs-past-continuous-1',
			form: 'affirmative',
			prompt: 'Я читав, коли він подзвонив.',
			answer: 'I was reading when he called.',
			accept: ['I was reading when he phoned.'],
			traps: {
				was: ['were', 'did'],
				reading: ['read', 'reads'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-2',
			form: 'affirmative',
			prompt: 'Ми вечеряли, коли згасло світло.',
			answer: 'We were having dinner when the lights went out.',
			accept: [
				'We were {having|eating} dinner when the {lights|light} went out.',
			],
			traps: {
				were: ['was', 'did'],
				went: ['go', 'gone'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-3',
			form: 'affirmative',
			prompt: 'Коли я йшов додому, почався дощ.',
			answer: 'When I was walking home, it started to rain.',
			accept: [
				'{When|While} I was {walking|going} home, it {started|began} {to rain|raining}.',
			],
			traps: {
				was: ['were', 'did'],
				walking: ['walked', 'walk'],
				started: ['starting', 'starts'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-4',
			form: 'affirmative',
			prompt: 'Він приймав душ, коли задзвонив телефон.',
			answer: 'He was taking a shower when the phone rang.',
			accept: ['He was {taking|having} a shower when the phone rang.'],
			traps: {
				was: ['were', 'did'],
				taking: ['took', 'takes'],
				rang: ['ringing', 'rings'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-5',
			form: 'affirmative',
			prompt: 'Діти гралися надворі, коли почалася гроза.',
			answer: 'The children were playing outside when the storm started.',
			accept: [
				'The children were playing outside when the {storm|thunderstorm} {started|began}.',
			],
			traps: {
				were: ['was', 'did'],
				playing: ['played', 'play'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-6',
			form: 'affirmative',
			prompt: 'Коли я прийшов додому, вони дивилися телевізор.',
			answer: 'When I came home, they were watching TV.',
			accept: ['When I {came|got} home, they were watching TV.'],
			traps: {
				were: ['was', 'did'],
				watching: ['watched', 'watch'],
				came: ['coming', 'come'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-7',
			form: 'affirmative',
			prompt: 'Я спав, коли ти подзвонив.',
			answer: 'I was sleeping when you called.',
			accept: ['I was {sleeping|asleep} when you {called|phoned}.'],
			traps: {
				was: ['were', 'did'],
				sleeping: ['slept', 'sleep'],
				called: ['calling', 'calls'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-8',
			form: 'affirmative',
			prompt: 'Ми снідали, коли прийшов листоноша.',
			answer: 'We were having breakfast when the postman came.',
			accept: [
				'We were {having|eating} breakfast when the postman {came|arrived}.',
			],
			traps: {
				were: ['was', 'did'],
				having: ['had', 'have'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-9',
			form: 'affirmative',
			prompt: 'Вона переходила дорогу, коли побачила старого друга.',
			answer: 'She was crossing the road when she saw an old friend.',
			traps: {
				was: ['were', 'did'],
				crossing: ['crossed', 'cross'],
				saw: ['seeing', 'sees'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-10',
			form: 'affirmative',
			prompt: 'Я різав хліб, коли порізався.',
			answer: 'I was cutting bread when I cut myself.',
			traps: {
				was: ['were', 'did'],
				cutting: ['cuts'],
				cut: ['cutting', 'cuts'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-11',
			form: 'affirmative',
			prompt: 'Коли ми гуляли в парку, ми зустріли Анну.',
			answer: 'When we were walking in the park, we met Anna.',
			accept: ['{When|While} we were walking in the park, we met Anna.'],
			traps: {
				were: ['was', 'did'],
				walking: ['walked', 'walk'],
				met: ['meeting', 'meet'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-12',
			form: 'affirmative',
			prompt: 'Він читав газету, коли я зайшов до кімнати.',
			answer: 'He was reading a newspaper when I came into the room.',
			accept: [
				'He was reading {a|the} newspaper when I {came into|entered} the room.',
			],
			traps: {
				was: ['were', 'did'],
				reading: ['reads'],
				came: ['coming', 'come'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-13',
			form: 'affirmative',
			prompt: 'Коли задзвонив будильник, я ще спав.',
			answer: 'When the alarm clock rang, I was still sleeping.',
			accept: [
				'When the {alarm clock|alarm} {rang|went off}, I was still {sleeping|asleep}.',
			],
			traps: {
				was: ['were', 'did'],
				sleeping: ['slept', 'sleep'],
				rang: ['ringing', 'rings'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-14',
			form: 'affirmative',
			prompt: 'Олена розмовляла по телефону, коли я повернувся.',
			answer: 'Olena was talking on the phone when I came back.',
			accept: [
				'Olena was {talking|speaking} on the phone when I {came back|returned}.',
			],
			traps: {
				was: ['were', 'did'],
				talking: ['talked', 'talks'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-15',
			form: 'affirmative',
			prompt: 'Ми чекали на автобус, коли почався сніг.',
			answer: 'We were waiting for the bus when it started to snow.',
			accept: [
				'We were waiting for {the|a} bus when it {started|began} {to snow|snowing}.',
			],
			traps: {
				were: ['was', 'did'],
				waiting: ['waited', 'wait'],
				started: ['starting', 'starts'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-16',
			form: 'affirmative',
			prompt: 'Коли я його побачив, він біг до станції.',
			answer: 'When I saw him, he was running to the station.',
			traps: {
				was: ['were', 'did'],
				running: ['ran', 'runs'],
				saw: ['seeing', 'seen'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-17',
			form: 'affirmative',
			prompt: 'Вони будували будинок, коли в них закінчилися гроші.',
			answer: 'They were building a house when they ran out of money.',
			traps: {
				were: ['was', 'did'],
				building: ['built', 'build'],
				ran: ['running', 'runs'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-18',
			form: 'affirmative',
			prompt: 'Я стояв на зупинці, коли побачив Марка.',
			answer: 'I was standing at the bus stop when I saw Mark.',
			accept: ['I was standing at {the|a} bus stop when I saw Mark.'],
			traps: {
				was: ['were', 'did'],
				standing: ['stood', 'stand'],
				saw: ['seeing', 'seen'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-19',
			form: 'affirmative',
			prompt: 'Пес спав на дивані, коли ми повернулися.',
			answer: 'The dog was sleeping on the sofa when we came back.',
			accept: [
				'The dog was {sleeping|asleep} on the {sofa|couch} when we {came back|returned}.',
			],
			traps: {
				was: ['were', 'did'],
				sleeping: ['slept', 'sleeps'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-20',
			form: 'affirmative',
			prompt: 'Коли почався урок, Тарас ще снідав.',
			answer: 'When the lesson started, Taras was still having breakfast.',
			accept: [
				'When the lesson {started|began}, Taras was still {having|eating} breakfast.',
			],
			traps: {
				was: ['were', 'did'],
				having: ['had', 'has'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-21',
			form: 'affirmative',
			prompt: 'Учора я прийшов додому, приготував вечерю й ліг спати.',
			answer: 'Yesterday I came home, cooked dinner and went to bed.',
			accept: [
				'Yesterday I {came|got} home, {cooked|made} dinner and went to bed.',
			],
			traps: {
				came: ['coming', 'come'],
				cooked: ['cooking', 'cooks'],
				went: ['going', 'goes'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-22',
			form: 'affirmative',
			prompt: 'Вона відчинила двері й увійшла до кімнати.',
			answer: 'She opened the door and came into the room.',
			accept: [
				'She opened the door and {came into|went into|walked into|entered} the room.',
			],
			traps: {
				opened: ['opening', 'opens'],
				came: ['coming', 'comes'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-23',
			form: 'affirmative',
			prompt: 'Він прочитав цю книжку за два дні.',
			answer: 'He read this book in two days.',
			traps: {
				read: ['reading', 'reads'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-24',
			form: 'affirmative',
			prompt: 'Ми купили квитки й пішли в кіно.',
			answer: 'We bought tickets and went to the cinema.',
			accept: ['We bought {the|} tickets and went to the {cinema|movies}.'],
			traps: {
				bought: ['buying', 'buy'],
				went: ['going', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-25',
			form: 'affirmative',
			prompt: 'Коли він закінчив роботу, він пішов додому.',
			answer: 'When he finished work, he went home.',
			traps: {
				finished: ['finishes', 'finish'],
				went: ['going', 'goes'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-26',
			form: 'affirmative',
			prompt: 'Коли я почув новину, я подзвонив тобі.',
			answer: 'When I heard the news, I called you.',
			accept: ['When I heard the news, I {called|phoned} you.'],
			traps: {
				heard: ['hearing', 'hears'],
				called: ['calling', 'calls'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-27',
			form: 'affirmative',
			prompt: 'Минулого літа ми поїхали до Італії.',
			answer: 'Last summer we went to Italy.',
			accept: ['Last summer we {went|travelled|traveled} to Italy.'],
			traps: {
				went: ['going', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-28',
			form: 'affirmative',
			prompt: 'Він устав, одягнувся й вийшов з дому.',
			answer: 'He got up, got dressed and left the house.',
			accept: ['He got up, {got dressed|dressed} and left {the house|home}.'],
			traps: {
				got: ['getting', 'gets'],
				left: ['leaving', 'leaves'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-29',
			form: 'affirmative',
			prompt: 'О восьмій вечора я писав листа.',
			answer: 'At eight in the evening I was writing a letter.',
			accept: ["At eight {o'clock|} in the evening I was writing a letter."],
			traps: {
				was: ['were', 'did'],
				writing: ['wrote', 'write'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-30',
			form: 'affirmative',
			prompt: 'Учора о шостій вони ще працювали.',
			answer: 'Yesterday at six they were still working.',
			accept: ["Yesterday at six {o'clock|} they were still working."],
			traps: {
				were: ['was', 'did'],
				working: ['worked', 'work'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-31',
			form: 'affirmative',
			prompt: 'Опівночі ми ще розмовляли.',
			answer: 'At midnight we were still talking.',
			traps: {
				were: ['was', 'did'],
				talking: ['talked', 'talk'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-32',
			form: 'affirmative',
			prompt: 'Учора о цій порі я сидів у літаку.',
			answer: 'This time yesterday I was sitting on a plane.',
			accept: [
				'{This|At this} time yesterday I was sitting {on|in} {a|the} plane.',
			],
			traps: {
				was: ['were', 'did'],
				sitting: ['sat', 'sit'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-33',
			form: 'affirmative',
			prompt: 'О сьомій ранку вона ще спала.',
			answer: 'At seven in the morning she was still sleeping.',
			accept: [
				"At seven {o'clock|} in the morning she was still {sleeping|asleep}.",
			],
			traps: {
				was: ['were', 'did'],
				sleeping: ['slept', 'sleeps'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-34',
			form: 'affirmative',
			prompt: 'Цілий день ішов дощ.',
			answer: 'It was raining all day.',
			accept: ['It {was raining|rained} {all day|the whole day}.'],
			traps: {
				was: ['were', 'is'],
				raining: ['rains', 'rain'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-35',
			form: 'affirmative',
			prompt: 'Весь вечір діти гралися в саду.',
			answer: 'The children were playing in the garden all evening.',
			accept: [
				'The children {were playing|played} in the garden {all evening|the whole evening}.',
			],
			traps: {
				were: ['was', 'are'],
				playing: ['play', 'plays'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-36',
			form: 'affirmative',
			prompt: "О п'ятій вечора він ще грав у футбол.",
			answer: 'At five in the evening he was still playing football.',
			accept: [
				"At five {o'clock|} in the evening he was still playing football.",
			],
			traps: {
				was: ['were', 'did'],
				playing: ['played', 'plays'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-37',
			form: 'affirmative',
			prompt: 'Учора о десятій я дивився новини.',
			answer: 'Yesterday at ten I was watching the news.',
			accept: ["Yesterday at ten {o'clock|} I was watching the news."],
			traps: {
				was: ['were', 'did'],
				watching: ['watched', 'watch'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-38',
			form: 'affirmative',
			prompt: 'Коли ми приїхали на вокзал, потяг уже відходив.',
			answer: 'When we arrived at the station, the train was already leaving.',
			accept: [
				'When we {arrived at|got to} the station, the train was already leaving.',
			],
			traps: {
				was: ['were', 'did'],
				leaving: ['left', 'leaves'],
				arrived: ['arriving', 'arrives'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-39',
			form: 'affirmative',
			prompt: 'Я мив посуд, коли розбив тарілку.',
			answer: 'I was washing the dishes when I broke a plate.',
			accept: ['I was {washing|doing} the dishes when I broke a plate.'],
			traps: {
				was: ['were', 'did'],
				washing: ['washed', 'wash'],
				broke: ['breaking', 'broken'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-40',
			form: 'affirmative',
			prompt: 'Вона співала в душі, коли хтось постукав у двері.',
			answer: 'She was singing in the shower when someone knocked on the door.',
			accept: [
				'She was singing in the shower when {someone|somebody} knocked {on|at} the door.',
			],
			traps: {
				was: ['were', 'did'],
				singing: ['sang', 'sing'],
				knocked: ['knocking', 'knocks'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-41',
			form: 'affirmative',
			prompt: 'Коли я подивився у вікно, ще падав сніг.',
			answer: 'When I looked out of the window, it was still snowing.',
			accept: ['When I looked out {of|} the window, it was still snowing.'],
			traps: {
				was: ['were', 'did'],
				snowing: ['snowed', 'snows'],
				looked: ['looking', 'looks'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-42',
			form: 'affirmative',
			prompt: 'Він лагодив паркан, коли пішов дощ.',
			answer: 'He was fixing the fence when it started to rain.',
			accept: [
				'He was {fixing|repairing} the fence when it {started|began} {to rain|raining}.',
			],
			traps: {
				was: ['were', 'did'],
				fixing: ['fixed', 'fix'],
				started: ['starting', 'starts'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-43',
			form: 'affirmative',
			prompt: 'Коли я зайшов, вони сперечалися.',
			answer: 'When I came in, they were arguing.',
			accept: ['When I {came|walked} in, they were arguing.'],
			traps: {
				were: ['was', 'did'],
				arguing: ['argued', 'argue'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-44',
			form: 'affirmative',
			prompt: 'Ми пили каву, коли подзвонив Макс.',
			answer: 'We were drinking coffee when Max called.',
			accept: ['We were {drinking|having} coffee when Max {called|phoned}.'],
			traps: {
				were: ['was', 'did'],
				drinking: ['drank', 'drink'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-45',
			form: 'affirmative',
			prompt: 'Я біг до автобуса, коли впав.',
			answer: 'I was running to the bus when I fell.',
			accept: ['I was running {to|for} the bus when I fell.'],
			traps: {
				was: ['were', 'did'],
				running: ['ran', 'run'],
				fell: ['falling', 'falls'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-46',
			form: 'affirmative',
			prompt: 'Коли прийшли гості, ми ще прибирали.',
			answer: 'When the guests arrived, we were still cleaning.',
			accept: ['When the guests {arrived|came}, we were still cleaning.'],
			traps: {
				were: ['was', 'did'],
				cleaning: ['cleaned', 'clean'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-47',
			form: 'affirmative',
			prompt: 'Світило сонце, коли ми вийшли з дому.',
			answer: 'The sun was shining when we left the house.',
			accept: [
				'The sun was shining when we {left the house|left home|went out}.',
			],
			traps: {
				was: ['were', 'did'],
				shining: ['shone', 'shines'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-48',
			form: 'question',
			prompt: 'Що ти робив, коли я подзвонив?',
			answer: 'What were you doing when I called?',
			accept: ['What were you doing when I {called|phoned}?'],
			traps: {
				were: ['did', 'was'],
				doing: ['do', 'done'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-49',
			form: 'question',
			prompt: 'Вона спала, коли ти прийшов додому?',
			answer: 'Was she sleeping when you came home?',
			accept: ['Was she {sleeping|asleep} when you {came|got} home?'],
			traps: {
				Was: ['Were', 'Did'],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-50',
			form: 'question',
			prompt: 'Куди вони йшли, коли ти їх побачив?',
			answer: 'Where were they going when you saw them?',
			traps: {
				were: ['was', 'are'],
				going: ['went', 'go'],
				saw: ['seen', 'seeing'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-51',
			form: 'question',
			prompt: 'Що ти зробив, коли згасло світло?',
			answer: 'What did you do when the lights went out?',
			accept: ['What did you do when the {lights|power} went out?'],
			traps: {
				did: ['were', 'was'],
				do: ['doing', 'done'],
				went: ['going', 'gone'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-52',
			form: 'question',
			prompt: 'Ви дивилися телевізор, коли почалася гроза?',
			answer: 'Were you watching TV when the storm started?',
			accept: [
				'Were you watching TV when the {storm|thunderstorm} {started|began}?',
			],
			traps: {
				Were: ['Was', 'Are'],
				watching: ['watched', 'watch'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-53',
			form: 'question',
			prompt: 'Хто грав на гітарі, коли ти зайшов?',
			answer: 'Who was playing the guitar when you came in?',
			accept: ['Who was playing {the|} guitar when you {came|walked} in?'],
			traps: {
				was: ['were', 'did'],
				playing: ['played', 'plays'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-54',
			form: 'question',
			prompt: 'Що він сказав, коли побачив тебе?',
			answer: 'What did he say when he saw you?',
			traps: {
				did: ['was', 'does'],
				say: ['said', 'saying'],
				saw: ['seeing', 'sees'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-55',
			form: 'question',
			prompt: 'Ти їхав додому, коли сталася аварія?',
			answer: 'Were you driving home when the accident happened?',
			accept: ['Were you {driving|going} home when the accident happened?'],
			traps: {
				Were: ['Was', 'Did'],
				driving: ['drove', 'drive'],
				happened: ['happening', 'happens'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-56',
			form: 'question',
			prompt: 'Чому ти сміявся, коли вчитель зайшов у клас?',
			answer: 'Why were you laughing when the teacher came into the classroom?',
			accept: [
				'Why were you laughing when the teacher {came into|entered} the classroom?',
			],
			traps: {
				were: ['was', 'are'],
				laughing: ['laughed', 'laugh'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-57',
			form: 'question',
			prompt: 'Що вони робили вчора о восьмій вечора?',
			answer: 'What were they doing yesterday at eight in the evening?',
			accept: [
				"What were they doing yesterday at eight {o'clock|} in the evening?",
			],
			traps: {
				were: ['was', 'are'],
				doing: ['do', 'did'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-58',
			form: 'question',
			prompt: 'Де ти познайомився з Анною?',
			answer: 'Where did you meet Anna?',
			traps: {
				did: ['were', 'was'],
				meet: ['met', 'meeting'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-59',
			form: 'question',
			prompt: 'Ти спав, коли я подзвонив?',
			answer: 'Were you sleeping when I called?',
			accept: ['Were you {sleeping|asleep} when I {called|phoned}?'],
			traps: {
				Were: ['Was', 'Did'],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-60',
			form: 'question',
			prompt: 'Що ти робив учора о цій порі?',
			answer: 'What were you doing this time yesterday?',
			accept: ['What were you doing {this|at this} time yesterday?'],
			traps: {
				were: ['was', 'are'],
				doing: ['done', 'do'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-61',
			form: 'question',
			prompt: 'Що ти зробив, коли почув новину?',
			answer: 'What did you do when you heard the news?',
			traps: {
				did: ['were', 'was'],
				do: ['doing', 'done'],
				heard: ['hearing', 'hears'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-62',
			form: 'question',
			prompt: 'Він ще працював, коли ти пішов?',
			answer: 'Was he still working when you left?',
			traps: {
				Was: ['Were', 'Did'],
				working: ['worked', 'work'],
				left: ['leaving', 'leaves'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-63',
			form: 'question',
			prompt: 'Ішов дощ, коли ти вийшов з дому?',
			answer: 'Was it raining when you left the house?',
			accept: ['Was it raining when you left {the house|home}?'],
			traps: {
				Was: ['Were', 'Is'],
				raining: ['rained', 'rains'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-64',
			form: 'question',
			prompt: 'Що сталося, коли ти їхав на роботу?',
			answer: 'What happened when you were driving to work?',
			accept: ['What happened {when|while} you were {driving|going} to work?'],
			traps: {
				happened: ['happening', 'happens'],
				were: ['was', 'did'],
				driving: ['drove', 'drive'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-65',
			form: 'question',
			prompt: 'Куди ти поїхав минулого літа?',
			answer: 'Where did you go last summer?',
			traps: {
				did: ['were', 'was'],
				go: ['went', 'going'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-66',
			form: 'question',
			prompt: 'Діти спали, коли ви повернулися?',
			answer: 'Were the children sleeping when you came back?',
			accept: [
				'Were the children {sleeping|asleep} when you {came back|returned}?',
			],
			traps: {
				Were: ['Was', 'Did'],
				sleeping: ['slept', 'sleeps'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-67',
			form: 'question',
			prompt: 'Що ти купив, коли був у Лондоні?',
			answer: 'What did you buy when you were in London?',
			traps: {
				did: ['were', 'was'],
				buy: ['bought', 'buying'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-68',
			form: 'question',
			prompt: 'На кого ти чекав, коли я тебе побачив?',
			answer: 'Who were you waiting for when I saw you?',
			traps: {
				were: ['did', 'was'],
				waiting: ['waited', 'wait'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-69',
			form: 'question',
			prompt: 'Він читав, коли ти прийшов?',
			answer: 'Was he reading when you came?',
			accept: ['Was he reading when you {came|arrived}?'],
			traps: {
				Was: ['Were', 'Did'],
				reading: ['reads', 'read'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-70',
			form: 'question',
			prompt: 'Скільки ти заплатив за квитки?',
			answer: 'How much did you pay for the tickets?',
			traps: {
				did: ['were', 'was'],
				pay: ['paid', 'paying'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-71',
			form: 'question',
			prompt: 'Що ви обговорювали, коли я зайшов?',
			answer: 'What were you discussing when I came in?',
			accept: ['What were you discussing when I {came|walked} in?'],
			traps: {
				were: ['was', 'are'],
				discussing: ['discussed', 'discuss'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-72',
			form: 'question',
			prompt: 'О котрій ти прокинувся сьогодні?',
			answer: 'What time did you wake up today?',
			accept: ['What time did you wake up {today|this morning}?'],
			traps: {
				did: ['were', 'was'],
				wake: ['woke', 'waking'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-73',
			form: 'question',
			prompt: 'Вона розмовляла по телефону, коли ти зайшов?',
			answer: 'Was she talking on the phone when you came in?',
			accept: [
				'Was she {talking|speaking} on the phone when you {came|walked} in?',
			],
			traps: {
				Was: ['Were', 'Is'],
				talking: ['talked', 'talks'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-74',
			form: 'question',
			prompt: 'Ти бачив, хто розбив вікно?',
			answer: 'Did you see who broke the window?',
			traps: {
				Did: ['Were', 'Was'],
				see: ['saw', 'seeing'],
				broke: ['breaking', 'broken'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-75',
			form: 'question',
			prompt: 'Яку музику ви слухали, коли я подзвонив?',
			answer: 'What music were you listening to when I called?',
			accept: ['What music were you listening to when I {called|phoned}?'],
			traps: {
				were: ['did', 'was'],
				listening: ['listened', 'listen'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-76',
			form: 'question',
			prompt: 'Коли ти дізнався про це?',
			answer: 'When did you find out about it?',
			accept: ['When did you {find out|learn} about {it|this}?'],
			traps: {
				did: ['were', 'was'],
				find: ['found', 'finding'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-77',
			form: 'question',
			prompt: 'Ти йшов до школи, коли почався дощ?',
			answer: 'Were you walking to school when it started to rain?',
			accept: [
				'Were you {walking|going} to school when it {started|began} {to rain|raining}?',
			],
			traps: {
				Were: ['Was', 'Are'],
				walking: ['walked', 'walk'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-78',
			form: 'negative',
			prompt: 'Я не спав, коли ти подзвонив.',
			answer: "I wasn't sleeping when you called.",
			accept: ["I wasn't {sleeping|asleep} when you {called|phoned}."],
			traps: {
				"wasn't": ["weren't", "isn't"],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-79',
			form: 'negative',
			prompt: 'Ми не дивилися телевізор, коли ти прийшов.',
			answer: "We weren't watching TV when you came.",
			accept: ["We weren't watching TV when you {came|arrived}."],
			traps: {
				"weren't": ["wasn't", "aren't"],
				watching: ['watched', 'watch'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-80',
			form: 'negative',
			prompt: 'Він не почув телефон, бо приймав душ.',
			answer: "He didn't hear the phone because he was taking a shower.",
			accept: [
				"He didn't hear the phone because he was {taking|having} a shower.",
			],
			traps: {
				"didn't": ["don't", "haven't"],
				hear: ['heard', 'hearing'],
				taking: ['took', 'takes'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-81',
			form: 'negative',
			prompt: 'Вона не пішла вчора на вечірку.',
			answer: "She didn't go to the party yesterday.",
			traps: {
				"didn't": ["don't", "haven't"],
				go: ['went', 'going'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-82',
			form: 'negative',
			prompt: 'Коли я прийшов, вони не працювали.',
			answer: "When I came, they weren't working.",
			accept: ["When I {came|arrived}, they weren't working."],
			traps: {
				"weren't": ["wasn't", "aren't"],
				working: ['worked', 'work'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-83',
			form: 'negative',
			prompt: 'Я не помітив Макса, бо читав.',
			answer: "I didn't notice Max because I was reading.",
			traps: {
				"didn't": ["don't", "haven't"],
				notice: ['noticed', 'noticing'],
				reading: ['read', 'reads'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-84',
			form: 'negative',
			prompt: 'Учора о шостій я не працював, я відпочивав.',
			answer: "Yesterday at six I wasn't working, I was resting.",
			accept: ["Yesterday at six {o'clock|} I wasn't working, I was resting."],
			traps: {
				"wasn't": ["weren't", "isn't"],
				resting: ['rested', 'rest'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-85',
			form: 'negative',
			prompt: 'Ми не чекали довго.',
			answer: "We didn't wait long.",
			traps: {
				"didn't": ["don't", "haven't"],
				wait: ['waited', 'waiting'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-86',
			form: 'negative',
			prompt: 'Вона не слухала, коли я пояснював правило.',
			answer: "She wasn't listening when I was explaining the rule.",
			accept: [
				"She {wasn't listening|didn't listen} {when|while} I {was explaining|explained} the rule.",
			],
			traps: {
				"wasn't": ["weren't", "isn't"],
				listening: ['listened', 'listen'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-87',
			form: 'negative',
			prompt: 'Коли почався дощ, діти не гралися надворі.',
			answer: "When it started to rain, the children weren't playing outside.",
			accept: [
				"When it {started|began} {to rain|raining}, the children weren't playing outside.",
			],
			traps: {
				"weren't": ["wasn't", "aren't"],
				playing: ['played', 'play'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-88',
			form: 'negative',
			prompt: 'Він не подзвонив мені вчора.',
			answer: "He didn't call me yesterday.",
			accept: ["He didn't {call|phone} me yesterday."],
			traps: {
				"didn't": ["don't", "haven't"],
				call: ['called', 'calling'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-89',
			form: 'negative',
			prompt: 'Ми не їхали швидко, коли сталася аварія.',
			answer: "We weren't driving fast when the accident happened.",
			traps: {
				"weren't": ["wasn't", "aren't"],
				driving: ['drove', 'drive'],
				happened: ['happening', 'happens'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-90',
			form: 'negative',
			prompt: 'Я не зачинив вікно, коли виходив.',
			answer: "I didn't close the window when I left.",
			accept: ["I didn't {close|shut} the window when I {left|was leaving}."],
			traps: {
				"didn't": ["don't", "haven't"],
				close: ['closed', 'closing'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-91',
			form: 'negative',
			prompt: 'Коли я подзвонив, вони не спали.',
			answer: "When I called, they weren't sleeping.",
			accept: ["When I {called|phoned}, they weren't {sleeping|asleep}."],
			traps: {
				"weren't": ["wasn't", "aren't"],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-92',
			form: 'negative',
			prompt: 'Коли я подзвонив, вона не відповіла.',
			answer: "When I called, she didn't answer.",
			accept: ["When I {called|phoned}, she didn't answer."],
			traps: {
				"didn't": ["don't", "haven't"],
				answer: ['answered', 'answering'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-93',
			form: 'negative',
			prompt: 'Коли ти мене побачив, я не йшов, а біг.',
			answer: "When you saw me, I wasn't walking, I was running.",
			traps: {
				"wasn't": ["weren't", "isn't"],
				running: ['ran', 'runs'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-94',
			form: 'negative',
			prompt: 'Вона не прийшла на урок, бо хворіла.',
			answer: "She didn't come to the lesson because she was ill.",
			accept: ["She didn't come to the lesson because she was {ill|sick}."],
			traps: {
				"didn't": ["wasn't", "doesn't"],
				come: ['came', 'coming'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-95',
			form: 'negative',
			prompt: 'Ми не розмовляли, коли зайшов учитель.',
			answer: "We weren't talking when the teacher came in.",
			accept: [
				"We weren't talking when the teacher {came in|walked in|entered}.",
			],
			traps: {
				"weren't": ["wasn't", "aren't"],
				talking: ['talked', 'talk'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-96',
			form: 'negative',
			prompt: 'Я не бачив Анну вчора.',
			answer: "I didn't see Anna yesterday.",
			traps: {
				"didn't": ["don't", "haven't"],
				see: ['saw', 'seeing'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-97',
			form: 'negative',
			prompt: 'Коли ми приїхали, сонце вже не світило.',
			answer: "When we arrived, the sun wasn't shining anymore.",
			accept: ["When we arrived, the sun wasn't shining {anymore|any more}."],
			traps: {
				"wasn't": ["weren't", "isn't"],
				shining: ['shone', 'shines'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-98',
			form: 'negative',
			prompt: 'Учора ввечері я не готував вечерю.',
			answer: "Last night I didn't cook dinner.",
			accept: ["{Last night|Yesterday evening} I didn't {cook|make} dinner."],
			traps: {
				"didn't": ["don't", "haven't"],
				cook: ['cooked', 'cooking'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-99',
			form: 'negative',
			prompt: 'Коли я зайшов у кімнату, Тарас не читав.',
			answer: "When I came into the room, Taras wasn't reading.",
			accept: ["When I {came into|entered} the room, Taras wasn't reading."],
			traps: {
				"wasn't": ["weren't", "isn't"],
				reading: ['reads', 'read'],
			},
		},
		{
			id: 'past-simple-vs-past-continuous-100',
			form: 'negative',
			prompt: 'Я не чув, що ти сказав.',
			answer: "I didn't hear what you said.",
			traps: {
				"didn't": ["don't", "haven't"],
				hear: ['heard', 'hearing'],
				said: ['saying', 'say'],
			},
		},
	],
})
