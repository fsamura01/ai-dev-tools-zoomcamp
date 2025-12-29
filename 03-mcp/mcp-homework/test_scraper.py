import requests

def scrape_web(url: str) -> str:
    """
    Scrape the content of any web page and return it as markdown.
    
    Args:
        url: The URL of the web page to scrape
        
    Returns:
        The content of the web page in markdown format
    """
    jina_url = f"https://r.jina.ai/{url}"
    response = requests.get(jina_url)
    response.raise_for_status()
    return response.text

if __name__ == "__main__":
    # Test with the minsearch GitHub repo
    url = "https://github.com/alexeygrigorev/minsearch"
    content = scrape_web(url)
    
    print(f"Content length: {len(content)} characters")
    print("\nFirst 500 characters:")
    print(content[:500])
