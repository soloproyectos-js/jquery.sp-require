/**
 * jQuery.spRequire - A require plugin for jQuery.
 *
 * This plugin requires: 
 *      1. jQuery ~2.0
 *
 * @author  Gonzalo Chumillas <gchumillas@email.com>
 * @license https://github.com/soloproyectos-js/jquery.sp-require/blob/master/LICENSE MIT License
 * @link    https://github.com/soloproyectos-js/jquery.sp-require
 */
(function ($) {
    /**
     * Configuration object.
     * @var {Object}
     */
    var _config = {};
    
    /**
     * Is the configuration object valid?
     * @var {boolean}
     */
    var _isValidConfig = true;
    
    /**
     * List of libraries.
     * @var {Object.<string, $.requireLibrary>}
     */
    var _libraries = {};
    
    /**
     * Available methods.
     * @var {Object.<Function>}
     */
    var _methods = {
        /**
         * Loads the libraries.
         * 
         * Example 1: loads the library 'lib1' and 'lib2' and calls the function.
         * ```JavaScript
         * $.require(['lib1', 'lib2'], function () {
         *      $('#message').text('The libraries have been loaded');
         * });
         * ```
         * 
         * Example 2: uses the $.Promise class.
         * More info at: https://api.jquery.com/deferred.promise/
         * ```JavaScript
         * $.require(['lib1', 'lib2'])
         *      .done(function () {
         *          // this function is executed on success
         *          console.log('The libraries have been loaded');
         *      })
         *      .fail(function () {
         *          // this function is executed if one of the JavaScript files could not be loaded
         *          console.log('Sadly some libraries could not be loaded');
         *      })
         *      .always(function () {
         *          // this function is always executed
         *          console.log('I don\'t care');
         *      });
         * ```
         * 
         * @param {Array.<string>} libName List of required library names
         * @param {Function}       onReady Called when the libraries have been loaded (not required)
         * 
         * @return {$.Promise}
         */
        'init': function (libNames, onReady) {
            if (!_isValidConfig) {
                return new $.Deferred().promise();
            }
            
            var package = new $.spRequireLibrary();
            $.each(libNames, function (index, name) {
                var library = _libraries[name];
                if (library === undefined) {
                    $.error('Library not found: ' + name);
                }
                package.addLibrary(_libraries[name]);
            });
            return package.load().done(onReady);
        },
        
        
        /**
         * Parses or gets the current configuration object.
         * 
         * Examples:
         * ```JavaScript
         * // gets the current configuration object
         * var config = $.request('config');
         * 
         * // sets and gets the configuration object
         * // 'libraries.css' and 'libraries.requires' are optional options
         * var config = $.require('config', {
         *     libraries: {
         *         lib1: {
         *             sources: {
         *                 js: ['script11.js', 'script12.js', 'script13.js'],
         *                 css: ['style11.css', 'style12.css', 'style13.css']
         *             }
         *         },
         *         lib2: {
         *             sources: {
         *                 js: ['script.js', 'script.js'],
         *                 css: ['style.css', 'style.css']
         *             },
         *             requires: ['lib1']
         *         },
         *         lib3: {
         *             sources: {
         *                 js: ['script.js'],
         *                 css: ['style.css']
         *             },
         *             requires: ['lib2']
         *         }
         *     }
         * });
         * ```
         * 
         * @param {Object} config Configuration object (not required)
         * 
         * @return {Object}
         */
        'config': function (config) {
            if (config !== undefined) {
                // parses the configuration object
                var libraries = [];
                var conf = new $.spRequireConfig(config);
                _isValidConfig = true;
                try {
                    conf._parse(config);
                    libraries = conf.getLibraries();
                } catch (error) {
                    _isValidConfig = false;
                    throw new Error(error);
                }
                
                // adds libraries
                _libraries = {};
                $.each(libraries, function (name, library) {
                    var jsSources = library.sources.js;
                    var cssSources = library.sources.css;
                    var lib = new $.spRequireLibrary();
                    
                    lib.setAsync(library.async);
                    
                    $.each(jsSources, function(index, source) {
                        lib.addJs(source);
                    });
                    
                    $.each(cssSources, function (index, source) {
                        lib.addCss(source);
                    });
                    
                    _libraries[name] = lib;
                });
                
                // adds required libraries
                $.each(libraries, function (name, library) {
                    var requires = library.requires;
                    
                    if (requires !== undefined) {
                        var lib = _libraries[name];
                        
                        $.each(requires, function (index, name) {
                            var requiredLib = _libraries[name];
                            
                            if (requiredLib === undefined) {
                                $.error('Library not found: ' + name);
                            }
                            
                            lib.addLibrary(requiredLib);
                        });
                    }
                });
                
                _config = config;
            }
            
            return _config;
        }
    };
    
    /**
     * Registers the plugin.
     * 
     * @return {*}
     */
    $.require = function () {
        // arguments
        var args = Array.prototype.slice.call(arguments);
        var methodName = 'init';
        if (args.length > 0 && $.type(args[0]) == 'string') {
            methodName = args[0];
            args = args.slice(1);
        }
        
        // method
        var method = _methods[methodName];
        if (method === undefined) {
            $.error('Method not found: ' + methodName);
        }
        
        return method.apply(this, args);
    };
})(jQuery);
