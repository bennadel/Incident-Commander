
// Import the core angular services.
import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { OnInit } from "@angular/core";
import { PopStateEvent } from "@angular/common";
import { Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";

// Import the application services.
import { CacheService } from "~/app/shared/services/cache.service";
import { ClipboardService } from "~/app/shared/services/clipboard.service";
import { Incident } from "~/app/shared/services/incident.service";
import { IncidentService } from "~/app/shared/services/incident.service";
import { Priority } from "~/app/shared/services/incident.service";
import { Quote } from "~/app/shared/services/quote.service";
import { QuoteService } from "~/app/shared/services/quote.service";
import { RcaSerializer } from "~/app/shared/services/rca-serializer";
import { SlackSerializer } from "~/app/shared/services/slack-serializer";
import { Status } from "~/app/shared/services/incident.service";
import { Timezone } from "~/app/shared/services/timezones";
import { timezones } from "~/app/shared/services/timezones";
import { Update } from "~/app/shared/services/incident.service";
import { _ } from "~/app/shared/services/lodash-extended";

var NEW_INCIDENT_ID_OVERLOAD = "new";

@Component({
	selector: "my-app",
	styleUrls: [ "./app-view.component.less" ],
	templateUrl: "./app-view.component.htm"
})
export class AppViewComponent implements OnInit {

	public duration: {
		hours: number;
		minutes: number;
	};
	public editForm: {
		update: Update;
		statusID: string;
		createdAt: Date | null;
		description: string;
	};
	public form: {
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
	};
	public globalInsight: string;
	public incident: Incident;
	public incidentID: string;
	public isShowingRCA: boolean;
	public priorities: Priority[];
	public quote: Quote;
	public rcaWriteup: string;
	public statuses: Status[];
	public timezones: Timezone[];
	public updateSortDirection: "asc" | "desc";

	private cacheService: CacheService;
	private clipboardService: ClipboardService;
	private incidentService: IncidentService;
	private location: Location;
	private quoteService: QuoteService;
	private rcaSerializer: RcaSerializer;
	private slackSerializer: SlackSerializer;
	private subscription: Subscription;
	private title: Title;


	// I initialize the app component.
	constructor( 
		cacheService: CacheService,
		clipboardService: ClipboardService,
		incidentService: IncidentService,
		location: Location,
		quoteService: QuoteService,
		rcaSerializer: RcaSerializer,
		slackSerializer: SlackSerializer,
		title: Title
		) {

		// Store injected properties.
		this.cacheService = cacheService;
		this.clipboardService = clipboardService;
		this.incidentService = incidentService;
		this.location = location;
		this.quoteService = quoteService;
		this.rcaSerializer = rcaSerializer;
		this.slackSerializer = slackSerializer;
		this.title = title;

		this.priorities = this.incidentService.getPriorities();
		this.statuses = this.incidentService.getStatuses();
		this.incident = null;
		this.incidentID = null;
		this.isShowingRCA = false;
		this.subscription = null;
		this.updateSortDirection = "desc";

		this.timezones = timezones;

		this.form = {
			version: this.getDefaultVersion(),
			description: "",
			customerType: "",
			customerCount: "",
			internalTeam: "",
			zendeskTicket: "",
			priorityID: this.priorities[ 0 ].id,
			startedAt: null,
			videoLink: "",
			updateStatusID: this.statuses[ 0 ].id,
			updateDescription: "",
			slackSize: 5,
			slackFormat: "compact",
			slackTimezone: this.getDefaultTimezone(),
			slack: ""
		};

		this.editForm = {
			update: null,
			statusID: null,
			createdAt: null,
			description: null
		};

		this.duration = {
			hours: 0,
			minutes: 0
		};
		
		this.quote = this.quoteService.getRandomQuote();
		this.rcaWriteup = "";

		this.globalInsight = "";

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I add a new Update to the incident.
	public addUpdate() : void {

		// Ignore any empty update.
		if ( ! this.form.updateDescription ) {

			return;

		}

		var update = {
			id: Date.now(),
			status: _.find( this.statuses, [ "id", this.form.updateStatusID ] ),
			createdAt: new Date(),
			description: this.form.updateDescription
		};

		// Optimistically apply the changes to the local incident.
		// --
		// Automatically apply the status of the new update to the overall status of 
		// the incident (assuming that statuses generally move "forward" as updates are
		// recorded).
		this.incident.status = update.status;
		this.incident.updates.push( update );
		this.incident.updates.sort( this.sortCreatedAtDesc );

		// Optimistically update the Slack message formatting.
		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone );

		// Reset the content, but leave the status selection - it will likely be used by
		// the subsequent updates.
		this.form.updateDescription = "";

		// Finally, persist the incident changes.
		this.incidentService.saveIncident( this.incident );

		// For convenience, copy the slack message directly to the user's clipboard.
		this.clipboardService.copy( this.form.slack ).then(
			( value: string ) : void => {

				this.setGlobalInsight( "Slack message copied to clipboard." );

			},
			( error: any ) : void => {

				console.warn( "Unable to copy value to clipboard." );
				console.error( error );

			}
		);

	}


	// I re-apply the form changes to the incident.
	public applyForm() : void {

		// If the startedAt form input emitted a NULL value, let's overwrite it with the
		// known value in the incident - we don't want any of the dates to be null.
		this.form.startedAt = ( this.form.startedAt || this.incident.startedAt );

		// Optimistically apply the changes to the local incident.
		this.incident.version = this.form.version;
		this.incident.description = this.form.description;
		this.incident.customerType = this.form.customerType;
		this.incident.customerCount = this.form.customerCount;
		this.incident.internalTeam = this.form.internalTeam;
		this.incident.zendeskTicket = this.form.zendeskTicket;
		this.incident.priority = _.find( this.priorities, [ "id", this.form.priorityID ] );
		this.incident.startedAt = this.form.startedAt;
		this.incident.timezoneID = this.form.slackTimezone.id;
		this.incident.videoLink = this.form.videoLink;

		// Optimistically update the Slack message formatting.
		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone );

		this.updateDuration();
		this.updateTitle();

		// Finally, persist the incident changes.
		this.incidentService.saveIncident( this.incident );

		// Cache the selected timezone so it will default during page refresh or at the
		// start of the next incident.
		this.cacheService.set( "slackTimezone", this.form.slackTimezone );

	}


	// I cancel the editing of the selected Update.
	public cancelEdit() : void {

		this.editForm.update = null;

	}


	// I close the RCA preparation modal.
	public closeRCA() : void {

		this.isShowingRCA = false;

	}


	// I delete the currently active incident.
	public deleteIncident() : void {

		if ( ! confirm( "Are you sure you want to delete this incident? This cannot be undone!" ) ) {

			return;

		}

		// If we're subscribed to the current incident, unsubscribe.
		if ( this.subscription ) {

			this.subscription.unsubscribe();
			this.subscription = null;

		}

		this.incidentService.deleteIncident( this.incident.id );

		// Optimistically apply the changes to the local state.
		this.incidentID = null;
		this.incident = null;
		
		// Redirect back to the introductory view.
		this.location.go( "" );

	}


	// I delete the given update.
	public deleteUpdate( update: Update ) : void {

		if ( ! confirm( `Delete: ${ update.description }?` ) ) {

			return;

		}

		// Optimistically apply the changes to the local incident.
		this.incident.updates = _.without( this.incident.updates, update );

		// Optimistically update the Slack message formatting.
		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone );

		// Finally, persist the incident changes.
		this.incidentService.saveIncident( this.incident );
		
	}


	// I select the given Update for editing.
	public editUpdate( update: Update ) : void {

		this.editForm.update = update;
		this.editForm.statusID = update.status.id;
		this.editForm.createdAt = update.createdAt;
		this.editForm.description = update.description;

	}


	// I get called once, after the component has been loaded.
	public ngOnInit() : void {

		this.title.setTitle( "Incident Commander" );

		// If there is a location path value, it should contain a persisted incident, 
		// try to load the incident from the path.
		if ( this.location.path() ) {

			this.applyLocation();

		}

		// Listen for changes to the location. This may indicate that we need to switch
		// over to a different incident.
		this.location.subscribe(
			( value: PopStateEvent ) : void => {

				this.applyLocation();

			}
		);

		this.setupDurationInterval();

	}


	// I render the incident in a format that is aligned with the current RCA process.
	public prepareRCA() : void {

		this.rcaWriteup = this.rcaSerializer.serialize( this.incident, this.form.slackTimezone );
		this.isShowingRCA = true;

	}


	// I save the changes to the currently-selected Update.
	public saveUpdateChanges() : void {

		var update = this.editForm.update;

		// Since the createdAt date is required for proper rendering and sorting of the
		// updates collection, we're only going to copy it back to the update if it is 
		// valid (otherwise fall-back to the existing date).
		this.editForm.createdAt = ( this.editForm.createdAt || update.createdAt );

		// Optimistically update the incident locally.
		update.status = _.find( this.statuses, [ "id", this.editForm.statusID ] );
		update.description = this.editForm.description;
		update.createdAt = this.editForm.createdAt;
		this.incident.updates.sort( this.sortCreatedAtDesc );

		// If we're editing the most recent status update, let's make sure we mirror the
		// selected status in the overall incident as well as the in new update form 
		// (since the next update is more likely to match the most recent update).
		if ( update === _.last( this.incident.updates ) ) {

			this.incident.status = update.status;
			this.form.updateStatusID = update.status.id;

		}

		// Optimistically update the Slack message formatting.
		this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone );

		this.editForm.update = null;

		// Finally, persist the incident changes.
		this.incidentService.saveIncident( this.incident );
		
	}


	// I update the sort-direction for the timeline.
	// --
	// NOTE: Actual sorting is done by a Pipe in the template.
	public sortUpdates( direction: "asc" | "desc" ) : void {

		this.updateSortDirection = direction;

	}


	// I start a new incident.
	public startNewIncident() : void {

		// Only prompt the user for confirmation if there is an existing incident ID that
		// we would be navigating away from.
		if ( this.incidentID && ! confirm( "Start a new incident (and clear the current incident data)?" ) ) {

			return;

		}

		// If we're currently subscribed to a different incident, unsubscribe.
		if ( this.subscription ) {

			this.subscription.unsubscribe();
			this.subscription = null;

		}

		// CAUTION: The incidentID is overloaded. Since the incident service provides a
		// new ID as part of the creation of a new service, we don't have a great way to
		// differentiate the "Loading" page for the first-time incident. As such, we're
		// overloading the incidentID to hold a special "new" value, which will indicate 
		// the selection (and subsequent loading) of a new incident. This value is really
		// only used in the VIEW to show the proper template.
		this.incidentID = NEW_INCIDENT_ID_OVERLOAD;
		this.incident = null;

		// Create, persist, and return the new incident.
		this.incidentService
			.startNewIncident(
				this.getDefaultVersion(),
				this.getDefaultTimezone().id 
			)
			.then(
				( incident: Incident ) : void => {

					this.incidentID = incident.id;
					this.incident = incident;

					// Move the new incident data into the form.
					this.form.version = this.incident.version;
					this.form.description = this.incident.description;
					this.form.customerType = this.incident.customerType;
					this.form.customerCount = this.incident.customerCount;
					this.form.internalTeam = this.incident.internalTeam;
					this.form.zendeskTicket = this.incident.zendeskTicket;
					this.form.priorityID = this.incident.priority.id;
					this.form.startedAt = this.incident.startedAt;
					this.form.videoLink = this.incident.videoLink;
					this.form.updateStatusID = this.statuses[ 0 ].id;
					this.form.updateDescription = "";
					this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone );


					// While this has nothing to do with the incident, let's cycle the 
					// header quote whenever a new incident is started.
					this.quote = this.quoteService.getRandomQuote();
					
					this.updateDuration();
					this.updateTitle();
					this.updateSubscription();

					// Update the location so that this URL can now be copy-and-pasted
					// to other incident commanders.
					this.location.go( this.incidentID );

				}
			)
		;

	}


	// I switch over to the given version of the intake form.
	public useVersion( version: string ) : void {

		this.form.version = this.cacheService.set( "version", version );
		this.applyForm();

	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I attempt to parse the incident ID from the location and use it to load the 
	// given incident into the current application context.
	private applyLocation() : void {

		var path = this.location.path();

		// The location events get triggered more often than we need them to be. As such,
		// if the path already matches the incident ID, just ignore this request.
		if ( this.incidentID === path ) {

			return;

		}

		// If we're currently subscribed to a different incident, unsubscribe.
		if ( this.subscription ) {

			this.subscription.unsubscribe();
			this.subscription = null;

		}

		this.incidentID = path;
		this.incident = null;

		// Attempt to load the incident (may not exist).
		this.incidentService
			.getIncident( this.incidentID )
			.then(
				( incident: Incident ) : void => {

					this.incident = incident;

					// Move the new incident data into the form.
					this.form.version = this.incident.version;
					this.form.description = this.incident.description;
					this.form.customerType = this.incident.customerType;
					this.form.customerCount = this.incident.customerCount;
					this.form.internalTeam = this.incident.internalTeam;
					this.form.zendeskTicket = this.incident.zendeskTicket;
					this.form.priorityID = this.incident.priority.id;
					this.form.startedAt = this.incident.startedAt;
					this.form.videoLink = this.incident.videoLink;
					this.form.updateStatusID = this.incident.updates.length
						? _.last( this.incident.updates ).status.id
						: this.statuses[ 0 ].id
					;
					this.form.updateDescription = "";
					// Since the timezoneID was added to the Incident interface after 
					// data had already been persisted, the ID may not be valid. As 
					// such, we'll OR with whatever timezone is currently selected.
					this.form.slackTimezone = _.find(
						this.timezones,
						{
							id: ( this.incident.timezoneID || this.form.slackTimezone.id )
						}
					);
					this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone );

					// While this has nothing to do with the incident, let's cycle the 
					// header quote whenever a new incident is started.
					this.quote = this.quoteService.getRandomQuote();
					
					this.updateDuration();
					this.updateTitle();
					this.updateSubscription();

					// Update the location so that this URL can now be copy-and-pasted
					// to other incident commanders.
					this.location.go( this.incidentID );

				}
			)
			.catch(
				( error: any ) : void => {

					console.log( "Incident Failed To Load" );
					console.error( error );
					console.log( "ID:", this.incidentID );

					this.incidentID = null;
					this.incident = null;

					// Redirect back to the introductory view.
					this.location.go( "" );

				}
			)
		;

	}


	// I return the default timezone for the Slack rendering. This will pull from the
	// cache or default to EST.
	private getDefaultTimezone() : Timezone {

		// By default, we want to use the Eastern timezone (since this is what
		// InVision uses for its incident rendering). So when we pick the default
		// timezone, we want to make sure we pick the right Eastern timezone if we
		// are in Daylight time or Standard time

		var defaultTZID;

		if ( this.isDST() ) {

			defaultTZID = "3ca59164-cc12-444d-aa11-0ca961e17e08";

		} else {

			defaultTZID = "1de70413-cdc4-4eee-baea-6acb6bf41f4f";

		}

		var defaultTimezone = _.find(
			this.timezones,
			{
				id: defaultTZID,
			}
		);

		// Now that we have our default, let's check to see if there is a persisted
		// timezone in the cache set by the user.
		var cachedTimezone = this.cacheService.get( "slackTimezone" );

		// If there is a cached timezone, we want to actually search for the associated
		// timezone even though their value-objects will be the same. The reason for 
		// this is that the SELECT input will compare objects by REFERENCE, not by value,
		// which won't work if we return the cached version directly.
		if ( cachedTimezone ) {

			defaultTimezone = ( _.find( this.timezones, cachedTimezone ) || defaultTimezone );

		}

		return( defaultTimezone );

	}

	private isDST() : boolean {
		var today = new Date();
		var jan = new Date(today.getFullYear(), 0, 1);
		var jul = new Date(today.getFullYear(), 6, 1);
		var stdTimeZoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

		return today.getTimezoneOffset() < stdTimeZoneOffset;
	}


	// I return the default version of the intake form. This will pull from the cache.
	private getDefaultVersion() : string {

		var cachedVersion = this.cacheService.get( "version" );

		return( cachedVersion || "general" );

	}


	// I set the global insight message, then clear it after several seconds.
	private setGlobalInsight( message: string ) : void {

		this.globalInsight = message;

		setTimeout(
			() => {

				this.globalInsight = "";

			},
			4000
		);

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

		if ( this.incident && ( this.incident.startedAt <= now ) ) {

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


	// I update the incident subscription so it points to the currently-selected 
	// incident.
	// --
	// CAUTION: The subscription will trigger for BOTH local AND remote changes.
	private updateSubscription() : void {

		this.subscription = this.incidentService
			.getIncidentAsStream( this.incidentID )
			.subscribe(
				( incident: Incident ) : void => {

					this.incident = incident;

					// Move the new incident data into the form.
					this.form.version = this.incident.version;
					this.form.description = this.incident.description;
					this.form.customerType = this.incident.customerType;
					this.form.customerCount = this.incident.customerCount;
					this.form.internalTeam = this.incident.internalTeam;
					this.form.zendeskTicket = this.incident.zendeskTicket;
					this.form.priorityID = this.incident.priority.id;
					this.form.startedAt = this.incident.startedAt;
					this.form.videoLink = this.incident.videoLink;
					this.form.updateStatusID = this.incident.updates.length
						? _.last( this.incident.updates ).status.id
						: this.statuses[ 0 ].id
					;
					// Since the timezoneID was added to the Incident interface after 
					// data had already been persisted, the ID may not be valid. As 
					// such, we'll OR with whatever timezone is currently selected.
					this.form.slackTimezone = _.find(
						this.timezones,
						{
							id: ( this.incident.timezoneID || this.form.slackTimezone.id )
						}
					);
					this.form.slack = this.slackSerializer.serialize( this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone );

					this.updateDuration();
					this.updateTitle();

				},
				( error: any ) : void => {

					// This shouldn't really ever happen unless the incident is actually
					// deleted while in use.
					console.log( "Incident Stream Failed" );
					console.error( error );

				}
			)
		;

	}


	// I update the window title based on the current incident start date.
	private updateTitle() : void {

		var yearValue = this.incident.startedAt.getFullYear().toString();
		var monthValue = ( this.incident.startedAt.getMonth() + 1 ).toString(); // Adjust for zero-based month.
		var dayValue = this.incident.startedAt.getDate().toString();
		var hourValue = ( ( this.incident.startedAt.getHours() % 12 ) || 12 ).toString();
		var minuteValue = this.incident.startedAt.getMinutes().toString();
		var periodValue = ( this.incident.startedAt.getHours() < 12 )
			? "AM"
			: "PM"
		;

		// Ensure that we have two digits for some of the smaller fields.
		minuteValue = ( "0" + minuteValue ).slice( -2 );

		this.title.setTitle( `Incident: ${ yearValue }/${ monthValue }/${ dayValue } at ${ hourValue }:${ minuteValue } ${ periodValue }` );

	}

}
