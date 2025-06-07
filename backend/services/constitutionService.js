const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/constitution.json');
let articles = []; 

try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const parsedContent = JSON.parse(fileContent);
  articles = parsedContent.articles || []; 
} catch (error) {
  console.error('Error reading or parsing constitution.json:', error);
  
}

function findArticleByNumber(number) {
  // console.log('Searching for:', number);
  // console.log('Available article numbers:', articles.map(a => a.number)); 
  return articles.find(article => article.number.toString().trim() === number.toString().trim()); 
}

function searchArticlesByKeyword(keyword) {
  const lower = keyword.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(lower) || article.content.toLowerCase().includes(lower)
  );
}

module.exports = { findArticleByNumber, searchArticlesByKeyword };