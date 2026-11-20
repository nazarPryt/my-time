import { defineTopic } from '../../define-topic'

const HAVE = ['has', 'had'] as const
const BEEN = ['being', 'be'] as const

export const futurePerfectPassive = defineTopic({
	id: 'future-perfect-passive',
	level: 'advanced',
	title: 'Future perfect passive',
	subtitle: 'Майбутній доконаний час (пасив)',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Future Perfect Passive показує, що дію над предметом завершать до певного моменту в майбутньому. Важливий не виконавець, а результат. Момент — by + час (by Friday, by the end of the year) або by the time / when + Present Simple (після них ніколи не ставимо will). Українською це «вже буде зроблено», «вже зроблять», «до того часу, як…».',
			examples: [
				{
					text: 'By the time the shop opens, all the shelves will have been filled.',
					translation:
						'До того часу, як відкриється магазин, усі полиці вже заповнять.',
				},
				{
					text: 'By June the old school will have been rebuilt.',
					translation: 'До червня стару школу вже перебудують.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Підмет + will have been + третя форма дієслова для всіх осіб: завжди have (не has і не had), завжди been (не being і не be). Третя форма неправильних дієслів — з третьої колонки: written, sold, built, drunk. Після займенника will скорочується до 'll: it'll have been, we'll have been.",
			examples: [
				{
					text: "By Sunday it'll have been painted.",
					translation: 'До неділі її вже пофарбують.',
				},
				{
					text: 'When you arrive, the cake will have been baked.',
					translation: 'Коли ти приїдеш, торт уже спечуть.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Will + підмет + have been + третя форма? Питальне слово стає на початок: How many…, What… will have been…?',
			examples: [
				{
					text: 'Will the windows have been replaced by winter?',
					translation: 'Чи вікна вже замінять до зими?',
				},
				{
					text: 'How many cars will have been made by the end of the year?',
					translation: 'Скільки машин уже виготовлять до кінця року?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Підмет + won't (will not) + have been + третя форма. «Ще не» перекладаємо через yet у кінці: won't have been done yet.",
			examples: [
				{
					text: "When you call, the email won't have been sent yet.",
					translation: 'Коли ти подзвониш, лист ще не надішлють.',
				},
				{
					text: "By noon the rooms won't have been cleaned.",
					translation: 'До полудня кімнати не приберуть.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'future-perfect-passive-1',
			form: 'affirmative',
			prompt: 'До понеділка звіт уже буде закінчено.',
			answer: 'The report will have been finished by Monday.',
			accept: [
				'The report will have already been finished by Monday.',
				'By Monday the report will have {already|} been finished.',
			],
			traps: { been: ['being', 'be'] },
		},
		{
			id: 'future-perfect-passive-2',
			form: 'affirmative',
			prompt: 'До літа міст уже буде збудовано.',
			answer: 'The bridge will have been built by summer.',
			accept: [
				'The bridge will have already been built by {summer|the summer}.',
				'The bridge will have been built by the summer.',
				'By {summer|the summer} the bridge will have {already|} been built.',
			],
			traps: { built: ['build', 'builded'] },
		},
		{
			id: 'future-perfect-passive-3',
			form: 'affirmative',
			prompt: "До п'ятниці всі квитки вже буде продано.",
			answer: 'By Friday all the tickets will have been sold.',
			accept: ['By Friday all {the|} tickets will {already|} have been sold.'],
			traps: { have: HAVE, been: BEEN, sold: ['sell', 'selled'] },
		},
		{
			id: 'future-perfect-passive-4',
			form: 'affirmative',
			prompt: 'Коли ти повернешся, кімнату вже приберуть.',
			answer: 'When you come back, the room will have been cleaned.',
			accept: [
				'{When|By the time} you {come back|get back|return}, the room will {already|} have been cleaned.',
			],
			traps: {
				come: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				cleaned: ['clean', 'cleaning'],
			},
		},
		{
			id: 'future-perfect-passive-5',
			form: 'affirmative',
			prompt: 'До кінця тижня паркан уже пофарбують.',
			answer: 'By the end of the week the fence will have been painted.',
			accept: [
				'By the end of the week the fence will {already|} have been painted.',
			],
			traps: { have: HAVE, been: BEEN, painted: ['paint', 'painting'] },
		},
		{
			id: 'future-perfect-passive-6',
			form: 'affirmative',
			prompt: "Не хвилюйся за машину: до п'ятниці її вже відремонтують.",
			answer: "Don't worry about the car: by Friday it'll have been repaired.",
			accept: [
				"Don't worry about the car: by Friday {it'll|it will} {already|} have been {repaired|fixed}.",
			],
			traps: { have: HAVE, been: BEEN, repaired: ['repair', 'repairing'] },
		},
		{
			id: 'future-perfect-passive-7',
			form: 'affirmative',
			prompt: 'До того часу, як ти прокинешся, сніданок уже приготують.',
			answer: 'By the time you wake up, breakfast will have been made.',
			accept: [
				'By the time you wake up, breakfast will {already|} have been {made|cooked|prepared}.',
			],
			traps: {
				wake: ['will', 'woke'],
				have: HAVE,
				been: BEEN,
				made: ['make', 'maked'],
			},
		},
		{
			id: 'future-perfect-passive-8',
			form: 'affirmative',
			prompt: 'До понеділка мене вже повідомлять про рішення.',
			answer: "By Monday I'll have been told about the decision.",
			accept: [
				"By Monday I'll {already|} have been {told|informed} about the decision.",
			],
			traps: { have: HAVE, been: BEEN, told: ['tell', 'telled'] },
		},
		{
			id: 'future-perfect-passive-9',
			form: 'affirmative',
			prompt: 'До кінця місяця нам уже заплатять за цю роботу.',
			answer: "By the end of the month we'll have been paid for this work.",
			accept: [
				"By the end of the month we'll {already|} have been paid for this {work|job}.",
			],
			traps: { have: HAVE, been: BEEN, paid: ['payed', 'pay'] },
		},
		{
			id: 'future-perfect-passive-10',
			form: 'affirmative',
			prompt: 'Коли ви приїдете, гостей уже нагодують.',
			answer: 'When you arrive, the guests will have been fed.',
			accept: [
				'{When|By the time} you arrive, the guests will {already|} have been fed.',
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				fed: ['feeded', 'feed'],
			},
		},
		{
			id: 'future-perfect-passive-11',
			form: 'affirmative',
			prompt: 'До кінця року новий стадіон уже збудують.',
			answer: 'By the end of the year the new stadium will have been built.',
			accept: [
				'By the end of the year the new stadium will {already|} have been built.',
			],
			traps: { have: HAVE, been: BEEN, built: ['build', 'builded'] },
		},
		{
			id: 'future-perfect-passive-12',
			form: 'affirmative',
			prompt: 'Коли почнеться конференція, усі документи вже перекладуть.',
			answer:
				'When the conference starts, all the documents will have been translated.',
			accept: [
				'{When|By the time} the conference {starts|begins}, all {the|} documents will {already|} have been translated.',
			],
			traps: {
				starts: ['will', 'start'],
				have: HAVE,
				been: BEEN,
				translated: ['translate', 'translating'],
			},
		},
		{
			id: 'future-perfect-passive-13',
			form: 'affirmative',
			prompt: 'До обіду всі листи вже буде надіслано.',
			answer: 'By lunchtime all the letters will have been sent.',
			accept: [
				'By {lunchtime|lunch} all {the|} letters will {already|} have been sent.',
			],
			traps: { have: HAVE, been: BEEN, sent: ['send', 'sended'] },
		},
		{
			id: 'future-perfect-passive-14',
			form: 'affirmative',
			prompt: 'До того часу, як ти закінчиш школу, цей будинок уже знесуть.',
			answer:
				'By the time you finish school, this house will have been demolished.',
			accept: [
				'By the time you finish school, this house will {already|} have been {demolished|pulled down|knocked down}.',
			],
			traps: {
				finish: ['will', 'finished'],
				have: HAVE,
				been: BEEN,
				demolished: ['demolish', 'demolishing'],
			},
		},
		{
			id: 'future-perfect-passive-15',
			form: 'affirmative',
			prompt: 'До наступного четверга твої документи вже перевірять.',
			answer: 'By next Thursday your documents will have been checked.',
			accept: [
				'By next Thursday your documents will {already|} have been checked.',
			],
			traps: { have: HAVE, been: BEEN, checked: ['check', 'checking'] },
		},
		{
			id: 'future-perfect-passive-16',
			form: 'affirmative',
			prompt: 'Коли ми повернемося з відпустки, квартиру вже відремонтують.',
			answer:
				'When we come back from holiday, the flat will have been renovated.',
			accept: [
				'{When|By the time} we {come back|get back|return} from {holiday|vacation}, the {flat|apartment} will have been renovated.',
			],
			traps: {
				come: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				renovated: ['renovate', 'renovating'],
			},
		},
		{
			id: 'future-perfect-passive-17',
			form: 'affirmative',
			prompt: 'До вечора сніг на дорогах уже приберуть.',
			answer: 'By the evening the snow on the roads will have been cleared.',
			accept: [
				'By {the evening|evening} the snow on the roads will {already|} have been {cleared|removed}.',
			],
			traps: { have: HAVE, been: BEEN, cleared: ['clear', 'clearing'] },
		},
		{
			id: 'future-perfect-passive-18',
			form: 'affirmative',
			prompt: 'До світанку пожежу вже загасять.',
			answer: 'By dawn the fire will have been put out.',
			accept: [
				'By dawn the fire will {already|} have been {put out|extinguished}.',
			],
			traps: { have: HAVE, been: BEEN, put: ['putted', 'puts'] },
		},
		{
			id: 'future-perfect-passive-19',
			form: 'affirmative',
			prompt: 'До кінця дня всі замовлення вже доставлять.',
			answer: 'By the end of the day all the orders will have been delivered.',
			accept: [
				'By the end of the day all {the|} orders will {already|} have been delivered.',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				delivered: ['deliver', 'delivering'],
			},
		},
		{
			id: 'future-perfect-passive-20',
			form: 'affirmative',
			prompt: 'Коли ти отримаєш цей лист, мене вже звільнять.',
			answer: "When you get this letter, I'll have been fired.",
			accept: [
				"{When|By the time} you {get|receive} this letter, I'll {already|} have been {fired|dismissed|sacked}.",
			],
			traps: {
				get: ['will', 'got'],
				have: HAVE,
				been: BEEN,
				fired: ['fire', 'firing'],
			},
		},
		{
			id: 'future-perfect-passive-21',
			form: 'affirmative',
			prompt: 'До середи її вже випишуть з лікарні.',
			answer: "By Wednesday she'll have been discharged from hospital.",
			accept: [
				"By Wednesday she'll {already|} have been discharged from {hospital|the hospital}.",
			],
			traps: {
				have: HAVE,
				been: BEEN,
				discharged: ['discharge', 'discharging'],
			},
		},
		{
			id: 'future-perfect-passive-22',
			form: 'affirmative',
			prompt: 'До кінця семестру всі іспити вже перевірять.',
			answer: 'By the end of the term all the exams will have been marked.',
			accept: [
				'By the end of the {term|semester} all {the|} exams will {already|} have been {marked|checked|graded}.',
			],
			traps: { have: HAVE, been: BEEN, marked: ['mark', 'marking'] },
		},
		{
			id: 'future-perfect-passive-23',
			form: 'affirmative',
			prompt: 'Коли вони прилетять, їхній багаж уже доставлять у готель.',
			answer:
				'When they land, their luggage will have been taken to the hotel.',
			accept: [
				'{When|By the time} they {land|arrive}, their {luggage|baggage} will have been {taken|delivered} to the hotel.',
			],
			traps: {
				land: ['will', 'landed'],
				have: HAVE,
				been: BEEN,
				taken: ['took', 'taked'],
			},
		},
		{
			id: 'future-perfect-passive-24',
			form: 'affirmative',
			prompt: 'Мені подобається ця картина, але до Різдва її вже продадуть.',
			answer: "I like this painting, but by Christmas it'll have been sold.",
			accept: [
				"I like this {painting|picture}, but by Christmas {it'll|it will} {already|} have been sold.",
			],
			traps: { have: HAVE, been: BEEN, sold: ['sell', 'selled'] },
		},
		{
			id: 'future-perfect-passive-25',
			form: 'affirmative',
			prompt:
				'До того часу, як ти прочитаєш це повідомлення, рішення вже ухвалять.',
			answer:
				'By the time you read this message, the decision will have been made.',
			accept: [
				'By the time you read this message, the decision will {already|} have been {made|taken}.',
			],
			traps: {
				read: ['will', 'reading'],
				have: HAVE,
				been: BEEN,
				made: ['make', 'maked'],
			},
		},
		{
			id: 'future-perfect-passive-26',
			form: 'affirmative',
			prompt: "Через годину весь торт уже з'їдять.",
			answer: 'In an hour the whole cake will have been eaten.',
			accept: [
				'{In|Within} an hour {the whole cake|all the cake} will {already|} have been eaten.',
			],
			traps: { have: HAVE, been: BEEN, eaten: ['ate', 'eated'] },
		},
		{
			id: 'future-perfect-passive-27',
			form: 'affirmative',
			prompt: 'До весілля сукню вже пошиють.',
			answer: 'By the wedding the dress will have been made.',
			accept: [
				'By the wedding the dress will {already|} have been {made|sewn}.',
			],
			traps: { have: HAVE, been: BEEN, made: ['make', 'maked'] },
		},
		{
			id: 'future-perfect-passive-28',
			form: 'affirmative',
			prompt: 'До кінця року цю дорогу вже розширять.',
			answer: 'By the end of the year this road will have been widened.',
			accept: [
				'By the end of the year this road will {already|} have been widened.',
			],
			traps: { have: HAVE, been: BEEN, widened: ['widen', 'widening'] },
		},
		{
			id: 'future-perfect-passive-29',
			form: 'affirmative',
			prompt: 'Коли ти приїдеш, вікна вже помиють.',
			answer: 'When you arrive, the windows will have been washed.',
			accept: [
				'{When|By the time} you {arrive|get here}, the windows will {already|} have been {washed|cleaned}.',
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				washed: ['wash', 'washing'],
			},
		},
		{
			id: 'future-perfect-passive-30',
			form: 'affirmative',
			prompt: 'До понеділка всі помилки вже виправлять.',
			answer: 'By Monday all the mistakes will have been corrected.',
			accept: [
				'By Monday all {the|} {mistakes|errors} will {already|} have been {corrected|fixed}.',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				corrected: ['correct', 'correcting'],
			},
		},
		{
			id: 'future-perfect-passive-31',
			form: 'affirmative',
			prompt: 'До кінця тижня його вже прооперують.',
			answer: "By the end of the week he'll have been operated on.",
			accept: [
				"By the end of the week he'll {already|} have been operated on.",
			],
			traps: { have: HAVE, been: BEEN, operated: ['operate', 'operating'] },
		},
		{
			id: 'future-perfect-passive-32',
			form: 'affirmative',
			prompt: 'Коли прийдуть гості, стіл уже накриють.',
			answer: 'When the guests arrive, the table will have been laid.',
			accept: [
				'{When|By the time} the guests {arrive|come}, the table will {already|} have been {laid|set}.',
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				laid: ['layed', 'lay'],
			},
		},
		{
			id: 'future-perfect-passive-33',
			form: 'affirmative',
			prompt: "До п'ятниці всіх учасників уже зареєструють.",
			answer: 'By Friday all the participants will have been registered.',
			accept: [
				'By Friday all {the|} participants will {already|} have been registered.',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				registered: ['register', 'registering'],
			},
		},
		{
			id: 'future-perfect-passive-34',
			form: 'affirmative',
			prompt: 'До того часу, як ми доїдемо до аеропорту, рейс уже скасують.',
			answer:
				'By the time we get to the airport, the flight will have been cancelled.',
			accept: [
				'By the time we {get to|reach} the airport, the flight will {already|} have been {cancelled|canceled}.',
			],
			traps: {
				get: ['will', 'got'],
				have: HAVE,
				been: BEEN,
				cancelled: ['cancel', 'cancelling'],
			},
		},
		{
			id: 'future-perfect-passive-35',
			form: 'affirmative',
			prompt: 'До наступного року цей закон уже змінять.',
			answer: 'By next year this law will have been changed.',
			accept: [
				'By next year this law will {already|} have been {changed|amended}.',
			],
			traps: { have: HAVE, been: BEEN, changed: ['change', 'changing'] },
		},
		{
			id: 'future-perfect-passive-36',
			form: 'affirmative',
			prompt: 'До кінця уроку всі вправи вже перевірять.',
			answer:
				'By the end of the lesson all the exercises will have been checked.',
			accept: [
				'By the end of the {lesson|class} all {the|} exercises will {already|} have been checked.',
			],
			traps: { have: HAVE, been: BEEN, checked: ['check', 'checking'] },
		},
		{
			id: 'future-perfect-passive-37',
			form: 'affirmative',
			prompt: 'Коли ти повернешся додому, посилку вже доставлять.',
			answer: 'When you get home, the parcel will have been delivered.',
			accept: [
				'{When|By the time} you {get|come|get back|come back} home, the {parcel|package} will {already|} have been delivered.',
			],
			traps: {
				get: ['will', 'got'],
				have: HAVE,
				been: BEEN,
				delivered: ['deliver', 'delivering'],
			},
		},
		{
			id: 'future-perfect-passive-38',
			form: 'affirmative',
			prompt:
				'До того часу, як він закінчить університет, його вже візьмуть на роботу.',
			answer: "By the time he graduates, he'll have been hired.",
			accept: [
				"By the time he {graduates|finishes university}, he'll {already|} have been {hired|employed}.",
			],
			traps: {
				graduates: ['will', 'graduated'],
				have: HAVE,
				been: BEEN,
				hired: ['hire', 'hiring'],
			},
		},
		{
			id: 'future-perfect-passive-39',
			form: 'affirmative',
			prompt: "До ранку все вино вже вип'ють.",
			answer: 'By morning all the wine will have been drunk.',
			accept: [
				'By {morning|the morning} all the wine will {already|} have been drunk.',
			],
			traps: { have: HAVE, been: BEEN, drunk: ['drank', 'drinked'] },
		},
		{
			id: 'future-perfect-passive-40',
			form: 'affirmative',
			prompt: 'До кінця зими всі дрова вже спалять.',
			answer: 'By the end of winter all the firewood will have been burned.',
			accept: [
				'By the end of {winter|the winter} all the firewood will {already|} have been {burned|burnt}.',
			],
			traps: { have: HAVE, been: BEEN, burned: ['burn', 'burning'] },
		},
		{
			id: 'future-perfect-passive-41',
			form: 'affirmative',
			prompt: 'Коли приїде директор, офіс уже прикрасять.',
			answer: 'When the director arrives, the office will have been decorated.',
			accept: [
				'{When|By the time} the director arrives, the office will {already|} have been decorated.',
			],
			traps: {
				arrives: ['will', 'arrive'],
				have: HAVE,
				been: BEEN,
				decorated: ['decorate', 'decorating'],
			},
		},
		{
			id: 'future-perfect-passive-42',
			form: 'affirmative',
			prompt: 'До понеділка тобі вже дадуть відповідь.',
			answer: "By Monday you'll have been given an answer.",
			accept: [
				"By Monday you'll {already|} have been given {an answer|a reply}.",
			],
			traps: { have: HAVE, been: BEEN, given: ['gave', 'gived'] },
		},
		{
			id: 'future-perfect-passive-43',
			form: 'affirmative',
			prompt: 'До того часу, як ти подзвониш, договір уже підпишуть.',
			answer: 'By the time you call, the contract will have been signed.',
			accept: [
				'By the time you {call|phone}, the contract will {already|} have been signed.',
			],
			traps: {
				call: ['will', 'called'],
				have: HAVE,
				been: BEEN,
				signed: ['sign', 'signing'],
			},
		},
		{
			id: 'future-perfect-passive-44',
			form: 'affirmative',
			prompt: 'До кінця року в місті вже посадять тисячу дерев.',
			answer:
				'By the end of the year a thousand trees will have been planted in the city.',
			accept: [
				'By the end of the year {a|one} thousand trees will {already|} have been planted in the city.',
			],
			traps: { have: HAVE, been: BEEN, planted: ['plant', 'planting'] },
		},
		{
			id: 'future-perfect-passive-45',
			form: 'affirmative',
			prompt: "Коли ти прийдеш, піцу вже з'їдять.",
			answer: 'When you come, the pizza will have been eaten.',
			accept: [
				'{When|By the time} you {come|arrive|get here}, the pizza will {already|} have been eaten.',
			],
			traps: {
				come: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				eaten: ['ate', 'eated'],
			},
		},
		{
			id: 'future-perfect-passive-46',
			form: 'affirmative',
			prompt: 'До того часу, як почнеться фільм, усі місця вже займуть.',
			answer:
				'By the time the film starts, all the seats will have been taken.',
			accept: [
				'By the time the {film|movie} {starts|begins}, all {the|} seats will {already|} have been taken.',
			],
			traps: {
				starts: ['will', 'start'],
				have: HAVE,
				been: BEEN,
				taken: ['took', 'taked'],
			},
		},
		{
			id: 'future-perfect-passive-47',
			form: 'affirmative',
			prompt: 'До вечора цю новину вже оголосять.',
			answer: 'By the evening the news will have been announced.',
			accept: [
				'By {the evening|evening} the news will {already|} have been announced.',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				announced: ['announce', 'announcing'],
			},
		},
		{
			id: 'future-perfect-passive-48',
			form: 'affirmative',
			prompt: 'До кінця тижня всіх студентів уже повідомлять про зміни.',
			answer:
				'By the end of the week all the students will have been told about the changes.',
			accept: [
				'By the end of the week all {the|} students will {already|} have been {told|informed} about the changes.',
			],
			traps: { have: HAVE, been: BEEN, told: ['tell', 'telled'] },
		},
		{
			id: 'future-perfect-passive-49',
			form: 'question',
			prompt: 'Чи будинок уже продадуть до літа?',
			answer: 'Will the house have been sold by summer?',
			accept: [
				'Will the house {already|} have been sold by {summer|the summer}?',
			],
			traps: { have: HAVE, been: BEEN, sold: ['sell', 'selled'] },
		},
		{
			id: 'future-perfect-passive-50',
			form: 'question',
			prompt: "Чи мою машину вже відремонтують до п'ятниці?",
			answer: 'Will my car have been repaired by Friday?',
			accept: ['Will my car {already|} have been {repaired|fixed} by Friday?'],
			traps: { have: HAVE, been: BEEN, repaired: ['repair', 'repairing'] },
		},
		{
			id: 'future-perfect-passive-51',
			form: 'question',
			prompt: 'Коли я повернуся, кімнату вже приберуть?',
			answer: 'When I come back, will the room have been cleaned?',
			accept: [
				'{When|By the time} I {come back|get back|return}, will the room {already|} have been cleaned?',
			],
			traps: {
				come: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				cleaned: ['clean', 'cleaning'],
			},
		},
		{
			id: 'future-perfect-passive-52',
			form: 'question',
			prompt: 'Чи договір уже підпишуть до кінця тижня?',
			answer: 'Will the contract have been signed by the end of the week?',
			accept: [
				'Will the contract {already|} have been signed by the end of the week?',
			],
			traps: { have: HAVE, been: BEEN, signed: ['sign', 'signing'] },
		},
		{
			id: 'future-perfect-passive-53',
			form: 'question',
			prompt: 'Скільки квитків уже продадуть до понеділка?',
			answer: 'How many tickets will have been sold by Monday?',
			accept: ['How many tickets will {already|} have been sold by Monday?'],
			traps: { have: HAVE, been: BEEN, sold: ['sell', 'selled'] },
		},
		{
			id: 'future-perfect-passive-54',
			form: 'question',
			prompt: 'Чи дітей уже нагодують, коли ми прийдемо?',
			answer: 'Will the children have been fed by the time we arrive?',
			accept: [
				'Will the children {already|} have been fed {by the time|when} we {arrive|come|get there}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				fed: ['feeded', 'feed'],
				arrive: ['will', 'arrived'],
			},
		},
		{
			id: 'future-perfect-passive-55',
			form: 'question',
			prompt: 'Чи новий міст уже збудують до кінця року?',
			answer: 'Will the new bridge have been built by the end of the year?',
			accept: [
				'Will the new bridge {already|} have been built by the end of the year?',
			],
			traps: { have: HAVE, been: BEEN, built: ['build', 'builded'] },
		},
		{
			id: 'future-perfect-passive-56',
			form: 'question',
			prompt: 'Що вже вирішать до того часу, як ми приїдемо?',
			answer: 'What will have been decided by the time we arrive?',
			accept: [
				'What will {already|} have been decided by the time we {arrive|get there}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				decided: ['decide', 'deciding'],
				arrive: ['will', 'arrived'],
			},
		},
		{
			id: 'future-perfect-passive-57',
			form: 'question',
			prompt: 'Чи всіх гостей уже запросять до суботи?',
			answer: 'Will all the guests have been invited by Saturday?',
			accept: [
				'Will all {the|} guests {already|} have been invited by Saturday?',
			],
			traps: { have: HAVE, been: BEEN, invited: ['invite', 'inviting'] },
		},
		{
			id: 'future-perfect-passive-58',
			form: 'question',
			prompt: 'Чи результати вже оголосять до вечора?',
			answer: 'Will the results have been announced by the evening?',
			accept: [
				'Will the results {already|} have been announced by {the evening|evening}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				announced: ['announce', 'announcing'],
			},
		},
		{
			id: 'future-perfect-passive-59',
			form: 'question',
			prompt: 'Чи тобі вже заплатять до кінця місяця?',
			answer: 'Will you have been paid by the end of the month?',
			accept: ['Will you {already|} have been paid by the end of the month?'],
			traps: { have: HAVE, been: BEEN, paid: ['payed', 'pay'] },
		},
		{
			id: 'future-perfect-passive-60',
			form: 'question',
			prompt: 'Чи книжку вже перекладуть до осені?',
			answer: 'Will the book have been translated by autumn?',
			accept: [
				'Will the book {already|} have been translated by {autumn|the autumn|fall}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				translated: ['translate', 'translating'],
			},
		},
		{
			id: 'future-perfect-passive-61',
			form: 'question',
			prompt: 'Коли почнеться концерт, чи всі квитки вже перевірять?',
			answer:
				'When the concert starts, will all the tickets have been checked?',
			accept: [
				'{When|By the time} the concert {starts|begins}, will all {the|} tickets {already|} have been checked?',
			],
			traps: {
				starts: ['will', 'start'],
				have: HAVE,
				been: BEEN,
				checked: ['check', 'checking'],
			},
		},
		{
			id: 'future-perfect-passive-62',
			form: 'question',
			prompt: 'Скільки дерев уже посадять до весни?',
			answer: 'How many trees will have been planted by spring?',
			accept: [
				'How many trees will {already|} have been planted by {spring|the spring}?',
			],
			traps: { have: HAVE, been: BEEN, planted: ['plant', 'planting'] },
		},
		{
			id: 'future-perfect-passive-63',
			form: 'question',
			prompt: 'Чи його вже випишуть з лікарні до неділі?',
			answer: 'Will he have been discharged from hospital by Sunday?',
			accept: [
				'Will he {already|} have been discharged from {hospital|the hospital} by Sunday?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				discharged: ['discharge', 'discharging'],
			},
		},
		{
			id: 'future-perfect-passive-64',
			form: 'question',
			prompt: 'Чи піцу вже доставлять, коли почнеться матч?',
			answer:
				'Will the pizza have been delivered by the time the match starts?',
			accept: [
				'Will the pizza {already|} have been delivered {by the time|when} the {match|game} {starts|begins}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				delivered: ['deliver', 'delivering'],
				starts: ['will', 'start'],
			},
		},
		{
			id: 'future-perfect-passive-65',
			form: 'question',
			prompt: 'Чи ліфт уже полагодять до вечора?',
			answer: 'Will the lift have been repaired by the evening?',
			accept: [
				'Will the {lift|elevator} {already|} have been {repaired|fixed} by {the evening|evening}?',
			],
			traps: { have: HAVE, been: BEEN, repaired: ['repair', 'repairing'] },
		},
		{
			id: 'future-perfect-passive-66',
			form: 'question',
			prompt: 'Чи ялинку вже прикрасять до того, як прийдуть гості?',
			answer:
				'Will the Christmas tree have been decorated by the time the guests arrive?',
			accept: [
				'Will the {Christmas tree|tree} {already|} have been decorated by the time the guests {arrive|come}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				decorated: ['decorate', 'decorating'],
				arrive: ['will', 'arrived'],
			},
		},
		{
			id: 'future-perfect-passive-67',
			form: 'question',
			prompt: 'Чи ключі вже знайдуть до того часу, як ми поїдемо?',
			answer: 'Will the keys have been found by the time we leave?',
			accept: [
				'Will the keys {already|} have been found by the time we leave?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				found: ['find', 'finded'],
				leave: ['will', 'left'],
			},
		},
		{
			id: 'future-perfect-passive-68',
			form: 'question',
			prompt: 'Чи нас уже зареєструють до початку конференції?',
			answer: 'Will we have been registered by the start of the conference?',
			accept: [
				'Will we {already|} have been registered by the {start|beginning} of the conference?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				registered: ['register', 'registering'],
			},
		},
		{
			id: 'future-perfect-passive-69',
			form: 'question',
			prompt: 'Скільки грошей уже зберуть до кінця кампанії?',
			answer:
				'How much money will have been raised by the end of the campaign?',
			accept: [
				'How much money will {already|} have been {raised|collected} by the end of the campaign?',
			],
			traps: { have: HAVE, been: BEEN, raised: ['raise', 'rised'] },
		},
		{
			id: 'future-perfect-passive-70',
			form: 'question',
			prompt: 'Чи новий музей уже відкриють до наступного літа?',
			answer: 'Will the new museum have been opened by next summer?',
			accept: [
				'Will the new museum {already|} have been opened by next summer?',
			],
			traps: { have: HAVE, been: BEEN, opened: ['open', 'opening'] },
		},
		{
			id: 'future-perfect-passive-71',
			form: 'question',
			prompt: 'Коли ти прийдеш на роботу, чи всім уже повідомлять про зміни?',
			answer:
				'When you get to work, will everyone have been told about the changes?',
			accept: [
				'{When|By the time} you get to work, will {everyone|everybody} {already|} have been {told|informed} about the changes?',
			],
			traps: {
				get: ['will', 'got'],
				have: HAVE,
				been: BEEN,
				told: ['tell', 'telled'],
			},
		},
		{
			id: 'future-perfect-passive-72',
			form: 'question',
			prompt: 'Чи цю проблему вже вирішать до кінця тижня?',
			answer: 'Will this problem have been solved by the end of the week?',
			accept: [
				'Will this problem {already|} have been {solved|resolved} by the end of the week?',
			],
			traps: { have: HAVE, been: BEEN, solved: ['solve', 'solving'] },
		},
		{
			id: 'future-perfect-passive-73',
			form: 'question',
			prompt: 'Що вже зроблять до того часу, як він повернеться?',
			answer: 'What will have been done by the time he comes back?',
			accept: [
				'What will {already|} have been done by the time he {comes back|gets back|returns}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				done: ['did', 'doing'],
				comes: ['will', 'came'],
			},
		},
		{
			id: 'future-perfect-passive-74',
			form: 'question',
			prompt: 'Чи всі квартири в цьому будинку вже продадуть до весни?',
			answer: 'Will all the flats in this building have been sold by spring?',
			accept: [
				'Will all {the|} {flats|apartments} in this building {already|} have been sold by {spring|the spring}?',
			],
			traps: { have: HAVE, been: BEEN, sold: ['sell', 'selled'] },
		},
		{
			id: 'future-perfect-passive-75',
			form: 'question',
			prompt: 'Чи її вже підвищать на посаді до кінця року?',
			answer: 'Will she have been promoted by the end of the year?',
			accept: [
				'Will she {already|} have been promoted by the end of the year?',
			],
			traps: { have: HAVE, been: BEEN, promoted: ['promote', 'promoting'] },
		},
		{
			id: 'future-perfect-passive-76',
			form: 'question',
			prompt: 'Скільки людей уже вакцинують до зими?',
			answer: 'How many people will have been vaccinated by winter?',
			accept: [
				'How many people will {already|} have been vaccinated by {winter|the winter}?',
			],
			traps: {
				have: HAVE,
				been: BEEN,
				vaccinated: ['vaccinate', 'vaccinating'],
			},
		},
		{
			id: 'future-perfect-passive-77',
			form: 'negative',
			prompt: 'Коли ти прийдеш, вечерю ще не приготують.',
			answer: "When you come, dinner won't have been cooked yet.",
			accept: [
				"{When|By the time} you {come|arrive|get here}, dinner won't have been {cooked|made|prepared} yet.",
			],
			traps: {
				come: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				cooked: ['cook', 'cooking'],
			},
		},
		{
			id: 'future-perfect-passive-78',
			form: 'negative',
			prompt: 'До того часу, як ми приїдемо, квитки ще не продадуть.',
			answer: "By the time we arrive, the tickets won't have been sold yet.",
			accept: [
				"By the time we {arrive|get there}, the tickets won't have been sold yet.",
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				sold: ['sell', 'selled'],
			},
		},
		{
			id: 'future-perfect-passive-79',
			form: 'negative',
			prompt: 'Коли почнеться зустріч, документи ще не надрукують.',
			answer:
				"When the meeting starts, the documents won't have been printed yet.",
			accept: [
				"{When|By the time} the meeting {starts|begins}, the documents won't have been printed yet.",
			],
			traps: {
				starts: ['will', 'start'],
				have: HAVE,
				been: BEEN,
				printed: ['print', 'printing'],
			},
		},
		{
			id: 'future-perfect-passive-80',
			form: 'negative',
			prompt: 'До понеділка звіт не перевірять.',
			answer: "By Monday the report won't have been checked.",
			accept: ["By Monday the report won't {have been|be} checked."],
			traps: { have: HAVE, been: BEEN, checked: ['check', 'checking'] },
		},
		{
			id: 'future-perfect-passive-81',
			form: 'negative',
			prompt: 'Коли приїдуть гості, будинок ще не приберуть.',
			answer: "When the guests arrive, the house won't have been cleaned yet.",
			accept: [
				"{When|By the time} the guests arrive, the house won't have been cleaned yet.",
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				cleaned: ['clean', 'cleaning'],
			},
		},
		{
			id: 'future-perfect-passive-82',
			form: 'negative',
			prompt: 'До того часу, як ти прокинешся, сніг ще не приберуть.',
			answer: "By the time you wake up, the snow won't have been cleared yet.",
			accept: [
				"By the time you wake up, the snow won't have been {cleared|removed} yet.",
			],
			traps: {
				wake: ['will', 'woke'],
				have: HAVE,
				been: BEEN,
				cleared: ['clear', 'clearing'],
			},
		},
		{
			id: 'future-perfect-passive-83',
			form: 'negative',
			prompt: 'Коли ти отримаєш цей лист, рішення ще не ухвалять.',
			answer:
				"When you get this letter, the decision won't have been made yet.",
			accept: [
				"{When|By the time} you {get|receive} this letter, the decision won't have been {made|taken} yet.",
			],
			traps: {
				get: ['will', 'got'],
				have: HAVE,
				been: BEEN,
				made: ['make', 'maked'],
			},
		},
		{
			id: 'future-perfect-passive-84',
			form: 'negative',
			prompt: 'До кінця тижня новий міст не відкриють.',
			answer: "By the end of the week the new bridge won't have been opened.",
			accept: [
				"By the end of the week the new bridge won't {have been|be} opened.",
			],
			traps: { have: HAVE, been: BEEN, opened: ['open', 'opening'] },
		},
		{
			id: 'future-perfect-passive-85',
			form: 'negative',
			prompt: 'Коли він повернеться, його машину ще не відремонтують.',
			answer: "When he comes back, his car won't have been repaired yet.",
			accept: [
				"{When|By the time} he {comes back|gets back|returns}, his car won't have been {repaired|fixed} yet.",
			],
			traps: {
				comes: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				repaired: ['repair', 'repairing'],
			},
		},
		{
			id: 'future-perfect-passive-86',
			form: 'negative',
			prompt: 'До кінця місяця нам не заплатять.',
			answer: "By the end of the month we won't have been paid.",
			accept: ["By the end of the month we won't {have been|be} paid."],
			traps: { have: HAVE, been: BEEN, paid: ['payed', 'pay'] },
		},
		{
			id: 'future-perfect-passive-87',
			form: 'negative',
			prompt: 'Коли ти прийдеш, торт ще не розріжуть.',
			answer: "When you come, the cake won't have been cut yet.",
			accept: [
				"{When|By the time} you {come|arrive|get here}, the cake won't have been cut yet.",
			],
			traps: {
				come: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				cut: ['cutted', 'cutting'],
			},
		},
		{
			id: 'future-perfect-passive-88',
			form: 'negative',
			prompt: 'До того часу, як почнеться урок, проєктор ще не встановлять.',
			answer:
				"By the time the lesson starts, the projector won't have been installed yet.",
			accept: [
				"By the time the {lesson|class} {starts|begins}, the projector won't have been installed yet.",
			],
			traps: {
				starts: ['will', 'start'],
				have: HAVE,
				been: BEEN,
				installed: ['install', 'installing'],
			},
		},
		{
			id: 'future-perfect-passive-89',
			form: 'negative',
			prompt: 'Коли ми приїдемо, номер у готелі ще не приберуть.',
			answer: "When we arrive, the hotel room won't have been cleaned yet.",
			accept: [
				"{When|By the time} we arrive, the hotel room won't have been cleaned yet.",
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				cleaned: ['clean', 'cleaning'],
			},
		},
		{
			id: 'future-perfect-passive-90',
			form: 'negative',
			prompt: 'До Нового року цю будівлю не добудують.',
			answer: "By New Year this building won't have been completed.",
			accept: [
				"By {New Year|the New Year} this building won't {have been|be} {completed|finished}.",
			],
			traps: {
				have: HAVE,
				been: BEEN,
				completed: ['complete', 'completing'],
			},
		},
		{
			id: 'future-perfect-passive-91',
			form: 'negative',
			prompt: 'Коли ти подзвониш, посилку ще не відправлять.',
			answer: "When you call, the parcel won't have been sent yet.",
			accept: [
				"{When|By the time} you {call|phone}, the {parcel|package} won't have been sent yet.",
			],
			traps: {
				call: ['will', 'called'],
				have: HAVE,
				been: BEEN,
				sent: ['send', 'sended'],
			},
		},
		{
			id: 'future-perfect-passive-92',
			form: 'negative',
			prompt: 'До того часу, як ми закінчимо, ці питання ще не обговорять.',
			answer:
				"By the time we finish, these questions won't have been discussed yet.",
			accept: [
				"By the time we finish, these {questions|issues} won't have been discussed yet.",
			],
			traps: {
				finish: ['will', 'finished'],
				have: HAVE,
				been: BEEN,
				discussed: ['discuss', 'discussing'],
			},
		},
		{
			id: 'future-perfect-passive-93',
			form: 'negative',
			prompt: 'Не хвилюйся: до суботи нічого не вирішать.',
			answer: "Don't worry: by Saturday nothing will have been decided.",
			accept: ["Don't worry: by Saturday nothing will {have been|be} decided."],
			traps: { have: HAVE, been: BEEN, decided: ['decide', 'deciding'] },
		},
		{
			id: 'future-perfect-passive-94',
			form: 'negative',
			prompt: 'Коли прийде лікар, пацієнта ще не підготують до операції.',
			answer:
				"When the doctor comes, the patient won't have been prepared for the operation yet.",
			accept: [
				"{When|By the time} the doctor {comes|arrives}, the patient won't have been prepared for {the operation|surgery} yet.",
			],
			traps: {
				comes: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				prepared: ['prepare', 'preparing'],
			},
		},
		{
			id: 'future-perfect-passive-95',
			form: 'negative',
			prompt: 'До того часу, як ти приїдеш, твою кімнату ще не пофарбують.',
			answer: "By the time you arrive, your room won't have been painted yet.",
			accept: [
				"By the time you {arrive|get here}, your room won't have been painted yet.",
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				painted: ['paint', 'painting'],
			},
		},
		{
			id: 'future-perfect-passive-96',
			form: 'negative',
			prompt: 'Коли ти повернешся, собак ще не нагодують.',
			answer: "When you come back, the dogs won't have been fed yet.",
			accept: [
				"{When|By the time} you {come back|get back|return}, the dogs won't have been fed yet.",
			],
			traps: {
				come: ['will', 'came'],
				have: HAVE,
				been: BEEN,
				fed: ['feeded', 'feed'],
			},
		},
		{
			id: 'future-perfect-passive-97',
			form: 'negative',
			prompt: 'До кінця року цю проблему не вирішать.',
			answer: "By the end of the year this problem won't have been solved.",
			accept: [
				"By the end of the year this problem won't {have been|be} {solved|resolved}.",
			],
			traps: { have: HAVE, been: BEEN, solved: ['solve', 'solving'] },
		},
		{
			id: 'future-perfect-passive-98',
			form: 'negative',
			prompt: 'Коли закінчиться конкурс, переможця ще не оголосять.',
			answer:
				"When the competition ends, the winner won't have been announced yet.",
			accept: [
				"{When|By the time} the {competition|contest} {ends|finishes}, the winner won't have been announced yet.",
			],
			traps: {
				ends: ['will', 'end'],
				have: HAVE,
				been: BEEN,
				announced: ['announce', 'announcing'],
			},
		},
		{
			id: 'future-perfect-passive-99',
			form: 'negative',
			prompt: 'До того часу, як вони приїдуть, ключі ще не знайдуть.',
			answer: "By the time they arrive, the keys won't have been found yet.",
			accept: [
				"By the time they {arrive|get here|get there}, the keys won't have been found yet.",
			],
			traps: {
				arrive: ['will', 'arrived'],
				have: HAVE,
				been: BEEN,
				found: ['find', 'finded'],
			},
		},
		{
			id: 'future-perfect-passive-100',
			form: 'negative',
			prompt: 'До кінця тижня статтю не опублікують.',
			answer: "By the end of the week the article won't have been published.",
			accept: [
				"By the end of the week the article won't {have been|be} published.",
			],
			traps: {
				have: HAVE,
				been: BEEN,
				published: ['publish', 'publishing'],
			},
		},
	],
})
