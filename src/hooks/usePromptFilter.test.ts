
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePromptFilter } from './usePromptFilter';

describe('usePromptFilter', () => {
    const prompts = [
        { id: '1', title: 'Alpha', body: 'Test body', tags: ['red'], isFavorite: true, collectionId: 'c1', createdAt: 0, updatedAt: 0 },
        { id: '2', title: 'Beta', body: 'Another one', tags: ['blue'], isFavorite: false, collectionId: null, createdAt: 0, updatedAt: 0 },
        { id: '3', title: 'Gamma', body: 'Hidden', tags: ['red', 'green'], isFavorite: false, collectionId: 'c1', createdAt: 0, updatedAt: 0 },
    ];
    const collections = [
        { id: 'c1', name: 'Col 1', parentId: null }
    ];

    it('should return all prompts by default', () => {
        const { result } = renderHook(() => usePromptFilter(prompts, collections));
        expect(result.current.filteredPrompts).toHaveLength(3);
        expect(result.current.activeCollectionName).toBe('All Prompts');
    });

    it('should filter by search query', async () => {
        const { result } = renderHook(() => usePromptFilter(prompts, collections));

        act(() => {
            result.current.setSearchQuery('Alpha');
        });

        expect(result.current.filteredPrompts).toHaveLength(1);
        expect(result.current.filteredPrompts[0].id).toBe('1');
    });

    it('should filter by tag', async () => {
        const { result } = renderHook(() => usePromptFilter(prompts, collections));

        act(() => {
            result.current.setActiveTag('red');
        });

        expect(result.current.filteredPrompts).toHaveLength(2); // Alpha and Gamma
    });

    it('should filter by collection', async () => {
        const { result } = renderHook(() => usePromptFilter(prompts, collections));

        act(() => {
            result.current.setActiveCollectionId('c1');
        });

        expect(result.current.filteredPrompts).toHaveLength(2); // Alpha and Gamma
        expect(result.current.activeCollectionName).toBe('Col 1');
    });

    it('should filter by favorites', async () => {
        const { result } = renderHook(() => usePromptFilter(prompts, collections));

        act(() => {
            result.current.setShowFavoritesOnly(true);
        });

        expect(result.current.filteredPrompts).toHaveLength(1); // Alpha
        expect(result.current.activeCollectionName).toBe('Favorites');
    });
});
