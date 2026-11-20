import { defineTopic } from '../../define-topic'

const MIGHT = ['mights', 'maybe', 'mays']
const MAY = ['mays', 'maybe', 'mights']
const MAY_Q = ['Maybe', 'Mays', 'Mights']
const BE = ['is', 'being', 'been']
const NOT = ['no', "don't", "doesn't"]
const THINK = ['thinks', 'thinking']

export const modalVerbsMayMight = defineTopic({
	id: 'modal-verbs-may-might',
	level: 'intermediate',
	title: 'Modal verbs (May/Might)',
	subtitle: 'Модальні дієслова may/might',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				'may/might + дієслово без to — можливість («може», «можливо»). Для всіх осіб форма однакова: без -s, без -ing, без минулого часу. Для можливості may і might зазвичай обидва правильні; might — трохи менш певно. Could теж часто означає можливість.',
			examples: [
				{
					text: 'The shop might be busy on Saturday.',
					translation: 'У суботу в магазині може бути багато людей.',
				},
				{
					text: 'We may visit our cousins in June.',
					translation: 'Можливо, ми відвідаємо двоюрідних братів у червні.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'May I…? / May we…? — ввічливе прохання дозволу («Можна мені…?»). Can I…? і Could I…? теж природні. Про можливість питають не через May, а так: Do you think + підмет + might + дієслово?',
			examples: [
				{
					text: 'May I sit next to you?',
					translation: 'Можна мені сісти поруч із тобою?',
				},
				{
					text: 'Do you think the shop might be busy?',
					translation: 'Ти думаєш, у магазині може бути багато людей?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"may not / might not + дієслово — можливо, щось не станеться («може не…»). may not також означає заборону («не можна», «не дозволено»), як і cannot чи must not. Скорочення mightn't рідкісне — пишіть повністю.",
			examples: [
				{
					text: 'The parcel might not arrive today.',
					translation: 'Посилка може не прийти сьогодні.',
				},
				{
					text: 'Students may not leave before the bell.',
					translation: 'Учням не дозволено виходити до дзвоника.',
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				'Не плутайте maybe (одне слово, «можливо», стоїть на початку речення) і may be (модальне дієслово + be): Maybe he is busy = He may be busy. Ніколи не кажіть may to, mays чи might + -ing.',
			examples: [
				{
					text: 'Maybe the keys are in the car.',
					translation: 'Можливо, ключі в машині.',
				},
				{
					text: 'The keys may be in the car.',
					translation: 'Ключі можуть бути в машині.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'modal-verbs-may-might-1',
			form: 'question',
			prompt: 'Можна мені увійти?',
			answer: 'May I come in?',
			accept: ['{Can|Could} I come in?'],
			traps: {
				come: ['coming', 'came'],
			},
		},
		{
			id: 'modal-verbs-may-might-2',
			form: 'affirmative',
			prompt: 'Можливо, сьогодні піде дощ.',
			answer: 'It might rain today.',
			accept: ['It {may|could} rain today.'],
			traps: {
				rain: ['rains', 'raining', 'rained'],
			},
		},
		{
			id: 'modal-verbs-may-might-3',
			form: 'affirmative',
			prompt: 'Він може запізнитися.',
			answer: 'He might be late.',
			accept: ['He {may|might|could} be late.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-4',
			form: 'affirmative',
			prompt: 'Вона може бути вдома.',
			answer: 'She might be at home.',
			accept: ['She {may|might|could} be {at|} home.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-5',
			form: 'affirmative',
			prompt: 'Це може бути правдою.',
			answer: 'It may be true.',
			accept: ['It {may|might|could} be true.'],
			traps: {
				may: MAY,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-6',
			form: 'affirmative',
			prompt: 'Завтра може піти сніг.',
			answer: 'It might snow tomorrow.',
			accept: [
				'It {may|might|could} snow tomorrow.',
				'Tomorrow it {may|might|could} snow.',
			],
			traps: {
				might: MIGHT,
				snow: ['snows', 'snowing', 'snowed'],
			},
		},
		{
			id: 'modal-verbs-may-might-7',
			form: 'affirmative',
			prompt: 'Ти можеш застудитися.',
			answer: 'You might catch a cold.',
			accept: ['You {may|might|could} catch a cold.'],
			traps: {
				might: MIGHT,
				catch: ['catches', 'caught', 'catching'],
			},
		},
		{
			id: 'modal-verbs-may-might-8',
			form: 'affirmative',
			prompt: 'Автобус може запізнитися.',
			answer: 'The bus may be late.',
			accept: ['The bus {may|might|could} be late.'],
			traps: {
				may: MAY,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-9',
			form: 'affirmative',
			prompt: 'Можливо, він подзвонить пізніше.',
			answer: 'He might call later.',
			accept: [
				'He {may|might} call later.',
				"{Maybe|Perhaps} he'll call later.",
			],
			traps: {
				might: MIGHT,
				call: ['calls', 'calling', 'called'],
			},
		},
		{
			id: 'modal-verbs-may-might-10',
			form: 'affirmative',
			prompt: 'Можливо, ми поїдемо до Італії цього літа.',
			answer: 'We might go to Italy this summer.',
			accept: [
				'We {may|might} go to Italy this summer.',
				"{Maybe|Perhaps} we'll go to Italy this summer.",
			],
			traps: {
				might: MIGHT,
				go: ['goes', 'going', 'went'],
			},
		},
		{
			id: 'modal-verbs-may-might-11',
			form: 'affirmative',
			prompt: 'Вона може передумати.',
			answer: 'She might change her mind.',
			accept: ['She {may|might|could} change her mind.'],
			traps: {
				might: MIGHT,
				change: ['changes', 'changed', 'changing'],
			},
		},
		{
			id: 'modal-verbs-may-might-12',
			form: 'affirmative',
			prompt: 'Ця сукня може бути замалою.',
			answer: 'This dress might be too small.',
			accept: ['This dress {may|might|could} be too small.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-13',
			form: 'affirmative',
			prompt: 'Можливо, я куплю новий ноутбук.',
			answer: 'I might buy a new laptop.',
			accept: [
				'I {may|might} buy a new laptop.',
				"{Maybe|Perhaps} I'll buy a new laptop.",
			],
			traps: {
				might: MIGHT,
				buy: ['buys', 'bought', 'buying'],
			},
		},
		{
			id: 'modal-verbs-may-might-14',
			form: 'affirmative',
			prompt: 'Мій син може бути голодним.',
			answer: 'My son might be hungry.',
			accept: ['My son {may|might|could} be hungry.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-15',
			form: 'affirmative',
			prompt: 'Можливо, вони переїдуть до Львова.',
			answer: 'They may move to Lviv.',
			accept: [
				'They {may|might} move to Lviv.',
				"{Maybe|Perhaps} they'll move to Lviv.",
			],
			traps: {
				may: MAY,
				move: ['moves', 'moved', 'moving'],
			},
		},
		{
			id: 'modal-verbs-may-might-16',
			form: 'affirmative',
			prompt: 'Квитки можуть бути дорогими.',
			answer: 'The tickets might be expensive.',
			accept: ['The tickets {may|might|could} be expensive.'],
			traps: {
				might: MIGHT,
				be: ['are', 'being', 'been'],
			},
		},
		{
			id: 'modal-verbs-may-might-17',
			form: 'affirmative',
			prompt: 'Ця змія може бути небезпечною.',
			answer: 'This snake may be dangerous.',
			accept: ['This snake {may|might|could} be dangerous.'],
			traps: {
				may: MAY,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-18',
			form: 'affirmative',
			prompt: 'Відповідь може тебе здивувати.',
			answer: 'The answer might surprise you.',
			accept: ['The answer {may|might|could} surprise you.'],
			traps: {
				might: MIGHT,
				surprise: ['surprises', 'surprised', 'surprising'],
			},
		},
		{
			id: 'modal-verbs-may-might-19',
			form: 'affirmative',
			prompt: 'Він може заблукати в місті.',
			answer: 'He might get lost in the city.',
			accept: ['He {may|might|could} get lost in the city.'],
			traps: {
				might: MIGHT,
				get: ['gets', 'got', 'getting'],
			},
		},
		{
			id: 'modal-verbs-may-might-20',
			form: 'affirmative',
			prompt: 'Можливо, я працюватиму допізна.',
			answer: 'I might work late.',
			accept: ['I {may|might} work late.', "{Maybe|Perhaps} I'll work late."],
			traps: {
				might: MIGHT,
				work: ['works', 'worked', 'working'],
			},
		},
		{
			id: 'modal-verbs-may-might-21',
			form: 'affirmative',
			prompt: 'Ти можеш упасти з драбини.',
			answer: 'You might fall off the ladder.',
			accept: ['You {may|might|could} fall {off|from} the ladder.'],
			traps: {
				might: MIGHT,
				fall: ['falls', 'fell', 'falling'],
			},
		},
		{
			id: 'modal-verbs-may-might-22',
			form: 'affirmative',
			prompt: 'Ці гриби можуть бути отруйними.',
			answer: 'These mushrooms may be poisonous.',
			accept: ['These mushrooms {may|might|could} be poisonous.'],
			traps: {
				may: MAY,
				be: ['are', 'being', 'been'],
			},
		},
		{
			id: 'modal-verbs-may-might-23',
			form: 'affirmative',
			prompt: 'Можливо, вона стане лікарем.',
			answer: 'She might become a doctor.',
			accept: [
				'She {may|might} become a doctor.',
				"{Maybe|Perhaps} she'll become a doctor.",
			],
			traps: {
				might: MIGHT,
				become: ['becomes', 'became', 'becoming'],
			},
		},
		{
			id: 'modal-verbs-may-might-24',
			form: 'affirmative',
			prompt: 'Ресторан може бути зачинений у понеділок.',
			answer: 'The restaurant might be closed on Monday.',
			accept: ['The restaurant {may|might|could} be closed on Monday.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-25',
			form: 'affirmative',
			prompt: 'Можливо, мій брат нам допоможе.',
			answer: 'My brother might help us.',
			accept: [
				'My brother {may|might} help us.',
				'{Maybe|Perhaps} my brother will help us.',
			],
			traps: {
				might: MIGHT,
				help: ['helps', 'helped', 'helping'],
			},
		},
		{
			id: 'modal-verbs-may-might-26',
			form: 'affirmative',
			prompt: 'Зустріч може тривати дві години.',
			answer: 'The meeting may last two hours.',
			accept: ['The meeting {may|might|could} last two hours.'],
			traps: {
				may: MAY,
				last: ['lasts', 'lasted', 'lasting'],
			},
		},
		{
			id: 'modal-verbs-may-might-27',
			form: 'affirmative',
			prompt: 'Він може бути на роботі.',
			answer: 'He might be at work.',
			accept: ['He {may|might|could} be at work.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-28',
			form: 'affirmative',
			prompt: 'Вона може бути втомленою після подорожі.',
			answer: 'She might be tired after the trip.',
			accept: ['She {may|might|could} be tired after the {trip|journey}.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-29',
			form: 'affirmative',
			prompt: 'Можливо, я подзвоню тобі завтра.',
			answer: 'I might call you tomorrow.',
			accept: [
				'I {may|might} call you tomorrow.',
				"{Maybe|Perhaps} I'll call you tomorrow.",
			],
			traps: {
				might: MIGHT,
				call: ['calls', 'called', 'calling'],
			},
		},
		{
			id: 'modal-verbs-may-might-30',
			form: 'affirmative',
			prompt: 'Ліки можуть допомогти.',
			answer: 'The medicine may help.',
			accept: ['The medicine {may|might|could} help.'],
			traps: {
				may: MAY,
				help: ['helps', 'helped', 'helping'],
			},
		},
		{
			id: 'modal-verbs-may-might-31',
			form: 'affirmative',
			prompt: 'Ми можемо спізнитися на потяг.',
			answer: 'We might miss the train.',
			accept: ['We {may|might|could} {miss the train|be late for the train}.'],
			traps: {
				might: MIGHT,
				miss: ['misses', 'missed', 'missing'],
			},
		},
		{
			id: 'modal-verbs-may-might-32',
			form: 'affirmative',
			prompt: 'Він може бути хворим.',
			answer: 'He might be ill.',
			accept: ['He {may|might|could} be {ill|sick}.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-33',
			form: 'affirmative',
			prompt: 'Тобі може сподобатися ця книжка.',
			answer: 'You might like this book.',
			accept: ['You {may|might} like this book.'],
			traps: {
				might: MIGHT,
				like: ['likes', 'liked', 'liking'],
			},
		},
		{
			id: 'modal-verbs-may-might-34',
			form: 'affirmative',
			prompt: 'Тест може бути складним.',
			answer: 'The test might be difficult.',
			accept: ['The test {may|might|could} be {difficult|hard}.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-35',
			form: 'affirmative',
			prompt: 'Можливо, вони одружаться наступного року.',
			answer: 'They might get married next year.',
			accept: [
				'They {may|might} get married next year.',
				"{Maybe|Perhaps} they'll get married next year.",
			],
			traps: {
				might: MIGHT,
				get: ['gets', 'got', 'getting'],
			},
		},
		{
			id: 'modal-verbs-may-might-36',
			form: 'affirmative',
			prompt: 'Ваш рейс може бути скасований.',
			answer: 'Your flight may be cancelled.',
			accept: ['Your flight {may|might|could} be {cancelled|canceled}.'],
			traps: {
				may: MAY,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-37',
			form: 'affirmative',
			prompt: 'Сусіди можуть нас почути.',
			answer: 'The neighbours might hear us.',
			accept: ['The {neighbours|neighbors} {may|might|could} hear us.'],
			traps: {
				might: MIGHT,
				hear: ['hears', 'heard', 'hearing'],
			},
		},
		{
			id: 'modal-verbs-may-might-38',
			form: 'affirmative',
			prompt: 'Можливо, я продам свою машину.',
			answer: 'I might sell my car.',
			accept: [
				'I {may|might} sell my car.',
				"{Maybe|Perhaps} I'll sell my car.",
			],
			traps: {
				might: MIGHT,
				sell: ['sells', 'sold', 'selling'],
			},
		},
		{
			id: 'modal-verbs-may-might-39',
			form: 'affirmative',
			prompt: 'Він може бути в бібліотеці.',
			answer: 'He might be in the library.',
			accept: ['He {may|might|could} be {in|at} the library.'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-40',
			form: 'affirmative',
			prompt: 'Можливо, вона знає відповідь.',
			answer: 'She might know the answer.',
			accept: [
				'She {may|might} know the answer.',
				'{Maybe|Perhaps} she knows the answer.',
			],
			traps: {
				might: MIGHT,
				know: ['knows', 'knew', 'knowing'],
			},
		},
		{
			id: 'modal-verbs-may-might-41',
			form: 'affirmative',
			prompt: 'Ці гроші можуть нам знадобитися.',
			answer: 'We might need this money.',
			accept: ['We {may|might} need this money.'],
			traps: {
				might: MIGHT,
				need: ['needs', 'needed', 'needing'],
			},
		},
		{
			id: 'modal-verbs-may-might-42',
			form: 'affirmative',
			prompt: 'Собака може тебе вкусити.',
			answer: 'The dog might bite you.',
			accept: ['The dog {may|might|could} bite you.'],
			traps: {
				might: MIGHT,
				bite: ['bites', 'bit', 'biting'],
			},
		},
		{
			id: 'modal-verbs-may-might-43',
			form: 'affirmative',
			prompt: 'Можливо, він живе в Києві.',
			answer: 'He may live in Kyiv.',
			accept: [
				'He {may|might} live in Kyiv.',
				'{Maybe|Perhaps} he lives in Kyiv.',
			],
			traps: {
				may: MAY,
				live: ['lives', 'lived', 'living'],
			},
		},
		{
			id: 'modal-verbs-may-might-44',
			form: 'affirmative',
			prompt: 'Ти можеш пошкодувати про це.',
			answer: 'You might regret it.',
			accept: ['You {may|might|could} regret {it|this}.'],
			traps: {
				might: MIGHT,
				regret: ['regrets', 'regretted', 'regretting'],
			},
		},
		{
			id: 'modal-verbs-may-might-45',
			form: 'affirmative',
			prompt: 'Можливо, я навчуся грати на гітарі.',
			answer: 'I might learn to play the guitar.',
			accept: [
				'I {may|might} learn to play {the|} guitar.',
				"{Maybe|Perhaps} I'll learn to play {the|} guitar.",
			],
			traps: {
				might: MIGHT,
				learn: ['learns', 'learned', 'learning'],
			},
		},
		{
			id: 'modal-verbs-may-might-46',
			form: 'affirmative',
			prompt: 'Можливо, Олена спече торт.',
			answer: 'Olena might bake a cake.',
			accept: [
				'Olena {may|might} bake a cake.',
				'{Maybe|Perhaps} Olena will bake a cake.',
			],
			traps: {
				might: MIGHT,
				bake: ['bakes', 'baked', 'baking'],
			},
		},
		{
			id: 'modal-verbs-may-might-47',
			form: 'question',
			prompt: 'Можна мені сісти тут?',
			answer: 'May I sit here?',
			accept: ['{May|Can|Could} I sit here?'],
			traps: {
				may: MAY_Q,
				sit: ['to', 'sitting', 'sat'],
			},
		},
		{
			id: 'modal-verbs-may-might-48',
			form: 'question',
			prompt: 'Можна мені відкрити вікно?',
			answer: 'May I open the window?',
			accept: ['{May|Can|Could} I open the window?'],
			traps: {
				may: MAY_Q,
				open: ['to', 'opening', 'opened'],
			},
		},
		{
			id: 'modal-verbs-may-might-49',
			form: 'question',
			prompt: 'Можна мені поставити вам питання?',
			answer: 'May I ask you a question?',
			accept: ['{May|Can|Could} I ask you a question?'],
			traps: {
				may: MAY_Q,
				ask: ['to', 'asking', 'asked'],
			},
		},
		{
			id: 'modal-verbs-may-might-50',
			form: 'question',
			prompt: 'Можна мені скористатися вашим телефоном?',
			answer: 'May I use your phone?',
			accept: ['{May|Can|Could} I use your phone?'],
			traps: {
				may: MAY_Q,
				use: ['to', 'using', 'used'],
			},
		},
		{
			id: 'modal-verbs-may-might-51',
			form: 'question',
			prompt: 'Можна мені зачинити двері?',
			answer: 'May I close the door?',
			accept: ['{May|Can|Could} I close the door?'],
			traps: {
				may: MAY_Q,
				close: ['to', 'closing', 'closed'],
			},
		},
		{
			id: 'modal-verbs-may-might-52',
			form: 'question',
			prompt: 'Можна мені ввімкнути світло?',
			answer: 'May I turn on the light?',
			accept: [
				'{May|Can|Could} I {turn|switch} on the light?',
				'{May|Can|Could} I {turn|switch} the light on?',
			],
			traps: {
				may: MAY_Q,
				turn: ['to', 'turning', 'turned'],
			},
		},
		{
			id: 'modal-verbs-may-might-53',
			form: 'question',
			prompt: 'Можна мені заплатити карткою?',
			answer: 'May I pay by card?',
			accept: ['{May|Can|Could} I pay {by|with a} card?'],
			traps: {
				may: MAY_Q,
				pay: ['to', 'paying', 'paid'],
			},
		},
		{
			id: 'modal-verbs-may-might-54',
			form: 'question',
			prompt: 'Можна мені вам допомогти?',
			answer: 'May I help you?',
			accept: ['{May|Can} I help you?'],
			traps: {
				may: MAY_Q,
				help: ['to', 'helping', 'helped'],
			},
		},
		{
			id: 'modal-verbs-may-might-55',
			form: 'question',
			prompt: 'Можна мені прочитати твій лист?',
			answer: 'May I read your letter?',
			accept: ['{May|Can|Could} I read your letter?'],
			traps: {
				may: MAY_Q,
				read: ['to', 'reading', 'reads'],
			},
		},
		{
			id: 'modal-verbs-may-might-56',
			form: 'question',
			prompt: 'Можна мені позичити твою парасольку?',
			answer: 'May I borrow your umbrella?',
			accept: ['{May|Can|Could} I borrow your umbrella?'],
			traps: {
				may: MAY_Q,
				borrow: ['to', 'borrowing', 'borrowed'],
			},
		},
		{
			id: 'modal-verbs-may-might-57',
			form: 'question',
			prompt: 'Можна мені сьогодні піти раніше?',
			answer: 'May I leave early today?',
			accept: ['{May|Can|Could} I leave {early|earlier} today?'],
			traps: {
				may: MAY_Q,
				leave: ['to', 'leaving', 'left'],
			},
		},
		{
			id: 'modal-verbs-may-might-58',
			form: 'question',
			prompt: 'Можна мені поговорити з менеджером?',
			answer: 'May I speak to the manager?',
			accept: ['{May|Can|Could} I {speak|talk} {to|with} the manager?'],
			traps: {
				may: MAY_Q,
				speak: ['to', 'speaking', 'spoke'],
			},
		},
		{
			id: 'modal-verbs-may-might-59',
			form: 'question',
			prompt: 'Можна мені вас сфотографувати?',
			answer: 'May I take a photo of you?',
			accept: ['{May|Can|Could} I take a {photo|picture} of you?'],
			traps: {
				may: MAY_Q,
				take: ['to', 'taking', 'took'],
			},
		},
		{
			id: 'modal-verbs-may-might-60',
			form: 'question',
			prompt: 'Можна мені подивитися телевізор?',
			answer: 'May I watch TV?',
			accept: ['{May|Can|Could} I watch TV?'],
			traps: {
				may: MAY_Q,
				watch: ['to', 'watching', 'watched'],
			},
		},
		{
			id: 'modal-verbs-may-might-61',
			form: 'question',
			prompt: 'Можна мені погратися надворі?',
			answer: 'May I play outside?',
			accept: ['{May|Can|Could} I play outside?'],
			traps: {
				may: MAY_Q,
				play: ['to', 'playing', 'played'],
			},
		},
		{
			id: 'modal-verbs-may-might-62',
			form: 'question',
			prompt: 'Можна нам запросити друзів?',
			answer: 'May we invite friends?',
			accept: ['{May|Can|Could} we invite {our|} friends?'],
			traps: {
				may: MAY_Q,
				invite: ['to', 'inviting', 'invited'],
			},
		},
		{
			id: 'modal-verbs-may-might-63',
			form: 'question',
			prompt: 'Можна мені прийти завтра?',
			answer: 'May I come tomorrow?',
			accept: ['{May|Can|Could} I come tomorrow?'],
			traps: {
				may: MAY_Q,
				come: ['to', 'coming', 'came'],
			},
		},
		{
			id: 'modal-verbs-may-might-64',
			form: 'question',
			prompt: 'Можна мені залишити тут свою сумку?',
			answer: 'May I leave my bag here?',
			accept: ['{May|Can|Could} I leave my bag here?'],
			traps: {
				may: MAY_Q,
				leave: ['to', 'leaving', 'left'],
			},
		},
		{
			id: 'modal-verbs-may-might-65',
			form: 'question',
			prompt: 'Можна мені скуштувати суп?',
			answer: 'May I try the soup?',
			accept: ['{May|Can|Could} I {try|taste} the soup?'],
			traps: {
				may: MAY_Q,
				try: ['to', 'trying', 'tried'],
			},
		},
		{
			id: 'modal-verbs-may-might-66',
			form: 'question',
			prompt: 'Можна мені позичити твій словник?',
			answer: 'May I borrow your dictionary?',
			accept: ['{May|Can|Could} I borrow your dictionary?'],
			traps: {
				may: MAY_Q,
				borrow: ['to', 'borrows', 'borrowed'],
			},
		},
		{
			id: 'modal-verbs-may-might-67',
			form: 'question',
			prompt: 'Можна нам піти додому?',
			answer: 'May we go home?',
			accept: ['{May|Can|Could} we go home?'],
			traps: {
				may: MAY_Q,
				go: ['to', 'going', 'went'],
			},
		},
		{
			id: 'modal-verbs-may-might-68',
			form: 'question',
			prompt: 'Ти думаєш, він може запізнитися?',
			answer: 'Do you think he might be late?',
			accept: ['Do you think {that|} he {may|might|could} be late?'],
			traps: {
				think: THINK,
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-69',
			form: 'question',
			prompt: 'Ти думаєш, може піти дощ?',
			answer: 'Do you think it might rain?',
			accept: ['Do you think {that|} it {may|might|could} rain?'],
			traps: {
				might: MIGHT,
				rain: ['rains', 'raining', 'rained'],
			},
		},
		{
			id: 'modal-verbs-may-might-70',
			form: 'question',
			prompt: 'Ти думаєш, вона може бути вдома?',
			answer: 'Do you think she might be at home?',
			accept: ['Do you think {that|} she {may|might|could} be {at|} home?'],
			traps: {
				think: THINK,
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-71',
			form: 'question',
			prompt: 'Ти думаєш, це може бути правдою?',
			answer: 'Do you think it might be true?',
			accept: ['Do you think {that|} {it|this} {may|might|could} be true?'],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-72',
			form: 'question',
			prompt: 'Ти думаєш, вони можуть передумати?',
			answer: 'Do you think they might change their minds?',
			accept: [
				'Do you think {that|} they {may|might|could} change their {minds|mind}?',
			],
			traps: {
				might: MIGHT,
				change: ['changes', 'changed', 'changing'],
			},
		},
		{
			id: 'modal-verbs-may-might-73',
			form: 'question',
			prompt: 'Ти думаєш, вода може бути холодною?',
			answer: 'Do you think the water might be cold?',
			accept: ['Do you think {that|} the water {may|might|could} be cold?'],
			traps: {
				think: THINK,
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-74',
			form: 'question',
			prompt: 'Ти думаєш, магазин може бути зачинений?',
			answer: 'Do you think the shop might be closed?',
			accept: [
				'Do you think {that|} the {shop|store} {may|might|could} be closed?',
			],
			traps: {
				might: MIGHT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-75',
			form: 'question',
			prompt: 'Ти думаєш, ми можемо спізнитися на потяг?',
			answer: 'Do you think we might miss the train?',
			accept: [
				'Do you think {that|} we {may|might|could} {miss the train|be late for the train}?',
			],
			traps: {
				think: THINK,
				might: MIGHT,
				miss: ['misses', 'missed', 'missing'],
			},
		},
		{
			id: 'modal-verbs-may-might-76',
			form: 'negative',
			prompt: 'Він може не прийти.',
			answer: 'He might not come.',
			accept: ['He {may|might} not come.'],
			traps: {
				not: NOT,
				come: ['comes', 'coming', 'came'],
			},
		},
		{
			id: 'modal-verbs-may-might-77',
			form: 'negative',
			prompt: 'Вона може не знати про це.',
			answer: 'She might not know about it.',
			accept: ['She {may|might} not know about {it|this}.'],
			traps: {
				not: NOT,
				know: ['knows', 'knew', 'knowing'],
			},
		},
		{
			id: 'modal-verbs-may-might-78',
			form: 'negative',
			prompt: 'Це може бути неправдою.',
			answer: 'It may not be true.',
			accept: ['It {may|might} not be true.'],
			traps: {
				may: MAY,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-79',
			form: 'negative',
			prompt: 'Він може не погодитися.',
			answer: 'He might not agree.',
			accept: ['He {may|might} not agree.'],
			traps: {
				not: NOT,
				agree: ['agrees', 'agreed', 'agreeing'],
			},
		},
		{
			id: 'modal-verbs-may-might-80',
			form: 'negative',
			prompt: 'Вона може не захотіти йти.',
			answer: 'She might not want to go.',
			accept: ['She {may|might} not want to go.'],
			traps: {
				not: NOT,
				want: ['wants', 'wanted', 'wanting'],
			},
		},
		{
			id: 'modal-verbs-may-might-81',
			form: 'negative',
			prompt: 'Магазин може не працювати в неділю.',
			answer: 'The shop might not be open on Sunday.',
			accept: ['The {shop|store} {may|might} not be open on Sunday.'],
			traps: {
				not: NOT,
				be: BE,
			},
		},
		{
			id: 'modal-verbs-may-might-82',
			form: 'negative',
			prompt: 'Мій план може не спрацювати.',
			answer: 'My plan might not work.',
			accept: ['My plan {may|might} not work.'],
			traps: {
				not: NOT,
				work: ['works', 'worked', 'working'],
			},
		},
		{
			id: 'modal-verbs-may-might-83',
			form: 'negative',
			prompt: "Вони можуть не пам'ятати мене.",
			answer: 'They may not remember me.',
			accept: ['They {may|might} not remember me.'],
			traps: {
				may: MAY,
				not: NOT,
				remember: ['remembers', 'remembered', 'remembering'],
			},
		},
		{
			id: 'modal-verbs-may-might-84',
			form: 'negative',
			prompt: 'Він може не мати часу.',
			answer: 'He might not have time.',
			accept: ['He {may|might} not have {the|} time.'],
			traps: {
				not: NOT,
				have: ['has', 'had', 'having'],
			},
		},
		{
			id: 'modal-verbs-may-might-85',
			form: 'negative',
			prompt: 'Можливо, я не піду на вечірку.',
			answer: 'I might not go to the party.',
			accept: [
				'I {may|might} not go to the party.',
				"{Maybe|Perhaps} I won't go to the party.",
			],
			traps: {
				not: NOT,
				go: ['goes', 'going', 'went'],
			},
		},
		{
			id: 'modal-verbs-may-might-86',
			form: 'negative',
			prompt: 'Можливо, вона не прийде на роботу завтра.',
			answer: 'She might not come to work tomorrow.',
			accept: [
				'She {may|might} not come to work tomorrow.',
				"{Maybe|Perhaps} she won't come to work tomorrow.",
			],
			traps: {
				not: NOT,
				come: ['comes', 'coming', 'came'],
			},
		},
		{
			id: 'modal-verbs-may-might-87',
			form: 'negative',
			prompt: 'Потяг може не зупинитися тут.',
			answer: 'The train may not stop here.',
			accept: ['The train {may|might} not stop here.'],
			traps: {
				may: MAY,
				not: NOT,
				stop: ['stops', 'stopped', 'stopping'],
			},
		},
		{
			id: 'modal-verbs-may-might-88',
			form: 'negative',
			prompt: 'Вони можуть нас не почути.',
			answer: 'They might not hear us.',
			accept: ['They {may|might} not hear us.'],
			traps: {
				not: NOT,
				hear: ['hears', 'heard', 'hearing'],
			},
		},
		{
			id: 'modal-verbs-may-might-89',
			form: 'negative',
			prompt: 'Можливо, він не любить рибу.',
			answer: 'He might not like fish.',
			accept: [
				'He {may|might} not like fish.',
				"{Maybe|Perhaps} he doesn't like fish.",
			],
			traps: {
				not: NOT,
				like: ['likes', 'liked', 'liking'],
			},
		},
		{
			id: 'modal-verbs-may-might-90',
			form: 'negative',
			prompt: 'Вона може тебе не впізнати.',
			answer: 'She might not recognise you.',
			accept: ['She {may|might} not {recognise|recognize} you.'],
			traps: {
				not: NOT,
				recognise: ['recognises', 'recognised', 'recognising'],
			},
		},
		{
			id: 'modal-verbs-may-might-91',
			form: 'negative',
			prompt: 'Можливо, ми не поїдемо у відпустку цього року.',
			answer: 'We might not go on holiday this year.',
			accept: [
				'We {may|might} not go on {holiday|vacation} this year.',
				"{Maybe|Perhaps} we won't go on {holiday|vacation} this year.",
			],
			traps: {
				not: NOT,
				go: ['goes', 'going', 'went'],
			},
		},
		{
			id: 'modal-verbs-may-might-92',
			form: 'negative',
			prompt: 'Він може не відповісти на твій лист.',
			answer: 'He might not answer your letter.',
			accept: ['He {may|might} not {answer|reply to} your letter.'],
			traps: {
				not: NOT,
				answer: ['answers', 'answered', 'answering'],
			},
		},
		{
			id: 'modal-verbs-may-might-93',
			form: 'negative',
			prompt: 'Можливо, вони не знають нашої адреси.',
			answer: 'They might not know our address.',
			accept: [
				'They {may|might} not know our address.',
				"{Maybe|Perhaps} they don't know our address.",
			],
			traps: {
				not: NOT,
				know: ['knows', 'knew', 'knowing'],
			},
		},
		{
			id: 'modal-verbs-may-might-94',
			form: 'negative',
			prompt: 'Тобі може не сподобатися цей фільм.',
			answer: 'You might not like this film.',
			accept: ['You {may|might} not like this {film|movie}.'],
			traps: {
				not: NOT,
				like: ['likes', 'liked', 'liking'],
			},
		},
		{
			id: 'modal-verbs-may-might-95',
			form: 'negative',
			prompt: 'Ця сукня може тобі не підійти.',
			answer: 'This dress might not fit you.',
			accept: ['This dress {may|might} not fit you.'],
			traps: {
				not: NOT,
				fit: ['fits', 'fitted', 'fitting'],
			},
		},
		{
			id: 'modal-verbs-may-might-96',
			form: 'negative',
			prompt: 'Вам не можна тут паркуватися.',
			answer: 'You may not park here.',
			accept: ['You {may not|cannot|must not|are not allowed to} park here.'],
			traps: {
				may: MAY,
				park: ['parks', 'parking', 'parked'],
			},
		},
		{
			id: 'modal-verbs-may-might-97',
			form: 'negative',
			prompt: 'Ні, тобі не можна йти на вечірку.',
			answer: 'No, you may not go to the party.',
			accept: [
				'No, you {may not|cannot|must not|are not allowed to} go to the party.',
			],
			traps: {
				may: MAY,
				go: ['goes', 'going', 'went'],
			},
		},
		{
			id: 'modal-verbs-may-might-98',
			form: 'negative',
			prompt: 'Гостям не дозволено залишатися після опівночі.',
			answer: 'Guests may not stay after midnight.',
			accept: [
				'Guests {may not|cannot|must not|are not allowed to} stay after midnight.',
			],
			traps: {
				may: MAY,
				stay: ['stays', 'staying', 'stayed'],
			},
		},
		{
			id: 'modal-verbs-may-might-99',
			form: 'negative',
			prompt: 'Відвідувачам не дозволено годувати тварин.',
			answer: 'Visitors may not feed the animals.',
			accept: [
				'Visitors {may not|cannot|must not|are not allowed to} feed the animals.',
			],
			traps: {
				may: MAY,
				feed: ['feeds', 'feeding', 'fed'],
			},
		},
		{
			id: 'modal-verbs-may-might-100',
			form: 'negative',
			prompt: 'Пасажирам не дозволено курити в літаку.',
			answer: 'Passengers may not smoke on the plane.',
			accept: [
				'Passengers {may not|cannot|must not|are not allowed to} smoke on the plane.',
			],
			traps: {
				may: MAY,
				smoke: ['smokes', 'smoking', 'smoked'],
			},
		},
	],
})
