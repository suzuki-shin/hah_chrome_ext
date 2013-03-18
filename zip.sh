#!/bin/sh
VER=$1
zip hah_chrome_ext-$VER.zip manifest.json *.js *.html *.css
