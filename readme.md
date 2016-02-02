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

For test execution there are some additional dependencies:

```bash
sudo npm install -g mocha should
```


## Usage ##

#### parallel

Run the tasks array of functions in parallel, without waiting until the previous function has completed.
If any of the functions pass an error to its callback, the main callback is immediately called with the value of the error.
Once the tasks have completed, the results are passed to the final callback as an array and hash.
Task function name is used to name the corresponding hash-table values.

Add to the scope:

```js
var parallel = require('cjs-async/parallel');
```

Tasks definition:

```js
parallel([
    function taskA ( callback ) {
        setTimeout(function () {
            callback(null, true);
        }, 10);
    },
    function ( callback ) {
        setTimeout(function () {
            callback(null, 256);
        }, 20);
    },
    function taskB ( callback ) {
        setTimeout(function () {
            callback(null, '512');
        }, 0);
    }
], function ( error, list, hash ) {
    if ( !error ) {
        // list contains array of the given tasks execution results
        // [true, 256, '512']
        // hash contains named tasks execution results
        // {taskA: true, taskB: '512'}
    }
});
```

#### serial

Run the functions in the tasks array in series, each one running once the previous function has completed.
If any functions in the series pass an error to its callback, no more functions are run,
and callback is immediately called with the value of the error.
Otherwise, callback receives an array and hash of results when tasks have completed.
Task function name is used to name the corresponding hash-table values.

Add to the scope:

```js
var serial = require('cjs-async/serial');
```

Tasks definition:

```js
serial([
    function taskA ( callback ) {
        setTimeout(function () {
            callback(null, true);
        }, 10);
    },
    function ( callback ) {
        setTimeout(function () {
            callback(null, 256);
        }, 20);
    },
    function taskB ( callback ) {
        setTimeout(function () {
            callback(null, '512');
        }, 0);
    }
], function ( error, list, hash ) {
    if ( !error ) {
        // list contains array of the given tasks execution results
        // [true, 256, '512']
        // hash contains named tasks execution results
        // {taskA: true, taskB: '512'}
    }
});
```


## Contribution ##

If you have any problem or suggestion please open an issue [here](https://github.com/cjssdk/async/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs).


## License ##

`cjs-async` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
