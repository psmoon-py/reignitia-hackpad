// ==========================================
// REIGNITIA - MAIN JAVASCRIPT
// Mission Control for Students
// ==========================================

(function() {
    'use strict';

    // ===== PAGE INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', () => {
        const page = document.body.dataset.page;
        
        // Global initializations
        initMeteorCanvas();
        
        // Page-specific initializations
        if (page === 'root') {
            initRootPage();
        } else if (page === 'story') {
            initStoryPage();
        } else if (page === 'dashboard') {
            initDashboardPage();
        } else if (page === 'lab-learn-orbits') {
            initLearnOrbitsLab();
        } else if (page === 'lab-money-lab') {
            initMoneyLab();
        } else if (page === 'lab-wellbeing') {
            initWellbeingLab();
        } else if (page === 'lab-time-focus') {
            initTimeFocusLab();
        } else if (page === 'lab-opportunity-radar') {
            initOpportunityRadarLab();
        } else if (page === 'lab-peer-dock') {
            initPeerDockLab();
        }
    });

    // ===== METEOR CANVAS ANIMATION =====
    function initMeteorCanvas() {
        const canvas = document.getElementById('meteors-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let dpr = Math.max(1, window.devicePixelRatio || 1);
        
        function resize() {
            dpr = Math.max(1, window.devicePixelRatio || 1);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        
        window.addEventListener('resize', resize, { passive: true });
        resize();

        const meteors = [];
        const particles = [];

        let lastSpawn = 0;
        const spawnDelay = 3000;
        const maxMeteors = 3;

        const rand = (a, b) => Math.random() * (b - a) + a;

        function spawnMeteor() {
            if (meteors.length >= maxMeteors) return;

            const w = window.innerWidth;
            const h = window.innerHeight;
            const startSide = Math.random() < 0.5 ? 'left' : 'top';

            let x0, y0, x1, y1;
            
            if (startSide === 'left') {
                x0 = -50;
                y0 = Math.random() * h * 0.5;
                x1 = w + 50;
                y1 = y0 + Math.random() * h * 0.3;
            } else {
                x0 = Math.random() * w;
                y0 = -50;
                x1 = x0 + (Math.random() - 0.5) * w * 0.5;
                y1 = h + 50;
            }

            meteors.push({
                x0, y0, x1, y1,
                progress: 0,
                speed: 0.3 + Math.random() * 1.0,
                size: 1.5 + Math.random() * 2,
                trail: []
            });
        }

        function drawMeteor(m) {
            m.progress += m.speed * 0.01;
            if (m.progress > 1) return true;

            const x = m.x0 + (m.x1 - m.x0) * m.progress;
            const y = m.y0 + (m.y1 - m.y0) * m.progress;

            m.trail.push({ x, y, opacity: 1 });
            if (m.trail.length > 15) m.trail.shift();

            for (let i = 0; i < m.trail.length; i++) {
                m.trail[i].opacity *= 0.95;
            }

            ctx.strokeStyle = 'rgba(74, 144, 226, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            for (let i = 0; i < m.trail.length; i++) {
                const p = m.trail[i];
                ctx.globalAlpha = p.opacity * 0.5;
                if (i === 0) {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            }
            
            ctx.stroke();
            ctx.globalAlpha = 1;

            const g = ctx.createRadialGradient(x, y, 0, x, y, m.size);
            g.addColorStop(0, 'rgba(74,144,226,1)');
            g.addColorStop(0.5, 'rgba(80,200,240,0.5)');
            g.addColorStop(1, 'rgba(255,140,66,0)');
            
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, m.size, 0, Math.PI * 2);
            ctx.fill();

            if (Math.random() < 0.08) {
                particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    life: 1,
                    size: Math.random() * 1.5
                });
            }

            return false;
        }

        function drawParticles() {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = `rgba(74, 144, 226, ${p.life * 0.4})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                lastSpawn = performance.now();
            }
        });

        function animate(ts) {
            if (!document.hidden && (ts - lastSpawn >= spawnDelay)) {
                spawnMeteor();
                lastSpawn = ts;
            }

            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

            for (let i = meteors.length - 1; i >= 0; i--) {
                if (drawMeteor(meteors[i])) {
                    meteors.splice(i, 1);
                }
            }

            drawParticles();
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }

    // ===== ROOT PAGE =====
    function initRootPage() {
        console.log('ReIgnitia Root Page Loaded');
    }

    // ===== STORY PAGE =====
    function initStoryPage() {
        console.log('ReIgnitia Story Page Loaded');
        // Story scroll animations will be initialized here
    }

    // ===== DASHBOARD PAGE =====
    function initDashboardPage() {
        console.log('ReIgnitia Dashboard Loaded');
        // Dashboard card interactions will be initialized here
    }

    // ===== LAB: LEARN ORBITS =====
    function initLearnOrbitsLab() {
        console.log('Learn Orbits Lab Loaded');
    }

    // ===== LAB: MONEY LAB =====
    function initMoneyLab() {
        console.log('Money Lab Loaded');
    }

    // ===== LAB: WELLBEING OBSERVATORY =====
    function initWellbeingLab() {
        console.log('Wellbeing Observatory Loaded');
    }

    // ===== LAB: TIME FOCUS STATION =====
    function initTimeFocusLab() {
        console.log('Time Focus Station Loaded');
    }

    // ===== LAB: OPPORTUNITY RADAR =====
    function initOpportunityRadarLab() {
        console.log('Opportunity Radar Loaded');
    }

    // ===== LAB: PEER DOCK =====
    function initPeerDockLab() {
        console.log('Peer Dock Loaded');
    }

})();
