document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todas las tarjetas de aplicaciones IA
    const aiCards = document.querySelectorAll('.ai-card');
    
    aiCards.forEach(card => {
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            
            // Abrir la URL en una nueva pestaña
            chrome.tabs.create({ url: url }, function() {
                // Cerrar el popup después de abrir la nueva pestaña
                window.close();
            });
        });
    });
});