# User Stories - Prompthive Zero

## Workspace Initialization

### US-1: Select Project Folder
**As a** user,
**I want to** select a folder on my computer to serve as my Prompthive Library,
**So that** my data is stored locally and persists between sessions.

**Acceptance Criteria:**
- [ ] On first load, seeing a "Select Workspace" button.
- [ ] Clicking invokes the browser's directory picker.
- [ ] App checks for write permission and requests it if needed.
- [ ] If `database.json` exists, load it.
- [ ] If not, create an empty `database.json` and `uploads/` folder.
- [ ] Validates the folder is writable.

## Prompt Management

### US-2: Create New Prompt
**As a** user,
**I want to** create a new prompt with a title, body, and tags,
**So that** I can save my prompt engineering work.

**Acceptance Criteria:**
- [ ] "New Prompt" button in UI.
- [ ] Form with: Title, Description, Prompt Body, Tags input.
- [ ] Saving writes the new entry to `database.json`.
- [ ] UI updates immediately to show the new prompt.

### US-3: Edit Prompt
**As a** user,
**I want to** edit an existing prompt,
**So that** I can refine it over time.

**Acceptance Criteria:**
- [ ] Clicking a prompt opens the Detail View.
- [ ] "Edit" mode makes fields editable.
- [ ] Changes are saved to `database.json` on "Save".

## Asset Handling

### US-4: Attach Images
**As a** user,
**I want to** drag and drop images onto a prompt,
**So that** I can associate visual context with it.

**Acceptance Criteria:**
- [ ] Drag & Drop zone in the Prompt Editor.
- [ ] Dropped files are read, given unique names (UUID), and written to the `uploads/` folder.
- [ ] `database.json` stores the filename (relative path).
- [ ] Image renders in the UI by reading the file blob from the handle.

## Organization

### US-5: Manage Collections
**As a** user,
**I want to** create collections and move prompts into them,
**So that** I can keep my library organized.

**Acceptance Criteria:**
- [ ] Sidebar lists Collections.
- [ ] "Create Collection" button adds a new group.
- [ ] Prompts can be assigned to a Collection (dropdown or drag-drop).
