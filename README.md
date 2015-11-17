# $.spRequire

A jQuery plugin to load JavaScript libraries when they are needed. Unlike other similar plugins, this plugin considers the loading of CSS files by default.

See the `demo` folder for complete examples.

## Installation

Install [bower](https://github.com/bower/bower) and execute the following command:
```bash
$ bower install jquery.sp-require
```
Distribution files are under the `dist` folder.

## Basic usage

The following example loads the libraries and executes a callback function:

```JavaScript
// loads the libraries and executes the callback function
$.require(['lib1', 'lib3'], function () {
  console.log('Libraries loaded successfully');
});
```

The following example uses the `jQuery.Promise` class (see https://api.jquery.com/deferred.promise/):

```JavaScript
$.require(['lib1', 'lib3'])
  .done(function () {
    console.log('Libraries loaded successfully');
  })
  .fail(function () {
    console.log('Some libraries could not be loaded');
  })
  .always(function () {
    console.log('That\'s all Folks!');
  });
```
