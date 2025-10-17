# 🍅 FocusZone v2 - Pomodoro + Tracking + Bloqueo

<p align="center">
  <table>
    <tr>
      <td><img src="Images/Menu_01.png" alt="Menu_01" width="300" /></td>
      <td><img src="Images/Menu_02.png" alt="Menu_02" width="300" /></td>
      <td><img src="Images/Menu_03.png" alt="Menu_03" width="300" /></td>
      <td><img src="Images/Menu_04.png" alt="Menu_04" width="300" /></td>
    </tr>
  </table>
</p>

**FocusZone v2** es una extensión de Chrome que combina un temporizador Pomodoro profesional con tracking automático de tiempo y bloqueo inteligente de sitios. Mantén tu concentración bloqueando distracciones mientras registras automáticamente en qué sitios trabajas, generando estadísticas detalladas de tu productividad.

## 🎯 ¿Qué es FocusZone v2?

FocusZone v2 es tu asistente de productividad definitivo, que une tres funcionalidades clave en una sola extensión:

1. **Temporizador Pomodoro** - Trabaja en intervalos de tiempo enfocado (25 minutos) seguidos de descansos (5 minutos)
2. **Tracking automático** - Registra exactamente cuánto tiempo dedicas a cada sitio web durante tus sesiones
3. **Bloqueo inteligente** - Bloquea automáticamente sitios distractores solo durante el trabajo (no durante descansos)

### ¿Cómo funciona?

1. **Inicias una sesión de enfoque** de 25 minutos (o tu duración personalizada)
2. **Durante esos 25 minutos**:
   - FocusZone v2 bloquea automáticamente sitios web que te distraen (YouTube, redes sociales, etc.)
   - El sistema registra automáticamente el tiempo que pasas en cada dominio de trabajo
   - Si intentas visitar un sitio bloqueado, verás una **página motivacional** elegante
3. Al completar los 25 minutos, recibes una **notificación** y comienza un descanso de 5 minutos
4. **Durante el descanso**:
   - Todos los sitios están disponibles - relájate sin restricciones
   - El tracking se pausa automáticamente - tu descanso es privado
5. Consulta tus **estadísticas** para ver dónde inviertes tu tiempo y exporta los datos

## ✨ Características

### ⏱️ Temporizador Pomodoro completo

- **Timer profesional** con inicio, pausa, reanudación y detención
- **Countdown en tiempo real** visible en el icono de la extensión (badge)
- **Notificaciones del sistema** al completar cada Pomodoro
- **Cambio automático** a períodos de descanso
- **Contador diario** de Pomodoros completados
- **Tiempos configurables** - personaliza según tus necesidades

### 📊 Tracking automático inteligente

- **Detección automática** del dominio de la pestaña activa durante Pomodoros
- **Registro preciso** de tiempo por dominio y fecha
- **Solo pestañas activas** - no registra tiempo en pestañas de fondo
- **Solo durante trabajo** - no trackea durante descansos (tu descanso es privado)
- **Almacenamiento local** - tus datos permanecen privados en tu dispositivo
- **Sin intervención manual** - todo funciona en segundo plano

### 📈 Estadísticas y análisis

- **Filtros temporales**: vista de hoy o últimos 7 días
- **Top 10 dominios** ordenados por tiempo invertido
- **Formato legible** - horas y minutos calculados automáticamente
- **Visualización clara** - ve exactamente dónde pasas tu tiempo
- **Estado vacío informativo** cuando no hay datos disponibles

### 💾 Exportación de datos

- **Formato CSV** - ideal para análisis en Excel o Google Sheets
- **Formato JSON** - perfecto para procesamiento programático
- **Descarga automática** con un solo clic
- **Historial completo** incluye tracking y Pomodoros completados
- **Compatible** con herramientas de análisis de datos

### 🚫 Bloqueo inteligente de sitios

