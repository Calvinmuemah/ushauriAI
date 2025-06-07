const express = require('express');
const router = express.Router();
const { findArticleByNumber, searchArticlesByKeyword } = require('../services/constitutionService');
const { getGeminiResponse } = require('../services/AIchat'); // Assuming aiService.js is in the services folder

// Existing routes...
router.get('/article/:number', (req, res) => {
  const article = findArticleByNumber(req.params.number);
  if (!article) return res.status(404).json({ message: 'Article not found' });
  res.json(article);
});

router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Missing query parameter ?q=' });
  const results = searchArticlesByKeyword(q);
  res.json(results);
});

// NEW CHAT ENDPOINT (integrating Gemini)
router.post('/chat', async (req, res) => {
  const userMessage = req.body.message; 
  if (!userMessage) {
    return res.status(400).json({ message: 'Missing "message" in request body.' });
  }

  let relevantContext = '';

  const articleMatch = userMessage.match(/(?:article|Article)\s*(\d+)/i);
  const keywordSearchMatch = userMessage.match(/(?:what is|tell me about)\s*(.+)/i);

  if (articleMatch && articleMatch[1]) {
    const articleNumber = articleMatch[1];
    const article = findArticleByNumber(articleNumber);
    if (article) {
      relevantContext = `Article ${article.number}: ${article.title}\n${article.content}`;
      console.log(`Providing Article ${article.number} as context to Gemini.`);
    }
  } else if (keywordSearchMatch && keywordSearchMatch[1]) {
    const keyword = keywordSearchMatch[1];
    const searchResults = searchArticlesByKeyword(keyword);
    if (searchResults.length > 0) {
      // You might choose to include only a few top results or summarize them
      relevantContext = searchResults.slice(0, 3).map(art => `Article ${art.number}: ${art.title}\n${art.content}`).join('\n\n');
      console.log(`Providing search results for "${keyword}" as context to Gemini.`);
    }
  }

  try {
    const aiResponse = await getGeminiResponse(userMessage, relevantContext);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
});

module.exports = router;