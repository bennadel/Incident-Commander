
// Import the core angular services.
import firebase = require( "firebase/app" );
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

// Import these libraries for their side-effects.
import "firebase/database";

export interface UpdateDTO {
	id: number;
	statusID: string;
	createdAt: number;
	description: string;
}

export interface IncidentDTO {
	id: string | null;
	name: string;
	version: string; // general | invision.
	description: string;
	customerType: string;
	customerCount: string;
	internalTeam: string;
	zendeskTicket: string;
	priorityID: string;
	statusID: string;
	startedAt: number;
	timezoneID: string;
	videoLink: string;
	updates?: UpdateDTO[]; // Optional because Firebase doesn't return empty Arrays.
}

export class IncidentGateway {

	private firebaseApp: firebase.app.App;
	private firebaseDB: firebase.database.Database;


	// I initialize the incident gateway.
	constructor() {

		this.firebaseApp = firebase.initializeApp({
			apiKey: "AIzaSyAS8JEXbdmEQyn_IRHCOiJwr3ewhmo3Y7s",
			authDomain: "incident-commander.firebaseapp.com",
			databaseURL: "https://incident-commander.firebaseio.com",
			projectId: "incident-commander",
			storageBucket: "incident-commander.appspot.com",
			messagingSenderId: "1043941703596"
		});
		this.firebaseDB = this.firebaseApp.database();

	}


	// ---
	// PUBLIC METHODS.
	// ---


	// I persist the given incident data transfer object. Returns a Promise with ID of
	// newly persisted incident when the action is completed locally.
	public createIncident( dto: IncidentDTO ) : Promise<string> {

		var ref = this.firebaseDB.ref( "/incidents/" + this.getNewID() );

		// Let's merge the key from the ref back into the incident as the ID in order to
		// make the incident easier to consume in future contexts.
		var identifiedDTO = Object.assign(
			{},
			dto,
			{
				id: ref.key
			}
		);

		// NOTE: This will write locally and attempt to save the data to the remote 
		// Firebase server. It returns a Promise that will resolve when the data is 
		// persisted remotely. For now, we're only going to care about the local 
		// operation (hence returning a promise with the key).
		ref
			.set( identifiedDTO )
			.catch(
				( error: any ) : void => {

					console.log( "Create Incident Failed" );
					console.error( error );
					console.log( "Transfer Object:" );
					console.dir( identifiedDTO );

				}
			)
		;

		return( Promise.resolve( ref.key ) );

	}


	// I delete the incident with the given ID. Returns a promise when the action is 
	// completed locally.
	public deleteIncident( id: string ) : Promise<void> {

		// NOTE: This will delete locally and attempt to remove the data to the remote
		// Firebase server. It returns a Promise that will resolve when the data is 
		// deleted remotely. For now, we're only going to care about the local operation.
		this.firebaseDB.ref( "/incidents/" + id )
			.remove()
			.catch(
				( error: any ) : void => {

					console.log( "Delete Incident Failed" );
					console.error( error );
					console.log( "ID:", id );

				}
			)
		;

		return( Promise.resolve() );

	}


	// I read the incident with the given ID. Returns a promise when the data is either
	// read locally, or pulled from the remote server (whichever is first).
	public readIncident( id: string ) : Promise<IncidentDTO> {

		var promise = this.firebaseDB
			.ref( "/incidents/" + id )
			.once( "value" )
			.then(
				( snapshot: firebase.database.DataSnapshot ) : IncidentDTO => {

					if ( ! snapshot.exists() ) {

						throw( new Error( "IC.NotFound" ) );

					}

					var dto = snapshot.val();

					// Firebase doesn't really handle Arrays in a "normal" way (since it
					// favors Objects for collections). As such, let's ensure that the 
					// Updates collection exists before we return it.
					dto.updates = ( dto.updates || [] );

					// These fields were added after data was being persisted. As such, 
					// they may not exist on all the given data transfer objects.
					dto.version = ( dto.version || "general" );
					dto.timezoneID = ( dto.timezoneID || "" );
					dto.customerType = ( dto.customerType || "" );
					dto.customerCount = ( dto.customerCount || "" );
					dto.internalTeam = ( dto.internalTeam || "" );
					dto.zendeskTicket = ( dto.zendeskTicket || "" );

					return( dto );

				}
			)
		;

		// NOTE: We have to cast to the correct type of Promise otherwise we get a 
		// mismatch due to the use of Promise<any> in the Firebase type definitions.
		return( <Promise<IncidentDTO>>promise );

	}


