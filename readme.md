Asynchronous tools
==================

[![build status](https://img.shields.io/travis/cjssdk/async.svg?style=flat-square)](https://travis-ci.org/cjssdk/async)
[![npm version](https://img.shields.io/npm/v/cjs-async.svg?style=flat-square)](https://www.npmjs.com/package/cjs-async)
[![dependencies status](https://img.shields.io/david/cjssdk/async.svg?style=flat-square)](https://david-dm.org/cjssdk/async)
[![devDependencies status](https://img.shields.io/david/dev/cjssdk/async.svg?style=flat-square)](https://david-dm.org/cjssdk/async?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/cjssdk)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://npm.runkit.com/cjs-async)
[![API](https://img.shields.io/badge/API-docs-orange.svg?style=flat-square)](https://cjssdk.github.io/async/)


Set of methods to synchronize asynchronous operations.


## Installation ##

```bash
npm install cjs-async
```


## Usage ##

### parallel ###

Run the tasks array of functions in parallel, without waiting until the previous function has completed.
If any of the functions pass an error to its callback, the main callback is immediately called with the value of the error.
Once the tasks have completed, the results are passed to the final callback as an array and hash.
Task function name is used to name the corresponding hash-table values.
Task function can either use callback to specify error and result value or return result value immediately.

Online [example](https://runkit.com/darkpark/cjs-async-parallel):

```js
var parallel = require('cjs-async/parallel'),
    taskList = [
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
    ];

parallel(taskList, function ( error, results ) {
    if ( !error ) {
        // results contains array of the given tasks execution results
        // [true, 256, '512', 32]
        console.log(results);
    }
});
```

### serial ###

Run the functions in the tasks array in series, each one running once the previous function has completed.
If any functions in the series pass an error to its callback, no more functions are run,
and callback is immediately called with the value of the error.
Otherwise, callback receives an array and hash of results when tasks have completed.
Task function name is used to name the corresponding hash-table values.
Task function can either use callback to specify error and result value or return result value immediately.

Online [example](https://runkit.com/darkpark/cjs-async-serial):

```js
var serial   = require('cjs-async/serial'),
    taskList = [
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
    ];
    
serial(taskList, function ( error, results ) {
    if ( !error ) {
        // results contains array of the given tasks execution results
        // [32, true, 256, '512']
        console.log(results);
    }
});
```


## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/cjssdk/async/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`cjs-async` is released under the [MIT License](license.md).
