'use strict';
/* global Modernizr*/


/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

 Pagecontroller.js

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

 A simple script for loading pages via ajax and updating browser location
 via the browser history api

*/

import * as $ from '../../bower_components/utils.js/utils';


class Pagecontroller {
	constructor(options) {
		if(!options) {
			throw new Error('Please provide options for page controller');
		}

		this.onLoadRequest = options.onLoadRequest || function() {};
		this.onLoadSuccess = options.onLoadSuccess || function() {};
		this.afterPageLoad = options.afterPageLoad || function() {};
		this.loadDelay = options.loadDelay || 600;

		this._links = false;
		this._body = document.getElementsByTagName('body')[0];
		this._loaderClass = options.loaderClass;
		this._pageLoader = document.getElementsByClassName(options.loaderClass)[0];
		this._fallbackTimer = 10000;
		this._handlerArr = [];
	}

	init() {
		let self = this;

		// Add event listeners to page links
		this.addLinkListeners();

		// Set initial state if no state set
		if(typeof event === 'undefined') {
			let url = window.location.href;
			history.replaceState({url: url}, '', url);
		}

		// Add popstate event listener
		window.addEventListener('popstate', self.popStateHandler.bind(self));
	}

	addLinkListeners() {
		let self = this;

		// Remove outdated event listeners by iterating over handler array
		if(this._links) {
			$.each(this._links, function(el,i) {
				el.removeEventListener('click', self._handlerArr[i], false);
			});
		}

		// Cache new page links
		this._links = document.getElementsByTagName('a');
		
		// Reset handler array
		self._handlerArr = [];

		// Attach new event listeners to page links
		$.each(this._links, function(el,i) {
			if(self.isInternalLink(el)) {
				
				// Store reference to handler event in function as bind creates new instance
				let elHandler = self.loadPage.bind(self, el.href);
				self._handlerArr.push(elHandler);

				el.addEventListener('click', elHandler, false);
			}
		});
	}

	loadPage(url, e) {

		let self = this,
			loaderTimeout = null;

		// Call page load request callback
		this.onLoadRequest.call();

		var request = new XMLHttpRequest();
		request.open('GET', url, true);

		// Setup a fallback timer to load the page via http if ajax takes too long
		loaderTimeout = setTimeout(function() {
			window.location.href = url;
		}, this._fallbackTimer);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				
				// Succesful page request so clear fallback timer
				clearTimeout(loaderTimeout);
				
				let response = request.responseText,
					div = document.createElement('div');

				// Set timer on load delay to allow for css based animations
				setTimeout(function() {

					// Filter response dom for required elements
					div.innerHTML = response;
					let pageContent = div.getElementsByClassName(self._loaderClass)[0].innerHTML;

					// Update seo meta - purely for visual purposes
					let docTitle = div.querySelectorAll('title')[0].innerHTML,
						docDesc = div.querySelectorAll('[name="description"]')[0].innerHTML;

					document.title = docTitle;
					document.description = docDesc;


					// Pass new page content to ajax success handler
					self.onAjaxSuccess(pageContent);

					// We are using the event as a hook to determine whether to update pushstate
					// popstate doesn't require this
					if(e) {
						// Pass url to history api handler
						self.pushStateHandler(url);
					}

				}, self.loadDelay);

			} else {
				// We reached the target server but it returned an error
				window.location.href = url;
			}
		};

		request.onerror = function() {
			// There was a connection error of some sort so just load the url via http
			window.location.href = url;
		};

		// Send the request
		request.send();
		
		if(e) {
			e.preventDefault();
		}
	}

	pushStateHandler(url) {
		// Update url in address bar
		history.pushState({url: url}, '', url);
	}

	popStateHandler() {
		// Load page with previous state
		if(event.state) {
			this.loadPage(event.state.url, false);
		}
	}

	onAjaxSuccess(pageContent) {
		// Clear current contents from page loader
		this._pageLoader.innerHTML = '';			

		// Load new page contents
		this._pageLoader.innerHTML = pageContent;

		// Call page load request callback
		this.onLoadSuccess.call();

		// Add new event listeners for page links
		this.addLinkListeners();
	}

	isInternalLink(link) {
		// Test if link is internal to the site (and not Cloudflare email obfustication)
		return (link.host === window.location.host && link.href.indexOf('email-protection') < 0);
	}

}

export {Pagecontroller};