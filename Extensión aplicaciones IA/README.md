# 🤖 Extensión Aplicaciones IA

## 📌 Descripción

Extensión de Chrome que proporciona acceso rápido y directo a las principales aplicaciones de inteligencia artificial desde tu navegador. Con un solo clic, accede a ChatGPT, Gemini, Google AI Studio, NotebookLM y Perplexity.

## ✨ Características

- **Acceso rápido**: Un solo clic para abrir cualquier herramienta de IA
- **Interfaz intuitiva**: Diseño moderno con tarjetas visuales para cada aplicación
- **Efectos visuales**: Animaciones hover para una mejor experiencia de usuario
- **Fondo personalizado**: Interfaz atractiva con imagen de fondo temática de IA
- **Optimizado**: Lightweight y rápido, sin afectar el rendimiento del navegador

## 🚀 Aplicaciones Incluidas

| Aplicación | Descripción | URL |
|------------|-------------|-----|
| **ChatGPT** | Asistente de IA conversacional de OpenAI | <https://chatgpt.com> |
| **Gemini** | IA conversacional de Google | <https://gemini.google.com> |
| **Google AI Studio** | Plataforma de desarrollo de IA de Google | <https://aistudio.google.com> |
| **NotebookLM** | Asistente de investigación y escritura de Google | <https://notebooklm.google.com> |
| **Perplexity** | Motor de búsqueda con IA | <https://www.perplexity.ai> |

## 📂 Estructura del Proyecto

```text
Extensión aplicaciones IA/
├── manifest.json          # Configuración de la extensión
├── popup.html             # Interfaz de usuario principal
├── popup.js               # Lógica de interacción
├── icon48.png             # Icono de la extensión
├── images/                # Recursos gráficos
│   ├── ...
└── README.md              
```

## 🛠️ Instalación

### Instalación Manual (Desarrollador)

1. **Descargar**: Clona o descarga este repositorio

   ```bash
   git clone https://github.com/pelejebre/extensiones_chrome.git
   cd "extensiones_chrome/Extensión aplicaciones IA"
   ```

2. **Abrir Chrome**: Ve a `chrome://extensions/`

3. **Modo Desarrollador**: Activa el "Modo de desarrollador" en la esquina superior derecha

4. **Cargar Extensión**: Haz clic en "Cargar extensión sin empaquetar" y selecciona la carpeta de la extensión

5. **¡Listo!**: La extensión aparecerá en tu barra de herramientas

## 🎯 Uso

1. **Clic en el icono**: Haz clic en el icono de la extensión en la barra de herramientas de Chrome
2. **Selecciona aplicación**: Elige la aplicación de IA que deseas usar
3. **Acceso directo**: Se abrirá una nueva pestaña con la aplicación seleccionada

## 🔧 Personalización

### Agregar Nueva Aplicación IA

Para agregar una nueva aplicación de IA:

1. **Agregar imagen**: Coloca el logo en la carpeta `images/`
2. **Modificar HTML**: Añade un nuevo botón en `popup.html`:

   ```html
   <button class="ai-card nueva-app" data-url="https://nueva-app.com">
       <img src="images/_nueva_app.png" alt="Nueva App">
   </button>
   ```

3. **Actualizar CSS**: Añade estilos personalizados en `popup.html`

### Cambiar Fondo

Reemplaza `images/_background.jpg` con tu imagen preferida (recomendado: 600x400px)

## 🎨 Tecnologías Utilizadas

- **HTML5**: Estructura de la interfaz
- **CSS3**: Estilos y animaciones (Grid Layout, Flexbox, Transitions)
- **JavaScript**: Lógica de interacción y Chrome Extension APIs
- **Chrome Extension Manifest V3**: Configuración moderna de extensiones

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas:

- Agregar nuevas aplicaciones de IA
- Mejorar el diseño
- Optimizar el código
- Reportar bugs

Por favor:

1. Fork el repositorio
2. Crea una branch para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la branch (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Changelog

### v1.0.0

- ✨ Lanzamiento inicial
- 🎯 Acceso rápido a 5 aplicaciones principales de IA
- 🎨 Interfaz moderna con efectos hover

## 📄 Licencia

Este proyecto es **código abierto** y de **uso completamente libre**. Puedes:

- ✅ **Usar** la extensión para cualquier propósito
- ✅ **Modificar** el código según tus necesidades
- ✅ **Distribuir** copias del proyecto
- ✅ **Crear derivados** y mejoras
- ✅ **Uso comercial** sin restricciones

**No se requiere atribución**, aunque se agradece. Este proyecto está disponible bajo la **Licencia MIT**, lo que garantiza máxima libertad de uso.

## 👨‍💻 Autor

**pelejebre** - [GitHub](https://github.com/pelejebre)

## 🌟 ¿Te gusta el proyecto?

Si esta extensión te resulta útil, ¡dale una estrella ⭐ al repositorio!