/**
 * Configures the 'require' plugin.
 * 
 * In the following example, we have three libraries, which are composed by a list of JavaScript and
 * CSS files. All attributes are optional but, if presents, they should look as follows.
 */
$.spRequire('config', {
    libraries: {
        lib1: {
            sources: {
                js: ['js/script11.js', 'js/script12.js', 'js/script13.js'],
                css: ['css/style11.css', 'css/style12.css', 'css/style13.css']
            }
        },
        lib2: {
            sources: {
                js: ['js/script21.js', 'js/script22.js'],
                css: ['css/style21.css', 'css/style22.css']
            },
            requires: ['lib1']
        },
        // this library is loaded at last place
        // as it is an 'synchronous' library
        lib3: {
            async: false,
            sources: {
                js: ['js/script31.js'],
                css: ['css/style31.css']
            },
            requires: ['lib2']
        }
    }
});
