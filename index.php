<!doctype html>

<html>
  <head>
    <meta charset="utf-8">
    <title>Sistemas de Funciones Iteradas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="index.css">
    <link rel="stylesheet" type="text/css" href="index.css">
    <link href="https://fonts.googleapis.com/css?family=
    Roboto|Lato&display=swap" rel="stylesheet">
  </head>
  <body>  
    <div id="data" style="display:none">
      <?php include "fractals.html" ?>
    </div>

    <h2>Renderizador de Sistemas de Funciones Iteradas</h2>
    <div style="display: flex;">
      
      <div id="menu">
        <p style="padding: 5%; font-size: medium;">Elige uno de los siguientes ejemplos clásicos o modifica los parámetros tú mismo:
        <select id="ifs-select"></select></p>
        <p style="text-align: center;">
        <textarea id="values" rows="6" cols="80"></textarea></p>
        <button id="refresh">¡Cargar!</button>
        <p style="padding: 10%; font-size: medium;">Échale un vistazo al 
        <a href="http://www.github.com/beagaliana/mc2021">repositorio</a> del código en GitHub
      </div>

      <div style="padding-left: 5%;">
          <canvas id="ifs" height="480" width="500" style="outline: rgb(127, 119, 235) 3px solid;">
          ¡Vaya! Parece que tu navegador no soporta Canvas
        </canvas>
      </div>
      
      <script src="script.js"></script>
    </div>
  </body>
</html>

