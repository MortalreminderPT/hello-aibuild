const http = require('node:http');

/**
 * Test function which get categories tree.
 */
function listCategories() {
  // Send a GET request the api
  const req = http.get('http://localhost:8080/categories', res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      // Parse the JSON data from the response
      const dataJson = JSON.parse(data);
      // Convert the JSON object to a pretty-printed string format
      const dataPretty = JSON.stringify(dataJson, null, 2);
      console.log(dataPretty);
    });
  });
  req.on('error', error => {
    console.error('Error fetching categories:', error);
  });
}

listCategories();