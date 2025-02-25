const fs = require('fs');
const path = require('path');

const domain = "https://dnlvdv.github.io/mtg-reviews/";
const folders = ["Bloomburrow", "aetherdrift"]; // Ensure these match your repo structure

// Map folder names to the correct JSON file names.
const jsonFiles = {
    "Bloomburrow": "blb.json",
    "aetherdrift": "DFT.json"
};

const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    folders.forEach(folder => {
        const jsonPath = path.join(folder, jsonFiles[folder] || `${folder}.json`);
        
        if (!fs.existsSync(jsonPath)) {
            console.error(`JSON file missing: ${jsonPath}`);
            return;
        }

        let cardsData;
        try {
            cardsData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        } catch (error) {
            console.error(`Error parsing JSON file: ${jsonPath}`, error);
            return;
        }
        
        // Check if cardsData is an array or has a 'cards' property.
        if (!Array.isArray(cardsData)) {
            if (cardsData.cards && Array.isArray(cardsData.cards)) {
                cardsData = cardsData.cards;
            } else {
                console.error(`Unexpected JSON structure in ${jsonPath}:`, cardsData);
                return;
            }
        }

        // Log how many cards we found in this folder.
        console.log(`Found ${cardsData.length} cards in ${jsonPath}`);

        cardsData.forEach(card => {
            // Build URL using query parameters.
            const url = `${domain}${folder}/cards_dynamic.html?card=${encodeURIComponent(card.name)}&number=${encodeURIComponent(card.number)}&artist=${encodeURIComponent(card.artist)}`;
            xml += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
        });
    });

    xml += `</urlset>`;

    fs.writeFileSync('sitemap.xml', xml);
    console.log('Sitemap generated successfully at sitemap.xml');
};

generateSitemap();
