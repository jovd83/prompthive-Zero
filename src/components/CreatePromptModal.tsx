import { useState } from 'react';
import { Prompt, Collection } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { X, Save, ChevronDown, ChevronRight } from 'lucide-react';

interface CreatePromptModalProps {
    onClose: () => void;
    onSave: (prompt: Prompt) => void;
    initialPrompt?: Prompt; // If editing
    collections: Collection[];
}

export function CreatePromptModal({ onClose, onSave, initialPrompt, collections }: CreatePromptModalProps) {
    const [title, setTitle] = useState(initialPrompt?.title || '');
    const [description, setDescription] = useState(initialPrompt?.description || '');
    const [body, setBody] = useState(initialPrompt?.body || '');
    const [tags, setTags] = useState(initialPrompt?.tags.join(', ') || '');
    const [collectionId, setCollectionId] = useState(initialPrompt?.collectionId || '');

    // New Fields
    const [shortPrompt, setShortPrompt] = useState(initialPrompt?.shortPrompt || '');
    const [exampleOutput, setExampleOutput] = useState(initialPrompt?.exampleOutput || '');
    const [expectedResult, setExpectedResult] = useState(initialPrompt?.expectedResult || '');

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newPrompt: Prompt = {
                id: initialPrompt?.id || uuidv4(),
                title,
                description,
                body,
                shortPrompt,
                exampleOutput,
                expectedResult,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                collectionId: collectionId || undefined,
                createdAt: initialPrompt?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            onSave(newPrompt);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to save');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card w-full max-w-2xl h-[90vh] flex flex-col rounded-xl border border-border shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">{initialPrompt ? 'Edit Prompt' : 'New Prompt'}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form id="prompt-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                placeholder="e.g. React Component Generator"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Collection</label>
                            <select
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                value={collectionId}
                                onChange={e => setCollectionId(e.target.value)}
                            >
                                <option value="">(None)</option>
                                {collections.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input
                            type="text"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-muted-foreground"
                            placeholder="Short summary..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 flex flex-col min-h-[200px]">
                        <label className="block text-sm font-medium mb-1">Prompt</label>
                        <textarea
                            required
                            className="flex-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-primary outline-none resize-none"
                            placeholder="Write your prompt here..."
                            value={body}
                            onChange={e => setBody(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            placeholder="react, coding, frontend"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                        />
                    </div>

                    {/* Advanced Section */}
                    <div className="border border-border rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium"
                        >
                            <span>Advanced Settings</span>
                            {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        {showAdvanced && (
                            <div className="p-4 space-y-4 bg-muted/5 border-t border-border">
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-muted-foreground">Short Prompt (Condensed)</label>
                                    <textarea
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none h-16"
                                        placeholder="Brief version for quick copy..."
                                        value={shortPrompt}
                                        onChange={e => setShortPrompt(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-muted-foreground">Example Output</label>
                                    <textarea
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none h-20 font-mono text-xs"
                                        placeholder="What the model should return..."
                                        value={exampleOutput}
                                        onChange={e => setExampleOutput(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-muted-foreground">Expected Result / Instructions</label>
                                    <textarea
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none h-16"
                                        placeholder="Hidden notes on how to use this..."
                                        value={expectedResult}
                                        onChange={e => setExpectedResult(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                </form>

                {/* Footer */}
                <div className="p-4 border-t border-border flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="prompt-form"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Prompt
                    </button>
                </div>
            </div>
        </div>
    );
}
