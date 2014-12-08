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
	 * SUPPORTED USER AGENTS
	 ****************************************************************/
	
	var OSs = {
		android: {
			store_prefix: 'https://play.google.com/store/apps/details?id=',
			test: /Android/i
		},
		
		iOS: {
			store_prefix: 'https://itunes.apple.com/en/app/',
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
	};
	
	// Get current time in ms
	var getTime = function() {
		return new Date().getTime();
	};
	
	// Parse a single element
	var parseElement = function(el) {
		var OS = getUserAgent(),
			href = el.getAttribute('href'),
			
			app = (
				el.getAttribute('data-app-' + OS) ||
				el.getAttribute('data-app')
			),
			store = (
				el.getAttribute('data-store-' + OS) ||
				el.getAttribute('data-store')
			);
		
		if(OS && app) {
			// Apps are supported so override onclick
			el.setAttribute('href', app);
			
			// Hijack click event
			el.onclick = function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				var start = getTime();
				var delay = 800;
				
				// Timeout to detect if the link worked
				setTimeout(function() {
					var now = getTime();
					
					// Do nothing if the user has been away for a while
					if(now >= start + delay * 2) return;
					
					if(store) {
						// Go to the store
						window.location.href = OSs[OS].store_prefix + store;
					} else if(href) {
						window.location.href = href;
					}
				}, delay);
			};
		} else if(!href || href === '#') {
			// Apps are presumably not supported, and there’s no valid link
			el.style.display = 'none';
		}
	};
	
	
	/****************************************************************
	 * INITIALIZE
	 ****************************************************************/
		
	var elements = document.getElementsByTagName('a'),
		i = elements.length;
	
	while(i--) parseElement(elements[i]);
})();