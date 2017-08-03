
// Import the core angular services.
import { ChangeDetectionStrategy } from "@angular/core";
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { SimpleChanges } from "@angular/core";

// Import the application services.
import { _ } from "./lodash-extended";

interface DateOption {
	id: number;
	description: string;
}

@Component({
	selector: "bn-date-time",
	inputs: [ "value" ],
	outputs: [ "valueChange" ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [ "./date-time.component.css" ],
	templateUrl: "./date-time.component.htm"
})
export class DateTimeComponent {

	public dayOptions: DateOption[];
	public form: {
		year: DateOption;
		month: DateOption;
		day: DateOption;
		hour: DateOption;
		minute: DateOption;
	};
	public hourOptions: DateOption[];
	public minuteOptions: DateOption[];
	public monthOptions: DateOption[];
	public value: Date;
	public valueChange: EventEmitter<Date | null>;
	public yearOptions: DateOption[];


	// I initialize the app component.
	constructor() {

		var now = new Date();

		this.value = null;
		this.valueChange = new EventEmitter();

		this.form = {
			year: null,
			month: null,
			day: null,
			hour: null,
			minute: null
		};

		this.yearOptions = this.fromRange( ( now.getFullYear() - 1 ), ( now.getFullYear() + 1 ) );
		this.monthOptions = this.getMonthOptions();
		this.dayOptions = this.fromRange( 1, 31 );
		this.hourOptions = this.getHourOptions();
		this.minuteOptions = this.fromRange( 0, 59 );

	}


	// ---
	// PUBLIC METHODS.
	// ---


	// I take the ngModel changes and emit any relevant value updates.
	public applyFormUpdates() : void {

		// If all of the values have been selected, we should be able to calculated a new
		// date from the individual pieces.
		if ( 
			this.form.year && 
			this.form.month && 
			this.form.day && 
			this.form.hour && 
			this.form.minute
			) {

			var selectedDate = new Date(
				this.form.year.id,
				this.form.month.id,
				this.form.day.id,
				this.form.hour.id,
				this.form.minute.id,
				0
			);

			// If the month is an unexpected value, it means the year / month / date 
			// combination is not value. Set the date to zero in order to rollback to
			// the previous month.
			if ( selectedDate.getMonth() !== this.form.month.id ) {

				selectedDate.setDate( 0 ); // Rolls back to last day of previous month.

			}

			// Because this component uses one-way data binding, we can't really keep 
			// the form rendered with the selected values because we don't know if the 
			// calling context is going to want to keep that value. And, if it doesn't,
			// we'll have no way of knowing because the incoming value won't trigger any
			// change event. As such, we have to reset the form values and then wait for
			// an input change event to re-render them.
			this.value = null;
			this.form.year = null;
			this.form.month = null;
			this.form.day = null;
			this.form.hour = null;
			this.form.minute = null;

			this.valueChange.emit( selectedDate );

		// If we are missing values, but the input value is a known date, then it means 
		// the user is moving the date from a known to an unknown state.
		} else if ( this.value instanceof Date ) {

			this.valueChange.emit( null );

		}

	}


	// I return the number of days in the currently-selected month.
	public getDaysInMonth() : number {

		if ( ! this.form.year || ! this.form.month ) {

			return( this.dayOptions.length );

		}

		var testDate = new Date(
			this.form.year.id,
			( this.form.month.id + 1 ),
			0
		);

		return( testDate.getDate() );

	}


	// I apply the incoming changes to the local form model.
	public ngOnChanges( changes: SimpleChanges ) : void {

		if ( this.value && ! ( this.value instanceof Date ) ) {

			this.value = null;

		}

		if ( this.value ) {

			// Rebuild the year options based on the input. If the input is out of range,
			// we won't be able to properly render the form.
			this.yearOptions = this.fromRange( ( this.value.getFullYear() - 1 ), ( this.value.getFullYear() + 1 ) );

			this.form.year = _.find( this.yearOptions, [ "id", this.value.getFullYear() ] );
			this.form.month = _.find( this.monthOptions, [ "id", this.value.getMonth() ] );
			this.form.day = _.find( this.dayOptions, [ "id", this.value.getDate() ] );
			this.form.hour = _.find( this.hourOptions, [ "id", this.value.getHours() ] );
			this.form.minute = _.find( this.minuteOptions, [ "id", this.value.getMinutes() ] );

		} else {

			this.form.year = null;
			this.form.month = null;
			this.form.day = null;
			this.form.hour = null;
			this.form.minute = null;

		}		

	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I get the date options based on the given range.
	private fromRange( start: number, end: number ) : DateOption[] {

		var options = _.range( start, ( end + 1 ) /* exclusive. */ ).map(
			( value: number ) : DateOption => {

				return({
					id: value,
					description: ( "0" + value.toString() ).slice( -2 )
				});

			}
		);

		return( options );

	}


	// I get the hour options, id starts at 0.
	private getHourOptions() : DateOption[] {

		var options = _.range( 0, 24 /* exclusive. */ ).map(
			( value: number ) : DateOption => {

				var description = ( ( value % 12 ) || 12 ).toString();

				if ( value < 12 ) {

					description += " AM";

				} else {

					description += " PM";

				}

				return({
					id: value,
					description: description
				});

			}
		);

		return( options );

	}


	// I get the month options, id starts at zero.
	private getMonthOptions() : DateOption[] {

		var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		var options = months.map(
			( monthAsString: string, index: number ) : DateOption => {

				return({
					id: index,
					description: monthAsString
				});

			}
		);

		return( options );

	}

}
