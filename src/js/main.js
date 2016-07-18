'use strict';
/* global Modernizr*/

/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

 app.js

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

 This is the entry point for front-end javascript

*/

import * as $ from '../../bower_components/utils.js/utils';
import {Pagecontroller} from './Pagecontroller';

var App = App || {};


/*
	
 Primary page function
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

*/

App.pageInit = () => {
	console.log('Initialised the app');

	// Run some functions when page is loaded
	App.onPageLoaded();
};


/*
	
 Page loading events
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

*/

App.pageLoaderEl = document.getElementsByTagName('body')[0];

App.onPageLoaded = () => {
	setTimeout(function() {
		$.removeClass(App.pageLoaderEl, 'is-page-loading');
		App.pageLoaderEl.className += ' is-page-loaded';	
	}, 400);
}


/*
	
 Setup page loader and history api
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

*/

App.pageLoader = new Pagecontroller({
	loaderClass: 'page-loader',
	onLoadRequest: function() {
		$.removeClass(App.pageLoaderEl, 'is-page-loaded');
		App.pageLoaderEl.className += ' is-page-loading';

		// Force browser scroll to top of page
		setTimeout(function() {
			window.scrollTo(0,0);
		}, 400);
	},
	onLoadSuccess: function() {
		App.pageInit();
	}
});


/*
	
 Initialise app
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

*/

App.pageLoader.init();
App.pageInit();