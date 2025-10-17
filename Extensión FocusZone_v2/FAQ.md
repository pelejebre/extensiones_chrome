# 🍅 FocusZone v2 - Pomodoro.

## ❓ FAQ. Preguntas frecuentes

### ¿Qué pasa si cierro el popup?

El temporizador **sigue corriendo** en segundo plano. Los sitios seguirán bloqueados y el tracking continuará hasta que termine la sesión o lo pauses manualmente.

### ¿Puedo usar FocusZone v2 en modo incógnito?

Sí, pero debes activarlo manualmente:

1. Ve a `chrome://extensions/`
2. Busca FocusZone v2
3. Haz clic en "Detalles"
4. Activa "Permitir en modo incógnito"

**Nota**: Los datos no se sincronizan entre ventanas normales e incógnito.

### ¿Funciona con otros navegadores?

Solo Chrome y navegadores basados en Chromium (Microsoft Edge, Brave, Opera, Vivaldi).

### ¿Los sitios se bloquean si pauso el timer?

No. Solo se bloquean cuando el timer está **activo** y en **modo trabajo**. Durante pausas y descansos, todos los sitios están disponibles.

### ¿Puedo eliminar sitios de la lista predeterminada?

Sí. Simplemente haz clic en "Eliminar" junto al sitio que no quieras bloquear. La lista es completamente personalizable.

### ¿Cómo agrego sitios con subdominios?

Solo escribe el dominio principal. Por ejemplo:

- Escribir `reddit.com` bloqueará todas las páginas de Reddit
- No necesitas agregar `www.reddit.com` por separado
- El sistema genera 4 patrones automáticamente para bloqueo efectivo

### ¿El tracking registra qué páginas visito exactamente?

**No**. Solo registra el **dominio** (ej: `github.com`) y el **tiempo total**, nunca las URLs completas ni el contenido. Tu privacidad está protegida.

### ¿Puedo recuperar el historial después de limpiarlo?

**No**. La acción de limpiar historial es **permanente e irreversible**. Asegúrate de exportar tus datos antes si los necesitas.

### ¿Por qué algunos sitios no se bloquean?

Verifica:

1. ¿El timer está **iniciado**? (no pausado)
2. ¿Está en **modo trabajo**? (no descanso)
3. ¿El sitio está en la lista de bloqueados?
4. ¿Recargaste la extensión después de agregar el sitio?

Consulta **Solución de problemas** más abajo para más detalles.