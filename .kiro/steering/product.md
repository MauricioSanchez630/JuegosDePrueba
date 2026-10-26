# Producto

**Aula Play** es una plataforma educativa web para aprender jugando, dirigida a estudiantes de educación básica (cursos 1.º a 8.º).

## Qué ofrece

- Página principal con un selector de curso y tarjetas que enlazan a cada juego.
- Ocho juegos independientes: Reto matemático, Palabra misteriosa, Memoria Conceptual, Alternativas, Sinónimos exprés, Desafío sorpresa, Match (imagen y concepto) y Verdadero o Falso.
- Un sistema de puntos compartido entre todas las páginas que premia respuestas correctas (nunca descuenta).
- Un panel de administración (`admin.html`) para activar o desactivar juegos por navegador.
- Un editor de contenido (`Editor_json.html`) para gestionar los datos de los juegos.

## Principios de experiencia

- Interfaz en **español**, con tono cercano y motivador para niños.
- Refuerzo positivo: cada acierto suma puntos, los errores solo dan retroalimentación educativa.
- Contenido editable sin tocar código: los datos de los juegos viven en archivos JSON.
- Sin cuentas ni backend: la configuración y el progreso se guardan en `localStorage` del navegador.
