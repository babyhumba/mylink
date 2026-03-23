# GEMINI.md - Project Context & Instructions

## Project Overview
This project is a modern web application built with **Next.js**, **React 19**, and **Tailwind CSS 4**. It appears to be a personal profile or portfolio site, currently in its initial setup phase.

The main application code is located in the `my-profile/` directory.

### Core Technologies
- **Framework:** Next.js (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4 (with @tailwindcss/postcss)
- **Language:** TypeScript
- **Fonts:** Geist & Geist Mono (via next/font)

## Directory Structure
- `my-profile/`: The main Next.js application directory.
  - `app/`: Contains the application routes, layouts, and global styles.
  - `public/`: Static assets like images and icons.
  - `components/`: (Recommended) Place reusable UI components here.
  - `package.json`: Project dependencies and scripts.
  - `tsconfig.json`: TypeScript configuration.
  - `next.config.ts`: Next.js configuration.

## Building and Running
All commands should be executed within the `my-profile/` directory.

### Development
To start the development server with Hot Module Replacement (HMR):
```bash
cd my-profile
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production
To create an optimized production build:
```bash
cd my-profile
npm run build
```

To start the production server:
```bash
cd my-profile
npm run start
```

### Linting
To run the ESLint check:
```bash
cd my-profile
npm run lint
```

## Development Conventions
- **Routing:** Uses the Next.js **App Router**. Define new routes by creating directories with `page.tsx` files inside `my-profile/app/`.
- **Styling:** Use **Tailwind CSS 4** utility classes directly in your TSX files. Global styles are managed in `my-profile/app/globals.css`.
- **Components:** Favor Functional Components with TypeScript interfaces for props.
- **Type Safety:** Ensure all new code is properly typed. Avoid using `any`.
- **Assets:** Place static images and icons in the `my-profile/public/` directory and reference them starting from the root path (e.g., `/next.svg`).

## Implementation Details (Next.js 16 + React 19)
Note that this project uses **Next.js 16.1.6** and **React 19.2.3**. Ensure that any libraries added are compatible with these versions. Tailwind CSS 4 is used, which may have different configuration patterns (like using `@theme` in CSS instead of a dedicated `tailwind.config.js` if it's fully migrated).
