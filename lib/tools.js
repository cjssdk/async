/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

module.exports.normalize = function ( tasks ) {
    var isArray = Array.isArray(tasks),
        results = [],
        keys    = [],
        values  = [],
        size    = 0,
        name, index;

    if ( tasks ) {
        if ( isArray ) {
            results = [];
            index = size = tasks.length;
            values = tasks;
            while ( index-- ) {
                keys[index] = index;
            }
        } else {
            results = {};
            for ( name in tasks ) {
                keys.push(name);
                values.push(tasks[name]);
            }
            size = keys.length;
        }
    }

    return {
        size:    size,
        keys:    keys,
        values:  values,
        results: results
    };
};
