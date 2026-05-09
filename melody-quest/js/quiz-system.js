/* ==================== QUIZ SYSTEM - MELODY QUEST ==================== */

class QuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.isActive = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const submitBtn = document.getElementById('quiz-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }
    }

    startQuiz(levelId) {
        const questions = GAME_CONFIG.QUIZZES[levelId];
        if (!questions) {
            console.error('Quiz non trovato per il livello:', levelId);
            return false;
        }

        this.currentQuiz = {
            levelId: levelId,
            questions: [...questions].sort(() => Math.random() - 0.5), // Mescola domande
            startTime: Date.now()
        };
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.isActive = true;

        this.displayQuestion();
        this.showQuizModal();

        return true;
    }

    displayQuestion() {
        if (!this.currentQuiz) return;

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionContainer = document.getElementById('quiz-question');
        const optionsContainer = document.getElementById('quiz-options');
        const feedbackContainer = document.getElementById('quiz-feedback');

        // Nascondi feedback precedente
        feedbackContainer.style.display = 'none';

        // Mostra domanda
        const questionNum = this.currentQuestionIndex + 1;
        const totalQuestions = this.currentQuiz.questions.length;
        questionContainer.innerHTML = `
            <span style="color: var(--text-muted); font-size: 0.9rem;">Domanda ${questionNum}/${totalQuestions}</span>
            <p style="margin-top: 10px;">${question.question}</p>
        `;

        // Mostra opzioni
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('label');
            optionDiv.className = 'quiz-option';
            optionDiv.innerHTML = `
                <input type="radio" name="quiz-option" value="${index}">
                <span>${option}</span>
            `;
            optionsContainer.appendChild(optionDiv);
        });
    }

    submitAnswer() {
        if (!this.currentQuiz) return;

        const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
        if (!selectedOption) {
            this.showFeedback('Seleziona una risposta!', false);
            return;
        }

        const answerIndex = parseInt(selectedOption.value);
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const isCorrect = answerIndex === question.correct;

        this.answers.push({
            question: question.question,
            selected: answerIndex,
            correct: question.correct,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            this.score++;
            this.showFeedback('✅ Risposta Corretta!', true);
        } else {
            this.showFeedback('❌ Risposta Sbagliata! La risposta corretta era: ' + question.options[question.correct], false);
        }

        // Vai alla domanda successiva
        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.currentQuiz.questions.length) {
                this.displayQuestion();
            } else {
                this.endQuiz();
            }
        }, 2000);
    }

    showFeedback(message, isCorrect) {
        const feedbackContainer = document.getElementById('quiz-feedback');
        feedbackContainer.textContent = message;
        feedbackContainer.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackContainer.style.display = 'block';
    }

    endQuiz() {
        const totalQuestions = this.currentQuiz.questions.length;
        const percentage = (this.score / totalQuestions) * 100;
        const passed = percentage >= GAME_CONFIG.QUIZ_PASS_SCORE;

        this.isActive = false;

        // Mostra risultati
        this.showQuizResults(percentage, passed);
    }

    showQuizResults(percentage, passed) {
        const modal = document.getElementById('quiz-modal');
        const container = modal.querySelector('.modal-content');

        container.innerHTML = `
            <div class="modal-header">
                <h2>${passed ? '🎉 QUIZ SUPERATO!' : '❌ QUIZ NON SUPERATO'}</h2>
            </div>
            <div class="modal-body">
                <div class="stats-display">
                    <div class="stat-item">
                        <span class="stat-label">Risposte Corrette:</span>
                        <span class="stat-value">${this.score}/${this.currentQuiz.questions.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Percentuale:</span>
                        <span class="stat-value">${percentage.toFixed(1)}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Richiesto:</span>
                        <span class="stat-value">${GAME_CONFIG.QUIZ_PASS_SCORE}%</span>
                    </div>
                </div>
                ${!passed ? `<p style="color: var(--danger); margin-top: 20px; font-weight: bold;">Devi ottenere almeno ${GAME_CONFIG.QUIZ_PASS_SCORE}% per continuare. Riprova!</p>` : ''}
            </div>
            <div class="modal-footer">
                ${passed ? 
                    `<button id="continue-btn" class="btn btn-large btn-success">CONTINUA AL GIOCO →</button>` :
                    `<button id="retry-btn" class="btn btn-large btn-primary">RIPROVA</button>`
                }
            </div>
        `;

        if (passed) {
            document.getElementById('continue-btn').addEventListener('click', () => {
                this.closeQuizModal();
                window.gameManager?.startLevel(this.currentQuiz.levelId);
            });
        } else {
            document.getElementById('retry-btn').addEventListener('click', () => {
                this.startQuiz(this.currentQuiz.levelId);
            });
        }
    }

    showQuizModal() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'flex';
    }

    closeQuizModal() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'none';
    }

    getResults() {
        return {
            score: this.score,
            total: this.currentQuiz.questions.length,
            percentage: (this.score / this.currentQuiz.questions.length) * 100,
            answers: this.answers
        };
    }
}

// Inizializza il sistema Quiz globalmente
window.quizSystem = new QuizSystem();

console.log('✅ QUIZ SYSTEM LOADED');
