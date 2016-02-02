/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var tools = require('./lib/tools');

/**
 * Method to execute tasks.
 *
 * @callback taskCallback
 *
 * @param {asyncCallback} callback result handler
 */

/**
 * Method to handle asynchronous operations.
 *
 * @callback asyncCallback
 *
 * @param {*} error operation execution error
 * @param {*} [result] execution result when no errors
 */

/**
 *
 * @param {taskCallback[]|Object.<string, taskCallback>} tasks set of tasks to execute
 * @param {asyncCallback} [callback] optional callback to run once all the tasks have completed
 */
module.exports = function ( tasks, callback ) {
    var isError = false,
        counter = 0,
        i;

    function handler ( task, name ) {
        task(function ( error, result ) {
            if ( isError ) {
                return;
            }

            if ( error ) {
                isError = true;
                if ( typeof callback === 'function' ) {
                    callback(error);
                }
                return;
            }

            counter++;
            tasks.results[name] = result;

            if ( counter >= tasks.size && typeof callback === 'function' ) {
                callback(null, tasks.results);
            }
        });
    }

    // prepare
    tasks = tools.normalize(tasks);

    // no tasks were given
    if ( tasks.size === 0 ) {
        if ( typeof callback === 'function' ) {
            // empty result
            callback(null, tasks.results);
        }
    } else {
        // run all tasks
        for ( i = 0; i < tasks.size; i++ ) {
            handler(tasks.values[i], tasks.keys[i]);
        }
    }
};
