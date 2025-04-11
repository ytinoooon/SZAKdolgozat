// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Simulation card click handlers
document.querySelectorAll('.sim-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on the explore button
        if (!e.target.closest('.explore-btn')) {
            const simId = card.getAttribute('data-sim');
            window.location.href = `simulation${simId}.html`;
        }
    });
    
    // Explicit handler for explore buttons
    const exploreBtn = card.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const simId = card.getAttribute('data-sim');
            window.location.href = `simulation${simId}.html`;
        });
    }
});

// Initialize any visualizations
document.addEventListener('DOMContentLoaded', () => {
    // Could initialize small p5.js visualizations here
});