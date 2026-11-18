import { defineTopic } from '../../define-topic'

const PROVIDED =
	'{provided that|provided|providing that|providing|as long as|on condition that}'

export const conditionalClauses = defineTopic({
	id: 'conditional-clauses',
	level: 'advanced',
	title: 'Conditional Clauses',
	subtitle: 'Умовні речення',
	rule: [
		{
			kind: 'affirmative',
			explanation:
				'Zero: if + Present Simple → Present Simple (завжди правда). First: if + Present Simple → will (реальне майбутнє). Second: if + Past Simple → would (уявне теперішнє; для I/he/she/it можна were або was, але завжди "If I were you"). Third: if + Past Perfect → would have + V3 (уявне минуле). Mixed: if + Past Perfect → would + V (минуле впливає на теперішнє) або if + Past Simple → would have + V3. В умовній частині ніколи не вживаємо will чи would.',
			examples: [
				{
					text: 'If you freeze water, it turns into ice.',
					translation: 'Якщо заморозити воду, вона перетворюється на лід.',
				},
				{
					text: "If she calls, I'll let you know.",
					translation: 'Якщо вона подзвонить, я тобі повідомлю.',
				},
				{
					text: 'If I spoke French, I would move to Paris.',
					translation: 'Якби я говорив французькою, я б переїхав до Парижа.',
				},
				{
					text: 'If we had taken a taxi, we would have arrived on time.',
					translation: 'Якби ми взяли таксі, ми б приїхали вчасно.',
				},
				{
					text: 'If he had saved money, he would be rich now.',
					translation: 'Якби він заощаджував гроші, він був би зараз багатим.',
				},
			],
		},
		{
			kind: 'question',
			explanation:
				'Питання ставимо в головній частині: will/would стоїть перед підметом. Умовна частина не змінюється.',
			examples: [
				{
					text: 'Will you wait for me if I am late?',
					translation: 'Ти почекаєш на мене, якщо я запізнюся?',
				},
				{
					text: 'Where would you live if you had the choice?',
					translation: 'Де б ти жив, якби мав вибір?',
				},
				{
					text: 'Would she have stayed if we had asked her?',
					translation: 'Вона б залишилася, якби ми її попросили?',
				},
			],
		},
		{
			kind: 'negative',
			explanation:
				"Заперечення може бути в будь-якій частині: don't/didn't/hadn't в умові, won't/wouldn't/wouldn't have в результаті. Unless = if … not: після unless дієслово стверджувальне.",
			examples: [
				{
					text: "If you don't hurry, you'll miss the bus.",
					translation: 'Якщо ти не поспішиш, ти запізнишся на автобус.',
				},
				{
					text: "I wouldn't have known if he hadn't told me.",
					translation: 'Я б не дізнався, якби він мені не сказав.',
				},
				{
					text: "We won't start unless everyone is here.",
					translation: 'Ми не почнемо, якщо не будуть присутні всі.',
				},
			],
		},
		{
			kind: 'usage',
			explanation:
				'Provided (that) / as long as = за умови, що. In case = на випадок, якщо (після in case не вживаємо will). В офіційному стилі if можна прибрати й поставити допоміжне дієслово на початок: Had I known… (= If I had known), Were I… (= If I were), Should you need… (= If you need).',
			examples: [
				{
					text: 'You can go out as long as you finish your homework.',
					translation:
						'Ти можеш піти гуляти за умови, що закінчиш домашнє завдання.',
				},
				{
					text: "I'll take some cash in case the card doesn't work.",
					translation: 'Я візьму готівку на випадок, якщо картка не спрацює.',
				},
				{
					text: 'Had we known the truth, we would have acted differently.',
					translation: 'Якби ми знали правду, ми б діяли інакше.',
				},
				{
					text: 'Should you change your mind, let me know.',
					translation: 'Якщо ти передумаєш, дай мені знати.',
				},
			],
		},
	],
	sentences: [
		{
			id: 'conditional-clauses-1',
			form: 'affirmative',
			prompt: 'Якщо піде дощ, ми залишимося вдома.',
			answer: 'If it rains, we will stay at home.',
			accept: [
				"If it rains, we'll stay at home.",
				"If it rains, {we'll|we will} stay home.",
			],
			traps: { rains: ['rain', 'will', 'rained'] },
		},
		{
			id: 'conditional-clauses-2',
			form: 'affirmative',
			prompt: 'Якби я мав час, я б допоміг.',
			answer: 'If I had time, I would help.',
			accept: ["If I had time, I'd help."],
			traps: {
				would: ['will', 'had', 'did'],
			},
		},
		{
			id: 'conditional-clauses-3',
			form: 'affirmative',
			prompt: 'Якщо нагріти лід, він тане.',
			answer: 'If you heat ice, it melts.',
			accept: ['If ice is heated, it melts.'],
			traps: {
				melts: ['melt', 'melted', 'melting'],
			},
		},
		{
			id: 'conditional-clauses-4',
			form: 'negative',
			prompt: 'Якщо рослини не поливати, вони гинуть.',
			answer: "If you don't water plants, they die.",
			accept: ["If plants aren't watered, they die."],
			traps: {
				die: ['dies', 'died', 'dying'],
			},
		},
		{
			id: 'conditional-clauses-5',
			form: 'negative',
			prompt: "Якщо я п'ю каву ввечері, я не можу заснути.",
			answer: "If I drink coffee in the evening, I can't fall asleep.",
			accept: [
				"If I drink coffee in the evening, I can't {sleep|get to sleep}.",
			],
			traps: {
				drink: ['drank', 'drinks', 'will'],
			},
		},
		{
			id: 'conditional-clauses-6',
			form: 'question',
			prompt: 'Що відбувається, якщо натиснути цю кнопку?',
			answer: 'What happens if you press this button?',
			accept: ['What happens if you push this button?'],
			traps: {
				happens: ['happen', 'happened', 'will'],
			},
		},
		{
			id: 'conditional-clauses-7',
			form: 'affirmative',
			prompt: 'Мій пес завжди гавкає, якщо хтось дзвонить у двері.',
			answer: 'My dog always barks if someone rings the doorbell.',
			accept: ['My dog always barks if somebody rings the doorbell.'],
			traps: {
				barks: ['bark', 'barked', 'barking'],
				rings: ['ring', 'rang', 'will'],
			},
		},
		{
			id: 'conditional-clauses-8',
			form: 'affirmative',
			prompt: 'Якщо вода досягає 100 градусів, вона кипить.',
			answer: 'If water reaches 100 degrees, it boils.',
			traps: {
				boils: ['boil', 'boiled', 'boiling'],
			},
		},
		{
			id: 'conditional-clauses-9',
			form: 'negative',
			prompt: 'Якщо Олена не снідає, у неї болить голова.',
			answer: "If Olena doesn't have breakfast, she gets a headache.",
			accept: [
				"If Olena doesn't {have|eat} breakfast, {she gets a headache|she has a headache|her head hurts}.",
			],
			traps: {
				gets: ['got', 'get', 'will'],
			},
		},
		{
			id: 'conditional-clauses-10',
			form: 'affirmative',
			prompt: 'Якщо ти поспішиш, ти встигнеш на потяг.',
			answer: "If you hurry, you'll catch the train.",
			traps: {
				hurry: ['hurried', 'hurries', 'will'],
				"you'll": ["you'd", "you're"],
			},
		},
		{
			id: 'conditional-clauses-11',
			form: 'affirmative',
			prompt: 'Якщо завтра буде сонячно, ми поїдемо на пляж.',
			answer: "If it's sunny tomorrow, we'll go to the beach.",
			accept: ["If it is sunny tomorrow, we'll go to the beach."],
			traps: {
				"it's": ["it'll", "it'd"],
				"we'll": ["we'd", "we're"],
			},
		},
		{
			id: 'conditional-clauses-12',
			form: 'question',
			prompt: 'Що ти робитимеш, якщо не складеш іспит?',
			answer: 'What will you do if you fail the exam?',
			accept: ["What will you do if you don't pass the exam?"],
			traps: {
				will: ['would', 'are', 'did'],
				fail: ['failed', 'fails', 'failing'],
			},
		},
		{
			id: 'conditional-clauses-13',
			form: 'negative',
			prompt: 'Якщо ти не візьмеш куртку, ти замерзнеш.',
			answer: "If you don't take a jacket, you'll get cold.",
			accept: ["If you don't take a jacket, you'll {be cold|freeze}."],
			traps: {
				take: ['took', 'takes', 'will'],
			},
		},
		{
			id: 'conditional-clauses-14',
			form: 'affirmative',
			prompt: 'Якщо Марко подзвонить, я скажу йому правду.',
			answer: "If Marko calls, I'll tell him the truth.",
			accept: ["If Marko phones, I'll tell him the truth."],
			traps: {
				calls: ['call', 'called', 'will'],
				tell: ['told', 'say', 'tells'],
			},
		},
		{
			id: 'conditional-clauses-15',
			form: 'question',
			prompt: 'Ти допоможеш мені, якщо я попрошу?',
			answer: 'Will you help me if I ask?',
			traps: {
				will: ['would', 'do', 'are'],
				ask: ['asked', 'asking', 'asks'],
			},
		},
		{
			id: 'conditional-clauses-16',
			form: 'negative',
			prompt: 'Ми запізнимося на літак, якщо не вийдемо зараз.',
			answer: "We'll miss the plane if we don't leave now.",
			accept: [
				"We'll {miss the plane|be late for the plane} {if we don't|unless we} leave now.",
			],
			traps: {
				"don't": ["won't", "didn't", "aren't"],
			},
		},
		{
			id: 'conditional-clauses-17',
			form: 'affirmative',
			prompt: 'Якщо ти будеш старанно тренуватися, ти виграєш змагання.',
			answer: "If you train hard, you'll win the competition.",
			traps: {
				train: ['trained', 'trains', 'will'],
				win: ['won', 'wins', 'winning'],
			},
		},
		{
			id: 'conditional-clauses-18',
			form: 'affirmative',
			prompt: 'Якщо ціни зростуть, люди купуватимуть менше.',
			answer: 'If prices rise, people will buy less.',
			accept: ['If prices {go up|increase}, people will buy less.'],
			traps: {
				rise: ['rose', 'raise', 'risen'],
				will: ['would', 'are'],
			},
		},
		{
			id: 'conditional-clauses-19',
			form: 'question',
			prompt: 'Якщо поїзд запізниться, хто нас зустріне?',
			answer: 'If the train is late, who will meet us?',
			traps: {
				is: ['will', 'was', 'be'],
				meet: ['met', 'meets', 'meeting'],
			},
		},
		{
			id: 'conditional-clauses-20',
			form: 'negative',
			prompt: 'Якщо ти не проти, я відкрию вікно.',
			answer: "If you don't mind, I'll open the window.",
			traps: {
				"I'll": ["I'd", "I'm"],
				open: ['opened', 'opens', 'opening'],
			},
		},
		{
			id: 'conditional-clauses-21',
			form: 'affirmative',
			prompt: 'Якби в мене зараз була машина, я б поїхав у Карпати.',
			answer: 'If I had a car now, I would go to the Carpathians.',
			accept: [
				"If I had a car now, {I would|I'd} {go|drive} to the Carpathians.",
			],
			traps: {
				had: ['have', 'has', 'will'],
				would: ['will', 'did'],
			},
		},
		{
			id: 'conditional-clauses-22',
			form: 'affirmative',
			prompt: 'Якби Ігор зараз був тут, він би знав, що робити.',
			answer: 'If Ihor were here now, he would know what to do.',
			accept: ["If Ihor {were|was} here now, {he would|he'd} know what to do."],
			traps: {
				were: ['is', 'be', 'been'],
				know: ['knew', 'known', 'knows'],
			},
		},
		{
			id: 'conditional-clauses-23',
			form: 'question',
			prompt: 'Що б ти зробив, якби завтра виграв мільйон доларів?',
			answer: 'What would you do if you won a million dollars tomorrow?',
			accept: ['What would you do if you won one million dollars tomorrow?'],
			traps: {
				would: ['will', 'did'],
				won: ['win', 'wins', 'winned'],
			},
		},
		{
			id: 'conditional-clauses-24',
			form: 'negative',
			prompt: 'На твоєму місці я б не купував цей телефон.',
			answer: "If I were you, I wouldn't buy this phone.",
			traps: {
				were: ['am', 'are', 'be'],
				buy: ['bought', 'buying', 'buys'],
			},
		},
		{
			id: 'conditional-clauses-25',
			form: 'affirmative',
			prompt: 'Якби я був птахом, я б полетів до тебе.',
			answer: 'If I were a bird, I would fly to you.',
			accept: ["If I {were|was} a bird, {I would|I'd} fly to you."],
			traps: {
				would: ['will', 'had'],
				fly: ['flew', 'flown', 'flying'],
			},
		},
		{
			id: 'conditional-clauses-26',
			form: 'affirmative',
			prompt: 'Якби мій брат зараз жив у Києві, ми б бачилися частіше.',
			answer:
				'If my brother lived in Kyiv now, we would see each other more often.',
			accept: [
				"If my brother lived in Kyiv now, {we would|we'd} see each other more often.",
			],
			traps: {
				lived: ['lives', 'live', 'living'],
				see: ['saw', 'seen', 'seeing'],
			},
		},
		{
			id: 'conditional-clauses-27',
			form: 'question',
			prompt: 'Ти б переїхав до Лондона, якби завтра отримав там роботу?',
			answer: 'Would you move to London if you got a job there tomorrow?',
			traps: {
				move: ['moved', 'moving', 'moves'],
				got: ['get', 'will', 'gets'],
			},
		},
		{
			id: 'conditional-clauses-28',
			form: 'negative',
			prompt: 'Якби в мене зараз не було стільки роботи, я б пішов з тобою.',
			answer: "If I didn't have so much work now, I would go with you.",
			accept: [
				"If I didn't have so much work now, {I would|I'd} {go|come} with you.",
			],
			traps: {
				"didn't": ["don't", "doesn't", "wasn't"],
				would: ['will', 'had'],
			},
		},
		{
			id: 'conditional-clauses-29',
			form: 'affirmative',
			prompt: 'Якби Оля зараз була вдома, вона б відповіла на дзвінок.',
			answer: 'If Olya were at home now, she would answer the phone.',
			accept: [
				"If Olya {were|was} {at home|home} now, {she would|she'd} answer the phone.",
			],
			traps: {
				would: ['will', 'is'],
				answer: ['answered', 'answers', 'answering'],
			},
		},
		{
			id: 'conditional-clauses-30',
			form: 'affirmative',
			prompt: 'На твоєму місці я б погодився.',
			answer: 'If I were you, I would agree.',
			accept: ["If I were you, I'd agree."],
			traps: {
				were: ['am', 'are', 'be'],
				agree: ['agreed', 'agrees', 'agreeing'],
			},
		},
		{
			id: 'conditional-clauses-31',
			form: 'question',
			prompt: 'Що б ти зробив на моєму місці?',
			answer: 'What would you do if you were me?',
			accept: [
				'What would you do {if you were in my place|in my place|in my shoes}?',
			],
			traps: {
				would: ['will', 'did'],
				were: ['are', 'was', 'be'],
			},
		},
		{
			id: 'conditional-clauses-32',
			form: 'affirmative',
			prompt: 'Якби люди менше їздили машинами, повітря було б чистішим.',
			answer: 'If people drove less, the air would be cleaner.',
			accept: ['If people used cars less, the air would be cleaner.'],
			traps: {
				drove: ['drive', 'driven', 'drives'],
				would: ['will', 'is'],
			},
		},
		{
			id: 'conditional-clauses-33',
			form: 'negative',
			prompt: 'Якби він не був таким упертим, у нього було б більше друзів.',
			answer: "If he weren't so stubborn, he would have more friends.",
			accept: [
				"If he {weren't|wasn't} so stubborn, {he would|he'd} have more friends.",
			],
			traps: {
				would: ['will', 'had'],
				have: ['has', 'had'],
			},
		},
		{
			id: 'conditional-clauses-34',
			form: 'question',
			prompt: 'Якби ти міг жити в будь-якій країні, яку б ти обрав?',
			answer: 'If you could live in any country, which one would you choose?',
			accept: ['If you could live in any country, which would you choose?'],
			traps: {
				could: ['can', 'will'],
				choose: ['chose', 'chosen', 'choosing'],
			},
		},
		{
			id: 'conditional-clauses-35',
			form: 'affirmative',
			prompt: 'Якби в нас був сад, ми б вирощували власні овочі.',
			answer: 'If we had a garden, we would grow our own vegetables.',
			accept: ["If we had a garden, we'd grow our own vegetables."],
			traps: {
				had: ['have', 'has'],
				grow: ['grew', 'grown', 'grows'],
			},
		},
		{
			id: 'conditional-clauses-36',
			form: 'affirmative',
			prompt: 'Якби в мене зараз був ключ, я міг би відчинити двері.',
			answer: 'If I had the key now, I could open the door.',
			accept: ['If I had a key now, I could open the door.'],
			traps: {
				had: ['have', 'has', 'would'],
				could: ['can', 'will'],
			},
		},
		{
			id: 'conditional-clauses-37',
			form: 'affirmative',
			prompt:
				'Якби ти поговорив з ним зараз, він, можливо, змінив би свою думку.',
			answer: 'If you talked to him now, he might change his mind.',
			accept: ['If you spoke to him now, he might change his mind.'],
			traps: {
				talked: ['talk', 'talks', 'will'],
				might: ['will', 'can'],
			},
		},
		{
			id: 'conditional-clauses-38',
			form: 'question',
			prompt: 'Якби ти зараз був президентом, що б ти змінив насамперед?',
			answer: 'If you were president now, what would you change first?',
			accept: ['If you were the president now, what would you change first?'],
			traps: {
				were: ['are', 'was', 'be'],
				change: ['changed', 'changing', 'changes'],
			},
		},
		{
			id: 'conditional-clauses-39',
			form: 'negative',
			prompt: 'Якби в мене завтра не було іспиту, я б пішов на вечірку.',
			answer: "If I didn't have an exam tomorrow, I would go to the party.",
			accept: [
				"If I didn't have an exam tomorrow, {I would|I'd} go to {the|a} party.",
			],
			traps: {
				"didn't": ["don't", "won't", "hadn't"],
				would: ['will', 'did'],
			},
		},
		{
			id: 'conditional-clauses-40',
			form: 'affirmative',
			prompt: 'Якби я вчора знав про зустріч, я б прийшов.',
			answer: 'If I had known about the meeting yesterday, I would have come.',
			accept: [
				"{If I had|If I'd} known about the meeting yesterday, {I would|I'd} have come.",
			],
			traps: {
				known: ['knew', 'know', 'knowed'],
				have: ['had', 'has'],
			},
		},
		{
			id: 'conditional-clauses-41',
			form: 'affirmative',
			prompt: 'Якби ми вчора вийшли раніше, ми б встигли на потяг.',
			answer:
				'If we had left earlier yesterday, we would have caught the train.',
			accept: [
				"{If we had|If we'd} left earlier yesterday, {we would|we'd} have caught the train.",
			],
			traps: {
				left: ['leave', 'leaved', 'leaving'],
				caught: ['catch', 'catched', 'catching'],
			},
		},
		{
			id: 'conditional-clauses-42',
			form: 'negative',
			prompt:
				'Якби Марія минулого тижня не забула свій паспорт, вона б полетіла з нами.',
			answer:
				"If Maria hadn't forgotten her passport last week, she would have flown with us.",
			accept: [
				"If Maria hadn't forgotten her passport last week, she'd have flown with us.",
			],
			traps: {
				forgotten: ['forgot', 'forget', 'forgetting'],
				flown: ['flew', 'fly', 'flied'],
			},
		},
		{
			id: 'conditional-clauses-43',
			form: 'question',
			prompt: 'Ти б допоміг мені вчора, якби я попросив?',
			answer: 'Would you have helped me yesterday if I had asked?',
			accept: ["Would you have helped me yesterday if I'd asked?"],
			traps: {
				helped: ['help', 'helping', 'helps'],
				asked: ['ask', 'asking', 'asks'],
			},
		},
		{
			id: 'conditional-clauses-44',
			form: 'affirmative',
			prompt:
				'Якби ти минулого року старанніше вчив англійську, ти б склав іспит.',
			answer:
				'If you had studied English harder last year, you would have passed the exam.',
			accept: [
				"{If you had|If you'd} studied English harder last year, {you would|you'd} have passed the exam.",
			],
			traps: {
				studied: ['study', 'studies', 'studying'],
				passed: ['past', 'pass', 'passing'],
			},
		},
		{
			id: 'conditional-clauses-45',
			form: 'negative',
			prompt: 'Якби вчора не пішов дощ, ми б не скасували пікнік.',
			answer:
				"If it hadn't rained yesterday, we wouldn't have cancelled the picnic.",
			accept: [
				"If it hadn't rained yesterday, we wouldn't have canceled the picnic.",
			],
			traps: {
				rained: ['rain', 'rains', 'raining'],
				cancelled: ['cancel', 'cancels'],
			},
		},
		{
			id: 'conditional-clauses-46',
			form: 'question',
			prompt: 'Що б ти сказав, якби вчора її зустрів?',
			answer: 'What would you have said if you had met her yesterday?',
			accept: ["What would you have said if you'd met her yesterday?"],
			traps: {
				said: ['say', 'sayed', 'says'],
				met: ['meet', 'meeted', 'meets'],
			},
		},
		{
			id: 'conditional-clauses-47',
			form: 'negative',
			prompt:
				'Якби Андрій минулого місяця послухав мою пораду, він би не втратив гроші.',
			answer:
				"If Andriy had taken my advice last month, he wouldn't have lost the money.",
			accept: [
				"If Andriy had {taken|followed|listened to} my advice last month, he wouldn't have lost {the|his} money.",
			],
			traps: {
				had: ['has', 'have', 'would'],
				lost: ['lose', 'losed', 'loosed'],
			},
		},
		{
			id: 'conditional-clauses-48',
			form: 'negative',
			prompt: 'Якби я вчора ввечері поставив будильник, я б не проспав.',
			answer: "If I had set an alarm last night, I wouldn't have overslept.",
			accept: [
				"{If I had|If I'd} set {an|the|my} alarm last night, I wouldn't have overslept.",
			],
			traps: {
				set: ['setted', 'sets', 'setting'],
				overslept: ['oversleep', 'oversleeped', 'oversleeping'],
			},
		},
		{
			id: 'conditional-clauses-49',
			form: 'affirmative',
			prompt:
				'Якби ми минулого року купили цей будинок, ми б багато заощадили.',
			answer:
				'If we had bought this house last year, we would have saved a lot.',
			accept: [
				"{If we had|If we'd} bought this house last year, {we would|we'd} have saved a lot.",
			],
			traps: {
				bought: ['brought', 'buy', 'buyed'],
				saved: ['save', 'saves', 'saving'],
			},
		},
		{
			id: 'conditional-clauses-50',
			form: 'question',
			prompt: 'Ти б купив ту куртку вчора, якби вона була дешевшою?',
			answer:
				'Would you have bought that jacket yesterday if it had been cheaper?',
			traps: {
				bought: ['brought', 'buy', 'buying'],
				been: ['was', 'be', 'being'],
			},
		},
		{
			id: 'conditional-clauses-51',
			form: 'negative',
			prompt: 'Вони б не заблукали минулої суботи, якби взяли карту.',
			answer:
				"They wouldn't have got lost last Saturday if they had taken a map.",
			accept: [
				"They wouldn't have {got|gotten} lost last Saturday if {they had|they'd} taken a map.",
			],
			traps: {
				taken: ['took', 'take', 'taking'],
			},
		},
		{
			id: 'conditional-clauses-52',
			form: 'affirmative',
			prompt: 'Якби Ліза вчора мені подзвонила, я б їй усе пояснив.',
			answer:
				'If Liza had called me yesterday, I would have explained everything to her.',
			accept: [
				"If Liza had {called|phoned} me yesterday, {I would|I'd} have explained everything to her.",
			],
			traps: {
				called: ['call', 'calls', 'calling'],
				explained: ['explain', 'explains', 'explaining'],
			},
		},
		{
			id: 'conditional-clauses-53',
			form: 'affirmative',
			prompt: 'Якби ти вчора мене попередив, я міг би тобі допомогти.',
			answer: 'If you had warned me yesterday, I could have helped you.',
			accept: ["If you'd warned me yesterday, I could have helped you."],
			traps: {
				could: ['can', 'will'],
				helped: ['help', 'helping', 'helps'],
			},
		},
		{
			id: 'conditional-clauses-54',
			form: 'negative',
			prompt:
				'Якби я вчора не був таким утомленим, я, можливо, пішов би на вечірку.',
			answer:
				"If I hadn't been so tired yesterday, I might have gone to the party.",
			accept: [
				"If I hadn't been so tired yesterday, I might have gone to a party.",
			],
			traps: {
				been: ['was', 'be', 'being'],
				gone: ['went', 'go', 'going'],
			},
		},
		{
			id: 'conditional-clauses-55',
			form: 'question',
			prompt:
				'Ти б погодився на ту роботу минулого року, якби тобі більше платили?',
			answer:
				'Would you have taken that job last year if they had paid you more?',
			accept: [
				'Would you have {taken|accepted} that job last year if {they had paid you more|you had been paid more}?',
			],
			traps: {
				taken: ['took', 'take', 'taking'],
				paid: ['pay', 'payed', 'paying'],
			},
		},
		{
			id: 'conditional-clauses-56',
			form: 'negative',
			prompt:
				'Якби я вчора ввечері не засидівся допізна, я б зараз не був утомленим.',
			answer: "If I hadn't stayed up late last night, I wouldn't be tired now.",
			traps: {
				stayed: ['stay', 'stays', 'staying'],
				be: ['been', 'being', 'am'],
			},
		},
		{
			id: 'conditional-clauses-57',
			form: 'affirmative',
			prompt:
				'Якби Тарас минулого року переїхав до Львова, він би зараз жив поруч із нами.',
			answer:
				'If Taras had moved to Lviv last year, he would live near us now.',
			accept: [
				"If Taras had moved to Lviv last year, {he would|he'd} {live|be living} near us now.",
			],
			traps: {
				moved: ['move', 'moves', 'moving'],
				live: ['lived', 'lives', 'living'],
			},
		},
		{
			id: 'conditional-clauses-58',
			form: 'affirmative',
			prompt: 'Якби я вивчив японську в школі, я б зараз працював у Токіо.',
			answer: 'If I had learned Japanese at school, I would work in Tokyo now.',
			accept: [
				"{If I had|If I'd} {learned|learnt|studied} Japanese at school, {I would|I'd} {work|be working} in Tokyo now.",
			],
			traps: {
				learned: ['learn', 'learns', 'learning'],
				work: ['worked', 'works', 'working'],
			},
		},
		{
			id: 'conditional-clauses-59',
			form: 'question',
			prompt: 'Якби ти вчора не пропустив урок, ти б зараз розумів цю тему?',
			answer:
				"If you hadn't missed the lesson yesterday, would you understand this topic now?",
			accept: [
				'If you had not missed {the|a} lesson yesterday, would you understand this topic now?',
				"If you hadn't missed a lesson yesterday, would you understand this topic now?",
			],
			traps: {
				missed: ['miss', 'misses', 'missing'],
				understand: ['understood', 'understanding', 'understands'],
			},
		},
		{
			id: 'conditional-clauses-60',
			form: 'negative',
			prompt: 'Якби я не боявся висоти, я б учора піднявся на ту гору.',
			answer:
				"If I weren't afraid of heights, I would have climbed that mountain yesterday.",
			accept: [
				"If I {weren't|wasn't} afraid of heights, {I would|I'd} have climbed that mountain yesterday.",
			],
			traps: {
				have: ['had', 'has'],
				climbed: ['climb', 'climbs', 'climbing'],
			},
		},
		{
			id: 'conditional-clauses-61',
			form: 'negative',
			prompt:
				'Якби Ніна була уважнішою, вона б не зробила стільки помилок у вчорашньому тесті.',
			answer:
				"If Nina were more careful, she wouldn't have made so many mistakes in yesterday's test.",
			accept: [
				"If Nina {were|was} more {careful|attentive}, she wouldn't have made so many mistakes {in|on} yesterday's test.",
			],
			traps: {
				made: ['did', 'make', 'done'],
			},
		},
		{
			id: 'conditional-clauses-62',
			form: 'affirmative',
			prompt: 'Якби ми вчора купили квитки, ми б зараз сиділи в літаку.',
			answer:
				'If we had bought the tickets yesterday, we would be on the plane now.',
			accept: [
				"{If we had|If we'd} bought {the|} tickets yesterday, {we would|we'd} be {sitting|} on the plane now.",
			],
			traps: {
				bought: ['brought', 'buy', 'buys'],
				be: ['been', 'are', 'have'],
			},
		},
		{
			id: 'conditional-clauses-63',
			form: 'negative',
			prompt: 'Якби я не отримав стипендію, я б зараз не навчався в Оксфорді.',
			answer:
				"If I hadn't got the scholarship, I wouldn't be studying at Oxford now.",
			accept: [
				"If I hadn't {got|received} {the|a} scholarship, I wouldn't be studying at Oxford now.",
			],
			traps: {
				studying: ['study', 'studied', 'studies'],
			},
		},
		{
			id: 'conditional-clauses-64',
			form: 'question',
			prompt: 'Ти б зараз жив у Канаді, якби минулого року отримав візу?',
			answer: 'Would you live in Canada now if you had got the visa last year?',
			accept: [
				"Would you {live|be living} in Canada now if {you had|you'd} {got|gotten|received} {the|a} visa last year?",
			],
			traps: {
				live: ['lived', 'lives', 'living'],
				had: ['have', 'would', 'has'],
			},
		},
		{
			id: 'conditional-clauses-65',
			form: 'negative',
			prompt:
				"Якби Сергій не був таким сором'язливим, він би вчора заговорив з нею.",
			answer:
				"If Serhiy weren't so shy, he would have spoken to her yesterday.",
			accept: [
				"If Serhiy {weren't|wasn't} so shy, {he would|he'd} have {spoken|talked} to her yesterday.",
			],
			traps: {
				have: ['had', 'has'],
				spoken: ['spoke', 'speak', 'speaking'],
			},
		},
		{
			id: 'conditional-clauses-66',
			form: 'negative',
			prompt: 'Ти не складеш іспит, якщо не почнеш учитися.',
			answer: "You won't pass the exam unless you start studying.",
			accept: [
				"You won't pass the exam {unless you start|if you don't start} {studying|to study}.",
			],
			traps: {
				unless: ['until', 'except'],
				start: ['started', 'will', 'starts'],
			},
		},
		{
			id: 'conditional-clauses-67',
			form: 'affirmative',
			prompt: 'Якщо ти не поспішиш, ми запізнимося.',
			answer: "Unless you hurry, we'll be late.",
			accept: ["If you don't hurry, we'll be late."],
			traps: {
				unless: ['Until', 'Except'],
				hurry: ['hurried', 'hurries', 'will'],
			},
		},
		{
			id: 'conditional-clauses-68',
			form: 'negative',
			prompt: 'Я не піду на вечірку, якщо ти не підеш зі мною.',
			answer: "I won't go to the party unless you come with me.",
			accept: [
				"I won't go to the party {unless you|if you don't} {come|go} with me.",
			],
			traps: {
				unless: ['until', 'without'],
				come: ['came', 'comes', 'will'],
			},
		},
		{
			id: 'conditional-clauses-69',
			form: 'affirmative',
			prompt: 'Якщо не буде дощу, матч відбудеться.',
			answer: 'Unless it rains, the match will take place.',
			accept: [
				"{Unless it rains|If it doesn't rain}, the match will {take place|go ahead}.",
			],
			traps: {
				unless: ['Until', 'Except'],
				rains: ['rained', 'will', 'raining'],
			},
		},
		{
			id: 'conditional-clauses-70',
			form: 'negative',
			prompt: 'Я не допомагатиму тобі, якщо ти не скажеш правди.',
			answer: "I won't help you unless you tell the truth.",
			accept: ["I won't help you {unless you|if you don't} tell the truth."],
			traps: {
				unless: ['until', 'except'],
				tell: ['say', 'told', 'will'],
			},
		},
		{
			id: 'conditional-clauses-71',
			form: 'negative',
			prompt: 'Не дзвони мені, якщо це не терміново.',
			answer: "Don't call me unless it's urgent.",
			accept: ["Don't call me {unless it is|if it isn't} urgent."],
			traps: {
				unless: ['until', 'except', 'without'],
			},
		},
		{
			id: 'conditional-clauses-72',
			form: 'negative',
			prompt: 'Якщо Петро не вибачиться, Оля з ним не розмовлятиме.',
			answer: "Unless Petro apologises, Olya won't talk to him.",
			accept: [
				"{Unless Petro apologises|Unless Petro apologizes|If Petro doesn't apologise|If Petro doesn't apologize}, Olya won't {talk|speak} to him.",
			],
			traps: {
				unless: ['Until', 'Without'],
				"won't": ["wouldn't", "wasn't", "isn't"],
			},
		},
		{
			id: 'conditional-clauses-73',
			form: 'negative',
			prompt: 'Ти не можеш увійти, якщо в тебе немає квитка.',
			answer: "You can't go in unless you have a ticket.",
			accept: [
				"You can't {go in|get in|enter} {unless you have|if you don't have} a ticket.",
			],
			traps: {
				unless: ['until', 'except', 'without'],
				have: ['has', 'had', 'having'],
			},
		},
		{
			id: 'conditional-clauses-74',
			form: 'affirmative',
			prompt: 'Ти можеш узяти мою машину за умови, що повернеш її до восьмої.',
			answer: 'You can take my car provided that you return it by eight.',
			accept: [
				`You can {take|borrow} my car ${PROVIDED} you {return it|bring it back} by eight.`,
			],
			traps: {
				provided: ['provide', 'provides'],
				return: ['returned', 'returns', 'will'],
			},
		},
		{
			id: 'conditional-clauses-75',
			form: 'affirmative',
			prompt: 'Я піду з тобою за умови, що ти заплатиш за квитки.',
			answer: "I'll go with you as long as you pay for the tickets.",
			accept: [`I'll {go|come} with you ${PROVIDED} you pay for the tickets.`],
			traps: {
				long: ['short', 'big', 'longer'],
				pay: ['paid', 'pays', 'will'],
			},
		},
		{
			id: 'conditional-clauses-76',
			form: 'affirmative',
			prompt: 'Ми поїдемо на пікнік за умови, що буде гарна погода.',
			answer: "We'll go on a picnic provided the weather is good.",
			accept: [
				`We'll {go on|have} a picnic ${PROVIDED} the weather is {good|nice|fine}.`,
			],
			traps: {
				is: ['will', 'was', 'be'],
			},
		},
		{
			id: 'conditional-clauses-77',
			form: 'negative',
			prompt: 'Я не проти, за умови що ти не запізнишся.',
			answer: "I don't mind as long as you aren't late.",
			accept: [`I don't mind ${PROVIDED} you aren't late.`],
			traps: {
				long: ['short', 'big', 'longer'],
				"aren't": ["won't", "weren't", "don't"],
			},
		},
		{
			id: 'conditional-clauses-78',
			form: 'negative',
			prompt: 'Ти можеш залишитися тут за умови, що не шумітимеш.',
			answer: "You can stay here as long as you don't make any noise.",
			accept: [`You can stay here ${PROVIDED} you don't make {any|} noise.`],
			traps: {
				make: ['do', 'made', 'will'],
			},
		},
		{
			id: 'conditional-clauses-79',
			form: 'negative',
			prompt:
				'За умови, що квитки не будуть надто дорогими, ми поїдемо на концерт.',
			answer:
				"Provided that the tickets aren't too expensive, we'll go to the concert.",
			accept: [
				"{Provided that|Provided|Providing that|Providing|As long as|On condition that} the tickets aren't too expensive, we'll go to the concert.",
			],
			traps: {
				provided: ['Provide', 'Provides'],
				"aren't": ["won't", "weren't", "don't"],
			},
		},
		{
			id: 'conditional-clauses-80',
			form: 'affirmative',
			prompt: 'Візьми парасольку на випадок, якщо піде дощ.',
			answer: 'Take an umbrella in case it rains.',
			accept: ['Take {the|your} umbrella in case it rains.'],
			traps: {
				case: ['cause', 'fact', 'event'],
				rains: ['rain', 'rained', 'will'],
			},
		},
		{
			id: 'conditional-clauses-81',
			form: 'affirmative',
			prompt: 'Я запишу твій номер на випадок, якщо загублю свій телефон.',
			answer: "I'll write down your number in case I lose my phone.",
			accept: ["I'll write your number down in case I lose my phone."],
			traps: {
				lose: ['loose', 'lost', 'will'],
			},
		},
		{
			id: 'conditional-clauses-82',
			form: 'affirmative',
			prompt: 'Я візьму із собою зарядку на випадок, якщо сяде батарея.',
			answer: "I'll take a charger with me in case the battery dies.",
			accept: [
				"I'll take a charger with me in case the battery {dies|runs out|goes dead}.",
			],
			traps: {
				case: ['cause', 'fact', 'event'],
				dies: ['died', 'dying', 'will'],
			},
		},
		{
			id: 'conditional-clauses-83',
			form: 'question',
			prompt: 'Мені взяти куртку на випадок, якщо похолодає?',
			answer: 'Should I take a jacket in case it gets cold?',
			accept: ['{Should|Shall} I take a jacket in case it gets {cold|colder}?'],
			traps: {
				gets: ['got', 'get', 'will'],
			},
		},
		{
			id: 'conditional-clauses-84',
			form: 'affirmative',
			prompt: 'Залиш мені ключі на випадок, якщо я повернуся раніше.',
			answer: 'Leave me the keys in case I come back early.',
			accept: [
				'Leave me the keys in case I {come back|get back|return} {early|earlier}.',
			],
			traps: {
				come: ['came', 'comes', 'will'],
			},
		},
		{
			id: 'conditional-clauses-85',
			form: 'negative',
			prompt: 'Не вимикай телефон на випадок, якщо я подзвоню.',
			answer: "Don't turn off your phone in case I call.",
			accept: ["Don't {turn off|switch off} {your|the} phone in case I call."],
			traps: {
				case: ['cause', 'fact', 'event'],
				call: ['called', 'calls', 'will'],
			},
		},
		{
			id: 'conditional-clauses-86',
			form: 'affirmative',
			prompt: 'Якби я знав, що ти був у лікарні, я б тебе відвідав.',
			answer: 'Had I known you were in hospital, I would have visited you.',
			accept: [
				"{Had I known|If I had known|If I'd known} {that|} you were in {hospital|the hospital}, {I would|I'd} have visited you.",
			],
			traps: {
				had: ['Have', 'Would', 'Did'],
				known: ['knew', 'know', 'knowed'],
			},
		},
		{
			id: 'conditional-clauses-87',
			form: 'negative',
			prompt:
				'Якби ми сьогодні вранці вийшли на годину раніше, ми б не застрягли в заторі.',
			answer:
				"Had we left an hour earlier this morning, we wouldn't have got stuck in traffic.",
			accept: [
				"{Had we left|If we had left|If we'd left} an hour earlier this morning, we wouldn't have {got|gotten} stuck in traffic.",
			],
			traps: {
				had: ['Have', 'Would', 'Did'],
				left: ['leave', 'leaved', 'leaving'],
			},
		},
		{
			id: 'conditional-clauses-88',
			form: 'affirmative',
			prompt: 'На твоєму місці я б подав заявку на цю роботу.',
			answer: 'Were I you, I would apply for this job.',
			accept: ["{Were I you|If I were you}, {I would|I'd} apply for this job."],
			traps: {
				were: ['Was', 'Am', 'Be'],
				apply: ['applied', 'applies', 'applying'],
			},
		},
		{
			id: 'conditional-clauses-89',
			form: 'affirmative',
			prompt: 'Якби уряд зараз підвищив податки, люди були б незадоволені.',
			answer:
				'Were the government to raise taxes now, people would be unhappy.',
			accept: [
				'{Were the government to raise|If the government were to raise|If the government raised} taxes now, people would be {unhappy|dissatisfied}.',
			],
			traps: {
				raise: ['rise', 'rises', 'raising'],
				would: ['will', 'are'],
			},
		},
		{
			id: 'conditional-clauses-90',
			form: 'affirmative',
			prompt: 'Якби вона зараз була багатшою, вона б подорожувала світом.',
			answer: 'Were she richer now, she would travel the world.',
			accept: [
				"{Were she|If she were|If she was} richer now, {she would|she'd} travel {around|} the world.",
			],
			traps: {
				were: ['Was', 'Is', 'Be'],
				travel: ['travelled', 'travels', 'travelling'],
			},
		},
		{
			id: 'conditional-clauses-91',
			form: 'affirmative',
			prompt: 'Якщо вам знадобиться допомога, зателефонуйте мені.',
			answer: 'Should you need any help, call me.',
			accept: [
				'{Should you need|If you need|If you should need} {any|} help, {call|phone} me.',
			],
			traps: {
				should: ['Would', 'Will', 'Shall'],
				need: ['needed', 'needs', 'needing'],
			},
		},
		{
			id: 'conditional-clauses-92',
			form: 'affirmative',
			prompt:
				'Якщо у вас виникнуть запитання, звертайтеся до нашого менеджера.',
			answer: 'Should you have any questions, contact our manager.',
			accept: [
				'{Should you have|If you have} any questions, {contact|ask} our manager.',
			],
			traps: {
				should: ['Would', 'Will', 'Shall'],
				have: ['has', 'had', 'having'],
			},
		},
		{
			id: 'conditional-clauses-93',
			form: 'negative',
			prompt: 'Якщо поїзд не прийде вчасно, ми візьмемо таксі.',
			answer: "Should the train not arrive on time, we'll take a taxi.",
			accept: [
				"{Should the train not arrive|If the train doesn't arrive} on time, we'll take a taxi.",
			],
			traps: {
				should: ['Would', 'Will', 'Shall'],
				arrive: ['arrives', 'arrived', 'arriving'],
			},
		},
		{
			id: 'conditional-clauses-94',
			form: 'negative',
			prompt: 'Якби ти вчора не нагадав мені, я б забув про зустріч.',
			answer:
				'Had you not reminded me yesterday, I would have forgotten the meeting.',
			accept: [
				"{Had you not reminded|If you hadn't reminded} me yesterday, {I would|I'd} have forgotten {about|} the meeting.",
			],
			traps: {
				had: ['Have', 'Would', 'Did'],
				forgotten: ['forgot', 'forget', 'forgetting'],
			},
		},
		{
			id: 'conditional-clauses-95',
			form: 'affirmative',
			prompt: 'Якби я минулого року мав більше часу, я б вивчив італійську.',
			answer: 'Had I had more time last year, I would have learned Italian.',
			accept: [
				"{Had I had|If I had had|If I'd had} more time last year, {I would|I'd} have {learned|learnt} Italian.",
			],
			traps: {
				learned: ['learn', 'learns', 'learning'],
			},
		},
		{
			id: 'conditional-clauses-96',
			form: 'question',
			prompt: 'Якби ти міг змінити одну річ у своєму житті, що б це було?',
			answer: 'If you could change one thing in your life, what would it be?',
			traps: {
				could: ['can', 'will'],
				be: ['is', 'been', 'was'],
			},
		},
		{
			id: 'conditional-clauses-97',
			form: 'question',
			prompt: 'Що сталося б, якби ти вчора не втрутився?',
			answer: "What would have happened if you hadn't intervened yesterday?",
			accept: [
				"What would have happened if you {hadn't|had not} {intervened|stepped in} yesterday?",
			],
			traps: {
				happened: ['happen', 'happens', 'happening'],
				"hadn't": ["didn't", "haven't", "wouldn't"],
			},
		},
		{
			id: 'conditional-clauses-98',
			form: 'question',
			prompt: 'Якщо рейс скасують, ти залишишся в готелі?',
			answer: 'If the flight is cancelled, will you stay at a hotel?',
			accept: [
				'If the flight is {cancelled|canceled}, will you stay {at|in} a hotel?',
			],
			traps: {
				is: ['will', 'was', 'be'],
				will: ['would', 'do', 'are'],
			},
		},
		{
			id: 'conditional-clauses-99',
			form: 'question',
			prompt: 'Хіба ти не був би зараз щасливішим, якби жив ближче до моря?',
			answer: "Wouldn't you be happier now if you lived closer to the sea?",
			accept: [
				"Wouldn't you be happier now if you lived {closer to|nearer to|nearer} the sea?",
			],
			traps: {
				lived: ['live', 'lives', 'living'],
				be: ['been', 'are', 'have'],
			},
		},
		{
			id: 'conditional-clauses-100',
			form: 'question',
			prompt: 'Якщо я дам тобі свою адресу, ти мені напишеш?',
			answer: 'If I give you my address, will you write to me?',
			accept: ['If I give you my address, will you write me?'],
			traps: {
				give: ['gave', 'given', 'will'],
			},
		},
	],
})
