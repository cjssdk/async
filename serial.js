/**
 * @module cjs-async/serial
 * @license The MIT License (MIT)
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

/**
 * Method to be called to set task as completed.
 *
 * @callback onTaskFinishCallback
 *
 * @param {boolean} error status of the task execution
 * @param {Array} result data to return from the task
 */

/**
 * Task method to be executed.
 *
 * @callback taskHandler
 *
 * @param {module:cjs-async/serial~onTaskFinishCallback} [callback] method to be called to set task as completed
 *
 * @example
 * function ( callback ) {
 *     callback(null, true);
 * }
 */

/**
 * Method to be called on all given tasks completion.
 *
 * @callback onFinishCallback
 *
 * @param {boolean} error status of all tasks execution
 * @param {Array} result data received from all tasks
 */

/**
 * Serial tasks execution.
 *
 * @param {module:cjs-async/serial~taskHandler[]} tasks set of tasks to execute
 * @param {module:cjs-async/serial~onFinishCallback} [callback] optional callback to run once all the tasks have completed
 *
 * @example
 * serial(taskList, function ( error, results ) {
 *     console.log(error, results);
 * });
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
