/**
 * @module @cjssdk/async
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';


/**
 * Serial tasks execution.
 *
 * @type {module:@cjssdk/async/serial}
 */
module.exports.serial = require('./serial');


/**
 * Parallel tasks execution.
 *
 * @type {module:@cjssdk/async/parallel}
 */
module.exports.parallel = require('./parallel');
