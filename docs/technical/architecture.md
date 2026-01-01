# System Architecture

## Overview
Prompthive Zero is a **Client-Side Only** web application. It runs entirely within the user's browser and interacts with the local file system using the **File System Access API**.

## Architectural Components

### 1. Presentation Layer (React + Tailwind)
- **App Shell**: Handles global layout, sidebar, and theme.
- **Components**: Reusable UI elements (Button, Card, Input) matching the design system.
- **Pages**:
    - `SetupLayout`: First-run experience for selecting the root folder.
    - `DashboardLayout`: Main view for browsing and managing prompts.

### 2. State Management (React Context/Hooks)
- **WorkspaceContext**: Manages the handle to the root directory and the `database.json` file.
- **PromptContext**: Loads and caches the list of prompts in memory.

### 3. Data Access Layer (DAL)
- **FileSystem Service**:
    - Abstraction over `window.showDirectoryPicker()`.
    - Handles reading/writing `database.json`.
    - Handles writing binary blobs to `uploads/`.
- **Validation**:
    - Uses `zod` to validate the schema of `database.json` on load.

## Data Model

### Database (`database.json`)
The single source of truth. A JSON object containing metadata and the list of prompts.

```json
{
  "version": 1,
  "config": {
    "theme": "dark"
  },
  "collections": [
    { "id": "col_1", "name": "Coding" }
  ],
  "prompts": [
    {
      "id": "uuid-v4",
      "title": "React Component Generator",
      "description": "Create a clean react component...",
      "body": "Write a React component that...",
      "tags": ["react", "frontend"],
      "collectionId": "col_1",
      "attachments": [
        { "id": "att_1", "fileName": "screenshot.png" }
      ],
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    }
  ]
}
```

### File Storage
- **Root**: User selected folder.
- **`database.json`**: The file above.
- **`uploads/`**: Directory containing all image assets. Images are referenced by filename in the JSON.

## Security
- **Sandboxing**: The browser sandbox ensures the app cannot access files outside the selected directory.
- **Permissions**: The user must explicitly grant read/write access on every session (browser dependent).

