
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CollectionTree } from './CollectionTree';

describe('CollectionTree', () => {
    const collections = [
        { id: 'c1', name: 'Root 1', parentId: null },
        { id: 'c2', name: 'Child 1', parentId: 'c1' },
        { id: 'c3', name: 'Root 2', parentId: null }
    ];

    it('should render root collections', () => {
        render(<CollectionTree collections={collections} parentId={null} onSelect={vi.fn()} selectedId={null} />);
        expect(screen.getByText('Root 1')).toBeInTheDocument();
        expect(screen.getByText('Root 2')).toBeInTheDocument();
        // Child should render because the component renders recursively based on parentId
        // Wait, the component recursively calls itself. 
        // Initial call is parentId={null}. It finds c1 and c3.
        // For c1, it calls CollectionTree parentId=c1. It finds c2.
        expect(screen.getByText('Child 1')).toBeInTheDocument();
    });

    it('should handle selection', () => {
        const onSelect = vi.fn();
        render(<CollectionTree collections={collections} parentId={null} onSelect={onSelect} selectedId={null} />);

        fireEvent.click(screen.getByText('Root 1'));
        expect(onSelect).toHaveBeenCalledWith('c1');
    });

    it('should highlight selected collection', () => {
        render(<CollectionTree collections={collections} parentId={null} onSelect={vi.fn()} selectedId="c1" />);
        // We can check for a class or aria-selected if we added it, but checking class is fragile.
        // In the code: ${selectedId === node.id ? 'bg-primary/10 ...' : ...}
        // Let's check if the button containing Root 1 has the class text-primary
        const btn = screen.getByText('Root 1').closest('button');
        expect(btn).toHaveClass('text-primary');
    });
});
