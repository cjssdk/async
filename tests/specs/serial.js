/**
 * Mocha tests.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint-env mocha */
/* eslint-disable no-useless-call */


var should = require('should'),
    serial = require('../../serial');


describe('serial', function () {

    before(function () {});

    after(function () {});

    it('should pass: bad arguments', function () {
        serial();
        serial([]);
        serial({});
        serial(null);
        serial(true);
        serial(false);
        serial('');
        serial(123);
        serial([], false);
        serial({}, false);
        serial(null, null);
        serial(true, true);
        serial('', '');
        serial(123, 123);
    });

    it('should pass: null tasks', function ( done ) {
        serial(null, function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.containDeep([]);
            hash.should.containDeep({});

            done();
        });
    });

    it('should pass: no tasks', function ( done ) {
        serial([], function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.containDeep([]);
            hash.should.containDeep({});

            done();
        });
    });

    it('should pass: 1 simple task', function ( done ) {
        serial([
            function ( callback ) {
                setTimeout(function () {
                    callback(null, 128);
                }, 10);
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.containDeep([128]);
            hash.should.containDeep({});

            done();
        });
    });

    it('should pass: 1 named task', function ( done ) {
        serial([
            function one ( callback ) {
                setTimeout(function () {
                    callback(null, 128);
                }, 10);
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.containDeep([128]);
            hash.should.containDeep({one: 128});

            done();
        });
    });

    it('should fail: 1 simple error task', function ( done ) {
        serial([
            function ( callback ) {
                setTimeout(function () {
                    callback({code: 123});
                }, 10);
            }
        ],
        function ( error, list, hash ) {
            should.exist(error);
            error.should.containDeep({code: 123});

            should.not.exist(list);
            should.not.exist(hash);

            done();
        });
    });

    it('should pass: 3 simple tasks', function ( done ) {
        var counter = 0;

        serial([
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    should(counter).equal(1);
                    callback(null, true);
                }, 10);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    should(counter).equal(2);
                    callback(null, 256);
                }, 20);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    should(counter).equal(3);
                    callback(null, '512');
                }, 0);
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.containDeep([true, 256, '512']);
            hash.should.containDeep({});

            done();
        });
    });

    it('should pass: 3 named tasks', function ( done ) {
        serial([
            function t1 ( callback ) {
                setTimeout(function () {
                    callback(null, true);
                }, 10);
            },
            function t2 ( callback ) {
                setTimeout(function () {
                    callback(null, 256);
                }, 20);
            },
            function t3 ( callback ) {
                setTimeout(function () {
                    callback(null, '512');
                }, 0);
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.containDeep([true, 256, '512']);
            hash.should.containDeep({t1: true, t2: 256, t3: '512'});

            done();
        });
    });

    it('should pass: 3 mixed tasks', function ( done ) {
        serial([
            function t1 ( callback ) {
                setTimeout(function () {
                    callback(null, true);
                }, 10);
            },
            function ( callback ) {
                setTimeout(function () {
                    callback(null, 256);
                }, 20);
            },
            function t3 ( callback ) {
                setTimeout(function () {
                    callback(null, '512');
                }, 0);
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.containDeep([true, 256, '512']);
            hash.should.containDeep({t1: true, t3: '512'});

            done();
        });
    });

    it('should fail: 3 simple tasks with first failed', function ( done ) {
        serial([
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
                    callback(true);
                }, 0);
            }
        ],
        function ( error, list, hash ) {
            should.exist(error);
            error.should.equal(true);

            should.not.exist(list);
            should.not.exist(hash);

            done();
        });
    });

    it('should pass: 3 simple tasks with last failed', function ( done ) {
        serial([
            function ( callback ) {
                setTimeout(function () {
                    callback(null, true);
                }, 10);
            },
            function ( callback ) {
                setTimeout(function () {
                    callback(123);
                }, 20);
            },
            function ( callback ) {
                setTimeout(function () {
                    callback(null, '512');
                }, 0);
            }
        ],
        function ( error, list, hash ) {
            should.exist(error);
            error.should.containDeep(123);

            should.not.exist(list);
            should.not.exist(hash);

            done();
        });
    });

    it('should pass: 3 simple tasks with all failed', function ( done ) {
        serial([
            function ( callback ) {
                callback(1);
            },
            function ( callback ) {
                callback(2);
            },
            function ( callback ) {
                callback(3);
            }
        ],
        function ( error, list, hash ) {
            should.exist(error);
            error.should.equal(1);

            should.not.exist(list);
            should.not.exist(hash);

            done();
        });
    });

});


