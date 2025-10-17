// ============ ELEMENTOS DEL DOM ============
const timeDisplay = document.getElementById('timeDisplay');
const statusLabel = document.getElementById('statusLabel');
const currentDomainEl = document.getElementById('currentDomain');
const pomodoroCount = document.getElementById('pomodoroCount');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const stopBtn = document.getElementById('stopBtn');

const statusMsg = document.getElementById('statusMsg');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Stats
const todayBtn = document.getElementById('todayBtn');
const weekBtn = document.getElementById('weekBtn');
const statsContent = document.getElementById('statsContent');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Config
const workDurationInput = document.getElementById('workDuration');
const breakDurationInput = document.getElementById('breakDuration');
const longBreakDurationInput = document.getElementById('longBreakDuration');
const pomodorosUntilLongBreakInput = document.getElementById('pomodorosUntilLongBreak');
const saveConfigBtn = document.getElementById('saveConfigBtn');
const configStatus = document.getElementById('configStatus');

// Blocked Sites
const newSiteInput = document.getElementById('newSiteInput');
const addSiteBtn = document.getElementById('addSiteBtn');
const sitesList = document.getElementById('sitesList');

// ============ ESTADO LOCAL ============
let updateInterval = null;

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', async () => {
  // Cargar configuración
  await loadConfig();
  
  // Cargar sitios bloqueados
  await loadBlockedSites();
  
  // Obtener estado actual del background
  await updateUIState();
  
  // Cargar contador de pomodoros de hoy
  await updateTodayPomodoroCount();
  
  // Iniciar actualización periódica
  updateInterval = setInterval(updateUIState, 1000);
});

// ============ TABS ============
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    
    // Actualizar tabs
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Actualizar contenido
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Si cambiamos a Stats, cargar datos
    if (tabName === 'stats') {
      loadStats('today');
    }
  });
});

// ============ TIMER CONTROLS ============
startBtn.addEventListener('click', async () => {
  const workDuration = parseInt(workDurationInput.value) || 25;
  const breakDuration = parseInt(breakDurationInput.value) || 5;
  
  const response = await chrome.runtime.sendMessage({
    action: 'startPomodoro',
    workDuration: workDuration,
    breakDuration: breakDuration
  });
  
  if (response.success) {
    showStatus('🎯 ¡Pomodoro iniciado!', 'success');
    updateUIState();
  }
});

pauseBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: 'pausePomodoro' });
  showStatus('⏸️ Pausado', 'info');
  updateUIState();
});

resumeBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: 'resumePomodoro' });
  showStatus('▶️ Reanudado', 'success');
  updateUIState();
});

stopBtn.addEventListener('click', async () => {
  if (confirm('¿Detener el Pomodoro actual?')) {
    await chrome.runtime.sendMessage({ action: 'stopPomodoro' });
    showStatus('⏹️ Detenido', 'info');
    updateUIState();
    await updateTodayPomodoroCount();
  }
});

// ============ ACTUALIZAR UI ============
async function updateUIState() {
  const response = await chrome.runtime.sendMessage({ action: 'getState' });
  
  if (response) {
    const { pomodoroState, trackingState } = response;
    
    // Actualizar display de tiempo
    const minutes = Math.floor(pomodoroState.timeRemaining / 60);
    const seconds = pomodoroState.timeRemaining % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Actualizar label de estado
    if (pomodoroState.isRunning) {
      if (pomodoroState.isPaused) {
        statusLabel.textContent = '⏸️ Pausado';
        statusLabel.className = 'status-label paused';
      } else if (pomodoroState.isBreak) {
        statusLabel.textContent = '☕ Descanso';
        statusLabel.className = 'status-label break';
      } else {
        statusLabel.textContent = '🎯 En Progreso';
        statusLabel.className = 'status-label active';
      }
    } else {
      statusLabel.textContent = 'Listo para empezar';
      statusLabel.className = 'status-label';
    }
    
    // Actualizar dominio actual
    if (trackingState.currentDomain && pomodoroState.isRunning && !pomodoroState.isBreak) {
      currentDomainEl.textContent = `📍 ${trackingState.currentDomain}`;
      currentDomainEl.style.display = 'block';
    } else {
      currentDomainEl.style.display = 'none';
    }
    
    // Actualizar botones
    if (pomodoroState.isRunning) {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
      
      if (pomodoroState.isPaused) {
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'inline-block';
      } else {
        pauseBtn.style.display = 'inline-block';
        resumeBtn.style.display = 'none';
      }
    } else {
      startBtn.style.display = 'inline-block';
      pauseBtn.style.display = 'none';
      resumeBtn.style.display = 'none';
      stopBtn.style.display = 'none';
    }
  }
}

