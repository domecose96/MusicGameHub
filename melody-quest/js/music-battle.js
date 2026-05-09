/* ==================== MUSIC BATTLE SYSTEM - BOSS DUEL ==================== */

class MusicBattleSystem {
    constructor() {
        this.isActive = false;
        this.boss = null;
        this.bossHP = 100;
        this.playerHP = 100;
        this.currentPhase = 1;
        this.phaseSequence = [];
        this.playerSequence = [];
        this.maxSequenceLength = 8;
        this.levelId = 0;
    }

    startBossBattle(levelId) {
        this.levelId = levelId;
        const level = GAME_CONFIG.LEVELS[levelId - 1];
        
        if (!level) return;

        this.bossHP = 100 + (levelId * 10); // Difficoltà aumenta per livello
        this.playerHP = 100;
        this.currentPhase = 1;
        this.phaseSequence = [];
        this.playerSequence = [];
        this.isActive = true;

        this.showBattleArena(level);
    }

    showBattleArena(level) {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'flex';

        const container = modal.querySelector('.modal-content');
        container.innerHTML = `
            <div class="battle-arena">
                <div class="battle-header">
                    <h1 class="battle-title">🎵 MUSIC BATTLE 🎵</h1>
                    <p class="battle-subtitle">Duello Finale Contro: ${level.boss}</p>
                </div>

                <div class="battle-field">
                    <!-- Boss Side -->
                    <div class="battle-side boss-side">
                        <div class="character-display" id="boss-character">
                            <div class="character-name">${level.boss}</div>
                            <div class="character-emoji">🎭</div>
                        </div>
                        
                        <div class="hp-bar">
                            <div class="hp-fill" id="boss-hp-fill"></div>
                            <span class="hp-text"><span id="boss-hp-current">${this.bossHP}</span>/<span id="boss-hp-max">${this.bossHP}</span></span>
                        </div>

                        <div id="boss-pattern" class="pattern-display">
                            <div class="pattern-label">Pattern del Boss:</div>
                            <div id="boss-sequence-display" class="sequence-display"></div>
                        </div>
                    </div>

                    <!-- VS -->
                    <div class="battle-vs">VS</div>

                    <!-- Player Side -->
                    <div class="battle-side player-side">
                        <div class="character-display">
                            <div class="character-name">CUSTODE</div>
                            <div class="character-emoji">🎼</div>
                        </div>

                        <div class="hp-bar">
                            <div class="hp-fill" id="player-hp-fill"></div>
                            <span class="hp-text"><span id="player-hp-current">${this.playerHP}</span>/<span id="player-hp-max">${this.playerHP}</span></span>
                        </div>

                        <div id="player-pattern" class="pattern-display">
                            <div class="pattern-label">Tua Sequenza:</div>
                            <div id="player-sequence-display" class="sequence-display"></div>
                        </div>
                    </div>
                </div>

                <!-- Nota Buttons -->
                <div class="battle-notes-section">
                    <div class="battle-info">Fase: <span id="phase-display">${this.currentPhase}</span></div>
                    
                    <div class="note-buttons">
                        <button class="note-btn do-btn" data-note="DO">DO</button>
                        <button class="note-btn re-btn" data-note="RE">RE</button>
                        <button class="note-btn mi-btn" data-note="MI">MI</button>
                        <button class="note-btn fa-btn" data-note="FA">FA</button>
                        <button class="note-btn sol-btn" data-note="SOL">SOL</button>
                        <button class="note-btn la-btn" data-note="LA">LA</button>
                    </div>

                    <div class="battle-message" id="battle-message">
                        Osserva il pattern del boss e riproducilo!
                    </div>
                </div>

                <!-- Battle Log -->
                <div class="battle-log" id="battle-log"></div>
            </div>
        `;

        this.setupNoteButtons();
        this.startBattlePhase();
    }

