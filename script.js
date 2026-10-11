// Cursor Glow Effect (desktop only)
const cursorGlow = document.querySelector('.cursor-glow');
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!isTouchDevice && cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    });
}

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

mobileBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for Reveal Animations
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .hover-up');

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Trigger number counter if it's the stats section
            if(entry.target.classList.contains('about-stats')) {
                const counters = document.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // ~60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + '+';
                        }
                    };
                    updateCounter();
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Dynamic Portfolio Generation
const portfolioGallery = document.getElementById('portfolio-gallery');

function getCategoryClasses(category) {
    let classes = [];
    const catLower = category.toLowerCase();
    if (catLower.includes('vídeo') || catLower.includes('video')) classes.push('video');
    if (catLower.includes('artwork')) classes.push('artwork');
    if (catLower.includes('design')) classes.push('design');
    if (catLower.includes('social')) classes.push('social');
    return classes.join(' ');
}

if (portfolioGallery && typeof projectsData !== 'undefined') {
    const currentLang = localStorage.getItem('selectedLang') || 'pt';
    Object.keys(projectsData).forEach(id => {
        const project = projectsData[id];
        const categoryClasses = getCategoryClasses(project.category.pt);
        
        let mediaHtml = '';
        if (project.type === 'video') {
            mediaHtml = `<video data-src="${project.url}" loop muted playsinline preload="none" class="portfolio-lazy-video"></video>`;
        } else {
            mediaHtml = `<img src="${project.url}" alt="${project.title[currentLang] || project.title.pt}" loading="lazy" decoding="async">`;
        }

        const projectCategory = project.category[currentLang] || project.category.pt;
        let tagText = '';
        if (project.type === 'video') {
            tagText = currentLang === 'pt' ? 'Vídeo' : 'Video';
        } else if (projectCategory.includes('Artwork') || projectCategory.includes('Arte')) {
            tagText = 'Artwork';
        } else {
            tagText = currentLang === 'es' ? 'Diseño y Social' : 'Design & Social';
        }
        
        const projectTitle = project.title[currentLang] || project.title.pt;

        const itemHtml = `
            <div class="portfolio-item glass reveal" data-category="${categoryClasses}">
                <div class="portfolio-img">
                    ${mediaHtml}
                    <div class="portfolio-overlay">
                        <span class="category-tag" data-project-id="${id}" data-type="tag">${tagText}</span>
                        <h3 data-project-id="${id}" data-type="title">${projectTitle}</h3>
                        <a href="project.html?id=${id}" class="view-project">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        `;
        portfolioGallery.insertAdjacentHTML('beforeend', itemHtml);
    });

    // Observe newly added portfolio items for scroll animation
    const newRevealElements = portfolioGallery.querySelectorAll('.reveal');
    if (typeof revealObserver !== 'undefined') {
        newRevealElements.forEach(el => revealObserver.observe(el));
    }

    // Lazy load and autoplay/pause videos on scroll
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const vid = entry.target;
                if (entry.isIntersecting) {
                    if (!vid.src && vid.dataset.src) {
                        vid.src = vid.dataset.src;
                    }
                    vid.play().catch(() => {});
                } else {
                    if (vid.src) {
                        vid.pause();
                    }
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0.1 });

        portfolioGallery.querySelectorAll('.portfolio-lazy-video').forEach(vid => {
            videoObserver.observe(vid);
        });
    } else {
        portfolioGallery.querySelectorAll('.portfolio-lazy-video').forEach(vid => {
            if (vid.dataset.src) vid.src = vid.dataset.src;
        });
    }
}

