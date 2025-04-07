const html = await response.text();
const $ = cheerio.load(html);

let stats = $('#result-stats').text();
if (!stats) {
  const match = html.match(/About ([\\d,]+) results/);
  stats = match ? `About ${match[1]} results` : 'Not found';
}

res.status(200).json({ indexed_pages: stats });
