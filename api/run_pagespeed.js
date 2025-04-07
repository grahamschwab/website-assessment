const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url, strategy = "mobile" } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const psiBase = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const query = `?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;
  const psiUrl = `${psiBase}${query}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000); // max for Vercel free tier

    const response = await fetch(psiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType.includes('application/json')) {
      const text = await response.text();
      return res.status(500).json({ error: "Non-JSON response", body: text });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch PageSpeed data",
      details: error.name === 'AbortError' ? 'Timeout exceeded' : error.toString()
    });
  }
};
