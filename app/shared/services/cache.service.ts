
// Import the core angular services.
import { Injectable } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Injectable({
	providedIn: "root"
})
export class CacheService {

	public keyPrefix: string;


	// I initialize the cache service.
	constructor() {

		this.keyPrefix = "incident-commander";

	}


	// ---
	// PUBLIC METHODS.
	// ---


	// I get the cached item stored at the given key, or null if it doesn't exist.
	public get( key: string ) : any {

		var value = localStorage.getItem( `${ this.keyPrefix }-${ key }` );

		if ( value === null ) {

			return( null );

		}

		return( JSON.parse( value ) );

	}


	// I store the given value at the given key using JSON.stringify().
	public set<T>( key: string, value: T ) : T {

		localStorage.setItem( `${ this.keyPrefix }-${ key }`, JSON.stringify( value ) );

		return( value );

	}

}
