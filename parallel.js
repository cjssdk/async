/**
 * @module cjs-async/parallel
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
 * @param {module:cjs-async/parallel~onTaskFinishCallback} [callback] method to be called to set task as completed
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
 * Parallel tasks execution.
 *
 * @param {module:cjs-async/parallel~taskHandler[]} tasks set of tasks to execute
 * @param {module:cjs-async/parallel~onFinishCallback} [callback] optional callback to run once all the tasks have completed
 *
 * @example
 * parallel(taskList, function ( error, results ) {
 *     console.log(error, results);
 * });
 */
module.exports = function ( tasks, callback ) {
    var isError = false,
        counter = 0,
        results = [];

    function handler ( task, index ) {
        var done = function ( error, result ) {
            // error happened in some other task
            if ( isError ) {
                // callback was already used
                return;
            }

            if ( error ) {
                // exit this task
                // and prevent other to callback
                isError = true;

                callback(error);

                return;
            }

            // fill results
            results[index] = result;

            counter++;

            // all tasks are processed
            if ( counter === tasks.length ) {
                callback(null, results);
            } else if ( counter > tasks.length ) {
                throw Error('done callback invoked more than one time in function with ' + index + ' position in tasks array');
            }
        };

        // actual call condition
        if ( task.length === 0 ) {
            done(null, task());
        } else {
            task(done);
        }
    }

    // sanitize
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
        // run all tasks
        tasks.forEach(handler);
    }
};
