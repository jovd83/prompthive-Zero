# Project Setup & Foundation

## Tech Stack Decisions

### Frontend Framework
**React 18 + Vite**
- **Rationale**: Vite provides an extremely fast dev server and build process. React is the industry standard for component-based UIs and matches the requested "modern" feel.
- **Single File Support**: We are using `vite-plugin-singlefile` to inline all assets (JS, CSS) into a single HTML file, satisfying the "downloadable as 1 file" requirement.

### Styling
**Tailwind CSS**
- **Rationale**: Matches the original Prompthive stack. Allows for rapid UI development and easy theming to achieve the "premium" aesthetic.

### Data Persistence
**File System Access API**
- **Rationale**: Enables the app to read/write files directly to a user's local folder without a backend server.
- **Limitation**: Requires Chromium-based browsers (Chrome, Edge). This is an acceptable trade-off for a "Zero" local version.
- **Database**: A simple `database.json` file will store metadata.
- **Assets**: Images will be stored in an `uploads/` subdirectory.

### Testing
- **Unit**: Vitest (fast, compatible with Vite).
- **E2E**: Playwright (reliable browser automation).

## Folder Structure

```plaintext
prompthiveZero/
├── .github/                # CI/CD workflows
├── docs/                   # Documentation assets
│   ├── diagrams/           # Architecture & Data models
│   ├── functional analysis/# Epics & Stories
│   ├── technical/          # Tech docs
│   └── wireframes/         # UI Wireframes
├── frontend-tests/         # Playwright E2E tests
├── src/
│   ├── components/         # Reusable UI components
│   ├── lib/                # Core logic (Storage, Utils)
│   ├── types/              # TypeScript definitions
│   ├── App.tsx             # Main entry point
│   └── main.tsx            # React root
├── public/                 # Static assets (if any, though mostly inlined)
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Setup Instructions

1.  **Install Dependencies**: `npm install`
2.  **Run Development**: `npm run dev`
3.  **Build Single File**: `npm run build` (Output: `dist/index.html`)
