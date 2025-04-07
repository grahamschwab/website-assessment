const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url, strategy = "mobile" } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;

  try {
    const response = await fetch(psiUrl);
    const data = await response.json();

    if (data.error) {
      // Graceful error handling
      return res.status(200).json({
        strategy,
        error: data.error.message || "Unknown PageSpeed API error",
        code: data.error.code || null
      });
    }

    return res.status(200).json({
      strategy,
      lighthouseResult: data.lighthouseResult,
      loadingExperience: data.loadingExperience,
      originLoadingExperience: data.originLoadingExperience
    });
  } catch (error) {
    res.status(500).json({
      strategy,
      error: "Failed to fetch PageSpeed data",
      details: error.toString()
    });
  }
};

