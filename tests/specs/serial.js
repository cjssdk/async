/**
 * @license The MIT License (MIT)
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

/* eslint-env mocha */
/* eslint-disable no-useless-call */
/* eslint-disable no-unused-vars */
/* eslint-disable max-lines-per-function */


var should = require('should'),
    serial = require('../../serial');


describe('serial', function () {

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
        serial(null, function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.eql([]);

            done();
        });
    });


    it('should pass: no tasks', function ( done ) {
        serial([], function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.eql([]);

            done();
        });
    });


    it('should pass: wrong tasks', function ( done ) {
        serial(true, function ( error, results ) {
            should.not.exist(error);

            should.exist(results);
            results.should.eql([]);

            done();
        });
    });


    it('should pass: no handler', function ( done ) {
        var counter = 0;

        serial([
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
                }, 10);
            }
        ]);

        setTimeout(function () {
            counter.should.equal(2);

            done();
        }, 30);
    });


    it('should pass: 1 simple task', function ( done ) {
        serial(
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
        serial(
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
        serial(
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

        serial(
            [
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

        serial(
            [
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
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                counter.should.equal(3);
                results.should.eql([undefined, 256, 128]);

                done();
            }
        );

        setTimeout(function () {
            counter.should.equal(1);
        }, 5);
    });


    it('should pass: 3 named tasks', function ( done ) {
        serial(
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
        serial(
            [
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
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                results.should.eql([true, null, 32]);

                done();
            }
        );
    });


    it('should pass: 3 mixed tasks', function ( done ) {
        serial(
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
        serial(
            [
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
            function ( error, results ) {
                should.not.exist(error);

                should.exist(results);
                results.should.eql([true, 256, '512']);

                done();
            }
        );
    });


    it('should fail: 3 simple tasks with first failed', function ( done ) {
        var counter = 0;

        serial(
            [
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
            function ( error, results ) {
                should.exist(error);
                error.should.equal(true);

                should.not.exist(results);
                counter.should.equal(1);

                done();
            }
        );
    });


    it('should pass: 3 simple tasks with last failed', function ( done ) {
        var counter = 0;

        serial(
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
            function ( error, results ) {
                should.exist(error);
                error.should.equal(123);

                should.not.exist(results);
                counter.should.equal(3);

                done();
            }
        );
    });


    it('should pass: 3 simple tasks with all failed', function ( done ) {
        var counter = 0;

        serial(
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

                done();
            }
        );
    });

});
