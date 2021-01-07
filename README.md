## Sistemas de Funciones Iteradas
#### Matemáticas para la Computación
###### Escuela Técnica Superior de Ingeniería Informática, Universidad de Sevilla
###### Enero 2020

Este repositorio contiene todos los ficheros de la aplicación web y la memoria que forman parte del trabajo final de la asignatura de MC del grado en Ingeniería Informática.

Los miembros del grupo son:
* Beatriz Galiana
* Fernando Sánchez

### Despliegue de la aplicación web en servidor de PHP built-in
En caso de que el usuario probando la aplicación no quisiera instalar PHP en su máquina o tuviera dificultad para seguir este tutorial, el fichero original HTML, aunque menos legible y algo más pesado, sigue estando disponible en el repositorio y puede ejecutarse perfectamente con simplemente abrirse en cualquier navegador.

1. Abrimos una terminal y nos posicionamos en el directorio en el que queremos que se cree el repositorio clonado. 
Clonamos el repositorio usando `git`:

`$ git clone https://github.com/beagaliana/mc2021.git`

2. Accedemos mediante `cd` a este repositorio que clonado previamente

`$ cd mc2021`

3. Lanzamos el servidor integrado de PHP en el puerto 8000

`$ php -S localhost:8000`

Ahora sólo tenemos que acceder a `http://localhost:8000` en nuestro navegador y ya tenemos la aplicación web desplegada y funcionando.