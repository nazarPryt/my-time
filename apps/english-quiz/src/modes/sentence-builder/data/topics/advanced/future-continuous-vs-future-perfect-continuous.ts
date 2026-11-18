import { defineTopic } from '../../define-topic'

/** Future Continuous: pushes toward will have been. */
const BE = ['been', 'have'] as const
/** Future Perfect Continuous: push toward will be / being. */
const HAVE = ['be', 'has'] as const
const BEEN = ['being', 'be'] as const

export const futureContinuousVsFuturePerfectContinuous = defineTopic({
	id: 'future-continuous-vs-future-perfect-continuous',
	level: 'advanced',
	title: 'Future Continuous vs Future Perfect Continuous',
	subtitle: 'Майбутній тривалий і доконано-тривалий час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Future Continuous (will be + -ing) показує дію в процесі в певний момент майбутнього: о шостій, завтра о цій порі, коли ти подзвониш. Future Perfect Continuous (will have been + -ing) показує, скільки часу дія вже триватиме до цього моменту: вже три години, вже рік. Є тривалість (for two hours) — Future Perfect Continuous; лише момент без тривалості — Future Continuous.',
			examples: [
				{
					text: "At eight I'll be driving home.",
					translation: 'О восьмій я їхатиму додому.',
				},
				{
					text: "At eight I'll have been driving for ten hours.",
					translation: 'О восьмій я буду за кермом уже десять годин.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Future Continuous: підмет + will be + -ing. Future Perfect Continuous: підмет + will have been + -ing + for (тривалість). Will із займенником скорочується до 'll: I'll be, she'll have been. Момент у майбутньому — at, this time tomorrow, when; межа тривалості — by, by the time.",
			examples: [
				{
					text: "This time next month they'll be moving house.",
					translation: 'Наступного місяця о цій порі вони переїжджатимуть.',
				},
				{
					text: "By the time the bus comes, we'll have been standing here for an hour.",
					translation: 'Коли приїде автобус, ми стоятимемо тут уже годину.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Will + підмет + be + -ing? (що відбуватиметься в момент) і Will + підмет + have been + -ing? Для тривалості — How long will…have been…?',
			examples: [
				{
					text: 'Will you be using the kitchen at seven?',
					translation: 'Ти користуватимешся кухнею о сьомій?',
				},
				{
					text: 'How long will he have been sleeping when the alarm rings?',
					translation:
						'Скільки часу він уже спатиме, коли задзвонить будильник?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Підмет + won't (will not) + be + -ing або won't + have been + -ing. Заперечення з тривалістю часто означає «ще й … не» або «не більше ніж»: won't have been…for a week, won't have been…for more than an hour.",
			examples: [
				{
					text: "Call me at noon: I won't be teaching then.",
					translation: 'Подзвони мені опівдні: тоді я не вестиму уроків.',
				},
				{
					text: "By Easter they won't have been dating for a month.",
					translation: 'На Великдень вони ще й місяця не зустрічатимуться.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'future-continuous-vs-future-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'О шостій я ще працюватиму.',
			answer: "At six I'll still be working.",
			accept: ["At six o'clock I'll still be working."],
			traps: { be: ['been', 'being'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'О шостій я працюватиму вже вісім годин.',
			answer: "At six I'll have been working for eight hours.",
			accept: [
				"{At|By} {six|six o'clock} I'll have been working for eight hours.",
			],
			traps: { been: ['be', 'being'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-3',
			form: 'affirmative',
			prompt: 'Опівночі ми ще танцюватимемо.',
			answer: "At midnight we'll still be dancing.",
			traps: { be: BE, dancing: ['danced', 'dance'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-4',
			form: 'affirmative',
			prompt: 'Завтра о цій порі я летітиму до Лондона.',
			answer: "This time tomorrow I'll be flying to London.",
			accept: ["{This|At this} time tomorrow I'll be flying to London."],
			traps: { be: BE, flying: ['flew', 'fly'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-5',
			form: 'affirmative',
			prompt: 'Коли ти прокинешся, я працюватиму в саду.',
			answer: "When you wake up, I'll be working in the garden.",
			traps: { be: BE, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-6',
			form: 'affirmative',
			prompt: 'Опівдні Анна ще писатиме свій звіт.',
			answer: 'At noon Anna will still be writing her report.',
			accept: ['At {noon|midday} Anna will still be writing her report.'],
			traps: { be: BE, writing: ['wrote', 'write'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-7',
			form: 'affirmative',
			prompt: 'Наступного тижня о цій порі ми плаватимемо в морі.',
			answer: "This time next week we'll be swimming in the sea.",
			accept: ["{This|At this} time next week we'll be swimming in the sea."],
			traps: { be: BE, swimming: ['swam', 'swim'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-8',
			form: 'affirmative',
			prompt: 'За годину Тарас готуватиме вечерю.',
			answer: 'In an hour Taras will be cooking dinner.',
			accept: ['In an hour Taras will be {cooking|making} dinner.'],
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-9',
			form: 'affirmative',
			prompt: 'Коли літак приземлиться, ми чекатимемо в аеропорту.',
			answer: "When the plane lands, we'll be waiting at the airport.",
			accept: ["When the plane lands, we'll be waiting {at|in} the airport."],
			traps: { be: BE, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-10',
			form: 'affirmative',
			prompt: 'Опівночі Іван ще читатиме.',
			answer: 'At midnight Ivan will still be reading.',
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-11',
			form: 'affirmative',
			prompt: 'Коли ти подзвониш, я, мабуть, вечерятиму.',
			answer: "When you call, I'll probably be having dinner.",
			accept: [
				"When you {call|phone}, I'll probably be {having|eating} dinner.",
			],
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-12',
			form: 'affirmative',
			prompt: 'Наступного року о цій порі вона навчатиметься в Лондоні.',
			answer: "This time next year she'll be studying in London.",
			accept: ["{This|At this} time next year she'll be studying in London."],
			traps: { be: BE, studying: ['studied', 'study'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-13',
			form: 'affirmative',
			prompt: 'О шостій вони ще гратимуть у футбол.',
			answer: "At six they'll still be playing football.",
			accept: ["At six {o'clock|} they'll still be playing football."],
			traps: { be: BE, playing: ['played', 'play'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-14',
			form: 'affirmative',
			prompt: 'Коли ти прийдеш додому, я готуватиму вечерю.',
			answer: "When you get home, I'll be cooking dinner.",
			accept: ["When you {get|come} home, I'll be {cooking|making} dinner."],
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-15',
			form: 'affirmative',
			prompt: "Не дзвони о дев'ятій: я тоді вестиму урок.",
			answer: "Don't call at nine, I'll be teaching then.",
			accept: ["Don't {call|phone} at nine {o'clock|}, I'll be teaching then."],
			traps: { be: BE, teaching: ['teaches', 'teach'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-16',
			form: 'affirmative',
			prompt: 'Коли ти приземлишся, я на тебе чекатиму.',
			answer: "When you land, I'll be waiting for you.",
			traps: { be: BE, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-17',
			form: 'affirmative',
			prompt: 'Завтра о цій порі Роман кататиметься на лижах.',
			answer: 'This time tomorrow Roman will be skiing.',
			accept: ['{This|At this} time tomorrow Roman will be skiing.'],
			traps: { be: BE, skiing: ['skied', 'ski'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-18',
			form: 'affirmative',
			prompt: 'Опівночі Ніна ще шитиме свою сукню.',
			answer: 'At midnight Nina will still be sewing her dress.',
			traps: { be: BE, sewing: ['sewed', 'sew'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-19',
			form: 'affirmative',
			prompt: 'Наступного тижня о цій порі вони братимуть шлюб.',
			answer: "This time next week they'll be getting married.",
			accept: ["{This|At this} time next week they'll be getting married."],
			traps: { be: BE, getting: ['got', 'get'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-20',
			form: 'affirmative',
			prompt: 'Коли ти прочитаєш цей лист, я летітиму над океаном.',
			answer: "When you read this letter, I'll be flying over the ocean.",
			traps: { be: BE, flying: ['flew', 'fly'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-21',
			form: 'affirmative',
			prompt: 'Опівдні ми ще підніматимемося на гору.',
			answer: "At noon we'll still be climbing the mountain.",
			accept: ["At {noon|midday} we'll still be climbing the mountain."],
			traps: { be: BE, climbing: ['climbed', 'climb'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-22',
			form: 'affirmative',
			prompt: 'Коли ти закінчиш роботу, я чекатиму в машині.',
			answer: "When you finish work, I'll be waiting in the car.",
			traps: { be: BE, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-23',
			form: 'affirmative',
			prompt: 'Завтра о цій порі ми святкуватимемо твій день народження.',
			answer: "This time tomorrow we'll be celebrating your birthday.",
			accept: [
				"{This|At this} time tomorrow we'll be celebrating your birthday.",
			],
			traps: { be: BE, celebrating: ['celebrated', 'celebrate'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-24',
			form: 'affirmative',
			prompt: 'Коли прийдуть гості, Тарас ще прийматиме душ.',
			answer: 'When the guests arrive, Taras will still be taking a shower.',
			accept: [
				'When the guests {arrive|come}, Taras will still be {taking|having} a shower.',
			],
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-25',
			form: 'affirmative',
			prompt: 'О шостій ранку вона бігатиме в парку.',
			answer: "At six in the morning she'll be running in the park.",
			accept: [
				"At six {o'clock|} in the morning she'll be {running|jogging} in the park.",
			],
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-26',
			form: 'affirmative',
			prompt: 'Наступного літа о цій порі я працюватиму в Польщі.',
			answer: "This time next summer I'll be working in Poland.",
			accept: ["{This|At this} time next summer I'll be working in Poland."],
			traps: { be: BE, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-27',
			form: 'affirmative',
			prompt: 'Коли ти зайдеш, я говоритиму по телефону.',
			answer: "When you come in, I'll be talking on the phone.",
			accept: ["When you come in, I'll be {talking|speaking} on the phone."],
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-28',
			form: 'question',
			prompt: 'Що ти робитимеш завтра о цій порі?',
			answer: 'What will you be doing this time tomorrow?',
			accept: ['What will you be doing {at|} this time tomorrow?'],
			traps: { be: BE, doing: ['did', 'do'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-29',
			form: 'question',
			prompt: 'Ти користуватимешся принтером о третій?',
			answer: 'Will you be using the printer at three?',
			traps: { be: BE, using: ['uses', 'use'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-30',
			form: 'question',
			prompt: 'Ви ще працюватимете, коли я подзвоню?',
			answer: 'Will you still be working when I call?',
			accept: ['Will you still be working when I {call|phone}?'],
			traps: { be: BE, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-31',
			form: 'question',
			prompt: 'Де ти житимеш наступного року о цій порі?',
			answer: 'Where will you be living this time next year?',
			accept: ['Where will you be living {at|} this time next year?'],
			traps: { be: BE, living: ['lived', 'live'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-32',
			form: 'question',
			prompt: 'Вона ще працюватиме опівночі?',
			answer: 'Will she still be working at midnight?',
			traps: { be: BE, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-33',
			form: 'question',
			prompt: 'Хто чекатиме на нас в аеропорту, коли ми приземлимося?',
			answer: 'Who will be waiting for us at the airport when we land?',
			accept: ['Who will be waiting for us {at|in} the airport when we land?'],
			traps: { be: BE, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-34',
			form: 'question',
			prompt: 'Вони ще гратимуть у теніс, коли почнеться дощ?',
			answer: 'Will they still be playing tennis when it starts raining?',
			accept: [
				'Will they still be playing tennis when it starts {raining|to rain}?',
			],
			traps: { be: BE, playing: ['played', 'play'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-35',
			form: 'question',
			prompt: 'Ти чекатимеш на мене біля входу о шостій?',
			answer: 'Will you be waiting for me at the entrance at six?',
			traps: { be: BE, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-36',
			form: 'question',
			prompt: 'Що робитиме Анна, коли ми приїдемо?',
			answer: 'What will Anna be doing when we arrive?',
			accept: ['What will Anna be doing when we {arrive|come|get there}?'],
			traps: { be: BE, doing: ['did', 'do'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-37',
			form: 'question',
			prompt: 'Ти кататимешся на лижах наступного тижня о цій порі?',
			answer: 'Will you be skiing this time next week?',
			accept: ['Will you be skiing {at|} this time next week?'],
			traps: { be: BE, skiing: ['skied', 'ski'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-38',
			form: 'question',
			prompt: 'Що ти робитимеш завтра о десятій?',
			answer: 'What will you be doing at ten tomorrow?',
			accept: ['What will you be doing {at ten tomorrow|tomorrow at ten}?'],
			traps: { be: BE, doing: ['did', 'do'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-39',
			form: 'question',
			prompt: 'Чи йтиме ще дощ, коли ми приземлимося?',
			answer: 'Will it still be raining when we land?',
			traps: { be: BE, raining: ['rained', 'rain'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-40',
			form: 'negative',
			prompt: 'Завтра о цій порі я не працюватиму.',
			answer: "This time tomorrow I won't be working.",
			accept: ["{This|At this} time tomorrow I won't be working."],
			traps: { be: BE, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-41',
			form: 'negative',
			prompt: 'Коли ти подзвониш, я не спатиму.',
			answer: "When you call, I won't be sleeping.",
			accept: ["When you {call|phone}, I won't be {sleeping|asleep}."],
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-42',
			form: 'negative',
			prompt: 'Наступного тижня о цій порі вони не працюватимуть.',
			answer: "This time next week they won't be working.",
			accept: ["{This|At this} time next week they won't be working."],
			traps: { be: BE, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-43',
			form: 'negative',
			prompt: "О дев'ятій я не дивитимуся телевізор.",
			answer: "At nine I won't be watching TV.",
			accept: ["At nine {o'clock|} I won't be watching {TV|television}."],
			traps: { be: BE, watching: ['watched', 'watch'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-44',
			form: 'negative',
			prompt: 'Не хвилюйся, я не користуватимуся твоєю машиною завтра.',
			answer: "Don't worry, I won't be using your car tomorrow.",
			traps: { be: BE, using: ['uses', 'use'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-45',
			form: 'negative',
			prompt: 'Коли ти приземлишся, я не чекатиму в аеропорту.',
			answer: "When you land, I won't be waiting at the airport.",
			accept: ["When you land, I won't be waiting {at|in} the airport."],
			traps: { be: BE, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-46',
			form: 'negative',
			prompt: 'Завтра о десятій Іван не викладатиме.',
			answer: "At ten tomorrow Ivan won't be teaching.",
			accept: [
				"At ten {o'clock|} tomorrow Ivan won't be teaching.",
				"Tomorrow at ten {o'clock|} Ivan won't be teaching.",
			],
			traps: { be: BE, teaching: ['teaches', 'teach'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-47',
			form: 'negative',
			prompt: 'Наступного року о цій порі я не житиму в Києві.',
			answer: "This time next year I won't be living in Kyiv.",
			accept: ["{This|At this} time next year I won't be living in Kyiv."],
			traps: { be: BE, living: ['lived', 'live'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-48',
			form: 'negative',
			prompt: 'О шостій Ніна не бігатиме в парку.',
			answer: "At six Nina won't be running in the park.",
			accept: [
				"At six {o'clock|} Nina won't be {running|jogging} in the park.",
			],
			traps: { be: BE },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-49',
			form: 'negative',
			prompt: 'Завтра о цій порі я не думатиму про роботу.',
			answer: "This time tomorrow I won't be thinking about work.",
			accept: ["{This|At this} time tomorrow I won't be thinking about work."],
			traps: { be: BE, thinking: ['thought', 'think'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-50',
			form: 'negative',
			prompt: 'Опівдні Тарас не працюватиме в саду.',
			answer: "At noon Taras won't be working in the garden.",
			accept: ["At {noon|midday} Taras won't be working in the garden."],
			traps: { be: BE, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-51',
			form: 'negative',
			prompt: 'Наступного місяця о цій порі ми не житимемо у Львові.',
			answer: "This time next month we won't be living in Lviv.",
			accept: ["{This|At this} time next month we won't be living in Lviv."],
			traps: { be: BE, living: ['lived', 'live'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-52',
			form: 'affirmative',
			prompt: 'До червня я працюватиму тут уже десять років.',
			answer: "By June I'll have been working here for ten years.",
			traps: { have: HAVE, been: BEEN, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-53',
			form: 'affirmative',
			prompt: 'Опівдні ми чекатимемо вже три години.',
			answer: "At noon we'll have been waiting for three hours.",
			accept: [
				"{At|By} {noon|midday} we'll have been waiting for three hours.",
			],
			traps: { have: HAVE, been: BEEN, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-54',
			form: 'affirmative',
			prompt: 'До першої години вони гратимуть уже чотири години.',
			answer: "By one they'll have been playing for four hours.",
			accept: ["By one {o'clock|} they'll have been playing for four hours."],
			traps: { have: HAVE, been: BEEN, playing: ['played', 'play'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-55',
			form: 'affirmative',
			prompt:
				'Наступного місяця Анна викладатиме в цій школі вже двадцять років.',
			answer:
				'Next month Anna will have been teaching at this school for twenty years.',
			traps: { have: HAVE, been: BEEN, teaching: ['teaches', 'teach'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-56',
			form: 'affirmative',
			prompt: "До кінця року ми житимемо в Києві вже п'ять років.",
			answer:
				"By the end of the year we'll have been living in Kyiv for five years.",
			traps: { have: HAVE, been: BEEN, living: ['lived', 'live'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-57',
			form: 'affirmative',
			prompt: 'Коли ти прийдеш додому, я готуватиму вже дві години.',
			answer: "When you get home, I'll have been cooking for two hours.",
			accept: [
				"When you {get|come} home, I'll have been cooking for two hours.",
			],
			traps: { have: HAVE, been: BEEN, cooking: ['cooks', 'cook'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-58',
			form: 'affirmative',
			prompt: 'До вечора дощ ітиме вже дванадцять годин.',
			answer: 'By evening it will have been raining for twelve hours.',
			accept: ['By {the|} evening it will have been raining for twelve hours.'],
			traps: { have: HAVE, been: BEEN, raining: ['rained', 'rain'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-59',
			form: 'affirmative',
			prompt:
				'Коли він вийде на пенсію, він працюватиме лікарем уже сорок років.',
			answer:
				"When he retires, he'll have been working as a doctor for forty years.",
			accept: [
				"{When|By the time} he retires, he'll have been working as a doctor for forty years.",
			],
			traps: { have: HAVE, been: BEEN, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-60',
			form: 'affirmative',
			prompt: "До п'ятниці Тарас працюватиме над цим проєктом уже місяць.",
			answer:
				'By Friday Taras will have been working on this project for a month.',
			traps: { have: HAVE, been: BEEN, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-61',
			form: 'affirmative',
			prompt: 'О десятій я вестиму машину вже шість годин.',
			answer: "At ten I'll have been driving for six hours.",
			accept: ["{At|By} ten {o'clock|} I'll have been driving for six hours."],
			traps: { have: HAVE, been: BEEN, driving: ['drove', 'drive'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-62',
			form: 'affirmative',
			prompt: 'У травні Ніна бігатиме марафони вже десять років.',
			answer: 'In May Nina will have been running marathons for ten years.',
			traps: { have: HAVE, been: BEEN, running: ['run', 'ran'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-63',
			form: 'affirmative',
			prompt: 'Коли літак приземлиться, ми летітимемо вже дванадцять годин.',
			answer: "When the plane lands, we'll have been flying for twelve hours.",
			accept: [
				"{When|By the time} the plane lands, we'll have been flying for twelve hours.",
			],
			traps: { have: HAVE, been: BEEN, flying: ['flew', 'fly'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-64',
			form: 'affirmative',
			prompt: 'До кінця місяця вона писатиме цю книжку вже два роки.',
			answer:
				"By the end of the month she'll have been writing this book for two years.",
			traps: { have: HAVE, been: BEEN, writing: ['wrote', 'write'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-65',
			form: 'affirmative',
			prompt: "Опівночі ми танцюватимемо вже п'ять годин.",
			answer: "At midnight we'll have been dancing for five hours.",
			accept: ["{At|By} midnight we'll have been dancing for five hours."],
			traps: { have: HAVE, been: BEEN, dancing: ['danced', 'dance'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-66',
			form: 'affirmative',
			prompt: 'До того часу, як ти прийдеш, я читатиму вже годину.',
			answer: "By the time you come, I'll have been reading for an hour.",
			accept: [
				"By the time you {come|arrive|get here}, I'll have been reading for an hour.",
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-67',
			form: 'affirmative',
			prompt: 'До весни Роман шукатиме роботу вже пів року.',
			answer:
				'By spring Roman will have been looking for a job for six months.',
			accept: [
				'By {the|} spring Roman will have been looking for a job for {six months|half a year}.',
			],
			traps: { have: HAVE, been: BEEN, looking: ['looked', 'look'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-68',
			form: 'affirmative',
			prompt: 'Наступного тижня я ходитиму в спортзал уже рік.',
			answer: "Next week I'll have been going to the gym for a year.",
			traps: { have: HAVE, been: BEEN, going: ['went', 'go'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-69',
			form: 'affirmative',
			prompt: 'Опівдні мій брат спатиме вже дванадцять годин.',
			answer: 'At noon my brother will have been sleeping for twelve hours.',
			accept: [
				'{At|By} {noon|midday} my brother will have been sleeping for twelve hours.',
			],
			traps: { have: HAVE, been: BEEN, sleeping: ['slept', 'sleep'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-70',
			form: 'affirmative',
			prompt: "О п'ятій Іван фарбуватиме паркан уже шість годин.",
			answer: 'At five Ivan will have been painting the fence for six hours.',
			accept: [
				"{At|By} five {o'clock|} Ivan will have been painting the fence for six hours.",
			],
			traps: { have: HAVE, been: BEEN, painting: ['painted', 'paint'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-71',
			form: 'affirmative',
			prompt: 'У вересні я житиму в Польщі вже два роки.',
			answer: "In September I'll have been living in Poland for two years.",
			traps: { have: HAVE, been: BEEN, living: ['lived', 'live'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-72',
			form: 'affirmative',
			prompt:
				'Коли вона закінчить університет, вона вивчатиме медицину вже шість років.',
			answer:
				"When she graduates, she'll have been studying medicine for six years.",
			accept: [
				"{When|By the time} she {graduates|finishes university}, she'll have been studying medicine for six years.",
			],
			traps: { have: HAVE, been: BEEN, studying: ['studied', 'study'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-73',
			form: 'affirmative',
			prompt: 'До ранку сніг ітиме вже десять годин.',
			answer: 'By morning it will have been snowing for ten hours.',
			accept: ['By {the|} morning it will have been snowing for ten hours.'],
			traps: { have: HAVE, been: BEEN, snowing: ['snowed', 'snow'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-74',
			form: 'affirmative',
			prompt: 'Коли ти прокинешся, я працюватиму в саду вже дві години.',
			answer:
				"When you wake up, I'll have been working in the garden for two hours.",
			traps: { have: HAVE, been: BEEN, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-75',
			form: 'affirmative',
			prompt:
				'Наступного місяця Тарас керуватиме цією компанією вже десять років.',
			answer:
				'Next month Taras will have been running this company for ten years.',
			accept: [
				'Next month Taras will have been {running|managing} this company for ten years.',
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-76',
			form: 'affirmative',
			prompt: 'До Різдва я відкладатиму гроші вже рік.',
			answer: "By Christmas I'll have been saving money for a year.",
			traps: { have: HAVE, been: BEEN, saving: ['saved', 'save'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-77',
			form: 'affirmative',
			prompt: 'Коли приїде таксі, ми чекатимемо вже сорок хвилин.',
			answer:
				"When the taxi arrives, we'll have been waiting for forty minutes.",
			accept: [
				"{When|By the time} the taxi {arrives|comes}, we'll have been waiting for forty minutes.",
			],
			traps: { have: HAVE, been: BEEN, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-78',
			form: 'question',
			prompt: 'До червня ти працюватимеш тут уже десять років?',
			answer: 'Will you have been working here for ten years by June?',
			accept: ['By June will you have been working here for ten years?'],
			traps: { have: HAVE, been: BEEN, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-79',
			form: 'question',
			prompt:
				'Скільки часу ти вже працюватимеш над цією книжкою до кінця року?',
			answer:
				'How long will you have been working on this book by the end of the year?',
			traps: { have: HAVE, been: BEEN, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-80',
			form: 'question',
			prompt:
				'Скільки років вона вже викладатиме в цій школі, коли вийде на пенсію?',
			answer:
				'How many years will she have been teaching at this school when she retires?',
			accept: [
				'How many years will she have been teaching at this school {when|by the time} she retires?',
			],
			traps: { have: HAVE, been: BEEN, teaching: ['teaches', 'teach'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-81',
			form: 'question',
			prompt: 'Опівночі вони гратимуть уже шість годин?',
			answer: 'Will they have been playing for six hours by midnight?',
			accept: [
				'Will they have been playing for six hours {by|at} midnight?',
				'{By|At} midnight will they have been playing for six hours?',
			],
			traps: { have: HAVE, been: BEEN, playing: ['played', 'play'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-82',
			form: 'question',
			prompt: 'Як довго Анна вже чекатиме, коли ми приїдемо?',
			answer: 'How long will Anna have been waiting when we arrive?',
			accept: [
				'How long will Anna have been waiting {when|by the time} we {arrive|get there}?',
			],
			traps: { have: HAVE, been: BEEN, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-83',
			form: 'question',
			prompt: 'Скільки місяців ти вже шукатимеш роботу до весни?',
			answer: 'How many months will you have been looking for a job by spring?',
			accept: [
				'How many months will you have been looking for a job by {the|} spring?',
			],
			traps: { have: HAVE, been: BEEN, looking: ['looked', 'look'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-84',
			form: 'question',
			prompt: 'До Різдва ти відкладатимеш гроші вже пів року?',
			answer: 'Will you have been saving money for six months by Christmas?',
			accept: [
				'Will you have been saving money for {six months|half a year} by Christmas?',
				'By Christmas will you have been saving money for {six months|half a year}?',
			],
			traps: { have: HAVE, been: BEEN, saving: ['saved', 'save'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-85',
			form: 'question',
			prompt: 'Ти готуватимеш уже три години, коли прийдуть гості?',
			answer:
				'Will you have been cooking for three hours when the guests arrive?',
			accept: [
				'Will you have been cooking for three hours {when|by the time} the guests {arrive|come}?',
			],
			traps: { have: HAVE, been: BEEN, cooking: ['cooks', 'cook'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-86',
			form: 'question',
			prompt: 'Скільки годин ти вже вестимеш машину, коли доїдеш до Львова?',
			answer: 'How many hours will you have been driving when you reach Lviv?',
			accept: [
				'How many hours will you have been driving {when|by the time} you {reach|get to} Lviv?',
			],
			traps: { have: HAVE, been: BEEN, driving: ['drove', 'drive'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-87',
			form: 'question',
			prompt: 'До вересня Ніна викладатиме в цій школі вже рік?',
			answer:
				'Will Nina have been teaching at this school for a year by September?',
			accept: [
				'By September will Nina have been teaching at this school for a year?',
			],
			traps: { have: HAVE, been: BEEN, teaching: ['teaches', 'teach'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-88',
			form: 'question',
			prompt: 'Як довго вже йтиме дощ до вечора?',
			answer: 'How long will it have been raining by evening?',
			accept: ['How long will it have been raining by {the|} evening?'],
			traps: { have: HAVE, been: BEEN, raining: ['rained', 'rain'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-89',
			form: 'question',
			prompt: 'Як довго ти вже житимеш у Польщі до кінця року?',
			answer:
				'How long will you have been living in Poland by the end of the year?',
			traps: { have: HAVE, been: BEEN, living: ['lived', 'live'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-90',
			form: 'question',
			prompt: 'Вона бігатиме вже годину, коли ти прокинешся?',
			answer: 'Will she have been running for an hour when you wake up?',
			accept: [
				'Will she have been {running|jogging} for an hour {when|by the time} you wake up?',
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-91',
			form: 'negative',
			prompt: 'У вересні ми ще й року тут не житимемо.',
			answer: "In September we won't have been living here for a year.",
			accept: ["{In|By} September we won't have been living here for a year."],
			traps: { have: HAVE, been: BEEN, living: ['lived', 'live'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-92',
			form: 'negative',
			prompt: 'До понеділка Анна ще й тижня тут не працюватиме.',
			answer: "By Monday Anna won't have been working here for a week.",
			traps: { have: HAVE, been: BEEN, working: ['worked', 'work'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-93',
			form: 'negative',
			prompt: 'Коли ти подзвониш, я вестиму машину не більше ніж годину.',
			answer: "When you call, I won't have been driving for more than an hour.",
			accept: [
				"{When|By the time} you {call|phone}, I won't have been driving for more than an hour.",
			],
			traps: { have: HAVE, been: BEEN, driving: ['drove', 'drive'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-94',
			form: 'negative',
			prompt: 'Коли ми приземлимося, ми летітимемо не більше ніж дві години.',
			answer:
				"When we land, we won't have been flying for more than two hours.",
			accept: [
				"{When|By the time} we land, we won't have been flying for more than two hours.",
			],
			traps: { have: HAVE, been: BEEN, flying: ['flew', 'fly'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-95',
			form: 'negative',
			prompt: 'До кінця місяця Роман ще й року не керуватиме командою.',
			answer:
				"By the end of the month Roman won't have been leading the team for a year.",
			accept: [
				"By the end of the month Roman won't have been {leading|managing|running} the team for a year.",
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-96',
			form: 'negative',
			prompt: 'Коли приїде таксі, ми чекатимемо не більше ніж десять хвилин.',
			answer:
				"When the taxi arrives, we won't have been waiting for more than ten minutes.",
			accept: [
				"{When|By the time} the taxi {arrives|comes}, we won't have been waiting for more than ten minutes.",
			],
			traps: { have: HAVE, been: BEEN, waiting: ['waited', 'wait'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-97',
			form: 'negative',
			prompt: 'Коли ти прокинешся, Анна бігатиме не більше ніж пів години.',
			answer:
				"When you wake up, Anna won't have been running for more than half an hour.",
			accept: [
				"{When|By the time} you wake up, Anna won't have been {running|jogging} for more than half an hour.",
			],
			traps: { have: HAVE, been: BEEN },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-98',
			form: 'negative',
			prompt:
				'Коли вона вийде на пенсію, вона ще й десяти років не викладатиме.',
			answer: "When she retires, she won't have been teaching for ten years.",
			accept: [
				"{When|By the time} she retires, she won't have been teaching for ten years.",
			],
			traps: { have: HAVE, been: BEEN, teaching: ['teaches', 'teach'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-99',
			form: 'negative',
			prompt: 'До літа я ще й пів року не житиму в Польщі.',
			answer: "By summer I won't have been living in Poland for six months.",
			accept: [
				"By {the|} summer I won't have been living in Poland for {six months|half a year}.",
			],
			traps: { have: HAVE, been: BEEN, living: ['lived', 'live'] },
		},
		{
			id: 'future-continuous-vs-future-perfect-continuous-100',
			form: 'negative',
			prompt: 'Коли ти прокинешся, дощ ітиме не більше ніж годину.',
			answer:
				"When you wake up, it won't have been raining for more than an hour.",
			traps: { have: HAVE, been: BEEN, raining: ['rained', 'rain'] },
		},
	],
})
