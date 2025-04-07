import requests
from bs4 import BeautifulSoup
import json

def handler(request):
    domain = request.args.get("domain")
    if not domain:
        return {"statusCode": 400, "body": json.dumps({"error": "Missing domain"})}

    headers = {"User-Agent": "Mozilla/5.0"}
    search_url = f"https://www.google.com/search?q=site:{domain}"
    html = requests.get(search_url, headers=headers).text
    soup = BeautifulSoup(html, "html.parser")
    stats = soup.select_one("#result-stats")

    if stats:
        text = stats.text
        return {"statusCode": 200, "body": json.dumps({"indexed_pages": text})}
    else:
        return {"statusCode": 200, "body": json.dumps({"indexed_pages": "Not found"})}
