
// Import the core angular services.
import { Pipe } from "@angular/core";
import { PipeTransform } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Pipe({
	name: "timelineTime",
	pure: true
})
export class TimelineTimePipe implements PipeTransform {

	// I format the given Date object for use as the Time string in the timeline.
	public transform( value: Date ) : string {

		var hours = value.getHours();
		var minutes = value.getMinutes();
		var timezone = this.getTimezone( value );
		var period = ( hours < 12 )
			? "AM"
			: "PM"
		;

		var normalizedHours = ( ( hours % 12 ) || 12 );
		var normalizedMinuets = ( "0" + minutes ).slice( -2 );

		return( `${ normalizedHours }:${ normalizedMinuets } ${ period } ${ timezone }` );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I get the timezone abbreviation from the given date.
	private getTimezone( value: Date ) : string {

		var timezone = value.toTimeString().match( /\(([\w\s-]+)\)/ )[ 1 ];

		// The timezone portion of the time-string is expected to be an abbreviation
		// like "EDT". However, on some computers, that value is being reported as a long
		// string, like "Eastern Daylight Time". In those cases, let's convert the long
		// string to an abbreviation.
		if ( timezone.includes( " " ) || timezone.includes( "-" ) ) {

			timezone = timezone
				.match( /\b[a-z]/gi ) // Start of word-boundary letters.
				.join( "" )
			;

		}

		return( timezone );

	}

}
