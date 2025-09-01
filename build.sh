#!/bin/bash
set -euo pipefail

BUILD_DIR="build"

echo "cleaning build dir..."
rm -rf build
mkdir build
rm -rf dist
mkdir dist

echo "compiling..."
npx tstl -p tsconfig.json

echo "copying assets..."
cp -r assets build/assets

OUTDIR=$(mktemp -d)

cp -r build/* "$OUTDIR"

echo "built contents at $OUTDIR"

cp makelove.toml "$OUTDIR"

pushd "$OUTDIR" > /dev/null

makelove lovejs --config ./makelove.toml

popd > /dev/null

cp -r "$OUTDIR/makelove-build" ./dist


    ZIPFILE=$(find ./dist/makelove-build/lovejs -name "*.zip" | head -n1)

    if [ -z "$ZIPFILE" ]; then
        echo "❌ No .zip file found in dist folder!"
        exit 1
    fi

    # Extract it to ./dist/web
    WEB_DIR=./dist/web
    rm -rf "$WEB_DIR"
    mkdir -p "$WEB_DIR"
    unzip -q "$ZIPFILE" -d "$WEB_DIR"
    echo "✅ extracted to $WEB_DIR"

    GAME_FOLDER=$(find "$WEB_DIR" -maxdepth 1 -mindepth 1 -type d | head -n1)
    if [ -z "$GAME_FOLDER" ]; then
        echo "❌ Could not find game folder inside web!"
        exit 1
    fi


    HTML_FILE="$GAME_FOLDER/index.html"

    # 1️⃣ Remove <link rel="stylesheet" ...> lines
    sed -i '/<link rel="stylesheet.*>/d' "$HTML_FILE"

    # 2️⃣ Remove <h1>...</h1> lines
    sed -i '/<h1>.*<\/h1>/d' "$HTML_FILE"

    # Remove <center> and </center> lines
    sed -i '/<center>/d' "$HTML_FILE"
    sed -i '/<\/center>/d' "$HTML_FILE"

    # 3️⃣ Remove <footer>...</footer> block (multi-line)
    sed -i '/<footer>/,/<\/footer>/d' "$HTML_FILE"

    # 4️⃣ Add body style: margin:0; background-color:black
    # We'll insert it inside the <body> tag
    sed -i 's|<body>|<body style="margin:0; background-color: rgb(0,0,0);">|' "$HTML_FILE"

    # Change loadingCanvas width/height to 960x720
    sed -i 's/width="800"/width="960"/' "$HTML_FILE"
    sed -i 's/height="600"/height="720"/' "$HTML_FILE"

    # sed -i 's/drawLoadingText(text);/drawLoadingText(Module.remainingDependencies / Module.totalDependencies);/' "$HTML_FILE"

    # Remove old drawLoadingText (lines containing function drawLoadingText until next closing })
    awk 'BEGIN{skip=0} 
        /function drawLoadingText\(/ {skip=1} 
        skip && /\}/ {skip=0; next} 
        !skip {print}' "$HTML_FILE" > "$HTML_FILE.tmp" && mv "$HTML_FILE.tmp" "$HTML_FILE"

    # Remove old monitorRunDependencies (object property inside Module)
    awk 'BEGIN{skip=0} 
        /monitorRunDependencies: function\(/ {skip=1} 
        skip && /\}/ {skip=0; next} 
        !skip {print}' "$HTML_FILE" > "$HTML_FILE.tmp" && mv "$HTML_FILE.tmp" "$HTML_FILE"

    perl -0777 -i -pe 's|setStatus: function\([^)]*\)\s*\{[^}]+\}|setStatus: function(text) {
    if (text) {
        drawLoadingText(Module.remainingDependencies / Module.totalDependencies);
    }
    |s' "$HTML_FILE"

    # Append new functions at the end of the script block (before </script>)
    perl -0777 -i -pe 's|(</script>)|function drawLoadingText(progress) {
        var canvas = loadingContext.canvas;
        var ctx = loadingContext;

        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        // ctx.fillText("Powered by LoveJS", canvas.width/2, canvas.height/2-50);
        // ctx.fillText("Made by Davidobot", canvas.width/2, canvas.height/2-20);

        var barWidth = canvas.width*0.9;
        var barHeight = 5;
        var barX = (canvas.width - barWidth)/2;
        var barY = canvas.height/2+10;

        ctx.fillStyle = "black";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        var filledWidth = Math.floor(barWidth*progress);
        ctx.fillStyle = "grey";
        ctx.fillRect(barX, barY, filledWidth, barHeight);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

    }
    Module.monitorRunDependencies = function(left){
        this.remainingDependencies = left;
        this.totalDependencies = Math.max(this.totalDependencies,left);
        var progress = this.totalDependencies>0? 1-left/this.totalDependencies : 0;
        // drawLoadingText(progress);
    };
    $1|' "$HTML_FILE"
 

if [[ "${1:-}" == "--test" ]]; then
    # Start Python HTTP server
    echo "starting web server at http://localhost:8000 ..."
    pushd "$GAME_FOLDER" > /dev/null
    python3 -m http.server 8000 &
    SERVER_PID=$!
    popd > /dev/null

    trap "echo 'Stopping server...'; kill $SERVER_PID; exit 1" SIGINT SIGTERM

    # Open default browser
    # if command -v xdg-open &> /dev/null; then
    #     xdg-open "http://localhost:8000"
    # elif command -v open &> /dev/null; then
    #     open "http://localhost:8000"
    # else
    #     echo "⚠️ Could not detect a browser opener. Open http://localhost:8000 manually."
    # fi

    # Wait for user to quit
    wait $SERVER_PID

fi
