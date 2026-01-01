
import { get, set } from 'idb-keyval'; // Persistence

// Types
export interface Prompt {
    id: string;
    title: string;
    description: string;
    body: string;
    // Phase 3 Features
    shortPrompt?: string;
    exampleOutput?: string;
    expectedResult?: string;
    isFavorite?: boolean;

    tags: string[];
    collectionId?: string;
    // Removed attachments
    createdAt: string;
    updatedAt: string;
}

export interface Collection {
    id: string;
    name: string;
    // Phase 3 Features
    parentId?: string | null;
}

export interface Database {
    version: number;
    prompts: Prompt[];
    collections: Collection[];
}

const DEFAULT_DB: Database = {
    version: 1,
    prompts: [],
    collections: []
};

// Global handle storage
let rootHandle: FileSystemDirectoryHandle | null = null;
const DB_FILENAME = 'database.json';
const HANDLE_KEY = 'prompthive-root-handle';

export const storage = {

    async getStoredHandleName(): Promise<string | null> {
        try {
            const handle = await get(HANDLE_KEY);
            return handle ? (handle.name || 'Stored Project') : null;
        } catch {
            return null;
        }
    },

    async restoreHandle(): Promise<boolean> {
        try {
            const handle = await get(HANDLE_KEY);
            if (handle) {
                // Verify permission
                const options = { mode: 'readwrite' };

                // @ts-ignore
                if ((await handle.queryPermission(options)) === 'granted') {
                    rootHandle = handle;
                    return true;
                }
                // Request permission
                // @ts-ignore - TS types for requestPermission often vary
                if ((await handle.requestPermission(options)) === 'granted') {
                    rootHandle = handle;
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.error("Failed to restore handle", e);
            return false;
        }
    },

    async openProjectFolder(): Promise<void> {
        try {
            rootHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });

            // Persist handle
            try {
                await set(HANDLE_KEY, rootHandle);
            } catch (err) {
                console.warn("Failed to persist handle", err);
            }

            // Check for or create DB
            try {
                await rootHandle.getFileHandle(DB_FILENAME);
            } catch (e) {
                // Does not exist, create it
                const fileHandle = await rootHandle.getFileHandle(DB_FILENAME, { create: true });
                const writable = await fileHandle.createWritable();
                // Ensure valid initial JSON
                await writable.write(JSON.stringify(DEFAULT_DB, null, 2));
                await writable.close();
            }

        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                throw new Error('User cancelled folder selection');
            }
            if ((error as Error).name === 'SecurityError' || (error as Error).message?.includes('security')) {
                throw new Error('Browser blocked access to this folder (System/Root). Please select a user folder (e.g. Documents/Prompts).');
            }
            throw error;
        }
    },

    isReady(): boolean {
        return rootHandle !== null;
    },

    async getDatabase(): Promise<Database> {
        if (!rootHandle) throw new Error('Root handle not initialized');

        const fileHandle = await rootHandle.getFileHandle(DB_FILENAME);
        const file = await fileHandle.getFile();
        const text = await file.text();

        if (!text || text.trim() === '') {
            return DEFAULT_DB;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Database corrupted", e);
            try {
                const backupName = `${DB_FILENAME}.bak.${Date.now()}`;
                const backupHandle = await rootHandle.getFileHandle(backupName, { create: true });
                const writable = await backupHandle.createWritable();
                await writable.write(text);
                await writable.close();
            } catch { }

            return DEFAULT_DB;
        }
    },

    async saveDatabase(db: Database): Promise<void> {
        if (!rootHandle) throw new Error('Root handle not initialized');

        const fileHandle = await rootHandle.getFileHandle(DB_FILENAME, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(db, null, 2));
        await writable.close();
    },

    // For specific testing purposes only
    _reset() {
        rootHandle = null;
    }
};
