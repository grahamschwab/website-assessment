const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Missing domain parameter" });
  }

  const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
};

  const searchUrl = `https://www.bing.com/search?q=site:${domain}`;

  try {
    const response = await fetch(searchUrl, { headers });
    const html = await response.text();
    const $ = cheerio.load(html);

    let stats = $('span.sb_count').text().trim();

    // Additional fallback for regional layout (often UK/EU)
    if (!stats) {
      stats = $('span.ftrB').text().trim(); // backup span (Bing A/B variant)
    }

    // Last resort: extract number from full page using regex
    if (!stats) {
      const match = html.match(/([\\d,]+) results/i);
      stats = match ? `${match[1]} results` : 'Not found';
    }

    res.status(200).json({ indexed_pages: stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indexed pages from Bing", details: error.toString() });
  }
};
