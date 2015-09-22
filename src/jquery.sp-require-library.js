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
     * Library constructor.
     */
    $.spRequireLibrary = function () {
        this._libraries = [];
        this._jsSources = [];
        this._cssSources = [];
    };
    
    /**
     * Required libraries.
     * @var {Array.<$.spRequireLibrary>}
     */
    $.spRequireLibrary.prototype._libraries = null;
    
    /**
     * List of JavaScript sources.
     * @var {Array.<string>}
     */
    $.spRequireLibrary.prototype._jsSources = null;
    
    /**
     * List of CSS sources.
     * @var {Array.<string>}
     */
    $.spRequireLibrary.prototype._cssSources = null;
    
    /**
     * Adds a JavaScript source.
     * 
     * @param {string} url Path to source
     * 
     * @return {void}
     */
    $.spRequireLibrary.prototype.addJs = function (url) {
        this._jsSources.push(this._getAbsoluteUrl(url));
    };
    
    /**
     * Adds a CSS source.
     * 
     * @param {string} url Path to source
     * 
     * @return {void}
     */
    $.spRequireLibrary.prototype.addCss = function (url) {
        this._cssSources.push(this._getAbsoluteUrl(url));
    };
    
    /**
     * Adds a required library.
     * 
     * @param {$.spRequireLibrary} lib Library
     * 
     * @return {void}
     */
    $.spRequireLibrary.prototype.addLibrary = function (lib) {
        this._libraries.push(lib);
    };
    
    /**
     * Gets all JavaScript sources (including required sources).
     * 
     * This function removes duplicate items.
     * 
     * @return {Array.<string>}
     */
    $.spRequireLibrary.prototype._getJsSources = function () {
        return this._getSources('_jsSources');
    };
    
    /**
     * Gets all CSS sources (including required sources).
     * 
     * This function removes duplicate items.
     * 
     * @return {Array.<string>}
     */
    $.spRequireLibrary.prototype._getCssSources = function () {
        return this._getSources('_cssSources');
    };
    
    /**
     * Gets a list of items from a specific attribute.
     * 
     * The propertyName parameter is supposed to be the name of an attribute that contains a list of
     * strings. For example:
     * 
     * ```JavaScript
     * var items = this._getSources('_jsSources');
     * var items = this._getSources('_cssSources');
     * ```
     * 
     * @param {string} propertyName     Property name
     * @param {string} excludeLibraries Do not search in these libraries (not required, internal only)
     * 
     * @return {Array.<string>}
     */
    $.spRequireLibrary.prototype._getSources = function (propertyName, excludeLibraries) {
        var ret = [];
        
        // default arguments
        if (excludeLibraries === undefined) {
            excludeLibraries = [];
        }
        
        // merges required libraries
        excludeLibraries.push(this);
        $.each(this._libraries, function () {
            if ($.inArray(this, excludeLibraries) < 0) {
                var sources = this._getSources(propertyName, excludeLibraries);
                Array.prototype.push.apply(ret, sources);
            }
        });
        
        Array.prototype.push.apply(ret, this[propertyName]);
        return $.spRequireUtil.arrayUnique(ret);
    };
    
    /**
     * Gets the absolute URL.
     * 
     * @param {string} url URL
     * 
     * @return {string}
     */
    $.spRequireLibrary.prototype._getAbsoluteUrl = function (url) {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    };
})(jQuery);
