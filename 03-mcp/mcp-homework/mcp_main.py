from fastmcp import FastMCP
import requests
import os
import zipfile
import urllib.request
import minsearch

mcp = FastMCP("demo 🚀")

# Search setup
ZIP_URL = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
ZIP_FILENAME = "main.zip"
ROOT_PREFIX = "fastmcp-main/"

def download_zip():
    if not os.path.exists(ZIP_FILENAME):
        print(f"Downloading {ZIP_URL}...")
        urllib.request.urlretrieve(ZIP_URL, ZIP_FILENAME)
        print("Download complete.")
    else:
        print("Zip file already exists.")

def load_documents():
    documents = []
    with zipfile.ZipFile(ZIP_FILENAME, 'r') as zf:
        for file in zf.namelist():
            if file.endswith(('.md', '.mdx')):
                filename = file.replace(ROOT_PREFIX, '', 1)
                with zf.open(file) as f:
                    content = f.read().decode('utf-8')
                documents.append({
                    'content': content,
                    'filename': filename
                })
    return documents

def create_index(documents):
    index = minsearch.Index(
        text_fields=['content'],
        keyword_fields=['filename']
    )
    index.fit(documents)
    return index

def search_documents(index, query, num_results=5):
    return index.search(query, num_results=num_results)

# Initialize search index
download_zip()
documents = load_documents()
index = create_index(documents)
print(f"Loaded {len(documents)} documents into search index.")

url = "https://datatalks.club/"
@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool
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

@mcp.tool
def search_fastmcp_docs(query: str) -> str:
    """
    Search the FastMCP documentation for relevant information.
    
    Args:
        query: The search query to find relevant documentation
        
    Returns:
        A string with the top 5 most relevant document filenames and their content excerpts
    """
    results = search_documents(index, query)
    if not results:
        return "No relevant documents found."
    
    response = "Top 5 relevant documents:\n"
    for i, result in enumerate(results, 1):
        filename = result['filename']
        content = result['content'][:500] + "..." if len(result['content']) > 500 else result['content']
        response += f"\n{i}. **{filename}**\n{content}\n---\n"
    
    return response

if __name__ == "__main__":
    # Test the search function
    print("Testing search function:")
    results = search_documents(index, "getting started")
    response = "Top 5 relevant documents:\n"
    for i, result in enumerate(results, 1):
        filename = result['filename']
        content = result['content'][:200] + "..." if len(result['content']) > 200 else result['content']
        response += f"\n{i}. **{filename}**\n{content}\n---\n"
    print(response)
    print("\nStarting MCP server...")
    mcp.run()