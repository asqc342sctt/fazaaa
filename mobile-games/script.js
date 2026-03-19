// ===== MOBILE MENU =====
const burger = document.getElementById('burgerBtn');
const mobileNav = document.getElementById('mobileNav');
burger?.addEventListener('click', () => mobileNav.classList.toggle('open'));
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ===== FILTER LOGIC =====
const chips = document.querySelectorAll('.chip[data-chip]');
const catCards = document.querySelectorAll('.category-card[data-filter]');
const gameCards = document.querySelectorAll('.game-card[data-type]');
const searchInput = document.getElementById('searchInput');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');

let currentFilter = 'all';
let searchQuery = '';

function updateGrid() {
    let count = 0;
    gameCards.forEach(card => {
        const type = card.dataset.type;
        const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
        const matchFilter = currentFilter === 'all' || type === currentFilter;
        const matchSearch = searchQuery === '' || name.includes(searchQuery) || desc.includes(searchQuery);
        const show = matchFilter && matchSearch;
        card.classList.toggle('hidden', !show);
        if (show) count++;
    });
    resultsCount.textContent = count;
    noResults.classList.toggle('show', count === 0);
}

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.chip;
        // Sync category cards
        catCards.forEach(c => c.classList.toggle('active', c.dataset.filter === currentFilter));
        updateGrid();
    });
});

catCards.forEach(cat => {
    cat.addEventListener('click', () => {
        catCards.forEach(c => c.classList.remove('active'));
        cat.classList.add('active');
        currentFilter = cat.dataset.filter;
        // Sync chips
        chips.forEach(c => c.classList.toggle('active', c.dataset.chip === currentFilter));
        updateGrid();
        document.getElementById('gamesGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    updateGrid();
});

// Initial count
updateGrid();

// ===== CARD CLICK NAVIGATION =====
document.getElementById('gamesContainer')?.addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (card && !e.target.closest('a')) {
        const link = card.querySelector('a');
        if (link) window.location.href = link.href;
    }
});

// ===== INTERSECTION OBSERVER for animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; observer.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll('.why-card, .category-card, .top-game-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.5s ease';
    observer.observe(el);
});
