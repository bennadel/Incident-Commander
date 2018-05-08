
// Import the core angular services.
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HashLocationStrategy } from "@angular/common";
import { Location } from "@angular/common";
import { LocationStrategy } from "@angular/common";
import { NgModule } from "@angular/core";
import { Title } from "@angular/platform-browser";

// Import the application components and services.
import { AppComponent } from "./app.component";
import { DateTimeComponent } from "./date-time.component";
import { TimelineDatePipe } from "./timeline-date.pipe";
import { TimelineSortPipe } from "./timeline-sort.pipe";
import { TimelineTimePipe } from "./timeline-time.pipe";

@NgModule({
	bootstrap: [ AppComponent ],
	imports: [ BrowserModule, FormsModule ],
	declarations: [ 
		AppComponent,
		DateTimeComponent,
		TimelineDatePipe,
		TimelineSortPipe,
		TimelineTimePipe
	],
	providers: [
		Location,
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy
		},
		Title
	]
})
export class AppModule {
	// ...
}
