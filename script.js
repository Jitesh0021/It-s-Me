// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. CUSTOM CURSOR
       ========================================= */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    // Only activate on desktop
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay (animation in CSS could handle transition, but JS precise)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .magnetic');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    /* =========================================
       2. MOBILE MENU
       ========================================= */
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    /* =========================================
       3. THREE.JS 3D BACKGROUND
       ========================================= */
    initThreeJsBackground();

    /* =========================================
       4. NEURAL NETWORK CANVAS
       ========================================= */
    initNeuralNetwork();

    /* =========================================
       5. INTERSECTION OBSERVER FOR ANIMATIONS
       ========================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial check for elements with data-aos attribute
    // Note: CSS for 'aos-animate' needs to be added or use a library. 
    // Since we are building from scratch, let's inject simple CSS for this animation logic
    // We already added classes in HTML, now we add the logic.
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add event listener to handle the class addition
    document.addEventListener('scroll', () => {
        document.querySelectorAll('.aos-animate').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });

        // Manual trigger for items in view on load
        document.querySelectorAll('[data-aos]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });

    /* =========================================
       6. LOADER & HERO ANIMATION
       ========================================= */
    const loader = document.getElementById('loader');
    const heroElements = [
        document.querySelector('.navbar'),
        document.querySelector('.hero-content'),
        document.querySelector('.hero-visual'),
        document.querySelector('.scroll-down')
    ];

    // Hide hero elements initially
    heroElements.forEach(el => {
        if (el) el.classList.add('hero-animate');
    });

    window.addEventListener('load', () => {
        // Reduced motion check
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        setTimeout(() => {
            if (loader) loader.classList.add('loaded');

            // Trigger hero animations
            if (!prefersReducedMotion) {
                heroElements.forEach((el, index) => {
                    if (el) {
                        setTimeout(() => {
                            el.classList.add('hero-visible');
                        }, 300 + (index * 200)); // Staggered delay
                    }
                });
            } else {
                // Instant show for reduced motion
                heroElements.forEach(el => {
                    if (el) {
                        el.classList.add('hero-visible');
                        el.style.transition = 'none';
                    }
                });
            }

        }, 1500); // minimum load time for effect
    });

    /* =========================================
       7. RESUME GENERATOR
       ========================================= */
    const downloadBtn = document.getElementById('download-resume');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generateResume);
    }

    function generateResume() {
        const printContent = document.getElementById('resume-print-content');
        if (!printContent) return;

        // Populate content dynamically from the site
        // Summary
        const summaryText = document.querySelector('.about-content p').innerText + " " + document.querySelector('.about-content p:nth-of-type(2)').innerText;
        document.getElementById('print-summary').innerText = summaryText;

        // Skills (convert tags to list)
        const skillsContainer = document.getElementById('print-skills');
        skillsContainer.innerHTML = '';
        const skillCats = document.querySelectorAll('.skill-category');
        const skillsList = document.createElement('ul');
        skillCats.forEach(cat => {
            const catName = cat.querySelector('h3').innerText;
            const tags = Array.from(cat.querySelectorAll('.skill-tag')).map(t => t.innerText).join(', ');
            const li = document.createElement('li');
            li.innerHTML = `<strong>${catName}:</strong> ${tags}`;
            skillsList.appendChild(li);
        });
        skillsContainer.appendChild(skillsList);

        // Projects
        const projectsContainer = document.getElementById('print-projects');
        projectsContainer.innerHTML = '';
        const projectCards = document.querySelectorAll('.project-card');
        const projList = document.createElement('ul');
        projectCards.forEach(card => {
            const title = card.querySelector('.project-title').innerText;
            const desc = card.querySelector('.project-desc').innerText;
            const tech = Array.from(card.querySelectorAll('.tech-tag')).map(t => t.innerText).join(', ');
            const li = document.createElement('li');
            li.innerHTML = `<strong>${title}</strong> (${tech}): ${desc}`;
            projList.appendChild(li);
        });
        projectsContainer.appendChild(projList);

        // Achievements
        const achContainer = document.getElementById('print-achievements');
        achContainer.innerHTML = '';
        const achCards = document.querySelectorAll('.achievement-card');
        const achList = document.createElement('ul');
        achCards.forEach(card => {
            const title = card.querySelector('.achievement-info h3').innerText;
            const desc = card.querySelector('.achievement-info p').innerText;
            const li = document.createElement('li');
            li.innerHTML = `<strong>${title}:</strong> ${desc}`;
            achList.appendChild(li);
        });
        achContainer.appendChild(achList);

        // Generate PDF
        printContent.style.display = 'block'; // Show temporarily for rendering

        const opt = {
            margin: 0.5,
            filename: 'Jitesh_Choudhary_Resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Use a promise to handle the async generation
        html2pdf().from(printContent).set(opt).save().then(() => {
            printContent.style.display = 'none'; // Hide again
        });
    }

    /* =========================================
       8. CHATBOT LOGIC
       ========================================= */
    const chatContainer = document.getElementById('chatbot-container');
    const chatToggle = document.getElementById('chat-toggle-btn');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Make global for inline onclick
    window.sendSuggestion = (text) => {
        handleUserMessage(text);
    };

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatContainer.classList.remove('active');
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const text = chatInput.value.trim();
            if (text) handleUserMessage(text);
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = chatInput.value.trim();
                if (text) handleUserMessage(text);
            }
        });
    }

    function handleUserMessage(text) {
        // Add user message
        addMessage(text, 'user-message');
        chatInput.value = '';

        // Simulate typing delay
        setTimeout(() => {
            const response = getBotResponse(text);
            addMessage(response, 'bot-message');
        }, 800);
    }

    function addMessage(text, className) {
        const div = document.createElement('div');
        div.className = `message ${className}`;
        div.innerText = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('skill') || lowerInput.includes('technology') || lowerInput.includes('stack')) {
            return "I am proficient in C, C++, Python, Java, JavaScript, and Web Technologies (HTML/CSS). I also work with Cloud (AWS/Azure) and AI tools.";
        }
        if (lowerInput.includes('project') || lowerInput.includes('work')) {
            return "Some of my featured projects are the Particle Gesture System (AI/Computer Vision) and InfoGuardAI (Misinformation Detection). You can see more in the Projects section!";
        }
        if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('reach')) {
            return "You can reach me at cjitesh775@gmail.com or connect with me on LinkedIn!";
        }
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! How can I help you today?";
        }
        if (lowerInput.includes('resume') || lowerInput.includes('cv') || lowerInput.includes('download')) {
            return "You can download my resume using the 'PDF' button in the intro section.";
        }

        return "I'm still learning! Please check the About section for more details about my background.";
    }

    /* =========================================
       9. ANALYTICS LOGIC (MOCK)
       ========================================= */
    // Initialize stats if not present
    if (!localStorage.getItem('visitorCount')) localStorage.setItem('visitorCount', '0');
    if (!localStorage.getItem('downloadCount')) localStorage.setItem('downloadCount', '0');
    if (!localStorage.getItem('sectionViews')) localStorage.setItem('sectionViews', JSON.stringify({}));

    // Increment visitor count (simple session check could be added, but keeping it simple)
    let visitors = parseInt(localStorage.getItem('visitorCount'));
    // Only increment once per session to avoid spamming
    if (!sessionStorage.getItem('visited')) {
        visitors++;
        localStorage.setItem('visitorCount', visitors.toString());
        sessionStorage.setItem('visited', 'true');
    }

    // Track Downloads
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            let downloads = parseInt(localStorage.getItem('downloadCount'));
            downloads++;
            localStorage.setItem('downloadCount', downloads.toString());
            // Also call generateResume (already attached)
        });
    }

    // Track Section Views using the existing observer or a new one
    // We already have an observer, let's piggyback or add a new one for specific tracking
    const trackingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (id) {
                    let views = JSON.parse(localStorage.getItem('sectionViews'));
                    views[id] = (views[id] || 0) + 1;
                    localStorage.setItem('sectionViews', JSON.stringify(views));
                }
            }
        });
    }, { threshold: 0.5 }); // Count when 50% visible

    document.querySelectorAll('section').forEach(section => {
        trackingObserver.observe(section);
    });

    // Dashboard UI
    const dashboard = document.getElementById('analytics-dashboard');
    const adminTrigger = document.getElementById('admin-trigger');
    const closeDashboard = document.getElementById('close-dashboard');

    if (adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            updateDashboard();
            dashboard.classList.add('active');
        });
    }

    if (closeDashboard) {
        closeDashboard.addEventListener('click', () => {
            dashboard.classList.remove('active');
        });
    }

    function updateDashboard() {
        if (!dashboard) return;

        document.getElementById('total-visitors').innerText = localStorage.getItem('visitorCount');
        document.getElementById('total-downloads').innerText = localStorage.getItem('downloadCount');

        const views = JSON.parse(localStorage.getItem('sectionViews'));
        const chartContainer = document.getElementById('views-chart');
        chartContainer.innerHTML = '';

        // Find max for scaling
        let maxViews = 0;
        for (let key in views) {
            if (views[key] > maxViews) maxViews = views[key];
        }

        for (let key in views) {
            if (key === 'home' || key === 'about' || key === 'skills' || key === 'projects' || key === 'achievements' || key === 'contact') {
                const count = views[key];
                const percentage = maxViews > 0 ? (count / maxViews) * 100 : 0;

                const barHTML = `
                    <div class="bar-container">
                        <div class="bar-label">
                            <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            <span>${count}</span>
                        </div>
                        <div class="bar-bg">
                            <div class="bar-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
                chartContainer.innerHTML += barHTML;
            }
        }
    }
});

/* =========================================
   Function: Three.js Background
   ========================================= */
function initThreeJsBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Mobile Optimization: Skip heavy 3D on small screens
    if (window.innerWidth < 768) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // PARTICLES / SHAPES
    const geometry = new THREE.IcosahedronGeometry(10, 1); // Low poly sphere
    const material = new THREE.MeshBasicMaterial({
        color: 0x5271ff,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add random floating cubes
    const cubes = [];
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < 50; i++) {
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x5271ff : 0x9d4edd, // Blue or Purple
            transparent: true,
            opacity: 0.1
        });

        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // Random pos
        cube.position.x = (Math.random() - 0.5) * 100;
        cube.position.y = (Math.random() - 0.5) * 60;
        cube.position.z = (Math.random() - 0.5) * 40;

        // Random rot
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;

        // Random scale
        const scale = Math.random() * 2;
        cube.scale.set(scale, scale, scale);

        scene.add(cube);
        cubes.push({
            mesh: cube,
            speedX: (Math.random() - 0.5) * 0.02,
            speedY: (Math.random() - 0.5) * 0.02,
            rotSpeed: (Math.random() - 0.5) * 0.02
        });
    }

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // ANIMATE
    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Big sphere rotation
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;

        // Parallax easing
        sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
        sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

        // Update Cubes
        cubes.forEach(c => {
            c.mesh.rotation.x += c.rotSpeed;
            c.mesh.rotation.y += c.rotSpeed;

            c.mesh.position.x += c.speedX;
            c.mesh.position.y += c.speedY;

            // Loop interactivity
            // (Wrap around logic skipped for simplicity, keeping them floating endlessly)
        });

        renderer.render(scene, camera);
    };

    animate();

    // RESIZE
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* =========================================
   Function: Neural Network Animation
   ========================================= */
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width, height;
    let nodes = [];

    // Configuration
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 30 : 60; // Fewer nodes on mobile
    const connectDistance = isMobile ? 100 : 150;
    const nodeSpeed = 0.5;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * nodeSpeed;
            this.vy = (Math.random() - 0.5) * nodeSpeed;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(82, 113, 255, 0.5)'; // Blue nodes
            ctx.fill();
        }
    }

    function init() {
        resize();
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();

            // Connect to nearby nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectDistance) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);

                    // Opacity based on distance
                    const alpha = 1 - (dist / connectDistance);
                    ctx.strokeStyle = `rgba(157, 78, 221, ${alpha * 0.2})`; // Purple lines
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        init();
    });

    init();
    animate();
}
