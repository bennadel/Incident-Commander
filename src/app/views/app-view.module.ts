
// Import the core angular services.
import { NgModule } from "@angular/core";

// Import the application components and services.
import { AppViewComponent } from "./app-view.component";
import { RcaModalComponent } from "./directives/rca-modal.component";
import { SharedModule } from "~/app/shared/shared.module";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		AppViewComponent,
		RcaModalComponent
	]
})
export class AppViewModule {
	// ...
}
