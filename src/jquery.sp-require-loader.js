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
;(function ($) {
    /**
     * Loader class.
     */
    $.spRequireLoader = function () {
        this._loaders = [];
    };
    
    /**
     * List of loader functions.
     * @var {Array.<Function>}
     */
    $.spRequireLoader.prototype._loaders = null;
    
    /**
     * Adds a loader function.
     * 
     * A loader function is any function that returns a $.Promise object.
     * 
     * @param {Function} loader Loader function
     * 
     * @return {void}
     */
    $.spRequireLoader.prototype.addLoader = function (loader) {
        this._loaders.push(loader);
    };
    
    /**
     * Calls the functions asynchronously.
     * 
     * The following example loads the scripts asynchronously. That is: in any order.
     * ```JavaScript
     * var l = new $.spRequireLoader();
     * l.addLoader($.proxy($.get, window, 'script1.js'));
     * l.addLoader($.proxy($.get, window, 'script2.js'));
     * l.addLoader($.proxy($.get, window, 'script3.js'));
     * l.addLoader($.proxy($.get, window, 'script4.js'));
     * l.load()
     *     .done(function () {
     *         console.log('done!');
     *     })
     *     .fail(function () {
     *         console.log('failed!');
     *     });
     * ```
     * 
     * @return {$.Promise}
     */
    $.spRequireLoader.prototype.load = function () {
        var self = this;
        var ret = new $.Deferred();
        var len = this._loaders.length;
        var success = true;
        
        if (len > 0) {
            $.each(this._loaders, function () {
                this.call(self)
                    .fail(function () {
                        success = false;
                    })
                    .always(function () {
                        len--;
                        if (len < 1) {
                            $(function () {ret[success? 'resolve': 'reject']();});
                        }
                    });
                
            });
        } else {
            $(function () {ret.resolve();});
        }
        
        return ret.promise();
    };
    
    /**
     * Calls the loader functions sequentially.
     * 
     * The following example loads the scripts synchronously (one after another).
     * ```JavaScript
     * var l = new $.spRequireLoader();
     * l.addLoader($.proxy($.get, window, 'script1.js'));
     * l.addLoader($.proxy($.get, window, 'script2.js'));
     * l.addLoader($.proxy($.get, window, 'script3.js'));
     * l.addLoader($.proxy($.get, window, 'script4.js'));
     * l.syncLoad()
     *     .done(function () {
     *         console.log('done!');
     *     })
     *     .fail(function () {
     *         console.log('failed!');
     *     });
     * ```
     * 
     * @return {$.Promise}
     */
    $.spRequireLoader.prototype.syncLoad = function () {
        var self = this;
        var ret = new $.Deferred();
        var len = this._loaders.length;
        
        function callLoader(index) {
            if (index < len) {
                self._loaders[index].call(self)
                    .done(function () {
                        callLoader(index + 1);
                    })
                    .fail(function () {
                        $(function () {ret.reject();});
                    });
            } else {
                $(function () {ret.resolve();});
            }
        }
        
        if (len > 0) {
            callLoader(0);
        } else {
            $(function () {ret.resolve();});
        }
        
        return ret;
    };
})(jQuery);
