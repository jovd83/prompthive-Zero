
/**
 * Detects variables in format {{variable_name}}
 */
export function extractVariables(text: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    // Return unique variable names
    return Array.from(new Set(matches.map(m => m[1].trim())));
}

/**
 * Replaces variables with provided values
 */
export function fillVariables(text: string, values: Record<string, string>): string {
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
        const key = variable.trim();
        return values[key] || match; // Keep original if no value provided (or use empty string?)
    });
}
