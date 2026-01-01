import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { FolderOpen, ArrowRight } from 'lucide-react';

interface SetupScreenProps {
    onComplete: () => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [storedName, setStoredName] = useState<string | null>(null);

    useEffect(() => {
        // Check for stored handle
        storage.getStoredHandleName().then(setStoredName);
    }, []);

    const handleSelectFolder = async () => {
        setLoading(true);
        setError(null);
        try {
            await storage.openProjectFolder();
            onComplete();
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        setLoading(true);
        setError(null);
        try {
            const success = await storage.restoreHandle();
            if (success) {
                onComplete();
            } else {
                setError("Could not restore access. Please select folder again.");
                setStoredName(null); // Clear staled logic visually
            }
        } catch (err) {
            console.error(err);
            setError("Failed to restore session.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Prompthive Zero
                    </h1>
                    <p className="text-muted-foreground">
                        Your local, secure prompt library. {storedName ? 'Welcome back!' : 'Get started.'}
                    </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 shadow-2xl space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FolderOpen className="w-8 h-8 text-primary" />
                    </div>

                    <div className="space-y-4">
                        {storedName && (
                            <button
                                onClick={handleContinue}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all active:scale-95 mb-2"
                            >
                                {loading ? 'Verifying access...' : `Continue with "${storedName}"`}
                                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                            </button>
                        )}

                        <button
                            onClick={handleSelectFolder}
                            disabled={loading}
                            className={`w-full font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all active:scale-95 ${storedName ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                        >
                            {loading && !storedName ? 'Requesting Access...' : (storedName ? 'Select Different Folder' : 'Select Project Folder')}
                        </button>
                    </div>

                    {error && (
                        <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-4">
                        Data is stored locally on your device. <br />
                        We request folder access to save your prompts and images.
                    </p>
                </div>

            </div>
        </div>
    );
}
