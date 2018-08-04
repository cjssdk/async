/**
 * @module cjs-async
 * @license The MIT License (MIT)
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';


/**
 * Serial tasks execution.
 *
 * @type {module:cjs-async/serial}
 */
module.exports.serial = require('./serial');


/**
 * Parallel tasks execution.
 *
 * @type {module:cjs-async/parallel}
 */
module.exports.parallel = require('./parallel');
