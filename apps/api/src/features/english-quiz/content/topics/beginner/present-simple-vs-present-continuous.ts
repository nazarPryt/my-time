import { defineTopic } from '../../define-topic'

export const presentSimpleVsPresentContinuous = defineTopic({
	id: 'present-simple-vs-present-continuous',
	level: 'beginner',
	title: 'Present Simple vs Present Continuous',
	subtitle: 'Теперішній простий і теперішній тривалий час',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				'Present Simple: дієслово (he/she/it + -s) — звичка, розклад, факт. Present Continuous: am/is/are + дієслово з -ing — те, що відбувається зараз.',
			examples: [
				{
					text: 'She plays the piano every day.',
					translation: 'Вона щодня грає на піаніно.',
				},
				{
					text: 'Look! She is playing the piano.',
					translation: 'Подивись! Вона грає на піаніно.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Simple: Do/Does + підмет + дієслово. Continuous: Am/Is/Are + підмет + дієслово з -ing.',
			examples: [
				{
					text: 'Do you speak Spanish?',
					translation: 'Ти говориш іспанською?',
				},
				{
					text: 'What are they eating now?',
					translation: 'Що вони зараз їдять?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Simple: don't/doesn't + дієслово. Continuous: am not / isn't / aren't + дієслово з -ing.",
			examples: [
				{
					text: "He doesn't smoke.",
					translation: 'Він не курить.',
				},
				{
					text: "The kids aren't sleeping now.",
					translation: 'Діти зараз не сплять.',
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				'Simple — usually, often, never, every day, загальні факти. Continuous — now, right now, Look!, Listen!, today / this week як тимчасовий виняток. Дієслова стану (know, like, want, need, understand, belong) завжди в Simple.',
			examples: [
				{
					text: 'We usually walk, but today we are driving.',
					translation:
						'Ми зазвичай ходимо пішки, але сьогодні ми їдемо машиною.',
				},
				{
					text: 'I know this song.',
					translation: 'Я знаю цю пісню.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'present-simple-vs-present-continuous-1',
			form: 'affirmative',
			prompt: 'Він зазвичай ходить на роботу пішки.',
			answer: 'He usually walks to work.',
			traps: {
				walks: ['walk', 'walking', 'walked'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-2',
			form: 'affirmative',
			prompt: 'Сьогодні він їде автобусом.',
			answer: 'Today he is taking the bus.',
			traps: {
				taking: ['takes', 'take', 'took'],
			},
		},
		// Present Simple, affirmative
		{
			id: 'present-simple-vs-present-continuous-3',
			form: 'affirmative',
			prompt: 'Том щоранку читає новини.',
			answer: 'Tom reads the news every morning.',
			traps: {
				reads: ['reading', 'readed', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-4',
			form: 'affirmative',
			prompt: 'Ми щосуботи прибираємо квартиру.',
			answer: 'We clean the flat every Saturday.',
			accept: ['We clean the apartment every Saturday.'],
			traps: {
				clean: ['cleans', 'cleaning', 'are'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-5',
			form: 'affirmative',
			prompt: 'Вода замерзає при нулі градусів.',
			answer: 'Water freezes at zero degrees.',
			traps: {
				freezes: ['freeze', 'freezing', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-6',
			form: 'affirmative',
			prompt: 'Кішки люблять рибу.',
			answer: 'Cats love fish.',
			accept: ['Cats like fish.'],
			traps: {
				love: ['loves', 'loving', 'are'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-7',
			form: 'affirmative',
			prompt: 'Я знаю відповідь.',
			answer: 'I know the answer.',
			traps: {
				know: ['knows', 'knowing', 'am'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-8',
			form: 'affirmative',
			prompt: 'Моя тітка працює в лікарні.',
			answer: 'My aunt works in a hospital.',
			accept: ['My aunt works at a hospital.'],
			traps: {
				works: ['work', 'working', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-9',
			form: 'affirmative',
			prompt: 'Він часто грає в теніс.',
			answer: 'He often plays tennis.',
			traps: {
				plays: ['play', 'playing', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-10',
			form: 'affirmative',
			prompt: 'Ця сумка належить моїй сестрі.',
			answer: 'This bag belongs to my sister.',
			traps: {
				belongs: ['belong', 'belonging', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-11',
			form: 'affirmative',
			prompt: "Наші діти зазвичай лягають спати о дев'ятій.",
			answer: 'Our children usually go to bed at nine.',
			accept: ['Our kids usually go to bed at nine.'],
			traps: {
				go: ['goes', 'going', 'are'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-12',
			form: 'affirmative',
			prompt: 'Мені потрібна нова куртка.',
			answer: 'I need a new jacket.',
			traps: {
				need: ['needs', 'needing', 'am'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-13',
			form: 'affirmative',
			prompt: 'Вона хоче чашку чаю.',
			answer: 'She wants a cup of tea.',
			traps: {
				wants: ['want', 'wanting', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-14',
			form: 'affirmative',
			prompt: "Мій брат ніколи не їсть м'яса.",
			answer: 'My brother never eats meat.',
			traps: {
				eats: ['eat', 'eating', 'ate'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-15',
			form: 'affirmative',
			prompt: 'Ми щоліта їздимо до моря.',
			answer: 'We go to the sea every summer.',
			accept: ['We go to the seaside every summer.'],
			traps: {
				go: ['goes', 'going', 'are'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-16',
			form: 'affirmative',
			prompt: 'Бен розуміє французьку.',
			answer: 'Ben understands French.',
			traps: {
				understands: ['understand', 'understanding', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-17',
			form: 'affirmative',
			prompt: 'Магазин відчиняється о восьмій.',
			answer: 'The shop opens at eight.',
			accept: ['The store opens at eight.'],
			traps: {
				opens: ['open', 'opening', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-18',
			form: 'affirmative',
			prompt: 'Емма завжди носить окуляри.',
			answer: 'Emma always wears glasses.',
			traps: {
				wears: ['wear', 'wearing', 'is'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-19',
			form: 'affirmative',
			prompt: 'Я щодня вчу нові слова.',
			answer: 'I learn new words every day.',
			traps: {
				learn: ['learns', 'learning', 'am'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-20',
			form: 'affirmative',
			prompt: 'Мій дідусь живе в селі.',
			answer: 'My grandfather lives in a village.',
			accept: ['My grandpa lives in a village.'],
			traps: {
				lives: ['live', 'living', 'is'],
			},
		},
		// Present Continuous, affirmative
		{
			id: 'present-simple-vs-present-continuous-21',
			form: 'affirmative',
			prompt: 'Подивись! Іде сніг.',
			answer: 'Look! It is snowing.',
			accept: ["Look! It's snowing."],
			traps: {
				is: ['does', 'are'],
				snowing: ['snows', 'snow', 'snowed'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-22',
			form: 'affirmative',
			prompt: 'Малюк зараз спить.',
			answer: 'The baby is sleeping now.',
			traps: {
				is: ['does', 'are'],
				sleeping: ['sleeps', 'sleep', 'slept'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-23',
			form: 'affirmative',
			prompt: 'Я зараз готую вечерю.',
			answer: "I'm cooking dinner now.",
			accept: ["I'm making dinner now."],
			traps: {
				cooking: ['cook', 'cooks', 'cooked'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-24',
			form: 'affirmative',
			prompt: 'Вони зараз дивляться футбол.',
			answer: "They're watching football now.",
			traps: {
				watching: ['watch', 'watches', 'watched'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-25',
			form: 'affirmative',
			prompt: 'Подивись! Той чоловік біжить за автобусом.',
			answer: 'Look! That man is running for the bus.',
			accept: ['Look! That man is running after the bus.'],
			traps: {
				is: ['does', 'are'],
				running: ['runs', 'run', 'runing'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-26',
			form: 'affirmative',
			prompt: 'Послухай! Хтось стукає у двері.',
			answer: 'Listen! Someone is knocking at the door.',
			accept: ["Listen! {Someone|Somebody}{ is|'s} knocking {at|on} the door."],
			traps: {
				knocking: ['knocks', 'knock', 'knocked'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-27',
			form: 'affirmative',
			prompt: 'Ми зараз сидимо в парку.',
			answer: "We're sitting in the park now.",
			traps: {
				sitting: ['sit', 'sits', 'sat'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-28',
			form: 'affirmative',
			prompt: 'Цього тижня Анна працює вдома.',
			answer: 'This week Anna is working from home.',
			accept: [
				'This week Anna is working at home.',
				'Anna is working {from|at} home this week.',
			],
			traps: {
				is: ['does', 'are'],
				working: ['works', 'work', 'worked'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-29',
			form: 'affirmative',
			prompt: 'Вона саме зараз розмовляє по телефону.',
			answer: 'She is talking on the phone right now.',
			accept: ["{She is|She's} {talking|speaking} on the phone right now."],
			traps: {
				is: ['does', 'are', 'am'],
				talking: ['talks', 'talk', 'talked'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-30',
			form: 'affirmative',
			prompt: 'Подивись! Наші діти грають у саду.',
			answer: 'Look! Our children are playing in the garden.',
			accept: ['Look! Our kids are playing in the garden.'],
			traps: {
				are: ['is', 'do'],
				playing: ['play', 'plays', 'played'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-31',
			form: 'affirmative',
			prompt: 'Він зараз миє свою машину.',
			answer: 'He is washing his car now.',
			accept: ["He's washing his car now."],
			traps: {
				is: ['does', 'are'],
				washing: ['washes', 'wash', 'washed'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-32',
			form: 'affirmative',
			prompt: 'Я зараз пишу листа.',
			answer: "I'm writing a letter now.",
			traps: {
				writing: ['write', 'writes', 'wrote'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-33',
			form: 'affirmative',
			prompt: 'Цього місяця я читаю дуже цікаву книжку.',
			answer: "This month I'm reading a very interesting book.",
			accept: ["I'm reading a very interesting book this month."],
			traps: {
				reading: ['read', 'reads', 'readed'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-34',
			form: 'affirmative',
			prompt: 'Подивись! Наш кіт їсть твій сніданок.',
			answer: 'Look! Our cat is eating your breakfast.',
			traps: {
				is: ['does', 'are'],
				eating: ['eats', 'eat', 'ate'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-35',
			form: 'affirmative',
			prompt: 'Вони зараз будують новий міст.',
			answer: "They're building a new bridge now.",
			traps: {
				building: ['build', 'builds', 'built'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-36',
			form: 'affirmative',
			prompt: 'Подивись! Кейт танцює з Беном.',
			answer: 'Look! Kate is dancing with Ben.',
			traps: {
				is: ['does', 'are'],
				dancing: ['dances', 'dance', 'danced'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-37',
			form: 'affirmative',
			prompt: 'Ми зараз вчимо англійську.',
			answer: "We're learning English now.",
			accept: ["We're studying English now."],
			traps: {
				learning: ['learn', 'learns', 'learned'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-38',
			form: 'affirmative',
			prompt: 'Послухай! Дзвонить телефон.',
			answer: 'Listen! The phone is ringing.',
			traps: {
				is: ['does', 'are'],
				ringing: ['rings', 'ring', 'rang'],
			},
		},
		// Contrast pairs, affirmative
		{
			id: 'present-simple-vs-present-continuous-39',
			form: 'affirmative',
			prompt:
				'Вона зазвичай їздить на роботу автобусом, але сьогодні вона йде пішки.',
			answer: 'She usually takes the bus to work, but today she is walking.',
			accept: [
				"She usually {takes the bus to work|goes to work by bus}, but today {she is|she's} walking.",
				"She usually {takes the bus to work|goes to work by bus}, but {she is|she's} walking today.",
			],
			traps: {
				takes: ['take', 'taking', 'is'],
				walking: ['walks', 'walk', 'walked'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-40',
			form: 'affirmative',
			prompt: "Я зазвичай п'ю чай, але сьогодні я п'ю каву.",
			answer: "I usually drink tea, but today I'm drinking coffee.",
			accept: ["I usually drink tea, but I'm drinking coffee today."],
			traps: {
				drink: ['drinks', 'drinking', 'am'],
				drinking: ['drink', 'drinks', 'drank'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-41',
			form: 'affirmative',
			prompt:
				'Вони зазвичай грають у футбол, але сьогодні вони грають у теніс.',
			answer: "They usually play football, but today they're playing tennis.",
			accept: ["They usually play football, but they're playing tennis today."],
			traps: {
				play: ['plays', 'playing', 'are'],
				playing: ['play', 'plays', 'played'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-42',
			form: 'affirmative',
			prompt: 'Він ніколи не готує, але зараз він готує вечерю.',
			answer: 'He never cooks, but now he is cooking dinner.',
			accept: [
				"He never cooks, but now {he is|he's} {cooking|making} dinner.",
				"He never cooks, but {he is|he's} {cooking|making} dinner now.",
			],
			traps: {
				cooks: ['cook', 'cooking', 'is'],
				cooking: ['cooks', 'cook', 'cooked'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-43',
			form: 'affirmative',
			prompt: 'Я зазвичай слухаю рок, але зараз я слухаю джаз.',
			answer: "I usually listen to rock, but now I'm listening to jazz.",
			accept: ["I usually listen to rock, but I'm listening to jazz now."],
			traps: {
				listen: ['listens', 'listening', 'am'],
				listening: ['listen', 'listens', 'listened'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-44',
			form: 'affirmative',
			prompt: 'Мій син зазвичай грає на гітарі, але зараз він спить.',
			answer: 'My son usually plays the guitar, but now he is sleeping.',
			accept: [
				"My son usually plays {the|} guitar, but now {he is|he's} sleeping.",
				"My son usually plays {the|} guitar, but {he is|he's} sleeping now.",
			],
			traps: {
				plays: ['play', 'playing', 'is'],
				sleeping: ['sleeps', 'sleep', 'slept'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-45',
			form: 'affirmative',
			prompt: 'Вони зазвичай їдять удома, але сьогодні вони їдять у ресторані.',
			answer:
				"They usually eat at home, but today they're eating at a restaurant.",
			accept: [
				"They usually eat at home, but today they're eating in a restaurant.",
				"They usually eat at home, but they're eating {at|in} a restaurant today.",
			],
			traps: {
				eat: ['eats', 'eating', 'ate'],
				eating: ['eat', 'eats', 'ate'],
			},
		},
		// Present Simple, questions
		{
			id: 'present-simple-vs-present-continuous-46',
			form: 'question',
			prompt: 'Ти знаєш його адресу?',
			answer: 'Do you know his address?',
			traps: {
				do: ['Are', 'Does', 'Is'],
				know: ['knows', 'knowing'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-47',
			form: 'question',
			prompt: 'Вона часто відвідує своїх батьків?',
			answer: 'Does she often visit her parents?',
			traps: {
				does: ['Is', 'Do', 'Are'],
				visit: ['visits', 'visiting'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-48',
			form: 'question',
			prompt: 'Що ти зазвичай їси на сніданок?',
			answer: 'What do you usually eat for breakfast?',
			traps: {
				do: ['are', 'does', 'is'],
				eat: ['eats', 'eating'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-49',
			form: 'question',
			prompt: 'Де живе твій брат?',
			answer: 'Where does your brother live?',
			traps: {
				does: ['is', 'do'],
				live: ['lives', 'living'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-50',
			form: 'question',
			prompt: 'Тобі подобається ця музика?',
			answer: 'Do you like this music?',
			traps: {
				do: ['Are', 'Does'],
				like: ['likes', 'liking'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-51',
			form: 'question',
			prompt: 'Скільки коштує цей квиток?',
			answer: 'How much does this ticket cost?',
			traps: {
				does: ['is', 'do'],
				cost: ['costs', 'costing'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-52',
			form: 'question',
			prompt: 'Він щодня ходить до школи?',
			answer: 'Does he go to school every day?',
			traps: {
				does: ['Is', 'Do'],
				go: ['goes', 'going'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-53',
			form: 'question',
			prompt: 'Де ти зазвичай купуєш овочі?',
			answer: 'Where do you usually buy vegetables?',
			traps: {
				do: ['are', 'does'],
				buy: ['buys', 'buying'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-54',
			form: 'question',
			prompt: 'Як часто ти прибираєш свою кімнату?',
			answer: 'How often do you clean your room?',
			traps: {
				do: ['are', 'does'],
				clean: ['cleans', 'cleaning'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-55',
			form: 'question',
			prompt: 'Тобі потрібен цей стілець?',
			answer: 'Do you need this chair?',
			traps: {
				do: ['Are', 'Does'],
				need: ['needs', 'needing'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-56',
			form: 'question',
			prompt: 'Твоя сестра розуміє італійську?',
			answer: 'Does your sister understand Italian?',
			traps: {
				does: ['Is', 'Do'],
				understand: ['understands', 'understanding'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-57',
			form: 'question',
			prompt: 'Як часто ти ходиш у кіно?',
			answer: 'How often do you go to the cinema?',
			accept: ['How often do you go to the movies?'],
			traps: {
				do: ['are', 'does'],
				go: ['goes', 'going'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-58',
			form: 'question',
			prompt: 'Що ти хочеш на свій день народження?',
			answer: 'What do you want for your birthday?',
			traps: {
				do: ['are', 'does'],
				want: ['wants', 'wanting'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-59',
			form: 'question',
			prompt: 'Твої батьки працюють щосуботи?',
			answer: 'Do your parents work every Saturday?',
			traps: {
				do: ['Are', 'Does'],
				work: ['works', 'working'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-60',
			form: 'question',
			prompt: 'Ця парасолька належить тобі?',
			answer: 'Does this umbrella belong to you?',
			traps: {
				does: ['Is', 'Do'],
				belong: ['belongs', 'belonging'],
			},
		},
		// Present Continuous, questions
		{
			id: 'present-simple-vs-present-continuous-61',
			form: 'question',
			prompt: 'Що ти зараз робиш?',
			answer: 'What are you doing now?',
			traps: {
				are: ['do', 'is', 'does'],
				doing: ['do', 'does', 'did'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-62',
			form: 'question',
			prompt: 'Подивись на неї! Чому вона плаче?',
			answer: 'Look at her! Why is she crying?',
			traps: {
				is: ['does', 'are'],
				crying: ['cries', 'cry', 'cried'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-63',
			form: 'question',
			prompt: 'Малюк зараз плаче?',
			answer: 'Is the baby crying now?',
			traps: {
				is: ['Does', 'Are'],
				crying: ['cries', 'cry'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-64',
			form: 'question',
			prompt: 'Куди ти зараз ідеш?',
			answer: 'Where are you going now?',
			traps: {
				are: ['do', 'is'],
				going: ['go', 'goes'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-65',
			form: 'question',
			prompt: 'Ви зараз на когось чекаєте?',
			answer: 'Are you waiting for someone now?',
			accept: ['Are you waiting for {anyone|somebody|anybody} now?'],
			traps: {
				are: ['Do', 'Is'],
				waiting: ['wait', 'waits'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-66',
			form: 'question',
			prompt: 'Діти зараз граються надворі?',
			answer: 'Are the children playing outside now?',
			accept: ['Are the kids playing outside now?'],
			traps: {
				are: ['Do', 'Is'],
				playing: ['play', 'plays'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-67',
			form: 'question',
			prompt: 'Що вона зараз готує?',
			answer: 'What is she cooking now?',
			accept: ["{What is|What's} she {cooking|making} now?"],
			traps: {
				is: ['does', 'are'],
				cooking: ['cooks', 'cook'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-68',
			form: 'question',
			prompt: 'Ти мене зараз слухаєш?',
			answer: 'Are you listening to me now?',
			traps: {
				are: ['Do', 'Is'],
				listening: ['listen', 'listens'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-69',
			form: 'question',
			prompt: 'Вона зараз пише листа?',
			answer: 'Is she writing a letter now?',
			traps: {
				is: ['Does', 'Are'],
				writing: ['writes', 'write'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-70',
			form: 'question',
			prompt: 'З ким Анна зараз розмовляє?',
			answer: 'Who is Anna talking to now?',
			accept: ['Who is Anna speaking to now?'],
			traps: {
				is: ['does', 'are'],
				talking: ['talks', 'talk'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-71',
			form: 'question',
			prompt: 'Ти цього тижня працюєш удома?',
			answer: 'Are you working from home this week?',
			accept: ['Are you working at home this week?'],
			traps: {
				are: ['Do', 'Is'],
				working: ['work', 'works'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-72',
			form: 'question',
			prompt: 'Що ти зараз шукаєш?',
			answer: 'What are you looking for now?',
			traps: {
				are: ['do', 'is'],
				looking: ['look', 'looks'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-73',
			form: 'question',
			prompt: 'Подивись! Що вони несуть?',
			answer: 'Look! What are they carrying?',
			traps: {
				are: ['do', 'is'],
				carrying: ['carry', 'carries'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-74',
			form: 'question',
			prompt: 'Вона зараз дивиться телевізор?',
			answer: 'Is she watching TV now?',
			accept: ['Is she watching television now?'],
			traps: {
				is: ['Does', 'Are'],
				watching: ['watch', 'watches'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-75',
			form: 'question',
			prompt: 'Ти зазвичай ходиш пішки. Чому ти сьогодні їдеш автобусом?',
			answer: 'You usually walk. Why are you taking the bus today?',
			accept: ['You usually walk. Why are you going by bus today?'],
			traps: {
				walk: ['walks', 'walking'],
				are: ['do', 'is'],
				taking: ['take', 'takes'],
			},
		},
		// Present Simple, negatives
		{
			id: 'present-simple-vs-present-continuous-76',
			form: 'negative',
			prompt: 'Я не знаю його імені.',
			answer: "I don't know his name.",
			traps: {
				"don't": ["doesn't", "isn't", "aren't"],
				know: ['knows', 'knowing'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-77',
			form: 'negative',
			prompt: "Мій брат не п'є кави.",
			answer: "My brother doesn't drink coffee.",
			traps: {
				"doesn't": ["don't", "isn't"],
				drink: ['drinks', 'drinking'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-78',
			form: 'negative',
			prompt: 'Вони не живуть у Києві.',
			answer: "They don't live in Kyiv.",
			traps: {
				"don't": ["doesn't", "aren't"],
				live: ['lives', 'living'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-79',
			form: 'negative',
			prompt: 'Вона не любить холодну погоду.',
			answer: "She doesn't like cold weather.",
			traps: {
				"doesn't": ["don't", "isn't"],
				like: ['likes', 'liking'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-80',
			form: 'negative',
			prompt: 'Ми не їздимо на роботу машиною.',
			answer: "We don't drive to work.",
			accept: ["We don't go to work by car."],
			traps: {
				"don't": ["doesn't", "aren't"],
				drive: ['drives', 'driving'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-81',
			form: 'negative',
			prompt: 'Він мене не розуміє.',
			answer: "He doesn't understand me.",
			traps: {
				"doesn't": ["don't", "isn't"],
				understand: ['understands', 'understanding'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-82',
			form: 'negative',
			prompt: 'Мені не потрібна твоя допомога.',
			answer: "I don't need your help.",
			traps: {
				"don't": ["doesn't", "isn't"],
				need: ['needs', 'needing'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-83',
			form: 'negative',
			prompt: 'Анна не їсть хліба.',
			answer: "Anna doesn't eat bread.",
			traps: {
				"doesn't": ["don't", "isn't"],
				eat: ['eats', 'eating'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-84',
			form: 'negative',
			prompt: 'Цей автобус не їде до аеропорту.',
			answer: "This bus doesn't go to the airport.",
			traps: {
				"doesn't": ["don't", "isn't"],
				go: ['goes', 'going'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-85',
			form: 'negative',
			prompt: 'Я не хочу йти додому.',
			answer: "I don't want to go home.",
			traps: {
				"don't": ["doesn't", "isn't"],
				want: ['wants', 'wanting'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-86',
			form: 'negative',
			prompt: 'Мої друзі не грають у шахи.',
			answer: "My friends don't play chess.",
			traps: {
				"don't": ["doesn't", "aren't"],
				play: ['plays', 'playing'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-87',
			form: 'negative',
			prompt: 'Ця книжка мені не належить.',
			answer: "This book doesn't belong to me.",
			traps: {
				"doesn't": ["don't", "isn't"],
				belong: ['belongs', 'belonging'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-88',
			form: 'negative',
			prompt: 'Ця крамниця не продає хліба.',
			answer: "This shop doesn't sell bread.",
			accept: ["This store doesn't sell bread."],
			traps: {
				"doesn't": ["don't", "isn't"],
				sell: ['sells', 'selling'],
			},
		},
		// Present Continuous, negatives
		{
			id: 'present-simple-vs-present-continuous-89',
			form: 'negative',
			prompt: 'Я зараз не працюю.',
			answer: "I'm not working now.",
			traps: {
				working: ['work', 'works'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-90',
			form: 'negative',
			prompt: 'Вона зараз не спить.',
			answer: "She isn't sleeping now.",
			accept: ["She's not sleeping now."],
			traps: {
				"isn't": ["doesn't", "aren't", "don't"],
				sleeping: ['sleeps', 'sleep'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-91',
			form: 'negative',
			prompt: 'Діти зараз не дивляться телевізор.',
			answer: "The children aren't watching TV now.",
			accept: ["The {children|kids} aren't watching {TV|television} now."],
			traps: {
				"aren't": ["don't", "isn't"],
				watching: ['watch', 'watches'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-92',
			form: 'negative',
			prompt: 'Сьогодні йде дощ, тому ми не граємо в теніс.',
			answer: "It is raining today, so we aren't playing tennis.",
			accept: [
				"{It is|It's} raining today, so {we aren't|we're not} playing tennis.",
				"Today {it is|it's} raining, so {we aren't|we're not} playing tennis.",
			],
			traps: {
				"aren't": ["don't", "isn't"],
				playing: ['play', 'plays'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-93',
			form: 'negative',
			prompt: 'Подивись, він не слухає вчителя.',
			answer: "Look, he isn't listening to the teacher.",
			accept: ["Look, he's not listening to the teacher."],
			traps: {
				"isn't": ["doesn't", "aren't"],
				listening: ['listens', 'listen'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-94',
			form: 'negative',
			prompt: 'Вони зараз не розмовляють одне з одним.',
			answer: "They aren't talking to each other now.",
			accept: [
				"{They aren't|They're not} {talking|speaking} to each other now.",
			],
			traps: {
				"aren't": ["don't", "isn't"],
				talking: ['talk', 'talks'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-95',
			form: 'negative',
			prompt: "Цього тижня Макс не п'є кави.",
			answer: "This week Max isn't drinking coffee.",
			accept: ["Max isn't drinking coffee this week."],
			traps: {
				"isn't": ["doesn't", "aren't"],
				drinking: ['drink', 'drinks'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-96',
			form: 'negative',
			prompt: 'Мій телефон зараз не заряджається.',
			answer: "My phone isn't charging now.",
			traps: {
				"isn't": ["doesn't", "aren't"],
				charging: ['charges', 'charge'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-97',
			form: 'negative',
			prompt: 'Зараз не йде сніг.',
			answer: "It isn't snowing now.",
			accept: ["It's not snowing now."],
			traps: {
				"isn't": ["doesn't", "aren't"],
				snowing: ['snows', 'snow'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-98',
			form: 'negative',
			prompt: 'Сьогодні Емма не в окулярах.',
			answer: "Emma isn't wearing glasses today.",
			accept: [
				"Emma isn't wearing her glasses today.",
				"Today Emma isn't wearing {her|} glasses.",
			],
			traps: {
				"isn't": ["doesn't", "aren't"],
				wearing: ['wears', 'wear'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-99',
			form: 'negative',
			prompt: 'Подивись, вони не слухають!',
			answer: "Look, they aren't listening!",
			accept: ["Look, they're not listening!"],
			traps: {
				"aren't": ["don't", "isn't"],
				listening: ['listen', 'listens'],
			},
		},
		{
			id: 'present-simple-vs-present-continuous-100',
			form: 'negative',
			prompt: 'Вона зазвичай працює по суботах, але сьогодні вона не працює.',
			answer: "She usually works on Saturdays, but today she isn't working.",
			accept: [
				"She usually works on Saturdays, but today {she isn't|she's not} working.",
				"She usually works on Saturdays, but {she isn't|she's not} working today.",
			],
			traps: {
				works: ['work', 'working', 'is'],
				working: ['works', 'work'],
			},
		},
	],
})
