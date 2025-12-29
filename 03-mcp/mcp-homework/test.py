import requests
from test_scraper import scrape_web

def test_scrape_web():
    """Test the scrape_web function with various URLs"""

    test_urls = [
        "https://github.com/alexeygrigorev/minsearch",
        "https://datatalks.club/",
        "https://www.python.org/",
        "https://fastmcp.com/"
    ]

    print("Testing scrape_web function...\n")

    for i, url in enumerate(test_urls, 1):
        print(f"Test {i}: Scraping {url}")
        print("-" * 50)

        try:
            # Test the scrape_web function
            content = scrape_web(url)

            # Basic validation
            assert isinstance(content, str), f"Expected string, got {type(content)}"
            assert len(content) > 0, "Content should not be empty"
            assert len(content) > 100, f"Content seems too short: {len(content)} characters"

            print(f"✅ Success! Retrieved {len(content)} characters")
            print(f"First 200 characters:\n{content[:200]}...")
            print(f"Last 200 characters:\n...{content[-200:]}")

            # Check for common markdown elements
            has_headers = '#' in content
            has_links = '[' in content and ']' in content
            has_code = '`' in content

            print("\nContent analysis:")
            print(f"  - Contains headers: {has_headers}")
            print(f"  - Contains links: {has_links}")
            print(f"  - Contains code blocks: {has_code}")

        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
        except AssertionError as e:
            print(f"❌ Validation error: {e}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

        print("\n" + "="*80 + "\n")

def test_error_handling():
    """Test error handling for invalid URLs"""
    print("Testing error handling...\n")

    invalid_urls = [
        "https://invalid-domain-that-does-not-exist.com/",
        "not-a-url",
        "https://httpstat.us/404"  # Returns 404
    ]

    for url in invalid_urls:
        print(f"Testing invalid URL: {url}")
        try:
            content = scrape_web(url)
            print(f"❌ Expected error but got content: {len(content)} characters")
        except requests.exceptions.RequestException as e:
            print(f"✅ Correctly caught network error: {e}")
        except Exception as e:
            print(f"✅ Correctly caught error: {e}")
        print()

if __name__ == "__main__":
    test_scrape_web()
    test_error_handling()
    print("All tests completed!")