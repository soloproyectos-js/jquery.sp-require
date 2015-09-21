/**
 * jQuery.spRequire - A require plugin for jQuery.
 *
 * This plugin requires: 
 *      1. jQuery ~2.0
 *
 * @author    Gonzalo Chumillas <gchumillas@email.com>
 * @license   https://github.com/soloproyectos-js/jquery.sp-require/blob/master/LICENSE MIT License
 * @link      https://github.com/soloproyectos-js/jquery.sp-require
 */
(function ($) {
    /**
     * Configuration object.
     * @var {Object}
     */
    var _config = {};
    
    /**
     * List of libraries.
     * @var {Object.<string, $.requireLibrary>}
     */
    var _libraries = {};
    
    /**
     * Require Manger.
     * @var {$.requireManager}
     */
    var _manager = null;
    
    /**
     * Available methods.
     * @var {Object.<Function>}
     */
    var _methods = {
        /**
         * Main method.
         * 
         * @param {Array.<string>} libName List of required library names
         * @param {Function}       onReady Called when the libraries have been loaded (not required)
         * 
         * @return {$.Promise}
         */
        'init': function (libNames, onReady) {
            var manager = new $.spRequireManager();
            
            $.each(libNames, function (name, name) {
                // TODO: y si la librería no existe?
                manager.addLibrary(_libraries[name]);
            });
            
            return manager.load().done(onReady);
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
            if (config !== null) {
                _config = config;
                
                // TODO: validar config
                // TODO: librerías duplicadas
                // TODO: config flexible
                
                // adds libraries
                var libraries = _config.libraries;
                $.each(libraries, function (name, library) {
                    var sources = library.sources;
                    var jsSources = sources.js;
                    var cssSources = sources.css;
                    var lib = new $.spRequireLibrary();
                    
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
                            lib.addLibrary(requiredLib);
                        });
                    }
                });
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
