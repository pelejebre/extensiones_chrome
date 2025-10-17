// ============ ESTADO GLOBAL ============
let pomodoroState = {
  isRunning: false,
  isPaused: false,
  isBreak: false,
  timeRemaining: 25 * 60, // segundos
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  pomodorosCompleted: 0
};

let trackingState = {
  currentDomain: null,
  startTime: null,
  isTracking: false
};

let blockedSites = [];

// ============ INICIALIZACIÓN ============
chrome.runtime.onInstalled.addListener(() => {
  console.log('FocusZone v2 instalado');
  
  // Inicializar storage
  chrome.storage.local.get(['pomodoroConfig', 'timeTracking', 'pomodoroHistory', 'blockedSites'], (result) => {
    if (!result.pomodoroConfig) {
      chrome.storage.local.set({
        pomodoroConfig: {
          workDuration: 25,
          breakDuration: 5,
          longBreakDuration: 15,
          pomodorosUntilLongBreak: 4
        }
      });
    }
    
    if (!result.timeTracking) {
      chrome.storage.local.set({ timeTracking: {} });
    }
    
    if (!result.pomodoroHistory) {
      chrome.storage.local.set({ pomodoroHistory: [] });
    }
    
    // Sitios bloqueados por defecto
    if (!result.blockedSites) {
      const defaultSites = [
        'youtube.com',
        'twitter.com',
        'x.com',
        'instagram.com',
        'facebook.com',
        'web.whatsapp.com'
      ];
      chrome.storage.local.set({ blockedSites: defaultSites });
      blockedSites = defaultSites;
    } else {
      blockedSites = result.blockedSites;
    }
  });
  
  // Crear alarma para actualizar badge cada segundo
  chrome.alarms.create('updateTimer', { periodInMinutes: 1/60 });
});

// Cargar sitios bloqueados al iniciar
chrome.storage.local.get(['blockedSites'], (result) => {
  if (result.blockedSites) {
    blockedSites = result.blockedSites;
    console.log('Sitios bloqueados cargados:', blockedSites);
  } else {
    console.log('No hay sitios bloqueados guardados');
  }
});

// ============ TIMER LOGIC ============
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateTimer' && pomodoroState.isRunning && !pomodoroState.isPaused) {
    pomodoroState.timeRemaining--;
    
    // Actualizar badge
    updateBadge();
    
    // Verificar si terminó
    if (pomodoroState.timeRemaining <= 0) {
      pomodoroCompleted();
    }
  }
});

function updateBadge() {
  const minutes = Math.floor(pomodoroState.timeRemaining / 60);
  const seconds = pomodoroState.timeRemaining % 60;
  const badgeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ 
    color: pomodoroState.isBreak ? '#4CAF50' : '#F44336' 
  });
}

function pomodoroCompleted() {
  pomodoroState.isRunning = false;
  
  if (!pomodoroState.isBreak) {
    // Terminó un pomodoro de trabajo
    pomodoroState.pomodorosCompleted++;
    
    // Guardar en historial
    saveCompletedPomodoro();
    
    // Mostrar notificación
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: '¡Pomodoro Completado! 🎯',
      message: `Pomodoro #${pomodoroState.pomodorosCompleted} terminado. ¡Hora de descansar!`,
      priority: 2
    });
    
    // Preparar descanso
    pomodoroState.isBreak = true;
    pomodoroState.timeRemaining = pomodoroState.breakDuration;
    
    // Desactivar bloqueo durante descanso
    updateBlockingRules();
    
  } else {
    // Terminó el descanso
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Descanso Terminado 💪',
      message: '¡Listo para otro Pomodoro!',
      priority: 2
    });
    
    // Preparar siguiente pomodoro
    pomodoroState.isBreak = false;
    pomodoroState.timeRemaining = pomodoroState.workDuration;
  }
  
  chrome.action.setBadgeText({ text: '' });
}

function saveCompletedPomodoro() {
  const pomodoro = {
    timestamp: Date.now(),
    duration: pomodoroState.workDuration / 60, // en minutos
    domain: trackingState.currentDomain,
    completed: true
  };
  
  chrome.storage.local.get(['pomodoroHistory'], (result) => {
    const history = result.pomodoroHistory || [];
    history.push(pomodoro);
    chrome.storage.local.set({ pomodoroHistory: history });
  });
}

