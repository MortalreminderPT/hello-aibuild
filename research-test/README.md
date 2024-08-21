## Task 1

### 1. Tools

Chrome Developer Tools, Postman, Python (BeautifulSoup, geopy), Google Maps Platform

### 2. Crawling Search Pages

#### 1. Generate Python Request Code Using Postman

First, open Chrome Developer Tools. It's clear that the webpage is server-side rendered, so we need to crawl the HTML document to analyze and obtain the required data.

We use Chrome Developer Tools to export the link request as a cURL request code. Here's an example of a cURL request:

```bash
curl 'https://www.goodschools.com.au/compare-schools/search/in-victoria?distance=10km&suburb_in=in-victoria&state_ids%5B0%5D=7&region_ids%5B0%5D=1300&page=1' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7' \
  ......
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
```

Then, import this request into Postman using cURL and generate Python code with the Code snippet feature:

![image-20240821223911482](./assets/image-20240821223911482.png)

Encapsulate this code into a function `get_search_page()` and make adjustments to pass the page number as a parameter, allowing you to crawl different pages. The HTTP crawling code is complete.

#### 2. Analyze Webpage Layout Using Chrome Developer Tools

Back in Chrome, open Developer Tools and go to the Elements tab. By inspecting the HTML code blocks (which are highlighted when selected), we can visually identify where the required data is located.

![image-20240821224021037](./assets/image-20240821224021037.png)

The green circle in the image represents the HTML code for a school. Since we need information like Academic Results, it's best to go to the details page to extract data. Therefore, the red section is what we need.

In the Python code, use the `BeautifulSoup` library to parse the HTML and locate the `div` containing the link by searching for `class="col-12 text-center d-block d-sm-none"` (which is unique on the page). This allows us to extract the URL of the details page.

#### 3. Crawling Example

Encapsulate the above HTTP parsing code into `extract_school_urls`, which works with `get_search_page()` to read all school detail page URLs from the current page. For page 1, the crawled data looks like this:

```bash
['https://www.goodschools.com.au/compare-schools/in-mont-albert-north-3129/box-hill-senior-secondary-college', 'https://www.goodschools.com.au/compare-schools/in-brighton-3186/brighton-grammar-school', 'https://www.goodschools.com.au/compare-schools/in-burwood-east-3151/burwood-heights-primary-school', 'https://www.goodschools.com.au/compare-schools/in-kew-3101/carey-baptist-grammar-school', 'https://www.goodschools.com.au/compare-schools/in-sydenham-3037/catholic-regional-college-sydenham', 'https://www.goodschools.com.au/compare-schools/in-south-yarra-3141/centre-for-higher-education-studies', 'https://www.goodschools.com.au/compare-schools/in-kew-3101/genazzano-fcj-college', 'https://www.goodschools.com.au/compare-schools/in-narre-warren-south-3805/heritage-college', 'https://www.goodschools.com.au/compare-schools/in-mitcham-3132/mullauna-college', 'https://www.goodschools.com.au/compare-schools/in-toorak-3142/st-catherines-school-toorak']
```

### 3. Crawling School Detail Pages

The logic for crawling school detail pages is similar to that in section 1. The `get_detail_page()` function is used to crawl HTML, and `parse_school_details()` is used to parse the HTML.

The required data is parsed into a `dict`. For example, the parsed result for the page `https://www.goodschools.com.au/compare-schools/in-mont-albert-north-3129/box-hill-senior-secondary-college` is:

```bash
{
   "School Name":"Box Hill Senior Secondary College",
   "Sector":"Government",
   "Level":"Combined",
   "Gender":"Co-Ed",
   "Religion":"Secular",
   "Principal":"Mr Warren Dawson",
   "Address":"19 Dunloe Ave Mont Albert North Victoria 3129",
   "Tel":"(03) 9890 0571",
   "Scores of 40+":"1%",
   "Median Score":"26",
   "Satisfactory completions of VCE":"95%",
   "Satisfactory completions of VET":"59%"
}
```

### 4. Data Processing

1. Extract Postcodes from Address Information Using Regular Expressions

According to the task requirements, we need to obtain each school's postcode. However, postcodes are not presented as separate elements on the page and cannot be directly crawled.

Upon inspection, it is observed that the last four digits of each school's address are the postcode. Therefore, we use regular expressions to extract the last four digits of the address as the postcode.

2. Obtain Latitude and Longitude Using Geopy

Additionally, we need not only the school's address but also its physical location, i.e., latitude and longitude. Latitude and longitude are not directly available on the page, but Google provides an API to convert addresses to geographic coordinates.

We registered for a Google Developer account and applied for the API:

<img src="./assets/image-20240821230742179.png" alt="image-20240821230742179" style="zoom:50%;" />

The API can be accessed using Python's `geopy` library. The method `geolocator.geocode()` provides a set of location information, including latitude and longitude, which we save.

Thus, we complete the data processing part, encapsulating the entire process into the `process()` function. After processing the data, it looks like this:

```bash
{
   "School Name":"Box Hill Senior Secondary College",
   "Sector":"Government",
   "Level":"Combined",
   "Gender":"Co-Ed",
   "Religion":"Secular",
   "Principal":"Mr Warren Dawson",
   "Address":"19 Dunloe Ave Mont Albert North Victoria 3129",
   "Tel":"(03) 9890 0571",
   "Scores of 40+":"1%",
   "Median Score":"26",
   "Satisfactory completions of VCE":"95%",
   "Satisfactory completions of VET":"59%",
   "Latitude":-37.8094011,
   "Longitude":145.1130093,
   "Postcode":"3129"
}
```

### 5. Export CSV

Finally, export the data in CSV format. For empty data fields, use `N/A`.

In `./school_info.csv`, I have crawled data for 96 schools in Victoria across 10 pages, including information like name, postcode, geolocation, sector, and academic results.

### 6. Difficulties and Challenges

1. Ensuring that the location data is unique and accurately recognized by Google Maps services is a major challenge.

   In my code, I added the AU identifier to the end of the address to indicate that it is in Australia and saved the original address data to quickly identify errors.

   Despite this, the method is somewhat unreliable.

2. There are many schools on GoodSchools that do not provide Academic Results or other information. These fields are currently filled with `N/A`. This data significantly contaminates the results. Therefore, careful data cleaning is essential if the data is to be used for training.