- **Bloqueo automático** durante sesiones de trabajo activas
- **11 sitios por defecto** bloqueados (YouTube, Twitter, Instagram, Facebook, Reddit, etc.)
- **Lista completamente personalizable** - agrega o elimina sitios según tus necesidades
- **Página de bloqueo elegante** con mensaje motivacional
- **Desbloqueo automático** durante descansos y pausas
- **4 patrones por sitio** - bloqueo efectivo con y sin www

### ⚙️ Configuración flexible

- **Duración de trabajo** configurable (1-120 minutos, default: 25)
- **Duración de descanso** configurable (1-60 minutos, default: 5)
- **Descanso largo** configurable (1-60 minutos, default: 15)
- **Pomodoros hasta descanso largo** (2-10, default: 4)
- **Persistencia automática** - tu configuración se guarda localmente
- **Actualización en vivo** - los cambios se aplican inmediatamente

### 🎨 Interfaz moderna e intuitiva

- **4 tabs organizadas**: Timer, Estadísticas, Configuración e Info
- **Diseño responsive** optimizado para popup de extensión
- **Estados visuales claros** - activo, pausado, descanso
- **Animaciones suaves** en transiciones
- **Mensajes de estado** con feedback instantáneo
- **Gradientes modernos** y diseño limpio

## 📂 Estructura del proyecto

```
FocusZone_v2/
├── manifest.json        # Configuración Manifest V3
├── background.js        # Service worker con lógica de timer y tracking
├── popup.html           # Interfaz visual del popup
├── popup.js             # Lógica de interacción del UI
├── styles.css           # Diseños y estilos visuales
├── blocked.html         # Página de bloqueo de sitios
├── icon.png             
├── README.md            
```

## 🚀 Instalación

### Opción 1: Instalación manual (modo desarrollador)

1. **Descarga** esta carpeta o clona el repositorio
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el **Modo desarrollador** (switch en esquina superior derecha)
4. Haz clic en **Cargar extensión sin empaquetar**
5. Selecciona la carpeta `Extensión FocusZone_v2`
6. ¡Listo! El icono ⏱️ aparecerá en la barra de herramientas

