
// Import the core angular services.
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

// Import the root module for bootstrapping.
import { AppModule } from "./app.module";

enableProdMode();
platformBrowserDynamic().bootstrapModule( AppModule );
