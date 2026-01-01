
import { Collection } from '@/lib/storage';
import { ChevronRight } from 'lucide-react';

interface CollectionTreeProps {
    collections: Collection[];
    parentId: string | null;
    level?: number;
    onSelect: (id: string) => void;
    selectedId: string | null;
}

export const CollectionTree = ({ collections, parentId, level = 0, onSelect, selectedId }: CollectionTreeProps) => {
    // Basic flat-to-tree render for now (filtering flat list)
    const nodes = collections.filter(c => c.parentId === parentId || (parentId === null && !c.parentId));

    if (nodes.length === 0) return null;

    return (
        <div className="space-y-0.5">
            {nodes.map(node => (
                <div key={node.id}>
                    <button
                        onClick={() => onSelect(node.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center space-x-2
                        ${selectedId === node.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                        style={{ paddingLeft: `${(level + 1) * 0.75}rem` }}
                    >
                        <ChevronRight className={`w-3 h-3 transition-transform ${selectedId === node.id ? 'rotate-90' : ''}`} />
                        <span className="truncate">{node.name}</span>
                    </button>
                    {/* Recursive render */}
                    <CollectionTree
                        collections={collections}
                        parentId={node.id}
                        level={level + 1}
                        onSelect={onSelect}
                        selectedId={selectedId}
                    />
                </div>
            ))}
        </div>
    );
};
