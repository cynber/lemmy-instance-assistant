#!/bin/bash

function init_build() {
    version=$(grep -o '"version": "[^"]*' src/manifest_$1.json | cut -d'"' -f4)

    echo "Building $1 version $version"

    directory="build/$1/instance-assistant-$version"
    mkdir -p $directory

    cp src/manifest_$1.json $directory/manifest.json
    sed -i 's/_dev.png/.png/' $directory/manifest.json
    
    cp -r src/img $directory/img
    cp -r src/options $directory/options
    cp -r src/popup $directory/popup
    cp -r src/settings $directory/settings
    cp -r src/_locales $directory/_locales
    cp -r src/styles.css $directory/styles.css
    cp src/sidebar.js $directory/sidebar.js
    cp src/communityNotFound.js $directory/communityNotFound.js
    cp src/background.js $directory/background.js
    cp -r node_modules $directory/node_modules
    cp LICENSE $directory/LICENSE

    cd build/$1/instance-assistant-$version
    zip -r ../instance-assistant-$1-$version.zip *
    cd ../../..

    # rm -rf $directory

    echo "Done building $1 version $version"
}
read -p "Have you updated the manifest version number? This will overwrite your current builds (y/n): " confirm

if [[ $confirm == "y" ]]; then
    init_build "chrome"
    init_build "firefox"
    init_build "edge"
    init_build "opera"
    init_build "safari"
else
    echo "Build process canceled."
fi