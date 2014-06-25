/**
 * jQuery Harmonia
 * Replace an (un)ordered list with a form select.
 *
 * @author Micky Hulse
 * @link http://mky.io
 * @docs https://github.com/mhulse/jquery-harmonia
 * @copyright Copyright (c) 2014 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 1.1.0
 * @date 2014/06/24
 */

//----------------------------------

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
	
	/**
	 * Function-level strict mode syntax.
	 *
	 * @see rgne.ws/XcZgn8
	 */
	
	'use strict';
	
	//--------------------------------------------------------------------------
	//
	// Local "globals":
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Javascript console.
	 *
	 * @see rgne.ws/12p2bvl
	 */
	
	var console = window.console || { log : function() {}, warn : function() {} },
	
	//----------------------------------
	
	/**
	 * The plugin namespace.
	 */
	
	NS = 'harmonia', // The plugin namespace.
	
	//----------------------------------
	
	/**
	 * Settings object.
	 *
	 * @type { object }
	 */
	
	settings = {}, // Initialize settings object.
	
	//--------------------------------------------------------------------------
	//
	// Public methods:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Methods object.
	 *
	 * @type { object }
	 */
	
	methods = {
		
		/**
		 * Init constructor.
		 *
		 * @type { function }
		 * @param { object } opts Options object literal.
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		init : function(opts) {
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Declare/initialize:
				//----------------------------------
				
				var $this = $(this),        // Target object.
				    data  = $this.data(NS), // Namespace instance data.
				    options,
				    $hrefs,
				    $select;
				
				//----------------------------------
				// Data?
				//----------------------------------
				
				if ( ! data) {
					
					//----------------------------------
					// Initialize:
					//----------------------------------
					
					options = $.extend({}, settings.external, $.fn[NS].defaults, opts); // Merge settings, defaults and opts.
					$hrefs  = $this.find('> li > a');
					$select = $('<select>', { 'class' : options.selectClass });
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					$this.data(NS, {
						
						hrefs   : $hrefs,
						init    : false,
						matched : false,
						options : options,
						select  : $select,
						target  : $this
						
					});
					
					//----------------------------------
					// Easy access:
					//----------------------------------
					
					data = $this.data(NS);
					
				}
				
				//----------------------------------
				// Data initialization check:
				//----------------------------------
				
				if ( ! data.init) {
					
					//----------------------------------
					// Call main:
					//----------------------------------
					
					_main.call($this, data);
					
				} else {
					
					//----------------------------------
					// Ouch!
					//----------------------------------
					
					console.warn('jQuery.' + NS, 'thinks it\'s already initialized on', this);
					
					//return this; // Needed?
					
				}
				
			});
			
		}, // init
		
		//----------------------------------
		
		/**
		 * Removes plugin from element.
		 *
		 * @type { function }
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		destroy : function() {
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Declare/initialize:
				//----------------------------------
				
				var $this = $(this),
				    data  = $this.data(NS);
				
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
					
					$this.removeClass(settings.internal.initClass);
					
					//----------------------------------
					// Remove generated HTML:
					//----------------------------------
					
					data.select.remove(); // All bound events and jQuery data associated with the elements are removed: rgne.ws/LqMnF5
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					$this.removeData(NS);
					
				}
			
			});
			
		} // destroy
		
	}, // methods
	
	//--------------------------------------------------------------------------
	//
	// Private methods:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Called after plugin initialization.
	 *
	 * @private
	 * @type { function }
	 * @this { object.jquery }
	 */
	
	_main = function(data) {
		
		//----------------------------------
		// Declare:
		//----------------------------------
		
		var $default;
		
		//----------------------------------
		// Data?
		//----------------------------------
		
		if (typeof data == 'undefined') {
			
			//----------------------------------
			// Attempt to determine data:
			//----------------------------------
			
			data = this.data(NS);
			
		}
		
		//----------------------------------
		// Data?
		//----------------------------------
		
		if (data) {
			
			//----------------------------------
			// Yup!
			//----------------------------------
			
			data.init = true; // Data initialization flag.
			
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
					
					$default = _optionize.call(data.target, $('<a />'), data.options.defaultOption);
					
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
					// Declare/initialize:
					//----------------------------------
					
					var $option = _optionize.call(data.target, $(this)); // Get the `<option>`.
					
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
					// Declare/initialize:
					//----------------------------------
					
					var $this = $(this),
					    val;
					
					//----------------------------------
					// Callback:
					//----------------------------------
					
					data.options.onChange.call(data.target, $this); // @TODO: Is this the best spot for this?
					
					//----------------------------------
					// Get link value:
					//----------------------------------
					
					val = $this.val();
					
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
				
				//----------------------------------
				// Problemos:
				//----------------------------------
				
				console.warn('jQuery.' + NS, 'thinks there\'s a problem with your markup');
				
			}
			
			
		}
		
	}, // _main
	
	//----------------------------------
	
	/**
	 * Create options for the `<select>` menu.
	 *
	 * @private
	 * @this { object.jquery } The base target object.
	 * @param { object.jquery } The `<a>` to convert a `<select>`.
	 * @param { string } text Optional text for `<option>`.
	 * @return { * } The `<select>` `<option>` or an empty string.
	 */
	
	_optionize = function($a, text) {
		
		//----------------------------------
		// Declare/initialize:
		//----------------------------------
		
		var $return = '',
		    data    = this.data(NS),
		    $option,
		    selected,
		    link,
		    href,
		    ahref;
		
		//----------------------------------
		// Data?
		//----------------------------------
		
		if (data) {
			
			//----------------------------------
			// Default arg values:
			//----------------------------------
			
			text = ((typeof text != 'undefined') && text.length) ? text : _textualize.call($a); // Use arg or `<a>` text.
			
			//----------------------------------
			// Text?
			//----------------------------------
			
			if (text.length) {
				
				//----------------------------------
				// Initialize:
				//----------------------------------
				
				$option  = $('<option />'); // Create `<option>` element.
				selected = false;
				link     = ($a.attr('href') || ''); // Current `<a>`'s href.
				
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
						// Ignore hashes and compare URLs:
						//----------------------------------
						
						if (link != '#') {
							
							//----------------------------------
							// Get hrefs:
							//----------------------------------
							
							href  = window.location.href.toLowerCase();
							ahref = link.toLowerCase();
							
							//----------------------------------
							// Compare directly or indexOf():
							//----------------------------------
							
							if ((href == ahref) || (href.indexOf(ahref) != -1)) { // rgne.ws/XypNhG
								
								selected = true;
								
							}
							
						}
						
					}
					
					//----------------------------------
					// Selected!!!!!!!!!!!!!!!!!!!!!!!!!
					//----------------------------------
					
					if (selected) {
						
						//----------------------------------
						// Set selected attribute:
						//----------------------------------
						
						$option.attr('selected', 'selected'); // Pheeeew. :D
						
						//----------------------------------
						// Set flag and stop checking:
						//----------------------------------
						
						data.matched = true; // Flippin' switches!
						
					}
					
				}
				
				//----------------------------------
				// Location value:
				//----------------------------------
				
				$option.attr('value', link);
				
				//----------------------------------
				// Assign text to `<option>`:
				//----------------------------------
				
				$return = $option.text($.trim(text));
				
			} else {
				
				//----------------------------------
				// Oopsies:
				//----------------------------------
				
				console.warn('jQuery.' + NS, 'thinks there\'s no text for', this);
				
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
		
	}, // _optionize
	
	//----------------------------------
	
	/**
	 * Get text value of a jQuery object, but not its children.
	 *
	 * @private
	 * @see rgne.ws/Rj0KNX
	 * @this { object.jquery } Any jQuery object.
	 * @return { * } The object's text or an empty string.
	 */
	
	_textualize = function() {
		
		return (this.length) ? this.clone().children().remove().end().text() : '';
		
	}; // _textualize
	
	//--------------------------------------------------------------------------
	//
	// Method calling logic:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Boilerplate plugin logic.
	 *
	 * @constructor
	 * @see rgne.ws/OvKpPc
	 * @type { function }
	 * @param { string } method String method identifier.
	 * @return { method } Calls plugin method with supplied params.
	 */
	
	$.fn[NS] = function(method) {
		
		if (methods[method]) {
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if ((typeof method == 'object') || ( ! method)) {
			
			return methods.init.apply(this, arguments);
			
		} else {
			
			$.error('jQuery.' + NS + ' thinks that ' + method + ' doesn\'t exist'); // Should I override? rgne.ws/MwgkP8
			
		}
		
	}; // $.fn[NS]
	
	//--------------------------------------------------------------------------
	//
	// Defaults and settings:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Private settings.
	 *
	 * @private
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