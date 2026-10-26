============================================================
  Aula Play - Documentación del proyecto
============================================================

Descripción general
--------------------
Aula Play es una plataforma educativa interactiva que permite
aprender jugando mediante seis juegos diferentes. Está construida
con HTML, CSS y JavaScript puro, sin dependencias externas.
Funciona en GitHub Pages y cualquier servidor web estático.

IMPORTANTE: algunos juegos cargan datos desde archivos JSON
mediante fetch(). Esto requiere ejecutar la página desde un
servidor web (no abriendo index.html directamente con file://).
Para desarrollo local puedes usar la extensión Live Server de
VS Code, o ejecutar: python -m http.server 8080


------------------------------------------------------------
  ESTRUCTURA DE ARCHIVOS
------------------------------------------------------------

JuegosDePrueba/
├── index.html          Página principal con todos los juegos
├── admin.html          Panel de administración de juegos
├── conceptos.json      Datos del juego Memoria Conceptual
├── alternativas.json   Datos del juego Alternativas
└── readme.txt          Este archivo


------------------------------------------------------------
  JUEGOS DISPONIBLES
------------------------------------------------------------

1. Reto matemático
   - Resuelve operaciones de suma, resta y multiplicación.
   - 5 preguntas por partida con dificultad creciente.
   - +10 puntos por respuesta correcta.

2. Palabra misteriosa
   - Descubre una palabra a partir de sus letras desordenadas.
   - Se muestra una pista y se permite pedir una pista extra.
   - +15 puntos por respuesta correcta.

3. Memoria Conceptual
   - Asocia cada concepto con su respuesta correspondiente.
   - Las tarjetas se muestran ocultas; se revelan al pulsar.
   - 6 pares por partida, seleccionados aleatoriamente de conceptos.json.
   - +10 puntos por pareja encontrada.
   - +20 puntos de bono si completas la partida con pocos movimientos.
   - Los datos se cargan desde: conceptos.json

4. Alternativas
   - Elige la respuesta correcta entre cuatro opciones.
   - 5 preguntas por partida, seleccionadas aleatoriamente de alternativas.json.
   - Las alternativas se barajan en cada partida.
   - Se muestra una explicación opcional tras cada respuesta.
   - +10 puntos por respuesta correcta.
   - Los datos se cargan desde: alternativas.json

5. Sinónimos exprés
   - Elige la palabra con significado más parecido a la dada.
   - 5 preguntas por partida.
   - +10 puntos por respuesta correcta.

6. Desafío sorpresa
   - Lanza aleatoriamente uno de los juegos: Reto matemático,
     Alternativas o Sinónimos exprés.

7. Match: Imagen y concepto
   - Relaciona cada imagen de la columna izquierda con su concepto
     en la columna derecha.
   - Las imagenes y los conceptos se barajan de forma independiente
     en cada partida, para que su posicion no revele la respuesta.
   - +5 puntos por cada pareja correcta.
   - +10 puntos de bonificacion al completar todas las parejas.
   - Los datos se cargan desde: conceptos-imagenes.json
   - Las imagenes se sirven desde: imagenes/


------------------------------------------------------------
  COMO AGREGAR IMAGENES Y CONCEPTOS (Match: Imagen y concepto)
------------------------------------------------------------

1. Copia el archivo de imagen (jpg, jpeg, png, webp o svg) dentro
   de la carpeta imagenes/.

2. Abre conceptos-imagenes.json y agrega una entrada:

     {
       "imagen": "nombre-exacto.jpg",
       "concepto": "Nombre del concepto"
     }

   El nombre debe coincidir exactamente con el archivo, incluyendo
   mayusculas, minusculas y extension.

3. Guarda el JSON. No es necesario modificar index.html ni admin.html.

Ejemplo de conceptos-imagenes.json con una entrada nueva:

[
  { "imagen": "fotosintesis.svg",  "concepto": "Fotosintesis"  },
  { "imagen": "sistema-solar.svg", "concepto": "Sistema solar" },
  { "imagen": "mi-nueva.jpg",      "concepto": "Mi nuevo tema" }
]



------------------------------------------------------------
  CÓMO AGREGAR CONTENIDO A LOS JUEGOS JSON
------------------------------------------------------------

--- conceptos.json (Memoria Conceptual) ---

Cada entrada tiene este formato:

  {
    "concepto": "Nombre o término",
    "respuesta": "Definición o dato asociado"
  }

Ejemplo:
  {
    "concepto": "Evaporación",
    "respuesta": "Proceso por el que un líquido pasa a estado gaseoso."
  }

Reglas:
  - Ambos campos son obligatorios y deben tener contenido.
  - Puedes agregar cualquier cantidad de pares; el juego tomará
    6 al azar por partida.
  - Las entradas con campos vacíos o faltantes se descartan
    automáticamente sin romper el juego.


--- alternativas.json (Alternativas) ---

Cada entrada tiene este formato:

  {
    "id": número único,
    "pregunta": "Texto de la pregunta",
    "alternativas": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "respuestaCorrecta": índice (0, 1, 2 o 3),
    "explicacion": "Texto educativo opcional."
  }

Ejemplo:
  {
    "id": 16,
    "pregunta": "¿Cuántos continentes tiene el planeta Tierra?",
    "alternativas": ["5", "6", "7", "8"],
    "respuestaCorrecta": 2,
    "explicacion": "Los 7 continentes son: África, América, Antártida, Asia, Europa, Oceanía y América."
  }

Reglas:
  - "id" debe ser un número único por pregunta.
  - "alternativas" debe contener exactamente 4 opciones no vacías.
  - "respuestaCorrecta" es el índice (0 a 3) de la opción correcta
    en el array "alternativas", ANTES de que el juego las baraje.
  - "explicacion" es opcional; si se omite o se deja vacío, no aparece.
  - Puedes agregar cualquier cantidad de preguntas; el juego
    tomará 5 al azar por partida.
  - Las preguntas inválidas se descartan sin romper el juego.


------------------------------------------------------------
  PANEL DE ADMINISTRACIÓN (admin.html)
------------------------------------------------------------

Permite activar o desactivar cada juego de la página principal.

- Acceso: link "Administrar" en la barra de navegación.
- Los cambios se guardan en el almacenamiento local del navegador
  (localStorage) y se aplican al pulsar "Guardar cambios".
- El botón "Activar todos" restablece todos los juegos como activos.
- Los cambios son por navegador/dispositivo, no afectan a otros usuarios.


------------------------------------------------------------
  SISTEMA DE PUNTOS
------------------------------------------------------------

- Los puntos se acumulan durante la sesión en el contador
  "Mi progreso" visible en la página principal.
- Se reinician al recargar la página (no se persisten).
- Cada juego otorga puntos solo una vez por respuesta correcta,
  sin importar cuántas veces se pulse el mismo botón.
- Ningún juego descuenta puntos por respuestas incorrectas.

Tabla de puntos:
  Reto matemático     +10 por acierto
  Palabra misteriosa  +15 por acierto
  Memoria Conceptual  +10 por pareja + bono de +20 por eficiencia
  Alternativas        +10 por acierto
  Sinónimos exprés    +10 por acierto


------------------------------------------------------------
  RAMA DE DESARROLLO
------------------------------------------------------------

Los cambios activos se encuentran en la rama: Desarrollo
Repositorio: https://github.com/MauricioSanchez630/JuegosDePrueba


------------------------------------------------------------
  HISTORIAL DE CAMBIOS PRINCIPALES
------------------------------------------------------------

- El proyecto usa el nombre "Aula Play".
- Juego "Memoria visual" reemplazado por "Memoria Conceptual"
  con datos externos en conceptos.json.
- Juego "Curiosidades" reemplazado por "Alternativas"
  con datos externos en alternativas.json.
- Panel de administración agregado (admin.html).
- Link "Administrar" añadido a la barra de navegación.

============================================================
