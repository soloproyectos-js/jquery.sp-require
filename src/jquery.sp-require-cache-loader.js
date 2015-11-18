/**
 * jQuery.spRequire - A require plugin for jQuery.
 * 
 * The class $.spRequireCacheLoader is used to avoid loading the same 'things' several times.
 * A 'thing' can be an url, a file, a library... that is: something that can be 'loaded'.
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
     * Item class.
     * 
     * An 'item' is something that can be loaded: an url, a file, an object, etc...
     * 
     * @param {*} id Identifier
     */
    var Item = function (id) {
        this.id = id;
        this.state = 'pending';
        this.deferrers = [];
    };
    
    /**
     * Identifier.
     * @var {*}
     */
    Item.prototype.id = null;
    
    /**
     * Item state (pending, resolved or rejected)
     * @var {string}
     */
    Item.prototype.state = 'pending';
    
    /**
     * List of 'deferred' objects.
     * @var {Array.<$.Deferred>}
     */
    Item.prototype.deferrers = [];
    
    /**
     * $.spRequireCacheLoader class.
     * 
     * This class is used to avoid loading the same 'thing' several times.
     * 
     * In the following example, 'script.js' is loaded only once:
     * ```JavaScript
     * // if 'script.js' exists, the following code prints:
     * //     Ready 1!
     * //     Ready 2!
     * // otherwise, it prints:
     * //     Failed 1!
     * //     Failed 2!
     * var loader = $.spRequireCacheLoader.getInstance();
     * loader.load('script.js', function (object) {
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
     * loader.load('script.js', function (url) {
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
    $.spRequireCacheLoader = function () {
        this._items = [];
    };
    
    /**
     * List of items.
     * @var {Array.<Item>}
     */
    $.spRequireCacheLoader.prototype._items = [];
    
    /**
     * Loads an item.
     * 
     * If the item wansn't loaded previously, this function calls the 'loader' function.
     * If the 'loader' function returns a $.Promise object, it waits for the response and then
     * 'resolves' or 'rejects'. Otherwise, it 'resolves' directly.
     * 
     * Example:
     * ```JavaScript
     * var loader = $.spRequireCacheLoader.getInstance();
     * loader.load('script.php', function (url) {
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
     * @param {*}        id     Item Identifier
     * @param {Function} loader Loader function
     * 
     * @return {$.Promise}
     */
    $.spRequireCacheLoader.prototype.load = function (id, loader) {
        var self = this;
        var ret = new $.Deferred();
        
        // searches or creates an item
        //var absUrl = this._getAbsoluteUrl(url);
        var item = this._searchItem(id);
        if (item === null) {
            item = new Item(id);
            this._items.push(item);
            
            // calls the loader
            var req = loader.call(this, item);
            if (req === undefined) {
                req = (new $.Deferred().resolve()).promise();
            }
            
            // waits for the loader's response and resolves or rejects
            req.always(function () {
                item.state = req.state();
                self._resolve();
            });
        }
        item.deferrers.push(ret);
        
        this._resolve();
        
        return ret.promise();
    };
    
    /**
     * Resolves or rejects the item deferrers.
     * 
     * @return {void}
     */
    $.spRequireCacheLoader.prototype._resolve = function () {
        $.each(this._items, function () {
            var item = this;
            $.each(this.deferrers, function () {
                if (item.state == 'resolved') {
                    this.resolve();
                } else
                if (item.state == 'rejected') {
                    this.reject();
                }
            });
        });
    };
    
    /**
     * Searches an item.
     * 
     * This function returns a null value if the item was not found.
     * 
     * @param {*} id Item identifier
     * 
     * @return {Item|null}
     */
    $.spRequireCacheLoader.prototype._searchItem = function (id) {
        var ret = null;
        
        $.each(this._items, function () {
            if (this.id === id) {
                ret = this;
                return false;
            }
        });
        
        return ret;
    };
})(jQuery);
