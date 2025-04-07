export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL parameter" }), {
      status: 400,
    });
  }

  const fetchWithTimeout = async (strategy) => {
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch(psiUrl, { signal: controller.signal });
      clearTimeout(timeout);
      return await res.json();
    } catch (error) {
      clearTimeout(timeout);
      return { error: error.toString() };
    }
  };

  const [mobileResult, desktopResult] = await Promise.all([
    fetchWithTimeout("mobile"),
    fetchWithTimeout("desktop")
  ]);

  return new Response(JSON.stringify({
    url,
    mobile: mobileResult,
    desktop: desktopResult
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