    setupNoteButtons() {
        // ⭐ Usa event delegation per catturare i click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.note-btn')) {
                const btn = e.target.closest('.note-btn');
                const note = btn.dataset.note;
                this.playerSelectNote(note, btn);
            }
        });

        // Fallback: aggiungi anche direct listeners
        setTimeout(() => {
            document.querySelectorAll('.note-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const note = btn.dataset.note;
                    this.playerSelectNote(note, btn);
                });
            });
        }, 100);
    }

    startBattlePhase() {
        // Boss genera pattern
        this.generateBossPattern();
        this.displayBossPattern();
        
        // Messaggio
        this.addLog(`${GAME_CONFIG.LEVELS[this.levelId - 1].boss} canta il pattern!`);
        
        // Aspetta un po' prima di permettere input
        setTimeout(() => {
            this.playerSequence = [];
            this.addLog('Ora tocca a te! Riproduci il pattern!');
            document.getElementById('battle-message').textContent = 'Riproduci il pattern del boss!';
        }, 2000);
    }

    generateBossPattern() {
        const notes = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA'];
        this.phaseSequence = [];
        
        // Lunghezza aumenta con le fasi
        const sequenceLength = Math.min(2 + this.currentPhase, this.maxSequenceLength);
        
        for (let i = 0; i < sequenceLength; i++) {
            this.phaseSequence.push(notes[Math.floor(Math.random() * notes.length)]);
        }
    }

    displayBossPattern() {
        const display = document.getElementById('boss-sequence-display');
        display.innerHTML = this.phaseSequence
            .map(note => `<span class="note-display ${note.toLowerCase()}">${note}</span>`)
            .join('');
    }

    playerSelectNote(note, btn) {
        if (!this.isActive || this.phaseSequence.length === 0) return;

        // Effetto visuale
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 200);

        // Aggiungi alla sequenza del player
        this.playerSequence.push(note);
        this.displayPlayerPattern();

        // Controlla se la nota è corretta
        const correctNote = this.phaseSequence[this.playerSequence.length - 1];
        
        if (note === correctNote) {
            this.playNoteSound(note);
            
            if (this.playerSequence.length === this.phaseSequence.length) {
                // Ha completato il pattern!
                this.phaseWon();
            }
        } else {
            // Nota sbagliata!
            this.playerMissed();
        }
    }

    displayPlayerPattern() {
        const display = document.getElementById('player-sequence-display');
        display.innerHTML = this.playerSequence
            .map(note => `<span class="note-display ${note.toLowerCase()}">${note}</span>`)
            .join('');
    }

    phaseWon() {
        this.isActive = false;

        // Danno al boss
        const damage = 10 + (this.currentPhase * 5);
        this.bossHP = Math.max(0, this.bossHP - damage);
        
        this.addLog(`✅ Pattern corretto! Boss -${damage} HP!`);
        this.updateBossHP();

        if (this.bossHP <= 0) {
            this.battleWon();
        } else {
            // Prossima fase
            this.currentPhase++;
            document.getElementById('phase-display').textContent = this.currentPhase;
            
            setTimeout(() => {
                this.startBattlePhase();
            }, 2000);
        }
    }

    playerMissed() {
        this.isActive = false;

        // Danno al player
        const damage = 15;
        this.playerHP = Math.max(0, this.playerHP - damage);
        
        this.addLog(`❌ Nota sbagliata! Custode -${damage} HP!`);
        this.updatePlayerHP();

        if (this.playerHP <= 0) {
            this.battleLost();
        } else {
            // Retry
            setTimeout(() => {
                this.playerSequence = [];
                this.displayPlayerPattern();
                this.isActive = true;
                this.addLog('Riprova il pattern del boss!');
            }, 2000);
        }
    }

    updateBossHP() {
        const maxHP = 100 + (this.levelId * 10);
        const percentage = (this.bossHP / maxHP) * 100;
        document.getElementById('boss-hp-fill').style.width = percentage + '%';
        document.getElementById('boss-hp-current').textContent = this.bossHP;
    }

    updatePlayerHP() {
        const percentage = (this.playerHP / 100) * 100;
        document.getElementById('player-hp-fill').style.width = percentage + '%';
        document.getElementById('player-hp-current').textContent = this.playerHP;
    }

    playNoteSound(note) {
        // Da implementare con Web Audio API
        // Per ora visual feedback
        const btn = document.querySelector(`[data-note="${note}"]`);
        if (btn) {
            btn.classList.add('success-flash');
            setTimeout(() => btn.classList.remove('success-flash'), 300);
        }
        console.log('🎵 Playing:', note);
    }

    addLog(message) {
        const log = document.getElementById('battle-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    battleWon() {
        this.isActive = false;
        
        const modal = document.getElementById('quiz-modal');
        const container = modal.querySelector('.modal-content');

        const level = GAME_CONFIG.LEVELS[this.levelId - 1];
        const finalScore = this.playerHP * 10;

        container.innerHTML = `
            <div class="battle-victory">
                <h1 class="victory-title">🏆 VITTORIA! 🏆</h1>
                <p class="victory-subtitle">Hai sconfitto ${level.boss}!</p>
                
                <div class="victory-stats">
                    <div class="stat-item">
                        <span class="stat-label">HP Rimasti:</span>
                        <span class="stat-value">${this.playerHP}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Fasi Completate:</span>
                        <span class="stat-value">${this.currentPhase}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Score Finale:</span>
                        <span class="stat-value">${finalScore}</span>
                    </div>
                </div>

                <div class="victory-message">
                    🎵 Hai dominato il duello musicale! Il ${level.name} è salvo! 🎵
                </div>

                <button id="next-level-btn" class="btn btn-large btn-success">➡️ PROSSIMO LIVELLO</button>
            </div>
        `;

        document.getElementById('next-level-btn').addEventListener('click', () => {
            if (this.levelId < GAME_CONFIG.LEVELS.length) {
                window.gameManager?.startQuizForLevel(this.levelId + 1);
            } else {
                window.gameManager?.showGameComplete();
            }
        });
    }

    battleLost() {
        this.isActive = false;

        const modal = document.getElementById('quiz-modal');
        const container = modal.querySelector('.modal-content');
        const level = GAME_CONFIG.LEVELS[this.levelId - 1];

        container.innerHTML = `
            <div class="battle-defeat">
                <h1 class="defeat-title">💀 SCONFITTO! 💀</h1>
                <p class="defeat-subtitle">${level.boss} ha vinto il duello!</p>
                
                <div class="defeat-stats">
                    <div class="stat-item">
                        <span class="stat-label">Fasi Raggiunte:</span>
                        <span class="stat-value">${this.currentPhase - 1}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">HP Restante Boss:</span>
                        <span class="stat-value">${this.bossHP}</span>
                    </div>
                </div>

                <div class="defeat-message">
                    Ritorna più forte e sfida di nuovo il boss! 💪
                </div>

                <button id="retry-battle-btn" class="btn btn-large btn-primary">🔄 RITENTA BATTAGLIA</button>
            </div>
        `;

        document.getElementById('retry-battle-btn').addEventListener('click', () => {
            this.startBossBattle(this.levelId);
        });
    }
}

// Inizializza globalmente
window.musicBattle = new MusicBattleSystem();

console.log('✅ MUSIC BATTLE SYSTEM LOADED');
