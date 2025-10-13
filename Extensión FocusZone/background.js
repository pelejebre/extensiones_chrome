// Estado global del temporizador
let timerState = {
    isRunning: false,
    timeRemaining: 25 * 60, // 25 minutos en segundos
    isFocusMode: true,
    focusDuration: 25 * 60,
    breakDuration: 5 * 60,
    blockedSites: []
};

let timerInterval = null;

// Inicializar al instalar
chrome.runtime.onInstalled.addListener(() => {
    console.log('FocusZone instalado');
    
    // Configurar sitios bloqueados por defecto
    chrome.storage.sync.get(['blockedSites'], (result) => {
        if (!result.blockedSites) {
            const defaultSites = [
                'youtube.com',
                'twitter.com',
                'x.com',
                'tiktok.com',
                'instagram.com',
                'facebook.com',
                'reddit.com',
                'twitch.tv',
                'web.whatsapp.com',
                'gmail.com',
                'mail.google.com'
            ];
            chrome.storage.sync.set({ blockedSites: defaultSites });
            timerState.blockedSites = defaultSites;
        } else {
            timerState.blockedSites = result.blockedSites;
        }
    });
    
    // Cargar configuración de tiempos
    chrome.storage.sync.get(['focusDuration', 'breakDuration'], (result) => {
        if (result.focusDuration) {
            timerState.focusDuration = result.focusDuration * 60;
        }
        if (result.breakDuration) {
            timerState.breakDuration = result.breakDuration * 60;
        }
    });
});

// Cargar sitios bloqueados al iniciar el service worker
chrome.storage.sync.get(['blockedSites'], (result) => {
    if (result.blockedSites) {
        timerState.blockedSites = result.blockedSites;
    }
});

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'getTimerState':
            sendResponse(timerState);
            break;
            
        case 'startTimer':
            startTimer(message.timeRemaining, message.isFocusMode);
            sendResponse({ success: true });
            break;
            
        case 'pauseTimer':
            pauseTimer();
            sendResponse({ success: true });
            break;
            
        case 'resetTimer':
            resetTimer();
            sendResponse({ success: true });
            break;
            
        case 'updateBlockedSites':
            timerState.blockedSites = message.sites;
            sendResponse({ success: true });
            break;
    }
    
    return true; // Mantener el canal abierto para respuestas asíncronas
});

// Iniciar temporizador
function startTimer(timeRemaining, isFocusMode) {
    timerState.isRunning = true;
    timerState.timeRemaining = timeRemaining;
    timerState.isFocusMode = isFocusMode;
    
    // Limpiar intervalo anterior si existe
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Iniciar nuevo intervalo
    timerInterval = setInterval(() => {
        timerState.timeRemaining--;
        
        // Notificar al popup sobre la actualización
        chrome.runtime.sendMessage({
            action: 'timerUpdate',
            timeRemaining: timerState.timeRemaining,
            isFocusMode: timerState.isFocusMode,
            isRunning: timerState.isRunning,
            completed: false
        }).catch(() => {
            // El popup está cerrado, continuar de todos modos
        });
        
        // Verificar si el tiempo se acabó
        if (timerState.timeRemaining <= 0) {
            completeTimer();
        }
    }, 1000);
    
    console.log('Timer iniciado:', timerState);
}

// Pausar temporizador
function pauseTimer() {
    timerState.isRunning = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    console.log('Timer pausado:', timerState);
}

// Reiniciar temporizador
function resetTimer() {
    timerState.isRunning = false;
    timerState.isFocusMode = true;
    timerState.timeRemaining = timerState.focusDuration;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    console.log('Timer reiniciado:', timerState);
}

// Completar temporizador
function completeTimer() {
    const wasFocusMode = timerState.isFocusMode;
    
    // Cambiar de modo
    timerState.isFocusMode = !timerState.isFocusMode;
    timerState.timeRemaining = timerState.isFocusMode ? timerState.focusDuration : timerState.breakDuration;
    timerState.isRunning = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Actualizar estadísticas si se completó un foco
    if (wasFocusMode) {
        updateStats();
    }
    
    // Notificar al popup
    chrome.runtime.sendMessage({
        action: 'timerUpdate',
        timeRemaining: timerState.timeRemaining,
        isFocusMode: timerState.isFocusMode,
        isRunning: timerState.isRunning,
        completed: true,
        focusCompleted: wasFocusMode
    }).catch(() => {
        // El popup está cerrado
    });
    
    // Mostrar notificación
    const title = wasFocusMode ? '🎯 ¡Sesión completada!' : '☕ ¡Descanso terminado!';
    const message = wasFocusMode 
        ? 'Excelente trabajo. Es hora de tomar un descanso.'
        : '¡Es hora de volver al trabajo!';
    
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: title,
        message: message,
        priority: 2
    });
    
    console.log('Timer completado, modo:', timerState.isFocusMode ? 'Foco' : 'Descanso');
}

// Actualizar estadísticas
function updateStats() {
    const today = new Date().toDateString();
    
    chrome.storage.local.get(['stats'], (result) => {
        const stats = result.stats || {};
        
        if (!stats[today]) {
            stats[today] = { sessions: 0 };
        }
        
        stats[today].sessions++;
        
        chrome.storage.local.set({ stats: stats });
    });
}

// Verificar si una URL está bloqueada
function isUrlBlocked(url) {
    if (!timerState.isRunning || !timerState.isFocusMode) {
        return false;
    }
    
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        
        return timerState.blockedSites.some(site => 
            hostname.includes(site) || site.includes(hostname)
        );
    } catch (e) {
        return false;
    }
}

// Interceptar actualizaciones de tabs y navegación
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Solo actuar cuando la URL cambia y está completa
    if (changeInfo.url) {
        const url = changeInfo.url;
        
        // Verificar si la URL debe ser bloqueada
        if (isUrlBlocked(url)) {
            console.log('Bloqueando sitio:', url);
            
            // Redirigir a la página de bloqueo
            const blockedUrl = chrome.runtime.getURL('blocked.html') + 
                              '?site=' + encodeURIComponent(new URL(url).hostname);
            
            chrome.tabs.update(tabId, { url: blockedUrl });
            
            // Actualizar contador de bloqueos
            updateBlockCount();
        }
    }
});

// Interceptar cuando se navega a una nueva URL (escribiendo en la barra)
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    // Solo procesar navegación principal (no iframes)
    if (details.frameId === 0) {
        const url = details.url;
        
        if (isUrlBlocked(url)) {
            console.log('Bloqueando navegación a:', url);
            
            // Redirigir a la página de bloqueo
            const blockedUrl = chrome.runtime.getURL('blocked.html') + 
                              '?site=' + encodeURIComponent(new URL(url).hostname);
            
            chrome.tabs.update(details.tabId, { url: blockedUrl });
        }
    }
});

// Actualizar contador de bloqueos
function updateBlockCount() {
    const today = new Date().toDateString();
    
    chrome.storage.local.get(['blocks'], (result) => {
        const blocks = result.blocks || {};
        blocks[today] = (blocks[today] || 0) + 1;
        chrome.storage.local.set({ blocks: blocks });
    });
}

// Mantener el service worker activo
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        // Solo para mantener el service worker activo
        console.log('Service worker activo - Timer:', 
                   timerState.isRunning ? 'ACTIVO' : 'INACTIVO',
                   'Modo:', timerState.isFocusMode ? 'Foco' : 'Descanso',
                   'Tiempo:', timerState.timeRemaining);
    }
});
