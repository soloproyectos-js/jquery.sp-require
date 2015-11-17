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
     */
    $.spRequireConfig = function () {
        this._libraries = {};
    };
    
    /**
     * Error message.
     * @var {string}
     */
    $.spRequireConfig.prototype._errorMessage =
        "The '%library-name%' library is not well formed";
    
    /**
     * List of libraries.
     * @var {Object}
     */
    $.spRequireConfig.prototype._libraries;
    
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
                self._parseAttr(lib, 'async', true);
                obj.async = $.type(lib.async) == 'boolean'? lib.async: true;
                obj.sources.js = self._parseMixedAttr(libs, name, {});
                if ($.type(obj.sources.js) == 'object') {
                    // parses library.sources
                    obj.sources.js = self._parseMixedAttr(obj.sources.js, 'sources', {});
                    if ($.type(obj.sources.js) == 'object') {
                        obj.sources.css = self._parseMixedAttr(obj.sources.js, 'css');
                        obj.sources.js = self._parseMixedAttr(obj.sources.js, 'js');
                    }
                    
                    // parses library.requires
                    obj.requires = self._parseMixedAttr(lib, 'requires');
                }
            } catch (error) {
                $.error(self._errorMessage.replace('%library-name%', name) + ':\n' + error.message);
            }
            
            self._libraries[name] = obj;
        });
    };
    
    /**
     * Parses an attribute.
     * 
     * @param {Object} obj      Plain object
     * @param {string} attrName Attribute name
     * @param {Mixed}  defValue Default value (not required)
     */
    $.spRequireConfig.prototype._parseAttr = function (obj, attrName, defValue) {
        var ret = obj.hasOwnProperty(attrName)? obj[attrName]: defValue;
        
        if ($.type(ret) != $.type(defValue)) {
            $.error(
                'The \'' + attrName + '\' property was expected to be \'' + $.type(defValue) + '\''
            );
        }
        
        return ret;
    };
    
    /**
     * Parses a 'mixed' attribute.
     * 
     * A 'mixed' attribute can be either a string, an array of strings or an object. If 'defValue' is
     * missed, then the attribute must be either a string or an arrary of strings. Otherwise, the type
     * of the attribute must be the same as the type of 'defValue'.
     * 
     * @param {Object} obj      Plain object
     * @param {string} attrName Attribute name
     * @param {Mixed}  defValue Default value (not required, default is [])
     * 
     * @return {Array.<string>|null}
     */
    $.spRequireConfig.prototype._parseMixedAttr = function (obj, attrName, defValue) {
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
                    $.error(
                        'The \'' + attrName + '\' property was expected to be ' +
                        '\'string\', an \'array of strings\' or an \'object\'\n' +
                        'Please check the documentation'
                    );
                }
            });
        } else
        if (arguments.length < 3 || type != $.type(defValue)) {
            var msgError =  'The \'' + attrName + '\' property was expected to be ' +
                '\'string\' or an \'array of strings\'';
            if (arguments.length >= 3) {
                msgError = 'The \'' + attrName + '\' property was expected to be ' +
                '\'string\', an \'array of strings\' or an \'' + $.type(defValue) + '\'';
            }
            msgError += '\nPlease check the documentation';
            $.error(msgError);
        }
        
        return item;
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
