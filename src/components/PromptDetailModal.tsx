import { useState, useMemo } from 'react';
import { Prompt } from '@/lib/storage';
import { X, Copy, Check, Edit, Trash2 } from 'lucide-react';
import { extractVariables, fillVariables } from '@/lib/variables';

interface PromptDetailModalProps {
    prompt: Prompt;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function PromptDetailModal({ prompt, onClose, onEdit, onDelete }: PromptDetailModalProps) {
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState(false);

    // Memoize detected variables
    const variables = useMemo(() => extractVariables(prompt.body), [prompt.body]);

    const processedBody = useMemo(() =>
        fillVariables(prompt.body, variableValues),
        [prompt.body, variableValues]
    );

    const hasExtraFields = prompt.shortPrompt || prompt.exampleOutput || prompt.expectedResult;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(processedBody);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
            <div className="bg-card w-full max-w-4xl h-[85vh] flex flex-col rounded-xl border border-border shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                    <h2 className="text-xl font-bold truncate pr-4">{prompt.title}</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onEdit}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-full transition"
                            title="Edit Prompt"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => { if (confirm('Delete this prompt?')) onDelete(); }}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition"
                            title="Delete Prompt"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="w-px h-6 bg-border mx-2" />
                        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left: Prompt Preview */}
                    <div className={`flex-1 flex flex-col ${variables.length > 0 ? 'border-r border-border' : ''}`}>
                        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap bg-background/50">
                            {variables.length === 0 ? prompt.body : processedBody}
                        </div>

                        {/* Advanced Fields Display */}
                        {hasExtraFields && (
                            <div className="p-4 border-t border-border bg-muted/10 space-y-3">
                                {prompt.shortPrompt && (
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Short Prompt</h4>
                                        <div className="text-sm border border-border rounded bg-background p-2 select-all">{prompt.shortPrompt}</div>
                                    </div>
                                )}
                                {prompt.exampleOutput && (
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Example Output</h4>
                                        <div className="text-xs font-mono border border-border rounded bg-muted/20 p-2 whitespace-pre-wrap text-muted-foreground">{prompt.exampleOutput}</div>
                                    </div>
                                )}
                                {prompt.expectedResult && (
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Instructions</h4>
                                        <div className="text-sm text-muted-foreground italic">{prompt.expectedResult}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-border flex justify-between items-center bg-card">
                            <div className="text-xs text-muted-foreground">
                                {prompt.body.length} chars
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition active:scale-95"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Variables (if any) */}
                    {variables.length > 0 && (
                        <div className="w-80 bg-muted/5 flex flex-col border-l border-border">
                            <div className="p-4 border-b border-border font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                Variables
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {variables.map(v => (
                                    <div key={v}>
                                        <label className="block text-sm font-medium mb-1.5 text-foreground">{v}</label>
                                        <input
                                            type="text"
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                            placeholder={`Value for ${v}...`}
                                            value={variableValues[v] || ''}
                                            onChange={(e) => setVariableValues(prev => ({ ...prev, [v]: e.target.value }))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
