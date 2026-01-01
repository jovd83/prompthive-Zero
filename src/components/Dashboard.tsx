
import { useState } from 'react';
import { Prompt } from '@/lib/storage';
import { PromptCard } from '@/components/PromptCard';
import { CreatePromptModal } from '@/components/CreatePromptModal';
import { PromptDetailModal } from '@/components/PromptDetailModal';
import { Search, X, LucideProps } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { useProjectData } from '@/hooks/useProjectData';
import { usePromptFilter } from '@/hooks/usePromptFilter';

export function Dashboard() {
    const {
        db,
        loading,
        savePrompt,
        deletePrompt,
        toggleFavorite,
        addCollection,
        importDatabase
    } = useProjectData();

    const {
        searchQuery, setSearchQuery,
        activeTag, setActiveTag,
        activeCollectionId, setActiveCollectionId,
        showFavoritesOnly, setShowFavoritesOnly,
        filteredPrompts,
        activeCollectionName,
        resetFilters
    } = usePromptFilter(db?.prompts || [], db?.collections || []);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

    const handleExport = () => {
        if (!db) return;
        const dataStr = JSON.stringify(db, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `prompthive-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.href = url;
        link.click();
    };

    const handleImport = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                const importedDb = JSON.parse(text);
                // Basic validation check
                if (!importedDb.prompts || !importedDb.collections) throw new Error("Invalid format");

                if (confirm('This will overwrite your current library. Are you sure?')) {
                    await importDatabase(importedDb);
                    alert('Import successful!');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to import database. Invalid file.');
            }
        };
        input.click();
    };

    const onToggleFavorite = async (e: React.MouseEvent, prompt: Prompt) => {
        e.stopPropagation();
        const updated = await toggleFavorite(prompt);
        // If viewing details, sync state
        if (selectedPrompt?.id === prompt.id && updated) {
            setSelectedPrompt(updated);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-background text-foreground">Loading library...</div>;
    }

    if (!db) {
        return <div className="flex items-center justify-center h-screen bg-background text-foreground">Error loading database.</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans antialiased overflow-hidden">
            <Sidebar
                collections={db.collections}
                activeCollectionId={activeCollectionId}
                showFavoritesOnly={showFavoritesOnly}
                onSelectCollection={(id) => { setActiveCollectionId(id); setShowFavoritesOnly(false); }}
                onToggleFavorites={(show) => { setShowFavoritesOnly(show); setActiveCollectionId(null); }}
                onResetFilters={resetFilters}
                onAddCollection={addCollection}
                onExport={handleExport}
                onImport={handleImport}
            />

            {/* Main */}
            <main className="flex-1 flex flex-col h-full bg-background relative">
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm z-10 gap-4">
                    <div className="hidden lg:block">
                        <h2 className="text-xl font-semibold whitespace-nowrap">{activeCollectionName}</h2>
                        {activeTag && (
                            <div className="flex items-center space-x-1 mt-0.5">
                                <span className="text-xs text-muted-foreground">Filtered by:</span>
                                <span
                                    onClick={() => setActiveTag(null)}
                                    className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded cursor-pointer hover:bg-destructive/10 hover:text-destructive flex items-center"
                                >
                                    #{activeTag} <SmallX className="w-3 h-3 ml-1" />
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search prompts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all focus:bg-background"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => { setSelectedPrompt(null); setShowCreateModal(true); }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-1.5 px-4 rounded-full flex items-center shadow-lg transition-transform active:scale-95 whitespace-nowrap"
                        >
                            <span className="mr-1.5 text-lg leading-none">+</span> New Prompt
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    {filteredPrompts.length === 0 ? (
                        <div className="text-center text-muted-foreground mt-20 flex flex-col items-center">
                            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">✨</span>
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                                {searchQuery ? 'No matches found' : (activeCollectionId ? 'Collection is empty' : 'Your library is empty')}
                            </h3>
                            <p className="text-sm max-w-xs">
                                {searchQuery ? 'Try a different search query.' : 'Create your first prompt to get started.'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="mt-6 text-primary hover:underline text-sm"
                                >
                                    Create a prompt
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                            {filteredPrompts.map(p => (
                                <PromptCard
                                    key={p.id}
                                    prompt={p}
                                    onClick={() => { setSelectedPrompt(p); setShowDetailModal(true); }}
                                    onTagClick={setActiveTag}
                                    onToggleFavorite={(e) => onToggleFavorite(e, p)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {showCreateModal && (
                <CreatePromptModal
                    onClose={() => { setShowCreateModal(false); setSelectedPrompt(null); }}
                    onSave={async (p) => { await savePrompt(p); setShowCreateModal(false); }}
                    initialPrompt={selectedPrompt || undefined}
                    collections={db?.collections || []}
                />
            )}

            {showDetailModal && selectedPrompt && (
                <PromptDetailModal
                    prompt={selectedPrompt}
                    onClose={() => { setShowDetailModal(false); setSelectedPrompt(null); }}
                    onEdit={() => { setShowDetailModal(false); setShowCreateModal(true); }}
                    onDelete={async () => { await deletePrompt(selectedPrompt.id); setShowDetailModal(false); }}
                />
            )}
        </div>
    );
}

// Helper icon
function SmallX(props: LucideProps) {
    return (
        <X {...props} />
    );
}
