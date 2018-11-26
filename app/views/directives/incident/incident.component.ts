
// Import the core angular services.
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { OnChanges } from "@angular/core";
import { SimpleChanges } from "@angular/core";

// Import the application services.
import { Incident } from "~/app/shared/services/incident.service";
import { Priority } from "~/app/shared/services/incident.service";
import { Status } from "~/app/shared/services/incident.service";
import { Timezone } from "~/app/shared/services/timezones";
import { Update } from "~/app/shared/services/incident.service";
import { _ } from "~/app/shared/services/lodash-extended";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface Duration {
	hours: number;
	minutes: number;
}

interface IntakeForm {
	description: string;
	version: string;
	customerType: string;
	customerCount: string;
	internalTeam: string;
	zendeskTicket: string;
	priorityID: string;
	startedAt: Date | null;
	videoLink: string;
	updateStatusID: string;
	updateDescription: string;
	slackSize: number;
	slackFormat: string;
	slackTimezone: Timezone;
	slack: string;
}

interface EditForm {
	update: Update;
	statusID: string;
	createdAt: Date | null;
	description: string;
}

@Component({
	selector: "app-incident",
	inputs: [
		"incident",
		"timezones",
		"priorities",
		"statuses",
		"version"
	],
	outputs: [
		"updateSaveEvents: updateSave",
		"updateDeleteEvents: updateDelete",
		"versionSelectEvents: versionSelect"
	],
	styleUrls: [ "./incident.component.less" ],
	templateUrl: "./incident.component.htm"
})
export class IncidentComponent implements OnChanges {

	public duration?: Duration;
	public editForm?: EditForm;
	public incident?: Incident;
	public intakeForm?: IntakeForm;
	public priorities?: Priority[];
	public statuses?: Status[];
	public timezones?: Timezone[];
	public updateDeleteEvents: EventEmitter<Update>;
	public updateSaveEvents: EventEmitter<Update>;
	public versionSelectEvents: EventEmitter<string>;

	// I initialize the incident component.
	constructor() {

		this.duration = {
			hours: 0,
			minutes: 0
		};
		this.editForm = null;
		this.incident = null;
		this.intakeForm = null;
		this.priorities = null;
		this.statuses = null;
		this.timezones = null;
		this.updateDeleteEvents = new EventEmitter();
		this.updateSaveEvents = new EventEmitter();
		this.versionSelectEvents = new EventEmitter();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I add a new Update to the incident.
	public addUpdate() : void {

		// Ignore any empty update.
		if ( ! this.intakeForm.updateDescription ) {

			return;

		}

		var update = {
			id: Date.now(),
			status: _.find( this.statuses, [ "id", this.intakeForm.updateStatusID ] ),
			createdAt: new Date(),
			description: this.intakeForm.updateDescription
		};

		// TODO.....

	}



	// I re-apply the form changes to the incident.
	public applyForm() : void {

		// TODO.....

	}


	// I cancel the editing of the selected Update.
	public cancelEdit() : void {

		this.editForm = null;

	}


	// I delete the given update.
	public deleteUpdate( update: Update ) : void {

		this.updateDeleteEvents.emit( update );

	}


	// I select the given Update for editing.
	public editUpdate( update: Update ) : void {

		this.editForm = {
			update: update,
			statusID: update.status.id,
			createdAt: update.createdAt,
			description: update.description
		};

	}


	public ngOnChanges( changes: SimpleChanges ) : void {

		// Validate that the required inputs have been provided.

		if ( ! this.incident ) {

			throw( new Error( "Required input [incident] has not been provided." ) );

		}

		if ( ! this.priorities ) {

			throw( new Error( "Required input [priorities] has not been provided." ) );

		}

		if ( ! this.statuses ) {

			throw( new Error( "Required input [statuses] has not been provided." ) );

		}

		if ( ! this.timezones ) {

			throw( new Error( "Required input [timezones] has not been provided." ) );

		}

		// Adjust internal models based on specific input changes.

		if ( changes.incident ) {

			var slackMessage = ( ( this.intakeForm && this.intakeForm.slack ) || "" );

			this.intakeForm = {


			};

		}

	}


	// I save the changes to the currently-selected Update.
	public saveUpdateChanges() : void {

		var update = this.editForm.update;

		this.updateSaveEvents.emit({
			id: update.id,
			status: _.find( this.statuses, [ "id", this.editForm.statusID ] ),
			createdAt: ( this.editForm.createdAt || update.createdAt ),
			description: this.editForm.description
		});

		this.editForm = null;

	}


	// I switch over to the given version of the intake form.
	public useVersion( version: string ) : void {

		this.versionSelectEvents.emit( version );

	}

	// ---
	// PRIVATE METHODS.
	// ---

}
