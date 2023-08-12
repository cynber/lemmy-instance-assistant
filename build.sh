#!/bin/bash

function init_build() {
    # GET VERSION AND MANIFEST VERSION ==========================================
    version=$(grep -o '"version": "[^"]*' src/manifest_$1.json | cut -d'"' -f4)
    manifest=$(grep -o '"manifest_version": [0-9]*' src/manifest_$1.json | cut -d' ' -f2)

    # CREATE BUILD DIRECTORY ====================================================
    echo "Building $1 v-$version$suffix (Manifest $manifest)..."
    directory="build/$1/instance-assistant-$version$suffix"
    if [ -d "$directory" ]; then
        rm -rf $directory
    fi
    mkdir -p $directory

    # COPY FILES ================================================================
    cp src/manifest_$1.json $directory/manifest.json
    cp LICENSE $directory/LICENSE
    cp src/styles.css $directory/styles.css
    cp src/utils.js $directory/utils.js
    cp src/content-sidebar.js $directory/content-sidebar.js
    cp src/content-communityNotFound.js $directory/content-communityNotFound.js
    cp src/content-general.js $directory/content-general.js
    cp -r node_modules $directory/node_modules
    cp -r src/img $directory/img
    # cp -r src/_locales $directory/_locales            # TODO: Fix translations
    cp -r src/page-options $directory/page-options
    cp -r src/page-popup $directory/page-popup
    cp -r src/page-settings $directory/page-settings
    cp -r src/page-sidebar $directory/page-sidebar
    cp -r src/page-search $directory/page-search
    
    # COPY SCRIPT FILES BASED ON MANIFEST VERSION ================================
    if [ "$manifest" = 2 ]; then
        cp src/background.js $directory/background.js
    else
        cp src/m3-background.js $directory/background.js
    fi
    
    # REPLACE DEV IMAGES WITH PRODUCTION IMAGES ==================================
    if [ "$isDev" = false ]; then
        sed -i 's/_dev.png/.png/' $directory/manifest.json
    fi

    # CHECK IF ZIP FILE ALREADY EXISTS AND CONFIRM OVERWRITE (PRODUCTION ONLY) ===
    if [ -f "build/$1/instance-assistant-$1-$version$suffix.zip" ] && [ "$isDev" = false ]; then
        read -p "Zip file already exists. Overwrite? (y/n): " confirm
        if [[ $confirm == "y" ]]; then
            rm "build/$1/instance-assistant-$1-$version$suffix.zip"
        else
            echo "Build process canceled."
            exit 1
        fi
    fi

    # ZIP FILES, REMOVE BUILD DIRECTORY, AND PRINT SUCCESS MESSAGE ===============
    cd build/$1/instance-assistant-$version$suffix
    zip -r ../instance-assistant-$1-$version$suffix.zip * >/dev/null 2>&1
    cd ../../..
    # rm -rf $directory
    echo -e "\e[32mDone building $1 v-$version$suffix\e[0m"
}

# =================================================================================
# BUILD SCRIPT
# =================================================================================

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