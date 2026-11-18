import { defineTopic } from '../../define-topic'

export const passiveVoiceFutureSimple = defineTopic({
	id: 'passive-voice-future-simple',
	level: 'intermediate',
	title: 'Passive Voice - Future Simple',
	subtitle: 'Пасивний стан — майбутній простий час',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				'will be + третя форма дієслова (past participle) — і для однини, і для множини. Того, хто виконає дію, називаємо після by.',
			examples: [
				{
					text: 'The new hospital will be built in May.',
					translation: 'Нову лікарню буде збудовано в травні.',
				},
				{
					text: 'The parcels will be sent on Monday.',
					translation: 'Посилки буде відправлено в понеділок.',
				},
				{
					text: 'The speech will be given by the president.',
					translation: 'Промову буде виголошено президентом.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Will + підмет + be + третя форма. Питання «ким?» — Who will … be … by?',
			examples: [
				{
					text: 'When will the exam results be sent?',
					translation: 'Коли буде надіслано результати іспиту?',
				},
				{
					text: 'Will the guests be told about it?',
					translation: 'Гостям буде про це повідомлено?',
				},
				{
					text: 'Who will the song be sung by?',
					translation: 'Ким буде виконано пісню?',
				},
			],
		},
		{
			kind: 'negative',
			explanation: "won't (will not) + be + третя форма дієслова.",
			examples: [
				{
					text: "The shop won't be rebuilt this year.",
					translation: 'Магазин не буде відбудовано цього року.',
				},
				{
					text: "Your email won't be read by anyone.",
					translation: 'Твій лист не буде ніким прочитано.',
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				'Пасив у майбутньому — для майбутніх подій, коли виконавець невідомий або неважливий. Українською це форма на -но/-то («буде збудовано») або «буде + дієприкметник» («буде підписаний»). Маркери часу: tomorrow, next week, in an hour, by Friday. Після will завжди be, а не is/are; дієслово — у третій формі: write → written, take → taken, give → given. Про план чи прогноз можна сказати й is/are going to be + третя форма.',
			examples: [
				{
					text: 'The tickets will be printed tomorrow.',
					translation: 'Квитки буде надруковано завтра.',
				},
				{
					text: 'The road will be closed for a week.',
					translation: 'Дорогу буде перекрито на тиждень.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'passive-voice-future-simple-1',
			form: 'affirmative',
			prompt: 'Роботу буде закінчено завтра.',
			answer: 'The work will be finished tomorrow.',
			accept: ['The work is going to be finished tomorrow.'],
			traps: {
				be: ['being', 'been', 'was'],
			},
		},
		{
			id: 'passive-voice-future-simple-2',
			form: 'affirmative',
			prompt: 'Тебе буде запрошено.',
			answer: "You'll be invited.",
			accept: ["You're going to be invited."],
			traps: {
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-future-simple-3',
			form: 'affirmative',
			prompt: 'Цей міст буде збудовано наступного року.',
			answer: 'This bridge will be built next year.',
			accept: ['This bridge {will|is going to} be built next year.'],
			traps: {
				be: ['is', 'been', 'being'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-future-simple-4',
			form: 'affirmative',
			prompt: 'Цей лист буде надіслано завтра.',
			answer: 'This letter will be sent tomorrow.',
			accept: ['This letter {will|is going to} be sent tomorrow.'],
			traps: {
				be: ['is', 'was', 'been'],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-future-simple-5',
			form: 'affirmative',
			prompt: 'Ці квіти буде полито ввечері.',
			answer: 'These flowers will be watered in the evening.',
			accept: ['These flowers {will|are going to} be watered in the evening.'],
			traps: {
				be: ['are', 'were', 'been'],
				watered: ['water', 'waters', 'watering'],
			},
		},
		{
			id: 'passive-voice-future-simple-6',
			form: 'affirmative',
			prompt: "Твою машину буде відремонтовано до п'ятниці.",
			answer: 'Your car will be repaired by Friday.',
			accept: ['Your car {will|is going to} be {repaired|fixed} by Friday.'],
			traps: {
				be: ['is', 'been', 'being'],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-future-simple-7',
			form: 'affirmative',
			prompt: 'Наш офіс буде перенесено в інше місто наступного місяця.',
			answer: 'Our office will be moved to another city next month.',
			accept: [
				'Our office {will|is going to} be moved to another {city|town} next month.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				moved: ['move', 'moves', 'moving'],
			},
		},
		{
			id: 'passive-voice-future-simple-8',
			form: 'affirmative',
			prompt: 'Сніданок буде подано о восьмій.',
			answer: 'Breakfast will be served at eight.',
			accept: ['Breakfast {will|is going to} be served at eight.'],
			traps: {
				be: ['is', 'been', 'being'],
				served: ['serve', 'serves', 'serving'],
			},
		},
		{
			id: 'passive-voice-future-simple-9',
			form: 'affirmative',
			prompt: 'Переможця буде оголошено завтра ввечері.',
			answer: 'The winner will be announced tomorrow evening.',
			accept: [
				'The winner {will|is going to} be announced tomorrow {evening|night}.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				announced: ['announce', 'announces', 'announcing'],
			},
		},
		{
			id: 'passive-voice-future-simple-10',
			form: 'affirmative',
			prompt: 'Цей торт буде розрізано на вісім шматків.',
			answer: 'This cake will be cut into eight pieces.',
			accept: [
				'This cake {will|is going to} be cut into eight {pieces|slices}.',
			],
			traps: {
				be: ['is', 'been', 'being'],
				cut: ['cuts', 'cutted', 'cutting'],
			},
		},
		{
			id: 'passive-voice-future-simple-11',
			form: 'affirmative',
			prompt: 'Вас буде зустрінуто в аеропорту.',
			answer: "You'll be met at the airport.",
			accept: ["{You'll|You're going to} be met at the airport."],
			traps: {
				be: ['are', 'been', 'being'],
				met: ['meet', 'meeted', 'meeting'],
			},
		},
		{
			id: 'passive-voice-future-simple-12',
			form: 'affirmative',
			prompt: 'Нові правила буде запроваджено наступного року.',
			answer: 'The new rules will be introduced next year.',
			accept: [
				'{The new|New} rules {will|are going to} be introduced next year.',
			],
			traps: {
				be: ['are', 'were', 'been'],
				introduced: ['introduce', 'introduces', 'introducing'],
			},
		},
		{
			id: 'passive-voice-future-simple-13',
			form: 'affirmative',
			prompt: 'Ці дерева буде посаджено навесні.',
			answer: 'These trees will be planted in spring.',
			accept: ['These trees {will|are going to} be planted in {the|} spring.'],
			traps: {
				be: ['are', 'were', 'been'],
				planted: ['plant', 'plants', 'planting'],
			},
		},
		{
			id: 'passive-voice-future-simple-14',
			form: 'affirmative',
			prompt: 'Цей звіт буде написаний нашим менеджером.',
			answer: 'This report will be written by our manager.',
			accept: ['This report {will|is going to} be written by our manager.'],
			traps: {
				be: ['is', 'been', 'being'],
				written: ['wrote', 'write', 'writed'],
				by: ['from', 'with'],
			},
		},
		{
			id: 'passive-voice-future-simple-15',
			form: 'affirmative',
			prompt: 'Ці подарунки буде загорнуто в червоний папір.',
			answer: 'These presents will be wrapped in red paper.',
			accept: [
				'These {presents|gifts} {will|are going to} be wrapped in red paper.',
			],
			traps: {
				be: ['are', 'were', 'been'],
				wrapped: ['wrap', 'wraps', 'wrapping'],
			},
		},
		{
			id: 'passive-voice-future-simple-16',
			form: 'affirmative',
			prompt: 'Ця сукня буде пошита моєю мамою.',
			answer: 'This dress will be made by my mother.',
			accept: [
				'This dress {will|is going to} be {made|sewn} by my {mother|mom|mum}.',
			],
			traps: {
				be: ['is', 'been', 'being'],
				made: ['make', 'maked', 'making'],
				by: ['from', 'with'],
			},
		},
		{
			id: 'passive-voice-future-simple-17',
			form: 'affirmative',
			prompt: 'Цей фільм буде показано по телевізору в суботу.',
			answer: 'This film will be shown on TV on Saturday.',
			accept: [
				'This {film|movie} {will|is going to} be shown on TV on Saturday.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				shown: ['show', 'showed', 'showing'],
			},
		},
		{
			id: 'passive-voice-future-simple-18',
			form: 'affirmative',
			prompt: 'Рішення буде прийнято завтра.',
			answer: 'The decision will be made tomorrow.',
			accept: ['The decision {will|is going to} be {made|taken} tomorrow.'],
			traps: {
				be: ['is', 'been', 'being'],
				made: ['make', 'maked', 'making'],
			},
		},
		{
			id: 'passive-voice-future-simple-19',
			form: 'affirmative',
			prompt: 'Усе буде зроблено вчасно.',
			answer: 'Everything will be done on time.',
			accept: ['Everything {will|is going to} be done on time.'],
			traps: {
				be: ['is', 'been', 'being'],
				done: ['did', 'do', 'doing'],
			},
		},
		{
			id: 'passive-voice-future-simple-20',
			form: 'affirmative',
			prompt: 'Результати буде опубліковано в понеділок.',
			answer: 'The results will be published on Monday.',
			accept: ['The results {will|are going to} be published on Monday.'],
			traps: {
				be: ['are', 'were', 'been'],
				published: ['publish', 'publishes', 'publishing'],
			},
		},
		{
			id: 'passive-voice-future-simple-21',
			form: 'affirmative',
			prompt: "Тобі буде заплачено в п'ятницю.",
			answer: "You'll be paid on Friday.",
			accept: ["{You'll|You're going to} be paid on Friday."],
			traps: {
				be: ['are', 'been', 'being'],
				paid: ['pay', 'payed', 'paying'],
			},
		},
		{
			id: 'passive-voice-future-simple-22',
			form: 'affirmative',
			prompt: 'Твій багаж буде привезено в готель сьогодні ввечері.',
			answer: 'Your luggage will be brought to the hotel this evening.',
			accept: [
				'Your {luggage|baggage} {will|is going to} be brought to the hotel {this evening|tonight}.',
			],
			traps: {
				be: ['is', 'been', 'being'],
				brought: ['bring', 'bringed', 'brang'],
			},
		},
		{
			id: 'passive-voice-future-simple-23',
			form: 'affirmative',
			prompt: 'Ця стаття буде перекладена англійською завтра.',
			answer: 'This article will be translated into English tomorrow.',
			accept: [
				'This article {will|is going to} be translated into English tomorrow.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				translated: ['translate', 'translates', 'translating'],
			},
		},
		{
			id: 'passive-voice-future-simple-24',
			form: 'affirmative',
			prompt: 'Цей стіл буде прикрашено квітами.',
			answer: 'This table will be decorated with flowers.',
			accept: ['This table {will|is going to} be decorated with flowers.'],
			traps: {
				be: ['is', 'been', 'being'],
				decorated: ['decorate', 'decorates', 'decorating'],
			},
		},
		{
			id: 'passive-voice-future-simple-25',
			form: 'affirmative',
			prompt: 'Злодій буде спійманий поліцією.',
			answer: 'The thief will be caught by the police.',
			accept: ['The thief {will|is going to} be caught by the police.'],
			traps: {
				be: ['is', 'was', 'been'],
				caught: ['catch', 'catched', 'catching'],
				by: ['from', 'with'],
			},
		},
		{
			id: 'passive-voice-future-simple-26',
			form: 'affirmative',
			prompt: 'Ключ буде сховано під килимком.',
			answer: 'The key will be hidden under the mat.',
			accept: ['The key {will|is going to} be hidden under the {mat|doormat}.'],
			traps: {
				be: ['is', 'been', 'being'],
				hidden: ['hide', 'hid', 'hided'],
			},
		},
		{
			id: 'passive-voice-future-simple-27',
			form: 'affirmative',
			prompt: 'Зустріч буде перенесено на четвер.',
			answer: 'The meeting will be moved to Thursday.',
			accept: [
				'The meeting {will|is going to} be {moved|rescheduled} to Thursday.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				moved: ['move', 'moves', 'moving'],
			},
		},
		{
			id: 'passive-voice-future-simple-28',
			form: 'affirmative',
			prompt: 'Твою валізу буде перевірено на кордоні.',
			answer: 'Your suitcase will be checked at the border.',
			accept: ['Your suitcase {will|is going to} be checked at the border.'],
			traps: {
				be: ['is', 'been', 'being'],
				checked: ['check', 'checks', 'checking'],
			},
		},
		{
			id: 'passive-voice-future-simple-29',
			form: 'affirmative',
			prompt: 'Цю картину буде продано на аукціоні наступного тижня.',
			answer: 'This painting will be sold at auction next week.',
			accept: [
				'This {painting|picture} {will|is going to} be sold at {an|} auction next week.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-future-simple-30',
			form: 'affirmative',
			prompt: 'Ця пісня буде заспівана на весіллі.',
			answer: 'This song will be sung at the wedding.',
			accept: ['This song {will|is going to} be sung at the wedding.'],
			traps: {
				be: ['is', 'been', 'being'],
				sung: ['sang', 'sing', 'singed'],
			},
		},
		{
			id: 'passive-voice-future-simple-31',
			form: 'affirmative',
			prompt: 'Обіцяю, гроші буде повернуто наступного тижня.',
			answer: 'I promise the money will be returned next week.',
			accept: [
				'I promise {that|} the money will be {returned|paid back} next week.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				returned: ['return', 'returns', 'returning'],
			},
		},
		{
			id: 'passive-voice-future-simple-32',
			form: 'affirmative',
			prompt: 'Наш будинок буде пофарбовано влітку.',
			answer: 'Our house will be painted in summer.',
			accept: ['Our house {will|is going to} be painted in {the|} summer.'],
			traps: {
				be: ['is', 'been', 'being'],
				painted: ['paint', 'paints', 'painting'],
			},
		},
		{
			id: 'passive-voice-future-simple-33',
			form: 'affirmative',
			prompt: 'Тебе буде покарано, якщо ти збрешеш.',
			answer: "You'll be punished if you lie.",
			accept: ["{You'll|You're going to} be punished if you {lie|tell a lie}."],
			traps: {
				be: ['are', 'been', 'being'],
				punished: ['punish', 'punishes', 'punishing'],
			},
		},
		{
			id: 'passive-voice-future-simple-34',
			form: 'affirmative',
			prompt: 'Вам буде надано відповідь протягом тижня.',
			answer: "You'll be given an answer within a week.",
			accept: ["{You'll|You're going to} be given an answer within a week."],
			traps: {
				be: ['are', 'been', 'being'],
				given: ['gave', 'give', 'gived'],
			},
		},
		{
			id: 'passive-voice-future-simple-35',
			form: 'affirmative',
			prompt: 'Цей старий будинок буде знесено наступного року.',
			answer: 'This old house will be demolished next year.',
			accept: [
				'This old house {will|is going to} be {demolished|pulled down|knocked down} next year.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				demolished: ['demolish', 'demolishes', 'demolishing'],
			},
		},
		{
			id: 'passive-voice-future-simple-36',
			form: 'affirmative',
			prompt: 'Гроші буде переказано на твій рахунок завтра.',
			answer: 'The money will be transferred to your account tomorrow.',
			accept: [
				'The money {will|is going to} be {transferred|sent} to your account tomorrow.',
			],
			traps: {
				be: ['is', 'are', 'been'],
				transferred: ['transfer', 'transfers', 'transferring'],
			},
		},
		{
			id: 'passive-voice-future-simple-37',
			form: 'affirmative',
			prompt: 'Ці книжки буде повернуто до бібліотеки завтра.',
			answer: 'These books will be returned to the library tomorrow.',
			accept: [
				'These books {will|are going to} be returned to the library tomorrow.',
			],
			traps: {
				be: ['are', 'were', 'been'],
				returned: ['return', 'returns', 'returning'],
			},
		},
		{
			id: 'passive-voice-future-simple-38',
			form: 'affirmative',
			prompt: "Нові комп'ютери буде встановлено в офісі наступного тижня.",
			answer: 'New computers will be installed in the office next week.',
			accept: [
				'{The new|New} computers {will|are going to} be installed in the office next week.',
			],
			traps: {
				be: ['are', 'were', 'been'],
				installed: ['install', 'installs', 'installing'],
			},
		},
		{
			id: 'passive-voice-future-simple-39',
			form: 'affirmative',
			prompt: 'Наш новий альбом буде записано у Києві.',
			answer: 'Our new album will be recorded in Kyiv.',
			accept: ['Our new album {will|is going to} be recorded in Kyiv.'],
			traps: {
				be: ['is', 'been', 'being'],
				recorded: ['record', 'records', 'recording'],
			},
		},
		{
			id: 'passive-voice-future-simple-40',
			form: 'affirmative',
			prompt: 'Цей контракт буде підписаний директором завтра.',
			answer: 'This contract will be signed by the director tomorrow.',
			accept: [
				'This contract {will|is going to} be signed by the director tomorrow.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				signed: ['sign', 'signs', 'signing'],
				by: ['from', 'with'],
			},
		},
		{
			id: 'passive-voice-future-simple-41',
			form: 'affirmative',
			prompt: 'Діти будуть оглянуті лікарем завтра.',
			answer: 'The children will be examined by a doctor tomorrow.',
			accept: [
				'The children {will|are going to} be examined by {a|the} doctor tomorrow.',
			],
			traps: {
				be: ['are', 'were', 'been'],
				examined: ['examine', 'examines', 'examining'],
				by: ['from', 'with'],
			},
		},
		{
			id: 'passive-voice-future-simple-42',
			form: 'affirmative',
			prompt: 'Пацієнта буде прооперовано завтра вранці.',
			answer: 'The patient will be operated on tomorrow morning.',
			accept: [
				'The patient {will|is going to} be operated on tomorrow morning.',
			],
			traps: {
				be: ['is', 'been', 'being'],
				operated: ['operate', 'operates', 'operating'],
			},
		},
		{
			id: 'passive-voice-future-simple-43',
			form: 'affirmative',
			prompt: 'Цю новину буде прочитано мільйонами людей.',
			answer: 'This news will be read by millions of people.',
			accept: ['This news {will|is going to} be read by millions of people.'],
			traps: {
				be: ['is', 'are', 'been'],
				read: ['reads', 'readed', 'reading'],
				by: ['from', 'with'],
			},
		},
		{
			id: 'passive-voice-future-simple-44',
			form: 'affirmative',
			prompt: 'Конференцію буде проведено у Львові наступної весни.',
			answer: 'The conference will be held in Lviv next spring.',
			accept: [
				'The conference {will|is going to} be held in Lviv next spring.',
			],
			traps: {
				be: ['is', 'was', 'been'],
				held: ['hold', 'holded', 'holding'],
			},
		},
		{
			id: 'passive-voice-future-simple-45',
			form: 'affirmative',
			prompt: 'Нашу квартиру буде продано до кінця року.',
			answer: 'Our flat will be sold by the end of the year.',
			accept: [
				'Our {flat|apartment} {will|is going to} be sold by the end of the year.',
			],
			traps: {
				be: ['is', 'been', 'being'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-future-simple-46',
			form: 'question',
			prompt: 'Коли буде збудовано новий стадіон?',
			answer: 'When will the new stadium be built?',
			accept: [
				'When {will the new stadium be|is the new stadium going to be} built?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-future-simple-47',
			form: 'question',
			prompt: 'Мою заяву буде прийнято?',
			answer: 'Will my application be accepted?',
			accept: [
				'{Will my application be|Is my application going to be} accepted?',
			],
			traps: {
				Will: ['Does', 'Did', 'Do'],
				accepted: ['accept', 'accepts', 'accepting'],
			},
		},
		{
			id: 'passive-voice-future-simple-48',
			form: 'question',
			prompt: 'Ким буде підписано цей документ?',
			answer: 'Who will this document be signed by?',
			accept: [
				'{Who will this document be signed by|By whom will this document be signed|Who is this document going to be signed by}?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				signed: ['sign', 'signs', 'signing'],
			},
		},
		{
			id: 'passive-voice-future-simple-49',
			form: 'question',
			prompt: 'Коли буде відремонтовано цю дорогу?',
			answer: 'When will this road be repaired?',
			accept: [
				'When {will this road be|is this road going to be} {repaired|fixed}?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				be: ['is', 'been', 'being'],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-future-simple-50',
			form: 'question',
			prompt: 'Мене буде запрошено на зустріч?',
			answer: 'Will I be invited to the meeting?',
			accept: ['{Will I be|Am I going to be} invited to the meeting?'],
			traps: {
				Will: ['Do', 'Did', 'Does'],
				be: ['am', 'been', 'being'],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-future-simple-51',
			form: 'question',
			prompt: "Твій комп'ютер буде полагоджено до понеділка?",
			answer: 'Will your computer be repaired by Monday?',
			accept: [
				'{Will your computer be|Is your computer going to be} {repaired|fixed} by Monday?',
			],
			traps: {
				Will: ['Does', 'Did', 'Do'],
				be: ['is', 'been', 'being'],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-future-simple-52',
			form: 'question',
			prompt: 'Де буде проведено наступну зустріч?',
			answer: 'Where will the next meeting be held?',
			accept: [
				'Where {will the next meeting be|is the next meeting going to be} held?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				held: ['hold', 'holded', 'holding'],
			},
		},
		{
			id: 'passive-voice-future-simple-53',
			form: 'question',
			prompt: 'Скільки нових будинків буде збудовано цього року?',
			answer: 'How many new houses will be built this year?',
			accept: ['How many new houses {will|are going to} be built this year?'],
			traps: {
				be: ['are', 'been', 'being'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-future-simple-54',
			form: 'question',
			prompt: "Ці документи буде перекладено до п'ятниці?",
			answer: 'Will these documents be translated by Friday?',
			accept: [
				'{Will these documents be|Are these documents going to be} translated by Friday?',
			],
			traps: {
				Will: ['Do', 'Did', 'Does'],
				be: ['are', 'been', 'being'],
				translated: ['translate', 'translates', 'translating'],
			},
		},
		{
			id: 'passive-voice-future-simple-55',
			form: 'question',
			prompt: 'Коли буде доставлено моє замовлення?',
			answer: 'When will my order be delivered?',
			accept: ['When {will my order be|is my order going to be} delivered?'],
			traps: {
				will: ['does', 'did', 'do'],
				delivered: ['deliver', 'delivers', 'delivering'],
			},
		},
		{
			id: 'passive-voice-future-simple-56',
			form: 'question',
			prompt: 'Нас буде зустрінуто на вокзалі?',
			answer: 'Will we be met at the station?',
			accept: ['{Will we be|Are we going to be} met at the station?'],
			traps: {
				Will: ['Do', 'Did', 'Does'],
				be: ['are', 'been', 'being'],
				met: ['meet', 'meeted', 'meeting'],
			},
		},
		{
			id: 'passive-voice-future-simple-57',
			form: 'question',
			prompt: 'Що буде зроблено з цими грошима?',
			answer: 'What will be done with this money?',
			accept: ['What {will|is going to} be done with this money?'],
			traps: {
				be: ['is', 'been', 'being'],
				done: ['did', 'do', 'doing'],
			},
		},
		{
			id: 'passive-voice-future-simple-58',
			form: 'question',
			prompt: 'Коли буде пофарбовано паркан?',
			answer: 'When will the fence be painted?',
			accept: ['When {will the fence be|is the fence going to be} painted?'],
			traps: {
				will: ['does', 'did', 'do'],
				painted: ['paint', 'paints', 'painting'],
			},
		},
		{
			id: 'passive-voice-future-simple-59',
			form: 'question',
			prompt: 'Цей фільм буде показано в Україні?',
			answer: 'Will this film be shown in Ukraine?',
			accept: [
				'{Will this film be|Is this film going to be|Will this movie be|Is this movie going to be} shown in Ukraine?',
			],
			traps: {
				Will: ['Does', 'Did', 'Do'],
				be: ['is', 'been', 'being'],
				shown: ['show', 'showed', 'showing'],
			},
		},
		{
			id: 'passive-voice-future-simple-60',
			form: 'question',
			prompt: 'Хто буде запрошений на весілля?',
			answer: 'Who will be invited to the wedding?',
			accept: ['Who {will|is going to} be invited to the wedding?'],
			traps: {
				be: ['is', 'been', 'being'],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-future-simple-61',
			form: 'question',
			prompt: 'Що буде продано на аукціоні?',
			answer: 'What will be sold at the auction?',
			accept: ['What {will|is going to} be sold at {the|} auction?'],
			traps: {
				be: ['is', 'been', 'being'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-future-simple-62',
			form: 'question',
			prompt: 'Коли буде знайдено ліки від раку?',
			answer: 'When will a cure for cancer be found?',
			accept: [
				'When {will a cure for cancer be|is a cure for cancer going to be|will the cure for cancer be|is the cure for cancer going to be} found?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				found: ['find', 'finded', 'finding'],
			},
		},
		{
			id: 'passive-voice-future-simple-63',
			form: 'question',
			prompt: 'Нам буде дано більше часу?',
			answer: 'Will we be given more time?',
			accept: ['{Will we be|Are we going to be} given more time?'],
			traps: {
				Will: ['Do', 'Did', 'Does'],
				be: ['are', 'been', 'being'],
				given: ['gave', 'give', 'gived'],
			},
		},
		{
			id: 'passive-voice-future-simple-64',
			form: 'question',
			prompt: 'Цей старий замок буде відреставровано?',
			answer: 'Will this old castle be restored?',
			accept: [
				'{Will this old castle be|Is this old castle going to be} restored?',
			],
			traps: {
				Will: ['Does', 'Did', 'Do'],
				be: ['is', 'been', 'being'],
				restored: ['restore', 'restores', 'restoring'],
			},
		},
		{
			id: 'passive-voice-future-simple-65',
			form: 'question',
			prompt: 'Як буде відзначено твій день народження?',
			answer: 'How will your birthday be celebrated?',
			accept: [
				'How {will your birthday be|is your birthday going to be} celebrated?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				celebrated: ['celebrate', 'celebrates', 'celebrating'],
			},
		},
		{
			id: 'passive-voice-future-simple-66',
			form: 'question',
			prompt: 'О котрій буде подано вечерю?',
			answer: 'What time will dinner be served?',
			accept: [
				'{What time|At what time} {will dinner be|is dinner going to be} served?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				served: ['serve', 'serves', 'serving'],
			},
		},
		{
			id: 'passive-voice-future-simple-67',
			form: 'question',
			prompt: 'Ці твори буде перевірено вчителем?',
			answer: 'Will these essays be checked by the teacher?',
			accept: [
				'{Will these essays be|Are these essays going to be} {checked|marked} by the teacher?',
			],
			traps: {
				Will: ['Do', 'Did', 'Does'],
				be: ['are', 'been', 'being'],
				checked: ['check', 'checks', 'checking'],
			},
		},
		{
			id: 'passive-voice-future-simple-68',
			form: 'question',
			prompt: 'Скільки квитків буде продано?',
			answer: 'How many tickets will be sold?',
			accept: ['How many tickets {will|are going to} be sold?'],
			traps: {
				be: ['are', 'been', 'being'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-future-simple-69',
			form: 'question',
			prompt: "Коли буде оголошено ім'я переможця?",
			answer: "When will the winner's name be announced?",
			accept: [
				"When {will the winner's name be|is the winner's name going to be|will the name of the winner be|is the name of the winner going to be} announced?",
			],
			traps: {
				will: ['does', 'did', 'do'],
				announced: ['announce', 'announces', 'announcing'],
			},
		},
		{
			id: 'passive-voice-future-simple-70',
			form: 'question',
			prompt: 'Де буде знято цей фільм?',
			answer: 'Where will this film be shot?',
			accept: [
				'Where {will this film be|is this film going to be|will this movie be|is this movie going to be} {shot|filmed|made}?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				shot: ['shoot', 'shooted', 'shooting'],
			},
		},
		{
			id: 'passive-voice-future-simple-71',
			form: 'question',
			prompt: 'Нас буде повідомлено про зміни?',
			answer: 'Will we be told about the changes?',
			accept: [
				'{Will we be|Are we going to be} {told|informed} about the changes?',
			],
			traps: {
				Will: ['Do', 'Did', 'Does'],
				be: ['are', 'been', 'being'],
				told: ['tell', 'telled', 'telling'],
			},
		},
		{
			id: 'passive-voice-future-simple-72',
			form: 'question',
			prompt: 'Коли буде видано нові паспорти?',
			answer: 'When will the new passports be issued?',
			accept: [
				'When {will the new passports be|are the new passports going to be} issued?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				issued: ['issue', 'issues', 'issuing'],
			},
		},
		{
			id: 'passive-voice-future-simple-73',
			form: 'question',
			prompt: 'Ці помилки буде виправлено до завтра?',
			answer: 'Will these mistakes be corrected by tomorrow?',
			accept: [
				'{Will these mistakes be|Are these mistakes going to be} {corrected|fixed} by tomorrow?',
			],
			traps: {
				Will: ['Do', 'Did', 'Does'],
				be: ['are', 'been', 'being'],
				corrected: ['correct', 'corrects', 'correcting'],
			},
		},
		{
			id: 'passive-voice-future-simple-74',
			form: 'question',
			prompt: 'Яку пісню буде виконано першою?',
			answer: 'Which song will be performed first?',
			accept: [
				'{Which|What} song {will|is going to} be {performed|sung} first?',
			],
			traps: {
				be: ['is', 'been', 'being'],
				performed: ['perform', 'performs', 'performing'],
			},
		},
		{
			id: 'passive-voice-future-simple-75',
			form: 'question',
			prompt: 'Коли буде замінено цей старий ліфт?',
			answer: 'When will this old lift be replaced?',
			accept: [
				'When {will this old lift be|is this old lift going to be|will this old elevator be|is this old elevator going to be} replaced?',
			],
			traps: {
				will: ['does', 'did', 'do'],
				replaced: ['replace', 'replaces', 'replacing'],
			},
		},
		{
			id: 'passive-voice-future-simple-76',
			form: 'negative',
			prompt: 'Цей басейн не буде збудовано цього року.',
			answer: "This swimming pool won't be built this year.",
			accept: [
				"This {swimming pool|pool} {won't|isn't going to} be built this year.",
			],
			traps: {
				be: ['is', 'been', 'being'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-future-simple-77',
			form: 'negative',
			prompt: 'Тебе не буде покарано.',
			answer: "You won't be punished.",
			accept: ["{You won't|You're not going to} be punished."],
			traps: {
				"won't": ["don't", "didn't", "doesn't"],
				punished: ['punish', 'punishes', 'punishing'],
			},
		},
		{
			id: 'passive-voice-future-simple-78',
			form: 'negative',
			prompt: 'Ці листи не буде надіслано сьогодні.',
			answer: "These letters won't be sent today.",
			accept: ["These letters {won't|aren't going to} be sent today."],
			traps: {
				be: ['are', 'were', 'been'],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-future-simple-79',
			form: 'negative',
			prompt: 'Ці гроші не буде витрачено даремно.',
			answer: "This money won't be wasted.",
			accept: ["This money {won't|isn't going to} be wasted."],
			traps: {
				"won't": ["don't", "didn't", "doesn't"],
				wasted: ['waste', 'wastes', 'wasting'],
			},
		},
		{
			id: 'passive-voice-future-simple-80',
			form: 'negative',
			prompt: 'Вечірку не буде скасовано через дощ.',
			answer: "The party won't be cancelled because of the rain.",
			accept: [
				"The party {won't|isn't going to} be {cancelled|canceled} because of {the|} rain.",
			],
			traps: {
				be: ['is', 'been', 'being'],
				cancelled: ['cancel', 'cancels', 'cancelling'],
			},
		},
		{
			id: 'passive-voice-future-simple-81',
			form: 'negative',
			prompt: 'Цю проблему не буде вирішено за один день.',
			answer: "This problem won't be solved in one day.",
			accept: ["This problem {won't|isn't going to} be solved in {one|a} day."],
			traps: {
				be: ['is', 'was', 'been'],
				solved: ['solve', 'solves', 'solving'],
			},
		},
		{
			id: 'passive-voice-future-simple-82',
			form: 'negative',
			prompt: 'Нікого не буде звільнено.',
			answer: 'Nobody will be fired.',
			accept: ['{Nobody|No one} {will|is going to} be {fired|dismissed}.'],
			traps: {
				be: ['is', 'been', 'being'],
				fired: ['fire', 'fires', 'firing'],
			},
		},
		{
			id: 'passive-voice-future-simple-83',
			form: 'negative',
			prompt: 'Цей матч не буде показано по телевізору.',
			answer: "This match won't be shown on TV.",
			accept: ["This match {won't|isn't going to} be shown on TV."],
			traps: {
				be: ['is', 'was', 'been'],
				shown: ['show', 'showed', 'showing'],
			},
		},
		{
			id: 'passive-voice-future-simple-84',
			form: 'negative',
			prompt: 'Твої дані не буде видалено.',
			answer: "Your data won't be deleted.",
			accept: ["Your data {won't|isn't going to} be deleted."],
			traps: {
				"won't": ["don't", "didn't", "doesn't"],
				deleted: ['delete', 'deletes', 'deleting'],
			},
		},
		{
			id: 'passive-voice-future-simple-85',
			form: 'negative',
			prompt: 'Ці дерева не буде зрубано.',
			answer: "These trees won't be cut down.",
			accept: ["These trees {won't|aren't going to} be cut down."],
			traps: {
				be: ['are', 'were', 'been'],
				cut: ['cuts', 'cutted', 'cutting'],
			},
		},
		{
			id: 'passive-voice-future-simple-86',
			form: 'negative',
			prompt: 'Цей лист не буде відкрито до твого дня народження.',
			answer: "This letter won't be opened until your birthday.",
			accept: [
				"This letter {won't|isn't going to} be opened {until|before} your birthday.",
			],
			traps: {
				be: ['is', 'been', 'being'],
				opened: ['open', 'opens', 'opening'],
			},
		},
		{
			id: 'passive-voice-future-simple-87',
			form: 'negative',
			prompt: 'Ці документи не буде підписано до понеділка.',
			answer: "These documents won't be signed until Monday.",
			accept: [
				"These documents {won't|aren't going to} be signed {until|before} Monday.",
			],
			traps: {
				be: ['are', 'were', 'been'],
				signed: ['sign', 'signs', 'signing'],
			},
		},
		{
			id: 'passive-voice-future-simple-88',
			form: 'negative',
			prompt: 'Нас не буде запрошено на вечірку.',
			answer: "We won't be invited to the party.",
			accept: ["{We won't|We're not going to} be invited to the party."],
			traps: {
				be: ['are', 'were', 'been'],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-future-simple-89',
			form: 'negative',
			prompt: 'Твій велосипед не буде вкрадено тут.',
			answer: "Your bike won't be stolen here.",
			accept: ["Your {bike|bicycle} {won't|isn't going to} be stolen here."],
			traps: {
				be: ['is', 'been', 'being'],
				stolen: ['stole', 'steal', 'stealed'],
			},
		},
		{
			id: 'passive-voice-future-simple-90',
			form: 'negative',
			prompt: "Твоє ім'я не буде згадано в статті.",
			answer: "Your name won't be mentioned in the article.",
			accept: ["Your name {won't|isn't going to} be mentioned in the article."],
			traps: {
				be: ['is', 'was', 'been'],
				mentioned: ['mention', 'mentions', 'mentioning'],
			},
		},
		{
			id: 'passive-voice-future-simple-91',
			form: 'negative',
			prompt: 'Цю помилку не буде забуто.',
			answer: "This mistake won't be forgotten.",
			accept: ["This mistake {won't|isn't going to} be forgotten."],
			traps: {
				"won't": ["don't", "didn't", "doesn't"],
				forgotten: ['forgot', 'forget', 'forgetted'],
			},
		},
		{
			id: 'passive-voice-future-simple-92',
			form: 'negative',
			prompt: 'Квитки на цей концерт не буде продано онлайн.',
			answer: "Tickets for this concert won't be sold online.",
			accept: [
				"{The tickets|Tickets} {for|to} this concert {won't|aren't going to} be sold online.",
			],
			traps: {
				be: ['are', 'were', 'been'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-future-simple-93',
			form: 'negative',
			prompt: 'Пошту не буде доставлено в неділю.',
			answer: "The post won't be delivered on Sunday.",
			accept: [
				"The {post|mail} {won't|isn't going to} be delivered on Sunday.",
			],
			traps: {
				be: ['is', 'been', 'being'],
				delivered: ['deliver', 'delivers', 'delivering'],
			},
		},
		{
			id: 'passive-voice-future-simple-94',
			form: 'negative',
			prompt: 'Тобі не буде дано другого шансу.',
			answer: "You won't be given a second chance.",
			accept: ["{You won't|You're not going to} be given a second chance."],
			traps: {
				be: ['are', 'been', 'being'],
				given: ['gave', 'give', 'gived'],
			},
		},
		{
			id: 'passive-voice-future-simple-95',
			form: 'negative',
			prompt: 'Ці вікна не буде помито до суботи.',
			answer: "These windows won't be washed until Saturday.",
			accept: [
				"These windows {won't|aren't going to} be {washed|cleaned} {until|before} Saturday.",
			],
			traps: {
				be: ['are', 'were', 'been'],
				washed: ['wash', 'washes', 'washing'],
			},
		},
		{
			id: 'passive-voice-future-simple-96',
			form: 'negative',
			prompt: 'Нічого не буде змінено.',
			answer: 'Nothing will be changed.',
			accept: ['Nothing {will|is going to} be changed.'],
			traps: {
				be: ['is', 'been', 'being'],
				changed: ['change', 'changes', 'changing'],
			},
		},
		{
			id: 'passive-voice-future-simple-97',
			form: 'negative',
			prompt: 'Цю їжу не буде викинуто.',
			answer: "This food won't be thrown away.",
			accept: ["This food {won't|isn't going to} be thrown {away|out}."],
			traps: {
				be: ['is', 'was', 'been'],
				thrown: ['threw', 'throw', 'throwed'],
			},
		},
		{
			id: 'passive-voice-future-simple-98',
			form: 'negative',
			prompt: 'Цю таємницю ніколи не буде розкрито.',
			answer: 'This secret will never be revealed.',
			accept: ['This secret {will never be|is never going to be} revealed.'],
			traps: {
				be: ['is', 'been', 'being'],
				revealed: ['reveal', 'reveals', 'revealing'],
			},
		},
		{
			id: 'passive-voice-future-simple-99',
			form: 'negative',
			prompt: 'Цей проєкт не буде завершено вчасно.',
			answer: "This project won't be finished on time.",
			accept: [
				"This project {won't|isn't going to} be {finished|completed} on time.",
			],
			traps: {
				be: ['is', 'was', 'been'],
				finished: ['finish', 'finishes', 'finishing'],
			},
		},
		{
			id: 'passive-voice-future-simple-100',
			form: 'negative',
			prompt: 'Ці книжки не буде перекладено українською.',
			answer: "These books won't be translated into Ukrainian.",
			accept: [
				"These books {won't|aren't going to} be translated into Ukrainian.",
			],
			traps: {
				be: ['are', 'were', 'been'],
				translated: ['translate', 'translates', 'translating'],
			},
		},
	],
})
