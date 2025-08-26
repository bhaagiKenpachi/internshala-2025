#!/bin/bash

# AMFI NAV Data Extractor
# Extracts Scheme Name and Asset Value from https://www.amfiindia.com/spages/NAVAll.txt
# Saves data as TSV (Tab-Separated Values) format

set -e  # Exit on any error

# Configuration
AMFI_URL="https://www.amfiindia.com/spages/NAVAll.txt"
OUTPUT_TSV="amfi_nav_data.tsv"
OUTPUT_JSON="amfi_nav_data.json"
TEMP_FILE="temp_nav_data.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  AMFI NAV Data Extractor${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to cleanup temporary files
cleanup() {
    if [ -f "$TEMP_FILE" ]; then
        rm -f "$TEMP_FILE"
        print_status "Cleaned up temporary files"
    fi
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Main extraction function
extract_nav_data() {
    print_header
    
    print_status "Fetching NAV data from AMFI..."
    
    # Download the NAV data
    if ! curl -s -o "$TEMP_FILE" "$AMFI_URL"; then
        print_error "Failed to download NAV data from $AMFI_URL"
        exit 1
    fi
    
    # Check if file was downloaded successfully
    if [ ! -s "$TEMP_FILE" ]; then
        print_error "Downloaded file is empty"
        exit 1
    fi
    
    print_status "Successfully downloaded NAV data"
    print_status "Processing data and extracting Scheme Name and Asset Value..."
    
    # Create TSV header
    echo -e "Scheme Code\tScheme Name\tAsset Value\tDate\tISIN Growth\tISIN Reinvestment" > "$OUTPUT_TSV"
    
    # Process the data line by line
    local line_count=0
    local processed_count=0
    
    while IFS= read -r line; do
        line_count=$((line_count + 1))
        
        # Skip empty lines and header lines
        if [[ -z "$line" || "$line" =~ ^[[:space:]]*$ ]]; then
            continue
        fi
        
        # Skip lines that don't contain NAV data (usually headers or footers)
        if [[ "$line" =~ ^[[:space:]]*[A-Z] ]]; then
            continue
        fi
        
        # Extract data using awk - AMFI format is semicolon separated
        # Format: Scheme Code;ISIN Growth;ISIN Reinvestment;Scheme Name;NAV;Date
        scheme_code=$(echo "$line" | awk -F';' 'NF>=6 {print $1}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        isin_growth=$(echo "$line" | awk -F';' 'NF>=6 {print $2}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        isin_reinvestment=$(echo "$line" | awk -F';' 'NF>=6 {print $3}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        scheme_name=$(echo "$line" | awk -F';' 'NF>=6 {print $4}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        nav_value=$(echo "$line" | awk -F';' 'NF>=6 {print $5}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        nav_date=$(echo "$line" | awk -F';' 'NF>=6 {print $6}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        
        # Only process lines that have valid scheme code, scheme name and NAV
        if [[ -n "$scheme_code" && -n "$scheme_name" && -n "$nav_value" && "$nav_value" =~ ^[0-9]+\.?[0-9]*$ ]]; then
            # Format the output line
            echo -e "${scheme_code}\t${scheme_name}\t${nav_value}\t${nav_date}\t${isin_growth}\t${isin_reinvestment}" >> "$OUTPUT_TSV"
            processed_count=$((processed_count + 1))
        fi
        
    done < "$TEMP_FILE"
    
    print_status "Processed $line_count lines from source file"
    print_status "Successfully extracted $processed_count valid records"
    
    # Show sample of extracted data
    if [ -s "$OUTPUT_TSV" ]; then
        print_status "Sample of extracted data:"
        echo "----------------------------------------"
        head -5 "$OUTPUT_TSV"
        echo "----------------------------------------"
    fi
}

# Function to create JSON output
create_json_output() {
    print_status "Creating JSON format output..."
    
    # Start JSON structure
    echo '{
  "metadata": {
    "source": "'$AMFI_URL'",
    "extracted_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "total_records": 0,
    "format": "Scheme Code, Scheme Name, Asset Value, Date, ISIN Growth, ISIN Reinvestment"
  },
  "data": [' > "$OUTPUT_JSON"
    
    # Skip header line and process data
    local first_line=true
    local record_count=0
    
    while IFS=$'\t' read -r scheme_code scheme_name nav_value nav_date isin_growth isin_reinvestment; do
        # Skip header
        if [[ "$scheme_code" == "Scheme Code" ]]; then
            continue
        fi
        
        # Add comma separator for all but first record
        if [ "$first_line" = true ]; then
            first_line=false
        else
            echo "," >> "$OUTPUT_JSON"
        fi
        
        # Create JSON record
        cat >> "$OUTPUT_JSON" << EOF
    {
      "scheme_code": "$scheme_code",
      "scheme_name": "$scheme_name",
      "asset_value": "$nav_value",
      "date": "$nav_date",
      "isin_growth": "$isin_growth",
      "isin_reinvestment": "$isin_reinvestment"
    }
EOF
        record_count=$((record_count + 1))
    done < "$OUTPUT_TSV"
    
    # Close JSON structure
    cat >> "$OUTPUT_JSON" << EOF
  ]
}
EOF
    
    # Update record count in metadata
    sed -i.bak "s/\"total_records\": 0/\"total_records\": $record_count/" "$OUTPUT_JSON"
    rm -f "$OUTPUT_JSON.bak"
    
    print_status "JSON output created with $record_count records"
}

# Function to show usage statistics
show_statistics() {
    if [ -s "$OUTPUT_TSV" ]; then
        print_status "File Statistics:"
        echo "  TSV File: $OUTPUT_TSV ($(wc -l < "$OUTPUT_TSV" | tr -d ' ') lines)"
        echo "  JSON File: $OUTPUT_JSON ($(du -h "$OUTPUT_JSON" | cut -f1))"
        echo "  Total Records: $(( $(wc -l < "$OUTPUT_TSV") - 1 ))"  # Subtract header line
    fi
}

# Main execution
main() {
    # Check if curl is available
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    # Check if bc is available for calculations
    if ! command -v bc &> /dev/null; then
        print_warning "bc not found - asset value conversions may not work properly"
    fi
    
    # Extract data
    extract_nav_data
    
    # Create JSON output
    create_json_output
    
    # Show statistics
    show_statistics
    
    print_status "Extraction completed successfully!"
    print_status "Files created:"
    echo "  - $OUTPUT_TSV (Tab-separated values)"
    echo "  - $OUTPUT_JSON (JSON format)"
    
    print_status "You can now use these files for further analysis"
}

# Run main function
main "$@"
