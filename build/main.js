webpackJsonp([1],{

/***/ 149:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
var common_1 = __webpack_require__(17);
var platform_browser_1 = __webpack_require__(25);
// Import the application services.
var cache_service_1 = __webpack_require__(150);
var clipboard_service_1 = __webpack_require__(151);
var incident_service_1 = __webpack_require__(152);
var quote_service_1 = __webpack_require__(154);
var slack_serializer_1 = __webpack_require__(155);
var timezones_1 = __webpack_require__(377);
var lodash_extended_1 = __webpack_require__(57);
var NEW_INCIDENT_ID_OVERLOAD = "new";
var AppViewComponent = /** @class */ (function () {
    // I initialize the app component.
    function AppViewComponent(cacheService, clipboardService, incidentService, location, quoteService, slackSerializer, title) {
        // Store injected properties.
        this.cacheService = cacheService;
        this.clipboardService = clipboardService;
        this.incidentService = incidentService;
        this.location = location;
        this.quoteService = quoteService;
        this.slackSerializer = slackSerializer;
        this.title = title;
        this.priorities = this.incidentService.getPriorities();
        this.statuses = this.incidentService.getStatuses();
        this.incident = null;
        this.incidentID = null;
        this.subscription = null;
        this.updateSortDirection = "desc";
        this.timezones = timezones_1.timezones;
        this.form = {
            version: this.getDefaultVersion(),
            description: "",
            customerType: "",
            customerCount: "",
            internalTeam: "",
            zendeskTicket: "",
            priorityID: this.priorities[0].id,
            startedAt: null,
            videoLink: "",
            updateStatusID: this.statuses[0].id,
            updateDescription: "",
            slackSize: 5,
            slackFormat: "compact",
            slackTimezone: this.getDefaultTimezone(),
            slack: ""
        };
        this.editForm = {
            update: null,
            statusID: null,
            createdAt: null,
            description: null
        };
        this.duration = {
            hours: 0,
            minutes: 0
        };
        this.quote = this.quoteService.getRandomQuote();
        this.globalInsight = "";
    }
    // ---
    // PUBLIC METHODS.
    // ---
    // I add a new Update to the incident.
    AppViewComponent.prototype.addUpdate = function () {
        var _this = this;
        // Ignore any empty update.
        if (!this.form.updateDescription) {
            return;
        }
        var update = {
            id: Date.now(),
            status: lodash_extended_1._.find(this.statuses, ["id", this.form.updateStatusID]),
            createdAt: new Date(),
            description: this.form.updateDescription
        };
        // Optimistically apply the changes to the local incident.
        // --
        // Automatically apply the status of the new update to the overall status of 
        // the incident (assuming that statuses generally move "forward" as updates are
        // recorded).
        this.incident.status = update.status;
        this.incident.updates.push(update);
        this.incident.updates.sort(this.sortCreatedAtDesc);
        // Optimistically update the Slack message formatting.
        this.form.slack = this.slackSerializer.serialize(this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone);
        // Reset the content, but leave the status selection - it will likely be used by
        // the subsequent updates.
        this.form.updateDescription = "";
        // Finally, persist the incident changes.
        this.incidentService.saveIncident(this.incident);
        // For convenience, copy the slack message directly to the user's clipboard.
        this.clipboardService.copy(this.form.slack).then(function (value) {
            _this.setGlobalInsight("Slack message copied to clipboard.");
        }, function (error) {
            console.warn("Unable to copy value to clipboard.");
            console.error(error);
        });
    };
    // I re-apply the form changes to the incident.
    AppViewComponent.prototype.applyForm = function () {
        // If the startedAt form input emitted a NULL value, let's overwrite it with the
        // known value in the incident - we don't want any of the dates to be null.
        this.form.startedAt = (this.form.startedAt || this.incident.startedAt);
        // Optimistically apply the changes to the local incident.
        this.incident.version = this.form.version;
        this.incident.description = this.form.description;
        this.incident.customerType = this.form.customerType;
        this.incident.customerCount = this.form.customerCount;
        this.incident.internalTeam = this.form.internalTeam;
        this.incident.zendeskTicket = this.form.zendeskTicket;
        this.incident.priority = lodash_extended_1._.find(this.priorities, ["id", this.form.priorityID]);
        this.incident.startedAt = this.form.startedAt;
        this.incident.timezoneID = this.form.slackTimezone.id;
        this.incident.videoLink = this.form.videoLink;
        // Optimistically update the Slack message formatting.
        this.form.slack = this.slackSerializer.serialize(this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone);
        this.updateDuration();
        this.updateTitle();
        // Finally, persist the incident changes.
        this.incidentService.saveIncident(this.incident);
        // Cache the selected timezone so it will default during page refresh or at the
        // start of the next incident.
        this.cacheService.set("slackTimezone", this.form.slackTimezone);
    };
    // I cancel the editing of the selected Update.
    AppViewComponent.prototype.cancelEdit = function () {
        this.editForm.update = null;
    };
    // I delete the currently active incident.
    AppViewComponent.prototype.deleteIncident = function () {
        if (!confirm("Are you sure you want to delete this incident? This cannot be undone!")) {
            return;
        }
        // If we're subscribed to the current incident, unsubscribe.
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this.incidentService.deleteIncident(this.incident.id);
        // Optimistically apply the changes to the local state.
        this.incidentID = null;
        this.incident = null;
        // Redirect back to the introductory view.
        this.location.go("");
    };
    // I delete the given update.
    AppViewComponent.prototype.deleteUpdate = function (update) {
        if (!confirm("Delete: " + update.description + "?")) {
            return;
        }
        // Optimistically apply the changes to the local incident.
        this.incident.updates = lodash_extended_1._.without(this.incident.updates, update);
        // Optimistically update the Slack message formatting.
        this.form.slack = this.slackSerializer.serialize(this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone);
        // Finally, persist the incident changes.
        this.incidentService.saveIncident(this.incident);
    };
    // I select the given Update for editing.
    AppViewComponent.prototype.editUpdate = function (update) {
        this.editForm.update = update;
        this.editForm.statusID = update.status.id;
        this.editForm.createdAt = update.createdAt;
        this.editForm.description = update.description;
    };
    // I get called once, after the component has been loaded.
    AppViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.title.setTitle("Incident Commander");
        // If there is a location path value, it should contain a persisted incident, 
        // try to load the incident from the path.
        if (this.location.path()) {
            this.applyLocation();
        }
        // Listen for changes to the location. This may indicate that we need to switch
        // over to a different incident.
        this.location.subscribe(function (value) {
            _this.applyLocation();
        });
        this.setupDurationInterval();
    };
    // I save the changes to the currently-selected Update.
    AppViewComponent.prototype.saveUpdateChanges = function () {
        var update = this.editForm.update;
        // Since the createdAt date is required for proper rendering and sorting of the
        // updates collection, we're only going to copy it back to the update if it is 
        // valid (otherwise fall-back to the existing date).
        this.editForm.createdAt = (this.editForm.createdAt || update.createdAt);
        // Optimistically update the incident locally.
        update.status = lodash_extended_1._.find(this.statuses, ["id", this.editForm.statusID]);
        update.description = this.editForm.description;
        update.createdAt = this.editForm.createdAt;
        this.incident.updates.sort(this.sortCreatedAtDesc);
        // If we're editing the most recent status update, let's make sure we mirror the
        // selected status in the overall incident as well as the in new update form 
        // (since the next update is more likely to match the most recent update).
        if (update === lodash_extended_1._.last(this.incident.updates)) {
            this.incident.status = update.status;
            this.form.updateStatusID = update.status.id;
        }
        // Optimistically update the Slack message formatting.
        this.form.slack = this.slackSerializer.serialize(this.incident, this.form.slackSize, this.form.slackFormat, this.form.slackTimezone);
        this.editForm.update = null;
        // Finally, persist the incident changes.
        this.incidentService.saveIncident(this.incident);
    };
    // I update the sort-direction for the timeline.
    // --
    // NOTE: Actual sorting is done by a Pipe in the template.
    AppViewComponent.prototype.sortUpdates = function (direction) {
        this.updateSortDirection = direction;
    };
    // I start a new incident.
    AppViewComponent.prototype.startNewIncident = function () {
        var _this = this;
        // Only prompt the user for confirmation if there is an existing incident ID that
        // we would be navigating away from.
        if (this.incidentID && !confirm("Start a new incident (and clear the current incident data)?")) {
            return;
        }
        // If we're currently subscribed to a different incident, unsubscribe.
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        // CAUTION: The incidentID is overloaded. Since the incident service provides a
        // new ID as part of the creation of a new service, we don't have a great way to
        // differentiate the "Loading" page for the first-time incident. As such, we're
        // overloading the incidentID to hold a special "new" value, which will indicate 
        // the selection (and subsequent loading) of a new incident. This value is really
        // only used in the VIEW to show the proper template.
        this.incidentID = NEW_INCIDENT_ID_OVERLOAD;
        this.incident = null;
        // Create, persist, and return the new incident.
        this.incidentService
            .startNewIncident(this.getDefaultVersion(), this.getDefaultTimezone().id)
            .then(function (incident) {
            _this.incidentID = incident.id;
            _this.incident = incident;
            // Move the new incident data into the form.
            _this.form.version = _this.incident.version;
            _this.form.description = _this.incident.description;
            _this.form.customerType = _this.incident.customerType;
            _this.form.customerCount = _this.incident.customerCount;
            _this.form.internalTeam = _this.incident.internalTeam;
            _this.form.zendeskTicket = _this.incident.zendeskTicket;
            _this.form.priorityID = _this.incident.priority.id;
            _this.form.startedAt = _this.incident.startedAt;
            _this.form.videoLink = _this.incident.videoLink;
            _this.form.updateStatusID = _this.statuses[0].id;
            _this.form.updateDescription = "";
            _this.form.slack = _this.slackSerializer.serialize(_this.incident, _this.form.slackSize, _this.form.slackFormat, _this.form.slackTimezone);
            // While this has nothing to do with the incident, let's cycle the 
            // header quote whenever a new incident is started.
            _this.quote = _this.quoteService.getRandomQuote();
            _this.updateDuration();
            _this.updateTitle();
            _this.updateSubscription();
            // Update the location so that this URL can now be copy-and-pasted
            // to other incident commanders.
            _this.location.go(_this.incidentID);
        });
    };
    // I switch over to the given version of the intake form.
    AppViewComponent.prototype.useVersion = function (version) {
        this.form.version = this.cacheService.set("version", version);
        this.applyForm();
    };
    // ---
    // PRIVATE METHODS.
    // ---
    // I attempt to parse the incident ID from the location and use it to load the 
    // given incident into the current application context.
    AppViewComponent.prototype.applyLocation = function () {
        var _this = this;
        var path = this.location.path();
        // The location events get triggered more often than we need them to be. As such,
        // if the path already matches the incident ID, just ignore this request.
        if (this.incidentID === path) {
            return;
        }
        // If we're currently subscribed to a different incident, unsubscribe.
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this.incidentID = path;
        this.incident = null;
        // Attempt to load the incident (may not exist).
        this.incidentService
            .getIncident(this.incidentID)
            .then(function (incident) {
            _this.incident = incident;
            // Move the new incident data into the form.
            _this.form.version = _this.incident.version;
            _this.form.description = _this.incident.description;
            _this.form.customerType = _this.incident.customerType;
            _this.form.customerCount = _this.incident.customerCount;
            _this.form.internalTeam = _this.incident.internalTeam;
            _this.form.zendeskTicket = _this.incident.zendeskTicket;
            _this.form.priorityID = _this.incident.priority.id;
            _this.form.startedAt = _this.incident.startedAt;
            _this.form.videoLink = _this.incident.videoLink;
            _this.form.updateStatusID = _this.incident.updates.length
                ? lodash_extended_1._.last(_this.incident.updates).status.id
                : _this.statuses[0].id;
            _this.form.updateDescription = "";
            // Since the timezoneID was added to the Incident interface after 
            // data had already been persisted, the ID may not be valid. As 
            // such, we'll OR with whatever timezone is currently selected.
            _this.form.slackTimezone = lodash_extended_1._.find(_this.timezones, {
                id: (_this.incident.timezoneID || _this.form.slackTimezone.id)
            });
            _this.form.slack = _this.slackSerializer.serialize(_this.incident, _this.form.slackSize, _this.form.slackFormat, _this.form.slackTimezone);
            // While this has nothing to do with the incident, let's cycle the 
            // header quote whenever a new incident is started.
            _this.quote = _this.quoteService.getRandomQuote();
            _this.updateDuration();
            _this.updateTitle();
            _this.updateSubscription();
            // Update the location so that this URL can now be copy-and-pasted
            // to other incident commanders.
            _this.location.go(_this.incidentID);
        })
            .catch(function (error) {
            console.log("Incident Failed To Load");
            console.error(error);
            console.log("ID:", _this.incidentID);
            _this.incidentID = null;
            _this.incident = null;
            // Redirect back to the introductory view.
            _this.location.go("");
        });
    };
    // I return the default timezone for the Slack rendering. This will pull from the
    // cache or default to EST.
    AppViewComponent.prototype.getDefaultTimezone = function () {
        // By default, we want to use the Eastern timezone (since this is what
        // InVision uses for its incident rendering). So when we pick the default
        // timezone, we want to make sure we pick the right Eastern timezone if we
        // are in Daylight time or Standard time
        var defaultTZID;
        if (this.isDST()) {
            defaultTZID = "3ca59164-cc12-444d-aa11-0ca961e17e08";
        }
        else {
            defaultTZID = "1de70413-cdc4-4eee-baea-6acb6bf41f4f";
        }
        var defaultTimezone = lodash_extended_1._.find(this.timezones, {
            id: defaultTZID,
        });
        // Now that we have our default, let's check to see if there is a persisted
        // timezone in the cache set by the user.
        var cachedTimezone = this.cacheService.get("slackTimezone");
        // If there is a cached timezone, we want to actually search for the associated
        // timezone even though their value-objects will be the same. The reason for 
        // this is that the SELECT input will compare objects by REFERENCE, not by value,
        // which won't work if we return the cached version directly.
        if (cachedTimezone) {
            defaultTimezone = (lodash_extended_1._.find(this.timezones, cachedTimezone) || defaultTimezone);
        }
        return (defaultTimezone);
    };
    AppViewComponent.prototype.isDST = function () {
        var today = new Date();
        var jan = new Date(today.getFullYear(), 0, 1);
        var jul = new Date(today.getFullYear(), 6, 1);
        var stdTimeZoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        return today.getTimezoneOffset() < stdTimeZoneOffset;
    };
    // I return the default version of the intake form. This will pull from the cache.
    AppViewComponent.prototype.getDefaultVersion = function () {
        var cachedVersion = this.cacheService.get("version");
        return (cachedVersion || "general");
    };
    // I set the global insight message, then clear it after several seconds.
    AppViewComponent.prototype.setGlobalInsight = function (message) {
        var _this = this;
        this.globalInsight = message;
        setTimeout(function () {
            _this.globalInsight = "";
        }, 4000);
    };
    // I setup the duration interval that re-calculates the duration based on the start
    // time of the current incident.
    AppViewComponent.prototype.setupDurationInterval = function () {
        var _this = this;
        // Update the duration every 30-seconds. While the duration only has minute-level
        // granularity, doing it every half-minute reduced the changes of it being stale
        // for 2 minutes.
        setInterval(function () {
            _this.updateDuration();
        }, (1000 * 30));
        // Kick-off an update check immediately so we don't have to wait 30-seconds to 
        // render the duration for a persisted incident.
        this.updateDuration();
    };
    // I provide the comparator for the Update collection.
    // --
    // CAUTION: This function is passed by-reference, so "this" reference will not work
    // as expected in the context of this component.
    AppViewComponent.prototype.sortCreatedAtDesc = function (a, b) {
        if (a.createdAt <= b.createdAt) {
            return (-1);
        }
        else {
            return (1);
        }
    };
    // I periodically update the duration based on the incident start time.
    AppViewComponent.prototype.updateDuration = function () {
        var now = new Date();
        if (this.incident && (this.incident.startedAt <= now)) {
            var deltaSeconds = ((now.getTime() - this.incident.startedAt.getTime()) / 1000);
            var deltaMinutes = Math.floor(deltaSeconds / 60);
            var deltaHours = Math.floor(deltaSeconds / 60 / 60);
            this.duration.hours = deltaHours;
            this.duration.minutes = (deltaMinutes - (deltaHours * 60));
        }
        else {
            this.duration.hours = 0;
            this.duration.minutes = 0;
        }
    };
    // I update the incident subscription so it points to the currently-selected 
    // incident.
    // --
    // CAUTION: The subscription will trigger for BOTH local AND remote changes.
    AppViewComponent.prototype.updateSubscription = function () {
        var _this = this;
        this.subscription = this.incidentService
            .getIncidentAsStream(this.incidentID)
            .subscribe(function (incident) {
            _this.incident = incident;
            // Move the new incident data into the form.
            _this.form.version = _this.incident.version;
            _this.form.description = _this.incident.description;
            _this.form.customerType = _this.incident.customerType;
            _this.form.customerCount = _this.incident.customerCount;
            _this.form.internalTeam = _this.incident.internalTeam;
            _this.form.zendeskTicket = _this.incident.zendeskTicket;
            _this.form.priorityID = _this.incident.priority.id;
            _this.form.startedAt = _this.incident.startedAt;
            _this.form.videoLink = _this.incident.videoLink;
            _this.form.updateStatusID = _this.incident.updates.length
                ? lodash_extended_1._.last(_this.incident.updates).status.id
                : _this.statuses[0].id;
            // Since the timezoneID was added to the Incident interface after 
            // data had already been persisted, the ID may not be valid. As 
            // such, we'll OR with whatever timezone is currently selected.
            _this.form.slackTimezone = lodash_extended_1._.find(_this.timezones, {
                id: (_this.incident.timezoneID || _this.form.slackTimezone.id)
            });
            _this.form.slack = _this.slackSerializer.serialize(_this.incident, _this.form.slackSize, _this.form.slackFormat, _this.form.slackTimezone);
            _this.updateDuration();
            _this.updateTitle();
        }, function (error) {
            // This shouldn't really ever happen unless the incident is actually
            // deleted while in use.
            console.log("Incident Stream Failed");
            console.error(error);
        });
    };
    // I update the window title based on the current incident start date.
    AppViewComponent.prototype.updateTitle = function () {
        var yearValue = this.incident.startedAt.getFullYear().toString();
        var monthValue = (this.incident.startedAt.getMonth() + 1).toString(); // Adjust for zero-based month.
        var dayValue = this.incident.startedAt.getDate().toString();
        var hourValue = ((this.incident.startedAt.getHours() % 12) || 12).toString();
        var minuteValue = this.incident.startedAt.getMinutes().toString();
        var periodValue = (this.incident.startedAt.getHours() < 12)
            ? "AM"
            : "PM";
        // Ensure that we have two digits for some of the smaller fields.
        minuteValue = ("0" + minuteValue).slice(-2);
        this.title.setTitle("Incident: " + yearValue + "/" + monthValue + "/" + dayValue + " at " + hourValue + ":" + minuteValue + " " + periodValue);
    };
    AppViewComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            styles: [__webpack_require__(378)],
            template: __webpack_require__(379)
        }),
        __metadata("design:paramtypes", [cache_service_1.CacheService,
            clipboard_service_1.ClipboardService,
            incident_service_1.IncidentService,
            common_1.Location,
            quote_service_1.QuoteService,
            slack_serializer_1.SlackSerializer,
            platform_browser_1.Title])
    ], AppViewComponent);
    return AppViewComponent;
}());
exports.AppViewComponent = AppViewComponent;


