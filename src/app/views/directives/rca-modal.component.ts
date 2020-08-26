
// Import the core angular services.
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { OnDestroy } from "@angular/core";
import { OnInit } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "rca-modal",
	inputs: [ "value" ],
	outputs: [ "closeEvents: close" ],
	host: {
		"(document:keydown.escape)": "close()"
	},
	styleUrls: [ "./rca-modal.component.less" ],
	templateUrl: "./rca-modal.component.html"
})
export class RcaModalComponent implements OnInit, OnDestroy {

	public closeEvents: EventEmitter<void>;
	public value!: string;
	
	// I initialize the rca-modal component.
	constructor() {

		this.closeEvents = new EventEmitter();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I emit a close event on the modal.
	public close() : void {

		this.closeEvents.emit();

	}


	// I get called once when the component is being destroyed.
	public ngOnDestroy() : void {

		// HACK: This is used to manage scrolling on the main page while the modal window
		// is open. Long-term, this should managed by the app-view.
		document.body.style.overflow = null;

	}


	// I get called once after the inputs have been bound for the first time.
	public ngOnInit() : void {

		// HACK: This is used to manage scrolling on the main page while the modal window
		// is open. Long-term, this should managed by the app-view.
		document.body.style.overflow = "hidden";

	}

}
