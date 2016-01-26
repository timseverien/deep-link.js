/*!
 * Deep-link.js
 * https://timseverien.com/projects/deep-link/
 *
 * Copyright 2015
 * Released under MIT license
 */

(function() {
	'use strict';

	/****************************************************************
	 * VARIABLES
	 ****************************************************************/

	var delay = 1200,
		OSs = {
			// Sometimes, Windows Phone contains Android in it’s UA
			// To prevent it from overlapping with Android, try Windows first
			windows: {
				store_prefix: 'zune:navigate?appid=',
				test: /Windows\s+Phone|IEMobile/i
			},

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

	var handleAndroidBrowsers = function(app, store, href, scheme) {
	  // Android Mobile
	  var isAndroidMobile = navigator.userAgent.indexOf('Android') > -1 &&
	                        navigator.userAgent.indexOf('Mozilla/5.0') > -1 &&
	                        navigator.userAgent.indexOf('AppleWebKit') > -1;
	  // Android Browser (not Chrome)
	  var regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/);
	  var resultAppleWebKitRegEx = regExAppleWebKit.exec(navigator.userAgent);
	  var appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(navigator.userAgent)[1]));
	  var isAndroidBrowser = isAndroidMobile && appleWebKitVersion !== null && appleWebKitVersion > 500;

	  if(isAndroidBrowser) {
	    return 'intent:' + app.split(':')[1] + '#Intent;scheme=' + scheme + ';package=' +
	      store + ';S.browser_fallback_url=' + encodeURI(href);
	  }
	  else {
	    return app;
	  }
	}

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
			),
			scheme = (
				el.getAttribute('data-android-scheme')
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

				var finalURI = handleAndroidBrowsers(app, store, href, scheme);

				// Go to app
				win = open(finalURI);
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
