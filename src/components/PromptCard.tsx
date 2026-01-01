
import { Prompt } from '@/lib/storage';
import { Heart } from 'lucide-react';

interface PromptCardProps {
    prompt: Prompt;
    onClick: () => void;
    onTagClick?: (tag: string) => void;
    onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function PromptCard({ prompt, onClick, onTagClick, onToggleFavorite }: PromptCardProps) {
    const firstChar = prompt.title.charAt(0).toUpperCase();

    // Deterministic gradient based on title length (simple hash)
    const gradients = [
        'from-purple-500 to-indigo-600',
        'from-emerald-500 to-teal-600',
        'from-orange-500 to-red-600',
        'from-blue-500 to-cyan-500',
        'from-pink-500 to-rose-500'
    ];
    const gradientIndex = prompt.title.length % gradients.length;
    const gradient = gradients[gradientIndex];

    return (
        <div
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-[280px]"
            onClick={onClick}
        >
            {/* Header / Banner */}
            <div className={`h-24 bg-gradient-to-br ${gradient} p-4 relative`}>
                <div className="absolute top-4 right-4 flex space-x-2 items-center">
                    {onToggleFavorite && (
                        <button
                            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors z-10 ${prompt.isFavorite ? 'bg-white/90 text-red-500 shadow-sm' : 'bg-black/20 text-white hover:bg-black/40'}`}
                            onClick={onToggleFavorite}
                            title={prompt.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        >
                            <Heart className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
                    {firstChar}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col overflow-hidden">
                <h3 className="font-semibold text-foreground text-lg mb-1 truncate" title={prompt.title}>
                    {prompt.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {prompt.description || 'No description provided.'}
                </p>
            </div>

            {/* Footer / Tags */}
            <div className="px-4 pb-4 flex flex-wrap gap-1.5 mt-auto">
                {prompt.tags.map(tag => (
                    <span
                        key={tag}
                        onClick={(e) => {
                            if (onTagClick) {
                                e.stopPropagation();
                                onTagClick(tag);
                            }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-transparent ${onTagClick ? 'hover:border-primary/50 cursor-pointer hover:text-primary transition-colors' : ''}`}
                    >
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
