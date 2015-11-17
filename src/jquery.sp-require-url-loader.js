/**
 * jQuery.spRequire - A require plugin for jQuery.
 * 
 * This file contains the $.spRequireUrlLoader class. This class is used to avoid loading
 * the same URL several times.
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
     * Link class.
     * 
     * @param {string} url URL
     */
    var Link = function (url) {
        this.url = url;
        this.state = 'pending';
        this.deferrers = [];
    };
    
    /**
     * Link URL.
     * @var {string}
     */
    Link.prototype.url = '';
    
    /**
     * Link state (pending, resolved or rejected)
     * @var {string}
     */
    Link.prototype.state = 'pending';
    
    /**
     * List of 'deferred' objects.
     * @var {Array.<$.Deferred>}
     */
    Link.prototype.deferrers = [];
    
    /**
     * $.spRequireUrlLoader class.
     * 
     * This class is used to avoid loading the same URL several times.
     * 
     * In the following example, 'script.js' is loaded only once:
     * ```JavaScript
     * // if 'script.js' exists, the following code prints:
     * //     Ready 1!
     * //     Ready 2!
     * // otherwise, it prints:
     * //     Failed 1!
     * //     Failed 2!
     * var urlLoader = new $.spRequireUrlLoader();
     * urlLoader.load('script.js', function (url) {
     *     // this method is called once
     *     return $.get(url);
     * }).done(function () {
     *     // this method is called when the url is loaded
     *     console.log('Ready 1!');
     * }).fail(function () {
     *     // this method is called when the load fails
     *     console.log('Failed 1!');
     * });
     * 
     * urlLoader.load('script.js', function (url) {
     *     // this method is not called, as the 'script.php' file already exists
     *     return $.get(url);
     * }).done(function () {
     *     // this method is called when the url is loaded
     *     console.log('Ready 2!');
     * }).fail(function () {
     *     // this method is called when the load fails
     *     console.log('Failed 2!');
     * });
     * ```
     */
    $.spRequireUrlLoader = function () {
        this._links = [];
    };
    
    /**
     * List of links.
     * @var {Array.<Link>}
     */
    $.spRequireUrlLoader.prototype._links = [];
    
    /**
     * Loads an URL.
     * 
     * If the URL wansn't loaded previously, this function calls the 'lodaer' function.
     * If the 'loader' function returns a $.Promise object, it waits for the response and then
     * 'resolves' or 'rejects' the URLs. Otherwise, it 'resolves' directly.
     * 
     * Example:
     * ```JavaScript
     * var urlLoader = new $.spRequireUrlLoader();
     * urlLoader.load('script.php', function (url) {
     *     // this method is called once
     *     return $.get(url);
     * }).done(function () {
     *     // this method is called when the url is loaded
     *     console.log('Ready 1!');
     * }).fail(function () {
     *     // this method is called when the load fails
     *     console.log('Failed 1!');
     * });
     * ```
     * 
     * @param {string}   url    URL
     * @param {Function} loader Loader function
     * 
     * @return {$.Promise}
     */
    $.spRequireUrlLoader.prototype.load = function (url, loader) {
        var self = this;
        var ret = new $.Deferred();
        
        // searches or creates a link
        var absUrl = $.spRequireUtil.getAbsoluteUrl(url);
        var link = this._searchLink(absUrl);
        if (link === null) {
            link = new Link(absUrl);
            this._links.push(link);
            
            // calls the loader (the URL loader is called only one time)
            var req = loader.call(this, url);
            if (req === undefined) {
                req = (new $.Deferred().resolve()).promise();
            }
            
            // waits for the loader's response and resolves or rejects
            req.always(function () {
                link.state = req.state();
                self._resolve();
            });
        }
        link.deferrers.push(ret);
        
        this._resolve();
        
        return ret.promise();
    };
    
    /**
     * Resolves or rejects the link deferrers.
     * 
     * @return {void}
     */
    $.spRequireUrlLoader.prototype._resolve = function () {
        $.each(this._links, function () {
            var link = this;
            $.each(this.deferrers, function () {
                if (link.state == 'resolved') {
                    this.resolve();
                } else
                if (link.state == 'rejected') {
                    this.reject();
                }
            });
        });
    };
    
    /**
     * Searches a link by URL.
     * 
     * This function returns a null value if the link was not found.
     * 
     * @param {string} url URL
     * 
     * @return {Link|null}
     */
    $.spRequireUrlLoader.prototype._searchLink = function (url) {
        var ret = null;
        var len = this._links.length;
        
        $.each(this._links, function () {
            if (this.url == url) {
                ret = this;
                return false;
            }
        });
        
        return ret;
    };
})(jQuery);
