const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  const strategies = ['desktop', 'mobile'];
  let finalResult = null;
  let errorMessages = [];

  for (const strategy of strategies) {
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=${strategy}&key=${apiKey}`;

    try {
      const response = await fetch(psiUrl, { timeout: 8000 }); // 8 second timeout per call
      if (!response.ok) throw new Error(`${strategy.toUpperCase()} request failed: ${response.statusText}`);
      const data = await response.json();

      // If API throws ResponseTooLarge or similar inside the JSON body
      if (data.error) {
        errorMessages.push(`[${strategy}] ${data.error.message}`);
        continue;
      }

      finalResult = { strategy, data };
      break; // success — break loop

    } catch (error) {
      errorMessages.push(`[${strategy}] ${error.message}`);
    }
  }

  if (finalResult) {
    return res.status(200).json(finalResult);
  } else {
    return res.status(504).json({
      error: 'Both desktop and mobile audits failed or timed out',
      details: errorMessages
    });
  }
};