/***/ }),

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
var CacheService = /** @class */ (function () {
    // I initialize the cache service.
    function CacheService() {
        this.keyPrefix = "incident-commander";
    }
    // ---
    // PUBLIC METHODS.
    // ---
    // I get the cached item stored at the given key, or null if it doesn't exist.
    CacheService.prototype.get = function (key) {
        var value = localStorage.getItem(this.keyPrefix + "-" + key);
        if (value === null) {
            return (null);
        }
        return (JSON.parse(value));
    };
    // I store the given value at the given key using JSON.stringify().
    CacheService.prototype.set = function (key, value) {
        localStorage.setItem(this.keyPrefix + "-" + key, JSON.stringify(value));
        return (value);
    };
    CacheService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [])
    ], CacheService);
    return CacheService;
}());
exports.CacheService = CacheService;


/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
var ClipboardService = /** @class */ (function () {
    // I initialize the clipboard service.
    function ClipboardService() {
        // ...
    }
    // ---
    // PUBLIC METHODS.
    // ---
    ClipboardService.prototype.copy = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var textarea, selectionBeforeCopy;
            return __generator(this, function (_a) {
                textarea = null;
                try {
                    selectionBeforeCopy = this.getCurrentSelection();
                    // In order to execute the "Copy" command, we actually have to have a
                    // "selection" in the currently rendered document. As such, we're going to
                    // inject a Textarea element and .select() it in order to force a selection.
                    // --
                    // NOTE: This Textarea is being rendered off-screen.
                    textarea = document.createElement("textarea");
                    textarea.style.height = "0px";
                    textarea.style.left = "-100px";
                    textarea.style.opacity = "0";
                    textarea.style.position = "fixed";
                    textarea.style.top = "-100px";
                    textarea.style.width = "0px";
                    document.body.appendChild(textarea);
                    // Set and select the value (creating an active Selection range).
                    textarea.value = value;
                    textarea.select();
                    // Ask the browser to copy the current selection to the clipboard.
                    document.execCommand("copy");
                    // Now that we've copied the selected text, reinstate previous selection.
                    this.reinstateCurrentSelection(selectionBeforeCopy);
                    return [2 /*return*/, (value)];
                }
                finally {
                    // Cleanup - remove the Textarea from the DOM if it was injected.
                    if (textarea && textarea.parentNode) {
                        textarea.parentNode.removeChild(textarea);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    // ---
    // PRIVATE METHODS.
    // ---
    // I get the current selection state of the document.
    ClipboardService.prototype.getCurrentSelection = function () {
        var selection = document.getSelection();
        var ranges = [];
        var activeElement = document.activeElement;
        for (var i = 0; i < selection.rangeCount; i++) {
            ranges.push(selection.getRangeAt(i));
        }
        return ({
            ranges: ranges,
            activeElement: activeElement
        });
    };
    // I reinstate the given selection state on the current document.
    ClipboardService.prototype.reinstateCurrentSelection = function (currentSelection) {
        var selection = document.getSelection();
        var ranges = currentSelection.ranges;
        var activeElement = currentSelection.activeElement;
        // Reset and re-apply the ranges to the Selection.
        if (ranges.length) {
            selection.removeAllRanges();
            ranges.forEach(function (range) {
                selection.addRange(range);
            });
        }
        // Re-focus the active element.
        if (typeof (activeElement.focus) === "function") {
            activeElement.focus();
        }
    };
    ClipboardService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [])
    ], ClipboardService);
    return ClipboardService;
}());
exports.ClipboardService = ClipboardService;


/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
var operators_1 = __webpack_require__(46);
var incident_gateway_1 = __webpack_require__(153);
var lodash_extended_1 = __webpack_require__(57);
var IncidentService = /** @class */ (function () {
    // I initialize the incident services.
    function IncidentService(incidentGateway) {
        this.incidentGateway = incidentGateway;
    }
    // ---
    // PUBLIC METHODS.
    // ---
    // I delete the incident with the given ID. Returns a Promise.
    IncidentService.prototype.deleteIncident = function (id) {
        return (this.incidentGateway.deleteIncident(id));
    };
    // I return the incident with the given ID. Returns a Promise.
    IncidentService.prototype.getIncident = function (id) {
        var _this = this;
        var promise = this.incidentGateway
            .readIncident(id)
            .then(function (dto) {
            return (_this.fromTransferObject(dto));
        });
        return (promise);
    };
    // I return the incident, with the given ID, as an observable stream. The returned
    // stream will emit the incident object any time that it changes (including the 
    // initial load of the incident).
    IncidentService.prototype.getIncidentAsStream = function (id) {
        var _this = this;
        // The incident gateway is going to be emitting data transfer objects. As such,
        // we need to map the DTOs into actual Incident objects.
        var stream = this.incidentGateway
            .readIncidentAsStream(id)
            .pipe(operators_1.map(function (dto) {
            return (_this.fromTransferObject(dto));
        }));
        return (stream);
    };
    // I return the incident priorities.
    IncidentService.prototype.getPriorities = function () {
        return ([
            {
                id: "P1",
                description: "All customers are affected by outage, vulnerability, or performance degradation."
            },
            {
                id: "P2",
                description: "Large segment of customers are affected by outage, vulnerability, or performance degradation."
            },
            {
                id: "P3",
                description: "Small segment of customers are affected by outage, vulnerability, or performance degradation."
            },
            {
                id: "P4",
                description: "Site performance degraded for some customers."
            },
            {
                id: "P5",
                description: "Potential issue, but customers are currently unaware."
            }
        ]);
    };
    // I return the incident statuses.
    IncidentService.prototype.getStatuses = function () {
        return ([
            {
                id: "Investigating",
                description: "We're still trying to figure out exactly what is wrong and haven't identified the cause of the issue yet."
            },
            {
                id: "Identified",
                description: "We've identified the cause of the issue and are working on a fix."
            },
            {
                id: "Monitoring",
                description: "We've released a fix for the issue but we're still monitoring to make sure the problem is indeed resolved."
            },
            {
                id: "Resolved",
                description: "We believe the issue is resolved and service is restored to normal levels again."
            }
        ]);
    };
    // I persist the given incident.
    IncidentService.prototype.saveIncident = function (incident) {
        if (!incident.id) {
            throw (new Error("IC.MissingID"));
        }
        var dto = this.toTransferObject(incident);
        var promise = this.incidentGateway.updateIncident(dto);
        return (promise);
    };
    // I start a new incident, persist it, and return it. Returns a Promise.
    IncidentService.prototype.startNewIncident = function (version, timezoneID) {
        var priorities = this.getPriorities();
        var statuses = this.getStatuses();
        var name = this.getNewName();
        var incident = {
            id: null,
            name: name,
            version: version,
            description: "",
            customerType: "",
            customerCount: "",
            internalTeam: "",
            zendeskTicket: "",
            priority: priorities[0],
            status: statuses[0],
            startedAt: new Date(),
            timezoneID: timezoneID,
            videoLink: "https://hangouts.google.com/hangouts/_/invisionapp.com/" + name,
            updates: []
        };
        var dto = this.toTransferObject(incident);
        var promise = this.incidentGateway
            .createIncident(dto)
            .then(function (id) {
            // Behind the scenes, the gateway will merge an auto-generated ID 
            // into the remote object. In order to mimic that structure, let's 
            // save the ID back into the new incident object locally before we
            // return it.
            incident.id = id;
            return (incident);
        });
        return (promise);
    };
    // ---
    // PRIVATE METHODS.
    // ---
    // I create a new incident from the given data transfer object. The DTO is the 
    // structure used by the incident gateway.
    IncidentService.prototype.fromTransferObject = function (dto) {
        var priorities = this.getPriorities();
        var statuses = this.getStatuses();
        var incident = {
            id: dto.id,
            name: dto.name,
            version: dto.version,
            description: dto.description,
            customerType: dto.customerType,
            customerCount: dto.customerCount,
            internalTeam: dto.internalTeam,
            zendeskTicket: dto.zendeskTicket,
            priority: lodash_extended_1._.find(priorities, ["id", dto.priorityID]),
            status: lodash_extended_1._.find(statuses, ["id", dto.statusID]),
            startedAt: new Date(dto.startedAt),
            timezoneID: dto.timezoneID,
            videoLink: dto.videoLink,
            updates: dto.updates.map(function (update) {
                return ({
                    id: update.id,
                    status: lodash_extended_1._.find(statuses, ["id", update.statusID]),
                    createdAt: new Date(update.createdAt),
                    description: update.description
                });
            })
        };
        return (incident);
    };
    // I generate a new name for an incident.
    IncidentService.prototype.getNewName = function () {
        return ("Incident-" + Date.now());
    };
    // I create a data transfer object (DTO) from the given incident. The DTO is the 
    // structure used by the incident gateway.
    IncidentService.prototype.toTransferObject = function (incident) {
        var dto = {
            id: incident.id,
            name: incident.name,
            version: incident.version,
            description: incident.description,
            customerType: incident.customerType,
            customerCount: incident.customerCount,
            internalTeam: incident.internalTeam,
            zendeskTicket: incident.zendeskTicket,
            priorityID: incident.priority.id,
            statusID: incident.status.id,
            startedAt: incident.startedAt.getTime(),
            timezoneID: incident.timezoneID,
            videoLink: incident.videoLink,
            updates: incident.updates.map(function (update) {
                return ({
                    id: update.id,
                    statusID: update.status.id,
                    createdAt: update.createdAt.getTime(),
                    description: update.description
                });
            })
        };
        return (dto);
    };
    IncidentService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [incident_gateway_1.IncidentGateway])
    ], IncidentService);
    return IncidentService;
}());
exports.IncidentService = IncidentService;


