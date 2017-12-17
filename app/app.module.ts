
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
import { CacheService } from "./cache.service";
import { DateTimeComponent } from "./date-time.component";
import { IncidentGateway } from "./incident.gateway";
import { IncidentService } from "./incident.service";
import { QuoteService } from "./quote.service";
import { SlackSerializer } from "./slack-serializer";
import { TimelineDatePipe } from "./timeline-date.pipe";
import { TimelineTimePipe } from "./timeline-time.pipe";

@NgModule({
	bootstrap: [ AppComponent ],
	imports: [ BrowserModule, FormsModule ],
	declarations: [ 
		AppComponent,
		DateTimeComponent,
		TimelineDatePipe,
		TimelineTimePipe
	],
	providers: [
		// Core providers.
		Location,
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy
		},
		Title,

		// Application providers.
		CacheService,
		IncidentGateway,
		IncidentService,
		QuoteService,
		SlackSerializer
	]
})
export class AppModule {
	// ...
}
