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
     * Config class.
     * 
     * @param {Object} config Config object
     */
    $.spRequireConfig = function (config) {
        this._parse(config);
    };
    
    /**
     * List of libraries.
     * @var {Object}
     */
    $.spRequireConfig.prototype._libraries = {};
    
    /**
     * Parses a config object.
     * 
     * @param {Object} config Config object
     * 
     * @return {void}
     */
    $.spRequireConfig.prototype._parse = function (config) {
        var self = this;
        
        if (!$.isPlainObject(config)) {
            $.error('Invalid config object');
        }
        
        this._libraries = {};
        var libraries = config.libraries || {};
        $.each(libraries, function (name, item) {
            var library = {};
            
            // loads 'sources' attribute
            var sources = item.sources || {};
            if ($.type(sources) != 'object') {
                $.error('Invalid \'libraries.<libName>.sources\' attribute');
            }
            
            // loads 'sources.js' attribute
            var js = sources.js || [];
            if ($.type(js) != 'array') {
                $.error('Invalid \'libraries.<libName>.sources.js\' attribute');
            }
            $.each(js, function (index, item) {
                if ($.type(item) !== 'string') {
                    $.error('Invalid \'libraries.<libName>.sources.js[string]\' value');
                }
            });
            library.jsSources = js;
            
            // loads 'sources.css' attribute
            var css = sources.css || [];
            if ($.type(css) != 'array') {
                $.error('Invalid \'libraries.<libName>.sources.css\' attribute');
            }
            $.each(css, function (index, item) {
                if ($.type(item) !== 'string') {
                    $.error('Invalid \'libraries.<libName>.sources.css[string]\' value');
                }
            });
            library.cssSources = css;
            
            // loads 'requires' attribute
            var requires = item.requires || [];
            if ($.type(requires) != 'array') {
                $.error('Invalid \'libraries.requires\' attribute');
            }
            library.requires = requires;
            
            self._libraries[name] = library;
        });
    };
    
    /**
     * Gets the list of libraries.
     * 
     * @return {Object}
     */
    $.spRequireConfig.prototype.getLibraries = function () {
        return this._libraries;
    };
})(jQuery);
