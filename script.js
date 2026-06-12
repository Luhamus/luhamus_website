// Fetch navbar
fetch('/nav.html')
  .then(r => r.text())
  .then(html => {
    document.getElementById('nav').innerHTML = html;

    // Mark the current page link as active
    const current = window.location.pathname;
    document.querySelectorAll('nav a').forEach(a => {
      if (a.getAttribute('href') === current) {
        a.classList.add('active');
      }
    })
  })

// Fetch footer
document.getElementById('footer').innerHTML = '© 2026 Luhamus';
