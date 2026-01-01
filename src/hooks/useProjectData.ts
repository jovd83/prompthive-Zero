
import { useState, useEffect } from 'react';
import { storage, Database, Prompt, Collection } from '@/lib/storage';

export function useProjectData() {
    const [db, setDb] = useState<Database | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await storage.getDatabase();
            setDb(data);
            setError(null);
        } catch (err) {
            console.error('Failed to load database', err);
            setError('Failed to load database');
        } finally {
            setLoading(false);
        }
    };

    const saveToDisk = async (updatedDb: Database) => {
        try {
            await storage.saveDatabase(updatedDb);
        } catch (err) {
            console.error('Failed to save to disk', err);
            // Non-blocking error for UI, but worth logging
        }
    };

    const savePrompt = async (newPrompt: Prompt) => {
        if (!db) return;

        const isEdit = db.prompts.some(p => p.id === newPrompt.id);
        let updatedPrompts: Prompt[];

        if (isEdit) {
            updatedPrompts = db.prompts.map(p => p.id === newPrompt.id ? newPrompt : p);
        } else {
            updatedPrompts = [newPrompt, ...db.prompts];
        }

        const updatedDb = { ...db, prompts: updatedPrompts };
        setDb(updatedDb);
        await saveToDisk(updatedDb);
    };

    const deletePrompt = async (promptId: string) => {
        if (!db) return;
        const updatedPrompts = db.prompts.filter(p => p.id !== promptId);
        const updatedDb = { ...db, prompts: updatedPrompts };
        setDb(updatedDb);
        await saveToDisk(updatedDb);
    };

    const toggleFavorite = async (prompt: Prompt) => {
        if (!db) return;
        const updatedPrompt = { ...prompt, isFavorite: !prompt.isFavorite };
        const updatedPrompts = db.prompts.map(p => p.id === prompt.id ? updatedPrompt : p);
        const updatedDb = { ...db, prompts: updatedPrompts };
        setDb(updatedDb);
        await saveToDisk(updatedDb);
        return updatedPrompt;
    };

    const addCollection = async (name: string, parentId: string | null) => {
        if (!db) return;
        const newCol: Collection = {
            id: crypto.randomUUID(),
            name,
            parentId
        };
        const updatedDb = { ...db, collections: [...db.collections, newCol] };
        setDb(updatedDb);
        await saveToDisk(updatedDb);
    };

    const importDatabase = async (newDb: Database) => {
        setDb(newDb);
        await saveToDisk(newDb);
    };

    return {
        db,
        loading,
        error,
        savePrompt,
        deletePrompt,
        toggleFavorite,
        addCollection,
        importDatabase,
        reload: loadData
    };
}
