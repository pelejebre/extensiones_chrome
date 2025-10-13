// FocusBreak - Background Service Worker
// Sistema de recordatorios para pausas activas

// Inicialización al instalar
chrome.runtime.onInstalled.addListener(() => {
    console.log('FocusBreak instalado');
    
    // Configurar valores por defecto
    chrome.storage.local.get(['workInterval', 'breakDuration', 'isActive'], (result) => {
        if (!result.workInterval) {
            chrome.storage.local.set({ 
                workInterval: 50,  // minutos de trabajo
                breakDuration: 10, // minutos de descanso
                isActive: false,
                breaksToday: 0
            });
        }
    });
});

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startReminders') {
        startBreakReminders(message.interval);
        sendResponse({ success: true });
    } else if (message.action === 'stopReminders') {
        stopBreakReminders();
        sendResponse({ success: true });
    } else if (message.action === 'getStatus') {
        chrome.storage.local.get(['isActive', 'workInterval', 'breaksToday'], (result) => {
            sendResponse(result);
        });
        return true; // Mantener el canal abierto
    }
});

// Iniciar recordatorios de pausas
function startBreakReminders(intervalMinutes) {
    // Guardar el intervalo configurado
    chrome.storage.local.set({ 
        workInterval: intervalMinutes,
        isActive: true 
    });
    
    // Crear la alarma periódica
    chrome.alarms.create('breakReminder', {
        delayInMinutes: intervalMinutes,
        periodInMinutes: intervalMinutes
    });
    
    console.log(`FocusBreak activado: recordatorio cada ${intervalMinutes} minutos`);
}

// Detener recordatorios
function stopBreakReminders() {
    chrome.alarms.clear('breakReminder');
    chrome.storage.local.set({ isActive: false });
    console.log('FocusBreak desactivado');
}

// Escuchar alarmas
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'breakReminder') {
        // Mostrar notificación de pausa
        showBreakNotification();
        
        // Incrementar contador de pausas del día
        updateBreakCounter();
    }
});

// Mostrar notificación de pausa
function showBreakNotification() {
    const messages = [
        '💪 ¡Hora de levantarse y estirarte!',
        '🧘 Toma un descanso. Tu cuerpo te lo agradecerá.',
        '👀 Descansa la vista. Mira algo lejano por 20 segundos.',
        '🚶 Camina un poco y mueve las piernas.',
        '💧 Hidrátate. Toma un vaso de agua.',
        '🙆 Estira el cuello y los hombros.',
        '🌬️ Respira profundamente 3 veces.',
        '☕ Pausa activa: estira, camina o toma agua.'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    chrome.storage.local.get(['breakDuration'], (result) => {
        const breakTime = result.breakDuration || 10;
        
        chrome.notifications.create('breakNotification', {
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'FocusBreak 💪',
            message: randomMessage,
            contextMessage: `Sugerencia: descansa ${breakTime} minutos`,
            priority: 2,
            requireInteraction: true,
            buttons: [
                { title: '🧘 Respiración guiada' },
                { title: '☕ Descanso libre' }
            ]
        });
    });
}

// Escuchar clics en los botones de notificación
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId === 'breakNotification') {
        if (buttonIndex === 0) {
            // Respiración guiada - marcar flag primero
            chrome.storage.local.set({ openBreathingMode: true }, () => {
                console.log('Flag openBreathingMode activado');
                
                // Intentar abrir ventana emergente
                chrome.windows.create({
                    url: chrome.runtime.getURL('popup.html'),
                    type: 'popup',
                    width: 420,
                    height: 600,
                    focused: true
                }).then(window => {
                    console.log('Ventana de respiración abierta:', window.id);
                }).catch(error => {
                    console.error('Error al abrir ventana:', error);
                    // Si falla, mostrar notificación de instrucción
                    showBreathingInstructionNotification();
                });
            });
        }
        // Cerrar la notificación en ambos casos
        chrome.notifications.clear(notificationId);
    }
});

// Mostrar notificación de instrucción si la ventana no se abre
function showBreathingInstructionNotification() {
    chrome.notifications.create('breathingInstruction', {
        type: 'basic',
        iconUrl: 'icon.png',
        title: '🧘 Respiración guiada lista',
        message: 'Haz clic en el ícono de FocusBreak 💪 para iniciar el ejercicio',
        priority: 2,
        requireInteraction: true
    });
}

// Actualizar contador de pausas
function updateBreakCounter() {
    const today = new Date().toDateString();
    
    chrome.storage.local.get(['breaksToday', 'lastBreakDate'], (result) => {
        let breaksToday = result.breaksToday || 0;
        const lastDate = result.lastBreakDate || '';
        
        // Reiniciar contador si es un nuevo día
        if (lastDate !== today) {
            breaksToday = 0;
        }
        
        breaksToday++;
        
        chrome.storage.local.set({ 
            breaksToday: breaksToday,
            lastBreakDate: today
        });
        
        console.log(`Pausas hoy: ${breaksToday}`);
    });
}
