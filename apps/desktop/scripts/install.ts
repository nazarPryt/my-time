import path from 'node:path'

const archive = path.resolve(
	import.meta.dir,
	'../build/my-time@my-time.local.shell-extension.zip',
)
const install = Bun.spawn(['gnome-extensions', 'install', '--force', archive], {
	stdout: 'inherit',
	stderr: 'inherit',
})
if (await install.exited) throw new Error('Unable to install GNOME extension')
console.info(
	'Installed. Log out and back in, then run: gnome-extensions enable my-time@my-time.local',
)