// ============ TIME TRACKING ============
// Detectar cambio de pestaña activa
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      const domain = extractDomain(tab.url);
      handleDomainChange(domain);
    }
  });
});

// Detectar actualización de URL en pestaña activa
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id === tabId) {
        const domain = extractDomain(changeInfo.url);
        handleDomainChange(domain);
      }
    });
  }
});

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return 'unknown';
  }
}

function handleDomainChange(newDomain) {
  // Solo trackear si hay un Pomodoro activo
  if (!pomodoroState.isRunning || pomodoroState.isBreak) {
    trackingState.currentDomain = newDomain;
    return;
  }
  
  // Guardar tiempo del dominio anterior
  if (trackingState.currentDomain && trackingState.startTime) {
    const timeSpent = Date.now() - trackingState.startTime;
    saveTimeTracking(trackingState.currentDomain, timeSpent);
  }
  
  // Iniciar tracking del nuevo dominio
  trackingState.currentDomain = newDomain;
  trackingState.startTime = Date.now();
}

function saveTimeTracking(domain, timeSpentMs) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  chrome.storage.local.get(['timeTracking'], (result) => {
    const tracking = result.timeTracking || {};
    
    if (!tracking[today]) {
      tracking[today] = {};
    }
    
    if (!tracking[today][domain]) {
      tracking[today][domain] = 0;
    }
    
    tracking[today][domain] += Math.floor(timeSpentMs / 1000); // guardar en segundos
    
    chrome.storage.local.set({ timeTracking: tracking });
  });
}

// ============ MENSAJES DESDE POPUP ============
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'startPomodoro':
      pomodoroState.isRunning = true;
      pomodoroState.isPaused = false;
      pomodoroState.isBreak = false;
      pomodoroState.timeRemaining = request.workDuration * 60 || 25 * 60;
      pomodoroState.workDuration = request.workDuration * 60 || 25 * 60;
      pomodoroState.breakDuration = request.breakDuration * 60 || 5 * 60;
      
      console.log('▶️ Pomodoro iniciado');
      
      // Iniciar tracking
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          const domain = extractDomain(tabs[0].url);
          trackingState.currentDomain = domain;
          trackingState.startTime = Date.now();
        }
      });
      
      // Activar bloqueo de sitios
      updateBlockingRules();
      
      sendResponse({ success: true });
      break;
      
    case 'pausePomodoro':
      pomodoroState.isPaused = true;
      console.log('⏸️ Pomodoro pausado');
      // Guardar tiempo actual del dominio
      if (trackingState.currentDomain && trackingState.startTime) {
        const timeSpent = Date.now() - trackingState.startTime;
        saveTimeTracking(trackingState.currentDomain, timeSpent);
        trackingState.startTime = null;
      }
      // Desactivar bloqueo de sitios
      updateBlockingRules();
      sendResponse({ success: true });
      break;
      
    case 'resumePomodoro':
      pomodoroState.isPaused = false;
      // Reanudar tracking
      trackingState.startTime = Date.now();
      // Reactivar bloqueo de sitios
      updateBlockingRules();
      sendResponse({ success: true });
      break;
      
    case 'stopPomodoro':
      // Guardar tiempo antes de detener
      if (trackingState.currentDomain && trackingState.startTime) {
        const timeSpent = Date.now() - trackingState.startTime;
        saveTimeTracking(trackingState.currentDomain, timeSpent);
      }
      
      pomodoroState.isRunning = false;
      pomodoroState.isPaused = false;
      pomodoroState.timeRemaining = pomodoroState.workDuration;
      trackingState.startTime = null;
      chrome.action.setBadgeText({ text: '' });
      // Desactivar bloqueo de sitios
      updateBlockingRules();
      sendResponse({ success: true });
      break;
      
    case 'getState':
      sendResponse({ 
        pomodoroState: pomodoroState,
        trackingState: trackingState
      });
      break;
      
    case 'updateBlockedSites':
      blockedSites = request.sites;
      console.log('Sitios bloqueados actualizados:', blockedSites);
      // Actualizar reglas si hay una sesión activa
      updateBlockingRules();
      sendResponse({ success: true });
      break;
      
    case 'updateConfig':
      // Solo actualizar si el timer NO está corriendo
      if (!pomodoroState.isRunning) {
        const config = request.config;
        pomodoroState.workDuration = config.workDuration * 60;
        pomodoroState.breakDuration = config.breakDuration * 60;
        pomodoroState.timeRemaining = config.workDuration * 60;
        console.log('⚙️ Configuración actualizada:', config);
      }
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true; // Mantener el canal abierto para respuestas asíncronas
});

