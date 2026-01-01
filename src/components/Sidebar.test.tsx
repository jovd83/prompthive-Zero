
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from './Sidebar';

// Mock CollectionTree to simplify Sidebar testing
vi.mock('./CollectionTree', () => ({
    CollectionTree: ({ collections }: any) => <div>MockTree: {collections.length} items</div>
}));

describe('Sidebar', () => {
    const props = {
        collections: [],
        activeCollectionId: null,
        showFavoritesOnly: false,
        onSelectCollection: vi.fn(),
        onToggleFavorites: vi.fn(),
        onResetFilters: vi.fn(),
        onAddCollection: vi.fn(),
        onExport: vi.fn(),
        onImport: vi.fn()
    };

    it('should render main navigation items', () => {
        render(<Sidebar {...props} />);
        expect(screen.getByText('All Prompts')).toBeInTheDocument();
        expect(screen.getByText('Favorites')).toBeInTheDocument();
        expect(screen.getByText('Data Management')).toBeInTheDocument();
    });

    it('should handle "All Prompts" click', () => {
        render(<Sidebar {...props} />);
        fireEvent.click(screen.getByText('All Prompts'));
        expect(props.onResetFilters).toHaveBeenCalled();
    });

    it('should handle "Favorites" click', () => {
        render(<Sidebar {...props} />);
        fireEvent.click(screen.getByText('Favorites'));
        expect(props.onResetFilters).toHaveBeenCalled();
        expect(props.onToggleFavorites).toHaveBeenCalledWith(true);
    });

    it('should expand settings logic', () => {
        render(<Sidebar {...props} />);
        fireEvent.click(screen.getByText('Data Management'));
        expect(screen.getByText('Backup to JSON')).toBeInTheDocument();
        expect(screen.getByText('Restore from JSON')).toBeInTheDocument();
    });

    it('should handle create collection', () => {
        vi.spyOn(window, 'prompt').mockReturnValue('New Col');
        render(<Sidebar {...props} />);
        // Find the + button. It has title "New Collection"
        const addBtn = screen.getByTitle('New Collection');
        fireEvent.click(addBtn);
        expect(props.onAddCollection).toHaveBeenCalledWith('New Col', null);
    });
});
