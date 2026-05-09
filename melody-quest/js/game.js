/* ==================== GAME MANAGER - MELODY QUEST ==================== */

class GameManager {
    constructor() {
        this.currentLevel = 0;
        this.lives = GAME_CONFIG.INITIAL_LIVES;
        this.score = 0;
        this.xp = 0;
        this.combo = 0;
        this.comboTimeout = null;
        this.isPaused = false;
        this.levelStartTime = 0;
        this.gameState = 'MENU'; // MENU, QUIZ, PLAYING, PAUSED, GAME_OVER, LEVEL_COMPLETE

        this.setupEventListeners();
        this.showMainMenu();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.showLevelSelection());
        }

        const pauseResumeBtn = document.getElementById('resume-btn');
        if (pauseResumeBtn) {
            pauseResumeBtn.addEventListener('click', () => this.resumeGame());
        }

        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.returnToMenu());
        }

        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartGame());
        }

        const nextLevelBtn = document.getElementById('next-level-btn');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => this.goToNextLevel());
        }

        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.startLevel(this.currentLevel));
        }
    }

    showMainMenu() {
        this.gameState = 'MENU';
        document.getElementById('main-menu').style.display = 'flex';
        if (window.gameLoop) window.gameLoop.stop();
    }

    showLevelSelection() {
        const container = document.getElementById('levels-buttons');
        container.innerHTML = '';

        GAME_CONFIG.LEVELS.forEach((level, index) => {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.textContent = `${index + 1}. ${level.name}`;
            btn.onclick = () => this.startQuizForLevel(level.id);
            container.appendChild(btn);
        });
    }

    startQuizForLevel(levelId) {
        this.currentLevel = levelId;
        this.gameState = 'QUIZ';

        // Chiudi menù
        document.getElementById('main-menu').style.display = 'none';

        // Avvia RAP QUIZ (nuovo sistema!)
        window.rapQuizSystem?.startRapQuiz(levelId);
    }

    startLevel(levelId) {
        this.currentLevel = levelId;
        this.gameState = 'PLAYING';
        this.levelStartTime = Date.now();
        this.lives = GAME_CONFIG.INITIAL_LIVES;
        this.score = 0;
        this.combo = 0;

        // Chiudi quiz modal
        window.quizSystem?.closeQuizModal();

        // Carica arena
        window.melodyScene?.loadArena(levelId);

        // Crea boss
        window.melodyScene?.spawnBoss(levelId);

        // Aggiorna UI
        this.updateUI();

        // Avvia game loop
        if (window.gameLoop) window.gameLoop.start();
    }

    updateUI() {
        // Aggiorna HUD
        const level = GAME_CONFIG.LEVELS[this.currentLevel - 1];
        if (level) {
            document.getElementById('level-display').textContent = `${this.currentLevel} - ${level.name}`;
        }

        document.getElementById('lives-display').textContent = '❤️'.repeat(this.lives);
        document.getElementById('score-display').textContent = this.score;
        document.getElementById('xp-display').textContent = `${this.xp}/${GAME_CONFIG.XP_PER_LEVEL}`;

        // Aggiorna boss HP se presente
        if (window.melodyScene?.boss) {
            const boss = window.melodyScene.boss;
            const bossHud = document.getElementById('boss-hud');
            if (bossHud) {
                bossHud.style.display = 'block';
                document.getElementById('boss-name').textContent = GAME_CONFIG.LEVELS[this.currentLevel - 1]?.boss || 'Boss';
                document.getElementById('boss-hp').style.width = (boss.hp / boss.maxHp) * 100 + '%';
                document.getElementById('boss-hp-text').textContent = `${boss.hp}/${boss.maxHp}`;
            }
        }
    }

    addScore(points, accuracy) {
        this.score += points;

        // Combo system
        this.combo++;
        clearTimeout(this.comboTimeout);

        if (this.combo > 1) {
            const comboDisplay = document.getElementById('combo-display');
            comboDisplay.querySelector('.combo-number').textContent = this.combo + 'x';
            comboDisplay.style.display = 'block';

            setTimeout(() => {
                comboDisplay.style.display = 'none';
            }, 500);
        }

        // XP
        const xpGain = Math.round(points * accuracy);
        this.xp += xpGain;

        if (this.xp >= GAME_CONFIG.XP_PER_LEVEL) {
            this.xp = 0;
            this.showNotification('⭐ NUOVO LIVELLO! ⭐');
        }

        // Reset combo dopo timeout
        this.comboTimeout = setTimeout(() => {
            this.combo = 0;
        }, GAME_CONFIG.COMBO_TIMEOUT);

        this.updateUI();
    }

    loseLife() {
        this.lives--;
        this.combo = 0;

        this.showNotification('❌ NOTA MANCATA!');

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.updateUI();
        }
    }

    gameOver() {
        this.gameState = 'GAME_OVER';
        if (window.gameLoop) window.gameLoop.stop();

        const elapsedTime = Math.floor((Date.now() - this.levelStartTime) / 1000);

        const modal = document.getElementById('game-over');
        const statsDiv = document.getElementById('final-stats');
        const messageDiv = document.getElementById('game-over-message');

        messageDiv.textContent = `Sei stato sconfitto dal boss del livello ${this.currentLevel}!`;

        statsDiv.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Score Finale:</span>
                <span class="stat-value">${this.score}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Tempo Gioco:</span>
                <span class="stat-value">${elapsedTime}s</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">XP Guadagnato:</span>
                <span class="stat-value">${this.xp}</span>
            </div>
        `;

        modal.style.display = 'flex';
    }

    levelComplete() {
        this.gameState = 'LEVEL_COMPLETE';
        if (window.gameLoop) window.gameLoop.stop();

        const elapsedTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
        const bonusScore = 1000 - (elapsedTime * 10);
        this.score += Math.max(0, bonusScore);

        const modal = document.getElementById('level-complete');
        const statsDiv = document.getElementById('level-stats');

        statsDiv.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Livello:</span>
                <span class="stat-value">${GAME_CONFIG.LEVELS[this.currentLevel - 1]?.name}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Score:</span>
                <span class="stat-value">${this.score}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Tempo:</span>
                <span class="stat-value">${elapsedTime}s</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Bonus Velocità:</span>
                <span class="stat-value">+${Math.max(0, bonusScore)}</span>
            </div>
        `;

        modal.style.display = 'flex';
    }

    goToNextLevel() {
        if (this.currentLevel < GAME_CONFIG.LEVELS.length) {
            this.currentLevel++;
            this.startQuizForLevel(this.currentLevel);
        } else {
            this.showGameComplete();
        }
    }

    showGameComplete() {
        const modal = document.getElementById('level-complete');
        const statsDiv = document.getElementById('level-stats');
        const nextBtn = document.getElementById('next-level-btn');

        statsDiv.innerHTML = `
            <h3 style="color: var(--success); font-size: 1.5rem; margin-bottom: 20px;">
                🎉 HAI COMPLETATO MELODY QUEST! 🎉
            </h3>
            <div class="stat-item">
                <span class="stat-label">Score Totale:</span>
                <span class="stat-value">${this.score}</span>
            </div>
            <p style="color: var(--text-muted); margin-top: 20px;">
                Sei diventato un Custode della Musica leggendario! 🎵
            </p>
        `;

        nextBtn.textContent = 'TORNA AL MENÙ';
        nextBtn.onclick = () => this.returnToMenu();
    }

    togglePause() {
        if (this.gameState === 'PLAYING') {
            this.isPaused = true;
            this.gameState = 'PAUSED';
            if (window.gameLoop) window.gameLoop.pause();
            document.getElementById('pause-menu').style.display = 'flex';
        }
    }

    resumeGame() {
        this.isPaused = false;
        this.gameState = 'PLAYING';
        if (window.gameLoop) window.gameLoop.resume();
        document.getElementById('pause-menu').style.display = 'none';
    }

    returnToMenu() {
        this.currentLevel = 0;
        this.lives = GAME_CONFIG.INITIAL_LIVES;
        this.score = 0;
        this.xp = 0;
        this.combo = 0;

        document.getElementById('level-complete').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('pause-menu').style.display = 'none';

        if (window.melodyScene) window.melodyScene.clearArena();
        if (window.gameLoop) window.gameLoop.stop();

        this.showMainMenu();
    }

    restartGame() {
        this.returnToMenu();
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    checkBossDefeat() {
        if (window.melodyScene?.boss && window.melodyScene.boss.hp <= 0) {
            this.levelComplete();
        }
    }
}

// Inizializza il game manager globalmente
window.gameManager = new GameManager();

console.log('✅ GAME MANAGER LOADED');
console.log('🎮 MELODY QUEST READY TO PLAY!');
