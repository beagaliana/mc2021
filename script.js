/*
 * A script that draws IFS fractals inside a canvas element named "ifs".  To
 * draw a fractal call the function ifs.draw with an array of affine transforms,
 * each of which is an array of the six coefficients a, b, c, d, e, f.
 */

(function () {

    var canvas = document.getElementById("ifs"),
        width = canvas.width,
        height = canvas.height,
        ctx = canvas.getContext("2d"),
        imageData = ctx.createImageData(width, height),
        fractal = [
            [-0.16666667,-0.1666667,0.16666667,-0.1666667,0.0000000,0.000000,0.163],
            [0.83333333,0.2500000,-0.25000000,0.8333333,-0.1666667,-0.166667,0.600],
            [0.33333333,-0.0833333,0.08333333,0.3333333,0.0833333,0.666667,0.237]
        ],
        x = 0,
        y = 0,
        scaleX = 1,
        scaleY = 1,
        offsetX = 0,
        offsetY = 0,
        pixels = imageData.data,
        colors = [[255,255,255],[255,190,255],[255,255,190],[190,255,255],[255,190,190],
                  [190,255,190],[190,190,255],[190,210,255]];
        needRefresh = false;

        /*
         * Reads the values from the textarea into the matrix.
         */
        readIfs = function () {
            values = document.getElementById("values").value.trim().split(/\s+/);
            for (var i = 0; i < values.length; i++) values[i]=values[i]*1;
            if (!(values.length > 0 && values.length % 7 == 0)) {
                alert("Invalid IFS");
            } else {
                fractal = [];
                for (var i = 0; i < values.length; i += 7) {
                    fractal.push(values.slice(i, i + 7));
                }
            }
        },

        /*
         * Plots a point (in world coordinates) into the pixel array.
         */
        plot = function (x, y, c) {
            var px = scaleX * x + offsetX,
                py = scaleY * y + offsetY,
                base = Math.floor(py) * (width * 4) + Math.floor(px) * 4;

            if (!c) c = colors[0]; else c = colors[c % 8];

            pixels[base] = c[0];
            pixels[base+1] = c[1];
            pixels[base+2] = c[2];
            pixels[base+3] = 255;

        },
        

        /*
         * Updates (x,y) to another value in the fractal, by selecting a transform at random
         * and applying it.
         */
        next = function () {
            var r = Math.random(), probabilityThreshold = 0.0;
            for (var i = 0; i < fractal.length; i += 1) {
                var t = fractal[i];
                if (r <= (probabilityThreshold += t[6])) {
                    var oldx = x;
                    x = t[0] * x + t[1] * y + t[4];
                    y = t[2] * oldx + t[3] * y + t[5];
                    return i;
                }
            }
        },

        findBounds = function () {
            var left = 0, right = 0, top = 0, bottom = 0;
            x = 0;
            y = 0;

            // Fall into attractor
            for (var i = 0; i < 100; i += 1) {
                next();
            }

            // Bounce around hoping to settle on the bounding box
            for (var i = 0; i < 10000; i += 1) {
                next();
                if (x < left) left = x;
                if (x > right) right = x;
                if (y < bottom) bottom = y;
                if (y > top) top = y;
            }

            // Adjust for a 1:1 aspect ratio.  This code reeks.
            if (top - bottom > right - left) {
                left = (left + right - top + bottom) / 2;
                right = left + top - bottom;
            } else {
                bottom = (bottom + top - right + left) / 2;
                top = bottom + right - left;
            }

            // TODO: Hack for now... wouldn't canvas transforms be awesome?
            scaleX = width / (right - left);
            scaleY = height / (bottom - top);
            offsetX = (width * left) / (left - right);
            offsetY = (height * top) / (top - bottom);
        },

        /*
         * Clears the pixel buffer then draws the current fractal, whatever it may be,
         */
        newPicture = function () {
            // Clear pixel data
            for (var i = 0; i < width * height * 4; i += 4) {
                pixels[i] = 0;
                pixels[i+1] = 0;
                pixels[i+2] = 0;
                pixels[i+3] = 255;
            }
            ctx.putImageData(imageData, 0, 0);

            readIfs();

            // Determine how to orient the picture
            findBounds();
        },

        /**
         * Draws a burst of points, then schedules itself to run again.
         */
        drawSomePoints = function () {
            if (needRefresh) {
                newPicture();
                needRefresh = false;
            }

            for (var i = 0; i < 500; i += 1) {
                var c = next();
                plot(x, y, c);
                //next();
            }

            // Dump the entire pixel data array to the canvas
            ctx.putImageData(imageData, 0, 0);

            setTimeout(drawSomePoints, 500);
        },

        select = document.getElementById("ifs-select"),
        values = document.getElementById("values"),
        refresh = document.getElementById("refresh"),
        data = document.getElementById("data").childNodes;

    for (var i = 0, n = data.length; i < n; i++) {
        node = data[i];
        if (node.nodeType === 1) {
            select.options.add(new Option(node.id, node.innerHTML));
        }
    }

    refresh.onclick = function () {
        needRefresh = true;
    }

    select.onchange = function () {
        document.getElementById("values").value = select.options[select.selectedIndex].value;
        needRefresh = true;
    }

    // Draw a burst of points every 500ms.
    setTimeout(drawSomePoints, 500);

}());
