
// Import the core angular services.
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

// Import these modules for their side-effects.
import "rxjs/add/operator/map";

// Import the application components and services.
import { IncidentDTO } from "./incident.gateway";
import { IncidentGateway } from "./incident.gateway";
import { UpdateDTO } from "./incident.gateway";
import { _ } from "./lodash-extended";

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
	id?: string;
	name: string;
	version: string;
	description: string;
	customerType: string;
	customerCount: string;
	internalTeam: string;
	zendeskTicket: string;
	priority: Priority;
	status: Status;
	startedAt: Date;
	timezoneID: string;
	videoLink: string;
	updates: Update[];
}

@Injectable()
export class IncidentService {

	private incidentGateway: IncidentGateway;


	// I initialize the incident services.
	constructor( incidentGateway: IncidentGateway ) {

		this.incidentGateway = incidentGateway;

	}


	// ---
	// PUBLIC METHODS.
	// ---


	// I delete the incident with the given ID. Returns a Promise.
	public deleteIncident( id: string ) : Promise<void> {

		return( this.incidentGateway.deleteIncident( id ) );

	}


	// I return the incident with the given ID. Returns a Promise.
	public getIncident( id: string ) : Promise<Incident> {

		var promise = this.incidentGateway
			.readIncident( id )
			.then(
				( dto: IncidentDTO ) : Incident => {

					return( this.fromTransferObject( dto ) );

				}
			)
		;

		return( promise );

	}


	// I return the incident, with the given ID, as an observable stream. The returned
	// stream will emit the incident object any time that it changes (including the 
	// initial load of the incident).
	public getIncidentAsStream( id: string ) : Observable<Incident> {

		// The incident gateway is going to be emitting data transfer objects. As such,
		// we need to map the DTOs into actual Incident objects.
		var stream = this.incidentGateway
			.readIncidentAsStream( id )
			.map(
				( dto: IncidentDTO ) : Incident => {

					return( this.fromTransferObject( dto ) );

				}
			)
		;

		return( stream );

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
	public saveIncident( incident: Incident ) : Promise<void> {

		if ( ! incident.id ) {

			throw( new Error( "IC.MissingID" ) );

		}

		var dto = this.toTransferObject( incident );
		var promise = this.incidentGateway.updateIncident( dto );

		return( promise );

	}


	// I start a new incident, persist it, and return it. Returns a Promise.
	public startNewIncident( version: string, timezoneID: string ) : Promise<Incident> {

		var priorities = this.getPriorities();
		var statuses = this.getStatuses();
		var name = this.getNewName();

		var incident: Incident = {
			id: null, // This will be defined as part of the gateway operation.
			name: name,
			version: version,
			description: "",
			customerType: "",
			customerCount: "",
			internalTeam: "",
			zendeskTicket: "",
			priority: priorities[ 0 ],
			status: statuses[ 0 ],
			startedAt: new Date(),
			timezoneID: timezoneID,
			videoLink: `https://hangouts.google.com/hangouts/_/invisionapp.com/${ name }`,
			updates: []
		}

		var dto = this.toTransferObject( incident );

		var promise = this.incidentGateway
			.createIncident( dto )
			.then(
				( id: string ) : Incident => {

					// Behind the scenes, the gateway will merge an auto-generated ID 
					// into the remote object. In order to mimic that structure, let's 
					// save the ID back into the new incident object locally before we
					// return it.
					incident.id = id;

					return( incident );

				}
			)
		;

		return( promise );

	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I create a new incident from the given data transfer object. The DTO is the 
	// structure used by the incident gateway.
	private fromTransferObject( dto: IncidentDTO ) : Incident {

		var priorities = this.getPriorities();
		var statuses = this.getStatuses();

		var incident = {
			id: dto.id,
			name: dto.name,
			version: dto.version,
			description: dto.description,
			customerType: dto.customerType,
			customerCount: dto.customerCount,
			internalTeam: dto.internalTeam,
			zendeskTicket: dto.zendeskTicket,
			priority: _.find( priorities, [ "id", dto.priorityID ] ),
			status: _.find( statuses, [ "id", dto.statusID ] ),
			startedAt: new Date( dto.startedAt ),
			timezoneID: dto.timezoneID,
			videoLink: dto.videoLink,
			updates: dto.updates.map(
				( update: UpdateDTO ) : Update => {

					return({
						id: update.id,
						status: _.find( statuses, [ "id", update.statusID ] ),
						createdAt: new Date( update.createdAt ),
						description: update.description
					});

				}
			)
		};

		return( incident );

	}


	// I generate a new name for an incident.
	private getNewName() : string {

		return( `Incident-${ Date.now() }` );

	}


	// I create a data transfer object (DTO) from the given incident. The DTO is the 
	// structure used by the incident gateway.
	private toTransferObject( incident: Incident ) : IncidentDTO {

		var dto = {
			id: incident.id,
			name: incident.name,
			version: incident.version,
			description: incident.description,
			customerType: incident.customerType,
			customerCount: incident.customerCount,
			internalTeam: incident.internalTeam,
			zendeskTicket: incident.zendeskTicket,
			priorityID: incident.priority.id,
			statusID: incident.status.id,
			startedAt: incident.startedAt.getTime(),
			timezoneID: incident.timezoneID,
			videoLink: incident.videoLink,
			updates: incident.updates.map(
				( update: Update ) : UpdateDTO => {

					return({
						id: update.id,
						statusID: update.status.id,
						createdAt: update.createdAt.getTime(),
						description: update.description
					});

				}
			)
		};

		return( dto );

	}

}
