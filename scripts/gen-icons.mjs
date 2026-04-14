import sharp from 'sharp'

// Dark circle with gold "NAZAR" text (full name on large, "N" on small)
function makeSvg(size) {
	const cx = size / 2
	const cy = size / 2
	const r = size / 2 - 1
	const ring = Math.max(0.5, size * 0.012)

	// At 16/32px only "N" fits legibly; larger sizes get full "NAZAR"
	const small = size <= 32
	const label = small ? 'N' : 'NAZAR'
	const fontSize = small ? size * 0.82 : size * 0.26
	const letterSp = small ? '0' : `${size * 0.025}`

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0a0908"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c8a76a" stroke-width="${ring}" opacity="0.5"/>
  <text
    x="${cx}" y="${cy}"
    text-anchor="middle"
    dominant-baseline="central"
    font-family="Georgia, serif"
    font-size="${fontSize}"
    font-weight="400"
    letter-spacing="${letterSp}"
    fill="#c8a76a"
  >${label}</text>
</svg>`
}

const sizes = [16, 32, 48, 96, 128]
const outDir = 'apps/extension/public/icon'

for (const size of sizes) {
	await sharp(Buffer.from(makeSvg(size)))
		.png()
		.toFile(`${outDir}/${size}.png`)
	console.log(`✓ ${size}x${size}`)
}
console.log('Icons generated.')
