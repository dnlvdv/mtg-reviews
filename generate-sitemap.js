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
        const jsonPath = path.join(folder, jsonFiles[folder] || `${folder}.json`);
        
        if (!fs.existsSync(jsonPath)) {
            console.error(`JSON file missing: ${jsonPath}`);
            return;
        }

        let cardsData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        
        // Updated JSON structure check: use data.cards if available.
        if (cardsData.data && Array.isArray(cardsData.data.cards)) {
            cardsData = cardsData.data.cards;
        } else if (!Array.isArray(cardsData)) {
            console.error(`Unexpected JSON structure in ${jsonPath}:`, cardsData);
            return;
        }

        cardsData.forEach(card => {
            // Compute URL for each card page.
            const url = `${domain}${folder}/cards_dynamic.html?card=${encodeURIComponent(card.name)}&number=${encodeURIComponent(card.number)}&artist=${encodeURIComponent(card.artist)}`;
            xml += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
        });
    });

    xml += `</urlset>`;

    fs.writeFileSync('sitemap.xml', xml);
    console.log('Sitemap generated successfully at sitemap.xml');
};

generateSitemap();
