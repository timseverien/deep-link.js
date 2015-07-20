/*!
 * Deep-link.js
 * https://timseverien.com/projects/deep-link/
 *
 * Copyright 2014
 * Released under MIT license
 */

(function() {
	'use strict';

	/****************************************************************
	 * VARIABLES
	 ****************************************************************/

	var delay = 1200,
		OSs = {
			android: {
				store_prefix: 'https://play.google.com/store/apps/details?id=',
				test: /Android/i
			},

			iOS: {
				store_prefix: 'https://itunes.apple.com/en/app/id',
				test: /iPhone|iPad|iPod/i
			}
		};


	/****************************************************************
	 * FUNCTIONS
	 ****************************************************************/

	// Get user agent
	var getUserAgent = function() {
		var k;

		for(k in OSs) {
			if(navigator.userAgent.match(OSs[k].test)) return k;
		}

		return '';
	};

	// Get current time in ms
	var getTime = function() {
		return new Date().getTime();
	};

	var open = function(url) {
		window.location.href = url;
	};

	// Parse a single element
	var parseElement = function(el) {
		var clicked, timeout,
			OS = getUserAgent(),
			OSAttr = OS.toLowerCase(),

			href = el.getAttribute('href'),
			app = (
				el.getAttribute('data-app-' + OSAttr) ||
				el.getAttribute('data-app')
			),
			store = (
				el.getAttribute('data-store-' + OSAttr) ||
				el.getAttribute('data-store')
			);

		if(!app) return;
		if(!href) el.setAttribute('href', app);

		if(OS && app) {
			// Hijack click event
			el.onclick = function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();

				var win;

				// Store start time
				var start = getTime();
				clicked = true;

				// Timeout to detect if the link worked
				timeout = setTimeout(function() {
					// Check if any of the values are unset
					if(!clicked || !timeout) return;

					// Get current time
					var now = getTime();

					// Reset things
					clicked = false;
					timeout = null;

					// Has the user left the screen? ABORT!
					if(now - start >= delay * 2) return;

					// Open store or original link
					if(store) open(OSs[OS].store_prefix + store);
					else if(href) open(href);
				}, delay);

				// Go to app
				win = open(app);
			};
		} else if(!href || href === '#') {
			// Apps are presumably not supported
			el.style.display = 'none';
		}

		// Triggered on blur
		visibly.onHidden(function() {
			if(!clicked || !timeout) return;

			// Reset everything
			timeout = clearInterval(timeout);
			clicked = false;
		});
	};


	/****************************************************************
	 * INITIALIZE
	 ****************************************************************/

	var elements = document.getElementsByTagName('a'),
		i = elements.length;

	while(i--) parseElement(elements[i]);
})();
