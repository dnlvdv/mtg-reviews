const fs = require('fs');
const path = require('path');

const domain = "https://dnlvdv.github.io/mtg-reviews/";
const folders = ["Bloomburrow", "aetherdrift"]; // Ensure folder names match your repo structure

// Map folder names to the correct JSON file names.
const jsonFiles = {
    "Bloomburrow": "blb.json",
    "aetherdrift": "DFT.json"
};

const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    folders.forEach(folder => {
        // Use the mapped filename or fall back to folder.json
        const jsonPath = path.join(folder, jsonFiles[folder] || `${folder}.json`);
        
        if (!fs.existsSync(jsonPath)) {
            console.error(`JSON file missing: ${jsonPath}`);
            return;
        }

        let cardsData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        
        // If the parsed data isn't an array, check if it has a "cards" property.
        if (!Array.isArray(cardsData)) {
            if (cardsData.cards && Array.isArray(cardsData.cards)) {
                cardsData = cardsData.cards;
            } else {
                console.error(`Unexpected JSON structure in ${jsonPath}:`, cardsData);
                return;
            }
        }

        cardsData.forEach(card => {
            // Compute URL for each card page.
            const url = `${domain}${folder}/${encodeURIComponent(card.name.replace(/\s+/g, '-'))}.html`;
            xml += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
        });
    });

    xml += `</urlset>`;

    fs.writeFileSync('sitemap.xml', xml);
    console.log('Sitemap generated successfully.');
};

generateSitemap();
