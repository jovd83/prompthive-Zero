
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProjectData } from './useProjectData';
import { storage } from '@/lib/storage';

// Mock storage
vi.mock('@/lib/storage', () => ({
    storage: {
        getDatabase: vi.fn(),
        saveDatabase: vi.fn(),
    },
}));

describe('useProjectData', () => {
    const mockDb = {
        version: 1,
        prompts: [{ id: 'p1', title: 'Test Prompt', body: 'Body', tags: [], isFavorite: false, collectionId: null }],
        collections: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load data on mount', async () => {
        vi.mocked(storage.getDatabase).mockResolvedValue(mockDb as any);

        const { result } = renderHook(() => useProjectData());

        // Initially loading
        expect(result.current.loading).toBe(true);

        // Wait for effect
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.db).toEqual(mockDb);
        expect(storage.getDatabase).toHaveBeenCalled();
    });

    it('should handle load error', async () => {
        vi.mocked(storage.getDatabase).mockRejectedValue(new Error('Fail'));

        const { result } = renderHook(() => useProjectData());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.error).toBe('Failed to load database');
        expect(result.current.loading).toBe(false);
    });

    it('should save prompt', async () => {
        vi.mocked(storage.getDatabase).mockResolvedValue(mockDb as any);
        const { result } = renderHook(() => useProjectData());

        await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });

        const newPrompt = { id: 'p2', title: 'New', body: 'Body', tags: [], isFavorite: false, collectionId: null, createdAt: 0, updatedAt: 0 };

        await act(async () => {
            await result.current.savePrompt(newPrompt);
        });

        expect(storage.saveDatabase).toHaveBeenCalledWith(expect.objectContaining({
            prompts: expect.arrayContaining([expect.objectContaining({ id: 'p2' })])
        }));
    });
});
