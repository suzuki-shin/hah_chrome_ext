#!/bin/sh
VER=$1
zip package/hah_chrome_ext-$VER.zip ext/manifest.json ext/*.js ext/*.html ext/*.css
