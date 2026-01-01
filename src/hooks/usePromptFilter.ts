
import { useMemo, useState } from 'react';
import { Prompt, Collection } from '@/lib/storage';

export function usePromptFilter(prompts: Prompt[], collections: Collection[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const filteredPrompts = useMemo(() => {
        if (!prompts) return [];
        return prompts.filter(p => {
            // Favorites Filter
            if (showFavoritesOnly && !p.isFavorite) return false;

            // Collection Filter
            if (activeCollectionId && p.collectionId !== activeCollectionId) return false;

            // Tag Filter
            if (activeTag && !p.tags.includes(activeTag)) return false;

            // Search Query
            if (!searchQuery) return true;
            const lowerQ = searchQuery.toLowerCase();
            return (
                p.title.toLowerCase().includes(lowerQ) ||
                p.body.toLowerCase().includes(lowerQ) ||
                p.tags.some(t => t.toLowerCase().includes(lowerQ))
            );
        });
    }, [prompts, searchQuery, activeTag, activeCollectionId, showFavoritesOnly]);

    const activeCollectionName = useMemo(() => {
        if (showFavoritesOnly) return 'Favorites';
        return collections.find(c => c.id === activeCollectionId)?.name || 'All Prompts';
    }, [collections, activeCollectionId, showFavoritesOnly]);

    const resetFilters = () => {
        setActiveCollectionId(null);
        setActiveTag(null);
        setSearchQuery('');
        setShowFavoritesOnly(false);
    };

    return {
        searchQuery, setSearchQuery,
        activeTag, setActiveTag,
        activeCollectionId, setActiveCollectionId,
        showFavoritesOnly, setShowFavoritesOnly,
        filteredPrompts,
        activeCollectionName,
        resetFilters
    };
}
