# Copilot Instructions for ktigerstudyfe

## Project Overview
- **Frontend**: React (TypeScript, Vite) in `src/`
- **Backend**: Java (Spring-like structure) in `backend-code/`
- **Static Assets**: `public/`
- **SQL Scripts**: `backend-code/*.sql`

## Architecture & Data Flow
- **Frontend** communicates with backend via REST APIs (see `backend-code/*Controller.java`).
- **Backend** uses service/repository pattern: `*Controller.java` → `*Service.java`/`*ServiceImpl.java` → `*Repository.java`.
- **DTOs/Responses**: Data transfer objects in `backend-code/` (e.g., `UserProgressDTO.java`, `ExamResultResponse.java`).
- **Frontend** is modular: features in `src/components/`, pages in `src/pages/`, context in `src/context/`.

## Developer Workflows
- **Build frontend**: `npm run build` (uses Vite, see `vite.config.ts`)
- **Dev server**: `npm run dev`
- **Type checking**: `tsc --noEmit`
- **Linting**: `npx eslint .` (config: `eslint.config.js`)
- **Backend**: Java files are not built by Node; use your Java IDE/build tools.

## Project Conventions
- **TypeScript**: Use types/interfaces from `src/types/`.
- **React**: Functional components, hooks in `src/hooks/`, context in `src/context/`.
- **File naming**: PascalCase for components, camelCase for hooks, UPPER_SNAKE_CASE for constants.
- **Backend**: Service/Repository/Controller naming is strict; keep new files consistent.
- **SQL**: Place migration/data scripts in `backend-code/`.

## Integration Points
- **API endpoints**: Defined in backend `*Controller.java` files.
- **Frontend API calls**: Use services in `src/services/`.
- **Assets**: Use `public/images/` for static files.

## Examples
- Add a new React page: `src/pages/NewPage.tsx`, route in `App.tsx`.
- Add a backend endpoint: create method in `*Controller.java`, implement in `*ServiceImpl.java`, add to `*Repository.java` if needed.

## References
- See `vite.config.ts`, `tsconfig.json`, and `eslint.config.js` for build/lint/type settings.
- See `backend-code/DEPLOYMENT-GUIDE.md` for backend deployment.

---

**Update this file if you introduce new conventions or workflows.**
