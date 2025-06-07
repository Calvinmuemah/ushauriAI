


const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/The_Constitution_of_Kenya_2010.txt.pdf');
// const filePath = path.join(__dirname, '../data/constitution.txt'); // Converted .txt file
const outputPath = path.join(__dirname, '../data/constitution.json');

const articleRegex = /(?:Article\s+)?(\d+)\.\s+(.*?)\n([\s\S]*?)(?=Article\s+\d+\.|$)/g;

fs.readFile(filePath, 'utf8', (err, text) => {
  if (err) return console.error('❌ Error reading text file:', err.message);

  const articles = [];
  let match;

  while ((match = articleRegex.exec(text)) !== null) {
    articles.push({
      article_number: match[1].trim(),
      title: match[2].trim(),
      content: match[3].trim().replace(/\s+/g, ' ')
    });
  }

  const output = {
    constitution: "Constitution of Kenya (2010)",
    articles
  };

  fs.writeFile(outputPath, JSON.stringify(output, null, 2), err => {
    if (err) console.error('❌ Error writing JSON:', err.message);
    else console.log('✅ JSON created at:', outputPath);
  });
});
