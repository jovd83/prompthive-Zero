# Epics - Prompthive Zero

## Epic 1: Local Workspace Initialization
**Rationale**: Unlike the web version, "Zero" has no backend database. It must initialize its "database" and asset storage within a user-chosen local directory to ensure data ownership and privacy.
- **Goal**: Enable the user to select a local folder where Prompthive Zero will store all data (`database.json`) and assets (`uploads/`).

## Epic 2: Prompt Management
**Rationale**: The core value proposition is storing and organizing prompts. Users need full CRUD capabilities matching the original app.
- **Goal**: Create, view, update, and delete prompts, including their metadata (title, description, tags, variables).

## Epic 3: Asset & Attachment Handling
**Rationale**: Prompts often require context images. These must be stored locally and referenced correctly in the JSON database without full path dependencies (relative paths).
- **Goal**: Allow users to attach images to prompts, which are then saved to the `uploads/` folder and displayed in the UI.

## Epic 4: Organization & Discovery
**Rationale**: As the library grows, users need ways to organize content. Collections and tags provided in the original app must be replicated.
- **Goal**: Implement Collections (folders) and Tags to categorize prompts, along with a Sidebar for navigation.

## Epic 5: Zero-server Architecture
**Rationale**: The app must run as a single file without `npm run dev` or a Python server.
- **Goal**: Ensure the entire app logic handles persistence via the File System Access API directly from the browser.