/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var firebase = __webpack_require__(118);
var core_1 = __webpack_require__(5);
var rxjs_1 = __webpack_require__(38);
// Import these libraries for their side-effects.
__webpack_require__(122);
var IncidentGateway = /** @class */ (function () {
    // I initialize the incident gateway.
    function IncidentGateway() {
        this.firebaseApp = firebase.initializeApp({
            apiKey: "AIzaSyAS8JEXbdmEQyn_IRHCOiJwr3ewhmo3Y7s",
            authDomain: "incident-commander.firebaseapp.com",
            databaseURL: "https://incident-commander.firebaseio.com",
            projectId: "incident-commander",
            storageBucket: "incident-commander.appspot.com",
            messagingSenderId: "1043941703596"
        });
        this.firebaseDB = this.firebaseApp.database();
    }
    // ---
    // PUBLIC METHODS.
    // ---
    // I persist the given incident data transfer object. Returns a Promise with ID of
    // newly persisted incident when the action is completed locally.
    IncidentGateway.prototype.createIncident = function (dto) {
        var ref = this.firebaseDB.ref("/incidents/" + this.getNewID());
        // Let's merge the key from the ref back into the incident as the ID in order to
        // make the incident easier to consume in future contexts.
        var identifiedDTO = Object.assign({}, dto, {
            id: ref.key
        });
        // NOTE: This will write locally and attempt to save the data to the remote 
        // Firebase server. It returns a Promise that will resolve when the data is 
        // persisted remotely. For now, we're only going to care about the local 
        // operation (hence returning a promise with the key).
        ref
            .set(identifiedDTO)
            .catch(function (error) {
            console.log("Create Incident Failed");
            console.error(error);
            console.log("Transfer Object:");
            console.dir(identifiedDTO);
        });
        return (Promise.resolve(ref.key));
    };
    // I delete the incident with the given ID. Returns a promise when the action is 
    // completed locally.
    IncidentGateway.prototype.deleteIncident = function (id) {
        // NOTE: This will delete locally and attempt to remove the data to the remote
        // Firebase server. It returns a Promise that will resolve when the data is 
        // deleted remotely. For now, we're only going to care about the local operation.
        this.firebaseDB.ref("/incidents/" + id)
            .remove()
            .catch(function (error) {
            console.log("Delete Incident Failed");
            console.error(error);
            console.log("ID:", id);
        });
        return (Promise.resolve());
    };
    // I read the incident with the given ID. Returns a promise when the data is either
    // read locally, or pulled from the remote server (whichever is first).
    IncidentGateway.prototype.readIncident = function (id) {
        var promise = this.firebaseDB
            .ref("/incidents/" + id)
            .once("value")
            .then(function (snapshot) {
            if (!snapshot.exists()) {
                throw (new Error("IC.NotFound"));
            }
            var dto = snapshot.val();
            // Firebase doesn't really handle Arrays in a "normal" way (since it
            // favors Objects for collections). As such, let's ensure that the 
            // Updates collection exists before we return it.
            dto.updates = (dto.updates || []);
            // These fields were added after data was being persisted. As such, 
            // they may not exist on all the given data transfer objects.
            dto.version = (dto.version || "general");
            dto.timezoneID = (dto.timezoneID || "");
            dto.customerType = (dto.customerType || "");
            dto.customerCount = (dto.customerCount || "");
            dto.internalTeam = (dto.internalTeam || "");
            dto.zendeskTicket = (dto.zendeskTicket || "");
            return (dto);
        });
        // NOTE: We have to cast to the correct type of Promise otherwise we get a 
        // mismatch due to the use of Promise<any> in the Firebase type definitions.
        return promise;
    };
    // I return the incident, with the given ID, as an observable stream. This allows 
    // updates to the remote incident to be observed in real-time.
    IncidentGateway.prototype.readIncidentAsStream = function (id) {
        var _this = this;
        var stream = new rxjs_1.Observable(function (observer) {
            var ref = _this.firebaseDB.ref("/incidents/" + id);
            // Bind to the value events on the incident. This will fire every time
            // anything in the given ref tree is changed.
            var eventHandler = ref.on("value", function (snapshot) {
                if (!snapshot.exists()) {
                    observer.error(new Error("IC.NotFound"));
                    return;
                }
                var dto = snapshot.val();
                // Firebase doesn't really handle Arrays in a "normal" way (since
                // it favors Objects for collections). As such, let's ensure that 
                // the Updates collection exists before we return it.
                dto.updates = (dto.updates || []);
                // These fields were added after data was being persisted. As such,
                // they may not exist on all the given data transfer objects.
                dto.version = (dto.version || "general");
                dto.timezoneID = (dto.timezoneID || "");
                dto.customerType = (dto.customerType || "");
                dto.customerCount = (dto.customerCount || "");
                dto.internalTeam = (dto.internalTeam || "");
                dto.zendeskTicket = (dto.zendeskTicket || "");
                observer.next(dto);
            });
            // Provide tear down logic so we can stop listening to the ref when the
            // calling context unsubscribes from the returned stream.
            function teardown() {
                ref.off("value", eventHandler);
                ref = eventHandler = null;
            }
            return (teardown);
        });
        return (stream);
    };
    // I update the already-persisted incident. Returns a promise when the action is 
    // completed locally.
    IncidentGateway.prototype.updateIncident = function (dto) {
        var ref = this.firebaseDB.ref("/incidents/" + dto.id);
        // NOTE: This will write locally and attempt to save the data to the remote 
        // Firebase server. It returns a Promise that will resolve when the data is 
        // persisted remotely. For now, we're only going to care about the local 
        // operation.
        ref
            .set(dto)
            .catch(function (error) {
            console.log("Update Incident Failed");
            console.error(error);
            console.log("Transfer Object:");
            console.dir(dto);
        });
        return (Promise.resolve());
    };
    // ---
    // PRIVATE METHODS.
    // ---
    // I generate an ID / key for a new incident reference.
    IncidentGateway.prototype.getNewID = function () {
        // On their own, Firebase keys are not cryptographically secure; but, they are
        // designed to be very hard to guess (read more: https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html).
        // That said, I'm prefixing them with a random string value. This is also not a
        // cryptographically secure algorithm. But, together, there should be a 
        // significant amount of size and randomness to make them sufficiently hard to
        // guess or iterate.
        var ref = this.firebaseDB.ref("/incidents/").push();
        // Generate random suffix data.
        var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz-0123456789-";
        var randomChars = [];
        for (var i = 0; i < 30; i++) {
            var random = Math.floor(Math.random() * 1234);
            // Select the random character from the valid characters collection.
            randomChars.push(validChars.charAt(random % validChars.length));
        }
        return ("i" + randomChars.join("") + ref.key + "c");
    };
    IncidentGateway = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [])
    ], IncidentGateway);
    return IncidentGateway;
}());
exports.IncidentGateway = IncidentGateway;


/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var lodash_extended_1 = __webpack_require__(57);
var core_1 = __webpack_require__(5);
var QuoteService = /** @class */ (function () {
    // I initialize the quote services.
    function QuoteService() {
        this.quotes = [
            {
                author: "Sun Tzu",
                excerpt: "Appear weak when you are strong, and strong when you are weak."
            },
            {
                author: "Sun Tzu",
                excerpt: "In the midst of chaos, there is also opportunity."
            },
            {
                author: "Sun Tzu",
                excerpt: "Move swift as the Wind and closely-formed as the Wood. Attack like the Fire and be still as the Mountain."
            },
            {
                author: "Sun Tzu",
                excerpt: "Treat your men as you would your own beloved sons. And they will follow you into the deepest valley."
            },
            {
                author: "Sun Tzu",
                excerpt: "So in war, the way is to avoid what is strong, and strike at what is weak."
            },
            {
                author: "Sun Tzu",
                excerpt: "One may know how to conquer without being able to do it."
            },
            {
                author: "Sun Tzu",
                excerpt: "If ignorant both of your enemy and yourself, you are certain to be in peril."
            },
            {
                author: "Sun Tzu",
                excerpt: "If he sends reinforcements everywhere, he will everywhere be weak."
            },
            {
                author: "Sun Tzu",
                excerpt: "Disorder came from order, fear came from courage, weakness came from strength."
            },
            {
                author: "Sun Tzu",
                excerpt: "Therefore, just as water retains no constant shape, so in warfare there are no constant conditions."
            },
            {
                author: "Sun Tzu",
                excerpt: "Plan for what it is difficult while it is easy, do what is great while it is small."
            },
            {
                author: "Sun Tzu",
                excerpt: "So long as victory can be attained, stupid haste is preferable to clever dilatoriness."
            },
            {
                author: "Sun Tzu",
                excerpt: "The principle on which to manage an army is to set up one standard of courage which all must reach."
            },
            {
                author: "Sun Tzu",
                excerpt: "It is best to keep one's own state intact; to crush the enemy's state is only second best."
            },
            {
                author: "Sun Tzu",
                excerpt: "Ground on which we can only be saved from destruction by fighting without delay, is desperate ground."
            }
        ];
    }
    // ---
    // PUBLIC METHODS.
    // ---
    // I return a random quote.
    QuoteService.prototype.getRandomQuote = function () {
        var index = lodash_extended_1._.random(0, (this.quotes.length - 1));
        return (this.quotes[index]);
    };
    QuoteService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [])
    ], QuoteService);
    return QuoteService;
}());
exports.QuoteService = QuoteService;


/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var SlackSerializer = /** @class */ (function () {
    function SlackSerializer() {
    }
    // I serialize the given incident for use in a Slack message.
    SlackSerializer.prototype.serialize = function (incident, updateLimit, format, timezone) {
        var parts = [];
        parts.push("*Incident Description*: " + incident.description);
        if (incident.version === "general") {
            parts.push("*Priority*: " + incident.priority.id);
        }
        else {
            if (incident.zendeskTicket) {
                incident.zendeskTicket.includes("/")
                    ? parts.push("*Zendesk Ticket*: `" + incident.zendeskTicket + "`")
                    : parts.push("*Zendesk Ticket*: `https://invisionapp.zendesk.com/agent/tickets/" + incident.zendeskTicket + "`");
            }
            parts.push("*Customer Type*: " + (incident.customerType || "_Unknown_"));
            parts.push("*Customer Count*: " + (incident.customerCount || "_Unknown_"));
        }
        parts.push("*Start of Impact*: " + this.formatTime(incident.startedAt, timezone) + " on " + this.formatDate(incident.startedAt, timezone));
        parts.push("*Zoom or Hangout link*: `" + incident.videoLink + "` ");
        parts.push("*Status*: " + incident.status.id);
        if (incident.version === "invision") {
            incident.internalTeam
                ? parts.push("*Team Writing RCA*: " + incident.internalTeam)
                : parts.push("*Team Writing RCA*: _The team responsible for writing the RCA is not yet clear._");
        }
        parts.push("*Timeline*: `https://bennadel.github.io/Incident-Commander/#" + incident.id + "` ");
        var visibleUpdates = incident.updates.slice(-updateLimit);
        // If there are updates to show, add a spacer between the heads-up data and the
        // actual timeline items.
        if (visibleUpdates.length) {
            parts.push("");
        }
        // If not all updates are visible, add an indication as to how many are hidden.
        if (visibleUpdates.length !== incident.updates.length) {
            var hiddenCount = (incident.updates.length - visibleUpdates.length);
            parts.push("> _.... *" + hiddenCount + " update(s)* not being shown._");
            parts.push("> ");
        }
        // Render visible updates.
        for (var i = 0; i < visibleUpdates.length; i++) {
            // Only add a line-delimiter if the format is readable.
            if ((format === "readable") && (i !== 0)) {
                parts.push("> ");
            }
            var update = visibleUpdates[i];
            var segment = "*" + this.formatTime(update.createdAt, timezone) + " [ " + update.status.id + " ]*: \u2014 " + update.description;
            // Since there may be hard line-breaks within each Slack message, we need
            // to make sure to add the quote character (">") to every start-of-line, 
            // otherwise the message will wrap incorrectly.
            parts.push(segment.replace(/^/gm, "> "));
        }
        return (parts.join("\n"));
    };
    // ---
    // PRIVATE METHODS.
    // ---
    // I format the given Date object as a date string in EST / EDT timezone.
    SlackSerializer.prototype.formatDate = function (value, timezone) {
        var slackDate = this.getDateInTimezone(value, timezone);
        var normalizedWeekday = WEEKDAYS[slackDate.getDay()];
        var normalizedMonth = MONTHS[slackDate.getMonth()];
        return (normalizedWeekday + ", " + normalizedMonth + " " + slackDate.getDate() + ", " + slackDate.getFullYear());
    };
    // I format the given Date object as a time string in the EST / EDT timezone.
    SlackSerializer.prototype.formatTime = function (value, timezone) {
        var slackDate = this.getDateInTimezone(value, timezone);
        var hours = slackDate.getHours();
        var minutes = slackDate.getMinutes();
        var period = (hours < 12)
            ? "AM"
            : "PM";
        var normalizedHours = ((hours % 12) || 12);
        var normalizedMinutes = ("0" + minutes).slice(-2);
        return (normalizedHours + ":" + normalizedMinutes + " " + period + " " + timezone.abbreviation);
    };
    // I return the given local date adjusted for the given timezone.
    SlackSerializer.prototype.getDateInTimezone = function (value, timezone) {
        // In order to [try our best to] convert from the local timezone to the Slack
        // timezone for rendering, we're going to use the difference in offset minutes
        // to alter a local copy of the Date object.
        var offsetDelta = (timezone.offset - value.getTimezoneOffset());
        // Clone the date so we don't mess up the original value as we adjust it.
        var adjustedDate = new Date(value);
        // Attempt to move from the current TZ to the given TZ by adjusting minutes.
        adjustedDate.setMinutes(adjustedDate.getMinutes() - offsetDelta);
        return (adjustedDate);
    };
    SlackSerializer = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], SlackSerializer);
    return SlackSerializer;
}());
exports.SlackSerializer = SlackSerializer;


/***/ }),

/***/ 375:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
var platform_browser_dynamic_1 = __webpack_require__(117);
// Import the root module for bootstrapping.
var app_module_1 = __webpack_require__(376);
core_1.enableProdMode();
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ }),

/***/ 376:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var platform_browser_1 = __webpack_require__(25);
var core_1 = __webpack_require__(5);
// Import the application components and services.
var app_view_component_1 = __webpack_require__(149);
var app_view_module_1 = __webpack_require__(380);
var core_module_1 = __webpack_require__(388);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                app_view_module_1.AppViewModule,
                platform_browser_1.BrowserModule,
                core_module_1.CoreModule
            ],
            bootstrap: [
                app_view_component_1.AppViewComponent
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ }),

