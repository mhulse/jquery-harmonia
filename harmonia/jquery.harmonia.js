/**
 * jQuery Harmonia
 * Replace an (un)ordered list with a form select.
 *
 * @author Micky Hulse
 * @link http://mky.io
 * @docs https://github.com/mhulse/jquery-harmonia
 * @copyright Copyright (c) 2014 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 1.1.1
 * @date 2014/07/20
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
	 * Javascript console detection protection.
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
		
		currentPage   : false,              // Select the current page? Default: `false`.
		optionDefault : 'Choose ...',       // Default option for `<select>`. Default: `Choose ...`.
		openTab       : false,              // Open link in new tab? Default is current window. Default: `false`.
		classSelect   : NS + '-select',     // Class name for `<select>`; class applied to generated `<select>` element(s). Default: `harmonia-select`.
		classInit     : NS + '-js-enabled', // Target menu; class name applied to instantiated element(s).
		use           : '',                 // Replacement function to use when adding `<select>` to the DOM. Allowed values are `after`, `append`, `before` (default), `html`, and `prepend`.
		
		// Best if set via `data-` attribute options object:
		idSelect      : '', // ID name for `<select>`; default is no ID.
		elementTarget : '', // Desired location to put the `<select>`; defaults to `before` (see `use` option) the current instantiated element.
		
		// Callbacks:
		onInit      : $.noop, // Callback after plugin data initialized.
		onAfterInit : $.noop, // Callback after plugin initialization.
		onAddOption : $.noop, // Callback when a new option has been added.
		onChange    : $.noop  // Callback when `<select>` changes.
		
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
				
				var $this = $(this),       // Target object.
				    data = $this.data(NS), // Namespace instance data.
				    settings;              // Settings object.
				
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
						lis      : $this.children('li'),
						select   : $('<select>', { 'class' : settings.classSelect }),
						element  : ((settings.elementTarget) ? $(settings.elementTarget) : ''),
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
				    data = $this.data(NS); // Get instance data.
				
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
			
			data.settings.onInit.call(data.target, data);
			
			//----------------------------------
			// Check for object(s):
			//----------------------------------
			
			if (data.lis.length) {
				
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
					
					$default.appendTo(data.select);
					
				}
				
				//----------------------------------
				// Create the other `<option>`s:
				//----------------------------------
				
				data.lis.each(function() { // http://css-tricks.com/examples/ConvertMenuToDropdown/optgroup.php
					
					//----------------------------------
					// Declare, hoist and initialize:
					//----------------------------------
					
					var $this = $(this),
					    $children = $this.children(), // Get immediate children.
					    $lists,
					    $group;
					
					//----------------------------------
					// Child list to `<optgroup>`?
					//----------------------------------
					
					if ($children.filter('ul, ol').length) { // Allow for `<ul>` and `<ol>`.
						
						//----------------------------------
						// Find all child `<li>` items:
						//----------------------------------
						
						$lists = $children.find('li');
						
						//----------------------------------
						// Do we have children `<li>` items?
						//----------------------------------
						
						if ($lists.length) {
							
							//----------------------------------
							// Append `<optgroup>`:
							//----------------------------------
							
							$group = $('<optgroup>', {
								// Get the first child (should be element like `<a>` or `<span>`):
								'label': $children.first().text() // @TODO: Disabled optgroups?
							}).appendTo(data.select);
							
							//----------------------------------
							// Append `<optgroup>` `<option>`s:
							//----------------------------------
							
							$lists.each(function() {
								
								//----------------------------------
								// Convert `<a>` to `<option>`:
								//----------------------------------
								
								_appendize.call(data.target, $(this), $group);
								
							});
							
						}
						
					} else {
						
						//----------------------------------
						// Convert `<a>` to `<option>`:
						//----------------------------------
						
						_appendize.call(data.target, $this, data.select);
						
					}
					
				});
				
				//----------------------------------
				// Add change event to `<select>`:
				//----------------------------------
				
				_changeize.call(data.target);
				
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
				
				data.settings.onAfterInit.call(data.target, data);
				
				// Done!
				
			} else {
				
				//----------------------------------
				// Problemos:
				//----------------------------------
				
				console.warn('jQuery.%s thinks there\'s a problem with your markup.', NS);
				
			}
			
			
		}
		
	}, // _main
	
	//----------------------------------
	
	/**
	 * Converts `<a>` to `<option>` and appends to passed element.
	 *
	 * @private
	 * @type { function }
	 * @this { object.jquery } The base target object.
	 * @param { object.jquery } $li List item.
	 * @param { object.jquery } $to Element to append list item to.
	 * @return void
	 */
	
	_appendize = function($li, $to) {
		
		//----------------------------------
		// Declare, hoist and initialize:
		//----------------------------------
		
		var data = this.data(NS), // Get instance data.
		    $a = $li.children('a'), // Find child `<a>` item.
		    $option;
		
		//----------------------------------
		// Do we have children `<a>` items?
		//----------------------------------
		
		if ($a.length) {
			
			//----------------------------------
			// Get/create the `<option>`:
			//----------------------------------
			
			$option = _optionize.call(data.target, $a);
			
			//----------------------------------
			// Do we have an `<option>`?
			//----------------------------------
			
			if ($option.length) {
				
				//----------------------------------
				// Append `<option>` to `<select>`:
				//----------------------------------
				
				$option.appendTo($to);
				
			}
			
		} else {
			
			//----------------------------------
			// Doh!
			//----------------------------------
			
			console.warn('jQuery.%s can\'t find child hrefs for %o\'s %o.', NS, this, $li);
			
		}
		
	}, // _appendize
	
	//----------------------------------
	
	/**
	 * Create options for the `<select>` menu.
	 *
	 * @private
	 * @type { function }
	 * @this { object.jquery } The base target object.
	 * @param { object.jquery } $a The `<a>` to convert a `<select>`.
	 * @param { string } text Optional text for `<option>`.
	 * @return { * } The `<select>` `<option>` or an empty string.
	 */
	
	_optionize = function($a, text) {
		
		//----------------------------------
		// Declare, hoist and initialize:
		//----------------------------------
		
		var $return = '',
		    data = this.data(NS), // Get instance data.
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
				// Avoid junk:
				//----------------------------------
				
				if (link && (link != '#')) { // @TODO Better checking here?
					
					//----------------------------------
					// Something currently selected?
					//----------------------------------
					
					if ( ! data.matched) {
						
						//----------------------------------
						// Force select via class?
						//----------------------------------
						
						if ($a.hasClass('selected')) {
							
							selected = true; // Yup. Force selected.
							
						} else if (data.settings.currentPage) {
							
							//----------------------------------
							// Get hrefs:
							//----------------------------------
							
							href  = window.location.href.toLowerCase();
							ahref = link.toLowerCase();
							
							//----------------------------------
							// Compare urls directly or index:
							//----------------------------------
							
							// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
							if ((href == ahref) || (href.indexOf(ahref) != -1)) {
								
								selected = true;
								
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
					
				}
				
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
		
		data.settings.onAddOption.call(data.target, data, $return);
		
		//----------------------------------
		// Return `<option>` or nothing:
		//----------------------------------
		
		return $return;
		
	}, // _optionize
	
	//----------------------------------
	
	/**
	 * Get text value of a jQuery object, but not its children.
	 *
	 * @see http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/
	 *
	 * @private
	 * @type { function }
	 * @this { object.jquery } Any jQuery object.
	 * @return { * } The object's text or an empty string.
	 */
	
	_textualize = function() {
		
		return (this.length) ? this.clone().children().remove().end().text() : '';
		
	}, // _textualize
	
	//----------------------------------
	
	/**
	 * Bind "change" event handler to `<select>`.
	 *
	 * @private
	 * @type { function }
	 * @this { object.jquery } Any jQuery object.
	 * @return void
	 */
	
	_changeize = function() {
		
		//----------------------------------
		// Declare, hoist and initialize:
		//----------------------------------
		
		var data = this.data(NS);
		
		//----------------------------------
		// Bind "change" event handler:
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
			
			data.settings.onChange.call(data.target, data, $this); // @TODO: Is this the best spot for this?
			
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
		
	}; // _changeize
	
	//--------------------------------------------------------------------------
	//
	// Method calling logic:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Boilerplate plugin logic.
	 *
	 * @see http://learn.jquery.com/plugins/
	 *
	 * @constructor
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
