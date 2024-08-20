## Question 1

### 1.1 How to test

In the current directory, which is `coding-test`, start the server using the following command:
```bash
node checkConnection.js
```

You will see the results of the `checkConnection()` function testing some URIs. The test function is `testCheckConnection()`, and you can modify it to test other URIs.

### 1.2 My thoughts

#### Implementation

I used package `node:https` to help me complete the implementation of the function. According to the [Node.js API](https://nodejs.org/api/https.html). I think it can be seen as a "built-in function".

`checkConnection` function checks the connection condition and response time of a given URI. It uses `https.get` to send a request and measures how long it takes to start receiving data. The function categorizes the response time into 'good' (<500ms), 'fine' (<5000ms), or 'terrible' (≥5000ms or any error). Parameters include the `uri` (string) to check and a `callback` function that receives a result object `{condition: string, time: number}`. To use this function, provide the URI and a callback to handle the result, like so:

```
checkConnection("https://www.google.com", (result) => {
  console.log(`Condition: ${result.condition}, Time: ${result.time}ms`);
});
```

#### To be improved

However, there is a flaw in this solution, in the definition of [UriSchemes](https://www.w3.org/wiki/UriSchemes), the standard of uri includes more than 50 protocols including `HTTPS`, however, my method can only be used to check the URI based on `HTTPS` protocol. although we may be able to support different protocols by way of categorization judgment, it is hard to find a way to do it gracefully without using third libraries. difficult to find a way to do the checking gracefully without using third-party libraries.

## Question 2

### 2.1 How to Test
1. In the current directory, which is `coding-test`, start the server using the following command:
   ```bash
   node eCommerceServer.js
   ```
2. In the current directory, which is `coding-test`, start the test client using the following command:
   ```bash
   node fetchCategories.js
   ```
   Then, you will see the fetched json like:
   ```json
    {
      "categoryId": "root",
      "name": "Root Category",
      "parent": null,
      "children": [
        ...
      ]
    }
   ```

### 2.2 My thoughts

Use `node:http` `server` to build the server, and write the test function using `node:http` `get` method which is similars to the Question 1.

As for converting the array to a tree structure. 

1. Firstly, we can loop the categories array and put them all into the tree map without having to care about the relationships between the parent and child trees. 
2. Then, a second loop is conducted to adjust the relationship of layers based on the parent of each category.
3. Finally, the time complexity is $O(n)$

Async operations are often encountered in network programming. While writing async code, the code is often cluttered and difficult to debug. Here I have learned and used an async handling method called `Promise` that allows for efficient error handling and also improves the readability of the code.

## Question 3

### 3.1 How to Test
1. In the current directory, which is `coding-test`, start the server using the following command:
   ```bash
   node eCommerceServer.js
   ```
2. Navigate to the `./tree-select-app` directory and start the React client.
   ```bash
   npm start --prefix ./tree-select-app
   ```
3. Click the `Fetch with Sage` or `Fetch with Hook` buttons to test the functions.

### 3.2 My thoughts

#### Saga vs. Hook

I added a loading bar for data fetching processes. However, during testing, I noticed that the loading bar does not appear when using `Fetch with Saga`, but it does when using `Fetch with Hook`. I looked up some information and learned that:

1. The asynchronous operation in `fetchCategoriesSaga` is implemented using `yield` and `call`, and it executes synchronously within the context of the generator function. When `fetchCategoriesSaga` is executed, `yield call` pauses the execution of the generator function, waits for the fetch request to complete, and then continues. To the saga internally, the asynchronous operation appears to be completed synchronously, allowing the data to be displayed quickly.

2. `fetchCategoriesHook` is based on `createAsyncThunk` and involves an asynchronous operation returning a Promise. When `fetchCategoriesHook` is called, it immediately returns a Promise, and the React component does not wait for this Promise to complete but continues rendering. Thus, when fetching data using `Fetch with Hook`, the loading bar appears briefly before the data loads.

#### Cross-Origin Issue

When calling the `http://localhost:8080/categories` API from React, a cross-origin issue appears, which can be addressed by setting `res.setHeader()` in `eCommerceServer.js` to allow cross-origin access.