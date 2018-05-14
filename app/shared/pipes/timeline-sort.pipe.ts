
// Import the core angular services.
import { Pipe } from "@angular/core";
import { PipeTransform } from "@angular/core";

// Import the application services.
import { Update } from "../services/incident.service";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Pipe({
	name: "timelineSort",
	pure: true
})
export class TimelineSortPipe implements PipeTransform {

	// I return a sorted version of the updates based on the given direction.
	public transform( updates: Update[], direction: "asc" | "desc" ) : Update[] {

		var sortedUpdates = updates.slice();
		sortedUpdates.sort(
			( a: Update, b: Update ) : number => {

				// Sort ascending.
				if ( direction === "asc" ) {

					if ( a.createdAt < b.createdAt ) {

						return( -1 );

					} else if ( a.createdAt > b.createdAt ) {

						return( 1 );

					}

				// Sort descending.
				} else {

					if ( a.createdAt > b.createdAt ) {

						return( -1 );

					} else if ( a.createdAt < b.createdAt ) {

						return( 1 );

					}

				}
				
			}
		);

		return( sortedUpdates );

	}

}
