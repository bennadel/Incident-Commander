
// Import the core angular services.
import { BrowserModule } from "@angular/platform-browser";
import { HashLocationStrategy } from "@angular/common";
import { Location } from "@angular/common";
import { LocationStrategy } from "@angular/common";
import { NgModule } from "@angular/core";
import { Title } from "@angular/platform-browser";

// Import the application components and services.
import { AppViewComponent } from "./views/app-view.component";
import { AppViewModule } from "./views/app-view.module";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@NgModule({
	imports: [
		AppViewModule,
		BrowserModule
	],
	providers: [
		Location,
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy
		},
		Title
	],
	bootstrap: [
		AppViewComponent
	]
})
export class AppModule {
	// ...
}
