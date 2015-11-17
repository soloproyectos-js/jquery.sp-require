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
     * Library constructor.
     */
    $.spRequireLibrary = function () {
        this._isAsync = true;
        this._libraries = [];
        this._jsSources = [];
        this._cssSources = [];
        this._urlLoader = $.spRequireUrlLoader.getInstance();
    };
    
    /**
     * URL loader.
     * @var {$.spRequireUrlLoader}
     */
    $.spRequireLibrary.prototype._urlLoader = null;
    
    /**
     * Is an asynchronous library?
     * When the library is 'synchronous', it loads the required libraries in first place. After that,
     * it loads the rest of JavaScript sources.
     */
    $.spRequireLibrary.prototype._isAsync = true;
    
    /**
     * Required libraries.
     * @var {Array.<$.spRequireLibrary>}
     */
    $.spRequireLibrary.prototype._libraries = null;
    
    /**
     * List of JavaScript sources.
     * @var {Array.<string>} URL
     */
    $.spRequireLibrary.prototype._jsSources = null;
    
    /**
     * List of CSS sources.
     * @var {Array.<string>} URL
     */
    $.spRequireLibrary.prototype._cssSources = null;
    
    /**
     * Is the library asynchronous?
     * 
     * An synchronous library loads the required libraries in first place.
     * 
     * @return {boolean}
     */
    $.spRequireLibrary.prototype.isAsync = function () {
        return this._isAsync;
    };
    
    /**
     * Sets the asynchronous state.
     * 
     * @param {boolean} value Is the library asynchronous?
     * 
     * @return {void}
     */
    $.spRequireLibrary.prototype.setAsync = function (value) {
        this._isAsync = value;
    };
    
    /**
     * Adds a JavaScript source.
     * 
     * @param {string} url Path to source
     * 
     * @return {void}
     */
    $.spRequireLibrary.prototype.addJs = function (url) {
        this._jsSources.push(url);
    };
    
    /**
     * Adds a CSS source.
     * 
     * @param {string} url Path to source
     * 
     * @return {void}
     */
    $.spRequireLibrary.prototype.addCss = function (url) {
        this._cssSources.push(url);
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
     * Loads resouces.
     * 
     * @return {$.Promise}
     */
    $.spRequireLibrary.prototype.load = function () {
        this._loadCssSources();
        
        // loads JavaScript sources
        var l = new $.spRequireLoader(this);
        l.addLoader($.proxy(this._loadLibraries, this));
        l.addLoader($.proxy(this._loadJsSources, this));
        return l[this._isAsync? 'load': 'syncLoad']();
    };
    
    /**
     * Loads required libraries.
     * 
     * @return {$.Promise}
     */
    $.spRequireLibrary.prototype._loadLibraries = function () {
        var l = new $.spRequireLoader(this);
        $.each(this._libraries, function () {
            l.addLoader($.proxy(this.load, this));
        });
        return l.load();
    };
    
    /**
     * Loads JavaScript sources.
     * 
     * @return {$.Promise}
     */
    $.spRequireLibrary.prototype._loadJsSources = function () {
        var self = this;
        var l = new $.spRequireLoader(this);
        $.each(this._jsSources, function (index, url) {
            l.addLoader(function () {
                return self._urlLoader.load(url, function () {
                    return $.ajax({
                        url: url,
                        dataType: "script",
                        cache: true
                    }).fail(function (xhr, type, error) {
                        if (type == 'parsererror') {
                            console.error(url + '\n' + error);
                        }
                    });
                });
            });
        });
        return l.load();
    };
    
    /**
     * Loads CSS sources.
     * 
     * @return {void}
     */
    $.spRequireLibrary.prototype._loadCssSources = function () {
        var self = this;
        $.each(self._cssSources, function (index, url) {
            self._urlLoader.load(url, function () {
                $('head').append(
                    $('<link rel="stylesheet" type="text/css" />').attr('href', url)
                );
            });
        });
    };
})(jQuery);