	// I return the incident, with the given ID, as an observable stream. This allows 
	// updates to the remote incident to be observed in real-time.
	public readIncidentAsStream( id: string ) : Observable<IncidentDTO> {

		var stream = new Observable<IncidentDTO>(
			( observer: Observer<IncidentDTO> ) : Function => {
				
				var ref = this.firebaseDB.ref( "/incidents/" + id );

				// Bind to the value events on the incident. This will fire every time
				// anything in the given ref tree is changed.
				var eventHandler = ref.on(
					"value",
					( snapshot: firebase.database.DataSnapshot ) : void => {

						if ( ! snapshot.exists() ) {

							observer.error( new Error( "IC.NotFound" ) )
							return;

						}

						var dto = snapshot.val();

						// Firebase doesn't really handle Arrays in a "normal" way (since
						// it favors Objects for collections). As such, let's ensure that 
						// the Updates collection exists before we return it.
						dto.updates = ( dto.updates || [] );

						// These fields were added after data was being persisted. As such,
						// they may not exist on all the given data transfer objects.
						dto.version = ( dto.version || "general" );
						dto.timezoneID = ( dto.timezoneID || "" );
						dto.customerType = ( dto.customerType || "" );
						dto.customerCount = ( dto.customerCount || "" );
						dto.internalTeam = ( dto.internalTeam || "" );
						dto.zendeskTicket = ( dto.zendeskTicket || "" );

						observer.next( dto );

					}
				);

				// Provide tear down logic so we can stop listening to the ref when the
				// calling context unsubscribes from the returned stream.
				function teardown() : void {

					ref.off( "value", eventHandler );
					ref = eventHandler = null;

				}

				return( teardown );

			}
		);

		return( stream );

	}


	// I update the already-persisted incident. Returns a promise when the action is 
	// completed locally.
	public updateIncident( dto: IncidentDTO ) : Promise<void> {

		var ref = this.firebaseDB.ref( "/incidents/" + dto.id );

		// NOTE: This will write locally and attempt to save the data to the remote 
		// Firebase server. It returns a Promise that will resolve when the data is 
		// persisted remotely. For now, we're only going to care about the local 
		// operation.
		ref
			.set( dto )
			.catch(
				( error: any ) : void => {

					console.log( "Update Incident Failed" );
					console.error( error );
					console.log( "Transfer Object:" );
					console.dir( dto );

				}
			)
		;

		return( Promise.resolve() );

	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I generate an ID / key for a new incident reference.
	private getNewID() : string {

		// On their own, Firebase keys are not cryptographically secure; but, they are
		// designed to be very hard to guess (read more: https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html).
		// That said, I'm prefixing them with a random string value. This is also not a
		// cryptographically secure algorithm. But, together, there should be a 
		// significant amount of size and randomness to make them sufficiently hard to
		// guess or iterate.
		var ref = this.firebaseDB.ref( "/incidents/" ).push();

		// Generate random suffix data.
		var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz-0123456789-";
		var randomChars = [];

		for ( var i = 0 ; i < 30 ; i++ ) {

			var random = Math.floor( Math.random() * 1234 );

			// Select the random character from the valid characters collection.
			randomChars.push( validChars.charAt( random % validChars.length ) );

		}

		return( "i" + randomChars.join( "" ) + ref.key + "c" );

	}

}
