/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        animateCounters();
    }, 1500);
});

/* ===== CUSTOM CURSOR ===== */
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
if (cursorDot && cursorOutline) {
    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        cursorDot.style.transform = 'translate(-50%, -50%)';
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button, .btn, .service-card, .project-card, .skill-tag').forEach(el => {
        el.addEventListener('mouseenter', () => { cursorOutline.style.transform = 'translate(-50%,-50%) scale(1.5)'; cursorOutline.style.borderColor = 'var(--gold)'; });
        el.addEventListener('mouseleave', () => { cursorOutline.style.transform = 'translate(-50%,-50%) scale(1)'; cursorOutline.style.borderColor = 'var(--gold-glow)'; });
    });
}

/* ===== PARTICLES ===== */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 168, 75, ${this.opacity})`;
            ctx.fill();
        }
    }
    for (let i = 0; i < 80; i++) particles.push(new Particle());
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(212, 168, 75, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    // Back to top
    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('visible', window.scrollY > 500);
    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === current);
    });
});
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { navToggle.classList.remove('active'); navLinks.classList.remove('active'); });
});

/* ===== TYPING EFFECT ===== */
const roles = ['Software Engineer', 'Cybersecurity Expert', 'Full-Stack Developer', 'Systems Administrator', 'Penetration Tester'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedText = document.getElementById('typedText');
function typeEffect() {
    const current = roles[roleIndex];
    if (isDeleting) {
        typedText.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    } else {
        typedText.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) { isDeleting = true; setTimeout(typeEffect, 1500); return; }
    }
    setTimeout(typeEffect, isDeleting ? 40 : 80);
}
typeEffect();

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(counter => {
        const target = +counter.dataset.count;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        function update() {
            current += step;
            if (current >= target) { counter.textContent = target; return; }
            counter.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
        update();
    });
}

/* ===== SCROLL ANIMATIONS ===== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('animated'), delay);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

/* ===== TILT EFFECT ===== */
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    setTimeout(() => {
        btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