/***/ 377:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// NOTE: In order to persist the timezone data to the incident, I had to give the 
// individual options a unique ID that would be consistent over time. In order to do 
// this, I used the UUID generator on `https://www.uuidgenerator.net/`. A UUID felt like
// the right way to go because none of the other properties were sufficiently stable or
// unique. At least the UUID is guaranteed unique and is not semantically meaningful. 
exports.timezones = [
    {
        id: "f562306c-3388-4bb7-a1f6-4e7766e2f42e",
        abbreviation: "ACDT",
        name: "Australian Central Daylight Savings Time",
        utc: "UTC+10:30",
        offset: -630
    },
    {
        id: "b5cf0a4e-90e3-4990-8ec1-abbbed33686c",
        abbreviation: "ACST",
        name: "Australian Central Standard Time",
        utc: "UTC+09:30",
        offset: -570
    },
    {
        id: "c1aa6de0-b305-4622-9f2e-f0f68fa5d012",
        abbreviation: "ACT",
        name: "Acre Time",
        utc: "UTC-05",
        offset: 300
    },
    {
        id: "e6b4822f-878a-418d-98ac-e7dd7fe6eec0",
        abbreviation: "ADT",
        name: "Atlantic Daylight Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "54fc3643-c100-4851-b6e9-298907ff0735",
        abbreviation: "AEDT",
        name: "Australian Eastern Daylight Savings Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "438fd216-eaa8-4b6c-81f4-d9b3b1a7a2fc",
        abbreviation: "AEST",
        name: "Australian Eastern Standard Time",
        utc: "UTC+10",
        offset: -60600
    },
    {
        id: "104ff13f-72c9-4ebb-b1f6-90f8d8c64d20",
        abbreviation: "AFT",
        name: "Afghanistan Time",
        utc: "UTC+04:30",
        offset: -270
    },
    {
        id: "4440fb17-5068-4698-a844-c36ee0415efc",
        abbreviation: "AKDT",
        name: "Alaska Daylight Time",
        utc: "UTC-08",
        offset: 480
    },
    {
        id: "b1bb6477-1a7a-4156-ae3b-79cbc0b4efb7",
        abbreviation: "AKST",
        name: "Alaska Standard Time",
        utc: "UTC-09",
        offset: 540
    },
    {
        id: "a9614787-0f74-40e7-a345-928b69278c9a",
        abbreviation: "AMST",
        name: "Amazon Summer Time (Brazil)",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "6fd76b22-5289-48d4-810c-b2591c3c408c",
        abbreviation: "AMT",
        name: "Amazon Time (Brazil)",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "c8f3968f-d92b-40e0-822c-e73dd1fa5669",
        abbreviation: "AMT",
        name: "Armenia Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "cb8e0b4d-e84c-47fc-a759-7cde06bacb02",
        abbreviation: "ART",
        name: "Argentina Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "2b70e800-2ee1-477e-9b9d-d1c20e469e63",
        abbreviation: "AST",
        name: "Arabia Standard Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "9f05a19d-6b91-4778-8461-edd0830ecf5f",
        abbreviation: "AST",
        name: "Atlantic Standard Time",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "dcd15f42-29f4-428d-82d7-b58741c5cd6f",
        abbreviation: "AWST",
        name: "Australian Western Standard Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "e90ecff6-19e1-4492-9465-b1d5fb93b587",
        abbreviation: "AZOST",
        name: "Azores Summer Time",
        utc: "UTC+00",
        offset: 0
    },
    {
        id: "28b83c10-af0c-4a4b-887a-8f82be1e97aa",
        abbreviation: "AZOT",
        name: "Azores Standard Time",
        utc: "UTC-01",
        offset: 60
    },
    {
        id: "f9cbe43c-608f-4e56-a8c5-692d2ae03b55",
        abbreviation: "AZT",
        name: "Azerbaijan Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "8c7e6734-6caa-40bb-bd83-5074cf9d5345",
        abbreviation: "BDT",
        name: "Brunei Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "1cc4f82c-c7be-44d7-9c1b-4ba62c31bb10",
        abbreviation: "BIOT",
        name: "British Indian Ocean Time",
        utc: "UTC+06",
        offset: -360
    },
    {
        id: "f8b13a11-99de-4e36-a00d-8666104cbc3d",
        abbreviation: "BIT",
        name: "Baker Island Time",
        utc: "UTC-12",
        offset: 720
    },
    {
        id: "22423ef8-f405-42b9-8d73-0fd41c57a5c5",
        abbreviation: "BOT",
        name: "Bolivia Time",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "0bd7288c-1e08-4069-a72f-1c1453dea53c",
        abbreviation: "BRST",
        name: "Brasilia Summer Time",
        utc: "UTC-02",
        offset: 120
    },
    {
        id: "0f0e5167-ddc7-487a-8882-6524a5cbb14e",
        abbreviation: "BRT",
        name: "Brasilia Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "31480b59-0d81-4e27-90bd-0cf4d7aa7d9e",
        abbreviation: "BST",
        name: "Bangladesh Standard Time",
        utc: "UTC+06",
        offset: -360
    },
    {
        id: "bd1fe38c-89f7-4dcd-8a89-46a4653a1f20",
        abbreviation: "BST",
        name: "Bougainville Standard Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "f986c8f5-c0ea-4725-a71f-130e1f81e55f",
        abbreviation: "BTT",
        name: "Bhutan Time",
        utc: "UTC+06",
        offset: -360
    },
    {
        id: "4f545880-0cb2-44f2-a098-80af816b76a9",
        abbreviation: "CAT",
        name: "Central Africa Time",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "90ba86ef-5c73-4da3-9c13-79d4faf4f475",
        abbreviation: "CCT",
        name: "Cocos Islands Time",
        utc: "UTC+06:30",
        offset: -390
    },
    {
        id: "95f40310-b41f-4d9e-94eb-8d547df0ddbf",
        abbreviation: "CDT",
        name: "Central Daylight Time (North America)",
        utc: "UTC-05",
        offset: 300
    },
    {
        id: "461c9c22-d6b6-43df-ace6-9c6c2694607f",
        abbreviation: "CDT",
        name: "Cuba Daylight Time",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "a87f2302-5b2d-4a32-945e-14b01ecc2248",
        abbreviation: "CEST",
        name: "Central European Summer Time (Cf. HAEC)",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "b53cbb7c-ee4e-4af3-bae9-bf61dac2dd0d",
        abbreviation: "CET",
        name: "Central European Time",
        utc: "UTC+01",
        offset: -60
    },
    {
        id: "8936f9ad-3f94-42ce-ae25-ece94b00eb55",
        abbreviation: "CHADT",
        name: "Chatham Daylight Time",
        utc: "UTC+13:45",
        offset: -825
    },
    {
        id: "ceeac5ea-6b0d-406c-9198-cdfb206bf601",
        abbreviation: "CHAST",
        name: "Chatham Standard Time",
        utc: "UTC+12:45",
        offset: -765
    },
    {
        id: "3a7e5074-9bed-4497-ac0f-1a41530b457a",
        abbreviation: "CHOT",
        name: "Choibalsan Standard Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "d6eb188f-bc53-4b5c-bbd5-7d20259478b1",
        abbreviation: "CHOST",
        name: "Choibalsan Summer Time",
        utc: "UTC+09",
        offset: -540
    },
    {
        id: "81580455-0a2d-4875-b809-cbceabdc0b47",
        abbreviation: "CHST",
        name: "Chamorro Standard Time",
        utc: "UTC+10",
        offset: -600
    },
    {
        id: "82fa7130-3d8b-4e66-8044-4fd28c8f7ab9",
        abbreviation: "CHUT",
        name: "Chuuk Time",
        utc: "UTC+10",
        offset: -600
    },
    {
        id: "33006b7a-ccef-467e-8e58-80918229901f",
        abbreviation: "CIST",
        name: "Clipperton Island Standard Time",
        utc: "UTC-08",
        offset: 480
    },
    {
        id: "7179e35b-37f3-4cda-a2d4-d0a764b27e7d",
        abbreviation: "CIT",
        name: "Central Indonesia Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "dbc2cc93-cf53-4ad4-8108-26e4e03ba038",
        abbreviation: "CKT",
        name: "Cook Island Time",
        utc: "UTC-10",
        offset: 600
    },
    {
        id: "53bd81dd-2aad-43ec-9eaa-5536decd858f",
        abbreviation: "CLST",
        name: "Chile Summer Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "5f65c70f-1486-468b-8147-a5f0ec2bd4fa",
        abbreviation: "CLT",
        name: "Chile Standard Time",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "136360db-03d1-4bfe-921b-a35a76745755",
        abbreviation: "COST",
        name: "Colombia Summer Time",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "44720afb-a7b0-4ef3-b583-21e224fb9f85",
        abbreviation: "COT",
        name: "Colombia Time",
        utc: "UTC-05",
        offset: 300
    },
    {
        id: "7b82f65b-70cc-4fd0-b791-481ba571ebf8",
        abbreviation: "CST",
        name: "Central Standard Time (North America)",
        utc: "UTC-06",
        offset: 360
    },
    {
        id: "22546e22-60e3-4c67-bb50-51c3004a61a0",
        abbreviation: "CST",
        name: "China Standard Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "b53cd11c-fd7e-4b2a-94e2-b0839f53d93d",
        abbreviation: "ACST",
        name: "Central Standard Time (Australia)",
        utc: "UTC+09:30",
        offset: -570
    },
    {
        id: "8c5dd108-1e1d-4abd-bb0e-38b05c99df33",
        abbreviation: "ACDT",
        name: "Central Summer Time (Australia)",
        utc: "UTC+10:30",
        offset: -630
    },
    {
        id: "55da884c-1a88-4a9c-91fa-2ef4674713a7",
        abbreviation: "CST",
        name: "Cuba Standard Time",
        utc: "UTC-05",
        offset: 300
    },
    {
        id: "e82ca5ab-eea0-4c82-938b-f7334d531ac9",
        abbreviation: "CT",
        name: "China time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "8b7fe36f-a8ec-4f5f-a5c5-0b37730fd0d6",
        abbreviation: "CVT",
        name: "Cape Verde Time",
        utc: "UTC-01",
        offset: 60
    },
    {
        id: "34d03938-d6a8-4ec6-9080-5d060a9efeba",
        abbreviation: "CWST",
        name: "Central Western Standard Time (Australia) unofficial",
        utc: "UTC+08:45",
        offset: -525
    },
    {
        id: "ed860b3d-5189-48b2-b015-d019efb61b35",
        abbreviation: "CXT",
        name: "Christmas Island Time",
        utc: "UTC+07",
        offset: -420
    },
    {
        id: "f8ae94ac-9b9b-4650-9607-617b798bfb9f",
        abbreviation: "DAVT",
        name: "Davis Time",
        utc: "UTC+07",
        offset: -420
    },
    {
        id: "89af4123-8b13-49b2-aab4-a60051194581",
        abbreviation: "DDUT",
        name: "Dumont d'Urville Time",
        utc: "UTC+10",
        offset: -600
    },
    {
        id: "ed978016-b9b2-429d-9ba0-9cbfe6aa8b13",
        abbreviation: "DFT",
        name: "AIX specific equivalent of Central European Time",
        utc: "UTC+01",
        offset: -60
    },
    {
        id: "e84d9d90-ae8f-4cf1-85e2-98e2e9891577",
        abbreviation: "EASST",
        name: "Easter Island Summer Time",
        utc: "UTC-05",
        offset: 300
    },
    {
        id: "d3e5ec56-2abc-41f1-b02f-8b839744cb53",
        abbreviation: "EAST",
        name: "Easter Island Standard Time",
        utc: "UTC-06",
        offset: 360
    },
    {
        id: "cbc33b59-e3c9-4e0f-943a-8d5a3643f6cd",
        abbreviation: "EAT",
        name: "East Africa Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "2abe0144-c455-4fd6-97aa-cbe9ddf233b9",
        abbreviation: "ECT",
        name: "Eastern Caribbean Time (does not recognize DST)",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "c3392914-18bb-4046-aed5-1519814f0a9a",
        abbreviation: "ECT",
        name: "Ecuador Time",
        utc: "UTC-05",
        offset: 300
    },
    {
        id: "3ca59164-cc12-444d-aa11-0ca961e17e08",
        abbreviation: "EDT",
        name: "Eastern Daylight Time (North America)",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "f2c975ff-2f1e-4ba8-8b1c-b62e2c427596",
        abbreviation: "AEDT",
        name: "Eastern Summer Time (Australia)",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "429c68a6-e396-4995-9d03-e2ff3a911053",
        abbreviation: "EEST",
        name: "Eastern European Summer Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "253486de-bddd-4448-bb5c-9312f46c0d56",
        abbreviation: "EET",
        name: "Eastern European Time",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "0c709130-05c0-4aa8-8b37-a509447fc01b",
        abbreviation: "EGST",
        name: "Eastern Greenland Summer Time",
        utc: "UTC+00",
        offset: 0
    },
    {
        id: "8e65933d-e45f-4233-a11e-c85685582cc4",
        abbreviation: "EGT",
        name: "Eastern Greenland Time",
        utc: "UTC-01",
        offset: 60
    },
    {
        id: "4d5dbdd7-52a6-46ad-b523-b3e599c1f6a0",
        abbreviation: "EIT",
        name: "Eastern Indonesian Time",
        utc: "UTC+09",
        offset: -540
    },
    {
        id: "1de70413-cdc4-4eee-baea-6acb6bf41f4f",
        abbreviation: "EST",
        name: "Eastern Standard Time (North America)",
        utc: "UTC-05",
        offset: 300
    },
    {
        id: "d3aefe57-cdf8-4c2b-85ef-8bc6d7298ebc",
        abbreviation: "AEST",
        name: "Eastern Standard Time (Australia)",
        utc: "UTC+10",
        offset: -600
    },
    {
        id: "3d3bab2b-b7ff-45d2-b678-e9ab4d22e401",
        abbreviation: "FET",
        name: "Further-eastern European Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "a487bc51-9b24-4e11-8043-8de393fc0ee9",
        abbreviation: "FJT",
        name: "Fiji Time",
        utc: "UTC+12",
        offset: -720
    },
    {
        id: "8181fbe5-6f63-4486-9abe-daf41c2d6bc9",
        abbreviation: "FKST",
        name: "Falkland Islands Summer Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "4b305b8f-78fa-47f0-a6a3-cd270bc66bea",
        abbreviation: "FKT",
        name: "Falkland Islands Time",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "b695c0aa-ff2a-44f7-aa7d-3bba13ec7b18",
        abbreviation: "FNT",
        name: "Fernando de Noronha Time",
        utc: "UTC-02",
        offset: 120
    },
    {
        id: "c01e7282-2d9e-4399-82ea-1674c8cc2ea3",
        abbreviation: "GALT",
        name: "Galapagos Time",
        utc: "UTC-06",
        offset: 360
    },
    {
        id: "21ebab35-cd30-4d76-8738-e883b009b35c",
        abbreviation: "GAMT",
        name: "Gambier Islands",
        utc: "UTC-09",
        offset: 540
    },
    {
        id: "71a19661-ede1-496e-9755-cc9fe28ffbbc",
        abbreviation: "GET",
        name: "Georgia Standard Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "da84aeac-2681-4062-a307-a6161fc71d27",
        abbreviation: "GFT",
        name: "French Guiana Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "fb9bec94-29db-455c-8d25-42fd5556770c",
        abbreviation: "GILT",
        name: "Gilbert Island Time",
        utc: "UTC+12",
        offset: -720
    },
    {
        id: "77460af3-2794-4619-bbbb-bb7ccce82317",
        abbreviation: "GIT",
        name: "Gambier Island Time",
        utc: "UTC-09",
        offset: 540
    },
    {
        id: "d2e6d2cb-54ee-4164-8bd6-0fe80f6ec99a",
        abbreviation: "GMT",
        name: "Greenwich Mean Time",
        utc: "UTC+00",
        offset: 0
    },
    {
        id: "5fc2e9dd-276b-4c36-9f07-d3a72c22658f",
        abbreviation: "GST",
        name: "South Georgia and the South Sandwich Islands",
        utc: "UTC-02",
        offset: 120
    },
    {
        id: "466c9d48-945d-48d3-a353-11e41a8c0533",
        abbreviation: "GST",
        name: "Gulf Standard Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "5d73f59d-9536-4c41-bcbc-a7353596e4ca",
        abbreviation: "GYT",
        name: "Guyana Time",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "37cb8d65-84e7-49e2-8252-14db73b0a5cb",
        abbreviation: "HADT",
        name: "Hawaii-Aleutian Daylight Time",
        utc: "UTC-09",
        offset: 540
    },
    {
        id: "781d7a5b-4a5b-4b95-b35c-6445aad51083",
        abbreviation: "HAEC",
        name: "Heure Avancee d'Europe Centrale francised name for CEST",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "e886fc37-90bc-4277-ba50-16ac2f7f07ab",
        abbreviation: "HAST",
        name: "Hawaii-Aleutian Standard Time",
        utc: "UTC-10",
        offset: 600
    },
    {
        id: "29824ddf-e2a0-4543-a1fc-4dd05bb40883",
        abbreviation: "HKT",
        name: "Hong Kong Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "d5dfb140-5bfd-4e4c-8aa1-b34d5ab5e7e9",
        abbreviation: "HMT",
        name: "Heard and McDonald Islands Time",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "bea01d4d-c7d5-49ad-8772-815a48cf69b4",
        abbreviation: "HOVST",
        name: "Khovd Summer Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "24fb9b89-f65f-46f6-a3a7-2f3a0592d877",
        abbreviation: "HOVT",
        name: "Khovd Standard Time",
        utc: "UTC+07",
        offset: -420
    },
    {
        id: "574efff7-2427-46a0-bad5-cbbd74657c1c",
        abbreviation: "ICT",
        name: "Indochina Time",
        utc: "UTC+07",
        offset: -420
    },
    {
        id: "bfc71290-d8b7-4068-a174-6349b6aa7541",
        abbreviation: "IDT",
        name: "Israel Daylight Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "f634b1b5-8769-4864-9085-314f4cc217bd",
        abbreviation: "IOT",
        name: "Indian Ocean Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "818ccb94-0b01-4006-90cc-ba7b7c21170f",
        abbreviation: "IRDT",
        name: "Iran Daylight Time",
        utc: "UTC+04:30",
        offset: -270
    },
    {
        id: "112af090-3480-449f-abf2-a259805106a8",
        abbreviation: "IRKT",
        name: "Irkutsk Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "d809bba6-b1a7-4ad6-bd26-db0e79d3a9c9",
        abbreviation: "IRST",
        name: "Iran Standard Time",
        utc: "UTC+03:30",
        offset: -210
    },
    {
        id: "cb48a62b-ab30-474d-aaec-0422dfba232c",
        abbreviation: "IST",
        name: "Indian Standard Time",
        utc: "UTC+05:30",
        offset: -330
    },
    {
        id: "a2b72587-c9f2-458b-914e-74fb11186dd1",
        abbreviation: "IST",
        name: "Irish Standard Time",
        utc: "UTC+01",
        offset: -60
    },
    {
        id: "1af7a5cb-a0d0-43d4-9452-f82896c4184e",
        abbreviation: "IST",
        name: "Israel Standard Time",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "2761dec7-1064-4353-a3f1-4be23dab8277",
        abbreviation: "JST",
        name: "Japan Standard Time",
        utc: "UTC+09",
        offset: -540
    },
    {
        id: "adaba9ef-5d0f-4ed0-9fae-805361a24b9e",
        abbreviation: "KGT",
        name: "Kyrgyzstan time",
        utc: "UTC+06",
        offset: -360
    },
    {
        id: "0c802529-203e-4396-ac9c-807878a89ea8",
        abbreviation: "KOST",
        name: "Kosrae Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "837bec06-2c7d-436b-b328-e4315584c743",
        abbreviation: "KRAT",
        name: "Krasnoyarsk Time",
        utc: "UTC+07",
        offset: -420
    },
    {
        id: "1a0881af-be2f-48dd-b88a-8dd48a9a41c8",
        abbreviation: "KST",
        name: "Korea Standard Time",
        utc: "UTC+09",
        offset: -540
    },
    {
        id: "89ef496b-942c-41fa-bb86-b388d2bf992e",
        abbreviation: "LHST",
        name: "Lord Howe Standard Time",
        utc: "UTC+10:30",
        offset: -630
    },
    {
        id: "b5fafa0f-8100-4331-9c3b-bc11ab045682",
        abbreviation: "LHST",
        name: "Lord Howe Summer Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "c9bfa8aa-d8d7-4be2-805c-9e917e0e72c0",
        abbreviation: "LINT",
        name: "Line Islands Time",
        utc: "UTC+14",
        offset: -840
    },
    {
        id: "265c373e-e6bf-4075-b748-71df3f24fca5",
        abbreviation: "MAGT",
        name: "Magadan Time",
        utc: "UTC+12",
        offset: -720
    },
    {
        id: "f815f452-b1a4-4040-aa54-8314d5e34b51",
        abbreviation: "MART",
        name: "Marquesas Islands Time",
        utc: "UTC-09:30",
        offset: 570
    },
    {
        id: "fb0f99c0-ca87-4d60-a772-ee081f2753ca",
        abbreviation: "MAWT",
        name: "Mawson Station Time",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "1512cd35-645f-40c4-963e-7666023d3817",
        abbreviation: "MDT",
        name: "Mountain Daylight Time (North America)",
        utc: "UTC-06",
        offset: 360
    },
    {
        id: "671c1d8e-c4a9-4ddd-8517-37a41d234c6c",
        abbreviation: "MET",
        name: "Middle European Time Same zone as CET",
        utc: "UTC+01",
        offset: -60
    },
    {
        id: "6e94384d-de54-49d1-a58a-562fb9cdf0ae",
        abbreviation: "MEST",
        name: "Middle European Summer Time Same zone as CEST",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "bf3531f1-c997-4de4-884d-81d1a9bedc0c",
        abbreviation: "MHT",
        name: "Marshall Islands",
        utc: "UTC+12",
        offset: -720
    },
    {
        id: "0f001bbe-4de3-4de4-871e-a1748b8dd69b",
        abbreviation: "MIST",
        name: "Macquarie Island Station Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "8e2c6099-f959-47e2-94e9-6ead84192643",
        abbreviation: "MIT",
        name: "Marquesas Islands Time",
        utc: "UTC-09:30",
        offset: 570
    },
    {
        id: "30ced839-ff5e-418b-9acf-d4451fafd369",
        abbreviation: "MMT",
        name: "Myanmar Standard Time",
        utc: "UTC+06:30",
        offset: -390
    },
    {
        id: "63ef6786-1e98-4f61-8c58-fb130190d6c7",
        abbreviation: "MSK",
        name: "Moscow Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "7cf60ac6-4a75-4f6a-9910-88663800a4eb",
        abbreviation: "MST",
        name: "Malaysia Standard Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "3fca0de8-88b5-45d4-ba86-4e74568f3847",
        abbreviation: "MST",
        name: "Mountain Standard Time (North America)",
        utc: "UTC-07",
        offset: 420
    },
    {
        id: "1a10e2da-57d1-4daa-ba0b-89ede99b1ee8",
        abbreviation: "MUT",
        name: "Mauritius Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "7ab8a1ee-c083-4da7-9346-3267d591102d",
        abbreviation: "MVT",
        name: "Maldives Time",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "03e20669-3d28-4160-bb2c-b966c8193716",
        abbreviation: "MYT",
        name: "Malaysia Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "3703d21f-bccf-40f6-a76f-2e20776b4233",
        abbreviation: "NCT",
        name: "New Caledonia Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "6660ddb0-d9b9-4003-8bce-0d5c5528e5aa",
        abbreviation: "NDT",
        name: "Newfoundland Daylight Time",
        utc: "UTC-02:30",
        offset: 150
    },
    {
        id: "9cc98ec2-7b10-4856-9a8d-4fe0ad5a598d",
        abbreviation: "NFT",
        name: "Norfolk Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "c44dffb7-ab29-4ee1-ad81-b5bf7a3cc6e5",
        abbreviation: "NPT",
        name: "Nepal Time",
        utc: "UTC+05:45",
        offset: -345
    },
    {
        id: "3e132a3d-cc8f-4dfa-8726-927ebd7f6f83",
        abbreviation: "NST",
        name: "Newfoundland Standard Time",
        utc: "UTC-03:30",
        offset: 210
    },
    {
        id: "e243d6d9-6321-4551-ac63-7d756c425bed",
        abbreviation: "NT",
        name: "Newfoundland Time",
        utc: "UTC-03:30",
        offset: 210
    },
    {
        id: "21fad765-a28c-4c8a-8a6d-96966844d9f9",
        abbreviation: "NUT",
        name: "Niue Time",
        utc: "UTC-11",
        offset: 660
    },
    {
        id: "12129ea5-30c8-4c79-ac1b-470cd668591d",
        abbreviation: "NZDT",
        name: "New Zealand Daylight Time",
        utc: "UTC+13",
        offset: -780
    },
    {
        id: "a2722aac-2ffd-43a6-9818-5a7292844792",
        abbreviation: "NZST",
        name: "New Zealand Standard Time",
        utc: "UTC+12",
        offset: -720
    },
    {
        id: "7d62e154-5ea3-4db1-b98f-482a2fcf8ee7",
        abbreviation: "OMST",
        name: "Omsk Time",
        utc: "UTC+06",
        offset: -360
    },
    {
        id: "a7541966-57ed-40bb-8550-cd3684cc4864",
        abbreviation: "ORAT",
        name: "Oral Time",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "b64b4fb1-c340-4382-8769-0c5941059dbc",
        abbreviation: "PDT",
        name: "Pacific Daylight Time (North America)",
        utc: "UTC-07",
        offset: 420
    },
    {
        id: "b4a04c3a-11ca-4d42-a9b9-41f2f3b83c4d",
        abbreviation: "PET",
        name: "Peru Time",
        utc: "UTC-05",
        offset: 300
    },
    {
        id: "e807be1b-8c8d-4e32-8f2c-9c1367d08f1d",
        abbreviation: "PETT",
        name: "Kamchatka Time",
        utc: "UTC+12",
        offset: -720
    },
    {
        id: "5cc9ed88-f4ca-4315-be44-afbece83e953",
        abbreviation: "PGT",
        name: "Papua New Guinea Time",
        utc: "UTC+10",
        offset: -600
    },
    {
        id: "a679604e-ebd5-48cc-9a96-0821c49b9f7d",
        abbreviation: "PHOT",
        name: "Phoenix Island Time",
        utc: "UTC+13",
        offset: -780
    },
    {
        id: "5025fbf8-0b79-4d84-9380-5a3f6f5b7252",
        abbreviation: "PHT",
        name: "Philippine Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "738bb979-a9a6-49f3-b661-3d0e9f785b68",
        abbreviation: "PKT",
        name: "Pakistan Standard Time",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "0a94cb43-c40f-4459-bc0c-49e4e1d7116b",
        abbreviation: "PMDT",
        name: "Saint Pierre and Miquelon Daylight time",
        utc: "UTC-02",
        offset: 120
    },
    {
        id: "6bccf114-c57f-44fa-ab62-5689b201b64c",
        abbreviation: "PMST",
        name: "Saint Pierre and Miquelon Standard Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "a051d4b9-1490-4517-af8a-df2a09404c62",
        abbreviation: "PONT",
        name: "Pohnpei Standard Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "7a54b535-40aa-4b70-bd7e-c2c99b9014fa",
        abbreviation: "PST",
        name: "Pacific Standard Time (North America)",
        utc: "UTC-08",
        offset: 480
    },
    {
        id: "1947c3ef-ef3f-4cd4-895d-b5d7ca4ef707",
        abbreviation: "PST",
        name: "Philippine Standard Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "a68545d7-c6d9-41e8-98a5-4d7b9a833b21",
        abbreviation: "PYST",
        name: "Paraguay Summer Time (South America)",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "7997cf1f-ff5d-4cd1-9d53-b29822ec2a52",
        abbreviation: "PYT",
        name: "Paraguay Time (South America)",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "52a69135-0c36-4f43-8efe-25266e30a63e",
        abbreviation: "RET",
        name: "Reunion Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "7d387549-4348-478f-923f-fb5e5e563883",
        abbreviation: "ROTT",
        name: "Rothera Research Station Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "74d83746-f7ac-42a0-83b5-a575d449ff51",
        abbreviation: "SAKT",
        name: "Sakhalin Island time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "3bd4431a-6270-4db3-8b91-8b5f9fd4814d",
        abbreviation: "SAMT",
        name: "Samara Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "6fe93888-d4df-4d83-92b6-da27061f8730",
        abbreviation: "SAST",
        name: "South African Standard Time",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "5a15f016-2c5c-4ba1-b6e4-5709cee3b0ff",
        abbreviation: "SBT",
        name: "Solomon Islands Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "6d7c7434-06cc-4121-aab6-f5983fc626a9",
        abbreviation: "SCT",
        name: "Seychelles Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "9827b40f-2b0b-4ba3-a01e-aa1a50576162",
        abbreviation: "SDT",
        name: "Samoa Daylight Time",
        utc: "UTC-10",
        offset: 600
    },
    {
        id: "5ee1164f-d472-4411-8ce3-8d524c30509a",
        abbreviation: "SGT",
        name: "Singapore Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "feee2a2d-72d1-455c-8e14-8d23d9f313d6",
        abbreviation: "SLST",
        name: "Sri Lanka Standard Time",
        utc: "UTC+05:30",
        offset: -330
    },
    {
        id: "63cfe6e9-05b4-443a-ab2f-b5d95ba069ea",
        abbreviation: "SRET",
        name: "Srednekolymsk Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "a92209ff-7986-44bb-8b82-59c8e58d266e",
        abbreviation: "SRT",
        name: "Suriname Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "8825fbe5-0ea5-4718-8287-9ca421984d70",
        abbreviation: "SST",
        name: "Samoa Standard Time",
        utc: "UTC-11",
        offset: 660
    },
    {
        id: "69adec50-f54c-4104-b619-87bb081654f7",
        abbreviation: "SST",
        name: "Singapore Standard Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "8e0398d4-1e9f-495e-a21f-a35c82b2cf1a",
        abbreviation: "SYOT",
        name: "Showa Station Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "24d9d064-b3f1-4e47-a642-18182c145dbf",
        abbreviation: "TAHT",
        name: "Tahiti Time",
        utc: "UTC-10",
        offset: 600
    },
    {
        id: "9f484664-17db-46c8-ad93-770a76f3271e",
        abbreviation: "THA",
        name: "Thailand Standard Time",
        utc: "UTC+07",
        offset: -420
    },
    {
        id: "a522c9fc-2ac3-4556-a600-22d6a2ab71ec",
        abbreviation: "TFT",
        name: "Indian/Kerguelen",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "ed7c984b-fab5-4243-b5bc-9d2137bb76be",
        abbreviation: "TJT",
        name: "Tajikistan Time",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "2f8352a8-4d14-4dcb-a21d-c14bfefb2f08",
        abbreviation: "TKT",
        name: "Tokelau Time",
        utc: "UTC+13",
        offset: -780
    },
    {
        id: "9f2986bb-2e08-413a-b08d-a152e7b3f464",
        abbreviation: "TLT",
        name: "Timor Leste Time",
        utc: "UTC+09",
        offset: -540
    },
    {
        id: "f89b6ae0-5bfa-4cec-be6e-dd1477149980",
        abbreviation: "TMT",
        name: "Turkmenistan Time",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "376f429a-5784-40e3-94c8-2563a50967c1",
        abbreviation: "TRT",
        name: "Turkey Time",
        utc: "UTC+03",
        offset: -180
    },
    {
        id: "793d5e44-6817-400b-b718-2c9ca3ec9e2c",
        abbreviation: "TOT",
        name: "Tonga Time",
        utc: "UTC+13",
        offset: -780
    },
    {
        id: "da01aaac-2e9d-4657-ab07-f6340f2b5ba3",
        abbreviation: "TVT",
        name: "Tuvalu Time",
        utc: "UTC+12",
        offset: -720
    },
    {
        id: "9d54bd87-3dfb-427c-8a56-e85132fd6a03",
        abbreviation: "ULAST",
        name: "Ulaanbaatar Summer Time",
        utc: "UTC+09",
        offset: -540
    },
    {
        id: "929b9135-3a1c-47d5-ab96-2648e10ce033",
        abbreviation: "ULAT",
        name: "Ulaanbaatar Standard Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "6ca0a1c0-003d-46b2-8c37-ff3a3b62314d",
        abbreviation: "USZ1",
        name: "Kaliningrad Time",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "c0be0e90-f911-46c4-9808-8bae38099862",
        abbreviation: "UTC",
        name: "Coordinated Universal Time",
        utc: "UTC+00",
        offset: 0
    },
    {
        id: "9aef2856-097d-465f-8310-87f99ff36873",
        abbreviation: "UYST",
        name: "Uruguay Summer Time",
        utc: "UTC-02",
        offset: 120
    },
    {
        id: "36987bc8-687d-45f3-bb36-675405adb1ab",
        abbreviation: "UYT",
        name: "Uruguay Standard Time",
        utc: "UTC-03",
        offset: 180
    },
    {
        id: "0325128a-87ea-43aa-967c-8762b491e1fb",
        abbreviation: "UZT",
        name: "Uzbekistan Time",
        utc: "UTC+05",
        offset: -300
    },
    {
        id: "6277a802-37f2-4cc4-9bd3-fd8e665a9c9c",
        abbreviation: "VET",
        name: "Venezuelan Standard Time",
        utc: "UTC-04",
        offset: 240
    },
    {
        id: "e89dd258-baec-4d1f-b07c-189e8100ed1a",
        abbreviation: "VLAT",
        name: "Vladivostok Time",
        utc: "UTC+10",
        offset: -600
    },
    {
        id: "86f254cf-2370-4fea-9df1-88d43d7f43c9",
        abbreviation: "VOLT",
        name: "Volgograd Time",
        utc: "UTC+04",
        offset: -240
    },
    {
        id: "1063bfbf-6f65-4803-9169-0a7bb61ffffe",
        abbreviation: "VOST",
        name: "Vostok Station Time",
        utc: "UTC+06",
        offset: -360
    },
    {
        id: "96c19fec-2b78-477b-9ddb-982585d925de",
        abbreviation: "VUT",
        name: "Vanuatu Time",
        utc: "UTC+11",
        offset: -660
    },
    {
        id: "bf55a455-15d8-47dd-8786-7fdf4922cf78",
        abbreviation: "WAKT",
        name: "Wake Island Time",
        utc: "UTC+12",
        offset: -720
    },
    {
        id: "c98bf038-298f-4bc1-884d-9eabe1d6acbb",
        abbreviation: "WAST",
        name: "West Africa Summer Time",
        utc: "UTC+02",
        offset: -120
    },
    {
        id: "526e7115-32a4-41da-9bca-6036b529f110",
        abbreviation: "WAT",
        name: "West Africa Time",
        utc: "UTC+01",
        offset: -60
    },
    {
        id: "baa27862-7da6-4ae8-9f42-5ab310ba39d3",
        abbreviation: "WEST",
        name: "Western European Summer Time",
        utc: "UTC+01",
        offset: -60
    },
    {
        id: "2c90b186-eee4-4706-b2ed-a360e702f9a7",
        abbreviation: "WET",
        name: "Western European Time",
        utc: "UTC+00",
        offset: 0
    },
    {
        id: "0317d18d-bb2f-48ba-975d-ef0ca590ddbb",
        abbreviation: "WIT",
        name: "Western Indonesian Time",
        utc: "UTC+07",
        offset: -420
    },
    {
        id: "5c9b3e89-54ae-4615-9cf7-8d0b42c629aa",
        abbreviation: "WST",
        name: "Western Standard Time",
        utc: "UTC+08",
        offset: -480
    },
    {
        id: "ea93710b-6901-48cb-aee3-08fb24ec2d1d",
        abbreviation: "YAKT",
        name: "Yakutsk Time",
        utc: "UTC+09",
        offset: -540
    },
    {
        id: "b9760823-d8ee-4c51-bb23-6d86686ad032",
        abbreviation: "YEKT",
        name: "Yekaterinburg Time",
        utc: "UTC+05",
        offset: -300
    }
];


