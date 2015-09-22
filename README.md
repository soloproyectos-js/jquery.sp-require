# $.spRequire

A jQuery plugin to load 'async' libraries. This plugin can load JavaScript libraries asynchronously. Every file is composed by a list of CSS and JavaScript files defined in a configuration object.

See the `demo` folder for complete examples.

## Installation

Install the [bower](https://github.com/bower/bower) JavaScript package manager and the execute the following command:

```bash
$ bower install jquery.sp-require
```

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
