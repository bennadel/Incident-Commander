
// Import the application services.
import { Incident } from "./incident.service";

export class SlackSerializer {

	// I serialize the given incident for use in a Slack message.
	public serialize(
		incident: Incident,
		updateLimit: number,
		format: string = "compact"
		) : string {

		var parts = [
			`*Incident Description*: ${ incident.description }`,
			`*Priority*: ${ incident.priority.id }`,
			`*Start of Customer Impact*: ${ this.formatTimeInEST( incident.startedAt ) }`,
			`*Zoom or Hangout link*: \`${ incident.videoLink }\` `,
			`*Status*: ${ incident.status.id }`,
			`*Timeline*: \`https://bennadel.github.io/Incident-Commander/#${ incident.id }\` `
		];

		var visibleUpdates = incident.updates.slice( -updateLimit );

		// If there are updates to show, add a spacer between the heads-up data and the
		// actual timeline items.
		if ( visibleUpdates.length ) {

			parts.push( "" );

		}

		// If not all updates are visible, add an indication as to how many are hidden.
		if ( visibleUpdates.length !== incident.updates.length ) {

			var hiddenCount = ( incident.updates.length - visibleUpdates.length );

			parts.push( `> _.... *${ hiddenCount } update(s)* not being shown._` );
			parts.push( "> " );

		}

		// Render visible updates.
		for ( var i = 0 ; i < visibleUpdates.length ; i++ ) {

			// Only add a line-delimiter if the format is readable.
			if ( ( format === "readable" ) && ( i !== 0 ) ) {

				parts.push( "> " );

			}

			var update = visibleUpdates[ i ];

			parts.push( `> *${ this.formatTimeInEST( update.createdAt ) } [ ${ update.status.id } ]*: \u2014 ${ update.description }` );

		}

		return( parts.join( "\n" ) );


	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I format the given Date object as a time string in the EST / EDT timezone.
	private formatTimeInEST( value: Date ) : string {

		// Clone the date so we don't mess up the original value as we adjust it.
		var slackDate = new Date( value );

		// When EST is not in daylight saving time, we know the offset it 300-minutes.
		// However, we're going to do our best to estimate when EST would be in EDT and
		// adjust the offset accordingly.
		var slackOffset = 300;
		var slackTZ = "EST";

		// Apply best estimate if EST is currently using DST. This is just an ESTIMATE
		// because the dates will be created in the LOCAL time, not EST time. As such,
		// the EST / EDT delimiters will be fuzzy.
		switch ( value.getFullYear() ) {
			case 2017:
				var start = new Date( 2017, 2, 12, 2, 0, 0 ); // Sun, Mar 12
				var end = new Date( 2017, 10, 4, 2, 0, 0 ); // Sun, Nov 5

				if ( ( start <= value ) && ( value <= end ) ) {

					slackOffset = 240;

				}
			break;
			case 2018:
				var start = new Date( 2018, 2, 11, 2, 0, 0 ); // Sun, Mar 11
				var end = new Date( 2018, 10, 4, 2, 0, 0 ); // Sun, Nov 4

				if ( ( start <= value ) && ( value <= end ) ) {
					
					slackOffset = 240;

				}
			break;
			case 2019:
				var start = new Date( 2019, 2, 10, 2, 0, 0 ); // Sun, Mar 10
				var end = new Date( 2019, 10, 3, 2, 0, 0 ); // Sun, Nov 3

				if ( ( start <= value ) && ( value <= end ) ) {
					
					slackOffset = 240;

				}
			break;
			case 2020:
				var start = new Date( 2020, 2, 8, 2, 0, 0 ); // Sun, Mar 8
				var end = new Date( 2020, 10, 1, 2, 0, 0 ); // Sun, Nov 1

				if ( ( start <= value ) && ( value <= end ) ) {
					
					slackOffset = 240;

				}
			break;
		}

		var localOffset = value.getTimezoneOffset();
		var offsetDelta = ( slackOffset - localOffset );

		// Attempt to move from the current TZ to the EST TZ by adjusting minutes.
		slackDate.setMinutes( slackDate.getMinutes() - offsetDelta );

		var hours = slackDate.getHours();
		var minutes = slackDate.getMinutes();
		var period = ( hours < 12 )
			? "AM"
			: "PM"
		;

		var normalizedHours = ( ( hours % 12 ) || 12 );
		var normalizedMinutes = ( "0" + minutes ).slice( -2 );

		return( `${ normalizedHours }:${ normalizedMinutes } ${ period } ${ slackTZ }` );

	}

}
