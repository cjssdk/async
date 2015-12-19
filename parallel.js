/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

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
	var isArray = Array.isArray(tasks),
		isError = false,
		results, keys, counter;

	function handler ( task, key ) {
		task(function ( error, result ) {
			if ( isError ) {
				return;
			}

			if ( error ) {
				isError = true;
				callback(error);
				return;
			}

			counter--;
			results[key] = result;

			if ( counter === 0 ) {
				callback(null, results);
			}
		});
	}

	if ( !tasks ) {
		return;
	}

	if ( isArray ) {
		results = [];
		counter = tasks.length;
		tasks.forEach(handler);
	} else {
		results = {};
		keys    = Object.keys(tasks);
		counter = keys.length;
		keys.forEach(function ( key ) {
			handler(tasks[key], key);
		});
	}
};
