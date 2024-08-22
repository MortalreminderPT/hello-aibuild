import re
import os
import time
import csv
import requests
from bs4 import BeautifulSoup
from geopy.geocoders import GoogleV3

api_key = os.getenv('GOOGLE_API_KEY')
geolocator = GoogleV3(api_key=api_key)

def fetch_html(url, headers, data=None):
    """Fetch HTML content from a given URL with specified headers."""
    response = requests.get(url, headers=headers, data=data)
    return response.text

def get_search_page(page_number):
    """Retrieve HTML for the search page."""
    url = f"https://www.goodschools.com.au/compare-schools/search/in-victoria?distance=10km&suburb_in=in-victoria&state_ids%5B0%5D=7&region_ids%5B0%5D=1300&page={page_number}"
    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }
    return fetch_html(url, headers)

def get_detail_page(url):
    """Retrieve HTML for the school detail page."""
    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'referer': 'https://www.goodschools.com.au/'
    }
    return fetch_html(url, headers)

def extract_school_urls(html_doc):
    """Extract school URLs from the search page HTML."""
    soup = BeautifulSoup(html_doc, 'html.parser')
    result_divs = soup.find_all('div', class_='col-12 text-center d-block d-sm-none')
    return [div.a['href'] for div in result_divs]

def parse_school_details(html_doc):
    """Parse school details from the detail page HTML."""
    soup = BeautifulSoup(html_doc, 'html.parser')
    school_info = {}

    name_tag = soup.find('h1')
    if name_tag:
        school_info['School Name'] = name_tag.get_text(strip=True)

    keywords = ['Sector', 'Level', 'Gender', 'Religion']
    for keyword in keywords:
        label_tag = soup.find('p', string=keyword)
        if label_tag:
            content_tag = label_tag.find_next_sibling('p')
            if content_tag:
                school_info[keyword] = content_tag.get_text(strip=True)

    principal_tag = soup.find('b', string=lambda text: text and "Principal:" in text)
    if principal_tag:
        school_info['Principal'] = principal_tag.find_parent('p').get_text(strip=True).replace('Principal:', '').strip()

    address_tag = soup.find('span', class_='map-address load-address')
    if address_tag:
        school_info['Address'] = address_tag.get_text(strip=True)

    tel_tag = soup.find('b', string=lambda text: text and "Tel:" in text)
    if tel_tag:
        school_info['Tel'] = tel_tag.find_parent('p').get_text(strip=True).replace('Tel:', '').strip()

    academic_tag = soup.find('h4', string='Academic Results')
    if academic_tag:
        target_div = academic_tag.find_parent('div', class_='col-md-6')
        if target_div:
            for result in target_div.find_all('p', class_='mb-1'):
                key = result.get_text(strip=True).split(':')[0]
                value = result.find('span', class_='font-weight-bold').get_text(strip=True)
                school_info[key] = value

    return school_info

def save_to_csv(data_list, filename):
    """Save extracted school data to a CSV file."""
    header = [
        'School Name', 'Sector', 'Level',
        'Gender', 'Religion', 'Principal',
        'Tel', 'Address', 'Postcode', 'Latitude', 'Longitude', 'Raw',
        'Scores of 40+', 'Median Score', 'Satisfactory completions of VCE', 'Satisfactory completions of VET', 
    ]
    
    if data_list:
        with open(filename, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(header)
            for data in data_list:
                row = [data.get(key, 'N/A') if data.get(key) else 'N/A' for key in header]
                writer.writerow(row)

def process(data):
    """Add inferred information."""
    # Parse geolocation
    location = geolocator.geocode(f'{data["Address"]}, AU')
    print(location.raw)
    data['Latitude'], data['Longitude'], data['Raw'] = location.latitude, location.longitude, location.raw

    # Parse Postcode
    pattern = r'(\d+)$'
    matches = re.findall(pattern, data['Address'])
    data['Postcode'] = matches[0] if matches else 'N/A'

    # Prevent too frequent api calls
    time.sleep(1)
    return data

# Main execution
def main():
    all_school_data = []
    count = 0
    for page_number in range(10):  # Adjust range as needed
        search_html = get_search_page(page_number)
        school_urls = extract_school_urls(search_html)
        for url in school_urls:
            detail_html = get_detail_page(url)
            school_data = parse_school_details(detail_html)
            school_data = process(school_data)
            print(school_data)
            count += 1
            print(f'{count} school(s) fetched.')
            all_school_data.append(school_data)

    save_to_csv(all_school_data, './school_info.csv')

if __name__ == '__main__':
    main()