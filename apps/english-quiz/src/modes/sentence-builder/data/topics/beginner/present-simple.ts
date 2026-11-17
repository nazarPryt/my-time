import { defineTopic } from '../../define-topic'

export const presentSimple = defineTopic({
	id: 'present-simple',
	level: 'beginner',
	title: 'Present Simple',
	subtitle: 'Теперішній простий час',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				'I/you/we/they + дієслово; he/she/it + дієслово із закінченням -s/-es.',
			examples: [
				{
					text: 'I work every day.',
					translation: 'Я працюю щодня.',
				},
				{
					text: 'She lives in Kyiv.',
					translation: 'Вона живе в Києві.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Do/Does + підмет + дієслово. Після does закінчення -s не додається.',
			examples: [
				{
					text: 'How do you play?',
					translation: 'Як ти граєш?',
				},
				{
					text: 'Where do they live?',
					translation: 'Де вони живуть?',
				},
				{
					text: 'Does he know you?',
					translation: 'Він тебе знає?',
				},
			],
		},
		{
			kind: 'negative',
			explanation: "don't/doesn't + дієслово без закінчення.",
			examples: [
				{
					text: "He doesn't need help.",
					translation: 'Йому не потрібна допомога.',
				},
				{
					text: "It doesn't mean anything.",
					translation: 'Це нічого не означає.',
				},
				{
					text: "I don't eat meat.",
					translation: "Я не їм м'яса.",
				},
			],
		},
	],
	sentences: [
		{
			id: 'present-simple-1',
			form: 'question',
			prompt: 'Як ти граєш?',
			answer: 'How do you play?',
			traps: {
				play: ['plays', 'played', 'playing'],
			},
		},
		{
			id: 'present-simple-2',
			form: 'negative',
			prompt: 'Йому не потрібна допомога.',
			answer: "He doesn't need help.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				need: ['needs', 'needed'],
			},
		},
		{
			id: 'present-simple-3',
			form: 'affirmative',
			prompt: "Вона завжди п'є чай уранці.",
			answer: 'She always drinks tea in the morning.',
			traps: {
				drinks: ['drink', 'drank', 'drinking'],
			},
		},
		{
			id: 'present-simple-4',
			form: 'affirmative',
			prompt: 'Мій брат живе в Лондоні.',
			answer: 'My brother lives in London.',
			traps: {
				lives: ['live', 'lived', 'living'],
			},
		},
		{
			id: 'present-simple-5',
			form: 'affirmative',
			prompt: 'Вода кипить при 100 градусах.',
			answer: 'Water boils at 100 degrees.',
			traps: {
				boils: ['boil', 'boiled', 'boiling'],
			},
		},
		{
			id: 'present-simple-6',
			form: 'affirmative',
			prompt: 'Іван дивиться новини щовечора.',
			answer: 'Ivan watches the news every evening.',
			traps: {
				watches: ['watch', 'watchs', 'watched'],
			},
		},
		{
			id: 'present-simple-7',
			form: 'affirmative',
			prompt: 'Сонце сходить на сході.',
			answer: 'The sun rises in the east.',
			traps: {
				rises: ['rise', 'rose', 'rising'],
			},
		},
		{
			id: 'present-simple-8',
			form: 'affirmative',
			prompt: 'Він ходить у спортзал тричі на тиждень.',
			answer: 'He goes to the gym three times a week.',
			traps: {
				goes: ['go', 'gos', 'went'],
			},
		},
		{
			id: 'present-simple-9',
			form: 'affirmative',
			prompt: 'Мій дядько часто літає до Риму.',
			answer: 'My uncle often flies to Rome.',
			traps: {
				flies: ['fly', 'flys', 'flew'],
			},
		},
		{
			id: 'present-simple-10',
			form: 'affirmative',
			prompt: 'Він завжди намагається допомогти.',
			answer: 'He always tries to help.',
			traps: {
				tries: ['try', 'trys', 'tried'],
			},
		},
		{
			id: 'present-simple-11',
			form: 'affirmative',
			prompt: 'У неї завжди є час для своїх друзів.',
			answer: 'She always has time for her friends.',
			traps: {
				has: ['have', 'is', 'had'],
			},
		},
		{
			id: 'present-simple-12',
			form: 'affirmative',
			prompt: 'Нам подобається ця пісня.',
			answer: 'We like this song.',
			traps: {
				like: ['likes', 'liked', 'liking'],
			},
		},
		{
			id: 'present-simple-13',
			form: 'affirmative',
			prompt: 'Я тебе розумію.',
			answer: 'I understand you.',
			traps: {
				understand: ['understands', 'understood', 'understanding'],
			},
		},
		{
			id: 'present-simple-14',
			form: 'affirmative',
			prompt: 'Ти дуже добре говориш англійською.',
			answer: 'You speak English very well.',
			traps: {
				speak: ['speaks', 'spoke', 'speaking'],
			},
		},
		{
			id: 'present-simple-15',
			form: 'affirmative',
			prompt: 'Анна багато працює.',
			answer: 'Anna works a lot.',
			traps: {
				works: ['work', 'worked', 'working'],
			},
		},
		{
			id: 'present-simple-16',
			form: 'affirmative',
			prompt: "Банк зачиняється о п'ятій.",
			answer: 'The bank closes at five.',
			traps: {
				closes: ['close', 'closed', 'closing'],
			},
		},
		{
			id: 'present-simple-17',
			form: 'affirmative',
			prompt: 'Пан Сміт викладає музику.',
			answer: 'Mr. Smith teaches music.',
			traps: {
				teaches: ['teach', 'teachs', 'taught'],
			},
		},
		{
			id: 'present-simple-18',
			form: 'affirmative',
			prompt: 'Марія зазвичай закінчує роботу о шостій.',
			answer: 'Maria usually finishes work at six.',
			traps: {
				finishes: ['finish', 'finishs', 'finished'],
			},
		},
		{
			id: 'present-simple-19',
			form: 'affirmative',
			prompt: 'Він миє свою машину щосуботи.',
			answer: 'He washes his car every Saturday.',
			traps: {
				washes: ['wash', 'washs', 'washed'],
			},
		},
		{
			id: 'present-simple-20',
			form: 'affirmative',
			prompt: 'Тут часто йде дощ.',
			answer: 'It often rains here.',
			traps: {
				rains: ['rain', 'rained', 'raining'],
			},
		},
		{
			id: 'present-simple-21',
			form: 'affirmative',
			prompt: 'Кішки ловлять мишей.',
			answer: 'Cats catch mice.',
			traps: {
				catch: ['catches', 'caught', 'catching'],
			},
		},
		{
			id: 'present-simple-22',
			form: 'affirmative',
			prompt: 'Моя сестра вивчає хімію щовечора.',
			answer: 'My sister studies chemistry every evening.',
			traps: {
				studies: ['study', 'studys', 'studied'],
			},
		},
		{
			id: 'present-simple-23',
			form: 'question',
			prompt: 'Тобі подобається кава?',
			answer: 'Do you like coffee?',
			traps: {
				Do: ['Does', 'Are', 'Is'],
			},
		},
		{
			id: 'present-simple-24',
			form: 'question',
			prompt: 'Вона говорить німецькою?',
			answer: 'Does she speak German?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				speak: ['speaks', 'spoke'],
			},
		},
		{
			id: 'present-simple-25',
			form: 'question',
			prompt: 'Твій брат часто грає в теніс?',
			answer: 'Does your brother often play tennis?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				play: ['plays', 'played'],
			},
		},
		{
			id: 'present-simple-26',
			form: 'question',
			prompt: "Він знає моє ім'я?",
			answer: 'Does he know my name?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				know: ['knows', 'knew'],
			},
		},
		{
			id: 'present-simple-27',
			form: 'question',
			prompt: 'Вони живуть у Львові?',
			answer: 'Do they live in Lviv?',
			traps: {
				Do: ['Does', 'Are', 'Is'],
			},
		},
		{
			id: 'present-simple-28',
			form: 'question',
			prompt: 'Ви працюєте щосуботи?',
			answer: 'Do you work every Saturday?',
			traps: {
				Do: ['Does', 'Are', 'Is'],
			},
		},
		{
			id: 'present-simple-29',
			form: 'question',
			prompt: "Твоя сестра їсть м'ясо?",
			answer: 'Does your sister eat meat?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				eat: ['eats', 'ate'],
			},
		},
		{
			id: 'present-simple-30',
			form: 'question',
			prompt: 'Цей автобус зупиняється тут?',
			answer: 'Does this bus stop here?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				stop: ['stops', 'stopped'],
			},
		},
		{
			id: 'present-simple-31',
			form: 'question',
			prompt: 'Твій син ходить до школи пішки?',
			answer: 'Does your son walk to school?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				walk: ['walks', 'walked'],
			},
		},
		{
			id: 'present-simple-32',
			form: 'question',
			prompt: 'Твоя донька допомагає тобі вдома?',
			answer: 'Does your daughter help you at home?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				help: ['helps', 'helped'],
			},
		},
		{
			id: 'present-simple-33',
			form: 'question',
			prompt: 'Де працює твій батько?',
			answer: 'Where does your father work?',
			traps: {
				does: ['do', 'is', 'did'],
			},
		},
		{
			id: 'present-simple-34',
			form: 'question',
			prompt: 'Що ти зазвичай робиш після роботи?',
			answer: 'What do you usually do after work?',
			traps: {
				do: ['does', 'are', 'did'],
			},
		},
		{
			id: 'present-simple-35',
			form: 'question',
			prompt: 'Як часто ви бачите своїх батьків?',
			answer: 'How often do you see your parents?',
			traps: {
				do: ['does', 'are', 'did'],
			},
		},
		{
			id: 'present-simple-36',
			form: 'question',
			prompt: 'Що означає це слово?',
			answer: 'What does this word mean?',
			traps: {
				does: ['do', 'is', 'did'],
				mean: ['means', 'meant'],
			},
		},
		{
			id: 'present-simple-37',
			form: 'question',
			prompt: 'Коли ти зазвичай лягаєш спати?',
			answer: 'When do you usually go to bed?',
			traps: {
				do: ['does', 'are', 'did'],
			},
		},
		{
			id: 'present-simple-38',
			form: 'negative',
			prompt: "Він не п'є кави.",
			answer: "He doesn't drink coffee.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
			},
		},
		{
			id: 'present-simple-39',
			form: 'negative',
			prompt: 'Я не розумію цього питання.',
			answer: "I don't understand this question.",
			traps: {
				"don't": ["doesn't", "isn't", "didn't"],
			},
		},
		{
			id: 'present-simple-40',
			form: 'negative',
			prompt: 'Моя сестра не працює по неділях.',
			answer: "My sister doesn't work on Sundays.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				work: ['works', 'worked'],
			},
		},
		{
			id: 'present-simple-41',
			form: 'negative',
			prompt: 'Вони тут не живуть.',
			answer: "They don't live here.",
			traps: {
				"don't": ["doesn't", "aren't", "didn't"],
			},
		},
		{
			id: 'present-simple-42',
			form: 'negative',
			prompt: 'Вона не їсть риби.',
			answer: "She doesn't eat fish.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				eat: ['eats', 'ate'],
			},
		},
		{
			id: 'present-simple-43',
			form: 'negative',
			prompt: 'Ти не знаєш його адреси.',
			answer: "You don't know his address.",
			traps: {
				"don't": ["doesn't", "aren't", "didn't"],
			},
		},
		{
			id: 'present-simple-44',
			form: 'negative',
			prompt: 'Мій батько не курить.',
			answer: "My father doesn't smoke.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				smoke: ['smokes', 'smoked'],
			},
		},
		{
			id: 'present-simple-45',
			form: 'negative',
			prompt: "Я не пам'ятаю його імені.",
			answer: "I don't remember his name.",
			traps: {
				"don't": ["doesn't", "isn't", "didn't"],
			},
		},
		{
			id: 'present-simple-46',
			form: 'negative',
			prompt: 'Нам не потрібна машина.',
			answer: "We don't need a car.",
			traps: {
				"don't": ["doesn't", "aren't", "didn't"],
			},
		},
		{
			id: 'present-simple-47',
			form: 'negative',
			prompt: 'Він не знає відповіді.',
			answer: "He doesn't know the answer.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				know: ['knows', 'knew'],
			},
		},
		{
			id: 'present-simple-48',
			form: 'negative',
			prompt: 'Мій друг не говорить іспанською.',
			answer: "My friend doesn't speak Spanish.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
			},
		},
		{
			id: 'present-simple-49',
			form: 'negative',
			prompt: 'Том не грає у відеоігри.',
			answer: "Tom doesn't play video games.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				play: ['plays', 'played'],
			},
		},
		{
			id: 'present-simple-50',
			form: 'negative',
			prompt: 'Моїм батькам не подобається гучна музика.',
			answer: "My parents don't like loud music.",
			traps: {
				"don't": ["doesn't", "aren't", "didn't"],
			},
		},
		{
			id: 'present-simple-51',
			form: 'negative',
			prompt: 'Вода не горить.',
			answer: "Water doesn't burn.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				burn: ['burns', 'burned'],
			},
		},
		{
			id: 'present-simple-52',
			form: 'negative',
			prompt: 'Мій син не їсть овочів.',
			answer: "My son doesn't eat vegetables.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
			},
		},
		{
			id: 'present-simple-53',
			form: 'affirmative',
			prompt: 'Він завжди носить чорну куртку.',
			answer: 'He always wears a black jacket.',
			traps: {
				wears: ['wear', 'wore', 'wearing'],
			},
		},
		{
			id: 'present-simple-54',
			form: 'affirmative',
			prompt: 'Потяг відправляється о восьмій.',
			answer: 'The train leaves at eight.',
			traps: {
				leaves: ['leave', 'left', 'leaving'],
			},
		},
		{
			id: 'present-simple-55',
			form: 'affirmative',
			prompt: 'Мій брат знає три мови.',
			answer: 'My brother knows three languages.',
			traps: {
				knows: ['know', 'knew', 'knowing'],
			},
		},
		{
			id: 'present-simple-56',
			form: 'affirmative',
			prompt: 'Наш учитель часто задає нам домашнє завдання.',
			answer: 'Our teacher often gives us homework.',
			traps: {
				gives: ['give', 'gave', 'giving'],
			},
		},
		{
			id: 'present-simple-57',
			form: 'affirmative',
			prompt: 'Олена зазвичай прокидається о шостій.',
			answer: 'Olena usually wakes up at six.',
			traps: {
				wakes: ['wake', 'woke', 'waking'],
			},
		},
		{
			id: 'present-simple-58',
			form: 'affirmative',
			prompt: 'Моєму синові подобається морозиво.',
			answer: 'My son likes ice cream.',
			traps: {
				likes: ['like', 'liked', 'liking'],
			},
		},
		{
			id: 'present-simple-59',
			form: 'affirmative',
			prompt: "Він ніколи не їсть м'яса.",
			answer: 'He never eats meat.',
			traps: {
				eats: ['eat', 'ate', 'eating'],
			},
		},
		{
			id: 'present-simple-60',
			form: 'affirmative',
			prompt: 'Вона добре співає.',
			answer: 'She sings well.',
			traps: {
				sings: ['sing', 'sang', 'singing'],
			},
		},
		{
			id: 'present-simple-61',
			form: 'affirmative',
			prompt: 'Мій брат працює вночі.',
			answer: 'My brother works at night.',
			traps: {
				works: ['work', 'worked', 'working'],
			},
		},
		{
			id: 'present-simple-62',
			form: 'affirmative',
			prompt: 'Він часто забуває свій телефон удома.',
			answer: 'He often forgets his phone at home.',
			traps: {
				forgets: ['forget', 'forgot', 'forgetting'],
			},
		},
		{
			id: 'present-simple-63',
			form: 'affirmative',
			prompt: 'Ми зазвичай вечеряємо о сьомій.',
			answer: 'We usually have dinner at seven.',
			traps: {
				have: ['has', 'are', 'had'],
			},
		},
		{
			id: 'present-simple-64',
			form: 'affirmative',
			prompt: 'Цей автобус їде до аеропорту.',
			answer: 'This bus goes to the airport.',
			traps: {
				goes: ['go', 'gos', 'went'],
			},
		},
		{
			id: 'present-simple-65',
			form: 'question',
			prompt: 'Ти знаєш цього чоловіка?',
			answer: 'Do you know this man?',
			traps: {
				Do: ['Does', 'Are', 'Is'],
				know: ['knows', 'knew'],
			},
		},
		{
			id: 'present-simple-66',
			form: 'question',
			prompt: 'Ти часто читаєш книжки?',
			answer: 'Do you often read books?',
			traps: {
				Do: ['Does', 'Are', 'Is'],
				read: ['reads'],
			},
		},
		{
			id: 'present-simple-67',
			form: 'question',
			prompt: 'Тобі потрібна допомога?',
			answer: 'Do you need help?',
			traps: {
				Do: ['Does', 'Are', 'Is'],
				need: ['needs', 'needed'],
			},
		},
		{
			id: 'present-simple-68',
			form: 'question',
			prompt: 'Твій кіт їсть рибу?',
			answer: 'Does your cat eat fish?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				eat: ['eats', 'ate'],
			},
		},
		{
			id: 'present-simple-69',
			form: 'question',
			prompt: 'Марія знає твою адресу?',
			answer: 'Does Maria know your address?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				know: ['knows', 'knew'],
			},
		},
		{
			id: 'present-simple-70',
			form: 'question',
			prompt: 'Твій друг говорить французькою?',
			answer: 'Does your friend speak French?',
			traps: {
				Does: ['Do', 'Is', 'Are'],
				speak: ['speaks', 'spoke'],
			},
		},
		{
			id: 'present-simple-71',
			form: 'question',
			prompt: 'Де ти зазвичай купуєш хліб?',
			answer: 'Where do you usually buy bread?',
			traps: {
				do: ['does', 'are', 'did'],
				buy: ['buys', 'bought'],
			},
		},
		{
			id: 'present-simple-72',
			form: 'question',
			prompt: 'Чого ти хочеш?',
			answer: 'What do you want?',
			traps: {
				do: ['does', 'are', 'did'],
				want: ['wants', 'wanted'],
			},
		},
		{
			id: 'present-simple-73',
			form: 'question',
			prompt: 'Хто живе в цьому будинку?',
			answer: 'Who lives in this house?',
			traps: {
				lives: ['live', 'lived', 'living'],
			},
		},
		{
			id: 'present-simple-74',
			form: 'negative',
			prompt: 'Вони не говорять англійською.',
			answer: "They don't speak English.",
			traps: {
				"don't": ["doesn't", "aren't", "didn't"],
				speak: ['speaks', 'spoke'],
			},
		},
		{
			id: 'present-simple-75',
			form: 'negative',
			prompt: "Я не п'ю молока.",
			answer: "I don't drink milk.",
			traps: {
				"don't": ["doesn't", "isn't", "didn't"],
			},
		},
		{
			id: 'present-simple-76',
			form: 'negative',
			prompt: 'Іван не дивиться футбол.',
			answer: "Ivan doesn't watch football.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				watch: ['watches', 'watched'],
			},
		},
		{
			id: 'present-simple-77',
			form: 'negative',
			prompt: 'Ми не працюємо по неділях.',
			answer: "We don't work on Sundays.",
			traps: {
				"don't": ["doesn't", "aren't", "didn't"],
			},
		},
		{
			id: 'present-simple-78',
			form: 'negative',
			prompt: 'Він не розуміє жартів.',
			answer: "He doesn't understand jokes.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				understand: ['understands', 'understood'],
			},
		},
		{
			id: 'present-simple-79',
			form: 'negative',
			prompt: 'Мій учитель не носить окулярів.',
			answer: "My teacher doesn't wear glasses.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				wear: ['wears', 'wore'],
			},
		},
		{
			id: 'present-simple-80',
			form: 'negative',
			prompt: 'Цей потяг тут не зупиняється.',
			answer: "This train doesn't stop here.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				stop: ['stops', 'stopped'],
			},
		},
		{
			id: 'present-simple-81',
			form: 'negative',
			prompt: 'Пінгвіни не літають.',
			answer: "Penguins don't fly.",
			traps: {
				"don't": ["doesn't", "aren't", "didn't"],
				fly: ['flies', 'flew'],
			},
		},
		{
			id: 'present-simple-82',
			form: 'negative',
			prompt: 'Вона не знає, де я живу.',
			answer: "She doesn't know where I live.",
			traps: {
				"doesn't": ["don't", "isn't", "didn't"],
				know: ['knows', 'knew'],
			},
		},
	],
})
