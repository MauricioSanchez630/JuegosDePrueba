# Estructura del proyecto

Arquitectura de **páginas independientes por juego**: cada juego tiene su propia página HTML y su propio archivo JS, que comparten estilos y utilidades comunes.

```
JuegosDePrueba/
├── index.html              Página principal: selector de curso y tarjetas de juego
├── admin.html              Panel para activar/desactivar juegos (localStorage)
├── Editor_json.html        Editor de contenido de los juegos
├── readme.txt              Documentación del proyecto (en español)
├── css/
│   └── styles.css          Hoja de estilos común a todas las páginas
├── js/
│   ├── comun.js            Utilidades compartidas ($, rand, escHtml, puntuación)
│   └── <juego>.js          Lógica de cada juego (un archivo por juego)
├── juegos/
│   └── <juego>.html        Página independiente de cada juego
├── datos/
│   ├── VF<curso>.json      Preguntas de Verdadero o Falso, una por curso (primero..octavo)
│   ├── ALT<curso>.json     Preguntas de Alternativas, una por curso (primero..octavo)
│   └── MC<curso>.json      Parejas de Memoria Conceptual, una por curso (primero..octavo)
├── conceptos-imagenes.json Datos de Match (imagen ↔ concepto)
└── imagenes/
    └── *.svg               Imágenes del juego Match
```

## Emparejamiento página ↔ lógica

Cada `juegos/<juego>.html` incluye `../js/comun.js` y luego `../js/<juego>.js`:

| Página                           | Lógica                     |
|----------------------------------|----------------------------|
| `juegos/reto-matematico.html`    | `js/reto-matematico.js`    |
| `juegos/palabra-misteriosa.html` | `js/palabra-misteriosa.js` |
| `juegos/memoria-conceptual.html` | `js/memoria-conceptual.js` |
| `juegos/alternativas.html`       | `js/alternativas.js`       |
| `juegos/sinonimos.html`          | `js/sinonimos.js`          |
| `juegos/desafio-sorpresa.html`   | `js/desafio-sorpresa.js`   |
| `juegos/match.html`              | `js/match.js`              |
| `juegos/verdadero-falso.html`    | `js/verdadero-falso.js`    |

## Reglas de rutas

- Desde `index.html` (raíz): rutas directas → `css/styles.css`, `js/comun.js`, `juegos/<juego>.html`.
- Desde `juegos/*.html` (subcarpeta): usar `../` → `../css/styles.css`, `../js/comun.js`.
- Los `fetch` de datos desde los juegos usan `../` → `../datos/VF<curso>.json`, `../datos/ALT<curso>.json`, `../datos/MC<curso>.json`.
- **Juegos dependientes del curso** (Verdadero o Falso, Alternativas, Memoria Conceptual): el curso se elige en `index.html`, se guarda en `localStorage` (clave `aulaplay_curso`) y se propaga a la página del juego vía el parámetro de URL `?curso=`. El juego lo resuelve con `getCursoSeleccionado()` de `comun.js`; no deben tener selector de curso propio.
- Las imágenes de Match se sirven desde `../imagenes/`; el nombre en el JSON debe coincidir **exactamente** con el archivo (mayúsculas, acentos y extensión incluidos).

## Dónde va cada cosa

- **Nuevo juego:** añade `juegos/<juego>.html` + `js/<juego>.js`, enlaza una tarjeta con `data-game-id` en `index.html`, y carga primero `comun.js`.
- **Nuevo contenido:** edita el JSON correspondiente; no hace falta tocar HTML ni JS.
- **Estilos:** todo en `css/styles.css` (compartido); no hay CSS por página.
