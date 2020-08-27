
// Import the core angular services.
import { Pipe } from "@angular/core";
import { PipeTransform } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Pipe({
	name: "timelineDate",
	pure: true
})
export class TimelineDatePipe implements PipeTransform {

	private monthNames: string[];


	// I initialize the timeline data pipe service.
	constructor() {

		this.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

	}

	
	// ---
	// PUBLIC METHODS.
	// ---


	// I format the given Date object for use as the Date string in the timeline.
	public transform( value: Date ) : string {

		var month = value.getMonth();
		var day = value.getDate();

		return( `${ this.monthNames[ month ] } ${ day }` );

	}

}
