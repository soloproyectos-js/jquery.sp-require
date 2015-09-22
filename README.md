# $.spRequire

A jQuery plugin to load 'async' libraries. This plugin can load JavaScript libraries asynchronously.

## Installation
```bash
$ bower install sp-require
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
