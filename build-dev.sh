#!/bin/bash

function init_build() {
    version=$(grep -o '"version": "[^"]*' src/manifest_$1.json | cut -d'"' -f4)

    echo "Building $1 version $version"

    directory="build/$1/instance-assistant-$version-DEV"

    if [ -d "$directory" ]; then
        rm -rf $directory
    fi

    mkdir -p $directory

    cp src/manifest_$1.json $directory/manifest.json
    
    cp -r src/img $directory/img
    cp -r src/options $directory/options
    cp -r src/popup $directory/popup
    cp -r src/settings $directory/settings
    cp -r src/_locales $directory/_locales
    cp -r src/styles.css $directory/styles.css
    cp src/content.js $directory/content.js
    cp -r node_modules $directory/node_modules
    cp LICENSE $directory/LICENSE

    cd build/$1/instance-assistant-$version-DEV
    zip -r ../instance-assistant-$1-$version-DEV.zip *
    cd ../../..

    # rm -rf $directory

    echo "Done building $1 version $version"
}

init_build "chrome"
init_build "firefox"