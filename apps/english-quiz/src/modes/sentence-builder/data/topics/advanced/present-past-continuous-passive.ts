import { defineTopic } from '../../define-topic'

const BEING = ['been', 'be'] as const
const IS = ['are', 'was'] as const
const ARE = ['is', 'were'] as const
const WAS = ['is', 'were'] as const
const WERE = ['are', 'was'] as const
const ISNT = ["aren't", "wasn't"] as const
const ARENT = ["isn't", "weren't"] as const
const WASNT = ["isn't", "weren't"] as const
const WERENT = ["aren't", "wasn't"] as const
const NOW = '{now|right now|at the moment}'

export const presentPastContinuousPassive = defineTopic({
	id: 'present-past-continuous-passive',
	level: 'advanced',
	title: 'Present/Past Continuous Passive',
	subtitle: 'Теперішній і минулий тривалий час (пасив)',
	rule: [
		{
			kind: 'usage',
			explanation:
				'Continuous Passive показує, що дію над предметом чи людиною виконують саме зараз (Present) або виконували в певний момент у минулому (Past). Хто виконує, часто неважливо, тому українською це неозначено-особова форма (ремонтують, ремонтували) або дієслово на -ся (будується). Порівняй: The road is repaired every year (регулярно) — The road is being repaired now (саме зараз).',
			examples: [
				{
					text: 'The windows are being cleaned at the moment.',
					translation: 'Вікна зараз миють.',
				},
				{
					text: 'The contract was being signed when the lights went out.',
					translation: 'Коли зникло світло, якраз підписували контракт.',
				},
			],
		},
		{
			kind: 'affirmative',
			explanation:
				"Present: am/is/are being + третя форма. Past: was/were being + третя форма. Being не пропускають і не замінюють на been. Після займенника можна скоротити: it's being, he's being, we're being. Маркери: now, right now, at the moment; when…, while…, at that moment.",
			examples: [
				{
					text: "We're being moved to a bigger office.",
					translation: 'Нас зараз переводять у більший офіс.',
				},
				{
					text: 'While the bus was being repaired, we waited in a café.',
					translation: 'Поки автобус ремонтували, ми чекали в кафе.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Is/Are/Was/Were + підмет + being + третя форма? З питальним словом: What is being built? Who was being interviewed? Якщо питальне слово — підмет, порядок прямий: What is being sold here?',
			examples: [
				{
					text: 'Is the old stadium being rebuilt?',
					translation: 'Старий стадіон зараз перебудовують?',
				},
				{
					text: 'Which room was being painted when you moved in?',
					translation: "Яку кімнату фарбували, коли ви в'їхали?",
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"isn't/aren't/wasn't/weren't + being + третя форма. Із займенником також it's not being, we're not being. Часто з still (I'm still not being…), anymore або no longer (was no longer being…).",
			examples: [
				{
					text: "He isn't being paid for this work.",
					translation: 'Йому не платять за цю роботу.',
				},
				{
					text: "The museum wasn't being renovated when we visited it.",
					translation: 'Коли ми його відвідали, музей не реставрували.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'present-past-continuous-passive-1',
			form: 'affirmative',
			prompt: 'Мою машину зараз ремонтують.',
			answer: 'My car is being repaired now.',
			traps: {
				being: ['been', 'be', 'is'],
			},
		},
		{
			id: 'present-past-continuous-passive-2',
			form: 'affirmative',
			prompt: 'Коли ми приїхали, будинок фарбували.',
			answer: 'The house was being painted when we arrived.',
			accept: ['When we arrived, the house was being painted.'],
			traps: { being: ['been', 'be'] },
		},
		{
			id: 'present-past-continuous-passive-3',
			form: 'affirmative',
			prompt: 'Міст біля нашого будинку зараз ремонтують.',
			answer: 'The bridge near our house is being repaired now.',
			accept: [`The bridge near our house is being {repaired|fixed} ${NOW}.`],
			traps: { is: IS, being: BEING, repaired: ['repair', 'repairing'] },
		},
		{
			id: 'present-past-continuous-passive-4',
			form: 'question',
			prompt: 'Вибачте, вас обслуговують?',
			answer: 'Excuse me, are you being served?',
			accept: ['{Excuse me|Sorry}, are you being served?'],
			traps: { are: ARE, being: BEING, served: ['serve', 'serving'] },
		},
		{
			id: 'present-past-continuous-passive-5',
			form: 'negative',
			prompt: 'Розслабся, цю розмову не записують.',
			answer: "Relax, this conversation isn't being recorded.",
			traps: { "isn't": ISNT, being: BEING, recorded: ['record', 'recording'] },
		},
		{
			id: 'present-past-continuous-passive-6',
			form: 'affirmative',
			prompt: 'Новий бюджет обговорюють прямо зараз.',
			answer: 'The new budget is being discussed right now.',
			traps: { is: IS, being: BEING, discussed: ['discuss', 'discussing'] },
		},
		{
			id: 'present-past-continuous-passive-7',
			form: 'question',
			prompt: 'Що зараз будують навпроти школи?',
			answer: 'What is being built opposite the school now?',
			accept: [
				`{What is|What's} being {built|constructed} {opposite|across from} the school ${NOW}?`,
			],
			traps: { is: IS, being: BEING, built: ['build', 'builded'] },
		},
		{
			id: 'present-past-continuous-passive-8',
			form: 'negative',
			prompt: 'Наразі цю справу не розслідують.',
			answer: "This case isn't being investigated at the moment.",
			accept: [
				"This case isn't being investigated {at the moment|now|right now}.",
				"This case isn't currently being investigated.",
			],
			traps: {
				"isn't": ISNT,
				being: BEING,
				investigated: ['investigate', 'investigating'],
			},
		},
		{
			id: 'present-past-continuous-passive-9',
			form: 'affirmative',
			prompt: 'Не обертайся — за нами стежать.',
			answer: "Don't turn around, we're being followed.",
			accept: ["Don't turn {around|round}, we're being {followed|watched}."],
			traps: { being: BEING, followed: ['follow', 'following'] },
		},
		{
			id: 'present-past-continuous-passive-10',
			form: 'question',
			prompt: 'Чому цю дорогу знову ремонтують?',
			answer: 'Why is this road being repaired again?',
			accept: ['Why is this road being {repaired|fixed} again?'],
			traps: { is: IS, being: BEING, repaired: ['repair', 'repairs'] },
		},
		{
			id: 'present-past-continuous-passive-11',
			form: 'negative',
			prompt: 'Ваш запит зараз не обробляють через технічну помилку.',
			answer:
				"Your request isn't being processed now because of a technical error.",
			accept: [
				`Your request isn't being processed ${NOW} {because of|due to} a technical error.`,
			],
			traps: {
				"isn't": ISNT,
				being: BEING,
				processed: ['process', 'processing'],
			},
		},
		{
			id: 'present-past-continuous-passive-12',
			form: 'affirmative',
			prompt: 'Мого брата зараз оперують.',
			answer: 'My brother is being operated on now.',
			accept: [`My brother is being operated on ${NOW}.`],
			traps: { is: IS, being: BEING, operated: ['operate', 'operating'] },
		},
		{
			id: 'present-past-continuous-passive-13',
			form: 'negative',
			prompt: 'Тебе ні в чому не звинувачують.',
			answer: "You're not being accused of anything.",
			traps: { being: BEING, accused: ['accuse', 'accusing'] },
		},
		{
			id: 'present-past-continuous-passive-14',
			form: 'affirmative',
			prompt: 'Його нову книжку зараз перекладають українською.',
			answer: 'His new book is being translated into Ukrainian now.',
			accept: [`His new book is being translated into Ukrainian ${NOW}.`],
			traps: {
				is: IS,
				being: BEING,
				translated: ['translate', 'translating'],
			},
		},
		{
			id: 'present-past-continuous-passive-15',
			form: 'question',
			prompt: 'Ваш будинок досі ремонтують?',
			answer: 'Is your house still being renovated?',
			accept: ['Is your house still being {renovated|repaired}?'],
			traps: {
				is: ['Was', 'Are'],
				being: BEING,
				renovated: ['renovate', 'renovating'],
			},
		},
		{
			id: 'present-past-continuous-passive-16',
			form: 'negative',
			prompt: 'Цього пацієнта зараз не лікують антибіотиками.',
			answer: "This patient isn't being treated with antibiotics now.",
			accept: [`This patient isn't being treated with antibiotics ${NOW}.`],
			traps: { "isn't": ISNT, being: BEING, treated: ['treat', 'treating'] },
		},
		{
			id: 'present-past-continuous-passive-17',
			form: 'affirmative',
			prompt: "Вона зараз не може говорити — у неї беруть інтерв'ю.",
			answer: "She can't talk now, she's being interviewed.",
			accept: [
				"She can't {talk|speak} {now|right now|at the moment}, {she's|she is} being interviewed.",
			],
			traps: { being: BEING, interviewed: ['interview', 'interviewing'] },
		},
		{
			id: 'present-past-continuous-passive-18',
			form: 'question',
			prompt: 'Кого зараз допитує поліція?',
			answer: 'Who is being questioned by the police now?',
			accept: [
				`{Who is|Who's} being {questioned|interrogated} by the police ${NOW}?`,
			],
			traps: { is: IS, being: BEING, questioned: ['question', 'questioning'] },
		},
		{
			id: 'present-past-continuous-passive-19',
			form: 'negative',
			prompt: 'Старий завод не зносять — його реставрують.',
			answer: "The old factory isn't being demolished, it's being restored.",
			accept: [
				"The old {factory|plant} isn't being {demolished|pulled down|knocked down|torn down}, {it's|it is} being restored.",
			],
			traps: {
				"isn't": ISNT,
				being: BEING,
				demolished: ['demolish', 'demolishing'],
				restored: ['restore', 'restoring'],
			},
		},
		{
			id: 'present-past-continuous-passive-20',
			form: 'affirmative',
			prompt: 'Дитину зараз вкладають спати.',
			answer: 'The baby is being put to bed now.',
			accept: [`The {baby|child} is being put to bed ${NOW}.`],
			traps: { is: IS, being: BEING, put: ['putted', 'putting'] },
		},
		{
			id: 'present-past-continuous-passive-21',
			form: 'question',
			prompt: 'Ці фотографії зараз видаляють?',
			answer: 'Are these photos being deleted now?',
			accept: [`Are these {photos|photographs|pictures} being deleted ${NOW}?`],
			traps: {
				are: ['Is', 'Were'],
				being: BEING,
				deleted: ['delete', 'deleting'],
			},
		},
		{
			id: 'present-past-continuous-passive-22',
			form: 'negative',
			prompt: 'Зараз цю проблему не обговорюють.',
			answer: "This problem isn't being discussed now.",
			accept: [`This {problem|issue} isn't being discussed ${NOW}.`],
			traps: {
				"isn't": ISNT,
				being: BEING,
				discussed: ['discuss', 'discussing'],
			},
		},
		{
			id: 'present-past-continuous-passive-23',
			form: 'affirmative',
			prompt: 'Ваш багаж зараз завантажують у літак.',
			answer: 'Your luggage is being loaded onto the plane now.',
			accept: [
				`Your {luggage|baggage} is being loaded {onto|on} the plane ${NOW}.`,
			],
			traps: { is: IS, being: BEING, loaded: ['load', 'loading'] },
		},
		{
			id: 'present-past-continuous-passive-24',
			form: 'question',
			prompt: 'Чому цих людей зараз евакуюють?',
			answer: 'Why are these people being evacuated now?',
			accept: [`Why are these people being evacuated ${NOW}?`],
			traps: {
				are: ARE,
				being: BEING,
				evacuated: ['evacuate', 'evacuating'],
			},
		},
		{
			id: 'present-past-continuous-passive-25',
			form: 'negative',
			prompt: 'Не хвилюйся, тебе не звільняють.',
			answer: "Don't worry, you're not being fired.",
			accept: ["Don't worry, you're not being {fired|sacked|dismissed}."],
			traps: { being: BEING, fired: ['fire', 'firing'] },
		},
		{
			id: 'present-past-continuous-passive-26',
			form: 'affirmative',
			prompt: 'Саме цієї миті вирішується доля всієї компанії.',
			answer:
				'The fate of the whole company is being decided at this very moment.',
			accept: [
				'The fate of the {whole|entire} company is being decided {at this very moment|at this moment|right now}.',
			],
			traps: { is: IS, being: BEING, decided: ['decide', 'deciding'] },
		},
		{
			id: 'present-past-continuous-passive-27',
			form: 'question',
			prompt: 'Мій паспорт досі друкують?',
			answer: 'Is my passport still being printed?',
			traps: {
				is: ['Was', 'Are'],
				being: BEING,
				printed: ['print', 'printing'],
			},
		},
		{
			id: 'present-past-continuous-passive-28',
			form: 'negative',
			prompt: 'Цей рейс не скасовують, його лише затримують.',
			answer: "This flight isn't being cancelled, it's only being delayed.",
			accept: [
				"This flight isn't being {cancelled|canceled}, {it's|it is} {only|just} being delayed.",
			],
			traps: {
				"isn't": ISNT,
				being: BEING,
				cancelled: ['cancel', 'cancelling'],
			},
		},
		{
			id: 'present-past-continuous-passive-29',
			form: 'affirmative',
			prompt: 'Наш новий додаток зараз тестують.',
			answer: 'Our new app is being tested now.',
			accept: [`Our new {app|application} is being tested ${NOW}.`],
			traps: { is: IS, being: BEING, tested: ['test', 'testing'] },
		},
		{
			id: 'present-past-continuous-passive-30',
			form: 'question',
			prompt: 'Де зараз ремонтують твій телефон?',
			answer: 'Where is your phone being repaired now?',
			accept: [`Where is your phone being {repaired|fixed} ${NOW}?`],
			traps: { is: IS, being: BEING, repaired: ['repair', 'repairing'] },
		},
		{
			id: 'present-past-continuous-passive-31',
			form: 'negative',
			prompt: 'Тварин у зоопарку зараз не годують.',
			answer: "The animals at the zoo aren't being fed now.",
			accept: [`The animals {at|in} the zoo aren't being fed ${NOW}.`],
			traps: { "aren't": ARENT, being: BEING, fed: ['feed', 'feeded'] },
		},
		{
			id: 'present-past-continuous-passive-32',
			form: 'affirmative',
			prompt: 'Будь ласка, зачекайте: ваш номер зараз прибирають.',
			answer: 'Please wait, your room is being cleaned now.',
			accept: [`Please wait, your room is being cleaned ${NOW}.`],
			traps: { is: IS, being: BEING, cleaned: ['clean', 'cleaning'] },
		},
		{
			id: 'present-past-continuous-passive-33',
			form: 'question',
			prompt: "Чи щось роблять, щоб розв'язати цю проблему?",
			answer: 'Is anything being done to solve this problem?',
			accept: [
				'Is {anything|something} being done to solve this {problem|issue}?',
			],
			traps: { is: ['Was', 'Are'], being: BEING, done: ['did', 'do'] },
		},
		{
			id: 'present-past-continuous-passive-34',
			form: 'negative',
			prompt: 'Мене не підвищують — мене переводять до Львова.',
			answer: "I'm not being promoted, I'm being transferred to Lviv.",
			traps: {
				being: BEING,
				promoted: ['promote', 'promoting'],
				transferred: ['transfer', 'transfering'],
			},
		},
		{
			id: 'present-past-continuous-passive-35',
			form: 'affirmative',
			prompt: 'Стіни в моїй кімнаті зараз фарбують.',
			answer: 'The walls in my room are being painted now.',
			accept: [`The walls {in|of} my room are being painted ${NOW}.`],
			traps: { are: ARE, being: BEING, painted: ['paint', 'painting'] },
		},
		{
			id: 'present-past-continuous-passive-36',
			form: 'question',
			prompt: 'Чому цього чоловіка зараз затримують?',
			answer: 'Why is this man being arrested now?',
			accept: [`Why is this man being {arrested|detained} ${NOW}?`],
			traps: { is: IS, being: BEING, arrested: ['arrest', 'arresting'] },
		},
		{
			id: 'present-past-continuous-passive-37',
			form: 'negative',
			prompt: 'Зараз твої повідомлення не читають.',
			answer: "Your messages aren't being read now.",
			accept: [`Your messages aren't being read ${NOW}.`],
			traps: { "aren't": ARENT, being: BEING, read: ['readed', 'reading'] },
		},
		{
			id: 'present-past-continuous-passive-38',
			form: 'affirmative',
			prompt: 'Нас обманюють!',
			answer: "We're being lied to!",
			accept: ["We're being {lied to|deceived|cheated|tricked|conned}!"],
			traps: { being: BEING, lied: ['lie', 'lying'] },
		},
		{
			id: 'present-past-continuous-passive-39',
			form: 'question',
			prompt: 'Ваші пропозиції зараз розглядають?',
			answer: 'Are your proposals being considered now?',
			accept: [`Are your proposals being {considered|reviewed} ${NOW}?`],
			traps: {
				are: ['Is', 'Were'],
				being: BEING,
				considered: ['consider', 'considering'],
			},
		},
		{
			id: 'present-past-continuous-passive-40',
			form: 'negative',
			prompt: 'Зараз цю будівлю не охороняють.',
			answer: "This building isn't being guarded now.",
			accept: [`This building isn't being guarded ${NOW}.`],
			traps: { "isn't": ISNT, being: BEING, guarded: ['guard', 'guarding'] },
		},
		{
			id: 'present-past-continuous-passive-41',
			form: 'affirmative',
			prompt: 'Саме зараз ухвалюється важливе рішення.',
			answer: 'An important decision is being made right now.',
			accept: [
				'An important decision is being {made|taken} {right now|at this very moment}.',
			],
			traps: { is: IS, being: BEING, made: ['make', 'maked'] },
		},
		{
			id: 'present-past-continuous-passive-42',
			form: 'question',
			prompt: 'Твою сестру зараз оглядає лікар?',
			answer: 'Is your sister being examined by a doctor now?',
			accept: [`Is your sister being examined by {a|the} doctor ${NOW}?`],
			traps: {
				is: ['Was', 'Are'],
				being: BEING,
				examined: ['examine', 'examining'],
			},
		},
		{
			id: 'present-past-continuous-passive-43',
			form: 'negative',
			prompt: 'Цих правил зараз не дотримуються.',
			answer: "These rules aren't being followed now.",
			accept: [`These rules aren't being {followed|observed|obeyed} ${NOW}.`],
			traps: {
				"aren't": ARENT,
				being: BEING,
				followed: ['follow', 'following'],
			},
		},
		{
			id: 'present-past-continuous-passive-44',
			form: 'affirmative',
			prompt: 'Цей мультфільм зараз дублюють українською.',
			answer: 'This cartoon is being dubbed into Ukrainian now.',
			accept: [
				`This {cartoon|animated film} is being dubbed into Ukrainian ${NOW}.`,
			],
			traps: { is: IS, being: BEING, dubbed: ['dub', 'dubing'] },
		},
		{
			id: 'present-past-continuous-passive-45',
			form: 'question',
			prompt: 'Що зараз обговорюють на нараді?',
			answer: 'What is being discussed at the meeting now?',
			accept: [`{What is|What's} being discussed {at|in} the meeting ${NOW}?`],
			traps: { is: IS, being: BEING, discussed: ['discuss', 'discussing'] },
		},
		{
			id: 'present-past-continuous-passive-46',
			form: 'negative',
			prompt: 'Мене досі не обслуговують!',
			answer: "I'm still not being served!",
			traps: { being: BEING, served: ['serve', 'serving'] },
		},
		{
			id: 'present-past-continuous-passive-47',
			form: 'affirmative',
			prompt: 'Його слова зараз перекручують.',
			answer: 'His words are being twisted now.',
			accept: [`His words are being {twisted|distorted} ${NOW}.`],
			traps: { are: ARE, being: BEING, twisted: ['twist', 'twisting'] },
		},
		{
			id: 'present-past-continuous-passive-48',
			form: 'question',
			prompt: 'Цей розділ зараз переписують?',
			answer: 'Is this chapter being rewritten now?',
			accept: [`Is this chapter being rewritten ${NOW}?`],
			traps: {
				is: ['Was', 'Are'],
				being: BEING,
				rewritten: ['rewrote', 'rewrited'],
			},
		},
		{
			id: 'present-past-continuous-passive-49',
			form: 'negative',
			prompt: 'Нам кажуть не всю правду.',
			answer: "We're not being told the whole truth.",
			accept: ["We're not being told the {whole|full} truth."],
			traps: { being: BEING, told: ['tell', 'telled'] },
		},
		{
			id: 'present-past-continuous-passive-50',
			form: 'affirmative',
			prompt: 'Зараз у парку вирубують багато дерев.',
			answer: 'Many trees in the park are being cut down now.',
			accept: [
				`{Many|A lot of|Lots of} trees in the park are being {cut down|chopped down|felled} ${NOW}.`,
			],
			traps: { are: ARE, being: BEING, cut: ['cutted', 'cutting'] },
		},
		{
			id: 'present-past-continuous-passive-51',
			form: 'affirmative',
			prompt: 'Коли ми приїхали до готелю, наш номер ще прибирали.',
			answer: 'When we arrived at the hotel, our room was still being cleaned.',
			accept: [
				'When we {arrived at|got to} the hotel, our room was still being cleaned.',
				'Our room was still being cleaned when we {arrived at|got to} the hotel.',
			],
			traps: { was: WAS, being: BEING, cleaned: ['clean', 'cleaning'] },
		},
		{
			id: 'present-past-continuous-passive-52',
			form: 'question',
			prompt: 'Коли ти подзвонив, твою машину ще ремонтували?',
			answer: 'When you called, was your car still being repaired?',
			accept: [
				'When you {called|phoned|rang}, was your car still being {repaired|fixed}?',
				'Was your car still being {repaired|fixed} when you {called|phoned|rang}?',
			],
			traps: { was: WAS, being: BEING, repaired: ['repair', 'repairing'] },
		},
		{
			id: 'present-past-continuous-passive-53',
			form: 'negative',
			prompt: 'Ми помітили, що за нами вже не стежать.',
			answer: "We noticed that we weren't being followed anymore.",
			accept: [
				"We noticed {that|} we weren't being {followed|watched} {anymore|any more|any longer}.",
				'We noticed {that|} we were no longer being {followed|watched}.',
			],
			traps: {
				"weren't": ["wasn't", "didn't"],
				being: BEING,
				followed: ['follow', 'following'],
			},
		},
		{
			id: 'present-past-continuous-passive-54',
			form: 'affirmative',
			prompt: 'Коли почався дощ, машину мили.',
			answer: 'When it started raining, the car was being washed.',
			accept: [
				'When it {started raining|started to rain|began raining|began to rain}, the car was being washed.',
				'The car was being washed when it {started raining|started to rain|began raining|began to rain}.',
			],
			traps: { was: WAS, being: BEING, washed: ['wash', 'washing'] },
		},
		{
			id: 'present-past-continuous-passive-55',
			form: 'question',
			prompt: 'Кого допитували, коли ти прийшов?',
			answer: 'Who was being questioned when you arrived?',
			accept: [
				'Who was being {questioned|interrogated} when you {arrived|came}?',
			],
			traps: {
				was: WAS,
				being: BEING,
				questioned: ['question', 'questioning'],
			},
		},
		{
			id: 'present-past-continuous-passive-56',
			form: 'negative',
			prompt: 'Коли я ввімкнув телевізор, матч уже не показували.',
			answer: "When I turned on the TV, the match wasn't being shown anymore.",
			accept: [
				"When I {turned|switched} on the TV, the {match|game} {wasn't being shown anymore|wasn't being shown any more|wasn't being shown any longer|was no longer being shown}.",
				"When I {turned|switched} the TV on, the {match|game} {wasn't being shown anymore|wasn't being shown any more|wasn't being shown any longer|was no longer being shown}.",
			],
			traps: { "wasn't": WASNT, being: BEING, shown: ['showed', 'show'] },
		},
		{
			id: 'present-past-continuous-passive-57',
			form: 'affirmative',
			prompt: 'Поки ми обідали, наш багаж завантажували в автобус.',
			answer:
				'While we were having lunch, our luggage was being loaded onto the bus.',
			accept: [
				'While we were {having|eating} lunch, our {luggage|baggage} was being loaded {onto|on} the bus.',
				'Our {luggage|baggage} was being loaded {onto|on} the bus while we were {having|eating} lunch.',
			],
			traps: { was: ['were', 'is'], being: BEING, loaded: ['load', 'loading'] },
		},
		{
			id: 'present-past-continuous-passive-58',
			form: 'question',
			prompt: 'Чому твою валізу обшукували, коли я тебе побачив?',
			answer: 'Why was your suitcase being searched when I saw you?',
			accept: [
				'Why was your suitcase being {searched|checked|inspected} when I saw you?',
			],
			traps: { was: WAS, being: BEING, searched: ['search', 'searching'] },
		},
		{
			id: 'present-past-continuous-passive-59',
			form: 'negative',
			prompt: 'Коли сталася аварія, дорогу не ремонтували.',
			answer: "When the accident happened, the road wasn't being repaired.",
			accept: [
				"When the accident happened, the road wasn't being {repaired|fixed}.",
				"The road wasn't being {repaired|fixed} when the accident happened.",
			],
			traps: {
				"wasn't": WASNT,
				being: BEING,
				repaired: ['repair', 'repairing'],
			},
		},
		{
			id: 'present-past-continuous-passive-60',
			form: 'affirmative',
			prompt: 'Учора о цій порі мене оперували.',
			answer: 'This time yesterday, I was being operated on.',
			accept: [
				'{This time yesterday|At this time yesterday|Yesterday at this time}, I was being operated on.',
				'I was being operated on {this time yesterday|at this time yesterday}.',
			],
			traps: {
				was: ['were', 'am'],
				being: BEING,
				operated: ['operate', 'operating'],
			},
		},
		{
			id: 'present-past-continuous-passive-61',
			form: 'question',
			prompt: 'Ви знали, що вашу розмову записують?',
			answer: 'Did you know that your conversation was being recorded?',
			accept: ['Did you know {that|} your conversation was being recorded?'],
			traps: { was: ['were'], being: BEING, recorded: ['record', 'recording'] },
		},
		{
			id: 'present-past-continuous-passive-62',
			form: 'negative',
			prompt: 'Вони не знали, що за ними стежать.',
			answer: "They didn't know that they were being watched.",
			accept: ["They didn't know {that|} they were being {watched|followed}."],
			traps: { were: ['was'], being: BEING, watched: ['watch', 'watching'] },
		},
		{
			id: 'present-past-continuous-passive-63',
			form: 'affirmative',
			prompt: 'Коли ми туди приїхали, старий кінотеатр уже зносили.',
			answer: 'When we got there, the old cinema was already being demolished.',
			accept: [
				'When we {got there|arrived}, the old cinema was already being {demolished|pulled down|knocked down|torn down}.',
				'The old cinema was already being {demolished|pulled down|knocked down|torn down} when we {got there|arrived}.',
			],
			traps: {
				was: WAS,
				being: BEING,
				demolished: ['demolish', 'demolishing'],
			},
		},
		{
			id: 'present-past-continuous-passive-64',
			form: 'question',
			prompt: 'За ним стежили, коли він виходив з банку?',
			answer: 'Was he being followed when he left the bank?',
			accept: [
				'Was he being {followed|watched} when he {left|was leaving|came out of|was coming out of} the bank?',
			],
			traps: {
				was: ['Is', 'Were'],
				being: BEING,
				followed: ['follow', 'following'],
			},
		},
		{
			id: 'present-past-continuous-passive-65',
			form: 'negative',
			prompt: 'Коли я подзвонив, моє замовлення навіть не обробляли.',
			answer: "When I called, my order wasn't even being processed.",
			accept: [
				"When I {called|phoned|rang}, my order wasn't even being processed.",
				"My order wasn't even being processed when I {called|phoned|rang}.",
			],
			traps: {
				"wasn't": WASNT,
				being: BEING,
				processed: ['process', 'processing'],
			},
		},
		{
			id: 'present-past-continuous-passive-66',
			form: 'affirmative',
			prompt: 'Ми відчували, що нас обманюють.',
			answer: 'We felt that we were being deceived.',
			accept: [
				'We felt {that|} we were being {deceived|cheated|lied to|tricked}.',
			],
			traps: {
				were: ['was'],
				being: BEING,
				deceived: ['deceive', 'deceiving'],
			},
		},
		{
			id: 'present-past-continuous-passive-67',
			form: 'question',
			prompt: 'Твою квартиру ремонтували, коли ти там жив?',
			answer: 'Was your flat being renovated when you lived there?',
			accept: [
				'Was your {flat|apartment} being {renovated|repaired} when you {lived|were living} there?',
			],
			traps: {
				was: ['Is', 'Were'],
				being: BEING,
				renovated: ['renovate', 'renovating'],
			},
		},
		{
			id: 'present-past-continuous-passive-68',
			form: 'negative',
			prompt: 'Коли приїхали соціальні працівники, за дітьми не доглядали.',
			answer:
				"When the social workers arrived, the children weren't being looked after.",
			accept: [
				"When the social workers {arrived|came}, the children weren't being looked after.",
				"The children weren't being looked after when the social workers {arrived|came}.",
			],
			traps: { "weren't": WERENT, being: BEING, looked: ['look', 'looking'] },
		},
		{
			id: 'present-past-continuous-passive-69',
			form: 'affirmative',
			prompt: 'Поки у вітальні фарбували стіни, ми жили на кухні.',
			answer:
				'While the walls in the living room were being painted, we lived in the kitchen.',
			accept: [
				'While the walls {in|of} the living room were being painted, we {lived|were living} in the kitchen.',
				'We {lived|were living} in the kitchen while the walls {in|of} the living room were being painted.',
			],
			traps: { were: WERE, being: BEING, painted: ['paint', 'painting'] },
		},
		{
			id: 'present-past-continuous-passive-70',
			form: 'question',
			prompt: 'Що обговорювали, коли я зайшов?',
			answer: 'What was being discussed when I came in?',
			accept: ['What was being discussed when I {came in|walked in|entered}?'],
			traps: { was: WAS, being: BEING, discussed: ['discuss', 'discussing'] },
		},
		{
			id: 'present-past-continuous-passive-71',
			form: 'negative',
			prompt: 'Коли спалахнула пожежа, у будівлі не проводили жодних робіт.',
			answer:
				'When the fire broke out, no work was being done in the building.',
			accept: [
				'When the fire {broke out|started}, no work was being done in the building.',
				'No work was being done in the building when the fire {broke out|started}.',
			],
			traps: { was: WAS, being: BEING, done: ['did', 'do'] },
		},
		{
			id: 'present-past-continuous-passive-72',
			form: 'affirmative',
			prompt: 'Вона скаржилася, що до неї ставляться несправедливо.',
			answer: 'She complained that she was being treated unfairly.',
			accept: ['She complained {that|} she was being treated unfairly.'],
			traps: { was: ['were'], being: BEING, treated: ['treat', 'treating'] },
		},
		{
			id: 'present-past-continuous-passive-73',
			form: 'question',
			prompt: 'Цей стадіон будували, коли ти переїхав до міста?',
			answer: 'Was this stadium being built when you moved to the city?',
			accept: [
				'Was this stadium being {built|constructed} when you moved to the {city|town}?',
			],
			traps: { was: ['Is', 'Were'], being: BEING, built: ['build', 'builded'] },
		},
		{
			id: 'present-past-continuous-passive-74',
			form: 'negative',
			prompt: 'Коли ми розмовляли, нас не записували.',
			answer: "When we were talking, we weren't being recorded.",
			accept: [
				"When we were {talking|speaking}, we weren't being recorded.",
				"We weren't being recorded when we were {talking|speaking}.",
			],
			traps: {
				"weren't": WERENT,
				being: BEING,
				recorded: ['record', 'recording'],
			},
		},
		{
			id: 'present-past-continuous-passive-75',
			form: 'affirmative',
			prompt: 'Поки дітей купали, батьки готували вечерю.',
			answer:
				'While the children were being bathed, the parents were cooking dinner.',
			accept: [
				'While the children were being bathed, {the|their} parents were {cooking|making|preparing} dinner.',
				'{The|Their} parents were {cooking|making|preparing} dinner while the children were being bathed.',
			],
			traps: { were: WERE, being: BEING, bathed: ['bathe', 'bathing'] },
		},
		{
			id: 'present-past-continuous-passive-76',
			form: 'question',
			prompt: 'Куди везли цих людей, коли ти їх побачив?',
			answer: 'Where were these people being taken when you saw them?',
			accept: [
				'Where were these people being {taken|driven} when you saw them?',
			],
			traps: { were: WERE, being: BEING, taken: ['took', 'taked'] },
		},
		{
			id: 'present-past-continuous-passive-77',
			form: 'negative',
			prompt: 'Поки ми чекали, наші документи навіть не перевіряли.',
			answer:
				"While we were waiting, our documents weren't even being checked.",
			accept: [
				"Our documents weren't even being checked while we were waiting.",
			],
			traps: {
				"weren't": WERENT,
				being: BEING,
				checked: ['check', 'checking'],
			},
		},
		{
			id: 'present-past-continuous-passive-78',
			form: 'affirmative',
			prompt:
				'Коли ми повернулися, у нашій квартирі ще встановлювали нові вікна.',
			answer:
				'When we came back, new windows were still being installed in our flat.',
			accept: [
				'When we {came back|got back|returned}, new windows were still being {installed|fitted} in our {flat|apartment}.',
				'New windows were still being {installed|fitted} in our {flat|apartment} when we {came back|got back|returned}.',
			],
			traps: { were: WERE, being: BEING, installed: ['install', 'installing'] },
		},
		{
			id: 'present-past-continuous-passive-79',
			form: 'question',
			prompt: 'Ти бачив, що твою машину евакуюють?',
			answer: 'Did you see that your car was being towed away?',
			accept: ['Did you see {that|} your car was being towed away?'],
			traps: { was: ['were'], being: BEING, towed: ['tow', 'towing'] },
		},
		{
			id: 'present-past-continuous-passive-80',
			form: 'negative',
			prompt: 'Вони сказали, що проєкт більше не фінансують.',
			answer: "They said that the project wasn't being funded anymore.",
			accept: [
				"They said {that|} the project wasn't being funded {anymore|any more|any longer}.",
				'They said {that|} the project was no longer being funded.',
			],
			traps: {
				"wasn't": ["weren't", "didn't"],
				being: BEING,
				funded: ['fund', 'funding'],
			},
		},
		{
			id: 'present-past-continuous-passive-81',
			form: 'affirmative',
			prompt: 'Злодія переслідувала поліція, коли його збила машина.',
			answer:
				'The thief was being chased by the police when he was hit by a car.',
			accept: [
				'The thief was being {chased|pursued} by the police when he was {hit|knocked down} by a car.',
			],
			traps: { was: WAS, being: BEING, chased: ['chase', 'chasing'] },
		},
		{
			id: 'present-past-continuous-passive-82',
			form: 'question',
			prompt: 'Що тоді робили з цим будинком?',
			answer: 'What was being done to this house then?',
			accept: [
				'What was being done {to|with} this house {then|at that time|at the time}?',
			],
			traps: { was: WAS, being: BEING, done: ['did', 'do'] },
		},
		{
			id: 'present-past-continuous-passive-83',
			form: 'negative',
			prompt: 'Поки ми працювали понаднормово, нам за це навіть не платили.',
			answer:
				"While we were working overtime, we weren't even being paid for it.",
			accept: [
				"We weren't even being paid for it while we were working overtime.",
			],
			traps: { "weren't": WERENT, being: BEING, paid: ['pay', 'payed'] },
		},
		{
			id: 'present-past-continuous-passive-84',
			form: 'affirmative',
			prompt: 'Він сказав, що його звільняють.',
			answer: 'He said that he was being fired.',
			accept: ['He said {that|} he was being {fired|sacked|dismissed}.'],
			traps: { was: ['were'], being: BEING, fired: ['fire', 'firing'] },
		},
		{
			id: 'present-past-continuous-passive-85',
			form: 'question',
			prompt: 'Ліфт ремонтували, коли ви сюди переїжджали?',
			answer: 'Was the lift being repaired when you were moving in?',
			accept: [
				'Was the {lift|elevator} being {repaired|fixed} when you {were moving in|moved in|were moving here|moved here}?',
			],
			traps: {
				was: ['Is', 'Were'],
				being: BEING,
				repaired: ['repair', 'repairing'],
			},
		},
		{
			id: 'present-past-continuous-passive-86',
			form: 'negative',
			prompt: 'Він не помітив, що його фотографують.',
			answer: "He didn't notice that he was being photographed.",
			accept: ["He didn't notice {that|} he was being photographed."],
			traps: {
				was: ['were'],
				being: BEING,
				photographed: ['photograph', 'photographing'],
			},
		},
		{
			id: 'present-past-continuous-passive-87',
			form: 'affirmative',
			prompt: 'Коли я виглянув у вікно, мого сусіда заарештовували.',
			answer:
				'When I looked out of the window, my neighbour was being arrested.',
			accept: [
				'When I looked out {of|} the window, my {neighbour|neighbor} was being arrested.',
				'My {neighbour|neighbor} was being arrested when I looked out {of|} the window.',
			],
			traps: { was: WAS, being: BEING, arrested: ['arrest', 'arresting'] },
		},
		{
			id: 'present-past-continuous-passive-88',
			form: 'question',
			prompt: 'Що будували біля вокзалу, коли ти там жив?',
			answer: 'What was being built near the station when you lived there?',
			accept: [
				'What was being {built|constructed} near the station when you {lived|were living} there?',
			],
			traps: { was: WAS, being: BEING, built: ['build', 'builded'] },
		},
		{
			id: 'present-past-continuous-passive-89',
			form: 'negative',
			prompt: 'Поки інших студентів хвалили, мене навіть не помічали.',
			answer:
				"While the other students were being praised, I wasn't even being noticed.",
			accept: [
				"I wasn't even being noticed while the other students were being praised.",
			],
			traps: {
				"wasn't": ["weren't", "isn't"],
				being: BEING,
				praised: ['praise', 'praising'],
				noticed: ['notice', 'noticing'],
			},
		},
		{
			id: 'present-past-continuous-passive-90',
			form: 'affirmative',
			prompt: "Коли ми під'їхали, пожежу ще гасили.",
			answer: 'When we drove up, the fire was still being put out.',
			accept: [
				'When we {drove up|arrived|got there}, the fire was still being {put out|extinguished}.',
				'The fire was still being {put out|extinguished} when we {drove up|arrived|got there}.',
			],
			traps: { was: WAS, being: BEING, put: ['putted', 'putting'] },
		},
		{
			id: 'present-past-continuous-passive-91',
			form: 'question',
			prompt: 'Тебе знімали на камеру, коли ти заходив у будівлю?',
			answer: 'Were you being filmed when you entered the building?',
			accept: [
				'Were you being {filmed|recorded} when you {entered|went into|were entering|were going into} the building?',
			],
			traps: {
				were: ['Are', 'Was'],
				being: BEING,
				filmed: ['film', 'filming'],
			},
		},
		{
			id: 'present-past-continuous-passive-92',
			form: 'negative',
			prompt: 'Коли сталося пограбування, будинок не охороняли.',
			answer: "When the robbery happened, the house wasn't being guarded.",
			accept: [
				"When the robbery {happened|took place}, the house wasn't being guarded.",
				"The house wasn't being guarded when the robbery {happened|took place}.",
			],
			traps: { "wasn't": WASNT, being: BEING, guarded: ['guard', 'guarding'] },
		},
		{
			id: 'present-past-continuous-passive-93',
			form: 'affirmative',
			prompt: 'Коли я проходив повз, цю будівлю обшукувала поліція.',
			answer:
				'When I was walking past, this building was being searched by the police.',
			accept: [
				'When I {was walking past|walked past|was passing by|passed by|was going past|went past}, this building was being searched by the police.',
				'This building was being searched by the police when I {was walking past|walked past|was passing by|passed by|was going past|went past}.',
			],
			traps: { being: BEING, searched: ['search', 'searching'] },
		},
		{
			id: 'present-past-continuous-passive-94',
			form: 'question',
			prompt: 'Тебе вчора о третій ще допитували?',
			answer: 'Were you still being questioned at three yesterday?',
			accept: [
				"Were you still being {questioned|interrogated} at three {o'clock|} yesterday?",
			],
			traps: {
				were: ['Are', 'Was'],
				being: BEING,
				questioned: ['question', 'questioning'],
			},
		},
		{
			id: 'present-past-continuous-passive-95',
			form: 'negative',
			prompt:
				"Коли я подзвонив, мій комп'ютер не ремонтували, а лише перевіряли.",
			answer:
				"When I called, my computer wasn't being repaired, it was only being checked.",
			accept: [
				"When I {called|phoned|rang}, my computer wasn't being {repaired|fixed}, it was {only|just} being {checked|tested}.",
			],
			traps: {
				"wasn't": WASNT,
				being: BEING,
				repaired: ['repair', 'repairing'],
			},
		},
		{
			id: 'present-past-continuous-passive-96',
			form: 'affirmative',
			prompt: 'Коли я прокинувся, мене вже везли до лікарні.',
			answer: 'When I woke up, I was already being taken to hospital.',
			accept: [
				'When I woke up, I was already being taken to {hospital|the hospital}.',
				'I was already being taken to {hospital|the hospital} when I woke up.',
			],
			traps: { was: ['were', 'am'], being: BEING, taken: ['took', 'taked'] },
		},
		{
			id: 'present-past-continuous-passive-97',
			form: 'question',
			prompt: 'Які пісні записували в студії, коли ти там працював?',
			answer:
				'What songs were being recorded in the studio when you worked there?',
			accept: [
				'{What|Which} songs were being recorded {in|at} the studio when you {worked|were working} there?',
			],
			traps: { were: WERE, being: BEING, recorded: ['record', 'recording'] },
		},
		{
			id: 'present-past-continuous-passive-98',
			form: 'negative',
			prompt: 'Коли ми приїхали, міст уже не ремонтували.',
			answer: "When we arrived, the bridge wasn't being repaired anymore.",
			accept: [
				"When we {arrived|got there}, the bridge {wasn't being repaired anymore|wasn't being repaired any more|wasn't being repaired any longer|was no longer being repaired|wasn't being fixed anymore|wasn't being fixed any more|wasn't being fixed any longer|was no longer being fixed}.",
			],
			traps: {
				"wasn't": WASNT,
				being: BEING,
				repaired: ['repair', 'repairing'],
			},
		},
		{
			id: 'present-past-continuous-passive-99',
			form: 'affirmative',
			prompt: 'Поки ми сперечалися, рішення вже ухвалювали без нас.',
			answer:
				'While we were arguing, the decision was already being made without us.',
			accept: [
				'While we were arguing, the decision was already being {made|taken} without us.',
				'The decision was already being {made|taken} without us while we were arguing.',
			],
			traps: { was: ['is', 'had'], being: BEING, made: ['make', 'maked'] },
		},
		{
			id: 'present-past-continuous-passive-100',
			form: 'question',
			prompt: 'Тебе везли додому, коли сталася аварія?',
			answer: 'Were you being driven home when the accident happened?',
			accept: [
				'Were you being {driven|taken} home when the accident {happened|occurred}?',
			],
			traps: {
				were: ['Are', 'Was'],
				being: BEING,
				driven: ['drove', 'drived'],
			},
		},
	],
})
