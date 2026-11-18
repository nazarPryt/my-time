import { defineTopic } from '../../define-topic'

export const pastContinuous = defineTopic({
	id: 'past-continuous',
	level: 'intermediate',
	title: 'Past Continuous',
	subtitle: 'Минулий тривалий час',
	rule: [
		{
			kind: 'usage',
			explanation:
				"Past Continuous — дія, що тривала в певний момент у минулому: о сьомій, учора о цій порі, весь вечір. Часто її перериває коротка дія в Past Simple: when + Past Simple. Дві тривалі дії водночас з'єднує while. Дієслова стану (know, like, want) у Continuous не вживаються.",
			examples: [
				{
					text: 'I was cleaning the kitchen when the doorbell rang.',
					translation: 'Я прибирав на кухні, коли задзвонив дзвінок у двері.',
				},
				{
					text: "At nine o'clock we were sitting in a café.",
					translation: "О дев'ятій ми сиділи в кафе.",
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				'I/he/she/it + was + дієслово з -ing; you/we/they + were + дієслово з -ing.',
			examples: [
				{
					text: 'She was painting the fence.',
					translation: 'Вона фарбувала паркан.',
				},
				{
					text: 'They were fishing on the lake.',
					translation: 'Вони рибалили на озері.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Was/Were + підмет + дієслово з -ing. Питальне слово стоїть на початку.',
			examples: [
				{
					text: 'Was he repairing his bike?',
					translation: 'Він ремонтував свій велосипед?',
				},
				{
					text: 'What were they building at noon?',
					translation: 'Що вони будували опівдні?',
				},
			],
		},
		{
			kind: 'negative',
			explanation: "wasn't/weren't (was not / were not) + дієслово з -ing.",
			examples: [
				{
					text: "I wasn't paying attention.",
					translation: 'Я не звертав уваги.',
				},
				{
					text: "We weren't swimming when the storm started.",
					translation: 'Ми не плавали, коли почалася буря.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'past-continuous-1',
			form: 'affirmative',
			prompt: 'О десятій я спав.',
			answer: 'I was sleeping at ten.',
			traps: {
				was: ['were', 'am', 'is'],
			},
		},
		{
			id: 'past-continuous-2',
			form: 'question',
			prompt: 'Що ви робили вчора ввечері?',
			answer: 'What were you doing last night?',
			traps: {
				were: ['was', 'did', 'are'],
			},
		},
		{
			id: 'past-continuous-3',
			form: 'affirmative',
			prompt: 'Коли задзвонив телефон, я приймав душ.',
			answer: 'When the phone rang, I was taking a shower.',
			accept: ['When the phone rang, I was {taking|having} a shower.'],
			traps: {
				was: ['were', 'is', 'did'],
				taking: ['took', 'take'],
			},
		},
		{
			id: 'past-continuous-4',
			form: 'affirmative',
			prompt: 'Вона готувала вечерю, коли я прийшов додому.',
			answer: 'She was cooking dinner when I came home.',
			accept: ['She was {cooking|making} dinner when I {came|got} home.'],
			traps: {
				was: ['were', 'is', 'did'],
				cooking: ['cooked', 'cooks'],
			},
		},
		{
			id: 'past-continuous-5',
			form: 'affirmative',
			prompt: 'О восьмій ранку ми снідали.',
			answer: 'At eight in the morning we were having breakfast.',
			accept: [
				"At eight {o'clock|} in the morning we were {having|eating} breakfast.",
			],
			traps: {
				were: ['was', 'are', 'did'],
				having: ['had', 'have'],
			},
		},
		{
			id: 'past-continuous-6',
			form: 'affirmative',
			prompt: 'Коли я прокинувся, мій брат ще спав.',
			answer: 'When I woke up, my brother was still sleeping.',
			accept: ['When I {woke up,|woke,} my brother was still sleeping.'],
			traps: {
				was: ['were', 'is', 'did'],
				sleeping: ['slept', 'sleeps'],
			},
		},
		{
			id: 'past-continuous-7',
			form: 'affirmative',
			prompt: 'Учора о цій порі я летів до Риму.',
			answer: 'This time yesterday I was flying to Rome.',
			accept: ['{This|At this} time yesterday I was flying to Rome.'],
			traps: {
				was: ['were', 'am', 'did'],
				flying: ['flew', 'fly'],
			},
		},
		{
			id: 'past-continuous-8',
			form: 'affirmative',
			prompt: 'Ми гуляли в парку, коли почався дощ.',
			answer: 'We were walking in the park when it started raining.',
			accept: [
				'We were walking in the park when it {started|began} {raining|to rain}.',
			],
			traps: {
				were: ['was', 'are', 'did'],
				walking: ['walked', 'walk'],
			},
		},
		{
			id: 'past-continuous-9',
			form: 'affirmative',
			prompt: 'Поки я мив посуд, Анна готувала.',
			answer: 'While I was washing the dishes, Anna was cooking.',
			accept: [
				'While I {was washing|was doing|washed|did} the dishes, Anna was cooking.',
			],
			traps: {
				was: ['were', 'is'],
				cooking: ['cooked', 'cooks'],
			},
		},
		{
			id: 'past-continuous-10',
			form: 'affirmative',
			prompt: 'Коли ти подзвонив, я дивився фільм.',
			answer: 'When you called, I was watching a film.',
			accept: ['When you {called|phoned}, I was watching a {film|movie}.'],
			traps: {
				was: ['were', 'am', 'did'],
				watching: ['watched', 'watch'],
			},
		},
		{
			id: 'past-continuous-11',
			form: 'affirmative',
			prompt: 'О пів на восьму вони ще працювали.',
			answer: 'At half past seven they were still working.',
			accept: ['At {half past seven|seven thirty} they were still working.'],
			traps: {
				were: ['was', 'are', 'did'],
				working: ['worked', 'work'],
			},
		},
		{
			id: 'past-continuous-12',
			form: 'affirmative',
			prompt: 'Він їхав на роботу, коли зламалася його машина.',
			answer: 'He was driving to work when his car broke down.',
			accept: ['He was {driving|going} to work when his car broke down.'],
			traps: {
				was: ['were', 'is', 'did'],
				driving: ['drove', 'drives'],
			},
		},
		{
			id: 'past-continuous-13',
			form: 'affirmative',
			prompt: 'Коли я повернувся, мої сини гралися надворі.',
			answer: 'When I got back, my sons were playing outside.',
			accept: [
				'When I {got back|came back|returned}, my sons were playing outside.',
			],
			traps: {
				were: ['was', 'are', 'did'],
				playing: ['played', 'play'],
			},
		},
		{
			id: 'past-continuous-14',
			form: 'affirmative',
			prompt: 'Я чекав на автобус, коли побачив Івана.',
			answer: 'I was waiting for the bus when I saw Ivan.',
			accept: ['I was waiting for {the|a} bus when I saw Ivan.'],
			traps: {
				was: ['were', 'am', 'did'],
				waiting: ['waited', 'wait'],
			},
		},
		{
			id: 'past-continuous-15',
			form: 'affirmative',
			prompt: 'Коли ми приїхали, гості вже танцювали.',
			answer: 'When we arrived, the guests were already dancing.',
			traps: {
				were: ['was', 'are', 'did'],
				dancing: ['danced', 'dance'],
			},
		},
		{
			id: 'past-continuous-16',
			form: 'affirmative',
			prompt: 'О десятій вечора я читав книжку.',
			answer: 'At ten in the evening I was reading a book.',
			accept: ["At ten {o'clock|} in the evening I was reading a book."],
			traps: {
				was: ['were', 'am', 'did'],
				reading: ['read', 'reads'],
			},
		},
		{
			id: 'past-continuous-17',
			form: 'affirmative',
			prompt: 'Коли я зайшов до кімнати, усі сміялися.',
			answer: 'When I walked into the room, everyone was laughing.',
			accept: [
				'When I {walked into|came into|entered} the room, {everyone|everybody} was laughing.',
			],
			traps: {
				was: ['were', 'are', 'did'],
				laughing: ['laughed', 'laugh'],
			},
		},
		{
			id: 'past-continuous-18',
			form: 'affirmative',
			prompt: 'Коли ми вийшли з дому, світило сонце.',
			answer: 'When we left the house, the sun was shining.',
			accept: ['When we left {the house|home}, the sun was shining.'],
			traps: {
				was: ['were', 'is', 'did'],
				shining: ['shone', 'shines'],
			},
		},
		{
			id: 'past-continuous-19',
			form: 'affirmative',
			prompt: 'Коли я подзвонив Кейт, вона вела машину.',
			answer: 'When I called Kate, she was driving.',
			accept: ['When I {called|phoned} Kate, she was driving.'],
			traps: {
				was: ['were', 'is', 'did'],
				driving: ['drove', 'drives'],
			},
		},
		{
			id: 'past-continuous-20',
			form: 'affirmative',
			prompt: 'Ми розмовляли, коли вчитель зайшов у клас.',
			answer: 'We were talking when the teacher came into the classroom.',
			accept: [
				'We were talking when the teacher {came into|walked into|entered} the classroom.',
			],
			traps: {
				were: ['was', 'are', 'did'],
				talking: ['talked', 'talk'],
			},
		},
		{
			id: 'past-continuous-21',
			form: 'affirmative',
			prompt: 'Поки вона спала, ми готували сюрприз.',
			answer: 'While she was sleeping, we were preparing a surprise.',
			accept: ['While she {was sleeping|slept}, we were preparing a surprise.'],
			traps: {
				were: ['was', 'are'],
				preparing: ['prepared', 'prepare'],
			},
		},
		{
			id: 'past-continuous-22',
			form: 'affirmative',
			prompt: 'Опівночі мої сестри ще слухали музику.',
			answer: 'At midnight my sisters were still listening to music.',
			traps: {
				were: ['was', 'are', 'did'],
				listening: ['listened', 'listen'],
			},
		},
		{
			id: 'past-continuous-23',
			form: 'affirmative',
			prompt: 'Я біг на станцію, коли впав.',
			answer: 'I was running to the station when I fell.',
			traps: {
				was: ['were', 'am', 'did'],
				running: ['ran', 'run', 'runing'],
			},
		},
		{
			id: 'past-continuous-24',
			form: 'affirmative',
			prompt: 'Він стояв біля вікна, коли я його побачив.',
			answer: 'He was standing by the window when I saw him.',
			accept: ['He was standing {by|at|near} the window when I saw him.'],
			traps: {
				was: ['were', 'is', 'did'],
				standing: ['stood', 'stands'],
			},
		},
		{
			id: 'past-continuous-25',
			form: 'affirmative',
			prompt: 'Вони сварилися, коли я відчинив двері.',
			answer: 'They were arguing when I opened the door.',
			traps: {
				were: ['was', 'are', 'did'],
				arguing: ['argued', 'argue'],
			},
		},
		{
			id: 'past-continuous-26',
			form: 'affirmative',
			prompt: 'О шостій ранку йшов сніг.',
			answer: 'At six in the morning it was snowing.',
			accept: ["At six {o'clock|} in the morning it was snowing."],
			traps: {
				was: ['were', 'is', 'did'],
				snowing: ['snowed', 'snows'],
			},
		},
		{
			id: 'past-continuous-27',
			form: 'affirmative',
			prompt: 'Коли я виглянув у вікно, ішов дощ.',
			answer: 'When I looked out of the window, it was raining.',
			accept: ['When I looked out {of|} the window, it was raining.'],
			traps: {
				was: ['were', 'is', 'did'],
				raining: ['rained', 'rains'],
			},
		},
		{
			id: 'past-continuous-28',
			form: 'affirmative',
			prompt: 'Вона писала листа, коли згасло світло.',
			answer: 'She was writing a letter when the lights went out.',
			traps: {
				was: ['were', 'is', 'did'],
				writing: ['wrote', 'writes'],
			},
		},
		{
			id: 'past-continuous-29',
			form: 'affirmative',
			prompt: 'Поки ми чекали, Том розповідав анекдоти.',
			answer: 'While we were waiting, Tom was telling jokes.',
			accept: ['While we {were waiting|waited}, Tom was telling jokes.'],
			traps: {
				was: ['were', 'is', 'did'],
				telling: ['told', 'tells'],
			},
		},
		{
			id: 'past-continuous-30',
			form: 'affirmative',
			prompt: 'Коли я тебе побачив, ти розмовляв по телефону.',
			answer: 'When I saw you, you were talking on the phone.',
			accept: ['When I saw you, you were {talking|speaking} on the phone.'],
			traps: {
				were: ['was', 'are', 'did'],
				talking: ['talked', 'talk'],
			},
		},
		{
			id: 'past-continuous-31',
			form: 'affirmative',
			prompt: 'Минулого літа в цей час ми подорожували Італією.',
			answer: 'This time last summer we were travelling around Italy.',
			accept: [
				'{This|At this} time last summer we were {travelling|traveling} {around|in} Italy.',
			],
			traps: {
				were: ['was', 'are', 'did'],
				travelling: ['travelled', 'travel'],
			},
		},
		{
			id: 'past-continuous-32',
			form: 'affirmative',
			prompt: 'Мій брат учився, поки я спав.',
			answer: 'My brother was studying while I was sleeping.',
			accept: ['My brother was studying while I {was sleeping|slept}.'],
			traps: {
				was: ['were', 'is'],
				studying: ['studied', 'studies'],
			},
		},
		{
			id: 'past-continuous-33',
			form: 'affirmative',
			prompt: 'Коли пролунав дзвінок, учитель ще говорив.',
			answer: 'When the bell rang, the teacher was still talking.',
			accept: ['When the bell rang, the teacher was still {talking|speaking}.'],
			traps: {
				was: ['were', 'is', 'did'],
				talking: ['talked', 'talks'],
			},
		},
		{
			id: 'past-continuous-34',
			form: 'affirmative',
			prompt: 'Я йшов додому, коли зустрів старого друга.',
			answer: 'I was walking home when I met an old friend.',
			accept: ['I was {walking|going} home when I met an old friend.'],
			traps: {
				was: ['were', 'am', 'did'],
				walking: ['walked', 'walk'],
			},
		},
		{
			id: 'past-continuous-35',
			form: 'affirmative',
			prompt: 'Коли ми їх відвідали, вони будували новий будинок.',
			answer: 'When we visited them, they were building a new house.',
			traps: {
				were: ['was', 'are', 'did'],
				building: ['built', 'build'],
			},
		},
		{
			id: 'past-continuous-36',
			form: 'affirmative',
			prompt: 'Опівночі вона ще розмовляла по телефону.',
			answer: 'At midnight she was still talking on the phone.',
			accept: ['At midnight she was still {talking|speaking} on the phone.'],
			traps: {
				was: ['were', 'is', 'did'],
				talking: ['talked', 'talks'],
			},
		},
		{
			id: 'past-continuous-37',
			form: 'affirmative',
			prompt: 'Коли я обернувся, ти посміхався.',
			answer: 'When I turned around, you were smiling.',
			accept: [
				'When I {turned around,|turned round,|turned,} you were smiling.',
			],
			traps: {
				were: ['was', 'are', 'did'],
				smiling: ['smiled', 'smile'],
			},
		},
		{
			id: 'past-continuous-38',
			form: 'affirmative',
			prompt: 'Поки Анна вела машину, я дивився на карту.',
			answer: 'While Anna was driving, I was looking at the map.',
			accept: ['While Anna {was driving|drove}, I was looking at the map.'],
			traps: {
				was: ['were', 'is', 'did'],
				looking: ['looked', 'look'],
			},
		},
		{
			id: 'past-continuous-39',
			form: 'affirmative',
			prompt: 'Коли я прийшов на вокзал, поїзд відходив.',
			answer: 'When I got to the station, the train was leaving.',
			accept: [
				'When I {got to|arrived at|reached} the station, the train was leaving.',
			],
			traps: {
				was: ['were', 'is', 'did'],
				leaving: ['left', 'leaves'],
			},
		},
		{
			id: 'past-continuous-40',
			form: 'affirmative',
			prompt: 'Він голився, коли хтось постукав у двері.',
			answer: 'He was shaving when someone knocked at the door.',
			accept: [
				'He was shaving when {someone|somebody} knocked {at|on} the door.',
			],
			traps: {
				was: ['were', 'is', 'did'],
				shaving: ['shaved', 'shaves'],
			},
		},
		{
			id: 'past-continuous-41',
			form: 'affirmative',
			prompt: 'Вони обідали, коли я подзвонив.',
			answer: 'They were having lunch when I called.',
			accept: ['They were {having|eating} lunch when I {called|phoned}.'],
			traps: {
				were: ['was', 'are', 'did'],
				having: ['had', 'have'],
			},
		},
		{
			id: 'past-continuous-42',
			form: 'affirmative',
			prompt: 'Я весь вечір чекав на твій дзвінок.',
			answer: 'I was waiting for your call all evening.',
			accept: [
				'I {was waiting|waited} for your call {all evening|the whole evening}.',
			],
			traps: {
				was: ['were', 'am', 'did'],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'past-continuous-43',
			form: 'affirmative',
			prompt: 'Коли приїхала поліція, злодій ще ховався.',
			answer: 'When the police arrived, the thief was still hiding.',
			traps: {
				was: ['were', 'is', 'did'],
				hiding: ['hid', 'hides'],
			},
		},
		{
			id: 'past-continuous-44',
			form: 'affirmative',
			prompt: 'Моя сестра плакала, коли я її знайшов.',
			answer: 'My sister was crying when I found her.',
			traps: {
				was: ['were', 'is', 'did'],
				crying: ['cried', 'cries'],
			},
		},
		{
			id: 'past-continuous-45',
			form: 'affirmative',
			prompt: "О п'ятій ранку ми ще танцювали.",
			answer: 'At five in the morning we were still dancing.',
			accept: ["At five {o'clock|} in the morning we were still dancing."],
			traps: {
				were: ['was', 'are', 'did'],
				dancing: ['danced', 'dance'],
			},
		},
		{
			id: 'past-continuous-46',
			form: 'affirmative',
			prompt: 'Мої батьки дивилися телевізор, поки ми спали.',
			answer: 'My parents were watching TV while we were sleeping.',
			accept: [
				'My parents were watching {TV|television} while we {were sleeping|slept}.',
			],
			traps: {
				were: ['was', 'are', 'did'],
				watching: ['watched', 'watch'],
			},
		},
		{
			id: 'past-continuous-47',
			form: 'question',
			prompt: 'Що ти робив о восьмій вечора?',
			answer: 'What were you doing at eight in the evening?',
			accept: ["What were you doing at eight {o'clock|} in the evening?"],
			traps: {
				were: ['was', 'did', 'are'],
				doing: ['do', 'did'],
			},
		},
		{
			id: 'past-continuous-48',
			form: 'question',
			prompt: 'Ти спав, коли я подзвонив?',
			answer: 'Were you sleeping when I called?',
			accept: ['Were you sleeping when I {called|phoned}?'],
			traps: {
				Were: ['Was', 'Did', 'Are'],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-continuous-49',
			form: 'question',
			prompt: 'Куди ти йшов, коли я тебе побачив?',
			answer: 'Where were you going when I saw you?',
			traps: {
				were: ['was', 'did', 'are'],
				going: ['went', 'go'],
			},
		},
		{
			id: 'past-continuous-50',
			form: 'question',
			prompt: 'Чому вона плакала, коли ти зайшов?',
			answer: 'Why was she crying when you came in?',
			accept: ['Why was she crying when you {came|walked} in?'],
			traps: {
				was: ['were', 'did', 'is'],
				crying: ['cried', 'cry'],
			},
		},
		{
			id: 'past-continuous-51',
			form: 'question',
			prompt: 'Про що ви говорили, коли я зайшов?',
			answer: 'What were you talking about when I came in?',
			accept: ['What were you talking about when I {came|walked} in?'],
			traps: {
				were: ['was', 'did', 'are'],
				talking: ['talked', 'talk'],
			},
		},
		{
			id: 'past-continuous-52',
			form: 'question',
			prompt: 'Хто вів машину, коли сталася аварія?',
			answer: 'Who was driving when the accident happened?',
			traps: {
				was: ['were', 'did', 'is'],
				driving: ['drove', 'drive'],
			},
		},
		{
			id: 'past-continuous-53',
			form: 'question',
			prompt: 'Чи йшов дощ, коли ви приземлилися?',
			answer: 'Was it raining when you landed?',
			traps: {
				Was: ['Were', 'Did', 'Is'],
				raining: ['rained', 'rain'],
			},
		},
		{
			id: 'past-continuous-54',
			form: 'question',
			prompt: 'Що робили твої батьки, коли ти повернувся?',
			answer: 'What were your parents doing when you got back?',
			accept: [
				'What were your parents doing when you {got back|came back|returned}?',
			],
			traps: {
				were: ['was', 'did', 'are'],
				doing: ['do', 'did'],
			},
		},
		{
			id: 'past-continuous-55',
			form: 'question',
			prompt: 'Ти працював учора о цій порі?',
			answer: 'Were you working this time yesterday?',
			accept: ['Were you working {this|at this} time yesterday?'],
			traps: {
				Were: ['Was', 'Did', 'Are'],
				working: ['worked', 'work'],
			},
		},
		{
			id: 'past-continuous-56',
			form: 'question',
			prompt: 'Кого ти чекав, коли я тебе побачив?',
			answer: 'Who were you waiting for when I saw you?',
			traps: {
				were: ['was', 'did', 'are'],
				waiting: ['waited', 'wait'],
			},
		},
		{
			id: 'past-continuous-57',
			form: 'question',
			prompt: 'Твоя сестра ще вчилася о десятій вечора?',
			answer: 'Was your sister still studying at ten in the evening?',
			accept: [
				"Was your sister still studying at ten {o'clock|} in the evening?",
			],
			traps: {
				Was: ['Were', 'Did', 'Is'],
				studying: ['studied', 'study'],
			},
		},
		{
			id: 'past-continuous-58',
			form: 'question',
			prompt: 'Він слухав, коли вчитель пояснював правило?',
			answer: 'Was he listening when the teacher was explaining the rule?',
			accept: [
				'Was he listening when the teacher {was explaining|explained} the rule?',
			],
			traps: {
				Was: ['Were', 'Did', 'Is'],
				listening: ['listened', 'listen'],
			},
		},
		{
			id: 'past-continuous-59',
			form: 'question',
			prompt: 'Що читала Анна, коли ти зайшов?',
			answer: 'What was Anna reading when you came in?',
			accept: ['What was Anna reading when you {came|walked} in?'],
			traps: {
				was: ['were', 'did', 'is'],
				reading: ['read', 'reads'],
			},
		},
		{
			id: 'past-continuous-60',
			form: 'question',
			prompt: 'Чому вони сміялися, коли я ввімкнув світло?',
			answer: 'Why were they laughing when I turned on the light?',
			accept: [
				'Why were they laughing when I {turned|switched} {on the light|the light on}?',
			],
			traps: {
				were: ['was', 'did', 'are'],
				laughing: ['laughed', 'laugh'],
			},
		},
		{
			id: 'past-continuous-61',
			form: 'question',
			prompt: 'З ким ти розмовляв, коли я подзвонив?',
			answer: 'Who were you talking to when I called?',
			accept: ['Who were you {talking|speaking} to when I {called|phoned}?'],
			traps: {
				were: ['was', 'did', 'are'],
				talking: ['talked', 'talk'],
			},
		},
		{
			id: 'past-continuous-62',
			form: 'question',
			prompt: "Вона ще спала о дев'ятій?",
			answer: 'Was she still sleeping at nine?',
			traps: {
				Was: ['Were', 'Did', 'Is'],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-continuous-63',
			form: 'question',
			prompt: 'Діти ще гралися, коли почався дощ?',
			answer: 'Were the children still playing when it started raining?',
			accept: [
				'Were the {children|kids} still playing when it {started|began} {raining|to rain}?',
			],
			traps: {
				Were: ['Was', 'Did', 'Are'],
				playing: ['played', 'play'],
			},
		},
		{
			id: 'past-continuous-64',
			form: 'question',
			prompt: 'Що ви робили, коли згасло світло?',
			answer: 'What were you doing when the lights went out?',
			traps: {
				were: ['was', 'did', 'are'],
				doing: ['do', 'did'],
			},
		},
		{
			id: 'past-continuous-65',
			form: 'question',
			prompt: "Ти дивився телевізор о дев'ятій вечора?",
			answer: 'Were you watching TV at nine in the evening?',
			accept: [
				"Were you watching {TV|television} at nine {o'clock|} in the evening?",
			],
			traps: {
				Were: ['Was', 'Did', 'Are'],
				watching: ['watched', 'watch'],
			},
		},
		{
			id: 'past-continuous-66',
			form: 'question',
			prompt: 'Куди вони їхали, коли зламалася їхня машина?',
			answer: 'Where were they going when their car broke down?',
			accept: ['Where were they {going|driving} when their car broke down?'],
			traps: {
				were: ['was', 'did', 'are'],
				going: ['went', 'go'],
			},
		},
		{
			id: 'past-continuous-67',
			form: 'question',
			prompt: 'Що ти шукав, коли я тебе покликав?',
			answer: 'What were you looking for when I called you?',
			traps: {
				were: ['was', 'did', 'are'],
				looking: ['looked', 'look'],
			},
		},
		{
			id: 'past-continuous-68',
			form: 'question',
			prompt: 'Хто грав на піаніно, коли ми прийшли?',
			answer: 'Who was playing the piano when we arrived?',
			accept: ['Who was playing {the|} piano when we arrived?'],
			traps: {
				was: ['were', 'did', 'is'],
				playing: ['played', 'play'],
			},
		},
		{
			id: 'past-continuous-69',
			form: 'question',
			prompt: 'Чи світило сонце, коли ви прокинулися?',
			answer: 'Was the sun shining when you woke up?',
			traps: {
				Was: ['Were', 'Did', 'Is'],
				shining: ['shone', 'shine'],
			},
		},
		{
			id: 'past-continuous-70',
			form: 'question',
			prompt: 'Що вона готувала, коли ти подзвонив?',
			answer: 'What was she cooking when you called?',
			accept: ['What was she cooking when you {called|phoned}?'],
			traps: {
				was: ['were', 'did', 'is'],
				cooking: ['cooked', 'cook'],
			},
		},
		{
			id: 'past-continuous-71',
			form: 'question',
			prompt: 'Чому ти біг, коли я тебе побачив?',
			answer: 'Why were you running when I saw you?',
			traps: {
				were: ['was', 'did', 'are'],
				running: ['ran', 'run'],
			},
		},
		{
			id: 'past-continuous-72',
			form: 'question',
			prompt: 'Ти слухав музику, коли я зайшов?',
			answer: 'Were you listening to music when I came in?',
			accept: ['Were you listening to music when I {came|walked} in?'],
			traps: {
				Were: ['Was', 'Did', 'Are'],
				listening: ['listened', 'listen'],
			},
		},
		{
			id: 'past-continuous-73',
			form: 'question',
			prompt: 'Що ти робив опівночі?',
			answer: 'What were you doing at midnight?',
			traps: {
				were: ['was', 'did', 'are'],
				doing: ['do', 'did'],
			},
		},
		{
			id: 'past-continuous-74',
			form: 'question',
			prompt: 'Твій брат ще спав, коли ти пішов?',
			answer: 'Was your brother still sleeping when you left?',
			traps: {
				Was: ['Were', 'Did', 'Is'],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-continuous-75',
			form: 'question',
			prompt: 'Чи йшов сніг, коли ви виїхали з міста?',
			answer: 'Was it snowing when you left the city?',
			accept: ['Was it snowing when you left the {city|town}?'],
			traps: {
				Was: ['Were', 'Did', 'Is'],
				snowing: ['snowed', 'snow'],
			},
		},
		{
			id: 'past-continuous-76',
			form: 'negative',
			prompt: 'Я не спав, коли ти подзвонив.',
			answer: "I wasn't sleeping when you called.",
			accept: ["I wasn't sleeping when you {called|phoned}."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-continuous-77',
			form: 'negative',
			prompt: 'Вони не слухали, коли я говорив.',
			answer: "They weren't listening when I was speaking.",
			accept: ["They weren't listening when I was {speaking|talking}."],
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				listening: ['listened', 'listen'],
			},
		},
		{
			id: 'past-continuous-78',
			form: 'negative',
			prompt: 'Коли я прийшов додому, Анна не готувала, а читала.',
			answer: "When I came home, Anna wasn't cooking, she was reading.",
			accept: ["When I {came|got} home, Anna wasn't cooking, she was reading."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				cooking: ['cooked', 'cook'],
			},
		},
		{
			id: 'past-continuous-79',
			form: 'negative',
			prompt: "Я не дивився телевізор о дев'ятій, я працював.",
			answer: "I wasn't watching TV at nine, I was working.",
			accept: [
				"I wasn't watching {TV|television} {at nine,|at nine o'clock,} I was working.",
			],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				watching: ['watched', 'watch'],
			},
		},
		{
			id: 'past-continuous-80',
			form: 'negative',
			prompt: 'Ми не їхали швидко, коли нас зупинила поліція.',
			answer: "We weren't driving fast when the police stopped us.",
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				driving: ['drove', 'drive'],
			},
		},
		{
			id: 'past-continuous-81',
			form: 'negative',
			prompt: 'Коли я зайшов, він не працював.',
			answer: "When I came in, he wasn't working.",
			accept: ["When I {came|walked} in, he wasn't working."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				working: ['worked', 'work'],
			},
		},
		{
			id: 'past-continuous-82',
			form: 'negative',
			prompt: 'Мої діти не спали опівночі.',
			answer: "My children weren't sleeping at midnight.",
			accept: ["My {children|kids} weren't sleeping at midnight."],
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				sleeping: ['slept', 'sleep'],
			},
		},
		{
			id: 'past-continuous-83',
			form: 'negative',
			prompt: 'Учора о цій порі я не працював.',
			answer: "This time yesterday I wasn't working.",
			accept: ["{This|At this} time yesterday I wasn't working."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				working: ['worked', 'work'],
			},
		},
		{
			id: 'past-continuous-84',
			form: 'negative',
			prompt: 'Ти не слухав мене, коли я говорив.',
			answer: "You weren't listening to me when I was talking.",
			accept: ["You weren't listening to me when I was {talking|speaking}."],
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				listening: ['listened', 'listen'],
			},
		},
		{
			id: 'past-continuous-85',
			form: 'negative',
			prompt: 'Дощ не йшов, коли ми вийшли.',
			answer: "It wasn't raining when we went out.",
			accept: ["It wasn't raining when we {went out|left}."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				raining: ['rained', 'rain'],
			},
		},
		{
			id: 'past-continuous-86',
			form: 'negative',
			prompt: 'Коли я обернувся, вона не плакала, а сміялася.',
			answer: "When I turned around, she wasn't crying, she was laughing.",
			accept: [
				"When I {turned around,|turned round,|turned,} she wasn't crying, she was laughing.",
			],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				crying: ['cried', 'cry'],
			},
		},
		{
			id: 'past-continuous-87',
			form: 'negative',
			prompt: 'Ми не говорили про тебе, коли ти зайшов.',
			answer: "We weren't talking about you when you came in.",
			accept: ["We weren't talking about you when you {came|walked} in."],
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				talking: ['talked', 'talk'],
			},
		},
		{
			id: 'past-continuous-88',
			form: 'negative',
			prompt: 'Я не жартував, коли це сказав.',
			answer: "I wasn't joking when I said that.",
			accept: ["I wasn't joking when I said {that|it|this}."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				joking: ['joked', 'joke'],
			},
		},
		{
			id: 'past-continuous-89',
			form: 'negative',
			prompt: "Вони не грали у футбол о п'ятій.",
			answer: "They weren't playing football at five.",
			accept: ["They weren't playing {football|soccer} at five."],
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				playing: ['played', 'play'],
			},
		},
		{
			id: 'past-continuous-90',
			form: 'negative',
			prompt: 'Мій брат не вчився, коли я зайшов до його кімнати.',
			answer: "My brother wasn't studying when I came into his room.",
			accept: [
				"My brother wasn't studying when I {came into|walked into|entered} his room.",
			],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				studying: ['studied', 'study'],
			},
		},
		{
			id: 'past-continuous-91',
			form: 'negative',
			prompt: 'Сонце не світило, коли ми прийшли на пляж.',
			answer: "The sun wasn't shining when we got to the beach.",
			accept: [
				"The sun wasn't shining when we {got to|arrived at|reached} the beach.",
			],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				shining: ['shone', 'shine'],
			},
		},
		{
			id: 'past-continuous-92',
			form: 'negative',
			prompt: 'Він не вів машину, коли сталася аварія.',
			answer: "He wasn't driving when the accident happened.",
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				driving: ['drove', 'drive'],
			},
		},
		{
			id: 'past-continuous-93',
			form: 'negative',
			prompt: 'Коли ти подзвонив, я не обідав.',
			answer: "When you called, I wasn't having lunch.",
			accept: ["When you {called|phoned}, I wasn't {having|eating} lunch."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				having: ['had', 'have'],
			},
		},
		{
			id: 'past-continuous-94',
			form: 'negative',
			prompt: 'Мої друзі не чекали на мене, коли я приїхав.',
			answer: "My friends weren't waiting for me when I arrived.",
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				waiting: ['waited', 'wait'],
			},
		},
		{
			id: 'past-continuous-95',
			form: 'negative',
			prompt: 'Поки я готувала, Том мені не допомагав.',
			answer: "While I was cooking, Tom wasn't helping me.",
			accept: ["While I {was cooking|cooked}, Tom wasn't helping me."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				helping: ['helped', 'help'],
			},
		},
		{
			id: 'past-continuous-96',
			form: 'negative',
			prompt: 'Коли я їх побачив, вони не сварилися.',
			answer: "When I saw them, they weren't arguing.",
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				arguing: ['argued', 'argue'],
			},
		},
		{
			id: 'past-continuous-97',
			form: 'negative',
			prompt: 'Анна не носила окулярів, коли я її зустрів.',
			answer: "Anna wasn't wearing glasses when I met her.",
			accept: ["Anna wasn't wearing {her|} glasses when I met her."],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				wearing: ['wore', 'wear'],
			},
		},
		{
			id: 'past-continuous-98',
			form: 'negative',
			prompt: 'Опівночі сніг не йшов.',
			answer: "At midnight it wasn't snowing.",
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				snowing: ['snowed', 'snow'],
			},
		},
		{
			id: 'past-continuous-99',
			form: 'negative',
			prompt: 'Він не посміхався, коли я його фотографував.',
			answer: "He wasn't smiling when I was taking his photo.",
			accept: [
				"He wasn't smiling when I was taking {his photo|his picture|a photo of him|a picture of him}.",
				"He wasn't smiling when I was photographing him.",
			],
			traps: {
				"wasn't": ["weren't", "didn't", "isn't"],
				smiling: ['smiled', 'smile'],
			},
		},
		{
			id: 'past-continuous-100',
			form: 'negative',
			prompt: 'Ми не спали, коли злодій проник у будинок.',
			answer: "We weren't sleeping when the thief broke into the house.",
			accept: [
				"We weren't sleeping when the {thief|burglar} broke into the house.",
			],
			traps: {
				"weren't": ["wasn't", "didn't", "aren't"],
				sleeping: ['slept', 'sleep'],
			},
		},
	],
})
