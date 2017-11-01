/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

/* eslint-env mocha */
/* eslint-disable no-useless-call */
/* eslint-disable no-unused-vars */


var should   = require('should'),
    parallel = require('../../parallel');


describe('parallel', function () {

    it('should pass: bad arguments', function () {
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


    it('should pass: null tasks', function ( done ) {
        parallel(null, function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.eql([]);

            done();
        });
    });


    it('should pass: no tasks', function ( done ) {
        parallel([], function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.eql([]);

            done();
        });
    });


    it('should pass: wrong tasks', function ( done ) {
        parallel(true, function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.eql([]);

            done();
        });
    });


    it('should pass: no handler', function ( done ) {
        var counter = 0;

        parallel([
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    callback(null, 64);
                }, 10);
            },
            function ( callback ) {
                setTimeout(function () {
                    counter++;
                    callback(null, 128);
                }, 20);
            }
        ]);

        setTimeout(function () {
            counter.should.equal(2);

            done();
        }, 30);
    });


    it('should pass: 1 simple task', function ( done ) {
        parallel(
            [
                function ( callback ) {
                    setTimeout(function () {
                        callback(null, 128);
                    }, 10);
                }
            ],
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                results.should.eql([128]);

                done();
            }
        );
    });


    it('should pass: 1 named task', function ( done ) {
        parallel(
            [
                function one ( callback ) {
                    setTimeout(function () {
                        callback(null, 128);
                    }, 10);
                }
            ],
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                results.should.eql([128]);

                done();
            }
        );
    });


    it('should fail: 1 simple error task', function ( done ) {
        parallel(
            [
                function ( callback ) {
                    setTimeout(function () {
                        callback({code: 123});
                    }, 10);
                }
            ],
            function ( error, results ) {
                should.exist(error);
                error.should.containDeep({code: 123});

                should.not.exist(results);

                done();
            }
        );
    });


    it('should pass: 3 simple tasks', function ( done ) {
        var counter = 0;

        parallel(
            [
                function ( callback ) {
                    setTimeout(function () {
                        counter++;
                        counter.should.equal(2);
                        callback(null, true);
                    }, 10);
                },
                function ( callback ) {
                    setTimeout(function () {
                        counter++;
                        counter.should.equal(3);
                        callback(null, 256);
                    }, 20);
                },
                function ( callback ) {
                    setTimeout(function () {
                        counter++;
                        counter.should.equal(1);
                        callback(null, '512');
                    }, 0);
                }
            ],
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                results.should.eql([true, 256, '512']);

                done();
            }
        );
    });


    it('should pass: 3 simple tasks with and without callbacks', function ( done ) {
        var counter = 0;

        parallel(
            [
                function () {
                    counter++;
                },
                function ( callback ) {
                    setTimeout(function () {
                        counter++;
                        callback(null, 256);
                    }, 20);
                },
                function () {
                    counter++;

                    return 128;
                }
            ],
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                counter.should.equal(3);
                results.should.eql([undefined, 256, 128]);

                done();
            }
        );

        setTimeout(function () {
            counter.should.equal(2);
        }, 5);
    });


    it('should pass: 3 named tasks', function ( done ) {
        parallel(
            [
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
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                results.should.eql([true, 256, '512']);

                done();
            }
        );
    });


    it('should pass: 3 named tasks with and without callbacks', function ( done ) {
        parallel(
            [
                function t1 () {
                    return 32;
                },
                function t2 () {
                    return true;
                },
                function t3 ( callback ) {
                    setTimeout(function () {
                        callback(null, '512');
                    }, 0);
                }
            ],
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                results.should.eql([32, true, '512']);

                done();
            }
        );
    });


    it('should pass: 3 mixed tasks', function ( done ) {
        parallel(
            [
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
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                results.should.eql([true, 256, '512']);

                done();
            }
        );
    });


    it('should pass: 3 mixed tasks with and without callbacks', function ( done ) {
        parallel(
            [
                function () {
                    return 32;
                },
                function t2 () {
                    return true;
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
                results.should.eql([32, true, '512']);

                done();
            }
        );
    });


    it('should fail: 3 simple tasks with first failed', function ( done ) {
        var counter = 0;

        parallel(
            [
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
                },
                function ( callback ) {
                    setTimeout(function () {
                        counter++;
                        callback(true);
                    }, 0);
                }
            ],
            function ( error, results ) {
                should.exist(error);
                error.should.equal(true);

                should.not.exist(results);
                counter.should.equal(1);
            }
        );

        setTimeout(function () {
            counter.should.equal(3);
            done();
        }, 25);
    });


    it('should pass: 3 simple tasks with last failed', function ( done ) {
        parallel(
            [
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
            function ( error, results ) {
                should.exist(error);
                error.should.containDeep(123);

                should.not.exist(results);

                done();
            }
        );
    });


    it('should pass: 3 simple tasks with all failed', function ( done ) {
        var counter = 0;

        parallel(
            [
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
            function ( error, results ) {
                should.exist(error);
                error.should.equal(1);

                should.not.exist(results);
                counter.should.equal(1);
            }
        );

        setTimeout(function () {
            counter.should.equal(1);
            done();
        }, 5);
    });

});
