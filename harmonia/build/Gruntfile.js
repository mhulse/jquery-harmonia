/*global module:false */

module.exports = function(grunt) {
	
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		
		meta: {
			
			banner_long: '/**\n' +
			             ' * <%= pkg.title || pkg.name %>\n' +
			             '<%= pkg.description ? " * " + pkg.description + "\\n" : "" %>' +
			             ' *\n' +
			             '<%= pkg.author.name ? " * @author " + pkg.author.name + "\\n" : "" %>' +
			             '<%= pkg.author.url ? " * @link " + pkg.author.url + "\\n" : "" %>' +
			             '<%= pkg.homepage ? " * @docs " + pkg.homepage + "\\n" : "" %>' +
			             ' * @copyright Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>.\n' +
			             '<%= pkg.licenses ? " * @license Released under the " + _.pluck(pkg.licenses, "type").join(", ") + ".\\n" : "" %>' +
			             '<%= pkg.version ? " * @version " + pkg.version + "\\n" : "" %>' +
			             ' * @date <%= grunt.template.today("yyyy/mm/dd") %>\n' +
			             ' */\r\r',
			
			banner_short: '/*! ' +
			              '<%= pkg.title || pkg.name %>' +
			              '<%= pkg.version ? " v" + pkg.version : "" %>' +
			              '<%= pkg.licenses ? " | " + _.pluck(pkg.licenses, "type").join(", ") : "" %>' +
			              '<%= pkg.homepage ? " | " + pkg.homepage : "" %>' +
			              ' */'
			
		},
		
		//----------------------------------
		
		/**
		 * @see http://www.jshint.com/docs/
		 */
		
		jshint: {
			
			options: {
				
				smarttabs: true,
				browser: true,
				quotmark: true,
				curly: true
				
			},
			
			init: [
				
				'./Gruntfile.js',
				'./src/jquery.<%= pkg.name %>.js'
				
			]
			
		},
		
		//----------------------------------
		
		/**
		 * @see https://github.com/gruntjs/grunt-contrib-uglify
		 */
		
		uglify: {
			
			my_target: {
				
				options: {
					
					banner: '<%= meta.banner_short %>'
					
				},
				
				files: {
					
					'../jquery.<%= pkg.name %>.min.js': ['src/jquery.<%= pkg.name %>.js']
					
				}
				
			}
			
		}
		
	});
	
	//--------------------------------------------------------------------
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	//----------------------------------
	
	grunt.registerTask('default', ['jshint', 'uglify']);
	
};
