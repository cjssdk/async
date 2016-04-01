/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/**
 * Parallel tasks execution.
 *
 * @param {function[]} tasks set of tasks to execute
 * @param {function} [callback] optional callback to run once all the tasks have completed
 */
module.exports = function ( tasks, callback ) {
    var isError = false,
        counter = 0,
        outList = [],
        outHash = {};

    function handler ( task, index ) {
        var done = function ( error, result ) {
            if ( error ) {
                // exit this task
                // and prevent other to callback
                isError = true;

                if ( typeof callback === 'function' ) {
                    callback(error);
                }

                return;
            }

            // fill results
            outList[index] = result;
            if ( task.name ) {
                outHash[task.name] = result;
            }

            counter++;

            // all tasks are processed
            if ( counter === tasks.length && typeof callback === 'function' ) {
                callback(null, outList, outHash);
            } else if ( counter > tasks.length ) {
                throw Error('done callback invoked more than one time in function with ' + index + ' position in tasks array');
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

    // sanitize
    tasks = Array.isArray(tasks) ? tasks : [];

    // no tasks were given
    if ( tasks.length === 0 ) {
        if ( typeof callback === 'function' ) {
            // empty result
            callback(null, outList, outHash);
        }
    } else {
        // run all tasks
        tasks.forEach(handler);
    }
};