// Portfolio Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category').split(' ');
            if (filterValue === 'all' || categories.includes(filterValue)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Abstract Canvas Animation for Hero Section
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        particles = [];
        const numParticles = window.innerWidth < 480 ? 30 : window.innerWidth < 768 ? 50 : 100;
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

// Why Me Video Modal Logic
const btnWhyMe = document.getElementById('btn-why-me');
const whyMeModal = document.getElementById('why-me-modal');
const whyMeVideo = document.getElementById('why-me-video');
const closeModalBtn = document.getElementById('close-modal-btn');

if (btnWhyMe && whyMeModal && whyMeVideo && closeModalBtn) {
    const openModal = () => {
        whyMeModal.classList.add('active');
        whyMeVideo.play().catch(err => console.log('Play state failed or prevented:', err));
        
        // Request fullscreen on video
        if (whyMeVideo.requestFullscreen) {
            whyMeVideo.requestFullscreen();
        } else if (whyMeVideo.webkitRequestFullscreen) { // Safari
            whyMeVideo.webkitRequestFullscreen();
        } else if (whyMeVideo.msRequestFullscreen) { // IE11
            whyMeVideo.msRequestFullscreen();
        }
    };

    const closeModal = () => {
        whyMeModal.classList.remove('active');
        whyMeVideo.pause();
        whyMeVideo.currentTime = 0;
        
        // Exit fullscreen if active
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };

    btnWhyMe.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // Close on clicking outside container
    whyMeModal.addEventListener('click', (e) => {
        if (e.target === whyMeModal) {
            closeModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && whyMeModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Sync state when exiting fullscreen natively
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (whyMeModal.classList.contains('active')) {
                closeModal();
            }
        }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
}

// ========================================
// EASTER EGGS
// ========================================

// Toast helper
function showEasterEggToast(msg, customStyle, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'glass';
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;padding:15px 30px;border-radius:30px;color:white;font-weight:bold;background:rgba(255,255,255,0.1);transition:opacity 0.5s;' + (customStyle || '');
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, duration);
}

function getEasterEggMsg(key, defaultMsg) {
    const currentLang = localStorage.getItem('selectedLang') || 'pt';
    if (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    return defaultMsg;
}

// Easter Egg 1: Confetti on logo click
let logoClickCount = 0;
const logoElements = document.querySelectorAll('.brand');
logoElements.forEach(logo => {
    logo.addEventListener('click', (e) => {
        logoClickCount++;
        if (logoClickCount === 5) {
            e.preventDefault();
            startConfetti();
            
            const currentLang = localStorage.getItem('selectedLang') || 'pt';
            const msg = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang].easter_egg_creative) 
                        ? translations[currentLang].easter_egg_creative : "<a href='#contact' style='color:#fff;text-decoration:underline;pointer-events:auto;'>Você está precisando de uma direção criativa?</a>";
            showEasterEggToast(msg, "pointer-events:auto;", 4000);
            logoClickCount = 0;
        }
        clearTimeout(logo.resetTimer);
        logo.resetTimer = setTimeout(() => { logoClickCount = 0; }, 2000);
    });
});

function startConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    
    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360,
            spin: Math.random() * 5 - 2.5
        });
    }

    let animationFrame;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        pieces.forEach(p => {
            p.y += p.speed;
            p.angle += p.spin;
            ctx.save();
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
            if (p.y < canvas.height) active = true;
        });
        if (active) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }
    animate();
}