/***/ }),

/***/ 378:
/***/ (function(module, exports) {

module.exports = ":host {\n  color: #1F1F1F;\n  display: block ;\n  font-family: \"Open Sans\", \"sans-serif\";\n  font-size: 16px ;\n  font-weight: 300 ;\n  line-height: 22px ;\n}\na {\n  color: inherit ;\n  cursor: pointer ;\n  text-decoration: underline ;\n  user-select: none ;\n  -moz-user-select: none ;\n  -webkit-user-select: none ;\n}\ninput {\n  box-sizing: border-box;\n  font-size: 16px ;\n  padding: 5px 5px 5px 5px ;\n}\ninput.large {\n  width: 100% ;\n}\nbutton {\n  font-size: 16px ;\n  padding: 8px 15px 9px 15px ;\n}\nbn-date-time {\n  font-size: 16px ;\n}\nselect {\n  font-size: 16px ;\n}\ntextarea {\n  box-sizing: border-box;\n  display: block ;\n  font-size: 16px ;\n  height: 70px ;\n  padding: 5px 5px 5px 5px ;\n  width: 100% ;\n}\ndatalist {\n  display: none ;\n}\n.app-intro {\n  left: 0px ;\n  margin-top: -65px;\n  position: fixed ;\n  right: 0px ;\n  text-align: center ;\n  top: 40% ;\n}\n.app-intro__title {\n  font-size: 48px ;\n  font-weight: 400 ;\n  line-height: 54px ;\n  margin: 0px 0px 40px 0px ;\n}\n.app-intro__start {\n  background-color: #FF2E63;\n  border-radius: 30px 30px 30px 30px ;\n  color: #FFFFFF;\n  display: inline-block;\n  font-size: 14px ;\n  font-weight: 400 ;\n  height: 42px ;\n  letter-spacing: 0.5px;\n  line-height: 42px ;\n  padding: 0px 35px 0px 35px ;\n  text-decoration: none ;\n  text-transform: uppercase ;\n  transition: background-color 300ms ease;\n}\n.app-intro__start:hover {\n  background-color: #F71953;\n}\n.app-caution {\n  bottom: 30px ;\n  font-size: 14px ;\n  left: 0px ;\n  line-height: 25px ;\n  position: fixed ;\n  right: 0px ;\n  text-align: center ;\n}\n.app-caution__label {\n  background-color: #FFDC73;\n  border-radius: 5px 5px 5px 5px ;\n  color: #000000;\n  display: inline-block;\n  font-weight: 600 ;\n  margin-right: 5px ;\n  padding: 0px 10px 0px 10px ;\n  text-shadow: 1px 1px rgba(255, 255, 255, 0.7);\n  text-transform: uppercase ;\n}\n.app-caution__description {\n  color: #555555;\n  font-weight: 400 ;\n}\n.app-caution__description a {\n  color: inherit ;\n  font-weight: 600 ;\n}\n.app-loading {\n  font-size: 36px ;\n  font-style: italic ;\n  left: 0px ;\n  line-height: 42px ;\n  margin-top: -21px;\n  position: fixed ;\n  right: 0px ;\n  text-align: center ;\n  top: 50% ;\n}\n.app-main {\n  margin: 0px auto 0px auto ;\n  padding: 20px 0px 50px 0px ;\n  width: 1200px ;\n}\n.app-header {\n  margin-bottom: 40px ;\n  position: relative ;\n}\n.app-header__title {\n  font-size: 36px ;\n  font-weight: 600 ;\n  line-height: 41px ;\n  margin: 0px 0px 20px 0px ;\n}\n.app-header__subtitle {\n  display: inline-block;\n  font-size: 16px ;\n}\n.app-header__quote {\n  color: #999999;\n  font-style: italic ;\n  font-weight: 300 ;\n}\n.app-header__author {\n  color: #666666;\n  display: block ;\n  font-weight: 600 ;\n  margin-top: 7px ;\n  padding-right: 50px ;\n  text-align: right ;\n}\n.app-header__tools {\n  position: absolute ;\n  right: 0px ;\n  top: 3px ;\n}\n.incident-io__start {\n  background-color: #FF2E63;\n  border-radius: 30px 30px 30px 30px ;\n  color: #FFFFFF;\n  display: block ;\n  font-size: 12px ;\n  font-weight: 400 ;\n  height: 37px ;\n  line-height: 37px ;\n  padding: 0px 30px 0px 30px ;\n  text-decoration: none ;\n  text-transform: uppercase ;\n  transition: background-color 300ms ease;\n}\n.incident-io__start:hover {\n  background-color: #F71953;\n}\n.section-header {\n  border-bottom: 2px solid #CCCCCC;\n  margin: 40px 0px 40px 0px ;\n  padding-bottom: 10px ;\n  position: relative ;\n}\n.section-header__title {\n  font-size: 22px ;\n  font-weight: 600 ;\n  line-height: 27px ;\n  margin: 0px 0px 0px 0px ;\n}\n.section-header__attributes {\n  font-size: 22px ;\n  line-height: 27px ;\n  position: absolute ;\n  right: 0px ;\n  top: 0px ;\n}\n.duration__label {\n  display: inline-block;\n  font-weight: 400 ;\n  margin-right: 5px ;\n}\n.duration__time {\n  font-weight: 300 ;\n}\n.updates-sort__label {\n  display: inline-block;\n  font-weight: 400 ;\n  margin-right: 5px ;\n}\n.updates-sort__selection {\n  font-weight: 300 ;\n}\n.updates-sort__direction {\n  color: #CCCCCC;\n}\n.updates-sort__direction--on {\n  color: #1F1F1F;\n  text-decoration: none ;\n}\n.form__field {\n  display: flex ;\n  margin: 15px 20px 18px 0px ;\n}\n.form__field--slack {\n  margin-top: 50px ;\n}\n.form__field-label {\n  flex: 0 0 150px ;\n  font-size: 18px ;\n  font-weight: 600 ;\n  line-height: 24px ;\n  margin-right: 20px ;\n  padding-top: 2px ;\n  text-align: right ;\n}\n.form__field-label--version {\n  padding-top: 6px ;\n}\n.form__field-body {\n  flex: 1 0 auto ;\n}\n.form__field-body--select {\n  padding-top: 4px ;\n}\n.form__actions {\n  padding-left: 170px ;\n}\n.form__primary-action {\n  display: inline-block;\n  margin-right: 20px ;\n}\n.form__secondary-action {\n  color: #999999;\n  text-transform: lowercase ;\n}\n.versions {\n  display: flex ;\n}\n.versions__version {\n  border: 1px solid #CCCCCC;\n  border-radius: 4px 4px 4px 4px ;\n  color: #999999;\n  cursor: pointer ;\n  font-size: 13px ;\n  font-weight: 400 ;\n  line-height: 37px ;\n  margin-right: 10px ;\n  padding: 0px 25px 0px 25px ;\n  text-transform: uppercase ;\n}\n.versions__version--off:hover {\n  border-color: #46A85A;\n  color: #46A85A;\n}\n.versions__version--on {\n  background-color: #68BE7B;\n  border-color: #46A85A;\n  color: #FFFFFF;\n}\n.customers {\n  display: flex ;\n  justify-content: space-between;\n}\n.customers__item {\n  width: 49% ;\n}\n.customers__input {\n  width: 100% ;\n}\n.customers__note {\n  font-size: 14px ;\n  padding-top: 6px ;\n}\n.customers__label {\n  display: inline-block;\n  font-weight: 600 ;\n  margin-right: 6px ;\n}\n.internal {\n  display: flex ;\n  justify-content: space-between;\n}\n.internal__item {\n  width: 49% ;\n}\n.internal__input {\n  width: 100% ;\n}\n.internal__note {\n  font-size: 14px ;\n  padding-top: 6px ;\n}\n.internal__label {\n  display: inline-block;\n  font-weight: 600 ;\n  margin-right: 6px ;\n}\nspan.local-time-note {\n  color: #CC0000;\n  display: inline-block;\n  font-style: italic ;\n  margin-left: 10px ;\n  text-transform: lowercase ;\n}\n.slack__timezone {\n  width: 500px ;\n}\n.slack__content {\n  display: block ;\n  height: 200px ;\n  margin-top: 12px ;\n}\n.add-update__content {\n  display: block ;\n  margin: 12px 0px 12px 0px ;\n}\n.add-update__submit-note {\n  color: #CCCCCC;\n  display: inline-block;\n  font-style: italic ;\n  margin-left: 15px ;\n}\n.timeline {\n  font-size: 14px ;\n  line-height: 25px ;\n}\n.timeline__item {\n  border-bottom: 1px solid #EEEEEE;\n  display: flex ;\n  margin: 0px 20px 15px 0px ;\n  padding-bottom: 15px ;\n}\n.timeline__item:last-child {\n  border-bottom-width: 0px ;\n}\n.timeline__createdAt {\n  flex: 0 0 150px ;\n  text-align: right ;\n}\n.timeline__time {\n  font-weight: 600 ;\n}\n.timeline__date {\n  font-weight: 400 ;\n}\n.timeline__description {\n  flex: 1 1 auto ;\n  font-weight: 300 ;\n  margin-left: 20px ;\n  margin-right: 30px ;\n}\n.timeline__status {\n  font-weight: 400 ;\n}\n.timeline__actions {\n  color: #CCCCCC;\n  white-space: nowrap ;\n}\n.timeline__edit,\n.timeline__delete {\n  color: #333333;\n}\n.timeline__separator {\n  display: inline-block;\n  margin: 0px 5px 0px 5px ;\n}\n.app-footer {\n  border-top: 2px solid #CCCCCC;\n  margin: 40px 0px 0px 0px ;\n  padding-top: 12px ;\n}\n.app-footer__action a {\n  color: #000000;\n  font-weight: 400 ;\n  transition: color 300ms ease ;\n}\n.app-footer__action a:hover {\n  color: #F71953;\n}\n@keyframes global-insight-enter {\n  from {\n    top: -50px;\n  }\n  to {\n    top: 10px ;\n  }\n}\n.global-insight {\n  animation-duration: 500ms ;\n  animation-name: global-insight-enter;\n  background-color: #0082E2;\n  border-radius: 5px 5px 5px 5px ;\n  box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.3);\n  color: #FFFFFF;\n  font-size: 14px ;\n  font-weight: 600 ;\n  left: 50% ;\n  padding: 10px 20px 10px 20px ;\n  position: fixed ;\n  top: 10px ;\n  transform: translateX(-50%);\n  -moz-transform: translateX(-50%);\n  -webkit-transform: translateX(-50%);\n  z-index: 2 ;\n}\n"

/***/ }),

