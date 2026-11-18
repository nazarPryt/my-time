import { defineTopic } from '../../define-topic'

const HAD = ['has', 'have'] as const
const HAD_Q = ['Has', 'Have'] as const
const HADNT = ["hasn't", "haven't", "didn't"] as const
const BEEN = ['being', 'be', 'was'] as const

export const pastPerfectPassive = defineTopic({
	id: 'past-perfect-passive',
	level: 'advanced',
	title: 'Past perfect passive',
	subtitle: 'Минулий доконаний час (пасив)',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Past Perfect Passive показує, що дію над предметом уже завершили до певного моменту в минулому. Важливий не виконавець, а результат: «квитки вже продали», «кімнату вже прибрали». Момент у минулому задають when, by the time, before або інша дія в Past Simple. Українською це часто безособове «вже продали» чи «було продано».',
			examples: [
				{
					text: 'When the shop opened, the bread had already been delivered.',
					translation: 'Коли відчинився магазин, хліб уже привезли.',
				},
				{
					text: 'By the time we left, the bill had been paid.',
					translation: 'До того часу, як ми пішли, рахунок уже оплатили.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Підмет + had been + третя форма дієслова (V3) для всіх осіб. Неправильні дієслова мають власну третю форму: sold, written, taken, stolen, built. Had із займенником скорочується до 'd: she'd been told. Виконавця, якщо він важливий, додають через by.",
			examples: [
				{
					text: 'The museum had been closed for repairs, so we went home.',
					translation: 'Музей зачинили на ремонт, тож ми пішли додому.',
				},
				{
					text: "She'd been told about the changes before the meeting.",
					translation: 'Їй розповіли про зміни ще до наради.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Had + підмет + been + V3? Питальне слово стоїть на початку: Why had…, How many… had… Якщо питають про сам предмет, had стоїть одразу після who/what: What had been taken?',
			examples: [
				{
					text: 'Had the car been checked before the trip?',
					translation: 'Машину перевірили перед поїздкою?',
				},
				{
					text: 'How many guests had been invited to the party?',
					translation: 'Скільки гостей запросили на вечірку?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Підмет + hadn't (had not) + been + V3. «Ще не» — yet у кінці речення або hadn't yet been. «Ніколи раніше» — had never been.",
			examples: [
				{
					text: "The bridge hadn't been finished when the flood came.",
					translation: 'Міст ще не добудували, коли прийшла повінь.',
				},
				{
					text: 'The old letters had never been read by anyone.',
					translation: 'Старі листи ніхто ніколи не читав.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'past-perfect-passive-1',
			form: 'affirmative',
			prompt: 'Будинок уже був проданий.',
			answer: 'The house had already been sold.',
			traps: {
				sold: ['sell', 'selled', 'sells'],
			},
		},
		{
			id: 'past-perfect-passive-2',
			form: 'affirmative',
			prompt: 'Лист написали ще до того, як він прийшов.',
			answer: 'The letter had been written before he came.',
			accept: ['The letter {had been|was} written before he {came|arrived}.'],
			traps: { written: ['wrote', 'writing'] },
		},
		{
			id: 'past-perfect-passive-3',
			form: 'affirmative',
			prompt: 'Коли ми приїхали, квитки вже були продані.',
			answer: 'When we arrived, the tickets had already been sold.',
			accept: ['The tickets had already been sold when we arrived.'],
			traps: { had: HAD, been: BEEN, sold: ['sell', 'selled', 'sells'] },
		},
		{
			id: 'past-perfect-passive-4',
			form: 'affirmative',
			prompt: 'Коли приїхала поліція, гроші вже вкрали.',
			answer: 'When the police arrived, the money had already been stolen.',
			accept: ['The money had already been stolen when the police arrived.'],
			traps: { had: HAD, been: BEEN, stolen: ['stole', 'stealed', 'steal'] },
		},
		{
			id: 'past-perfect-passive-5',
			form: 'affirmative',
			prompt: 'До того часу, як я народився, цю церкву вже збудували.',
			answer: 'By the time I was born, this church had already been built.',
			accept: ['This church had already been built by the time I was born.'],
			traps: { had: HAD, been: BEEN, built: ['builded', 'build', 'builds'] },
		},
		{
			id: 'past-perfect-passive-6',
			form: 'affirmative',
			prompt: 'Коли я прокинувся, посуд уже помили.',
			answer: 'When I woke up, the dishes had already been washed.',
			accept: [
				'When I {woke up|woke}, the dishes had already been washed.',
				'The dishes had already been washed when I woke up.',
			],
			traps: { had: HAD, been: BEEN, washed: ['wash', 'washing'] },
		},
		{
			id: 'past-perfect-passive-7',
			form: 'affirmative',
			prompt: 'Вікно розбили ще до того, як ми прийшли.',
			answer: 'The window had been broken before we came.',
			accept: ['The window {had been|was} broken before we {came|arrived}.'],
			traps: { been: BEEN, broken: ['broke', 'breaked', 'break'] },
		},
		{
			id: 'past-perfect-passive-8',
			form: 'affirmative',
			prompt: 'Коли вона нам подзвонила, рішення вже ухвалили.',
			answer: 'When she called us, the decision had already been made.',
			accept: [
				'When she {called|phoned|rang} us, the decision had already been made.',
				'The decision had already been made when she {called|phoned|rang} us.',
			],
			traps: { had: HAD, been: BEEN, made: ['maked', 'make', 'making'] },
		},
		{
			id: 'past-perfect-passive-9',
			form: 'affirmative',
			prompt: 'Мені сказали, що рейс скасували.',
			answer: 'I was told that the flight had been cancelled.',
			accept: ['I was told {that|} the flight had been {cancelled|canceled}.'],
			traps: { been: BEEN, cancelled: ['cancel', 'cancels'] },
		},
		{
			id: 'past-perfect-passive-10',
			form: 'affirmative',
			prompt: 'Коли я повернувся додому, мою машину вже відремонтували.',
			answer: 'When I got back home, my car had already been repaired.',
			accept: [
				'When I {got back|came back|returned} home, my car had already been {repaired|fixed}.',
				'My car had already been {repaired|fixed} when I {got back|came back|returned} home.',
			],
			traps: { had: HAD, been: BEEN, repaired: ['repair', 'repairing'] },
		},
		{
			id: 'past-perfect-passive-11',
			form: 'affirmative',
			prompt: "Коли ми прийшли на вечірку, весь торт уже з'їли.",
			answer:
				'When we got to the party, the whole cake had already been eaten.',
			accept: [
				'When we {got to|came to|arrived at} the party, {the whole cake|all the cake} had already been eaten.',
				'{The whole cake|All the cake} had already been eaten when we {got to|came to|arrived at} the party.',
			],
			traps: { had: HAD, been: BEEN, eaten: ['ate', 'eated', 'eat'] },
		},
		{
			id: 'past-perfect-passive-12',
			form: 'affirmative',
			prompt: 'Він дізнався, що його листи прочитали.',
			answer: 'He found out that his letters had been read.',
			accept: [
				'He {found out|learned|learnt|discovered} {that|} his letters had been read.',
			],
			traps: { been: BEEN, read: ['readed', 'reads', 'reading'] },
		},
		{
			id: 'past-perfect-passive-13',
			form: 'affirmative',
			prompt: 'Коли прийшли гості, стіл уже накрили.',
			answer: 'When the guests arrived, the table had already been set.',
			accept: [
				'When the guests {arrived|came}, the table had already been {set|laid}.',
				'The table had already been {set|laid} when the guests {arrived|came}.',
			],
			traps: { had: HAD, been: BEEN, set: ['setted', 'sets', 'setting'] },
		},
		{
			id: 'past-perfect-passive-14',
			form: 'affirmative',
			prompt:
				'Коли я прийшов на роботу, мій стіл уже перенесли в інший кабінет.',
			answer:
				'When I got to work, my desk had already been moved to another office.',
			accept: [
				'When I {got to|came to|arrived at} work, my desk had already been moved to another office.',
				'My desk had already been moved to another office when I {got to|came to|arrived at} work.',
			],
			traps: { had: HAD, been: BEEN, moved: ['move', 'moving'] },
		},
		{
			id: 'past-perfect-passive-15',
			form: 'affirmative',
			prompt: 'До того часу, як ми повернулися, сніг уже прибрали.',
			answer: 'By the time we got back, the snow had already been cleared.',
			accept: [
				'By the time we {got back|came back|returned}, the snow had already been {cleared|removed}.',
				'The snow had already been {cleared|removed} by the time we {got back|came back|returned}.',
			],
			traps: { had: HAD, been: BEEN, cleared: ['clear', 'clears'] },
		},
		{
			id: 'past-perfect-passive-16',
			form: 'affirmative',
			prompt:
				'Коли вона прийшла на роботу в понеділок, її кабінет уже пофарбували.',
			answer:
				'When she came to work on Monday, her office had already been painted.',
			accept: [
				'When she {came to|got to|arrived at} work on Monday, her office had already been painted.',
				'Her office had already been painted when she {came to|got to|arrived at} work on Monday.',
			],
			traps: { had: HAD, been: BEEN, painted: ['paint', 'paints'] },
		},
		{
			id: 'past-perfect-passive-17',
			form: 'affirmative',
			prompt: 'Коли ми дісталися до табору, намети вже поставили.',
			answer: 'When we reached the camp, the tents had already been put up.',
			accept: [
				'When we {reached|got to|arrived at} the camp, the tents had already been {put up|pitched|set up}.',
				'The tents had already been {put up|pitched|set up} when we {reached|got to|arrived at} the camp.',
			],
			traps: { had: HAD, been: BEEN, put: ['putted', 'puts', 'putting'] },
		},
		{
			id: 'past-perfect-passive-18',
			form: 'affirmative',
			prompt: 'Будинок продали ще до того, як ми про нього дізналися.',
			answer: 'The house had been sold before we found out about it.',
			accept: [
				'The house {had been|was} sold before we {found out|heard|learned|learnt} about it.',
			],
			traps: { been: BEEN, sold: ['sell', 'selled', 'sells'] },
		},
		{
			id: 'past-perfect-passive-19',
			form: 'affirmative',
			prompt: 'Злочинця вже заарештували, коли газети надрукували цю історію.',
			answer:
				'The criminal had already been arrested when the newspapers printed this story.',
			accept: [
				'The criminal had already been arrested when the newspapers {printed|published} this story.',
				'When the newspapers {printed|published} this story, the criminal had already been arrested.',
			],
			traps: { had: HAD, been: BEEN, arrested: ['arrest', 'arresting'] },
		},
		{
			id: 'past-perfect-passive-20',
			form: 'affirmative',
			prompt: 'До 2010 року цю книжку вже переклали двадцятьма мовами.',
			answer:
				'By 2010, this book had already been translated into twenty languages.',
			accept: [
				'This book had already been translated into twenty languages by 2010.',
			],
			traps: { had: HAD, been: BEEN, translated: ['translate', 'translating'] },
		},
		{
			id: 'past-perfect-passive-21',
			form: 'affirmative',
			prompt: 'На той час, коли я туди потрапив, найкращі місця вже зайняли.',
			answer: 'By the time I got there, the best seats had already been taken.',
			accept: [
				'By the time I {got there|arrived}, the best seats had already been taken.',
				'The best seats had already been taken by the time I {got there|arrived}.',
			],
			traps: { had: HAD, been: BEEN, taken: ['took', 'taked', 'take'] },
		},
		{
			id: 'past-perfect-passive-22',
			form: 'affirmative',
			prompt: 'Коли приїхали пожежники, усіх уже евакуювали.',
			answer:
				'When the firefighters arrived, everyone had already been evacuated.',
			accept: [
				'When {the firefighters|the firemen|the fire brigade} arrived, {everyone|everybody} had already been evacuated.',
				'{Everyone|Everybody} had already been evacuated when {the firefighters|the firemen|the fire brigade} arrived.',
			],
			traps: { had: HAD, been: BEEN, evacuated: ['evacuate', 'evacuating'] },
		},
		{
			id: 'past-perfect-passive-23',
			form: 'affirmative',
			prompt: 'Коли я перевірив пошту, мій пароль уже змінили.',
			answer: 'When I checked my email, my password had already been changed.',
			accept: [
				'When I checked my {email|mail}, my password had already been changed.',
				'My password had already been changed when I checked my {email|mail}.',
			],
			traps: { had: HAD, been: BEEN, changed: ['change', 'changing'] },
		},
		{
			id: 'past-perfect-passive-24',
			form: 'affirmative',
			prompt: 'Вона зрозуміла, що її обдурили.',
			answer: 'She realised that she had been deceived.',
			accept: [
				"She {realised|realized} {that|} {she had|she'd} been {deceived|cheated|tricked|fooled}.",
			],
			traps: { been: BEEN, deceived: ['deceive', 'deceiving'] },
		},
		{
			id: 'past-perfect-passive-25',
			form: 'affirmative',
			prompt: 'Після того як контракт підписали, ціни зросли.',
			answer: 'After the contract had been signed, prices went up.',
			accept: [
				'After the contract {had been|was} signed, {the prices|prices} {went up|rose|increased}.',
				'{The prices|Prices} {went up|rose|increased} after the contract {had been|was} signed.',
			],
			traps: { been: BEEN, signed: ['sign', 'signing'] },
		},
		{
			id: 'past-perfect-passive-26',
			form: 'affirmative',
			prompt: 'Коли я приєднався до команди, проєкт уже запустили.',
			answer: 'When I joined the team, the project had already been launched.',
			accept: [
				'When I joined the team, the project had already been {launched|started}.',
				'The project had already been {launched|started} when I joined the team.',
			],
			traps: { had: HAD, been: BEEN, launched: ['launch', 'launching'] },
		},
		{
			id: 'past-perfect-passive-27',
			form: 'affirmative',
			prompt: 'Коли прийшов директор, звіт уже надрукували.',
			answer: 'When the director came, the report had already been printed.',
			accept: [
				'When the director {came|arrived}, the report had already been printed.',
				'The report had already been printed when the director {came|arrived}.',
			],
			traps: { had: HAD, been: BEEN, printed: ['print', 'printing'] },
		},
		{
			id: 'past-perfect-passive-28',
			form: 'affirmative',
			prompt: 'Коли я приїхав, мій номер уже віддали комусь іншому.',
			answer: 'When I arrived, my room had already been given to someone else.',
			accept: [
				'When I {arrived|got there}, my room had already been given to {someone|somebody} else.',
				'My room had already been given to {someone|somebody} else when I {arrived|got there}.',
			],
			traps: { had: HAD, been: BEEN, given: ['gave', 'gived', 'give'] },
		},
		{
			id: 'past-perfect-passive-29',
			form: 'affirmative',
			prompt: 'Коли почався урок, усі вікна вже відчинили.',
			answer:
				'When the lesson started, all the windows had already been opened.',
			accept: [
				'When the lesson {started|began}, all {the|of the} windows had already been opened.',
				'All {the|of the} windows had already been opened when the lesson {started|began}.',
			],
			traps: { had: HAD, been: BEEN, opened: ['open', 'opening'] },
		},
		{
			id: 'past-perfect-passive-30',
			form: 'affirmative',
			prompt: 'До того часу, як прийшла допомога, село вже затопило.',
			answer: 'By the time help arrived, the village had already been flooded.',
			accept: [
				'By the time help {arrived|came}, the village had already been flooded.',
				'The village had already been flooded by the time help {arrived|came}.',
			],
			traps: { had: HAD, been: BEEN, flooded: ['flood', 'flooding'] },
		},
		{
			id: 'past-perfect-passive-31',
			form: 'affirmative',
			prompt: 'Коли я подивився у вікно, дерева вже зрубали.',
			answer:
				'When I looked out of the window, the trees had already been cut down.',
			accept: [
				'When I looked out {of|} the window, the trees had already been cut down.',
				'The trees had already been cut down when I looked out of the window.',
			],
			traps: { had: HAD, been: BEEN, cut: ['cutted', 'cuts', 'cutting'] },
		},
		{
			id: 'past-perfect-passive-32',
			form: 'affirmative',
			prompt: 'Коли ми повернулися з прогулянки, собаку вже нагодували.',
			answer: 'When we came back from the walk, the dog had already been fed.',
			accept: [
				'When we {came back|got back|returned} from {the|our} walk, the dog had already been fed.',
				'The dog had already been fed when we {came back|got back|returned} from {the|our} walk.',
			],
			traps: { had: HAD, been: BEEN, fed: ['feeded', 'feed', 'feeds'] },
		},
		{
			id: 'past-perfect-passive-33',
			form: 'affirmative',
			prompt: 'Він розповів нам, що його двічі поранили на війні.',
			answer: 'He told us that he had been wounded twice in the war.',
			accept: [
				"He told us {that|} {he had been|he'd been|he was} wounded twice in the war.",
			],
			traps: { been: BEEN, wounded: ['wound', 'wounding'] },
		},
		{
			id: 'past-perfect-passive-34',
			form: 'affirmative',
			prompt: 'Коли я знайшов ключі, замок уже поміняли.',
			answer: 'When I found the keys, the lock had already been changed.',
			accept: [
				'When I found the keys, the lock had already been {changed|replaced}.',
				'The lock had already been {changed|replaced} when I found the keys.',
			],
			traps: { had: HAD, been: BEEN, changed: ['change', 'changes'] },
		},
		{
			id: 'past-perfect-passive-35',
			form: 'affirmative',
			prompt: 'До полудня всі документи вже підписали.',
			answer: 'By noon, all the documents had already been signed.',
			accept: [
				'By {noon|midday}, all {the|of the} documents had already been signed.',
				'All {the|of the} documents had already been signed by {noon|midday}.',
			],
			traps: { had: HAD, been: BEEN, signed: ['sign', 'signs'] },
		},
		{
			id: 'past-perfect-passive-36',
			form: 'affirmative',
			prompt: 'Ще до того як я встиг відповісти, повідомлення вже видалили.',
			answer: 'Before I could reply, the message had already been deleted.',
			accept: [
				'Before I could {reply|answer|respond}, the message had already been deleted.',
				'The message had already been deleted before I could {reply|answer|respond}.',
			],
			traps: { had: HAD, been: BEEN, deleted: ['delete', 'deleting'] },
		},
		{
			id: 'past-perfect-passive-37',
			form: 'affirmative',
			prompt: 'Коли ми дійшли до музею, вхід уже закрили.',
			answer:
				'When we got to the museum, the entrance had already been closed.',
			accept: [
				'When we {got to|reached|arrived at} the museum, the entrance had already been closed.',
				'The entrance had already been closed when we {got to|reached|arrived at} the museum.',
			],
			traps: { had: HAD, been: BEEN, closed: ['close', 'closing'] },
		},
		{
			id: 'past-perfect-passive-38',
			form: 'affirmative',
			prompt: 'Вона плакала, бо її сумку вкрали в метро.',
			answer: 'She was crying because her bag had been stolen on the metro.',
			accept: [
				'She was crying because her bag {had been|was} stolen {on|in} the {metro|underground|subway}.',
			],
			traps: { had: HAD, been: BEEN, stolen: ['stole', 'steal', 'steals'] },
		},
		{
			id: 'past-perfect-passive-39',
			form: 'affirmative',
			prompt: 'Коли ми зайшли до кімнати, світло вже вимкнули.',
			answer:
				'When we came into the room, the lights had already been turned off.',
			accept: [
				'When we {came into|went into|walked into|entered} the room, {the lights|the light} had already been {turned|switched} off.',
				'{The lights|The light} had already been {turned|switched} off when we {came into|went into|walked into|entered} the room.',
			],
			traps: { had: HAD, been: BEEN, turned: ['turn', 'turning'] },
		},
		{
			id: 'past-perfect-passive-40',
			form: 'affirmative',
			prompt: 'Коли ми повернулися з відпустки, наш дах уже полагодили.',
			answer:
				'When we came back from holiday, our roof had already been repaired.',
			accept: [
				'When we {came back|got back|returned} from {holiday|vacation}, our roof had already been {repaired|fixed}.',
				'Our roof had already been {repaired|fixed} when we {came back|got back|returned} from {holiday|vacation}.',
			],
			traps: { had: HAD, been: BEEN, repaired: ['repair', 'repairs'] },
		},
		{
			id: 'past-perfect-passive-41',
			form: 'affirmative',
			prompt: 'Коли ми сіли за стіл, вечерю вже подали.',
			answer: 'When we sat down at the table, dinner had already been served.',
			accept: [
				'When we {sat down|sat} at the table, dinner had already been served.',
				'Dinner had already been served when we {sat down|sat} at the table.',
			],
			traps: { had: HAD, been: BEEN, served: ['serve', 'serving'] },
		},
		{
			id: 'past-perfect-passive-42',
			form: 'affirmative',
			prompt: 'Коли ми приїхали в аеропорт, наш рейс затримали на три години.',
			answer:
				'When we got to the airport, our flight had been delayed by three hours.',
			accept: [
				'When we {got to|arrived at} the airport, our flight {had been|was} delayed {by|for} three hours.',
				'Our flight {had been|was} delayed {by|for} three hours when we {got to|arrived at} the airport.',
			],
			traps: { had: HAD, been: BEEN, delayed: ['delay', 'delaying'] },
		},
		{
			id: 'past-perfect-passive-43',
			form: 'affirmative',
			prompt: 'Коли я відкрив холодильник, усе молоко вже випили.',
			answer: 'When I opened the fridge, all the milk had already been drunk.',
			accept: [
				'When I opened the {fridge|refrigerator}, all {the|of the} milk had already been drunk.',
				'All {the|of the} milk had already been drunk when I opened the {fridge|refrigerator}.',
			],
			traps: { had: HAD, been: BEEN, drunk: ['drank', 'drinked', 'drink'] },
		},
		{
			id: 'past-perfect-passive-44',
			form: 'affirmative',
			prompt: 'Новину вже оголосили, коли ми ввімкнули телевізор.',
			answer: 'The news had already been announced when we turned on the TV.',
			accept: [
				'The news had already been announced when we {turned|switched} on the {TV|television}.',
				'When we {turned|switched} on the {TV|television}, the news had already been announced.',
			],
			traps: { had: HAD, been: BEEN, announced: ['announce', 'announcing'] },
		},
		{
			id: 'past-perfect-passive-45',
			form: 'affirmative',
			prompt: 'Коли я повернувся, мої речі вже спакували.',
			answer: 'When I came back, my things had already been packed.',
			accept: [
				'When I {came back|got back|returned}, my {things|belongings} had already been packed.',
				'My {things|belongings} had already been packed when I {came back|got back|returned}.',
			],
			traps: { had: HAD, been: BEEN, packed: ['pack', 'packing'] },
		},
		{
			id: 'past-perfect-passive-46',
			form: 'affirmative',
			prompt: 'Мені сказали, що мою посилку вже доставили.',
			answer: 'I was told that my parcel had already been delivered.',
			accept: [
				'I was told {that|} my {parcel|package} had already been delivered.',
			],
			traps: { been: BEEN, delivered: ['deliver', 'delivering'] },
		},
		{
			id: 'past-perfect-passive-47',
			form: 'affirmative',
			prompt: 'Коли я прийшов, проблему вже вирішили.',
			answer: 'When I came, the problem had already been solved.',
			accept: [
				'When I {came|arrived}, the problem had already been solved.',
				'The problem had already been solved when I {came|arrived}.',
			],
			traps: { had: HAD, been: BEEN, solved: ['solve', 'solving'] },
		},
		{
			id: 'past-perfect-passive-48',
			form: 'affirmative',
			prompt: 'До того часу, як ми прокинулися, ялинку вже прикрасили.',
			answer:
				'By the time we woke up, the Christmas tree had already been decorated.',
			accept: [
				'By the time we {woke up|woke}, the {Christmas tree|tree} had already been decorated.',
				'The {Christmas tree|tree} had already been decorated by the time we woke up.',
			],
			traps: { had: HAD, been: BEEN, decorated: ['decorate', 'decorating'] },
		},
		{
			id: 'past-perfect-passive-49',
			form: 'affirmative',
			prompt: "Коли я знову подзвонив, зустріч уже перенесли на п'ятницю.",
			answer:
				'When I called again, the meeting had already been moved to Friday.',
			accept: [
				'When I {called|phoned|rang} again, the meeting had already been {moved|postponed|rescheduled} to Friday.',
				'The meeting had already been {moved|postponed|rescheduled} to Friday when I {called|phoned|rang} again.',
			],
			traps: { had: HAD, been: BEEN, moved: ['move', 'moves'] },
		},
		{
			id: 'past-perfect-passive-50',
			form: 'affirmative',
			prompt: 'Злодія вже спіймали, коли власник повернувся додому.',
			answer: 'The thief had already been caught when the owner came home.',
			accept: [
				'The thief had already been caught when the owner {came|got|returned} home.',
				'When the owner {came|got|returned} home, the thief had already been caught.',
			],
			traps: { had: HAD, been: BEEN, caught: ['catched', 'catch', 'catches'] },
		},
		{
			id: 'past-perfect-passive-51',
			form: 'affirmative',
			prompt: 'Коли ми повернулися, усі подарунки вже розгорнули.',
			answer: 'When we came back, all the presents had already been opened.',
			accept: [
				'When we {came back|got back|returned}, all the {presents|gifts} had already been {opened|unwrapped}.',
				'All the {presents|gifts} had already been {opened|unwrapped} when we {came back|got back|returned}.',
			],
			traps: { had: HAD, been: BEEN, opened: ['open', 'opens'] },
		},
		{
			id: 'past-perfect-passive-52',
			form: 'affirmative',
			prompt: 'На той час, коли ми туди дісталися, міст уже зруйнували.',
			answer:
				'By the time we got there, the bridge had already been destroyed.',
			accept: [
				'By the time we {got there|arrived}, the bridge had already been destroyed.',
				'The bridge had already been destroyed by the time we {got there|arrived}.',
			],
			traps: { had: HAD, been: BEEN, destroyed: ['destroy', 'destroying'] },
		},
		{
			id: 'past-perfect-passive-53',
			form: 'affirmative',
			prompt: 'Коли я зайшов до класу, на дошці вже щось написали.',
			answer:
				'When I came into the classroom, something had already been written on the board.',
			accept: [
				'When I {came into|went into|walked into|entered} the classroom, something had already been written on the board.',
				'Something had already been written on the board when I {came into|went into|walked into|entered} the classroom.',
			],
			traps: { had: HAD, been: BEEN, written: ['wrote', 'writed', 'write'] },
		},
		{
			id: 'past-perfect-passive-54',
			form: 'affirmative',
			prompt: 'Коли почався суд, свідка вже допитали.',
			answer: 'When the trial began, the witness had already been questioned.',
			accept: [
				'When the trial {began|started}, the witness had already been {questioned|interrogated}.',
				'The witness had already been {questioned|interrogated} when the trial {began|started}.',
			],
			traps: { had: HAD, been: BEEN, questioned: ['question', 'questioning'] },
		},
		{
			id: 'past-perfect-passive-55',
			form: 'affirmative',
			prompt: 'Коли ми туди приїхали, пожежу вже загасили.',
			answer: 'When we got there, the fire had already been put out.',
			accept: [
				'When we {got there|arrived}, the fire had already been {put out|extinguished}.',
				'The fire had already been {put out|extinguished} when we {got there|arrived}.',
			],
			traps: { had: HAD, been: BEEN, put: ['putted', 'puts', 'putting'] },
		},
		{
			id: 'past-perfect-passive-56',
			form: 'affirmative',
			prompt: 'Коли вона прийшла на нараду, усі питання вже обговорили.',
			answer:
				'When she came to the meeting, all the questions had already been discussed.',
			accept: [
				'When she {came to|got to|arrived at} the meeting, all the {questions|issues} had already been discussed.',
				'All the {questions|issues} had already been discussed when she {came to|got to|arrived at} the meeting.',
			],
			traps: { had: HAD, been: BEEN, discussed: ['discuss', 'discussing'] },
		},
		{
			id: 'past-perfect-passive-57',
			form: 'affirmative',
			prompt: 'Коли художник помер, більшість його картин уже продали.',
			answer:
				'When the artist died, most of his paintings had already been sold.',
			accept: [
				'When the {artist|painter} died, most of his paintings had already been sold.',
				'Most of his paintings had already been sold when the {artist|painter} died.',
			],
			traps: { had: HAD, been: BEEN, sold: ['sell', 'selled', 'sells'] },
		},
		{
			id: 'past-perfect-passive-58',
			form: 'affirmative',
			prompt:
				"Пізніше ми з'ясували, що картину намалювали в шістнадцятому столітті.",
			answer:
				'Later we found out that the picture had been painted in the sixteenth century.',
			accept: [
				'Later we {found out|learned|learnt|discovered} {that|} the picture {had been|was} painted in the sixteenth century.',
			],
			traps: { been: BEEN, painted: ['paint', 'paints'] },
		},
		{
			id: 'past-perfect-passive-59',
			form: 'affirmative',
			prompt: 'Коли ми приїхали на острів, усі номери вже забронювали.',
			answer:
				'When we arrived on the island, all the rooms had already been booked.',
			accept: [
				'When we {arrived on|got to} the island, all {the|of the} rooms had already been {booked|reserved}.',
				'All {the|of the} rooms had already been {booked|reserved} when we {arrived on|got to} the island.',
			],
			traps: { had: HAD, been: BEEN, booked: ['book', 'booking'] },
		},
		{
			id: 'past-perfect-passive-60',
			form: 'affirmative',
			prompt: 'Коли ми вийшли з кінотеатру, нашу машину вже відбуксирували.',
			answer:
				'When we came out of the cinema, our car had already been towed away.',
			accept: [
				'When we {came out of|left} the cinema, our car had already been towed away.',
				'Our car had already been towed away when we {came out of|left} the cinema.',
			],
			traps: { had: HAD, been: BEEN, towed: ['tow', 'towing'] },
		},
		{
			id: 'past-perfect-passive-61',
			form: 'question',
			prompt: 'Кімнату прибрали до того, як прийшли гості?',
			answer: 'Had the room been cleaned before the guests came?',
			accept: [
				'{Had the room been|Was the room} cleaned before the guests {came|arrived}?',
			],
			traps: { had: HAD_Q, been: BEEN, cleaned: ['clean', 'cleaning'] },
		},
		{
			id: 'past-perfect-passive-62',
			form: 'question',
			prompt: 'Коли ви приїхали, квитки вже продали?',
			answer: 'Had the tickets already been sold when you arrived?',
			accept: ['Had the tickets already been sold when you {arrived|came}?'],
			traps: { had: HAD_Q, been: BEEN, sold: ['sell', 'selled', 'sells'] },
		},
		{
			id: 'past-perfect-passive-63',
			form: 'question',
			prompt:
				'Скільки будинків уже зруйнували до того часу, як закінчилася війна?',
			answer:
				'How many houses had already been destroyed by the time the war ended?',
			accept: [
				'How many houses had already been destroyed by the time the war {ended|was over}?',
			],
			traps: { had: HAD, been: BEEN, destroyed: ['destroy', 'destroys'] },
		},
		{
			id: 'past-perfect-passive-64',
			form: 'question',
			prompt: 'Що вже вкрали, коли приїхала поліція?',
			answer: 'What had already been stolen when the police arrived?',
			accept: ['What had already been stolen when the police {arrived|came}?'],
			traps: { had: HAD, been: BEEN, stolen: ['stole', 'stealed', 'steal'] },
		},
		{
			id: 'past-perfect-passive-65',
			form: 'question',
			prompt: 'Тебе вже попередили, коли ти підписав контракт?',
			answer: 'Had you already been warned when you signed the contract?',
			traps: { had: HAD_Q, been: BEEN, warned: ['warn', 'warning'] },
		},
		{
			id: 'past-perfect-passive-66',
			form: 'question',
			prompt: 'Коли ти прийшов, вечерю вже приготували?',
			answer: 'Had dinner already been cooked when you came?',
			accept: [
				'Had dinner already been {cooked|made|prepared} when you {came|arrived}?',
			],
			traps: { had: HAD_Q, been: BEEN, cooked: ['cook', 'cooking'] },
		},
		{
			id: 'past-perfect-passive-67',
			form: 'question',
			prompt: 'Коли ти помітив помилку, книжку вже надрукували?',
			answer: 'Had the book already been printed when you noticed the mistake?',
			accept: [
				'Had the book already been printed when you noticed the {mistake|error}?',
			],
			traps: { had: HAD_Q, been: BEEN, printed: ['print', 'prints'] },
		},
		{
			id: 'past-perfect-passive-68',
			form: 'question',
			prompt: 'Кого вже обрали капітаном, коли ти приєднався до команди?',
			answer:
				'Who had already been chosen as captain when you joined the team?',
			accept: [
				'Who had already been {chosen|elected|picked} {as|} captain when you joined the team?',
			],
			traps: { had: HAD, been: BEEN, chosen: ['chose', 'choosed', 'choose'] },
		},
		{
			id: 'past-perfect-passive-69',
			form: 'question',
			prompt: 'Коли почалася нарада, проєктор уже налаштували?',
			answer: 'Had the projector already been set up when the meeting started?',
			accept: [
				'Had the projector already been set up when the meeting {started|began}?',
			],
			traps: { had: HAD_Q, been: BEEN, set: ['setted', 'sets', 'setting'] },
		},
		{
			id: 'past-perfect-passive-70',
			form: 'question',
			prompt: 'Ваш будинок уже відремонтували, коли ви туди переїхали?',
			answer: 'Had your house already been renovated when you moved in?',
			accept: [
				'Had your house already been {renovated|repaired} when you moved {in|there}?',
			],
			traps: { had: HAD_Q, been: BEEN, renovated: ['renovate', 'renovating'] },
		},
		{
			id: 'past-perfect-passive-71',
			form: 'question',
			prompt: 'Закон уже ухвалили до того, як почалися протести?',
			answer: 'Had the law already been passed before the protests started?',
			accept: [
				'Had the law already been passed before the protests {started|began}?',
			],
			traps: { had: HAD_Q, been: BEEN, passed: ['pass', 'passing'] },
		},
		{
			id: 'past-perfect-passive-72',
			form: 'question',
			prompt: 'Скільки людей уже запросили, коли ви змінили дату?',
			answer:
				'How many people had already been invited when you changed the date?',
			traps: { had: HAD, been: BEEN, invited: ['invite', 'inviting'] },
		},
		{
			id: 'past-perfect-passive-73',
			form: 'question',
			prompt: 'Коли ти отримав лист, ціну вже змінили?',
			answer: 'Had the price already been changed when you got the letter?',
			accept: [
				'Had the price already been changed when you {got|received} the letter?',
			],
			traps: { had: HAD_Q, been: BEEN, changed: ['change', 'changes'] },
		},
		{
			id: 'past-perfect-passive-74',
			form: 'question',
			prompt: 'Скільки пісень уже записали до того часу, як гурт розпався?',
			answer:
				'How many songs had already been recorded by the time the band split up?',
			accept: [
				'How many songs had already been recorded by the time the band {split up|broke up}?',
			],
			traps: { had: HAD, been: BEEN, recorded: ['record', 'recording'] },
		},
		{
			id: 'past-perfect-passive-75',
			form: 'question',
			prompt: 'Двері вже замкнули, коли ти повернувся?',
			answer: 'Had the door already been locked when you came back?',
			accept: [
				'Had the door already been locked when you {came back|got back|returned}?',
			],
			traps: { had: HAD_Q, been: BEEN, locked: ['lock', 'locking'] },
		},
		{
			id: 'past-perfect-passive-76',
			form: 'question',
			prompt: 'Коли ви туди приїхали, міст уже відбудували?',
			answer: 'Had the bridge already been rebuilt when you got there?',
			accept: [
				'Had the bridge already been rebuilt when you {got there|arrived}?',
			],
			traps: { had: HAD_Q, been: BEEN, rebuilt: ['rebuild', 'rebuilded'] },
		},
		{
			id: 'past-perfect-passive-77',
			form: 'question',
			prompt: 'Коли ви подали заявку, усі документи вже перевірили?',
			answer: 'Had all the documents already been checked when you applied?',
			accept: [
				'Had all {the|of the} documents already been checked when you applied?',
			],
			traps: { had: HAD_Q, been: BEEN, checked: ['check', 'checking'] },
		},
		{
			id: 'past-perfect-passive-78',
			form: 'question',
			prompt: 'Тебе вже звільнили, коли ти знайшов нову роботу?',
			answer: 'Had you already been fired when you found a new job?',
			accept: [
				'Had you already been {fired|dismissed|sacked} when you found a new job?',
			],
			traps: { had: HAD_Q, been: BEEN, fired: ['fire', 'firing'] },
		},
		{
			id: 'past-perfect-passive-79',
			form: 'question',
			prompt: 'Скільки дерев уже посадили до кінця тієї весни?',
			answer:
				'How many trees had already been planted by the end of that spring?',
			traps: { had: HAD, been: BEEN, planted: ['plant', 'planting'] },
		},
		{
			id: 'past-perfect-passive-80',
			form: 'question',
			prompt: 'Запрошення вже розіслали, коли весілля скасували?',
			answer:
				'Had the invitations already been sent when the wedding was cancelled?',
			accept: [
				'Had the invitations already been sent {out|} when the wedding was {cancelled|canceled|called off}?',
			],
			traps: { had: HAD_Q, been: BEEN, sent: ['sended', 'send', 'sends'] },
		},
		{
			id: 'past-perfect-passive-81',
			form: 'negative',
			prompt: 'Коли прийшли гості, кімнату ще не прибрали.',
			answer: "When the guests arrived, the room hadn't been cleaned yet.",
			accept: [
				"When the guests {arrived|came}, the room {hadn't been cleaned yet|hadn't yet been cleaned}.",
				"The room {hadn't been cleaned yet|hadn't yet been cleaned} when the guests {arrived|came}.",
			],
			traps: { "hadn't": HADNT, been: BEEN, cleaned: ['clean', 'cleaning'] },
		},
		{
			id: 'past-perfect-passive-82',
			form: 'negative',
			prompt: 'Ми не знали, що листа вже відправили.',
			answer: "We didn't know that the letter had already been sent.",
			accept: ["We didn't know {that|} the letter had already been sent."],
			traps: { been: BEEN, sent: ['sended', 'send', 'sends'] },
		},
		{
			id: 'past-perfect-passive-83',
			form: 'negative',
			prompt: 'Директор був злий, бо його не попередили.',
			answer: "The director was angry because he hadn't been warned.",
			accept: [
				"The director was angry because he {hadn't been|wasn't} warned.",
			],
			traps: { been: BEEN, warned: ['warn', 'warns'] },
		},
		{
			id: 'past-perfect-passive-84',
			form: 'negative',
			prompt: 'Коли ми переїхали, кухню ще не відремонтували.',
			answer: "When we moved in, the kitchen hadn't been renovated yet.",
			accept: [
				"When we moved {in|}, the kitchen {hadn't been renovated yet|hadn't yet been renovated}.",
				"The kitchen {hadn't been renovated yet|hadn't yet been renovated} when we moved in.",
			],
			traps: {
				"hadn't": HADNT,
				been: BEEN,
				renovated: ['renovate', 'renovates'],
			},
		},
		{
			id: 'past-perfect-passive-85',
			form: 'negative',
			prompt: 'Коли ми купили будинок, підлогу ще ніколи не фарбували.',
			answer: 'When we bought the house, the floor had never been painted.',
			accept: ['The floor had never been painted when we bought the house.'],
			traps: { had: HAD, been: BEEN, painted: ['paint', 'painting'] },
		},
		{
			id: 'past-perfect-passive-86',
			form: 'negative',
			prompt: 'Мені не сказали, що зустріч скасували.',
			answer: "I wasn't told that the meeting had been cancelled.",
			accept: [
				"I {wasn't|hadn't been} told {that|} the meeting had been {cancelled|canceled|called off}.",
			],
			traps: { been: BEEN, told: ['telled', 'tell', 'tells'] },
		},
		{
			id: 'past-perfect-passive-87',
			form: 'negative',
			prompt: 'Коли почалася нарада, зал ще не підготували.',
			answer: "When the meeting started, the hall hadn't been prepared yet.",
			accept: [
				"When the meeting {started|began}, the hall {hadn't been prepared yet|hadn't yet been prepared}.",
				"The hall {hadn't been prepared yet|hadn't yet been prepared} when the meeting {started|began}.",
			],
			traps: {
				"hadn't": HADNT,
				been: BEEN,
				prepared: ['prepare', 'preparing'],
			},
		},
		{
			id: 'past-perfect-passive-88',
			form: 'negative',
			prompt:
				'До того часу, як він помер, його книжку не переклали жодною мовою.',
			answer:
				"By the time he died, his book hadn't been translated into any language.",
			accept: [
				"His book hadn't been translated into any language by the time he died.",
			],
			traps: {
				"hadn't": HADNT,
				been: BEEN,
				translated: ['translate', 'translates'],
			},
		},
		{
			id: 'past-perfect-passive-89',
			form: 'negative',
			prompt: 'Злочинця ще не знайшли, коли справу закрили.',
			answer: "The criminal hadn't been found yet when the case was closed.",
			accept: [
				"The criminal {hadn't been found yet|hadn't yet been found} when the case was closed.",
				"When the case was closed, the criminal {hadn't been found yet|hadn't yet been found}.",
			],
			traps: {
				"hadn't": HADNT,
				been: BEEN,
				found: ['finded', 'find', 'finding'],
			},
		},
		{
			id: 'past-perfect-passive-90',
			form: 'negative',
			prompt: 'Вона не знала, що її вже підвищили.',
			answer: "She didn't know that she had already been promoted.",
			accept: [
				"She didn't know {that|} {she had|she'd} already been promoted.",
			],
			traps: { been: BEEN, promoted: ['promote', 'promoting'] },
		},
		{
			id: 'past-perfect-passive-91',
			form: 'negative',
			prompt: 'Коли я повернувся з лікарні, рахунки ще не оплатили.',
			answer: "When I came back from hospital, the bills hadn't been paid yet.",
			accept: [
				"When I {came back|got back|returned} from {hospital|the hospital}, the bills {hadn't been paid yet|hadn't yet been paid}.",
				"The bills {hadn't been paid yet|hadn't yet been paid} when I {came back|got back|returned} from {hospital|the hospital}.",
			],
			traps: { "hadn't": HADNT, been: BEEN, paid: ['payed', 'pay', 'pays'] },
		},
		{
			id: 'past-perfect-passive-92',
			form: 'negative',
			prompt: 'Коли прибув інспектор, обладнання ще не перевірили.',
			answer:
				"When the inspector arrived, the equipment hadn't been checked yet.",
			accept: [
				"When the inspector {arrived|came}, the equipment {hadn't been checked yet|hadn't yet been checked}.",
				"The equipment {hadn't been checked yet|hadn't yet been checked} when the inspector {arrived|came}.",
			],
			traps: { "hadn't": HADNT, been: BEEN, checked: ['check', 'checks'] },
		},
		{
			id: 'past-perfect-passive-93',
			form: 'negative',
			prompt: 'Школу ще не добудували, коли почався навчальний рік.',
			answer:
				"The school hadn't been finished yet when the school year started.",
			accept: [
				"The school {hadn't been finished yet|hadn't yet been finished} when the {school|academic} year {started|began}.",
				"When the {school|academic} year {started|began}, the school {hadn't been finished yet|hadn't yet been finished}.",
			],
			traps: { "hadn't": HADNT, been: BEEN, finished: ['finish', 'finishing'] },
		},
		{
			id: 'past-perfect-passive-94',
			form: 'negative',
			prompt: 'Коли я прийшов на вокзал, розклад ще не оновили.',
			answer:
				"When I got to the station, the timetable hadn't been updated yet.",
			accept: [
				"When I {got to|came to|arrived at} the station, the {timetable|schedule} {hadn't been updated yet|hadn't yet been updated}.",
			],
			traps: { "hadn't": HADNT, been: BEEN, updated: ['update', 'updating'] },
		},
		{
			id: 'past-perfect-passive-95',
			form: 'negative',
			prompt: 'Я не міг поїхати, бо мою візу ще не продовжили.',
			answer: "I couldn't leave because my visa hadn't been extended yet.",
			accept: [
				"I couldn't {leave|go} because my visa {hadn't been extended yet|hadn't yet been extended|hadn't been renewed yet|hadn't yet been renewed}.",
			],
			traps: { "hadn't": HADNT, been: BEEN, extended: ['extend', 'extending'] },
		},
		{
			id: 'past-perfect-passive-96',
			form: 'negative',
			prompt: 'Коли ми приїхали, дорогу ще не відремонтували.',
			answer: "When we arrived, the road hadn't been repaired yet.",
			accept: [
				"When we {arrived|got there}, the road {hadn't been repaired yet|hadn't yet been repaired|hadn't been fixed yet|hadn't yet been fixed}.",
				"The road {hadn't been repaired yet|hadn't yet been repaired|hadn't been fixed yet|hadn't yet been fixed} when we {arrived|got there}.",
			],
			traps: { "hadn't": HADNT, been: BEEN, repaired: ['repair', 'repairing'] },
		},
		{
			id: 'past-perfect-passive-97',
			form: 'negative',
			prompt: "Ми з'ясували, що нашу заявку не прийняли.",
			answer: "We found out that our application hadn't been accepted.",
			accept: [
				"We {found out|learned|learnt} {that|} our application {hadn't been|wasn't} accepted.",
			],
			traps: { been: BEEN, accepted: ['accept', 'accepting'] },
		},
		{
			id: 'past-perfect-passive-98',
			form: 'negative',
			prompt: 'Коли він помер, його найкращий роман ще не опублікували.',
			answer: "When he died, his best novel hadn't been published yet.",
			accept: [
				"When he died, his best novel {hadn't been published yet|hadn't yet been published}.",
				"His best novel {hadn't been published yet|hadn't yet been published} when he died.",
			],
			traps: {
				"hadn't": HADNT,
				been: BEEN,
				published: ['publish', 'publishing'],
			},
		},
		{
			id: 'past-perfect-passive-99',
			form: 'negative',
			prompt: 'Коли я прийшов на роботу, каву ще не зварили.',
			answer: "When I got to work, the coffee hadn't been made yet.",
			accept: [
				"When I {got to|came to|arrived at} work, the coffee {hadn't been made yet|hadn't yet been made}.",
				"The coffee {hadn't been made yet|hadn't yet been made} when I {got to|came to|arrived at} work.",
			],
			traps: { "hadn't": HADNT, been: BEEN, made: ['maked', 'make', 'makes'] },
		},
		{
			id: 'past-perfect-passive-100',
			form: 'negative',
			prompt: 'Ліки ще не привезли, коли пацієнтові стало гірше.',
			answer:
				"The medicine hadn't been delivered yet when the patient got worse.",
			accept: [
				"The medicine {hadn't been delivered yet|hadn't yet been delivered|hadn't been brought yet|hadn't yet been brought} when the patient {got|became} worse.",
			],
			traps: {
				"hadn't": HADNT,
				been: BEEN,
				delivered: ['deliver', 'delivers'],
			},
		},
	],
})
