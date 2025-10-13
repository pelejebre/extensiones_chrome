// Estado de la aplicación
let timerInterval = null;
let timeRemaining = 25 * 60; // 25 minutos en segundos
let isRunning = false;
let isFocusMode = true;
let focusDuration = 25 * 60;
let breakDuration = 5 * 60;

// Elementos del DOM
const timerDisplay = document.getElementById('timerDisplay');
const modeText = document.getElementById('modeText');
const statusIndicator = document.getElementById('statusIndicator');
const timerMode = document.getElementById('timerMode');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const focusTimeInput = document.getElementById('focusTime');
const breakTimeInput = document.getElementById('breakTime');
const newSiteInput = document.getElementById('newSiteInput');
const addSiteBtn = document.getElementById('addSiteBtn');
const sitesList = document.getElementById('sitesList');
const sessionsToday = document.getElementById('sessionsToday');

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadBlockedSites();
    loadStats();
    syncWithBackground();
});

// Sincronizar con el background script
function syncWithBackground() {
    chrome.runtime.sendMessage({ action: 'getTimerState' }, (response) => {
        if (response) {
            isRunning = response.isRunning;
            timeRemaining = response.timeRemaining;
            isFocusMode = response.isFocusMode;
            
            updateDisplay();
            
            if (isRunning) {
                startBtn.style.display = 'none';
                pauseBtn.style.display = 'flex';
                statusIndicator.classList.remove('status-inactive');
                statusIndicator.classList.add('status-active');
            }
        }
    });
}

// Cargar configuración
function loadSettings() {
    chrome.storage.sync.get(['focusDuration', 'breakDuration'], (result) => {
        if (result.focusDuration) {
            focusDuration = result.focusDuration * 60;
            focusTimeInput.value = result.focusDuration;
        }
        if (result.breakDuration) {
            breakDuration = result.breakDuration * 60;
            breakTimeInput.value = result.breakDuration;
        }
    });
}

