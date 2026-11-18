import { defineTopic } from '../../define-topic'

export const pastPerfect = defineTopic({
	id: 'past-perfect',
	level: 'intermediate',
	title: 'Past Perfect',
	subtitle: 'Минулий доконаний час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Past Perfect показує дію, що завершилася раніше за іншу дію або момент у минулому. Типові маркери: already, just, never … before, by the time, when. Після before/after порядок дій уже зрозумілий, тому там часто вживають і Past Simple.',
			examples: [
				{
					text: 'By the time the taxi came, we had already packed.',
					translation: 'На той час, як приїхало таксі, ми вже спакувалися.',
				},
				{
					text: 'After she (had) locked the door, she went to sleep.',
					translation: 'Після того, як вона замкнула двері, вона пішла спати.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"had + третя форма дієслова (V3) для всіх осіб. У розмовній мові had скорочується до 'd: I'd, she'd, they'd.",
			examples: [
				{
					text: 'We had already packed when the taxi came.',
					translation: 'Ми вже спакувалися, коли приїхало таксі.',
				},
				{
					text: "I'd just turned off the TV when he knocked.",
					translation: 'Я щойно вимкнув телевізор, коли він постукав.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Had + підмет + V3? Зі словами ever, already: Had you ever…? Had he already…?',
			examples: [
				{
					text: 'Had the lesson already ended when you came?',
					translation: 'Урок уже закінчився, коли ти прийшов?',
				},
				{
					text: 'Had he ever eaten mango before that holiday?',
					translation: 'Він коли-небудь їв манго до тієї відпустки?',
				},
			],
		},
		{
			kind: 'negative',
			explanation: "hadn't (had not) + V3. Ніколи раніше — had never + V3.",
			examples: [
				{
					text: "We hadn't packed yet when the taxi came.",
					translation: 'Ми ще не спакувалися, коли приїхало таксі.',
				},
				{
					text: 'He had never written a poem before that day.',
					translation: 'Він ніколи не писав віршів до того дня.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'past-perfect-1',
			form: 'affirmative',
			prompt: 'Потяг уже поїхав.',
			answer: 'The train had already left.',
			traps: {
				left: ['leaved', 'leave', 'leaves'],
			},
		},
		{
			id: 'past-perfect-2',
			form: 'affirmative',
			prompt: 'Вона пішла ще до того, як я прийшов.',
			answer: 'She had left before I came.',
			traps: {
				came: ['come', 'comes', 'coming'],
			},
		},
		{
			id: 'past-perfect-3',
			form: 'affirmative',
			prompt: 'Я вже поїв, коли він подзвонив.',
			answer: 'I had already eaten when he called.',
			accept: ["{I had|I'd} already eaten when he {called|phoned}."],
			traps: {
				had: ['has', 'have'],
				eaten: ['ate', 'eat', 'eated'],
			},
		},
		{
			id: 'past-perfect-4',
			form: 'affirmative',
			prompt: 'Вона вже пішла додому, коли ми прийшли.',
			answer: 'She had already gone home when we arrived.',
			accept: ["{She had|She'd} already gone home when we {came|arrived}."],
			traps: {
				had: ['has', 'have'],
				gone: ['went', 'go', 'goed'],
			},
		},
		{
			id: 'past-perfect-5',
			form: 'affirmative',
			prompt: 'Діти вже заснули, коли ми повернулися.',
			answer: 'The children had already fallen asleep when we came back.',
			accept: [
				'The children had already fallen asleep when we {came back|got back|returned}.',
			],
			traps: {
				had: ['has', 'have'],
				fallen: ['fell', 'fall', 'falled'],
			},
		},
		{
			id: 'past-perfect-6',
			form: 'affirmative',
			prompt: 'На той час, як ми приїхали, банк уже зачинився.',
			answer: 'By the time we arrived the bank had already closed.',
			accept: [
				'{By the time|When} we {arrived|got there} the bank had already closed.',
			],
			traps: {
				had: ['has', 'have'],
				closed: ['close', 'closes', 'closing'],
			},
		},
		{
			id: 'past-perfect-7',
			form: 'affirmative',
			prompt: 'Тато вже пішов на роботу, коли я прокинувся.',
			answer: 'Dad had already gone to work when I woke up.',
			accept: [
				'{Dad|My dad} had already {gone to|left for} work when I woke up.',
			],
			traps: {
				had: ['has', 'have'],
				gone: ['went', 'go'],
				woke: ['wake', 'woken', 'waked'],
			},
		},
		{
			id: 'past-perfect-8',
			form: 'affirmative',
			prompt: 'Вони вже розрізали торт, коли ми прийшли.',
			answer: 'They had already cut the cake when we arrived.',
			accept: [
				"{They had|They'd} already cut the cake when we {came|arrived}.",
			],
			traps: {
				had: ['has', 'have'],
				cut: ['cutted', 'cuts', 'cutting'],
			},
		},
		{
			id: 'past-perfect-9',
			form: 'affirmative',
			prompt: 'Ми щойно сіли, коли задзвонив телефон.',
			answer: 'We had just sat down when the phone rang.',
			accept: ["{We had|We'd} just sat down when the phone rang."],
			traps: {
				had: ['has', 'have'],
				sat: ['sit', 'sitted', 'seated'],
				rang: ['rung', 'ring', 'ringed'],
			},
		},
		{
			id: 'past-perfect-10',
			form: 'affirmative',
			prompt: 'Я був ситий, бо вже пообідав.',
			answer: 'I was full because I had already had lunch.',
			accept: ["I was full because {I had|I'd} already had lunch."],
			traps: {
				had: ['has', 'have'],
			},
		},
		{
			id: 'past-perfect-11',
			form: 'affirmative',
			prompt: 'Я побачив, що хтось розбив вікно.',
			answer: 'I saw that someone had broken the window.',
			accept: ['I saw {that|} {someone|somebody} had broken the window.'],
			traps: {
				had: ['has', 'have'],
				broken: ['broke', 'break', 'breaked'],
			},
		},
		{
			id: 'past-perfect-12',
			form: 'affirmative',
			prompt: 'Він сказав, що вже читав цю книжку.',
			answer: 'He said he had already read this book.',
			accept: ["He said {that|} {he had|he'd} already read this book."],
			traps: {
				had: ['has', 'have'],
				read: ['readed', 'reads', 'reading'],
			},
		},
		{
			id: 'past-perfect-13',
			form: 'affirmative',
			prompt: 'Анна сказала, що вже купила квитки.',
			answer: 'Anna said she had already bought the tickets.',
			accept: ["Anna said {that|} {she had|she'd} already bought the tickets."],
			traps: {
				had: ['has', 'have'],
				bought: ['buyed', 'buy', 'brought'],
			},
		},
		{
			id: 'past-perfect-14',
			form: 'affirmative',
			prompt: 'Я згадав, що залишив парасольку вдома.',
			answer: 'I remembered that I had left my umbrella at home.',
			accept: [
				"I remembered {that|} {I had|I'd} left {my|the} umbrella at home.",
			],
			traps: {
				had: ['has', 'have'],
				left: ['leaved', 'leave', 'leaving'],
			},
		},
		{
			id: 'past-perfect-15',
			form: 'affirmative',
			prompt: 'Після того, як він закінчив роботу, він пішов додому.',
			answer: 'After he had finished work he went home.',
			accept: ["After {he had|he'd|he} finished {work|his work} he went home."],
			traps: {
				finished: ['finish', 'finishing'],
				went: ['gone', 'go', 'goed'],
			},
		},
		{
			id: 'past-perfect-16',
			form: 'affirmative',
			prompt: 'Після того, як ми поїли, ми пішли гуляти.',
			answer: 'After we had eaten we went for a walk.',
			accept: ["After {we had eaten|we'd eaten|we ate} we went for a walk."],
			traps: {
				eaten: ['eat', 'eated'],
				went: ['gone', 'go', 'goed'],
			},
		},
		{
			id: 'past-perfect-17',
			form: 'affirmative',
			prompt: 'Літак уже злетів, коли ми приїхали.',
			answer: 'The plane had already taken off when we arrived.',
			accept: ['The plane had already taken off when we {arrived|got there}.'],
			traps: {
				had: ['has', 'have'],
				taken: ['took', 'take', 'taked'],
			},
		},
		{
			id: 'past-perfect-18',
			form: 'affirmative',
			prompt: 'Я знав його, бо ми вже зустрічалися.',
			answer: 'I knew him because we had already met.',
			accept: ["I knew him because {we had|we'd} already met."],
			traps: {
				had: ['has', 'have'],
				met: ['meeted', 'meet', 'meets'],
			},
		},
		{
			id: 'past-perfect-19',
			form: 'affirmative',
			prompt: 'Коли я прокинувся, сонце вже зійшло.',
			answer: 'When I woke up the sun had already risen.',
			accept: ['When I woke up the sun had already {risen|come up}.'],
			traps: {
				had: ['has', 'have'],
				risen: ['rose', 'rise', 'rised'],
			},
		},
		{
			id: 'past-perfect-20',
			form: 'affirmative',
			prompt: 'На той час, як ми закінчили, усі вже пішли.',
			answer: 'By the time we finished everyone had already left.',
			accept: [
				'{By the time|When} we {finished|had finished} {everyone|everybody} had already {left|gone}.',
			],
			traps: {
				had: ['has', 'have'],
				left: ['leaved', 'leave', 'leaving'],
			},
		},
		{
			id: 'past-perfect-21',
			form: 'affirmative',
			prompt: "До п'ятниці він уже витратив усі гроші.",
			answer: 'By Friday he had already spent all the money.',
			accept: [
				"By Friday {he had|he'd} already spent all {the|his|of the|of his} money.",
			],
			traps: {
				had: ['has', 'have'],
				spent: ['spended', 'spend', 'spends'],
			},
		},
		{
			id: 'past-perfect-22',
			form: 'affirmative',
			prompt: 'До 2010 року вони вже переїхали до Канади.',
			answer: 'By 2010 they had already moved to Canada.',
			accept: ["By 2010 {they had|they'd} already moved to Canada."],
			traps: {
				had: ['has', 'have'],
				moved: ['move', 'moves', 'moving'],
			},
		},
		{
			id: 'past-perfect-23',
			form: 'affirmative',
			prompt: 'Коли ми познайомилися, вона вже вивчила англійську.',
			answer: 'When we met she had already learned English.',
			accept: ["When we met {she had|she'd} already {learned|learnt} English."],
			traps: {
				had: ['has', 'have'],
				learned: ['learn', 'learns', 'learning'],
			},
		},
		{
			id: 'past-perfect-24',
			form: 'affirmative',
			prompt: 'Я подумав, що вже десь його бачив.',
			answer: 'I thought I had seen him somewhere before.',
			accept: ["I thought {that|} {I had|I'd} seen him somewhere before."],
			traps: {
				had: ['has', 'have'],
				seen: ['saw', 'see', 'seed'],
			},
		},
		{
			id: 'past-perfect-25',
			form: 'affirmative',
			prompt: 'Я щойно вийшов з дому, коли пішов дощ.',
			answer: 'I had just left home when it started raining.',
			accept: [
				"{I had|I'd} just left {home|the house} when it {started|began} {raining|to rain}.",
			],
			traps: {
				had: ['has', 'have'],
				left: ['leaved', 'leave', 'leaving'],
			},
		},
		{
			id: 'past-perfect-26',
			form: 'affirmative',
			prompt: 'Ми щойно заснули, коли заплакала дитина.',
			answer: 'We had just fallen asleep when the baby started crying.',
			accept: [
				"{We had|We'd} just fallen asleep when the baby {started|began} {crying|to cry}.",
			],
			traps: {
				had: ['has', 'have'],
				fallen: ['fell', 'fall', 'falled'],
			},
		},
		{
			id: 'past-perfect-27',
			form: 'affirmative',
			prompt: 'Він сказав, що вже був у Парижі.',
			answer: 'He said he had already been to Paris.',
			accept: ["He said {that|} {he had|he'd} already been to Paris."],
			traps: {
				had: ['has', 'have'],
				been: ['was', 'be', 'gone'],
			},
		},
		{
			id: 'past-perfect-28',
			form: 'affirmative',
			prompt: 'Коли приїхала поліція, грабіжники вже втекли.',
			answer: 'When the police arrived the robbers had already escaped.',
			accept: [
				'When the police {arrived|came} the robbers had already {escaped|run away|got away}.',
			],
			traps: {
				had: ['has', 'have'],
				escaped: ['escape', 'escapes', 'escaping'],
			},
		},
		{
			id: 'past-perfect-29',
			form: 'affirmative',
			prompt: "До дев'ятої вона вже випила дві чашки кави.",
			answer: 'By nine she had already drunk two cups of coffee.',
			accept: [
				"By nine {o'clock|} {she had|she'd} already drunk two cups of coffee.",
			],
			traps: {
				had: ['has', 'have'],
				drunk: ['drank', 'drink', 'drinked'],
			},
		},
		{
			id: 'past-perfect-30',
			form: 'affirmative',
			prompt: 'Коли ми повернулися, сніг уже розтанув.',
			answer: 'When we came back the snow had already melted.',
			accept: [
				'When we {came back|got back|returned} the snow had already melted.',
			],
			traps: {
				had: ['has', 'have'],
				melted: ['melt', 'melts', 'molten'],
			},
		},
		{
			id: 'past-perfect-31',
			form: 'affirmative',
			prompt: "Я вже забув його ім'я, коли ми зустрілися знову.",
			answer: 'I had already forgotten his name when we met again.',
			accept: ["{I had|I'd} already forgotten his name when we met again."],
			traps: {
				had: ['has', 'have'],
				forgotten: ['forgot', 'forget', 'forgetted'],
			},
		},
		{
			id: 'past-perfect-32',
			form: 'affirmative',
			prompt: 'Коли ми прийшли, вона вже приготувала вечерю.',
			answer: 'When we arrived she had already cooked dinner.',
			accept: [
				"When we {came|arrived} {she had|she'd} already {cooked|made} dinner.",
			],
			traps: {
				had: ['has', 'have'],
				cooked: ['cook', 'cooks', 'cooking'],
			},
		},
		{
			id: 'past-perfect-33',
			form: 'affirmative',
			prompt: 'Я зрозумів, що зробив помилку.',
			answer: 'I realized that I had made a mistake.',
			accept: ["I {realized|realised} {that|} {I had|I'd} made a mistake."],
			traps: {
				had: ['has', 'have'],
				made: ['maked', 'make', 'did'],
			},
		},
		{
			id: 'past-perfect-34',
			form: 'affirmative',
			prompt: 'Вона сказала нам, що вже знайшла нову роботу.',
			answer: 'She told us she had already found a new job.',
			accept: ["She told us {that|} {she had|she'd} already found a new job."],
			traps: {
				had: ['has', 'have'],
				found: ['finded', 'find', 'founded'],
			},
		},
		{
			id: 'past-perfect-35',
			form: 'affirmative',
			prompt: 'Він пояснив, що вже відправив документи.',
			answer: 'He explained that he had already sent the documents.',
			accept: [
				"He explained {that|} {he had|he'd} already sent the documents.",
			],
			traps: {
				had: ['has', 'have'],
				sent: ['sended', 'send', 'sends'],
			},
		},
		{
			id: 'past-perfect-36',
			form: 'affirmative',
			prompt: 'Ми дізналися, що вони вже одружилися.',
			answer: 'We found out that they had already got married.',
			accept: [
				"We {found out|learned|learnt} {that|} {they had|they'd} already {got|gotten} married.",
			],
			traps: {
				had: ['has', 'have'],
				got: ['get', 'gets', 'getting'],
			},
		},
		{
			id: 'past-perfect-37',
			form: 'affirmative',
			prompt: 'Коли я приїхав, Анна вже написала звіт.',
			answer: 'When I arrived Anna had already written the report.',
			accept: ['When I {arrived|came} Anna had already written the report.'],
			traps: {
				had: ['has', 'have'],
				written: ['wrote', 'write', 'writed'],
			},
		},
		{
			id: 'past-perfect-38',
			form: 'affirmative',
			prompt: 'Коли ми вийшли з музею, дощ уже припинився.',
			answer: 'When we left the museum the rain had already stopped.',
			accept: [
				'When we {left|came out of} the museum the rain had already stopped.',
				'When we {left|came out of} the museum it had already stopped raining.',
			],
			traps: {
				had: ['has', 'have'],
				stopped: ['stoped', 'stop', 'stopping'],
			},
		},
		{
			id: 'past-perfect-39',
			form: 'affirmative',
			prompt: 'До тієї поїздки ми ніколи не бачили океану.',
			answer: 'Before that trip we had never seen the ocean.',
			accept: ['We had never seen the ocean before that trip.'],
			traps: {
				had: ['has', 'have'],
				seen: ['saw', 'see', 'seed'],
			},
		},
		{
			id: 'past-perfect-40',
			form: 'affirmative',
			prompt: 'Я ніколи не зустрічав його до тієї вечірки.',
			answer: 'I had never met him before that party.',
			traps: {
				had: ['has', 'have'],
				met: ['meeted', 'meet', 'meets'],
			},
		},
		{
			id: 'past-perfect-41',
			form: 'affirmative',
			prompt: 'Вона ніколи не була за кордоном до двадцяти років.',
			answer: 'She had never been abroad before she was twenty.',
			accept: [
				'She had never been abroad {before she was twenty|before the age of twenty}.',
			],
			traps: {
				had: ['has', 'have'],
				been: ['was', 'be', 'gone'],
			},
		},
		{
			id: 'past-perfect-42',
			form: 'affirmative',
			prompt: 'До минулого літа вона ніколи не їздила верхи.',
			answer: 'Before last summer she had never ridden a horse.',
			accept: ['She had never ridden a horse before last summer.'],
			traps: {
				had: ['has', 'have'],
				ridden: ['rode', 'ride', 'rided'],
			},
		},
		{
			id: 'past-perfect-43',
			form: 'affirmative',
			prompt: 'До 2020 року він ніколи не літав літаком.',
			answer: 'Before 2020 he had never flown on a plane.',
			accept: [
				'Before 2020 he had never flown {on|in} a plane.',
				'He had never flown {on|in} a plane before 2020.',
			],
			traps: {
				had: ['has', 'have'],
				flown: ['flew', 'fly', 'flied'],
			},
		},
		{
			id: 'past-perfect-44',
			form: 'affirmative',
			prompt: 'Я ніколи не чув цієї пісні до того концерту.',
			answer: 'I had never heard this song before that concert.',
			traps: {
				had: ['has', 'have'],
				heard: ['heared', 'hear', 'hears'],
			},
		},
		{
			id: 'past-perfect-45',
			form: 'affirmative',
			prompt: 'До того дня я ніколи не пробував кави.',
			answer: 'Before that day I had never tried coffee.',
			accept: ['I had never tried coffee before that day.'],
			traps: {
				had: ['has', 'have'],
				tried: ['try', 'tryed', 'tries'],
			},
		},
		{
			id: 'past-perfect-46',
			form: 'question',
			prompt: 'Ти вже поїв, коли він подзвонив?',
			answer: 'Had you already eaten when he called?',
			accept: ['Had you already eaten when he {called|phoned}?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				eaten: ['ate', 'eat', 'eated'],
			},
		},
		{
			id: 'past-perfect-47',
			form: 'question',
			prompt: 'Концерт уже почався, коли ви приїхали?',
			answer: 'Had the concert already started when you arrived?',
			accept: [
				'Had the concert already {started|begun} when you {arrived|got there}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				started: ['start', 'starts', 'starting'],
			},
		},
		{
			id: 'past-perfect-48',
			form: 'question',
			prompt: 'Вони вже пішли, коли ти повернувся?',
			answer: 'Had they already left when you came back?',
			accept: [
				'Had they already {left|gone} when you {came back|got back|returned}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				left: ['leaved', 'leave', 'leaving'],
			},
		},
		{
			id: 'past-perfect-49',
			form: 'question',
			prompt: 'Ти коли-небудь бачив сніг до того, як переїхав до Канади?',
			answer: 'Had you ever seen snow before you moved to Canada?',
			accept: ['Had you ever seen snow before {you moved|moving} to Canada?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				seen: ['saw', 'see', 'seed'],
			},
		},
		{
			id: 'past-perfect-50',
			form: 'question',
			prompt: 'Вона вже продала свою машину, коли ви познайомилися?',
			answer: 'Had she already sold her car when you met?',
			traps: {
				Had: ['Have', 'Has', 'Do'],
				sold: ['selled', 'sell', 'sells'],
			},
		},
		{
			id: 'past-perfect-51',
			form: 'question',
			prompt: 'Він уже закінчив університет, коли ви одружилися?',
			answer: 'Had he already graduated when you got married?',
			accept: [
				'Had he already {graduated|graduated from university|finished university} when you {got married|married}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				graduated: ['graduate', 'graduates', 'graduating'],
			},
		},
		{
			id: 'past-perfect-52',
			form: 'question',
			prompt: 'Діти вже заснули, коли ви повернулися додому?',
			answer: 'Had the children already fallen asleep when you got home?',
			accept: [
				'Had the children already fallen asleep when you {got home|came home|returned home}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				fallen: ['fell', 'fall', 'falled'],
			},
		},
		{
			id: 'past-perfect-53',
			form: 'question',
			prompt: 'Ти коли-небудь катався на лижах до тієї зими?',
			answer: 'Had you ever skied before that winter?',
			accept: ['Had you ever {skied|been skiing} before that winter?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				skied: ['ski', 'skies', 'skiied'],
			},
		},
		{
			id: 'past-perfect-54',
			form: 'question',
			prompt: 'Як довго ви були знайомі до весілля?',
			answer: 'How long had you known each other before the wedding?',
			accept: ['How long had you known each other before {the|your} wedding?'],
			traps: {
				had: ['have', 'has'],
				known: ['knew', 'know', 'knowed'],
			},
		},
		{
			id: 'past-perfect-55',
			form: 'question',
			prompt: 'Чому вона вже пішла, коли ми прийшли?',
			answer: 'Why had she already left when we arrived?',
			accept: ['Why had she already {left|gone} when we {came|arrived}?'],
			traps: {
				had: ['has', 'have'],
				left: ['leaved', 'leave', 'leaving'],
			},
		},
		{
			id: 'past-perfect-56',
			form: 'question',
			prompt: 'Автобус уже поїхав, коли ти прийшов?',
			answer: 'Had the bus already left when you arrived?',
			accept: ['Had the bus already left when you {came|arrived|got there}?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				left: ['leaved', 'leave', 'leaving'],
			},
		},
		{
			id: 'past-perfect-57',
			form: 'question',
			prompt: 'Ти вже купив квитки, коли ціни зросли?',
			answer: 'Had you already bought the tickets when prices went up?',
			accept: [
				'Had you already bought the tickets when {the|} prices {went up|rose}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				bought: ['buyed', 'buy', 'brought'],
			},
		},
		{
			id: 'past-perfect-58',
			form: 'question',
			prompt: 'Він коли-небудь був за кордоном до тієї поїздки?',
			answer: 'Had he ever been abroad before that trip?',
			traps: {
				Had: ['Have', 'Has', 'Do'],
				been: ['was', 'be', 'gone'],
			},
		},
		{
			id: 'past-perfect-59',
			form: 'question',
			prompt: 'Гості вже прийшли, коли ти повернувся додому?',
			answer: 'Had the guests already arrived when you got home?',
			accept: [
				'Had the guests already {arrived|come} when you {got home|came home|returned home}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				arrived: ['arrive', 'arrives', 'arriving'],
			},
		},
		{
			id: 'past-perfect-60',
			form: 'question',
			prompt: 'Що він тобі вже розповів до того, як я прийшов?',
			answer: 'What had he already told you before I came?',
			accept: ['What had he already told you before I {came|arrived}?'],
			traps: {
				had: ['has', 'have'],
				told: ['telled', 'tell', 'said'],
			},
		},
		{
			id: 'past-perfect-61',
			form: 'question',
			prompt: 'Дощ уже припинився, коли ти вийшов з дому?',
			answer: 'Had the rain already stopped when you left home?',
			accept: [
				'Had the rain already stopped when you left {home|the house}?',
				'Had it already stopped raining when you left {home|the house}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				stopped: ['stoped', 'stop', 'stopping'],
			},
		},
		{
			id: 'past-perfect-62',
			form: 'question',
			prompt: 'Анна вже лягла спати, коли ти подзвонив?',
			answer: 'Had Anna already gone to bed when you called?',
			accept: ['Had Anna already gone to bed when you {called|phoned}?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				gone: ['went', 'go', 'goed'],
			},
		},
		{
			id: 'past-perfect-63',
			form: 'question',
			prompt: 'Ти коли-небудь куштував суші до того вечора?',
			answer: 'Had you ever tried sushi before that evening?',
			traps: {
				Had: ['Have', 'Has', 'Do'],
				tried: ['try', 'tryed', 'tries'],
			},
		},
		{
			id: 'past-perfect-64',
			form: 'question',
			prompt: 'Вони вже повечеряли, коли ти прийшов?',
			answer: 'Had they already had dinner when you arrived?',
			accept: ['Had they already had dinner when you {arrived|came}?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				had: ['has', 'have'],
			},
		},
		{
			id: 'past-perfect-65',
			form: 'question',
			prompt: 'Літак уже приземлився, коли ти приїхав?',
			answer: 'Had the plane already landed when you arrived?',
			accept: ['Had the plane already landed when you {arrived|got there}?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				landed: ['land', 'lands', 'landing'],
			},
		},
		{
			id: 'past-perfect-66',
			form: 'question',
			prompt: 'Ти вже чув новину, коли я подзвонив?',
			answer: 'Had you already heard the news when I called?',
			accept: ['Had you already heard the news when I {called|phoned}?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				heard: ['heared', 'hear', 'hears'],
			},
		},
		{
			id: 'past-perfect-67',
			form: 'question',
			prompt: 'Він уже заплатив за всіх, коли ми прийшли?',
			answer: 'Had he already paid for everyone when we arrived?',
			accept: [
				'Had he already paid for {everyone|everybody} when we {came|arrived}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				paid: ['payed', 'pay', 'pays'],
			},
		},
		{
			id: 'past-perfect-68',
			form: 'question',
			prompt: 'Вона коли-небудь літала літаком до тієї поїздки?',
			answer: 'Had she ever flown on a plane before that trip?',
			accept: ['Had she ever flown {on|in} a plane before that trip?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				flown: ['flew', 'fly', 'flied'],
			},
		},
		{
			id: 'past-perfect-69',
			form: 'question',
			prompt: 'Скільки країн ти вже відвідав на той час?',
			answer: 'How many countries had you already visited by then?',
			accept: [
				'How many countries had you already visited {by then|by that time}?',
			],
			traps: {
				had: ['have', 'has'],
				visited: ['visit', 'visits', 'visiting'],
			},
		},
		{
			id: 'past-perfect-70',
			form: 'question',
			prompt: 'Що сталося до того, як приїхала поліція?',
			answer: 'What had happened before the police arrived?',
			accept: [
				'What {had happened|happened} before the police {arrived|came}?',
			],
			traps: {
				happened: ['happen', 'happens', 'happening'],
			},
		},
		{
			id: 'past-perfect-71',
			form: 'question',
			prompt: 'Ти коли-небудь водив машину до того дня?',
			answer: 'Had you ever driven a car before that day?',
			traps: {
				Had: ['Have', 'Has', 'Do'],
				driven: ['drove', 'drive', 'drived'],
			},
		},
		{
			id: 'past-perfect-72',
			form: 'question',
			prompt: 'Нарада вже почалася, коли ти зайшов?',
			answer: 'Had the meeting already begun when you came in?',
			accept: [
				'Had the meeting already {begun|started} when you {came in|walked in}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				begun: ['began', 'begin', 'beginned'],
			},
		},
		{
			id: 'past-perfect-73',
			form: 'question',
			prompt: 'Він уже пішов з офісу, коли ти подзвонив?',
			answer: 'Had he already left the office when you called?',
			accept: ['Had he already left the office when you {called|phoned}?'],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				left: ['leaved', 'leave', 'leaving'],
			},
		},
		{
			id: 'past-perfect-74',
			form: 'question',
			prompt: 'Скільки ти вже витратив до обіду?',
			answer: 'How much had you already spent by lunchtime?',
			accept: [
				'How much had you already spent {by lunchtime|by lunch|before lunch}?',
			],
			traps: {
				had: ['have', 'has'],
				spent: ['spended', 'spend', 'spends'],
			},
		},
		{
			id: 'past-perfect-75',
			form: 'question',
			prompt: 'Ти вже зробив покупки, коли почався дощ?',
			answer: 'Had you already done the shopping when it started raining?',
			accept: [
				'Had you already done the shopping when it {started|began} {raining|to rain}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Do'],
				done: ['did', 'do', 'made'],
			},
		},
		{
			id: 'past-perfect-76',
			form: 'negative',
			prompt: 'Я ще не поснідав, коли він подзвонив.',
			answer: "I hadn't had breakfast yet when he called.",
			accept: ["I hadn't had breakfast yet when he {called|phoned}."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				had: ['has', 'have'],
			},
		},
		{
			id: 'past-perfect-77',
			form: 'negative',
			prompt: 'Концерт ще не почався, коли ми прийшли.',
			answer: "The concert hadn't started yet when we arrived.",
			accept: [
				"The concert hadn't {started|begun} yet when we {arrived|came|got there}.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				started: ['start', 'starts', 'starting'],
			},
		},
		{
			id: 'past-perfect-78',
			form: 'negative',
			prompt: 'Вона ще не закінчила, коли пролунав дзвінок.',
			answer: "She hadn't finished yet when the bell rang.",
			traps: {
				"hadn't": ["haven't", "hasn't"],
				finished: ['finish', 'finishing'],
				rang: ['rung', 'ring', 'ringed'],
			},
		},
		{
			id: 'past-perfect-79',
			form: 'negative',
			prompt: 'Коли я прийшов, вони ще не повечеряли.',
			answer: "When I arrived they hadn't had dinner yet.",
			accept: ["When I {came|arrived} they hadn't had dinner yet."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				had: ['has', 'have'],
			},
		},
		{
			id: 'past-perfect-80',
			form: 'negative',
			prompt: 'Коли ми приїхали, гості ще не прийшли.',
			answer: "When we arrived the guests hadn't come yet.",
			accept: [
				"When we {arrived|got there} the guests hadn't {come|arrived} yet.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				come: ['came', 'comed', 'coming'],
			},
		},
		{
			id: 'past-perfect-81',
			form: 'negative',
			prompt: 'Я ще не ліг спати, коли ти подзвонив.',
			answer: "I hadn't gone to bed yet when you called.",
			accept: ["I hadn't gone to bed yet when you {called|phoned}."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				gone: ['went', 'go', 'goed'],
			},
		},
		{
			id: 'past-perfect-82',
			form: 'negative',
			prompt: 'Потяг ще не прибув, коли ми прийшли.',
			answer: "The train hadn't arrived yet when we got there.",
			accept: [
				"The train hadn't arrived yet when we {got there|came}.",
				"The train hadn't come yet when we {got there|arrived}.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				arrived: ['arrive', 'arrives', 'arriving'],
			},
		},
		{
			id: 'past-perfect-83',
			form: 'negative',
			prompt: 'Ми ще не вирішили, коли Анна подзвонила.',
			answer: "We hadn't decided yet when Anna called.",
			accept: ["We hadn't decided yet when Anna {called|phoned}."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				decided: ['decide', 'decides', 'deciding'],
			},
		},
		{
			id: 'past-perfect-84',
			form: 'negative',
			prompt: 'Ми запізнилися, бо не чули будильника.',
			answer: "We were late because we hadn't heard the alarm clock.",
			traps: {
				"hadn't": ["haven't", "hasn't"],
				heard: ['heared', 'hear', 'hears'],
			},
		},
		{
			id: 'past-perfect-85',
			form: 'negative',
			prompt: 'Банк ще не відчинився, коли ми туди прийшли.',
			answer: "The bank hadn't opened yet when we got there.",
			accept: ["The bank hadn't opened yet when we {got there|arrived}."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				opened: ['open', 'opens', 'opening'],
			},
		},
		{
			id: 'past-perfect-86',
			form: 'negative',
			prompt: 'Вони ще не одружилися, коли купили будинок.',
			answer: "They hadn't got married yet when they bought a house.",
			accept: [
				"They hadn't {got|gotten} married yet when they bought a house.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				bought: ['buyed', 'buy', 'brought'],
			},
		},
		{
			id: 'past-perfect-87',
			form: 'negative',
			prompt: 'Коли я приїхав на роботу, ще ніхто не прийшов.',
			answer: 'When I got to work nobody had arrived yet.',
			accept: [
				'When I {got to|arrived at} work {nobody|no one} had {arrived|come} yet.',
			],
			traps: {
				had: ['has', 'have'],
				arrived: ['arrive', 'arrives', 'arriving'],
			},
		},
		{
			id: 'past-perfect-88',
			form: 'negative',
			prompt: 'Вона була голодна, бо нічого не їла з ранку.',
			answer: "She was hungry because she hadn't eaten anything since morning.",
			accept: [
				"She was hungry because she hadn't eaten anything since {morning|the morning}.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				eaten: ['ate', 'eat', 'eated'],
			},
		},
		{
			id: 'past-perfect-89',
			form: 'negative',
			prompt: 'Він не склав іспит, бо не вчився.',
			answer: "He failed the exam because he hadn't studied.",
			accept: ["He {failed|didn't pass} the exam because he hadn't studied."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				studied: ['study', 'studyed', 'studies'],
			},
		},
		{
			id: 'past-perfect-90',
			form: 'negative',
			prompt: 'Коли я подзвонив, вона ще не прокинулася.',
			answer: "When I called she hadn't woken up yet.",
			accept: ["When I {called|phoned} she hadn't woken up yet."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				woken: ['woke', 'wake', 'waked'],
			},
		},
		{
			id: 'past-perfect-91',
			form: 'negative',
			prompt: 'Вони ще не прибрали, коли прийшли гості.',
			answer: "They hadn't cleaned up yet when the guests arrived.",
			accept: [
				"They hadn't {cleaned up|tidied up} yet when the guests {arrived|came}.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				cleaned: ['clean', 'cleans', 'cleaning'],
			},
		},
		{
			id: 'past-perfect-92',
			form: 'negative',
			prompt: 'Вона сказала, що не бачила мого листа.',
			answer: "She said she hadn't seen my letter.",
			accept: ["She said {that|} she hadn't seen my letter."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				seen: ['saw', 'see', 'seed'],
			},
		},
		{
			id: 'past-perfect-93',
			form: 'negative',
			prompt: 'Він сказав, що ще не вирішив.',
			answer: "He said he hadn't decided yet.",
			accept: ["He said {that|} he hadn't decided yet."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				decided: ['decide', 'decides', 'deciding'],
			},
		},
		{
			id: 'past-perfect-94',
			form: 'negative',
			prompt: 'Вода ще не закипіла, коли я додав макарони.',
			answer: "The water hadn't boiled yet when I added the pasta.",
			traps: {
				"hadn't": ["haven't", "hasn't"],
				boiled: ['boil', 'boils', 'boiling'],
			},
		},
		{
			id: 'past-perfect-95',
			form: 'negative',
			prompt: 'Я ще не закінчив звіт, коли прийшов начальник.',
			answer: "I hadn't finished the report yet when the boss came.",
			accept: [
				"I hadn't finished the report yet when the boss {came|arrived}.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'past-perfect-96',
			form: 'negative',
			prompt: 'Він ще не прочитав лист, коли вона подзвонила.',
			answer: "He hadn't read the letter yet when she called.",
			accept: ["He hadn't read the letter yet when she {called|phoned}."],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				read: ['readed', 'reads', 'reading'],
			},
		},
		{
			id: 'past-perfect-97',
			form: 'negative',
			prompt: 'Літак ще не приземлився, коли почалася гроза.',
			answer: "The plane hadn't landed yet when the storm started.",
			accept: [
				"The plane hadn't landed yet when the {storm|thunderstorm} {started|began}.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				landed: ['land', 'lands', 'landing'],
			},
		},
		{
			id: 'past-perfect-98',
			form: 'negative',
			prompt: 'Тато ще не повернувся, коли я ліг спати.',
			answer: "Dad hadn't come back yet when I went to bed.",
			accept: [
				"{Dad|My dad} hadn't {come back|got back|returned} yet when I went to bed.",
			],
			traps: {
				"hadn't": ["haven't", "hasn't"],
				come: ['came', 'comed', 'coming'],
			},
		},
		{
			id: 'past-perfect-99',
			form: 'negative',
			prompt: 'Фарба ще не висохла, коли ми повісили картину.',
			answer: "The paint hadn't dried yet when we hung the picture.",
			traps: {
				"hadn't": ["haven't", "hasn't"],
				hung: ['hanged', 'hang', 'hunged'],
			},
		},
		{
			id: 'past-perfect-100',
			form: 'negative',
			prompt: 'Ти ще не народився, коли ми переїхали сюди.',
			answer: "You hadn't been born yet when we moved here.",
			traps: {
				"hadn't": ["haven't", "hasn't"],
				born: ['borned', 'bear', 'birth'],
			},
		},
	],
})
