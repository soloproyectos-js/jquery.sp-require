# $.spRequire

A jQuery plugin to load JavaScript libraries dynamically. Unlike other similar plugins, this plugin considers the loading of CSS files by default. Note that the only library that can not be loaded is the [jQuery](https://jquery.com/) library, for obvious reasons.

See the `demo` folder for complete examples.

## Installation

Install [bower](https://github.com/bower/bower) and execute the following command:
```bash
$ bower install jquery.sp-require
```
Distribution files are under the `dist` folder.

## Declaring libraries

Libraries are declared in a configuration object. In the following example we have three libraries, and each library is composed by several JavaScript and CSS files. **By default libraries are loaded asynchronously. That is: they can be loaded in any order**. If you want a library to be loaded after other libraries, you can use the `async` attribute. In the below example, `library3` is loaded after `library2`.

```JavaScript
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
        // this library IS LOADED AT LAST PLACE
        // as it is a 'synchronous' library
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
```

In some cases we can simplify the configuration object. We can use a `string` to indicate a single element, an `array of strings` to indicate multiple elements or an `object` to indicate more complex objects. For example:

```JavaScript
$.spRequire('config', {
    // lib1 is composed by a single script
    lib1: 'js/script1.js',
    // lib2 is composed by two scripts
    lib2: ['js/script21.js', 'js/script22.js'],
    // lib3 is composed by a single script and requires lib2
    lib3: {
        sources: 'js/script3.js',
        requires: 'lib2'
    },
    // lib4 is composed by two scripts and requires two libraries
    lib4: {
        sources: ['js/script41.js', 'js/script42.js'],
        requires: ['lib2', 'lib3']
    },
    // lib5 is composed by a single script and a single CSS file and requires three libraries
    // it is also a 'synchronous' library. That is: it is loaded after the required libraries
    lib5: {
        async: false,
        sources: {
            js: 'js/script5.js',
            css: 'css/style5.js'
        },
        requires: ['lib1', 'lib2', 'lib3']
    },
    // lib6 is composed by several scripts and CSS files and requires a single library
    // it is also a 'synchronous' library. That is: it is loaded after the required libraries
    lib6: {
        async: false,
        sources: {
            js: ['js/script61.js', 'js/script62.js', 'js/script63.js'],
            css: ['css/style61.css', 'css/style62.css']
        },
        requires: 'lib5'
    }
});
```

## Basic usage

After declaring libraries in the configuration object, we can load them dynamically. For example:

```JavaScript
$.spRequire(['lib1', 'lib2'], function () {
    console.log('Libraries are loaded and they are readay to be used');
});
```

The `$.spRequire([libs...])` function returns a [jQuery.Promise](https://api.jquery.com/promise/) object, so the above example can also be written as follows:
```JavaScript
$.spRequire(['lib1', 'lib2']).done(function () {
    console.log('Libraries are loaded and they are readay to be used');
}).fail(function () {
    console.log('An error has occurred and the libraries could not be loaded');
}).alwasy(function () {
    console.log('This function is always executed');
});
```
