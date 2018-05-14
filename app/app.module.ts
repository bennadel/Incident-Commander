
// Import the core angular services.
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

// Import the application components and services.
import { AppViewComponent } from "./views/app-view.component";
import { AppViewModule } from "./views/app-view.module";
import { CoreModule } from "./shared/core.module";

@NgModule({
	imports: [
		AppViewModule,
		BrowserModule,
		CoreModule
	],
	bootstrap: [
		AppViewComponent
	]
})
export class AppModule {
	// ...
}
