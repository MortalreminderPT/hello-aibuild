const http = require('node:http');
const fs = require('node:fs');

const hostname = 'localhost';
const port = 8080;

/**
 * Get the categories tree from file.
 */
function getCategoriesTree() {
  // Read categories from a JSON file.
  return readJsonFile('./categories.json')
    // process them into a tree structure.
    .then(categories => treeifyCategories(categories))
    .catch(error => {
      throw new Error(`Error processing categories: ${error}`);
    });
}

/**
 * Convert a categories array to a categories tree.
 */
function treeifyCategories(categories) {
  // Initialize the root of the tree.
  let tree = {
    categoryId: "root",
    name: "Root Category",
    parent: null,
    children: [],
  };
  // Create a map to hold category references for quick lookup.
  const categoryMap = { root: tree };
  // Insert these categories to treeMap first.
  categories.forEach(category => categoryMap[category.categoryId] = { ...category, children: [] });
  // Loop through each category to establish parent-child relationships.
  categories.forEach(category => {
    const parent = categoryMap[category.parent];
    if (parent) {
      // Add the current category as a child of its parent.
      parent.children.push(categoryMap[category.categoryId]);
    }
  });
  return tree;
}

/**
 * Read a JSON file and return its contents as a object.
 */
function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    jsonErr = {}
    fs.readFile(filePath, 'utf8', (err, data) => {
      // Handle file reading errors.
      if (err) {
        reject(`Error reading file: ${err}`);
        return;
      }
      try {
        // Parse the JSON data.
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseErr) {
        // Handle errors in parsing JSON.
        reject(`Error parsing JSON: ${parseErr}`);
      }
    });
  });
}

const server = http.createServer((req, res) => {
  // Handle the GET method of `/categories` routes
  if (req.url === '/categories' && req.method === 'GET') {
    const result = getCategoriesTree();
    result.then(data => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }).catch(error => {
      // If there is any error in the process of getting treecategories, handle and return with 500 error
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: error.message }));
    });
  } else {
    // Default response for other routes.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ hello: "world" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});