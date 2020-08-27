
// Import the core angular services.
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

// Import the application components and services.
import { DateTimeComponent } from "./directives/date-time/date-time.component";
import { TimelineDatePipe } from "./pipes/timeline-date.pipe";
import { TimelineSortPipe } from "./pipes/timeline-sort.pipe";
import { TimelineTimePipe } from "./pipes/timeline-time.pipe";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

var sharedModules = [
	CommonModule,
	FormsModule
];

var sharedDeclarations = [
	DateTimeComponent,
	TimelineDatePipe,
	TimelineSortPipe,
	TimelineTimePipe
];

// The goal of the SharedModule is to organize declarations and other modules that will
// be imported into other modules (for rendering). This module should NOT contain any
// service providers (those are in the CoreModule).
@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	exports: [
		...sharedDeclarations,
		...sharedModules
	],
	declarations: [
		...sharedDeclarations
	]
})
export class SharedModule {
	// ...
}
