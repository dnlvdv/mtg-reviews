const fs = require('fs');
const path = require('path');

const domain = "https://dnlvdv.github.io/mtg-reviews/";
const folders = ["Bloomburrow", "aetherdrift"]; // Add more folders as needed

const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

const jsonFiles = {
    "Bloomburrow": "blb.json",
    "Aetherdrift": "DFT.json"
};

folders.forEach(folder => {
    const jsonPath = path.join(folder, jsonFiles[folder] || `${folder}.json`);
        
        if (!fs.existsSync(jsonPath)) {
            console.error(`JSON file missing: ${jsonPath}`);
            return;
        }

        const cards = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

        cards.forEach(card => {
            const url = `${domain}${folder}/${encodeURIComponent(card.name.replace(/\s+/g, '-'))}.html`;
            xml += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
        });
    });

    xml += `</urlset>`;

    fs.writeFileSync('sitemap.xml', xml);
    console.log('Sitemap generated successfully.');
};

generateSitemap();
