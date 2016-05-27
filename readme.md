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

Run the tasks array of functions in parallel, without waiting until the previous function has completed.
If any of the functions pass an error to its callback, the main callback is immediately called with the value of the error.
Once the tasks have completed, the results are passed to the final callback as an array and hash.
Task function name is used to name the corresponding hash-table values.
Task function can either use callback to specify error and result value or return result value immediately.

Add to the scope:

```js
var parallel = require('cjs-async/parallel');
```

Tasks definition:

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
    },
    function () {
        return 32;
    }
], function ( error, results ) {
    if ( !error ) {
        // results contains array of the given tasks execution results
        // [true, 256, '512', 32]
        console.log(results);
    }
});
```

#### serial

Run the functions in the tasks array in series, each one running once the previous function has completed.
If any functions in the series pass an error to its callback, no more functions are run,
and callback is immediately called with the value of the error.
Otherwise, callback receives an array and hash of results when tasks have completed.
Task function name is used to name the corresponding hash-table values.
Task function can either use callback to specify error and result value or return result value immediately.

Add to the scope:

```js
var serial = require('cjs-async/serial');
```

Tasks definition:

```js
serial([
    function () {
        return 32;
    },
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
    if ( !error ) {
        // results contains array of the given tasks execution results
        // [32, true, 256, '512']
        console.log(results);
    }
});
```


## Contribution ##

If you have any problem or suggestion please open an issue [here](https://github.com/cjssdk/async/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs).


## License ##

`cjs-async` is released under the [MIT License](license.md).
