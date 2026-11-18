import { defineTopic } from '../../define-topic'

const BEEN = ['being', 'was'] as const
const HAD = ['has', 'have'] as const

export const pastPerfectContinuous = defineTopic({
	id: 'past-perfect-continuous',
	level: 'advanced',
	title: 'Past Perfect Continuous',
	subtitle: 'Минулий доконано-тривалий час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Past Perfect Continuous показує дію, яка тривала якийсь час аж до певного моменту в минулому (вже дві години, коли…; на той час, коли…), або дію, видимий результат якої було помітно в минулому (була втомлена, бо бігала). Дієслова стану (know, be, own, like) у цьому часі не вживаються: I had known him for years.',
			examples: [
				{
					text: 'The baby had been crying for an hour when the nurse came.',
					translation: 'Немовля плакало вже годину, коли прийшла медсестра.',
				},
				{
					text: 'His shirt was dirty because he had been painting the garage.',
					translation: 'Його сорочка була брудна, бо він фарбував гараж.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Підмет + had been + дієслово з -ing для всіх осіб. Had із займенником скорочується до 'd: I'd been, she'd been. Тривалість — for (for two hours), початок — since (since morning), момент у минулому — when, by the time, before.",
			examples: [
				{
					text: 'By the time we met, she had been teaching for twenty years.',
					translation:
						'На той час, коли ми познайомилися, вона викладала вже двадцять років.',
				},
				{
					text: "We'd been travelling since dawn, so we fell asleep at once.",
					translation: 'Ми були в дорозі від світанку, тож одразу заснули.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Had + підмет + been + -ing? Найчастіше з How long: How long had you been…? Коротко «чи довго»: Had you been…ing long when…?',
			examples: [
				{
					text: 'How long had the dog been barking when you got home?',
					translation: 'Як довго гавкав собака, коли ти прийшов додому?',
				},
				{
					text: 'Had she been driving long when the tyre burst?',
					translation: 'Вона довго їхала, коли лопнула шина?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Підмет + hadn't (had not) + been + -ing. Часто з long: «ще недовго…, коли…» — We hadn't been…ing long when…",
			examples: [
				{
					text: "They hadn't been swimming long when a shark appeared.",
					translation: "Вони плавали недовго, коли з'явилася акула.",
				},
				{
					text: "He hadn't been feeling well for days before the surgery.",
					translation: 'Він уже кілька днів погано почувався перед операцією.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'past-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'Коли він прийшов, я чекав уже дві години.',
			answer: 'I had been waiting for two hours when he came.',
			accept: [
				"I'd been waiting for two hours when he came.",
				"When he came, {I had|I'd} been waiting for two hours.",
			],
			traps: { had: ['has', 'have'], been: ['being', 'be'] },
		},
		{
			id: 'past-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'Вона була втомлена, бо працювала весь день.',
			answer: 'She was tired because she had been working all day.',
			accept: [
				"She was tired because {she'd|she had} been working {all day|the whole day}.",
			],
			traps: { been: ['being', 'be'] },
		},
		{
			id: 'past-perfect-continuous-3',
			form: 'affirmative',
			prompt: 'Ми їхали вже шість годин, коли нарешті побачили море.',
			answer: 'We had been driving for six hours when we finally saw the sea.',
			accept: ["We'd been driving for six hours when we finally saw the sea."],
			traps: { had: HAD, been: BEEN, driving: ['drove', 'driven'] },
		},
		{
			id: 'past-perfect-continuous-4',
			form: 'affirmative',
			prompt: 'Коли почався дощ, діти вже годину гралися в саду.',
			answer:
				'When it started to rain, the children had been playing in the garden for an hour.',
			accept: [
				'When it {started to rain|started raining|began to rain|began raining}, the children had been playing in the garden for an hour.',
			],
			traps: { had: HAD, been: BEEN, playing: ['played', 'play'] },
		},
		{
			id: 'past-perfect-continuous-5',
			form: 'affirmative',
			prompt:
				'Вона вже три роки навчалася в Лондоні, коли познайомилася з Марком.',
			answer:
				'She had been studying in London for three years when she met Mark.',
			accept: [
				"{She had|She'd} {been studying|studied} in London for three years when she met Mark.",
			],
			traps: { had: HAD, been: BEEN, studying: ['study', 'studies'] },
		},
		{
			id: 'past-perfect-continuous-6',
			form: 'affirmative',
			prompt: 'Я читав уже пів години, коли зникло світло.',
			answer: 'I had been reading for half an hour when the lights went out.',
			accept: [
				"{I had|I'd} been reading for half an hour when {the lights|the power} went out.",
			],
			traps: { had: HAD, been: BEEN, reading: ['read', 'reads'] },
		},
		{
			id: 'past-perfect-continuous-7',
			form: 'affirmative',
			prompt: 'Коли ми прийшли, гості вже годину сиділи за столом.',
			answer:
				'When we arrived, the guests had been sitting at the table for an hour.',
			accept: [
				'When we {arrived|came}, the guests had been sitting at the table for an hour.',
			],
			traps: { had: HAD, been: BEEN, sitting: ['sat', 'sit'] },
		},
		{
			id: 'past-perfect-continuous-8',
			form: 'affirmative',
			prompt:
				'Він уже десять років працював у цій компанії, коли його звільнили.',
			answer:
				'He had been working for this company for ten years when he was fired.',
			accept: [
				"{He had|He'd} {been working|worked} {for|at} {this|that} company for ten years when he was {fired|sacked}.",
			],
			traps: { had: HAD, been: BEEN, working: ['work', 'works'] },
		},
		{
			id: 'past-perfect-continuous-9',
			form: 'affirmative',
			prompt: 'Коли ми прокинулися, сніг падав уже кілька годин.',
			answer: 'When we woke up, it had been snowing for several hours.',
			accept: [
				'When we woke up, it had been snowing for {several|a few} hours.',
			],
			traps: { had: HAD, been: BEEN, snowing: ['snowed', 'snows'] },
		},
		{
			id: 'past-perfect-continuous-10',
			form: 'affirmative',
			prompt:
				"Її телефон дзвонив уже п'ять хвилин, коли вона зайшла в кімнату.",
			answer:
				'Her phone had been ringing for five minutes when she came into the room.',
			accept: [
				'Her phone had been ringing for five minutes when she {came into|walked into|entered} the room.',
			],
			traps: { had: HAD, been: BEEN, ringing: ['rang', 'rung'] },
		},
		{
			id: 'past-perfect-continuous-11',
			form: 'affirmative',
			prompt: 'Ми гуляли вже дві години, коли зрозуміли, що заблукали.',
			answer:
				'We had been walking for two hours when we realised that we were lost.',
			accept: [
				"{We had|We'd} been walking for two hours when we {realised|realized} {that|} we were lost.",
			],
			traps: { had: HAD, been: BEEN, walking: ['walked', 'walk'] },
		},
		{
			id: 'past-perfect-continuous-12',
			form: 'affirmative',
			prompt: 'Коли прибула поліція, сусіди сварилися вже пів години.',
			answer:
				'When the police arrived, the neighbours had been arguing for half an hour.',
			accept: [
				'When the police {arrived|came}, the {neighbours|neighbors} had been {arguing|quarrelling|quarreling} for half an hour.',
			],
			traps: { had: HAD, been: BEEN, arguing: ['argued', 'argue'] },
		},
		{
			id: 'past-perfect-continuous-13',
			form: 'affirmative',
			prompt: 'Я вже два місяці вчив італійську, коли поїхав до Рима.',
			answer: 'I had been learning Italian for two months when I went to Rome.',
			accept: [
				"{I had|I'd} {been learning|been studying|studied} Italian for two months when I went to Rome.",
			],
			traps: { had: HAD, been: BEEN, learning: ['learned', 'learnt'] },
		},
		{
			id: 'past-perfect-continuous-14',
			form: 'affirmative',
			prompt: 'Коли я їй подзвонив, вона вже три години готувалася до іспиту.',
			answer:
				'When I called her, she had been preparing for the exam for three hours.',
			accept: [
				"When I {called|phoned|rang} her, {she had|she'd} been preparing for the exam for three hours.",
			],
			traps: { had: HAD, been: BEEN, preparing: ['prepared', 'prepares'] },
		},
		{
			id: 'past-perfect-continuous-15',
			form: 'affirmative',
			prompt: 'Його очі були червоні, бо він плакав.',
			answer: 'His eyes were red because he had been crying.',
			accept: ["His eyes were red because he'd been crying."],
			traps: { had: HAD, been: BEEN, crying: ['cried', 'cry'] },
		},
		{
			id: 'past-perfect-continuous-16',
			form: 'affirmative',
			prompt: 'Земля була мокра, бо всю ніч ішов дощ.',
			answer: 'The ground was wet because it had been raining all night.',
			traps: { had: HAD, been: BEEN, raining: ['rained', 'rains'] },
		},
		{
			id: 'past-perfect-continuous-17',
			form: 'affirmative',
			prompt: 'Вона задихалася, бо бігала.',
			answer: 'She was out of breath because she had been running.',
			accept: ["She was out of breath because she'd been running."],
			traps: { had: HAD, been: BEEN, running: ['ran', 'run'] },
		},
		{
			id: 'past-perfect-continuous-18',
			form: 'affirmative',
			prompt: 'Його руки були брудні, бо він ремонтував свою машину.',
			answer: 'His hands were dirty because he had been repairing his car.',
			accept: [
				"His hands were dirty because {he had|he'd} been {repairing|fixing} his car.",
			],
			traps: { had: HAD, been: BEEN, repairing: ['repaired', 'repair'] },
		},
		{
			id: 'past-perfect-continuous-19',
			form: 'affirmative',
			prompt: 'Кухня пахла часником, бо моя мама готувала.',
			answer: 'The kitchen smelled of garlic because my mum had been cooking.',
			accept: [
				'The kitchen {smelled|smelt} {of|like} garlic because my {mum|mom|mother} had been cooking.',
			],
			traps: { had: HAD, been: BEEN, cooking: ['cooked', 'cooks'] },
		},
		{
			id: 'past-perfect-continuous-20',
			form: 'affirmative',
			prompt: 'Діти були брудні, бо гралися в багнюці.',
			answer:
				'The children were dirty because they had been playing in the mud.',
			accept: [
				"The children were dirty because {they had|they'd} been playing in {the mud|mud}.",
			],
			traps: { had: HAD, been: BEEN, playing: ['played', 'plays'] },
		},
		{
			id: 'past-perfect-continuous-21',
			form: 'affirmative',
			prompt: 'Він був сонний, бо всю ніч грав у відеоігри.',
			answer:
				'He was sleepy because he had been playing video games all night.',
			accept: [
				"He was sleepy because {he had|he'd} been playing {video|computer} games all night.",
			],
			traps: { had: HAD, been: BEEN, playing: ['played', 'play'] },
		},
		{
			id: 'past-perfect-continuous-22',
			form: 'affirmative',
			prompt: 'Її голос був хрипкий, бо вона цілий вечір співала.',
			answer: 'Her voice was hoarse because she had been singing all evening.',
			accept: [
				"Her voice was hoarse because {she had|she'd} been singing {all evening|the whole evening}.",
			],
			traps: { had: HAD, been: BEEN, singing: ['sang', 'sung'] },
		},
		{
			id: 'past-perfect-continuous-23',
			form: 'affirmative',
			prompt: 'У мене боліла спина, бо я весь день працював у саду.',
			answer: 'My back hurt because I had been working in the garden all day.',
			accept: [
				"My back {hurt|ached|was aching|was hurting} because {I had|I'd} been working in the garden {all day|the whole day}.",
			],
			traps: { had: HAD, been: BEEN, working: ['worked', 'works'] },
		},
		{
			id: 'past-perfect-continuous-24',
			form: 'affirmative',
			prompt: 'У кімнаті пахло димом, бо хтось курив.',
			answer: 'The room smelled of smoke because someone had been smoking.',
			accept: [
				'The room {smelled|smelt} {of|like} smoke because {someone|somebody} had been smoking.',
			],
			traps: { had: HAD, been: BEEN, smoking: ['smoked', 'smokes'] },
		},
		{
			id: 'past-perfect-continuous-25',
			form: 'affirmative',
			prompt: 'Вона була сердита, бо чекала на нього цілу годину.',
			answer:
				'She was angry because she had been waiting for him for a whole hour.',
			accept: [
				"She was angry because {she had|she'd} {been waiting|waited} for him for {a whole|an entire} hour.",
			],
			traps: { had: HAD, been: BEEN, waiting: ['wait', 'waits'] },
		},
		{
			id: 'past-perfect-continuous-26',
			form: 'affirmative',
			prompt: 'Підлога була мокра, бо дах протікав.',
			answer: 'The floor was wet because the roof had been leaking.',
			traps: { had: HAD, been: BEEN, leaking: ['leaked', 'leaks'] },
		},
		{
			id: 'past-perfect-continuous-27',
			form: 'affirmative',
			prompt: 'Учитель був сердитий, бо учні весь урок розмовляли.',
			answer:
				'The teacher was angry because the students had been talking all lesson.',
			accept: [
				'The teacher was angry because the {students|pupils} had been talking {all lesson|the whole lesson}.',
			],
			traps: { had: HAD, been: BEEN, talking: ['talked', 'talk'] },
		},
		{
			id: 'past-perfect-continuous-28',
			form: 'affirmative',
			prompt: 'Ми були голодні, бо з самого ранку прибирали в будинку.',
			answer:
				'We were hungry because we had been cleaning the house since early morning.',
			accept: [
				"We were hungry because {we had|we'd} been cleaning the house since {early morning|the early morning}.",
			],
			traps: { had: HAD, been: BEEN, cleaning: ['cleaned', 'clean'] },
		},
		{
			id: 'past-perfect-continuous-29',
			form: 'affirmative',
			prompt: "Вони зустрічалися вже п'ять років, коли вирішили одружитися.",
			answer:
				'They had been dating for five years when they decided to get married.',
			accept: [
				"{They had|They'd} been {dating|going out} for five years when they decided to get married.",
			],
			traps: { had: HAD, been: BEEN, dating: ['dated', 'date'] },
		},
		{
			id: 'past-perfect-continuous-30',
			form: 'affirmative',
			prompt:
				'На той час, коли приїхала швидка, він лежав на дорозі вже двадцять хвилин.',
			answer:
				'By the time the ambulance arrived, he had been lying on the road for twenty minutes.',
			accept: [
				"By the time the ambulance {arrived|came}, {he had|he'd} been lying on the road for twenty minutes.",
			],
			traps: { had: HAD, been: BEEN, lying: ['lay', 'laying'] },
		},
		{
			id: 'past-perfect-continuous-31',
			form: 'affirmative',
			prompt: 'Ми вже три місяці шукали квартиру, коли знайшли цю.',
			answer:
				'We had been looking for a flat for three months when we found this one.',
			accept: [
				"{We had|We'd} been looking for {a flat|an apartment} for three months when we found this one.",
			],
			traps: { had: HAD, been: BEEN, looking: ['looked', 'look'] },
		},
		{
			id: 'past-perfect-continuous-32',
			form: 'affirmative',
			prompt:
				'Вона вже десять років грала на скрипці, коли виграла свій перший конкурс.',
			answer:
				'She had been playing the violin for ten years when she won her first competition.',
			accept: [
				"{She had|She'd} {been playing|played} the violin for ten years when she won her first competition.",
			],
			traps: { had: HAD, been: BEEN, playing: ['play', 'plays'] },
		},
		{
			id: 'past-perfect-continuous-33',
			form: 'affirmative',
			prompt: 'Коли потяг нарешті рушив, ми сиділи у вагоні вже сорок хвилин.',
			answer:
				'When the train finally left, we had been sitting in the carriage for forty minutes.',
			accept: [
				"When the train finally {left|set off|started moving}, {we had|we'd} been sitting in the carriage for forty minutes.",
			],
			traps: { had: HAD, been: BEEN, sitting: ['sat', 'sit'] },
		},
		{
			id: 'past-perfect-continuous-34',
			form: 'affirmative',
			prompt:
				"Я вже годину розв'язував цю задачу, коли мій брат показав мені відповідь.",
			answer:
				'I had been trying to solve this problem for an hour when my brother showed me the answer.',
			accept: [
				"{I had|I'd} been {trying to solve|solving|working on} {this|that} problem for an hour when my brother showed me the answer.",
			],
			traps: { had: HAD, been: BEEN, trying: ['tried', 'try'] },
		},
		{
			id: 'past-perfect-continuous-35',
			form: 'affirmative',
			prompt:
				'Робітники вже два місяці ремонтували дорогу, коли в них закінчилися гроші.',
			answer:
				'The workers had been repairing the road for two months when they ran out of money.',
			accept: [
				'The workers had been {repairing|fixing} the road for two months when they ran out of money.',
			],
			traps: { had: HAD, been: BEEN, repairing: ['repaired', 'repairs'] },
		},
		{
			id: 'past-perfect-continuous-36',
			form: 'affirmative',
			prompt: 'Коли я прокинувся, мій собака гавкав уже кілька хвилин.',
			answer: 'When I woke up, my dog had been barking for several minutes.',
			accept: [
				'When I woke up, my dog had been barking for {several|a few} minutes.',
			],
			traps: { had: HAD, been: BEEN, barking: ['barked', 'barks'] },
		},
		{
			id: 'past-perfect-continuous-37',
			form: 'affirmative',
			prompt: 'Він уже рік бігав щоранку, коли вирішив пробігти марафон.',
			answer:
				'He had been running every morning for a year when he decided to run a marathon.',
			accept: [
				"{He had|He'd} been {running|jogging} every morning for a year when he decided to run a marathon.",
			],
			traps: { had: HAD, been: BEEN, running: ['ran', 'runs'] },
		},
		{
			id: 'past-perfect-continuous-38',
			form: 'affirmative',
			prompt:
				'Коли мама повернулася додому, ми вже три години дивилися телевізор.',
			answer: 'When Mum came home, we had been watching TV for three hours.',
			accept: [
				"When {Mum|Mom|my mum|my mom|my mother} came home, {we had|we'd} been watching {TV|television} for three hours.",
			],
			traps: { had: HAD, been: BEEN, watching: ['watched', 'watch'] },
		},
		{
			id: 'past-perfect-continuous-39',
			form: 'affirmative',
			prompt:
				'На той час, коли він закінчив книжку, він писав її вже сім років.',
			answer:
				'By the time he finished the book, he had been writing it for seven years.',
			accept: [
				"By the time he finished the book, he'd been writing it for seven years.",
			],
			traps: { had: HAD, been: BEEN, writing: ['wrote', 'written'] },
		},
		{
			id: 'past-perfect-continuous-40',
			form: 'affirmative',
			prompt: 'Ми розмовляли вже годину, коли хтось постукав у двері.',
			answer:
				'We had been talking for an hour when someone knocked at the door.',
			accept: [
				"{We had|We'd} been talking for an hour when {someone|somebody} knocked {at|on} the door.",
			],
			traps: { had: HAD, been: BEEN, talking: ['talked', 'talks'] },
		},
		{
			id: 'past-perfect-continuous-41',
			form: 'affirmative',
			prompt: 'Її руки були у фарбі, бо вона фарбувала паркан.',
			answer:
				'Her hands were covered in paint because she had been painting the fence.',
			accept: [
				"Her hands were covered {in|with} paint because {she had|she'd} been painting the fence.",
			],
			traps: { had: HAD, been: BEEN, painting: ['painted', 'paints'] },
		},
		{
			id: 'past-perfect-continuous-42',
			form: 'affirmative',
			prompt: 'Він був мокрий, бо працював під дощем.',
			answer: 'He was wet because he had been working in the rain.',
			accept: ["He was wet because he'd been working in the rain."],
			traps: { had: HAD, been: BEEN, working: ['worked', 'work'] },
		},
		{
			id: 'past-perfect-continuous-43',
			form: 'affirmative',
			prompt:
				'Вона виглядала виснаженою, бо цілий тиждень доглядала за своєю хворою дитиною.',
			answer:
				'She looked exhausted because she had been looking after her sick child all week.',
			accept: [
				"She looked exhausted because {she had|she'd} been {looking after|taking care of} her sick child {all week|the whole week}.",
			],
			traps: { had: HAD, been: BEEN, looking: ['looked', 'looks'] },
		},
		{
			id: 'past-perfect-continuous-44',
			form: 'affirmative',
			prompt: 'Сусіди скаржилися, бо ми цілу ніч слухали гучну музику.',
			answer:
				'The neighbours complained because we had been listening to loud music all night.',
			accept: [
				"The {neighbours|neighbors} complained because {we had|we'd} been {listening to|playing} loud music {all night|the whole night}.",
			],
			traps: { had: HAD, been: BEEN, listening: ['listened', 'listen'] },
		},
		{
			id: 'past-perfect-continuous-45',
			form: 'affirmative',
			prompt:
				"У нього боліла голова, бо він кілька годин сидів за комп'ютером.",
			answer:
				'He had a headache because he had been sitting at the computer for several hours.',
			accept: [
				"{He had a headache|His head hurt|His head was aching} because {he had|he'd} been sitting at the computer for {several|a few} hours.",
			],
			traps: { been: BEEN, sitting: ['sat', 'sits'] },
		},
		{
			id: 'past-perfect-continuous-46',
			form: 'affirmative',
			prompt: 'Трава була мокра, бо садівник її поливав.',
			answer: 'The grass was wet because the gardener had been watering it.',
			traps: { had: HAD, been: BEEN, watering: ['watered', 'waters'] },
		},
		{
			id: 'past-perfect-continuous-47',
			form: 'affirmative',
			prompt: 'Діти були втомлені, бо цілий день плавали в озері.',
			answer:
				'The children were tired because they had been swimming in the lake all day.',
			accept: [
				"The children were tired because {they had|they'd} been swimming in the lake {all day|the whole day}.",
			],
			traps: { had: HAD, been: BEEN, swimming: ['swam', 'swum'] },
		},
		{
			id: 'past-perfect-continuous-48',
			form: 'affirmative',
			prompt:
				'Я був у поганому настрої, бо весь ранок сперечався зі своїм начальником.',
			answer:
				'I was in a bad mood because I had been arguing with my boss all morning.',
			accept: [
				"I was in a bad mood because {I had|I'd} been arguing with my boss {all morning|the whole morning}.",
			],
			traps: { had: HAD, been: BEEN, arguing: ['argued', 'argue'] },
		},
		{
			id: 'past-perfect-continuous-49',
			form: 'affirmative',
			prompt: 'Хлопчик був увесь у піску, бо будував на пляжі замки з піску.',
			answer:
				'The boy was covered in sand because he had been building sandcastles on the beach.',
			accept: [
				"The boy was covered {in|with} sand because {he had|he'd} been building {sandcastles|sand castles} on the beach.",
			],
			traps: { had: HAD, been: BEEN, building: ['built', 'builds'] },
		},
		{
			id: 'past-perfect-continuous-50',
			form: 'affirmative',
			prompt: 'Коли я з нею познайомився, вона вже два роки жила в Києві.',
			answer: 'When I met her, she had been living in Kyiv for two years.',
			accept: [
				"When I met her, {she had|she'd} {been living|lived} in Kyiv for two years.",
			],
			traps: { had: HAD, been: BEEN, living: ['live', 'lives'] },
		},
		{
			id: 'past-perfect-continuous-51',
			form: 'affirmative',
			prompt: 'Ми вже годину стояли в черзі, коли магазин зачинився.',
			answer:
				'We had been standing in the queue for an hour when the shop closed.',
			accept: [
				"{We had|We'd} been {standing in the queue|standing in line|waiting in line|queueing|queuing} for an hour when the {shop|store} closed.",
			],
			traps: { had: HAD, been: BEEN, standing: ['stood', 'stand'] },
		},
		{
			id: 'past-perfect-continuous-52',
			form: 'affirmative',
			prompt:
				'На той час, коли я закінчив університет, я вже три роки працював програмістом.',
			answer:
				'By the time I graduated, I had been working as a programmer for three years.',
			accept: [
				"By the time I {graduated|finished university|graduated from university}, {I had|I'd} {been working|worked} as a {programmer|developer} for three years.",
			],
			traps: { had: HAD, been: BEEN, working: ['work', 'works'] },
		},
		{
			id: 'past-perfect-continuous-53',
			form: 'affirmative',
			prompt:
				'Він говорив уже двадцять хвилин, коли зрозумів, що мікрофон вимкнений.',
			answer:
				'He had been speaking for twenty minutes when he realised that the microphone was off.',
			accept: [
				"{He had|He'd} been {speaking|talking} for twenty minutes when he {realised|realized} {that|} the microphone was {off|switched off|turned off}.",
			],
			traps: { had: HAD, been: BEEN, speaking: ['spoke', 'spoken'] },
		},
		{
			id: 'past-perfect-continuous-54',
			form: 'affirmative',
			prompt:
				'Коли лікар нарешті прийшов, пацієнт уже дві години скаржився на біль.',
			answer:
				'When the doctor finally came, the patient had been complaining of pain for two hours.',
			accept: [
				'When the doctor finally {came|arrived}, the patient had been complaining {of|about} pain for two hours.',
			],
			traps: { had: HAD, been: BEEN, complaining: ['complained', 'complains'] },
		},
		{
			id: 'past-perfect-continuous-55',
			form: 'affirmative',
			prompt:
				'Компанія вже рік втрачала гроші, коли директор пішов у відставку.',
			answer:
				'The company had been losing money for a year when the director resigned.',
			traps: { had: HAD, been: BEEN, losing: ['lost', 'loses'] },
		},
		{
			id: 'past-perfect-continuous-56',
			form: 'affirmative',
			prompt: 'Вони вже три тижні готувалися до концерту, коли його скасували.',
			answer:
				'They had been preparing for the concert for three weeks when it was cancelled.',
			accept: [
				"{They had|They'd} been preparing for the concert for three weeks when it was {cancelled|canceled}.",
			],
			traps: { had: HAD, been: BEEN, preparing: ['prepared', 'prepare'] },
		},
		{
			id: 'past-perfect-continuous-57',
			form: 'affirmative',
			prompt: 'Коли пролунав дзвоник, учні вже сорок хвилин писали тест.',
			answer:
				'When the bell rang, the students had been writing the test for forty minutes.',
			accept: [
				'When the bell rang, the {students|pupils} had been {writing|doing} the test for forty minutes.',
			],
			traps: { had: HAD, been: BEEN, writing: ['wrote', 'written'] },
		},
		{
			id: 'past-perfect-continuous-58',
			form: 'affirmative',
			prompt: 'Я спав уже годину, коли мене розбудив телефон.',
			answer: 'I had been sleeping for an hour when the phone woke me up.',
			accept: [
				"{I had|I'd} been {sleeping|asleep} for an hour when the phone woke me up.",
			],
			traps: { had: HAD, been: BEEN, sleeping: ['slept', 'sleeps'] },
		},
		{
			id: 'past-perfect-continuous-59',
			form: 'affirmative',
			prompt:
				'Вона вже кілька місяців відкладала гроші, коли нарешті купила велосипед.',
			answer:
				'She had been saving money for several months when she finally bought a bike.',
			accept: [
				"{She had|She'd} been {saving money|saving up|saving} for {several|a few} months when she finally bought a {bike|bicycle}.",
			],
			traps: { had: HAD, been: BEEN, saving: ['saved', 'saves'] },
		},
		{
			id: 'past-perfect-continuous-60',
			form: 'affirmative',
			prompt:
				'Моя бабуся вже тиждень погано почувалася, коли ми викликали лікаря.',
			answer:
				'My grandma had been feeling ill for a week when we called the doctor.',
			accept: [
				'My {grandma|granny|grandmother} had been {feeling ill|feeling unwell|feeling bad} for a week when we called {the|a} doctor.',
			],
			traps: { had: HAD, been: BEEN, feeling: ['felt', 'feels'] },
		},
		{
			id: 'past-perfect-continuous-61',
			form: 'question',
			prompt: 'Як довго ти чекав, коли автобус нарешті приїхав?',
			answer: 'How long had you been waiting when the bus finally came?',
			accept: [
				'How long had you been waiting when the bus finally {came|arrived}?',
			],
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				waiting: ['waited', 'wait'],
			},
		},
		{
			id: 'past-perfect-continuous-62',
			form: 'question',
			prompt: 'Ти довго чекав, коли він прийшов?',
			answer: 'Had you been waiting long when he came?',
			accept: ['Had you been waiting {long|for long} when he {came|arrived}?'],
			traps: {
				had: ['Have', 'Has'],
				been: ['being', 'be'],
				waiting: ['waited', 'wait'],
			},
		},
		{
			id: 'past-perfect-continuous-63',
			form: 'question',
			prompt: 'Як довго вони жили в Канаді, коли народилася їхня донька?',
			answer:
				'How long had they been living in Canada when their daughter was born?',
			accept: [
				'How long had they {been living|lived} in Canada when their daughter was born?',
			],
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				living: ['live', 'lives'],
			},
		},
		{
			id: 'past-perfect-continuous-64',
			form: 'question',
			prompt: 'Як довго вона працювала вчителькою, коли її підвищили?',
			answer:
				'How long had she been working as a teacher when she was promoted?',
			accept: [
				'How long had she {been working|worked} as a teacher when she {was|got} promoted?',
			],
			traps: {
				had: ['has', 'did'],
				been: ['being', 'be'],
				working: ['work', 'works'],
			},
		},
		{
			id: 'past-perfect-continuous-65',
			form: 'question',
			prompt: 'Дощ уже довго йшов, коли ви вийшли з дому?',
			answer: 'Had it been raining long when you left the house?',
			accept: [
				'Had it been raining {long|for long} when you left {the house|home}?',
			],
			traps: {
				had: ['Have', 'Has'],
				been: ['being', 'be'],
				raining: ['rained', 'rain'],
			},
		},
		{
			id: 'past-perfect-continuous-66',
			form: 'question',
			prompt: 'Скільки часу ти вчив англійську, коли переїхав до Лондона?',
			answer:
				'How long had you been learning English when you moved to London?',
			accept: [
				'How long had you {been learning|been studying|studied} English when you moved to London?',
			],
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				learning: ['learned', 'learn'],
			},
		},
		{
			id: 'past-perfect-continuous-67',
			form: 'question',
			prompt: 'Вони вже довго сварилися, коли ти прийшов?',
			answer: 'Had they been arguing long when you came?',
			accept: [
				'Had they been {arguing|quarrelling|quarreling} {long|for long} when you {came|arrived}?',
			],
			traps: {
				had: ['Have', 'Has'],
				been: ['being', 'be'],
				arguing: ['argued', 'argue'],
			},
		},
		{
			id: 'past-perfect-continuous-68',
			form: 'question',
			prompt: 'Як довго діти гралися надворі, коли почалася гроза?',
			answer:
				'How long had the children been playing outside when the storm started?',
			accept: [
				'How long had the children been playing outside when the {storm|thunderstorm} {started|began}?',
			],
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				playing: ['played', 'play'],
			},
		},
		{
			id: 'past-perfect-continuous-69',
			form: 'question',
			prompt: 'Як довго ви їхали, коли в машині закінчився бензин?',
			answer: 'How long had you been driving when the car ran out of petrol?',
			accept: [
				'How long had you been driving when the car ran out of {petrol|gas}?',
			],
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				driving: ['drove', 'driven'],
			},
		},
		{
			id: 'past-perfect-continuous-70',
			form: 'question',
			prompt: 'Як довго він тренувався, коли отримав травму?',
			answer: 'How long had he been training when he got injured?',
			accept: [
				'How long had he been training when he {got injured|was injured|injured himself}?',
			],
			traps: {
				had: ['has', 'did'],
				been: ['being', 'be'],
				training: ['trained', 'trains'],
			},
		},
		{
			id: 'past-perfect-continuous-71',
			form: 'question',
			prompt: 'Як довго ви гуляли, коли почався дощ?',
			answer: 'How long had you been walking when it started to rain?',
			accept: [
				'How long had you been walking when it {started to rain|started raining|began to rain|began raining}?',
			],
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				walking: ['walked', 'walk'],
			},
		},
		{
			id: 'past-perfect-continuous-72',
			form: 'question',
			prompt: 'Як довго ти шукав свої ключі, коли знайшов їх у кишені?',
			answer:
				'How long had you been looking for your keys when you found them in your pocket?',
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				looking: ['looked', 'look'],
			},
		},
		{
			id: 'past-perfect-continuous-73',
			form: 'question',
			prompt: 'Вона довго плакала, коли ти її знайшов?',
			answer: 'Had she been crying long when you found her?',
			accept: ['Had she been crying {long|for long} when you found her?'],
			traps: {
				had: ['Have', 'Has'],
				been: ['being', 'be'],
				crying: ['cried', 'cry'],
			},
		},
		{
			id: 'past-perfect-continuous-74',
			form: 'question',
			prompt:
				'Як довго вони будували свій будинок, коли в них закінчилися гроші?',
			answer:
				'How long had they been building their house when they ran out of money?',
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				building: ['built', 'build'],
			},
		},
		{
			id: 'past-perfect-continuous-75',
			form: 'question',
			prompt: 'Скільки часу пацієнт чекав, коли лікар нарешті його прийняв?',
			answer:
				'How long had the patient been waiting when the doctor finally saw him?',
			traps: {
				had: ['has', 'did'],
				been: ['being', 'be'],
				waiting: ['waited', 'waits'],
			},
		},
		{
			id: 'past-perfect-continuous-76',
			form: 'question',
			prompt: 'Як довго падав сніг, коли закрили аеропорт?',
			answer: 'How long had it been snowing when the airport was closed?',
			accept: [
				'How long had it been snowing when {the airport was closed|the airport closed|they closed the airport}?',
			],
			traps: {
				had: ['has', 'did'],
				been: ['being', 'be'],
				snowing: ['snowed', 'snows'],
			},
		},
		{
			id: 'past-perfect-continuous-77',
			form: 'question',
			prompt: 'Ти вже довго спав, коли я подзвонив?',
			answer: 'Had you been sleeping long when I called?',
			accept: [
				'Had you been {sleeping|asleep} {long|for long} when I {called|phoned|rang}?',
			],
			traps: {
				had: ['Have', 'Has'],
				been: ['being', 'be'],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-perfect-continuous-78',
			form: 'question',
			prompt: 'Як довго ваша команда грала разом, коли виграла чемпіонат?',
			answer:
				'How long had your team been playing together when it won the championship?',
			accept: [
				'How long had your team been playing together when {it|they} won the championship?',
			],
			traps: {
				had: ['has', 'did'],
				been: ['being', 'be'],
				playing: ['played', 'plays'],
			},
		},
		{
			id: 'past-perfect-continuous-79',
			form: 'question',
			prompt: 'Як довго вони чекали на свій рейс, коли його скасували?',
			answer:
				'How long had they been waiting for their flight when it was cancelled?',
			accept: [
				'How long had they been waiting for their flight when it was {cancelled|canceled}?',
			],
			traps: {
				had: ['have', 'did'],
				been: ['being', 'be'],
				waiting: ['waited', 'wait'],
			},
		},
		{
			id: 'past-perfect-continuous-80',
			form: 'question',
			prompt: 'Він уже довго працював над цим проєктом, коли його звільнили?',
			answer: 'Had he been working on this project long when he was fired?',
			accept: [
				'Had he been working on {this|that} project {long|for long} when he was {fired|sacked}?',
			],
			traps: {
				had: ['Have', 'Has'],
				been: ['being', 'be'],
				working: ['worked', 'work'],
			},
		},
		{
			id: 'past-perfect-continuous-81',
			form: 'negative',
			prompt: 'Ми чекали недовго, коли приїхав автобус.',
			answer: "We hadn't been waiting long when the bus came.",
			accept: [
				"We hadn't been waiting {long|for long} when the bus {came|arrived}.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				waiting: ['waited', 'wait'],
			},
		},
		{
			id: 'past-perfect-continuous-82',
			form: 'negative',
			prompt: 'Я спав зовсім недовго, коли мене розбудив грім.',
			answer: "I hadn't been sleeping long when the thunder woke me up.",
			accept: [
				"I hadn't been {sleeping|asleep} {long|for long} when {the thunder|thunder} woke me up.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-perfect-continuous-83',
			form: 'negative',
			prompt: 'Вона працювала там недовго, коли компанія збанкрутувала.',
			answer:
				"She hadn't been working there long when the company went bankrupt.",
			accept: [
				"She hadn't {been working|worked} there {long|for long} when the company went bankrupt.",
			],
			traps: {
				"hadn't": ["hasn't", "didn't"],
				been: BEEN,
				working: ['work', 'works'],
			},
		},
		{
			id: 'past-perfect-continuous-84',
			form: 'negative',
			prompt: 'Ми їхали недовго, коли почався дощ.',
			answer: "We hadn't been driving long when it started to rain.",
			accept: [
				"We hadn't been driving {long|for long} when it {started to rain|started raining|began to rain|began raining}.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				driving: ['drove', 'driven'],
			},
		},
		{
			id: 'past-perfect-continuous-85',
			form: 'negative',
			prompt: 'Він уже кілька тижнів погано спав, тому виглядав утомленим.',
			answer:
				"He hadn't been sleeping well for several weeks, so he looked tired.",
			accept: [
				"{He hadn't been sleeping well|He had been sleeping badly|He'd been sleeping badly} for {several|a few} weeks, so he looked tired.",
			],
			traps: {
				"hadn't": ["hasn't", "didn't"],
				been: BEEN,
				sleeping: ['slept', 'sleeps'],
			},
		},
		{
			id: 'past-perfect-continuous-86',
			form: 'negative',
			prompt: 'Машина вже місяць погано працювала, коли остаточно зламалася.',
			answer:
				"The car hadn't been working properly for a month when it finally broke down.",
			accept: [
				"The car hadn't been working {properly|well} for a month when it {finally|completely} broke down.",
			],
			traps: {
				"hadn't": ["hasn't", "didn't"],
				been: BEEN,
				working: ['worked', 'works'],
			},
		},
		{
			id: 'past-perfect-continuous-87',
			form: 'negative',
			prompt: 'Ми гуляли недовго, коли Анна впала.',
			answer: "We hadn't been walking long when Anna fell.",
			accept: ["We hadn't been walking {long|for long} when Anna fell."],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				walking: ['walked', 'walk'],
			},
		},
		{
			id: 'past-perfect-continuous-88',
			form: 'negative',
			prompt: 'Він грав за команду недовго, коли його продали в інший клуб.',
			answer:
				"He hadn't been playing for the team long when he was sold to another club.",
			accept: [
				"He hadn't been playing for the team {long|for long} when he was sold to another club.",
			],
			traps: {
				"hadn't": ["hasn't", "didn't"],
				been: BEEN,
				playing: ['played', 'plays'],
			},
		},
		{
			id: 'past-perfect-continuous-89',
			form: 'negative',
			prompt: 'Вони зустрічалися недовго, коли він зробив їй пропозицію.',
			answer: "They hadn't been dating long when he proposed to her.",
			accept: [
				"They hadn't been {dating|going out} {long|for long} when he proposed to her.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				dating: ['dated', 'date'],
			},
		},
		{
			id: 'past-perfect-continuous-90',
			form: 'negative',
			prompt: 'Я жив у місті недовго, коли зустрів свою дружину.',
			answer: "I hadn't been living in the city long when I met my wife.",
			accept: [
				"I hadn't {been living|lived} in the city {long|for long} when I met my wife.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				living: ['live', 'lives'],
			},
		},
		{
			id: 'past-perfect-continuous-91',
			form: 'negative',
			prompt:
				'Ми вже кілька тижнів не розмовляли, коли він нарешті зателефонував.',
			answer:
				"We hadn't been speaking for several weeks when he finally called.",
			accept: [
				"We hadn't {been speaking|been talking|spoken|talked} for {several|a few} weeks when he finally {called|phoned|rang}.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				speaking: ['spoke', 'speak'],
			},
		},
		{
			id: 'past-perfect-continuous-92',
			form: 'negative',
			prompt: 'Ми грали недовго, коли суддя зупинив матч.',
			answer: "We hadn't been playing long when the referee stopped the match.",
			accept: [
				"We hadn't been playing {long|for long} when the referee stopped the {match|game}.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				playing: ['played', 'play'],
			},
		},
		{
			id: 'past-perfect-continuous-93',
			form: 'negative',
			prompt: 'Вона співала недовго, коли в залі зникло світло.',
			answer:
				"She hadn't been singing long when the lights went out in the hall.",
			accept: [
				"She hadn't been singing {long|for long} when {the lights|the power} went out in the hall.",
			],
			traps: {
				"hadn't": ["hasn't", "didn't"],
				been: BEEN,
				singing: ['sang', 'sung'],
			},
		},
		{
			id: 'past-perfect-continuous-94',
			form: 'negative',
			prompt: 'Я читав недовго, коли задзвонив телефон.',
			answer: "I hadn't been reading long when the phone rang.",
			accept: ["I hadn't been reading {long|for long} when the phone rang."],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				reading: ['read', 'reads'],
			},
		},
		{
			id: 'past-perfect-continuous-95',
			form: 'negative',
			prompt: 'Вони недовго будували свій будинок, коли почалася війна.',
			answer:
				"They hadn't been building their house long when the war started.",
			accept: [
				"They hadn't been building their house {long|for long} when the war {started|began|broke out}.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				building: ['built', 'build'],
			},
		},
		{
			id: 'past-perfect-continuous-96',
			form: 'negative',
			prompt:
				'Учні недовго писали контрольну, коли спрацювала пожежна сигналізація.',
			answer:
				"The students hadn't been writing the test long when the fire alarm went off.",
			accept: [
				"The {students|pupils} hadn't been {writing|doing} the test {long|for long} when the fire alarm went off.",
			],
			traps: {
				"hadn't": ["haven't", "didn't"],
				been: BEEN,
				writing: ['wrote', 'written'],
			},
		},
		{
			id: 'past-perfect-continuous-97',
			form: 'affirmative',
			prompt:
				'Він працював у нас лише місяць, коли попросив підвищення зарплати.',
			answer:
				'He had only been working for us for a month when he asked for a raise.',
			accept: [
				"{He had|He'd} only been working {for us|here} for a month when he asked for a {raise|pay rise}.",
			],
			traps: { had: HAD, been: BEEN, working: ['worked', 'works'] },
		},
		{
			id: 'past-perfect-continuous-98',
			form: 'affirmative',
			prompt:
				"Коли ми нарешті дісталися вершини, ми піднімалися вже п'ять годин.",
			answer:
				'When we finally reached the top, we had been climbing for five hours.',
			accept: [
				"When we finally reached the {top|summit}, {we had|we'd} been climbing for five hours.",
			],
			traps: { had: HAD, been: BEEN, climbing: ['climbed', 'climb'] },
		},
		{
			id: 'past-perfect-continuous-99',
			form: 'affirmative',
			prompt: 'Її пальці боліли, бо вона кілька годин грала на гітарі.',
			answer:
				'Her fingers hurt because she had been playing the guitar for several hours.',
			accept: [
				"Her fingers {hurt|ached|were sore} because {she had|she'd} been playing the guitar for {several|a few} hours.",
			],
			traps: { had: HAD, been: BEEN, playing: ['played', 'plays'] },
		},
		{
			id: 'past-perfect-continuous-100',
			form: 'question',
			prompt: 'Як довго він грав за клуб на той час, коли став капітаном?',
			answer:
				'How long had he been playing for the club by the time he became captain?',
			accept: [
				'How long had he been playing for the club by the time he became {captain|the captain}?',
			],
			traps: {
				had: ['has', 'did'],
				been: ['being', 'be'],
				playing: ['played', 'plays'],
			},
		},
	],
})
