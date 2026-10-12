const params = new URLSearchParams(window.location.search)
document.getElementById('domain').textContent =
	params.get('domain') || 'this site'

const quotes = [
	'"Your attention is the most valuable thing you have."',
	'"Deep work is the superpower of our age."',
	'"What you do today is what matters most."',
	'"The secret of getting things done is to act."',
	'"Focus is the art of knowing what to ignore."',
	'"Every moment of resistance builds something."',
	'"Lost time is never found again."',
	'"You may delay, but time will not."',
	'"The bad news is time flies. The good news is you\'re the pilot."',
	'"Time wasted is existence used."',
	'"Ordinary people think merely of spending time. Great people think of using it."',
	'"It\'s not that we have little time, but that we waste a good deal of it."',
	'"Guard well your spare moments. They are like uncut diamonds."',
	'"Either you run the day or the day runs you."',
	'"Discipline is choosing between what you want now and what you want most."',
]
document.getElementById('quote').textContent =
	quotes[Date.now() % quotes.length]

document
	.getElementById('back-btn')
	.addEventListener('click', () => history.back())
