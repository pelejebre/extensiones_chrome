# 🍅 FocusZone v2 - Pomodoro.

## 🐛 Solución de problemas

### Los sitios no se bloquean

**Verifica:**

1. ¿El timer está **iniciado**? (botón debe decir "Pausar", no "Iniciar")
2. ¿El estado dice "🎯 En Progreso"? (si dice "Descanso", no bloquea)
3. ¿El sitio está en la lista de bloqueados en la tab Config?
4. ¿El badge del icono muestra el tiempo? (confirma que el timer está activo)

**Soluciones:**

1. **Recarga la extensión**:
   - Ve a `chrome://extensions/`
   - Busca FocusZone v2
   - Haz clic en 🔄 **Recargar**

2. **Verifica los permisos**:
   - En `chrome://extensions/`, haz clic en "Detalles"
   - Asegúrate de que tenga todos los permisos necesarios

3. **Revisa la consola del service worker**:
   - En `chrome://extensions/`, haz clic en "service worker"
   - Busca mensajes como "✅ Reglas de bloqueo ACTIVADAS"

4. **Cierra pestañas y abre nuevas**:
   - Las reglas se aplican a navegaciones nuevas
   - Cierra la pestaña del sitio bloqueado y ábrela de nuevo

### No aparecen notificaciones

1. Ve a **Configuración de Chrome** → Privacidad y seguridad → Notificaciones
2. Asegúrate de que Chrome puede mostrar notificaciones
3. Busca "FocusZone v2" y permite las notificaciones
4. En Windows, también verifica la configuración del sistema

### El timer se detiene solo o no actualiza

El service worker de Chrome puede pausarse. Para verificar:

1. Ve a `chrome://extensions/`
2. Busca FocusZone v2
3. Haz clic en "service worker"
4. Revisa la consola por errores
5. Si está inactivo, haz clic para reactivarlo

**Solución permanente**: Los alarms de Chrome mantienen el service worker activo automáticamente.

### Las estadísticas no se actualizan

**Verifica:**

1. ¿Completaste al menos un Pomodoro?
2. ¿El tracking estaba activo durante la sesión?
3. ¿La pestaña estaba activa (no en segundo plano)?

**Soluciones:**

1. Refresca el popup (cierra y abre de nuevo)
2. Cambia entre filtros "Hoy" y "Esta Semana"
3. Verifica el storage desde el service worker console:
   ```javascript
   chrome.storage.local.get(['timeTracking'], (result) => {
     console.log(result.timeTracking);
   });
   ```

### La configuración no se guarda

**Verifica:**

1. ¿Hiciste clic en "💾 Guardar configuración"?
2. ¿Viste el mensaje "✅ Configuración guardada"?
3. ¿Los valores están en el rango permitido?

**Soluciones:**

1. Verifica que los valores sean números válidos
2. Recarga el popup después de guardar
3. Los cambios se aplican al display inmediatamente

### Error: "Could not load manifest"

Asegúrate de que:

1. Seleccionaste la carpeta correcta (`Extensión FocusZone_v2`)
2. El archivo `manifest.json` existe en la carpeta raíz
3. El archivo `manifest.json` tiene sintaxis JSON válida

### La página de bloqueo no se muestra

**Verifica en manifest.json:**

```json
"web_accessible_resources": [
  {
    "resources": ["blocked.html"],
    "matches": ["<all_urls>"]
  }
]
```