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
     * RequireManager class.
     */
    $.spRequireManager = function () {
        this._libraries = [];
    };
    
    /**
     * Required libraries.
     * @var {Array.<$.spRequireLibrary>}
     */
    $.spRequireManager.prototype._libraries = null;
    
    /**
     * Adds a required library.
     * 
     * @param {$.spRequireLibrary} lib Library
     * 
     * @return {void}
     */
    $.spRequireManager.prototype.addLibrary = function (lib) {
        this._libraries.push(lib);
    };
    
    /**
     * Loads the libraries.
     * 
     * @return {$.Promise}
     */
    $.spRequireManager.prototype.load = function () {
        $.each(this._libraries, function () {
            this.load();
        });
    };
    
    /**
     * Loads the CSS sources.
     * 
     * This function loads all the CSS sources (including the required ones) asynchronously.
     * 
     * @return {void}
     */
    $.spRequireManager.prototype._loadCss = function () {
        var sources = this._getCssSources();
        
        $(function () {
            $.each(sources, function (index, source) {
                $('head').append(
                    $('<link rel="stylesheet" type="text/css" />').attr('href', source)
                );
            });
        });
    };
    
    /**
     * Loads the JavaScript sources.
     * 
     * This function loads all the JavaScript sources (including the required ones) asynchronously.
     * 
     * @return {$.Promise}
     */
    $.spRequireManager.prototype._loadJs = function () {
        var self = this;
        var ret = new $.Deferred();
        var sources = this._getJsSources();
        var len = sources.length;
        var success = true;
        
        $(function () {
            if (len > 0) {
                $.each(self._libraries, function () {
                    this.load();
                });
                
                // loads the sources and then resolves or rejects
                /*
                $.each(sources, function (index, source) {
                    $.ajax({
                        url: source,
                        dataType: "script",
                        cache: true
                    }).fail(function (xhr, type, error) {
                        if (type == 'parsererror') {
                            console.error(error);
                        }
                        success = false;
                    }).always(function () {
                        len--;
                        if (len < 1) {
                            ret[success? 'resolve': 'reject']();
                        }
                    });
                });*/
            } else {
                // directly resolves, as it isn't necessary to load any source
                ret.resolve();
            }
        });
        
        return ret.promise();
    };
    
    /**
     * Gets all JavaScript sources all libraries.
     * 
     * This function removes duplicate items.
     * 
     * @return {Array.<string>}
     */
    $.spRequireManager.prototype._getJsSources = function () {
        return this._getSources('_getJsSources');
    };
    
    /**
     * Gets all CSS sources of all libraries.
     * 
     * This function removes duplicate items.
     * 
     * @return {Array.<string>}
     */
    $.spRequireManager.prototype._getCssSources = function () {
        return this._getSources('_getCssSources');
    };
    
    /**
     * Gets a list of items from a specific method.
     * 
     * The methodName parameter is supposed to be the name of a method that returns a list of
     * strings. For example:
     * 
     * ```JavaScript
     * var items = this._getSources('_getJsSources');
     * var items = this._getSources('_getCssSources');
     * ```
     * 
     * @param {string} propertyName Property name
     * 
     * @return {Array.<string>}
     */
    $.spRequireManager.prototype._getSources = function (methodName) {
        var ret = [];
        
        $.each(this._libraries, function () {
            var sources = this[methodName]();
            Array.prototype.push.apply(ret, sources);
        });
        
        return $.spRequireUtil.arrayUnique(ret);
    };
})(jQuery);
