/*
 * jQuery Social Tracker Plugin
 * @author Vasken Hauri
 * Enables easy implementation of Google analytics social tracking
 * a la http://code.google.com/apis/analytics/docs/tracking/gaTrackingSocial.html
 */
(function( $ ){
	function extractParamFromUri(uri, paramName) {
		if (!uri) {
			return;
		}
		var uri = uri.split('#')[0];  // Remove anchor.
		var parts = uri.split('?');  // Check for query params.
		if (parts.length == 1) {
			return;
		}
		var query = decodeURI(parts[1]);

		// Find url param.
		paramName += '=';
		var params = query.split('&');
		for (var i = 0, param; param = params[i]; ++i) {
			if (param.indexOf(paramName) === 0) {
				return unescape(param.split('=')[1]);
			}
		}
	}

	function trackTwitter(action, separate_clicks) {
		if(!action) {
			return;
		}

		try {
			if(twttr && twttr.events) {
				twttr.events.bind(action, function(event) {
					if (event) {
						if( 'click' === action && separate_clicks ) {
							action = event.region;
						}
						var targetUrl;
						if (event.target && event.target.nodeName == 'IFRAME') {
							targetUrl = extractParamFromUri(event.target.src, 'url');
						}
						_gaq.push(['_trackSocial', 'twitter', action, targetUrl]);
					}
				});
			}
		} catch(e) {}
	}

	var methods = {
		init : function(options) { 
						 var settings = {
							 twitter: true,
							 facebook: true,
						 	 tw_events: {
								tweet: true,
								follow: true,
								retweet: true,
								favorite: true,
								click: true
							 },
							 tw_separate_clicks: false
						 }

						 options = $.extend(options, settings);

						 try {
							 if(FB && FB.Event && FB.Event.subscribe) {
								 FB.Event.subscribe('edge.create', function(targetUrl) {
									 _gaq.push(['_trackSocial', 'facebook', 'like', targetUrl]);
								 });
								 FB.Event.subscribe('message.send', function(targetUrl) {
									 _gaq.push(['_trackSocial', 'facebook', 'send', targetUrl]);
								 });
							 }
						 } catch(e) {}

						 trackTwitter( 'tweet' );
						 trackTwitter( 'follow' );
						 trackTwitter( 'retweet' );
						 trackTwitter( 'favorite' );
						 trackTwitter( 'click', settings.tw_separate_clicks );

						 return 'Social tracking enabled';
					 }
	};

	$.fn.socialTracker = function( method ) {

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.socialTracker' );
		}    

	};

})( jQuery );
