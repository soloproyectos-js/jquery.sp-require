# $.spRequire

A jQuery plugin to load JavaScript libraries when they are needed. Unlike other similar plugins, this plugin considers the loading of CSS files by default. Note that the only library that can not be loaded is the [jQuery](https://jquery.com/) library (for obvious reasons).

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
$.require('config', {
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

In some cases we can simplify the configuration object. You can use an `string` to indicate a single element, an `array` of `strings` to indicate multiple elements or a `plain-object` to indicate several JavaScript and CSS files. For example:

```JavaScript
// lib1 has only one JavaScript file
$.spRequire('config', {
    lib1: 'js/script1.js'
});

// lib1 has two JavaScript files
$.spRequire('config', {
    lib1: ['js/script11.js', 'js/script12.js']
});

// lib1 has three JavaScript files and it requires lib2
$.spRequire('config', {
    lib1: {
        sources: ['js/script11.js', 'js/script12.js', 'js/script13.js'],
        requires: 'lib2'
    },
    lib2: 'js/script2.js'
});

// lib1 has one JavaScript file and one CSS file and it requires lib2 and lib3
$.spRequire('config', {
    lib1: {
        sources: {
            js: 'js/script1.js',
            css: 'css/style1.css'
        }
        requires: ['lib2', 'lib3']
    },
    lib2: 'js/script2.js',
    lib3: 'js/script3.js'
});

// lib1 has several JavaScript and CSS files and it requires lib2 and lib3
$.spRequire('config', {
    lib1: {
        sources: {
            js: ['js/script11.js', 'js/script12.js', 'js/script13.js'],
            css: ['css/style11.css', 'css/style12.css', 'css/style13.css']
        }
        requires: ['lib2', 'lib3']
    },
    lib2: 'js/script2.js',
    lib3: 'js/script3.js'
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
