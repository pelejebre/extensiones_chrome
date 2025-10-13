// FocusBreak - Popup Script
// Interfaz de configuración de pausas activas

// Elementos del DOM - Vista principal
const mainContainer = document.getElementById('mainContainer');
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');
const statusDetail = document.getElementById('statusDetail');
const workIntervalInput = document.getElementById('workInterval');
const breakDurationInput = document.getElementById('breakDuration');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const breaksTodayDisplay = document.getElementById('breaksToday');

// Elementos del DOM - Vista respiración
const breathingView = document.getElementById('breathingView');
const breathingActive = document.getElementById('breathingActive');
const breathingComplete = document.getElementById('breathingComplete');
const breathingCounter = document.getElementById('breathingCounter');
const breathingInstruction = document.getElementById('breathingInstruction');
const breathingCircle = document.getElementById('breathingCircle');
const breathingText = document.getElementById('breathingText');
const breathingProgress = document.getElementById('breathingProgress');
const btnMute = document.getElementById('btnMute');
const btnExitBreathing = document.getElementById('btnExitBreathing');
const btnContinueBreak = document.getElementById('btnContinueBreak');

// Estado de respiración
let breathingState = {
    isRunning: false,
    currentCycle: 1,
    totalCycles: 5,
    phase: 'ready', // ready, inhale, hold, exhale
    counter: 0,
    isMuted: false
};

// Web Audio API para sonidos
let audioContext = null;

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadStatus();
    checkBreathingMode();
    
    // Inicializar Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
});

// Cargar configuración guardada
function loadSettings() {
    chrome.storage.local.get(['workInterval', 'breakDuration'], (result) => {
        if (result.workInterval) {
            workIntervalInput.value = result.workInterval;
        }
        if (result.breakDuration) {
            breakDurationInput.value = result.breakDuration;
        }
    });
}

// Cargar estado actual
function loadStatus() {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
        if (response) {
            updateUI(response.isActive, response.workInterval);
            breaksTodayDisplay.textContent = response.breaksToday || 0;
        }
    });
}

// Actualizar interfaz según el estado
function updateUI(isActive, interval) {
    if (isActive) {
        // Recordatorios activos
        statusIcon.textContent = '✅';
        statusText.textContent = 'Recordatorios activos';
        statusDetail.textContent = `Te avisaré cada ${interval} minutos`;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'flex';
        workIntervalInput.disabled = true;
        breakDurationInput.disabled = true;
    } else {
        // Recordatorios inactivos
        statusIcon.textContent = '⏸️';
        statusText.textContent = 'Recordatorios desactivados';
        statusDetail.textContent = 'Configura tu intervalo y activa';
        startBtn.style.display = 'flex';
        stopBtn.style.display = 'none';
        workIntervalInput.disabled = false;
        breakDurationInput.disabled = false;
    }
}

// Guardar configuración de duración de pausa
breakDurationInput.addEventListener('change', () => {
    const value = parseInt(breakDurationInput.value);
    if (value >= 5 && value <= 30) {
        chrome.storage.local.set({ breakDuration: value });
    }
});

// Activar recordatorios
startBtn.addEventListener('click', () => {
    const interval = parseInt(workIntervalInput.value);
    
    // Validar intervalo
    if (interval < 5 || interval > 120) {
        alert('⚠️ El intervalo debe estar entre 5 y 120 minutos');
        return;
    }
    
    // Guardar configuración
    chrome.storage.local.set({ 
        workInterval: interval,
        breakDuration: parseInt(breakDurationInput.value)
    });
    
    // Enviar mensaje al background para iniciar recordatorios
    chrome.runtime.sendMessage({ 
        action: 'startReminders',
        interval: interval
    }, (response) => {
        if (response && response.success) {
            updateUI(true, interval);
        }
    });
});

// Desactivar recordatorios
stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopReminders' }, (response) => {
        if (response && response.success) {
            updateUI(false, 0);
        }
    });
});

// ============================================
// FUNCIONALIDAD DE RESPIRACIÓN GUIADA
// ============================================

// Verificar si debe abrir en modo respiración
function checkBreathingMode() {
    chrome.storage.local.get(['openBreathingMode'], (result) => {
        console.log('Verificando modo respiración:', result);
        if (result.openBreathingMode === true) {
            console.log('Modo respiración detectado - iniciando ejercicio');
            // Limpiar flag inmediatamente
            chrome.storage.local.remove('openBreathingMode', () => {
                console.log('Flag limpiado');
            });
            // Abrir vista de respiración
            showBreathingView();
        } else {
            console.log('No hay modo respiración activo');
        }
    });
}

