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
        fractal = [],
        x = 0,
        y = 0,
        scaleX = 1,
        scaleY = 1,
        offsetX = 0,
        offsetY = 0,
        pixels = imageData.data,
        colors = [[249,7,255],[2,216, 99],[249, 56, 0],[0, 0, 153],[153, 102, 51],
                  [255, 0, 102],[153, 0, 153],[0,0,0]];
        needRefresh = false;

        /*
         * Reads the values from the textarea into the matrix.
         */
        readIfs = function () {
            values = document.getElementById("values").value.trim().split(/\s+/);
            // Transforma tipo texto en tipo NaN
            for (var i = 0; i < values.length; i++) values[i]=Number(values[i]);
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
        plot = function (c) {
            var px = scaleX * x + offsetX,
                py = scaleY * y + offsetY,
                base = (Math.floor(py) * width + Math.floor(px))*4;

            if(!c) elige_color_probabilidad=colors[0]; else elige_color_probabilidad = colors[c % 8];

            pixels[base] = elige_color_probabilidad[0];
            pixels[base+1] = elige_color_probabilidad[1];
            pixels[base+2] = elige_color_probabilidad[2];
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
                    // Nuevos valores de X e Y
                    x = t[0] * x + t[1] * y + t[4];
                    y = t[2] * oldx + t[3] * y + t[5];
                    return i;  // Rompemos el bucle y almacenamos indice para seleccionar color en plot
                }
            }
        },

        findBounds = function () {
            var left = 0, right = 0, top = 0, bottom = 0;
            x = 0;
            y = 0;

            // Bounce around hoping to settle on the bounding box
            for (var i = 0; i < 10000; i += 1) {
                next();
                // Reasignar limites del canvas
                if (x < left) left = x;
                if (x > right) right = x;
                if (y < bottom) bottom = y;
                if (y > top) top = y;
            }

            // Adjust for a 1:1 aspect ratio.
            if (top - bottom > right - left) {
                left = (left + right - top + bottom) / 2;
                right = left + top - bottom;
            } else {
                bottom = (bottom + top - right + left) / 2;
                top = bottom + right - left;
            }

            // Cuadra elementos dentro del canvas
            scaleX = width / (right - left);
            scaleY = height / (bottom - top);
            offsetX = (width * left) / (left - right);
            offsetY = (height * top) / (top - bottom);
        },

        /*
         * Clears the pixel buffer then draws the current fractal, whatever it may be,
         */
        newPicture = function () {
            // Clear pixel data - Colorea el fondo
            for (var i = 0; i < width * height * 4; i += 4) {
                pixels[i] = 0; //R
                pixels[i+1] = 0; //G
                pixels[i+2] = 0; //B
                pixels[i+3] = 0; //T
            }
            ctx.putImageData(imageData, 0, 0);

            readIfs();

            // Determine how to orient the picture
            findBounds();
        },

        /**
         * MAIN METHOD 
         * 
         * Draws a burst of points, then schedules itself to run again.
         */
        drawSomePoints = function () {
            if (needRefresh) {
                newPicture();
                needRefresh = false;
            }

            for (var i = 0; i < 500; i += 1) {
                var c = next();
                plot(c);
            }

            // Dump the entire pixel data array to the canvas
            ctx.putImageData(imageData, 0, 0);

            setTimeout(drawSomePoints, 500);
        },


        select = document.getElementById("ifs-select"), // Desplegable fractales
        values = document.getElementById("values"), // Cuadro de texto con valores del IFS
        refresh = document.getElementById("refresh"), // boton cargar
        data = document.getElementById("data").childNodes; // divs conteniendo diferentes fractales


    // Creates select dropdown
    for (var i = 0, n = data.length; i < n; i++) {
        node = data[i];
        if (node.nodeType === 1) {
            select.options.add(new Option(node.id, node.innerHTML));
        }
    }

    // Pulsar boton cargar
    refresh.onclick = function () {
        needRefresh = true;
    }

    // Seleccionar fractal de desplegable
    select.onchange = function () {
        document.getElementById("values").value = select.options[select.selectedIndex].value;
        needRefresh = true;
    }

    // Draw a burst of points every 500ms.
    setTimeout(drawSomePoints, 500);

}());

