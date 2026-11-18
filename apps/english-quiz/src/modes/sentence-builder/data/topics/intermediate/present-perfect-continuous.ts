import { defineTopic } from '../../define-topic'

export const presentPerfectContinuous = defineTopic({
	id: 'present-perfect-continuous',
	level: 'intermediate',
	title: 'Present Perfect Continuous',
	subtitle: 'Теперішній доконано-тривалий час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Present Perfect Continuous показує дію, яка почалася в минулому й триває досі (з for/since: «вже годину», «з ранку», «весь день»), або дію, що щойно тривала й має видимий результат зараз. Українською тут зазвичай теперішній час («Я чекаю вже годину»), але англійською не am/is/are + -ing, а have/has been + -ing. Зі станами (know, like, be) цей час не вживають, а для результату з кількістю (I have written three letters) потрібен Present Perfect.',
			examples: [
				{
					text: "We've been sitting here since noon.",
					translation: 'Ми сидимо тут з полудня.',
				},
				{
					text: 'Your shoes are muddy. Have you been walking in the forest?',
					translation: 'У тебе брудні черевики. Ти гуляв у лісі?',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"I/you/we/they + have been + дієслово з -ing; he/she/it + has been + -ing. Скорочення: I've, you've, we've, they've, he's, she's, it's.",
			examples: [
				{
					text: "They've been playing cards since dinner.",
					translation: 'Вони грають у карти з вечері.',
				},
				{
					text: "The phone's been ringing for a minute.",
					translation: 'Телефон дзвонить уже хвилину.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Have/Has + підмет + been + -ing? «Як довго…?» — How long have/has … been + -ing?',
			examples: [
				{
					text: 'How long has he been jogging?',
					translation: 'Як довго він бігає підтюпцем?',
				},
				{
					text: 'Have you been gardening?',
					translation: 'Ти працював у саду?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"haven't/hasn't (have not/has not) + been + -ing. Часто з long («недовго») або lately/recently («останнім часом»).",
			examples: [
				{
					text: "We haven't been fishing long.",
					translation: 'Ми рибалимо ще недовго.',
				},
				{
					text: "She hasn't been practising lately.",
					translation: 'Останнім часом вона не тренується.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'present-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'Я чекаю вже годину.',
			answer: 'I have been waiting for an hour.',
			traps: {
				waiting: ['wait', 'waited', 'waits'],
			},
		},
		{
			id: 'present-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'Вона вчить англійську вже два роки.',
			answer: 'She has been learning English for two years.',
			traps: {
				has: ['have', 'is', 'was'],
			},
		},
		{
			id: 'present-perfect-continuous-3',
			form: 'affirmative',
			prompt: 'Дощ іде вже три години.',
			answer: 'It has been raining for three hours.',
			accept: ["{It has|It's} been raining for three hours."],
			traps: {
				has: ['is', 'was'],
				raining: ['rain', 'rained'],
			},
		},
		{
			id: 'present-perfect-continuous-4',
			form: 'affirmative',
			prompt: 'Ми чекаємо на автобус уже двадцять хвилин.',
			answer: "We've been waiting for the bus for twenty minutes.",
			traps: {
				"We've": ["We're"],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-5',
			form: 'affirmative',
			prompt: "Він грає в комп'ютерні ігри з ранку.",
			answer: 'He has been playing computer games since this morning.',
			accept: [
				"{He has|He's} been playing {computer|video} games since {this|} morning.",
			],
			traps: {
				has: ['is', 'does'],
				since: ['for', 'from'],
			},
		},
		{
			id: 'present-perfect-continuous-6',
			form: 'affirmative',
			prompt: 'Діти дивляться мультики вже дві години.',
			answer: 'The children have been watching cartoons for two hours.',
			accept: [
				'The {children|kids} have been watching cartoons for two hours.',
			],
			traps: {
				have: ['are', 'has'],
				watching: ['watch', 'watched'],
			},
		},
		{
			id: 'present-perfect-continuous-7',
			form: 'affirmative',
			prompt: 'Я шукаю свої окуляри вже пів години.',
			answer: "I've been looking for my glasses for half an hour.",
			traps: {
				"I've": ["I'm"],
				looking: ['look', 'looked'],
			},
		},
		{
			id: 'present-perfect-continuous-8',
			form: 'affirmative',
			prompt: 'Вона розмовляє по телефону з обіду.',
			answer: 'She has been talking on the phone since lunch.',
			accept: [
				"{She has|She's} been {talking|speaking} on the phone since {lunch|lunchtime}.",
			],
			traps: {
				has: ['is', 'have'],
				since: ['for', 'from'],
			},
		},
		{
			id: 'present-perfect-continuous-9',
			form: 'affirmative',
			prompt: "Тато веде машину вже п'ять годин.",
			answer: 'Dad has been driving for five hours.',
			accept: [
				"{Dad has|Dad's|My dad has|My dad's} been driving for five hours.",
			],
			traps: {
				has: ['is', 'was'],
				driving: ['drive', 'drove'],
			},
		},
		{
			id: 'present-perfect-continuous-10',
			form: 'affirmative',
			prompt: 'Я прибираю квартиру з ранку.',
			answer: "I've been cleaning the flat since this morning.",
			accept: [
				"I've been cleaning the {flat|apartment} since {this|} morning.",
			],
			traps: {
				"I've": ["I'm"],
				cleaning: ['clean', 'cleaned'],
			},
		},
		{
			id: 'present-perfect-continuous-11',
			form: 'affirmative',
			prompt: 'Сніг іде з учорашнього дня.',
			answer: 'It has been snowing since yesterday.',
			accept: ["{It has|It's} been snowing since yesterday."],
			traps: {
				since: ['for', 'from'],
				snowing: ['snow', 'snowed'],
			},
		},
		{
			id: 'present-perfect-continuous-12',
			form: 'affirmative',
			prompt: 'Мій брат ремонтує свою машину весь день.',
			answer: 'My brother has been fixing his car all day.',
			accept: [
				"{My brother has|My brother's} been {fixing|repairing} his car {all day|the whole day}.",
			],
			traps: {
				has: ['is', 'was'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-13',
			form: 'affirmative',
			prompt: 'Ми гуляємо в парку вже годину.',
			answer: "We've been walking in the park for an hour.",
			traps: {
				"We've": ["We're"],
				walking: ['walk', 'walked'],
			},
		},
		{
			id: 'present-perfect-continuous-14',
			form: 'affirmative',
			prompt: 'Я втомилася, бо готую з самого ранку.',
			answer: "I'm tired because I've been cooking since this morning.",
			accept: ["I'm tired because I've been cooking since {this|} morning."],
			traps: {
				been: ['being', 'am'],
				cooking: ['cook', 'cooks'],
			},
		},
		{
			id: 'present-perfect-continuous-15',
			form: 'affirmative',
			prompt: 'Він готується до марафону вже три місяці.',
			answer: 'He has been preparing for the marathon for three months.',
			accept: [
				"{He has|He's} been preparing for {the|a} marathon for three months.",
			],
			traps: {
				has: ['is', 'was'],
				preparing: ['prepare', 'prepares'],
			},
		},
		{
			id: 'present-perfect-continuous-16',
			form: 'affirmative',
			prompt: 'Я читаю цю книжку вже тиждень.',
			answer: "I've been reading this book for a week.",
			traps: {
				"I've": ["I'm"],
				reading: ['read', 'reads'],
			},
		},
		{
			id: 'present-perfect-continuous-17',
			form: 'affirmative',
			prompt: 'Анна готує на кухні вже дві години.',
			answer: 'Anna has been cooking in the kitchen for two hours.',
			accept: ["{Anna has|Anna's} been cooking in the kitchen for two hours."],
			traps: {
				has: ['is', 'have'],
				cooking: ['cook', 'cooks'],
			},
		},
		{
			id: 'present-perfect-continuous-18',
			form: 'affirmative',
			prompt: 'Сусіди сваряться вже годину.',
			answer: 'The neighbours have been arguing for an hour.',
			accept: [
				'{The|Our} {neighbours|neighbors} have been arguing for an hour.',
			],
			traps: {
				have: ['are', 'has'],
				arguing: ['argue', 'argued'],
			},
		},
		{
			id: 'present-perfect-continuous-19',
			form: 'affirmative',
			prompt: 'Собака гавкає вже пів години.',
			answer: 'The dog has been barking for half an hour.',
			accept: ["{The dog has|The dog's} been barking for half an hour."],
			traps: {
				has: ['is', 'was'],
				barking: ['bark', 'barked'],
			},
		},
		{
			id: 'present-perfect-continuous-20',
			form: 'affirmative',
			prompt: 'Я думаю про це весь тиждень.',
			answer: "I've been thinking about it all week.",
			accept: ["I've been thinking about {it|this} {all week|the whole week}."],
			traps: {
				"I've": ["I'm"],
				thinking: ['think', 'thought'],
			},
		},
		{
			id: 'present-perfect-continuous-21',
			form: 'affirmative',
			prompt: 'Ми плануємо цю подорож уже пів року.',
			answer: "We've been planning this trip for six months.",
			accept: [
				"We've been planning this {trip|journey} for {six months|half a year}.",
			],
			traps: {
				"We've": ["We're"],
				planning: ['plan', 'planned'],
			},
		},
		{
			id: 'present-perfect-continuous-22',
			form: 'affirmative',
			prompt: 'Том грає на гітарі з обіду.',
			answer: 'Tom has been playing the guitar since lunch.',
			accept: [
				"{Tom has|Tom's} been playing {the guitar|guitar} since {lunch|lunchtime}.",
			],
			traps: {
				has: ['is', 'does'],
				playing: ['play', 'played'],
			},
		},
		{
			id: 'present-perfect-continuous-23',
			form: 'affirmative',
			prompt: "Ти сидиш за комп'ютером уже шість годин.",
			answer: "You've been sitting at the computer for six hours.",
			accept: [
				"You've been sitting {at|in front of} the computer for six hours.",
			],
			traps: {
				"You've": ["You're"],
				sitting: ['sit', 'sat'],
			},
		},
		{
			id: 'present-perfect-continuous-24',
			form: 'affirmative',
			prompt: 'Мій телефон заряджається вже дві години.',
			answer: 'My phone has been charging for two hours.',
			accept: ["{My phone has|My phone's} been charging for two hours."],
			traps: {
				has: ['is', 'was'],
				charging: ['charge', 'charges'],
			},
		},
		{
			id: 'present-perfect-continuous-25',
			form: 'affirmative',
			prompt: 'Вона плаче вже десять хвилин.',
			answer: 'She has been crying for ten minutes.',
			accept: ["{She has|She's} been crying for ten minutes."],
			traps: {
				has: ['is', 'was'],
				crying: ['cry', 'cried'],
			},
		},
		{
			id: 'present-perfect-continuous-26',
			form: 'affirmative',
			prompt: 'Я пишу цей звіт з понеділка.',
			answer: "I've been writing this report since Monday.",
			traps: {
				since: ['for', 'from'],
				writing: ['write', 'wrote'],
			},
		},
		{
			id: 'present-perfect-continuous-27',
			form: 'affirmative',
			prompt: 'Вони будують цей міст уже два роки.',
			answer: "They've been building this bridge for two years.",
			traps: {
				"They've": ["They're"],
				building: ['build', 'built'],
			},
		},
		{
			id: 'present-perfect-continuous-28',
			form: 'affirmative',
			prompt: 'Ми розмовляємо вже годину.',
			answer: "We've been talking for an hour.",
			accept: ["We've been {talking|speaking} for an hour."],
			traps: {
				"We've": ["We're"],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-29',
			form: 'affirmative',
			prompt: 'Хтось дзвонить у двері вже кілька хвилин.',
			answer: 'Someone has been ringing the doorbell for a few minutes.',
			accept: [
				"{Someone has|Someone's|Somebody has|Somebody's} been ringing the doorbell for {a few|several} minutes.",
			],
			traps: {
				has: ['is', 'have'],
				ringing: ['ring', 'rang'],
			},
		},
		{
			id: 'present-perfect-continuous-30',
			form: 'affirmative',
			prompt: 'Я вчу цей вірш уже годину.',
			answer: "I've been learning this poem for an hour.",
			traps: {
				"I've": ["I'm"],
				learning: ['learn', 'learns'],
			},
		},
		{
			id: 'present-perfect-continuous-31',
			form: 'affirmative',
			prompt: 'Кейт шукає роботу з літа.',
			answer: 'Kate has been looking for a job since the summer.',
			accept: [
				"{Kate has|Kate's} been looking for {a job|work} since {the summer|summer}.",
			],
			traps: {
				has: ['is', 'does'],
				since: ['for', 'from'],
			},
		},
		{
			id: 'present-perfect-continuous-32',
			form: 'affirmative',
			prompt: 'Я чекаю на тебе вже сорок хвилин!',
			answer: "I've been waiting for you for forty minutes!",
			traps: {
				"I've": ["I'm"],
				waiting: ['wait', 'waited'],
			},
		},
		{
			id: 'present-perfect-continuous-33',
			form: 'affirmative',
			prompt: 'Ми фарбуємо паркан весь день.',
			answer: "We've been painting the fence all day.",
			accept: ["We've been painting the fence {all day|the whole day}."],
			traps: {
				"We've": ["We're"],
				painting: ['paint', 'painted'],
			},
		},
		{
			id: 'present-perfect-continuous-34',
			form: 'affirmative',
			prompt: 'Діти граються надворі вже три години.',
			answer: 'The children have been playing outside for three hours.',
			accept: [
				'The {children|kids} have been playing outside for three hours.',
			],
			traps: {
				have: ['are', 'has'],
				playing: ['play', 'played'],
			},
		},
		{
			id: 'present-perfect-continuous-35',
			form: 'affirmative',
			prompt: 'Ти весь вечір дивишся у свій телефон.',
			answer: "You've been looking at your phone all evening.",
			accept: [
				"You've been looking at your phone {all evening|the whole evening}.",
			],
			traps: {
				"You've": ["You're"],
				looking: ['look', 'looked'],
			},
		},
		{
			id: 'present-perfect-continuous-36',
			form: 'affirmative',
			prompt: 'Макс бігає вже годину.',
			answer: 'Max has been running for an hour.',
			accept: ["{Max has|Max's} been running for an hour."],
			traps: {
				has: ['is', 'was'],
				running: ['run', 'ran'],
			},
		},
		{
			id: 'present-perfect-continuous-37',
			form: 'affirmative',
			prompt: "Вода кипить уже п'ять хвилин.",
			answer: 'The water has been boiling for five minutes.',
			accept: ["{The water has|The water's} been boiling for five minutes."],
			traps: {
				has: ['is', 'was'],
				boiling: ['boil', 'boils'],
			},
		},
		{
			id: 'present-perfect-continuous-38',
			form: 'affirmative',
			prompt: 'Я вже годину намагаюся тобі додзвонитися.',
			answer: "I've been trying to call you for an hour.",
			accept: ["I've been trying to {call|phone|reach|ring} you for an hour."],
			traps: {
				"I've": ["I'm"],
				trying: ['try', 'tried'],
			},
		},
		{
			id: 'present-perfect-continuous-39',
			form: 'affirmative',
			prompt: 'Вона співає в душі вже пів години.',
			answer: 'She has been singing in the shower for half an hour.',
			accept: ["{She has|She's} been singing in the shower for half an hour."],
			traps: {
				has: ['is', 'was'],
				singing: ['sing', 'sang'],
			},
		},
		{
			id: 'present-perfect-continuous-40',
			form: 'affirmative',
			prompt: 'Вітер дме з учорашнього вечора.',
			answer: 'The wind has been blowing since yesterday evening.',
			accept: [
				"{The wind has|The wind's} been blowing since {yesterday evening|last night}.",
			],
			traps: {
				since: ['for', 'from'],
				blowing: ['blow', 'blew'],
			},
		},
		{
			id: 'present-perfect-continuous-41',
			form: 'affirmative',
			prompt: 'Я ремонтую цей велосипед із суботи.',
			answer: "I've been fixing this bike since Saturday.",
			accept: [
				"I've been {fixing|repairing} this {bike|bicycle} since Saturday.",
			],
			traps: {
				since: ['for', 'from'],
				fixing: ['fix', 'fixed'],
			},
		},
		{
			id: 'present-perfect-continuous-42',
			form: 'affirmative',
			prompt: 'Вони танцюють уже три години.',
			answer: "They've been dancing for three hours.",
			traps: {
				"They've": ["They're"],
				dancing: ['dance', 'danced'],
			},
		},
		{
			id: 'present-perfect-continuous-43',
			form: 'affirmative',
			prompt: 'Я перекладаю цю книжку із січня.',
			answer: "I've been translating this book since January.",
			traps: {
				since: ['for', 'from'],
				translating: ['translate', 'translated'],
			},
		},
		{
			id: 'present-perfect-continuous-44',
			form: 'affirmative',
			prompt: 'Мій сусід слухає гучну музику весь вечір.',
			answer: 'My neighbour has been listening to loud music all evening.',
			accept: [
				"{My neighbour has|My neighbour's|My neighbor has|My neighbor's} been listening to loud music {all evening|the whole evening}.",
			],
			traps: {
				has: ['is', 'was'],
				listening: ['listen', 'listened'],
			},
		},
		{
			id: 'present-perfect-continuous-45',
			form: 'affirmative',
			prompt: 'Я прасую сорочки вже годину.',
			answer: "I've been ironing shirts for an hour.",
			traps: {
				"I've": ["I'm"],
				ironing: ['iron', 'ironed'],
			},
		},
		{
			id: 'present-perfect-continuous-46',
			form: 'question',
			prompt: 'Як довго ти чекаєш?',
			answer: 'How long have you been waiting?',
			traps: {
				have: ['are', 'do'],
				waiting: ['wait', 'waited'],
			},
		},
		{
			id: 'present-perfect-continuous-47',
			form: 'question',
			prompt: 'Як довго йде дощ?',
			answer: 'How long has it been raining?',
			traps: {
				has: ['is', 'does'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-48',
			form: 'question',
			prompt: 'У тебе червоне обличчя. Ти бігав?',
			answer: 'Your face is red. Have you been running?',
			traps: {
				Have: ['Are', 'Do'],
				running: ['run', 'ran'],
			},
		},
		{
			id: 'present-perfect-continuous-49',
			form: 'question',
			prompt: 'У тебе червоні очі. Ти плакала?',
			answer: 'Your eyes are red. Have you been crying?',
			traps: {
				Have: ['Are', 'Do'],
				crying: ['cry', 'cried'],
			},
		},
		{
			id: 'present-perfect-continuous-50',
			form: 'question',
			prompt: 'Ти весь мокрий. Ти плавав?',
			answer: "You're all wet. Have you been swimming?",
			traps: {
				Have: ['Are', 'Do'],
				swimming: ['swim', 'swam'],
			},
		},
		{
			id: 'present-perfect-continuous-51',
			form: 'question',
			prompt: 'На вулиці мокро. Ішов дощ?',
			answer: "It's wet outside. Has it been raining?",
			accept: ["{It's|It is} wet outside. Has it been raining?"],
			traps: {
				Has: ['Is', 'Does'],
				raining: ['rain', 'rains'],
			},
		},
		{
			id: 'present-perfect-continuous-52',
			form: 'question',
			prompt: 'Скільки часу ти вже тут сидиш?',
			answer: 'How long have you been sitting here?',
			traps: {
				have: ['are', 'do'],
				sitting: ['sit', 'sat'],
			},
		},
		{
			id: 'present-perfect-continuous-53',
			form: 'question',
			prompt: 'Що ти тут робиш з самого ранку?',
			answer: 'What have you been doing here since this morning?',
			accept: ['What have you been doing here since {this|} morning?'],
			traps: {
				have: ['are', 'has'],
				doing: ['do', 'done'],
			},
		},
		{
			id: 'present-perfect-continuous-54',
			form: 'question',
			prompt: 'Ти чекаєш на мене з обіду?',
			answer: 'Have you been waiting for me since lunch?',
			accept: ['Have you been waiting for me since {lunch|lunchtime}?'],
			traps: {
				Have: ['Are', 'Do'],
				since: ['for', 'from'],
			},
		},
		{
			id: 'present-perfect-continuous-55',
			form: 'question',
			prompt: 'Як довго вона розмовляє по телефону?',
			answer: 'How long has she been talking on the phone?',
			accept: ['How long has she been {talking|speaking} on the phone?'],
			traps: {
				has: ['is', 'does'],
				talking: ['talk', 'talked'],
			},
		},
		{
			id: 'present-perfect-continuous-56',
			form: 'question',
			prompt: 'Як довго діти сплять?',
			answer: 'How long have the children been sleeping?',
			accept: ['How long have the {children|kids} been sleeping?'],
			traps: {
				have: ['are', 'do'],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'present-perfect-continuous-57',
			form: 'question',
			prompt: 'Ти весь спітнілий. Ти тренувався?',
			answer: "You're all sweaty. Have you been training?",
			accept: [
				"You're all sweaty. Have you been {training|working out|exercising}?",
			],
			traps: {
				Have: ['Are', 'Do'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-58',
			form: 'question',
			prompt: 'Як довго Том ремонтує свою машину?',
			answer: 'How long has Tom been fixing his car?',
			accept: ['How long has Tom been {fixing|repairing} his car?'],
			traps: {
				has: ['is', 'does'],
				fixing: ['fix', 'fixed'],
			},
		},
		{
			id: 'present-perfect-continuous-59',
			form: 'question',
			prompt: 'Як довго вони будують цей будинок?',
			answer: 'How long have they been building this house?',
			traps: {
				have: ['are', 'do'],
				building: ['build', 'built'],
			},
		},
		{
			id: 'present-perfect-continuous-60',
			form: 'question',
			prompt: 'Ви довго чекаєте?',
			answer: 'Have you been waiting long?',
			accept: ['Have you been waiting {long|for long}?'],
			traps: {
				Have: ['Are', 'Do'],
				waiting: ['wait', 'waited'],
			},
		},
		{
			id: 'present-perfect-continuous-61',
			form: 'question',
			prompt: 'Про що ви говорите вже пів години?',
			answer: 'What have you been talking about for half an hour?',
			traps: {
				have: ['are', 'do'],
				talking: ['talk', 'talks'],
			},
		},
		{
			id: 'present-perfect-continuous-62',
			form: 'question',
			prompt: 'Як довго ти шукаєш роботу?',
			answer: 'How long have you been looking for a job?',
			accept: ['How long have you been looking for {a job|work}?'],
			traps: {
				have: ['are', 'do'],
				looking: ['look', 'looked'],
			},
		},
		{
			id: 'present-perfect-continuous-63',
			form: 'question',
			prompt: 'Як довго кипить вода?',
			answer: 'How long has the water been boiling?',
			traps: {
				has: ['is', 'does'],
				boiling: ['boil', 'boils'],
			},
		},
		{
			id: 'present-perfect-continuous-64',
			form: 'question',
			prompt: 'Скільки часу ти граєш у цю гру?',
			answer: 'How long have you been playing this game?',
			traps: {
				have: ['are', 'do'],
				playing: ['play', 'played'],
			},
		},
		{
			id: 'present-perfect-continuous-65',
			form: 'question',
			prompt: 'Як довго ти готуєшся до іспиту?',
			answer: 'How long have you been preparing for the exam?',
			accept: ['How long have you been preparing for {the|your} exam?'],
			traps: {
				have: ['are', 'do'],
				preparing: ['prepare', 'prepares'],
			},
		},
		{
			id: 'present-perfect-continuous-66',
			form: 'question',
			prompt: 'Від тебе пахне димом. Ти курив?',
			answer: 'You smell of smoke. Have you been smoking?',
			accept: ['You smell {of|like} smoke. Have you been smoking?'],
			traps: {
				Have: ['Are', 'Do'],
				smoking: ['smoke', 'smokes'],
			},
		},
		{
			id: 'present-perfect-continuous-67',
			form: 'question',
			prompt: 'Як довго вони розмовляють?',
			answer: 'How long have they been talking?',
			accept: ['How long have they been {talking|speaking}?'],
			traps: {
				have: ['are', 'do'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-68',
			form: 'question',
			prompt: 'Як довго ти тут стоїш?',
			answer: 'How long have you been standing here?',
			traps: {
				have: ['are', 'do'],
				standing: ['stand', 'stood'],
			},
		},
		{
			id: 'present-perfect-continuous-69',
			form: 'question',
			prompt: 'Від тебе пахне фарбою. Ти фарбував?',
			answer: 'You smell of paint. Have you been painting?',
			accept: ['You smell {of|like} paint. Have you been painting?'],
			traps: {
				Have: ['Are', 'Do'],
				painting: ['paint', 'paints'],
			},
		},
		{
			id: 'present-perfect-continuous-70',
			form: 'question',
			prompt: 'Як довго плаче малюк?',
			answer: 'How long has the baby been crying?',
			traps: {
				has: ['is', 'does'],
				crying: ['cry', 'cried'],
			},
		},
		{
			id: 'present-perfect-continuous-71',
			form: 'question',
			prompt: 'Ти дзвониш мені весь день?',
			answer: 'Have you been calling me all day?',
			accept: [
				'Have you been {calling|phoning|ringing} me {all day|the whole day}?',
			],
			traps: {
				Have: ['Are', 'Do'],
				calling: ['call', 'called'],
			},
		},
		{
			id: 'present-perfect-continuous-72',
			form: 'question',
			prompt: 'Як довго йде сніг?',
			answer: 'How long has it been snowing?',
			traps: {
				has: ['is', 'does'],
				snowing: ['snow', 'snowed'],
			},
		},
		{
			id: 'present-perfect-continuous-73',
			form: 'question',
			prompt: 'Ви сперечаєтеся вже годину?',
			answer: 'Have you been arguing for an hour?',
			traps: {
				Have: ['Are', 'Do'],
				arguing: ['argue', 'argued'],
			},
		},
		{
			id: 'present-perfect-continuous-74',
			form: 'question',
			prompt: 'Ти спиш з обіду?',
			answer: 'Have you been sleeping since lunch?',
			accept: ['Have you been sleeping since {lunch|lunchtime}?'],
			traps: {
				Have: ['Are', 'Do'],
				since: ['for', 'from'],
			},
		},
		{
			id: 'present-perfect-continuous-75',
			form: 'question',
			prompt: 'Як довго ти шукаєш свої ключі?',
			answer: 'How long have you been looking for your keys?',
			traps: {
				have: ['are', 'do'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-76',
			form: 'negative',
			prompt: "Ми чекаємо недовго, лише п'ять хвилин.",
			answer: "We haven't been waiting long, only five minutes.",
			accept: [
				"We haven't been waiting {long|for long}, {only|just} five minutes.",
			],
			traps: {
				"haven't": ["aren't", "hasn't"],
				waiting: ['wait', 'waited'],
			},
		},
		{
			id: 'present-perfect-continuous-77',
			form: 'negative',
			prompt: 'Дощ іде ще недовго.',
			answer: "It hasn't been raining long.",
			accept: ["It hasn't been raining {long|for long}."],
			traps: {
				"hasn't": ["isn't", "doesn't"],
				raining: ['rain', 'rained'],
			},
		},
		{
			id: 'present-perfect-continuous-78',
			form: 'negative',
			prompt: 'Я стою тут ще недовго.',
			answer: "I haven't been standing here long.",
			accept: ["I haven't been standing here {long|for long}."],
			traps: {
				"haven't": ["hasn't", "isn't"],
				standing: ['stand', 'stood'],
			},
		},
		{
			id: 'present-perfect-continuous-79',
			form: 'negative',
			prompt: 'Вони зустрічаються ще недовго.',
			answer: "They haven't been dating long.",
			accept: ["They haven't been {dating|going out} {long|for long}."],
			traps: {
				"haven't": ["aren't", "hasn't"],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-80',
			form: 'negative',
			prompt: 'Вона спить ще недовго.',
			answer: "She hasn't been sleeping long.",
			accept: ["She hasn't been sleeping {long|for long}."],
			traps: {
				"hasn't": ["isn't", "doesn't"],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'present-perfect-continuous-81',
			form: 'negative',
			prompt: 'Останнім часом він не дуже добре почувається.',
			answer: "He hasn't been feeling very well lately.",
			accept: ["He hasn't {been feeling|felt} very well {lately|recently}."],
			traps: {
				"hasn't": ["haven't"],
				feeling: ['feel', 'feels'],
			},
		},
		{
			id: 'present-perfect-continuous-82',
			form: 'negative',
			prompt: 'Останнім часом ти не робиш домашнє завдання.',
			answer: "You haven't been doing your homework lately.",
			accept: [
				"You haven't {been doing|done} your homework {lately|recently}.",
			],
			traps: {
				"haven't": ["hasn't", "isn't"],
				doing: ['do', 'did'],
			},
		},
		{
			id: 'present-perfect-continuous-83',
			form: 'negative',
			prompt: 'Останнім часом я мало читаю.',
			answer: "I haven't been reading much lately.",
			accept: ["I haven't {been reading|read} much {lately|recently}."],
			traps: {
				"haven't": ["hasn't"],
				reading: ['reads'],
			},
		},
		{
			id: 'present-perfect-continuous-84',
			form: 'negative',
			prompt: 'Останнім часом вона мало їсть.',
			answer: "She hasn't been eating much lately.",
			accept: ["She hasn't {been eating|eaten} much {lately|recently}."],
			traps: {
				"hasn't": ["haven't"],
				eating: ['eat', 'ate'],
			},
		},
		{
			id: 'present-perfect-continuous-85',
			form: 'negative',
			prompt: 'Останнім часом ми не ходимо в спортзал.',
			answer: "We haven't been going to the gym lately.",
			accept: [
				"We haven't {been going|gone|been} to the gym {lately|recently}.",
			],
			traps: {
				"haven't": ["hasn't", "isn't"],
				going: ['go', 'went'],
			},
		},
		{
			id: 'present-perfect-continuous-86',
			form: 'negative',
			prompt: 'Сніг іде ще недовго.',
			answer: "It hasn't been snowing long.",
			accept: ["It hasn't been snowing {long|for long}."],
			traps: {
				"hasn't": ["isn't", "doesn't"],
				snowing: ['snow', 'snowed'],
			},
		},
		{
			id: 'present-perfect-continuous-87',
			form: 'negative',
			prompt: 'Діти граються надворі ще недовго.',
			answer: "The children haven't been playing outside long.",
			accept: [
				"The {children|kids} haven't been playing outside {long|for long}.",
			],
			traps: {
				"haven't": ["aren't", "hasn't"],
				playing: ['play', 'played'],
			},
		},
		{
			id: 'present-perfect-continuous-88',
			form: 'negative',
			prompt: 'Я чекаю недовго, не хвилюйся.',
			answer: "I haven't been waiting long, don't worry.",
			accept: ["I haven't been waiting {long|for long}, don't worry."],
			traps: {
				"haven't": ["hasn't", "isn't"],
				been: ['being', 'be'],
			},
		},
		{
			id: 'present-perfect-continuous-89',
			form: 'negative',
			prompt: 'Останнім часом справи йдуть не дуже добре.',
			answer: "Things haven't been going very well lately.",
			accept: ["Things haven't {been going|gone} very well {lately|recently}."],
			traps: {
				"haven't": ["hasn't", "isn't"],
				going: ['go', 'goes'],
			},
		},
		{
			id: 'present-perfect-continuous-90',
			form: 'negative',
			prompt: 'Останнім часом він не відповідає на мої дзвінки.',
			answer: "He hasn't been answering my calls lately.",
			accept: [
				"He hasn't {been answering|answered} my calls {lately|recently}.",
			],
			traps: {
				"hasn't": ["haven't"],
				answering: ['answer', 'answers'],
			},
		},
		{
			id: 'present-perfect-continuous-91',
			form: 'negative',
			prompt: 'Останнім часом ти мало спиш.',
			answer: "You haven't been sleeping much lately.",
			accept: ["You haven't {been sleeping|slept} much {lately|recently}."],
			traps: {
				"haven't": ["hasn't", "isn't"],
				sleeping: ['sleep', 'sleeps'],
			},
		},
		{
			id: 'present-perfect-continuous-92',
			form: 'negative',
			prompt: 'Останнім часом мій брат не тренується.',
			answer: "My brother hasn't been training lately.",
			accept: [
				"My brother hasn't {been training|trained|been working out|worked out|been exercising|exercised} {lately|recently}.",
			],
			traps: {
				"hasn't": ["haven't"],
				training: ['train', 'trains'],
			},
		},
		{
			id: 'present-perfect-continuous-93',
			form: 'negative',
			prompt: 'Останнім часом ти не харчуєшся як слід.',
			answer: "You haven't been eating properly lately.",
			accept: ["You haven't {been eating|eaten} properly {lately|recently}."],
			traps: {
				"haven't": ["hasn't", "isn't"],
				eating: ['eat', 'eats'],
			},
		},
		{
			id: 'present-perfect-continuous-94',
			form: 'negative',
			prompt: 'Останнім часом я не дивлюся телевізор.',
			answer: "I haven't been watching TV lately.",
			accept: [
				"I haven't {been watching|watched} {TV|television} {lately|recently}.",
			],
			traps: {
				"haven't": ["hasn't"],
				watching: ['watch', 'watches'],
			},
		},
		{
			id: 'present-perfect-continuous-95',
			form: 'negative',
			prompt: 'Останнім часом мій ноутбук не працює як слід.',
			answer: "My laptop hasn't been working properly lately.",
			accept: [
				"My laptop hasn't {been working|worked} properly {lately|recently}.",
			],
			traps: {
				"hasn't": ["haven't"],
				working: ['work', 'works'],
			},
		},
		{
			id: 'present-perfect-continuous-96',
			form: 'negative',
			prompt: 'Ми йдемо ще недовго, а я вже втомився.',
			answer: "We haven't been walking long, but I'm already tired.",
			accept: [
				"We haven't been walking {long|for long}, but I'm already tired.",
			],
			traps: {
				"haven't": ["aren't", "hasn't"],
				walking: ['walk', 'walked'],
			},
		},
		{
			id: 'present-perfect-continuous-97',
			form: 'negative',
			prompt: 'Я граю в цю гру ще недовго.',
			answer: "I haven't been playing this game long.",
			accept: ["I haven't been playing this game {long|for long}."],
			traps: {
				"haven't": ["hasn't", "isn't"],
				playing: ['play', 'plays'],
			},
		},
		{
			id: 'present-perfect-continuous-98',
			form: 'negative',
			prompt: 'Вони чекають на нас недовго.',
			answer: "They haven't been waiting for us long.",
			accept: ["They haven't been waiting for us {long|for long}."],
			traps: {
				"haven't": ["aren't", "hasn't"],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'present-perfect-continuous-99',
			form: 'negative',
			prompt: 'Останнім часом він не ходить на роботу.',
			answer: "He hasn't been going to work lately.",
			accept: ["He hasn't {been going|gone|been} to work {lately|recently}."],
			traps: {
				"hasn't": ["haven't"],
				going: ['go', 'goes'],
			},
		},
		{
			id: 'present-perfect-continuous-100',
			form: 'negative',
			prompt: 'Останнім часом я не користуюся цим додатком.',
			answer: "I haven't been using this app lately.",
			accept: ["I haven't {been using|used} this app {lately|recently}."],
			traps: {
				"haven't": ["hasn't"],
				using: ['use', 'uses'],
			},
		},
	],
})
