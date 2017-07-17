ElasticSearch Client Retry wrapper
==================================

# Travis Build [![Build Status](https://travis-ci.org/VivintSolar/elasticsearch-client-retry.png?branch=master)](https://travis-ci.org/VivintSolar/elasticsearch-client-retry)


A small utility for handling ElasticSearch No living connections issues.
elasticsearch-client-retry does not have any dependencies

Installation
------------
```shell
  npm install elasticsearch-client-retry --save
```

Usage
-----
```javascript
let es = require('elasticsearch');
let config = {};
let retryCount = 10;
let esRetry = require('elasticsearch-client-retry');
let client = esRetry(es, config, retryCount);
```

Use client as [normal](https://github.com/elastic/elasticsearch-js#examples)


Tests
-----
```shell
  npm test
```

Contributing
------------
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

- David Tanner

Release History
---------------

* 0.1.0 Initial release