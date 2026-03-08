/* === NAVEED PORTFOLIO — script.js (optimized) === */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Cache DOM references (query once, reuse) ── */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');
    const backTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section[id]');

    /* ── Copyright year ── */
    document.getElementById('current-year').textContent = new Date().getFullYear();

    /* ══════════════════════════════════════
       SINGLE SCROLL HANDLER (via rAF)
       All scroll-based logic runs inside one
       requestAnimationFrame loop for performance.
    ══════════════════════════════════════ */
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;

        // Sticky navbar
        navbar.classList.toggle('scrolled', y > 60);

        // Back-to-top button visibility
        backTop.classList.toggle('visible', y > 400);

        // Active nav link highlight
        let current = '';
        sections.forEach(s => { if (y >= s.offsetTop - 100) current = s.id; });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    onScroll(); // Run once on load

    /* ══════════════════════════════════════
       MOBILE HAMBURGER MENU
    ══════════════════════════════════════ */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close menu on link click or outside click
    links.forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('click', e => { if (!navbar.contains(e.target)) closeMenu(); });

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    }

    /* ══════════════════════════════════════
       TYPEWRITER EFFECT
    ══════════════════════════════════════ */
    const el = document.getElementById('typed-text');
    const words = ['Web Developer', 'Frontend Engineer', 'JavaScript Dev', 'Freelancer', 'Problem Solver'];
    let wi = 0, ci = 0, del = false;

    (function type() {
        const w = words[wi];
        el.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);

        let wait = del ? 60 : 100;
        if (!del && ci === w.length) { wait = 2000; del = true; }
        else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; wait = 400; }

        setTimeout(type, wait);
    })();

    /* ══════════════════════════════════════
       SCROLL ANIMATIONS (IntersectionObserver)
    ══════════════════════════════════════ */
    // Named ref so we can call unobserve — re-assign after construction
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const i = [...entry.target.parentElement.children].indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('aos-animate'), Math.min(i * 100, 400));
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    //document.querySelectorAll('[data-aos]').forEach(el => obs.observe(el));
     setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach(el => obs.observe(el));
    }, 100);
    /* ══════════════════════════════════════
       SKILL BAR ANIMATIONS
    ══════════════════════════════════════ */
    const barObs = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            target.style.width = target.dataset.width + '%';
            barObs.unobserve(target);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-bar').forEach(b => barObs.observe(b));

    /* ══════════════════════════════════════
       CONTACT FORM VALIDATION
    ══════════════════════════════════════ */
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    const success = document.getElementById('form-success');
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const err = (id, msg) => document.getElementById(id).textContent = msg;
    const clr = () => document.querySelectorAll('.form-error').forEach(e => e.textContent = '');

    form.addEventListener('submit', e => {
        e.preventDefault();
        clr();
        const name = document.getElementById('name').value.trim();
        const mail = document.getElementById('email').value.trim();
        const msg = document.getElementById('message').value.trim();
        let ok = true;

        if (name.length < 2) { err('name-error', 'Enter your full name (min 2 chars).'); ok = false; }
        if (!emailRx.test(mail)) { err('email-error', 'Enter a valid email address.'); ok = false; }
        if (msg.length < 10) { err('message-error', 'Message must be at least 10 characters.'); ok = false; }
        if (!ok) return;

        // Show loading spinner, then submit for real to Formspree
        const icon = btn.querySelector('i'), span = btn.querySelector('span');
        btn.disabled = true; icon.className = 'fas fa-spinner fa-spin'; span.textContent = 'Sending…';

        // Brief delay so spinner is visible, then submit
        setTimeout(() => form.submit(), 600);
    });

    /* ══════════════════════════════════════
       SMOOTH SCROLL (navbar-offset aware)
    ══════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - navbar.offsetHeight, behavior: 'smooth' });
        });
    });

    /* ── Back-to-top click ── */
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
