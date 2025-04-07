const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Missing domain parameter" });
  }

  const headers = { "User-Agent": "Mozilla/5.0" };
  const searchUrl = \`https://www.google.com/search?q=site:\${domain}\`;

  try {
    const response = await fetch(searchUrl, { headers });
    const html = await response.text();
    const $ = cheerio.load(html);
    const stats = $('#result-stats').text() || 'Not found';
    res.status(200).json({ indexed_pages: stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indexed pages", details: error.toString() });
  }
};
