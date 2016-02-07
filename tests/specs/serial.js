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
            list.should.eql([]);
            hash.should.containDeep({});

            done();
        });
    });

    it('should pass: no tasks', function ( done ) {
        serial([], function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.eql([]);
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
            list.should.eql([128]);
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
            list.should.eql([128]);
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
                    counter.should.equal(1);
                    callback(null, true);
                }, 10);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    counter.should.equal(2);
                    callback(null, 256);
                }, 20);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    counter.should.equal(3);
                    callback(null, '512');
                }, 0);
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.eql([true, 256, '512']);
            hash.should.containDeep({});

            done();
        });
    });

    it('should pass: 3 simple tasks with and without callbacks', function ( done ) {
        var counter = 0;

        serial([
            function () {
                counter++;
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    counter.should.equal(2);
                    callback(null, 256);
                }, 20);
            },
            function () {
                counter++;
                return 128;
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            counter.should.equal(3);
            list.should.eql([undefined, 256, 128]);
            hash.should.containDeep({});

            done();
        });

        setTimeout(function () {
            counter.should.equal(1);
        }, 5);
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
            list.should.eql([true, 256, '512']);
            hash.should.containDeep({t1: true, t2: 256, t3: '512'});

            done();
        });
    });

    it('should pass: 3 named tasks with and without callbacks', function ( done ) {
        serial([
            function t1 ( callback ) {
                setTimeout(function () {
                    callback(null, true);
                }, 10);
            },
            function t2 () {
                return null;
            },
            function t3 () {
                return 32;
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.eql([true, null, 32]);
            hash.should.containDeep({t1: true, t2: null, t3: 32});

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
            list.should.eql([true, 256, '512']);
            hash.should.containDeep({t1: true, t3: '512'});

            done();
        });
    });

    it('should pass: 3 mixed tasks with and without callbacks', function ( done ) {
        serial([
            function () {
                return true;
            },
            function ( callback ) {
                setTimeout(function () {
                    callback(null, 256);
                }, 20);
            },
            function t3 () {
                return '512';
            }
        ],
        function ( error, list, hash ) {
            should.not.exist(error);

            should.exist(list);
            should.exist(hash);
            list.should.eql([true, 256, '512']);
            hash.should.containDeep({t3: '512'});

            done();
        });
    });

    it('should fail: 3 simple tasks with first failed', function ( done ) {
        var counter = 0;

        serial([
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    callback(true);
                }, 0);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    callback(null, true);
                }, 10);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    callback(null, 256);
                }, 20);
            }
        ],
        function ( error, list, hash ) {
            should.exist(error);
            error.should.equal(true);

            should.not.exist(list);
            should.not.exist(hash);
            counter.should.equal(1);

            done();
        });
    });

    it('should pass: 3 simple tasks with last failed', function ( done ) {
        var counter = 0;

        serial([
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    callback(null, true);
                }, 10);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    callback(null, '512');
                }, 0);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    callback(123);
                }, 20);
            }
        ],
        function ( error, list, hash ) {
            should.exist(error);
            error.should.equal(123);

            should.not.exist(list);
            should.not.exist(hash);
            counter.should.equal(3);

            done();
        });
    });

    it('should pass: 3 simple tasks with all failed', function ( done ) {
        var counter = 0;

        serial([
            function ( callback ) {
                counter++;
                callback(1);
            },
            function ( callback ) {
                counter++;
                callback(2);
            },
            function ( callback ) {
                counter++;
                callback(3);
            }
        ],
        function ( error, list, hash ) {
            should.exist(error);
            error.should.equal(1);

            should.not.exist(list);
            should.not.exist(hash);
            counter.should.equal(1);

            done();
        });
    });

});
