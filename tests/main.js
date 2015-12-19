/**
 * Mocha tests entry point.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Mocha  = require('mocha'),
	mocha  = new Mocha({
		reporter: 'spec',
		timeout: 1000,
		bail: true,
		fullTrace: true
	});


global.DEBUG = true;

// add specs
mocha.addFile('./tests/specs/parallel');

// exec
mocha.run(function ( failures ) {
	// return exit code
	process.exit(failures);
});
