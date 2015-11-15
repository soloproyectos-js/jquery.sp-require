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
     * Helper class.
     */
    $.spRequireUtil = function () {
        // Do Nothing
    };
    
    /**
     * Removes duplicate items from an array.
     * 
     * @param {Array} items List of items
     * 
     * @return {Array}
     * @static
     */
    $.spRequireUtil.arrayUnique = function (items) {
        var ret = [];
        
        $.each(items, function (index, item) {
            var pos = ret.indexOf(item);
            
            if (pos < 0) {
                ret.push(item);
            }
        });
        
        return ret;
    };
    
})(jQuery);
