# 🎮 Boing - Juegos Educativos para Niños

Juegos simples pero efectivos para desarrollar habilidades básicas en niños a partir de 3 años. Minimalista, colorido y accesible en móviles y tablets.

## 🎯 Características

- **6 juegos diferentes**, cada uno enfocado en una habilidad:
  - 🧠 **Memoria**: Encuentra pares (reconocimiento visual)
  - 🎨 **Colores**: Empareja colores (discriminación cromática)
  - 🧩 **Puzzle**: Arma piezas (motricidad fina)
  - ✏️ **Líneas**: Sigue caminos (control motor)
  - 🔊 **Sonidos**: Identifica animales (discriminación auditiva)
  - 🔢 **Números**: Cuenta objetos (conteo básico)

- **Completamente libre**: Sin login, sin tracking, sin microtransacciones
- **Mobile-first**: Optimizado para móviles y tablets
- **Mascota principal**: Boing acompaña al niño en su aprendizaje
- **Colores vibrantes**: Diseño atractivo para pequeños

## 🚀 Tech Stack

- **Frontend**: Vanilla JavaScript (sin dependencias)
- **Estilos**: CSS3 puro
- **Canvas**: Para el juego de líneas
- **Web Audio API**: Para los sonidos del juego de animales

## 📁 Estructura del Proyecto

```
boing-games/
├── src/
│   ├── index.html              # HTML principal
│   ├── css/
│   │   └── styles.css          # Todos los estilos
│   └── js/
│       ├── main.js             # Lógica de navegación
│       └── games/
│           ├── memory.js       # Juego de memoria
│           ├── colors.js       # Juego de colores
│           ├── puzzle.js       # Juego de puzzle
│           ├── lines.js        # Juego de líneas
│           ├── sounds.js       # Juego de sonidos
│           └── numbers.js      # Juego de números
├── netlify.toml                # Configuración de Netlify
├── package.json                # Metadata del proyecto
├── .gitignore                  # Archivos a ignorar
└── README.md                   # Este archivo
```

## 🏃 Cómo ejecutar localmente

### Opción 1: Con HTTP Server (recomendado)

```bash
npm run dev
# Abre http://localhost:8000
```

### Opción 2: Directamente con navegador

Abre `src/index.html` en el navegador (algunos juegos que usan APIs pueden no funcionar).

## 📦 Desplegar en Netlify

### Opción 1: Desde GitHub (automático)

1. Sube este repo a GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Boing games MVP"
git remote add origin https://github.com/VAlonsoVillalon/boing-games.git
git push -u origin main
```

2. En Netlify:
   - Conecta tu repo de GitHub
   - Build command: dejar vacío o `npm run build`
   - Publish directory: `src`
   - Deploy

### Opción 2: Desplegar manualmente

```bash
npm run build
# Sube la carpeta `src/` a Netlify Drop
```

## 💰 Monetización

### Google AdSense

Para agregar publicidades:

1. Obtén tu código de Google AdSense
2. En `src/index.html`, descomenta y reemplaza:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"></script>
```

3. Agrega bloques de anuncios en lugares estratégicos (entre juegos, parte inferior, etc.)

## 🎮 Cómo jugar

1. Selecciona un juego desde el menú principal
2. Sigue las instrucciones del juego
3. ¡Gana y vuelve a intentar!

Cada juego tiene mecánicas simples pero educativas:
- **Memoria**: Voltea tarjetas para encontrar pares
- **Colores**: Selecciona dos elementos del mismo color
- **Puzzle**: Arrastra piezas a sus posiciones correctas
- **Líneas**: Dibuja siguiendo la línea punteada (requiere ratón/táctil)
- **Sonidos**: Escucha y toca el animal correcto
- **Números**: Selecciona el número que corresponde a la cantidad

## 🔧 Personalización

### Cambiar mascota

Edita el SVG en `src/index.html` (sección `<svg class="mascot">`).

### Cambiar colores

Busca los hex codes en `src/css/styles.css` y `src/index.html` (ej: `#FF6B9D`, `#00D4FF`, etc.).

### Agregar más juegos

1. Crea `src/js/games/new-game.js` con:
   - Función `initNewGameGame()`
   - Lógica del juego
2. Importa en `src/index.html`
3. Agrega tarjeta en el grid de juegos
4. Agrega pantalla `<div id="newgameScreen">` en HTML

## 📊 Próximas mejoras

- [ ] Progresión de dificultad
- [ ] Gamificación light (stickers al completar)
- [ ] Soporte para múltiples idiomas
- [ ] Sonidos/música de fondo
- [ ] Juegos adicionales (letras, formas, etc.)

## 📝 Notas de desarrollo

- Los juegos son completamente offline-first
- No hay servidor backend (todo es frontend)
- Compatible con navegadores modernos (Chrome, Safari, Firefox, Edge)
- Optimizado para pantallas táctiles

## 🐛 Reporte de bugs

Abre un issue en GitHub si encuentras algún problema.

## 📄 Licencia

MIT - Siéntete libre de usar, modificar y distribuir.

---

**Made with ❤️ for little explorers**
