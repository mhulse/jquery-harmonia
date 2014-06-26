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
 * @date 2014/06/26
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

;(function($, window) {
	
	/**
	 * Function-level strict mode syntax.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
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
	 * @see http://www.paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	 */
	
	var console = window.console || { log : $.noop, warn : $.noop },
	
	//----------------------------------
	
	/**
	 * The plugin namespace.
	 */
	
	NS = 'harmonia',
	
	//--------------------------------------------------------------------------
	//
	// Defaults/settings:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Public defaults.
	 *
	 * @type { object }
	 */
	
	defaults = {
		
		currentPage   : false,              // Select the current page?
		optionDefault : 'Choose...',        // Default option text for `<select>`.
		openTab       : false,              // Open link in new tab? Default is current window.
		classSelect   : NS + '-select',     // Class name for `<select>`; class applied to generated `<select>` element(s).
		classInit     : NS + '-js-enabled', // Target menu; class name applied to instantiated element(s).
		use           : '',                 // Replacement function to use when adding `<select>` to the DOM. Allowed values are `after`, `append`, `before` (default), `html`, and `prepend`.
		
		// Best if set via `data-` attribute options object:
		idSelect  : '', // ID name for `<select>`; default is no ID.
		elementId : '', // Target element ID for `<select>`; default is before instantiated target element.
		
		// Callbacks:
		
		onInit      : $.noop, // After plugin data initialized.
		onAfterInit : $.noop, // After plugin initialization.
		onAddOption : $.noop, // Called when a new option has been added.
		onChange    : $.noop  // Called when `<select>` changes.
		
	}, // defaults
	
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
		 * @param { object } options Options object literal.
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		init : function(options) {
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Declare, hoist and initialize:
				//----------------------------------
				
				var $this = $(this),        // Target object.
					data  = $this.data(NS), // Namespace instance data.
					settings;               // Settings object.
				
				//----------------------------------
				// Data?
				//----------------------------------
				
				if ( ! data) {
					
					//----------------------------------
					// Initialize:
					//----------------------------------
					
					settings = $.extend(true, {}, defaults, $.fn[NS].defaults, options, $this.data(NS + 'Options')); // Recursively merge defaults, options and HTML5 `data-` attribute options.
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					$this.data(NS, {
						
						init     : false,
						settings : settings,
						target   : $this,
						matched  : false,
						lis      : $this.find('> li'),
						hrefs    : $this.find('> li > a'),
						select   : $('<select>', { 'class' : settings.classSelect }),
						element  : ((settings.elementId) ? $(settings.elementId) : ''),
						use      : ((settings.use && (/^(?:after|append|before|html|prepend|text)$/).test(settings.use)) ? settings.use : 'before') // If input is valid method name, use that; otherwise, default to `before` method.
						
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
					
					console.warn('jQuery.%s thinks it\'s already initialized on %o.', NS, this);
					
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
				// Declare, hoist and initialize:
				//----------------------------------
				
				var $this = $(this),
					data  = $this.data(NS);
				
				//----------------------------------
				// Data?
				//----------------------------------
				
				if (data) {
					
					//----------------------------------
					// Remove root menu CSS class:
					//----------------------------------
					
					$this.removeClass(data.settings.classInit);
					
					//----------------------------------
					// Remove generated HTML:
					//----------------------------------
					
					data.select.remove(); // All bound events and jQuery data associated with the elements are removed: http://api.jquery.com/remove/
					
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
		// Declare, hoist and initialize:
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
			
			data.settings.onInit.call(data.target);
			
			//----------------------------------
			// Check for object(s):
			//----------------------------------
			
			if (data.hrefs.length) {
				
				//----------------------------------
				// Root menu CSS class:
				//----------------------------------
				
				data.target.addClass(data.settings.classInit);
				
				//----------------------------------
				// Is there a `<select>` ID?
				//----------------------------------
				
				if (data.settings.idSelect.length) {
					
					//----------------------------------
					// Apply to `<select>`:
					//----------------------------------
					
					data.select.attr('id', data.settings.idSelect);
					
				}
				
				//----------------------------------
				// Default `<select>` `<option>`?
				//----------------------------------
				
				if (data.settings.optionDefault) {
					
					//----------------------------------
					// Get/create the `<option>`:
					//----------------------------------
					
					$default = _optionize.call(data.target, $('<a>'), data.settings.optionDefault);
					
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
				
				data.lis.each(function() { // http://css-tricks.com/examples/ConvertMenuToDropdown/optgroup.php
					
					//----------------------------------
					// Declare, hoist and initialize:
					//----------------------------------
					
					var $this = $(this),
					    $children,
					    $group,
					    $option;
					
					//----------------------------------
					// Child list to `<optgroup>`?
					//----------------------------------
					
					if ($this.find('ul').length) { // @TODO: What about `<ol>`s?
						
						//----------------------------------
						// Find all child list items:
						//----------------------------------
						
						$children = $this.find('li');
						
						//----------------------------------
						// Do we have children list items?
						//----------------------------------
						
						if ($children.length) {
							
							//----------------------------------
							// Append `<optgroup>`:
							//----------------------------------
							
							$group = $('<optgroup>', {
								// Get the first child (should be element like `<a>` or `<span>`):
								'label': $this.children(':first').text() // @TODO: Disabled optgroups?
							}).appendTo(data.select);
							
							//----------------------------------
							// Append `<optgroup>` `<option>`s:
							//----------------------------------
							
							$children.each(function() {
								
								//----------------------------------
								// Get/create the `<option>`:
								//----------------------------------
								
								$option = _optionize.call(data.target, $(this).find('> a'));
								
								//----------------------------------
								// Do we have an `<option>`?
								//----------------------------------
								
								if ($option.length) {
									
									//----------------------------------
									// Append `<option>` to `<select>`:
									//----------------------------------
									
									$option.appendTo($group);
									
								}
								
							});
							
						}
						
					} else {
						
						//----------------------------------
						// Get/create the `<option>`:
						//----------------------------------
						
						$option = _optionize.call(data.target, $this.find('> a'));
						
						//----------------------------------
						// Do we have an `<option>`?
						//----------------------------------
						
						if ($option.length) {
							
							//----------------------------------
							// Append `<option>` to `<select>`:
							//----------------------------------
							
							$option.appendTo(data.select);
							
						}
						
					}
					
				});
				
				//----------------------------------
				// Add change event to `<select>`:
				//----------------------------------
				
				data.select.change(function() {
					
					//----------------------------------
					// Declare, hoist and initialize:
					//----------------------------------
					
					var $this = $(this),
						val;
					
					//----------------------------------
					// Callback:
					//----------------------------------
					
					data.settings.onChange.call(data.target, $this); // @TODO: Is this the best spot for this?
					
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
						
						if (val !== data.settings.optionDefault) {
							
							//----------------------------------
							// Open tab or use current window:
							//----------------------------------
							
							if (data.settings.openTab) {
								
								window.open(val); // New tab.
								
							} else {
								
								window.location = val; // Current window.
								
							}
							
						}
						
					}
					
				});
				
				//----------------------------------
				// Target element?
				//----------------------------------
				
				if (data.element.length) {
					
					//----------------------------------
					// Insert using target el:
					//----------------------------------
					
					data.element[data.use](data.select);
					
				} else {
					
					//----------------------------------
					// Insert using instantiated el:
					//----------------------------------
					
					data.target[data.use](data.select);
					
				}
				
				//----------------------------------
				// Callback:
				//----------------------------------
				
				data.settings.onAfterInit.call(data.target);
				
				// Done!
				
			} else {
				
				//----------------------------------
				// Problemos:
				//----------------------------------
				
				console.warn('jQuery.%s there\'s a problem with your markup.', NS);
				
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
		// Declare, hoist and initialize:
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
				
				$option  = $('<option>'); // Create `<option>` element.
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
						
					} else if (data.settings.currentPage) {
						
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
							
							if ((href == ahref) || (href.indexOf(ahref) != -1)) { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
								
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
				
				console.warn('jQuery.%s thinks there\'s no text for %o.', NS, this);
				
			}
			
		}
		
		//----------------------------------
		// Callback:
		//----------------------------------
		
		data.settings.onAddOption.call(this, $return);
		
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
	 * @see http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/
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
	 * @see http://learn.jquery.com/plugins/
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
			
			$.error('jQuery.%s thinks that %s doesn\'t exist', NS, method);
			
		}
		
	}; // $.fn[NS]
	
	//--------------------------------------------------------------------
	
	/**
	 * Public defaults.
	 *
	 * Example (before instantiation):
	 *
	 * $.fn.harmonia.defaults.idSelect = 'foo';
	 *
	 * @see http://stackoverflow.com/questions/11306375/plugin-authoring-how-to-allow-myplugin-defaults-key-value
	 *
	 * @type { object }
	 */
	
	$.fn[NS].defaults = defaults;
	
}(jQuery, window));
