#!/bin/bash
# This script creates the distribution files. Usage:
# ./make-dist.sh

# remove dist files 
rm -rf dist/*

# compresses JavaScript files
cat \
    src/jquery.sp-require-util.js \
    src/jquery.sp-require-config-parser.js \
    src/jquery.sp-require-library.js \
    src/jquery.sp-require-manager.js \
    src/jquery.sp-require.js \
| uglifyjs \
    --compress \
    --mangle \
    --preamble "/*! jQuery.spRequire v0.1.4 | Copyright (c) 2015 Gonzalo Chumillas | https://github.com/soloproyectos-js/jquery.sp-require/blob/master/LICENSE */" \
    -o dist/jquery.sp-require.min.js
