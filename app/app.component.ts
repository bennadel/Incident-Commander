
// Import the core angular services.
import { Component } from "@angular/core";

// Import the application services.
import { Incident } from "./incident.service";
import { IncidentService } from "./incident.service";
import { Priority } from "./incident.service";
import { Quote } from "./quote.service";
import { QuoteService } from "./quote.service";
import { SlackSerializer } from "./slack-serializer";
import { Status } from "./incident.service";
import { Update } from "./incident.service";
import { _ } from "./lodash-extended";

@Component({
	selector: "my-app",
	styleUrls: [ "./app.component.css" ],
	templateUrl: "./app.component.htm"
})
export class AppComponent {

	public duration: {
		hours: number;
		minutes: number;
	};
	public editForm: {
		update: Update;
		statusID: string;
		createdAt: Date;
		description: string;
	};
	public form: {
		description: string;
		priorityID: string;
		startedAt: Date;
		videoLink: string;
		updateStatusID: string;
		updateDescription: string;
		slackSize: number;
		slackFormat: string;
		slack: string;
	};
	public ioForm: {
		payload: string;
	};
	public incident: Incident;
	public isShowingIoModal: boolean;
	public priorities: Priority[];
	public quote: Quote;
	public statuses: Status[];

	private incidentService: IncidentService;
	private quoteService: QuoteService;
	private slackSerializer: SlackSerializer;


	// I initialize the app component.
	constructor( 
		incidentService: IncidentService,
		quoteService: QuoteService,
		slackSerializer: SlackSerializer
		) {

		// Store injected properties.
		this.incidentService = incidentService;
		this.quoteService = quoteService;
		this.slackSerializer = slackSerializer;

		// Load incident data.
		this.priorities = this.incidentService.getPriorities();
		this.statuses = this.incidentService.getStatuses();
		this.incident = this.loadOrCreateIncident();

		this.form = {
			description: this.incident.description,
			priorityID: this.incident.priority.id,
			startedAt: this.incident.startedAt,
			videoLink: this.incident.videoLink,
			updateStatusID: this.incident.status.id,
			updateDescription: "",
			slackSize: 5,
			slackFormat: "compact",
			slack: this.slackSerializer.serialize( this.incident, 5, "compact" )
		};

		this.editForm = {
			update: null,
			statusID: null,
			createdAt: null,
			description: null
		};

		this.ioForm = {
			payload: null
		};
		this.isShowingIoModal = false;

		this.duration = {
			hours: 0,
			minutes: 0
		};
		this.setupDurationInterval();

		this.quote = this.quoteService.getRandomQuote();

	}


	// ---
	// PUBLIC METHODS.
	// ---


