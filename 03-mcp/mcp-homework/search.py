import os
import zipfile
import urllib.request
import minsearch

# URL of the zip file
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

if __name__ == "__main__":
    download_zip()
    documents = load_documents()
    print(f"Loaded {len(documents)} documents.")
    index = create_index(documents)
    
    # Test search
    query = "getting started"
    results = search_documents(index, query)
    print(f"Search results for '{query}':")
    for result in results:
        print(f"- {result['filename']}")