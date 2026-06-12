const routes = {
  '/':      'page-home',
  '/blog':  'page-blog',
  '/about': 'page-about',
};

function navigate() {
  const hash = location.hash.replace('#', '') || '/';

  // Hide all pages
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));

  // Update nav
  document.querySelectorAll('nav a').forEach(a => {
    const path = a.getAttribute('href').replace('#', '');
    a.classList.toggle('active', path === hash);
  });

  // Show matching page, fall back to 404
  const pageId = routes[hash] || 'page-404';
  document.getElementById(pageId).classList.add('active');
}

window.addEventListener('hashchange', navigate);
navigate(); // run on load