/***/ 379:
/***/ (function(module, exports) {

module.exports = "\n<!-- BEGIN: No incident selected. -->\n<ng-template [ngIf]=\"! incidentID\">\n\t\n\t<!-- If there is no incident ID, then prompt the user to create one. -->\n\t<div class=\"app-intro\">\n\n\t\t<h1 class=\"app-intro__title\">\n\t\t\tIncident Commander\n\t\t</h1>\n\n\t\t<a (click)=\"startNewIncident()\" class=\"app-intro__start\">\n\t\t\tStart New Incident\n\t\t</a>\n\n\t</div>\n\n\t<div class=\"app-caution\">\n\t\t\n\t\t<strong class=\"app-caution__label\">\n\t\t\tCaution\n\t\t</strong>\n\t\t\n\t\t<span class=\"app-caution__description\">\n\t\t\tAll Incident Commander data is stored in a \n\t\t\t<a href=\"https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html\">public Firebase database</a> \n\t\t\t&mdash; do not store sensitive information in your incident.\n\t\t</span>\n\n\t</div>\n\n</ng-template>\n<!-- END: No incident selected. -->\n\n\n<!-- BEGIN: Incident selected and still loading. -->\n<ng-template [ngIf]=\"( incidentID && ! incident )\">\n\n\t<div class=\"app-loading\" [ngSwitch]=\"incidentID\">\n\t\t<span *ngSwitchCase=\" 'new' \">Loading New Incident...</span>\n\t\t<span *ngSwitchDefault>Loading Selected Incident...</span>\n\t</div>\n\n</ng-template>\n<!-- END: Incident selected and still loading. -->\n\n\n<!-- BEGIN: Incident selected and fully loaded. -->\n<ng-template [ngIf]=\"( incidentID && incident )\">\n\n\t<div class=\"app-main\">\n\t\t\t\n\t\t<header class=\"app-header\">\n\n\t\t\t<h1 class=\"app-header__title\">\n\t\t\t\tIncident Commander\n\t\t\t</h1>\n\n\t\t\t<div class=\"app-header__subtitle\">\n\n\t\t\t\t<span class=\"app-header__quote\">\n\t\t\t\t\t\"{{ quote.excerpt }}\"\n\t\t\t\t</span>\n\n\t\t\t\t<span class=\"app-header__author\">\n\t\t\t\t\t&mdash; {{ quote.author }}\n\t\t\t\t</span>\n\n\t\t\t</div>\n\n\t\t\t<div class=\"app-header__tools incident-io\">\n\t\t\t\t<a (click)=\"startNewIncident()\" class=\"incident-io__start\">Start New Incident</a>\n\t\t\t</div>\n\n\t\t</header>\n\n\t\t<section class=\"control-panel\">\n\n\t\t\t<header class=\"section-header\">\n\n\t\t\t\t<h2 class=\"section-header__title\">\n\t\t\t\t\tCommand Center\n\t\t\t\t</h2>\n\n\t\t\t\t<div class=\"section-header__attributes duration\">\n\t\t\t\t\t<span class=\"duration__label\">\n\t\t\t\t\t\tDuration:\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class=\"duration__time\">\n\t\t\t\t\t\t{{ this.duration.hours }} Hours, {{ this.duration.minutes }} Minutes\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\n\t\t\t</header>\n\n\t\t\t<form class=\"form\">\n\n\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t<div class=\"form__field-label form__field-label--version\">\n\t\t\t\t\t\tVersion:\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form__field-body\">\n\n\t\t\t\t\t\t<div class=\"versions\">\n\t\t\t\t\t\t\t<span\n\t\t\t\t\t\t\t\t(click)=\"useVersion( 'general' )\"\n\t\t\t\t\t\t\t\tclass=\"versions__version\"\n\t\t\t\t\t\t\t\t[class.versions__version--off]=\"( form.version !== 'general' )\"\n\t\t\t\t\t\t\t\t[class.versions__version--on]=\"( form.version === 'general' )\">\n\t\t\t\t\t\t\t\tGeneral Version\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span\n\t\t\t\t\t\t\t\t(click)=\"useVersion( 'invision' )\"\n\t\t\t\t\t\t\t\tclass=\"versions__version versions__version--on\"\n\t\t\t\t\t\t\t\t[class.versions__version--off]=\"( form.version !== 'invision' )\"\n\t\t\t\t\t\t\t\t[class.versions__version--on]=\"( form.version === 'invision' )\">\n\t\t\t\t\t\t\t\tInVision Version\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\tDescription:\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form__field-body\">\n\n\t\t\t\t\t\t<input type=\"text\" name=\"description\" [(ngModel)]=\"form.description\" (ngModelChange)=\"applyForm()\" autofocus class=\"large\" />\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<ng-template [ngIf]=\"( form.version === 'invision' )\">\n\n\t\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\t\tCustomers:\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"form__field-body customers\">\n\n\t\t\t\t\t\t\t<div class=\"customers__item\">\n\t\t\t\t\t\t\t\t<input type=\"text\" name=\"customerType\" list=\"customerTypeList\" [(ngModel)]=\"form.customerType\" (ngModelChange)=\"applyForm()\" class=\"customers__input\" />\n\t\t\t\t\t\t\t\t<div class=\"customers__note\">\n\t\t\t\t\t\t\t\t\t<span class=\"customers__label\">Type of Customers:</span>\n\t\t\t\t\t\t\t\t\t<span class=\"customers__values\">None | Internal | EA | MT | PC</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<datalist id=\"customerTypeList\">\n\t\t\t\t\t\t\t\t\t<option>None</option>\n\t\t\t\t\t\t\t\t\t<option>Internal</option>\n\t\t\t\t\t\t\t\t\t<option>EA</option>\n\t\t\t\t\t\t\t\t\t<option>MT</option>\n\t\t\t\t\t\t\t\t\t<option>MT, PC</option>\n\t\t\t\t\t\t\t\t\t<option>PC</option>\n\t\t\t\t\t\t\t\t</datalist>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class=\"customers__item\">\n\t\t\t\t\t\t\t\t<input type=\"text\" name=\"customerCount\" list=\"customerCountList\" [(ngModel)]=\"form.customerCount\" (ngModelChange)=\"applyForm()\" class=\"customers__input\" />\n\t\t\t\t\t\t\t\t<div class=\"customers__note\">\n\t\t\t\t\t\t\t\t\t<span class=\"customers__label\">Number Affected:</span>\n\t\t\t\t\t\t\t\t\t<span class=\"customers__values\">Few | Some | Many | All</span>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<datalist id=\"customerCountList\">\n\t\t\t\t\t\t\t\t\t<option>Few</option>\n\t\t\t\t\t\t\t\t\t<option>Some</option>\n\t\t\t\t\t\t\t\t\t<option>Many</option>\n\t\t\t\t\t\t\t\t\t<option>All</option>\n\t\t\t\t\t\t\t\t</datalist>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\t\tInternal:\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"form__field-body internal\">\n\n\t\t\t\t\t\t\t<div class=\"internal__item\">\n\t\t\t\t\t\t\t\t<input type=\"text\" name=\"internalTeam\" list=\"internalTeamList\" [(ngModel)]=\"form.internalTeam\" (ngModelChange)=\"applyForm()\" class=\"internal__input\" />\n\t\t\t\t\t\t\t\t<div class=\"internal__note\">\n\t\t\t\t\t\t\t\t\t<span class=\"internal__label\">Team Performing Investigation / Writing RCA</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<datalist id=\"internalTeamList\">\n\t\t\t\t\t\t\t\t\t<option>Aqua</option>\n\t\t\t\t\t\t\t\t\t<option>Armory-Gray</option>\n\t\t\t\t\t\t\t\t\t<option>Black</option>\n\t\t\t\t\t\t\t\t\t<option>Blue</option>\n\t\t\t\t\t\t\t\t\t<option>Compute-Fabric</option>\n\t\t\t\t\t\t\t\t\t<option>Copper</option>\n\t\t\t\t\t\t\t\t\t<option>Core-Services</option>\n\t\t\t\t\t\t\t\t\t<option>Cto</option>\n\t\t\t\t\t\t\t\t\t<option>Data-Services</option>\n\t\t\t\t\t\t\t\t\t<option>Edge</option>\n\t\t\t\t\t\t\t\t\t<option>Engineering-Tools</option>\n\t\t\t\t\t\t\t\t\t<option>Engineering-Velocity</option>\n\t\t\t\t\t\t\t\t\t<option>Gold</option>\n\t\t\t\t\t\t\t\t\t<option>Green</option>\n\t\t\t\t\t\t\t\t\t<option>Grey</option>\n\t\t\t\t\t\t\t\t\t<option>Neon</option>\n\t\t\t\t\t\t\t\t\t<option>Orange</option>\n\t\t\t\t\t\t\t\t\t<option>Pink</option>\n\t\t\t\t\t\t\t\t\t<option>Platform-Labs</option>\n\t\t\t\t\t\t\t\t\t<option>Purple</option>\n\t\t\t\t\t\t\t\t\t<option>Rainbow</option>\n\t\t\t\t\t\t\t\t\t<option>Red</option>\n\t\t\t\t\t\t\t\t\t<option>Security</option>\n\t\t\t\t\t\t\t\t\t<option>Shared-Services</option>\n\t\t\t\t\t\t\t\t\t<option>Silver</option>\n\t\t\t\t\t\t\t\t\t<option>Site-Ops</option>\n\t\t\t\t\t\t\t\t\t<option>Site-Reliability</option>\n\t\t\t\t\t\t\t\t\t<option>Slate</option>\n\t\t\t\t\t\t\t\t\t<option>Studio-Cloud</option>\n\t\t\t\t\t\t\t\t\t<option>Studio-Core</option>\n\t\t\t\t\t\t\t\t\t<option>Studio-Prototyping</option>\n\t\t\t\t\t\t\t\t\t<option>Studio-Screen-Design</option>\n\t\t\t\t\t\t\t\t\t<option>Studio-Tooling</option>\n\t\t\t\t\t\t\t\t</datalist>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class=\"internal__item\">\n\t\t\t\t\t\t\t\t<input type=\"text\" name=\"zendeskTicket\" [(ngModel)]=\"form.zendeskTicket\" (ngModelChange)=\"applyForm()\" class=\"internal__input\" />\n\t\t\t\t\t\t\t\t<div class=\"internal__note\">\n\t\t\t\t\t\t\t\t\t<span class=\"internal__label\">Zendesk Ticket</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t</ng-template>\n\n\t\t\t\t<ng-template [ngIf]=\"( form.version === 'general' )\">\n\n\t\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\t\tPriority:\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"form__field-body form__field-body--select\">\n\n\t\t\t\t\t\t\t<select name=\"priority\" [(ngModel)]=\"form.priorityID\" (ngModelChange)=\"applyForm()\">\n\t\t\t\t\t\t\t\t<option *ngFor=\"let option of priorities\" [ngValue]=\"option.id\">\n\t\t\t\t\t\t\t\t\t{{ option.id }} &mdash; {{ option.description }}\n\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t</select>\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t</ng-template>\n\n\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\tStarted At:\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form__field-body form__field-body--select\">\n\n\t\t\t\t\t\t<bn-date-time [(value)]=\"form.startedAt\" (valueChange)=\"applyForm()\"></bn-date-time>\n\n\t\t\t\t\t\t<span class=\"local-time-note\">\n\t\t\t\t\t\t\t( Use your local time )\n\t\t\t\t\t\t</span>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\tVideo Link:\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form__field-body\">\n\n\t\t\t\t\t\t<input type=\"text\" name=\"videoLink\" [(ngModel)]=\"form.videoLink\" (ngModelChange)=\"applyForm()\" class=\"large\" />\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\tUpdate:\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form__field-body form__field-body--select add-update\">\n\n\t\t\t\t\t\t<select name=\"updateStatus\" [(ngModel)]=\"form.updateStatusID\" class=\"add-update__status\">\n\t\t\t\t\t\t\t<option *ngFor=\"let option of statuses\" [ngValue]=\"option.id\">\n\t\t\t\t\t\t\t\t{{ option.id }}\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t</select>\n\n\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\tname=\"updateDescription\"\n\t\t\t\t\t\t\t[(ngModel)]=\"form.updateDescription\"\n\t\t\t\t\t\t\t(keydown.meta.Enter)=\"addUpdate()\"\n\t\t\t\t\t\t\tclass=\"add-update__content\">\n\t\t\t\t\t\t</textarea>\n\n\t\t\t\t\t\t<button type=\"button\" (click)=\"addUpdate()\" class=\"add-update__submit\">\n\t\t\t\t\t\t\tAdd Update\n\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t<span class=\"add-update__submit-note\">Or CMD+Enter</span>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"form__field form__field--slack\">\n\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\tFor Slack:\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form__field-body form__field-body--select slack\">\n\n\t\t\t\t\t\t<select name=\"slackSize\" [(ngModel)]=\"form.slackSize\" (ngModelChange)=\"applyForm()\" class=\"slack__size\">\n\t\t\t\t\t\t\t<option [ngValue]=\"9999\">Show All Updates</option>\n\t\t\t\t\t\t\t<option [ngValue]=\"1\">1 Update</option>\n\t\t\t\t\t\t\t<option [ngValue]=\"3\">3 Updates</option>\n\t\t\t\t\t\t\t<option [ngValue]=\"5\">5 Updates</option>\n\t\t\t\t\t\t\t<option [ngValue]=\"8\">8 Updates</option>\n\t\t\t\t\t\t\t<option [ngValue]=\"13\">13 Updates</option>\n\t\t\t\t\t\t</select>\n\n\t\t\t\t\t\t<select name=\"slackFormat\" [(ngModel)]=\"form.slackFormat\" (ngModelChange)=\"applyForm()\" class=\"slack__format\">\n\t\t\t\t\t\t\t<option [ngValue]=\" 'compact' \">Compact</option>\n\t\t\t\t\t\t\t<option [ngValue]=\" 'readable' \">Readable</option>\n\t\t\t\t\t\t</select>\n\n\t\t\t\t\t\t<select name=\"slackTimezone\" [(ngModel)]=\"form.slackTimezone\" (ngModelChange)=\"applyForm()\" class=\"slack__timezone\">\n\t\t\t\t\t\t\t<option *ngFor=\"let option of timezones\" [ngValue]=\"option\">\n\t\t\t\t\t\t\t\t{{ option.abbreviation }} - {{ option.name }} ( {{ option.utc }} )\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t</select>\n\n\t\t\t\t\t\t<textarea #slackRef [readonly]=\"true\" [value]=\"form.slack\" (click)=\"slackRef.select()\" class=\"slack__content\"></textarea>\n\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t</form>\n\n\t\t</section>\n\n\t\t<section *ngIf=\"incident.updates.length\" class=\"previous-updates\">\n\n\t\t\t<header class=\"section-header\">\n\n\t\t\t\t<h2 class=\"section-header__title\">\n\t\t\t\t\tPrevious Updates\n\t\t\t\t</h2>\n\n\t\t\t\t<div class=\"section-header__attributes updates-sort\">\n\t\t\t\t\t<span class=\"updates-sort__label\">\n\t\t\t\t\t\tSort:\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class=\"updates-sort__selection\">\n\t\t\t\t\t\t<a\n\t\t\t\t\t\t\t(click)=\"sortUpdates( 'asc' )\"\n\t\t\t\t\t\t\tclass=\"updates-sort__direction\"\n\t\t\t\t\t\t\t[class.updates-sort__direction--on]=\"( updateSortDirection === 'asc' )\"\n\t\t\t\t\t\t\t>Asc</a>\n\t\t\t\t\t\t-\n\t\t\t\t\t\t<a\n\t\t\t\t\t\t\t(click)=\"sortUpdates( 'desc' )\"\n\t\t\t\t\t\t\tclass=\"updates-sort__direction\"\n\t\t\t\t\t\t\t[class.updates-sort__direction--on]=\"( updateSortDirection === 'desc' )\"\n\t\t\t\t\t\t\t>Desc</a>\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\n\t\t\t</header>\n\n\t\t\t<!-- BEGIN: Edit Form. -->\n\t\t\t<ng-template [ngIf]=\"editForm.update\">\n\n\t\t\t\t<form class=\"form\">\n\n\t\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\t\tStatus:\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"form__field-body form__field-body--select\">\n\n\t\t\t\t\t\t\t<select name=\"updateStatus\" [(ngModel)]=\"editForm.statusID\" class=\"update__status\">\n\t\t\t\t\t\t\t\t<option *ngFor=\"let option of statuses\" [ngValue]=\"option.id\">\n\t\t\t\t\t\t\t\t\t{{ option.id }}\n\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t</select>\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\t\tCreated At:\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"form__field-body form__field-body--select\">\n\n\t\t\t\t\t\t\t<bn-date-time [(value)]=\"editForm.createdAt\"></bn-date-time>\n\n\t\t\t\t\t\t\t<span class=\"local-time-note\">\n\t\t\t\t\t\t\t\t( Use your local time )\n\t\t\t\t\t\t\t</span>\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"form__field\">\n\t\t\t\t\t\t<div class=\"form__field-label\">\n\t\t\t\t\t\t\tDescription:\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"form__field-body\">\n\n\t\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\t\tname=\"updateDescription\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"editForm.description\"\n\t\t\t\t\t\t\t\t(keydown.meta.Enter)=\"saveUpdateChanges()\"\n\t\t\t\t\t\t\t\tclass=\"\">\n\t\t\t\t\t\t\t</textarea>\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"form__actions\">\n\n\t\t\t\t\t\t<button type=\"button\" (click)=\"saveUpdateChanges()\" class=\"form__primary-action\">\n\t\t\t\t\t\t\tSave Changes\n\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t<a (click)=\"cancelEdit()\" class=\"form__secondary-action\">Cancel</a>\n\n\t\t\t\t\t</div>\n\n\t\t\t\t</form>\n\n\t\t\t</ng-template>\n\t\t\t<!-- END: Edit Form. -->\n\n\n\t\t\t<!-- BEGIN: Timeline. -->\n\t\t\t<ng-template [ngIf]=\"! editForm.update\">\n\n\t\t\t\t<div class=\"timeline\">\n\n\t\t\t\t\t<div *ngFor=\"let update of incident.updates | timelineSort : updateSortDirection\" class=\"timeline__item\">\n\n\t\t\t\t\t\t<div class=\"timeline__createdAt\">\n\t\t\t\t\t\t\t<div class=\"timeline__time\">\n\t\t\t\t\t\t\t\t{{ update.createdAt | timelineTime }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"timeline__date\">\n\t\t\t\t\t\t\t\t{{ update.createdAt | timelineDate }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"timeline__description\">\n\t\t\t\t\t\t\t<span class=\"timeline__status\">{{ update.status.id }}</span>\n\t\t\t\t\t\t\t&mdash;\n\t\t\t\t\t\t\t{{ update.description }}\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"timeline__actions\">\n\t\t\t\t\t\t\t<a (click)=\"editUpdate( update )\" class=\"timeline__edit\">edit</a>\n\t\t\t\t\t\t\t<span class=\"timeline__separator\">|</span>\n\t\t\t\t\t\t\t<a (click)=\"deleteUpdate( update )\" class=\"timeline__delete\">delete</a>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\n\t\t\t</ng-template>\n\t\t\t<!-- END: Timeline. -->\n\n\t\t</section>\n\n\t\t<footer class=\"app-footer\">\n\n\t\t\t<div class=\"app-footer__action\">\n\t\t\t\tIf you are worried about having your information in \"the cloud,\" you can \n\t\t\t\t<a (click)=\"deleteIncident()\">delete your incident</a>\n\t\t\t\twhen you are done with it.\n\t\t\t</div>\n\n\t\t</footer>\n\n\t</div>\n\n\t<ng-template [ngIf]=\"globalInsight\">\n\n\t\t<div class=\"global-insight\">\n\t\t\t{{ globalInsight }}\n\t\t</div>\n\n\t</ng-template>\n\n</ng-template>\n<!-- END: Incident selected and fully loaded. -->\n"

/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
// Import the application components and services.
var app_view_component_1 = __webpack_require__(149);
var shared_module_1 = __webpack_require__(381);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
var AppViewModule = /** @class */ (function () {
    function AppViewModule() {
    }
    AppViewModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule
            ],
            declarations: [
                app_view_component_1.AppViewComponent
            ]
        })
    ], AppViewModule);
    return AppViewModule;
}());
exports.AppViewModule = AppViewModule;


