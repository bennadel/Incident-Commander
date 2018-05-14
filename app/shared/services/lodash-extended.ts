
// Import the core angular services.
import find = require( "lodash/find" );
import last = require( "lodash/last" );
import random = require( "lodash/random" );
import range = require( "lodash/range" );
import without = require( "lodash/without" );

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// Package and export the individual lodash functions as a local / extended version of 
// lodash. This way, you don't have to have little function names floating around in
// your code. It also makes it quite clear which functions are actually being used (and
// will need to be echoed in your "vendor" module).
export var _ = {
	find,
	last,
	random,
	range,
	without
};
