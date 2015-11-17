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
     * Constructor.
     * 
     * This class loads JavaScript sources asynchronously.
     */
    $.spRequireScriptLoader = function () {
        this._deferred = new $.Deferred();
        this._urls = [];
    };
    
    /**
     * Deferred object.
     * @var {$.Deferred}
     */
    $.spRequireScriptLoader.prototype._deferred = null;
    
    /**
     * List of URLs.
     * @var {Array.<string>}
     */
    $.spRequireScriptLoader.prototype._urls = null;
    
    /**
     * Adds an URL.
     * 
     * @param {string} url URL
     * 
     * @return {void}
     */
    $.spRequireScriptLoader.prototype.addUrl = function (url) {
        this._urls.push(url);
    };
    
    /**
     * Loads JavaScript sources asynchronously.
     * 
     * @return {$.Promise}
     */
    $.spRequireScriptLoader.prototype.load = function () {
        var self = this;
        var len = this._urls.length;
        var success = true;
        
        $(function () {
            if (len > 0) {
                // loads the sources and then resolves or rejects
                $.each(self._urls, function (index, source) {
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
                            self._deferred[success? 'resolve': 'reject']();
                        }
                    });
                });
            } else {
                // directly resolves, as it isn't necessary to load any source
                self._deferred.resolve();
            }
        });
        
        return self._deferred.promise();
    };
    
    /**
     * Gets the "promise" object.
     * 
     * @return {$.Promise}
     */
    $.spRequireScriptLoader.prototype.getPromise = function () {
        return this._deferred.promise();
    };
})(jQuery);
