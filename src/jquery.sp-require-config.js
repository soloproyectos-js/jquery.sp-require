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
            var itemType = $.type(item);
            
            if (itemType == 'string') {
                library = self._parseString(item);
            } else
            if (itemType == 'array') {
                library = self._parseArray(item);
            } else
            if (itemType == 'object') {
                library = self._parseObject(item);
            } else {
                $.error(
                    'Invalid library \'' + name + '\'. ' +
                    'Expected \'string\', \'Array.<string>\' or ' +
                    '\'{\n\t' +
                        'sources: {\n\t\t' +
                            'js: Array.<string>,  // not required\n\t\t' +
                            'css: Array.<string>  // not required\n\t' +
                        '},\n\t' +
                        'requires: Array.<string> // not required\n' +
                    '}\''
                );
            }
            
            self._libraries[name] = library;
        });
    };
    
    /**
     * Parses a string library:
     * 
     * @return {
     *      jsSources: Array.<string>,
     *      cssSources: Array.<string>,
     *      requires: Array.<string>
     * }
     */
    $.spRequireConfig.prototype._parseString = function (library) {
        return {
            jsSources: [library],
            cssSources: [],
            requires: []
        };
    };
    
    /**
     * Parses a library of the following form:
     * 
     * Library: Array.<string>
     * 
     * @return {
     *      jsSources: Array.<string>,
     *      cssSources: Array.<string>,
     *      requires: Array.<string>
     * }
     */
    $.spRequireConfig.prototype._parseArray = function (library) {
        var ret = {
            jsSources: [],
            cssSources: [],
            requires: []
        };
        
        $.each(library, function (index, item) {
            if ($.type(item) != 'string') {
                $.error('Invalid \'libraries.<library>\' property. Expected \'Array.<string>\'');
            }
            ret.jsSources.push(item);
        });
        
        return ret;
    };
    
    /**
     * Parses a library of the following form:
     * 
     * Library: {
     *      js: Array.<string>  // not required
     *      css: Array.<string> // not required
     * }
     * 
     * @return {
     *      jsSources: Array.<string>,
     *      cssSources: Array.<string>,
     *      requires: Array.<string>
     * }
     */
    $.spRequireConfig.prototype._parseObject = function (library) {
        var ret = {
            jsSources: [],
            cssSources: [],
            requires: []
        };
        
        // loads 'sources' attribute
        var sources = library.sources || {};
        
        // loads 'sources.js' attribute
        var js = sources.js || [];
        if ($.type(js) != 'array') {
            $.error('Invalid \'libraries.<libName>.sources.js\' attribute');
        }
        $.each(js, function (index, item) {
            if ($.type(item) != 'string') {
                $.error('Invalid \'libraries.<libName>.sources.js[string]\' value');
            }
            ret.jsSources.push(item);
        });
        
        // loads 'sources.css' attribute
        var css = sources.css || [];
        if ($.type(css) != 'array') {
            $.error('Invalid \'libraries.<libName>.sources.css\' attribute');
        }
        $.each(css, function (index, item) {
            if ($.type(item) != 'string') {
                $.error('Invalid \'libraries.<libName>.sources.css[string]\' value');
            }
            ret.cssSources.push(item);
        });
        
        // loads 'requires' attribute
        var requires = library.requires || [];
        if ($.type(requires) != 'array') {
            $.error('Invalid \'libraries.requires\' attribute');
        }
        $.each(requires, function (index, item) {
            if ($.type(item) != 'string') {
                $.error('Invalid \'libraries.<libName>.requires[string]\' value');
            }
            ret.requires.push(item);
        });
        
        return ret;
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
