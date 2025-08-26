#!/usr/bin/env python3
"""
OLX Car Cover Scraper
Searches for "Car Cover" on OLX and saves results to a file
Uses headless browser to bypass blocking
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import csv
from datetime import datetime
import re
import os

# Try to import Selenium for headless browsing
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, WebDriverException
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    print("⚠️  Selenium not available. Install with: pip install selenium")

class OLXCarCoverScraper:
    def __init__(self):
        self.base_url = "https://www.olx.in"
        self.search_url = "https://www.olx.in/items/q-car-cover"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        }
        self.results = []
        self.session = requests.Session()
        # Configure session for better reliability
        self.session.mount('https://', requests.adapters.HTTPAdapter(
            max_retries=3,
            pool_connections=10,
            pool_maxsize=10
        ))
        
        # Initialize headless browser if available
        self.driver = None
        if SELENIUM_AVAILABLE:
            self.setup_headless_browser()
    
    def setup_headless_browser(self):
        """Setup headless Chrome browser for scraping"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            # Disable images and CSS for faster loading
            chrome_options.add_argument("--disable-images")
            chrome_options.add_argument("--disable-javascript")
            
            # Set Chrome binary path for macOS
            chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            if os.path.exists(chrome_path):
                chrome_options.binary_location = chrome_path
            
            self.driver = webdriver.Chrome(options=chrome_options)
            print("✅ Headless browser initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize headless browser: {e}")
            print("💡 Make sure Chrome/Chromium is installed and chromedriver is in PATH")
            self.driver = None
    
    def get_page_content_headless(self, url, timeout=30):
        """Fetch page content using headless browser"""
        if not self.driver:
            return None
            
        try:
            print(f"🌐 Using headless browser to fetch: {url}")
            self.driver.get(url)
            
            # Wait for page to load
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Additional wait for dynamic content
            time.sleep(3)
            
            # Get page source
            page_source = self.driver.page_source
            
            if len(page_source.strip()) > 1000:
                print(f"✅ Successfully fetched {len(page_source)} characters via headless browser")
                return page_source
            else:
                print("⚠️  Headless browser returned insufficient content")
                return None
                
        except TimeoutException:
            print(f"❌ Headless browser timeout for {url}")
            return None
        except WebDriverException as e:
            print(f"❌ Headless browser error: {e}")
            return None
        except Exception as e:
            print(f"❌ Unexpected error in headless browser: {e}")
            return None

    def get_page_content(self, url, max_retries=5):
        """Fetch page content with improved error handling and retries"""
        for attempt in range(max_retries):
            try:
                print(f"Attempt {attempt + 1}/{max_retries} to fetch {url}")
                
                # Use shorter timeout for faster failure detection
                timeout = (10, 20)  # (connect_timeout, read_timeout)
                response = self.session.get(url, headers=self.headers, timeout=timeout)
                response.raise_for_status()
                
                # Check if we got actual content
                if len(response.text.strip()) < 100:
                    print(f"Warning: Received very short response ({len(response.text)} characters)")
                    if attempt < max_retries - 1:
                        print(f"Retrying in {2 ** attempt} seconds...")
                        time.sleep(2 ** attempt)
                        continue
                
                return response.text
                
            except requests.exceptions.Timeout as e:
                print(f"Timeout error (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    wait_time = min(2 ** attempt, 10)  # Cap at 10 seconds
                    print(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    print(f"Failed to fetch {url} after {max_retries} attempts due to timeouts")
                    return None
                    
            except requests.RequestException as e:
                print(f"Request error (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    wait_time = min(2 ** attempt, 10)
                    print(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    print(f"Failed to fetch {url} after {max_retries} attempts")
                    return None

    def parse_listing(self, listing_element):
        """Parse individual listing data based on actual OLX HTML structure"""
        try:
            # Extract title - using the correct class from the HTML example
            title_element = listing_element.find('span', class_='_2poNJ', attrs={'data-aut-id': 'itemTitle'})
            title = title_element.get_text(strip=True) if title_element else "N/A"
            
            # Check if this is a car cover item (more flexible matching)
            title_lower = title.lower()
            car_cover_keywords = ['car cover', 'car body cover', 'vehicle cover', 'auto cover']
            is_car_cover = any(keyword in title_lower for keyword in car_cover_keywords)
            
            if not is_car_cover:
                return None  # Skip non-car-cover items
            
            # Extract price - using the correct class from the HTML example
            price_element = listing_element.find('span', class_='_2Ks63', attrs={'data-aut-id': 'itemPrice'})
            price = price_element.get_text(strip=True) if price_element else "N/A"
            
            # Extract location - using the correct class from the HTML example
            location_element = listing_element.find('span', class_='_2VQu4', attrs={'data-aut-id': 'item-location'})
            location = location_element.get_text(strip=True) if location_element else "N/A"
            
            # Extract link - try multiple selectors for better compatibility
            link = "N/A"
            link_selectors = [
                'a[href*="/item/"]',  # Any link containing /item/
                'a._2cbZ2',           # Original selector
                'a[data-aut-id="itemLink"]',  # Alternative selector
                'a'                   # Fallback to any link
            ]
            
            for selector in link_selectors:
                link_element = listing_element.select_one(selector)
                if link_element and link_element.get('href'):
                    href = link_element.get('href')
                    if href.startswith('/'):
                        link = self.base_url + href
                    elif href.startswith('http'):
                        link = href
                    else:
                        link = self.base_url + '/' + href
                    break
            
            # Extract image URL - try multiple selectors
            image_url = "N/A"
            img_selectors = [
                'img._3vnjf',         # Original selector
                'img[src*="apollo.olx.in"]',  # Apollo CDN images
                'img[src*="olx.in"]',         # Any OLX image
                'img'                 # Fallback to any image
            ]
            
            for selector in img_selectors:
                img_element = listing_element.select_one(selector)
                if img_element and img_element.get('src'):
                    image_url = img_element.get('src')
                    break
            
            # Extract posted date - look for the date span in the _3rmDx div
            date_div = listing_element.find('div', class_='_3rmDx')
            posted_date = "N/A"
            if date_div:
                date_spans = date_div.find_all('span')
                for span in date_spans:
                    if span.get('class') and '_2jcGx' in span.get('class'):
                        posted_date = span.get_text(strip=True)
                        break
            
            return {
                'title': title,
                'price': price,
                'location': location,
                'link': link,
                'image_url': image_url,
                'posted_date': posted_date,
                'scraped_at': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error parsing listing: {e}")
            return None

    def scrape_search_results(self):
        """Scrape car cover search results from OLX"""
        print("🔍 Searching for 'Car Cover' on OLX...")
        
        # Try multiple search URLs in case one fails
        search_urls = [
            "https://www.olx.in/items/q-car-cover",
            "https://www.olx.in/cars/car-accessories/car-covers",
            "https://www.olx.in/search?q=car+cover"
        ]
        
        content = None
        used_url = None
        method_used = "requests"
        
        # Try headless browser first (more reliable for bypassing blocks)
        if self.driver:
            print("🌐 Using headless browser for reliable scraping...")
            for url in search_urls:
                print(f"Trying URL with headless browser: {url}")
                content = self.get_page_content_headless(url)
                if content and len(content.strip()) > 1000:
                    used_url = url
                    method_used = "headless browser"
                    break
                else:
                    print(f"URL {url} failed with headless browser")
        
        # Fallback to requests if headless browser is not available
        if not content:
            print("🔄 Headless browser failed, trying requests as fallback...")
            for url in search_urls:
                print(f"Trying URL with requests: {url}")
                content = self.get_page_content(url)
                if content and len(content.strip()) > 1000:  # Ensure we got substantial content
                    used_url = url
                    method_used = "requests"
                    break
                else:
                    print(f"URL {url} failed with requests")
        
        if not content:
            print("❌ Failed to fetch search results from all URLs using both methods")
            return
        
        print(f"✅ Successfully fetched content from: {used_url} using {method_used}")
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Look for listing containers - using the actual OLX HTML structure
        # Try multiple possible selectors based on the provided HTML example
        listing_selectors = [
            'li[data-aut-id^="itemBox"]',  # Primary selector based on the HTML example
            'li[class*="_1DNjI"]',        # Alternative using the class name
            'div[data-aut-id="itemBox"]', # Fallback for div-based structure
            'div[data-cy="l-card"]',      # Legacy selector
            'div[data-testid="adCard"]',  # Another fallback
            'div[class*="listing"]',      # Generic listing class
            'div[class*="card"]'          # Generic card class
        ]
        
        listings = []
        for selector in listing_selectors:
            listings = soup.select(selector)
            if listings:
                print(f"✅ Found {len(listings)} listings using selector: {selector}")
                break
        
        if not listings:
            # Fallback: look for any div that might contain listing info
            print("⚠️  No listings found with standard selectors, trying fallback...")
            # Look for elements containing price patterns
            price_pattern = re.compile(r'₹|Rs\.|INR')
            all_divs = soup.find_all('div')
            for div in all_divs:
                if price_pattern.search(div.get_text()):
                    listings.append(div)
                    if len(listings) >= 20:  # Limit fallback results
                        break
        
        print(f"📊 Processing {len(listings)} listings...")
        
        car_cover_count = 0
        for listing in listings:
            parsed_data = self.parse_listing(listing)
            if parsed_data:
                self.results.append(parsed_data)
                car_cover_count += 1
        
        print(f"✅ Successfully parsed {len(self.results)} car cover listings out of {len(listings)} total listings")
        
        # If no car cover items found, try to analyze what we got
        if not self.results and listings:
            print("🔍 No car cover items found. Analyzing available listings...")
            sample_titles = []
            for listing in listings[:5]:  # Check first 5 listings
                title_element = listing.find('span', class_='_2poNJ', attrs={'data-aut-id': 'itemTitle'})
                if title_element:
                    title = title_element.get_text(strip=True)
                    sample_titles.append(title)
            
            if sample_titles:
                print("📋 Sample titles found:")
                for i, title in enumerate(sample_titles, 1):
                    print(f"   {i}. {title}")
                print("💡 Tip: The website might not have car cover items, or the search query needs adjustment")
    
    def cleanup(self):
        """Clean up resources"""
        if self.driver:
            try:
                self.driver.quit()
                print("✅ Headless browser closed successfully")
            except Exception as e:
                print(f"⚠️  Error closing headless browser: {e}")

    def save_to_json(self, filename="olx_car_cover_results.json"):
        """Save results to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'search_query': 'Car Cover',
                'search_url': self.search_url,
                'total_results': len(self.results),
                'scraped_at': datetime.now().isoformat(),
                'results': self.results
            }, f, indent=2, ensure_ascii=False)
        print(f"💾 Results saved to {filename}")

    def save_to_csv(self, filename="olx_car_cover_results.csv"):
        """Save results to CSV file"""
        if not self.results:
            print("❌ No results to save")
            return
        
        fieldnames = self.results[0].keys()
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(self.results)
        print(f"💾 Results saved to {filename}")

    def save_to_txt(self, filename="olx_car_cover_results.txt"):
        """Save results to human-readable text file"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("OLX Car Cover Search Results\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Search Query: Car Cover\n")
            f.write(f"Search URL: {self.search_url}\n")
            f.write(f"Total Results: {len(self.results)}\n")
            f.write(f"Scraped At: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            for i, result in enumerate(self.results, 1):
                f.write(f"Listing {i}:\n")
                f.write(f"  Title: {result['title']}\n")
                f.write(f"  Price: {result['price']}\n")
                f.write(f"  Location: {result['location']}\n")
                f.write(f"  Link: {result['link']}\n")
                f.write(f"  Posted: {result['posted_date']}\n")
                f.write("-" * 30 + "\n\n")
        
        print(f"💾 Results saved to {filename}")





    def run(self):
        """Main execution method"""
        print("🚗 OLX Car Cover Scraper")
        print("=" * 30)
        
        try:
            self.scrape_search_results()
            
            if self.results:
                # Save in multiple formats
                self.save_to_json()
                self.save_to_csv()
                self.save_to_txt()
                
                print(f"\n📈 Summary:")
                print(f"   Total car cover listings found: {len(self.results)}")
                print(f"   Files created: olx_car_cover_results.json, olx_car_cover_results.csv, olx_car_cover_results.txt")
            else:
                print("❌ No car cover listings found.")
                print("   This could be due to:")
                print("   - Network connectivity issues")
                print("   - Website structure changes")
                print("   - No car cover items currently available")
                print("   - Website blocking automated requests")
        finally:
            # Always cleanup resources
            self.cleanup()

if __name__ == "__main__":
    scraper = OLXCarCoverScraper()
    scraper.run()
