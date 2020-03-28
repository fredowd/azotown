

const toggleContainer = (e) => {
    if(e.type == 'click'){
        document.getElementById('togglable-container').classList.toggle('cont-100');
        document.getElementById('toggle_container').classList.remove('fas fa-chevron-down');
        document.getElementById('toggle_container').classList.add('fas fa-chevron-right');
        
    }else{
        alert(`Une erreur s'est produit`)
    } 
};

// Toggle le container des formulaires
document.getElementById('toggle_container').addEventListener('click', toggleContainer);
// toggle navbar sur device max-width 700px
document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('navlist').classList.toggle('show');
})