function startParticleEffect(type) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const numParticles = type === 'spore' ? 100 : 80;
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 200,
            size: type === 'spore' ? Math.random() * 3 + 1 : Math.random() * 2 + 2,
            speedY: type === 'spore' ? -(Math.random() * 1 + 0.5) : -(Math.random() * 2 + 1),
            speedX: Math.random() * 1 - 0.5,
            opacity: Math.random() * 0.5 + 0.5
        });
    }

    const startTime = Date.now();
    const duration = 5000;

    function animate() {
        const elapsed = Date.now() - startTime;
        if (elapsed > duration) {
            canvas.style.transition = 'opacity 1s';
            canvas.style.opacity = '0';
            setTimeout(() => canvas.remove(), 1000);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += Math.sin(p.y * 0.02) * 0.5 + p.speedX;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            if (type === 'spore') {
                ctx.fillStyle = `rgba(144, 238, 144, ${p.opacity * (1 - elapsed/duration)})`;
            } else {
                ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity * (1 - elapsed/duration)})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(255, 215, 0, 1)';
            }
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Easter Egg 8: Guitar
const guitarIcons = document.querySelectorAll('.easter-guitar');
guitarIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        const rect = icon.getBoundingClientRect();
        for (let i = 0; i < 4; i++) {
            const note = document.createElement('span');
            note.innerText = i % 2 === 0 ? '♪' : '♫';
            note.style.cssText = `position:fixed; left:${rect.left + Math.random()*20 - 10}px; top:${rect.top}px; color:#ff9800; font-size:24px; z-index:9999; pointer-events:none; transition: all 2s ease-out; opacity:1;`;
            document.body.appendChild(note);
            setTimeout(() => {
                note.style.transform = `translate(${Math.random()*60-30}px, -150px) rotate(${Math.random()*60-30}deg)`;
                note.style.opacity = '0';
            }, 50);
            setTimeout(() => note.remove(), 2050);
        }
        const flash = document.createElement('div');
        flash.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:radial-gradient(circle, rgba(255,140,0,0.15) 0%, rgba(255,69,0,0) 80%); mix-blend-mode:screen; z-index:9998; pointer-events:none; opacity:0; transition:opacity 0.5s;';
        document.body.appendChild(flash);
        setTimeout(() => flash.style.opacity = '1', 50);
        setTimeout(() => flash.style.opacity = '0', 2000);
        setTimeout(() => flash.remove(), 2500);
    });
});

// Easter Egg 2: Konami Code (Matrix Mode)
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex] || e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            showEasterEggToast(getEasterEggMsg('easter_egg_matrix', "Matrix Mode Activated!"), "background:linear-gradient(90deg, #00ff00, #003300); color:#0f0; border: 1px solid #0f0;");
            startMatrixMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function startMatrixMode() {
    const existing = document.getElementById('matrix-canvas');
    if(existing) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;opacity:0.7;';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~'.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    const matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 33);
    
    setTimeout(() => {
        clearInterval(matrixInterval);
        canvas.style.transition = 'opacity 2s';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 2000);
    }, 10000);
}

