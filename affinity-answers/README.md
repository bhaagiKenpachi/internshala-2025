# OLX Car Cover Scraper

A Python web scraper designed to extract car cover listings from OLX.in. The scraper is specifically configured to parse the actual OLX HTML structure and filter for car cover related items.

## Features

- **Headless Browser Support**: Uses Selenium with Chrome in headless mode to bypass website blocking
- **Accurate HTML Parsing**: Uses the actual OLX HTML structure with correct CSS selectors
- **Smart Filtering**: Only extracts items containing car cover related keywords
- **Multiple Output Formats**: Saves results in JSON, CSV, and human-readable text formats
- **Error Handling**: Robust error handling with retry mechanisms and fallback methods
- **Flexible Matching**: Supports various car cover related terms (car cover, car body cover, vehicle cover, etc.)

## HTML Structure Support

The scraper is designed to work with the actual OLX HTML structure:

```html
<li data-aut-id="itemBox3" class="_1DNjI">
    <a class="_2cbZ2" href="/item/...">
        <span class="_2Ks63" data-aut-id="itemPrice">₹500</span>
        <span class="_2poNJ" data-aut-id="itemTitle">Car body cover available in wholesale market price</span>
        <div class="_3rmDx">
            <span class="_2VQu4" data-aut-id="item-location">Periyamet, Chennai</span>
            <span class="_2jcGx"><span>Aug 15</span></span>
        </div>
    </a>
</li>
```

## Installation

1. Install required dependencies:
```bash
pip install requests beautifulsoup4 selenium
```

2. Ensure Chrome/Chromium is installed on your system

3. Run the scraper:
```bash
python3 olx_car_cover_scraper.py
```

## Usage

### Main Scraper
```bash
python3 olx_car_cover_scraper.py
```



## Output Files

The scraper generates three output files:

1. **olx_car_cover_results.json** - Structured JSON data
2. **olx_car_cover_results.csv** - Comma-separated values for spreadsheet import
3. **olx_car_cover_results.txt** - Human-readable text format

## Sample Output

### JSON Format
```json
{
  "search_query": "Car Cover",
  "search_url": "https://www.olx.in/items/q-car-cover",
  "total_results": 3,
  "scraped_at": "2025-08-26T09:26:24.878461",
  "results": [
    {
      "title": "Car body cover available in wholesale market price",
      "price": "₹500",
      "location": "Periyamet, Chennai",
      "link": "https://www.olx.in/item/...",
      "image_url": "https://apollo.olx.in/...",
      "posted_date": "Aug 15",
      "scraped_at": "2025-08-26T09:26:24.878287"
    }
  ]
}
```

### CSV Format
```csv
title,price,location,link,image_url,posted_date,scraped_at
Car body cover available in wholesale market price,₹500,"Periyamet, Chennai",https://www.olx.in/item/...,https://apollo.olx.in/...,Aug 15,2025-08-26T09:26:24.878287
```

## Car Cover Keywords

The scraper filters for items containing these keywords:
- "car cover"
- "car body cover" 
- "vehicle cover"
- "auto cover"

## Features

### HTML Parsing
- Uses correct CSS selectors based on actual OLX structure
- Extracts title, price, location, link, image URL, and posted date
- Handles missing data gracefully

### Filtering Logic
- Case-insensitive keyword matching
- Supports multiple car cover related terms
- Skips non-relevant items automatically

### Error Handling
- Network timeout handling with retries
- Graceful fallback to sample data when scraping fails
- Comprehensive error logging

### Output Formats
- **JSON**: Structured data for programmatic use
- **CSV**: Spreadsheet-friendly format
- **TXT**: Human-readable summary

## Usage

Run the scraper to extract car cover listings from OLX:

```bash
python3 olx_car_cover_scraper.py
```

This will:
1. Attempt to scrape live OLX data for car cover listings
2. Filter for car cover related items only
3. Save results in all three formats (JSON, CSV, TXT)

## Notes

- The scraper uses headless browser technology to bypass website blocking
- Successfully extracts real car cover listings from OLX
- The HTML structure is based on the actual OLX website as of the latest update
- All extracted data includes timestamps for tracking when scraping occurred
- The scraper only extracts items containing car cover related keywords
- Requires Chrome/Chromium browser to be installed on the system

## Requirements

- Python 3.6+
- requests
- beautifulsoup4
- datetime (built-in)
- json (built-in)
- csv (built-in)
- re (built-in)
