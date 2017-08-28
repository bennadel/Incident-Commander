
// Import the core angular services.
import firebase = require( "firebase/app" );

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
	description: string;
	priorityID: string;
	statusID: string;
	startedAt: number;
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


	// I persist the given incident data transfer object. Returns Promise with ID of
	// newly persisted incident when the action is completed locally.
	public createIncident( dto: IncidentDTO ) : Promise<string> {

		var ref = this.firebaseDB.ref( "/incidents/" ).push();

		// The .push() command allocates a new, unique key for this incident. Let's
		// merge the key into the ref as the ID to make the incident easier to consume
		// in future contexts.
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
		// operation.
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
		this.firebaseDB.ref( "/incident/" + id )
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

					return( dto );

				}
			)
		;

		// NOTE: We have to cast to the correct type of Promise otherwise we get a 
		// mismatch due to the use of Promise<any> in the Firebase type definitions.
		return( <Promise<IncidentDTO>>promise );

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

}
