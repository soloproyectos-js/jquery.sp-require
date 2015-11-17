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
     * Config class.
     * 
     * @param {Object} config Config object
     */
    $.spRequireConfigParser = function (config) {
        this._libraries = {};
        this._parse(config);
    };
    
    /**
     * Error message.
     * @var {string}
     */
    $.spRequireConfigParser.prototype._errorMessage =
        "Invalid '%library-name%' library. Expected 'string', 'Array.<string>' or '{\n\t" +
            "sources: {\n\t\t" +
                "js: 'string' or 'Array.<string>',  // not required\n\t\t" +
                "css: 'string' or 'Array.<string>'  // not required\n\t" +
            "},\n\t" +
            "requires: 'string' or 'Array.<string>' // not required\n" +
        '}\'';
    
    /**
     * List of libraries.
     * @var {Object}
     */
    $.spRequireConfigParser.prototype._libraries;
    
    /**
     * Parses a config object.
     * 
     * @param {Object} config Config object
     * 
     * @return {void}
     */
    $.spRequireConfigParser.prototype._parse = function (config) {
        var self = this;
        
        if (!$.isPlainObject(config)) {
            $.error('Invalid config object');
        }
        
        this._libraries = {};
        
        // parses 'library' property
        var libs = config.hasOwnProperty('libraries')? config.libraries: {};
        var libsType = $.type(libs);
        if (libsType != 'object') {
            $.error('Invalid \'libraries\' property. Expected object, given ' + libsType);
        }
        
        // parses libraries
        $.each(libs, function (name, lib) {
            var obj = {
                sources: {
                    js: [],
                    css: []
                },
                requires: []
            };
            
            // parses library
            try {
                obj.async = $.type(lib.async) == 'boolean'? lib.async: true;
                obj.sources.js = self._parseAttr(libs, name, {});
                if ($.type(obj.sources.js) == 'object') {
                    // parses library.sources
                    obj.sources.js = self._parseAttr(obj.sources.js, 'sources', {});
                    if ($.type(obj.sources.js) == 'object') {
                        obj.sources.css = self._parseAttr(obj.sources.js, 'css');
                        obj.sources.js = self._parseAttr(obj.sources.js, 'js');
                    }
                    
                    // parses library.requires
                    obj.requires = self._parseAttr(lib, 'requires');
                }
            } catch (error) {
                $.error(self._errorMessage.replace('%library-name%', name));
            }
            
            self._libraries[name] = obj;
        });
    };
    
    /**
     * Parses an object attribute.
     * 
     * If no default value has passed, the attribute must be either a string or an array of strings.
     * Otherwise the type of the attribute must be same as the type of the default value.
     * 
     * @param {Object} obj      Plain object
     * @param {string} attrName Attribute name
     * @param {*}      defValue Default value (not required, default is [])
     * 
     * @return {Array.<string>|null}
     */
    $.spRequireConfigParser.prototype._parseAttr = function (obj, attrName, defValue) {
        // default arguments
        if (defValue === undefined) {
            defValue = [];
        }
        
        // parses the attribute
        var item = obj.hasOwnProperty(attrName)? obj[attrName]: defValue;
        var type = $.type(item);
        if (type == 'string') {
            item = [item];
        } else
        if (type == 'array') {
            $.each(item, function (key, value) {
                if ($.type(value) != 'string') {
                    $.error('Invalid type');
                }
            });
        } else
        if (arguments.length < 3 || type != $.type(defValue)) {
            $.error('Invalid type');
        }
        
        return item;
    };
    
    /**
     * Gets the list of libraries.
     * 
     * @return {Object}
     */
    $.spRequireConfigParser.prototype.getLibraries = function () {
        return this._libraries;
    };
})(jQuery);
