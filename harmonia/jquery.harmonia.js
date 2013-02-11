/*!
 * jQuery Harmonia
 * Replace an (un)ordered list with a form select.
 *
 * @author Micky Hulse
 * @link http://hulse.me
 * @docs https://github.com/registerguard/jquery-harmonia
 * @copyright Copyright (c) 2013 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 1.0.0
 * @date 2013/02/11
 *///----------------------------------

// Notes to self:
//console.profile('profile foo');
// ... code here ...
//console.profileEnd('profile foo');
// ... or:
// console.time('timing foo');
// ... code here ...
// console.timeEnd('timing foo');

//----------------------------------

;(function($, window, document, undefined) {
	
	'use strict';
	
	//--------------------------------------------------------------------------
	//
	// Globals:
	//
	//--------------------------------------------------------------------------
	
	var console = window.console || { log : function() {}, warn : function() {} },
	
	NS = 'harmonia',
	
	//--------------------------------------------------------------------------
	//
	// Public methods:
	//
	//--------------------------------------------------------------------------
	
	methods = {
		
		/**
		 * Init constructor.
		 */
		
		init : function(opts) {
			
			//----------------------------------
			// Loop & return each `this`:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Local variable(s):
				//----------------------------------
				
				var $this   = $(this),                                                  // Target object.
				    data    = $this.data(NS),                                           // Namespace instance data.
				    options = $.extend({}, settings.external, $.fn[NS].defaults, opts); // Merge `settings`, `defaults` and `opts`.
				
				//----------------------------------
				// Initialize data:
				//----------------------------------
				
				if ( ! data) {
					
					//----------------------------------
					// Setup variables:
					//----------------------------------
					
					var $hrefs  = $this.find('> li > a'),
					    $select = $('<select>', { 'class' : options.selectClass });
					
					//----------------------------------
					// Namespaced instance `data`:
					//----------------------------------
					
					$this.data(NS, {
						
						hrefs   : $hrefs,
						init    : false,
						matched : false,
						options : options,
						target  : $this,
						select  : $select
						
					});
					
					data = $this.data(NS); // Make it easy for the rest of `init()`.
					
				}
				
				//----------------------------------
				// Data initialization check:
				//----------------------------------
				
				if ( ! data.init) {
					
					//----------------------------------
					// Data initialization flag:
					//----------------------------------
					
					data.init = true;
					
					//----------------------------------
					// Callback:
					//----------------------------------
					
					data.options.onInit.call(data.target);
					
					//----------------------------------
					// Check for object(s):
					//----------------------------------
					
					if (data.hrefs.length) {
						
						//----------------------------------
						// Root menu CSS class:
						//----------------------------------
						
						data.target.addClass(settings.internal.initClass);
						
						//----------------------------------
						// Default `<select>` `<option>`?
						//----------------------------------
						
						if (data.options.defaultOption) {
							
							//----------------------------------
							// Get the `<option>`:
							//----------------------------------
							
							var $default = optionize.call(data.target, $('<a />'), data.options.defaultOption);
							
							//----------------------------------
							// Append `<option>` to `<select>`:
							//----------------------------------
							
							if ($default.length) {
								
								$default.appendTo(data.select);
								
							}
							
						}
						
						//----------------------------------
						// Create the other `<option>`s:
						//----------------------------------
						
						data.hrefs.each(function() {
							
							//----------------------------------
							// Get the `<option>`:
							//----------------------------------
							
							var $option = optionize.call(data.target, $(this));
							
							//----------------------------------
							// Append `<option>` to `<select>`:
							//----------------------------------
							
							if ($option.length) {
								
								$option.appendTo(data.select);
								
							}
							
						});
						
						//----------------------------------
						// Add change event to `<select>`:
						//----------------------------------
						
						data.select.change(function() {
							
							//----------------------------------
							// Local variable(s):
							//----------------------------------
							
							var $$ = $(this);
							
							//----------------------------------
							// Callback:
							//----------------------------------
							
							data.options.onChange.call(data.target, $$); // @TODO: Is this the best spot for this?
							
							//----------------------------------
							// Get link value:
							//----------------------------------
							
							var val = $$.val();
							
							//----------------------------------
							// Follow link value?
							//----------------------------------
							
							if (val && (val !== '#')) { // @TODO: Improve link validation?
								
								//----------------------------------
								// Ignore default `<select>`:
								//----------------------------------
								
								if (val !== data.options.defaultOption) {
									
									//----------------------------------
									// Open tab or use current window:
									//----------------------------------
									
									if (data.options.openTab) {
										
										window.open(val); // New tab.
										
									} else {
										
										window.location = val; // Current window.
										
									}
									
								}
								
							}
							
						})
						
						//----------------------------------
						// Insert before target:
						//----------------------------------
						
						.insertBefore(data.target);
						
						//----------------------------------
						// Callback:
						//----------------------------------
						
						data.options.onAfterInit.call(data.target);
						
					} else {
						
						console.warn('there was a problem with your markup');
						
						return this;
						
					}
					
				} else {
					
					console.warn(NS, 'already initialized on', this);
					
					return this;
					
				}
				
			});
			
		}, // init()
		
		//--------------------------------------------------------------------
		
		/**
		 * Removes plugin from element.
		 *
		 * @type   { function }
		 * @this   { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		destroy : function() {
			
			//----------------------------------
			// Loop & return each `this`:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Local variable(s):
				//----------------------------------
				
				var $$   = $(this),
				    data = $$.data(NS);
				
				//----------------------------------
				// Data?
				//----------------------------------
				
				if (data) {
					
					//----------------------------------
					// Local variable(s):
					//----------------------------------
					
					//var options = data.options;
					
					//----------------------------------
					// Remove root menu CSS class:
					//----------------------------------
					
					$$.removeClass(settings.internal.initClass);
					
					//----------------------------------
					// Remove generated HTML:
					//----------------------------------
					
					data.select.remove(); // All bound events and jQuery data associated with the elements are removed: rgne.ws/LqMnF5
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					$$.removeData(NS);
					
				}
			
			});
			
		} // foo()
		
	}, // methods
	
	//--------------------------------------------------------------------------
	//
	// Private methods:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Create options for the `<select>` menu.
	 *
	 * @this   { object.jquery } The base target object.
	 * @param  { object.jquery } The `<a>` to convert a `<select>`.
	 * @param  { string } text Optional text for `<option>`.
	 * @return { * } The `<select>` `<option>` or an empty string.
	 */
	
	optionize = function($a, text) {
		
		//----------------------------------
		// Local variable(s):
		//----------------------------------
		
		var $return = '',
		    data    = this.data(NS);
		
		if (data) {
			
			//----------------------------------
			// Default arg values:
			//----------------------------------
			
			text = ((typeof text !== 'undefined') && text.length) ? text : textualize.call($a); // Use arg or `<a>` text.
			
			if (text.length) {
				
				//----------------------------------
				// Create `<option>` element:
				//----------------------------------
				
				var $option  = $('<option />'),
				    selected = false,
				    uri      = ($a.attr('href') || ''); // Current `<a>`'s uri.
				
				//----------------------------------
				// Something currently selected?
				//----------------------------------
				
				if ( ! data.matched) {
					
					//----------------------------------
					// Force select via class?
					//----------------------------------
					
					if ($a.attr('class') == 'selected') {
						
						selected = true; // Yup. Force selected.
						
					} else if (data.options.currentPage) {
						
						//----------------------------------
						// Ignore hashes and compare URI:
						//----------------------------------
						
						if (uri != '#') {
							
							var href = $(location).attr('href');
							
							//----------------------------------
							// Compare directly & indexOf():
							//----------------------------------
							
							if ((uri == href) || (href.indexOf(uri) > 0)) {
								
								selected = true; // Warning: `indexOf()` will pass if `-1`; need to explicitly check for `> 0`!
								
							}
							
						}
						
					}
					
					//----------------------------------
					// Selected!!!!!!!!!!!!!!!!!!!!!!!!!
					//----------------------------------
					
					if (selected) {
						
						//----------------------------------
						// Set `selected` attribute:
						//----------------------------------
						
						$option.attr('selected', 'selected'); // Pheeeew. :D
						
						//----------------------------------
						// Set flag and stop checking:
						//----------------------------------
						
						data.matched = true; // Flippin' switches.
						
					}
					
				}
				
				//----------------------------------
				// Location value:
				//----------------------------------
				
				$option.attr('value', uri);
				
				//----------------------------------
				// Assign text to `<option>`:
				//----------------------------------
				
				$return = $option.text($.trim(text));
				
			} else {
				
				console.warn('there\'s no text for', this);
				
			}
			
		}
		
		//----------------------------------
		// Callback:
		//----------------------------------
		
		data.options.onAddOption.call(this, $return);
		
		//----------------------------------
		// Return `<option>` or nothing:
		//----------------------------------
		
		return $return;
		
	}, // optionize()
	
	//--------------------------------------------------------------------
	
	/**
	 * Get text value of a jQuery object, but not its children.
	 *
	 * @see    rgne.ws/Rj0KNX
	 * @this   { object.jquery } Any jQuery object.
	 * @return { * } The object's text or an empty string.
	 */
	
	textualize = function() {
		
		return (this.length) ? this.clone().children().remove().end().text() : '';
		
	}; // textualize()
	
	//--------------------------------------------------------------------------
	//
	// Method calling logic:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Boilerplate plugin logic.
	 *
	 * @see    rgne.ws/OvKpPc
	 * @type   { function }
	 * @param  { string } method String method identifier.
	 * @return { method } Calls plugin method with supplied params.
	 *
	 * @constructor
	 */
	
	$.fn[NS] = function(method) {
		
		//----------------------------------
		// Boilerplate:
		//----------------------------------
		
		if (methods[method]) {
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if ((typeof method === 'object') || ( ! method)) {
			
			return methods.init.apply(this, arguments);
			
		} else {
			
			$.error('Method ' + method + ' does not exist on jQuery.' + NS); // Should I override? rgne.ws/MwgkP8
			
		}
		
	}; // constructor()
	
	//--------------------------------------------------------------------------
	//
	// Default settings:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Settings object.
	 *
	 * @type { object }
	 */
	
	var settings = {}; // Initialize config object.
	
	//----------------------------------
	/**
	 * Private settings.
	 *
	 * @type { object }
	 */
	
	settings.internal = {
		
		initClass : NS + '-js-enabled' // Target menu.
		
	}; // settings.internal
	
	//----------------------------------
	
	/**
	 * Public settings.
	 *
	 * @type { object }
	 */
	
	settings.external = {
		
		currentPage   : false,          // Select the current page?
		defaultOption : 'Choose...',    // Default option for `<select>`.
		openTab       : false,          // Open link in new tab? Default is current window.
		selectClass   : NS + '-select', // Class name for `<select>`.
		selectId      : false,          // ID name for `<select>`.
		
		// Callbacks:
		
		onInit      : $.noop, // After plugin data initialized.
		onAfterInit : $.noop, // After plugin initialization.
		onAddOption : $.noop, // Called when a new option has been added.
		onChange    : $.noop  // Called when `<select>` changes.
		
	}; // settings.external
	
	//----------------------------------
	
	/**
	 * Assign defaults to external.
	 *
	 * @type { object }
	 */
	
	$.fn[NS].defaults = settings.external; // rgne.ws/Mxifnq
	
}(jQuery, window, document));