
import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function renderDiagrams() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const diagramsDir = path.resolve(__dirname, '../docs/diagrams');
    const files = fs.readdirSync(diagramsDir).filter(f => f.endsWith('.mmd'));

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];

    for (const file of files) {
        const filePath = path.join(diagramsDir, file);
        const mmdContent = fs.readFileSync(filePath, 'utf-8');

        // Create temporary HTML file
        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body>
        <div class="mermaid">
        ${mmdContent}
        </div>
        <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ startOnLoad: true });
        </script>
    </body>
    </html>
    `;

        // We can use a data URL or write a temp file
        // Let's write a temp file to be safe
        const tempHtmlPath = path.join(diagramsDir, `temp-${file}.html`);
        fs.writeFileSync(tempHtmlPath, htmlContent);
        const fileUrl = `file://${tempHtmlPath}`;

        console.log(`Rendering ${file}...`);
        await page.goto(fileUrl);

        // Wait for mermaid to render
        await page.waitForSelector('.mermaid svg');

        // Screenshot just the SVG
        const element = await page.$('.mermaid');


        const baseName = file.replace('-source.mmd', '').replace('.mmd', '');
        // Naming: diagram-[type]-[description]-YYYYMMDD-HHMMSS.png
        // Input: diagram-architecture-system-overview-source.mmd
        // Output: diagram-architecture-system-overview-20251230-193000.png
        const outputName = `${baseName}-${timestamp}.png`;
        const outputPath = path.join(diagramsDir, outputName);

        // Add watermark
        await page.evaluate((ts) => {
            const div = document.createElement('div');
            div.style.position = 'fixed';
            div.style.bottom = '10px';
            div.style.right = '10px';
            div.style.color = 'rgba(0, 0, 0, 0.5)';
            div.style.fontFamily = 'monospace';
            div.style.fontSize = '12px';
            div.style.zIndex = '9999';
            div.innerText = ts;
            document.body.appendChild(div);
        }, timestamp);

        await page.screenshot({ path: outputPath, fullPage: true }); // Prefer full page or element screenshot? Element is better for diagrams but watermark needs to be inside. 
        // Actually full page of a clean HTML is fine. We can just capture the element + watermark if we position right.
        // For simplicity, let's just do full page.

        console.log(`Saved to ${outputName}`);

        // Cleanup
        fs.unlinkSync(tempHtmlPath);
    }

    await browser.close();
}

renderDiagrams().catch(console.error);
