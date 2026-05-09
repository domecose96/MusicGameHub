/* ==================== RAP QUIZ SYSTEM - MELODY QUEST ==================== */

class RapQuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.isActive = false;
        this.timePerQuestion = 10; // Secondi per rispondere
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.totalQuestions = 3; // Solo 3 domande rap, poi boss
        this.rapBeat = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listener per le opzioni
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('rap-option')) {
                this.selectOption(e.target);
            }
        });
    }

    startRapQuiz(levelId) {
        const questions = GAME_CONFIG.QUIZZES[levelId];
        if (!questions) {
            console.error('Quiz non trovato per il livello:', levelId);
            return false;
        }

        this.currentQuiz = {
            levelId: levelId,
            questions: [...questions].sort(() => Math.random() - 0.5).slice(0, this.totalQuestions),
            startTime: Date.now()
        };
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.isActive = true;

        this.showRapQuizMode();
        this.displayRapQuestion();
        this.startTimer();

        return true;
    }

    showRapQuizMode() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'flex';

        const content = modal.querySelector('.modal-content');
        content.innerHTML = `
            <div class="rap-quiz-container">
                <div class="rap-header">
                    <h1 class="rap-title">🎤 RAP BATTLE - QUIZ QUIZ! 🎤</h1>
                    <div class="rap-beat-visualizer">
                        <div class="beat beat-1"></div>
                        <div class="beat beat-2"></div>
                        <div class="beat beat-3"></div>
                        <div class="beat beat-4"></div>
                    </div>
                </div>

                <div id="rap-quiz-content" class="rap-quiz-content"></div>

                <div class="rap-stats">
                    <span class="rap-timer">
                        ⏱️ <span id="time-remaining">${this.timePerQuestion}</span>s
                    </span>
                    <span class="rap-progress">
                        <span id="question-counter">1</span>/<span id="total-questions">${this.totalQuestions}</span>
                    </span>
                    <span class="rap-score">
                        ✨ Score: <span id="rap-score-display">0</span>
                    </span>
                </div>
            </div>
        `;

        document.getElementById('total-questions').textContent = this.totalQuestions;

        // Avvia animazione beat
        this.animateBeat();
    }

    displayRapQuestion() {
        if (!this.currentQuiz) return;

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const container = document.getElementById('rap-quiz-content');

        const questionNum = this.currentQuestionIndex + 1;

        container.innerHTML = `
            <div class="rap-question-card">
                <div class="rap-question-number">DOMANDA #${questionNum}</div>
                <h2 class="rap-question-text">${question.question}</h2>
                
                <div class="rap-options">
                    ${question.options.map((option, index) => `
                        <button class="rap-option" data-index="${index}" data-correct="${index === question.correct}">
                            <span class="option-number">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="rap-hint">
                    💡 Rispondi veloce! Hai ${this.timePerQuestion} secondi!
                </div>
            </div>
        `;

        document.getElementById('question-counter').textContent = questionNum;
        this.timeRemaining = this.timePerQuestion;
        this.resetTimer();

        // ⭐ IMPORTANTE: Re-aggiungi event listener per le nuove opzioni!
        setTimeout(() => {
            document.querySelectorAll('.rap-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.selectOption(btn);
                });
            });
        }, 100);
    }

    selectOption(optionBtn) {
        if (!this.isActive) return;

        const optionIndex = parseInt(optionBtn.dataset.index);
        const isCorrect = optionBtn.dataset.correct === 'true';
        const question = this.currentQuiz.questions[this.currentQuestionIndex];

        // Disabilita tutte le opzioni
        document.querySelectorAll('.rap-option').forEach(btn => btn.disabled = true);

        // Feedback visuale
        if (isCorrect) {
            optionBtn.classList.add('correct-answer');
            this.score += Math.max(100 - (this.timePerQuestion - this.timeRemaining) * 10, 10);
            this.createParticleEffect(optionBtn, 'success');
            this.playSound('correct'); // Da implementare
        } else {
            optionBtn.classList.add('wrong-answer');
            document.querySelector(`[data-correct="true"]`).classList.add('show-correct');
            this.createParticleEffect(optionBtn, 'error');
            this.playSound('wrong'); // Da implementare
        }

        // Aggiorna score display
        document.getElementById('rap-score-display').textContent = this.score;

        this.answers.push({
            question: question.question,
            selected: optionIndex,
            correct: question.correct,
            isCorrect: isCorrect,
            timeUsed: this.timePerQuestion - this.timeRemaining
        });

        // Vai alla domanda successiva
        setTimeout(() => {
            this.currentQuestionIndex++;
            
            if (this.currentQuestionIndex < this.currentQuiz.questions.length) {
                this.displayRapQuestion();
            } else {
                this.endRapQuiz();
            }
        }, 1500);
    }

    startTimer() {
        this.resetTimer();
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            document.getElementById('time-remaining').textContent = Math.max(0, this.timeRemaining);

            // Cambio colore quando manca tempo
            const timerElement = document.querySelector('.rap-timer');
            if (this.timeRemaining <= 3) {
                timerElement.classList.add('danger');
            } else {
                timerElement.classList.remove('danger');
            }

            // Tempo scaduto - rispondi random o passa
            if (this.timeRemaining <= 0) {
                const question = this.currentQuiz.questions[this.currentQuestionIndex];
                const randomOption = Math.floor(Math.random() * question.options.length);
                const optionBtn = document.querySelector(`[data-index="${randomOption}"]`);
                
                if (optionBtn && !optionBtn.disabled) {
                    this.selectOption(optionBtn);
                }
            }
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timeRemaining = this.timePerQuestion;
    }

    endRapQuiz() {
        clearInterval(this.timerInterval);
        this.isActive = false;

        const totalPossible = this.currentQuiz.questions.length * 100;
        const percentage = (this.score / totalPossible) * 100;
        const passed = percentage >= GAME_CONFIG.QUIZ_PASS_SCORE;

        this.showRapQuizResults(percentage, passed);
    }

    showRapQuizResults(percentage, passed) {
        const modal = document.getElementById('quiz-modal');
        const container = modal.querySelector('.modal-content');

        const resultMessage = passed 
            ? '🔥 HAI VINTO IL RAP BATTLE! 🔥' 
            : '❌ HAI PERSO! RIPROVA!';

        container.innerHTML = `
            <div class="rap-results-container">
                <h2 class="rap-results-title">${resultMessage}</h2>
                
                <div class="rap-results-stats">
                    <div class="stat-item">
                        <span class="stat-label">SCORE RAP:</span>
                        <span class="stat-value">${this.score}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">PERCENTUALE:</span>
                        <span class="stat-value">${percentage.toFixed(1)}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">DOMANDE GIUSTE:</span>
                        <span class="stat-value">${this.answers.filter(a => a.isCorrect).length}/${this.answers.length}</span>
                    </div>
                </div>

                ${!passed ? `
                    <p style="color: var(--danger); margin: 20px 0; font-weight: bold;">
                        Devi ottenere almeno ${GAME_CONFIG.QUIZ_PASS_SCORE}% per sfidare il Boss!
                    </p>
                ` : ''}

                <div class="rap-results-actions">
                    ${passed ? 
                        `<button id="boss-battle-btn" class="btn btn-large btn-success">⚔️ SFIDA IL BOSS! ⚔️</button>` :
                        `<button id="rap-retry-btn" class="btn btn-large btn-primary">🔄 RIPROVA IL RAP QUIZ</button>`
                    }
                </div>
            </div>
        `;

        if (passed) {
            document.getElementById('boss-battle-btn').addEventListener('click', () => {
                this.closeRapQuizModal();
                // Avvia Music Battle
                window.musicBattle?.startBossBattle(this.currentQuiz.levelId);
            });
        } else {
            document.getElementById('rap-retry-btn').addEventListener('click', () => {
                this.startRapQuiz(this.currentQuiz.levelId);
            });
        }
    }

    createParticleEffect(element, type) {
        const rect = element.getBoundingClientRect();
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${type}`;
            particle.style.left = rect.left + rect.width / 2 + 'px';
            particle.style.top = rect.top + rect.height / 2 + 'px';
            
            document.body.appendChild(particle);

            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 5 + Math.random() * 5;
            
            let x = rect.left + rect.width / 2;
            let y = rect.top + rect.height / 2;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity;
            let life = 30;

            const animate = () => {
                x += vx;
                y += vy;
                vy += 0.1; // Gravità
                life--;

                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = life / 30;

                if (life > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };

            animate();
        }
    }

    animateBeat() {
        const beats = document.querySelectorAll('.beat');
        if (!beats.length) return;

        let beatIndex = 0;
        setInterval(() => {
            beats.forEach(b => b.classList.remove('active'));
            beats[beatIndex % beats.length].classList.add('active');
            beatIndex++;
        }, 250);
    }

    playSound(type) {
        // Da implementare con Web Audio API
        // Per ora placeholder
        console.log('🔊 Sound:', type);
    }

    closeRapQuizModal() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'none';
    }

    getResults() {
        return {
            score: this.score,
            answers: this.answers,
            passed: (this.score / (this.totalQuestions * 100)) * 100 >= GAME_CONFIG.QUIZ_PASS_SCORE
        };
    }
}

// Inizializza globalmente
window.rapQuizSystem = new RapQuizSystem();

console.log('✅ RAP QUIZ SYSTEM LOADED');
