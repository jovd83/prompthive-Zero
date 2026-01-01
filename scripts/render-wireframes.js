
import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function renderWireframes() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const wireframesDir = path.resolve(__dirname, '../docs/wireframes');
    const files = fs.readdirSync(wireframesDir).filter(f => f.endsWith('-source.html'));

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];

    for (const file of files) {
        const filePath = path.join(wireframesDir, file);
        const fileUrl = `file://${filePath}`;

        console.log(`Rendering ${file}...`);
        await page.goto(fileUrl);

        // Naming convention: wireframe-[feature]-[screen]-YYYYMMDD-HHMMSS.png
        // Input: wireframe-setup-folder-selection-source.html
        // Output: wireframe-setup-folder-selection-20251230-192500.png

        const baseName = file.replace('-source.html', '');
        const outputName = `${baseName}-${timestamp}.png`;
        const outputPath = path.join(wireframesDir, outputName); // Save WITHOUT watermark for now, or add watermark via CSS injection?

        // Add watermark
        await page.evaluate((ts) => {
            const div = document.createElement('div');
            div.style.position = 'fixed';
            div.style.bottom = '10px';
            div.style.right = '10px';
            div.style.color = 'rgba(255, 255, 255, 0.5)';
            div.style.fontFamily = 'monospace';
            div.style.fontSize = '12px';
            div.style.zIndex = '9999';
            div.innerText = ts;
            document.body.appendChild(div);
        }, timestamp);

        await page.screenshot({ path: outputPath, fullPage: true });
        console.log(`Saved to ${outputName}`);
    }

    await browser.close();
}

renderWireframes().catch(console.error);
