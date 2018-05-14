
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
		var timezone = value.toTimeString().match( /\((\w+)\)/ )[ 1 ];
		var period = ( hours < 12 )
			? "AM"
			: "PM"
		;

		var normalizedHours = ( ( hours % 12 ) || 12 );
		var normalizedMinuets = ( "0" + minutes ).slice( -2 );

		return( `${ normalizedHours }:${ normalizedMinuets } ${ period } ${ timezone }` );

	}

}
