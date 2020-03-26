const toggleContainer = (e) => {
    if(e.type == 'click'){
        document.getElementById('togglable-container').classList.toggle('cont-100');
        document.getElementById('toggle_container').classList.remove('fas fa-chevron-down');
        document.getElementById('toggle_container').classList.add('fas fa-chevron-up');
        
    }else{
        alert(`Une erreur s'est produit`)
    } 
};

// au chargement de la fenêtre

// Toggle le container des formulaires
document.getElementById('toggle_container').addEventListener('click', toggleContainer);
