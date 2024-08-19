## Question 1

### 1.1 Basic idea

I used package `node:https` to help me complete the implementation of the function. According to the [Node.js API](https://nodejs.org/api/https.html). I think it can be seen as a "built-in function".

### 1.2 Implementation

`checkConnection` function checks the connection condition and response time of a given URI. It uses `https.get` to send a request and measures how long it takes to start receiving data. The function categorizes the response time into 'good' (<500ms), 'fine' (<5000ms), or 'terrible' (≥5000ms or any error). Parameters include the `uri` (string) to check and a `callback` function that receives a result object `{condition: string, time: number}`. To use this function, provide the URI and a callback to handle the result, like so:

```
checkConnection("https://www.google.com", (result) => {
  console.log(`Condition: ${result.condition}, Time: ${result.time}ms`);
});
```

### 1.3 To be improved

However, there is a flaw in this solution, in the definition of [UriSchemes](https://www.w3.org/wiki/UriSchemes), the standard of uri includes more than 50 protocols including `HTTPS`, however, my method can only be used to check the URI based on `HTTPS` protocol. although we may be able to support different protocols by way of categorization judgment, it is hard to find a way to do it gracefully without using third libraries. difficult to find a way to do the checking gracefully without using third-party libraries.



## Question 2

### 1.1 Basic idea

Use `node:http` `server` to build the server, and write the test function using `node:http` `get` method which is similars to the Question 1.

As for converting the array to a tree structure. 

1. Firstly, we can loop the categories array and put them all into the tree map without having to care about the relationships between the parent and child trees. 
2. Then, a second loop is conducted to adjust the relationship of layers based on the parent of each category.
3. Finally, the time complexity is $O(n)$

### 1.2 My thoughts

Async operations are often encountered in network programming. While writing async code, the code is often cluttered and difficult to debug. Here I have learned and used an async handling method called `Promise` that allows for efficient error handling and also improves the readability of the code.

