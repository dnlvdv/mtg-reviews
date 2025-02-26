const fs = require('fs');
const path = require('path');

// --- Configuration ---
// Change this to point to your JSON file. For example, for Bloomburrow:
const inputJsonPath = path.join('Bloomburrow', 'blb.json');

// Directory where Markdown files will be created
const outputDir = '_cards';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// --- Read and Parse JSON Data ---
let rawData = fs.readFileSync(inputJsonPath, 'utf8');
let data = JSON.parse(rawData);

// Check if your JSON structure is nested (e.g., { data: { cards: [...] } })
if (data.data && Array.isArray(data.data.cards)) {
  data = data.data.cards;
} else if (!Array.isArray(data)) {
  data = [data];
}

console.log(`Found ${data.length} cards in ${inputJsonPath}`);

// --- Generate Markdown Files for Each Card ---
data.forEach(card => {
  // Create a URL-friendly slug from the card name
  const slug = card.name.toLowerCase().replace(/[\s,']+/g, '-');

  // Build YAML front matter with your desired fields.
  // Now including: number (collector's number)
  let frontMatter = `---\n`;
  frontMatter += `layout: card\n`;
  frontMatter += `title: "${card.name} - ${card.manaCost || ''}"\n`;
  frontMatter += `slug: "${slug}"\n`;
  frontMatter += `name: "${card.name}"\n`;
  frontMatter += `manaCost: "${card.manaCost || ''}"\n`;
  frontMatter += `number: "${card.number || ''}"\n`;
  frontMatter += `type: "${card.type || ''}"\n`;
  // Replace newlines in text fields with literal \n for YAML
  frontMatter += `text: "${(card.text || '').replace(/\n/g, '\\n')}"\n`;
  frontMatter += `flavorText: "${(card.flavorText || '').replace(/"/g, "'").replace(/\n/g, '\\n')}"\n`;
  frontMatter += `artist: "${card.artist || ''}"\n`;
  // Assume image is built by replacing spaces with underscores in the card name
  const imageName = card.name.replace(/\s+/g, '_') + ".png";
  frontMatter += `image: "/Pictures/${imageName}"\n`;
  frontMatter += `---\n\n`;

  // Additional content can be added below if needed
  const content = frontMatter;

  // Define output file name, e.g. "air-response-unit.md"
  const outputPath = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Generated ${outputPath}`);
});
