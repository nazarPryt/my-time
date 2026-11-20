import { defineTopic } from '../../define-topic'

export const usedTo = defineTopic({
	id: 'used-to',
	level: 'intermediate',
	title: 'Used to',
	subtitle: 'Конструкція used to',
	rule: [
		{
			kind: 'usage',
			explanation:
				'used to + дієслово описує звички та стани в минулому, яких тепер уже немає. Українською це «раніше», «колись», «в дитинстві … завжди». Past Simple теж можна вжити, але used to підкреслює, що зараз усе інакше. Would вживають лише для повторюваних дій у минулому, ніколи для станів (live, have, be, know, like).',
			examples: [
				{
					text: 'We used to go camping every summer.',
					translation: 'Раніше ми щоліта їздили в похід.',
				},
				{
					text: 'This café used to be a bookshop.',
					translation: 'Колись це кафе було книгарнею.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				'Підмет + used to + дієслово без закінчень для всіх осіб: I used to, she used to, they used to. Після used to не буває -ing.',
			examples: [
				{
					text: 'She used to travel a lot.',
					translation: 'Раніше вона багато подорожувала.',
				},
				{
					text: 'There used to be a market here.',
					translation: 'Колись тут був ринок.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Did + підмет + use to + дієслово? Після did пишемо use, а не used. Якщо питаємо про підмет (who, what), did не потрібне: Who used to…?',
			examples: [
				{
					text: 'Did you use to swim in the river?',
					translation: 'Ти раніше купався в річці?',
				},
				{
					text: 'Who used to drive you to school?',
					translation: 'Хто раніше возив тебе до школи?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"didn't (did not) + use to + дієслово, теж без -d. Зі словом «ніколи» — never used to.",
			examples: [
				{
					text: "He didn't use to like spicy food.",
					translation: 'Раніше він не любив гострої їжі.',
				},
				{
					text: 'They never used to lock the door.',
					translation: 'Раніше вони ніколи не замикали двері.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'used-to-1',
			form: 'affirmative',
			prompt: 'Раніше я жив у Львові.',
			answer: 'I used to live in Lviv.',
			traps: {
				used: ['use', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-2',
			form: 'affirmative',
			prompt: 'Раніше він курив.',
			answer: 'He used to smoke.',
		},
		{
			id: 'used-to-3',
			form: 'affirmative',
			prompt: 'Раніше ми жили біля моря.',
			answer: 'We used to live near the sea.',
			accept: ['We used to live {near|by} the sea.'],
			traps: {
				used: ['use', 'would', 'using'],
				live: ['living', 'lived'],
			},
		},
		{
			id: 'used-to-4',
			form: 'affirmative',
			prompt: "Раніше вона була дуже сором'язливою.",
			answer: 'She used to be very shy.',
			accept: ['She {used to be|was} very shy.'],
			traps: {
				used: ['would', 'use', 'uses'],
				be: ['being', 'been'],
			},
		},
		{
			id: 'used-to-5',
			form: 'affirmative',
			prompt: 'Колись тут була школа.',
			answer: 'There used to be a school here.',
			accept: ['There {used to be|was} a school here.'],
			traps: {
				used: ['use', 'would', 'using'],
				be: ['being', 'is'],
			},
		},
		{
			id: 'used-to-6',
			form: 'affirmative',
			prompt: 'Раніше в мене був собака.',
			answer: 'I used to have a dog.',
			accept: ['I {used to have|had} a dog.'],
			traps: {
				used: ['would', 'use', 'uses'],
				have: ['having', 'has'],
			},
		},
		{
			id: 'used-to-7',
			form: 'affirmative',
			prompt: 'Раніше мій брат працював у банку.',
			answer: 'My brother used to work in a bank.',
			accept: ['My brother used to work {in|at} a bank.'],
			traps: {
				used: ['use', 'uses', 'using'],
				work: ['working', 'worked', 'works'],
			},
		},
		{
			id: 'used-to-8',
			form: 'affirmative',
			prompt: 'Раніше він бігав у парку щоранку.',
			answer: 'He used to run in the park every morning.',
			traps: {
				used: ['use', 'uses', 'using'],
				run: ['running', 'ran', 'runs'],
			},
		},
		{
			id: 'used-to-9',
			form: 'affirmative',
			prompt: 'Раніше я пив багато кави.',
			answer: 'I used to drink a lot of coffee.',
			traps: {
				used: ['use', 'uses', 'using'],
				drink: ['drinking', 'drank'],
			},
		},
		{
			id: 'used-to-10',
			form: 'affirmative',
			prompt: 'Раніше я боявся темряви.',
			answer: 'I used to be afraid of the dark.',
			accept: ['I {used to be|was} afraid of the dark.'],
			traps: {
				used: ['would', 'use', 'using'],
				be: ['being', 'am'],
			},
		},
		{
			id: 'used-to-11',
			form: 'affirmative',
			prompt: 'Раніше вони щосуботи ходили в кіно.',
			answer: 'They used to go to the cinema every Saturday.',
			accept: [
				'They used to go to the {cinema|movies} {every Saturday|on Saturdays}.',
			],
			traps: {
				used: ['use', 'uses', 'using'],
				go: ['going', 'went', 'goes'],
			},
		},
		{
			id: 'used-to-12',
			form: 'affirmative',
			prompt: 'Раніше на цій вулиці було багато дерев.',
			answer: 'There used to be many trees on this street.',
			accept: [
				'There {used to be|were} {many|a lot of} trees {on|in} this street.',
			],
			traps: {
				used: ['use', 'would', 'using'],
				be: ['being', 'are'],
			},
		},
		{
			id: 'used-to-13',
			form: 'affirmative',
			prompt: 'Раніше моя сестра носила окуляри.',
			answer: 'My sister used to wear glasses.',
			traps: {
				used: ['use', 'uses', 'using'],
				wear: ['wearing', 'wore', 'wears'],
			},
		},
		{
			id: 'used-to-14',
			form: 'affirmative',
			prompt: 'Раніше ми щоліта їздили в Одесу.',
			answer: 'We used to go to Odesa every summer.',
			traps: {
				used: ['use', 'uses', 'using'],
				go: ['going', 'went'],
			},
		},
		{
			id: 'used-to-15',
			form: 'affirmative',
			prompt: 'Раніше він грав на гітарі.',
			answer: 'He used to play the guitar.',
			accept: ['He used to play {the|} guitar.'],
			traps: {
				used: ['use', 'uses', 'using'],
				play: ['playing', 'played', 'plays'],
			},
		},
		{
			id: 'used-to-16',
			form: 'affirmative',
			prompt: 'Раніше я вставав дуже рано.',
			answer: 'I used to get up very early.',
			traps: {
				used: ['use', 'uses', 'using'],
				get: ['getting', 'got'],
			},
		},
		{
			id: 'used-to-17',
			form: 'affirmative',
			prompt: 'Раніше вона працювала вчителькою.',
			answer: 'She used to work as a teacher.',
			accept: ['She {used to work as|used to be|was} a teacher.'],
			traps: {
				used: ['use', 'uses', 'using'],
				work: ['working', 'worked'],
			},
		},
		{
			id: 'used-to-18',
			form: 'affirmative',
			prompt: 'Раніше наш будинок був білим.',
			answer: 'Our house used to be white.',
			accept: ['Our house {used to be|was} white.'],
			traps: {
				used: ['would', 'use', 'uses'],
				be: ['being', 'is'],
			},
		},
		{
			id: 'used-to-19',
			form: 'affirmative',
			prompt: 'Раніше він їздив на роботу автобусом.',
			answer: 'He used to go to work by bus.',
			accept: ['He used to {go|get|travel} to work by bus.'],
			traps: {
				used: ['use', 'uses', 'using'],
				go: ['going', 'went', 'goes'],
			},
		},
		{
			id: 'used-to-20',
			form: 'affirmative',
			prompt: "Раніше я знав його номер напам'ять.",
			answer: 'I used to know his number by heart.',
			traps: {
				used: ['would', 'use', 'uses'],
				know: ['knowing', 'knew'],
			},
		},
		{
			id: 'used-to-21',
			form: 'affirmative',
			prompt: 'Раніше ми багато сварилися.',
			answer: 'We used to argue a lot.',
			accept: ['We used to {argue|quarrel} a lot.'],
			traps: {
				used: ['use', 'uses', 'using'],
				argue: ['arguing', 'argued'],
			},
		},
		{
			id: 'used-to-22',
			form: 'affirmative',
			prompt: 'Раніше мій дідусь курив люльку.',
			answer: 'My grandfather used to smoke a pipe.',
			accept: ['My {grandfather|grandpa} used to smoke a pipe.'],
			traps: {
				used: ['use', 'uses', 'using'],
				smoke: ['smoking', 'smoked', 'smokes'],
			},
		},
		{
			id: 'used-to-23',
			form: 'affirmative',
			prompt: 'Колись тут стояв старий будинок.',
			answer: 'There used to be an old house here.',
			accept: [
				'There {used to be|was} an old house here.',
				'An old house used to stand here.',
			],
			traps: {
				used: ['use', 'would', 'using'],
			},
		},
		{
			id: 'used-to-24',
			form: 'affirmative',
			prompt: 'Раніше Олена працювала в Польщі.',
			answer: 'Olena used to work in Poland.',
			traps: {
				used: ['use', 'uses', 'using'],
				work: ['working', 'worked', 'works'],
			},
		},
		{
			id: 'used-to-25',
			form: 'affirmative',
			prompt: 'Раніше я ненавидів овочі.',
			answer: 'I used to hate vegetables.',
			traps: {
				used: ['would', 'use', 'uses'],
				hate: ['hating', 'hated'],
			},
		},
		{
			id: 'used-to-26',
			form: 'affirmative',
			prompt: 'Раніше він був дуже худим.',
			answer: 'He used to be very thin.',
			accept: ['He {used to be|was} very {thin|skinny|slim}.'],
			traps: {
				used: ['would', 'use', 'uses'],
				be: ['being', 'is'],
			},
		},
		{
			id: 'used-to-27',
			form: 'affirmative',
			prompt: 'Раніше ми ходили до школи пішки.',
			answer: 'We used to walk to school.',
			accept: ['We used to {walk to school|go to school on foot}.'],
			traps: {
				used: ['use', 'uses', 'using'],
				walk: ['walking', 'walked'],
			},
		},
		{
			id: 'used-to-28',
			form: 'affirmative',
			prompt: 'Раніше вона писала вірші.',
			answer: 'She used to write poems.',
			accept: ['She used to write {poems|poetry}.'],
			traps: {
				used: ['use', 'uses', 'using'],
				write: ['writing', 'wrote', 'writes'],
			},
		},
		{
			id: 'used-to-29',
			form: 'affirmative',
			prompt: 'Раніше в нас був старий телевізор.',
			answer: 'We used to have an old TV.',
			accept: ['We {used to have|had} an old {TV|television}.'],
			traps: {
				used: ['would', 'use', 'uses'],
				have: ['having', 'has'],
			},
		},
		{
			id: 'used-to-30',
			form: 'affirmative',
			prompt: 'Колись цей ресторан був дуже популярним.',
			answer: 'This restaurant used to be very popular.',
			accept: ['This restaurant {used to be|was} very popular.'],
			traps: {
				used: ['would', 'use', 'uses'],
				be: ['being', 'is'],
			},
		},
		{
			id: 'used-to-31',
			form: 'affirmative',
			prompt: 'Раніше я щодня їздив на велосипеді.',
			answer: 'I used to ride a bike every day.',
			accept: ['I used to {ride a bike|ride a bicycle|cycle} every day.'],
			traps: {
				used: ['use', 'uses', 'using'],
				ride: ['riding', 'rode'],
			},
		},
		{
			id: 'used-to-32',
			form: 'affirmative',
			prompt: 'Раніше він збирав марки.',
			answer: 'He used to collect stamps.',
			traps: {
				used: ['use', 'uses', 'using'],
				collect: ['collecting', 'collected', 'collects'],
			},
		},
		{
			id: 'used-to-33',
			form: 'affirmative',
			prompt: 'Раніше мої батьки вирощували овочі.',
			answer: 'My parents used to grow vegetables.',
			traps: {
				used: ['use', 'uses', 'using'],
				grow: ['growing', 'grew'],
			},
		},
		{
			id: 'used-to-34',
			form: 'affirmative',
			prompt: 'Раніше ти так гарно співала.',
			answer: 'You used to sing so beautifully.',
			accept: ['You used to sing so {beautifully|well}.'],
			traps: {
				used: ['use', 'uses', 'using'],
				sing: ['singing', 'sang', 'sung'],
			},
		},
		{
			id: 'used-to-35',
			form: 'affirmative',
			prompt: 'В дитинстві він щодня грав у футбол.',
			answer: 'As a child, he used to play football every day.',
			accept: [
				'{As a child|When he was a child}, he {used to|would} play football every day.',
			],
			traps: {
				used: ['use', 'uses', 'using'],
				play: ['playing', 'played'],
			},
		},
		{
			id: 'used-to-36',
			form: 'affirmative',
			prompt: 'Раніше ми щонеділі ходили до церкви.',
			answer: 'We used to go to church every Sunday.',
			accept: ['We used to go to church {every Sunday|on Sundays}.'],
			traps: {
				used: ['use', 'uses', 'using'],
				go: ['going', 'went'],
			},
		},
		{
			id: 'used-to-37',
			form: 'affirmative',
			prompt: 'Раніше він працював допізна.',
			answer: 'He used to work late.',
			accept: ['He used to work {late|until late}.'],
			traps: {
				used: ['use', 'uses', 'using'],
				work: ['working', 'worked', 'works'],
			},
		},
		{
			id: 'used-to-38',
			form: 'affirmative',
			prompt: 'Раніше вона любила джаз.',
			answer: 'She used to love jazz.',
			accept: ['She used to {love|like} jazz.'],
			traps: {
				used: ['would', 'use', 'uses'],
				love: ['loving', 'loved', 'loves'],
			},
		},
		{
			id: 'used-to-39',
			form: 'affirmative',
			prompt: 'Раніше в мене було довге волосся.',
			answer: 'I used to have long hair.',
			accept: ['I {used to have|had} long hair.'],
			traps: {
				used: ['would', 'use', 'uses'],
				have: ['having', 'has'],
			},
		},
		{
			id: 'used-to-40',
			form: 'affirmative',
			prompt: 'Раніше цей магазин відчинявся о восьмій.',
			answer: 'This shop used to open at eight.',
			accept: ['This {shop|store} used to open at eight.'],
			traps: {
				used: ['use', 'uses', 'using'],
				open: ['opening', 'opened', 'opens'],
			},
		},
		{
			id: 'used-to-41',
			form: 'affirmative',
			prompt: 'Раніше мій брат багато їв.',
			answer: 'My brother used to eat a lot.',
			traps: {
				used: ['use', 'uses', 'using'],
				eat: ['eating', 'ate', 'eats'],
			},
		},
		{
			id: 'used-to-42',
			form: 'affirmative',
			prompt: 'Раніше люди писали листи від руки.',
			answer: 'People used to write letters by hand.',
			traps: {
				used: ['use', 'uses', 'using'],
				write: ['writing', 'wrote'],
			},
		},
		{
			id: 'used-to-43',
			form: 'affirmative',
			prompt: 'Раніше він щовечора дивився новини.',
			answer: 'He used to watch the news every evening.',
			traps: {
				used: ['use', 'uses', 'using'],
				watch: ['watching', 'watched', 'watches'],
			},
		},
		{
			id: 'used-to-44',
			form: 'affirmative',
			prompt: 'Раніше вони жили в маленькій квартирі.',
			answer: 'They used to live in a small flat.',
			accept: ['They used to live in a small {flat|apartment}.'],
			traps: {
				used: ['would', 'use', 'uses'],
				live: ['living', 'lived', 'lives'],
			},
		},
		{
			id: 'used-to-45',
			form: 'affirmative',
			prompt: 'В дитинстві я дуже любив мультфільми.',
			answer: 'As a child, I used to love cartoons.',
			accept: [
				'{As a child|When I was a child}, I used to {love|like} cartoons.',
			],
			traps: {
				used: ['would', 'use', 'uses'],
				love: ['loving', 'loved'],
			},
		},
		{
			id: 'used-to-46',
			form: 'question',
			prompt: 'Ти раніше жив у Києві?',
			answer: 'Did you use to live in Kyiv?',
			accept: ['Did you {use to|} live in Kyiv?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-47',
			form: 'question',
			prompt: 'Ти раніше курив?',
			answer: 'Did you use to smoke?',
			accept: ['Did you {use to|} smoke?'],
			traps: {
				Did: ['Do', 'Does'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-48',
			form: 'question',
			prompt: 'Він раніше грав у футбол?',
			answer: 'Did he use to play football?',
			accept: ['Did he {use to|} play football?'],
			traps: {
				Did: ['Does', 'Was'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-49',
			form: 'question',
			prompt: 'Де ти раніше працював?',
			answer: 'Where did you use to work?',
			accept: ['Where did you {use to|} work?'],
			traps: {
				did: ['do', 'were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-50',
			form: 'question',
			prompt: 'Де вони раніше жили?',
			answer: 'Where did they use to live?',
			accept: ['Where did they {use to|} live?'],
			traps: {
				did: ['do', 'were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-51',
			form: 'question',
			prompt: 'Що ти раніше їв на сніданок?',
			answer: 'What did you use to eat for breakfast?',
			accept: ['What did you {use to|} {eat|have} for breakfast?'],
			traps: {
				did: ['do', 'were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-52',
			form: 'question',
			prompt: 'Ти раніше носив бороду?',
			answer: 'Did you use to have a beard?',
			accept: ['Did you {use to|} {have|wear} a beard?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-53',
			form: 'question',
			prompt: 'У тебе раніше був кіт?',
			answer: 'Did you use to have a cat?',
			accept: ['Did you {use to|} have a cat?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-54',
			form: 'question',
			prompt: 'Тут раніше був магазин?',
			answer: 'Did there use to be a shop here?',
			accept: ['{Did there use to be|Was there} a {shop|store} here?'],
			traps: {
				Did: ['Do', 'Does'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-55',
			form: 'question',
			prompt: 'Він раніше був учителем?',
			answer: 'Did he use to be a teacher?',
			accept: [
				'{Did he use to be|Did he use to work as|Was he|Did he work as} a teacher?',
			],
			traps: {
				Did: ['Does', 'Do'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-56',
			form: 'question',
			prompt: 'Ти раніше боявся собак?',
			answer: 'Did you use to be afraid of dogs?',
			accept: ['{Did you use to be|Were you} afraid of dogs?'],
			traps: {
				Did: ['Do', 'Does'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-57',
			form: 'question',
			prompt: 'Хто раніше жив у цьому будинку?',
			answer: 'Who used to live in this house?',
			traps: {
				used: ['use', 'uses', 'using'],
				live: ['living', 'lived'],
			},
		},
		{
			id: 'used-to-58',
			form: 'question',
			prompt: 'Хто раніше готував у вашій родині?',
			answer: 'Who used to cook in your family?',
			traps: {
				used: ['use', 'uses', 'using'],
				cook: ['cooking', 'cooked'],
			},
		},
		{
			id: 'used-to-59',
			form: 'question',
			prompt: 'Як ви раніше добиралися на роботу?',
			answer: 'How did you use to get to work?',
			accept: ['How did you {use to|} {get|go} to work?'],
			traps: {
				did: ['do', 'were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-60',
			form: 'question',
			prompt: 'Ви раніше сварилися?',
			answer: 'Did you use to argue?',
			accept: ['Did you {use to|} {argue|quarrel}?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-61',
			form: 'question',
			prompt: 'Вона раніше співала в хорі?',
			answer: 'Did she use to sing in a choir?',
			accept: ['Did she {use to|} sing in {a|the} choir?'],
			traps: {
				Did: ['Does', 'Was'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-62',
			form: 'question',
			prompt: 'Що тут раніше було?',
			answer: 'What used to be here?',
			accept: ['What {used to be|was} here?'],
			traps: {
				used: ['use', 'uses', 'using'],
				be: ['being', 'is'],
			},
		},
		{
			id: 'used-to-63',
			form: 'question',
			prompt: 'Твій батько раніше працював на заводі?',
			answer: 'Did your father use to work in a factory?',
			accept: ['Did your father {use to|} work {in|at} a factory?'],
			traps: {
				Did: ['Does', 'Was'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-64',
			form: 'question',
			prompt: 'Ти раніше займався спортом?',
			answer: 'Did you use to do sport?',
			accept: ['Did you {use to|} do {sport|sports}?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-65',
			form: 'question',
			prompt: 'Ви раніше жили разом?',
			answer: 'Did you use to live together?',
			accept: ['Did you {use to|} live together?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-66',
			form: 'question',
			prompt: 'Яку музику ти раніше слухав?',
			answer: 'What music did you use to listen to?',
			accept: ['What music did you {use to|} listen to?'],
			traps: {
				did: ['do', 'were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-67',
			form: 'question',
			prompt: 'О котрій ти раніше вставав?',
			answer: 'What time did you use to get up?',
			accept: ['What time did you {use to|} get up?'],
			traps: {
				did: ['do', 'were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-68',
			form: 'question',
			prompt: 'Хто раніше був вашим учителем англійської?',
			answer: 'Who used to be your English teacher?',
			accept: ['Who {used to be|was} your English teacher?'],
			traps: {
				used: ['use', 'uses', 'using'],
				be: ['being', 'is'],
			},
		},
		{
			id: 'used-to-69',
			form: 'question',
			prompt: 'Він раніше жив сам?',
			answer: 'Did he use to live alone?',
			accept: ['Did he {use to|} live {alone|on his own}?'],
			traps: {
				Did: ['Does', 'Was'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-70',
			form: 'question',
			prompt: 'Ви раніше щоліта їздили на море?',
			answer: 'Did you use to go to the sea every summer?',
			accept: ['Did you {use to|} go to the {sea|seaside} every summer?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-71',
			form: 'question',
			prompt: 'Цей парк раніше був більшим?',
			answer: 'Did this park use to be bigger?',
			accept: ['{Did this park use to be|Was this park} bigger?'],
			traps: {
				Did: ['Does', 'Do'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-72',
			form: 'question',
			prompt: 'Ти раніше любив каву?',
			answer: 'Did you use to like coffee?',
			accept: ['Did you {use to|} like coffee?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-73',
			form: 'question',
			prompt: 'Твої діти раніше ходили до школи пішки?',
			answer: 'Did your children use to walk to school?',
			accept: ['Did your children {use to|} walk to school?'],
			traps: {
				Did: ['Do', 'Were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-74',
			form: 'question',
			prompt: 'Чому ти раніше так багато працював?',
			answer: 'Why did you use to work so much?',
			accept: ['Why did you {use to|} work so {much|hard}?'],
			traps: {
				did: ['do', 'were'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-75',
			form: 'question',
			prompt: 'Він раніше грав на піаніно?',
			answer: 'Did he use to play the piano?',
			accept: ['Did he {use to|} play {the|} piano?'],
			traps: {
				Did: ['Does', 'Was'],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-76',
			form: 'negative',
			prompt: 'Раніше я не любив каву.',
			answer: "I didn't use to like coffee.",
			accept: ["I didn't {use to|} like coffee."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-77',
			form: 'negative',
			prompt: 'Раніше він не пив чаю.',
			answer: "He didn't use to drink tea.",
			accept: ["He didn't {use to|} drink tea."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-78',
			form: 'negative',
			prompt: 'Раніше в нас не було машини.',
			answer: "We didn't use to have a car.",
			accept: ["We didn't {use to|} have a car."],
			traps: {
				"didn't": ["don't", "weren't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-79',
			form: 'negative',
			prompt: 'Раніше вона не працювала по суботах.',
			answer: "She didn't use to work on Saturdays.",
			accept: ["She didn't {use to|} work on Saturdays."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-80',
			form: 'negative',
			prompt: 'Раніше тут не було світлофора.',
			answer: "There didn't use to be a traffic light here.",
			accept: ["{There didn't use to be|There wasn't} a traffic light here."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-81',
			form: 'negative',
			prompt: 'Раніше я ніколи не дивився футбол.',
			answer: 'I never used to watch football.',
			traps: {
				used: ['use', 'uses', 'using'],
				watch: ['watching', 'watched'],
			},
		},
		{
			id: 'used-to-82',
			form: 'negative',
			prompt: 'Раніше він не носив краваток.',
			answer: "He didn't use to wear ties.",
			accept: ["He didn't {use to|} wear ties."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-83',
			form: 'negative',
			prompt: 'Раніше я не розумів математики.',
			answer: "I didn't use to understand maths.",
			accept: ["I didn't {use to|} understand {maths|math}."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-84',
			form: 'negative',
			prompt: 'Раніше вони не розмовляли англійською.',
			answer: "They didn't use to speak English.",
			accept: ["They didn't {use to|} speak English."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-85',
			form: 'negative',
			prompt: 'Раніше вона не була такою сміливою.',
			answer: "She didn't use to be so brave.",
			accept: ["{She didn't use to be|She wasn't} so brave."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-86',
			form: 'negative',
			prompt: "Раніше ми не їли м'яса.",
			answer: "We didn't use to eat meat.",
			accept: ["We didn't {use to|} eat meat."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-87',
			form: 'negative',
			prompt: 'Раніше мій брат не займався спортом.',
			answer: "My brother didn't use to do sport.",
			accept: ["My brother didn't {use to|} do {sport|sports}."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-88',
			form: 'negative',
			prompt: 'Раніше в нашому селі не було школи.',
			answer: "There didn't use to be a school in our village.",
			accept: [
				"{There didn't use to be|There wasn't} a school in our village.",
			],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-89',
			form: 'negative',
			prompt: 'Раніше я ніколи не ходив туди пішки.',
			answer: 'I never used to walk there.',
			traps: {
				used: ['use', 'uses', 'using'],
				walk: ['walking', 'walked'],
			},
		},
		{
			id: 'used-to-90',
			form: 'negative',
			prompt: 'Раніше він не прибирав у своїй кімнаті.',
			answer: "He didn't use to clean his room.",
			accept: ["He didn't {use to|} {clean|tidy} his room."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-91',
			form: 'negative',
			prompt: 'Раніше вони не дзвонили нам так часто.',
			answer: "They didn't use to call us so often.",
			accept: ["They didn't {use to|} {call|phone} us so often."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-92',
			form: 'negative',
			prompt: 'Раніше я не боявся висоти.',
			answer: "I didn't use to be afraid of heights.",
			accept: ["{I didn't use to be|I wasn't} afraid of heights."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-93',
			form: 'negative',
			prompt: 'Раніше ти не був таким серйозним.',
			answer: "You didn't use to be so serious.",
			accept: ["{You didn't use to be|You weren't} so serious."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-94',
			form: 'negative',
			prompt: 'Раніше Андрій не любив читати.',
			answer: "Andriy didn't use to like reading.",
			accept: ["Andriy didn't {use to|} like {reading|to read}."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-95',
			form: 'negative',
			prompt: 'Раніше ми ніколи не сварилися.',
			answer: 'We never used to argue.',
			accept: ['We never used to {argue|quarrel}.'],
			traps: {
				used: ['use', 'uses', 'using'],
				argue: ['arguing', 'argued'],
			},
		},
		{
			id: 'used-to-96',
			form: 'negative',
			prompt: 'Раніше наша бібліотека не працювала в неділю.',
			answer: "Our library didn't use to open on Sundays.",
			accept: ["Our library didn't {use to|} open on Sundays."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-97',
			form: 'negative',
			prompt: 'Раніше він не снідав.',
			answer: "He didn't use to have breakfast.",
			accept: ["He didn't {use to|} {have|eat} breakfast."],
			traps: {
				"didn't": ["doesn't", "don't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-98',
			form: 'negative',
			prompt: 'Раніше я не цікавився політикою.',
			answer: "I didn't use to be interested in politics.",
			accept: ["{I didn't use to be|I wasn't} interested in politics."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-99',
			form: 'negative',
			prompt: 'Раніше люди не мали мобільних телефонів.',
			answer: "People didn't use to have mobile phones.",
			accept: ["People didn't {use to|} have {mobile|cell} phones."],
			traps: {
				"didn't": ["don't", "doesn't"],
				use: ['used', 'uses', 'using'],
			},
		},
		{
			id: 'used-to-100',
			form: 'negative',
			prompt: 'Раніше вона ніколи не запізнювалася.',
			answer: 'She never used to be late.',
			accept: ['She {never used to be|was never} late.'],
			traps: {
				used: ['use', 'uses', 'using'],
				be: ['being', 'is'],
			},
		},
	],
})