### Opción 2: Descarga selectiva (Git sparse checkout)

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/pelejebre/extensiones_chrome.git
cd extensiones_chrome
git sparse-checkout set "Extensión FocusZone_v2"
```

## 📖 Cómo usar

### Configuración inicial

1. **Configura los tiempos**: Por defecto son 25 min de trabajo y 5 de descanso
   - Puedes cambiarlos en la tab "⚙️ Config"
   
2. **Personaliza sitios bloqueados**:
   - La extensión incluye 11 sitios comunes ya bloqueados
   - Agrega nuevos sitios escribiendo el dominio (ej: `discord.com`) y clic en "+ Agregar"
   - Elimina sitios que no quieras bloquear con el botón "Eliminar"

### Usar el temporizador

1. **Iniciar sesión**: Haz clic en el botón **"▶️ Iniciar"**
   - El timer comienza la cuenta regresiva
   - El estado cambia a "🎯 En Progreso"
   - Los sitios bloqueados ya no serán accesibles
   - El badge del icono muestra el tiempo restante
   
2. **Durante la sesión**:
   - El timer cuenta regresivamente en tiempo real
   - Tu dominio actual se registra automáticamente
   - Si cambias de pestaña, el tracking cambia al nuevo dominio
   - Si intentas visitar un sitio bloqueado, verás una página de aviso motivacional
   - Puedes pausar en cualquier momento con **"⏸️ Pausar"**
   
3. **Completar la sesión**:
   - Al terminar, recibirás una notificación: "🎉 ¡Pomodoro completado!"
   - El modo cambiará automáticamente a "☕ Descanso"
   - Durante el descanso, todos los sitios están disponibles
   - El tracking se pausa durante el descanso
   
4. **Reanudar/Detener**:
   - **"▶️ Reanudar"**: Continúa desde donde lo dejaste (al pausar)
   - **"⏹️ Detener"**: Cancela el Pomodoro actual (requiere confirmación)

### Ver estadísticas

1. Abre la tab **📊 Stats**
2. Selecciona filtro:
   - **"Hoy"**: Muestra solo el tracking de hoy
   - **"Esta Semana"**: Muestra los últimos 7 días
3. Verás una lista del **Top 10 dominios** con el tiempo invertido
4. Formato: `github.com: 2h 35m` (horas y minutos)
5. Los dominios se ordenan automáticamente por tiempo (mayor a menor)

### Exportar datos

1. En la tab **Stats**, haz clic en:
   - **"📄 Exportar CSV"**: Descarga archivo .csv para Excel/Sheets
   - **"📦 Exportar JSON"**: Descarga archivo .json para análisis programático
2. El archivo incluye:
   - Historial completo de tracking (dominio, tiempo, fecha)
   - Historial de Pomodoros completados (fecha, hora)
3. Los datos se descargan automáticamente

### Limpiar historial

1. En la tab **Stats**, haz clic en **"🗑️ Limpiar historial"**
2. Confirma la acción en el diálogo
3. Se eliminan:
   - Todo el historial de tracking
   - Todo el historial de Pomodoros
4. **Advertencia**: Esta acción no se puede deshacer

### Personalizar configuración

1. Abre la tab **⚙️ Config**
2. **Ajusta las duraciones**:
   - **Duración de trabajo**: 1-120 minutos (default: 25)
   - **Duración de descanso**: 1-60 minutos (default: 5)
   - **Descanso largo**: 1-60 minutos (default: 15)
   - **Pomodoros hasta descanso largo**: 2-10 (default: 4)
3. Haz clic en **"💾 Guardar configuración"**
4. Verás mensaje de confirmación: "✅ Configuración guardada"
5. **Los cambios se aplican inmediatamente** al display del timer
6. **Nota**: Si el timer está corriendo, los cambios se aplicarán al próximo Pomodoro

### Gestionar sitios bloqueados

1. En la tab **⚙️ Config**, baja hasta "🚫 Sitios bloqueados"
2. **Agregar sitio**:
   - Escribe el dominio en el input (ej: `facebook.com`)
   - Haz clic en **"+ Agregar"**
   - El sitio aparece en la lista inmediatamente
   - Se bloqueará automáticamente en la próxima sesión
3. **Eliminar sitio**:
   - Haz clic en **"Eliminar"** junto al sitio que quieras permitir
   - El sitio desaparece de la lista
   - Ya no se bloqueará en futuras sesiones
4. **Importante**: Solo escribe el dominio principal (sin `www.` ni `https://`)

### Página de bloqueo

Cuando intentas acceder a un sitio bloqueado durante el modo enfoque, verás:

- 🚫 Ícono de bloqueo grande
- Título: "Sitio Bloqueado"
- Mensaje: "Estás en una sesión Pomodoro activa..."
- Nombre del sitio bloqueado
- Frase motivacional
- Diseño elegante con gradiente morado

**Sitios bloqueados por defecto:**

- `youtube.com` - Videos
- `twitter.com` / `x.com` - Redes sociales
- `instagram.com` - Redes sociales
- `facebook.com` - Redes sociales
- `gmail.com` / `mail.google.com` - Email


## ⚙️ Permisos requeridos

- **storage**: Guardar configuración, historial y estadísticas
- **tabs**: Detectar pestaña activa para tracking
- **webNavigation**: Interceptar navegación a sitios bloqueados
- **declarativeNetRequest**: Bloquear sitios dinámicamente
- **notifications**: Mostrar alertas al completar sesiones
- **alarms**: Mantener el service worker activo
- **host_permissions** (`<all_urls>`): Necesario para bloquear cualquier sitio

## 🔧 Casos de uso

### Estudiante universitario

```
1. Configura 50 minutos de trabajo, 10 de descanso
2. Agrega Discord y Telegram a los sitios bloqueados
3. Inicia sesión antes de estudiar para el examen
4. Mantén el foco durante 50 minutos sin distracciones
5. Revisa tus estadísticas para ver qué sitios educativos usaste más
```

