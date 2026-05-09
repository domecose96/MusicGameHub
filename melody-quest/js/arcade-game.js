/* ==================== MELODY QUEST ARCADE - MAIN GAME LOOP ==================== */

class ArcadeGameManager {
    constructor() {
        this.currentLevelId = 1;
        this.gameActive = true;
        this.score = 0;
        this.lives = 3;
        this.gameState = 'RAP_QUIZ'; // RAP_QUIZ → MUSIC_BATTLE → LEVEL_COMPLETE
    }

    start() {
        console.log('🎮 MELODY QUEST ARCADE STARTED!');
        this.showLevelIntro(this.currentLevelId);
    }

    showLevelIntro(levelId) {
        const level = GAME_CONFIG.LEVELS[levelId - 1];
        if (!level) {
            this.showGameComplete();
            return;
        }

        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'flex';

        const content = modal.querySelector('.modal-content');
        content.innerHTML = `
            <div class="level-intro-screen">
                <h1 class="level-intro-title">🎵 LIVELLO ${levelId} 🎵</h1>
                <h2 class="level-intro-name">${level.name}</h2>
                <p class="level-intro-epoch">${level.epoch}</p>
                <p class="level-intro-desc">${level.description}</p>
                
                <div class="level-intro-boss">
                    <p>NEMICO:</p>
                    <h3>${level.boss}</h3>
                </div>

                <button id="start-level-btn" class="btn btn-large btn-success">
                    ▶️ INIZIA LIVELLO
                </button>
            </div>
        `;

        document.getElementById('start-level-btn').addEventListener('click', () => {
            modal.style.display = 'none';
            this.startRapQuiz(levelId);
        });
    }

    startRapQuiz(levelId) {
        this.currentLevelId = levelId;
        const level = GAME_CONFIG.LEVELS[levelId - 1];
        
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'flex';
        this.gameState = 'RAP_QUIZ';

        // Crea quiz arcade
        new ArcadeRapQuiz(levelId, (passed) => {
            if (passed) {
                setTimeout(() => {
                    modal.style.display = 'none';
                    this.startMusicBattle(levelId);
                }, 500);
            } else {
                // Riprova
                setTimeout(() => {
                    this.startRapQuiz(levelId);
                }, 1000);
            }
        });
    }

    startMusicBattle(levelId) {
        this.gameState = 'MUSIC_BATTLE';
        const level = GAME_CONFIG.LEVELS[levelId - 1];

        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'flex';

        // Crea battaglia arcade
        new ArcadeMusicBattle(levelId, (won) => {
            modal.style.display = 'none';
            
            if (won) {
                this.levelComplete(levelId);
            } else {
                // Retry
                setTimeout(() => {
                    this.startMusicBattle(levelId);
                }, 1000);
            }
        });
    }

    levelComplete(levelId) {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'flex';

        const level = GAME_CONFIG.LEVELS[levelId - 1];

        const content = modal.querySelector('.modal-content');
        content.innerHTML = `
            <div class="level-complete-screen">
                <h1>🏆 LIVELLO COMPLETATO! 🏆</h1>
                <h2>${level.name}</h2>
                <p>Hai sconfitto ${level.boss}!</p>

                <div class="stats">
                    <p>SCORE: ${this.score}</p>
                    <p>VITE: ${this.lives}</p>
                </div>

                <button id="next-level-btn" class="btn btn-large btn-success">
                    ➡️ PROSSIMO LIVELLO
                </button>
            </div>
        `;

        document.getElementById('next-level-btn').addEventListener('click', () => {
            if (levelId < GAME_CONFIG.LEVELS.length) {
                this.currentLevelId = levelId + 1;
                this.showLevelIntro(levelId + 1);
            } else {
                this.showGameComplete();
            }
        });
    }

    showGameComplete() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'flex';

        const content = modal.querySelector('.modal-content');
        content.innerHTML = `
            <div class="game-complete-screen">
                <h1>🎉 GAME COMPLETE! 🎉</h1>
                <p>Hai completato MELODY QUEST!</p>
                <p>Sei il CUSTODE DELLA MUSICA leggendario!</p>
                
                <div class="final-score">
                    <h2>SCORE FINALE: ${this.score}</h2>
                </div>

                <button id="restart-game-btn" class="btn btn-large btn-primary">
                    🔄 RICOMINCIA
                </button>
            </div>
        `;

        document.getElementById('restart-game-btn').addEventListener('click', () => {
            location.reload();
        });
    }
}

// ==================== RAP QUIZ ARCADE ====================

class ArcadeRapQuiz {
    constructor(levelId, callback) {
        this.levelId = levelId;
        this.callback = callback;
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = 3;
        this.timePerQuestion = 10;

        const questions = GAME_CONFIG.QUIZZES[levelId];
        this.questions = questions.sort(() => Math.random() - 0.5).slice(0, this.totalQuestions);

        this.showQuiz();
    }

