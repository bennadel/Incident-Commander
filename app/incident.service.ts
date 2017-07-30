
export interface Status {
	id: string;
	description: string;
}

export interface Priority {
	id: string;
	description: string;
}

export interface Update {
	id: number;
	status: Status;
	createdAt: Date;
	description: string;
}

export interface Incident {
	name: string;
	description: string;
	priority: Priority;
	status: Status;
	startedAt: Date;
	videoLink: string;
	updates: Update[];
}

export class IncidentService {

	private localStorageKey: string;


	// I initialize the incident services.
	constructor() {

		this.localStorageKey = "incident-commander";

	}


	// ---
	// PUBLIC METHODS.
	// ---


	// I return a new incident object (not persisted).
	public getNewIncident() : Incident {

		var priorities = this.getPriorities();
		var statuses = this.getStatuses();
		var name = this.getNewName();

		var incident: Incident = {
			name: name,
			description: "",
			priority: priorities[ 0 ],
			status: statuses[ 0 ],
			startedAt: new Date(),
			videoLink: `https://hangouts.google.com/hangouts/_/invisionapp.com/${ name }`,
			updates: []
		}

		return( incident );

	}


	// I return the incident priorities.
	public getPriorities() : Priority[] {

		return([
			{
				id: "P1",
				description: "All customers are affected by outage, vulnerability, or performance degradation."
			},
			{
				id: "P2",
				description: "Large segment of customers are affected by outage, vulnerability, or performance degradation."
			},
			{
				id: "P3",
				description: "Small segment of customers are affected by outage, vulnerability, or performance degradation."
			},
			{
				id: "P4",
				description: "Site performance degraded for some customers."
			},
			{
				id: "P5",
				description: "Potential issue, but customers are currently unaware."
			}
		]);

	}


	// I return the most recently persisted incident (or null).
	public getRecentIncident() : Incident {

		var persistedIncident = localStorage.getItem( this.localStorageKey );

		if ( ! persistedIncident ) {

			return( null );

		}

		var incident: Incident = JSON.parse( persistedIncident, this.jsonReviver );

		return( incident );

	}


	// I return the incident statuses.
	public getStatuses() : Status[] {

		return([
			{
				id: "Investigating",
				description: "We're still trying to figure out exactly what is wrong and haven't identified the cause of the issue yet."
			},
			{
				id: "Identified",
				description: "We've identified the cause of the issue and are working on a fix."
			},
			{
				id: "Monitoring",
				description: "We've released a fix for the issue but we're still monitoring to make sure the problem is indeed resolved."
			},
			{
				id: "Resolved",
				description: "We believe the issue is resolved and service is restored to normal levels again."
			}
		]);

	}


	// I persist the given incident.
	public saveIncident( incident: Incident ) : void {

		localStorage.setItem( this.localStorageKey, JSON.stringify( incident ) );

	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I generate a new name for an incident.
	private getNewName() : string {

		return( `Incident-${ Date.now() }` );

	}


	// I provide a JSON reviver that will re-hydrate Date objects.
	// --
	// CAUTION: This is going to be passed by-reference into JSON.parse(). As such, the
	// "this" context will not be expected in this function body.
	private jsonReviver( key: string, value: any ) : any {

		// Dates are serialized in TZ format, example: '1981-12-20T04:00:14.000Z'.
		var datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

		if ( ( typeof( value ) === "string" ) && datePattern.test( value ) ) {

			return( new Date( value ) );

		}

		// If it's not a date-string, we want to return the value as-is. If we fail to 
		// return a value, it will be omitted from the resultant data structure.
		return( value );

	}
	
}
