
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { storage, Database } from '@/lib/storage';
import * as idb from 'idb-keyval';

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
    get: vi.fn(),
    set: vi.fn(),
}));

// Mock window.showDirectoryPicker
const showDirectoryPickerMock = vi.fn();
Object.defineProperty(window, 'showDirectoryPicker', {
    writable: true,
    value: showDirectoryPickerMock,
});

describe('storage.ts coverage', () => {
    let mockRootHandle: any;
    let mockFileHandle: any;
    let mockWritable: any;
    let mockFile: any;

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset storage state
        (storage as any)._reset();

        // Suppress console.error for expected errors
        vi.spyOn(console, 'error').mockImplementation(() => { });

        // Setup common File System Access API mocks
        mockWritable = {
            write: vi.fn(),
            close: vi.fn(),
        };

        mockFile = {
            text: vi.fn().mockResolvedValue(JSON.stringify({
                version: 1,
                prompts: [],
                collections: []
            })),
        };

        mockFileHandle = {
            getFile: vi.fn().mockResolvedValue(mockFile),
            createWritable: vi.fn().mockResolvedValue(mockWritable),
        };

        mockRootHandle = {
            name: 'Mock Project',
            queryPermission: vi.fn().mockResolvedValue('granted'),
            requestPermission: vi.fn().mockResolvedValue('granted'),
            getFileHandle: vi.fn().mockResolvedValue(mockFileHandle),
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getStoredHandleName', () => {
        it('should return null if no handle stored', async () => {
            (idb.get as Mock).mockResolvedValue(undefined);
            const name = await storage.getStoredHandleName();
            expect(name).toBeNull();
        });

        it('should return handle name if stored', async () => {
            (idb.get as Mock).mockResolvedValue({ name: 'My Project' });
            const name = await storage.getStoredHandleName();
            expect(name).toBe('My Project');
        });

        it('should return default name if stored handle has no name', async () => {
            (idb.get as Mock).mockResolvedValue({});
            const name = await storage.getStoredHandleName();
            expect(name).toBe('Stored Project');
        });

        it('should return null on error', async () => {
            (idb.get as Mock).mockRejectedValue(new Error('DB Error'));
            const name = await storage.getStoredHandleName();
            expect(name).toBeNull();
        });
    });

    describe('restoreHandle', () => {
        it('should return false if no handle in IDB', async () => {
            (idb.get as Mock).mockResolvedValue(undefined);
            const result = await storage.restoreHandle();
            expect(result).toBe(false);
            expect(storage.isReady()).toBe(false);
        });

        it('should return true if handle exists and permission is granted', async () => {
            mockRootHandle.queryPermission.mockResolvedValue('granted');
            (idb.get as Mock).mockResolvedValue(mockRootHandle);

            const result = await storage.restoreHandle();
            expect(result).toBe(true);
            expect(storage.isReady()).toBe(true);
        });

        it('should return false on error', async () => {
            (idb.get as Mock).mockRejectedValue(new Error('Fail'));
            const result = await storage.restoreHandle();
            expect(result).toBe(false);
        });
    });

    describe('openProjectFolder', () => {
        it('should successfully open folder and initialize DB', async () => {
            showDirectoryPickerMock.mockResolvedValue(mockRootHandle);
            mockRootHandle.getFileHandle.mockResolvedValue(mockFileHandle);

            await storage.openProjectFolder();

            expect(showDirectoryPickerMock).toHaveBeenCalled();
            expect(idb.set).toHaveBeenCalled();
            expect(storage.isReady()).toBe(true);
        });

        it('should create default DB if database.json does not exist', async () => {
            showDirectoryPickerMock.mockResolvedValue(mockRootHandle);
            // First call fails (check existence), second call succeeds (create)
            mockRootHandle.getFileHandle
                .mockRejectedValueOnce(new Error('Not found'))
                .mockResolvedValueOnce(mockFileHandle);

            await storage.openProjectFolder();

            expect(mockRootHandle.getFileHandle).toHaveBeenCalledWith('database.json', { create: true });
            expect(mockWritable.write).toHaveBeenCalled();
        });

        it('should throw friendly error on SecurityError', async () => {
            const secError = new Error('Security Error');
            secError.name = 'SecurityError';
            showDirectoryPickerMock.mockRejectedValue(secError);

            await expect(storage.openProjectFolder()).rejects.toThrow(/Browser blocked access/);
        });
    });

    describe('getDatabase', () => {
        it('should throw if not initialized', async () => {
            // Ensure NOT initialized
            (storage as any)._reset();
            await expect(storage.getDatabase()).rejects.toThrow('Root handle not initialized');
        });

        it('should return DB if initialized', async () => {
            // Manually set handle via restore logic or open logic
            showDirectoryPickerMock.mockResolvedValue(mockRootHandle);
            await storage.openProjectFolder();

            const db = await storage.getDatabase();
            expect(db.version).toBe(1);
        });
    });

    describe('saveDatabase', () => {
        it('should write database to file', async () => {
            // Setup initialized state
            showDirectoryPickerMock.mockResolvedValue(mockRootHandle);
            await storage.openProjectFolder();

            const newDb: Database = { version: 1, prompts: [], collections: [] };
            await storage.saveDatabase(newDb);

            expect(mockWritable.write).toHaveBeenCalledWith(JSON.stringify(newDb, null, 2));
        });
    });
});