// ============ BLOQUEO DE SITIOS ============
// Verificar si una URL está bloqueada
function isUrlBlocked(url) {
  // Solo bloquear si hay un Pomodoro activo y estamos en modo trabajo
  if (!pomodoroState.isRunning || pomodoroState.isBreak || pomodoroState.isPaused) {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    return blockedSites.some(site => 
      hostname.includes(site) || site.includes(hostname)
    );
  } catch (e) {
    return false;
  }
}

// Actualizar reglas de bloqueo dinámico
async function updateBlockingRules() {
  try {
    console.log('Actualizando reglas de bloqueo...');
    console.log('Estado Pomodoro:', {
      isRunning: pomodoroState.isRunning,
      isBreak: pomodoroState.isBreak,
      isPaused: pomodoroState.isPaused
    });
    console.log('Sitios bloqueados:', blockedSites);
    
    // Eliminar todas las reglas existentes
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(rule => rule.id);
    
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
      console.log('Eliminadas', ruleIds.length, 'reglas existentes');
    }
    
    // Si hay un Pomodoro activo en modo trabajo, crear reglas de bloqueo
    if (pomodoroState.isRunning && !pomodoroState.isBreak && !pomodoroState.isPaused && blockedSites.length > 0) {
      const rules = [];
      
      blockedSites.forEach((site, index) => {
        // Regla 1: con www
        rules.push({
          id: (index * 4) + 1,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              extensionPath: '/blocked.html?site=' + encodeURIComponent(site)
            }
          },
          condition: {
            urlFilter: `*://www.${site}/*`,
            resourceTypes: ['main_frame']
          }
        });
        
        // Regla 2: sin www
        rules.push({
          id: (index * 4) + 2,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              extensionPath: '/blocked.html?site=' + encodeURIComponent(site)
            }
          },
          condition: {
            urlFilter: `*://${site}/*`,
            resourceTypes: ['main_frame']
          }
        });
        
        // Regla 3: exacto con www
        rules.push({
          id: (index * 4) + 3,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              extensionPath: '/blocked.html?site=' + encodeURIComponent(site)
            }
          },
          condition: {
            urlFilter: `*://www.${site}`,
            resourceTypes: ['main_frame']
          }
        });
        
        // Regla 4: exacto sin www
        rules.push({
          id: (index * 4) + 4,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              extensionPath: '/blocked.html?site=' + encodeURIComponent(site)
            }
          },
          condition: {
            urlFilter: `*://${site}`,
            resourceTypes: ['main_frame']
          }
        });
      });
      
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
      });
      
      console.log('✅ Reglas de bloqueo ACTIVADAS para', blockedSites.length, 'sitios (', rules.length, 'reglas totales)');
      console.log('Sitios bloqueados:', blockedSites.join(', '));
    } else {
      console.log('❌ Reglas de bloqueo DESACTIVADAS');
      if (!pomodoroState.isRunning) console.log('  - Razón: Timer no está corriendo');
      if (pomodoroState.isBreak) console.log('  - Razón: Está en descanso');
      if (pomodoroState.isPaused) console.log('  - Razón: Timer pausado');
      if (blockedSites.length === 0) console.log('  - Razón: No hay sitios bloqueados');
    }
  } catch (error) {
    console.error('❌ Error actualizando reglas de bloqueo:', error);
  }
}

// Interceptar navegación con método de respaldo
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) {
    const url = details.url;
    
    // Verificar si la URL debería ser bloqueada
    if (isUrlBlocked(url)) {
      console.log('Bloqueando navegación a:', url);
      
      try {
        const urlObj = new URL(url);
        const blockedUrl = chrome.runtime.getURL('blocked.html') + 
                          '?site=' + encodeURIComponent(urlObj.hostname);
        
        chrome.tabs.update(details.tabId, { url: blockedUrl });
      } catch (e) {
        console.error('Error bloqueando sitio:', e);
      }
    }
  }
});