	// I add a new Update to the incident.
	public addUpdate() : void {

		if ( ! this.form.updateDescription ) {

			return;

		}

		var update = {
			id: Date.now(),
			status: _.find( this.statuses, [ "id", this.form.updateStatusID ] ),
			createdAt: new Date(),
			description: this.form.updateDescription
		};

		// Automatically apply the status of the new update to the overall status of 
		// the incident (assuming that status generally move "forward" as updates are
		// recorded).
		this.incident.status = update.status;
		this.incident.updates.push( update );
		this.incident.updates.sort( this.sortCreatedAtDesc );
		this.incidentService.saveIncident( this.incident );

		// Reset the content, but leave the status selection - it will likely be used by
		// the subsequent updates.
		this.form.updateDescription = "";

		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat );

	}


	// I re-apply the form changes to the incident.
	public applyForm() : void {

		this.incident.description = this.form.description;
		this.incident.priority = _.find( this.priorities, [ "id", this.form.priorityID ] );
		this.incident.startedAt = this.form.startedAt;
		this.incident.videoLink = this.form.videoLink;
		this.incidentService.saveIncident( this.incident );

		this.updateDuration();

		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat );

	}


	// I cancel the editing of the selected Update.
	public cancelEdit() : void {

		this.editForm.update = null;

	}


	// I close the export / import incident window.
	public closeExportIncident() : void {

		this.isShowingIoModal = false;

	}


	// I delete the given update.
	public deleteUpdate( update: Update ) : void {

		if ( ! confirm( `Delete: ${ update.description }?` ) ) {

			return;

		}

		this.incident.updates = _.without( this.incident.updates, update );
		this.incidentService.saveIncident( this.incident );

		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat );
		
	}


	// I select the given Update for editing.
	public editUpdate( update: Update ) : void {

		this.editForm.update = update;
		this.editForm.statusID = update.status.id;
		this.editForm.createdAt = update.createdAt;
		this.editForm.description = update.description;

	}


	// I open the import / export window and prepare the current incident for export.
	public exportIncident() : void {

		this.ioForm.payload = this.incidentService.prepareForExport( this.incident );
		this.isShowingIoModal = true;

	}


	// I import the raw incident payload, overwriting the current incident.
	public importIncident() : void {

		try {

			this.incident = this.incidentService.prepareForImport( this.ioForm.payload );
			this.incidentService.saveIncident( this.incident );

		} catch ( error ) {

			alert( "Import payload could not be parsed as JSON." );
			return;

		}

		this.form.description = this.incident.description;
		this.form.priorityID = this.incident.priority.id;
		this.form.startedAt = this.incident.startedAt;
		this.form.videoLink = this.incident.videoLink;
		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat );

		this.updateDuration();
		
		this.isShowingIoModal = false;

	}

	public logit() : void {
		console.log( "here" );
	}


	// I save the changes to the currently-selected Update.
	public saveUpdateChanges() : void {

		var update = this.editForm.update;

		// Update the update item.
		update.status = _.find( this.statuses, [ "id", this.editForm.statusID ] );
		update.createdAt = this.editForm.createdAt;
		update.description = this.editForm.description;

		// Since the date of the update may have changed, re-sort the updates.
		this.incident.updates.sort( this.sortCreatedAtDesc );
		this.incidentService.saveIncident( this.incident );

		this.editForm.update = null;
		
		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat );

	}


	// I erase the current incident data and start a new incident.
	public startNewIncident() : void {

		if ( ! confirm( "Start a new incident (and clear the current incident data)?" ) ) {

			return;

		}

		this.incident = this.incidentService.getNewIncident();
		this.incidentService.saveIncident( this.incident );
		this.updateDuration();

		// Move the new incident data into the form.
		this.form.description = this.incident.description;
		this.form.priorityID = this.incident.priority.id;
		this.form.startedAt = this.incident.startedAt;
		this.form.videoLink = this.incident.videoLink;
		this.form.updateStatusID = this.statuses[ 0 ].id;
		this.form.updateDescription = "";
		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat );

		// While this has nothing to do with the incident, let's cycle the header quote
		// whenever a new incident is started.
		this.quote = this.quoteService.getRandomQuote();

	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I get the working incident by loading the most recently-persisted one; or, none
	// exist, creating and returning a new one.
	private loadOrCreateIncident() : Incident {

		return( this.incidentService.getRecentIncident() || this.incidentService.getNewIncident() );

	}


	// I setup the duration interval that re-calculates the duration based on the start
	// time of the current incident.
	private setupDurationInterval() : void {

		// Update the duration every 30-seconds. While the duration only has minute-level
		// granularity, doing it every half-minute reduced the changes of it being stale
		// for 2 minutes.
		setInterval(
			() => {

				this.updateDuration();

			},
			( 1000 * 30 )
		);

		// Kick-off an update check immediately so we don't have to wait 30-seconds to 
		// render the duration for a persisted incident.
		this.updateDuration();

	}


	// I provide the comparator for the Update collection.
	// --
	// CAUTION: This function is passed by-reference, so "this" reference will not work
	// as expected in the context of this component.
	private sortCreatedAtDesc( a: Update, b: Update ) : number {

		if ( a.createdAt <= b.createdAt ) {

			return( -1 );

		} else {

			return( 1 );

		}

	}


	// I periodically update the duration based on the incident start time.
	private updateDuration() : void {

		var now = new Date();

		if ( this.incident.startedAt <= now ) {

			var deltaSeconds = ( ( now.getTime() - this.incident.startedAt.getTime() ) / 1000 );
			var deltaMinutes = Math.floor( deltaSeconds / 60 );
			var deltaHours = Math.floor( deltaSeconds / 60 / 60 );

			this.duration.hours = deltaHours;
			this.duration.minutes = ( deltaMinutes - ( deltaHours * 60 ) );

		} else {

			this.duration.hours = 0;
			this.duration.minutes = 0;

		}

	}

}

