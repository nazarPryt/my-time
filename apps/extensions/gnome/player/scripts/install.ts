import path from 'node:path'
import { ARCHIVE_NAME, EXTENSION_UUID } from './extension-uuid'

const archive = path.resolve(import.meta.dir, '../build', ARCHIVE_NAME)
const install = Bun.spawn(['gnome-extensions', 'install', '--force', archive], {
	stdout: 'inherit',
	stderr: 'inherit',
})
if (await install.exited) throw new Error('Unable to install GNOME extension')
console.info(
	`Installed. Log out and back in, then run: gnome-extensions enable ${EXTENSION_UUID}`,
)
