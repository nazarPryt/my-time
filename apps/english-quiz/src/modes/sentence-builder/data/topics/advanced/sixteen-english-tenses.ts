import { defineTopic } from '../../define-topic'

export const sixteenEnglishTenses = defineTopic({
	id: 'sixteen-english-tenses',
	level: 'advanced',
	title: '16 English tenses',
	subtitle: '16 часів англійської мови',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Час обираємо за маркерами. Simple — факт або звичка (usually, every day, yesterday, last year, ago); Continuous — дія в процесі в певний момент (now, at five yesterday, this time tomorrow, when you called); Perfect — дія завершена до моменту (already, just, yet, ever, by Friday, before); Perfect Continuous — скільки дія триває до моменту (for two hours, since morning, how long). Future-in-the-Past (would + форма) — це майбутнє з погляду минулого після said, thought, knew, hoped: will → would, will be doing → would be doing, will have done → would have done. З live, work, study, teach Perfect і Perfect Continuous однаково правильні.',
			examples: [
				{
					text: 'She has been painting the fence since lunch.',
					translation: 'Вона фарбує паркан з обіду.',
				},
				{
					text: 'They said they would be travelling all night.',
					translation: 'Вони сказали, що їхатимуть усю ніч.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				'Present: work(s) / am, is, are working / have, has worked / have, has been working. Past: worked / was, were working / had worked / had been working. Future: will work / will be working / will have worked / will have been working. Future-in-the-Past: would work / would be doing / would have done / would have been doing. Після підрядних when, by the time, before у майбутньому — Present Simple, у минулому — Past Simple.',
			examples: [
				{
					text: 'By the time we got home, the snow had stopped.',
					translation: 'Коли ми дісталися додому, сніг уже припинився.',
				},
				{
					text: "This time next week I'll be lying on the beach.",
					translation: 'Наступного тижня в цей час я лежатиму на пляжі.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Допоміжне дієслово стає перед підметом: Do/Does, Am/Is/Are, Have/Has, Did, Was/Were, Had, Will, Would. Питальне слово — перед ним: How long have you been…? What were you doing…?',
			examples: [
				{
					text: 'How long had he been driving when he stopped?',
					translation: 'Скільки він уже їхав, коли зупинився?',
				},
				{
					text: 'Will the shop have closed by nine?',
					translation: "Магазин уже зачиниться до дев'ятої?",
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Not стоїть після першого допоміжного: don't, isn't, haven't, didn't, wasn't, hadn't, won't, wouldn't + решта форми. Скорочення 's (is/has) і 'd (had/would) розрізняємо за наступним словом: she's been = she has been, he'd left = he had left, he'd leave = he would leave.",
			examples: [
				{
					text: "We hadn't been sitting there long when the music started.",
					translation: 'Ми недовго там сиділи, коли почалася музика.',
				},
				{
					text: "She said she wouldn't have finished the essay by Monday.",
					translation: 'Вона сказала, що до понеділка ще не допише есе.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'sixteen-english-tenses-1',
			form: 'affirmative',
			prompt: 'Я працюю щодня.',
			answer: 'I work every day.',
			traps: { work: ['works', 'working'] },
		},
		{
			id: 'sixteen-english-tenses-2',
			form: 'affirmative',
			prompt: 'Завтра в цей час я працюватиму.',
			answer: "This time tomorrow I'll be working.",
			accept: [
				"At this time tomorrow I'll be working.",
				"I'll be working {at this time|this time} tomorrow.",
			],
			traps: { be: ['been', 'being'] },
		},
		{
			id: 'sixteen-english-tenses-3',
			form: 'question',
			prompt: 'Ти думав, що до вечора ми вже все зробимо?',
			answer: 'Did you think we would have done everything by the evening?',
			accept: [
				"Did you think {that|} {we would|we'd} {have already|already have|have} {done|finished} everything by {the|} evening?",
				"Did you think that by {the|} evening {we would|we'd} {have already|already have|have} {done|finished} everything?",
			],
			traps: {
				have: ['has', 'had', 'having'],
				done: ['did', 'do', 'doing'],
			},
		},
		{
			id: 'sixteen-english-tenses-4',
			form: 'affirmative',
			prompt: 'Я щойно закінчив свою роботу.',
			answer: "I've just finished my work.",
			traps: {
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'sixteen-english-tenses-5',
			form: 'question',
			prompt: 'Що ти робив, коли я подзвонив?',
			answer: 'What were you doing when I called?',
			accept: ['What were you doing when I {called|phoned|rang}?'],
			traps: {
				were: ['did', 'was', 'are'],
				doing: ['do', 'did', 'done'],
			},
		},
		{
			id: 'sixteen-english-tenses-6',
			form: 'negative',
			prompt: 'Коли я зайшов, вони не дивилися телевізор.',
			answer: "When I came in, they weren't watching TV.",
			accept: [
				"When I {came in|walked in}, they weren't watching {TV|television}.",
			],
			traps: {
				"weren't": ["didn't", "wasn't", "aren't"],
				watching: ['watch', 'watched'],
			},
		},
		{
			id: 'sixteen-english-tenses-7',
			form: 'question',
			prompt: 'Ти довго чекаєш?',
			answer: 'Have you been waiting long?',
			accept: ['Have you {been waiting|waited} {long|for long}?'],
			traps: {
				Have: ['Are', 'Do', 'Has'],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'sixteen-english-tenses-8',
			form: 'negative',
			prompt: 'Він ще не відповів на мій лист.',
			answer: "He hasn't answered my letter yet.",
			accept: ["He hasn't {answered|replied to} my letter yet."],
			traps: {
				"hasn't": ["haven't", "isn't", "doesn't"],
				answered: ['answer', 'answers'],
			},
		},
		{
			id: 'sixteen-english-tenses-9',
			form: 'question',
			prompt: 'Ти думав, що ми все ще шукатимемо тебе?',
			answer: 'Did you think we would still be looking for you?',
			accept: [
				"Did you think {that|} {we would|we'd} still be looking for you?",
			],
			traps: {
				be: ['being', 'been', 'are'],
				looking: ['look', 'looked'],
			},
		},
		{
			id: 'sixteen-english-tenses-10',
			form: 'negative',
			prompt: 'Вони не прийшли на мою вечірку.',
			answer: "They didn't come to my party.",
			traps: {
				"didn't": ["don't", "haven't", "weren't"],
				come: ['came', 'comes', 'coming'],
			},
		},
		{
			id: 'sixteen-english-tenses-11',
			form: 'question',
			prompt: 'Скільки годин ти вже будеш за кермом, коли доїдеш до Львова?',
			answer: 'How many hours will you have been driving when you get to Lviv?',
			accept: [
				'How many hours will you have been driving {when|by the time} you {get to|reach} Lviv?',
			],
			traps: {
				have: ['has', 'had', 'having'],
				driving: ['drive', 'drove', 'driven'],
			},
		},
		{
			id: 'sixteen-english-tenses-12',
			form: 'question',
			prompt:
				'Як довго ти вже жив у Польщі, коли познайомився зі своєю дружиною?',
			answer: 'How long had you been living in Poland when you met your wife?',
			accept: [
				'How long had you {been living|lived} in Poland when you met your wife?',
			],
			traps: {
				had: ['have', 'did', 'were'],
				living: ['live', 'lives'],
			},
		},
		{
			id: 'sixteen-english-tenses-13',
			form: 'negative',
			prompt: 'Я знав, що до обіду він ще не прокинеться.',
			answer: "I knew he wouldn't have woken up by lunch.",
			accept: [
				"I knew {that|} he wouldn't have woken up by {lunch|lunchtime}.",
				"I knew that by {lunch|lunchtime} he wouldn't have woken up.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				woken: ['woke', 'wake', 'waking'],
			},
		},
		{
			id: 'sixteen-english-tenses-14',
			form: 'affirmative',
			prompt: 'Я знав, що на момент мого приходу вона чекатиме вже годину.',
			answer:
				'I knew she would have been waiting for an hour by the time I arrived.',
			accept: [
				"I knew {that|} {she would|she'd} have been waiting for an hour {by the time|when} I {arrived|came|got there}.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				waiting: ['wait', 'waited'],
			},
		},
		{
			id: 'sixteen-english-tenses-15',
			form: 'question',
			prompt: 'Вони вже приїдуть, коли ми повернемося?',
			answer: 'Will they have arrived by the time we get back?',
			accept: [
				'Will they {have already|already have|have} arrived {by the time|when} we {get back|come back|return}?',
			],
			traps: {
				have: ['has', 'had', 'having'],
				arrived: ['arrive', 'arriving'],
			},
		},
		{
			id: 'sixteen-english-tenses-16',
			form: 'question',
			prompt: 'О котрій зазвичай починаються твої уроки?',
			answer: 'What time do your lessons usually start?',
			accept: ['{What time|At what time} do your lessons usually start?'],
			traps: {
				do: ['does', 'are', 'did'],
				start: ['starts', 'starting'],
			},
		},
		{
			id: 'sixteen-english-tenses-17',
			form: 'affirmative',
			prompt: 'Ми живемо в цьому місті вже десять років.',
			answer: "We've been living in this city for ten years.",
			accept: ["We've {been living|lived} in this city for ten years."],
			traps: {
				living: ['live', 'lives'],
			},
		},
		{
			id: 'sixteen-english-tenses-18',
			form: 'question',
			prompt: 'Ти вже закінчив звіт, коли прийшов начальник?',
			answer: 'Had you finished the report when the boss came?',
			accept: [
				'Had you {already finished|finished} the report when the boss {came|arrived}?',
			],
			traps: {
				Had: ['Have', 'Has', 'Were'],
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'sixteen-english-tenses-19',
			form: 'affirmative',
			prompt: 'Ми сподівалися, що до літа вже переїдемо.',
			answer: 'We hoped we would have moved by the summer.',
			accept: [
				"We hoped {that|} {we would|we'd} {have already|already have|have} moved by {the|} summer.",
				"We hoped that by {the|} summer {we would|we'd} {have already|already have|have} moved.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				moved: ['move', 'moving'],
			},
		},
		{
			id: 'sixteen-english-tenses-20',
			form: 'negative',
			prompt: 'Тато зараз не спить, він дивиться футбол.',
			answer: "Dad isn't sleeping now, he's watching football.",
			accept: ["Dad isn't sleeping now, {he's|he is} watching football."],
			traps: {
				"isn't": ["doesn't", "wasn't", "hasn't"],
				watching: ['watches', 'watch', 'watched'],
			},
		},
		{
			id: 'sixteen-english-tenses-21',
			form: 'affirmative',
			prompt: 'Земля була мокра, бо всю ніч ішов дощ.',
			answer: 'The ground was wet because it had been raining all night.',
			accept: [
				'The ground was wet because it had {been raining|rained} all night.',
			],
			traps: {
				had: ['has', 'have', 'was'],
				raining: ['rain', 'rains'],
			},
		},
		{
			id: 'sixteen-english-tenses-22',
			form: 'affirmative',
			prompt: "Вчора о п'ятій я ще працював.",
			answer: 'Yesterday at five I was still working.',
			accept: [
				"{Yesterday at five|Yesterday at five o'clock|At five yesterday|At five o'clock yesterday} I was still working.",
			],
			traps: {
				was: ['am', 'were', 'have'],
				working: ['work', 'worked', 'works'],
			},
		},
		{
			id: 'sixteen-english-tenses-23',
			form: 'negative',
			prompt: 'Останнім часом я погано сплю.',
			answer: "Lately I haven't been sleeping well.",
			accept: [
				"{Lately|Recently} I haven't {been sleeping|slept} well.",
				"I haven't {been sleeping|slept} well {lately|recently}.",
			],
			traps: {
				"haven't": ["hasn't", "don't", "wasn't"],
				sleeping: ['sleep', 'sleeps'],
			},
		},
		{
			id: 'sixteen-english-tenses-24',
			form: 'negative',
			prompt: 'До понеділка він ще не прочитає цю книжку.',
			answer: "By Monday he won't have read this book.",
			accept: [
				"By Monday he won't have {read|finished} this book.",
				"He won't have {read|finished} this book by Monday.",
			],
			traps: {
				have: ['has', 'had', 'having'],
			},
		},
		{
			id: 'sixteen-english-tenses-25',
			form: 'negative',
			prompt: 'У травні ще не буде й року, як вона вивчає іспанську.',
			answer: "In May she won't have been learning Spanish for a year.",
			accept: [
				"In May she won't have been {learning|studying} Spanish for a year.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				been: ['being', 'be', 'was'],
			},
		},
		{
			id: 'sixteen-english-tenses-26',
			form: 'affirmative',
			prompt: 'Я думав, що вони вже поїдуть, коли я приїду.',
			answer: 'I thought they would have left by the time I arrived.',
			accept: [
				"I thought {that|} {they would|they'd} {have already|already have|have} left {by the time|when} I {arrived|got there}.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				left: ['leave', 'leaving'],
			},
		},
		{
			id: 'sixteen-english-tenses-27',
			form: 'negative',
			prompt: 'Не хвилюйся, вони ще не підуть до того часу, як ти приїдеш.',
			answer: "Don't worry, they won't have left by the time you arrive.",
			accept: [
				"Don't worry, they won't have left by the time you {arrive|get there}.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				left: ['leave', 'leaving'],
			},
		},
		{
			id: 'sixteen-english-tenses-28',
			form: 'affirmative',
			prompt: 'Поки мама готувала обід, діти гралися в саду.',
			answer:
				'While Mum was cooking lunch, the children were playing in the garden.',
			accept: [
				'While {Mum|Mom} was {cooking|making} lunch, the children were playing in the garden.',
			],
			traps: {
				were: ['was', 'are', 'did'],
				playing: ['play', 'played', 'plays'],
			},
		},
		{
			id: 'sixteen-english-tenses-29',
			form: 'affirmative',
			prompt: 'Я думав, що ти вже спатимеш.',
			answer: 'I thought you would already be sleeping.',
			accept: [
				"I thought {that|} {you would|you'd} {already be sleeping|already be asleep|be sleeping already|be asleep already}.",
			],
			traps: {
				be: ['being', 'been', 'are'],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'sixteen-english-tenses-30',
			form: 'affirmative',
			prompt: 'До кінця місяця я вже закінчу цей проєкт.',
			answer: "By the end of the month I'll have finished this project.",
			accept: [
				"By the end of the month I'll {have already|already have|have} {finished|completed} this project.",
				"I'll {have already|already have|have} {finished|completed} this project by the end of the month.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'sixteen-english-tenses-31',
			form: 'affirmative',
			prompt: 'Моя сестра зазвичай їздить на роботу автобусом.',
			answer: 'My sister usually goes to work by bus.',
			accept: ['My sister usually {goes|travels} to work by bus.'],
			traps: {
				goes: ['go', 'went', 'going'],
			},
		},
		{
			id: 'sixteen-english-tenses-32',
			form: 'affirmative',
			prompt: 'Мій брат зараз готує вечерю на кухні.',
			answer: 'My brother is cooking dinner in the kitchen now.',
			accept: [
				'My brother is {cooking|making} dinner in the kitchen {now|right now}.',
				'My brother is now {cooking|making} dinner in the kitchen.',
			],
			traps: {
				is: ['does', 'has', 'was'],
				cooking: ['cooks', 'cook', 'cooked'],
			},
		},
		{
			id: 'sixteen-english-tenses-33',
			form: 'question',
			prompt: 'Чи йшов дощ, коли ти вийшов з дому?',
			answer: 'Was it raining when you left home?',
			accept: ['Was it raining when you left {home|the house}?'],
			traps: {
				Was: ['Is', 'Were', 'Has'],
				raining: ['rain', 'rained', 'rains'],
			},
		},
		{
			id: 'sixteen-english-tenses-34',
			form: 'question',
			prompt: 'Ти колись мені пробачиш?',
			answer: 'Will you ever forgive me?',
			traps: {
				Will: ['Do', 'Are', 'Did'],
				forgive: ['forgave', 'forgiving', 'forgiven'],
			},
		},
		{
			id: 'sixteen-english-tenses-35',
			form: 'affirmative',
			prompt: 'Завтра о десятій я летітиму до Рима.',
			answer: "Tomorrow at ten I'll be flying to Rome.",
			accept: ["{Tomorrow at ten|At ten tomorrow} I'll be flying to Rome."],
			traps: {
				be: ['being', 'been', 'am'],
				flying: ['fly', 'flew', 'flown'],
			},
		},
		{
			id: 'sixteen-english-tenses-36',
			form: 'negative',
			prompt: "Не хвилюйся, о дев'ятій я не спатиму.",
			answer: "Don't worry, I won't be sleeping at nine.",
			accept: ["Don't worry, I won't be {sleeping|asleep} at nine."],
			traps: {
				be: ['being', 'been', 'am'],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'sixteen-english-tenses-37',
			form: 'affirmative',
			prompt: 'Вона розмовляє по телефону вже годину.',
			answer: "She's been talking on the phone for an hour.",
			accept: ['She has been talking on the phone for an hour.'],
			traps: {
				been: ['being', 'be', 'was'],
				talking: ['talk', 'talks', 'talked'],
			},
		},
		{
			id: 'sixteen-english-tenses-38',
			form: 'negative',
			prompt: 'Обіцяю, я більше не запізнюватимусь.',
			answer: "I promise I won't be late again.",
			accept: ["I promise I won't be late {again|anymore|any more}."],
			traps: {
				"won't": ["don't", "wouldn't", "didn't"],
			},
		},
		{
			id: 'sixteen-english-tenses-39',
			form: 'affirmative',
			prompt: 'Сонце сходить на сході.',
			answer: 'The sun rises in the east.',
			traps: {
				rises: ['rise', 'rose', 'rising'],
			},
		},
		{
			id: 'sixteen-english-tenses-40',
			form: 'affirmative',
			prompt:
				"Ми думали, що коли прийдуть гості, мама готуватиме вже п'ять годин.",
			answer:
				'We thought that when the guests arrived, Mum would have been cooking for five hours.',
			accept: [
				'We thought that {when|by the time} the guests {arrived|came}, {Mum|Mom} would have been cooking for five hours.',
				'We thought {that|} {Mum|Mom} would have been cooking for five hours {when|by the time} the guests {arrived|came}.',
			],
			traps: {
				have: ['has', 'had', 'having'],
				cooking: ['cook', 'cooked'],
			},
		},
		{
			id: 'sixteen-english-tenses-41',
			form: 'question',
			prompt: 'Ти працюватимеш, коли я приїду?',
			answer: 'Will you be working when I arrive?',
			accept: ['Will you be working when I {arrive|come}?'],
			traps: {
				be: ['being', 'been', 'are'],
				arrive: ['will', 'arrived', 'arrives'],
			},
		},
		{
			id: 'sixteen-english-tenses-42',
			form: 'affirmative',
			prompt: "У вересні буде п'ять років, як я тут працюю.",
			answer: "In September I'll have been working here for five years.",
			accept: [
				"{In|By} September I'll have {been working|worked} here for five years.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				working: ['work', 'works'],
			},
		},
		{
			id: 'sixteen-english-tenses-43',
			form: 'affirmative',
			prompt: "До того як я прийшов, вони вже все з'їли.",
			answer: 'Before I came, they had already eaten everything.',
			accept: [
				"Before I {came|arrived}, {they had|they'd} {already eaten|eaten} everything.",
			],
			traps: {
				had: ['have', 'has', 'were'],
				eaten: ['ate', 'eat', 'eating'],
			},
		},
		{
			id: 'sixteen-english-tenses-44',
			form: 'affirmative',
			prompt: 'Напевно, завтра буде холодно.',
			answer: "It'll probably be cold tomorrow.",
			accept: [
				'It will probably be cold tomorrow.',
				"It's probably going to be cold tomorrow.",
				"Tomorrow {it'll|it will} probably be cold.",
			],
			traps: {
				be: ['is', 'being', 'been'],
			},
		},
		{
			id: 'sixteen-english-tenses-45',
			form: 'affirmative',
			prompt: 'Він сказав, що о восьмій ще працюватиме.',
			answer: 'He said he would still be working at eight.',
			accept: ["He said {that|} {he would|he'd} still be working at eight."],
			traps: {
				be: ['being', 'been', 'is'],
				working: ['work', 'worked'],
			},
		},
		{
			id: 'sixteen-english-tenses-46',
			form: 'negative',
			prompt: 'Я ще недовго чекав, коли вона прийшла.',
			answer: "I hadn't been waiting long when she came.",
			accept: ["I hadn't {been waiting|waited} long when she {came|arrived}."],
			traps: {
				"hadn't": ["haven't", "wasn't", "didn't"],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'sixteen-english-tenses-47',
			form: 'negative',
			prompt: 'Він не розмовляє німецькою.',
			answer: "He doesn't speak German.",
			traps: {
				"doesn't": ["don't", "isn't", "hasn't"],
				speak: ['speaks', 'speaking'],
			},
		},
		{
			id: 'sixteen-english-tenses-48',
			form: 'question',
			prompt: 'Як ти думаєш, хто виграє матч?',
			answer: 'Who do you think will win the match?',
			accept: ['Who do you think {will win|is going to win} the {match|game}?'],
			traps: {
				will: ['does', 'did', 'was'],
				win: ['wins', 'won', 'winning'],
			},
		},
		{
			id: 'sixteen-english-tenses-49',
			form: 'negative',
			prompt: 'Я не спав, коли ти прийшов.',
			answer: "I wasn't sleeping when you came.",
			accept: ["I wasn't {sleeping|asleep} when you {came|arrived}."],
			traps: {
				"wasn't": ["didn't", "weren't", "isn't"],
			},
		},
		{
			id: 'sixteen-english-tenses-50',
			form: 'negative',
			prompt: 'Я не думав, що до вечора він уже все прочитає.',
			answer: "I didn't think he would have read everything by the evening.",
			accept: [
				"I didn't think {that|} {he would|he'd} {have already|already have|have} read everything by {the|} evening.",
				"I didn't think that by {the|} evening {he would|he'd} {have already|already have|have} read everything.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				would: ['will', 'does'],
			},
		},
		{
			id: 'sixteen-english-tenses-51',
			form: 'affirmative',
			prompt: 'Минулого літа ми їздили в Італію.',
			answer: 'Last summer we went to Italy.',
			accept: ['We went to Italy last summer.'],
			traps: {
				went: ['go', 'gone', 'goes'],
			},
		},
		{
			id: 'sixteen-english-tenses-52',
			form: 'question',
			prompt: 'Ти знав, що вони вже чекатимуть на нас, коли ми приїдемо?',
			answer:
				'Did you know they would already be waiting for us when we arrived?',
			accept: [
				"Did you know {that|} {they would|they'd} {already be|be} waiting for us when we {arrived|got there}?",
			],
			traps: {
				be: ['being', 'been', 'are'],
				waiting: ['wait', 'waited'],
				arrived: ['arrive', 'arrives', 'will'],
			},
		},
		{
			id: 'sixteen-english-tenses-53',
			form: 'negative',
			prompt: "Мій батько ніколи не п'є каву ввечері.",
			answer: 'My father never drinks coffee in the evening.',
			traps: {
				drinks: ['drink', 'drank', 'drinking'],
			},
		},
		{
			id: 'sixteen-english-tenses-54',
			form: 'negative',
			prompt: 'Я не думав, що іспит буде таким важким.',
			answer: "I didn't think the exam would be so difficult.",
			accept: [
				"I didn't think {that|} the exam {would be|was going to be} {so|that} {difficult|hard}.",
			],
			traps: {
				would: ['does', 'did'],
				be: ['is', 'been', 'being'],
			},
		},
		{
			id: 'sixteen-english-tenses-55',
			form: 'affirmative',
			prompt: 'Я знав, що діти ще гратимуться, коли я повернуся.',
			answer: 'I knew the children would still be playing when I came back.',
			accept: [
				'I knew {that|} the children would still be playing when I {came back|got back|returned}.',
			],
			traps: {
				be: ['being', 'been', 'are'],
				playing: ['play', 'played'],
			},
		},
		{
			id: 'sixteen-english-tenses-56',
			form: 'negative',
			prompt: 'Коли я прокинувся, сонце ще не зійшло.',
			answer: "When I woke up, the sun hadn't risen yet.",
			accept: ["When I woke up, the sun hadn't {risen|come up} yet."],
			traps: {
				"hadn't": ["didn't", "hasn't", "wasn't"],
				risen: ['rose', 'rise', 'rising'],
			},
		},
		{
			id: 'sixteen-english-tenses-57',
			form: 'affirmative',
			prompt: 'Він був утомлений, бо працював із самого ранку.',
			answer: 'He was tired because he had been working since early morning.',
			accept: [
				"He was tired because {he had|he'd} {been working|worked} since {early morning|the early morning}.",
			],
			traps: {
				had: ['has', 'have', 'was'],
				working: ['work', 'works'],
			},
		},
		{
			id: 'sixteen-english-tenses-58',
			form: 'affirmative',
			prompt: 'Ми чекали вже дві години, коли нарешті приїхав автобус.',
			answer: 'We had been waiting for two hours when the bus finally came.',
			accept: [
				"{We had|We'd} been waiting for two hours when the bus finally {came|arrived}.",
			],
			traps: {
				had: ['have', 'has', 'were'],
				waiting: ['wait', 'waited'],
			},
		},
		{
			id: 'sixteen-english-tenses-59',
			form: 'question',
			prompt: 'Ти коли-небудь бачив море до тієї подорожі?',
			answer: 'Had you ever seen the sea before that trip?',
			traps: {
				Had: ['Have', 'Has', 'Were'],
				seen: ['saw', 'see'],
			},
		},
		{
			id: 'sixteen-english-tenses-60',
			form: 'negative',
			prompt: 'Я не впізнав його, бо ніколи раніше його не бачив.',
			answer: "I didn't recognise him because I had never seen him before.",
			accept: [
				"I didn't {recognise|recognize} him because {I had|I'd} never seen him before.",
			],
			traps: {
				had: ['have', 'has', 'was'],
				seen: ['saw', 'see'],
			},
		},
		{
			id: 'sixteen-english-tenses-61',
			form: 'negative',
			prompt: 'Вона пообіцяла, що більше не запізнюватиметься.',
			answer: "She promised she wouldn't be late again.",
			accept: [
				"She promised {that|} she wouldn't be late {again|anymore|any more}.",
			],
			traps: {
				"wouldn't": ["didn't", "doesn't", "won't"],
			},
		},
		{
			id: 'sixteen-english-tenses-62',
			form: 'affirmative',
			prompt: 'Не телефонуй мені після десятої: я вже спатиму.',
			answer: "Don't call me after ten, I'll be sleeping.",
			accept: [
				"Don't {call|phone|ring} me after ten, I'll {already be|be} {sleeping|asleep}.",
			],
			traps: {
				be: ['being', 'been', 'am'],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'sixteen-english-tenses-63',
			form: 'question',
			prompt: 'Чому ти усміхаєшся?',
			answer: 'Why are you smiling?',
			traps: {
				are: ['do', 'did', 'have'],
				smiling: ['smile', 'smiles', 'smiled'],
			},
		},
		{
			id: 'sixteen-english-tenses-64',
			form: 'question',
			prompt: 'Як довго ти вчиш англійську?',
			answer: 'How long have you been learning English?',
			accept: [
				'How long have you {been learning|been studying|studied} English?',
			],
			traps: {
				have: ['do', 'are', 'has'],
				learning: ['learn', 'learns'],
			},
		},
		{
			id: 'sixteen-english-tenses-65',
			form: 'question',
			prompt: 'Ти коли-небудь був у Лондоні?',
			answer: 'Have you ever been to London?',
			traps: {
				Have: ['Were', 'Are', 'Has'],
				been: ['was', 'be', 'being'],
			},
		},
		{
			id: 'sixteen-english-tenses-66',
			form: 'affirmative',
			prompt: 'Він сказав, що до понеділка вже закінчить звіт.',
			answer: 'He said he would have finished the report by Monday.',
			accept: [
				"He said {that|} {he would|he'd} {have already|already have|have} finished the report by Monday.",
				"He said that by Monday {he would|he'd} {have already|already have|have} finished the report.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				finished: ['finish', 'finishing'],
			},
		},
		{
			id: 'sixteen-english-tenses-67',
			form: 'affirmative',
			prompt: 'До полудня ми йтимемо вже шість годин.',
			answer: "By noon we'll have been walking for six hours.",
			accept: ["By {noon|midday} we'll have been walking for six hours."],
			traps: {
				have: ['has', 'had', 'having'],
				walking: ['walk', 'walked'],
			},
		},
		{
			id: 'sixteen-english-tenses-68',
			form: 'question',
			prompt: 'Що ти робитимеш завтра о цій порі?',
			answer: 'What will you be doing at this time tomorrow?',
			accept: [
				'What will you be doing {at this time tomorrow|this time tomorrow}?',
			],
			traps: {
				will: ['do', 'did', 'have'],
				doing: ['do', 'done', 'did'],
			},
		},
		{
			id: 'sixteen-english-tenses-69',
			form: 'affirmative',
			prompt: 'Коли ми приїхали на вокзал, потяг уже пішов.',
			answer: 'When we got to the station, the train had already left.',
			accept: [
				'When we {got to|arrived at} the station, the train had {already left|left already}.',
			],
			traps: {
				had: ['has', 'have', 'was'],
				left: ['leave', 'leaves'],
			},
		},
		{
			id: 'sixteen-english-tenses-70',
			form: 'negative',
			prompt: 'Я думаю, вона не прийде.',
			answer: "I don't think she'll come.",
			accept: [
				"I don't think {she will|she's going to} come.",
				"I think she won't come.",
			],
			traps: {
				come: ['came', 'comes', 'coming'],
			},
		},
		{
			id: 'sixteen-english-tenses-71',
			form: 'negative',
			prompt: 'Я ще не бачив цього фільму.',
			answer: "I haven't seen this film yet.",
			accept: ["I haven't seen this {film|movie} yet."],
			traps: {
				seen: ['saw', 'see', 'seeing'],
			},
		},
		{
			id: 'sixteen-english-tenses-72',
			form: 'negative',
			prompt: 'Вчора я не снідав.',
			answer: "Yesterday I didn't have breakfast.",
			accept: [
				"{Yesterday I didn't have|Yesterday I didn't eat} breakfast.",
				"I didn't {have|eat} breakfast yesterday.",
			],
			traps: {
				"didn't": ["don't", "haven't", "wasn't"],
			},
		},
		{
			id: 'sixteen-english-tenses-73',
			form: 'affirmative',
			prompt: 'Ми сподівалися, що погода буде кращою.',
			answer: 'We hoped the weather would be better.',
			accept: ['We hoped {that|} the weather would be better.'],
			traps: {
				would: ['will', 'does', 'did'],
				be: ['is', 'been', 'being'],
			},
		},
		{
			id: 'sixteen-english-tenses-74',
			form: 'question',
			prompt: 'Що ти зараз читаєш?',
			answer: 'What are you reading now?',
			accept: ['What are you reading {now|right now}?'],
			traps: {
				are: ['do', 'did', 'were'],
				reading: ['read', 'reads'],
			},
		},
		{
			id: 'sixteen-english-tenses-75',
			form: 'affirmative',
			prompt: 'Він сказав, що зателефонує мені ввечері.',
			answer: 'He said he would call me in the evening.',
			accept: [
				"He said {that|} {he would|he'd|he was going to} {call|phone|ring} me in the evening.",
			],
			traps: {
				would: ['did', 'does'],
				call: ['called', 'calls', 'calling'],
			},
		},
		{
			id: 'sixteen-english-tenses-76',
			form: 'affirmative',
			prompt: 'Послухай! Хтось співає надворі.',
			answer: 'Listen! Someone is singing outside.',
			accept: ['Listen! {Someone|Somebody} is singing outside.'],
			traps: {
				is: ['was', 'has', 'does'],
				singing: ['sings', 'sing', 'sang'],
			},
		},
		{
			id: 'sixteen-english-tenses-77',
			form: 'affirmative',
			prompt: 'Коли ти прокинешся, я вже поїду.',
			answer: "When you wake up, I'll have already left.",
			accept: [
				"{When|By the time} you wake up, I'll {have already|already have|have} {left|gone}.",
			],
			traps: {
				wake: ['will', 'woke', 'wakes'],
				left: ['leave', 'leaving'],
			},
		},
		{
			id: 'sixteen-english-tenses-78',
			form: 'question',
			prompt: 'Ти думав, що до вечора ми будемо в дорозі вже десять годин?',
			answer:
				'Did you think that by the evening we would have been driving for ten hours?',
			accept: [
				"Did you think that by {the|} evening {we would|we'd} have been {driving|travelling} for ten hours?",
				"Did you think {that|} {we would|we'd} have been {driving|travelling} for ten hours by {the|} evening?",
			],
			traps: {
				have: ['has', 'had', 'having'],
				been: ['being', 'be', 'was'],
			},
		},
		{
			id: 'sixteen-english-tenses-79',
			form: 'question',
			prompt: 'Ти думав, що він прийде?',
			answer: 'Did you think he would come?',
			accept: ["Did you think {that|} {he would|he'd|he was going to} come?"],
			traps: {
				would: ['did', 'does'],
				come: ['came', 'comes', 'coming'],
			},
		},
		{
			id: 'sixteen-english-tenses-80',
			form: 'affirmative',
			prompt:
				'Він сказав, що в травні буде десять років, як він водить машину.',
			answer: 'He said that in May he would have been driving for ten years.',
			accept: [
				"He said that in May {he would|he'd} have been driving for ten years.",
				"He said {that|} {he would|he'd} have been driving for ten years {in|by} May.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				driving: ['drive', 'driven', 'drove'],
			},
		},
		{
			id: 'sixteen-english-tenses-81',
			form: 'question',
			prompt: 'Коли ти повернувся додому?',
			answer: 'When did you come back home?',
			accept: ['When did you {come back|get back|come|get|return} home?'],
			traps: {
				did: ['have', 'do', 'are'],
			},
		},
		{
			id: 'sixteen-english-tenses-82',
			form: 'affirmative',
			prompt: 'Я знав, що вона погодиться.',
			answer: 'I knew she would agree.',
			accept: ["I knew {that|} {she would|she'd|she was going to} agree."],
			traps: {
				would: ['did', 'does'],
				agree: ['agreed', 'agrees', 'agreeing'],
			},
		},
		{
			id: 'sixteen-english-tenses-83',
			form: 'negative',
			prompt: 'Я не жартую, я кажу правду.',
			answer: "I'm not joking, I'm telling the truth.",
			accept: ["I'm not {joking|kidding}, I'm telling the truth."],
			traps: {
				joking: ['joke', 'joked'],
				telling: ['tell', 'told', 'tells'],
			},
		},
		{
			id: 'sixteen-english-tenses-84',
			form: 'question',
			prompt: 'Що ти купив учора?',
			answer: 'What did you buy yesterday?',
			traps: {
				did: ['have', 'do', 'were'],
				buy: ['bought', 'buys'],
			},
		},
		{
			id: 'sixteen-english-tenses-85',
			form: 'question',
			prompt: 'Скільки вони вже зустрічалися, коли він зробив їй пропозицію?',
			answer: 'How long had they been dating when he proposed to her?',
			accept: [
				'How long had they been {dating|going out} when he proposed to her?',
			],
			traps: {
				had: ['have', 'did', 'were'],
				dating: ['date', 'dated'],
			},
		},
		{
			id: 'sixteen-english-tenses-86',
			form: 'affirmative',
			prompt: 'Я думаю, тобі сподобається цей фільм.',
			answer: "I think you'll like this film.",
			accept: ["I think {you'll|you're going to} like this {film|movie}."],
			traps: {
				like: ['likes', 'liked', 'liking'],
			},
		},
		{
			id: 'sixteen-english-tenses-87',
			form: 'affirmative',
			prompt: 'Коли я був дитиною, я жив у селі.',
			answer: 'When I was a child, I lived in a village.',
			accept: ['When I was a child, I {lived|used to live} in a village.'],
			traps: {
				was: ['were', 'am', 'have'],
				lived: ['live', 'lives', 'living'],
			},
		},
		{
			id: 'sixteen-english-tenses-88',
			form: 'affirmative',
			prompt: 'Я двічі запізнився на роботу цього тижня.',
			answer: "I've been late for work twice this week.",
			traps: {
				been: ['was', 'be', 'being'],
			},
		},
		{
			id: 'sixteen-english-tenses-89',
			form: 'affirmative',
			prompt: 'Не хвилюйся, я тобі допоможу.',
			answer: "Don't worry, I'll help you.",
			traps: {
				"I'll": ["I'm", "I'd"],
				help: ['helping', 'helped', 'helps'],
			},
		},
		{
			id: 'sixteen-english-tenses-90',
			form: 'affirmative',
			prompt:
				'Наступного місяця буде десять років, як він викладає в цій школі.',
			answer:
				"Next month he'll have been teaching at this school for ten years.",
			accept: [
				"Next month {he'll|he will} have {been teaching|taught} {at|in} this school for ten years.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				teaching: ['teach', 'teaches'],
			},
		},
		{
			id: 'sixteen-english-tenses-91',
			form: 'negative',
			prompt: "Я знав, що о дев'ятій він ще не спатиме.",
			answer: "I knew he wouldn't be sleeping at nine.",
			accept: ["I knew {that|} he wouldn't be {sleeping|asleep} at nine."],
			traps: {
				be: ['being', 'been', 'is'],
				sleeping: ['sleep', 'slept'],
			},
		},
		{
			id: 'sixteen-english-tenses-92',
			form: 'question',
			prompt:
				'Скільки років ви вже житимете в цьому будинку до наступної весни?',
			answer:
				'How long will you have been living in this house by next spring?',
			accept: [
				'{How long|How many years} will you have {been living|lived} in this house by next spring?',
			],
			traps: {
				have: ['has', 'had', 'having'],
				living: ['live', 'lives'],
			},
		},
		{
			id: 'sixteen-english-tenses-93',
			form: 'question',
			prompt: 'Як часто ти ходиш у спортзал?',
			answer: 'How often do you go to the gym?',
			traps: {
				do: ['does', 'are', 'did'],
			},
		},
		{
			id: 'sixteen-english-tenses-94',
			form: 'question',
			prompt: 'Скільки років ви вже будете одружені в червні?',
			answer: 'How long will you have been married in June?',
			accept: [
				'{How long|How many years} will you have been married {in|by} June?',
			],
			traps: {
				have: ['has', 'had', 'having'],
				been: ['being', 'be', 'was'],
			},
		},
		{
			id: 'sixteen-english-tenses-95',
			form: 'question',
			prompt:
				'Ти знав, що на момент виходу на пенсію він викладатиме вже сорок років?',
			answer:
				'Did you know he would have been teaching for forty years when he retired?',
			accept: [
				"Did you know {that|} {he would|he'd} have {been teaching|taught} for forty years {when|by the time} he retired?",
			],
			traps: {
				have: ['has', 'had', 'having'],
				teaching: ['teach', 'teaches'],
			},
		},
		{
			id: 'sixteen-english-tenses-96',
			form: 'affirmative',
			prompt: 'Вона вже прочитала цю книжку.',
			answer: 'She has already read this book.',
			accept: [
				"{She has|She's} {already read this book|read this book already}.",
			],
			traps: {
				has: ['have', 'had', 'is'],
			},
		},
		{
			id: 'sixteen-english-tenses-97',
			form: 'affirmative',
			prompt: 'Два роки тому вона переїхала до Львова.',
			answer: 'Two years ago she moved to Lviv.',
			accept: ['She moved to Lviv two years ago.'],
			traps: {
				moved: ['moves', 'move', 'has'],
			},
		},
		{
			id: 'sixteen-english-tenses-98',
			form: 'question',
			prompt: 'Скільки разів ти був у Києві?',
			answer: 'How many times have you been to Kyiv?',
			accept: ['How many times have you been {to|in} Kyiv?'],
			traps: {
				have: ['did', 'are', 'has'],
				been: ['was', 'be', 'being'],
			},
		},
		{
			id: 'sixteen-english-tenses-99',
			form: 'negative',
			prompt:
				'Вона сказала, що в червні ще не буде й року, як вона вчить японську.',
			answer:
				"She said that in June she wouldn't have been learning Japanese for a year.",
			accept: [
				"She said that in June she wouldn't have been {learning|studying} Japanese for a year.",
			],
			traps: {
				have: ['has', 'had', 'having'],
				been: ['being', 'be', 'was'],
			},
		},
		{
			id: 'sixteen-english-tenses-100',
			form: 'affirmative',
			prompt: 'У неї червоні очі, бо вона плакала.',
			answer: "Her eyes are red because she's been crying.",
			accept: [
				"{Her eyes are red|She has red eyes} because {she has|she's} been crying.",
			],
			traps: {
				been: ['being', 'be', 'was'],
				crying: ['cry', 'cries'],
			},
		},
	],
})
