# 💪 FocusBreak

## 📌 Descripción

**FocusBreak** es una extensión de Chrome diseñada para cuidar tu salud física y mental mientras trabajas frente al ordenador. Ofrece recordatorios periódicos personalizables para tomar pausas activas y un sistema de respiración guiada basado en la técnica 4-7-8, que ayuda a reducir el estrés y mejorar la concentración. Ideal para trabajadores remotos, estudiantes, programadores y cualquier persona que pase largas horas frente a la pantalla.

## ✨ Características principales

- **🔔 Recordatorios personalizables**: Configura intervalos de trabajo de 5 a 120 minutos
- **🧘 Respiración guiada 4-7-8**: Ejercicio de respiración con animación visual y sonidos guía
- **🎯 Ventana emergente automática**: Al elegir respiración guiada, se abre una ventana dedicada
- **🔊 Feedback sonoro**: Tonos específicos para cada fase de respiración (inhalación, retención, exhalación)
- **📊 Seguimiento diario**: Contador de pausas realizadas en el día
- **🎨 Animación visual**: Círculo animado que se expande y contrae siguiendo el ritmo de respiración
- **🔇 Control de sonido**: Botón para silenciar los tonos durante el ejercicio
- **💡 Consejos integrados**: Tips sobre pausas activas, ergonomía e hidratación
- **🚀 Ligera y rápida**: Permisos mínimos, sin acceso a páginas web

## 🧘 Técnica de respiración 4-7-8

| Fase | Duración | Frecuencia | Descripción |
|------|----------|------------|-------------|
| 🌬️ Inhalación | 4 segundos | 400 Hz | Inhala profundamente por la nariz |
| 🫁 Retención | 7 segundos | 600 Hz | Mantén el aire en los pulmones |
| 💨 Exhalación | 8 segundos | 300 Hz | Exhala lentamente por la boca |
| 🔄 Ciclos | 5 repeticiones | - | Total: ~1.5 minutos de ejercicio |

Esta técnica, desarrollada por el Dr. Andrew Weil, activa el sistema nervioso parasimpático, reduciendo la ansiedad y mejorando el enfoque mental.

## 📂 Estructura del proyecto

```
Extensión FocusBreak/
├── manifest.json        # Configuración Manifest V3
├── background.js        # Service Worker (alarmas, notificaciones, ventanas)
├── popup.html           # Interfaz de configuración y respiración
├── popup.js             # Lógica de UI y ejercicio de respiración
├── icon.png             # Icono de la extensión
└── README.md            
```

## 🛠️ Instalación

### Opción 1: Instalación manual (modo desarrollador)

1. Descarga esta carpeta del repositorio
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el **Modo desarrollador** (esquina superior derecha)
4. Haz clic en **Cargar extensión sin empaquetar**
5. Selecciona la carpeta `Extensión FocusBreak`
6. ¡Listo! El icono 💪 aparecerá en la barra de herramientas

### Opción 2: Descarga selectiva (Git sparse checkout)

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/pelejebre/extensiones_chrome
cd extensiones_chrome
git sparse-checkout set "Extensión FocusBreak"
```

Luego sigue los pasos 2-6 de la opción manual.

## 🎯 Uso

### 1. Configuración inicial
- Haz clic en el icono 💪 de FocusBreak en la barra de herramientas
- Configura el **intervalo de trabajo** (minutos entre pausas): 5-120 min
- Configura la **duración de descanso sugerida**: 5-30 min
- Haz clic en **▶ Activar recordatorios**

### 2. Durante el trabajo
- FocusBreak trabajará en segundo plano
- Recibirás notificaciones periódicas con mensajes motivadores
- El contador de pausas del día se actualiza automáticamente

### 3. Cuando suena la alarma
La notificación ofrece dos opciones:
- **🧘 Respiración guiada**: Abre automáticamente una ventana con el ejercicio 4-7-8
- **☕ Descanso libre**: Cierra la notificación para tomar un descanso a tu ritmo

### 4. Ejercicio de respiración
- Se abre una ventana dedicada de 420x600px
- El círculo animado guía visualmente cada fase
- Los tonos sonoros marcan el inicio de cada fase
- Puedes usar el botón 🔇 para silenciar los sonidos
- Completa 5 ciclos (~1.5 minutos) o sal antes con ❌

**Nota técnica**: Si la ventana no se abre automáticamente (limitación de Manifest V3), aparecerá una segunda notificación indicándote que hagas clic en el icono de la extensión para acceder al ejercicio.

## 💡 Casos de uso

| Perfil | Intervalo recomendado | Contexto |
|--------|----------------------|----------|
| 👨‍💻 Programador | 50-60 min | Técnica Pomodoro extendida |
| 📚 Estudiante | 30-45 min | Sesiones de estudio intensivo |
| 💼 Oficinista | 60-90 min | Trabajo de oficina estándar |
| 🎮 Gamer | 45-60 min | Prevención de fatiga visual |

## ❓ FAQ

**¿Cómo funciona el sistema de notificaciones?**
- FocusBreak usa Chrome Alarms API para programar recordatorios periódicos sin consumir recursos innecesarios.

**¿Por qué no se abre automáticamente la ventana de respiración?**
- Chrome Manifest V3 tiene restricciones de seguridad que impiden abrir popups automáticamente desde service workers. FocusBreak implementa un **sistema dual**: primero intenta abrir la ventana automáticamente y, si falla, muestra una notificación secundaria indicándote que hagas clic en el icono de la extensión.

**¿Los recordatorios funcionan si cierro el popup?**
- Sí, el service worker en background.js mantiene las alarmas activas aunque cierres el popup o reinicies el navegador.

**¿Puedo personalizar los intervalos?**
- Sí, ajusta los valores en el popup entre 5-120 minutos para trabajo y 5-30 minutos para descansos.

**¿La extensión consume muchos recursos?**
- No, usa permisos mínimos y el service worker se activa solo cuando hay alarmas programadas.

## 🔧 Solución de problemas

### Las notificaciones no aparecen
- Verifica que las notificaciones de Chrome estén habilitadas en tu sistema operativo
- Comprueba en `chrome://settings/content/notifications` que el sitio de la extensión tiene permisos