async function updateTodayPomodoroCount() {
  const result = await chrome.storage.local.get(['pomodoroHistory']);
  const history = result.pomodoroHistory || [];
  
  const today = new Date().toISOString().split('T')[0];
  const todayPomodoros = history.filter(p => {
    const pomodoroDate = new Date(p.timestamp).toISOString().split('T')[0];
    return pomodoroDate === today && p.completed;
  });
  
  pomodoroCount.textContent = todayPomodoros.length;
}

// ============ STATS ============
todayBtn.addEventListener('click', () => {
  todayBtn.classList.add('active');
  weekBtn.classList.remove('active');
  loadStats('today');
});

weekBtn.addEventListener('click', () => {
  weekBtn.classList.add('active');
  todayBtn.classList.remove('active');
  loadStats('week');
});

async function loadStats(period) {
  const result = await chrome.storage.local.get(['timeTracking']);
  const tracking = result.timeTracking || {};
  
  let dates = [];
  const today = new Date();
  
  if (period === 'today') {
    dates = [today.toISOString().split('T')[0]];
  } else if (period === 'week') {
    // Últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
  }
  
  // Agregar datos de todos los días relevantes
  const domainTotals = {};
  dates.forEach(date => {
    if (tracking[date]) {
      Object.entries(tracking[date]).forEach(([domain, seconds]) => {
        domainTotals[domain] = (domainTotals[domain] || 0) + seconds;
      });
    }
  });
  
  // Renderizar stats
  if (Object.keys(domainTotals).length === 0) {
    statsContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No hay datos para este período</p>
        <small>Completa un Pomodoro para ver estadísticas</small>
      </div>
    `;
  } else {
    // Ordenar por tiempo (mayor a menor)
    const sortedDomains = Object.entries(domainTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10
    
    statsContent.innerHTML = `
      <div class="stats-list">
        ${sortedDomains.map(([domain, seconds]) => {
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
          
          return `
            <div class="stat-item">
              <div class="stat-domain">🌐 ${domain}</div>
              <div class="stat-time">${timeStr}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// ============ EXPORT ============
exportCsvBtn.addEventListener('click', async () => {
  const result = await chrome.storage.local.get(['timeTracking', 'pomodoroHistory']);
  
  // Generar CSV del tracking
  let csv = 'Fecha,Dominio,Tiempo (segundos)\n';
  
  if (result.timeTracking) {
    Object.entries(result.timeTracking).forEach(([date, domains]) => {
      Object.entries(domains).forEach(([domain, seconds]) => {
        csv += `${date},${domain},${seconds}\n`;
      });
    });
  }
  
  downloadFile(csv, 'quickpomodoro_tracking.csv', 'text/csv');
  showStatus('📄 CSV exportado', 'success');
});

exportJsonBtn.addEventListener('click', async () => {
  const result = await chrome.storage.local.get(['timeTracking', 'pomodoroHistory', 'pomodoroConfig']);
  
  const data = {
    exportDate: new Date().toISOString(),
    timeTracking: result.timeTracking || {},
    pomodoroHistory: result.pomodoroHistory || [],
    config: result.pomodoroConfig || {}
  };
  
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'quickpomodoro_data.json', 'application/json');
  showStatus('📦 JSON exportado', 'success');
});

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

clearHistoryBtn.addEventListener('click', async () => {
  if (confirm('¿Estás seguro? Esto eliminará TODOS los datos de tracking e historial.')) {
    await chrome.storage.local.set({
      timeTracking: {},
      pomodoroHistory: []
    });
    
    loadStats('today');
    await updateTodayPomodoroCount();
    showStatus('🗑️ Historial limpiado', 'info');
  }
});

// ============ CONFIG ============
async function loadConfig() {
  const result = await chrome.storage.local.get(['pomodoroConfig']);
  
  if (result.pomodoroConfig) {
    const config = result.pomodoroConfig;
    workDurationInput.value = config.workDuration || 25;
    breakDurationInput.value = config.breakDuration || 5;
    longBreakDurationInput.value = config.longBreakDuration || 15;
    pomodorosUntilLongBreakInput.value = config.pomodorosUntilLongBreak || 4;
  }
}

saveConfigBtn.addEventListener('click', async () => {
  const config = {
    workDuration: parseInt(workDurationInput.value) || 25,
    breakDuration: parseInt(breakDurationInput.value) || 5,
    longBreakDuration: parseInt(longBreakDurationInput.value) || 15,
    pomodorosUntilLongBreak: parseInt(pomodorosUntilLongBreakInput.value) || 4
  };
  
  await chrome.storage.local.set({ pomodoroConfig: config });
  
  // Actualizar el estado en background.js si el timer no está corriendo
  await chrome.runtime.sendMessage({
    action: 'updateConfig',
    config: config
  });
  
  // Refrescar la pantalla del timer
  await updateUIState();
  
  configStatus.textContent = '✅ Configuración guardada';
  configStatus.className = 'config-status success';
  setTimeout(() => {
    configStatus.textContent = '';
  }, 3000);
});

// ============ BLOCKED SITES ============
// Cargar sitios bloqueados
async function loadBlockedSites() {
  const result = await chrome.storage.local.get(['blockedSites']);
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
    await chrome.storage.local.set({ blockedSites: sites });
  }
  
  renderSitesList(sites);
}

// Renderizar lista de sitios
function renderSitesList(sites) {
  if (sites.length === 0) {
    sitesList.innerHTML = '<div class="empty-state-small">No hay sitios bloqueados</div>';
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
addSiteBtn.addEventListener('click', async () => {
  const site = newSiteInput.value.trim().toLowerCase();
  
  if (!site) {
    showStatus('⚠️ Ingresa un dominio', 'error');
    return;
  }
  
  // Validar formato básico
  if (!site.includes('.')) {
    showStatus('⚠️ Dominio inválido (ej: ejemplo.com)', 'error');
    return;
  }
  
  const result = await chrome.storage.local.get(['blockedSites']);
  const sites = result.blockedSites || [];
  
  if (sites.includes(site)) {
    showStatus('⚠️ El sitio ya está bloqueado', 'info');
    return;
  }
  
  sites.push(site);
  await chrome.storage.local.set({ blockedSites: sites });
  
  renderSitesList(sites);
  newSiteInput.value = '';
  
  // Notificar al background script
  await chrome.runtime.sendMessage({ 
    action: 'updateBlockedSites',
    sites: sites
  });
  
  showStatus('✅ Sitio agregado', 'success');
});

// Eliminar sitio
async function removeSite(site) {
  const result = await chrome.storage.local.get(['blockedSites']);
  const sites = result.blockedSites || [];
  const newSites = sites.filter(s => s !== site);
  
  await chrome.storage.local.set({ blockedSites: newSites });
  renderSitesList(newSites);
  
  // Notificar al background script
  await chrome.runtime.sendMessage({ 
    action: 'updateBlockedSites',
    sites: newSites
  });
  
  showStatus('🗑️ Sitio eliminado', 'info');
}

// Agregar sitio con Enter
newSiteInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addSiteBtn.click();
  }
});

// ============ UTILIDADES ============
function showStatus(message, type = 'info') {
  statusMsg.textContent = message;
  statusMsg.className = `status-msg ${type} show`;
  
  setTimeout(() => {
    statusMsg.classList.remove('show');
  }, 3000);
}

// Limpiar intervalo al cerrar
window.addEventListener('beforeunload', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
