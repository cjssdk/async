/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

/**
 * Serial tasks execution.
 *
 * @param {function[]} tasks set of tasks to execute
 * @param {function} [callback] optional callback to run once all the tasks have completed
 */
module.exports = function ( tasks, callback ) {
    var isError = false,
        counter = 0,
        results = [];

    function handler ( task ) {
        var done = function ( error, result ) {
            if ( error ) {
                // exit this task
                // and prevent other to callback
                isError = true;

                callback(error);

                return;
            }

            // fill results
            results[counter] = result;

            counter++;

            // all tasks are processed
            if ( counter >= tasks.length ) {
                callback(null, results);
            } else {
                handler(tasks[counter]);
            }
        };

        // error happened in some other task
        if ( isError ) {
            // callback was already used
            return;
        }

        // actual call condition
        if ( task.length === 0 ) {
            done(null, task());
        } else {
            task(done);
        }
    }

    // sanitize task list
    tasks = Array.isArray(tasks) ? tasks : [];

    // sanitize final handler
    if ( typeof callback !== 'function' ) {
        callback = function () { /* just in case */ };
    }

    // no tasks were given
    if ( tasks.length === 0 ) {
        // empty result
        callback(null, results);
    } else {
        // run the first task
        handler(tasks[0]);
    }
};
