#!/bin/bash

function init_build() {
    # Get version number from manifest
    version=$(grep -o '"version": "[^"]*' src/manifest_$1.json | cut -d'"' -f4)
    manifest=$(grep -o '"manifest_version": [0-9]*' src/manifest_$1.json | cut -d' ' -f2)

    # Create build directory
    echo "Building $1 v-$version$suffix (Manifest $manifest)..."
    directory="build/$1/instance-assistant-$version$suffix"
    if [ -d "$directory" ]; then
        rm -rf $directory
    fi
    mkdir -p $directory

    # Copy files
    cp src/manifest_$1.json $directory/manifest.json
    cp -r node_modules $directory/node_modules
    cp LICENSE $directory/LICENSE
    # cp -r src/_locales $directory/_locales    # TODO: Fix translations
    cp -r src/img $directory/img
    cp -r src/page-welcome $directory/page-welcome
    # cp -r src/options $directory/options
    cp -r src/popup $directory/popup
    cp -r src/settings $directory/settings
    cp src/styles.css $directory/styles.css

    if [ "$manifest" = 2 ]; then
        cp src/background.js $directory/background.js
        cp src/communityNotFound.js $directory/communityNotFound.js
        cp src/content-sidebar.js $directory/content-sidebar.js
    else
        cp src/service-worker.js $directory/service-worker.js
        cp src/m3-background.js $directory/background.js
        cp src/m3-communityNotFound.js $directory/communityNotFound.js
        cp src/m3-content-sidebar.js $directory/content-sidebar.js
    fi
    
    
    # Replace dev images with production images
    if [ "$isDev" = false ]; then
        sed -i 's/_dev.png/.png/' $directory/manifest.json
    fi

    # Check if zip file already exists and if not dev version
    if [ -f "build/$1/instance-assistant-$1-$version$suffix.zip" ] && [ "$isDev" = false ]; then

        read -p "Zip file already exists. Overwrite? (y/n): " confirm

        if [[ $confirm == "y" ]]; then
            rm "build/$1/instance-assistant-$1-$version$suffix.zip"
        else
            echo "Build process canceled."
            exit 1
        fi
    fi

    # Zip files, remove build directory, and print success message
    cd build/$1/instance-assistant-$version$suffix
    zip -r ../instance-assistant-$1-$version$suffix.zip * >/dev/null 2>&1
    cd ../../..
    # rm -rf $directory
    echo -e "\e[32mDone building $1 v-$version$suffix\e[0m"
}

suffix=""
isDev=false

if [ "$1" == "-dev" ]; then
    suffix="-DEV"
    isDev=true
fi

init_build "chrome"
init_build "firefox"
init_build "edge"
init_build "opera"
#init_build "safari"