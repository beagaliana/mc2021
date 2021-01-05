/* Script que dibuja fractales (utilizando sistemas de funciones iterados) dentro de un elemento
  Canvas identificado con el id='ifs.
  
  Para dibujar el fractal tenemos que pasarle un array conteniendo 6 coefficientes a, b, c, d, e, f y la probabilidad.

####################################
    FUNCIONES AUXILIARES
####################################*/

/* Lee los valores de cuadro de texto y los escribe en la matrix fractal. */
function readIfs() {
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
}

/* Traza un punto (dadas unas coordenadas) en el array de pixeles. */
function plot(c) {
    var px = scaleX * x + offsetX,
        py = scaleY * y + offsetY,
        base = (Math.floor(py) * width + Math.floor(px))*4;

    if(!c) elige_color_probabilidad=colors[0]; else elige_color_probabilidad = colors[c % 8];

    pixels[base] = elige_color_probabilidad[0];
    pixels[base+1] = elige_color_probabilidad[1];
    pixels[base+2] = elige_color_probabilidad[2];
    pixels[base+3] = 255;

}
    

/* Selecciona aleatoriamente una transformación y actualiza las coordenadas (x, y) con otro valor nuevo del fractal. */
function next() {
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
}

/* Determina como orientar el fractal, encuentra los límites del Canvas y cuadra los elementos dentro de el */
function findBounds() {
    var left = 0, right = 0, top = 0, bottom = 0;
    x = 0;
    y = 0;

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
}

/* Limpia el buffer de pixeles y luego traza el fractal actual */
function newPicture(){
    // Clear pixel data - Colorea el fondo
    for (var i = 0; i < width * height * 4; i += 4) {
        pixels[i] = 0; //R
        pixels[i+1] = 0; //G
        pixels[i+2] = 0; //B
        pixels[i+3] = 0; //Transparencia
    }
    ctx.putImageData(imageData, 0, 0);

    readIfs();

    findBounds();
}

/* Dibuja un conjunto de puntos y vuelve a poner el temporizador para volver a ejecutarse. */
function drawSomePoints() {
    if (needRefresh) {
        newPicture();
        needRefresh = false;
    }

    for (var i = 0; i < 500; i += 1) {
        var c = next();
        plot(c);
    }

    // Vuelca el array de pixeles en el canvas
    ctx.putImageData(imageData, 0, 0);

    setTimeout(drawSomePoints, 500);
}

/*#######################
    PROGRAMA PRINCIPAL
#########################*/

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




select = document.getElementById("ifs-select"), // Desplegable fractales
values = document.getElementById("values"), // Cuadro de texto con valores del IFS
refresh = document.getElementById("refresh"), // boton cargar
data = document.getElementById("data").childNodes; // divs conteniendo diferentes fractales


// Create el desplegable para la seleccion de fractales
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

// Dibuja un conjunto de puntos cada 500ms.
setTimeout(drawSomePoints, 500);

