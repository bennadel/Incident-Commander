
// Import the core angular services.
import { Injectable } from "@angular/core";

// Import the application services.
import { Incident } from "./incident.service";
import { Timezone } from "./timezones";
import { Update } from "./incident.service";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

var WEEKDAYS = [ "Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat" ];
var MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

type Lines = string[];

@Injectable({
	providedIn: "root"
})
export class RcaSerializer {

	// I serialize the given incident for use in an RCA write-up.
	public serialize(
		incident: Incident,
		timezone: Timezone
		) : string {

		var lines: Lines = [];
		var pending = "_pending..._";

		lines.push( ...this.addOverview( incident, timezone ) );
		lines.push( "" );
		lines.push( "### Scope of User Impact" );
		lines.push( "" );
		lines.push( pending );
		lines.push( "" );
		lines.push( "### Customer-Facing Explanation" );
		lines.push( "" );
		lines.push( pending );
		lines.push( "" );
		lines.push( "### Summary &amp; Root Cause Analysis" );
		lines.push( "" );
		lines.push( pending );
		lines.push( "" );
		lines.push( "### Lessons Learned" );
		lines.push( "" );
		lines.push( pending );
		lines.push( "" );
		lines.push( "### Five Why's Analysis" );
		lines.push( "" );
		lines.push( pending );
		lines.push( "" );
		lines.push( "" );
		lines.push( "## Remediations" );
		lines.push( "" );
		lines.push( "### Bug Remediations" );
		lines.push( "" );
		lines.push( pending );
		lines.push( "" );
		lines.push( "### Graceful Resiliency Remediations" );
		lines.push( "" );
		lines.push( pending );
		lines.push( "" );
		lines.push( "### Monitoring &amp; Alerting Remediations" );
		lines.push( "" );
		lines.push( pending );
		lines.push( "" );
		lines.push( "" );
		lines.push( ...this.addTimeline( incident, timezone ) );
		lines.push( "" );
		lines.push( "" );
		lines.push( "-".repeat( 90 ) );
		lines.push( "-".repeat( 90 ) );
		lines.push( "" );
		lines.push( "" );
		lines.push( ...this.addRcaKey() );

		return( lines.join( "\n" ) );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I return a collection of lines representing the Overview section.
	private addOverview( incident: Incident, timezone: Timezone ) : Lines {

		var lines: Lines = [];
		var impactStart = "";
		var impactEnd = "";
		var impactDuration = "0:00";

		// If we have at least one update, we can format the start of impact.
		if ( incident.updates.length > 0 ) {

			var firstUpdate = incident.updates[ 0 ];

			impactStart = this.formatImpactDate( incident.updates[ 0 ].createdAt, timezone );

		}

		// If we have at least two updates, we can format the end of impact and calculate
		// the duration of the impact (at least in the context of the updates).
		if ( incident.updates.length > 1 ) {

			var lastUpdate = incident.updates[ incident.updates.length - 1 ];

			impactEnd = this.formatImpactDate( lastUpdate.createdAt, timezone );
			impactDuration = this.formatImpactDuration( firstUpdate.createdAt, lastUpdate.createdAt );

		}

		lines.push( "## Overview" );
		lines.push( "" );
		lines.push( `* **Customers Impact Start**: ${ impactStart }` );
		lines.push( `* **Customers Impact End**: ${ impactEnd }` );
		lines.push( `* **Duration**: ${ impactDuration }` );
		lines.push( `* **Type of Customers Affected**: ${ incident.customerType }` );
		lines.push( `* **Number of Customers Affected**: ${ incident.customerCount }` );
		lines.push( "* **Features Affected**:" );
		lines.push( "* **First Awareness**:" );
		lines.push( `* **Tickets**: [0 via Zendesk](https://invisionapp.zendesk.com/agent/tickets/${ incident.zendeskTicket || "00000" })` );
		lines.push( "* **Incident Declaration**: [#incident channel](https://invisionapp.slack.com/................)" );
		lines.push( "* **Incident Commander**: " );
		lines.push( `* **Responsible Team**: ${ incident.internalTeam }` );

		return( lines );

	}


	// I return a collection of lines representing the RCA Key section.
	private addRcaKey() : Lines {

		var lines: Lines = [];

		lines.push( "## RCA Write-Up Key — TO BE DELETED" );
		lines.push( "" );
		lines.push( "The following is an explanation of the sections contained within the RCA," );
		lines.push( "complete with sample entries. Do not include this section in the final RCA. This" );
		lines.push( "is just here for reference only." );
		lines.push( "" );
		lines.push( "" );

		lines.push( "### Overview" );
		lines.push( "" );
		lines.push( "**CAUTION**: The information in this section is generated based on what has been recorded" );
		lines.push( "in the Incident Commander tool. As such, the missing information has to be provided; and," );
		lines.push( "the existing information has to be double-checked. For example, the **impact times and" );
		lines.push( "duration** are calculated from the Status Updates; however, the incident most likely" );
		lines.push( "started some time before the first status update." );
		lines.push( "" );

		lines.push( "### Scope of User Impact" );
		lines.push( "" );
		lines.push( "The scope of user impact is intended to illustrate the manifestation of the" );
		lines.push( "incident as experienced by the user. As such, this is not a technical explanation;" );
		lines.push( "but, rather a description of the ways in which the application behavior would have" );
		lines.push( "appeared degraded and the number of users that were likely impacted. At best, the" );
		lines.push( "number of users impacted is a _best guess_ estimate that can be backed-up by" );
		lines.push( "**screenshots** of **DataDog metrics** and **Loggly search results**." );
		lines.push( "" );
		lines.push( "Sample write-up:" );
		lines.push( "" );
		lines.push( "> _(coming soon)_" );
		lines.push( "" );

		lines.push( "### Customer-Facing Explanation" );
		lines.push( "" );
		lines.push( "**This section is optional**. If included, this explanation will be **provided by the" );
		lines.push( "Support Team**. It is a draft of customer-facing messaging that the Support Team can" );
		lines.push( "use when interfacing with the public (such as in Zendesk tickets and the Status page)." );
		lines.push( "" );

		lines.push( "### Summary &amp; Root Cause Analysis" );
		lines.push( "" );
		lines.push( "The root cause analysis is the technical explanation of what went wrong. It should" );
		lines.push( "included a lower-level description of the issue as well as any steps we took to resolve" );
		lines.push( "the incident." );
		lines.push( "" );
		lines.push( "Sample write-up:" );
		lines.push( "" );
		lines.push( "> _(coming soon)_" );
		lines.push( "" );

		lines.push( "### Lessons Learned" );
		lines.push( "" );
		lines.push( "**This section is optional**. The lessons learned should included a list of key" );
		lines.push( "take-aways from both a technical and process point-of-view. The goal here is to provide" );
		lines.push( "information that can be shared across teams in an attempt to amplify information that" );
		lines.push( "can lead to better operational readiness and team efficiency." );
		lines.push( "" );
		lines.push( "Sample write-up:" );
		lines.push( "" );
		lines.push( "> _(coming soon)_" );
		lines.push( "" );

		lines.push( "### Five Why's Analysis" );
		lines.push( "" );
		lines.push( "**This section is optional**. Often times, when we perform an investigation, we identify" );
		lines.push( "the superficial technical issues and then stop. The goal of the Five Whys is to dig even" );
		lines.push( "deeper and explore the incident from a broader, more holistic point-of-view. Technical" );
		lines.push( "issues don't occur in a vacuum. By continually asking the question, \"Why\", we can start" );
		lines.push( "to identify the \"process\", \"team\", and \"organizational\" issue that may have contributed." );
		lines.push( "" );
		lines.push( "* See [https://en.wikipedia.org/wiki/5_Whys](https://en.wikipedia.org/wiki/5_Whys)" );
		lines.push( "* See [https://www.atlassian.com/team-playbook/plays/5-whys](https://www.atlassian.com/team-playbook/plays/5-whys)" );
		lines.push( "" );
		lines.push( "Sample write-up:" );
		lines.push( "" );
		lines.push( "> _(coming soon)_" );
		lines.push( "" );

		lines.push( "### Remediations" );
		lines.push( "" );
		lines.push( "**This section is optional**. The remediations should include a list of JIRA tickets that" );
		lines.push( "represent both future and completed work identified during the incident investigation and" );
		lines.push( "resolution. Each item should contain clearly show the title of the JRIA ticket and the" );
		lines.push( "JIRA ticket number." );
		lines.push( "Sample write-up:" );
		lines.push( "" );
		lines.push( "> _(coming soon)_" );
		lines.push( "" );

		lines.push( "### Timeline" );
		lines.push( "" );
		lines.push( "The timeline should outline the milestones leading up to the incident and then the steps" );
		lines.push( "taken during the incident management. For the most part, this will be little more than a" );
		lines.push( "reformating of the status updates recorded during the investigation. However, it can be" );
		lines.push( "augmented with pre-incident-declaration notes as well as additional **asides** that shed" );
		lines.push( "further light on why various steps were taking during the incident triage." );
		lines.push( "" );
		lines.push( "Sample write-up:" );
		lines.push( "" );
		lines.push( "> _(coming soon)_" );

		return( lines );

	}


	// I return a collection of lines representing the Timeline section.
	private addTimeline( incident: Incident, timezone: Timezone ) : Lines {

		var lines: Lines = [];
		var dayLabel = "";

		lines.push( `## [Timeline (${ timezone.name })](https://www.incident-commander.com/#${ incident.id })` );

		// As we loop over the updates, we want to break them up into day-based buckets.
		for ( var update of incident.updates ) {

			var currentDayLabel = this.formatDate( update.createdAt, timezone );

			if ( dayLabel !== currentDayLabel ) {

				lines.push( "" );
				lines.push( `### ${ dayLabel = currentDayLabel }` );

			}

			lines.push( "" );
			lines.push( `**${ this.formatTime( update.createdAt, timezone ) } [ ${ update.status.id } ]** — ${ update.description }` );

		}

		return( lines );

	}


	// I format the given Date object as a date string in the given timezone.
	private formatDate( value: Date, timezone: Timezone ) : string {

		var rcaDate = this.getDateInTimezone( value, timezone );

		var normalizedWeekday = WEEKDAYS[ rcaDate.getDay() ];
		var normalizedMonth = MONTHS[ rcaDate.getMonth() ];
		
		return( `${ normalizedWeekday }, ${ normalizedMonth } ${ rcaDate.getDate() }, ${ rcaDate.getFullYear() }` );

	}


	// I format the given Date object as a date string in the given timezone for use in
	// the incident-impact milestones.
	private formatImpactDate( value: Date, timezone: Timezone ) : string {

		var rcaDate = this.getDateInTimezone( value, timezone );

		var yyyy = rcaDate.getFullYear();
		var mm = this.zeroPad( rcaDate.getMonth() + 1 );
		var dd = this.zeroPad( rcaDate.getDate() );
		var hh = this.zeroPad( rcaDate.getHours() );
		var nn = this.zeroPad( rcaDate.getMinutes() );
		var zz = timezone.abbreviation;

		return( `${ yyyy }-${ mm }-${ dd } ${ hh }:${ nn } ${ zz }` );

	}


	// I format the given Date object as a time string for use in the incident-impact
	// milestones.
	private formatImpactDuration( from: Date, to: Date ) : string {

		var msDelta = ( to.getTime() - from.getTime() );
		var sDelta = ( msDelta / 1000 );
		var nDelta = Math.floor( sDelta / 60 );

		// Calculate the delta of hours.
		var hh = Math.floor( nDelta / 60 );

		// Calculate the delta of minutes, once we adjust for hours.
		var nn = this.zeroPad( nDelta - ( hh * 60 ) );

		return( `${ hh }:${ nn }` );

	}


	// I format the given Date object as a time string in the given timezone.
	private formatTime( value: Date, timezone: Timezone ) : string {

		var rcaDate = this.getDateInTimezone( value, timezone );
		
		var hours = rcaDate.getHours();
		var minutes = rcaDate.getMinutes();
		var period = ( hours < 12 )
			? "AM"
			: "PM"
		;

		var normalizedHours = ( ( hours % 12 ) || 12 );
		var normalizedMinutes = ( "0" + minutes ).slice( -2 );

		return( `${ normalizedHours }:${ normalizedMinutes } ${ period } ${ timezone.abbreviation }` );

	}


	// I return the given local date adjusted for the given timezone.
	private getDateInTimezone( value: Date, timezone: Timezone ) : Date {

		// In order to [try our best to] convert from the local timezone to the RCA
		// timezone for rendering, we're going to use the difference in offset minutes
		// to alter a local copy of the Date object.
		var offsetDelta = ( timezone.offset - value.getTimezoneOffset() );

		// Clone the date so we don't mess up the original value as we adjust it.
		var adjustedDate = new Date( value );

		// Attempt to move from the current TZ to the given TZ by adjusting minutes.
		adjustedDate.setMinutes( adjustedDate.getMinutes() - offsetDelta );

		return( adjustedDate );

	}


	// I ensure that the given number is stringified with at least 2-digits.
	private zeroPad( value: number ) : string {

		var valueAsString = value.toString();

		if ( valueAsString.length === 1 ) {

			return( "0" + valueAsString );

		} else {

			return( valueAsString );

		}

	}

}
