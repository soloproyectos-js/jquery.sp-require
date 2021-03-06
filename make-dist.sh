#!/bin/bash
# This script creates the distribution files. Usage:
# ./make-dist.sh

# remove dist files 
rm -rf dist/*

# compresses JavaScript files
cat \
    src/jquery.sp-require-config.js \
    src/jquery.sp-require-loader.js \
    src/jquery.sp-require-cache-loader.js \
    src/jquery.sp-require-library.js \
    src/jquery.sp-require.js \
| uglifyjs \
    --compress \
    --mangle \
    --preamble "/*! jQuery.spRequire v0.3.0 | Copyright (c) 2015 Gonzalo Chumillas | https://github.com/soloproyectos-js/jquery.sp-require/blob/master/LICENSE */" \
    -o dist/jquery.sp-require.min.js
