import { defineTopic } from '../../define-topic'

export const futurePerfect = defineTopic({
	id: 'future-perfect',
	level: 'intermediate',
	title: 'Future Perfect',
	subtitle: 'Майбутній доконаний час',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Future Perfect показує дію, яка вже завершиться до певного моменту в майбутньому. Маркери: by + час (by Friday, by the end of the year), by then, by the time + Present Simple. Після by the time ніколи не ставимо will.',
			examples: [
				{
					text: 'By the time the bus comes, I will have finished my coffee.',
					translation: "До того часу, як прийде автобус, я вже доп'ю каву.",
				},
				{
					text: 'By June we will have paid off the loan.',
					translation: 'До червня ми вже виплатимо кредит.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"will have + третя форма дієслова (V3) для всіх осіб, без has. Після займенника will скорочується до 'll: I'll have, she'll have.",
			examples: [
				{
					text: "She'll have cut her hair by the wedding.",
					translation: 'До весілля вона вже підстрижеться.',
				},
				{
					text: 'By then the shop will have sold out.',
					translation: 'На той час у магазині вже все розпродадуть.',
				},
			],
		},
		{
			kind: 'question',
			explanation: 'Will + підмет + have + V3?',
			examples: [
				{
					text: 'Will he have repaired the bike by Sunday?',
					translation: 'Він уже полагодить велосипед до неділі?',
				},
				{
					text: 'How many emails will you have sent by noon?',
					translation: 'Скільки листів ти надішлеш до полудня?',
				},
			],
		},
		{
			kind: 'negative',
			explanation: "won't (will not) + have + V3.",
			examples: [
				{
					text: "They won't have painted the walls by Monday.",
					translation: 'Вони не пофарбують стіни до понеділка.',
				},
				{
					text: "I won't have packed by the time you call.",
					translation: 'Я ще не спакуюся до того часу, як ти подзвониш.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'future-perfect-1',
			form: 'affirmative',
			prompt: "До п'ятниці я вже закінчу.",
			answer: "I'll have finished by Friday.",
			accept: ["I'll {have already|already have} finished by Friday."],
			traps: {
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'future-perfect-2',
			form: 'affirmative',
			prompt: 'Коли ми приїдемо, вони вже поїдуть.',
			answer: "They'll have left by the time we arrive.",
			accept: [
				"They'll have already left by the time we arrive.",
				"{By the time|When} we arrive they'll have {already|} left.",
			],
			traps: {
				left: ['leave', 'leaved', 'leaving'],
			},
		},
		{
			id: 'future-perfect-3',
			form: 'affirmative',
			prompt: "До п'ятниці я вже закінчу цей проєкт.",
			answer: "By Friday I'll have already finished this project.",
			accept: [
				"By Friday I'll {have already|already have|have} finished this project.",
			],
			traps: {
				have: ['has', 'had'],
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'future-perfect-4',
			form: 'affirmative',
			prompt: 'До того часу, як ти прийдеш, я вже приготую вечерю.',
			answer: "By the time you come I'll have cooked dinner.",
			accept: [
				"By the time you {come|get here} I'll {have already|already have|have} {cooked|made} dinner.",
			],
			traps: {
				come: ['will', 'came', 'comes'],
				cooked: ['cook', 'cooking'],
			},
		},
		{
			id: 'future-perfect-5',
			form: 'affirmative',
			prompt: 'До травня ми вже переїдемо.',
			answer: "By May we'll have already moved.",
			accept: ["By May we'll {have already|already have|have} moved."],
			traps: {
				have: ['has', 'had'],
				moved: ['move', 'moving'],
			},
		},
		{
			id: 'future-perfect-6',
			form: 'affirmative',
			prompt: 'До того часу, як ти прокинешся, ми вже поїдемо.',
			answer: "By the time you wake up we'll have left.",
			accept: [
				"By the time you wake up we'll {have already|already have|have} {left|gone}.",
			],
			traps: {
				wake: ['will', 'woke', 'wakes'],
				left: ['leaved', 'leave', 'leaves'],
			},
		},
		{
			id: 'future-perfect-7',
			form: 'affirmative',
			prompt: 'На той час фільм уже почнеться.',
			answer: 'By then the film will have already started.',
			accept: [
				'{By then|By that time} the {film|movie} will {have already|already have|have} {started|begun}.',
			],
			traps: {
				have: ['has', 'had'],
				started: ['start', 'starts', 'starting'],
			},
		},
		{
			id: 'future-perfect-8',
			form: 'affirmative',
			prompt: 'До обіду я вже зроблю домашнє завдання.',
			answer: "By lunch I'll have already done my homework.",
			accept: [
				"By {lunch|lunchtime} I'll {have already|already have|have} done {my|the} homework.",
			],
			traps: {
				have: ['has', 'had'],
				done: ['did', 'do', 'doed'],
			},
		},
		{
			id: 'future-perfect-9',
			form: 'affirmative',
			prompt: 'До неділі вона вже прочитає цю книжку.',
			answer: "By Sunday she'll have already read this book.",
			accept: [
				"By Sunday she'll {have already|already have|have} read this book.",
			],
			traps: {
				have: ['has', 'had'],
				read: ['readed', 'reads', 'reading'],
			},
		},
		{
			id: 'future-perfect-10',
			form: 'affirmative',
			prompt: "До того часу, як ми приїдемо, вони вже з'їдять торт.",
			answer: "By the time we arrive they'll have eaten the cake.",
			accept: [
				"By the time we {arrive|get there} they'll {have already|already have|have} eaten the cake.",
			],
			traps: {
				arrive: ['will', 'arrived', 'arrives'],
				eaten: ['ate', 'eat', 'eated'],
			},
		},
		{
			id: 'future-perfect-11',
			form: 'affirmative',
			prompt: 'До понеділка він уже напише звіт.',
			answer: "By Monday he'll have already written the report.",
			accept: [
				"By Monday he'll {have already|already have|have} written the report.",
			],
			traps: {
				have: ['has', 'had'],
				written: ['wrote', 'write', 'writed'],
			},
		},
		{
			id: 'future-perfect-12',
			form: 'affirmative',
			prompt: 'До наступного літа вони вже збудують свій будинок.',
			answer: "By next summer they'll have built their house.",
			accept: [
				"By next summer they'll {have already|already have|have} built their house.",
			],
			traps: {
				have: ['has', 'had'],
				built: ['builded', 'build', 'builds'],
			},
		},
		{
			id: 'future-perfect-13',
			form: 'affirmative',
			prompt: 'До того часу, як ти це прочитаєш, я вже поїду.',
			answer: "By the time you read this I'll have left.",
			accept: [
				"By the time you read this I'll {have already|already have|have} {left|gone}.",
			],
			traps: {
				read: ['will', 'reads', 'reading'],
				left: ['leaved', 'leave', 'leaves'],
			},
		},
		{
			id: 'future-perfect-14',
			form: 'affirmative',
			prompt: 'До восьмої Олена вже прибере кухню.',
			answer: 'By eight Olena will have already cleaned the kitchen.',
			accept: [
				"By {eight|eight o'clock} Olena will {have already|already have|have} {cleaned|tidied} the kitchen.",
			],
			traps: {
				have: ['has', 'had'],
				cleaned: ['clean', 'cleans', 'cleaning'],
			},
		},
		{
			id: 'future-perfect-15',
			form: 'affirmative',
			prompt: 'На той час дощ уже припиниться.',
			answer: 'By then the rain will have already stopped.',
			accept: [
				'{By then|By that time} the rain will {have already|already have|have} stopped.',
			],
			traps: {
				have: ['has', 'had'],
				stopped: ['stop', 'stoped', 'stops'],
			},
		},
		{
			id: 'future-perfect-16',
			form: 'affirmative',
			prompt: 'До Різдва діти вже витратять усі гроші.',
			answer: 'By Christmas the children will have spent all the money.',
			accept: [
				'By Christmas the children will {have already|already have|have} spent all {the|their} money.',
			],
			traps: {
				have: ['has', 'had'],
				spent: ['spended', 'spend', 'spends'],
			},
		},
		{
			id: 'future-perfect-17',
			form: 'affirmative',
			prompt: 'До того часу, як ти подзвониш, я вже поснідаю.',
			answer: "By the time you call I'll have had breakfast.",
			accept: [
				"By the time you {call|phone} I'll {have already|already have|have} {had|eaten} breakfast.",
			],
			traps: {
				call: ['will', 'called', 'calls'],
				have: ['has', 'had'],
			},
		},
		{
			id: 'future-perfect-18',
			form: 'affirmative',
			prompt: 'До полудня я вже відповім на всі листи.',
			answer: "By noon I'll have answered all the emails.",
			accept: [
				"By noon I'll {have already|already have|have} answered {all the|all} {emails|letters}.",
			],
			traps: {
				have: ['has', 'had'],
				answered: ['answer', 'answers', 'answering'],
			},
		},
		{
			id: 'future-perfect-19',
			form: 'affirmative',
			prompt: 'До того часу, як вони приїдуть, ми вже прикрасимо ялинку.',
			answer: "By the time they arrive we'll have decorated the tree.",
			accept: [
				"By the time they {arrive|get here} we'll {have already|already have|have} decorated the {tree|Christmas tree}.",
			],
			traps: {
				arrive: ['will', 'arrived', 'arrives'],
				decorated: ['decorate', 'decorating'],
			},
		},
		{
			id: 'future-perfect-20',
			form: 'affirmative',
			prompt: 'До десятої ми вже приземлимося в Лондоні.',
			answer: "By ten we'll have already landed in London.",
			accept: [
				"By {ten|ten o'clock} we'll {have already|already have|have} landed in London.",
			],
			traps: {
				have: ['has', 'had'],
				landed: ['land', 'lands', 'landing'],
			},
		},
		{
			id: 'future-perfect-21',
			form: 'affirmative',
			prompt: 'До літа ти вже вивчиш сто нових слів.',
			answer: "By summer you'll have learned a hundred new words.",
			accept: [
				"By {summer|the summer} you'll {have already|already have|have} {learned|learnt} {a|one} hundred new words.",
			],
			traps: {
				have: ['has', 'had'],
				learned: ['learn', 'learning'],
			},
		},
		{
			id: 'future-perfect-22',
			form: 'affirmative',
			prompt: 'На той час ми вже продамо машину.',
			answer: "By then we'll have already sold the car.",
			accept: [
				"{By then|By that time} we'll {have already|already have|have} sold {the|our} car.",
			],
			traps: {
				have: ['has', 'had'],
				sold: ['selled', 'sell', 'sells'],
			},
		},
		{
			id: 'future-perfect-23',
			form: 'affirmative',
			prompt: 'До того часу, як ти закінчиш школу, я вже вийду на пенсію.',
			answer: "By the time you finish school I'll have retired.",
			accept: [
				"By the time you {finish|leave} school I'll {have already|already have|have} retired.",
			],
			traps: {
				finish: ['will', 'finished', 'finishes'],
				retired: ['retire', 'retiring'],
			},
		},
		{
			id: 'future-perfect-24',
			form: 'affirmative',
			prompt: 'До понеділка Марко вже знайде нову роботу.',
			answer: 'By Monday Marko will have found a new job.',
			accept: [
				'By Monday Marko will {have already|already have|have} found a new job.',
			],
			traps: {
				have: ['has', 'had'],
				found: ['finded', 'find', 'founded'],
			},
		},
		{
			id: 'future-perfect-25',
			form: 'affirmative',
			prompt: 'На той час гості вже підуть.',
			answer: 'By then the guests will have already left.',
			accept: [
				'{By then|By that time} the guests will {have already|already have|have} {left|gone}.',
			],
			traps: {
				have: ['has', 'had'],
				left: ['leaved', 'leave', 'leaves'],
			},
		},
		{
			id: 'future-perfect-26',
			form: 'affirmative',
			prompt: 'До шостої ми вже доїдемо до Львова.',
			answer: "By six we'll have already reached Lviv.",
			accept: [
				"By {six|six o'clock} we'll {have already|already have|have} {reached|got to|arrived in} Lviv.",
			],
			traps: {
				have: ['has', 'had'],
				reached: ['reach', 'reaches', 'reaching'],
			},
		},
		{
			id: 'future-perfect-27',
			form: 'affirmative',
			prompt: 'До того часу, як вона подзвонить, я вже засну.',
			answer: "By the time she calls I'll have fallen asleep.",
			accept: [
				"By the time she {calls|phones} I'll {have already|already have|have} fallen asleep.",
			],
			traps: {
				calls: ['will', 'called', 'call'],
				fallen: ['fell', 'fall', 'falled'],
			},
		},
		{
			id: 'future-perfect-28',
			form: 'affirmative',
			prompt: 'До грудня я вже заощаджу тисячу євро.',
			answer: "By December I'll have saved a thousand euros.",
			accept: [
				"By December I'll {have already|already have|have} saved {a|one} thousand euros.",
			],
			traps: {
				have: ['has', 'had'],
				saved: ['save', 'saves', 'saving'],
			},
		},
		{
			id: 'future-perfect-29',
			form: 'affirmative',
			prompt: 'До того часу, як ти приїдеш, сніг уже розтане.',
			answer: 'By the time you arrive the snow will have melted.',
			accept: [
				'By the time you {arrive|get here} the snow will {have already|already have|have} melted.',
			],
			traps: {
				arrive: ['will', 'arrived', 'arrives'],
				melted: ['melt', 'melts', 'molten'],
			},
		},
		{
			id: 'future-perfect-30',
			form: 'affirmative',
			prompt: 'До кінця фільму вона вже засне.',
			answer: "By the end of the film she'll have fallen asleep.",
			accept: [
				"By the end of the {film|movie} she'll {have already|already have|have} fallen asleep.",
			],
			traps: {
				have: ['has', 'had'],
				fallen: ['fell', 'fall', 'falled'],
			},
		},
		{
			id: 'future-perfect-31',
			form: 'affirmative',
			prompt: 'До суботи я вже пофарбую паркан.',
			answer: "By Saturday I'll have already painted the fence.",
			accept: [
				"By Saturday I'll {have already|already have|have} painted the fence.",
			],
			traps: {
				have: ['has', 'had'],
				painted: ['paint', 'paints', 'painting'],
			},
		},
		{
			id: 'future-perfect-32',
			form: 'affirmative',
			prompt: 'На той час ми вже зробимо всю роботу.',
			answer: "By then we'll have already done all the work.",
			accept: [
				"{By then|By that time} we'll {have already|already have|have} done all the work.",
			],
			traps: {
				have: ['has', 'had'],
				done: ['did', 'do', 'doed'],
			},
		},
		{
			id: 'future-perfect-33',
			form: 'affirmative',
			prompt: 'До вівторка вони вже отримають посилку.',
			answer: "By Tuesday they'll have received the parcel.",
			accept: [
				"By Tuesday they'll {have already|already have|have} {received|got} the {parcel|package}.",
			],
			traps: {
				have: ['has', 'had'],
				received: ['receive', 'receives', 'receiving'],
			},
		},
		{
			id: 'future-perfect-34',
			form: 'affirmative',
			prompt: 'До наступного тижня я вже забуду цей пароль.',
			answer: "By next week I'll have forgotten this password.",
			accept: [
				"By next week I'll {have already|already have|have} forgotten this password.",
			],
			traps: {
				have: ['has', 'had'],
				forgotten: ['forgot', 'forget', 'forgetted'],
			},
		},
		{
			id: 'future-perfect-35',
			form: 'affirmative',
			prompt: 'До десятої діти вже ляжуть спати.',
			answer: 'By ten the children will have gone to bed.',
			accept: [
				"By {ten|ten o'clock} the children will {have already|already have|have} gone to bed.",
			],
			traps: {
				have: ['has', 'had'],
				gone: ['went', 'go', 'goed'],
			},
		},
		{
			id: 'future-perfect-36',
			form: 'affirmative',
			prompt: 'До того часу, як ти прийдеш, я вже вирішу цю проблему.',
			answer: "By the time you come I'll have solved this problem.",
			accept: [
				"By the time you {come|get here} I'll {have already|already have|have} solved this problem.",
			],
			traps: {
				come: ['will', 'came', 'comes'],
				solved: ['solve', 'solves', 'solving'],
			},
		},
		{
			id: 'future-perfect-37',
			form: 'affirmative',
			prompt: 'До середи Ірина вже повернеться з Парижа.',
			answer: 'By Wednesday Iryna will have come back from Paris.',
			accept: [
				'By Wednesday Iryna will {have already|already have|have} {come back|got back|returned} from Paris.',
			],
			traps: {
				have: ['has', 'had'],
				come: ['came', 'comes', 'coming'],
			},
		},
		{
			id: 'future-perfect-38',
			form: 'affirmative',
			prompt: 'На той час сонце вже зійде.',
			answer: 'By then the sun will have already risen.',
			accept: [
				'{By then|By that time} the sun will {have already|already have|have} {risen|come up}.',
			],
			traps: {
				have: ['has', 'had'],
				risen: ['rose', 'rise', 'rised'],
			},
		},
		{
			id: 'future-perfect-39',
			form: 'affirmative',
			prompt: 'До наступного року мій брат уже закінчить університет.',
			answer: 'By next year my brother will have finished university.',
			accept: [
				'By next year my brother will have {finished|graduated from} university.',
			],
			traps: {
				have: ['has', 'had'],
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'future-perfect-40',
			form: 'affirmative',
			prompt: 'До того часу, як ти зателефонуєш, вони вже вирішать.',
			answer: "By the time you call they'll have decided.",
			accept: [
				"By the time you {call|phone} they'll {have already|already have|have} decided.",
			],
			traps: {
				call: ['will', 'called', 'calls'],
				decided: ['decide', 'decides', 'deciding'],
			},
		},
		{
			id: 'future-perfect-41',
			form: 'affirmative',
			prompt: 'До вечора Петро вже полагодить машину.',
			answer: 'By the evening Petro will have fixed the car.',
			accept: [
				'By {the evening|evening|tonight} Petro will {have already|already have|have} {fixed|repaired} {the|his} car.',
			],
			traps: {
				have: ['has', 'had'],
				fixed: ['fix', 'fixes', 'fixing'],
			},
		},
		{
			id: 'future-perfect-42',
			form: 'affirmative',
			prompt: 'На той час ціни вже зростуть.',
			answer: 'By then prices will have already gone up.',
			accept: [
				'{By then|By that time} {prices|the prices} will {have already|already have|have} {gone up|risen|increased}.',
			],
			traps: {
				have: ['has', 'had'],
				gone: ['went', 'go', 'goed'],
			},
		},
		{
			id: 'future-perfect-43',
			form: 'affirmative',
			prompt: 'До того часу, як прибуде потяг, ми вже пообідаємо.',
			answer: "By the time the train arrives we'll have had lunch.",
			accept: [
				"By the time the train arrives we'll {have already|already have|have} {had|eaten} lunch.",
			],
			traps: {
				arrives: ['will', 'arrive', 'arrived'],
				have: ['has', 'had'],
			},
		},
		{
			id: 'future-perfect-44',
			form: 'affirmative',
			prompt: 'До березня я вже складу всі іспити.',
			answer: "By March I'll have passed all my exams.",
			accept: [
				"By March I'll {have already|already have|have} passed {all my|all the|all} exams.",
			],
			traps: {
				have: ['has', 'had'],
				passed: ['pass', 'past', 'passing'],
			},
		},
		{
			id: 'future-perfect-45',
			form: 'affirmative',
			prompt: 'До того часу, як ти приїдеш, я вже познайомлюся з її батьками.',
			answer: "By the time you arrive I'll have met her parents.",
			accept: [
				"By the time you {arrive|get here} I'll {have already|already have|have} met her parents.",
			],
			traps: {
				arrive: ['will', 'arrived', 'arrives'],
				met: ['meeted', 'meet', 'meets'],
			},
		},
		{
			id: 'future-perfect-46',
			form: 'question',
			prompt: 'Ти вже закінчиш звіт до понеділка?',
			answer: 'Will you have finished the report by Monday?',
			accept: [
				'Will you {have already|already have|have} finished the report by Monday?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'future-perfect-47',
			form: 'question',
			prompt: 'Вони вже поснідають до того часу, як ми приїдемо?',
			answer: 'Will they have had breakfast by the time we arrive?',
			accept: [
				'Will they {have already|already have|have} {had|eaten} breakfast by the time we {arrive|get there}?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				arrive: ['will', 'arrived', 'arrives'],
			},
		},
		{
			id: 'future-perfect-48',
			form: 'question',
			prompt: 'Скільки грошей ти заощадиш до літа?',
			answer: 'How much money will you have saved by summer?',
			accept: [
				'How much money will you {have saved|save} by {summer|the summer}?',
			],
			traps: {
				will: ['are', 'did'],
				have: ['has', 'had'],
				saved: ['saves', 'saving'],
			},
		},
		{
			id: 'future-perfect-49',
			form: 'question',
			prompt: 'Він уже прокинеться до того часу, як ми приїдемо?',
			answer: 'Will he have woken up by the time we arrive?',
			accept: [
				'Will he {have already|already have|have} woken up by the time we {arrive|get there}?',
			],
			traps: {
				Will: ['Does', 'Is', 'Has'],
				have: ['has', 'had'],
				woken: ['woke', 'wake', 'waked'],
			},
		},
		{
			id: 'future-perfect-50',
			form: 'question',
			prompt: 'На той час діти вже ляжуть спати?',
			answer: 'Will the children have gone to bed by then?',
			accept: [
				'Will the children {have already|already have|have} gone to bed by {then|that time}?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				gone: ['went', 'go', 'goed'],
			},
		},
		{
			id: 'future-perfect-51',
			form: 'question',
			prompt: "Ти вже прочитаєш цю книжку до п'ятниці?",
			answer: 'Will you have read this book by Friday?',
			accept: [
				'Will you {have already|already have|have} read this book by Friday?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				read: ['readed', 'reads', 'reading'],
			},
		},
		{
			id: 'future-perfect-52',
			form: 'question',
			prompt: 'Скільки країн ти відвідаєш до наступного року?',
			answer: 'How many countries will you have visited by next year?',
			accept: [
				'How many countries will you {have visited|visit} by next year?',
			],
			traps: {
				will: ['are', 'did'],
				have: ['has', 'had'],
				visited: ['visits', 'visiting'],
			},
		},
		{
			id: 'future-perfect-53',
			form: 'question',
			prompt: 'Робітники вже збудують міст до зими?',
			answer: 'Will the workers have built the bridge by winter?',
			accept: [
				'Will the workers {have already|already have|have} built the bridge by {winter|the winter}?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				built: ['builded', 'build', 'builds'],
			},
		},
		{
			id: 'future-perfect-54',
			form: 'question',
			prompt: 'Ти вже спакуєш речі до того часу, як приїде таксі?',
			answer: 'Will you have packed by the time the taxi arrives?',
			accept: [
				'Will you {have already|already have|have} packed {your things|your bags|} by the time the taxi {arrives|comes|gets here}?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				packed: ['pack', 'packing'],
				arrives: ['will', 'arrive', 'arrived'],
			},
		},
		{
			id: 'future-perfect-55',
			form: 'question',
			prompt: 'Олег уже знайде квартиру до вересня?',
			answer: 'Will Oleh have found a flat by September?',
			accept: [
				'Will Oleh {have already|already have|have} found {a flat|an apartment} by September?',
			],
			traps: {
				Will: ['Does', 'Is', 'Has'],
				have: ['has', 'had'],
				found: ['finded', 'find', 'founded'],
			},
		},
		{
			id: 'future-perfect-56',
			form: 'question',
			prompt: 'Що ти вже встигнеш зробити до обіду?',
			answer: 'What will you have done by lunch?',
			accept: [
				'What will you {have already|already have|have} done by {lunch|lunchtime}?',
			],
			traps: {
				will: ['are', 'did'],
				have: ['has', 'had'],
				done: ['did', 'do', 'doed'],
			},
		},
		{
			id: 'future-perfect-57',
			form: 'question',
			prompt: 'Сніг уже розтане до квітня?',
			answer: 'Will the snow have melted by April?',
			accept: [
				'Will the snow {have already|already have|have} melted by April?',
			],
			traps: {
				Will: ['Does', 'Is', 'Has'],
				have: ['has', 'had'],
				melted: ['melt', 'melts', 'molten'],
			},
		},
		{
			id: 'future-perfect-58',
			form: 'question',
			prompt: 'Ти вже вивчиш вірш до уроку?',
			answer: 'Will you have learned the poem by the lesson?',
			accept: [
				'Will you {have already|already have|have} {learned|learnt} the poem {by|before} the lesson?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				learned: ['learn', 'learns', 'learning'],
			},
		},
		{
			id: 'future-perfect-59',
			form: 'question',
			prompt: 'Скільки кілометрів ми пройдемо до вечора?',
			answer: 'How many kilometres will we have walked by evening?',
			accept: [
				'How many {kilometres|kilometers} will we {have walked|walk} by {the evening|evening|tonight}?',
			],
			traps: {
				will: ['are', 'did'],
				have: ['has', 'had'],
				walked: ['walks', 'walking'],
			},
		},
		{
			id: 'future-perfect-60',
			form: 'question',
			prompt: 'Вони вже одружаться до наступного літа?',
			answer: 'Will they have got married by next summer?',
			accept: [
				'Will they {have already|already have|have} {got|gotten} married by next summer?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				got: ['get', 'gets', 'getting'],
			},
		},
		{
			id: 'future-perfect-61',
			form: 'question',
			prompt: 'Магазин уже зачиниться до того часу, як ми приїдемо?',
			answer: 'Will the shop have closed by the time we arrive?',
			accept: [
				'Will the {shop|store} {have already|already have|have} closed by the time we {arrive|get there}?',
			],
			traps: {
				Will: ['Does', 'Is', 'Has'],
				closed: ['close', 'closes', 'closing'],
				arrive: ['will', 'arrived', 'arrives'],
			},
		},
		{
			id: 'future-perfect-62',
			form: 'question',
			prompt: 'Ти вже поїси до того часу, як я повернуся?',
			answer: 'Will you have eaten by the time I get back?',
			accept: [
				'Will you {have already|already have|have} eaten by the time I {get back|come back|return}?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				eaten: ['ate', 'eat', 'eated'],
				get: ['will', 'got', 'gets'],
			},
		},
		{
			id: 'future-perfect-63',
			form: 'question',
			prompt: 'Він уже продасть свою машину до літа?',
			answer: 'Will he have sold his car by summer?',
			accept: [
				'Will he {have already|already have|have} sold his car by {summer|the summer}?',
			],
			traps: {
				Will: ['Does', 'Is', 'Has'],
				have: ['has', 'had'],
				sold: ['selled', 'sell', 'sells'],
			},
		},
		{
			id: 'future-perfect-64',
			form: 'question',
			prompt: 'Скільки книжок ти прочитаєш до літа?',
			answer: 'How many books will you have read by summer?',
			accept: [
				'How many books will you {have read|read} by {summer|the summer}?',
			],
			traps: {
				will: ['are', 'did'],
				have: ['has', 'had'],
			},
		},
		{
			id: 'future-perfect-65',
			form: 'question',
			prompt: "Ми вже отримаємо результати до п'ятниці?",
			answer: 'Will we have got the results by Friday?',
			accept: [
				'Will we {have already|already have|have} {got|gotten|received} the results by Friday?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				got: ['get', 'gets', 'getting'],
			},
		},
		{
			id: 'future-perfect-66',
			form: 'question',
			prompt: 'На той час вода вже закипить?',
			answer: 'Will the water have boiled by then?',
			accept: [
				'Will the water {have already|already have|have} boiled by {then|that time}?',
			],
			traps: {
				Will: ['Does', 'Is', 'Has'],
				have: ['has', 'had'],
				boiled: ['boil', 'boils', 'boiling'],
			},
		},
		{
			id: 'future-perfect-67',
			form: 'question',
			prompt: 'Ти вже прибереш свою кімнату до суботи?',
			answer: 'Will you have cleaned your room by Saturday?',
			accept: [
				'Will you {have already|already have|have} {cleaned|tidied} your room by Saturday?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				cleaned: ['clean', 'cleans', 'cleaning'],
			},
		},
		{
			id: 'future-perfect-68',
			form: 'question',
			prompt: 'Фільм уже закінчиться до того часу, як ми приїдемо?',
			answer: 'Will the film have ended by the time we arrive?',
			accept: [
				'Will the {film|movie} {have already|already have|have} {ended|finished} by the time we {arrive|get there}?',
			],
			traps: {
				Will: ['Does', 'Is', 'Has'],
				ended: ['end', 'ends', 'ending'],
				arrive: ['will', 'arrived', 'arrives'],
			},
		},
		{
			id: 'future-perfect-69',
			form: 'question',
			prompt: 'Ти вже купиш квитки до середи?',
			answer: 'Will you have bought the tickets by Wednesday?',
			accept: [
				'Will you {have already|already have|have} bought the tickets by Wednesday?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				bought: ['buyed', 'buy', 'brought'],
			},
		},
		{
			id: 'future-perfect-70',
			form: 'question',
			prompt: 'Скільки грошей ти вже витратиш на той час?',
			answer: 'How much money will you have spent by then?',
			accept: [
				'How much {money|} will you {have already|already have|have} spent by {then|that time}?',
			],
			traps: {
				will: ['are', 'did'],
				have: ['has', 'had'],
				spent: ['spended', 'spend', 'spends'],
			},
		},
		{
			id: 'future-perfect-71',
			form: 'question',
			prompt: 'Вони вже переїдуть до літа?',
			answer: 'Will they have moved by summer?',
			accept: [
				'Will they {have already|already have|have} {moved|moved house} by {summer|the summer}?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				have: ['has', 'had'],
				moved: ['move', 'moving'],
			},
		},
		{
			id: 'future-perfect-72',
			form: 'question',
			prompt: 'Ти вже забудеш мене до того часу, як я повернуся?',
			answer: 'Will you have forgotten me by the time I return?',
			accept: [
				'Will you {have already|already have|have} forgotten me by the time I {return|come back|get back}?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				forgotten: ['forgot', 'forget', 'forgetted'],
				return: ['will', 'returned', 'returns'],
			},
		},
		{
			id: 'future-perfect-73',
			form: 'question',
			prompt: 'Наталя вже напише статтю до вівторка?',
			answer: 'Will Natalia have written the article by Tuesday?',
			accept: [
				'Will Natalia {have already|already have|have} written the article by Tuesday?',
			],
			traps: {
				Will: ['Does', 'Is', 'Has'],
				have: ['has', 'had'],
				written: ['wrote', 'write', 'writed'],
			},
		},
		{
			id: 'future-perfect-74',
			form: 'question',
			prompt: 'Вони вже дізнаються до того часу, як ми подзвонимо?',
			answer: 'Will they have found out by the time we call?',
			accept: [
				'Will they {have already|already have|have} found out by the time we {call|phone}?',
			],
			traps: {
				Will: ['Do', 'Are', 'Have'],
				found: ['finded', 'find', 'founded'],
				call: ['will', 'called', 'calls'],
			},
		},
		{
			id: 'future-perfect-75',
			form: 'question',
			prompt: 'Що вже станеться до того часу, як ми приїдемо?',
			answer: 'What will have happened by the time we arrive?',
			accept: [
				'What will {have already|already have|have} happened by the time we {arrive|get there}?',
			],
			traps: {
				have: ['has', 'had'],
				happened: ['happen', 'happens', 'happening'],
				arrive: ['will', 'arrived', 'arrives'],
			},
		},
		{
			id: 'future-perfect-76',
			form: 'negative',
			prompt: 'До понеділка я не закінчу статтю.',
			answer: "By Monday I won't have finished the article.",
			accept: ["By Monday I won't {have finished|finish} the article."],
			traps: {
				"won't": ["don't", "didn't"],
				have: ['has', 'had'],
				finished: ['finishes', 'finishing'],
			},
		},
		{
			id: 'future-perfect-77',
			form: 'negative',
			prompt: 'Я ще не закінчу до того часу, як ти прийдеш.',
			answer: "I won't have finished by the time you come.",
			accept: ["I won't have finished by the time you {come|get here}."],
			traps: {
				have: ['has', 'had'],
				finished: ['finish', 'finishing'],
				come: ['will', 'came', 'comes'],
			},
		},
		{
			id: 'future-perfect-78',
			form: 'negative',
			prompt: 'Вони ще не повернуться до того часу, як ми підемо.',
			answer: "They won't have come back by the time we leave.",
			accept: [
				"They won't have {come back|got back|returned} by the time we leave.",
			],
			traps: {
				have: ['has', 'had'],
				come: ['came', 'comes', 'coming'],
				leave: ['will', 'left', 'leaves'],
			},
		},
		{
			id: 'future-perfect-79',
			form: 'negative',
			prompt: "До п'ятниці Ольга не прочитає цю книжку.",
			answer: "By Friday Olha won't have read this book.",
			accept: ["By Friday Olha won't {have read|read} this book."],
			traps: {
				"won't": ["doesn't", "didn't"],
				have: ['has', 'had'],
				read: ['readed', 'reads', 'reading'],
			},
		},
		{
			id: 'future-perfect-80',
			form: 'negative',
			prompt: 'Ми не продамо будинок до літа.',
			answer: "We won't have sold the house by summer.",
			accept: [
				"We won't {have sold|sell} {the|our} house by {summer|the summer}.",
			],
			traps: {
				"won't": ["don't", "didn't"],
				have: ['has', 'had'],
				sold: ['selled', 'sells', 'selling'],
			},
		},
		{
			id: 'future-perfect-81',
			form: 'negative',
			prompt: "Лист ще не прийде до п'ятниці.",
			answer: "The letter won't have arrived by Friday.",
			accept: ["The letter won't {have arrived|arrive} by Friday."],
			traps: {
				"won't": ["doesn't", "isn't"],
				have: ['has', 'had'],
				arrived: ['arrives', 'arriving'],
			},
		},
		{
			id: 'future-perfect-82',
			form: 'negative',
			prompt: 'Я ще не прочитаю його до того часу, як ти подзвониш.',
			answer: "I won't have read it by the time you call.",
			accept: ["I won't have read it by the time you {call|phone}."],
			traps: {
				have: ['has', 'had'],
				read: ['readed', 'reads', 'reading'],
				call: ['will', 'called', 'calls'],
			},
		},
		{
			id: 'future-perfect-83',
			form: 'negative',
			prompt: 'Вони не вирішать до кінця місяця.',
			answer: "They won't have decided by the end of the month.",
			accept: ["They won't {have decided|decide} by the end of the month."],
			traps: {
				"won't": ["don't", "didn't"],
				have: ['has', 'had'],
				decided: ['decides', 'deciding'],
			},
		},
		{
			id: 'future-perfect-84',
			form: 'negative',
			prompt: 'Ми ще не доїдемо до того часу, як стемніє.',
			answer: "We won't have arrived by the time it gets dark.",
			accept: ["We won't have {arrived|got there} by the time it gets dark."],
			traps: {
				have: ['has', 'had'],
				arrived: ['arrive', 'arrives', 'arriving'],
				gets: ['will', 'get', 'got'],
			},
		},
		{
			id: 'future-perfect-85',
			form: 'negative',
			prompt: 'Він не допише книжку до наступного року.',
			answer: "He won't have finished the book by next year.",
			accept: [
				"He won't {have finished|finish} {writing|} the book by next year.",
			],
			traps: {
				"won't": ["doesn't", "didn't"],
				have: ['has', 'had'],
				finished: ['finishes', 'finishing'],
			},
		},
		{
			id: 'future-perfect-86',
			form: 'negative',
			prompt: 'Магазин ще не відкриється до того часу, як ми приїдемо.',
			answer: "The shop won't have opened by the time we arrive.",
			accept: [
				"The {shop|store} won't have opened by the time we {arrive|get there}.",
			],
			traps: {
				have: ['has', 'had'],
				opened: ['open', 'opens', 'opening'],
				arrive: ['will', 'arrived', 'arrives'],
			},
		},
		{
			id: 'future-perfect-87',
			form: 'negative',
			prompt: 'Сніг не розтане до травня.',
			answer: "The snow won't have melted by May.",
			accept: ["The snow won't {have melted|melt} by May."],
			traps: {
				"won't": ["doesn't", "isn't"],
				have: ['has', 'had'],
				melted: ['melts', 'molten'],
			},
		},
		{
			id: 'future-perfect-88',
			form: 'negative',
			prompt: 'Ми ще не поїмо до того часу, як почнеться фільм.',
			answer: "We won't have eaten by the time the film starts.",
			accept: [
				"We won't have eaten by the time the {film|movie} {starts|begins}.",
			],
			traps: {
				have: ['has', 'had'],
				eaten: ['ate', 'eat', 'eated'],
				starts: ['will', 'started', 'start'],
			},
		},
		{
			id: 'future-perfect-89',
			form: 'negative',
			prompt: "Ви не вивчите всі ці слова до п'ятниці.",
			answer: "You won't have learned all these words by Friday.",
			accept: [
				"You won't {have learned|have learnt|learn} all these words by Friday.",
			],
			traps: {
				"won't": ["don't", "didn't"],
				have: ['has', 'had'],
				learned: ['learns', 'learning'],
			},
		},
		{
			id: 'future-perfect-90',
			form: 'negative',
			prompt: 'Вони ще не поснідають до того часу, як ми приїдемо.',
			answer: "They won't have had breakfast by the time we arrive.",
			accept: [
				"They won't have {had|eaten} breakfast by the time we {arrive|get there}.",
			],
			traps: {
				have: ['has', 'had'],
				arrive: ['will', 'arrived', 'arrives'],
			},
		},
		{
			id: 'future-perfect-91',
			form: 'negative',
			prompt: 'Будівельники не закінчать міст до зими.',
			answer: "The builders won't have finished the bridge by winter.",
			accept: [
				"The builders won't {have finished|finish} the bridge by {winter|the winter}.",
			],
			traps: {
				"won't": ["don't", "didn't"],
				have: ['has', 'had'],
				finished: ['finishes', 'finishing'],
			},
		},
		{
			id: 'future-perfect-92',
			form: 'negative',
			prompt: 'Вона ще не прокинеться до того часу, як ми підемо.',
			answer: "She won't have woken up by the time we leave.",
			traps: {
				have: ['has', 'had'],
				woken: ['woke', 'wake', 'waked'],
				leave: ['will', 'left', 'leaves'],
			},
		},
		{
			id: 'future-perfect-93',
			form: 'negative',
			prompt: 'Я не заощаджу достатньо грошей до літа.',
			answer: "I won't have saved enough money by summer.",
			accept: [
				"I won't {have saved|save} enough money by {summer|the summer}.",
			],
			traps: {
				"won't": ["don't", "didn't"],
				have: ['has', 'had'],
				saved: ['saves', 'saving'],
			},
		},
		{
			id: 'future-perfect-94',
			form: 'negative',
			prompt: 'На той час потяг ще не прибуде.',
			answer: "By then the train won't have arrived.",
			accept: ["{By then|By that time} the train won't have arrived."],
			traps: {
				have: ['has', 'had'],
				arrived: ['arrive', 'arrives', 'arriving'],
			},
		},
		{
			id: 'future-perfect-95',
			form: 'negative',
			prompt: 'Він не знайде нову роботу до осені.',
			answer: "He won't have found a new job by autumn.",
			accept: [
				"He won't {have found|find} a new job by {autumn|the autumn|fall|the fall}.",
			],
			traps: {
				"won't": ["doesn't", "didn't"],
				have: ['has', 'had'],
				found: ['finded', 'founded'],
			},
		},
		{
			id: 'future-perfect-96',
			form: 'negative',
			prompt: 'Я ще не одягнуся до того часу, як ти прийдеш.',
			answer: "I won't have got dressed by the time you come.",
			accept: [
				"I won't have {got|gotten} dressed by the time you {come|get here}.",
			],
			traps: {
				have: ['has', 'had'],
				got: ['get', 'gets', 'getting'],
				come: ['will', 'came', 'comes'],
			},
		},
		{
			id: 'future-perfect-97',
			form: 'negative',
			prompt: 'Я не напишу всі листівки до Різдва.',
			answer: "I won't have written all the cards by Christmas.",
			accept: [
				"I won't {have written|write} {all the|all my} cards by Christmas.",
			],
			traps: {
				"won't": ["don't", "didn't"],
				have: ['has', 'had'],
				written: ['wrote', 'writed'],
			},
		},
		{
			id: 'future-perfect-98',
			form: 'negative',
			prompt: 'Фарба ще не висохне до того часу, як вони прийдуть.',
			answer: "The paint won't have dried by the time they come.",
			accept: [
				"The paint won't have dried by the time they {come|arrive|get here}.",
			],
			traps: {
				have: ['has', 'had'],
				dried: ['dryed', 'dry', 'dries'],
				come: ['will', 'came', 'comes'],
			},
		},
		{
			id: 'future-perfect-99',
			form: 'negative',
			prompt: 'Вона не вивчить італійську до червня.',
			answer: "She won't have learned Italian by June.",
			accept: ["She won't {have learned|have learnt|learn} Italian by June."],
			traps: {
				"won't": ["doesn't", "didn't"],
				have: ['has', 'had'],
				learned: ['learns', 'learning'],
			},
		},
		{
			id: 'future-perfect-100',
			form: 'negative',
			prompt: 'Вони не збудують школу до вересня.',
			answer: "They won't have built the school by September.",
			accept: ["They won't {have built|build} the school by September."],
			traps: {
				"won't": ["don't", "didn't"],
				have: ['has', 'had'],
				built: ['builded', 'builds'],
			},
		},
	],
})
