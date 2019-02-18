
// Import the core angular services.
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { OnDestroy } from "@angular/core";
import { OnInit } from "@angular/core";

// Import the application services.

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "rca-modal",
	outputs: [ "closeEvents: close" ],
	styleUrls: [ "./rca-modal.component.less" ],
	templateUrl: "./rca-modal.component.htm"
})
export class RcaModalComponent implements OnInit, OnDestroy {

	public closeEvents: EventEmitter<void>;

	// I initialize the rca-modal component.
	constructor() {

		this.closeEvents = new EventEmitter();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public close() : void {

		this.closeEvents.emit();

	}


	public ngOnDestroy() : void {

		// HACK: This is used to manage scrolling on the main page while the modal window
		// is open. Long-term, this should managed by the app-view.
		document.body.style.overflow = null;

	}


	public ngOnInit() : void {

		// HACK: This is used to manage scrolling on the main page while the modal window
		// is open. Long-term, this should managed by the app-view.
		document.body.style.overflow = "hidden";

	}

}