// Cargar sitios bloqueados
function loadBlockedSites() {
    chrome.storage.sync.get(['blockedSites'], (result) => {
        const sites = result.blockedSites || [
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
        
        // Guardar sitios por defecto si no existen
        if (!result.blockedSites) {
            chrome.storage.sync.set({ blockedSites: sites });
        }
        
        renderSitesList(sites);
    });
}

// Renderizar lista de sitios
function renderSitesList(sites) {
    if (sites.length === 0) {
        sitesList.innerHTML = '<div class="empty-state">No hay sitios bloqueados. Agrega uno arriba.</div>';
        return;
    }
    
    sitesList.innerHTML = sites.map(site => `
        <div class="site-item">
            <span class="site-name">${site}</span>
            <button class="btn-remove" data-site="${site}">Eliminar</button>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const site = btn.getAttribute('data-site');
            removeSite(site);
        });
    });
}

// Agregar sitio
addSiteBtn.addEventListener('click', () => {
    const site = newSiteInput.value.trim().toLowerCase();
    
    if (!site) {
        return;
    }
    
    // Validar formato básico
    if (!site.includes('.')) {
        alert('Por favor ingresa un dominio válido (ej: ejemplo.com)');
        return;
    }
    
    chrome.storage.sync.get(['blockedSites'], (result) => {
        const sites = result.blockedSites || [];
        
        if (sites.includes(site)) {
            alert('Este sitio ya está en la lista');
            return;
        }
        
        sites.push(site);
        chrome.storage.sync.set({ blockedSites: sites }, () => {
            renderSitesList(sites);
            newSiteInput.value = '';
            
            // Notificar al background script
            chrome.runtime.sendMessage({ 
                action: 'updateBlockedSites',
                sites: sites
            });
        });
    });
});

// Eliminar sitio
function removeSite(site) {
    chrome.storage.sync.get(['blockedSites'], (result) => {
        const sites = result.blockedSites || [];
        const newSites = sites.filter(s => s !== site);
        
        chrome.storage.sync.set({ blockedSites: newSites }, () => {
            renderSitesList(newSites);
            
            // Notificar al background script
            chrome.runtime.sendMessage({ 
                action: 'updateBlockedSites',
                sites: newSites
            });
        });
    });
}

// Agregar sitio con Enter
newSiteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addSiteBtn.click();
    }
});

// Actualizar configuración de tiempos
focusTimeInput.addEventListener('change', () => {
    const value = parseInt(focusTimeInput.value);
    if (value > 0) {
        focusDuration = value * 60;
        chrome.storage.sync.set({ focusDuration: value });
        
        if (isFocusMode && !isRunning) {
            timeRemaining = focusDuration;
            updateDisplay();
        }
    }
});

breakTimeInput.addEventListener('change', () => {
    const value = parseInt(breakTimeInput.value);
    if (value > 0) {
        breakDuration = value * 60;
        chrome.storage.sync.set({ breakDuration: value });
        
        if (!isFocusMode && !isRunning) {
            timeRemaining = breakDuration;
            updateDisplay();
        }
    }
});

// Iniciar temporizador
startBtn.addEventListener('click', () => {
    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
    statusIndicator.classList.remove('status-inactive');
    statusIndicator.classList.add('status-active');
    
    // Notificar al background script
    chrome.runtime.sendMessage({ 
        action: 'startTimer',
        timeRemaining: timeRemaining,
        isFocusMode: isFocusMode
    });
    
    updateDisplay();
});

// Pausar temporizador
pauseBtn.addEventListener('click', () => {
    isRunning = false;
    pauseBtn.style.display = 'none';
    startBtn.style.display = 'flex';
    startBtn.innerHTML = '<span>▶</span> Reanudar';
    statusIndicator.classList.remove('status-active');
    statusIndicator.classList.add('status-inactive');
    
    // Notificar al background script
    chrome.runtime.sendMessage({ action: 'pauseTimer' });
});

// Reiniciar temporizador
resetBtn.addEventListener('click', () => {
    isRunning = false;
    isFocusMode = true;
    timeRemaining = focusDuration;
    
    pauseBtn.style.display = 'none';
    startBtn.style.display = 'flex';
    startBtn.innerHTML = '<span>▶</span> Iniciar';
    statusIndicator.classList.remove('status-active');
    statusIndicator.classList.add('status-inactive');
    
    // Notificar al background script
    chrome.runtime.sendMessage({ action: 'resetTimer' });
    
    updateDisplay();
});

// Actualizar display
function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (isRunning) {
        if (isFocusMode) {
            modeText.textContent = '🎯 Modo Enfoque';
            timerMode.classList.add('focus');
            timerMode.classList.remove('break');
        } else {
            modeText.textContent = '☕ Tiempo de Descanso';
            timerMode.classList.add('break');
            timerMode.classList.remove('focus');
        }
    } else {
        modeText.textContent = 'Listo para comenzar';
        timerMode.classList.remove('focus', 'break');
    }
}

// Escuchar actualizaciones del background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'timerUpdate') {
        timeRemaining = message.timeRemaining;
        isFocusMode = message.isFocusMode;
        isRunning = message.isRunning;
        
        updateDisplay();
        
        if (!isRunning && message.completed) {
            // El timer se completó
            startBtn.innerHTML = '<span>▶</span> Iniciar';
            pauseBtn.style.display = 'none';
            startBtn.style.display = 'flex';
            statusIndicator.classList.remove('status-active');
            statusIndicator.classList.add('status-inactive');
            
            // Actualizar estadísticas
            if (message.focusCompleted) {
                loadStats();
            }
        }
    }
});

// Cargar estadísticas
function loadStats() {
    const today = new Date().toDateString();
    
    chrome.storage.local.get(['stats'], (result) => {
        const stats = result.stats || {};
        const todayStats = stats[today] || { sessions: 0 };
        
        sessionsToday.textContent = todayStats.sessions;
    });
}
