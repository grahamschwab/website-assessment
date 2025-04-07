const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url } = req.query;
  const strategy = "mobile"; // 🔒 Force mobile audits only
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;

  try {
    const response = await fetch(psiUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch PageSpeed data", details: error.toString() });
  }
};
