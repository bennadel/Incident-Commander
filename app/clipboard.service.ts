
// Import the core angular services.
import { Injectable } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface SelectionState {
	ranges: Range[];
	activeElement: Element;
}

@Injectable({
	providedIn: "root"
})
export class ClipboardService {

	// I initialize the clipboard service.
	constructor() {
		// ...
	}

	// ---
	// PUBLIC METHODS.
	// ---

	public async copy( value: string ) : Promise<string> {

		var textarea: HTMLTextAreaElement = null;

		try {

			// When we create the off-page textarea for the copy operation, we're going
			// to lose the current selection on the page. As such, we want to capture the
			// current selection state to that we can reinstate it after our copy
			// operatrion has completed.
			var selectionBeforeCopy = this.getCurrentSelection();

			// In order to execute the "Copy" command, we actually have to have a
			// "selection" in the currently rendered document. As such, we're going to
			// inject a Textarea element and .select() it in order to force a selection.
			// --
			// NOTE: This Textarea is being rendered off-screen.
			textarea = document.createElement( "textarea" );
			textarea.style.height = "0px";
			textarea.style.left = "-100px";
			textarea.style.opacity = "0";
			textarea.style.position = "fixed";
			textarea.style.top = "-100px";
			textarea.style.width = "0px";
			document.body.appendChild( textarea );

			// Set and select the value (creating an active Selection range).
			textarea.value = value;
			textarea.select();

			// Ask the browser to copy the current selection to the clipboard.
			document.execCommand( "copy" );

			// Now that we've copied the selected text, reinstate previous selection.
			this.reinstateCurrentSelection( selectionBeforeCopy );

			return( value );

		} finally {

			// Cleanup - remove the Textarea from the DOM if it was injected.
			if ( textarea && textarea.parentNode ) {

				textarea.parentNode.removeChild( textarea );

			}

		}

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I get the current selection state of the document.
	private getCurrentSelection() : SelectionState {

		var selection = document.getSelection();
		var ranges: Range[] = [];
		var activeElement = document.activeElement;

		for ( var i = 0 ; i < selection.rangeCount ; i++ ) {

			ranges.push( selection.getRangeAt( i ) );

		}

		return({
			ranges,
			activeElement
		});

	}


	// I reinstate the given selection state on the current document.
	private reinstateCurrentSelection( currentSelection: SelectionState ) : void {

		var selection = document.getSelection();
		var ranges = currentSelection.ranges;
		var activeElement = currentSelection.activeElement;

		// Reset and re-apply the ranges to the Selection.
		if ( ranges.length ) {

			selection.removeAllRanges();
			ranges.forEach(
				( range ) => {

					selection.addRange( range );

				}
			);

		}

		// Re-focus the active element.
		if ( typeof( ( <any>activeElement ).focus ) === "function" ) {

			( <any>activeElement ).focus();

		}

	} 

}
