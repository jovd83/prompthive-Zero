
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from './Dashboard';
import * as useProjectDataHook from '@/hooks/useProjectData';
import * as usePromptFilterHook from '@/hooks/usePromptFilter';

// Mock child components to keep test focused
vi.mock('@/components/Sidebar', () => ({
    Sidebar: () => <div data-testid="sidebar">Sidebar</div>
}));
vi.mock('@/components/PromptCard', () => ({
    PromptCard: ({ prompt }: any) => <div>Card: {prompt.title}</div>
}));
vi.mock('@/components/CreatePromptModal', () => ({
    CreatePromptModal: ({ onClose }: any) => <div role="dialog">Create Modal <button onClick={onClose}>Close</button></div>
}));
vi.mock('@/components/PromptDetailModal', () => ({
    PromptDetailModal: ({ onClose }: any) => <div role="dialog">Detail Modal <button onClick={onClose}>Close</button></div>
}));

describe('Dashboard', () => {
    const mockDb = { collections: [], prompts: [] };
    const mockProjectData = {
        db: mockDb,
        loading: false,
        savePrompt: vi.fn(),
        deletePrompt: vi.fn(),
        toggleFavorite: vi.fn(),
        addCollection: vi.fn(),
        importDatabase: vi.fn(),
        reload: vi.fn()
    };
    const mockFilterData = {
        searchQuery: '',
        setSearchQuery: vi.fn(),
        activeTag: null,
        setActiveTag: vi.fn(),
        activeCollectionId: null,
        setActiveCollectionId: vi.fn(),
        showFavoritesOnly: false,
        setShowFavoritesOnly: vi.fn(),
        filteredPrompts: [],
        activeCollectionName: 'All Prompts',
        resetFilters: vi.fn()
    };

    beforeEach(() => {
        vi.spyOn(useProjectDataHook, 'useProjectData').mockReturnValue(mockProjectData);
        vi.spyOn(usePromptFilterHook, 'usePromptFilter').mockReturnValue(mockFilterData);
    });

    it('should render loading state', () => {
        vi.spyOn(useProjectDataHook, 'useProjectData').mockReturnValue({ ...mockProjectData, loading: true });
        render(<Dashboard />);
        expect(screen.getByText('Loading library...')).toBeInTheDocument();
    });

    it('should render dashboard when loaded', () => {
        render(<Dashboard />);
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByText('All Prompts')).toBeInTheDocument();
        expect(screen.getByText('New Prompt')).toBeInTheDocument();
    });

    it('should open create modal', () => {
        render(<Dashboard />);
        fireEvent.click(screen.getByText('New Prompt'));
        expect(screen.getByText('Create Modal')).toBeInTheDocument();
    });

    it('should render empty state', () => {
        // filteredPrompts is empty by default in mock
        render(<Dashboard />);
        expect(screen.getByText('Your library is empty')).toBeInTheDocument();
    });

    it('should render prompts', () => {
        const prompts = [{ id: '1', title: 'Test Prompt', body: 'Body', tags: [], isFavorite: false }];
        vi.spyOn(usePromptFilterHook, 'usePromptFilter').mockReturnValue({ ...mockFilterData, filteredPrompts: prompts as any });

        render(<Dashboard />);
        expect(screen.getByText('Card: Test Prompt')).toBeInTheDocument();
    });
});
