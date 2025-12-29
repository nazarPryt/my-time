# Task Completion Checklist

When completing a development task in this project, follow this checklist:

## 1. Code Quality

- [ ] Run linting: `bun run lint`
- [ ] Fix any ESLint errors or warnings
- [ ] Ensure TypeScript types are correct (no `any` unless necessary)
- [ ] Remove unused imports, variables, and parameters

## 2. Testing

- [ ] Test changes in development mode: `bun dev`
- [ ] Verify Hot Module Replacement (HMR) works correctly
- [ ] Check browser console for errors
- [ ] Test in different browsers if UI changes were made

## 3. Build Verification

- [ ] Run production build: `bun run build`
- [ ] Ensure build completes without TypeScript errors
- [ ] Preview production build: `bun run preview`
- [ ] Verify functionality in production build

## 4. Code Review

- [ ] Follow React Hooks rules (no hooks in conditionals/loops)
- [ ] Use functional components with hooks
- [ ] Ensure proper component naming (PascalCase)
- [ ] Check that no unused locals or parameters exist
- [ ] Verify strict TypeScript compliance

## 5. Git

- [ ] Stage relevant files: `git add <files>`
- [ ] Write clear commit message: `git commit -m "descriptive message"`
- [ ] Push changes if needed: `git push`

## Notes

- The project does not currently have a test suite configured
- Consider adding tests for critical functionality
- Always run `bun run build` before committing to catch TypeScript errors early
