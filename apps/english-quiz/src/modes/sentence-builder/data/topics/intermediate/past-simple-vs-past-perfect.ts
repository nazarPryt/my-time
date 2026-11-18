import { defineTopic } from '../../define-topic'

export const pastSimpleVsPastPerfect = defineTopic({
	id: 'past-simple-vs-past-perfect',
	level: 'intermediate',
	title: 'Past Simple vs Past Perfect',
	subtitle: 'Минулий простий і минулий доконаний час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Past Simple розповідає про події в тому порядку, як вони сталися, або про одну завершену дію з часом (yesterday, in 2010). Past Perfect показує дію, що сталася раніше за іншу минулу подію: маркери already, yet, never … before, by the time. Після before/after порядок і так зрозумілий, тому там підходять обидва часи.',
			examples: [
				{
					text: 'She closed the window, sat down and opened her book.',
					translation: 'Вона зачинила вікно, сіла й розгорнула книжку.',
				},
				{
					text: 'When we got to the cinema the film had already started.',
					translation: 'Коли ми дісталися до кінотеатру, фільм уже почався.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Past Simple: V2 (worked, went). Past Perfect: had + V3 (had worked, had gone). Не плутайте другу й третю форми: went — gone, saw — seen, ate — eaten. Had часто скорочується до 'd: she'd, we'd.",
			examples: [
				{
					text: 'He went to the shop and bought some milk.',
					translation: 'Він пішов до магазину й купив молока.',
				},
				{
					text: 'By the time he went to the shop it had closed.',
					translation:
						'На той час, як він пішов до магазину, той уже зачинився.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Past Simple: Did + підмет + V1? Past Perfect: Had + підмет + V3? Did ставимо, коли питаємо про саму подію; had — коли питаємо, чи щось сталося раніше за іншу подію.',
			examples: [
				{
					text: 'Did you meet anyone at the station?',
					translation: 'Ти когось зустрів на вокзалі?',
				},
				{
					text: 'Had the guests already gone when you got home?',
					translation: 'Гості вже пішли, коли ти повернувся додому?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Past Simple: didn't + V1. Past Perfect: hadn't + V3, часто з yet («ще не» до іншої події).",
			examples: [
				{
					text: "We didn't stay at the hotel last summer.",
					translation: 'Минулого літа ми не зупинялися в готелі.',
				},
				{
					text: "The kettle hadn't boiled yet when she came in.",
					translation: 'Чайник ще не закипів, коли вона зайшла.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'past-simple-vs-past-perfect-1',
			form: 'affirmative',
			prompt: 'Коли я прийшов, фільм уже почався.',
			answer: 'When I arrived the film had already started.',
			traps: {
				had: ['has', 'have', 'was'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-2',
			form: 'affirmative',
			prompt: 'Я загубив ключ, який купив.',
			answer: 'I lost the key that I had bought.',
		},
		{
			id: 'past-simple-vs-past-perfect-3',
			form: 'affirmative',
			prompt: "Хтось уже з'їв мій торт, коли я повернувся.",
			answer: 'Someone had already eaten my cake when I came back.',
			accept: [
				'{Someone|Somebody} had already eaten my cake when I {came back|got back|returned}.',
			],
			traps: {
				had: ['did', 'was'],
				eaten: ['ate', 'eat'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-4',
			form: 'affirmative',
			prompt: 'Іван уже вийшов з дому, коли я подзвонив.',
			answer: 'Ivan had already gone out when I called.',
			accept: ['Ivan had already {gone out|left home} when I {called|phoned}.'],
			traps: {
				had: ['did', 'has'],
				gone: ['went', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-5',
			form: 'affirmative',
			prompt: 'Коли я вийшов на вулицю, хтось уже вкрав мій велосипед.',
			answer: 'When I went outside someone had already stolen my bike.',
			accept: [
				'When I went {outside|out} {someone|somebody} had already stolen my {bike|bicycle}.',
			],
			traps: {
				had: ['did', 'was'],
				stolen: ['stole', 'steal'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-6',
			form: 'affirmative',
			prompt: 'Коли почалася вистава, ми вже знайшли свої місця.',
			answer: 'When the play started we had already found our seats.',
			accept: [
				"When the {play|show|performance} {started|began} {we had|we'd} already found our seats.",
			],
			traps: {
				had: ['did', 'have'],
				found: ['find', 'founded'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-7',
			form: 'affirmative',
			prompt: 'Він сказав, що вже бачив цей фільм.',
			answer: 'He said he had already seen this film.',
			accept: [
				"He said {that|} {he had|he'd} already seen {this|that} {film|movie}.",
			],
			traps: {
				had: ['did', 'was'],
				seen: ['saw', 'see'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-8',
			form: 'affirmative',
			prompt: 'Вона зрозуміла, що забула свій пароль.',
			answer: 'She realized that she had forgotten her password.',
			accept: [
				"She {realized|realised} {that|} {she had|she'd} forgotten her password.",
			],
			traps: {
				had: ['did', 'was'],
				forgotten: ['forgot', 'forget'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-9',
			form: 'affirmative',
			prompt: 'Коли я приїхав, усі гості вже пішли.',
			answer: 'When I arrived all the guests had already gone.',
			accept: [
				'When I {arrived|got there} all the guests had already {gone|left}.',
			],
			traps: {
				had: ['did', 'has'],
				gone: ['went', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-10',
			form: 'affirmative',
			prompt: 'Коли ми дісталися вершини, сонце вже сіло.',
			answer: 'When we reached the top the sun had already set.',
			accept: [
				'When we {reached|got to} the top the sun had already {set|gone down}.',
			],
			traps: {
				had: ['did', 'has'],
				set: ['sat', 'setted'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-11',
			form: 'affirmative',
			prompt: 'На той час, як ми приїхали, матч уже почався.',
			answer: 'By the time we arrived the match had already begun.',
			accept: [
				'{By the time|When} we {arrived|got there} the match had already {begun|started}.',
			],
			traps: {
				had: ['did', 'was'],
				begun: ['began', 'begin'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-12',
			form: 'affirmative',
			prompt: 'Учителька була сердита, бо ми розбили вікно.',
			answer: 'The teacher was angry because we had broken the window.',
			accept: [
				"The teacher was angry because {we had broken|we'd broken|we broke} the window.",
			],
			traps: {
				was: ['were', 'had'],
				broken: ['break', 'breaked'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-13',
			form: 'affirmative',
			prompt: 'До вечора я вже написав три статті.',
			answer: 'By the evening I had already written three articles.',
			accept: [
				"By {the evening|evening} {I had|I'd} already written three articles.",
			],
			traps: {
				had: ['did', 'was'],
				written: ['wrote', 'write'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-14',
			form: 'affirmative',
			prompt: 'Я ніколи не співав на сцені до того вечора.',
			answer: 'I had never sung on stage before that evening.',
			accept: ["{I had|I'd} never sung on stage before that evening."],
			traps: {
				had: ['did', 'was'],
				sung: ['sang', 'sing'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-15',
			form: 'affirmative',
			prompt: 'Вона ніколи не плавала в морі до тієї подорожі.',
			answer: 'She had never swum in the sea before that trip.',
			accept: ["{She had|She'd} never swum in the sea before that trip."],
			traps: {
				had: ['did', 'was'],
				swum: ['swam', 'swim'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-16',
			form: 'affirmative',
			prompt: 'Коли я прийшов на роботу, начальник уже пішов.',
			answer: 'When I got to work the boss had already gone.',
			accept: [
				'When I {got to|arrived at} work the {boss|manager} had already {gone|left}.',
			],
			traps: {
				had: ['did', 'has'],
				gone: ['went', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-17',
			form: 'affirmative',
			prompt: 'Коли пролунав дзвінок, я вже закінчив тест.',
			answer: 'When the bell rang I had already finished the test.',
			accept: ["When the bell rang {I had|I'd} already finished the test."],
			traps: {
				rang: ['rung', 'ringed'],
				had: ['did', 'has'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-18',
			form: 'affirmative',
			prompt: 'Анна думала, що вже вимкнула праску.',
			answer: 'Anna thought she had already turned off the iron.',
			accept: [
				"Anna thought {that|} {she had|she'd} already {turned|switched} {off the iron|the iron off}.",
			],
			traps: {
				thought: ['thinked', 'think'],
				had: ['did', 'was'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-19',
			form: 'affirmative',
			prompt: 'Коли я прокинувся, мама вже спекла пиріг.',
			answer: 'When I woke up Mum had already baked a pie.',
			accept: [
				'{When|By the time} I woke up {Mum|Mom|my mum|my mom} had already baked a pie.',
			],
			traps: {
				woke: ['woken', 'waked'],
				had: ['did', 'was'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-20',
			form: 'affirmative',
			prompt: 'До 2015 року мій дідусь уже вийшов на пенсію.',
			answer: 'By 2015 my grandfather had already retired.',
			accept: [
				'By 2015 my {grandfather|grandpa|granddad} had already retired.',
			],
			traps: {
				had: ['did', 'has'],
				retired: ['retire', 'retiring'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-21',
			form: 'affirmative',
			prompt: 'Він розповів нам, що виріс у селі.',
			answer: 'He told us that he had grown up in a village.',
			accept: [
				"He told us {that|} {he had grown|he'd grown|he grew} up in a village.",
			],
			traps: {
				told: ['said', 'telled'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-22',
			form: 'affirmative',
			prompt: 'Коли ми приїхали, дитина вже народилася.',
			answer: 'When we arrived the baby had already been born.',
			accept: ['When we {arrived|got there} the baby had already been born.'],
			traps: {
				had: ['did', 'has'],
				been: ['be', 'being'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-23',
			form: 'affirmative',
			prompt: 'Я згадав, що вже чув цю історію.',
			answer: 'I remembered that I had already heard this story.',
			accept: [
				"I remembered {that|} {I had|I'd} already heard {this|that} story.",
			],
			traps: {
				had: ['did', 'was'],
				heard: ['hear', 'heared'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-24',
			form: 'affirmative',
			prompt: 'Кіт уже втік, коли я повернувся.',
			answer: 'The cat had already run away when I came back.',
			accept: [
				'The cat had already run away when I {came back|got back|returned}.',
			],
			traps: {
				had: ['did', 'was'],
				run: ['ran', 'runned'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-25',
			form: 'affirmative',
			prompt: 'Коли я відчинив двері, кіт вибіг на вулицю.',
			answer: 'When I opened the door the cat ran outside.',
			accept: ['When I opened the door the cat ran {outside|out}.'],
			traps: {
				ran: ['run', 'runned'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-26',
			form: 'affirmative',
			prompt: 'Він встав, випив кави і пішов на роботу.',
			answer: 'He got up, drank some coffee and went to work.',
			accept: [
				'He got up {drank|had} {some|} coffee and {went to|left for} work.',
			],
			traps: {
				drank: ['drunk', 'drink'],
				went: ['gone', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-27',
			form: 'affirmative',
			prompt: 'Учора я прийшов додому, приготував вечерю і ліг спати.',
			answer: 'Yesterday I came home, cooked dinner and went to bed.',
			accept: [
				'Yesterday I {came|got} home {cooked|made} dinner and went to bed.',
			],
			traps: {
				came: ['come', 'comed'],
				went: ['gone', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-28',
			form: 'affirmative',
			prompt: 'Він узяв свою сумку, вийшов і зачинив двері.',
			answer: 'He took his bag, went out and closed the door.',
			accept: ['He took his bag {went out|left} and closed the door.'],
			traps: {
				took: ['taken', 'take'],
				went: ['gone', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-29',
			form: 'affirmative',
			prompt: 'У 2018 році ми переїхали до Одеси.',
			answer: 'In 2018 we moved to Odesa.',
			traps: {
				moved: ['had', 'move'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-30',
			form: 'affirmative',
			prompt: 'Коли задзвонив телефон, я відразу відповів.',
			answer: 'When the phone rang I answered it immediately.',
			accept: [
				'When the phone rang I {answered it|answered} {immediately|at once|right away}.',
			],
			traps: {
				rang: ['rung', 'ringed'],
				answered: ['had', 'answer'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-31',
			form: 'affirmative',
			prompt: 'Спочатку ми пообідали, а потім пішли в кіно.',
			answer: 'First we had lunch and then went to the cinema.',
			accept: [
				'First we had lunch and then {we|} went to the cinema.',
				'First we had lunch then we went to the cinema.',
			],
			traps: {
				went: ['gone', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-32',
			form: 'affirmative',
			prompt: 'Він знайшов гаманець і відніс його в поліцію.',
			answer: 'He found a wallet and took it to the police.',
			accept: ['He found {a|the} wallet and took it to the police.'],
			traps: {
				found: ['find', 'founded'],
				took: ['taken', 'take'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-33',
			form: 'affirmative',
			prompt: 'Учора ввечері я написав лист і відправив його.',
			answer: 'Last night I wrote a letter and sent it.',
			accept: ['{Last night|Yesterday evening} I wrote a letter and sent it.'],
			traps: {
				wrote: ['written', 'write'],
				sent: ['sended', 'send'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-34',
			form: 'affirmative',
			prompt: 'Коли ми вийшли з кінотеатру, почався дощ.',
			answer: 'When we left the cinema it started to rain.',
			accept: [
				'When we {left|came out of} the cinema it {started|began} {to rain|raining}.',
			],
			traps: {
				started: ['had', 'start'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-35',
			form: 'affirmative',
			prompt: 'Вона подивилася на годинник і вибігла з кімнати.',
			answer: 'She looked at the clock and ran out of the room.',
			accept: ['She looked at {the clock|her watch} and ran out of the room.'],
			traps: {
				ran: ['run', 'runned'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-36',
			form: 'affirmative',
			prompt: 'Я вимкнув світло і заснув.',
			answer: 'I turned off the light and fell asleep.',
			accept: [
				'I {turned|switched} {off the light|the light off} and fell asleep.',
			],
			traps: {
				fell: ['fallen', 'fall'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-37',
			form: 'affirmative',
			prompt: 'Два дні тому він продав свою стару машину.',
			answer: 'Two days ago he sold his old car.',
			traps: {
				sold: ['had', 'selled'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-38',
			form: 'affirmative',
			prompt: 'Коли вчитель увійшов, усі встали.',
			answer: 'When the teacher came in everyone stood up.',
			accept: [
				'When the teacher {came in|walked in} {everyone|everybody} stood up.',
			],
			traps: {
				came: ['come', 'comed'],
				stood: ['had', 'standed'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-39',
			form: 'affirmative',
			prompt: 'Вона сіла в машину і поїхала.',
			answer: 'She got into the car and drove away.',
			accept: ['She got {into|in} the car and drove {away|off}.'],
			traps: {
				drove: ['driven', 'drive'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-40',
			form: 'affirmative',
			prompt: 'О сьомій я прокинувся і пішов на пробіжку.',
			answer: 'At seven I woke up and went for a run.',
			accept: ["At seven {o'clock|} I woke up and went for a run."],
			traps: {
				woke: ['woken', 'waked'],
				went: ['gone', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-41',
			form: 'affirmative',
			prompt: 'Після того як я поснідав, я пішов до школи.',
			answer: 'After I had breakfast I went to school.',
			accept: ["After {I had|I had had|I'd had} breakfast I went to school."],
			traps: {
				went: ['gone', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-42',
			form: 'affirmative',
			prompt: 'Коли вона побачила павука, вона закричала.',
			answer: 'When she saw the spider she screamed.',
			accept: ['When she saw {the|a} spider she {screamed|shouted}.'],
			traps: {
				saw: ['seen', 'see'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-43',
			form: 'affirmative',
			prompt: 'Ми купили квитки, сіли в потяг і заснули.',
			answer: 'We bought tickets, got on the train and fell asleep.',
			accept: [
				'We bought {tickets|the tickets} got on the train and fell asleep.',
			],
			traps: {
				bought: ['brought', 'buyed'],
				fell: ['fallen', 'fall'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-44',
			form: 'affirmative',
			prompt: 'Минулого року я вперше побачив море.',
			answer: 'Last year I saw the sea for the first time.',
			traps: {
				saw: ['seen', 'had'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-45',
			form: 'affirmative',
			prompt: 'Коли гра закінчилася, усі пішли додому.',
			answer: 'When the game ended everyone went home.',
			accept: [
				'When the game {ended|had ended|finished|had finished} {everyone|everybody} went home.',
			],
			traps: {
				went: ['gone', 'go'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-46',
			form: 'question',
			prompt: 'Ти коли-небудь був у Києві до того року?',
			answer: 'Had you ever been to Kyiv before that year?',
			traps: {
				Had: ['Do', 'Have'],
				been: ['was', 'gone'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-47',
			form: 'question',
			prompt: 'Фільм уже закінчився, коли ти прокинувся?',
			answer: 'Had the film already ended when you woke up?',
			accept: [
				'Had the {film|movie} already {ended|finished} when you woke up?',
			],
			traps: {
				Had: ['Did', 'Has'],
				woke: ['woken', 'waked'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-48',
			form: 'question',
			prompt: 'Вони вже вибрали ресторан, коли ти до них приєднався?',
			answer: 'Had they already chosen a restaurant when you joined them?',
			accept: [
				'Had they already chosen {a|the} restaurant when you joined them?',
			],
			traps: {
				Had: ['Did', 'Have'],
				chosen: ['chose', 'choose'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-49',
			form: 'question',
			prompt: 'Ти вже поговорив з Анною, коли почалася нарада?',
			answer: 'Had you already spoken to Anna when the meeting started?',
			accept: [
				'Had you already {spoken to|spoken with|talked to} Anna when the meeting {started|began}?',
			],
			traps: {
				Had: ['Did', 'Have'],
				spoken: ['spoke', 'speak'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-50',
			form: 'question',
			prompt: 'Скільки разів ти вже бачив цей фільм до того вечора?',
			answer: 'How many times had you seen this film before that evening?',
			accept: [
				'How many times had you {already|} seen {this|that} {film|movie} before that evening?',
			],
			traps: {
				had: ['did', 'have'],
				seen: ['saw', 'see'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-51',
			form: 'question',
			prompt: 'Що ти вже встиг зробити до того, як прийшли гості?',
			answer: 'What had you done by the time the guests arrived?',
			accept: [
				'What had you {already|} done {by the time|before} the guests {arrived|came}?',
			],
			traps: {
				had: ['have', 'has'],
				done: ['did', 'do'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-52',
			form: 'question',
			prompt: 'Вона вже вирішила, коли ти з нею поговорив?',
			answer: 'Had she already decided when you spoke to her?',
			accept: [
				'Had she already decided when you {spoke|talked} {to|with} her?',
			],
			traps: {
				Had: ['Did', 'Has'],
				decided: ['decide', 'decides'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-53',
			form: 'question',
			prompt: 'Ти знав Івана до того дня?',
			answer: 'Had you known Ivan before that day?',
			accept: ['{Had you known|Did you know} Ivan before that day?'],
			traps: {
				Had: ['Have', 'Has'],
				known: ['knew', 'knowed'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-54',
			form: 'question',
			prompt: 'Твій брат уже повернувся, коли ти прийшов додому?',
			answer: 'Had your brother already come back when you got home?',
			accept: [
				'Had your brother already {come back|got back|returned} when you got home?',
			],
			traps: {
				Had: ['Did', 'Has'],
				come: ['came', 'comed'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-55',
			form: 'question',
			prompt: 'Ти коли-небудь їздив на велосипеді до того літа?',
			answer: 'Had you ever ridden a bike before that summer?',
			accept: ['Had you ever ridden a {bike|bicycle} before that summer?'],
			traps: {
				Had: ['Do', 'Have'],
				ridden: ['rode', 'ride'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-56',
			form: 'question',
			prompt: 'Діти вже прокинулися, коли ти прийшов?',
			answer: 'Had the children already woken up when you arrived?',
			accept: [
				'Had the children already woken up when you {arrived|came|got there}?',
			],
			traps: {
				Had: ['Did', 'Have'],
				woken: ['woke', 'wake'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-57',
			form: 'question',
			prompt: 'Ти вже написав лист, коли вона подзвонила?',
			answer: 'Had you already written the letter when she called?',
			accept: ['Had you already written the letter when she {called|phoned}?'],
			traps: {
				Had: ['Did', 'Have'],
				written: ['wrote', 'write'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-58',
			form: 'question',
			prompt: 'Вона вже вивчила англійську, коли переїхала до Лондона?',
			answer: 'Had she already learned English when she moved to London?',
			accept: [
				'Had she already {learned|learnt} English when she moved to London?',
			],
			traps: {
				Had: ['Did', 'Has'],
				learned: ['learn', 'learns'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-59',
			form: 'question',
			prompt: 'Ти помітив, що він уже пішов?',
			answer: 'Did you notice that he had already left?',
			accept: ["Did you notice {that|} {he had|he'd} already {left|gone}?"],
			traps: {
				Did: ['Do', 'Does'],
				had: ['did', 'has'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-60',
			form: 'question',
			prompt: 'Ти знав, що вони вже продали свій будинок?',
			answer: 'Did you know that they had already sold their house?',
			accept: [
				"Did you know {that|} {they had|they'd} already sold their house?",
			],
			traps: {
				Did: ['Does', 'Was'],
				had: ['did', 'has'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-61',
			form: 'question',
			prompt: 'Що ти зробив, коли побачив пожежу?',
			answer: 'What did you do when you saw the fire?',
			accept: ['What did you do when you saw {the|a} fire?'],
			traps: {
				do: ['done', 'doing'],
				saw: ['seen', 'see'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-62',
			form: 'question',
			prompt: 'Ти зачинив вікно, перш ніж піти?',
			answer: 'Did you close the window before you left?',
			accept: [
				'{Did you close|Had you closed} the window before you {left|went out}?',
			],
			traps: {
				left: ['leaved', 'leave'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-63',
			form: 'question',
			prompt: 'Коли ти приїхав до Львова?',
			answer: 'When did you arrive in Lviv?',
			accept: ['When did you {arrive in|get to|come to} Lviv?'],
			traps: {
				did: ['had', 'have'],
				arrive: ['arrived', 'arriving'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-64',
			form: 'question',
			prompt: 'Ви ходили в музей минулої неділі?',
			answer: 'Did you go to the museum last Sunday?',
			traps: {
				Did: ['Had', 'Have'],
				go: ['gone', 'went'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-65',
			form: 'question',
			prompt: 'Хто розбив цю чашку вчора?',
			answer: 'Who broke this cup yesterday?',
			accept: ['Who broke {this|that} cup yesterday?'],
			traps: {
				broke: ['broken', 'had'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-66',
			form: 'question',
			prompt: 'Що ти сказав, коли вона заплакала?',
			answer: 'What did you say when she started crying?',
			accept: ['What did you say when she {started|began} {crying|to cry}?'],
			traps: {
				did: ['have', 'does'],
				say: ['said', 'says'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-67',
			form: 'question',
			prompt: 'Ти відразу впізнав його, коли побачив?',
			answer: 'Did you recognize him immediately when you saw him?',
			accept: [
				'Did you {recognize|recognise} him {immediately|at once|right away} when you saw him?',
			],
			traps: {
				Did: ['Had', 'Have'],
				saw: ['seen', 'see'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-68',
			form: 'question',
			prompt: 'Куди ви пішли після уроку?',
			answer: 'Where did you go after the lesson?',
			traps: {
				did: ['have', 'does'],
				go: ['gone', 'went'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-69',
			form: 'question',
			prompt: 'Він повечеряв і відразу ліг спати?',
			answer: 'Did he have dinner and go to bed immediately?',
			accept: [
				'Did he have dinner and {go to bed immediately|go straight to bed|go to bed right away}?',
			],
			traps: {
				have: ['had', 'has'],
				go: ['gone', 'went'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-70',
			form: 'question',
			prompt: 'О котрій годині закінчився концерт?',
			answer: 'What time did the concert end?',
			accept: ['What time did the concert {end|finish}?'],
			traps: {
				did: ['had', 'has'],
				end: ['ended', 'ending'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-71',
			form: 'question',
			prompt: 'Коли ти дізнався правду?',
			answer: 'When did you find out the truth?',
			accept: ['When did you {find out|learn} the truth?'],
			traps: {
				did: ['have', 'do'],
				find: ['found', 'finded'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-72',
			form: 'question',
			prompt: 'Хто виграв матч минулої суботи?',
			answer: 'Who won the match last Saturday?',
			traps: {
				won: ['had', 'winned'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-73',
			form: 'question',
			prompt: 'Ви повернулися додому, коли пішов дощ?',
			answer: 'Did you go back home when it started raining?',
			accept: [
				'Did you {go back|come back|get back} home when it {started|began} {raining|to rain}?',
			],
			traps: {
				Did: ['Do', 'Does'],
				go: ['gone', 'went'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-74',
			form: 'question',
			prompt: 'Скільки ти заплатив за ці черевики?',
			answer: 'How much did you pay for these shoes?',
			accept: ['How much did you pay for {these|those} {shoes|boots}?'],
			traps: {
				did: ['have', 'does'],
				pay: ['paid', 'payed'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-75',
			form: 'question',
			prompt: 'Ти снідав сьогодні вранці?',
			answer: 'Did you have breakfast this morning?',
			traps: {
				Did: ['Had', 'Do'],
				have: ['has', 'having'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-76',
			form: 'negative',
			prompt: 'Я був голодний, бо нічого не їв з самого ранку.',
			answer: "I was hungry because I hadn't eaten anything since morning.",
			accept: [
				"I was hungry because I hadn't eaten anything since {morning|the morning}.",
			],
			traps: {
				"hadn't": ["didn't", "haven't"],
				eaten: ['ate', 'eat'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-77',
			form: 'negative',
			prompt: 'Коли ми приїхали, магазини ще не відкрилися.',
			answer: "When we arrived the shops hadn't opened yet.",
			accept: [
				"When we {arrived|got there} the {shops|stores} hadn't opened yet.",
			],
			traps: {
				"hadn't": ["didn't", "haven't"],
				opened: ['open', 'opens'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-78',
			form: 'negative',
			prompt: 'Вона ще не прочитала лист, коли я подзвонив.',
			answer: "She hadn't read the letter yet when I called.",
			accept: ["She hadn't read the letter yet when I {called|phoned}."],
			traps: {
				"hadn't": ["didn't", "wasn't"],
				read: ['readed', 'reads'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-79',
			form: 'negative',
			prompt: 'Я ще не вирішив, що робити, коли він запитав.',
			answer: "I hadn't decided what to do yet when he asked.",
			accept: [
				"I hadn't {decided what to do yet|yet decided what to do} when he asked.",
			],
			traps: {
				"hadn't": ["didn't", "haven't"],
				decided: ['decide', 'decides'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-80',
			form: 'negative',
			prompt: 'Автобус ще не приїхав, коли ми прийшли на зупинку.',
			answer: "The bus hadn't come yet when we got to the stop.",
			accept: [
				"The bus hadn't {come|arrived} yet when we got to the {stop|bus stop}.",
			],
			traps: {
				"hadn't": ["didn't", "wasn't"],
				come: ['came', 'comed'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-81',
			form: 'negative',
			prompt: 'Я не впізнав його, бо він дуже змінився.',
			answer: "I didn't recognize him because he had changed a lot.",
			accept: [
				"I didn't {recognize|recognise} him because {he had|he'd|he} changed a lot.",
			],
			traps: {
				"didn't": ["haven't", "wasn't"],
				recognize: ['recognized', 'recognizes'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-82',
			form: 'negative',
			prompt: 'Вона не пішла гуляти, бо не зробила уроки.',
			answer: "She didn't go out because she hadn't done her homework.",
			accept: [
				"She didn't {go out|go for a walk} because she {hadn't done|didn't do} her homework.",
			],
			traps: {
				go: ['gone', 'went'],
				done: ['did', 'doing'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-83',
			form: 'negative',
			prompt: 'Коли я прийшов, вони ще не почали їсти.',
			answer: "When I arrived they hadn't started eating yet.",
			accept: [
				"When I {arrived|came|got there} they hadn't {started|begun} {eating|to eat} yet.",
			],
			traps: {
				"hadn't": ["didn't", "haven't"],
				started: ['start', 'starts'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-84',
			form: 'negative',
			prompt: 'Я не знав, що він уже одружився.',
			answer: "I didn't know that he had already got married.",
			accept: [
				"I didn't know {that|} {he had|he'd} already {got|gotten} married.",
			],
			traps: {
				"didn't": ["haven't", "wasn't"],
				had: ['did', 'has'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-85',
			form: 'negative',
			prompt: 'Урок ще не почався, коли ми зайшли.',
			answer: "The lesson hadn't started yet when we came in.",
			accept: [
				"The lesson hadn't {started|begun} yet when we {came in|walked in}.",
			],
			traps: {
				"hadn't": ["didn't", "wasn't"],
				came: ['come', 'comed'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-86',
			form: 'negative',
			prompt: 'Марія ще не повернулася з роботи, коли я подзвонив.',
			answer: "Maria hadn't come back from work yet when I called.",
			accept: [
				"Maria hadn't {come back|got back|returned} from work yet when I {called|phoned}.",
			],
			traps: {
				"hadn't": ["didn't", "haven't"],
				come: ['came', 'comed'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-87',
			form: 'negative',
			prompt: 'Я ще не доїв сніданок, коли приїхало таксі.',
			answer: "I hadn't finished breakfast yet when the taxi arrived.",
			accept: [
				"I hadn't finished {my|} breakfast yet when the taxi {arrived|came}.",
			],
			traps: {
				"hadn't": ["didn't", "haven't"],
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-88',
			form: 'negative',
			prompt: 'Він сказав, що ще не отримав мого листа.',
			answer: "He said he hadn't received my letter yet.",
			accept: [
				"He said {that|} he hadn't {received|got|gotten} my letter yet.",
			],
			traps: {
				"hadn't": ["didn't", "haven't"],
				received: ['receive', 'receives'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-89',
			form: 'negative',
			prompt: 'Минулого тижня я не бачив Ігоря.',
			answer: "Last week I didn't see Ihor.",
			traps: {
				"didn't": ["hadn't", "haven't"],
				see: ['seen', 'saw'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-90',
			form: 'negative',
			prompt: 'Він прийшов додому, але нічого не сказав.',
			answer: "He came home but didn't say anything.",
			accept: ["He {came|got} home but {didn't say anything|said nothing}."],
			traps: {
				"didn't": ["hadn't", "doesn't"],
				say: ['said', 'says'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-91',
			form: 'negative',
			prompt: 'Учора ввечері ми не дивилися телевізор.',
			answer: "Last night we didn't watch TV.",
			accept: ["{Last night|Yesterday evening} we didn't watch TV."],
			traps: {
				"didn't": ["hadn't", "haven't"],
				watch: ['watched', 'watching'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-92',
			form: 'negative',
			prompt: 'Вона прочитала мій лист, але не відповіла.',
			answer: "She read my letter but didn't reply.",
			accept: ["She read my letter but didn't {reply|answer|write back}."],
			traps: {
				"didn't": ["hadn't", "wasn't"],
				reply: ['replied', 'replies'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-93',
			form: 'negative',
			prompt: 'Коли я попросив про допомогу, він мені не допоміг.',
			answer: "When I asked for help he didn't help me.",
			traps: {
				"didn't": ["hadn't", "wasn't"],
				help: ['helped', 'helps'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-94',
			form: 'negative',
			prompt: 'У 2019 році ми не їздили у відпустку.',
			answer: "In 2019 we didn't go on holiday.",
			accept: ["In 2019 we didn't go on {holiday|vacation}."],
			traps: {
				"didn't": ["hadn't", "haven't"],
				go: ['gone', 'went'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-95',
			form: 'negative',
			prompt: 'Учора ти не замкнув двері.',
			answer: "Yesterday you didn't lock the door.",
			traps: {
				"didn't": ["hadn't", "haven't"],
				lock: ['locked', 'locks'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-96',
			form: 'negative',
			prompt: 'Минулої ночі він зовсім не спав.',
			answer: "Last night he didn't sleep at all.",
			traps: {
				"didn't": ["hadn't", "doesn't"],
				sleep: ['slept', 'sleeping'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-97',
			form: 'negative',
			prompt: 'Я подзвонив Анні, але вона не взяла слухавку.',
			answer: "I called Anna but she didn't answer.",
			accept: ["I {called|phoned|rang} Anna but she didn't {answer|pick up}."],
			traps: {
				"didn't": ["hadn't", "doesn't"],
				answer: ['answered', 'answers'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-98',
			form: 'negative',
			prompt: "Минулої п'ятниці Тарас не прийшов на роботу.",
			answer: "Last Friday Taras didn't come to work.",
			traps: {
				"didn't": ["hadn't", "wasn't"],
				come: ['came', 'comed'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-99',
			form: 'negative',
			prompt: 'Він купив квитки, але не пішов на концерт.',
			answer: "He bought tickets but didn't go to the concert.",
			accept: ["He bought {tickets|the tickets} but didn't go to the concert."],
			traps: {
				bought: ['brought', 'buyed'],
				go: ['gone', 'went'],
			},
		},
		{
			id: 'past-simple-vs-past-perfect-100',
			form: 'negative',
			prompt: 'Минулого тижня я не ходив у спортзал.',
			answer: "Last week I didn't go to the gym.",
			traps: {
				"didn't": ["hadn't", "haven't"],
				go: ['gone', 'went'],
			},
		},
	],
})