///**
// * Mocha tests.
// *
// * @author Stanislav Kalashnik <darkpark.main@gmail.com>
// * @license GNU GENERAL PUBLIC LICENSE Version 3
// */
//
//'use strict';
//
///* eslint-env mocha */
///* eslint-disable no-useless-call */
//
//
//var should = require('should'),
//    serial = require('../../serial');
//
//
//describe('serial', function () {
//
//    before(function () {});
//
//    after(function () {});
//
//    it('should fail: bad arguments', function () {
//        serial();
//        serial([]);
//        serial({});
//        serial(null);
//        serial(true);
//        serial(false);
//        serial('');
//        serial(123);
//        serial([], false);
//        serial({}, false);
//        serial(null, null);
//        serial(true, true);
//        serial('', '');
//        serial(123, 123);
//    });
//
//    it('should pass: task array: 0 tasks', function ( done ) {
//        serial([], function ( error, results ) {
//            should.not.exist(error);
//
//            should.exist(results);
//            results.should.containDeep([]);
//
//            done();
//        });
//    });
//
//    it('should pass: task array: 1 task', function ( done ) {
//        serial([
//            function ( callback ) {
//                setTimeout(function () {
//                    callback(null, 128);
//                }, 10);
//            }
//        ],
//        function ( error, results ) {
//            should.not.exist(error);
//
//            should.exist(results);
//            results.should.containDeep([128]);
//
//            done();
//        });
//    });
//
//    it('should pass: task array: 3 tasks', function ( done ) {
//        serial([
//            function ( callback ) {
//                setTimeout(function () {
//                    callback(null, true);
//                }, 10);
//            },
//            function ( callback ) {
//                setTimeout(function () {
//                    callback(null, 256);
//                }, 20);
//            },
//            function ( callback ) {
//                setTimeout(function () {
//                    callback(null, '512');
//                }, 0);
//            }
//        ],
//        function ( error, results ) {
//            should.not.exist(error);
//
//            should.exist(results);
//            results.should.containDeep([true, 256, '512']);
//
//            done();
//        });
//    });
//
//    it('should pass: task object: 0 tasks', function ( done ) {
//        serial({}, function ( error, results ) {
//            should.not.exist(error);
//
//            should.exist(results);
//            results.should.containDeep({});
//
//            done();
//        });
//    });
//
//    it('should pass: task object: 1 task', function ( done ) {
//        serial({
//            one: function ( callback ) {
//                setTimeout(function () {
//                    callback(null, 128);
//                }, 10);
//            }
//        },
//        function ( error, results ) {
//            should.not.exist(error);
//
//            should.exist(results);
//            results.should.containDeep({one: 128});
//
//            done();
//        });
//    });
//
//    it('should pass: task object: 3 tasks', function ( done ) {
//        serial({
//            one: function ( callback ) {
//                setTimeout(function () {
//                    callback(null, true);
//                }, 10);
//            },
//            two: function ( callback ) {
//                setTimeout(function () {
//                    callback(null, 256);
//                }, 20);
//            },
//            three: function ( callback ) {
//                setTimeout(function () {
//                    callback(null, '512');
//                }, 0);
//            }
//        },
//        function ( error, results ) {
//            should.not.exist(error);
//
//            should.exist(results);
//            results.should.containDeep({one: true, two: 256, three: '512'});
//
//            done();
//        });
//    });
//
//});
