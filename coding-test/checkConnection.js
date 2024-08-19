const https = require('node:https');

function checkConnection(uri, callback) {
  // Response less than 500ms is good
  const RESPONSE_TIME_GOOD = 500;
  // Response less than 5000ms is fine
  const RESPONSE_TIME_FINE = 5000;
  const startTime = Date.now();
  // Store the result of the connection check
  let result = {};
  const req = https.get(uri, (res) => {
    // When a packet starts to be received, record the time and destory the response flow.
    res.on('data', (_) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      res.destroy();
      // Evaluate the response time against predefined thresholds
      if (duration < RESPONSE_TIME_GOOD) {
        result.condition = 'good';
      } else if (duration < RESPONSE_TIME_FINE) {
        result.condition = 'fine';
      } else {
        result.condition = 'terrible';
      }
      result.time = duration;
      // Execute the callback function with the result
      callback(result);
    });
  });
  // Our timeout is `RESPONSE_TIME_FINE`, the time in result dict will be assign to it.
  // The request will be destroyed, which will automatically trigger the `error`
  req.setTimeout(RESPONSE_TIME_FINE, () => {
    result.time = RESPONSE_TIME_FINE;
    req.destroy();
  });
  req.on('error', (_) => {
    // there is no time in the result dict so caller can distinguish if the terrible is a timeout or an error.
    result.condition = 'terrible';
    callback(result);
  });
}

function testCheckConnection() {
  // Testing different sources of uri
  const uris = [
    'https://www.google.com/',
    'https://www.example.com/',
    'https://api.github.com/',
    'https://www.google.com/search?q=hello+world',
    'https://localhost:8080',
    'https://nodejs.org/static/logos/nodejsDark.svg',
    'https://www.youtube.com/watch?v=Uc5tW3gpzac',
  ];
  for (let i = 0; i < 10; i++) {
    uris.forEach((uri) =>
      // checkConnection(uri, (result) => {
      //   console.log(uri, result);
      // }));
      checkConnection(uri, (result) => {
        console.log(`Uri: ${uri}, Condition: ${result.condition}, Time: ${result.time}ms`);
      }));
  }
}

testCheckConnection();