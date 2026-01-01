
import { describe, it, expect } from 'vitest';
import { extractVariables, fillVariables } from './variables';

describe('Variable Logic', () => {
    it('should extract unique variables', () => {
        const text = 'Hello {{name}}, welcome to {{city}}. Goodbye {{name}}';
        const variables = extractVariables(text);
        expect(variables).toEqual(['name', 'city']);
    });

    it('should return empty array if no variables', () => {
        expect(extractVariables('Just regular text')).toEqual([]);
    });

    it('should replace variables with values', () => {
        const text = 'Hello {{name}}';
        const result = fillVariables(text, { name: 'World' });
        expect(result).toBe('Hello World');
    });

    it('should keep variable if value not provided', () => {
        const text = 'Hello {{name}}';
        const result = fillVariables(text, {});
        expect(result).toBe('Hello {{name}}');
    });
});