### Desarrollador en home office

```
1. Usa los 25 minutos estándar
2. Bloquea email (gmail.com) durante sesiones de código
3. Trabaja 2-3 sesiones Pomodoro seguidas con descansos
4. Revisa emails solo durante los descansos
5. Exporta tu tracking para ver tiempo en GitHub, StackOverflow, docs, etc.
```

### Freelancer con múltiples proyectos

```
1. Trabaja en sesiones de 25 minutos por proyecto
2. Usa las estadísticas para facturar clientes
3. Exporta datos CSV para informes de tiempo
4. Analiza qué herramientas/sitios usas más por proyecto
5. Bloquea redes sociales durante horas facturables
```

### Escritor/creativo

```
1. Configura sesiones largas (60-90 minutos)
2. Bloquea redes sociales y sitios de noticias
3. Escribe sin interrupciones
4. Descansa 15 minutos para recargar creatividad
5. Registra tiempo en Google Docs, Notion, etc. automáticamente
```

---

## 💡 Consejos de productividad

### Técnica Pomodoro efectiva

1. **Planifica antes**: Decide qué vas a hacer en cada sesión antes de empezar
2. **Sin multitarea**: Una tarea por sesión Pomodoro
3. **Respeta los descansos**: Son parte esencial del método, no los saltes
4. **4 sesiones = descanso largo**: Después de 4 Pomodoros, toma 15-30 minutos
5. **Elimina distracciones físicas**: No solo digitales (teléfono en modo avión, etc.)

### Mejora tu foco

- **Mañanas**: Sesiones más largas (50 min) para tareas difíciles que requieren concentración profunda
- **Tardes**: Sesiones estándar (25 min) para tareas rutinarias y administrativas
- **Personaliza la lista**: Bloquea SOLO los sitios que realmente te distraen a ti
- **Usa las estadísticas**: Analiza dónde pasas tu tiempo y ajusta tu flujo de trabajo
- **Celebra las sesiones**: Cada Pomodoro completado es un logro

### Maximiza el tracking

- **Trabaja en una sola pestaña**: Cambia de pestaña solo cuando cambies de tarea
- **Usa los datos**: Exporta CSV semanalmente para análisis de productividad
- **Identifica patrones**: ¿En qué sitios eres más productivo? ¿Cuáles te distraen?
- **Factura con precisión**: Usa el tracking para justificar horas trabajadas (freelancers)

---

## 📝 Versión

**Versión 1.0** - Octubre 2025

### Novedades de v2 vs v1

- ✨ **Tracking automático** de tiempo por dominio
- 📊 **Estadísticas** con filtros temporales (hoy/semana)
- 💾 **Exportación** de datos (CSV y JSON)
- 🚀 **Sistema de bloqueo mejorado** con declarativeNetRequest API (44 reglas)
- ⚙️ **Actualización de config en vivo** - los cambios se aplican inmediatamente
- 🎨 **4 tabs** organizadas (Timer, Stats, Config, Info)
- 📱 **Badge dinámico** con cuenta regresiva
- 🔒 **Mayor privacidad** - solo registra dominios, nunca URLs completas

## 👨‍💻 Autor

**pelejebre**

- GitHub: [@pelejebre](https://github.com/pelejebre)
- Repositorio: [extensiones_chrome](https://github.com/pelejebre/extensiones_chrome)

## 🙏 Créditos

- Basado en la **Técnica Pomodoro** de Francesco Cirillo
- Diseño inspirado en herramientas modernas de productividad

---

## 🌟 ¿Te gusta el proyecto?

Si FocusZone v2 te resulta útil:

- ⭐ **Dale una estrella** al repositorio
- 🐛 **Reporta bugs** en Issues
- 💡 **Sugiere features** que te gustaría ver
- 🤝 **Contribuye** con código o documentación
- 📣 **Comparte** con otros desarrolladores y usuarios

---

**¡Aumenta tu productividad, trackea tu tiempo y mantén el foco con FocusZone v2! ⏱️✨**