/***/ }),

/***/ 381:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var common_1 = __webpack_require__(17);
var forms_1 = __webpack_require__(116);
var core_1 = __webpack_require__(5);
// Import the application components and services.
var date_time_component_1 = __webpack_require__(382);
var timeline_date_pipe_1 = __webpack_require__(385);
var timeline_sort_pipe_1 = __webpack_require__(386);
var timeline_time_pipe_1 = __webpack_require__(387);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
var sharedModules = [
    common_1.CommonModule,
    forms_1.FormsModule
];
var sharedDeclarations = [
    date_time_component_1.DateTimeComponent,
    timeline_date_pipe_1.TimelineDatePipe,
    timeline_sort_pipe_1.TimelineSortPipe,
    timeline_time_pipe_1.TimelineTimePipe
];
// The goal of the SharedModule is to organize declarations and other modules that will
// be imported into other modules (for rendering). This module should NOT contain any
// service providers (those are in the CoreModule).
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule
            ],
            exports: sharedDeclarations.concat(sharedModules),
            declarations: sharedDeclarations.slice()
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;


/***/ }),

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
var core_2 = __webpack_require__(5);
var core_3 = __webpack_require__(5);
// Import the application services.
var lodash_extended_1 = __webpack_require__(57);
var DateTimeComponent = /** @class */ (function () {
    // I initialize the app component.
    function DateTimeComponent() {
        var now = new Date();
        this.value = null;
        this.valueChange = new core_3.EventEmitter();
        this.form = {
            year: null,
            month: null,
            day: null,
            hour: null,
            minute: null
        };
        this.yearOptions = this.fromRange((now.getFullYear() - 1), (now.getFullYear() + 1));
        this.monthOptions = this.getMonthOptions();
        this.dayOptions = this.fromRange(1, 31);
        this.hourOptions = this.getHourOptions();
        this.minuteOptions = this.fromRange(0, 59);
    }
    // ---
    // PUBLIC METHODS.
    // ---
    // I take the ngModel changes and emit any relevant value updates.
    DateTimeComponent.prototype.applyFormUpdates = function () {
        var _this = this;
        // If all of the values have been selected, we should be able to calculated a new
        // date from the individual pieces.
        if (this.form.year &&
            this.form.month &&
            this.form.day &&
            this.form.hour &&
            this.form.minute) {
            var selectedDate = new Date(this.form.year.id, this.form.month.id, this.form.day.id, this.form.hour.id, this.form.minute.id, 0);
            // If the month is an unexpected value, it means the year / month / date 
            // combination is not valid. Set the date to zero in order to rollback to
            // the previous month.
            if (selectedDate.getMonth() !== this.form.month.id) {
                selectedDate.setDate(0); // Rolls back to last day of previous month.
            }
            this.valueChange.emit(selectedDate);
            // If we are missing values, but the input value is a known date, then it means 
            // the user is moving the date from a known to an unknown state.
        }
        else if (this.value instanceof Date) {
            this.valueChange.emit(null);
        }
        // HACK: Because the calling context may not react to the emitted date, we need
        // to use a setTimeout() to trigger an additional change-detection in order to
        // ensure that the local select inputs are updated to reflect the bound value.
        setTimeout(function () {
            _this.applyValue();
        }, 10);
    };
    // I return the number of days in the currently-selected month.
    DateTimeComponent.prototype.getDaysInMonth = function () {
        if (!this.form.year || !this.form.month) {
            return (this.dayOptions.length);
        }
        var testDate = new Date(this.form.year.id, (this.form.month.id + 1), 0);
        return (testDate.getDate());
    };
    // I apply the incoming changes to the local form model.
    DateTimeComponent.prototype.ngOnChanges = function (changes) {
        if (this.value && !(this.value instanceof Date)) {
            this.value = null;
        }
        this.applyValue();
    };
    // ---
    // PRIVATE METHODS.
    // ---
    // I update the form values based on the bound value.
    DateTimeComponent.prototype.applyValue = function () {
        if (this.value) {
            // Rebuild the year options based on the input. If the input is out of range,
            // we won't be able to properly render the form.
            this.yearOptions = this.fromRange((this.value.getFullYear() - 1), (this.value.getFullYear() + 1));
            this.form.year = lodash_extended_1._.find(this.yearOptions, ["id", this.value.getFullYear()]);
            this.form.month = lodash_extended_1._.find(this.monthOptions, ["id", this.value.getMonth()]);
            this.form.day = lodash_extended_1._.find(this.dayOptions, ["id", this.value.getDate()]);
            this.form.hour = lodash_extended_1._.find(this.hourOptions, ["id", this.value.getHours()]);
            this.form.minute = lodash_extended_1._.find(this.minuteOptions, ["id", this.value.getMinutes()]);
        }
        else {
            this.form.year = null;
            this.form.month = null;
            this.form.day = null;
            this.form.hour = null;
            this.form.minute = null;
        }
    };
    // I get the date options based on the given range.
    DateTimeComponent.prototype.fromRange = function (start, end) {
        var options = lodash_extended_1._.range(start, (end + 1) /* exclusive. */).map(function (value) {
            var description = (value < 10)
                ? ("0" + value)
                : value.toString();
            return ({
                id: value,
                description: description
            });
        });
        return (options);
    };
    // I get the hour options, id starts at 0.
    DateTimeComponent.prototype.getHourOptions = function () {
        var options = lodash_extended_1._.range(0, 24 /* exclusive. */).map(function (value) {
            var description = ((value % 12) || 12).toString();
            if (value < 12) {
                description += " AM";
            }
            else {
                description += " PM";
            }
            return ({
                id: value,
                description: description
            });
        });
        return (options);
    };
    // I get the month options, id starts at zero.
    DateTimeComponent.prototype.getMonthOptions = function () {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var options = months.map(function (monthAsString, index) {
            return ({
                id: index,
                description: monthAsString
            });
        });
        return (options);
    };
    DateTimeComponent = __decorate([
        core_2.Component({
            selector: "bn-date-time",
            inputs: ["value"],
            outputs: ["valueChange"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            styles: [__webpack_require__(383)],
            template: __webpack_require__(384)
        }),
        __metadata("design:paramtypes", [])
    ], DateTimeComponent);
    return DateTimeComponent;
}());
exports.DateTimeComponent = DateTimeComponent;


/***/ }),

