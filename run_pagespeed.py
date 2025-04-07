import json
import requests
import os

def handler(request):
    params = request.args
    url = params.get("url")
    strategy = params.get("strategy", "mobile")
    api_key = os.getenv("GOOGLE_API_KEY")

    if not url:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing URL parameter"})
        }

    psi_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&strategy={strategy}&key={api_key}"
    psi_response = requests.get(psi_url)

    return {
        "statusCode": psi_response.status_code,
        "body": psi_response.text
    }
