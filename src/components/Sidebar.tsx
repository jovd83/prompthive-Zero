
import { Collection } from '@/lib/storage';
import { Heart, Settings, ChevronDown, ChevronRight, Download, Upload as UploadIcon } from 'lucide-react';
import { CollectionTree } from './CollectionTree';
import { useState } from 'react';

interface SidebarProps {
    collections: Collection[];
    activeCollectionId: string | null;
    showFavoritesOnly: boolean;
    onSelectCollection: (id: string | null) => void;
    onToggleFavorites: (show: boolean) => void;
    onResetFilters: () => void;
    onAddCollection: (name: string, parentId: string | null) => void;
    onExport: () => void;
    onImport: () => void;
}

export function Sidebar({
    collections,
    activeCollectionId,
    showFavoritesOnly,
    onSelectCollection,
    onToggleFavorites,
    onResetFilters,
    onAddCollection,
    onExport,
    onImport
}: SidebarProps) {
    const [showSettings, setShowSettings] = useState(false);

    const handleCreateCollection = () => {
        const name = prompt('New Collection Name:');
        if (name) {
            onAddCollection(name, activeCollectionId || null);
        }
    };

    return (
        <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
            <div className="p-4 border-b border-border flex items-center space-x-2">
                <img src="/logo.png" alt="Prompthive Zero Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-lg">Prompthive</span>
                <span className="bg-muted text-xs px-1.5 py-0.5 rounded text-muted-foreground">Zero</span>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Collections</span>
                    <button
                        onClick={handleCreateCollection}
                        className="text-muted-foreground hover:text-foreground text-lg leading-none"
                        title="New Collection"
                    >
                        +
                    </button>
                </div>

                <nav className="space-y-1">
                    <button
                        onClick={onResetFilters}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium border border-transparent transition-colors ${!activeCollectionId && !showFavoritesOnly ? 'bg-secondary/50 text-foreground border-border' : 'text-muted-foreground hover:bg-muted/50'}`}
                    >
                        All Prompts
                    </button>

                    <button
                        onClick={() => { onResetFilters(); onToggleFavorites(true); }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium border border-transparent transition-colors flex items-center space-x-2 ${showFavoritesOnly ? 'bg-secondary/50 text-foreground border-border' : 'text-muted-foreground hover:bg-muted/50'}`}
                    >
                        <Heart className="w-4 h-4 fill-current text-red-500/70" /> <span>Favorites</span>
                    </button>

                    <div className="pt-2 pb-1">
                        <div className="h-px bg-border/50 mx-2"></div>
                    </div>

                    <CollectionTree
                        collections={collections}
                        parentId={null}
                        onSelect={onSelectCollection}
                        selectedId={activeCollectionId}
                    />
                </nav>
            </div>

            <div className="p-4 border-t border-border space-y-2">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                    <Settings className="w-4 h-4" />
                    <span>Data Management</span>
                    {showSettings ? <ChevronDown className="w-3 h-3 ml-auto" /> : <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>

                {showSettings && (
                    <div className="pt-2 pl-6 space-y-2 animate-in slide-in-from-top-2">
                        <button onClick={onExport} className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-primary w-full">
                            <Download className="w-3 h-3" />
                            <span>Backup to JSON</span>
                        </button>
                        <button onClick={onImport} className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-primary w-full">
                            <UploadIcon className="w-3 h-3" />
                            <span>Restore from JSON</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
