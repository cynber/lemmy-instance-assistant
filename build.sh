#!/bin/bash

function init_build() {
    version=$(grep -o '"version": "[^"]*' src/manifest_$1.json | cut -d'"' -f4)

    echo "Building $1 version $version"

    directory="build/$1/instance-assistant-$version"

    echo $directory

    mkdir -p $directory

    cp src/manifest_$1.json $directory/manifest.json
    cp -r src/img $directory/img
    cp -r src/options $directory/options
    cp -r src/popup $directory/popup
    cp src/content.js $directory/content.js
    cp -r node_modules $directory/node_modules
    cp LICENSE $directory/LICENSE

    cd build/$1/instance-assistant-$version
    zip -r ../instance-assistant-$1-$version.zip *
    cd ../../..

    rm -rf $directory

    echo "Done building $1 version $version"
}


init_build "chrome"
init_build "firefox"