// Easter Egg 3 & 4: Word Typed Codes
let typedKeys = '';
document.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
        typedKeys += e.key.toLowerCase();
        if (typedKeys.length > 20) typedKeys = typedKeys.slice(-20);
        
        // Easter Egg 3: Neon Mode
        if (typedKeys.endsWith('neon')) {
            document.body.classList.toggle('easter-neon');
            if (document.body.classList.contains('easter-neon')) {
                showEasterEggToast(getEasterEggMsg('easter_egg_neon', "Neon Mode Activated!"), "background: #ff00de; text-shadow: 0 0 5px #fff;");
                const style = document.createElement('style');
                style.id = 'neon-style';
                style.innerHTML = `
                    .easter-neon * {
                        box-shadow: 0 0 2px #fff, 0 0 10px #ff00de !important;
                        text-shadow: 0 0 2px #fff, 0 0 10px #00ffff !important;
                        border-color: #ff00de !important;
                        transition: all 0.5s ease;
                    }
                `;
                document.head.appendChild(style);
            } else {
                const s = document.getElementById('neon-style');
                if(s) s.remove();
            }
            typedKeys = '';
        } 
        // Easter Egg 4: Minecraft Mode
        else if (typedKeys.endsWith('mine')) {
            document.body.classList.toggle('easter-mine');
            if (document.body.classList.contains('easter-mine')) {
                showEasterEggToast(getEasterEggMsg('easter_egg_mine', "Minecraft Mode Activated!"), "background: #5a3b22; border: 2px solid #438a2e; font-family: monospace;");
                const style = document.createElement('style');
                style.id = 'mine-style';
                // Dirt block SVG pattern
                const dirtSvg = "data:image/svg+xml;utf8,<svg width='64' height='64' xmlns='http://www.w3.org/2000/svg'><rect width='64' height='64' fill='%235a3b22'/><rect x='0' y='0' width='32' height='32' fill='%23754d29'/><rect x='32' y='32' width='32' height='32' fill='%23754d29'/><rect x='0' y='0' width='64' height='16' fill='%23438a2e'/><rect x='0' y='16' width='16' height='16' fill='%23438a2e'/><rect x='32' y='16' width='16' height='16' fill='%23438a2e'/></svg>";
                style.innerHTML = `
                    .easter-mine {
                        background-image: url("${dirtSvg}") !important;
                        background-size: 64px 64px !important;
                        image-rendering: pixelated !important;
                    }
                    .easter-mine .bg-blur, .easter-mine .hero-bg-glow { display: none !important; }
                    .easter-mine * {
                        font-family: "Courier New", Courier, monospace !important;
                        border-radius: 0 !important;
                    }
                    .easter-mine .glass, .easter-mine .service-card, .easter-mine .portfolio-item {
                        background: rgba(139, 139, 139, 0.95) !important;
                        border: 4px solid #fff !important;
                        border-right-color: #555 !important;
                        border-bottom-color: #555 !important;
                        box-shadow: inset -2px -2px 0px rgba(0,0,0,0.5) !important;
                    }
                    .easter-mine .gradient-text {
                        background: none !important;
                        -webkit-text-fill-color: #fff !important;
                        color: #fff !important;
                        text-shadow: 2px 2px 0 #000;
                    }
                `;
                document.head.appendChild(style);
            } else {
                const s = document.getElementById('mine-style');
                if(s) s.remove();
            }
            typedKeys = '';
        }
        // Easter Egg 5: Listen Mode
        else if (typedKeys.endsWith('listen')) {
            showEasterEggToast(getEasterEggMsg('easter_egg_listen', "Listen Mode Activated!"), "background: #555;");
            document.body.classList.add('easter-listen');
            const style = document.createElement('style');
            style.id = 'listen-style';
            style.innerHTML = `
                .easter-listen { filter: grayscale(100%); transition: filter 1s ease; }
                .easter-listen a, .easter-listen button, .easter-listen .portfolio-item, .easter-listen .service-card {
                    animation: pulse-white 1.5s infinite;
                }
                @keyframes pulse-white {
                    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }
            `;
            document.head.appendChild(style);
            setTimeout(() => {
                document.body.classList.remove('easter-listen');
                const s = document.getElementById('listen-style');
                if(s) s.remove();
            }, 5000);
            typedKeys = '';
        }
        // Easter Egg 6: Spore Mode
        else if (typedKeys.endsWith('spore')) {
            showEasterEggToast(getEasterEggMsg('easter_egg_spore', "Spore Mode Activated!"), "background: #3e8e41;");
            startParticleEffect('spore');
            typedKeys = '';
        }
        // Easter Egg 7: Glow Mode
        else if (typedKeys.endsWith('glow')) {
            showEasterEggToast(getEasterEggMsg('easter_egg_glow', "Glow Mode Activated!"), "background: #ffc107; color: #000;");
            startParticleEffect('glow');
            typedKeys = '';
        }
        // Easter Egg 9: Axe (God of War)
        else if (typedKeys.endsWith('axe')) {
            showEasterEggToast(getEasterEggMsg('easter_egg_axe', "Axe Mode Activated!"), "background: #1a5c7a;");
            startAxeAnimation();
            typedKeys = '';
        }
        // Easter Egg 10: Chaos (God of War)
        else if (typedKeys.endsWith('chaos')) {
            showEasterEggToast(getEasterEggMsg('easter_egg_chaos', "Chaos Mode Activated!"), "background: #8b0000;");
            startChaosAnimation();
            typedKeys = '';
        }
    }
});

