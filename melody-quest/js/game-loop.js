/* ==================== GAME LOOP - MELODY QUEST ==================== */

class GameLoop {
    constructor() {
        this.isRunning = false;
        this.frameCount = 0;
        this.noteSpawnCounter = 0;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.setupEventListeners();
        this.startRenderLoop();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('click', (e) => this.onMouseClick(e));
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);

            if (this.isRunning) {
                this.update();
            }

            if (window.melodyScene) {
                window.melodyScene.render();
            }
        };

        animate();
    }

    update() {
        this.frameCount++;

        // Spawn note periodicamente
        if (this.frameCount % (Math.max(1, 60 / (GAME_CONFIG.NOTE_SPAWN_RATE * 60))) === 0) {
            this.spawnRandomNote();
        }

        // Anima boss
        if (window.melodyScene && window.melodyScene.boss) {
            this.animateBoss();
        }
    }

    spawnRandomNote() {
        const x = (Math.random() - 0.5) * 20;
        const y = 15;
        window.melodyScene?.spawnNote(x, y);
    }

    animateBoss() {
        // Boss animation is handled in three-scene.js
    }

    onMouseMove(event) {
        // Calcola coordinate normalized del mouse
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseClick(event) {
        if (!window.melodyScene || !this.isRunning) return;

        // Raycast per trovare note cliccate
        this.raycaster.setFromCamera(this.mouse, window.melodyScene.camera);
        const intersects = this.raycaster.intersectObjects(window.melodyScene.notes);

        if (intersects.length > 0) {
            const clickedNote = intersects[0].object;
            this.handleNoteClick(clickedNote);
        }
    }

    onKeyDown(event) {
        if (event.key === 'Escape' || event.key === 'p') {
            window.gameManager?.togglePause();
        }
    }

    handleNoteClick(note) {
        if (note.clicked) return;

        note.clicked = true;

        // Effetto particellare quando nota è cliccata
        this.createClickEffect(note.position);

        // Calcola score
        const distance = Math.abs(note.position.y - (-5));
        const maxDistance = 5;
        const accuracy = Math.max(0, 1 - (distance / maxDistance));
        const baseScore = GAME_CONFIG.SCORE_PER_NOTE;
        const comboMultiplier = 1 + (window.gameManager?.combo || 0) * 0.1;
        const score = Math.round(baseScore * accuracy * comboMultiplier);

        // Aggiorna game manager
        window.gameManager?.addScore(score, accuracy);

        // Rimuovi nota
        window.melodyScene?.scene.remove(note);
        const noteIndex = window.melodyScene.notes.indexOf(note);
        if (noteIndex > -1) {
            window.melodyScene.notes.splice(noteIndex, 1);
        }

        return accuracy;
    }

    createClickEffect(position) {
        const particleCount = 20;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 0.1 + Math.random() * 0.2;

            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;

            velocities.push({
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed,
                z: (Math.random() - 0.5) * speed
            });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.3,
            color: 0xffaa00,
            transparent: true,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        window.melodyScene?.scene.add(particles);

        // Anima particelle
        let lifespan = 30;
        const animateParticles = setInterval(() => {
            lifespan--;
            material.opacity = lifespan / 30;

            if (lifespan <= 0) {
                window.melodyScene?.scene.remove(particles);
                clearInterval(animateParticles);
            }
        }, 16);
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    pause() {
        this.isRunning = false;
    }

    resume() {
        this.isRunning = true;
    }
}

// Inizializza il game loop globalmente
window.gameLoop = new GameLoop();

console.log('✅ GAME LOOP LOADED');
