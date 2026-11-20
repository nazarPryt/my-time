import { defineTopic } from '../../define-topic'

const HAVE = ['has', 'had'] as const
const BEEN = ['being', 'be'] as const
const WONT = ["don't", "didn't"] as const

export const futurePerfectContinuous = defineTopic({
	id: 'future-perfect-continuous',
	level: 'advanced',
	title: 'Future Perfect Continuous',
	subtitle: 'Майбутній доконано-тривалий час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Future Perfect Continuous показує, скільки часу дія триватиме до певного моменту в майбутньому. Момент — by + час (by June, by the end of the year), in + час (in May), when / by the time + Present Simple (після них ніколи не ставимо will). Тривалість — for (for two hours, for a year). Дієслова стану (know, be, like, own) у цьому часі не вживаються. З live, work, study, teach так само правильний і Future Perfect Simple: I will have lived here for ten years.',
			examples: [
				{
					text: 'By the time the guests arrive, Mum will have been cooking for five hours.',
					translation:
						"Коли прийдуть гості, мама куховаритиме вже п'ять годин.",
				},
				{
					text: "By midnight we'll have been driving for ten hours.",
					translation: 'Опівночі буде десять годин, як ми за кермом.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Підмет + will have been + дієслово з -ing для всіх осіб: завжди have (не has і не had) і завжди been (не being). Після займенника will скорочується до 'll: I'll have been, she'll have been.",
			examples: [
				{
					text: "In March she'll have been teaching for thirty years.",
					translation: 'У березні буде тридцять років, як вона викладає.',
				},
				{
					text: 'By Friday the workers will have been painting the house for a month.',
					translation:
						"До п'ятниці робітники фарбуватимуть будинок уже місяць.",
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Will + підмет + have been + -ing? Найчастіше з How long: How long will you have been…ing by…? / when…?',
			examples: [
				{
					text: 'How long will you have been living in Kyiv by the summer?',
					translation: 'Як довго ти вже житимеш у Києві до літа?',
				},
				{
					text: 'Will they have been playing for two hours when we come?',
					translation: 'Вони вже дві години гратимуть, коли ми прийдемо?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Підмет + won't (will not) + have been + -ing. Часто перекладає «ще не буде…, як…» або «не більше ніж…»: won't have been…ing for more than…",
			examples: [
				{
					text: "In May he won't have been driving for a year.",
					translation: 'У травні ще не буде року, як він водить машину.',
				},
				{
					text: "By nine I won't have been sleeping for more than four hours.",
					translation: "О дев'ятій я спатиму не більше чотирьох годин.",
				},
			],
		},
	],
	sentences: [
		{
			id: 'future-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'Наступного року буде десять років, як я тут працюю.',
			answer: "Next year I'll have been working here for ten years.",
			accept: ["Next year I'll have worked here for ten years."],
			traps: { been: ['being', 'be'] },
		},
		{
			id: 'future-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'До червня вона навчатиметься тут уже рік.',
			answer: "By June she'll have been studying here for a year.",
			accept: ["By June she'll have studied here for a year."],
			traps: { been: ['being', 'be'] },
		},
		{
			id: 'future-perfect-continuous-3',
			form: 'affirmative',
			prompt: 'Коли ти приїдеш, я чекатиму на вокзалі вже три години.',
			answer:
				"When you arrive, I'll have been waiting at the station for three hours.",
			accept: [
				"{When|By the time} you {arrive|get here}, I'll have been waiting at the station for three hours.",
			],
			traps: {
				arrive: ['will', 'arrives'],
				have: HAVE,
				been: BEEN,
				waiting: ['waits', 'wait'],
			},
		},
		{
			id: 'future-perfect-continuous-4',
			form: 'affirmative',
			prompt: "До кінця року ми будуватимемо цей міст уже п'ять років.",
			answer:
				"By the end of the year we'll have been building this bridge for five years.",
			accept: [
				"By the end of {the|this} year we'll have been building this bridge for five years.",
			],
			traps: { have: HAVE, been: BEEN, building: ['built', 'build'] },
		},
		{
			id: 'future-perfect-continuous-5',
			form: 'affirmative',
			prompt: 'У грудні буде рік, як вона вивчає японську.',
			answer: "In December she'll have been learning Japanese for a year.",
			accept: [
				"In December she'll have been {learning|studying} Japanese for a year.",
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-6',
			form: 'affirmative',
			prompt: 'Коли прийде лікар, пацієнт чекатиме вже понад годину.',
			answer:
				'When the doctor comes, the patient will have been waiting for over an hour.',
			accept: [
				'{When|By the time} the doctor {comes|arrives}, the patient will have been waiting for {over|more than} an hour.',
			],
			traps: {
				comes: ['will', 'come'],
				have: HAVE,
				been: BEEN,
				waiting: ['waits', 'wait'],
			},
		},
		{
			id: 'future-perfect-continuous-7',
			form: 'affirmative',
			prompt: "До п'ятої діти гратимуть у футбол уже чотири години.",
			answer:
				'By five the children will have been playing football for four hours.',
			accept: [
				"By {five|five o'clock} the children will have been playing football for four hours.",
			],
			traps: { have: HAVE, been: BEEN, playing: ['plays', 'play'] },
		},
		{
			id: 'future-perfect-continuous-8',
			form: 'affirmative',
			prompt: 'Наступного літа буде десять років, як вони живуть у Канаді.',
			answer: "Next summer they'll have been living in Canada for ten years.",
			accept: [
				"Next summer they'll have {been living|lived} in Canada for ten years.",
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-9',
			form: 'affirmative',
			prompt: 'До вечора я прибиратиму вже шість годин.',
			answer: "By the evening I'll have been cleaning for six hours.",
			accept: [
				"By {the evening|evening} I'll have been cleaning for six hours.",
			],
			traps: { have: HAVE, been: BEEN, cleaning: ['cleans', 'clean'] },
		},
		{
			id: 'future-perfect-continuous-10',
			form: 'affirmative',
			prompt:
				'Коли ми дістанемося до вершини, ми підніматимемося вже вісім годин.',
			answer:
				"When we reach the top, we'll have been climbing for eight hours.",
			accept: [
				"{When|By the time} we {reach|get to} the {top|summit}, we'll have been climbing for eight hours.",
			],
			traps: {
				reach: ['will', 'reached'],
				have: HAVE,
				been: BEEN,
				climbing: ['climbed', 'climb'],
			},
		},
		{
			id: 'future-perfect-continuous-11',
			form: 'affirmative',
			prompt: 'До кінця місяця він ремонтуватиме цю машину вже три тижні.',
			answer:
				"By the end of the month he'll have been repairing this car for three weeks.",
			accept: [
				"By the end of {the|this} month he'll have been {repairing|fixing} this car for three weeks.",
			],
			traps: { have: HAVE, been: BEEN, repairing: ['repaired', 'repair'] },
		},
		{
			id: 'future-perfect-continuous-12',
			form: 'affirmative',
			prompt:
				'Коли закінчиться конференція, вчені обговорюватимуть цю проблему вже два дні.',
			answer:
				'When the conference ends, the scientists will have been discussing this problem for two days.',
			accept: [
				'{When|By the time} the conference {ends|finishes}, the scientists will have been discussing this problem for two days.',
			],
			traps: {
				ends: ['will', 'end'],
				have: HAVE,
				been: BEEN,
				discussing: ['discussed', 'discuss'],
			},
		},
		{
			id: 'future-perfect-continuous-13',
			form: 'affirmative',
			prompt: 'О сьомій ранку вона летітиме вже дванадцять годин.',
			answer:
				"At seven in the morning she'll have been flying for twelve hours.",
			accept: [
				"{At|By} seven in the morning she'll have been flying for twelve hours.",
			],
			traps: { have: HAVE, been: BEEN, flying: ['flies', 'fly'] },
		},
		{
			id: 'future-perfect-continuous-14',
			form: 'affirmative',
			prompt:
				'Коли він вийде на пенсію, він викладатиме в цій школі вже сорок років.',
			answer:
				"When he retires, he'll have been teaching at this school for forty years.",
			accept: [
				"{When|By the time} he retires, he'll have {been teaching|taught} {at|in} this school for forty years.",
			],
			traps: { retires: ['will', 'retired'], have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-15',
			form: 'affirmative',
			prompt: 'До Різдва я писатиму цей роман уже три роки.',
			answer: "By Christmas I'll have been writing this novel for three years.",
			traps: { have: HAVE, been: BEEN, writing: ['written', 'wrote'] },
		},
		{
			id: 'future-perfect-continuous-16',
			form: 'affirmative',
			prompt: 'У травні буде пів року, як ми тренуємося разом.',
			answer: "In May we'll have been training together for six months.",
			accept: [
				"In May we'll have been training together for {six months|half a year}.",
			],
			traps: { have: HAVE, been: BEEN, training: ['trains', 'train'] },
		},
		{
			id: 'future-perfect-continuous-17',
			form: 'affirmative',
			prompt: 'Коли ти повернешся, ми фарбуватимемо паркан уже дві години.',
			answer:
				"When you come back, we'll have been painting the fence for two hours.",
			accept: [
				"{When|By the time} you {come back|get back|return}, we'll have been painting the fence for two hours.",
			],
			traps: { have: HAVE, been: BEEN, painting: ['paints', 'paint'] },
		},
		{
			id: 'future-perfect-continuous-18',
			form: 'affirmative',
			prompt: 'До ранку дощ ітиме вже три дні.',
			answer: 'By the morning it will have been raining for three days.',
			accept: [
				'By {the morning|morning} it will have been raining for three days.',
			],
			traps: { have: HAVE, been: BEEN, raining: ['rained', 'rains'] },
		},
		{
			id: 'future-perfect-continuous-19',
			form: 'affirmative',
			prompt: "До півночі гості танцюватимуть уже п'ять годин.",
			answer: 'By midnight the guests will have been dancing for five hours.',
			traps: { have: HAVE, been: BEEN, dancing: ['danced', 'dance'] },
		},
		{
			id: 'future-perfect-continuous-20',
			form: 'affirmative',
			prompt: 'Коли приїде поліція, натовп протестуватиме вже шість годин.',
			answer:
				'When the police arrive, the crowd will have been protesting for six hours.',
			accept: [
				'{When|By the time} the police {arrive|come}, the crowd will have been protesting for six hours.',
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				protesting: ['protested', 'protest'],
			},
		},
		{
			id: 'future-perfect-continuous-21',
			form: 'affirmative',
			prompt: 'До кінця тижня я читатиму цю книжку вже місяць.',
			answer:
				"By the end of the week I'll have been reading this book for a month.",
			accept: [
				"By the end of {the|this} week I'll have been reading this book for a month.",
			],
			traps: { have: HAVE, been: BEEN, reading: ['read', 'reads'] },
		},
		{
			id: 'future-perfect-continuous-22',
			form: 'affirmative',
			prompt:
				"Наступного квітня буде п'ять років, як вони реставрують цей собор.",
			answer:
				"Next April they'll have been restoring this cathedral for five years.",
			traps: { have: HAVE, been: BEEN, restoring: ['restored', 'restore'] },
		},
		{
			id: 'future-perfect-continuous-23',
			form: 'affirmative',
			prompt:
				'Коли почнеться концерт, музиканти репетируватимуть уже вісім годин.',
			answer:
				'When the concert starts, the musicians will have been rehearsing for eight hours.',
			accept: [
				'{When|By the time} the concert {starts|begins}, the musicians will have been rehearsing for eight hours.',
			],
			traps: {
				starts: ['will', 'start'],
				have: HAVE,
				been: BEEN,
				rehearsing: ['rehearses', 'rehearse'],
			},
		},
		{
			id: 'future-perfect-continuous-24',
			form: 'affirmative',
			prompt: 'До обіду Олена готуватиме вже чотири години.',
			answer: 'By lunch Olena will have been cooking for four hours.',
			accept: [
				'By {lunch|lunchtime} Olena will have been cooking for four hours.',
			],
			traps: { have: HAVE, been: BEEN, cooking: ['cooks', 'cook'] },
		},
		{
			id: 'future-perfect-continuous-25',
			form: 'affirmative',
			prompt: 'Коли ми приземлимося, ми летітимемо вже одинадцять годин.',
			answer: "When we land, we'll have been flying for eleven hours.",
			accept: [
				"{When|By the time} we land, we'll have been flying for eleven hours.",
			],
			traps: {
				land: ['will', 'landed'],
				have: HAVE,
				been: BEEN,
				flying: ['flies', 'fly'],
			},
		},
		{
			id: 'future-perfect-continuous-26',
			form: 'affirmative',
			prompt: 'До вересня Андрій шукатиме роботу вже пів року.',
			answer:
				'By September Andriy will have been looking for a job for six months.',
			accept: [
				'By September Andriy will have been {looking|searching} for a job for {six months|half a year}.',
			],
			traps: { have: HAVE, been: BEEN, looking: ['looks', 'look'] },
		},
		{
			id: 'future-perfect-continuous-27',
			form: 'affirmative',
			prompt: 'Коли ти закінчиш школу, ти гратимеш на скрипці вже вісім років.',
			answer:
				"When you finish school, you'll have been playing the violin for eight years.",
			accept: [
				"{When|By the time} you finish school, you'll have been playing the violin for eight years.",
			],
			traps: {
				finish: ['will', 'finished'],
				have: HAVE,
				been: BEEN,
				playing: ['plays', 'play'],
			},
		},
		{
			id: 'future-perfect-continuous-28',
			form: 'affirmative',
			prompt:
				'До того часу, як відкриється музей, люди стоятимуть у черзі вже три години.',
			answer:
				'By the time the museum opens, people will have been queuing for three hours.',
			accept: [
				'{By the time|When} the museum opens, people will have been {queuing|queueing|standing in line|waiting in line} for three hours.',
			],
			traps: { opens: ['will', 'open'], have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-29',
			form: 'affirmative',
			prompt:
				"Коли ми повернемося, діти дивитимуться мультики вже п'ять годин.",
			answer:
				'When we get back, the children will have been watching cartoons for five hours.',
			accept: [
				'{When|By the time} we {get back|come back|return}, the children will have been watching cartoons for five hours.',
			],
			traps: { have: HAVE, been: BEEN, watching: ['watched', 'watch'] },
		},
		{
			id: 'future-perfect-continuous-30',
			form: 'affirmative',
			prompt:
				'До кінця семестру студенти працюватимуть над цим проєктом уже чотири місяці.',
			answer:
				'By the end of the term the students will have been working on this project for four months.',
			accept: [
				'By the end of the {term|semester} the students will have {been working|worked} on this project for four months.',
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-31',
			form: 'affirmative',
			prompt: "О десятій вечора хірурги оперуватимуть уже дев'ять годин.",
			answer:
				'At ten in the evening the surgeons will have been operating for nine hours.',
			accept: [
				'{At|By} ten in the evening the surgeons will have been operating for nine hours.',
			],
			traps: { have: HAVE, been: BEEN, operating: ['operates', 'operate'] },
		},
		{
			id: 'future-perfect-continuous-32',
			form: 'affirmative',
			prompt: 'Коли прийде весна, ми шукатимемо новий будинок уже рік.',
			answer:
				"When spring comes, we'll have been looking for a new house for a year.",
			accept: [
				"{When|By the time} spring comes, we'll have been {looking|searching} for a new house for a year.",
			],
			traps: { have: HAVE, been: BEEN, looking: ['looks', 'look'] },
		},
		{
			id: 'future-perfect-continuous-33',
			form: 'affirmative',
			prompt:
				'До того часу, як ти прокинешся, я вже три години буду за кермом.',
			answer:
				"By the time you wake up, I'll have been driving for three hours.",
			accept: [
				"{By the time|When} you wake up, I'll have been driving for three hours.",
			],
			traps: {
				wake: ['will', 'woke'],
				have: HAVE,
				been: BEEN,
				driving: ['drives', 'drive'],
			},
		},
		{
			id: 'future-perfect-continuous-34',
			form: 'affirmative',
			prompt:
				'Наступного місяця буде два роки, як ми розробляємо цей застосунок.',
			answer: "Next month we'll have been developing this app for two years.",
			traps: { have: HAVE, been: BEEN, developing: ['developed', 'develop'] },
		},
		{
			id: 'future-perfect-continuous-35',
			form: 'affirmative',
			prompt: 'До неділі сніг ітиме вже тиждень.',
			answer: 'By Sunday it will have been snowing for a week.',
			traps: { have: HAVE, been: BEEN, snowing: ['snowed', 'snows'] },
		},
		{
			id: 'future-perfect-continuous-36',
			form: 'affirmative',
			prompt:
				'Коли фільм закінчиться, ми сидітимемо в кінотеатрі вже три години.',
			answer:
				"When the film ends, we'll have been sitting in the cinema for three hours.",
			accept: [
				"{When|By the time} the {film|movie} {ends|finishes}, we'll have been sitting in the cinema for three hours.",
			],
			traps: { have: HAVE, been: BEEN, sitting: ['sits', 'sit'] },
		},
		{
			id: 'future-perfect-continuous-37',
			form: 'affirmative',
			prompt: "До кінця дня кур'єр розвозитиме посилки вже дванадцять годин.",
			answer:
				'By the end of the day the courier will have been delivering parcels for twelve hours.',
			accept: [
				'By the end of the day the courier will have been delivering {parcels|packages} for twelve hours.',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				delivering: ['delivered', 'deliver'],
			},
		},
		{
			id: 'future-perfect-continuous-38',
			form: 'affirmative',
			prompt: 'У червні буде три роки, як Марія волонтерить у притулку.',
			answer:
				'In June Maria will have been volunteering at the shelter for three years.',
			accept: [
				'In June Maria will have been volunteering {at|in} the shelter for three years.',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				volunteering: ['volunteered', 'volunteer'],
			},
		},
		{
			id: 'future-perfect-continuous-39',
			form: 'affirmative',
			prompt:
				'До того часу, як вони підпишуть угоду, вони вестимуть переговори вже пів року.',
			answer:
				"By the time they sign the agreement, they'll have been negotiating for six months.",
			accept: [
				"{By the time|When} they sign the {agreement|deal}, they'll have been negotiating for {six months|half a year}.",
			],
			traps: {
				sign: ['will', 'signed'],
				have: HAVE,
				been: BEEN,
				negotiating: ['negotiated', 'negotiate'],
			},
		},
		{
			id: 'future-perfect-continuous-40',
			form: 'affirmative',
			prompt: 'О пів на восьму я бігатиму вже годину.',
			answer: "At half past seven I'll have been running for an hour.",
			accept: ["{At|By} half past seven I'll have been running for an hour."],
			traps: { have: HAVE, been: BEEN, running: ['ran', 'run'] },
		},
		{
			id: 'future-perfect-continuous-41',
			form: 'affirmative',
			prompt: 'Коли ти подзвониш, я вже дві години садитиму квіти.',
			answer: "When you call, I'll have been planting flowers for two hours.",
			accept: [
				"{When|By the time} you {call|phone}, I'll have been planting flowers for two hours.",
			],
			traps: {
				call: ['will', 'called'],
				have: HAVE,
				been: BEEN,
				planting: ['planted', 'plant'],
			},
		},
		{
			id: 'future-perfect-continuous-42',
			form: 'affirmative',
			prompt: 'До кінця вечірки він розповідатиме анекдоти вже три години.',
			answer:
				"By the end of the party he'll have been telling jokes for three hours.",
			traps: { have: HAVE, been: BEEN, telling: ['tells', 'tell'] },
		},
		{
			id: 'future-perfect-continuous-43',
			form: 'affirmative',
			prompt:
				'Коли сусіди закінчать ремонт, вони свердлитимуть уже два місяці.',
			answer:
				"When the neighbours finish the renovation, they'll have been drilling for two months.",
			accept: [
				"{When|By the time} the {neighbours|neighbors} finish the {renovation|repairs}, they'll have been drilling for two months.",
			],
			traps: {
				finish: ['will', 'finished'],
				have: HAVE,
				been: BEEN,
				drilling: ['drilled', 'drill'],
			},
		},
		{
			id: 'future-perfect-continuous-44',
			form: 'question',
			prompt: 'Як довго ти вже працюватимеш тут до наступного червня?',
			answer: 'How long will you have been working here by next June?',
			accept: [
				'How long will you have {been working|worked} here by next June?',
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-45',
			form: 'question',
			prompt: 'Як довго ви вже їхатимете, коли доїдете до кордону?',
			answer: 'How long will you have been driving when you reach the border?',
			accept: [
				'How long will you have been {driving|travelling|traveling} {when|by the time} you {reach|get to} the border?',
			],
			traps: { have: HAVE, been: BEEN, reach: ['will', 'reached'] },
		},
		{
			id: 'future-perfect-continuous-46',
			form: 'question',
			prompt: 'Ти вже рік вивчатимеш італійську до вересня?',
			answer: 'Will you have been learning Italian for a year by September?',
			accept: [
				'Will you have been {learning|studying} Italian for a year by September?',
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-47',
			form: 'question',
			prompt: 'Як довго вони вже будуватимуть цей будинок до кінця року?',
			answer:
				'How long will they have been building this house by the end of the year?',
			accept: [
				'How long will they have been building this house by the end of {the|this} year?',
			],
			traps: { have: HAVE, been: BEEN, building: ['built', 'build'] },
		},
		{
			id: 'future-perfect-continuous-48',
			form: 'question',
			prompt: 'Як довго ти вже чекатимеш, коли приїде автобус?',
			answer: 'How long will you have been waiting when the bus comes?',
			accept: [
				'How long will you have been waiting {when|by the time} the bus {comes|arrives}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				waiting: ['waits', 'wait'],
				comes: ['will', 'come'],
			},
		},
		{
			id: 'future-perfect-continuous-49',
			form: 'question',
			prompt: 'Він уже двадцять років викладатиме тут, коли вийде на пенсію?',
			answer:
				'Will he have been teaching here for twenty years when he retires?',
			accept: [
				'Will he have {been teaching|taught} here for twenty years {when|by the time} he retires?',
			],
			traps: { have: HAVE, been: BEEN, retires: ['will', 'retire'] },
		},
		{
			id: 'future-perfect-continuous-50',
			form: 'question',
			prompt: 'Як довго діти вже спатимуть, коли ми повернемося?',
			answer: 'How long will the children have been sleeping when we get back?',
			accept: [
				'How long will the children have been sleeping {when|by the time} we {get back|come back|return}?',
			],
			traps: { have: HAVE, been: BEEN, sleeping: ['slept', 'sleep'] },
		},
		{
			id: 'future-perfect-continuous-51',
			form: 'question',
			prompt: 'Як довго пілот уже летітиме, коли літак приземлиться в Токіо?',
			answer:
				'How long will the pilot have been flying when the plane lands in Tokyo?',
			accept: [
				'How long will the pilot have been flying {when|by the time} the plane lands in Tokyo?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				flying: ['flies', 'fly'],
				lands: ['will', 'land'],
			},
		},
		{
			id: 'future-perfect-continuous-52',
			form: 'question',
			prompt: 'Вони вже місяць житимуть у новому будинку, коли ти приїдеш?',
			answer:
				'Will they have been living in the new house for a month when you arrive?',
			accept: [
				'Will they have {been living|lived} in the new house for a month {when|by the time} you {arrive|come}?',
			],
			traps: { have: HAVE, been: BEEN, arrive: ['will', 'arrived'] },
		},
		{
			id: 'future-perfect-continuous-53',
			form: 'question',
			prompt: 'Як довго ти вже писатимеш цю книжку до Нового року?',
			answer: 'How long will you have been writing this book by New Year?',
			accept: [
				'How long will you have been writing this book by {New Year|the New Year}?',
			],
			traps: { have: HAVE, been: BEEN, writing: ['written', 'wrote'] },
		},
		{
			id: 'future-perfect-continuous-54',
			form: 'question',
			prompt: 'Ви вже три години гратимете в шахи до півночі?',
			answer: 'Will you have been playing chess for three hours by midnight?',
			traps: { have: HAVE, been: BEEN, playing: ['plays', 'play'] },
		},
		{
			id: 'future-perfect-continuous-55',
			form: 'question',
			prompt: 'Як довго робітники вже ремонтуватимуть дорогу до зими?',
			answer:
				'How long will the workers have been repairing the road by winter?',
			accept: [
				'How long will the workers have been {repairing|fixing} the road by {winter|the winter}?',
			],
			traps: { have: HAVE, been: BEEN, repairing: ['repaired', 'repair'] },
		},
		{
			id: 'future-perfect-continuous-56',
			form: 'question',
			prompt:
				'Вона вже десять років співатиме в хорі, коли їй виповниться тридцять?',
			answer:
				'Will she have been singing in the choir for ten years when she turns thirty?',
			accept: [
				'Will she have been singing in the choir for ten years {when|by the time} she turns thirty?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				singing: ['sung', 'sang'],
				turns: ['will', 'turn'],
			},
		},
		{
			id: 'future-perfect-continuous-57',
			form: 'question',
			prompt: 'Як довго ми вже йтимемо, коли дійдемо до озера?',
			answer: 'How long will we have been walking when we reach the lake?',
			accept: [
				'How long will we have been walking {when|by the time} we {reach|get to} the lake?',
			],
			traps: { have: HAVE, been: BEEN, walking: ['walked', 'walk'] },
		},
		{
			id: 'future-perfect-continuous-58',
			form: 'question',
			prompt: 'Як довго хліб уже пектиметься, коли ти повернешся?',
			answer: 'How long will the bread have been baking when you get back?',
			accept: [
				'How long will the bread have been baking {when|by the time} you {get back|come back|return}?',
			],
			traps: { have: HAVE, been: BEEN, baking: ['bakes', 'bake'] },
		},
		{
			id: 'future-perfect-continuous-59',
			form: 'question',
			prompt: 'Твій брат уже рік служитиме в армії до весни?',
			answer:
				'Will your brother have been serving in the army for a year by spring?',
			accept: [
				'Will your brother have been serving in the army for a year by {spring|the spring}?',
			],
			traps: { have: HAVE, been: BEEN, serving: ['served', 'serve'] },
		},
		{
			id: 'future-perfect-continuous-60',
			form: 'question',
			prompt:
				'Як довго журналісти вже чекатимуть, коли почнеться пресконференція?',
			answer:
				'How long will the journalists have been waiting when the press conference starts?',
			accept: [
				'How long will the journalists have been waiting {when|by the time} the press conference {starts|begins}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				waiting: ['waits', 'wait'],
				starts: ['will', 'start'],
			},
		},
		{
			id: 'future-perfect-continuous-61',
			form: 'question',
			prompt: 'Вони вже два тижні пливтимуть, коли побачать землю?',
			answer: 'Will they have been sailing for two weeks when they see land?',
			accept: [
				'Will they have been sailing for two weeks {when|by the time} they see land?',
			],
			traps: { have: HAVE, been: BEEN, sailing: ['sailed', 'sail'] },
		},
		{
			id: 'future-perfect-continuous-62',
			form: 'question',
			prompt: 'Як довго ти вже вивчатимеш медицину, коли станеш лікарем?',
			answer:
				'How long will you have been studying medicine when you become a doctor?',
			accept: [
				'How long will you have {been studying|studied} medicine {when|by the time} you become a doctor?',
			],
			traps: { have: HAVE, been: BEEN, become: ['will', 'became'] },
		},
		{
			id: 'future-perfect-continuous-63',
			form: 'question',
			prompt: 'Як довго вода вже кипітиме, коли ти покладеш макарони?',
			answer:
				'How long will the water have been boiling when you put in the pasta?',
			accept: [
				'How long will the water have been boiling {when|by the time} you {put in the pasta|put the pasta in|add the pasta}?',
			],
			traps: { have: HAVE, been: BEEN, boiling: ['boils', 'boil'] },
		},
		{
			id: 'future-perfect-continuous-64',
			form: 'question',
			prompt: 'Він уже годину говоритиме по телефону, коли ти прийдеш?',
			answer:
				'Will he have been talking on the phone for an hour when you come?',
			accept: [
				'Will he have been talking on the phone for an hour {when|by the time} you {come|arrive|get here}?',
			],
			traps: { have: HAVE, been: BEEN, talking: ['talked', 'talk'] },
		},
		{
			id: 'future-perfect-continuous-65',
			form: 'question',
			prompt: 'Як довго археологи вже копатимуть тут до кінця літа?',
			answer:
				'How long will the archaeologists have been digging here by the end of the summer?',
			accept: [
				'How long will the {archaeologists|archeologists} have been digging here by the end of {the summer|summer}?',
			],
			traps: { have: HAVE, been: BEEN, digging: ['dug', 'dig'] },
		},
		{
			id: 'future-perfect-continuous-66',
			form: 'question',
			prompt: 'Ми вже пів року відкладатимемо гроші до літа?',
			answer: 'Will we have been saving money for six months by the summer?',
			accept: [
				'Will we have been saving {money|up} for {six months|half a year} by {the summer|summer}?',
			],
			traps: { have: HAVE, been: BEEN, saving: ['saved', 'save'] },
		},
		{
			id: 'future-perfect-continuous-67',
			form: 'question',
			prompt:
				'Як довго цей вулкан уже вивергатиметься, коли прибудуть рятувальники?',
			answer:
				'How long will this volcano have been erupting when the rescuers arrive?',
			accept: [
				'How long will this volcano have been erupting {when|by the time} the rescuers arrive?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				erupting: ['erupted', 'erupt'],
				arrive: ['will', 'arrived'],
			},
		},
		{
			id: 'future-perfect-continuous-68',
			form: 'question',
			prompt: "Ти вже п'ять годин сидітимеш за комп'ютером до обіду?",
			answer:
				'Will you have been sitting at the computer for five hours by lunch?',
			accept: [
				'Will you have been sitting at the computer for five hours by {lunch|lunchtime}?',
			],
			traps: { have: HAVE, been: BEEN, sitting: ['sits', 'sit'] },
		},
		{
			id: 'future-perfect-continuous-69',
			form: 'question',
			prompt: 'Як довго Марко вже ремонтуватиме дах до наступних вихідних?',
			answer:
				'How long will Marko have been repairing the roof by next weekend?',
			accept: [
				'How long will Marko have been {repairing|fixing} the roof by next weekend?',
			],
			traps: { have: HAVE, been: BEEN, repairing: ['repaired', 'repair'] },
		},
		{
			id: 'future-perfect-continuous-70',
			form: 'question',
			prompt:
				'Як довго вона вже перекладатиме цей роман, коли його нарешті видадуть?',
			answer:
				'How long will she have been translating this novel when it is finally published?',
			accept: [
				"How long will she have been translating this novel {when|by the time} {it is|it's} finally published?",
			],
			traps: {
				have: HAVE,
				been: BEEN,
				translating: ['translated', 'translate'],
			},
		},
		{
			id: 'future-perfect-continuous-71',
			form: 'question',
			prompt:
				'Твої батьки вже тридцять років житимуть разом до наступного року?',
			answer:
				'Will your parents have been living together for thirty years by next year?',
			accept: [
				'Will your parents have {been living|lived} together for thirty years by next year?',
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-72',
			form: 'question',
			prompt: 'Як довго ти вже пливтимеш, коли допливеш до острова?',
			answer: 'How long will you have been swimming when you reach the island?',
			accept: [
				'How long will you have been swimming {when|by the time} you {reach|get to} the island?',
			],
			traps: { have: HAVE, been: BEEN, swimming: ['swum', 'swam'] },
		},
		{
			id: 'future-perfect-continuous-73',
			form: 'question',
			prompt: 'Як довго дощ уже йтиме до кінця матчу?',
			answer: 'How long will it have been raining by the end of the match?',
			traps: { have: HAVE, been: BEEN, raining: ['rained', 'rains'] },
		},
		{
			id: 'future-perfect-continuous-74',
			form: 'question',
			prompt: 'Студенти вже тиждень страйкуватимуть до понеділка?',
			answer: 'Will the students have been striking for a week by Monday?',
			accept: [
				'Will the students have been {striking|on strike} for a week by Monday?',
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-75',
			form: 'negative',
			prompt: 'У червні ще не буде року, як я тут працюю.',
			answer: "In June I won't have been working here for a year.",
			accept: ["In June I won't have {been working|worked} here for a year."],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-76',
			form: 'negative',
			prompt:
				'На той час, коли задзвонить будильник, він спатиме не більше години.',
			answer:
				"By the time the alarm goes off, he won't have been sleeping for more than an hour.",
			accept: [
				"{By the time|When} the alarm {goes off|rings}, he won't have been sleeping for more than an hour.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'future-perfect-continuous-77',
			form: 'negative',
			prompt:
				'На той час, коли ти приїдеш, ми чекатимемо не більше десяти хвилин.',
			answer:
				"By the time you arrive, we won't have been waiting for more than ten minutes.",
			accept: [
				"{By the time|When} you {arrive|get here}, we won't have been waiting for more than ten minutes.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				waiting: ['waits', 'wait'],
			},
		},
		{
			id: 'future-perfect-continuous-78',
			form: 'negative',
			prompt: 'Наступного місяця ще не буде двох років, як ми зустрічаємося.',
			answer: "Next month we won't have been dating for two years.",
			accept: [
				"Next month we won't have been {dating|going out|seeing each other} for two years.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-79',
			form: 'negative',
			prompt: 'У грудні ще не буде пів року, як вона вчиться водити.',
			answer:
				"In December she won't have been learning to drive for six months.",
			accept: [
				"In December she won't have been learning to drive for {six months|half a year}.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				learning: ['learned', 'learn'],
			},
		},
		{
			id: 'future-perfect-continuous-80',
			form: 'negative',
			prompt:
				'На той час, коли почнеться матч, фанати співатимуть не більше години.',
			answer:
				"By the time the match starts, the fans won't have been singing for more than an hour.",
			accept: [
				"{By the time|When} the match {starts|begins}, the fans won't have been singing for more than an hour.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				singing: ['sung', 'sang'],
			},
		},
		{
			id: 'future-perfect-continuous-81',
			form: 'negative',
			prompt: 'Наступного тижня ще не буде місяця, як він бігає вранці.',
			answer:
				"Next week he won't have been running in the mornings for a month.",
			accept: [
				"Next week he won't have been {running|jogging} in the {mornings|morning} for a month.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-82',
			form: 'negative',
			prompt:
				'Коли повернеться шеф, ми працюватимемо над звітом не більше двох годин.',
			answer:
				"When the boss comes back, we won't have been working on the report for more than two hours.",
			accept: [
				"{When|By the time} the boss {comes back|gets back|returns}, we won't have {been working|worked} on the report for more than two hours.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-83',
			form: 'negative',
			prompt: "Восени ще не буде п'яти років, як вони живуть у Львові.",
			answer:
				"In the autumn they won't have been living in Lviv for five years.",
			accept: [
				"In {the autumn|autumn|the fall} they won't have {been living|lived} in Lviv for five years.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-84',
			form: 'negative',
			prompt:
				"На той час, коли приїде швидка, він лежатиме на землі не більше п'яти хвилин.",
			answer:
				"By the time the ambulance arrives, he won't have been lying on the ground for more than five minutes.",
			accept: [
				"{By the time|When} the ambulance {arrives|comes}, he won't have been lying on the ground for more than five minutes.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				lying: ['lain', 'lay'],
			},
		},
		{
			id: 'future-perfect-continuous-85',
			form: 'negative',
			prompt: 'Навесні ще не буде року, як ми вирощуємо помідори.',
			answer: "In the spring we won't have been growing tomatoes for a year.",
			accept: [
				"In {the spring|spring} we won't have been growing tomatoes for a year.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				growing: ['grown', 'grew'],
			},
		},
		{
			id: 'future-perfect-continuous-86',
			form: 'negative',
			prompt:
				"Коли прибуде потяг, ми стоятимемо на пероні не більше п'яти хвилин.",
			answer:
				"When the train arrives, we won't have been standing on the platform for more than five minutes.",
			accept: [
				"{When|By the time} the train {arrives|comes}, we won't have been standing on the platform for more than five minutes.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				standing: ['stands', 'stand'],
			},
		},
		{
			id: 'future-perfect-continuous-87',
			form: 'negative',
			prompt:
				'До наступного понеділка ще не буде двох тижнів, як вона ходить до спортзалу.',
			answer:
				"By next Monday she won't have been going to the gym for two weeks.",
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				going: ['gone', 'went'],
			},
		},
		{
			id: 'future-perfect-continuous-88',
			form: 'negative',
			prompt: 'Коли ти прийдеш, торт пектиметься не більше двадцяти хвилин.',
			answer:
				"When you come, the cake won't have been baking for more than twenty minutes.",
			accept: [
				"{When|By the time} you {come|arrive|get here}, the cake won't have been baking for more than twenty minutes.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				baking: ['bakes', 'bake'],
			},
		},
		{
			id: 'future-perfect-continuous-89',
			form: 'negative',
			prompt:
				'Наступного року ще не буде десяти років, як він грає в цій команді.',
			answer:
				"Next year he won't have been playing for this team for ten years.",
			accept: [
				"Next year he won't have {been playing|played} {for|in} this team for ten years.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-90',
			form: 'negative',
			prompt:
				'На той час, коли відчинять ворота, люди стоятимуть у черзі не більше пів години.',
			answer:
				"By the time the gates open, people won't have been queuing for more than half an hour.",
			accept: [
				"{By the time|When} the gates open, people won't have been {queuing|queueing|standing in line|waiting in line} for more than half an hour.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-91',
			form: 'negative',
			prompt: 'У жовтні ще не буде року, як мій брат служить в армії.',
			answer:
				"In October my brother won't have been serving in the army for a year.",
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				serving: ['served', 'serve'],
			},
		},
		{
			id: 'future-perfect-continuous-92',
			form: 'negative',
			prompt: 'Коли прийдуть гості, суп варитиметься не більше десяти хвилин.',
			answer:
				"When the guests arrive, the soup won't have been cooking for more than ten minutes.",
			accept: [
				"{When|By the time} the guests {arrive|come}, the soup won't have been {cooking|boiling} for more than ten minutes.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-93',
			form: 'negative',
			prompt:
				'Наступного літа ще не буде трьох років, як вони ремонтують цю школу.',
			answer:
				"Next summer they won't have been renovating this school for three years.",
			accept: [
				"Next summer they won't have been {renovating|repairing} this school for three years.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-94',
			form: 'negative',
			prompt:
				'До того часу, як ти закінчиш читати, діти гратимуть не більше пів години.',
			answer:
				"By the time you finish reading, the children won't have been playing for more than half an hour.",
			accept: [
				"{By the time|When} you finish reading, the children won't have been playing for more than half an hour.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				playing: ['plays', 'play'],
			},
		},
		{
			id: 'future-perfect-continuous-95',
			form: 'negative',
			prompt: 'У понеділок ще не буде тижня, як ми працюємо віддалено.',
			answer: "On Monday we won't have been working remotely for a week.",
			accept: [
				"On Monday we won't have {been working|worked} remotely for a week.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-96',
			form: 'negative',
			prompt:
				"Коли почнеться вистава, ми сидітимемо тут не більше п'яти хвилин.",
			answer:
				"When the play starts, we won't have been sitting here for more than five minutes.",
			accept: [
				"{When|By the time} the {play|performance|show} {starts|begins}, we won't have been sitting here for more than five minutes.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				sitting: ['sits', 'sit'],
			},
		},
		{
			id: 'future-perfect-continuous-97',
			form: 'negative',
			prompt:
				'Наступної осені ще не буде двох років, як ми вивчаємо іспанську.',
			answer: "Next autumn we won't have been learning Spanish for two years.",
			accept: [
				"Next {autumn|fall} we won't have been {learning|studying} Spanish for two years.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-98',
			form: 'negative',
			prompt:
				'На той час, коли прилетить гелікоптер, туристи чекатимуть на допомогу не більше години.',
			answer:
				"By the time the helicopter arrives, the tourists won't have been waiting for help for more than an hour.",
			accept: [
				"{By the time|When} the helicopter {arrives|comes}, the tourists won't have been waiting for help for more than an hour.",
			],
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				waiting: ['waits', 'wait'],
			},
		},
		{
			id: 'future-perfect-continuous-99',
			form: 'negative',
			prompt:
				'Коли ти повернешся з роботи, я готуватиму вечерю не більше пів години.',
			answer:
				"When you get back from work, I won't have been cooking dinner for more than half an hour.",
			accept: [
				"{When|By the time} you {get back|come back|return} from work, I won't have been {cooking|making} dinner for more than half an hour.",
			],
			traps: { "won't": WONT, have: HAVE, been: BEEN },
		},
		{
			id: 'future-perfect-continuous-100',
			form: 'negative',
			prompt: "Наступної зими ще не буде п'яти років, як він малює.",
			answer: "Next winter he won't have been painting for five years.",
			traps: {
				"won't": WONT,
				have: HAVE,
				been: BEEN,
				painting: ['paints', 'paint'],
			},
		},
	],
})
