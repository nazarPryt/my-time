import { defineTopic } from '../../define-topic'

const HAD = ['must', 'has', 'have']
const WILL_HAVE = ['must', 'has', 'had']
const DID_HAVE = ['had', 'has', 'must']
const DO_HAVE = ['has', 'had', 'must']
const MUSTNT = ["don't", "doesn't", "didn't"]

export const modalVerbsMustHaveTo = defineTopic({
	id: 'modal-verbs-must-have-to',
	level: 'intermediate',
	title: 'Modal verbs (Must/Have to)',
	subtitle: 'Модальні дієслова must/have to',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				"must + дієслово без to — для всіх осіб (без -s). have to / has to + дієслово — обов'язок через обставини чи правила. У минулому лише had to, у майбутньому will have to: must не має форми минулого часу.",
			examples: [
				{
					text: 'I must call my grandmother tonight.',
					translation: 'Я мушу подзвонити бабусі сьогодні ввечері.',
				},
				{
					text: 'He has to take the medicine twice a day.',
					translation: 'Йому доводиться приймати ліки двічі на день.',
				},
				{
					text: 'Last summer we had to cancel our holiday.',
					translation: 'Минулого літа нам довелося скасувати відпустку.',
				},
				{
					text: "If it rains, you'll have to take an umbrella.",
					translation: 'Якщо піде дощ, тобі доведеться взяти парасольку.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Звичайне питання — Do/Does/Did + підмет + have to + дієслово, у майбутньому Will + підмет + have to. Must I…? звучить офіційно й рідко.',
			examples: [
				{
					text: 'Does he have to wear a tie?',
					translation: "Йому обов'язково носити краватку?",
				},
				{
					text: 'Did they have to sell the house?',
					translation: 'Їм довелося продати будинок?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"mustn't — заборона («не можна», «заборонено»). don't/doesn't have to — немає потреби («не обов'язково», «не треба»). Минуле — didn't have to, майбутнє — won't have to.",
			examples: [
				{
					text: "You mustn't cross the road here.",
					translation: 'Тобі не можна переходити дорогу тут.',
				},
				{
					text: "You don't have to cook tonight.",
					translation: "Тобі не обов'язково готувати сьогодні ввечері.",
				},
				{
					text: "He didn't have to repeat the test.",
					translation: 'Йому не довелося переписувати тест.',
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				"У теперішньому часі must і have to часто обидва правильні: must — те, що мовець сам вважає потрібним, сильна порада чи правило; have to — обов'язок, який накладають обставини. Сигнали: «мушу» — must/have to, «доводиться» — have to, «довелося» — had to, «доведеться» — will have to. Ніколи не кажіть must to чи musted.",
			examples: [
				{
					text: 'You must see this exhibition!',
					translation: 'Ти мусиш побачити цю виставку!',
				},
				{
					text: 'We have to wear a helmet on the building site.',
					translation: 'На будівництві нам доводиться носити каску.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'modal-verbs-must-have-to-1',
			form: 'affirmative',
			prompt: 'Я мушу йти.',
			answer: 'I must go.',
			accept: ['I {have|need} to go.'],
			traps: {
				go: ['going', 'goes', 'went'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-2',
			form: 'affirmative',
			prompt: 'Їй доводиться рано вставати.',
			answer: 'She has to get up early.',
			traps: {
				has: ['have', 'must', 'is'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-3',
			form: 'affirmative',
			prompt: 'Учора мені довелося працювати допізна.',
			answer: 'Yesterday I had to work late.',
			traps: {
				had: HAD,
				work: ['worked', 'working'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-4',
			form: 'affirmative',
			prompt: 'Минулого тижня ми мусили продати свою машину.',
			answer: 'Last week we had to sell our car.',
			traps: {
				had: ['must', 'musted', 'have'],
				sell: ['sold', 'selling'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-5',
			form: 'affirmative',
			prompt: 'Учора він мусив доглядати за своєю сестрою.',
			answer: 'Yesterday he had to look after his sister.',
			accept: ['Yesterday he had to {look after|take care of} his sister.'],
			traps: {
				had: ['must', 'has', 'musted'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-6',
			form: 'affirmative',
			prompt: 'Нам довелося довго чекати.',
			answer: 'We had to wait a long time.',
			accept: ['We had to wait {for|} a long time.'],
			traps: {
				had: HAD,
				wait: ['waited', 'waiting'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-7',
			form: 'affirmative',
			prompt: 'У дитинстві я мусив ходити до школи пішки.',
			answer: 'As a child I had to walk to school.',
			accept: ['{As a child|When I was a child} I had to walk to school.'],
			traps: {
				had: ['must', 'have', 'musted'],
				walk: ['walked', 'walking'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-8',
			form: 'affirmative',
			prompt: 'Учора мені довелося залишитися вдома.',
			answer: 'Yesterday I had to stay at home.',
			accept: ['Yesterday I had to stay {at|} home.'],
			traps: {
				had: HAD,
				stay: ['stayed', 'staying'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-9',
			form: 'affirmative',
			prompt: 'Минулого року Олена мусила переїхати до Львова.',
			answer: 'Last year Olena had to move to Lviv.',
			traps: {
				had: ['must', 'has', 'musted'],
				move: ['moved', 'moving'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-10',
			form: 'affirmative',
			prompt: 'Вони мусили покинути свій дім через війну.',
			answer: 'They had to leave their home because of the war.',
			accept: ['They had to leave their {home|house} because of {the|} war.'],
			traps: {
				had: ['must', 'have', 'musted'],
				leave: ['left', 'leaving'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-11',
			form: 'affirmative',
			prompt: 'Мені довелося двічі пояснювати це правило.',
			answer: 'I had to explain this rule twice.',
			traps: {
				had: HAD,
				explain: ['explained', 'explaining'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-12',
			form: 'affirmative',
			prompt: "Ми мусили встати о п'ятій ранку.",
			answer: 'We had to get up at five in the morning.',
			traps: {
				had: ['must', 'have', 'musted'],
				get: ['got', 'getting'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-13',
			form: 'affirmative',
			prompt: 'Їй довелося складати іспит ще раз.',
			answer: 'She had to take the exam again.',
			accept: ['She had to {take|sit} the exam again.'],
			traps: {
				had: ['must', 'has', 'have'],
				take: ['took', 'taking'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-14',
			form: 'affirmative',
			prompt: 'Коли зламався ліфт, нам довелося йти пішки.',
			answer: 'When the lift broke, we had to walk.',
			accept: ['When the {lift|elevator} broke{ down|}, we had to walk.'],
			traps: {
				had: HAD,
				walk: ['walked', 'walking'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-15',
			form: 'affirmative',
			prompt: 'Учора Максим мусив залишитися на роботі.',
			answer: 'Yesterday Maksym had to stay at work.',
			traps: {
				had: ['must', 'has', 'musted'],
				stay: ['stayed', 'staying'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-16',
			form: 'affirmative',
			prompt: 'Якщо ти не складеш іспит, тобі доведеться складати його знову.',
			answer: "If you fail the exam, you'll have to take it again.",
			accept: ["If you fail the exam, you'll have to {take|sit} it again."],
			traps: {
				have: WILL_HAVE,
				fail: ['will', 'failed'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-17',
			form: 'affirmative',
			prompt: 'Колись тобі доведеться сказати їй правду.',
			answer: "One day you'll have to tell her the truth.",
			accept: ["{One day|Someday|Some day} you'll have to tell her the truth."],
			traps: {
				have: WILL_HAVE,
				tell: ['told', 'telling'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-18',
			form: 'affirmative',
			prompt: 'Рано чи пізно тобі доведеться вибрати.',
			answer: "Sooner or later you'll have to choose.",
			accept: ["Sooner or later you'll have to {choose|make a choice}."],
			traps: {
				have: WILL_HAVE,
				choose: ['chose', 'choosing'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-19',
			form: 'affirmative',
			prompt: 'Якщо ти запізнишся, тобі доведеться їхати таксі.',
			answer: "If you're late, you'll have to take a taxi.",
			accept: ["If you're late, you'll have to {take a taxi|go by taxi}."],
			traps: {
				have: WILL_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-20',
			form: 'affirmative',
			prompt: 'Скоро нам доведеться купити новий холодильник.',
			answer: "Soon we'll have to buy a new fridge.",
			accept: [
				"{Soon we'll|We'll soon} have to buy a new {fridge|refrigerator}.",
			],
			traps: {
				have: WILL_HAVE,
				buy: ['bought', 'buying'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-21',
			form: 'affirmative',
			prompt: 'Через рік Андрієві доведеться повернутися в Україну.',
			answer: 'In a year Andrii will have to return to Ukraine.',
			accept: [
				'In a year Andrii will have to {return|go back|come back} to Ukraine.',
			],
			traps: {
				will: ['must', 'has', 'is'],
				have: ['has', 'had'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-22',
			form: 'affirmative',
			prompt: 'Якщо я захворію, тобі доведеться працювати замість мене.',
			answer: "If I get sick, you'll have to work instead of me.",
			accept: ["If I get {sick|ill}, you'll have to work instead of me."],
			traps: {
				have: WILL_HAVE,
				work: ['worked', 'working'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-23',
			form: 'affirmative',
			prompt: 'Якщо погода буде погана, нам доведеться залишитися вдома.',
			answer: "If the weather is bad, we'll have to stay at home.",
			accept: ["If the weather is bad, we'll have to stay {at|} home."],
			traps: {
				have: WILL_HAVE,
				is: ['will', 'was'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-24',
			form: 'affirmative',
			prompt: 'Якщо потяг запізниться, нам доведеться чекати.',
			answer: "If the train is late, we'll have to wait.",
			accept: ["If the train is {late|delayed}, we'll have to wait."],
			traps: {
				have: WILL_HAVE,
				is: ['will', 'was'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-25',
			form: 'affirmative',
			prompt: 'Якщо ти не поспішиш, тобі доведеться йти пішки.',
			answer: "If you don't hurry, you'll have to walk.",
			traps: {
				have: WILL_HAVE,
				walk: ['walked', 'walking'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-26',
			form: 'affirmative',
			prompt: 'Я мушу закінчити цей звіт сьогодні.',
			answer: 'I must finish this report today.',
			accept: ['I {must|have to|need to} finish this report today.'],
			traps: {
				must: ['musted', 'musts'],
				finish: ['to', 'finishing', 'finished'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-27',
			form: 'affirmative',
			prompt: 'Ти мусиш спробувати цей торт!',
			answer: 'You must try this cake.',
			accept: ['You {must|have to} try this cake.'],
			traps: {
				must: ['musted', 'musts'],
				try: ['to', 'trying', 'tried'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-28',
			form: 'affirmative',
			prompt: 'На роботі всі мусять носити форму.',
			answer: 'At work everyone must wear a uniform.',
			accept: ['At work {everyone|everybody} {must|has to} wear a uniform.'],
			traps: {
				must: ['musts', 'have'],
				wear: ['to', 'wears', 'wearing'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-29',
			form: 'affirmative',
			prompt: 'Я мушу більше спати.',
			answer: 'I must sleep more.',
			accept: ['I {must|have to|need to} sleep more.'],
			traps: {
				must: ['musted', 'musts'],
				sleep: ['to', 'sleeping', 'slept'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-30',
			form: 'affirmative',
			prompt: 'Я мушу вивчити ці слова до завтра.',
			answer: 'I must learn these words by tomorrow.',
			accept: ['I {must|have to|need to} learn these words by tomorrow.'],
			traps: {
				learn: ['to', 'learning', 'learned'],
				by: ['until', 'to'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-31',
			form: 'affirmative',
			prompt: 'Ви мусите показати свій паспорт на кордоні.',
			answer: 'You must show your passport at the border.',
			accept: ['You {must|have to} show your passport at the border.'],
			traps: {
				must: ['musted', 'musts'],
				show: ['to', 'showing', 'shown'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-32',
			form: 'affirmative',
			prompt: 'Кожен пасажир мусить мати квиток.',
			answer: 'Every passenger must have a ticket.',
			accept: ['Every passenger {must|has to} have a ticket.'],
			traps: {
				must: ['musts', 'have'],
				have: ['to', 'has', 'having'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-33',
			form: 'affirmative',
			prompt: 'Він мусить кинути палити.',
			answer: 'He must stop smoking.',
			accept: ['He {must|has to} {stop|quit|give up} smoking.'],
			traps: {
				must: ['musts', 'have'],
				stop: ['to', 'stops', 'stopped'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-34',
			form: 'affirmative',
			prompt: 'Ми мусимо поспішати, бо потяг відходить о сьомій.',
			answer: 'We must hurry because the train leaves at seven.',
			accept: [
				'We {must|have to} hurry {because|as} the train leaves at seven.',
			],
			traps: {
				must: ['musted', 'musts'],
				hurry: ['to', 'hurrying', 'hurried'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-35',
			form: 'affirmative',
			prompt: "Ти обов'язково мусиш побувати в Карпатах.",
			answer: 'You must visit the Carpathians.',
			accept: ['You {must|have to} {visit|go to} the Carpathians.'],
			traps: {
				must: ['musted', 'musts'],
				visit: ['to', 'visiting', 'visited'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-36',
			form: 'affirmative',
			prompt: 'Ти мусиш бути вдома до десятої.',
			answer: 'You must be home by ten.',
			accept: ['You {must|have to} be {at|} home by ten.'],
			traps: {
				must: ['musted', 'musts'],
				be: ['to', 'are', 'being'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-37',
			form: 'affirmative',
			prompt: 'Я мушу відповісти на цей лист.',
			answer: 'I must answer this letter.',
			accept: ['I {must|have to|need to} {answer|reply to} this letter.'],
			traps: {
				must: ['musted', 'musts'],
				answer: ['to', 'answering', 'answered'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-38',
			form: 'affirmative',
			prompt: 'Моєму батькові доводиться працювати у вихідні.',
			answer: 'My father has to work at weekends.',
			accept: ['My {father|dad} has to work {at|on} weekends.'],
			traps: {
				has: ['have', 'is', 'does'],
				work: ['works', 'working'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-39',
			form: 'affirmative',
			prompt: 'Нам доводиться щодня вставати о шостій.',
			answer: 'We have to get up at six every day.',
			traps: {
				have: ['has', 'are', 'had'],
				get: ['got', 'getting'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-40',
			form: 'affirmative',
			prompt: 'Мені доводиться носити окуляри.',
			answer: 'I have to wear glasses.',
			traps: {
				have: ['has', 'am', 'had'],
				wear: ['wears', 'wearing'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-41',
			form: 'affirmative',
			prompt: 'Оксані доводиться доглядати за своїм молодшим братом.',
			answer: 'Oksana has to look after her younger brother.',
			accept: [
				'Oksana has to {look after|take care of} her {younger|little} brother.',
			],
			traps: {
				has: ['have', 'is', 'does'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-42',
			form: 'affirmative',
			prompt: 'Студентам доводиться багато читати.',
			answer: 'Students have to read a lot.',
			traps: {
				have: ['has', 'are', 'had'],
				read: ['reads', 'reading'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-43',
			form: 'affirmative',
			prompt: 'Йому часто доводиться їздити у відрядження.',
			answer: 'He often has to go on business trips.',
			accept: ['He often has to {go on business trips|travel on business}.'],
			traps: {
				has: ['have', 'is', 'does'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-44',
			form: 'affirmative',
			prompt: 'У Лондоні водіям доводиться їздити лівою стороною.',
			answer: 'In London drivers have to drive on the left.',
			accept: ['In London drivers {have to|must} drive on the left.'],
			traps: {
				have: ['has', 'are', 'had'],
				drive: ['drives', 'driving'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-45',
			form: 'affirmative',
			prompt: 'Іноді мені доводиться працювати вночі.',
			answer: 'Sometimes I have to work at night.',
			traps: {
				have: ['has', 'am', 'had'],
				work: ['works', 'working'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-46',
			form: 'question',
			prompt: 'Тобі довелося довго чекати?',
			answer: 'Did you have to wait long?',
			accept: ['Did you have to wait {long|a long time|for a long time}?'],
			traps: {
				Did: ['Do', 'Does'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-47',
			form: 'question',
			prompt: 'Чому тобі довелося піти так рано?',
			answer: 'Why did you have to leave so early?',
			accept: ['Why did you have to {leave|go} so early?'],
			traps: {
				did: ['do', 'does'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-48',
			form: 'question',
			prompt: 'Вам довелося платити за паркування?',
			answer: 'Did you have to pay for parking?',
			accept: ['Did you have to pay for {the|} parking?'],
			traps: {
				Did: ['Do', 'Does'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-49',
			form: 'question',
			prompt: 'Що вам довелося робити на іспиті?',
			answer: 'What did you have to do in the exam?',
			accept: ['What did you have to do {in|at|on} the exam?'],
			traps: {
				did: ['do', 'does'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-50',
			form: 'question',
			prompt: 'Йому довелося продати свою квартиру?',
			answer: 'Did he have to sell his flat?',
			accept: ['Did he have to sell his {flat|apartment}?'],
			traps: {
				Did: ['Does', 'Do'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-51',
			form: 'question',
			prompt: 'О котрій годині тобі довелося встати?',
			answer: 'What time did you have to get up?',
			accept: ['{What time|At what time} did you have to get up?'],
			traps: {
				did: ['do', 'does'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-52',
			form: 'question',
			prompt: 'Скільки вам довелося заплатити?',
			answer: 'How much did you have to pay?',
			traps: {
				did: ['do', 'does'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-53',
			form: 'question',
			prompt: 'Їй довелося працювати в суботу?',
			answer: 'Did she have to work on Saturday?',
			traps: {
				Did: ['Does', 'Do'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-54',
			form: 'question',
			prompt: 'Вам довелося змінити свої плани?',
			answer: 'Did you have to change your plans?',
			traps: {
				Did: ['Do', 'Does'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-55',
			form: 'question',
			prompt: 'Чому Олегові довелося залишитися в лікарні?',
			answer: 'Why did Oleh have to stay in hospital?',
			accept: ['Why did Oleh have to stay in {the|} hospital?'],
			traps: {
				did: ['does', 'do'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-56',
			form: 'question',
			prompt: 'Тобі довелося говорити англійською?',
			answer: 'Did you have to speak English?',
			traps: {
				Did: ['Do', 'Does'],
				have: DID_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-57',
			form: 'question',
			prompt: 'Як ти думаєш, нам доведеться чекати?',
			answer: "Do you think we'll have to wait?",
			traps: {
				have: WILL_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-58',
			form: 'question',
			prompt: 'Їй доведеться вчити нову мову, коли вона переїде?',
			answer: 'Will she have to learn a new language when she moves?',
			traps: {
				have: WILL_HAVE,
				moves: ['will', 'move'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-59',
			form: 'question',
			prompt: 'Як ви думаєте, йому доведеться залишитися в лікарні?',
			answer: "Do you think he'll have to stay in hospital?",
			accept: ["Do you think he'll have to stay in {the|} hospital?"],
			traps: {
				have: WILL_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-60',
			form: 'question',
			prompt: "Мені обов'язково приходити завтра?",
			answer: 'Do I have to come tomorrow?',
			accept: ['{Do I have to|Do I need to|Must I} come tomorrow?'],
			traps: {
				Do: ['Does', 'Am'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-61',
			form: 'question',
			prompt: "Їй обов'язково носити форму в школі?",
			answer: 'Does she have to wear a uniform at school?',
			accept: ['Does she {have|need} to wear a uniform at school?'],
			traps: {
				Does: ['Do', 'Is'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-62',
			form: 'question',
			prompt: 'Тобі доводиться працювати по суботах?',
			answer: 'Do you have to work on Saturdays?',
			traps: {
				Do: ['Does', 'Are'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-63',
			form: 'question',
			prompt: 'Чому тобі доводиться так рано вставати?',
			answer: 'Why do you have to get up so early?',
			traps: {
				do: ['does', 'are'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-64',
			form: 'question',
			prompt: 'О котрій годині твоєму братові доводиться починати роботу?',
			answer: 'What time does your brother have to start work?',
			accept: [
				'{What time|At what time} does your brother have to {start|begin} work?',
			],
			traps: {
				does: ['do', 'is'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-65',
			form: 'question',
			prompt: "Мені обов'язково заповнювати цей бланк?",
			answer: 'Do I have to fill in this form?',
			accept: ['{Do I have to|Do I need to|Must I} fill {in|out} this form?'],
			traps: {
				Do: ['Does', 'Am'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-66',
			form: 'question',
			prompt: 'Скільки годин на день тобі доводиться працювати?',
			answer: 'How many hours a day do you have to work?',
			accept: ['How many hours {a|per} day do you have to work?'],
			traps: {
				do: ['does', 'are'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-67',
			form: 'question',
			prompt: 'Твоєму синові доводиться носити окуляри?',
			answer: 'Does your son have to wear glasses?',
			traps: {
				Does: ['Do', 'Is'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-68',
			form: 'question',
			prompt: 'Як часто тобі доводиться їздити до Києва?',
			answer: 'How often do you have to go to Kyiv?',
			accept: ['How often do you have to {go|travel} to Kyiv?'],
			traps: {
				do: ['does', 'are'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-69',
			form: 'question',
			prompt: "Мені обов'язково відповідати на це питання?",
			answer: 'Do I have to answer this question?',
			accept: ['{Do I have to|Do I need to|Must I} answer this question?'],
			traps: {
				Do: ['Does', 'Am'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-70',
			form: 'question',
			prompt: "Студентам обов'язково купувати цю книжку?",
			answer: 'Do students have to buy this book?',
			accept: ['Do students {have|need} to buy this book?'],
			traps: {
				Do: ['Does', 'Are'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-71',
			form: 'question',
			prompt: 'Що тобі доводиться робити на роботі?',
			answer: 'What do you have to do at work?',
			traps: {
				do: ['does', 'are'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-72',
			form: 'question',
			prompt: "Нам обов'язково бронювати столик заздалегідь?",
			answer: 'Do we have to book a table in advance?',
			accept: ['Do we {have|need} to {book|reserve} a table in advance?'],
			traps: {
				Do: ['Does', 'Are'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-73',
			form: 'question',
			prompt: 'Твоїй сестрі доводиться багато подорожувати?',
			answer: 'Does your sister have to travel a lot?',
			traps: {
				Does: ['Do', 'Is'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-74',
			form: 'question',
			prompt: 'Чому йому завжди доводиться працювати допізна?',
			answer: 'Why does he always have to work late?',
			traps: {
				does: ['do', 'is'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-75',
			form: 'question',
			prompt: "Нам обов'язково говорити англійською на уроці?",
			answer: 'Do we have to speak English in class?',
			accept: [
				'Do we {have|need} to speak English {in class|in the lesson|during the lesson}?',
			],
			traps: {
				Do: ['Does', 'Are'],
				have: DO_HAVE,
			},
		},
		{
			id: 'modal-verbs-must-have-to-76',
			form: 'negative',
			prompt: 'Тобі не можна тут палити.',
			answer: "You mustn't smoke here.",
			accept: ["You {mustn't|can't} smoke here."],
			traps: {
				"mustn't": MUSTNT,
				smoke: ['to', 'smoking'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-77',
			form: 'negative',
			prompt: 'Тобі не можна нікому про це розповідати.',
			answer: "You mustn't tell anyone about it.",
			accept: ["You {mustn't|can't} tell {anyone|anybody} about {it|this}."],
			traps: {
				"mustn't": MUSTNT,
				tell: ['to', 'telling'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-78',
			form: 'negative',
			prompt: 'Пасажирам заборонено розмовляти з водієм.',
			answer: "Passengers mustn't talk to the driver.",
			accept: [
				"Passengers {mustn't|aren't allowed to} {talk|speak} to the driver.",
			],
			traps: {
				"mustn't": ["don't", "doesn't", "haven't"],
				talk: ['to', 'talking'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-79',
			form: 'negative',
			prompt: 'Нам не можна запізнюватися.',
			answer: "We mustn't be late.",
			accept: ["We {mustn't|can't} be late."],
			traps: {
				"mustn't": ["don't", "doesn't", "haven't"],
				be: ['to', 'are', 'being'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-80',
			form: 'negative',
			prompt: 'Тобі не можна пити каву після шостої.',
			answer: "You mustn't drink coffee after six.",
			accept: ["You {mustn't|can't} drink coffee after six."],
			traps: {
				"mustn't": MUSTNT,
				drink: ['to', 'drinking'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-81',
			form: 'negative',
			prompt: 'Дітям не можна гратися з сірниками.',
			answer: "Children mustn't play with matches.",
			accept: ["Children {mustn't|can't} play with matches."],
			traps: {
				"mustn't": ["don't", "doesn't", "haven't"],
				play: ['to', 'playing'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-82',
			form: 'negative',
			prompt: 'Я ні в якому разі не повинен забути її день народження.',
			answer: "I mustn't forget her birthday.",
			traps: {
				"mustn't": ["don't", "haven't", "musn't"],
				forget: ['to', 'forgot'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-83',
			form: 'negative',
			prompt: 'Відвідувачам заборонено торкатися картин.',
			answer: "Visitors mustn't touch the paintings.",
			accept: [
				"Visitors {mustn't|aren't allowed to} touch the {paintings|pictures}.",
			],
			traps: {
				"mustn't": ["don't", "doesn't", "haven't"],
				touch: ['to', 'touching'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-84',
			form: 'negative',
			prompt: 'Тобі не можна відкривати цей лист.',
			answer: "You mustn't open this letter.",
			accept: ["You {mustn't|can't} open this letter."],
			traps: {
				"mustn't": MUSTNT,
				open: ['to', 'opening'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-85',
			form: 'negative',
			prompt: 'Тобі не можна піднімати важкі речі.',
			answer: "You mustn't lift heavy things.",
			accept: ["You {mustn't|can't} lift heavy {things|objects}."],
			traps: {
				"mustn't": MUSTNT,
				lift: ['to', 'lifting'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-86',
			form: 'negative',
			prompt: "Тобі не обов'язково приходити завтра.",
			answer: "You don't have to come tomorrow.",
			accept: ["You don't {have|need} to come tomorrow."],
			traps: {
				"don't": ["mustn't", "doesn't", "aren't"],
				have: ['has', 'must'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-87',
			form: 'negative',
			prompt: 'Їй не треба працювати в неділю.',
			answer: "She doesn't have to work on Sunday.",
			accept: ["She doesn't {have|need} to work on {Sunday|Sundays}."],
			traps: {
				"doesn't": ["don't", "mustn't", "isn't"],
				have: ['has', 'must'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-88',
			form: 'negative',
			prompt: "Нам не обов'язково купувати квитки заздалегідь.",
			answer: "We don't have to buy tickets in advance.",
			accept: ["We don't {have|need} to buy {the|} tickets in advance."],
			traps: {
				"don't": ["mustn't", "doesn't", "aren't"],
				have: ['has', 'must'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-89',
			form: 'negative',
			prompt: 'Тобі не треба мені допомагати.',
			answer: "You don't have to help me.",
			accept: ["You don't {have|need} to help me."],
			traps: {
				"don't": ["mustn't", "doesn't", "aren't"],
				have: ['has', 'must'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-90',
			form: 'negative',
			prompt: "Йому не обов'язково носити костюм на роботу.",
			answer: "He doesn't have to wear a suit to work.",
			accept: ["He doesn't {have|need} to wear a suit {to|at} work."],
			traps: {
				"doesn't": ["don't", "mustn't", "isn't"],
				have: ['has', 'must'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-91',
			form: 'negative',
			prompt: 'Не хвилюйся, тобі не треба нічого платити.',
			answer: "Don't worry, you don't have to pay anything.",
			accept: ["Don't worry, you don't {have|need} to pay anything."],
			traps: {
				have: ['has', 'must'],
				pay: ['paid', 'paying'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-92',
			form: 'negative',
			prompt: "Мені не обов'язково вставати рано в суботу.",
			answer: "I don't have to get up early on Saturday.",
			accept: ["I don't {have|need} to get up early on {Saturday|Saturdays}."],
			traps: {
				"don't": ["mustn't", "doesn't", "haven't"],
				have: ['has', 'must'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-93',
			form: 'negative',
			prompt: "Студентам не обов'язково носити форму.",
			answer: "Students don't have to wear a uniform.",
			accept: ["Students don't {have|need} to wear {a uniform|uniforms}."],
			traps: {
				"don't": ["mustn't", "doesn't", "aren't"],
				have: ['has', 'must'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-94',
			form: 'negative',
			prompt: 'Моїй мамі не треба вставати рано.',
			answer: "My mum doesn't have to get up early.",
			accept: ["My {mum|mom|mother} doesn't {have|need} to get up early."],
			traps: {
				"doesn't": ["don't", "mustn't", "isn't"],
				have: ['has', 'must'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-95',
			form: 'negative',
			prompt: 'Учора мені не довелося готувати вечерю.',
			answer: "Yesterday I didn't have to cook dinner.",
			accept: ["Yesterday I didn't have to {cook|make} dinner."],
			traps: {
				"didn't": ["mustn't", "don't", "wasn't"],
				have: ['had', 'has'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-96',
			form: 'negative',
			prompt: 'Нам не довелося довго чекати.',
			answer: "We didn't have to wait long.",
			accept: ["We didn't have to wait {long|a long time|for a long time}."],
			traps: {
				"didn't": ["mustn't", "don't", "weren't"],
				have: ['had', 'has'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-97',
			form: 'negative',
			prompt: 'Їй не довелося нічого платити.',
			answer: "She didn't have to pay anything.",
			traps: {
				"didn't": ["mustn't", "doesn't", "wasn't"],
				have: ['had', 'has'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-98',
			form: 'negative',
			prompt: 'Минулого тижня Іванові не довелося працювати.',
			answer: "Last week Ivan didn't have to work.",
			traps: {
				"didn't": ["mustn't", "doesn't", "wasn't"],
				have: ['had', 'has'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-99',
			form: 'negative',
			prompt: 'Якщо ти мені допоможеш, мені не доведеться працювати вночі.',
			answer: "If you help me, I won't have to work at night.",
			traps: {
				"won't": ["mustn't", "didn't"],
				have: ['had', 'has'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-100',
			form: 'negative',
			prompt: 'Якщо ми поїдемо зараз, нам не доведеться поспішати.',
			answer: "If we leave now, we won't have to hurry.",
			accept: ["If we {leave|go} now, we won't have to hurry."],
			traps: {
				"won't": ["mustn't", "didn't"],
				have: ['had', 'has'],
			},
		},
	],
})