### La ventana de respiración no se abre automáticamente
- **Comportamiento esperado**: Por limitaciones de Manifest V3, no siempre es posible abrir ventanas automáticamente
- **Solución**: Cuando veas la segunda notificación "🧘 Respiración guiada lista", haz clic en el icono 💪 de FocusBreak
- La extensión detectará automáticamente que debe mostrar el ejercicio de respiración

### No se escuchan los sonidos
- Verifica que no hayas activado el botón 🔇 Silenciar
- Comprueba el volumen del sistema
- Algunos navegadores requieren interacción del usuario antes de reproducir audio (haz clic en la ventana)

## 🎨 Personalización

### Modificar intervalos
Edita los valores por defecto en `background.js` (líneas 10-12):
```javascript
workInterval: 50,  // minutos de trabajo
breakDuration: 10, // minutos de descanso
```

### Agregar mensajes de notificación
Añade frases motivadoras en `background.js` (líneas 71-80):
```javascript
const messages = [
    '💪 ¡Tu mensaje personalizado aquí!',
    // ... más mensajes
];
```

### Ajustar la técnica de respiración
Modifica las duraciones en `popup.js` (función `runBreathingCycle`, líneas ~220-250):
```javascript
// Fase 1: Inhalación (4 segundos por defecto)
// Fase 2: Retención (7 segundos por defecto)
// Fase 3: Exhalación (8 segundos por defecto)
```

### Cambiar frecuencias de sonido
Edita las llamadas a `playSound()` en `popup.js`:
```javascript
playSound(400, 500);  // Frecuencia en Hz, duración en ms
```

## 🚀 Tecnologías utilizadas

- **Chrome Extension Manifest V3**: Arquitectura moderna con service workers
- **Chrome Alarms API**: Recordatorios periódicos eficientes en recursos
- **Chrome Notifications API**: Notificaciones interactivas con botones
- **Chrome Storage API**: Persistencia de configuración local
- **Chrome Windows API**: Creación de ventanas popup programáticas
- **Web Audio API**: Generación de tonos sinusoidales en tiempo real
- **CSS3 Animations**: Transiciones suaves con `transform: scale()`
- **JavaScript Vanilla**: Sin dependencias externas, código ligero

## 🔒 Permisos

| Permiso | Justificación |
|---------|---------------|
| `alarms` | Programar recordatorios periódicos de pausas |
| `notifications` | Mostrar notificaciones con botones interactivos |
| `storage` | Guardar configuración del usuario (intervalos, contador) |
| `system.display` (opcional) | Mejorar control de ventanas emergentes |

**Privacidad**: FocusBreak **NO** accede a tus pestañas, historial de navegación ni datos personales. Toda la configuración se almacena localmente en tu navegador.

## 🛡️ Privacidad

- ✅ **Sin acceso a páginas web**: No usa permisos `tabs`, `webNavigation` ni `activeTab`
- ✅ **Almacenamiento local**: Toda la configuración queda en tu dispositivo
- ✅ **Sin conexión a internet**: No envía datos a servidores externos
- ✅ **Código abierto**: Revisa el código fuente para verificar la transparencia

## 🌐 Compatibilidad

| Navegador | Compatible | Notas |
|-----------|------------|-------|
| Chrome | ✅ | Funciona completamente |
| Edge | ✅ | Basado en Chromium |
| Brave | ✅ | Compatible con extensiones Chrome |
| Opera | ✅ | Soporta Manifest V3 |
| Firefox | ❌ | Usa Manifest V2, requiere adaptación |

**Versión mínima**: Chrome 88+ (lanzado en enero 2021)

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar FocusBreak:

1. Haz **fork** del repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios y haz commit
4. Sube los cambios
5. Abre un **Pull Request** describiendo tus mejoras

### Ideas para contribuir
- 🌍 Traducciones a otros idiomas
- 🎵 Nuevos patrones de sonido (música ambiental, naturaleza)
- 🧘 Técnicas de respiración alternativas (Box Breathing, Wim Hof)
- 📊 Gráficos de estadísticas (pausas por semana, productividad)
- 🎨 Temas visuales (modo oscuro, colores personalizables)


## 📄 Licencia

Este proyecto es código abierto y se distribuye bajo la **Licencia MIT**. Puedes usar, modificar y distribuir libremente la extensión, incluso con fines comerciales, siempre que mantengas el aviso de copyright original.

## 👨‍💻 Autor

**pelejebre**  
GitHub: [@pelejebre](https://github.com/pelejebre)

---

## 🌟 ¿Te gusta el proyecto?

Si FocusBreak te ayuda a cuidar tu salud mientras trabajas, ¡dale una ⭐ al repositorio!  
Tu apoyo motiva el desarrollo de más funcionalidades.

**¡Cuida tu salud, un descanso a la vez! 💪🧘**