    showQuiz() {
        const modal = document.getElementById('quiz-modal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="arcade-quiz">
                <div class="quiz-header">
                    <h1>🎤 RAP QUIZ 🎤</h1>
                    <div class="quiz-progress">${this.currentQuestion + 1}/${this.totalQuestions}</div>
                </div>

                <div id="quiz-content"></div>

                <div class="quiz-footer">
                    <span class="quiz-score">Score: ${this.score}</span>
                    <span id="quiz-timer" class="quiz-timer">⏱️ 10s</span>
                </div>
            </div>
        `;

        this.displayQuestion();
        this.startTimer();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('quiz-content');

        container.innerHTML = `
            <div class="quiz-question">
                <h2>${question.question}</h2>
                <div class="quiz-options">
                    ${question.options.map((opt, idx) => `
                        <button class="quiz-option-btn" data-index="${idx}" data-correct="${idx === question.correct}">
                            ${String.fromCharCode(65 + idx)}: ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Event listener per click
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectAnswer(btn, question.correct));
        });
    }

    selectAnswer(btn, correctIndex) {
        const selected = parseInt(btn.dataset.index);
        const isCorrect = selected === correctIndex;

        btn.disabled = true;
        document.querySelectorAll('.quiz-option-btn').forEach(b => b.disabled = true);

        if (isCorrect) {
            btn.classList.add('correct');
            this.score += 50;
        } else {
            btn.classList.add('wrong');
            document.querySelector(`[data-index="${correctIndex}"]`).classList.add('correct');
        }

        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.totalQuestions) {
                this.showQuiz();
            } else {
                this.endQuiz();
            }
        }, 1500);
    }

    startTimer() {
        let time = this.timePerQuestion;
        const timerEl = document.getElementById('quiz-timer');

        const interval = setInterval(() => {
            time--;
            timerEl.textContent = `⏱️ ${time}s`;

            if (time <= 0) {
                clearInterval(interval);
                // Auto-select random answer
                const btns = document.querySelectorAll('.quiz-option-btn');
                if (btns.length > 0) {
                    btns[Math.floor(Math.random() * btns.length)].click();
                }
            }
        }, 1000);
    }

    endQuiz() {
        const passed = this.score >= 100;

        const modal = document.getElementById('quiz-modal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="quiz-result">
                <h1>${passed ? '✅ RAP QUIZ PASSATO!' : '❌ RAP QUIZ FALLITO'}</h1>
                <p>Score: ${this.score}/150</p>
                ${!passed ? '<p>Riprova!</p>' : ''}
                <p style="font-size: 0.9rem; color: var(--text-muted);">Procedi al Music Battle...</p>
            </div>
        `;

        setTimeout(() => {
            this.callback(passed);
        }, 2000);
    }
}

// ==================== MUSIC BATTLE ARCADE ====================

class ArcadeMusicBattle {
    constructor(levelId, callback) {
        this.levelId = levelId;
        this.callback = callback;
        this.level = GAME_CONFIG.LEVELS[levelId - 1];
        this.bossHP = 100 + (levelId * 10);
        this.maxBossHP = this.bossHP;
        this.playerHP = 100;
        this.phase = 1;
        this.patternLength = 2;
        this.bossPattern = [];
        this.playerPattern = [];

        this.showBattle();
        this.nextPhase();
    }

    showBattle() {
        const modal = document.getElementById('quiz-modal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="arcade-battle">
                <!-- BOSS Side -->
                <div class="battle-top">
                    <div class="boss-section">
                        <img src="assets/images/BOSS NEMICI/${this.level.boss === 'Il Purista' ? 'Il_Purista.png' : "L'Oscurità_Musicale.png"}" 
                             alt="Boss" class="boss-image">
                        <div class="boss-name">${this.level.boss}</div>
                        <div class="hp-bar boss-hp-bar">
                            <div id="boss-hp" class="hp-fill"></div>
                        </div>
                        <div class="hp-text"><span id="boss-hp-num">${this.bossHP}</span>/<span id="boss-hp-max">${this.maxBossHP}</span></div>
                    </div>

                    <div class="vs-label">VS</div>

                    <div class="player-section">
                        <img src="assets/images/Guardian_of_Music.png" alt="Player" class="player-image">
                        <div class="player-name">CUSTODE</div>
                        <div class="hp-bar player-hp-bar">
                            <div id="player-hp" class="hp-fill"></div>
                        </div>
                        <div class="hp-text"><span id="player-hp-num">${this.playerHP}</span>/100</div>
                    </div>
                </div>

                <!-- PATTERN Display -->
                <div class="battle-patterns">
                    <div class="pattern-box">
                        <div class="pattern-label">BOSS CANTA:</div>
                        <div id="boss-pattern" class="pattern-display"></div>
                    </div>

                    <div class="pattern-box">
                        <div class="pattern-label">TU RIPETI:</div>
                        <div id="player-pattern" class="pattern-display"></div>
                    </div>
                </div>

                <!-- NOTE Buttons -->
                <div class="note-buttons">
                    <button class="note-btn do" data-note="DO">DO</button>
                    <button class="note-btn re" data-note="RE">RE</button>
                    <button class="note-btn mi" data-note="MI">MI</button>
                    <button class="note-btn fa" data-note="FA">FA</button>
                    <button class="note-btn sol" data-note="SOL">SOL</button>
                    <button class="note-btn la" data-note="LA">LA</button>
                </div>

                <div id="battle-message" class="battle-message">
                    Osserva il pattern del boss e riproducilo!
                </div>
            </div>
        `;

        this.updateHPBars();
        this.setupNoteButtons();
    }

    setupNoteButtons() {
        document.querySelectorAll('.note-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const note = btn.dataset.note;
                this.playerSelectNote(note, btn);
            });
        });
    }

    nextPhase() {
        // Genera pattern del boss
        const notes = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA'];
        this.bossPattern = [];
        
        for (let i = 0; i < this.patternLength; i++) {
            this.bossPattern.push(notes[Math.floor(Math.random() * notes.length)]);
        }

        this.playerPattern = [];
        this.displayPatterns();

        document.getElementById('battle-message').textContent = 'Ascolta il pattern del boss...';

        // Anima boss che canta
        this.animateBossSinging();

        setTimeout(() => {
            document.getElementById('battle-message').textContent = 'Ora tocca a te! Riproduci il pattern!';
        }, 2000);
    }

    displayPatterns() {
        const bossDisplay = document.getElementById('boss-pattern');
        const playerDisplay = document.getElementById('player-pattern');

        bossDisplay.innerHTML = this.bossPattern.map(note => 
            `<span class="pattern-note ${note.toLowerCase()}">${note}</span>`
        ).join('');

        playerDisplay.innerHTML = this.playerPattern.map(note => 
            `<span class="pattern-note ${note.toLowerCase()}">${note}</span>`
        ).join('');
    }

    playerSelectNote(note, btn) {
        // Effetto visivo
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 150);

        // Aggiungi a pattern
        this.playerPattern.push(note);
        this.displayPatterns();

        // Controlla
        const expectedNote = this.bossPattern[this.playerPattern.length - 1];

        if (note === expectedNote) {
            // Corretto!
            this.showMessage('✅ Corretto!', 'success');

            if (this.playerPattern.length === this.bossPattern.length) {
                // Pattern completato!
                this.phaseWon();
            }
        } else {
            // Sbagliato!
            this.showMessage(`❌ Sbagliato! Era ${expectedNote}`, 'error');
            this.playerHP -= 15;

            if (this.playerHP <= 0) {
                this.battleLost();
            } else {
                // Reset e riprova
                this.playerPattern = [];
                this.displayPatterns();
                this.updateHPBars();
            }
        }
    }

    phaseWon() {
        const damage = 15 + (this.phase * 5);
        this.bossHP = Math.max(0, this.bossHP - damage);
        
        this.showMessage(`💥 Pattern perfetto! Boss -${damage} HP!`, 'success');
        this.updateHPBars();

        if (this.bossHP <= 0) {
            setTimeout(() => this.battleWon(), 1000);
        } else {
            this.phase++;
            this.patternLength = Math.min(this.patternLength + 1, 8);
            setTimeout(() => this.nextPhase(), 2000);
        }
    }

    battleWon() {
        const modal = document.getElementById('quiz-modal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="battle-victory">
                <h1>🏆 VITTORIA! 🏆</h1>
                <p>Hai sconfitto ${this.level.boss}!</p>
                <p>Fasi completate: ${this.phase}</p>
            </div>
        `;

        setTimeout(() => {
            this.callback(true);
        }, 2000);
    }

    battleLost() {
        const modal = document.getElementById('quiz-modal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="battle-defeat">
                <h1>💀 SCONFITTO 💀</h1>
                <p>${this.level.boss} ti ha sconfitto!</p>
                <p>Riproverai subito...</p>
            </div>
        `;

        setTimeout(() => {
            this.callback(false);
        }, 2000);
    }

    showMessage(msg, type) {
        const msgEl = document.getElementById('battle-message');
        msgEl.textContent = msg;
        msgEl.className = `battle-message ${type}`;
    }

    updateHPBars() {
        document.getElementById('boss-hp').style.width = (this.bossHP / this.maxBossHP) * 100 + '%';
        document.getElementById('boss-hp-num').textContent = this.bossHP;
        
        document.getElementById('player-hp').style.width = (this.playerHP / 100) * 100 + '%';
        document.getElementById('player-hp-num').textContent = this.playerHP;
    }

    animateBossSinging() {
        const bossImg = document.querySelector('.boss-image');
        if (bossImg) {
            bossImg.classList.add('singing');
            setTimeout(() => bossImg.classList.remove('singing'), 2000);
        }
    }
}

// ==================== START GAME ====================

window.addEventListener('load', () => {
    setTimeout(() => {
        const gameManager = new ArcadeGameManager();
        gameManager.start();
    }, 500);
});

console.log('✅ ARCADE MELODY QUEST LOADED');
