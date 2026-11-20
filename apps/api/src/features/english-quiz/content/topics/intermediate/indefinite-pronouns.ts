import { defineTopic } from '../../define-topic'

export const indefinitePronouns = defineTopic({
	id: 'indefinite-pronouns',
	level: 'intermediate',
	title: 'Indefinite pronouns',
	subtitle: 'Неозначені займенники',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				'some- (somebody/someone, something, somewhere) — «хтось», «щось», «десь/кудись» у ствердженнях. every- (everybody/everyone, everything, everywhere) — «усі», «усе», «скрізь». Після every- і some- дієслово в однині: Everybody knows. any- у ствердженні означає «будь-хто», «будь-що», «будь-де». -body і -one однакові: somebody = someone.',
			examples: [
				{
					text: 'Someone is singing outside.',
					translation: 'Хтось співає надворі.',
				},
				{
					text: 'Everybody loves holidays.',
					translation: 'Усі люблять свята.',
				},
				{
					text: 'You can park anywhere.',
					translation: 'Ти можеш паркуватися будь-де.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'У питаннях зазвичай any-: Is there anything…? Did anybody…? У пропозиціях і проханнях, або коли чекаємо «так», — some-: Would you like something…? Can somebody help me?',
			examples: [
				{
					text: 'Did anyone see my bag?',
					translation: 'Хтось бачив мою сумку?',
				},
				{
					text: 'Would you like something to read?',
					translation: 'Хочете щось почитати?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"В англійській лише одне заперечення. «Я нічого не маю» = not + any- (I don't have anything) або no- зі стверджувальним дієсловом (I have nothing). Ніколи не кажіть don't … nothing. На початку речення — тільки no-: Nobody knows. No one пишеться двома словами.",
			examples: [
				{
					text: "We didn't buy anything.",
					translation: 'Ми нічого не купили.',
				},
				{
					text: 'We bought nothing.',
					translation: 'Ми нічого не купили.',
				},
				{
					text: 'No one called back.',
					translation: 'Ніхто не передзвонив.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'indefinite-pronouns-1',
			form: 'affirmative',
			prompt: 'Хтось дзвонив.',
			answer: 'Somebody called.',
			accept: ['Someone called.'],
			traps: {
				Somebody: ['Anybody', 'Nobody', 'Everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-2',
			form: 'negative',
			prompt: 'Я нічого не бачу.',
			answer: "I can't see anything.",
			accept: ['I {can see|see} nothing.', "I don't see anything."],
			traps: {
				anything: ['something', 'nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-3',
			form: 'affirmative',
			prompt: 'Хтось стукає у двері.',
			answer: 'Somebody is knocking at the door.',
			accept: ['{Somebody|Someone} is knocking {at|on} the door.'],
			traps: {
				Somebody: ['Anybody', 'Everybody'],
				is: ['are', 'am'],
			},
		},
		{
			id: 'indefinite-pronouns-4',
			form: 'affirmative',
			prompt: "Я хочу з'їсти щось солодке.",
			answer: 'I want to eat something sweet.',
			traps: {
				something: ['anything', 'nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-5',
			form: 'affirmative',
			prompt: 'Усі знають цю пісню.',
			answer: 'Everybody knows this song.',
			accept: ['{Everybody|Everyone} knows this song.'],
			traps: {
				Everybody: ['Anybody', 'Somebody'],
				knows: ['know', 'knowing'],
			},
		},
		{
			id: 'indefinite-pronouns-6',
			form: 'affirmative',
			prompt: 'Моя сестра живе десь біля Львова.',
			answer: 'My sister lives somewhere near Lviv.',
			traps: {
				somewhere: ['anywhere', 'nowhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-7',
			form: 'affirmative',
			prompt: 'Усе в цьому ресторані дуже дороге.',
			answer: 'Everything in this restaurant is very expensive.',
			traps: {
				Everything: ['Anything', 'Something'],
				is: ['are', 'be'],
			},
		},
		{
			id: 'indefinite-pronouns-8',
			form: 'affirmative',
			prompt: 'Будь-хто може навчитися плавати.',
			answer: 'Anybody can learn to swim.',
			accept: ['{Anybody|Anyone} can learn to swim.'],
			traps: {
				Anybody: ['Somebody', 'Nobody'],
			},
		},
		{
			id: 'indefinite-pronouns-9',
			form: 'affirmative',
			prompt: 'Я щось чую.',
			answer: 'I can hear something.',
			accept: ['I {can hear|hear} something.'],
			traps: {
				something: ['anything', 'nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-10',
			form: 'affirmative',
			prompt: 'Мені потрібно тобі щось сказати.',
			answer: 'I need to tell you something.',
			accept: ['I {need|have} to tell you something.'],
			traps: {
				something: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-11',
			form: 'affirmative',
			prompt: 'Мій собака ходить за мною всюди.',
			answer: 'My dog follows me everywhere.',
			accept: ['My dog {follows me everywhere|goes everywhere with me}.'],
			traps: {
				everywhere: ['anywhere', 'somewhere', 'nowhere'],
			},
		},
		{
			id: 'indefinite-pronouns-12',
			form: 'affirmative',
			prompt: 'Ходімо кудись сьогодні ввечері.',
			answer: "Let's go somewhere tonight.",
			accept: ["Let's go somewhere {tonight|this evening}."],
			traps: {
				somewhere: ['anywhere', 'nowhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-13',
			form: 'affirmative',
			prompt: "Усі в моїй родині п'ють каву.",
			answer: 'Everyone in my family drinks coffee.',
			accept: ['{Everybody|Everyone} in my family drinks coffee.'],
			traps: {
				Everyone: ['Anyone', 'Someone'],
				drinks: ['drink', 'drinking'],
			},
		},
		{
			id: 'indefinite-pronouns-14',
			form: 'affirmative',
			prompt: 'Хтось залишив тобі повідомлення.',
			answer: 'Somebody left you a message.',
			accept: [
				'{Somebody|Someone} {left|has left} {you a message|a message for you}.',
			],
			traps: {
				Somebody: ['Anybody', 'Nobody', 'Everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-15',
			form: 'affirmative',
			prompt: 'Він завжди каже щось смішне.',
			answer: 'He always says something funny.',
			traps: {
				something: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-16',
			form: 'affirmative',
			prompt: 'Усі чекають на тебе.',
			answer: 'Everybody is waiting for you.',
			accept: ['{Everybody|Everyone} is waiting for you.'],
			traps: {
				Everybody: ['Anybody', 'Somebody'],
				is: ['are', 'am'],
			},
		},
		{
			id: 'indefinite-pronouns-17',
			form: 'affirmative',
			prompt: 'Хтось іде за нами.',
			answer: 'Someone is following us.',
			accept: ['{Somebody|Someone} is following us.'],
			traps: {
				Someone: ['Anyone', 'Everyone'],
				is: ['are'],
			},
		},
		{
			id: 'indefinite-pronouns-18',
			form: 'affirmative',
			prompt: 'Тут усе нове.',
			answer: 'Everything is new here.',
			accept: ['Everything {is new here|here is new}.'],
			traps: {
				Everything: ['Anything', 'Something'],
				is: ['are'],
			},
		},
		{
			id: 'indefinite-pronouns-19',
			form: 'affirmative',
			prompt: 'Будь-що може статися.',
			answer: 'Anything can happen.',
			traps: {
				Anything: ['Nothing', 'Something'],
			},
		},
		{
			id: 'indefinite-pronouns-20',
			form: 'affirmative',
			prompt: 'Я дам тобі щось поїсти.',
			answer: "I'll give you something to eat.",
			traps: {
				something: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-21',
			form: 'affirmative',
			prompt: 'Ти можеш сісти будь-де.',
			answer: 'You can sit anywhere.',
			accept: ['You can sit {down|} anywhere.'],
			traps: {
				anywhere: ['somewhere', 'nowhere'],
			},
		},
		{
			id: 'indefinite-pronouns-22',
			form: 'affirmative',
			prompt: 'Вона знає всіх у нашому офісі.',
			answer: 'She knows everybody in our office.',
			accept: ['She knows {everybody|everyone} in our office.'],
			traps: {
				everybody: ['anybody', 'somebody', 'nobody'],
			},
		},
		{
			id: 'indefinite-pronouns-23',
			form: 'affirmative',
			prompt: 'Я покажу тобі щось цікаве.',
			answer: "I'll show you something interesting.",
			traps: {
				something: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-24',
			form: 'affirmative',
			prompt: 'Усі хочуть бути щасливими.',
			answer: 'Everybody wants to be happy.',
			accept: ['{Everybody|Everyone} wants to be happy.'],
			traps: {
				Everybody: ['Anybody', 'Somebody'],
				wants: ['want', 'wanting'],
			},
		},
		{
			id: 'indefinite-pronouns-25',
			form: 'affirmative',
			prompt: 'Я зустрів когось цікавого на вечірці.',
			answer: 'I met somebody interesting at the party.',
			accept: ['I met {somebody|someone} interesting at {the|a} party.'],
			traps: {
				somebody: ['anybody', 'nobody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-26',
			form: 'affirmative',
			prompt: 'Мій брат може полагодити будь-що.',
			answer: 'My brother can fix anything.',
			accept: ['My brother can {fix|repair} anything.'],
			traps: {
				anything: ['something', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-27',
			form: 'affirmative',
			prompt: 'У кімнаті хтось є.',
			answer: 'There is somebody in the room.',
			accept: [
				"{There is|There's} {somebody|someone} in the room.",
				'{Somebody|Someone} is in the room.',
			],
			traps: {
				somebody: ['anybody', 'nobody'],
			},
		},
		{
			id: 'indefinite-pronouns-28',
			form: 'affirmative',
			prompt: 'Я хотів би щось випити.',
			answer: "I'd like something to drink.",
			accept: ["{I'd|I would} like something to drink."],
			traps: {
				something: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-29',
			form: 'affirmative',
			prompt: 'Хтось украв мій велосипед!',
			answer: 'Somebody stole my bike!',
			accept: ['{Somebody|Someone} {stole|has stolen} my {bike|bicycle}.'],
			traps: {
				Somebody: ['Anybody', 'Everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-30',
			form: 'affirmative',
			prompt: 'Усі говорять про цю книжку.',
			answer: 'Everybody is talking about this book.',
			accept: ['{Everybody|Everyone} {is talking|talks} about this book.'],
			traps: {
				Everybody: ['Anybody', 'Somebody'],
				is: ['are'],
			},
		},
		{
			id: 'indefinite-pronouns-31',
			form: 'affirmative',
			prompt: 'Він сказав щось важливе.',
			answer: 'He said something important.',
			traps: {
				something: ['anything', 'nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-32',
			form: 'affirmative',
			prompt: 'Будь-хто може відвідати цей музей.',
			answer: 'Anyone can visit this museum.',
			accept: ['{Anybody|Anyone} can visit this museum.'],
			traps: {
				Anyone: ['Someone', 'Nobody'],
			},
		},
		{
			id: 'indefinite-pronouns-33',
			form: 'affirmative',
			prompt: 'Давай зробимо щось разом.',
			answer: "Let's do something together.",
			traps: {
				something: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-34',
			form: 'affirmative',
			prompt: 'Тобі хтось телефонує.',
			answer: 'Somebody is calling you.',
			accept: ['{Somebody|Someone} is {calling|phoning} you.'],
			traps: {
				Somebody: ['Anybody', 'Everybody'],
				is: ['are'],
			},
		},
		{
			id: 'indefinite-pronouns-35',
			form: 'affirmative',
			prompt: 'Сьогодні все пішло не так.',
			answer: 'Today everything went wrong.',
			accept: ['{Today everything went wrong|Everything went wrong today}.'],
			traps: {
				everything: ['anything', 'something'],
			},
		},
		{
			id: 'indefinite-pronouns-36',
			form: 'affirmative',
			prompt: 'Усі в автобусі дивилися на мене.',
			answer: 'Everybody on the bus was looking at me.',
			accept: ['{Everybody|Everyone} on the bus {was looking|looked} at me.'],
			traps: {
				Everybody: ['Anybody', 'Somebody'],
				was: ['were'],
			},
		},
		{
			id: 'indefinite-pronouns-37',
			form: 'affirmative',
			prompt: 'Я десь бачив цього чоловіка.',
			answer: "I've seen this man somewhere.",
			accept: ["I've seen {this|that} man somewhere."],
			traps: {
				somewhere: ['anywhere', 'nowhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-38',
			form: 'affirmative',
			prompt: 'Мій кіт може спати де завгодно.',
			answer: 'My cat can sleep anywhere.',
			traps: {
				anywhere: ['somewhere', 'nowhere'],
			},
		},
		{
			id: 'indefinite-pronouns-39',
			form: 'affirmative',
			prompt: 'Я їм усе, крім риби.',
			answer: 'I eat everything except fish.',
			accept: ['I eat everything {except|but} fish.'],
			traps: {
				everything: ['anything', 'something', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-40',
			form: 'affirmative',
			prompt: 'Усім подобається наша нова вчителька.',
			answer: 'Everybody likes our new teacher.',
			accept: ['{Everybody|Everyone} likes our new teacher.'],
			traps: {
				Everybody: ['Anybody', 'Somebody'],
				likes: ['like', 'liking'],
			},
		},
		{
			id: 'indefinite-pronouns-41',
			form: 'affirmative',
			prompt: 'Я куплю тобі щось у Римі.',
			answer: "I'll buy you something in Rome.",
			accept: ["I'll buy {you something|something for you} in Rome."],
			traps: {
				something: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-42',
			form: 'affirmative',
			prompt: 'Він хоче жити десь біля моря.',
			answer: 'He wants to live somewhere near the sea.',
			traps: {
				somewhere: ['anywhere', 'nowhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-43',
			form: 'affirmative',
			prompt: 'Хтось має знати відповідь.',
			answer: 'Somebody must know the answer.',
			accept: ['{Somebody|Someone} {must|should} know the answer.'],
			traps: {
				Somebody: ['Anybody', 'Nobody'],
				know: ['knows'],
			},
		},
		{
			id: 'indefinite-pronouns-44',
			form: 'affirmative',
			prompt: 'Я хочу подарувати їй щось особливе.',
			answer: 'I want to give her something special.',
			traps: {
				something: ['anything', 'nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-45',
			form: 'affirmative',
			prompt: 'Хтось співає в сусідній кімнаті.',
			answer: 'Someone is singing in the next room.',
			accept: ['{Somebody|Someone} is singing in the next room.'],
			traps: {
				Someone: ['Anyone', 'Everyone'],
				is: ['are'],
			},
		},
		{
			id: 'indefinite-pronouns-46',
			form: 'affirmative',
			prompt: 'Ти можеш запитати будь-кого.',
			answer: 'You can ask anybody.',
			accept: ['You can ask {anybody|anyone}.'],
			traps: {
				anybody: ['somebody', 'nobody'],
			},
		},
		{
			id: 'indefinite-pronouns-47',
			form: 'question',
			prompt: 'Ви б хотіли чогось випити?',
			answer: 'Would you like something to drink?',
			accept: ['Would you like {something|anything} to drink?'],
			traps: {
				something: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-48',
			form: 'question',
			prompt: 'Ти щось чув про це?',
			answer: 'Have you heard anything about it?',
			accept: [
				'{Have you heard|Did you hear} {anything|something} about {it|this|that}?',
			],
			traps: {
				anything: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-49',
			form: 'question',
			prompt: 'Хтось бачив мої окуляри?',
			answer: 'Has anybody seen my glasses?',
			accept: [
				'Has {anybody|anyone|somebody|someone} seen my glasses?',
				'Did {anybody|anyone|somebody|someone} see my glasses?',
			],
			traps: {
				anybody: ['nobody', 'everybody'],
				seen: ['saw', 'see'],
			},
		},
		{
			id: 'indefinite-pronouns-50',
			form: 'question',
			prompt: 'Тут хтось є?',
			answer: 'Is there anybody here?',
			accept: ['Is {there|} {anybody|anyone|somebody|someone} here?'],
			traps: {
				anybody: ['nobody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-51',
			form: 'question',
			prompt: 'Ти знаєш тут когось?',
			answer: 'Do you know anybody here?',
			accept: ['Do you know {anybody|anyone|somebody|someone} here?'],
			traps: {
				anybody: ['nobody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-52',
			form: 'question',
			prompt: 'Усе гаразд?',
			answer: 'Is everything OK?',
			accept: ['Is everything {OK|okay|all right|fine}?'],
			traps: {
				Is: ['Are', 'Does'],
				everything: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-53',
			form: 'question',
			prompt: 'Ти кудись ідеш сьогодні ввечері?',
			answer: 'Are you going anywhere tonight?',
			accept: ['Are you going {anywhere|somewhere} {tonight|this evening}?'],
			traps: {
				anywhere: ['nowhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-54',
			form: 'question',
			prompt: 'Чи є щось у холодильнику?',
			answer: 'Is there anything in the fridge?',
			accept: ['Is there {anything|something} in the fridge?'],
			traps: {
				anything: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-55',
			form: 'question',
			prompt: 'Мені хтось телефонував?',
			answer: 'Did anybody call me?',
			accept: [
				'Did {anybody|anyone|somebody|someone} {call|phone} me?',
				'Has {anybody|anyone|somebody|someone} {called|phoned} me?',
			],
			traps: {
				anybody: ['nobody', 'everybody'],
				call: ['called', 'calls'],
			},
		},
		{
			id: 'indefinite-pronouns-56',
			form: 'question',
			prompt: 'Можна я тебе дещо запитаю?',
			answer: 'Can I ask you something?',
			accept: ['{Can|May|Could} I ask you something?'],
			traps: {
				something: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-57',
			form: 'question',
			prompt: 'Ти робив щось цікаве минулих вихідних?',
			answer: 'Did you do anything interesting last weekend?',
			accept: ['Did you do {anything|something} interesting last weekend?'],
			traps: {
				anything: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-58',
			form: 'question',
			prompt: 'Ти щось знаєш про нього?',
			answer: 'Do you know anything about him?',
			accept: ['Do you know {anything|something} about him?'],
			traps: {
				anything: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-59',
			form: 'question',
			prompt: 'Де всі?',
			answer: 'Where is everybody?',
			accept: ["{Where is|Where's} {everybody|everyone}?"],
			traps: {
				is: ['are'],
				everybody: ['anybody', 'somebody'],
			},
		},
		{
			id: 'indefinite-pronouns-60',
			form: 'question',
			prompt: 'Хтось може мені допомогти?',
			answer: 'Can somebody help me?',
			accept: ['{Can|Could} {somebody|someone|anybody|anyone} help me?'],
			traps: {
				somebody: ['nobody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-61',
			form: 'question',
			prompt: 'Тобі щось потрібно?',
			answer: 'Do you need anything?',
			accept: ['Do you need {anything|something}?'],
			traps: {
				anything: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-62',
			form: 'question',
			prompt: 'Хтось знає відповідь?',
			answer: 'Does anybody know the answer?',
			accept: ['Does {anybody|anyone|somebody|someone} know the answer?'],
			traps: {
				anybody: ['nobody', 'everybody'],
				know: ['knows', 'knowing'],
			},
		},
		{
			id: 'indefinite-pronouns-63',
			form: 'question',
			prompt: 'Чому всі сміються?',
			answer: 'Why is everybody laughing?',
			accept: ['Why is {everybody|everyone} laughing?'],
			traps: {
				is: ['are', 'do'],
				everybody: ['anybody', 'nobody'],
			},
		},
		{
			id: 'indefinite-pronouns-64',
			form: 'question',
			prompt: 'Ти щось бачиш?',
			answer: 'Can you see anything?',
			accept: ['{Can you see|Do you see} {anything|something}?'],
			traps: {
				anything: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-65',
			form: 'question',
			prompt: 'Усі знають про вечірку?',
			answer: 'Does everybody know about the party?',
			accept: ['Does {everybody|everyone} know about the party?'],
			traps: {
				Does: ['Do', 'Is'],
				know: ['knows'],
			},
		},
		{
			id: 'indefinite-pronouns-66',
			form: 'question',
			prompt: 'Ми можемо піти кудись в інше місце?',
			answer: 'Can we go somewhere else?',
			accept: ['{Can|Could} we go somewhere else?'],
			traps: {
				somewhere: ['nowhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-67',
			form: 'question',
			prompt: 'Ти десь бачив мій телефон?',
			answer: 'Have you seen my phone anywhere?',
			accept: ['{Have you seen|Did you see} my phone {anywhere|somewhere}?'],
			traps: {
				anywhere: ['nowhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-68',
			form: 'question',
			prompt: 'Хтось удома?',
			answer: 'Is anybody home?',
			accept: ['Is {anybody|anyone|somebody|someone} {at|} home?'],
			traps: {
				Is: ['Are', 'Does'],
				anybody: ['nobody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-69',
			form: 'question',
			prompt: 'Хтось бачив, що сталося?',
			answer: 'Did anybody see what happened?',
			accept: ['Did {anybody|anyone|somebody|someone} see what happened?'],
			traps: {
				anybody: ['nobody', 'everybody'],
				see: ['saw', 'seen'],
			},
		},
		{
			id: 'indefinite-pronouns-70',
			form: 'question',
			prompt: 'Ти хочеш чогось поїсти?',
			answer: 'Do you want something to eat?',
			accept: ['{Do you want|Would you like} {something|anything} to eat?'],
			traps: {
				something: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-71',
			form: 'question',
			prompt: 'Щось сталося?',
			answer: 'Has something happened?',
			accept: [
				'Has {something|anything} happened?',
				'Did {something|anything} happen?',
			],
			traps: {
				something: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-72',
			form: 'question',
			prompt: 'Ти когось чекаєш?',
			answer: 'Are you waiting for somebody?',
			accept: ['Are you waiting for {somebody|someone|anybody|anyone}?'],
			traps: {
				somebody: ['nobody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-73',
			form: 'question',
			prompt: 'Чому мені ніхто не сказав?',
			answer: 'Why did nobody tell me?',
			accept: [
				"Why {did nobody|did no one|didn't anybody|didn't anyone} tell me?",
			],
			traps: {
				nobody: ['anybody', 'somebody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-74',
			form: 'question',
			prompt: 'Ти щось загубив?',
			answer: 'Have you lost something?',
			accept: [
				'Have you lost {something|anything}?',
				'Did you lose {something|anything}?',
			],
			traps: {
				something: ['nothing', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-75',
			form: 'question',
			prompt: 'Усе готово до вечірки?',
			answer: 'Is everything ready for the party?',
			traps: {
				Is: ['Are', 'Does'],
				everything: ['anything', 'nothing'],
			},
		},
		{
			id: 'indefinite-pronouns-76',
			form: 'question',
			prompt: 'Куди всі пішли?',
			answer: 'Where did everybody go?',
			accept: [
				'Where did {everybody|everyone} go?',
				'Where has {everybody|everyone} gone?',
			],
			traps: {
				everybody: ['anybody', 'nobody'],
			},
		},
		{
			id: 'indefinite-pronouns-77',
			form: 'negative',
			prompt: 'Ніхто не знає відповіді.',
			answer: 'Nobody knows the answer.',
			accept: ['{Nobody|No one} knows the answer.'],
			traps: {
				Nobody: ['Anybody', 'Everybody'],
				knows: ['know', 'knowing'],
			},
		},
		{
			id: 'indefinite-pronouns-78',
			form: 'negative',
			prompt: 'Я нікого тут не знаю.',
			answer: "I don't know anybody here.",
			accept: [
				"I don't know {anybody|anyone} here.",
				'I know {nobody|no one} here.',
			],
			traps: {
				anybody: ['nobody', 'somebody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-79',
			form: 'negative',
			prompt: 'Нічого не сталося.',
			answer: 'Nothing happened.',
			accept: ['Nothing {happened|has happened}.'],
			traps: {
				Nothing: ['Anything', 'Something'],
			},
		},
		{
			id: 'indefinite-pronouns-80',
			form: 'negative',
			prompt: 'Ніхто мені не допоміг.',
			answer: 'No one helped me.',
			accept: ['{Nobody|No one} {helped|has helped} me.'],
			traps: {
				No: ['Any', 'Some'],
				helped: ['help', 'helps'],
			},
		},
		{
			id: 'indefinite-pronouns-81',
			form: 'negative',
			prompt: 'Я нікуди не йду сьогодні ввечері.',
			answer: "I'm not going anywhere tonight.",
			accept: [
				"I'm not going anywhere {tonight|this evening}.",
				"I'm going nowhere {tonight|this evening}.",
			],
			traps: {
				anywhere: ['nowhere', 'somewhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-82',
			form: 'negative',
			prompt: 'У холодильнику нічого немає.',
			answer: 'There is nothing in the fridge.',
			accept: [
				"{There is|There's} nothing in the fridge.",
				"There isn't anything in the fridge.",
			],
			traps: {
				nothing: ['anything', 'something'],
			},
		},
		{
			id: 'indefinite-pronouns-83',
			form: 'negative',
			prompt: 'Ніхто не відповів на моє запитання.',
			answer: 'Nobody answered my question.',
			accept: ['{Nobody|No one} {answered|has answered} my question.'],
			traps: {
				Nobody: ['Anybody', 'Somebody'],
			},
		},
		{
			id: 'indefinite-pronouns-84',
			form: 'negative',
			prompt: 'Я нічого не їв сьогодні.',
			answer: "I haven't eaten anything today.",
			accept: [
				"I {haven't eaten|didn't eat} anything today.",
				"I've eaten nothing today.",
			],
			traps: {
				anything: ['nothing', 'something', 'everything'],
			},
		},
		{
			id: 'indefinite-pronouns-85',
			form: 'negative',
			prompt: 'Тут нікого немає.',
			answer: 'There is nobody here.',
			accept: [
				"{There is|There's} {nobody|no one} here.",
				"There isn't {anybody|anyone} here.",
				'{Nobody|No one} is here.',
			],
			traps: {
				nobody: ['somebody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-86',
			form: 'negative',
			prompt: 'Ніхто не любить понеділків.',
			answer: 'Nobody likes Mondays.',
			accept: ['{Nobody|No one} likes Mondays.'],
			traps: {
				Nobody: ['Anybody', 'Everybody'],
				likes: ['like', 'liking'],
			},
		},
		{
			id: 'indefinite-pronouns-87',
			form: 'negative',
			prompt: 'Мені нічого не потрібно.',
			answer: "I don't need anything.",
			accept: ["I don't need anything.", 'I need nothing.'],
			traps: {
				anything: ['nothing', 'something'],
			},
		},
		{
			id: 'indefinite-pronouns-88',
			form: 'negative',
			prompt: 'Я ніде не можу знайти свої ключі.',
			answer: "I can't find my keys anywhere.",
			traps: {
				anywhere: ['nowhere', 'somewhere', 'everywhere'],
			},
		},
		{
			id: 'indefinite-pronouns-89',
			form: 'negative',
			prompt: 'Вона нічого не сказала.',
			answer: "She didn't say anything.",
			accept: ["She didn't say anything.", 'She said nothing.'],
			traps: {
				anything: ['nothing', 'something'],
			},
		},
		{
			id: 'indefinite-pronouns-90',
			form: 'negative',
			prompt: 'Нікого не було вдома.',
			answer: 'Nobody was at home.',
			accept: [
				'{Nobody|No one} was {at|} home.',
				'There was {nobody|no one} {at|} home.',
				"There wasn't {anybody|anyone} {at|} home.",
			],
			traps: {
				Nobody: ['Anybody', 'Somebody'],
				was: ['were'],
			},
		},
		{
			id: 'indefinite-pronouns-91',
			form: 'negative',
			prompt: 'Мені нема куди піти.',
			answer: 'I have nowhere to go.',
			accept: [
				'I have nowhere to go.',
				"I don't have anywhere to go.",
				"I've got nowhere to go.",
				"I haven't got anywhere to go.",
			],
			traps: {
				nowhere: ['anywhere', 'somewhere'],
			},
		},
		{
			id: 'indefinite-pronouns-92',
			form: 'negative',
			prompt: 'Ніщо не може мене зупинити.',
			answer: 'Nothing can stop me.',
			traps: {
				Nothing: ['Anything', 'Something'],
			},
		},
		{
			id: 'indefinite-pronouns-93',
			form: 'negative',
			prompt: 'Не всі люблять спорт.',
			answer: 'Not everybody likes sport.',
			accept: ['Not {everybody|everyone} likes {sport|sports}.'],
			traps: {
				everybody: ['anybody', 'nobody'],
				likes: ['like', 'liking'],
			},
		},
		{
			id: 'indefinite-pronouns-94',
			form: 'negative',
			prompt: 'Він нікому не довіряє.',
			answer: "He doesn't trust anybody.",
			accept: [
				"He doesn't trust {anybody|anyone}.",
				'He trusts {nobody|no one}.',
			],
			traps: {
				anybody: ['nobody', 'somebody', 'everybody'],
			},
		},
		{
			id: 'indefinite-pronouns-95',
			form: 'negative',
			prompt: 'Я нічого не розумію.',
			answer: "I don't understand anything.",
			accept: ["I don't understand anything.", 'I understand nothing.'],
			traps: {
				anything: ['nothing', 'something'],
			},
		},
		{
			id: 'indefinite-pronouns-96',
			form: 'negative',
			prompt: 'Ніхто не прийшов на зустріч.',
			answer: 'Nobody came to the meeting.',
			accept: ['{Nobody|No one} {came|has come} to the meeting.'],
			traps: {
				Nobody: ['Anybody', 'Somebody'],
				came: ['come', 'comes'],
			},
		},
		{
			id: 'indefinite-pronouns-97',
			form: 'negative',
			prompt: 'Тут нічого не відбувається.',
			answer: 'Nothing is happening here.',
			accept: ['Nothing {is happening|happens} here.'],
			traps: {
				Nothing: ['Anything', 'Something'],
				is: ['are'],
			},
		},
		{
			id: 'indefinite-pronouns-98',
			form: 'negative',
			prompt: 'Ми нікуди не ходили вчора.',
			answer: "We didn't go anywhere yesterday.",
			accept: [
				"We didn't go anywhere yesterday.",
				'We went nowhere yesterday.',
			],
			traps: {
				anywhere: ['nowhere', 'somewhere'],
			},
		},
		{
			id: 'indefinite-pronouns-99',
			form: 'negative',
			prompt: 'Ніщо не триває вічно.',
			answer: 'Nothing lasts forever.',
			traps: {
				Nothing: ['Anything', 'Everything'],
				lasts: ['last', 'lasting'],
			},
		},
		{
			id: 'indefinite-pronouns-100',
			form: 'negative',
			prompt: 'Я нікому не скажу.',
			answer: "I won't tell anybody.",
			accept: ["I won't tell {anybody|anyone}.", "I'll tell {nobody|no one}."],
			traps: {
				anybody: ['nobody', 'somebody', 'everybody'],
			},
		},
	],
})
