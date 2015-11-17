# $.spRequire

A jQuery plugin to load JavaScript libraries when they are needed. Unlike other similar plugins, this plugin considers the loading of CSS files by default.

See the `demo` folder for complete examples.

## Installation

Install [bower](https://github.com/bower/bower) and execute the following command:
```bash
$ bower install jquery.sp-require
```
Distribution files are under the `dist` folder.

## Configuration object

Libraries are declared in a conguration object. In the following example we have three libries, and each library has a set of JavaScript and CSS files. By default, libraries are loaded asynchronously. That is: **they can be loaded in any order**.

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
```
