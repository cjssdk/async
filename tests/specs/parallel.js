/**
 * Mocha tests.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint-env mocha */
/* eslint-disable no-useless-call */


var should   = require('should'),
    parallel = require('../../parallel');


describe('parallel', function () {

    before(function () {});

    after(function () {});

    it('should fail: bad arguments', function () {
        parallel();
        parallel([]);
        parallel({});
        parallel(null);
        parallel(true);
        parallel(false);
        parallel('');
        parallel(123);
        parallel([], false);
        parallel({}, false);
        parallel(null, null);
        parallel(true, true);
        parallel('', '');
        parallel(123, 123);
    });

    it('should pass: task array: 1 task', function ( done ) {
        parallel([
            function ( callback ) {
                setTimeout(function () {
                    callback(null, 128);
                }, 10);
            }
        ],
        function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.containDeep([128]);

            done();
        });
    });

    it('should pass: task array: 3 tasks', function ( done ) {
        parallel([
            function ( callback ) {
                setTimeout(function () {
                    callback(null, true);
                }, 10);
            },
            function ( callback ) {
                setTimeout(function () {
                    callback(null, 256);
                }, 20);
            },
            function ( callback ) {
                setTimeout(function () {
                    callback(null, '512');
                }, 0);
            }
        ],
        function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.containDeep([true, 256, '512']);

            done();
        });
    });

    it('should pass: task object: 1 task', function ( done ) {
        parallel({
            one: function ( callback ) {
                setTimeout(function () {
                    callback(null, 128);
                }, 10);
            }
        },
        function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.containDeep({one: 128});

            done();
        });
    });

    it('should pass: task object: 3 tasks', function ( done ) {
        parallel({
            one: function ( callback ) {
                setTimeout(function () {
                    callback(null, true);
                }, 10);
            },
            two: function ( callback ) {
                setTimeout(function () {
                    callback(null, 256);
                }, 20);
            },
            three: function ( callback ) {
                setTimeout(function () {
                    callback(null, '512');
                }, 0);
            }
        },
        function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.containDeep({one: true, two: 256, three: '512'});

            done();
        });
    });

});
