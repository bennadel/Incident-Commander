
// Import the core angular services.
import { _ } from "./lodash-extended";
import { Injectable } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export interface Quote {
	author: string;
	excerpt: string;
}

@Injectable({
	providedIn: "root"
})
export class QuoteService {

	private quotes: Quote[];


	// I initialize the quote services.
	constructor() {
		
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
	public getRandomQuote() : Quote {

		var index = _.random( 0, ( this.quotes.length - 1 ) );

		return( this.quotes[ index ] );

	}

}
