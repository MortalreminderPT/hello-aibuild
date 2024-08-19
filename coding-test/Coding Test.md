## Question 1

### 1.1 Implementation

`checkConnection` function checks the connection condition and response time of a given URI. It uses `https.get` to send a request and measures how long it takes to start receiving data. The function categorizes the response time into 'good' (<500ms), 'fine' (<5000ms), or 'terrible' (≥5000ms or any error). Parameters include the `uri` (string) to check and a `callback` function that receives a result object `{condition: string, time: number}`. To use this function, provide the URI and a callback to handle the result, like so:

```
checkConnection("https://www.google.com", (result) => {
  console.log(`Condition: ${result.condition}, Time: ${result.time}ms`);
});
```

### 1.2 My Thoughts

There is a flaw in this solution, in the definition of [UriSchemes](https://www.w3.org/wiki/UriSchemes), the standard of uri includes more than 50 protocols including `HTTPS`, however, my method can only be used to check the URI based on `HTTPS` protocol. although we may be able to support different protocols by way of categorization judgment, it is hard to find a way to do it gracefully without using third libraries. difficult to find a way to do the checking gracefully without using third-party libraries.
