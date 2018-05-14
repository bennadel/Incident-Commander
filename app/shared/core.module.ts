
// Import the core angular services.
import { HashLocationStrategy } from "@angular/common";
import { Location } from "@angular/common";
import { LocationStrategy } from "@angular/common";
import { NgModule } from "@angular/core";
import { Title } from "@angular/platform-browser";

// Import the application components and services.
import { CacheService } from "./services/cache.service";
import { ClipboardService } from "./services/clipboard.service";
import { IncidentGateway } from "./services/incident.gateway";
import { IncidentService } from "./services/incident.service";
import { QuoteService } from "./services/quote.service";
import { SlackSerializer } from "./services/slack-serializer";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// The goal of the CoreModule is to organize providers for the root of the application.
// This module should NOT contain any declarations (those are in the SharedModule).
@NgModule({
	providers: [
		CacheService,
		ClipboardService,
		IncidentGateway,
		IncidentService,
		Location,
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy
		},
		QuoteService,
		SlackSerializer,
		Title
	]
})
export class CoreModule {
	// ...
}
