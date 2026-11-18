import { defineTopic } from '../../define-topic'

export const passiveVoicePastSimple = defineTopic({
	id: 'passive-voice-past-simple',
	level: 'intermediate',
	title: 'Passive Voice - Past Simple',
	subtitle: 'Пасивний стан — минулий простий час',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				'was (однина) / were (множина) + третя форма дієслова (past participle). Того, хто виконав дію, називаємо після by.',
			examples: [
				{
					text: 'The castle was built in 1500.',
					translation: 'Замок було збудовано у 1500 році.',
				},
				{
					text: 'The windows were cleaned on Monday.',
					translation: 'Вікна було вимито в понеділок.',
				},
				{
					text: 'The song was sung by a famous singer.',
					translation: 'Пісню було виконано відомим співаком.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Was/Were + підмет + третя форма дієслова. Питання «ким?» — Who … by?',
			examples: [
				{
					text: 'When was the house sold?',
					translation: 'Коли було продано будинок?',
				},
				{
					text: 'Were the guests met at the station?',
					translation: 'Гостей було зустрінуто на вокзалі?',
				},
				{
					text: 'Who was the letter sent by?',
					translation: 'Ким було надіслано листа?',
				},
			],
		},
		{
			kind: 'negative',
			explanation: "wasn't/weren't + третя форма дієслова.",
			examples: [
				{
					text: "The door wasn't painted on Friday.",
					translation: "Двері не було пофарбовано в п'ятницю.",
				},
				{
					text: "The cakes weren't eaten at the party.",
					translation: "Тістечка не були з'їдені на вечірці.",
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				'Пасив у минулому — для завершених подій, коли виконавець невідомий або неважливий. Українською це часто форма на -но/-то («було збудовано») або «був написаний». Маркери часу: yesterday, last week, in 2010, ago. Третя форма неправильних дієслів: steal → stolen, write → written, build → built.',
			examples: [
				{
					text: 'The bank was robbed last week.',
					translation: 'Банк було пограбовано минулого тижня.',
				},
				{
					text: 'The road was closed two days ago.',
					translation: 'Дорогу було закрито два дні тому.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'passive-voice-past-simple-1',
			form: 'affirmative',
			prompt: 'Цей міст збудували в 1990 році.',
			answer: 'This bridge was built in 1990.',
			traps: {
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-past-simple-2',
			form: 'affirmative',
			prompt: 'Листи надіслали вчора.',
			answer: 'The letters were sent yesterday.',
			traps: {
				were: ['was', 'are', 'did'],
			},
		},
		{
			id: 'passive-voice-past-simple-3',
			form: 'affirmative',
			prompt: 'Мою машину було вкрадено вчора.',
			answer: 'My car was stolen yesterday.',
			traps: {
				was: ['is', 'were', 'has'],
				stolen: ['stole', 'steal', 'stealed'],
			},
		},
		{
			id: 'passive-voice-past-simple-4',
			form: 'affirmative',
			prompt: 'Цей роман було написано у 1840 році.',
			answer: 'This novel was written in 1840.',
			traps: {
				was: ['is', 'were', 'has'],
				written: ['wrote', 'write', 'writed'],
			},
		},
		{
			id: 'passive-voice-past-simple-5',
			form: 'affirmative',
			prompt: 'Цей портрет було намальовано у 1905 році.',
			answer: 'This portrait was painted in 1905.',
			traps: {
				was: ['is', 'were', 'has'],
				painted: ['paint', 'paints', 'painting'],
			},
		},
		{
			id: 'passive-voice-past-simple-6',
			form: 'affirmative',
			prompt: 'Цей вірш був написаний Шевченком.',
			answer: 'This poem was written by Shevchenko.',
			traps: {
				was: ['is', 'were', 'has'],
				written: ['wrote', 'write', 'writen'],
				by: ['from', 'with'],
			},
		},
		{
			id: 'passive-voice-past-simple-7',
			form: 'affirmative',
			prompt: 'Телефон було винайдено у 1876 році.',
			answer: 'The telephone was invented in 1876.',
			accept: ['The {telephone|phone} was invented in 1876.'],
			traps: {
				was: ['is', 'were', 'has'],
				invented: ['invent', 'invents', 'inventing'],
			},
		},
		{
			id: 'passive-voice-past-simple-8',
			form: 'affirmative',
			prompt: 'Ці фотографії були зроблені минулого літа.',
			answer: 'These photos were taken last summer.',
			accept: ['These {photos|photographs|pictures} were taken last summer.'],
			traps: { were: ['was', 'are', 'have'], taken: ['took', 'take', 'taked'] },
		},
		{
			id: 'passive-voice-past-simple-9',
			form: 'affirmative',
			prompt: 'Це вікно було розбито вчора ввечері.',
			answer: 'This window was broken last night.',
			accept: ['This window was broken {last night|yesterday evening}.'],
			traps: {
				was: ['is', 'were', 'has'],
				broken: ['broke', 'break', 'breaked'],
			},
		},
		{
			id: 'passive-voice-past-simple-10',
			form: 'affirmative',
			prompt: 'Цю церкву було збудовано в сімнадцятому столітті.',
			answer: 'This church was built in the seventeenth century.',
			traps: {
				was: ['is', 'were', 'has'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-past-simple-11',
			form: 'affirmative',
			prompt: 'Мій гаманець було знайдено під столом учора.',
			answer: 'My wallet was found under the table yesterday.',
			traps: {
				was: ['is', 'were', 'has'],
				found: ['find', 'finded', 'founded'],
			},
		},
		{
			id: 'passive-voice-past-simple-12',
			form: 'affirmative',
			prompt: 'Мене було запрошено на її день народження минулого року.',
			answer: 'I was invited to her birthday party last year.',
			accept: ['I was invited to her birthday {party|} last year.'],
			traps: {
				was: ['am', 'were', 'have'],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-past-simple-13',
			form: 'affirmative',
			prompt: 'Цей торт був спечений моєю бабусею вчора.',
			answer: 'This cake was baked by my grandmother yesterday.',
			accept: ['This cake was baked by my {grandmother|grandma} yesterday.'],
			traps: { was: ['is', 'were', 'has'], baked: ['bake', 'bakes', 'baking'] },
		},
		{
			id: 'passive-voice-past-simple-14',
			form: 'affirmative',
			prompt: 'Ці будинки були зруйновані під час війни.',
			answer: 'These houses were destroyed during the war.',
			accept: ['These houses were destroyed {during|in} the war.'],
			traps: {
				were: ['was', 'are', 'have'],
				destroyed: ['destroy', 'destroys', 'destroying'],
			},
		},
		{
			id: 'passive-voice-past-simple-15',
			form: 'affirmative',
			prompt: 'Америку було відкрито у 1492 році.',
			answer: 'America was discovered in 1492.',
			traps: {
				was: ['is', 'were', 'has'],
				discovered: ['discover', 'discovers', 'discovering'],
			},
		},
		{
			id: 'passive-voice-past-simple-16',
			form: 'affirmative',
			prompt: 'Злодія було спіймано поліцією вчора.',
			answer: 'The thief was caught by the police yesterday.',
			accept: ['The thief was caught by {the|} police yesterday.'],
			traps: {
				was: ['is', 'were', 'has'],
				caught: ['catch', 'catched', 'catching'],
			},
		},
		{
			id: 'passive-voice-past-simple-17',
			form: 'affirmative',
			prompt: 'Ці яблука були зібрані минулого тижня.',
			answer: 'These apples were picked last week.',
			accept: ['These apples were {picked|harvested|gathered} last week.'],
			traps: {
				were: ['was', 'are', 'have'],
				picked: ['pick', 'picks', 'picking'],
			},
		},
		{
			id: 'passive-voice-past-simple-18',
			form: 'affirmative',
			prompt: 'Наш потяг було скасовано вчора.',
			answer: 'Our train was cancelled yesterday.',
			accept: ['Our train was {cancelled|canceled} yesterday.'],
			traps: {
				was: ['is', 'were', 'has'],
				cancelled: ['cancel', 'cancels', 'cancelling'],
			},
		},
		{
			id: 'passive-voice-past-simple-19',
			form: 'affirmative',
			prompt: 'Цей паркан було пофарбовано минулого тижня.',
			answer: 'This fence was painted last week.',
			traps: {
				was: ['is', 'were', 'has'],
				painted: ['paint', 'paints', 'painting'],
			},
		},
		{
			id: 'passive-voice-past-simple-20',
			form: 'affirmative',
			prompt: 'Цей фільм було знято у 1999 році.',
			answer: 'This film was made in 1999.',
			accept: [
				'This {film|movie} was {made|shot} in 1999.',
				'This movie was filmed in 1999.',
			],
			traps: { was: ['is', 'were', 'has'], made: ['make', 'maked', 'making'] },
		},
		{
			id: 'passive-voice-past-simple-21',
			form: 'affirmative',
			prompt: 'Цю школу було засновано у 1920 році.',
			answer: 'This school was founded in 1920.',
			accept: ['This school was {founded|established} in 1920.'],
			traps: {
				was: ['is', 'were', 'has'],
				founded: ['found', 'finded', 'founding'],
			},
		},
		{
			id: 'passive-voice-past-simple-22',
			form: 'affirmative',
			prompt: 'Цю посилку було доставлено вчора вранці.',
			answer: 'This parcel was delivered yesterday morning.',
			accept: ['This {parcel|package} was delivered yesterday morning.'],
			traps: {
				was: ['is', 'were', 'has'],
				delivered: ['deliver', 'delivers', 'delivering'],
			},
		},
		{
			id: 'passive-voice-past-simple-23',
			form: 'affirmative',
			prompt: 'Ці гроші були витрачені на нову машину минулого місяця.',
			answer: 'This money was spent on a new car last month.',
			traps: {
				was: ['were', 'is', 'are'],
				spent: ['spend', 'spended', 'spending'],
			},
		},
		{
			id: 'passive-voice-past-simple-24',
			form: 'affirmative',
			prompt: 'Ця новина була оголошена вчора.',
			answer: 'This news was announced yesterday.',
			traps: {
				was: ['were', 'is', 'has'],
				announced: ['announce', 'announces', 'announcing'],
			},
		},
		{
			id: 'passive-voice-past-simple-25',
			form: 'affirmative',
			prompt: "Ці дерева були посаджені моїм дідусем п'ятдесят років тому.",
			answer: 'These trees were planted by my grandfather fifty years ago.',
			accept: [
				'These trees were planted by my {grandfather|grandpa} fifty years ago.',
			],
			traps: {
				were: ['was', 'are', 'have'],
				planted: ['plant', 'plants', 'planting'],
			},
		},
		{
			id: 'passive-voice-past-simple-26',
			form: 'affirmative',
			prompt: "Мій велосипед було відремонтовано минулої п'ятниці.",
			answer: 'My bike was repaired last Friday.',
			accept: ['My {bike|bicycle} was {repaired|fixed} last Friday.'],
			traps: {
				was: ['is', 'were', 'has'],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-past-simple-27',
			form: 'affirmative',
			prompt: 'Цю книжку було перекладено українською у 2015 році.',
			answer: 'This book was translated into Ukrainian in 2015.',
			traps: {
				was: ['is', 'were', 'has'],
				translated: ['translate', 'translates', 'translating'],
			},
		},
		{
			id: 'passive-voice-past-simple-28',
			form: 'affirmative',
			prompt: 'Мої документи було перевірено на кордоні вчора.',
			answer: 'My documents were checked at the border yesterday.',
			traps: {
				were: ['was', 'are', 'have'],
				checked: ['check', 'checks', 'checking'],
			},
		},
		{
			id: 'passive-voice-past-simple-29',
			form: 'affirmative',
			prompt: 'Ці піраміди були збудовані тисячі років тому.',
			answer: 'These pyramids were built thousands of years ago.',
			traps: {
				were: ['was', 'are', 'have'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-past-simple-30',
			form: 'affirmative',
			prompt: 'Цей кінотеатр було закрито два роки тому.',
			answer: 'This cinema was closed two years ago.',
			accept: ['This {cinema|movie theater} was closed {down|} two years ago.'],
			traps: {
				was: ['is', 'were', 'has'],
				closed: ['close', 'closes', 'closing'],
			},
		},
		{
			id: 'passive-voice-past-simple-31',
			form: 'affirmative',
			prompt: 'Цю газету було надруковано вчора.',
			answer: 'This newspaper was printed yesterday.',
			traps: {
				was: ['is', 'were', 'has'],
				printed: ['print', 'prints', 'printing'],
			},
		},
		{
			id: 'passive-voice-past-simple-32',
			form: 'affirmative',
			prompt: 'Учора всі квитки було продано за годину.',
			answer: 'Yesterday all the tickets were sold in an hour.',
			accept: ['Yesterday all {the|} tickets were sold in {an|one} hour.'],
			traps: {
				were: ['was', 'are', 'have'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-past-simple-33',
			form: 'affirmative',
			prompt: 'Ці картини були вкрадені з музею минулого року.',
			answer: 'These paintings were stolen from the museum last year.',
			accept: [
				'These {paintings|pictures} were stolen from the museum last year.',
			],
			traps: {
				were: ['was', 'are', 'have'],
				stolen: ['stole', 'steal', 'stealed'],
			},
		},
		{
			id: 'passive-voice-past-simple-34',
			form: 'affirmative',
			prompt: 'Мого дідуся було поранено під час війни.',
			answer: 'My grandfather was wounded during the war.',
			accept: ['My {grandfather|grandpa} was wounded {during|in} the war.'],
			traps: {
				was: ['is', 'were', 'has'],
				wounded: ['wound', 'wounds', 'wounding'],
			},
		},
		{
			id: 'passive-voice-past-simple-35',
			form: 'affirmative',
			prompt: 'Вечерю було подано о восьмій.',
			answer: 'Dinner was served at eight.',
			accept: ['{Dinner|Supper} was served at eight.'],
			traps: {
				was: ['is', 'were', 'has'],
				served: ['serve', 'serves', 'serving'],
			},
		},
		{
			id: 'passive-voice-past-simple-36',
			form: 'affirmative',
			prompt: 'Цей лист було підписано директором учора.',
			answer: 'This letter was signed by the director yesterday.',
			traps: {
				was: ['is', 'were', 'has'],
				signed: ['sign', 'signs', 'signing'],
			},
		},
		{
			id: 'passive-voice-past-simple-37',
			form: 'affirmative',
			prompt: 'Перший супутник було запущено у 1957 році.',
			answer: 'The first satellite was launched in 1957.',
			traps: {
				was: ['is', 'were', 'has'],
				launched: ['launch', 'launches', 'launching'],
			},
		},
		{
			id: 'passive-voice-past-simple-38',
			form: 'affirmative',
			prompt: 'Його було звільнено минулого місяця.',
			answer: 'He was fired last month.',
			accept: ['He was {fired|dismissed|sacked} last month.'],
			traps: { was: ['is', 'were', 'has'], fired: ['fire', 'fires', 'firing'] },
		},
		{
			id: 'passive-voice-past-simple-39',
			form: 'affirmative',
			prompt: 'Дітей було врятовано пожежниками минулої ночі.',
			answer: 'The children were rescued by firefighters last night.',
			accept: [
				'The children were {rescued|saved} by {firefighters|firemen} last night.',
			],
			traps: {
				were: ['was', 'are', 'have'],
				rescued: ['rescue', 'rescues', 'rescuing'],
			},
		},
		{
			id: 'passive-voice-past-simple-40',
			form: 'affirmative',
			prompt: 'Ця ваза була розбита моїм котом учора.',
			answer: 'This vase was broken by my cat yesterday.',
			traps: {
				was: ['is', 'were', 'has'],
				broken: ['broke', 'break', 'breaked'],
			},
		},
		{
			id: 'passive-voice-past-simple-41',
			form: 'affirmative',
			prompt: 'Цю симфонію було написано Бетховеном.',
			answer: 'This symphony was written by Beethoven.',
			accept: ['This symphony was {written|composed} by Beethoven.'],
			traps: {
				was: ['is', 'were', 'has'],
				written: ['wrote', 'write', 'writed'],
			},
		},
		{
			id: 'passive-voice-past-simple-42',
			form: 'affirmative',
			prompt: 'Наш старий будинок було продано минулої весни.',
			answer: 'Our old house was sold last spring.',
			traps: {
				was: ['is', 'were', 'has'],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-past-simple-43',
			form: 'affirmative',
			prompt: 'Ці правила було змінено минулого року.',
			answer: 'These rules were changed last year.',
			traps: {
				were: ['was', 'are', 'have'],
				changed: ['change', 'changes', 'changing'],
			},
		},
		{
			id: 'passive-voice-past-simple-44',
			form: 'affirmative',
			prompt: 'Ці квіти були куплені на ринку сьогодні вранці.',
			answer: 'These flowers were bought at the market this morning.',
			accept: ['These flowers were bought {at|in} the market this morning.'],
			traps: {
				were: ['was', 'are', 'have'],
				bought: ['buy', 'buyed', 'brought'],
			},
		},
		{
			id: 'passive-voice-past-simple-45',
			form: 'affirmative',
			prompt: 'Цей собор було спроєктовано відомим архітектором.',
			answer: 'This cathedral was designed by a famous architect.',
			traps: {
				was: ['is', 'were', 'has'],
				designed: ['design', 'designs', 'designing'],
			},
		},
		{
			id: 'passive-voice-past-simple-46',
			form: 'question',
			prompt: 'Коли було збудовано цей міст?',
			answer: 'When was this bridge built?',
			traps: {
				was: ['is', 'were', 'did'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-past-simple-47',
			form: 'question',
			prompt: 'Коли було винайдено радіо?',
			answer: 'When was the radio invented?',
			accept: ['When was {the|} radio invented?'],
			traps: {
				was: ['is', 'were', 'did'],
				invented: ['invent', 'invents', 'inventing'],
			},
		},
		{
			id: 'passive-voice-past-simple-48',
			form: 'question',
			prompt: 'Ким була написана ця книжка?',
			answer: 'Who was this book written by?',
			accept: ['{Who was this book written by|By whom was this book written}?'],
			traps: {
				was: ['is', 'were', 'did'],
				written: ['write', 'writed', 'writing'],
			},
		},
		{
			id: 'passive-voice-past-simple-49',
			form: 'question',
			prompt: 'Твій телефон було вкрадено вчора?',
			answer: 'Was your phone stolen yesterday?',
			traps: {
				Was: ['Is', 'Were', 'Did'],
				stolen: ['stole', 'steal', 'stealed'],
			},
		},
		{
			id: 'passive-voice-past-simple-50',
			form: 'question',
			prompt: 'Де були зроблені ці фотографії?',
			answer: 'Where were these photos taken?',
			accept: ['Where were these {photos|photographs|pictures} taken?'],
			traps: { were: ['was', 'are', 'did'], taken: ['took', 'take', 'taked'] },
		},
		{
			id: 'passive-voice-past-simple-51',
			form: 'question',
			prompt: 'Коли було засновано цей університет?',
			answer: 'When was this university founded?',
			accept: ['When was this university {founded|established}?'],
			traps: {
				was: ['is', 'were', 'did'],
				founded: ['found', 'finded', 'founding'],
			},
		},
		{
			id: 'passive-voice-past-simple-52',
			form: 'question',
			prompt: 'Твій рейс було скасовано вчора?',
			answer: 'Was your flight cancelled yesterday?',
			accept: ['Was your flight {cancelled|canceled} yesterday?'],
			traps: {
				Was: ['Is', 'Were', 'Has'],
				cancelled: ['cancel', 'cancels', 'cancelling'],
			},
		},
		{
			id: 'passive-voice-past-simple-53',
			form: 'question',
			prompt: 'Скільки гостей було запрошено на вчорашню вечірку?',
			answer: "How many guests were invited to yesterday's party?",
			traps: {
				were: ['was', 'are', 'did'],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-past-simple-54',
			form: 'question',
			prompt: 'Ким було збудовано цей замок?',
			answer: 'Who was this castle built by?',
			accept: ['{Who was this castle built by|By whom was this castle built}?'],
			traps: {
				was: ['is', 'were', 'did'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-past-simple-55',
			form: 'question',
			prompt: 'Ці гроші було знайдено на вулиці?',
			answer: 'Was this money found in the street?',
			accept: ['Was this money found {in|on} the street?'],
			traps: {
				Was: ['Were', 'Is', 'Did'],
				found: ['find', 'finded', 'founded'],
			},
		},
		{
			id: 'passive-voice-past-simple-56',
			form: 'question',
			prompt: 'Скільки будинків було зруйновано під час землетрусу?',
			answer: 'How many houses were destroyed during the earthquake?',
			accept: ['How many houses were destroyed {during|in} the earthquake?'],
			traps: {
				were: ['was', 'are', 'did'],
				destroyed: ['destroy', 'destroys', 'destroying'],
			},
		},
		{
			id: 'passive-voice-past-simple-57',
			form: 'question',
			prompt: 'Де було знайдено ці монети минулого року?',
			answer: 'Where were these coins found last year?',
			traps: {
				were: ['was', 'are', 'did'],
				found: ['find', 'finded', 'founded'],
			},
		},
		{
			id: 'passive-voice-past-simple-58',
			form: 'question',
			prompt: 'Чому цей магазин було закрито минулого місяця?',
			answer: 'Why was this shop closed last month?',
			accept: ['Why was this {shop|store} closed {down|} last month?'],
			traps: {
				was: ['is', 'were', 'did'],
				closed: ['close', 'closes', 'closing'],
			},
		},
		{
			id: 'passive-voice-past-simple-59',
			form: 'question',
			prompt: 'Цю посилку було відправлено вчора?',
			answer: 'Was this parcel sent yesterday?',
			accept: ['Was this {parcel|package} sent yesterday?'],
			traps: {
				Was: ['Is', 'Were', 'Did'],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-past-simple-60',
			form: 'question',
			prompt: 'Коли було написано цю пісню?',
			answer: 'When was this song written?',
			accept: ['When was this song {written|composed}?'],
			traps: {
				was: ['is', 'were', 'did'],
				written: ['wrote', 'writed', 'writing'],
			},
		},
		{
			id: 'passive-voice-past-simple-61',
			form: 'question',
			prompt: 'Цього чоловіка було заарештовано вчора?',
			answer: 'Was this man arrested yesterday?',
			traps: {
				Was: ['Is', 'Were', 'Did'],
				arrested: ['arrest', 'arrests', 'arresting'],
			},
		},
		{
			id: 'passive-voice-past-simple-62',
			form: 'question',
			prompt: 'Коли було посаджено цей сад?',
			answer: 'When was this garden planted?',
			accept: ['When was this {garden|orchard} planted?'],
			traps: {
				was: ['is', 'were', 'did'],
				planted: ['plant', 'plants', 'planting'],
			},
		},
		{
			id: 'passive-voice-past-simple-63',
			form: 'question',
			prompt: 'Коли було видано твій паспорт?',
			answer: 'When was your passport issued?',
			traps: {
				was: ['is', 'were', 'did'],
				issued: ['issue', 'issues', 'issuing'],
			},
		},
		{
			id: 'passive-voice-past-simple-64',
			form: 'question',
			prompt: 'Де народилася твоя бабуся?',
			answer: 'Where was your grandmother born?',
			accept: ['Where was your {grandmother|grandma} born?'],
			traps: { was: ['is', 'were', 'did'], born: ['borned', 'bore', 'birth'] },
		},
		{
			id: 'passive-voice-past-simple-65',
			form: 'question',
			prompt: 'Коли народився Тарас Шевченко?',
			answer: 'When was Taras Shevchenko born?',
			traps: { was: ['is', 'were', 'did'], born: ['borned', 'bore', 'birth'] },
		},
		{
			id: 'passive-voice-past-simple-66',
			form: 'question',
			prompt: "Твій комп'ютер було полагоджено вчора?",
			answer: 'Was your computer repaired yesterday?',
			accept: ['Was your computer {repaired|fixed} yesterday?'],
			traps: {
				Was: ['Is', 'Were', 'Did'],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-past-simple-67',
			form: 'question',
			prompt: 'Кого було запрошено на конференцію минулого року?',
			answer: 'Who was invited to the conference last year?',
			traps: {
				was: ['is', 'were', 'did'],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-past-simple-68',
			form: 'question',
			prompt: 'Що було вкрадено з твого будинку минулої ночі?',
			answer: 'What was stolen from your house last night?',
			accept: ['What was stolen from your {house|home} last night?'],
			traps: {
				was: ['is', 'were', 'did'],
				stolen: ['stole', 'steal', 'stealed'],
			},
		},
		{
			id: 'passive-voice-past-simple-69',
			form: 'question',
			prompt: 'Коли було зруйновано це місто?',
			answer: 'When was this city destroyed?',
			accept: ['When was this {city|town} destroyed?'],
			traps: {
				was: ['is', 'were', 'did'],
				destroyed: ['destroy', 'destroys', 'destroying'],
			},
		},
		{
			id: 'passive-voice-past-simple-70',
			form: 'question',
			prompt: 'Чому тебе було звільнено?',
			answer: 'Why were you fired?',
			accept: ['Why were you {fired|dismissed|sacked}?'],
			traps: {
				were: ['was', 'are', 'did'],
				fired: ['fire', 'fires', 'firing'],
			},
		},
		{
			id: 'passive-voice-past-simple-71',
			form: 'question',
			prompt: 'Коли було надіслано це повідомлення?',
			answer: 'When was this message sent?',
			traps: {
				was: ['is', 'were', 'did'],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-past-simple-72',
			form: 'question',
			prompt: 'Цей роман було перекладено англійською минулого року?',
			answer: 'Was this novel translated into English last year?',
			traps: {
				Was: ['Is', 'Were', 'Did'],
				translated: ['translate', 'translates', 'translating'],
			},
		},
		{
			id: 'passive-voice-past-simple-73',
			form: 'question',
			prompt: 'Коли було відремонтовано цю дорогу?',
			answer: 'When was this road repaired?',
			accept: ['When was this road {repaired|fixed}?'],
			traps: {
				was: ['is', 'were', 'did'],
				repaired: ['repair', 'repairs', 'repairing'],
			},
		},
		{
			id: 'passive-voice-past-simple-74',
			form: 'question',
			prompt: 'Чому нашу зустріч було скасовано вчора?',
			answer: 'Why was our meeting cancelled yesterday?',
			accept: ['Why was our meeting {cancelled|canceled} yesterday?'],
			traps: {
				was: ['is', 'were', 'did'],
				cancelled: ['cancel', 'cancels', 'cancelling'],
			},
		},
		{
			id: 'passive-voice-past-simple-75',
			form: 'question',
			prompt: 'Ці будинки було збудовано до війни?',
			answer: 'Were these houses built before the war?',
			traps: {
				Were: ['Was', 'Are', 'Did'],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-past-simple-76',
			form: 'negative',
			prompt: 'Цей лист не було надіслано вчора.',
			answer: "This letter wasn't sent yesterday.",
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				sent: ['send', 'sended', 'sending'],
			},
		},
		{
			id: 'passive-voice-past-simple-77',
			form: 'negative',
			prompt: 'Ця церква не була зруйнована під час війни.',
			answer: "This church wasn't destroyed during the war.",
			accept: ["This church wasn't destroyed {during|in} the war."],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				destroyed: ['destroy', 'destroys', 'destroying'],
			},
		},
		{
			id: 'passive-voice-past-simple-78',
			form: 'negative',
			prompt: 'Нас не було запрошено на їхнє весілля минулого літа.',
			answer: "We weren't invited to their wedding last summer.",
			traps: {
				"weren't": ["wasn't", "aren't", "didn't"],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-past-simple-79',
			form: 'negative',
			prompt: 'Ці фотографії не були зроблені мною.',
			answer: "These photos weren't taken by me.",
			accept: ["These {photos|photographs|pictures} weren't taken by me."],
			traps: {
				"weren't": ["wasn't", "aren't", "didn't"],
				taken: ['took', 'take', 'taked'],
				me: ['I', 'my'],
			},
		},
		{
			id: 'passive-voice-past-simple-80',
			form: 'negative',
			prompt: 'Моя валіза не була відкрита на митниці вчора.',
			answer: "My suitcase wasn't opened at customs yesterday.",
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				opened: ['open', 'opens', 'opening'],
			},
		},
		{
			id: 'passive-voice-past-simple-81',
			form: 'negative',
			prompt: 'Ці вікна не були вимиті минулого тижня.',
			answer: "These windows weren't washed last week.",
			accept: ["These windows weren't {washed|cleaned} last week."],
			traps: {
				"weren't": ["wasn't", "aren't", "didn't"],
				washed: ['wash', 'washes', 'washing'],
			},
		},
		{
			id: 'passive-voice-past-simple-82',
			form: 'negative',
			prompt: 'Вхідні двері не були замкнені вчора ввечері.',
			answer: "The front door wasn't locked last night.",
			accept: ["The front door wasn't locked {last night|yesterday evening}."],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				locked: ['lock', 'locks', 'locking'],
			},
		},
		{
			id: 'passive-voice-past-simple-83',
			form: 'negative',
			prompt: 'Цей портрет не був намальований Пікассо.',
			answer: "This portrait wasn't painted by Picasso.",
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				painted: ['paint', 'paints', 'painting'],
			},
		},
		{
			id: 'passive-voice-past-simple-84',
			form: 'negative',
			prompt: 'Цей роман не був написаний Франком.',
			answer: "This novel wasn't written by Franko.",
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				written: ['wrote', 'write', 'writed'],
			},
		},
		{
			id: 'passive-voice-past-simple-85',
			form: 'negative',
			prompt: 'Ніхто не був поранений під час аварії.',
			answer: 'Nobody was injured in the accident.',
			accept: ['{Nobody|No one} was {injured|hurt} {in|during} the accident.'],
			traps: {
				was: ['were', 'is', 'has'],
				injured: ['injure', 'injures', 'injuring'],
			},
		},
		{
			id: 'passive-voice-past-simple-86',
			form: 'negative',
			prompt: 'Цей суп не був приготований моєю мамою.',
			answer: "This soup wasn't made by my mother.",
			accept: ["This soup wasn't {made|cooked} by my {mother|mum|mom}."],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				made: ['make', 'maked', 'making'],
			},
		},
		{
			id: 'passive-voice-past-simple-87',
			form: 'negative',
			prompt: 'Цей проєкт не був закінчений вчасно.',
			answer: "This project wasn't finished on time.",
			accept: ["This project wasn't {finished|completed} on time."],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				finished: ['finish', 'finishes', 'finishing'],
			},
		},
		{
			id: 'passive-voice-past-simple-88',
			form: 'negative',
			prompt: 'Ці документи не були підписані директором учора.',
			answer: "These documents weren't signed by the director yesterday.",
			traps: {
				"weren't": ["wasn't", "aren't", "didn't"],
				signed: ['sign', 'signs', 'signing'],
			},
		},
		{
			id: 'passive-voice-past-simple-89',
			form: 'negative',
			prompt: 'Цей міст не був збудований римлянами.',
			answer: "This bridge wasn't built by the Romans.",
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				built: ['build', 'builded', 'building'],
			},
		},
		{
			id: 'passive-voice-past-simple-90',
			form: 'negative',
			prompt: 'Мій багаж не було доставлено вчасно.',
			answer: "My luggage wasn't delivered on time.",
			accept: ["My {luggage|baggage} wasn't delivered on time."],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				delivered: ['deliver', 'delivers', 'delivering'],
			},
		},
		{
			id: 'passive-voice-past-simple-91',
			form: 'negative',
			prompt: 'Ці помилки не були помічені вчителем під час іспиту.',
			answer: "These mistakes weren't noticed by the teacher during the exam.",
			traps: {
				"weren't": ["wasn't", "aren't", "didn't"],
				noticed: ['notice', 'notices', 'noticing'],
			},
		},
		{
			id: 'passive-voice-past-simple-92',
			form: 'negative',
			prompt: 'Ключі не було знайдено вчора.',
			answer: "The keys weren't found yesterday.",
			traps: {
				"weren't": ["wasn't", "aren't", "didn't"],
				found: ['find', 'finded', 'founded'],
			},
		},
		{
			id: 'passive-voice-past-simple-93',
			form: 'negative',
			prompt: 'Ця кімната не була прибрана вчора.',
			answer: "This room wasn't cleaned yesterday.",
			accept: ["This room wasn't {cleaned|tidied} yesterday."],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				cleaned: ['clean', 'cleans', 'cleaning'],
			},
		},
		{
			id: 'passive-voice-past-simple-94',
			form: 'negative',
			prompt: 'Ці квіти не були политі минулого тижня.',
			answer: "These flowers weren't watered last week.",
			traps: {
				"weren't": ["wasn't", "aren't", "didn't"],
				watered: ['water', 'waters', 'watering'],
			},
		},
		{
			id: 'passive-voice-past-simple-95',
			form: 'negative',
			prompt: 'Цей будинок не був проданий минулого року.',
			answer: "This house wasn't sold last year.",
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				sold: ['sell', 'selled', 'selling'],
			},
		},
		{
			id: 'passive-voice-past-simple-96',
			form: 'negative',
			prompt: 'Цей фільм не був знятий у Голлівуді.',
			answer: "This film wasn't made in Hollywood.",
			accept: [
				"This {film|movie} wasn't {made|shot} in Hollywood.",
				"This movie wasn't filmed in Hollywood.",
			],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				made: ['make', 'maked', 'making'],
			},
		},
		{
			id: 'passive-voice-past-simple-97',
			form: 'negative',
			prompt: 'Ця школа не була закрита під час війни.',
			answer: "This school wasn't closed during the war.",
			accept: ["This school wasn't closed {during|in} the war."],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				closed: ['close', 'closes', 'closing'],
			},
		},
		{
			id: 'passive-voice-past-simple-98',
			form: 'negative',
			prompt: 'Вона не була запрошена на мою вечірку минулої суботи.',
			answer: "She wasn't invited to my party last Saturday.",
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				invited: ['invite', 'invites', 'inviting'],
			},
		},
		{
			id: 'passive-voice-past-simple-99',
			form: 'negative',
			prompt: 'Ці гриби не були зібрані в лісі.',
			answer: "These mushrooms weren't picked in the forest.",
			accept: [
				"These mushrooms weren't {picked|gathered|collected} in the {forest|woods}.",
			],
			traps: {
				"weren't": ["wasn't", "aren't", "didn't"],
				picked: ['pick', 'picks', 'picking'],
			},
		},
		{
			id: 'passive-voice-past-simple-100',
			form: 'negative',
			prompt: 'Цей телефон не був виготовлений у Китаї.',
			answer: "This phone wasn't made in China.",
			accept: ["This phone wasn't {made|produced|manufactured} in China."],
			traps: {
				"wasn't": ["weren't", "isn't", "didn't"],
				made: ['make', 'maked', 'making'],
			},
		},
	],
})
