document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const mainMenu = document.getElementById('main-menu');
    const bbddView = document.getElementById('bbdd-view');
    const gestoresView = document.getElementById('gestores-view');
    const analisisView = document.getElementById('analisis-view');
    const otrosView = document.getElementById('otros-view');
    const usalView = document.getElementById('usal-view');
    const mainTitle = document.getElementById('main-title');
    const mainSubtitle = document.getElementById('main-subtitle');
    const backButtonBbdd = document.getElementById('back-to-menu-bbdd');
    const backButtonGestores = document.getElementById('back-to-menu-gestores');
    const backButtonAnalisis = document.getElementById('back-to-menu-analisis');
    const backButtonOtros = document.getElementById('back-to-menu-otros');
    const backButtonUsal = document.getElementById('back-to-menu-usal');
    
    // Seleccionar todos los botones del menú principal
    const menuButtons = document.querySelectorAll('.menu-button');
    
    // Seleccionar todas las tarjetas de recursos
    const resourceCards = document.querySelectorAll('.resource-card');
    
    // Función para ocultar todas las vistas
    function hideAllViews() {
        mainMenu.classList.add('hidden');
        bbddView.classList.remove('active');
        gestoresView.classList.remove('active');
        analisisView.classList.remove('active');
        otrosView.classList.remove('active');
        usalView.classList.remove('active');
    }
    
    // Función para mostrar la vista de BBDD
    function showBBDDView() {
        hideAllViews();
        bbddView.classList.add('active');
        mainTitle.textContent = 'Bases de Datos';
        mainSubtitle.textContent = 'Acceso a recursos bibliográficos';
    }
    
    // Función para mostrar la vista de Gestores
    function showGestoresView() {
        hideAllViews();
        gestoresView.classList.add('active');
        mainTitle.textContent = 'Gestores Documentales';
        mainSubtitle.textContent = 'Organiza tus referencias bibliográficas';
    }
    
    // Función para mostrar la vista de Análisis
    function showAnalisisView() {
        hideAllViews();
        analisisView.classList.add('active');
        mainTitle.textContent = 'Herramientas de Análisis';
        mainSubtitle.textContent = 'Analiza y visualiza literatura científica';
    }
    
    // Función para mostrar la vista de Otros Recursos
    function showOtrosView() {
        hideAllViews();
        otrosView.classList.add('active');
        mainTitle.textContent = 'Otros Recursos';
        mainSubtitle.textContent = 'Herramientas complementarias para la investigación';
    }
    
    // Función para mostrar la vista de USAL
    function showUsalView() {
        hideAllViews();
        usalView.classList.add('active');
        mainTitle.textContent = 'Universidad de Salamanca';
        mainSubtitle.textContent = 'Recursos y servicios USAL';
    }
    
    // Función para volver al menú principal
    function showMainMenu() {
        mainMenu.classList.remove('hidden');
        bbddView.classList.remove('active');
        gestoresView.classList.remove('active');
        analisisView.classList.remove('active');
        otrosView.classList.remove('active');
        usalView.classList.remove('active');
        mainTitle.textContent = 'Recursos Doctorado';
        mainSubtitle.textContent = 'Organiza tu investigación';
    }
    
    // Event listeners para los botones del menú
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            switch(category) {
                case 'bbdd':
                    showBBDDView();
                    break;
                case 'gestores':
                    showGestoresView();
                    break;
                case 'analisis':
                    showAnalisisView();
                    break;
                case 'otros':
                    showOtrosView();
                    break;
                case 'usal':
                    showUsalView();
                    break;
            }
        });
    });
    
    // Event listeners para los botones de volver
    backButtonBbdd.addEventListener('click', showMainMenu);
    backButtonGestores.addEventListener('click', showMainMenu);
    backButtonAnalisis.addEventListener('click', showMainMenu);
    backButtonOtros.addEventListener('click', showMainMenu);
    backButtonUsal.addEventListener('click', showMainMenu);
    
    // Event listeners para las tarjetas de recursos
    resourceCards.forEach(card => {
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