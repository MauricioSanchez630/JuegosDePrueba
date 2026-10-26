# Tecnología

## Stack

- **HTML, CSS y JavaScript puro (vanilla).** Sin frameworks, sin bundler, sin dependencias externas.
- Sin sistema de build ni paso de compilación. Los archivos se sirven tal cual.
- Persistencia mediante `localStorage` del navegador (puntuación y configuración de juegos).
- Los datos de los juegos se cargan desde archivos **JSON** con `fetch()`.
- Pensado para desplegarse en **GitHub Pages** o cualquier servidor web estático.

## Requisito importante

Como los juegos usan `fetch()` para leer JSON, las páginas **deben servirse por HTTP/HTTPS**. Abrir los `.html` directamente con `file://` rompe la carga de datos.

## Comandos comunes

No hay build, test ni compilación. El flujo es servir los archivos estáticos:

```bash
# Servidor local con Python
python -m http.server 8080
```

También se puede usar la extensión **Live Server** de VS Code para desarrollo local.

No existen linters, suites de test ni scripts de npm en el proyecto.

## Codificación de archivos

- Todos los archivos generados o modificados deben guardarse en **UTF-8 sin BOM**.
- Las terminaciones de línea deben ser **CRLF** (`\r\n`).
- Esto aplica a todo tipo de archivo del proyecto: `.html`, `.css`, `.js`, `.json`, etc.
- No añadir marca de orden de bytes (BOM) al inicio del archivo: rompe el parseo de JSON y puede causar caracteres extraños al servir por HTTP.

## Convenciones de código

- Todo el texto de interfaz y comentarios está en **español**.
- Entidades HTML para caracteres acentuados en los `.html` (p. ej. `&aacute;`, `&iexcl;`).
- `js/comun.js` define utilidades compartidas que todos los juegos reutilizan:
  - `$(id)` → atajo de `document.getElementById`.
  - `rand(min, max)` → entero aleatorio inclusivo.
  - `escHtml(str)` → escapa HTML; **úsalo siempre** al insertar datos de JSON en el DOM.
  - `addPoints(n)` / `getPoints()` / `setPoints(n)` / `renderScore()` → sistema de puntos (clave `aulaplay_score`).
- Cada juego usa un prefijo propio para sus funciones y estado global (p. ej. `vf`, `vfAnswer`, `startVF`).
- Validar siempre los datos JSON antes de usarlos: descartar entradas inválidas sin romper el juego, y mostrar un error claro si el `fetch` falla.
- Los puntos solo se otorgan una vez por respuesta correcta (usar un `Set` de IDs ya puntuados).
