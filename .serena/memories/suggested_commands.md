# Suggested Commands

## Development Commands

### Start Development Server

```bash
bun dev
# or
npm run dev
```

Starts the Vite development server with HMR. The app will be available at http://localhost:5173 (default Vite port).

### Build for Production

```bash
bun run build
# or
npm run build
```

Runs TypeScript type checking (`tsc -b`) followed by Vite production build. Output is in the `dist/` directory.

### Preview Production Build

```bash
bun run preview
# or
npm run preview
```

Locally preview the production build before deployment.

### Lint Code

```bash
bun run lint
# or
npm run lint
```

Runs ESLint on all TypeScript/TSX files to check for code quality issues.

## Package Management

### Install Dependencies

```bash
bun install
# or
npm install
```

### Add a Dependency

```bash
bun add <package-name>
# or
npm install <package-name>
```

### Add a Dev Dependency

```bash
bun add -D <package-name>
# or
npm install -D <package-name>
```

## Git Commands

Standard git commands work as expected on Linux:

- `git status` - Check repository status
- `git add <file>` - Stage files
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote
- `git pull` - Pull from remote

## Useful System Commands (Linux)

- `ls` - List files
- `cd <directory>` - Change directory
- `pwd` - Print working directory
- `grep <pattern> <files>` - Search for patterns
- `find <path> -name <pattern>` - Find files
- `cat <file>` - Display file contents
- `rm <file>` - Remove file
- `mkdir <directory>` - Create directory
