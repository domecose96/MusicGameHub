/* ==================== THREE.JS SCENE - MELODY QUEST ==================== */

class MelodyQuestScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentLevel = null;
        this.particles = [];
        this.notes = [];
        this.enemies = [];
        this.boss = null;

        this.initScene();
    }

    initScene() {
        const container = document.getElementById('canvas-container');

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.Fog(0x0a0e27, 100, 500);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 20);
        this.camera.lookAt(0, 0, 0);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        // Lighting
        this.setupLighting();

        // Ground
        this.createGround();

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('click', (e) => this.onMouseClick(e));
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.left = -50;
        dirLight.shadow.camera.right = 50;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = -50;
        this.scene.add(dirLight);

        // Point light (ambiente dinamico)
        const pointLight = new THREE.PointLight(0xff6600, 1);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }

    createGround() {
        const geometry = new THREE.PlaneGeometry(50, 50);
        const material = new THREE.MeshStandardMaterial({
            color: 0x1a1f3a,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.receiveShadow = true;
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);
    }

    loadArena(levelId) {
        const level = GAME_CONFIG.LEVELS[levelId - 1];
        if (!level) return;

        this.currentLevel = level;

        // Pulisci arena precedente
        this.clearArena();

        // Carica asset dell'arena (texture, modelli, ecc.)
        // Per ora creaiamo arena procedurale

        // Crea pareti decorative
        this.createArenaWalls(level.color);

        // Effetti particellari di sfondo
        this.createAmbientParticles(levelId);
    }

    createArenaWalls(color) {
        const colorNum = parseInt(color.replace('#', ''), 16);
        
        // Pareti laterali
        const wallGeometry = new THREE.BoxGeometry(2, 15, 40);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: colorNum,
            emissive: colorNum,
            emissiveIntensity: 0.3,
            roughness: 0.5,
            metalness: 0.8
        });

        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.position.set(-25, 7.5, 0);
        leftWall.castShadow = true;
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.position.set(25, 7.5, 0);
        rightWall.castShadow = true;
        this.scene.add(rightWall);

        // Parete posteriore
        const backWallGeometry = new THREE.BoxGeometry(50, 15, 2);
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.position.set(0, 7.5, -20);
        backWall.castShadow = true;
        this.scene.add(backWall);
    }

    createAmbientParticles(levelId) {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const level = GAME_CONFIG.LEVELS[levelId - 1];
        const color = new THREE.Color(level.color);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50;
            positions[i + 1] = Math.random() * 30;
            positions[i + 2] = (Math.random() - 0.5) * 50;

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.3
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }

    spawnNote(x = 0, y = 15) {
        const geometry = new THREE.OctahedronGeometry(0.5, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.8,
            roughness: 0.2,
            metalness: 0.8
        });

        const note = new THREE.Mesh(geometry, material);
        note.position.set(x, y, 0);
        note.castShadow = true;
        note.receiveShadow = true;

        note.velocity = { x: 0, y: -GAME_CONFIG.NOTE_FALL_SPEED };
        note.clicked = false;

        this.scene.add(note);
        this.notes.push(note);

        return note;
    }

    spawnBoss(levelId) {
        // Crea un boss generico (forma complessa)
        const groupGeometry = new THREE.Group();

        // Corpo principale
        const bodyGeometry = new THREE.SphereGeometry(2, 32, 32);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.6
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        groupGeometry.add(body);

        // Occhi
        const eyeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-1, 1, 2);
        groupGeometry.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(1, 1, 2);
        groupGeometry.add(rightEye);

        groupGeometry.position.set(0, 0, -15);
        this.scene.add(groupGeometry);

        this.boss = {
            mesh: groupGeometry,
            hp: 100,
            maxHp: 100,
            levelId: levelId
        };

        return this.boss;
    }

    updateNotes() {
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];
            
            note.position.y += note.velocity.y;
            note.rotation.x += 0.05;
            note.rotation.y += 0.05;

            // Rimuovi se esce da schermo
            if (note.position.y < -10) {
                this.scene.remove(note);
                this.notes.splice(i, 1);
                window.gameManager?.loseLife();
            }
        }
    }

    updateBoss() {
        if (!this.boss) return;

        const mesh = this.boss.mesh;
        mesh.rotation.y += 0.01;
        mesh.position.y = Math.sin(Date.now() * 0.001) * 2;
    }

    onMouseMove(event) {
        // Gestito da game-loop.js
    }

    onMouseClick(event) {
        // Gestito da game-loop.js
    }

    clearArena() {
        // Rimuovi note
        this.notes.forEach(note => this.scene.remove(note));
        this.notes = [];

        // Rimuovi nemici
        this.enemies.forEach(enemy => this.scene.remove(enemy.mesh));
        this.enemies = [];

        // Rimuovi boss
        if (this.boss) {
            this.scene.remove(this.boss.mesh);
            this.boss = null;
        }

        // Rimuovi particelle
        this.particles.forEach(particle => this.scene.remove(particle));
        this.particles = [];
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.updateNotes();
        this.updateBoss();
        this.renderer.render(this.scene, this.camera);
    }
}

// Inizializza la scena globalmente
window.melodyScene = new MelodyQuestScene();

console.log('✅ THREE.JS SCENE LOADED');
