Asynchronous tools
==================

[![Build Status](https://img.shields.io/travis/cjssdk/async.svg?style=flat-square)](https://travis-ci.org/cjssdk/async)
[![NPM version](https://img.shields.io/npm/v/cjs-async.svg?style=flat-square)](https://www.npmjs.com/package/cjs-async)
[![Dependencies Status](https://img.shields.io/david/cjssdk/async.svg?style=flat-square)](https://david-dm.org/cjssdk/async)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/cjssdk)


Set of methods to synchronize asynchronous operations.


## Installation ##

```bash
npm install cjs-async
```


## Usage ##

#### parallel

Add to the scope:

```js
var parallel = require('cjs-async/parallel');
```

Array of tasks:

```js
parallel([
    function ( callback ) {
        setTimeout(function () {
            callback(null, true);
        }, 10);
    },
    function ( callback ) {
        setTimeout(function () {
            callback(null, 256);
        }, 20);
    },
    function ( callback ) {
        setTimeout(function () {
            callback(null, '512');
        }, 0);
    }
], function ( error, results ) {
    // results contains array of the given tasks execution results
    // [true, 256, '512']
});
```

Named set of tasks:

```js
parallel({
    one: funcA,
    two: funcB,
    three:funcC
}, function ( error, results ) {
    // results contains hash table of the given tasks execution results
});
```


## Contribution ##

If you have any problem or suggestion please open an issue [here](https://github.com/cjssdk/async/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs).


## License ##

`cjs-async` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
