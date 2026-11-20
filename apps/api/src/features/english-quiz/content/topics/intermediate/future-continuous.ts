import { defineTopic } from '../../define-topic'

export const futureContinuous = defineTopic({
	id: 'future-continuous',
	level: 'intermediate',
	title: 'Future Continuous',
	subtitle: 'Майбутній тривалий час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Future Continuous (will be + -ing) — дія, яка буде в процесі в певний момент у майбутньому: завтра о десятій, завтра о цій порі, наступного тижня в цей час, коли ти прийдеш. Українське «буду працювати» може означати і простий факт (Future Simple), тому шукай момент, у який дія триватиме. Також так ввічливо питають про чужі плани: «Ти будеш користуватися…?». Після when/while у реченнях про майбутнє вживай Present Simple або Present Continuous, а не will. Дієслова стану (know, want, like) у Continuous не вживаються.',
			examples: [
				{
					text: "This time on Sunday I'll be climbing a mountain.",
					translation: 'У неділю о цій порі я підніматимусь на гору.',
				},
				{
					text: "When you land, I'll be standing at the gate.",
					translation: 'Коли ти приземлишся, я стоятиму біля виходу.',
				},
				{
					text: 'Will you be going past the bakery?',
					translation: 'Ти будеш проходити повз пекарню?',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Підмет + will be + дієслово з -ing для всіх осіб. Після займенника часто скорочують: I'll, she'll, we'll. Не пропускай be і не забувай -ing.",
			examples: [
				{
					text: 'At midnight the band will be playing on the main stage.',
					translation: 'Опівночі гурт гратиме на головній сцені.',
				},
				{
					text: "We'll be driving through France all day on Monday.",
					translation: 'У понеділок ми весь день їхатимемо Францією.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Will + підмет + be + дієслово з -ing. Питальне слово стоїть на початку: What will you be doing…?',
			examples: [
				{
					text: 'Will your sister be working at the shop on Saturday morning?',
					translation: 'Твоя сестра працюватиме в магазині в суботу вранці?',
				},
				{
					text: 'What will they be building here this time next year?',
					translation: 'Що вони будуватимуть тут наступного року в цей час?',
				},
			],
		},
		{
			kind: 'negative',
			explanation: "Підмет + won't (will not) + be + дієслово з -ing.",
			examples: [
				{
					text: "Don't worry, the baby won't be crying at midnight.",
					translation: 'Не хвилюйся, опівночі малюк не плакатиме.',
				},
				{
					text: "This time on Friday I won't be writing emails.",
					translation: "У п'ятницю о цій порі я не писатиму листів.",
				},
			],
		},
	],
	sentences: [
		{
			id: 'future-continuous-1',
			form: 'affirmative',
			prompt: 'Завтра о восьмій я працюватиму.',
			answer: "I'll be working at eight tomorrow.",
			accept: [
				"I'll be working at eight o'clock tomorrow.",
				"Tomorrow at {eight|eight o'clock} I'll be working.",
			],
			traps: {
				working: ['work', 'worked'],
			},
		},
		{
			id: 'future-continuous-2',
			form: 'question',
			prompt: 'Ти користуватимешся машиною?',
			answer: 'Will you be using the car?',
			accept: ['Will you use the car?'],
			traps: {
				using: ['used', 'uses'],
			},
		},
		{
			id: 'future-continuous-3',
			form: 'affirmative',
			prompt: 'Завтра о цій порі я летітиму до Лондона.',
			answer: "This time tomorrow I'll be flying to London.",
			accept: ["{This|At this} time tomorrow I'll be flying to London."],
			traps: {
				be: ['is', 'being'],
				flying: ['fly', 'flies'],
			},
		},
		{
			id: 'future-continuous-4',
			form: 'affirmative',
			prompt: 'Наступного тижня в цей час ми лежатимемо на пляжі.',
			answer: "This time next week we'll be lying on the beach.",
			accept: ["{This|At this} time next week we'll be lying on the beach."],
			traps: {
				be: ['are', 'been'],
				lying: ['lie', 'laying'],
			},
		},
		{
			id: 'future-continuous-5',
			form: 'affirmative',
			prompt: 'Коли ти прийдеш додому, я ще готуватиму вечерю.',
			answer: "When you get home, I'll still be cooking dinner.",
			accept: [
				"When you {get|come} home, I'll still be {cooking|making} dinner.",
			],
			traps: {
				get: ['will', 'got'],
				cooking: ['cook', 'cooks'],
			},
		},
		{
			id: 'future-continuous-6',
			form: 'affirmative',
			prompt: "Завтра о дев'ятій ранку вона ще спатиме.",
			answer: "At nine tomorrow morning she'll still be sleeping.",
			accept: [
				"At nine {o'clock|} tomorrow morning she'll still be {sleeping|asleep}.",
			],
			traps: {
				be: ['is', 'are'],
				sleeping: ['sleep', 'sleeps'],
			},
		},
		{
			id: 'future-continuous-7',
			form: 'affirmative',
			prompt: 'Том завтра весь день фарбуватиме паркан.',
			answer: 'Tom will be painting the fence all day tomorrow.',
			accept: ['Tom will {be painting|paint} the fence all day tomorrow.'],
			traps: {
				will: ['are', 'does'],
				painting: ['paints', 'painted'],
			},
		},
		{
			id: 'future-continuous-8',
			form: 'affirmative',
			prompt: 'Не дзвони мені о сьомій, бо я вечерятиму.',
			answer: "Don't call me at seven because I'll be having dinner.",
			accept: [
				"Don't {call|phone} me at seven {o'clock|} because I'll be {having|eating} dinner.",
			],
			traps: {
				be: ['am', 'is'],
				having: ['have', 'has'],
			},
		},
		{
			id: 'future-continuous-9',
			form: 'affirmative',
			prompt: 'Я чекатиму на тебе на вокзалі завтра о десятій.',
			answer: "I'll be waiting for you at the station at ten tomorrow.",
			accept: [
				"I'll be waiting for you at the station {at ten tomorrow|tomorrow at ten}.",
			],
			traps: {
				be: ['am', 'being'],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'future-continuous-10',
			form: 'affirmative',
			prompt: 'Коли ти повернешся, діти ще гратимуть у футбол.',
			answer:
				'When you come back, the children will still be playing football.',
			accept: [
				'When you {come back|get back|return}, the {children|kids} will still be playing football.',
			],
			traps: {
				come: ['will', 'came'],
				will: ['is', 'does'],
				playing: ['play', 'plays'],
			},
		},
		{
			id: 'future-continuous-11',
			form: 'affirmative',
			prompt: 'Завтра о цій порі Анна співатиме на сцені.',
			answer: 'This time tomorrow Anna will be singing on stage.',
			accept: [
				'{This|At this} time tomorrow Anna will be singing on {stage|the stage}.',
			],
			traps: {
				will: ['are', 'does'],
				singing: ['sing', 'sings'],
			},
		},
		{
			id: 'future-continuous-12',
			form: 'affirmative',
			prompt: 'Сьогодні о шостій вечора ми ще працюватимемо в офісі.',
			answer: "At six this evening we'll still be working in the office.",
			accept: [
				"At six {o'clock|} this evening we'll still be working {in|at} the office.",
			],
			traps: {
				be: ['are', 'is'],
				working: ['work', 'worked'],
			},
		},
		{
			id: 'future-continuous-13',
			form: 'affirmative',
			prompt: 'Завтра опівдні я ще прибиратиму квартиру.',
			answer: "At noon tomorrow I'll still be cleaning the flat.",
			accept: [
				"{At noon|At midday} tomorrow I'll still be cleaning the {flat|apartment}.",
			],
			traps: {
				be: ['am', 'being'],
				cleaning: ['clean', 'cleans'],
			},
		},
		{
			id: 'future-continuous-14',
			form: 'affirmative',
			prompt: 'Наступної суботи о цій порі він бігтиме марафон.',
			answer: "This time next Saturday he'll be running a marathon.",
			accept: [
				"{This|At this} time next Saturday he'll be running {a|the} marathon.",
			],
			traps: {
				be: ['is', 'are'],
				running: ['runs', 'ran'],
			},
		},
		{
			id: 'future-continuous-15',
			form: 'affirmative',
			prompt: 'Коли ти подзвониш, я якраз вигулюватиму собаку.',
			answer: "When you call, I'll be walking the dog.",
			accept: ["When you {call|phone|ring}, I'll be walking {the|my} dog."],
			traps: {
				call: ['will', 'called'],
				walking: ['walk', 'walks'],
			},
		},
		{
			id: 'future-continuous-16',
			form: 'affirmative',
			prompt: 'Завтра о цій порі я дивитимусь фінал по телевізору.',
			answer: "This time tomorrow I'll be watching the final on TV.",
			accept: [
				"{This|At this} time tomorrow I'll be watching the final on TV.",
			],
			traps: {
				be: ['am', 'is'],
				watching: ['watch', 'watched'],
			},
		},
		{
			id: 'future-continuous-17',
			form: 'affirmative',
			prompt: 'Через годину ми сидітимемо в парку.',
			answer: "In an hour we'll be sitting in the park.",
			traps: {
				be: ['are', 'is'],
				sitting: ['sit', 'sat'],
			},
		},
		{
			id: 'future-continuous-18',
			form: 'affirmative',
			prompt: "О п'ятій Марк ще гратиме в теніс.",
			answer: 'At five Mark will still be playing tennis.',
			accept: ["At five {o'clock|} Mark will still be playing tennis."],
			traps: {
				will: ['are', 'does'],
				playing: ['play', 'played'],
			},
		},
		{
			id: 'future-continuous-19',
			form: 'affirmative',
			prompt: 'Завтра о цій порі ми святкуватимемо день народження Емми.',
			answer: "This time tomorrow we'll be celebrating Emma's birthday.",
			accept: [
				"{This|At this} time tomorrow we'll be celebrating Emma's birthday.",
			],
			traps: {
				be: ['are', 'were'],
				celebrating: ['celebrate', 'celebrated'],
			},
		},
		{
			id: 'future-continuous-20',
			form: 'affirmative',
			prompt: 'Коли твій літак приземлиться, я чекатиму на тебе в аеропорту.',
			answer: "When your plane lands, I'll be waiting for you at the airport.",
			accept: [
				"When your plane lands, I'll {be waiting|wait} for you at the airport.",
			],
			traps: {
				lands: ['will', 'land', 'landing'],
				waiting: ['waits', 'waited'],
			},
		},
		{
			id: 'future-continuous-21',
			form: 'affirmative',
			prompt: 'Завтра о пів на восьму я ще снідатиму.',
			answer: "At half past seven tomorrow I'll still be having breakfast.",
			accept: [
				"At half past seven tomorrow I'll still be {having|eating} breakfast.",
			],
			traps: {
				be: ['am', 'been'],
				having: ['have', 'had'],
			},
		},
		{
			id: 'future-continuous-22',
			form: 'affirmative',
			prompt: 'Емма вчитиме нові слова весь вечір.',
			answer: 'Emma will be learning new words all evening.',
			accept: ['Emma will {be learning|learn} new words all evening.'],
			traps: {
				will: ['are', 'does'],
				learning: ['learns', 'learned'],
			},
		},
		{
			id: 'future-continuous-23',
			form: 'affirmative',
			prompt: 'Коли ти прийдеш, ми ще обідатимемо.',
			answer: "When you come, we'll still be having lunch.",
			accept: [
				"When you {come|arrive|get here}, we'll still be {having|eating} lunch.",
			],
			traps: {
				come: ['will', 'came'],
				having: ['have', 'has'],
			},
		},
		{
			id: 'future-continuous-24',
			form: 'affirmative',
			prompt: 'Наступного року в цей час я навчатимусь в університеті.',
			answer: "This time next year I'll be studying at university.",
			accept: [
				"{This|At this} time next year I'll be studying at {university|the university}.",
			],
			traps: {
				be: ['am', 'is'],
				studying: ['study', 'studied'],
			},
		},
		{
			id: 'future-continuous-25',
			form: 'affirmative',
			prompt: 'Наступного літа в цей час ми подорожуватимемо Італією.',
			answer: "This time next summer we'll be travelling around Italy.",
			accept: [
				"{This|At this} time next summer we'll be {travelling|traveling} {around|in} Italy.",
			],
			traps: {
				be: ['are', 'were'],
				travelling: ['travel', 'travels'],
			},
		},
		{
			id: 'future-continuous-26',
			form: 'affirmative',
			prompt: 'Не приходь о третій, бо я спатиму.',
			answer: "Don't come at three because I'll be sleeping.",
			accept: [
				"Don't come at three {o'clock|} because I'll be {sleeping|asleep}.",
			],
			traps: {
				be: ['am', 'is'],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'future-continuous-27',
			form: 'affirmative',
			prompt: 'Коли почнеться фільм, ми ще стоятимемо в черзі.',
			answer: "When the film starts, we'll still be standing in the queue.",
			accept: [
				"When the {film|movie} {starts|begins}, we'll still be standing in {line|the queue}.",
				"When the {film|movie} {starts|begins}, we'll still be queuing.",
			],
			traps: {
				starts: ['will', 'started'],
				standing: ['stand', 'stood'],
			},
		},
		{
			id: 'future-continuous-28',
			form: 'affirmative',
			prompt: 'Завтра о другій Макс ще ремонтуватиме машину.',
			answer: 'At two tomorrow Max will still be repairing the car.',
			accept: [
				"At two {o'clock|} tomorrow Max will still be {repairing|fixing} {the|his} car.",
			],
			traps: {
				will: ['are', 'does'],
				repairing: ['repair', 'repairs'],
			},
		},
		{
			id: 'future-continuous-29',
			form: 'affirmative',
			prompt: 'Коли ти закінчиш роботу, я чекатиму на тебе біля офісу.',
			answer:
				"When you finish work, I'll be waiting for you outside the office.",
			accept: [
				"When you finish work, I'll {be waiting|wait} for you outside the office.",
			],
			traps: {
				finish: ['will', 'finished'],
				waiting: ['waits', 'waited'],
			},
		},
		{
			id: 'future-continuous-30',
			form: 'affirmative',
			prompt: 'Сьогодні о десятій вечора я ще працюватиму над звітом.',
			answer: "At ten this evening I'll still be working on the report.",
			accept: [
				"At ten {o'clock|} {this evening|tonight} I'll still be working on {the|my} report.",
			],
			traps: {
				be: ['am', 'is'],
				working: ['work', 'works'],
			},
		},
		{
			id: 'future-continuous-31',
			form: 'affirmative',
			prompt: 'Завтра ми весь ранок прибиратимемо гараж.',
			answer: "We'll be cleaning the garage all morning tomorrow.",
			accept: [
				"We'll {be cleaning|clean} the garage all {morning tomorrow|tomorrow morning}.",
			],
			traps: {
				be: ['are', 'being'],
				cleaning: ['cleans', 'cleaned'],
			},
		},
		{
			id: 'future-continuous-32',
			form: 'affirmative',
			prompt: 'Завтра о цій порі Катя виступатиме на конференції.',
			answer: 'This time tomorrow Kate will be speaking at the conference.',
			accept: [
				'{This|At this} time tomorrow Kate will be speaking at {the|a} conference.',
			],
			traps: {
				will: ['are', 'does'],
				speaking: ['speak', 'speaks'],
			},
		},
		{
			id: 'future-continuous-33',
			form: 'affirmative',
			prompt: 'Поки ти будеш у магазині, я прибиратиму на кухні.',
			answer: "While you are at the shop, I'll be cleaning the kitchen.",
			accept: [
				"While {you are|you're} {at|in} the {shop|store}, I'll {be cleaning|clean} the kitchen.",
			],
			traps: {
				are: ['will', 'be'],
				cleaning: ['cleans', 'cleaned'],
			},
		},
		{
			id: 'future-continuous-34',
			form: 'affirmative',
			prompt: 'Поки діти спатимуть, ми дивитимемося фільм.',
			answer: "While the children are sleeping, we'll be watching a film.",
			accept: [
				"While the {children|kids} {are sleeping|are asleep|sleep}, we'll {be watching|watch} a {film|movie}.",
			],
			traps: {
				are: ['will', 'be'],
				watching: ['watches', 'watched'],
			},
		},
		{
			id: 'future-continuous-35',
			form: 'affirmative',
			prompt: 'Наступного тижня в цей час Анна житиме в Парижі.',
			answer: 'This time next week Anna will be living in Paris.',
			accept: ['{This|At this} time next week Anna will be living in Paris.'],
			traps: {
				will: ['are', 'does'],
				living: ['live', 'lives'],
			},
		},
		{
			id: 'future-continuous-36',
			form: 'affirmative',
			prompt: 'Коли ти повернешся з відпустки, я ще шукатиму нову роботу.',
			answer:
				"When you come back from holiday, I'll still be looking for a new job.",
			accept: [
				"When you {come back|get back|return} from {holiday|vacation|your holiday}, I'll still be looking for a new job.",
			],
			traps: {
				come: ['will', 'came'],
				looking: ['look', 'looks'],
			},
		},
		{
			id: 'future-continuous-37',
			form: 'affirmative',
			prompt: 'Завтра о першій Емма ще плаватиме в басейні.',
			answer: 'At one tomorrow Emma will still be swimming in the pool.',
			accept: [
				"At one {o'clock|} tomorrow Emma will still be swimming in the pool.",
			],
			traps: {
				will: ['are', 'does'],
				swimming: ['swim', 'swims'],
			},
		},
		{
			id: 'future-continuous-38',
			form: 'affirmative',
			prompt: "Сьогодні о дев'ятій вечора ми ще танцюватимемо на весіллі.",
			answer: "At nine this evening we'll still be dancing at the wedding.",
			accept: [
				"At nine {o'clock|} {this evening|tonight} we'll still be dancing at the wedding.",
			],
			traps: {
				be: ['are', 'were'],
				dancing: ['dance', 'danced'],
			},
		},
		{
			id: 'future-continuous-39',
			form: 'affirmative',
			prompt: 'Коли ми приїдемо в гори, там ще падатиме сніг.',
			answer: 'When we get to the mountains, it will still be snowing there.',
			accept: [
				"When we {get to|arrive in|reach} the mountains, {it will|it'll} still be snowing there.",
			],
			traps: {
				get: ['will', 'got'],
				snowing: ['snow', 'snows'],
			},
		},
		{
			id: 'future-continuous-40',
			form: 'affirmative',
			prompt: 'Коли ти вийдеш з дому, ще йтиме дощ.',
			answer: 'When you leave the house, it will still be raining.',
			accept: [
				"When you leave {home|the house}, {it will|it'll} still be raining.",
			],
			traps: {
				leave: ['will', 'left'],
				raining: ['rain', 'rains'],
			},
		},
		{
			id: 'future-continuous-41',
			form: 'affirmative',
			prompt: 'Завтра о цій порі ми садитимемо дерева в парку.',
			answer: "This time tomorrow we'll be planting trees in the park.",
			accept: [
				"{This|At this} time tomorrow we'll be planting trees in the park.",
			],
			traps: {
				be: ['are', 'is'],
				planting: ['plant', 'planted'],
			},
		},
		{
			id: 'future-continuous-42',
			form: 'affirmative',
			prompt: 'Коли закінчиться урок, батьки чекатимуть на дітей біля школи.',
			answer:
				'When the lesson ends, the parents will be waiting for the children outside the school.',
			accept: [
				'When the {lesson|class} {ends|finishes}, the parents will {be waiting|wait} for the {children|kids} outside the school.',
			],
			traps: {
				ends: ['will', 'ended'],
				waiting: ['waits', 'waited'],
			},
		},
		{
			id: 'future-continuous-43',
			form: 'affirmative',
			prompt: 'Завтра о восьмій ранку я ще пакуватимусь.',
			answer: "At eight tomorrow morning I'll still be packing.",
			accept: ["At eight {o'clock|} tomorrow morning I'll still be packing."],
			traps: {
				be: ['am', 'being'],
				packing: ['pack', 'packs'],
			},
		},
		{
			id: 'future-continuous-44',
			form: 'affirmative',
			prompt: 'Наступного тижня в цей час я засмагатиму в Греції.',
			answer: "This time next week I'll be sunbathing in Greece.",
			accept: ["{This|At this} time next week I'll be sunbathing in Greece."],
			traps: {
				be: ['am', 'is'],
				sunbathing: ['sunbathe', 'sunbathes'],
			},
		},
		{
			id: 'future-continuous-45',
			form: 'affirmative',
			prompt: 'Коли прийдуть гості, я ще одягатимусь.',
			answer: "When the guests arrive, I'll still be getting dressed.",
			accept: ["When the guests {arrive|come}, I'll still be getting dressed."],
			traps: {
				arrive: ['will', 'arrived'],
				getting: ['get', 'got'],
			},
		},
		{
			id: 'future-continuous-46',
			form: 'affirmative',
			prompt: 'Коли ти прочитаєш цей лист, я летітиму до Канади.',
			answer: "When you read this letter, I'll be flying to Canada.",
			traps: {
				read: ['will', 'reads'],
				flying: ['fly', 'flew'],
			},
		},
		{
			id: 'future-continuous-47',
			form: 'question',
			prompt: 'Що ти робитимеш завтра о цій порі?',
			answer: 'What will you be doing this time tomorrow?',
			accept: ['What will you be doing {this|at this} time tomorrow?'],
			traps: {
				will: ['is', 'does'],
				doing: ['do', 'did'],
			},
		},
		{
			id: 'future-continuous-48',
			form: 'question',
			prompt: 'Ти будеш користуватися машиною сьогодні ввечері?',
			answer: 'Will you be using the car tonight?',
			accept: [
				'{Will you be using|Will you use|Are you using|Are you going to use} the car {tonight|this evening}?',
			],
			traps: {
				Will: ['Does', 'Is'],
				using: ['uses', 'used'],
			},
		},
		{
			id: 'future-continuous-49',
			form: 'question',
			prompt: 'Ви будете проходити повз пошту дорогою додому?',
			answer: 'Will you be passing the post office on your way home?',
			accept: [
				'{Will you be passing|Will you pass|Are you passing} the post office on {your|the} way home?',
			],
			traps: {
				Will: ['Does', 'Is'],
				passing: ['passes', 'passed'],
			},
		},
		{
			id: 'future-continuous-50',
			form: 'question',
			prompt: 'Ти спатимеш, коли я повернуся?',
			answer: 'Will you be sleeping when I get back?',
			accept: [
				'Will you be {sleeping|asleep} when I {get back|come back|return}?',
			],
			traps: {
				Will: ['Is', 'Does'],
				sleeping: ['sleep', 'sleeps'],
				get: ['will', 'got'],
			},
		},
		{
			id: 'future-continuous-51',
			form: 'question',
			prompt: 'Він ще працюватиме, коли ми прийдемо?',
			answer: 'Will he still be working when we arrive?',
			accept: ['Will he still be working when we {arrive|come}?'],
			traps: {
				Will: ['Are', 'Do'],
				working: ['work', 'works'],
				arrive: ['will', 'arrived'],
			},
		},
		{
			id: 'future-continuous-52',
			form: 'question',
			prompt: 'Що робитимуть діти, поки ми будемо на зборах?',
			answer: 'What will the children be doing while we are at the meeting?',
			accept: [
				"What will the {children|kids} be doing while {we are|we're} {at|in} {the|a} meeting?",
			],
			traps: {
				are: ['will', 'be'],
				doing: ['do', 'does'],
			},
		},
		{
			id: 'future-continuous-53',
			form: 'question',
			prompt: 'Ти працюватимеш завтра о цій порі?',
			answer: 'Will you be working this time tomorrow?',
			accept: ['Will you be working {this|at this} time tomorrow?'],
			traps: {
				Will: ['Is', 'Does'],
				working: ['work', 'worked'],
			},
		},
		{
			id: 'future-continuous-54',
			form: 'question',
			prompt: 'Анна ще чекатиме на нас о сьомій?',
			answer: 'Will Anna still be waiting for us at seven?',
			traps: {
				Will: ['Are', 'Do'],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'future-continuous-55',
			form: 'question',
			prompt: 'Ти їстимеш, коли я подзвоню?',
			answer: 'Will you be eating when I call?',
			accept: ['Will you be eating when I {call|phone|ring}?'],
			traps: {
				Will: ['Is', 'Does'],
				eating: ['eat', 'ate'],
				call: ['will', 'called'],
			},
		},
		{
			id: 'future-continuous-56',
			form: 'question',
			prompt: 'Ви будете користуватися проєктором сьогодні після обіду?',
			answer: 'Will you be using the projector this afternoon?',
			accept: [
				'{Will you be using|Will you use|Are you using|Are you going to use} the projector this afternoon?',
			],
			traps: {
				Will: ['Does', 'Is'],
				using: ['uses', 'used'],
			},
		},
		{
			id: 'future-continuous-57',
			form: 'question',
			prompt: 'Діти ще гратимуть надворі, коли стемніє?',
			answer: 'Will the children still be playing outside when it gets dark?',
			accept: [
				'Will the {children|kids} still be playing outside when it gets dark?',
			],
			traps: {
				Will: ['Is', 'Does'],
				playing: ['play', 'played'],
				gets: ['will', 'got'],
			},
		},
		{
			id: 'future-continuous-58',
			form: 'question',
			prompt: 'Де ви житимете наступного року в цей час?',
			answer: 'Where will you be living this time next year?',
			accept: ['Where will you be living {this|at this} time next year?'],
			traps: {
				will: ['is', 'does'],
				living: ['live', 'lived'],
			},
		},
		{
			id: 'future-continuous-59',
			form: 'question',
			prompt: 'Ви виходитимете на наступній зупинці?',
			answer: 'Will you be getting off at the next stop?',
			accept: [
				'{Will you be getting|Are you getting|Will you get} off at the next stop?',
			],
			traps: {
				Will: ['Does', 'Is'],
				getting: ['gets', 'got'],
			},
		},
		{
			id: 'future-continuous-60',
			form: 'question',
			prompt: 'Ви зупинятиметеся в цьому готелі до неділі?',
			answer: 'Will you be staying at this hotel until Sunday?',
			accept: [
				'{Will you be staying|Are you staying|Will you stay} {at|in} this hotel until Sunday?',
			],
			traps: {
				Will: ['Does', 'Is'],
				staying: ['stays', 'stayed'],
			},
		},
		{
			id: 'future-continuous-61',
			form: 'question',
			prompt: "Вона ще спатиме завтра о дев'ятій ранку?",
			answer: 'Will she still be sleeping at nine tomorrow morning?',
			accept: [
				"Will she still be {sleeping|asleep} at nine {o'clock|} tomorrow morning?",
			],
			traps: {
				Will: ['Are', 'Do'],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'future-continuous-62',
			form: 'question',
			prompt: 'Емма ще готуватиме вечерю, коли ми повернемося?',
			answer: 'Will Emma still be cooking dinner when we get back?',
			accept: [
				'Will Emma still be {cooking|making} dinner when we {get back|come back|return}?',
			],
			traps: {
				Will: ['Are', 'Do'],
				cooking: ['cook', 'cooks'],
			},
		},
		{
			id: 'future-continuous-63',
			form: 'question',
			prompt: 'Хто вестиме машину, поки ти спатимеш?',
			answer: 'Who will be driving while you are sleeping?',
			accept: [
				"Who will {be driving|drive} while {you are sleeping|you're sleeping|you are asleep|you're asleep|you sleep}?",
			],
			traps: {
				driving: ['drives', 'drove'],
				are: ['will', 'be'],
			},
		},
		{
			id: 'future-continuous-64',
			form: 'question',
			prompt: 'Ти дивитимешся матч завтра о цій порі?',
			answer: 'Will you be watching the match this time tomorrow?',
			accept: ['Will you be watching the match {this|at this} time tomorrow?'],
			traps: {
				Will: ['Is', 'Does'],
				watching: ['watch', 'watches'],
			},
		},
		{
			id: 'future-continuous-65',
			form: 'question',
			prompt: 'Чому вони працюватимуть усю ніч?',
			answer: 'Why will they be working all night?',
			accept: ['Why will they {be working|work} all night?'],
			traps: {
				will: ['is', 'does'],
				working: ['works', 'worked'],
			},
		},
		{
			id: 'future-continuous-66',
			form: 'question',
			prompt: 'Вони ще танцюватимуть опівночі?',
			answer: 'Will they still be dancing at midnight?',
			traps: {
				Will: ['Is', 'Does'],
				dancing: ['dance', 'danced'],
			},
		},
		{
			id: 'future-continuous-67',
			form: 'question',
			prompt: 'Ти будеш одягати костюм на весілля?',
			answer: 'Will you be wearing a suit to the wedding?',
			accept: [
				'{Will you be wearing|Are you wearing|Will you wear} a suit {to|at} the wedding?',
			],
			traps: {
				Will: ['Does', 'Is'],
				wearing: ['wears', 'wore'],
			},
		},
		{
			id: 'future-continuous-68',
			form: 'question',
			prompt: 'О котрій ти виходитимеш з дому завтра?',
			answer: 'What time will you be leaving home tomorrow?',
			accept: [
				'{What time|When} {will you be leaving|are you leaving|will you leave} {home|the house} tomorrow?',
			],
			traps: {
				will: ['is', 'does'],
				leaving: ['leaves', 'left'],
			},
		},
		{
			id: 'future-continuous-69',
			form: 'question',
			prompt: 'Ми ще їстимемо, коли почнеться концерт?',
			answer: 'Will we still be eating when the concert starts?',
			accept: ['Will we still be eating when the concert {starts|begins}?'],
			traps: {
				Will: ['Is', 'Does'],
				eating: ['eat', 'eats'],
				starts: ['will', 'started'],
			},
		},
		{
			id: 'future-continuous-70',
			form: 'question',
			prompt: 'Ти будеш користуватися ноутбуком завтра вранці?',
			answer: 'Will you be using the laptop tomorrow morning?',
			accept: [
				'{Will you be using|Will you use|Are you using|Are you going to use} {the|your} laptop tomorrow morning?',
			],
			traps: {
				Will: ['Does', 'Is'],
				using: ['uses', 'used'],
			},
		},
		{
			id: 'future-continuous-71',
			form: 'question',
			prompt: 'Він ще працюватиме тут наступного року?',
			answer: 'Will he still be working here next year?',
			accept: ['Will he still {be working|work} here next year?'],
			traps: {
				Will: ['Are', 'Do'],
				working: ['works', 'worked'],
			},
		},
		{
			id: 'future-continuous-72',
			form: 'question',
			prompt: 'Вона ще говоритиме по телефону, коли ми прийдемо?',
			answer: 'Will she still be talking on the phone when we arrive?',
			accept: [
				'Will she still be {talking|speaking} on the phone when we {arrive|come}?',
			],
			traps: {
				Will: ['Are', 'Do'],
				talking: ['talk', 'talks'],
			},
		},
		{
			id: 'future-continuous-73',
			form: 'question',
			prompt: 'Ти лежатимеш на пляжі наступного тижня в цей час?',
			answer: 'Will you be lying on the beach this time next week?',
			accept: ['Will you be lying on the beach {this|at this} time next week?'],
			traps: {
				Will: ['Is', 'Does'],
				lying: ['lie', 'laying'],
			},
		},
		{
			id: 'future-continuous-74',
			form: 'question',
			prompt: "Кого ви чекатимете на вокзалі о п'ятій?",
			answer: 'Who will you be waiting for at the station at five?',
			traps: {
				will: ['is', 'does'],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'future-continuous-75',
			form: 'question',
			prompt: 'Твої друзі ще святкуватимуть, коли ти повернешся?',
			answer: 'Will your friends still be celebrating when you get back?',
			accept: [
				'Will your friends still be celebrating when you {get back|come back|return}?',
			],
			traps: {
				Will: ['Is', 'Does'],
				celebrating: ['celebrate', 'celebrated'],
			},
		},
		{
			id: 'future-continuous-76',
			form: 'negative',
			prompt: 'Завтра о цій порі я не працюватиму.',
			answer: "This time tomorrow I won't be working.",
			accept: ["{This|At this} time tomorrow I won't be working."],
			traps: {
				"won't": ["doesn't", "isn't"],
				working: ['work', 'works'],
			},
		},
		{
			id: 'future-continuous-77',
			form: 'negative',
			prompt: 'Не хвилюйся, о восьмій я не спатиму.',
			answer: "Don't worry, I won't be sleeping at eight.",
			accept: ["Don't worry, I won't be {sleeping|asleep} at eight."],
			traps: {
				"won't": ["doesn't", "isn't"],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'future-continuous-78',
			form: 'negative',
			prompt:
				'Ми не користуватимемося машиною сьогодні ввечері, тож ти можеш її взяти.',
			answer: "We won't be using the car tonight, so you can take it.",
			accept: [
				"We {won't be using|won't use|aren't using|aren't going to use} the car {tonight|this evening}, so you can take it.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				using: ['uses', 'used'],
			},
		},
		{
			id: 'future-continuous-79',
			form: 'negative',
			prompt: 'Коли ти прийдеш, Том не спатиме.',
			answer: "When you come, Tom won't be sleeping.",
			accept: [
				"When you {come|arrive|get here}, Tom won't be {sleeping|asleep}.",
			],
			traps: {
				come: ['will', 'came'],
				"won't": ["don't", "aren't"],
			},
		},
		{
			id: 'future-continuous-80',
			form: 'negative',
			prompt: 'Наступного тижня в цей час ми не працюватимемо.',
			answer: "This time next week we won't be working.",
			accept: ["{This|At this} time next week we won't be working."],
			traps: {
				"won't": ["doesn't", "isn't"],
				working: ['work', 'worked'],
			},
		},
		{
			id: 'future-continuous-81',
			form: 'negative',
			prompt: "Анна не чекатиме на нас на вокзалі о п'ятій.",
			answer: "Anna won't be waiting for us at the station at five.",
			traps: {
				"won't": ["don't", "aren't"],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'future-continuous-82',
			form: 'negative',
			prompt: 'Сьогодні о десятій вечора діти не дивитимуться телевізор.',
			answer: "At ten this evening the children won't be watching TV.",
			accept: [
				"At ten {o'clock|} {this evening|tonight} the {children|kids} won't be watching TV.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				watching: ['watch', 'watched'],
			},
		},
		{
			id: 'future-continuous-83',
			form: 'negative',
			prompt: 'Я не користуватимусь принтером сьогодні після обіду.',
			answer: "I won't be using the printer this afternoon.",
			accept: [
				"{I won't be using|I won't use|I'm not using|I'm not going to use} the printer this afternoon.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				using: ['uses', 'used'],
			},
		},
		{
			id: 'future-continuous-84',
			form: 'negative',
			prompt: 'Завтра о цій порі Емма не сидітиме вдома.',
			answer: "This time tomorrow Emma won't be sitting at home.",
			accept: ["{This|At this} time tomorrow Emma won't be sitting at home."],
			traps: {
				"won't": ["don't", "aren't"],
				sitting: ['sit', 'sat'],
			},
		},
		{
			id: 'future-continuous-85',
			form: 'negative',
			prompt: 'Завтра вранці не йтиме дощ.',
			answer: "It won't be raining tomorrow morning.",
			accept: ["It {won't be raining|won't rain} tomorrow morning."],
			traps: {
				"won't": ["don't", "aren't"],
				raining: ['rains', 'rained'],
			},
		},
		{
			id: 'future-continuous-86',
			form: 'negative',
			prompt: 'Я не спатиму, коли ти повернешся, тож подзвони мені.',
			answer: "I won't be sleeping when you get back, so call me.",
			accept: [
				"I won't be {sleeping|asleep} when you {get back|come back|return}, so {call|phone} me.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				get: ['will', 'got'],
			},
		},
		{
			id: 'future-continuous-87',
			form: 'negative',
			prompt: 'Наступного року в цей час ми не житимемо в цьому місті.',
			answer: "This time next year we won't be living in this city.",
			accept: [
				"{This|At this} time next year we won't be living in this {city|town}.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				living: ['live', 'lives'],
			},
		},
		{
			id: 'future-continuous-88',
			form: 'negative',
			prompt: 'Завтра о другій Макс не обідатиме з нами.',
			answer: "Max won't be having lunch with us at two tomorrow.",
			accept: [
				"Max won't {be having|have|be eating|eat} lunch with us {at two tomorrow|tomorrow at two}.",
			],
			traps: {
				"won't": ["don't", "aren't"],
				having: ['has', 'had'],
			},
		},
		{
			id: 'future-continuous-89',
			form: 'negative',
			prompt: 'Коли ти подзвониш, я не вестиму машину.',
			answer: "When you call, I won't be driving.",
			accept: ["When you {call|phone|ring}, I won't be driving."],
			traps: {
				call: ['will', 'called'],
				driving: ['drive', 'drove'],
			},
		},
		{
			id: 'future-continuous-90',
			form: 'negative',
			prompt: 'Поки ти будеш у відпустці, я не працюватиму над проєктом.',
			answer: "While you are on holiday, I won't be working on the project.",
			accept: [
				"While {you are|you're} on {holiday|vacation}, I {won't be working|won't work} on the project.",
			],
			traps: {
				are: ['will', 'be'],
				working: ['works', 'worked'],
			},
		},
		{
			id: 'future-continuous-91',
			form: 'negative',
			prompt: 'Завтра о восьмій вечора ми не вечерятимемо вдома.',
			answer: "At eight tomorrow evening we won't be having dinner at home.",
			accept: [
				"At eight {o'clock|} tomorrow evening we {won't be having|won't have|won't be eating|won't eat} dinner at home.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				having: ['has', 'had'],
			},
		},
		{
			id: 'future-continuous-92',
			form: 'negative',
			prompt: 'Наступного понеділка о цій порі я не сидітиму в офісі.',
			answer: "This time next Monday I won't be sitting in the office.",
			accept: [
				"{This|At this} time next Monday I won't be sitting in the office.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				sitting: ['sit', 'sits'],
			},
		},
		{
			id: 'future-continuous-93',
			form: 'negative',
			prompt: 'Вони не чекатимуть на нас, коли ми приїдемо.',
			answer: "They won't be waiting for us when we arrive.",
			accept: ["They won't be waiting for us when we {arrive|get there}."],
			traps: {
				"won't": ["doesn't", "isn't"],
				arrive: ['will', 'arrived'],
			},
		},
		{
			id: 'future-continuous-94',
			form: 'negative',
			prompt: 'Завтра о цій порі Емма не виступатиме на сцені.',
			answer: "This time tomorrow Emma won't be performing on stage.",
			accept: [
				"{This|At this} time tomorrow Emma won't be performing on {stage|the stage}.",
			],
			traps: {
				"won't": ["don't", "aren't"],
				performing: ['perform', 'performs'],
			},
		},
		{
			id: 'future-continuous-95',
			form: 'negative',
			prompt: 'Я не користуватимусь телефоном під час іспиту.',
			answer: "I won't be using my phone during the exam.",
			accept: ["I {won't be using|won't use} {my|the} phone during the exam."],
			traps: {
				"won't": ["doesn't", "isn't"],
				using: ['uses', 'used'],
			},
		},
		{
			id: 'future-continuous-96',
			form: 'negative',
			prompt: 'Сьогодні о шостій вечора ми не тренуватимемося.',
			answer: "At six this evening we won't be training.",
			accept: [
				"At six {o'clock|} {this evening|tonight} we {won't be training|won't train}.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				training: ['trains', 'trained'],
			},
		},
		{
			id: 'future-continuous-97',
			form: 'negative',
			prompt: 'Наступного тижня в цей час Марк не лежатиме на пляжі.',
			answer: "This time next week Mark won't be lying on the beach.",
			accept: [
				"{This|At this} time next week Mark won't be lying on the beach.",
			],
			traps: {
				"won't": ["don't", "aren't"],
				lying: ['lie', 'laying'],
			},
		},
		{
			id: 'future-continuous-98',
			form: 'negative',
			prompt: 'Коли ти приїдеш до Львова, там не падатиме сніг.',
			answer: "When you get to Lviv, it won't be snowing there.",
			accept: [
				"When you {get to|arrive in} Lviv, it {won't be snowing|won't snow} there.",
			],
			traps: {
				get: ['will', 'got'],
				snowing: ['snows', 'snowed'],
			},
		},
		{
			id: 'future-continuous-99',
			form: 'negative',
			prompt: 'Наступної суботи о цій порі вони не гратимуть у футбол.',
			answer: "This time next Saturday they won't be playing football.",
			accept: [
				"{This|At this} time next Saturday they won't be playing football.",
			],
			traps: {
				"won't": ["doesn't", "isn't"],
				playing: ['play', 'plays'],
			},
		},
		{
			id: 'future-continuous-100',
			form: 'negative',
			prompt: 'Поки ти спатимеш, ми не дивитимемося телевізор.',
			answer: "While you are sleeping, we won't be watching TV.",
			accept: [
				"While {you are sleeping|you're sleeping|you are asleep|you're asleep|you sleep}, we {won't be watching|won't watch} TV.",
			],
			traps: {
				are: ['will', 'be'],
				watching: ['watches', 'watched'],
			},
		},
	],
})
