import { defineTopic } from '../../define-topic'

export const passiveVoicePresentPerfect = defineTopic({
	id: 'passive-voice-present-perfect',
	level: 'intermediate',
	title: 'Passive Voice - Present Perfect',
	subtitle: 'Пасивний стан — теперішній доконаний час',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				"has been (однина) / have been (множина) + третя форма дієслова (past participle). Слово been обов'язкове.",
			examples: [
				{
					text: 'The emails have just been sent.',
					translation: 'Листи щойно відправлено.',
				},
				{
					text: 'The road has already been built.',
					translation: 'Дорогу вже збудовано.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Has/Have + підмет + been + третя форма. «Вже?» у питанні — yet у кінці.',
			examples: [
				{
					text: 'Has the car been washed yet?',
					translation: 'Машину вже помито?',
				},
				{
					text: 'Have you ever been stopped by the police?',
					translation: 'Тебе коли-небудь зупиняла поліція?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"hasn't/haven't + been + третя форма. «Ще не» — yet у кінці речення.",
			examples: [
				{
					text: "The bed hasn't been made yet.",
					translation: 'Ліжко ще не застелено.',
				},
				{
					text: "The bills haven't been paid yet.",
					translation: 'Рахунки ще не оплачено.',
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				'Дію виконано, а результат важливий зараз; хто її виконав — невідомо або неважливо. Українською це часто форма на -но/-то («пофарбовано», «вкрадено»). Маркери: already, just, yet, ever, never, this week, since. З точним минулим часом (yesterday, in 2020) — тільки Past Simple: was stolen.',
			examples: [
				{
					text: 'My phone has been stolen!',
					translation: 'Мій телефон украли! (і зараз його немає)',
				},
				{
					text: 'My phone was stolen yesterday.',
					translation: 'Мій телефон украли вчора.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'passive-voice-present-perfect-1',
			form: 'affirmative',
			prompt: 'Мою машину вкрали.',
			answer: 'My car has been stolen.',
			traps: {
				stolen: ['stole', 'steal', 'stealed'],
			},
		},
		{
			id: 'passive-voice-present-perfect-2',
			form: 'affirmative',
			prompt: 'Усі квитки вже продано.',
			answer: 'All the tickets have been sold.',
			traps: {
				sold: ['sell', 'selled', 'sells'],
			},
		},
		{
			id: 'passive-voice-present-perfect-3',
			form: 'affirmative',
			prompt: 'Двері вже пофарбовано.',
			answer: 'The door has already been painted.',
			accept: [
				'The {door has|doors have} {already been painted|been painted already}.',
			],
			traps: {
				been: ['being', 'be'],
				painted: ['paint', 'paints', 'painting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-4',
			form: 'affirmative',
			prompt: 'Листа щойно надіслано.',
			answer: 'The letter has just been sent.',
			traps: {
				has: ['have', 'is'],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-present-perfect-5',
			form: 'affirmative',
			prompt: 'Вікна вже вимито.',
			answer: 'The windows have already been washed.',
			accept: [
				'The windows have already been {washed|cleaned}.',
				'The windows have been {washed|cleaned} already.',
			],
			traps: {
				have: ['has', 'had'],
				washed: ['wash', 'washing', 'washes'],
			},
		},
		{
			id: 'passive-voice-present-perfect-6',
			form: 'affirmative',
			prompt: 'Посилку щойно доставлено.',
			answer: 'The parcel has just been delivered.',
			accept: ['The {parcel|package} has just been delivered.'],
			traps: {
				has: ['have', 'is'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-7',
			form: 'affirmative',
			prompt: 'Злодія вже заарештовано.',
			answer: 'The thief has already been arrested.',
			accept: ['The thief has {already been arrested|been arrested already}.'],
			traps: {
				has: ['have', 'had'],
				arrested: ['arrest', 'arrests', 'arresting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-8',
			form: 'affirmative',
			prompt: 'Нову школу вже збудовано.',
			answer: 'The new school has already been built.',
			accept: ['The new school has {already been built|been built already}.'],
			traps: {
				been: ['being', 'be', 'was'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-present-perfect-9',
			form: 'affirmative',
			prompt: 'Цю книжку вже перекладено двадцятьма мовами.',
			answer: 'This book has already been translated into twenty languages.',
			traps: {
				has: ['have', 'had'],
				translated: ['translate', 'translates', 'translating'],
			},
		},
		{
			id: 'passive-voice-present-perfect-10',
			form: 'affirmative',
			prompt: 'Торт щойно розрізано.',
			answer: 'The cake has just been cut.',
			traps: {
				been: ['being', 'be'],
				cut: ['cutted', 'cuts', 'cutting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-11',
			form: 'affirmative',
			prompt: 'Усі гроші вже витрачено.',
			answer: 'All the money has already been spent.',
			accept: ['All the money has {already been spent|been spent already}.'],
			traps: {
				has: ['have', 'had'],
				spent: ['spend', 'spended', 'spending'],
			},
		},
		{
			id: 'passive-voice-present-perfect-12',
			form: 'affirmative',
			prompt: 'Мій загублений гаманець щойно знайдено.',
			answer: 'My lost wallet has just been found.',
			accept: ['My lost {wallet|purse} has just been found.'],
			traps: {
				has: ['have', 'is'],
				found: ['find', 'finded', 'founded'],
			},
		},
		{
			id: 'passive-voice-present-perfect-13',
			form: 'affirmative',
			prompt: 'Нові правила вже опубліковано.',
			answer: 'The new rules have already been published.',
			accept: [
				'The new rules have {already been published|been published already}.',
			],
			traps: {
				have: ['has', 'had'],
				published: ['publish', 'publishes', 'publishing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-14',
			form: 'affirmative',
			prompt: 'Зустріч щойно скасовано.',
			answer: 'The meeting has just been cancelled.',
			accept: ['The meeting has just been {cancelled|canceled}.'],
			traps: {
				has: ['have', 'is'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-15',
			form: 'affirmative',
			prompt: 'Це відео вже переглянуто мільйон разів.',
			answer: 'This video has already been watched a million times.',
			accept: ['This video has already been {watched|viewed} a million times.'],
			traps: {
				has: ['have', 'had'],
				watched: ['watch', 'watches', 'watching'],
			},
		},
		{
			id: 'passive-voice-present-perfect-16',
			form: 'affirmative',
			prompt: 'Твій пароль щойно змінено.',
			answer: 'Your password has just been changed.',
			traps: {
				has: ['have', 'is'],
				changed: ['change', 'changes', 'changing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-17',
			form: 'affirmative',
			prompt: 'Цей міст ремонтувався вже двічі.',
			answer: 'This bridge has already been repaired twice.',
			accept: ['This bridge has been repaired twice already.'],
			traps: {
				been: ['being', 'be', 'was'],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-18',
			form: 'affirmative',
			prompt: 'Нашу вулицю щойно перейменовано.',
			answer: 'Our street has just been renamed.',
			traps: {
				has: ['have', 'is'],
				renamed: ['rename', 'renames', 'renaming'],
			},
		},
		{
			id: 'passive-voice-present-perfect-19',
			form: 'affirmative',
			prompt: "Усю їжу вже з'їдено.",
			answer: 'All the food has already been eaten.',
			accept: ['All the food has {already been eaten|been eaten already}.'],
			traps: {
				been: ['being', 'be'],
				eaten: ['ate', 'eat', 'eated'],
			},
		},
		{
			id: 'passive-voice-present-perfect-20',
			form: 'affirmative',
			prompt: 'Усе вино вже випито.',
			answer: 'All the wine has already been drunk.',
			accept: ['All the wine has {already been drunk|been drunk already}.'],
			traps: {
				has: ['have', 'had'],
				drunk: ['drank', 'drink', 'drinked'],
			},
		},
		{
			id: 'passive-voice-present-perfect-21',
			form: 'affirmative',
			prompt: 'Переможця вже обрано.',
			answer: 'The winner has already been chosen.',
			accept: [
				'The winner has already been {chosen|selected}.',
				'The winner has been {chosen|selected} already.',
			],
			traps: {
				been: ['being', 'be'],
				chosen: ['chose', 'choose', 'choosed'],
			},
		},
		{
			id: 'passive-voice-present-perfect-22',
			form: 'affirmative',
			prompt: 'Цю пісню вже записано.',
			answer: 'This song has already been recorded.',
			accept: ['This song has {already been recorded|been recorded already}.'],
			traps: {
				has: ['have', 'had'],
				recorded: ['record', 'records', 'recording'],
			},
		},
		{
			id: 'passive-voice-present-perfect-23',
			form: 'affirmative',
			prompt: 'Вікно щойно розбито.',
			answer: 'The window has just been broken.',
			accept: ['The window has just been {broken|smashed}.'],
			traps: {
				has: ['have', 'is'],
				broken: ['broke', 'break', 'breaked'],
			},
		},
		{
			id: 'passive-voice-present-perfect-24',
			form: 'affirmative',
			prompt: 'Твоє повідомлення вже прочитано.',
			answer: 'Your message has already been read.',
			accept: ['Your message has {already been read|been read already}.'],
			traps: {
				been: ['being', 'be'],
				read: ['readed', 'reads', 'reading'],
			},
		},
		{
			id: 'passive-voice-present-perfect-25',
			form: 'affirmative',
			prompt: 'Дітей уже нагодовано.',
			answer: 'The children have already been fed.',
			accept: ['The {children|kids} have {already been fed|been fed already}.'],
			traps: {
				have: ['has', 'had'],
				fed: ['feed', 'feeded', 'feeding'],
			},
		},
		{
			id: 'passive-voice-present-perfect-26',
			form: 'affirmative',
			prompt: 'Рахунок уже оплачено.',
			answer: 'The bill has already been paid.',
			accept: ['The bill has {already been paid|been paid already}.'],
			traps: {
				been: ['being', 'be'],
				paid: ['payed', 'pay', 'paying'],
			},
		},
		{
			id: 'passive-voice-present-perfect-27',
			form: 'affirmative',
			prompt: 'Цю картину вже продано.',
			answer: 'This painting has already been sold.',
			accept: [
				'This {painting|picture} has {already been sold|been sold already}.',
			],
			traps: {
				has: ['have', 'had'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-present-perfect-28',
			form: 'affirmative',
			prompt: "Не шукай торт — його вже з'їдено.",
			answer: "Don't look for the cake, it has already been eaten.",
			accept: [
				"Don't look for the cake, {it has|it's} {already been eaten|been eaten already}.",
			],
			traps: {
				been: ['being', 'be'],
				eaten: ['ate', 'eat', 'eating'],
			},
		},
		{
			id: 'passive-voice-present-perfect-29',
			form: 'affirmative',
			prompt: 'Не хвилюйся за звіт — його вже надіслано.',
			answer: "Don't worry about the report, it has already been sent.",
			accept: [
				"Don't worry about the report, {it has|it's} {already been sent|been sent already}.",
			],
			traps: {
				been: ['being', 'be'],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-present-perfect-30',
			form: 'affirmative',
			prompt: 'У нашому парку вже посаджено сто дерев.',
			answer: 'A hundred trees have already been planted in our park.',
			accept: ['{A|One} hundred trees have already been planted in our park.'],
			traps: {
				have: ['has', 'had'],
				planted: ['plant', 'plants', 'planting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-31',
			form: 'affirmative',
			prompt: "П'ятдесят машин продано цього тижня.",
			answer: 'Fifty cars have been sold this week.',
			traps: {
				have: ['has', 'had'],
				sold: ['sell', 'selled', 'sells'],
			},
		},
		{
			id: 'passive-voice-present-perfect-32',
			form: 'affirmative',
			prompt: 'Три нові мости збудовано цього року.',
			answer: 'Three new bridges have been built this year.',
			traps: {
				been: ['being', 'be', 'was'],
				built: ['build', 'builded', 'builds'],
			},
		},
		{
			id: 'passive-voice-present-perfect-33',
			form: 'affirmative',
			prompt: 'Закон уже підписано.',
			answer: 'The law has already been signed.',
			accept: ['The law has {already been signed|been signed already}.'],
			traps: {
				has: ['have', 'had'],
				signed: ['sign', 'signs', 'signing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-34',
			form: 'affirmative',
			prompt: 'Усі запрошення вже надіслано.',
			answer: 'All the invitations have already been sent.',
			accept: [
				'All {the|} invitations have {already been sent|been sent already}.',
			],
			traps: {
				have: ['has', 'had'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-35',
			form: 'affirmative',
			prompt: 'Мені щойно запропоновано нову роботу.',
			answer: "I've just been offered a new job.",
			traps: {
				been: ['being', 'be'],
				offered: ['offer', 'offers', 'offering'],
			},
		},
		{
			id: 'passive-voice-present-perfect-36',
			form: 'affirmative',
			prompt: 'Нас уже попереджено про шторм.',
			answer: "We've already been warned about the storm.",
			accept: ["We've been warned about the storm already."],
			traps: {
				been: ['being', 'be'],
				warned: ['warn', 'warns', 'warning'],
			},
		},
		{
			id: 'passive-voice-present-perfect-37',
			form: 'affirmative',
			prompt: 'Ця церква ніколи не перебудовувалася.',
			answer: 'This church has never been rebuilt.',
			traps: {
				has: ['have', 'had'],
				rebuilt: ['rebuild', 'rebuilded', 'rebuilding'],
			},
		},
		{
			id: 'passive-voice-present-perfect-38',
			form: 'affirmative',
			prompt: 'Цей рекорд ще жодного разу не побито.',
			answer: 'This record has never been broken.',
			traps: {
				been: ['being', 'be', 'was'],
				broken: ['broke', 'break', 'breaked'],
			},
		},
		{
			id: 'passive-voice-present-perfect-39',
			form: 'affirmative',
			prompt: 'Ця кімната ніколи не використовувалася.',
			answer: 'This room has never been used.',
			traps: {
				has: ['have', 'had'],
				used: ['use', 'uses', 'using'],
			},
		},
		{
			id: 'passive-voice-present-perfect-40',
			form: 'affirmative',
			prompt: 'Зміни щойно збережено.',
			answer: 'The changes have just been saved.',
			traps: {
				have: ['has', 'are'],
				saved: ['save', 'saves', 'saving'],
			},
		},
		{
			id: 'passive-voice-present-perfect-41',
			form: 'affirmative',
			prompt: 'Твій акаунт щойно видалено.',
			answer: 'Your account has just been deleted.',
			traps: {
				been: ['being', 'be'],
				deleted: ['delete', 'deletes', 'deleting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-42',
			form: 'affirmative',
			prompt: 'Музей щойно відкрито.',
			answer: 'The museum has just been opened.',
			traps: {
				has: ['have', 'is'],
				opened: ['open', 'opens', 'opening'],
			},
		},
		{
			id: 'passive-voice-present-perfect-43',
			form: 'affirmative',
			prompt: 'Ліфт уже відремонтовано.',
			answer: 'The lift has already been repaired.',
			accept: [
				'The {lift|elevator} has already been {repaired|fixed}.',
				'The {lift|elevator} has been {repaired|fixed} already.',
			],
			traps: {
				been: ['being', 'be'],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-44',
			form: 'affirmative',
			prompt: 'Мою сумку вже перевірено.',
			answer: 'My bag has already been checked.',
			accept: ['My bag has {already been checked|been checked already}.'],
			traps: {
				has: ['have', 'had'],
				checked: ['check', 'checks', 'checking'],
			},
		},
		{
			id: 'passive-voice-present-perfect-45',
			form: 'affirmative',
			prompt: "Його щойно звільнено з в'язниці.",
			answer: 'He has just been released from prison.',
			accept: ["{He has|He's} just been {released|freed} from prison."],
			traps: {
				has: ['have', 'is'],
				released: ['release', 'releases', 'releasing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-46',
			form: 'question',
			prompt: 'Мою посилку вже відправлено?',
			answer: 'Has my parcel been sent yet?',
			accept: [
				'Has my {parcel|package} been sent {yet|already}?',
				'Has my {parcel|package} already been sent?',
			],
			traps: {
				Has: ['Have', 'Does'],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-present-perfect-47',
			form: 'question',
			prompt: 'Кімнату вже прибрано?',
			answer: 'Has the room been cleaned yet?',
			accept: [
				'Has the room been {cleaned|tidied} {yet|already}?',
				'Has the room already been {cleaned|tidied}?',
			],
			traps: {
				Has: ['Have', 'Does'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-48',
			form: 'question',
			prompt: 'Готель уже заброньовано?',
			answer: 'Has the hotel been booked yet?',
			accept: [
				'Has the hotel been {booked|reserved} {yet|already}?',
				'Has the hotel already been {booked|reserved}?',
			],
			traps: {
				Has: ['Have', 'Does'],
				booked: ['book', 'books', 'booking'],
			},
		},
		{
			id: 'passive-voice-present-perfect-49',
			form: 'question',
			prompt: 'Тебе коли-небудь штрафували?',
			answer: 'Have you ever been fined?',
			traps: {
				Have: ['Has', 'Do'],
				fined: ['fine', 'fines', 'fining'],
			},
		},
		{
			id: 'passive-voice-present-perfect-50',
			form: 'question',
			prompt: 'Тебе коли-небудь грабували?',
			answer: 'Have you ever been robbed?',
			traps: {
				been: ['being', 'be'],
				robbed: ['rob', 'robs', 'robbing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-51',
			form: 'question',
			prompt: 'Тебе коли-небудь арештовували?',
			answer: 'Have you ever been arrested?',
			traps: {
				Have: ['Has', 'Do'],
				arrested: ['arrest', 'arrests', 'arresting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-52',
			form: 'question',
			prompt: 'Тебе коли-небудь звільняли з роботи?',
			answer: 'Have you ever been fired?',
			accept: ['Have you ever been {fired|sacked}?'],
			traps: {
				been: ['being', 'be'],
				fired: ['fire', 'fires', 'firing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-53',
			form: 'question',
			prompt: 'Злочинця вже знайдено?',
			answer: 'Has the criminal been found yet?',
			accept: [
				'Has the criminal been found {yet|already}?',
				'Has the criminal already been found?',
			],
			traps: {
				Has: ['Have', 'Does'],
				found: ['find', 'finded', 'founded'],
			},
		},
		{
			id: 'passive-voice-present-perfect-54',
			form: 'question',
			prompt: 'Ця книжка коли-небудь перекладалася українською?',
			answer: 'Has this book ever been translated into Ukrainian?',
			traps: {
				Has: ['Have', 'Does'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-55',
			form: 'question',
			prompt: 'Цей фільм коли-небудь показувався в Україні?',
			answer: 'Has this film ever been shown in Ukraine?',
			accept: ['Has this {film|movie} ever been shown in Ukraine?'],
			traps: {
				Has: ['Have', 'Does'],
				shown: ['showed', 'show', 'showing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-56',
			form: 'question',
			prompt: 'Скільки квитків уже продано?',
			answer: 'How many tickets have already been sold?',
			accept: ['How many tickets have been sold?'],
			traps: {
				have: ['has', 'do'],
				sold: ['sell', 'selled', 'sells'],
			},
		},
		{
			id: 'passive-voice-present-perfect-57',
			form: 'question',
			prompt: 'Скільки будинків збудовано цього року?',
			answer: 'How many houses have been built this year?',
			traps: {
				have: ['has', 'do'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-present-perfect-58',
			form: 'question',
			prompt: 'Скільки дерев посаджено цього тижня?',
			answer: 'How many trees have been planted this week?',
			traps: {
				been: ['being', 'be'],
				planted: ['plant', 'plants', 'planting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-59',
			form: 'question',
			prompt: 'Чому посилку досі не доставлено?',
			answer: "Why hasn't the parcel been delivered yet?",
			accept: [
				"Why hasn't the {parcel|package} been delivered yet?",
				'Why has the {parcel|package} not been delivered yet?',
			],
			traps: {
				"hasn't": ["haven't", "doesn't"],
				delivered: ['deliver', 'delivers', 'delivering'],
			},
		},
		{
			id: 'passive-voice-present-perfect-60',
			form: 'question',
			prompt: 'Чому машину досі не полагоджено?',
			answer: "Why hasn't the car been fixed yet?",
			accept: ["Why hasn't the car been {fixed|repaired} yet?"],
			traps: {
				"hasn't": ["haven't", "doesn't"],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-61',
			form: 'question',
			prompt: 'Чому вікно досі не зачинено?',
			answer: "Why hasn't the window been closed yet?",
			accept: ["Why hasn't the window been {closed|shut} yet?"],
			traps: {
				"hasn't": ["haven't", "doesn't"],
				closed: ['close', 'closes', 'closing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-62',
			form: 'question',
			prompt: 'Переможця вже оголошено?',
			answer: 'Has the winner been announced yet?',
			accept: [
				'Has the winner been announced {yet|already}?',
				'Has the winner already been announced?',
			],
			traps: {
				Has: ['Have', 'Does'],
				announced: ['announce', 'announces', 'announcing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-63',
			form: 'question',
			prompt: 'Твої документи вже перевірено?',
			answer: 'Have your documents been checked yet?',
			accept: [
				'Have your documents been checked {yet|already}?',
				'Have your documents already been checked?',
			],
			traps: {
				Have: ['Has', 'Do'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-64',
			form: 'question',
			prompt: 'Щось уже вирішено?',
			answer: 'Has anything been decided yet?',
			accept: [
				'Has anything been decided {yet|already}?',
				'Has anything already been decided?',
			],
			traps: {
				Has: ['Have', 'Does'],
				decided: ['decide', 'decides', 'deciding'],
			},
		},
		{
			id: 'passive-voice-present-perfect-65',
			form: 'question',
			prompt: 'Твою валізу вже знайдено?',
			answer: 'Has your suitcase been found yet?',
			accept: [
				'Has your suitcase been found {yet|already}?',
				'Has your suitcase already been found?',
			],
			traps: {
				been: ['being', 'be'],
				found: ['find', 'finded', 'founded'],
			},
		},
		{
			id: 'passive-voice-present-perfect-66',
			form: 'question',
			prompt: 'Пароль уже змінено?',
			answer: 'Has the password been changed yet?',
			accept: [
				'Has the password been changed {yet|already}?',
				'Has the password already been changed?',
			],
			traps: {
				Has: ['Have', 'Does'],
				changed: ['change', 'changes', 'changing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-67',
			form: 'question',
			prompt: 'Нові меблі вже доставлено?',
			answer: 'Has the new furniture been delivered yet?',
			accept: [
				'Has the new furniture been delivered {yet|already}?',
				'Has the new furniture already been delivered?',
			],
			traps: {
				Has: ['Have', 'Does'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-68',
			form: 'question',
			prompt: 'Ці листи вже підписано?',
			answer: 'Have these letters been signed yet?',
			accept: [
				'Have these letters been signed {yet|already}?',
				'Have these letters already been signed?',
			],
			traps: {
				Have: ['Has', 'Do'],
				signed: ['sign', 'signs', 'signing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-69',
			form: 'question',
			prompt: 'Тебе вже повідомлено про зміни?',
			answer: 'Have you been told about the changes yet?',
			accept: [
				'Have you been {told|informed} about the changes {yet|already}?',
				'Have you already been {told|informed} about the changes?',
			],
			traps: {
				Have: ['Has', 'Do'],
				told: ['telled', 'tell', 'telling'],
			},
		},
		{
			id: 'passive-voice-present-perfect-70',
			form: 'question',
			prompt: 'Цей острів коли-небудь досліджувався?',
			answer: 'Has this island ever been explored?',
			traps: {
				been: ['being', 'be'],
				explored: ['explore', 'explores', 'exploring'],
			},
		},
		{
			id: 'passive-voice-present-perfect-71',
			form: 'question',
			prompt: 'Замовлення вже оплачено?',
			answer: 'Has the order been paid for yet?',
			accept: [
				'Has the order been paid for {yet|already}?',
				'Has the order already been paid for?',
			],
			traps: {
				Has: ['Have', 'Does'],
				paid: ['payed', 'pay', 'paying'],
			},
		},
		{
			id: 'passive-voice-present-perfect-72',
			form: 'question',
			prompt: 'Твою стару машину вже продано?',
			answer: 'Has your old car been sold yet?',
			accept: [
				'Has your old car been sold {yet|already}?',
				'Has your old car already been sold?',
			],
			traps: {
				Has: ['Have', 'Does'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-present-perfect-73',
			form: 'question',
			prompt: 'Скільки пісень уже записано?',
			answer: 'How many songs have already been recorded?',
			accept: ['How many songs have been recorded?'],
			traps: {
				have: ['has', 'do'],
				recorded: ['record', 'records', 'recording'],
			},
		},
		{
			id: 'passive-voice-present-perfect-74',
			form: 'question',
			prompt: 'Цю помилку вже виправлено?',
			answer: 'Has this mistake been corrected yet?',
			accept: [
				'Has this {mistake|error} been {corrected|fixed} {yet|already}?',
				'Has this {mistake|error} already been {corrected|fixed}?',
			],
			traps: {
				Has: ['Have', 'Does'],
				been: ['being', 'be'],
			},
		},
		{
			id: 'passive-voice-present-perfect-75',
			form: 'question',
			prompt: 'Що вже зроблено?',
			answer: 'What has already been done?',
			traps: {
				has: ['have', 'does'],
				done: ['did', 'do', 'doing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-76',
			form: 'negative',
			prompt: 'Квитки ще не продано.',
			answer: "The tickets haven't been sold yet.",
			traps: {
				"haven't": ["hasn't", "don't"],
				sold: ['sell', 'selled', 'sells'],
			},
		},
		{
			id: 'passive-voice-present-perfect-77',
			form: 'negative',
			prompt: 'Листа ще не надіслано.',
			answer: "The letter hasn't been sent yet.",
			traps: {
				"hasn't": ["haven't", "doesn't"],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-present-perfect-78',
			form: 'negative',
			prompt: 'Проблему ще не вирішено.',
			answer: "The problem hasn't been solved yet.",
			accept: ["The problem hasn't been {solved|resolved} yet."],
			traps: {
				been: ['being', 'be'],
				solved: ['solve', 'solves', 'solving'],
			},
		},
		{
			id: 'passive-voice-present-perfect-79',
			form: 'negative',
			prompt: 'Посуд ще не вимито.',
			answer: "The dishes haven't been washed yet.",
			traps: {
				"haven't": ["hasn't", "don't"],
				washed: ['wash', 'washes', 'washing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-80',
			form: 'negative',
			prompt: 'Вечерю ще не приготовано.',
			answer: "Dinner hasn't been cooked yet.",
			accept: ["Dinner hasn't been {cooked|made|prepared} yet."],
			traps: {
				"hasn't": ["haven't", "doesn't"],
				cooked: ['cook', 'cooks', 'cooking'],
			},
		},
		{
			id: 'passive-voice-present-perfect-81',
			form: 'negative',
			prompt: 'Цю таємницю досі не розгадано.',
			answer: "This mystery hasn't been solved yet.",
			accept: [
				"This mystery hasn't been solved yet.",
				"This mystery still hasn't been solved.",
			],
			traps: {
				been: ['being', 'be'],
				solved: ['solve', 'solves', 'solving'],
			},
		},
		{
			id: 'passive-voice-present-perfect-82',
			form: 'negative',
			prompt: 'Цей будинок не фарбувався з 1990 року.',
			answer: "This house hasn't been painted since 1990.",
			traps: {
				"hasn't": ["haven't", "doesn't"],
				painted: ['paint', 'paints', 'painting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-83',
			form: 'negative',
			prompt: 'Ця кімната не прибиралася з минулого місяця.',
			answer: "This room hasn't been cleaned since last month.",
			accept: ["This room hasn't been {cleaned|tidied} since last month."],
			traps: {
				been: ['being', 'be'],
				cleaned: ['clean', 'cleans', 'cleaning'],
			},
		},
		{
			id: 'passive-voice-present-perfect-84',
			form: 'negative',
			prompt: 'Мені ще не заплачено за цю роботу.',
			answer: "I haven't been paid for this work yet.",
			accept: ["I haven't been paid for this {work|job} yet."],
			traps: {
				"haven't": ["hasn't", "don't"],
				paid: ['payed', 'pay', 'paying'],
			},
		},
		{
			id: 'passive-voice-present-perfect-85',
			form: 'negative',
			prompt: 'Нас ще не запрошено на весілля.',
			answer: "We haven't been invited to the wedding yet.",
			traps: {
				been: ['being', 'be'],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-86',
			form: 'negative',
			prompt: 'Результати ще не оголошено.',
			answer: "The results haven't been announced yet.",
			traps: {
				"haven't": ["hasn't", "don't"],
				announced: ['announce', 'announces', 'announcing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-87',
			form: 'negative',
			prompt: 'Новий міст ще не відкрито.',
			answer: "The new bridge hasn't been opened yet.",
			traps: {
				"hasn't": ["haven't", "doesn't"],
				opened: ['open', 'opens', 'opening'],
			},
		},
		{
			id: 'passive-voice-present-perfect-88',
			form: 'negative',
			prompt: 'Мої ключі ще не знайдено.',
			answer: "My keys haven't been found yet.",
			traps: {
				been: ['being', 'be'],
				found: ['find', 'finded', 'founded'],
			},
		},
		{
			id: 'passive-voice-present-perfect-89',
			form: 'negative',
			prompt: 'Рішення ще не прийнято.',
			answer: "The decision hasn't been made yet.",
			accept: [
				"{The|A} decision hasn't been made yet.",
				'No decision has been made yet.',
			],
			traps: {
				"hasn't": ["haven't", "doesn't"],
				made: ['make', 'maked', 'making'],
			},
		},
		{
			id: 'passive-voice-present-perfect-90',
			form: 'negative',
			prompt: 'Ці листи ще не прочитано.',
			answer: "These letters haven't been read yet.",
			traps: {
				"haven't": ["hasn't", "don't"],
				read: ['readed', 'reads', 'reading'],
			},
		},
		{
			id: 'passive-voice-present-perfect-91',
			form: 'negative',
			prompt: 'Будинок ще не продано.',
			answer: "The house hasn't been sold yet.",
			traps: {
				been: ['being', 'be'],
				sold: ['sell', 'selled', 'sells'],
			},
		},
		{
			id: 'passive-voice-present-perfect-92',
			form: 'negative',
			prompt: 'Звіт ще не перевірено.',
			answer: "The report hasn't been checked yet.",
			traps: {
				"hasn't": ["haven't", "doesn't"],
				checked: ['check', 'checks', 'checking'],
			},
		},
		{
			id: 'passive-voice-present-perfect-93',
			form: 'negative',
			prompt: 'Мій новий паспорт ще не видано.',
			answer: "My new passport hasn't been issued yet.",
			traps: {
				been: ['being', 'be'],
				issued: ['issue', 'issues', 'issuing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-94',
			form: 'negative',
			prompt: 'Цю статтю ще не перекладено.',
			answer: "This article hasn't been translated yet.",
			traps: {
				"hasn't": ["haven't", "doesn't"],
				translated: ['translate', 'translates', 'translating'],
			},
		},
		{
			id: 'passive-voice-present-perfect-95',
			form: 'negative',
			prompt: 'Ці фото ще не надруковано.',
			answer: "These photos haven't been printed yet.",
			accept: ["These {photos|pictures} haven't been printed yet."],
			traps: {
				"haven't": ["hasn't", "don't"],
				printed: ['print', 'prints', 'printing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-96',
			form: 'negative',
			prompt: 'Електрику ще не відновлено.',
			answer: "The electricity hasn't been restored yet.",
			accept: ["The {electricity|power} hasn't been restored yet."],
			traps: {
				been: ['being', 'be'],
				restored: ['restore', 'restores', 'restoring'],
			},
		},
		{
			id: 'passive-voice-present-perfect-97',
			form: 'negative',
			prompt: 'Дорогу ще не відремонтовано.',
			answer: "The road hasn't been repaired yet.",
			accept: ["The road hasn't been {repaired|fixed} yet."],
			traps: {
				"hasn't": ["haven't", "doesn't"],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-present-perfect-98',
			form: 'negative',
			prompt: 'Подарунки ще не загорнуто.',
			answer: "The presents haven't been wrapped yet.",
			accept: ["The {presents|gifts} haven't been wrapped yet."],
			traps: {
				"haven't": ["hasn't", "don't"],
				wrapped: ['wrap', 'wraps', 'wrapping'],
			},
		},
		{
			id: 'passive-voice-present-perfect-99',
			form: 'negative',
			prompt: 'Траву ще не скошено.',
			answer: "The grass hasn't been cut yet.",
			accept: ["The grass hasn't been {cut|mowed|mown} yet."],
			traps: {
				been: ['being', 'be'],
				cut: ['cutted', 'cuts', 'cutting'],
			},
		},
		{
			id: 'passive-voice-present-perfect-100',
			form: 'negative',
			prompt: 'Пацієнта ще не прооперовано.',
			answer: "The patient hasn't been operated on yet.",
			traps: {
				"hasn't": ["haven't", "doesn't"],
				operated: ['operate', 'operates', 'operating'],
			},
		},
	],
})
