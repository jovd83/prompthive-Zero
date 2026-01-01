
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PromptCard } from './PromptCard';
import { Prompt } from '@/lib/storage';

const mockPrompt: Prompt = {
    id: '123',
    title: 'Test Prompt',
    description: 'This is a test description',
    body: 'Content',
    tags: ['react', 'testing'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    isFavorite: false
};

describe('PromptCard', () => {
    it('renders title and description', () => {
        render(<PromptCard prompt={mockPrompt} onClick={() => { }} />);
        expect(screen.getByText('Test Prompt')).toBeInTheDocument();
        expect(screen.getByText('This is a test description')).toBeInTheDocument();
    });

    it('renders tags', () => {
        render(<PromptCard prompt={mockPrompt} onClick={() => { }} />);
        expect(screen.getByText('#react')).toBeInTheDocument();
        expect(screen.getByText('#testing')).toBeInTheDocument();
    });

    it('handles click event', () => {
        const handleClick = vi.fn();
        render(<PromptCard prompt={mockPrompt} onClick={handleClick} />);

        fireEvent.click(screen.getByText('Test Prompt').closest('div')!);
        expect(handleClick).toHaveBeenCalled(); // Note: might need to be specific about clicking the card container
    });

    it('handles favorite toggle', () => {
        const handleFavorite = vi.fn();
        render(<PromptCard prompt={mockPrompt} onClick={() => { }} onToggleFavorite={handleFavorite} />);

        const button = screen.getByTitle('Add to Favorites');
        fireEvent.click(button);
        expect(handleFavorite).toHaveBeenCalled();
    });

    it('shows filled heart when favorite', () => {
        const favPrompt = { ...mockPrompt, isFavorite: true };
        render(<PromptCard prompt={favPrompt} onClick={() => { }} onToggleFavorite={() => { }} />);

        expect(screen.getByTitle('Remove from Favorites')).toBeInTheDocument();
    });
});