// Mostrar vista de respiración
function showBreathingView() {
    console.log('Mostrando vista de respiración');
    mainContainer.style.display = 'none';
    breathingView.style.display = 'block';
    breathingActive.style.display = 'block';
    breathingComplete.classList.remove('show');
    
    // Ajustar el tamaño del body para la vista de respiración
    document.body.style.width = '400px';
    document.body.style.minHeight = '550px';
    
    // Iniciar después de 2 segundos
    setTimeout(() => {
        console.log('Iniciando ejercicio de respiración');
        startBreathingExercise();
    }, 2000);
}

// Mostrar vista principal
function showMainView() {
    console.log('Volviendo a vista principal');
    mainContainer.style.display = 'block';
    breathingView.style.display = 'none';
    stopBreathingExercise();
    
    // Restaurar tamaño normal
    document.body.style.width = '380px';
    document.body.style.minHeight = 'auto';
    
    // Recargar el estado
    loadStatus();
}

// Iniciar ejercicio de respiración
function startBreathingExercise() {
    breathingState.isRunning = true;
    breathingState.currentCycle = 1;
    breathingState.phase = 'inhale';
    
    runBreathingCycle();
}

// Detener ejercicio de respiración
function stopBreathingExercise() {
    breathingState.isRunning = false;
    breathingState.currentCycle = 1;
    breathingState.phase = 'ready';
}

// Ejecutar un ciclo de respiración (4-7-8 técnica)
function runBreathingCycle() {
    if (!breathingState.isRunning) return;
    
    const phases = [
        { name: 'inhale', duration: 4, text: 'INHALA', instruction: 'Inhala profundamente por la nariz', class: 'inhale' },
        { name: 'hold', duration: 7, text: 'RETÉN', instruction: 'Mantén el aire en tus pulmones', class: 'hold' },
        { name: 'exhale', duration: 8, text: 'EXHALA', instruction: 'Exhala lentamente por la boca', class: 'exhale' }
    ];
    
    let phaseIndex = 0;
    
    function executePhase() {
        if (!breathingState.isRunning) return;
        
        if (phaseIndex >= phases.length) {
            // Ciclo completado
            breathingState.currentCycle++;
            
            if (breathingState.currentCycle > breathingState.totalCycles) {
                // Todos los ciclos completados
                completeBreathingExercise();
                return;
            }
            
            // Siguiente ciclo
            phaseIndex = 0;
            setTimeout(executePhase, 1000); // Pequeña pausa entre ciclos
            return;
        }
        
        const phase = phases[phaseIndex];
        breathingState.phase = phase.name;
        breathingState.counter = phase.duration;
        
        // Actualizar UI
        breathingText.textContent = phase.text;
        breathingInstruction.textContent = phase.instruction;
        breathingProgress.textContent = `Ciclo ${breathingState.currentCycle} de ${breathingState.totalCycles}`;
        
        // Aplicar animación
        breathingCircle.className = 'breathing-circle ' + phase.class;
        
        // Sonido de inicio de fase
        if (!breathingState.isMuted) {
            playSound(phase.name === 'inhale' ? 400 : phase.name === 'hold' ? 600 : 300, 0.1);
        }
        
        // Contador regresivo
        const countdownInterval = setInterval(() => {
            if (!breathingState.isRunning) {
                clearInterval(countdownInterval);
                return;
            }
            
            breathingCounter.textContent = breathingState.counter;
            breathingState.counter--;
            
            if (breathingState.counter < 0) {
                clearInterval(countdownInterval);
                phaseIndex++;
                setTimeout(executePhase, 500);
            }
        }, 1000);
    }
    
    executePhase();
}

// Completar ejercicio
function completeBreathingExercise() {
    breathingState.isRunning = false;
    breathingActive.style.display = 'none';
    breathingComplete.classList.add('show');
    
    // Sonido de completado
    if (!breathingState.isMuted) {
        playCompletionSound();
    }
}

// Generar sonido usando Web Audio API
function playSound(frequency, duration) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Sonido de completado (secuencia ascendente)
function playCompletionSound() {
    if (!audioContext) return;
    
    const frequencies = [400, 500, 600, 800];
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            playSound(freq, 0.2);
        }, index * 150);
    });
}

// Event Listeners - Respiración

// Botón Mute/Unmute
btnMute.addEventListener('click', () => {
    breathingState.isMuted = !breathingState.isMuted;
    
    if (breathingState.isMuted) {
        btnMute.textContent = '🔇 Silencio';
        btnMute.classList.add('muted');
    } else {
        btnMute.textContent = '🔊 Sonido';
        btnMute.classList.remove('muted');
    }
});

// Botón Salir de respiración
btnExitBreathing.addEventListener('click', () => {
    showMainView();
});

// Botón Continuar descanso
btnContinueBreak.addEventListener('click', () => {
    showMainView();
});
