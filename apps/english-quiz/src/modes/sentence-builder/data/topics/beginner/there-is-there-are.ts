import { defineTopic } from '../../define-topic'

export const thereIsThereAre = defineTopic({
	id: 'there-is-there-are',
	level: 'beginner',
	title: 'There is / There are',
	subtitle: 'Конструкція There is / There are',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				"There is (There's) + однина або незлічуване; There are + множина. Минулий час: there was / there were; майбутній: there will be (there'll be) для всіх. Місце й час зазвичай стоять у кінці речення.",
			examples: [
				{
					text: 'There is a bank next to the post office.',
					translation: 'Поруч із поштою є банк.',
				},
				{
					text: 'There were a lot of people at the market.',
					translation: 'На ринку було багато людей.',
				},
				{
					text: 'There will be a test on Friday.',
					translation: "У п'ятницю буде контрольна.",
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Is/Are/Was/Were ставимо перед there; у майбутньому — Will there be. У питаннях із множиною та незлічуваними — any. Кількість: How many + множина, How much + незлічуване.',
			examples: [
				{
					text: 'Were there any problems?',
					translation: 'Чи були якісь проблеми?',
				},
				{
					text: 'How many chairs are there in the hall?',
					translation: 'Скільки стільців у залі?',
				},
				{
					text: 'Will there be a bus in the morning?',
					translation: 'Чи буде вранці автобус?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"isn't / aren't / wasn't / weren't / won't be + any, або is / are / was / were / will be + no. Подвійного заперечення немає: «There aren't no…» — помилка.",
			examples: [
				{
					text: "There aren't any parks near here.",
					translation: 'Поблизу немає парків.',
				},
				{
					text: 'There was no milk in the shop.',
					translation: 'У магазині не було молока.',
				},
				{
					text: "There won't be any classes on Monday.",
					translation: 'У понеділок не буде занять.',
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				'Злічуване: many, a few. Незлічуване: much, a little. A lot of — з обома. Much у ствердженні звучить неприродно, кажемо a lot of.',
			examples: [
				{
					text: 'There are a few eggs, but there is only a little flour.',
					translation: 'Є кілька яєць, але борошна лише трохи.',
				},
				{
					text: "There isn't much juice, but there are a lot of oranges.",
					translation: 'Соку небагато, зате є багато апельсинів.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'there-is-there-are-1',
			form: 'affirmative',
			prompt: 'У кімнаті є стілець.',
			answer: 'There is a chair in the room.',
			accept: ["There's a chair in the room."],
			traps: {
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-2',
			form: 'question',
			prompt: 'Чи є тут магазини?',
			answer: 'Are there any shops here?',
			accept: ['Are there {any |}shops here?'],
			traps: {
				Are: ['Is', 'Am', 'Do'],
			},
		},
		{
			id: 'there-is-there-are-3',
			form: 'affirmative',
			prompt: 'Біля нашого будинку є нова пекарня.',
			answer: 'There is a new bakery near our house.',
			accept: ["There's a new bakery near our house."],
			traps: {
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-4',
			form: 'affirmative',
			prompt: 'У цьому районі є кілька хороших ресторанів.',
			answer: 'There are a few good restaurants in this area.',
			traps: {
				are: ['is', 'were'],
				few: ['little'],
			},
		},
		{
			id: 'there-is-there-are-5',
			form: 'affirmative',
			prompt: 'У Києві багато мостів.',
			answer: 'There are a lot of bridges in Kyiv.',
			accept: ['There are {a lot of|lots of|many} bridges in Kyiv.'],
			traps: {
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-6',
			form: 'affirmative',
			prompt: 'Сьогодні в музеї багато туристів.',
			answer: 'Today there are a lot of tourists in the museum.',
			accept: [
				'Today there are {a lot of|lots of|many} tourists in the museum.',
				'There are {a lot of|lots of|many} tourists in the museum today.',
			],
			traps: {
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-7',
			form: 'affirmative',
			prompt: 'У банці є трохи меду.',
			answer: 'There is a little honey in the jar.',
			accept: ["There{ is|'s} {a little|some} honey in the jar."],
			traps: {
				is: ['are', 'was'],
				little: ['few'],
			},
		},
		{
			id: 'there-is-there-are-8',
			form: 'affirmative',
			prompt: 'У моєму есе кілька помилок.',
			answer: 'There are a few mistakes in my essay.',
			traps: {
				are: ['is', 'were'],
				few: ['little'],
			},
		},
		{
			id: 'there-is-there-are-9',
			form: 'affirmative',
			prompt: 'У супі забагато солі.',
			answer: 'There is too much salt in the soup.',
			accept: ["There's too much salt in the soup."],
			traps: {
				is: ['are', 'was'],
				much: ['many'],
			},
		},
		{
			id: 'there-is-there-are-10',
			form: 'affirmative',
			prompt: 'Біля вокзалу є недорогий готель.',
			answer: 'There is a cheap hotel near the station.',
			accept: ["There's a cheap hotel near the station."],
			traps: {
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-11',
			form: 'affirmative',
			prompt: 'У нашому офісі є кавоварка.',
			answer: 'There is a coffee machine in our office.',
			accept: ["There's a coffee machine in our office."],
			traps: {
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-12',
			form: 'affirmative',
			prompt: 'У цьому спортивному центрі є басейн.',
			answer: 'There is a swimming pool in this sports centre.',
			accept: ["There{ is|'s} a {swimming |}pool {in|at} this sports centre."],
			traps: {
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-13',
			form: 'affirmative',
			prompt: 'У вересні тридцять днів.',
			answer: 'There are thirty days in September.',
			traps: {
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-14',
			form: 'affirmative',
			prompt: 'На цьому острові є маленьке село.',
			answer: 'There is a small village on this island.',
			accept: ["There's a small village on this island."],
			traps: {
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-15',
			form: 'affirmative',
			prompt: 'У цьому фільмі багато смішних сцен.',
			answer: 'There are a lot of funny scenes in this film.',
			accept: ['There are {a lot of|lots of|many} funny scenes in this film.'],
			traps: {
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-16',
			form: 'affirmative',
			prompt: 'За рогом є хороший супермаркет.',
			answer: 'There is a good supermarket around the corner.',
			accept: ["There's a good supermarket around the corner."],
			traps: {
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-17',
			form: 'affirmative',
			prompt: 'В аеропорту завжди багато людей.',
			answer: 'There are always a lot of people at the airport.',
			accept: [
				'There are always {a lot of|lots of|many} people at the airport.',
			],
			traps: {
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-18',
			form: 'affirmative',
			prompt: 'У Львові багато старих церков.',
			answer: 'There are a lot of old churches in Lviv.',
			accept: ['There are {a lot of|lots of|many} old churches in Lviv.'],
			traps: {
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-19',
			form: 'affirmative',
			prompt: 'У цій книжці сто сторінок.',
			answer: 'There are a hundred pages in this book.',
			accept: ['There are {a|one} hundred pages in this book.'],
			traps: {
				are: ['is', 'were'],
				pages: ['page'],
			},
		},
		{
			id: 'there-is-there-are-20',
			form: 'affirmative',
			prompt: 'У моєму телефоні багато ігор.',
			answer: 'There are a lot of games on my phone.',
			accept: ['There are {a lot of|lots of|many} games on my phone.'],
			traps: {
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-21',
			form: 'affirmative',
			prompt: 'Учора на виставці було багато людей.',
			answer: 'Yesterday there were a lot of people at the exhibition.',
			accept: [
				'Yesterday there were {a lot of|lots of|many} people at the exhibition.',
				'There were {a lot of|lots of|many} people at the exhibition yesterday.',
			],
			traps: {
				were: ['was', 'are'],
			},
		},
		{
			id: 'there-is-there-are-22',
			form: 'affirmative',
			prompt: 'Минулої зими було багато снігу.',
			answer: 'Last winter there was a lot of snow.',
			accept: [
				'Last winter there was {a lot of|lots of} snow.',
				'There was {a lot of|lots of} snow last winter.',
			],
			traps: {
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-23',
			form: 'affirmative',
			prompt: 'У кімнаті був старий диван.',
			answer: 'There was an old sofa in the room.',
			traps: {
				was: ['were', 'is'],
				an: ['a'],
			},
		},
		{
			id: 'there-is-there-are-24',
			form: 'affirmative',
			prompt: 'На вечірці була смачна їжа.',
			answer: 'There was delicious food at the party.',
			accept: ['There was {some |}delicious food at the party.'],
			traps: {
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-25',
			form: 'affirmative',
			prompt: 'На столі була записка.',
			answer: 'There was a note on the table.',
			traps: {
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-26',
			form: 'affirmative',
			prompt: 'У конверті була фотографія.',
			answer: 'There was a photo in the envelope.',
			traps: {
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-27',
			form: 'affirmative',
			prompt: 'На стіні було кілька картин.',
			answer: 'There were a few pictures on the wall.',
			traps: {
				were: ['was', 'are'],
				few: ['little'],
			},
		},
		{
			id: 'there-is-there-are-28',
			form: 'affirmative',
			prompt: 'Минулої ночі була гроза.',
			answer: 'Last night there was a storm.',
			accept: ['There was a storm last night.'],
			traps: {
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-29',
			form: 'affirmative',
			prompt: 'На дорозі був великий затор.',
			answer: 'There was a big traffic jam on the road.',
			traps: {
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-30',
			form: 'affirmative',
			prompt: 'На зустрічі було десять людей.',
			answer: 'There were ten people at the meeting.',
			traps: {
				were: ['was', 'are'],
			},
		},
		{
			id: 'there-is-there-are-31',
			form: 'affirmative',
			prompt: 'У нашому старому будинку був камін.',
			answer: 'There was a fireplace in our old house.',
			traps: {
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-32',
			form: 'affirmative',
			prompt: 'В автобусі було двадцять пасажирів.',
			answer: 'There were twenty passengers on the bus.',
			traps: {
				were: ['was', 'are'],
			},
		},
		{
			id: 'there-is-there-are-33',
			form: 'affirmative',
			prompt: 'У саду було кілька яблунь.',
			answer: 'There were a few apple trees in the garden.',
			traps: {
				were: ['was', 'are'],
				few: ['little'],
			},
		},
		{
			id: 'there-is-there-are-34',
			form: 'affirmative',
			prompt: 'На фестивалі було багато дітей.',
			answer: 'There were a lot of children at the festival.',
			accept: ['There were {a lot of|lots of|many} children at the festival.'],
			traps: {
				were: ['was', 'are'],
			},
		},
		{
			id: 'there-is-there-are-35',
			form: 'affirmative',
			prompt: 'На пошті була довга черга.',
			answer: 'There was a long queue at the post office.',
			traps: {
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-36',
			form: 'affirmative',
			prompt: 'Завтра в парку буде концерт.',
			answer: 'Tomorrow there will be a concert in the park.',
			accept: [
				"Tomorrow there{ will|'ll} be a concert in the park.",
				"There{ will|'ll} be a concert in the park tomorrow.",
			],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-37',
			form: 'affirmative',
			prompt: 'У суботу буде вечірка.',
			answer: 'On Saturday there will be a party.',
			accept: [
				"On Saturday there{ will|'ll} be a party.",
				"There{ will|'ll} be a party on Saturday.",
			],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-38',
			form: 'affirmative',
			prompt: 'У нашій школі буде новий спортзал.',
			answer: 'There will be a new gym in our school.',
			accept: ["There{ will|'ll} be a new gym {in|at} our school."],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-39',
			form: 'affirmative',
			prompt: 'На весіллі буде багато їжі.',
			answer: 'There will be a lot of food at the wedding.',
			accept: ["There{ will|'ll} be {a lot of|lots of} food at the wedding."],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-40',
			form: 'affirmative',
			prompt: 'На концерті будуть тисячі людей.',
			answer: 'There will be thousands of people at the concert.',
			accept: ["There'll be thousands of people at the concert."],
			traps: {
				be: ['is', 'are'],
				thousands: ['thousand'],
			},
		},
		{
			id: 'there-is-there-are-41',
			form: 'affirmative',
			prompt: 'У новій квартирі буде три спальні.',
			answer: 'There will be three bedrooms in the new flat.',
			accept: ["There'll be three bedrooms in the new flat."],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-42',
			form: 'affirmative',
			prompt: 'Біля школи буде новий парк.',
			answer: 'There will be a new park near the school.',
			accept: ["There'll be a new park near the school."],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-43',
			form: 'affirmative',
			prompt: 'Наступного тижня буде іспит з англійської.',
			answer: 'Next week there will be an English exam.',
			accept: [
				"Next week there{ will|'ll} be an English exam.",
				"There{ will|'ll} be an English exam next week.",
			],
			traps: {
				be: ['is', 'are'],
				an: ['a'],
			},
		},
		{
			id: 'there-is-there-are-44',
			form: 'affirmative',
			prompt: 'Сьогодні ввечері по телевізору буде футбольний матч.',
			answer: 'This evening there will be a football match on TV.',
			accept: [
				"This evening there{ will|'ll} be a football match on TV.",
				"There{ will|'ll} be a football match on TV this evening.",
			],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-45',
			form: 'affirmative',
			prompt: 'На стадіоні буде багато людей.',
			answer: 'There will be a lot of people at the stadium.',
			accept: [
				"There{ will|'ll} be {a lot of|lots of|many} people at the stadium.",
			],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-46',
			form: 'affirmative',
			prompt: 'Наступного місяця в Києві буде фестиваль.',
			answer: 'Next month there will be a festival in Kyiv.',
			accept: [
				"Next month there{ will|'ll} be a festival in Kyiv.",
				"There{ will|'ll} be a festival in Kyiv next month.",
			],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-47',
			form: 'question',
			prompt: 'Скільки студентів у вашій групі?',
			answer: 'How many students are there in your group?',
			accept: ['How many students are {there |}in your group?'],
			traps: {
				many: ['much'],
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-48',
			form: 'question',
			prompt: 'Скільки цукру в цьому торті?',
			answer: 'How much sugar is there in this cake?',
			accept: ['How much sugar is {there |}in this cake?'],
			traps: {
				much: ['many'],
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-49',
			form: 'question',
			prompt: 'Чи є поруч із готелем аптека?',
			answer: 'Is there a pharmacy near the hotel?',
			traps: {
				Is: ['Are', 'Was'],
			},
		},
		{
			id: 'there-is-there-are-50',
			form: 'question',
			prompt: 'Чи є в цьому готелі ресторан?',
			answer: 'Is there a restaurant in this hotel?',
			accept: ['Is there a restaurant {in|at} this hotel?'],
			traps: {
				Is: ['Are', 'Was'],
			},
		},
		{
			id: 'there-is-there-are-51',
			form: 'question',
			prompt: 'Чи є в холодильнику овочі?',
			answer: 'Are there any vegetables in the fridge?',
			accept: ['Are there {any |}vegetables in the fridge?'],
			traps: {
				Are: ['Is', 'Were'],
			},
		},
		{
			id: 'there-is-there-are-52',
			form: 'question',
			prompt: 'Скільки рису в пакеті?',
			answer: 'How much rice is there in the bag?',
			accept: ['How much rice is {there |}in the bag?'],
			traps: {
				much: ['many'],
				is: ['are', 'was'],
			},
		},
		{
			id: 'there-is-there-are-53',
			form: 'question',
			prompt: 'Чи є в моєму перекладі помилки?',
			answer: 'Are there any mistakes in my translation?',
			accept: ['Are there {any |}mistakes in my translation?'],
			traps: {
				Are: ['Is', 'Were'],
			},
		},
		{
			id: 'there-is-there-are-54',
			form: 'question',
			prompt: 'Чи є в цьому районі школа?',
			answer: 'Is there a school in this area?',
			traps: {
				Is: ['Are', 'Was'],
			},
		},
		{
			id: 'there-is-there-are-55',
			form: 'question',
			prompt: 'Скільки поверхів у цьому будинку?',
			answer: 'How many floors are there in this building?',
			accept: ['How many floors are {there |}in this building?'],
			traps: {
				many: ['much'],
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-56',
			form: 'question',
			prompt: 'Чи багато туристів у Львові влітку?',
			answer: 'Are there many tourists in Lviv in summer?',
			accept: ['Are there {many|a lot of} tourists in Lviv in {the |}summer?'],
			traps: {
				Are: ['Is', 'Were'],
				many: ['much'],
			},
		},
		{
			id: 'there-is-there-are-57',
			form: 'question',
			prompt: 'Чи багато снігу в горах узимку?',
			answer: 'Is there much snow in the mountains in winter?',
			accept: [
				'Is there {much|a lot of} snow in the mountains in {the |}winter?',
			],
			traps: {
				Is: ['Are', 'Was'],
				much: ['many'],
			},
		},
		{
			id: 'there-is-there-are-58',
			form: 'question',
			prompt: 'Чи є в Одесі метро?',
			answer: 'Is there a metro in Odesa?',
			traps: {
				Is: ['Are', 'Was'],
			},
		},
		{
			id: 'there-is-there-are-59',
			form: 'question',
			prompt: 'Скільки днів у лютому?',
			answer: 'How many days are there in February?',
			accept: ['How many days are {there |}in February?'],
			traps: {
				many: ['much'],
				are: ['is', 'were'],
			},
		},
		{
			id: 'there-is-there-are-60',
			form: 'question',
			prompt: 'Чи був у номері телевізор?',
			answer: 'Was there a TV in the room?',
			traps: {
				Was: ['Were', 'Is'],
			},
		},
		{
			id: 'there-is-there-are-61',
			form: 'question',
			prompt: 'Скільки людей було на вечірці?',
			answer: 'How many people were there at the party?',
			accept: ['How many people were {there |}at the party?'],
			traps: {
				many: ['much'],
				were: ['was', 'are'],
			},
		},
		{
			id: 'there-is-there-are-62',
			form: 'question',
			prompt: 'Чи було багато людей на концерті?',
			answer: 'Were there many people at the concert?',
			accept: ['Were there {many|a lot of} people at the concert?'],
			traps: {
				Were: ['Was', 'Are'],
				many: ['much'],
			},
		},
		{
			id: 'there-is-there-are-63',
			form: 'question',
			prompt: 'Чи був для мене лист?',
			answer: 'Was there a letter for me?',
			traps: {
				Was: ['Were', 'Is'],
			},
		},
		{
			id: 'there-is-there-are-64',
			form: 'question',
			prompt: 'Скільки грошей було на рахунку?',
			answer: 'How much money was there in the account?',
			accept: ['How much money was {there |}in the account?'],
			traps: {
				much: ['many'],
				was: ['were', 'is'],
			},
		},
		{
			id: 'there-is-there-are-65',
			form: 'question',
			prompt: 'Чи були в групі нові студенти?',
			answer: 'Were there any new students in the group?',
			accept: ['Were there {any |}new students in the group?'],
			traps: {
				Were: ['Was', 'Are'],
			},
		},
		{
			id: 'there-is-there-are-66',
			form: 'question',
			prompt: "Чи було в супі м'ясо?",
			answer: 'Was there any meat in the soup?',
			accept: ['Was there {any |}meat in the soup?'],
			traps: {
				Was: ['Were', 'Is'],
			},
		},
		{
			id: 'there-is-there-are-67',
			form: 'question',
			prompt: 'Скільки дітей було в класі?',
			answer: 'How many children were there in the classroom?',
			accept: ['How many children were {there |}in the classroom?'],
			traps: {
				many: ['much'],
				were: ['was', 'are'],
			},
		},
		{
			id: 'there-is-there-are-68',
			form: 'question',
			prompt: 'Чи був у пекарні свіжий хліб?',
			answer: 'Was there any fresh bread in the bakery?',
			accept: ['Was there {any |}fresh bread {in|at} the bakery?'],
			traps: {
				Was: ['Were', 'Is'],
			},
		},
		{
			id: 'there-is-there-are-69',
			form: 'question',
			prompt: 'Чи буде на вечірці музика?',
			answer: 'Will there be any music at the party?',
			accept: ['Will there be {any |}music at the party?'],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-70',
			form: 'question',
			prompt: 'Чи буде завтра урок?',
			answer: 'Will there be a lesson tomorrow?',
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-71',
			form: 'question',
			prompt: 'Скільки гостей буде на весіллі?',
			answer: 'How many guests will there be at the wedding?',
			accept: ['How many guests will {there |}be at the wedding?'],
			traps: {
				many: ['much'],
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-72',
			form: 'question',
			prompt: 'Чи буде в новій школі їдальня?',
			answer: 'Will there be a canteen in the new school?',
			accept: ['Will there be a canteen {in|at} the new school?'],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-73',
			form: 'question',
			prompt: 'Чи буде о сьомій вільний столик?',
			answer: 'Will there be a free table at seven?',
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-74',
			form: 'question',
			prompt: 'Скільки кімнат буде в новому будинку?',
			answer: 'How many rooms will there be in the new house?',
			accept: ['How many rooms will {there |}be in the new house?'],
			traps: {
				many: ['much'],
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-75',
			form: 'question',
			prompt: 'Чи вистачить їжі на всіх?',
			answer: 'Will there be enough food for everyone?',
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-76',
			form: 'negative',
			prompt: 'У цьому селі немає магазинів.',
			answer: "There aren't any shops in this village.",
			accept: ['There are no shops in this village.'],
			traps: {
				"aren't": ["isn't", "weren't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-77',
			form: 'negative',
			prompt: 'У морозилці немає льоду.',
			answer: "There isn't any ice in the freezer.",
			accept: ["There{ is no|'s no|'s not any} ice in the freezer."],
			traps: {
				"isn't": ["aren't", "wasn't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-78',
			form: 'negative',
			prompt: 'На дорогах сьогодні небагато машин.',
			answer: "There aren't many cars on the roads today.",
			accept: [
				"There aren't {many|a lot of} cars on the roads today.",
				"Today there aren't {many|a lot of} cars on the roads.",
			],
			traps: {
				"aren't": ["isn't", "weren't"],
				many: ['much'],
			},
		},
		{
			id: 'there-is-there-are-79',
			form: 'negative',
			prompt: 'Часу небагато.',
			answer: "There isn't much time.",
			accept: ["There{ isn't|'s not} {much|a lot of} time."],
			traps: {
				"isn't": ["aren't", "wasn't"],
				much: ['many'],
			},
		},
		{
			id: 'there-is-there-are-80',
			form: 'negative',
			prompt: 'У цьому районі немає кінотеатру.',
			answer: "There isn't a cinema in this area.",
			accept: ["There{ is no|'s no|'s not a} cinema in this area."],
			traps: {
				"isn't": ["aren't", "wasn't"],
			},
		},
		{
			id: 'there-is-there-are-81',
			form: 'negative',
			prompt: 'У цій книжці немає картинок.',
			answer: "There aren't any pictures in this book.",
			accept: ['There are no pictures in this book.'],
			traps: {
				"aren't": ["isn't", "weren't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-82',
			form: 'negative',
			prompt: 'У цьому ресторані немає вільних столиків.',
			answer: "There aren't any free tables in this restaurant.",
			accept: [
				"There aren't any free tables {in|at} this restaurant.",
				'There are no free tables {in|at} this restaurant.',
			],
			traps: {
				"aren't": ["isn't", "weren't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-83',
			form: 'negative',
			prompt: 'На цьому острові немає доріг.',
			answer: "There aren't any roads on this island.",
			accept: ['There are no roads on this island.'],
			traps: {
				"aren't": ["isn't", "weren't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-84',
			form: 'negative',
			prompt: 'Квитків більше немає.',
			answer: "There aren't any tickets left.",
			accept: ['There are no tickets left.'],
			traps: {
				"aren't": ["isn't", "weren't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-85',
			form: 'negative',
			prompt: 'Біля нашого готелю немає автобусної зупинки.',
			answer: "There isn't a bus stop near our hotel.",
			accept: ["There{ is no|'s no|'s not a} bus stop near our hotel."],
			traps: {
				"isn't": ["aren't", "wasn't"],
			},
		},
		{
			id: 'there-is-there-are-86',
			form: 'negative',
			prompt: 'У ресторані не було музики.',
			answer: "There wasn't any music in the restaurant.",
			accept: [
				"There wasn't any music {in|at} the restaurant.",
				'There was no music {in|at} the restaurant.',
			],
			traps: {
				"wasn't": ["weren't", "isn't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-87',
			form: 'negative',
			prompt: 'У готелі не було гарячої води.',
			answer: "There wasn't any hot water in the hotel.",
			accept: [
				"There wasn't any hot water {in|at} the hotel.",
				'There was no hot water {in|at} the hotel.',
			],
			traps: {
				"wasn't": ["weren't", "isn't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-88',
			form: 'negative',
			prompt: 'На лекції було небагато людей.',
			answer: "There weren't many people at the lecture.",
			accept: ["There weren't {many|a lot of} people at the lecture."],
			traps: {
				"weren't": ["wasn't", "aren't"],
				many: ['much'],
			},
		},
		{
			id: 'there-is-there-are-89',
			form: 'negative',
			prompt: 'У гаманці не було грошей.',
			answer: "There wasn't any money in the wallet.",
			accept: ['There was no money in the wallet.'],
			traps: {
				"wasn't": ["weren't", "isn't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-90',
			form: 'negative',
			prompt: 'Учора не було уроків.',
			answer: "Yesterday there weren't any lessons.",
			accept: [
				'Yesterday there were no lessons.',
				"There weren't any lessons yesterday.",
				'There were no lessons yesterday.',
			],
			traps: {
				"weren't": ["wasn't", "aren't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-91',
			form: 'negative',
			prompt: 'У залі не було вільних місць.',
			answer: "There weren't any free seats in the hall.",
			accept: ['There were no free seats in the hall.'],
			traps: {
				"weren't": ["wasn't", "aren't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-92',
			form: 'negative',
			prompt: 'У будинку не було електрики.',
			answer: "There wasn't any electricity in the house.",
			accept: ['There was no electricity in the house.'],
			traps: {
				"wasn't": ["weren't", "isn't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-93',
			form: 'negative',
			prompt: 'На пікніку було небагато їжі.',
			answer: "There wasn't much food at the picnic.",
			accept: ["There wasn't {much|a lot of} food at the picnic."],
			traps: {
				"wasn't": ["weren't", "isn't"],
				much: ['many'],
			},
		},
		{
			id: 'there-is-there-are-94',
			form: 'negative',
			prompt: 'Минулого тижня не було жодних новин.',
			answer: "Last week there wasn't any news.",
			accept: [
				"Last week there{ wasn't any| was no} news.",
				"There{ wasn't any| was no} news last week.",
			],
			traps: {
				"wasn't": ["weren't", "isn't"],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-95',
			form: 'negative',
			prompt: 'На вечірці не буде алкоголю.',
			answer: "There won't be any alcohol at the party.",
			accept: ["There{ will be no|'ll be no} alcohol at the party."],
			traps: {
				be: ['is', 'are'],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-96',
			form: 'negative',
			prompt: 'У новому будинку не буде ліфта.',
			answer: "There won't be a lift in the new building.",
			accept: ["There{ will be no|'ll be no} lift in the new building."],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-97',
			form: 'negative',
			prompt: 'Цього разу не буде жодних проблем.',
			answer: "This time there won't be any problems.",
			accept: [
				"This time there{ won't be any| will be no|'ll be no} problems.",
				"There{ won't be any| will be no|'ll be no} problems this time.",
			],
			traps: {
				be: ['is', 'are'],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-98',
			form: 'negative',
			prompt: 'На іспиті не буде складних запитань.',
			answer: "There won't be any difficult questions in the exam.",
			accept: [
				"There won't be any difficult questions {in|on} the exam.",
				"There{ will be no|'ll be no} difficult questions {in|on} the exam.",
			],
			traps: {
				be: ['is', 'are'],
				any: ['some'],
			},
		},
		{
			id: 'there-is-there-are-99',
			form: 'negative',
			prompt: 'Наступного тижня не буде зустрічі.',
			answer: "Next week there won't be a meeting.",
			accept: [
				"Next week there{ won't be a| will be no|'ll be no} meeting.",
				"There{ won't be a| will be no|'ll be no} meeting next week.",
			],
			traps: {
				be: ['is', 'are'],
			},
		},
		{
			id: 'there-is-there-are-100',
			form: 'negative',
			prompt: 'У нашому районі не буде нового стадіону.',
			answer: "There won't be a new stadium in our area.",
			accept: ["There{ will be no|'ll be no} new stadium in our area."],
			traps: {
				be: ['is', 'are'],
			},
		},
	],
})