function startAxeAnimation() {
    const axe = document.createElement('div');
    axe.innerHTML = `<svg viewBox="0 0 24 24" width="60" height="60" stroke="#b0e0e6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 12L4 22"/><path d="M12 10l-2-2"/><path d="M18 10c-3-3-6-3-6 0s3 3 6 0z"/><path d="M16 8l2-2c1-1 3-1 3 1s-1 3-1 3l-2 2"/></svg>`;
    axe.style.cssText = 'position:fixed; bottom:-80px; left:-80px; z-index:9999; pointer-events:none; filter: drop-shadow(0 0 10px #b0e0e6);';
    document.body.appendChild(axe);
    
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    let startTime = null;
    const duration = 2000;
    
    function animateAxe(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration; 
        
        if (progress < 1) {
            const p = progress * 2; 
            let currentX, currentBottom, rotate;
            
            if (p <= 1) {
                currentX = -80 + (screenW + 160) * p;
                currentBottom = (screenH * 0.5) * Math.sin(p * Math.PI);
            } else {
                const backP = p - 1;
                currentX = screenW + 80 - (screenW + 160) * backP;
                currentBottom = (screenH * 0.5) * Math.sin((1-backP) * Math.PI);
            }
            rotate = progress * 2160; 
            
            axe.style.transform = `translate(${currentX - (-80)}px, ${-currentBottom}px) rotate(${rotate}deg)`;
            
            if (Math.random() > 0.4) {
                const trail = document.createElement('div');
                trail.style.cssText = `position:fixed; left:${currentX+30}px; bottom:${currentBottom-30}px; width:15px; height:15px; background:radial-gradient(circle, rgba(176,224,230,1) 0%, rgba(0,191,255,0) 70%); border-radius:50%; box-shadow:0 0 10px #b0e0e6; pointer-events:none; z-index:9998; transition:all 0.5s ease-out; transform:translate(-50%,50%);`;
                document.body.appendChild(trail);
                setTimeout(() => {
                    trail.style.transform = `translate(-50%,50%) scale(0.2)`;
                    trail.style.opacity = '0';
                }, 20);
                setTimeout(() => trail.remove(), 520);
            }
            requestAnimationFrame(animateAxe);
        } else {
            axe.remove();
        }
    }
    requestAnimationFrame(animateAxe);
}

function startChaosAnimation() {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    
    function createBlade(startX, endX) {
        const blade = document.createElement('div');
        blade.innerHTML = `<svg viewBox="0 0 24 24" width="50" height="50" stroke="#ff4500" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M8 8h8"/><path d="M12 2C8 6 8 12 12 16c4-4 4-10 0-14z"/></svg>`;
        blade.style.cssText = `position:fixed; top:-60px; left:${startX}px; z-index:9999; pointer-events:none; filter: drop-shadow(0 0 15px #ff4500);`;
        document.body.appendChild(blade);
        
        let startTime = null;
        const duration = 1200;
        
        function animateBlade(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;
            
            if (progress < 1) {
                const x = startX + (endX - startX) * progress;
                const arcOffset = Math.sin(progress * Math.PI) * (startX < endX ? 100 : -100);
                const currentX = x + arcOffset;
                const currentY = -60 + (screenH + 120) * progress;
                const rotate = progress * 1080;
                
                blade.style.transform = `translate(${currentX - startX}px, ${currentY - (-60)}px) rotate(${rotate}deg)`;
                
                if (Math.random() > 0.2) {
                    const trail = document.createElement('div');
                    trail.style.cssText = `position:fixed; left:${currentX+25}px; top:${currentY+25}px; width:20px; height:20px; background:radial-gradient(circle, rgba(255,69,0,1) 0%, rgba(255,0,0,0) 70%); border-radius:50%; pointer-events:none; z-index:9998; transition:all 0.3s ease-out; transform:translate(-50%,-50%); mix-blend-mode:screen;`;
                    document.body.appendChild(trail);
                    setTimeout(() => {
                        trail.style.transform = `translate(-50%,-50%) scale(1.5)`;
                        trail.style.opacity = '0';
                    }, 10);
                    setTimeout(() => trail.remove(), 310);
                }
                requestAnimationFrame(animateBlade);
            } else {
                blade.remove();
            }
        }
        requestAnimationFrame(animateBlade);
    }
    
    createBlade(-50, screenW + 50); 
    createBlade(screenW + 50, -50); 
}