/***/ 383:
/***/ (function(module, exports) {

module.exports = ":host {\n  display: inline-block;\n  font-size: inherit ;\n}\nselect {\n  font-size: inherit ;\n}\ndiv.date {\n  display: inline-block;\n}\ndiv.seperator {\n  display: inline-block;\n  margin-left: 10px ;\n  margin-right: 10px ;\n}\ndiv.time {\n  display: inline-block;\n}\n"

/***/ }),

/***/ 384:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"date\">\n\n\t<select name=\"month\" [(ngModel)]=\"form.month\" (ngModelChange)=\"applyFormUpdates()\">\n\t\t<option [ngValue]=\"null\">- -</option>\n\t\t<option *ngFor=\"let m of monthOptions\" [ngValue]=\"m\">\n\t\t\t{{ m.description }}\n\t\t</option>\n\t</select>\n\n\t<select name=\"day\" [(ngModel)]=\"form.day\" (ngModelChange)=\"applyFormUpdates()\">\n\t\t<option [ngValue]=\"null\">- -</option>\n\t\t<option *ngFor=\"let option of dayOptions | slice:0:getDaysInMonth()\" [ngValue]=\"option\">\n\t\t\t{{ option.description }}\n\t\t</option>\n\t</select>\n\n\t<select name=\"year\" [(ngModel)]=\"form.year\" (ngModelChange)=\"applyFormUpdates()\">\n\t\t<option [ngValue]=\"null\">- -</option>\n\t\t<option *ngFor=\"let option of yearOptions\" [ngValue]=\"option\">\n\t\t\t{{ option.description }}\n\t\t</option>\n\t</select>\n\n</div>\n\n<div class=\"seperator\">\n\t@\n</div>\n\n<div class=\"time\">\n\n\t<select name=\"hour\" [(ngModel)]=\"form.hour\" (ngModelChange)=\"applyFormUpdates()\">\n\t\t<option [ngValue]=\"null\">- -</option>\n\t\t<option *ngFor=\"let option of hourOptions\" [ngValue]=\"option\">\n\t\t\t{{ option.description }}\n\t\t</option>\n\t</select>\n\n\t<select name=\"minute\" [(ngModel)]=\"form.minute\" (ngModelChange)=\"applyFormUpdates()\">\n\t\t<option [ngValue]=\"null\">- -</option>\n\t\t<option *ngFor=\"let option of minuteOptions\" [ngValue]=\"option\">\n\t\t\t{{ option.description }}\n\t\t</option>\n\t</select>\n\n</div>\n"

/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
var TimelineDatePipe = /** @class */ (function () {
    // I initialize the timeline data pipe service.
    function TimelineDatePipe() {
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }
    // ---
    // PUBLIC METHODS.
    // ---
    // I format the given Date object for use as the Date string in the timeline.
    TimelineDatePipe.prototype.transform = function (value) {
        var month = value.getMonth();
        var day = value.getDate();
        return (this.monthNames[month] + " " + day);
    };
    TimelineDatePipe = __decorate([
        core_1.Pipe({
            name: "timelineDate",
            pure: true
        }),
        __metadata("design:paramtypes", [])
    ], TimelineDatePipe);
    return TimelineDatePipe;
}());
exports.TimelineDatePipe = TimelineDatePipe;


/***/ }),

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
var TimelineSortPipe = /** @class */ (function () {
    function TimelineSortPipe() {
    }
    // I return a sorted version of the updates based on the given direction.
    TimelineSortPipe.prototype.transform = function (updates, direction) {
        var sortedUpdates = updates.slice();
        sortedUpdates.sort(function (a, b) {
            // Sort ascending.
            if (direction === "asc") {
                if (a.createdAt < b.createdAt) {
                    return (-1);
                }
                else if (a.createdAt > b.createdAt) {
                    return (1);
                }
                // Sort descending.
            }
            else {
                if (a.createdAt > b.createdAt) {
                    return (-1);
                }
                else if (a.createdAt < b.createdAt) {
                    return (1);
                }
            }
        });
        return (sortedUpdates);
    };
    TimelineSortPipe = __decorate([
        core_1.Pipe({
            name: "timelineSort",
            pure: true
        })
    ], TimelineSortPipe);
    return TimelineSortPipe;
}());
exports.TimelineSortPipe = TimelineSortPipe;


/***/ }),

/***/ 387:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var core_1 = __webpack_require__(5);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
var TimelineTimePipe = /** @class */ (function () {
    function TimelineTimePipe() {
    }
    // I format the given Date object for use as the Time string in the timeline.
    TimelineTimePipe.prototype.transform = function (value) {
        var hours = value.getHours();
        var minutes = value.getMinutes();
        var timezone = value.toTimeString().match(/\((\w+)\)/)[1];
        var period = (hours < 12)
            ? "AM"
            : "PM";
        var normalizedHours = ((hours % 12) || 12);
        var normalizedMinuets = ("0" + minutes).slice(-2);
        return (normalizedHours + ":" + normalizedMinuets + " " + period + " " + timezone);
    };
    TimelineTimePipe = __decorate([
        core_1.Pipe({
            name: "timelineTime",
            pure: true
        })
    ], TimelineTimePipe);
    return TimelineTimePipe;
}());
exports.TimelineTimePipe = TimelineTimePipe;


/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var common_1 = __webpack_require__(17);
var common_2 = __webpack_require__(17);
var common_3 = __webpack_require__(17);
var core_1 = __webpack_require__(5);
var platform_browser_1 = __webpack_require__(25);
// Import the application components and services.
var cache_service_1 = __webpack_require__(150);
var clipboard_service_1 = __webpack_require__(151);
var incident_gateway_1 = __webpack_require__(153);
var incident_service_1 = __webpack_require__(152);
var quote_service_1 = __webpack_require__(154);
var slack_serializer_1 = __webpack_require__(155);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
// The goal of the CoreModule is to organize providers for the root of the application.
// This module should NOT contain any declarations (those are in the SharedModule).
var CoreModule = /** @class */ (function () {
    function CoreModule() {
    }
    CoreModule = __decorate([
        core_1.NgModule({
            providers: [
                cache_service_1.CacheService,
                clipboard_service_1.ClipboardService,
                incident_gateway_1.IncidentGateway,
                incident_service_1.IncidentService,
                common_2.Location,
                {
                    provide: common_3.LocationStrategy,
                    useClass: common_1.HashLocationStrategy
                },
                quote_service_1.QuoteService,
                slack_serializer_1.SlackSerializer,
                platform_browser_1.Title
            ]
        })
    ], CoreModule);
    return CoreModule;
}());
exports.CoreModule = CoreModule;


/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Import the core angular services.
var find = __webpack_require__(123);
var last = __webpack_require__(144);
var random = __webpack_require__(145);
var range = __webpack_require__(147);
var without = __webpack_require__(148);
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
// Package and export the individual lodash functions as a local / extended version of 
// lodash. This way, you don't have to have little function names floating around in
// your code. It also makes it quite clear which functions are actually being used (and
// will need to be echoed in your "vendor" module).
exports._ = {
    find: find,
    last: last,
    random: random,
    range: range,
    without: without
};


/***/ })

},[375]);