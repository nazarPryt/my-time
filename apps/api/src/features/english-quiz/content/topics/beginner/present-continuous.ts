import { defineTopic } from '../../define-topic'

export const presentContinuous = defineTopic({
	id: 'present-continuous',
	level: 'beginner',
	title: 'Present Continuous',
	subtitle: 'Теперішній тривалий час',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				"am/is/are + дієслово з -ing: I'm, you're, we're, they're; he is (he's), she is (she's), it is (it's). Правопис: come → coming, stop → stopping, die → dying.",
			examples: [
				{
					text: "I'm ironing a shirt.",
					translation: 'Я прасую сорочку.',
				},
				{
					text: 'The kettle is boiling.',
					translation: 'Чайник кипить.',
				},
				{
					text: "They're planting trees in the park.",
					translation: 'Вони садять дерева в парку.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Am/Is/Are + підмет + дієслово з -ing. Питальне слово (What, Where, Why, Who) стоїть на початку.',
			examples: [
				{
					text: 'Is the baby still crying?',
					translation: 'Малюк усе ще плаче?',
				},
				{
					text: 'Where are they hiding?',
					translation: 'Де вони ховаються?',
				},
				{
					text: 'Why is the dog barking?',
					translation: 'Чому собака гавкає?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"am not / isn't / aren't + дієслово з -ing: I'm not, she isn't (she's not), they aren't (they're not).",
			examples: [
				{
					text: "I'm not wearing a watch.",
					translation: 'Я не ношу годинника.',
				},
				{
					text: "The printer isn't printing.",
					translation: 'Принтер не друкує.',
				},
				{
					text: "We aren't eating sugar this month.",
					translation: 'Цього місяця ми не їмо цукру.',
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				'Дія відбувається зараз (now, right now, Look!, Listen!), тимчасова ситуація (this week, this month), зміна (get colder, rise, improve) або дратівлива звичка з always («вічно»). Дієслова стану (know, like, want, need, understand) у Continuous не вживаються: I know, I like.',
			examples: [
				{
					text: 'Look! The bus is leaving.',
					translation: "Подивись! Автобус від'їжджає.",
				},
				{
					text: "This week I'm sleeping on the sofa.",
					translation: 'Цього тижня я сплю на дивані.',
				},
				{
					text: 'The ice is getting thinner.',
					translation: 'Лід стає тоншим.',
				},
				{
					text: "She's always borrowing my pens!",
					translation: 'Вона вічно позичає мої ручки!',
				},
			],
		},
	],
	sentences: [
		{
			id: 'present-continuous-1',
			form: 'question',
			prompt: 'Що ти робиш?',
			answer: 'What are you doing?',
			traps: {
				doing: ['do', 'does', 'done'],
			},
		},
		{
			id: 'present-continuous-2',
			form: 'negative',
			prompt: 'Вони зараз не працюють.',
			answer: "They aren't working now.",
			accept: ["They're not working now."],
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
			},
		},
		{
			id: 'present-continuous-3',
			form: 'affirmative',
			prompt: 'Подивись! Твій син їсть пісок.',
			answer: 'Look! Your son is eating sand.',
			traps: {
				is: ['are', 'does', 'am'],
				eating: ['eat', 'eats', 'ate'],
			},
		},
		{
			id: 'present-continuous-4',
			form: 'affirmative',
			prompt: 'Послухай! Твій брат хропе.',
			answer: 'Listen! Your brother is snoring.',
			traps: {
				is: ['are', 'does', 'am'],
				snoring: ['snore', 'snores', 'snoreing'],
			},
		},
		{
			id: 'present-continuous-5',
			form: 'affirmative',
			prompt: 'Подивись! Наші діти ліплять сніговика.',
			answer: 'Look! Our children are making a snowman.',
			accept: ['Look! Our {children|kids} are {making|building} a snowman.'],
			traps: {
				are: ['is', 'do', 'am'],
				making: ['makeing', 'make', 'makes'],
			},
		},
		{
			id: 'present-continuous-6',
			form: 'affirmative',
			prompt: 'Я саме зараз пишу свій звіт.',
			answer: "I'm writing my report right now.",
			traps: {
				writing: ['writeing', 'writting', 'write'],
			},
		},
		{
			id: 'present-continuous-7',
			form: 'affirmative',
			prompt: 'Мій чоловік саме зараз смажить картоплю.',
			answer: 'My husband is frying potatoes right now.',
			accept: ['My husband is frying the potatoes right now.'],
			traps: {
				is: ['are', 'does', 'am'],
				frying: ['fry', 'fries', 'fried'],
			},
		},
		{
			id: 'present-continuous-8',
			form: 'affirmative',
			prompt: 'Цього тижня я ходжу на роботу пішки.',
			answer: "This week I'm walking to work.",
			accept: ["I'm walking to work this week."],
			traps: {
				walking: ['walk', 'walks', 'walked'],
			},
		},
		{
			id: 'present-continuous-9',
			form: 'affirmative',
			prompt: 'Ціни знову зростають.',
			answer: 'Prices are rising again.',
			accept: ['Prices are going up again.'],
			traps: {
				are: ['is', 'do', 'am'],
				rising: ['riseing', 'rise', 'rises'],
			},
		},
		{
			id: 'present-continuous-10',
			form: 'affirmative',
			prompt: 'Твоя англійська покращується.',
			answer: 'Your English is improving.',
			accept: ['Your English is getting better.'],
			traps: {
				is: ['are', 'does', 'am'],
				improving: ['improve', 'improves', 'improveing'],
			},
		},
		{
			id: 'present-continuous-11',
			form: 'affirmative',
			prompt: 'Світ швидко змінюється.',
			answer: 'The world is changing fast.',
			accept: [
				'The world is changing quickly.',
				'The world is quickly changing.',
			],
			traps: {
				is: ['are', 'does', 'am'],
				changing: ['change', 'changes', 'changeing'],
			},
		},
		{
			id: 'present-continuous-12',
			form: 'affirmative',
			prompt: 'Дні стають довшими.',
			answer: 'The days are getting longer.',
			accept: ['Days are getting longer.'],
			traps: {
				are: ['is', 'do', 'am'],
				getting: ['geting', 'get', 'gets'],
			},
		},
		{
			id: 'present-continuous-13',
			form: 'affirmative',
			prompt: 'Моя донька швидко росте.',
			answer: 'My daughter is growing up fast.',
			accept: ['My daughter is growing {up |}{fast|quickly}.'],
			traps: {
				is: ['are', 'does', 'am'],
				growing: ['grow', 'grows', 'grew'],
			},
		},
		{
			id: 'present-continuous-14',
			form: 'affirmative',
			prompt: 'З кожним днем стає холодніше.',
			answer: 'It is getting colder every day.',
			accept: [
				"It's getting colder {every day|day by day}.",
				'It is getting colder day by day.',
				"Every day {it is|it's} getting colder.",
			],
			traps: {
				is: ['are', 'does', 'am'],
				getting: ['geting', 'get', 'gets'],
			},
		},
		{
			id: 'present-continuous-15',
			form: 'affirmative',
			prompt: 'Він вічно губить свої ключі!',
			answer: 'He is always losing his keys!',
			accept: ["He's always losing his keys!"],
			traps: {
				is: ['are', 'does', 'am'],
				losing: ['loseing', 'lose', 'loses'],
			},
		},
		{
			id: 'present-continuous-16',
			form: 'affirmative',
			prompt: 'Ти вічно мене перебиваєш!',
			answer: "You're always interrupting me!",
			traps: {
				interrupting: ['interrupt', 'interrupts', 'interrupted'],
			},
		},
		{
			id: 'present-continuous-17',
			form: 'affirmative',
			prompt: "Ти вічно забуваєш моє ім'я!",
			answer: "You're always forgetting my name!",
			traps: {
				forgetting: ['forgeting', 'forget', 'forgets'],
			},
		},
		{
			id: 'present-continuous-18',
			form: 'affirmative',
			prompt: 'Я саме зараз варю каву.',
			answer: "I'm making coffee right now.",
			traps: {
				making: ['makeing', 'make', 'makes'],
			},
		},
		{
			id: 'present-continuous-19',
			form: 'affirmative',
			prompt: 'Ми зараз пакуємо свої валізи.',
			answer: "We're packing our suitcases now.",
			accept: ["We're packing our bags now."],
			traps: {
				packing: ['pack', 'packs', 'packed'],
			},
		},
		{
			id: 'present-continuous-20',
			form: 'affirmative',
			prompt: 'Вона саме зараз ріже хліб.',
			answer: 'She is cutting the bread right now.',
			accept: ["{She is|She's} cutting {the |}bread right now."],
			traps: {
				is: ['are', 'does', 'am'],
				cutting: ['cuting', 'cut', 'cuts'],
			},
		},
		{
			id: 'present-continuous-21',
			form: 'affirmative',
			prompt: 'Подивись! Наш пес лежить на твоєму ліжку.',
			answer: 'Look! Our dog is lying on your bed.',
			traps: {
				is: ['are', 'does', 'am'],
				lying: ['laying', 'lieing', 'lies'],
			},
		},
		{
			id: 'present-continuous-22',
			form: 'affirmative',
			prompt: 'Подивись, той хлопчик біжить за автобусом.',
			answer: 'Look, that boy is running after the bus.',
			accept: ['Look, that boy is running for the bus.'],
			traps: {
				is: ['are', 'does', 'am'],
				running: ['runing', 'run', 'runs'],
			},
		},
		{
			id: 'present-continuous-23',
			form: 'affirmative',
			prompt: 'Ми саме зараз виходимо з дому.',
			answer: "We're leaving the house right now.",
			traps: {
				leaving: ['leave', 'leaves', 'left'],
			},
		},
		{
			id: 'present-continuous-24',
			form: 'affirmative',
			prompt: 'Я зараз розмовляю зі своїм начальником.',
			answer: "I'm talking to my boss now.",
			accept: ["I'm {talking|speaking} {to|with} my boss now."],
			traps: {
				talking: ['talk', 'talks', 'talked'],
			},
		},
		{
			id: 'present-continuous-25',
			form: 'affirmative',
			prompt: 'Мій брат зараз ремонтує свій велосипед.',
			answer: 'My brother is fixing his bike now.',
			accept: ['My brother is {fixing|repairing} his {bike|bicycle} now.'],
			traps: {
				is: ['are', 'does', 'am'],
				fixing: ['fix', 'fixes', 'fixed'],
			},
		},
		{
			id: 'present-continuous-26',
			form: 'affirmative',
			prompt: 'Я зараз чищу зуби.',
			answer: "I'm brushing my teeth now.",
			traps: {
				brushing: ['brush', 'brushes', 'brushed'],
			},
		},
		{
			id: 'present-continuous-27',
			form: 'affirmative',
			prompt: 'Моя сестра зараз сушить волосся.',
			answer: 'My sister is drying her hair now.',
			traps: {
				is: ['are', 'does', 'am'],
				drying: ['dry', 'dries', 'dried'],
			},
		},
		{
			id: 'present-continuous-28',
			form: 'affirmative',
			prompt: 'Ми зараз дивимося дуже смішний фільм.',
			answer: "We're watching a very funny film now.",
			accept: ["We're watching a very funny movie now."],
			traps: {
				watching: ['watch', 'watches', 'watched'],
			},
		},
		{
			id: 'present-continuous-29',
			form: 'affirmative',
			prompt: 'Марія цього року вчиться водити.',
			answer: 'Maria is learning to drive this year.',
			accept: ['This year Maria is learning to drive.'],
			traps: {
				is: ['are', 'does', 'am'],
				learning: ['learn', 'learns', 'learned'],
			},
		},
		{
			id: 'present-continuous-30',
			form: 'affirmative',
			prompt: 'Цього місяця ми економимо гроші.',
			answer: "This month we're saving money.",
			accept: ["We're saving money this month."],
			traps: {
				saving: ['saveing', 'save', 'saves'],
			},
		},
		{
			id: 'present-continuous-31',
			form: 'affirmative',
			prompt: 'Іван зараз шукає нову роботу.',
			answer: 'Ivan is looking for a new job now.',
			traps: {
				is: ['are', 'does', 'am'],
				looking: ['look', 'looks', 'looked'],
			},
		},
		{
			id: 'present-continuous-32',
			form: 'affirmative',
			prompt: 'Подивись, Тарас махає нам рукою.',
			answer: 'Look, Taras is waving at us.',
			accept: ['Look, Taras is waving to us.'],
			traps: {
				is: ['are', 'does', 'am'],
				waving: ['waveing', 'wave', 'waves'],
			},
		},
		{
			id: 'present-continuous-33',
			form: 'affirmative',
			prompt: 'Послухай! Хтось тебе кличе.',
			answer: 'Listen! Someone is calling you.',
			accept: ['Listen! Somebody is calling you.'],
			traps: {
				is: ['are', 'does', 'am'],
				calling: ['call', 'calls', 'called'],
			},
		},
		{
			id: 'present-continuous-34',
			form: 'affirmative',
			prompt: "Він зараз зав'язує шнурки.",
			answer: 'He is tying his shoelaces now.',
			accept: ["{He is|He's} tying his {shoelaces|laces} now."],
			traps: {
				is: ['are', 'does', 'am'],
				tying: ['tieing', 'tie', 'ties'],
			},
		},
		{
			id: 'present-continuous-35',
			form: 'affirmative',
			prompt: 'Подивись! Твоє морозиво тане.',
			answer: 'Look! Your ice cream is melting.',
			traps: {
				is: ['are', 'does', 'am'],
				melting: ['melt', 'melts', 'melted'],
			},
		},
		{
			id: 'present-continuous-36',
			form: 'affirmative',
			prompt: 'Ми зараз пливемо до острова.',
			answer: "We're swimming to the island now.",
			traps: {
				swimming: ['swiming', 'swim', 'swims'],
			},
		},
		{
			id: 'present-continuous-37',
			form: 'affirmative',
			prompt: 'Ти сидиш на моєму місці!',
			answer: "You're sitting in my seat!",
			accept: ["You're sitting on my seat!"],
			traps: {
				sitting: ['siting', 'sit', 'sits'],
			},
		},
		{
			id: 'present-continuous-38',
			form: 'affirmative',
			prompt: 'Він саме зараз паркує свою машину.',
			answer: 'He is parking his car right now.',
			accept: ["He's parking his car right now."],
			traps: {
				is: ['are', 'does', 'am'],
				parking: ['park', 'parks', 'parked'],
			},
		},
		{
			id: 'present-continuous-39',
			form: 'affirmative',
			prompt: 'Подивись! Сонце сідає.',
			answer: 'Look! The sun is setting.',
			accept: ['Look! The sun is going down.'],
			traps: {
				is: ['are', 'does', 'am'],
				setting: ['seting', 'sets', 'sat'],
			},
		},
		{
			id: 'present-continuous-40',
			form: 'affirmative',
			prompt: 'Твоя кава холоне.',
			answer: 'Your coffee is getting cold.',
			traps: {
				is: ['are', 'does', 'am'],
				getting: ['geting', 'get', 'gets'],
			},
		},
		{
			id: 'present-continuous-41',
			form: 'affirmative',
			prompt: 'Гості вже сидять за столом.',
			answer: 'The guests are already sitting at the table.',
			accept: ['The guests are sitting at the table already.'],
			traps: {
				are: ['is', 'do', 'am'],
				sitting: ['siting', 'sit', 'sat'],
			},
		},
		{
			id: 'present-continuous-42',
			form: 'affirmative',
			prompt: 'Мій тато зараз миє вікна.',
			answer: 'My dad is washing the windows now.',
			accept: ['My {dad|father} is {washing|cleaning} the windows now.'],
			traps: {
				is: ['are', 'does', 'am'],
				washing: ['wash', 'washes', 'washed'],
			},
		},
		{
			id: 'present-continuous-43',
			form: 'affirmative',
			prompt: 'Цього тижня я працюю вночі.',
			answer: "This week I'm working at night.",
			accept: ["I'm working at night this week."],
			traps: {
				working: ['work', 'works', 'worked'],
			},
		},
		{
			id: 'present-continuous-44',
			form: 'affirmative',
			prompt: 'Цього місяця мій брат живе в нас.',
			answer: 'This month my brother is living with us.',
			accept: [
				'This month my brother is staying with us.',
				'My brother is {living|staying} with us this month.',
			],
			traps: {
				is: ['are', 'does', 'am'],
				living: ['liveing', 'live', 'lives'],
			},
		},
		{
			id: 'present-continuous-45',
			form: 'affirmative',
			prompt: 'Подивись, той чоловік фарбує паркан.',
			answer: 'Look, that man is painting the fence.',
			accept: ['Look, that man is painting a fence.'],
			traps: {
				is: ['are', 'does', 'am'],
				painting: ['paint', 'paints', 'painted'],
			},
		},
		{
			id: 'present-continuous-46',
			form: 'affirmative',
			prompt: 'Подивись! Ті діти годують качок.',
			answer: 'Look! Those children are feeding the ducks.',
			accept: ['Look! Those {children|kids} are feeding {the |}ducks.'],
			traps: {
				are: ['is', 'do', 'am'],
				feeding: ['feed', 'feeds', 'fed'],
			},
		},
		{
			id: 'present-continuous-47',
			form: 'affirmative',
			prompt: 'Я саме зараз сідаю в автобус.',
			answer: "I'm getting on the bus right now.",
			traps: {
				getting: ['geting', 'get', 'got'],
			},
		},
		{
			id: 'present-continuous-48',
			form: 'question',
			prompt: 'Чому ти так на мене дивишся?',
			answer: 'Why are you looking at me like that?',
			accept: ['Why are you looking at me like this?'],
			traps: {
				are: ['do', 'is', 'does'],
				looking: ['look', 'looks', 'looked'],
			},
		},
		{
			id: 'present-continuous-49',
			form: 'question',
			prompt: 'Що ти тут робиш?',
			answer: 'What are you doing here?',
			traps: {
				are: ['do', 'is', 'does'],
				doing: ['do', 'does', 'did'],
			},
		},
		{
			id: 'present-continuous-50',
			form: 'question',
			prompt: 'Над чим ти зараз працюєш?',
			answer: 'What are you working on now?',
			traps: {
				are: ['do', 'is', 'does'],
				working: ['work', 'works', 'worked'],
			},
		},
		{
			id: 'present-continuous-51',
			form: 'question',
			prompt: 'Куди ви всі йдете?',
			answer: 'Where are you all going?',
			traps: {
				are: ['do', 'is', 'does'],
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-52',
			form: 'question',
			prompt: 'Чому всі сміються?',
			answer: 'Why is everyone laughing?',
			accept: ['Why is everybody laughing?'],
			traps: {
				is: ['are', 'does', 'do'],
				laughing: ['laugh', 'laughs', 'laughed'],
			},
		},
		{
			id: 'present-continuous-53',
			form: 'question',
			prompt: 'Хто зараз грає на піаніно?',
			answer: 'Who is playing the piano now?',
			accept: ["{Who is|Who's} playing {the |}piano now?"],
			traps: {
				is: ['are', 'does', 'do'],
				playing: ['play', 'plays', 'played'],
			},
		},
		{
			id: 'present-continuous-54',
			form: 'question',
			prompt: 'Що ти зараз готуєш?',
			answer: 'What are you cooking now?',
			accept: ['What are you making now?'],
			traps: {
				are: ['do', 'is', 'does'],
				cooking: ['cook', 'cooks', 'cooked'],
			},
		},
		{
			id: 'present-continuous-55',
			form: 'question',
			prompt: 'Чому ти не спиш?',
			answer: "Why aren't you sleeping?",
			accept: ['Why are you not sleeping?'],
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
				sleeping: ['sleep', 'sleeps', 'slept'],
			},
		},
		{
			id: 'present-continuous-56',
			form: 'question',
			prompt: 'Чого ти чекаєш?',
			answer: 'What are you waiting for?',
			traps: {
				are: ['do', 'is', 'does'],
				waiting: ['wait', 'waits', 'waited'],
			},
		},
		{
			id: 'present-continuous-57',
			form: 'question',
			prompt: 'Про що ви говорите?',
			answer: 'What are you talking about?',
			traps: {
				are: ['do', 'is', 'does'],
				talking: ['talk', 'talks', 'talked'],
			},
		},
		{
			id: 'present-continuous-58',
			form: 'question',
			prompt: 'Про що ти думаєш?',
			answer: 'What are you thinking about?',
			traps: {
				are: ['do', 'is', 'does'],
				thinking: ['think', 'thinks', 'thought'],
			},
		},
		{
			id: 'present-continuous-59',
			form: 'question',
			prompt: 'Яку книжку ти зараз читаєш?',
			answer: 'What book are you reading now?',
			accept: ['Which book are you reading now?'],
			traps: {
				are: ['do', 'is', 'does'],
				reading: ['read', 'reads', 'readed'],
			},
		},
		{
			id: 'present-continuous-60',
			form: 'question',
			prompt: 'Чому твій брат кричить?',
			answer: 'Why is your brother shouting?',
			accept: ['Why is your brother yelling?'],
			traps: {
				is: ['are', 'does', 'do'],
				shouting: ['shout', 'shouts', 'shouted'],
			},
		},
		{
			id: 'present-continuous-61',
			form: 'question',
			prompt: 'Кому ти пишеш?',
			answer: 'Who are you writing to?',
			traps: {
				are: ['do', 'is', 'does'],
				writing: ['writeing', 'write', 'writes'],
			},
		},
		{
			id: 'present-continuous-62',
			form: 'question',
			prompt: 'Кому ти телефонуєш?',
			answer: 'Who are you calling?',
			accept: ['Who are you phoning?'],
			traps: {
				are: ['do', 'is', 'does'],
				calling: ['call', 'calls', 'called'],
			},
		},
		{
			id: 'present-continuous-63',
			form: 'question',
			prompt: 'Як просувається твій проєкт?',
			answer: 'How is your project going?',
			accept: ["How's your project going?"],
			traps: {
				is: ['are', 'does', 'do'],
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-64',
			form: 'question',
			prompt: 'Твоя сестра цього тижня працює вночі?',
			answer: 'Is your sister working at night this week?',
			traps: {
				Is: ['Are', 'Does', 'Do'],
				working: ['work', 'works', 'worked'],
			},
		},
		{
			id: 'present-continuous-65',
			form: 'question',
			prompt: 'Ти щось шукаєш?',
			answer: 'Are you looking for something?',
			accept: ['Are you looking for anything?'],
			traps: {
				Are: ['Do', 'Is', 'Does'],
				looking: ['look', 'looks', 'looked'],
			},
		},
		{
			id: 'present-continuous-66',
			form: 'question',
			prompt: 'Дощ ще йде?',
			answer: 'Is it still raining?',
			traps: {
				Is: ['Are', 'Does', 'Do'],
				raining: ['rain', 'rains', 'rained'],
			},
		},
		{
			id: 'present-continuous-67',
			form: 'question',
			prompt: 'Чому люди дивляться на нас?',
			answer: 'Why are people looking at us?',
			traps: {
				are: ['do', 'is', 'does'],
				looking: ['look', 'looks', 'looked'],
			},
		},
		{
			id: 'present-continuous-68',
			form: 'question',
			prompt: 'Ти добре проводиш час?',
			answer: 'Are you having a good time?',
			accept: ['Are you having a nice time?'],
			traps: {
				Are: ['Do', 'Is', 'Does'],
				having: ['have', 'has', 'haveing'],
			},
		},
		{
			id: 'present-continuous-69',
			form: 'question',
			prompt: 'Ти записуєш нашу розмову?',
			answer: 'Are you recording our conversation?',
			traps: {
				Are: ['Do', 'Is', 'Does'],
				recording: ['record', 'records', 'recorded'],
			},
		},
		{
			id: 'present-continuous-70',
			form: 'question',
			prompt: 'Ти ще вечеряєш?',
			answer: 'Are you still having dinner?',
			accept: ['Are you still eating dinner?'],
			traps: {
				Are: ['Do', 'Is', 'Does'],
				having: ['have', 'has', 'haveing'],
			},
		},
		{
			id: 'present-continuous-71',
			form: 'question',
			prompt: 'Який фільм ви дивитеся?',
			answer: 'What film are you watching?',
			accept: ['{What|Which} {film|movie} are you watching?'],
			traps: {
				are: ['do', 'is', 'does'],
				watching: ['watch', 'watches', 'watched'],
			},
		},
		{
			id: 'present-continuous-72',
			form: 'question',
			prompt: 'Що Анна робить на кухні?',
			answer: 'What is Anna doing in the kitchen?',
			accept: ["What's Anna doing in the kitchen?"],
			traps: {
				is: ['are', 'does', 'do'],
				doing: ['do', 'does', 'did'],
			},
		},
		{
			id: 'present-continuous-73',
			form: 'question',
			prompt: 'У горах зараз іде сніг?',
			answer: 'Is it snowing in the mountains now?',
			traps: {
				Is: ['Are', 'Does', 'Do'],
				snowing: ['snow', 'snows', 'snowed'],
			},
		},
		{
			id: 'present-continuous-74',
			form: 'question',
			prompt: 'Діти ще сплять?',
			answer: 'Are the children still sleeping?',
			accept: ['Are the kids still sleeping?'],
			traps: {
				Are: ['Do', 'Is', 'Does'],
				sleeping: ['sleep', 'sleeps', 'slept'],
			},
		},
		{
			id: 'present-continuous-75',
			form: 'question',
			prompt: 'Чому ти так швидко ведеш машину?',
			answer: 'Why are you driving so fast?',
			traps: {
				are: ['do', 'is', 'does'],
				driving: ['driveing', 'drive', 'drives'],
			},
		},
		{
			id: 'present-continuous-76',
			form: 'question',
			prompt: 'Чому ти не їси свій суп?',
			answer: "Why aren't you eating your soup?",
			accept: ['Why are you not eating your soup?'],
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
				eating: ['eat', 'eats', 'ate'],
			},
		},
		{
			id: 'present-continuous-77',
			form: 'negative',
			prompt: 'Я не жартую, це правда.',
			answer: "I'm not joking, it's true.",
			accept: ["I'm not {joking|kidding}, {it's|it is} true."],
			traps: {
				joking: ['joke', 'jokes', 'jokeing'],
			},
		},
		{
			id: 'present-continuous-78',
			form: 'negative',
			prompt: "Цього тижня я не їм м'яса.",
			answer: "This week I'm not eating meat.",
			accept: ["I'm not eating meat this week."],
			traps: {
				eating: ['eat', 'eats', 'ate'],
			},
		},
		{
			id: 'present-continuous-79',
			form: 'negative',
			prompt: 'Моя донька цього тижня не ходить до школи.',
			answer: "My daughter isn't going to school this week.",
			accept: ["This week my daughter isn't going to school."],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-80',
			form: 'negative',
			prompt: 'Подивись, він не носить шолом!',
			answer: "Look, he isn't wearing a helmet!",
			accept: ["Look, {he isn't|he's not} wearing a helmet!"],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				wearing: ['wear', 'wears', 'wore'],
			},
		},
		{
			id: 'present-continuous-81',
			form: 'negative',
			prompt: 'Вона сьогодні не носить окулярів.',
			answer: "She isn't wearing her glasses today.",
			accept: ["{She isn't|She's not} wearing {her |}glasses today."],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				wearing: ['wear', 'wears', 'wore'],
			},
		},
		{
			id: 'present-continuous-82',
			form: 'negative',
			prompt: 'Я не плачу, я ріжу цибулю.',
			answer: "I'm not crying, I'm cutting onions.",
			accept: ["I'm not crying, I'm {cutting|chopping} {onions|an onion}."],
			traps: {
				crying: ['cry', 'cries', 'cryed'],
				cutting: ['cuting', 'cut', 'cuts'],
			},
		},
		{
			id: 'present-continuous-83',
			form: 'negative',
			prompt: 'Справи йдуть не дуже добре.',
			answer: "Things aren't going very well.",
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-84',
			form: 'negative',
			prompt: 'Мій план не працює.',
			answer: "My plan isn't working.",
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				working: ['work', 'works', 'worked'],
			},
		},
		{
			id: 'present-continuous-85',
			form: 'negative',
			prompt: 'Подивись, ніхто не танцює.',
			answer: 'Look, nobody is dancing.',
			accept: ['Look, no one is dancing.'],
			traps: {
				is: ['are', "isn't", 'does'],
				dancing: ['danceing', 'dance', 'dances'],
			},
		},
		{
			id: 'present-continuous-86',
			form: 'negative',
			prompt: 'Я не сміюся, я кашляю.',
			answer: "I'm not laughing, I'm coughing.",
			traps: {
				laughing: ['laugh', 'laughs', 'laughed'],
				coughing: ['cough', 'coughs', 'coughed'],
			},
		},
		{
			id: 'present-continuous-87',
			form: 'negative',
			prompt: 'Вона навіть не дивиться на мене.',
			answer: "She isn't even looking at me.",
			accept: ["She's not even looking at me."],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				looking: ['look', 'looks', 'looked'],
			},
		},
		{
			id: 'present-continuous-88',
			form: 'negative',
			prompt: 'Ліфт сьогодні не працює.',
			answer: "The lift isn't working today.",
			accept: ["The {lift|elevator} isn't working today."],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				working: ['work', 'works', 'worked'],
			},
		},
		{
			id: 'present-continuous-89',
			form: 'negative',
			prompt: 'Мій телефон не заряджається.',
			answer: "My phone isn't charging.",
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				charging: ['charge', 'charges', 'chargeing'],
			},
		},
		{
			id: 'present-continuous-90',
			form: 'negative',
			prompt: 'Він сьогодні не працює, він хворий.',
			answer: "He isn't working today, he's sick.",
			accept: ["{He isn't|He's not} working today, {he's|he is} {sick|ill}."],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				working: ['work', 'works', 'worked'],
			},
		},
		{
			id: 'present-continuous-91',
			form: 'negative',
			prompt: 'Ти навіть не стараєшся!',
			answer: "You aren't even trying!",
			accept: ["You're not even trying!"],
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
				trying: ['try', 'tries', 'trieing'],
			},
		},
		{
			id: 'present-continuous-92',
			form: 'negative',
			prompt: 'Анна не бере трубку.',
			answer: "Anna isn't answering her phone.",
			accept: ["Anna isn't answering {her|the} phone."],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				answering: ['answer', 'answers', 'answered'],
			},
		},
		{
			id: 'present-continuous-93',
			form: 'negative',
			prompt: 'Цього тижня я не ходжу в спортзал.',
			answer: "This week I'm not going to the gym.",
			accept: ["I'm not going to the gym this week."],
			traps: {
				going: ['go', 'goes', 'went'],
			},
		},
		{
			id: 'present-continuous-94',
			form: 'negative',
			prompt: 'Вони не сваряться, вони просто розмовляють.',
			answer: "They aren't arguing, they're just talking.",
			accept: ["{They aren't|They're not} arguing, they're just talking."],
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
				arguing: ['argueing', 'argue', 'argues'],
			},
		},
		{
			id: 'present-continuous-95',
			form: 'negative',
			prompt: 'Подивись, той пес не рухається.',
			answer: "Look, that dog isn't moving.",
			accept: ["Look, that dog's not moving."],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				moving: ['moveing', 'move', 'moves'],
			},
		},
		{
			id: 'present-continuous-96',
			form: 'negative',
			prompt: 'Цього місяця ми не користуємося машиною.',
			answer: "This month we aren't using the car.",
			accept: [
				"This month {we aren't|we're not} using {the|our} car.",
				"{We aren't|We're not} using {the|our} car this month.",
			],
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
				using: ['useing', 'use', 'uses'],
			},
		},
		{
			id: 'present-continuous-97',
			form: 'negative',
			prompt: 'Мої батьки цього тижня не працюють.',
			answer: "My parents aren't working this week.",
			accept: ["This week my parents aren't working."],
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
				working: ['work', 'works', 'worked'],
			},
		},
		{
			id: 'present-continuous-98',
			form: 'negative',
			prompt: 'Погода не покращується.',
			answer: "The weather isn't getting better.",
			accept: ["The weather isn't improving."],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				getting: ['geting', 'get', 'gets'],
			},
		},
		{
			id: 'present-continuous-99',
			form: 'negative',
			prompt: 'Я не намагаюся тебе образити.',
			answer: "I'm not trying to offend you.",
			accept: ["I'm not trying to {offend|hurt} you."],
			traps: {
				trying: ['try', 'tries', 'trieing'],
			},
		},
		{
			id: 'present-continuous-100',
			form: 'negative',
			prompt: "Мій син цього тижня не грає в комп'ютерні ігри.",
			answer: "My son isn't playing computer games this week.",
			accept: [
				"My son isn't playing {computer|video} games this week.",
				"This week my son isn't playing {computer|video} games.",
			],
			traps: {
				"isn't": ["aren't", "doesn't", "don't"],
				playing: ['play', 'plays', 'played'],
			},
		},
	],
})
