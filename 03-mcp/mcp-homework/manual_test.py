import requests

def scrape_web(url: str) -> str:
    """Scrape web content using Jina reader"""
    jina_url = f"https://r.jina.ai/{url}"
    response = requests.get(jina_url)
    response.raise_for_status()
    return response.text

# Test for Question 4
url = "https://datatalks.club/"
print("Fetching content...")
content = scrape_web(url)

# Count "data" (case-insensitive)
count = content.lower().count("data")

print(f"\nThe word 'data' appears {count} times on {url}")
