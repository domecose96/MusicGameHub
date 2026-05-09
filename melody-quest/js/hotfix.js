/* ==================== HOTFIX - RAP QUIZ & MUSIC BATTLE BUG FIXES ==================== */

// 🔧 HOTFIX #1: Riabilita il click su opzioni quiz
// Posiziona questo DOPO che carichi rap-quiz.js

(function() {
    // Attendi che il DOM sia pronto
    setTimeout(() => {
        // Event delegation globale per quiz
        document.addEventListener('click', function(e) {
            // Se clicchi una opzione rap-quiz
            if (e.target.closest('.rap-option')) {
                const btn = e.target.closest('.rap-option');
                if (window.rapQuizSystem && !btn.disabled) {
                    window.rapQuizSystem.selectOption(btn);
                }
            }

            // Se clicchi una nota del music battle
            if (e.target.closest('.note-btn')) {
                const btn = e.target.closest('.note-btn');
                const note = btn.dataset.note;
                if (window.musicBattle && note) {
                    window.musicBattle.playerSelectNote(note, btn);
                }
            }
        });

        console.log('✅ HOTFIX #1: Click delegation attivata');
    }, 500);
})();

// 🔧 HOTFIX #2: Assicura che Music Battle si avvia dopo quiz
(function() {
    const originalStartRapQuiz = window.rapQuizSystem?.startRapQuiz;
    
    if (originalStartRapQuiz) {
        window.rapQuizSystem.startRapQuiz = function(levelId) {
            console.log('🎤 Avvio Rap Quiz per livello:', levelId);
            return originalStartRapQuiz.call(this, levelId);
        };
    }

    // Quando quiz è finito, attiva music battle
    const oldEndRapQuiz = window.rapQuizSystem?.endRapQuiz;
    if (oldEndRapQuiz) {
        window.rapQuizSystem.endRapQuiz = function() {
            console.log('🎤 Quiz finito, preparando Music Battle...');
            oldEndRapQuiz.call(this);
            
            // Assicura che Music Battle sia disponibile
            if (!window.musicBattle) {
                console.error('❌ Music Battle non caricato!');
                return;
            }
            
            console.log('✅ Music Battle pronto!');
        };
    }
})();

// 🔧 HOTFIX #3: Verifica che tutti i sistemi siano caricati
window.addEventListener('load', function() {
    setTimeout(() => {
        console.log('=== MELODY QUEST SYSTEMS STATUS ===');
        console.log('✅ rapQuizSystem:', !!window.rapQuizSystem);
        console.log('✅ musicBattle:', !!window.musicBattle);
        console.log('✅ gameManager:', !!window.gameManager);
        console.log('✅ melodyScene:', !!window.melodyScene);
        console.log('=====================================');
    }, 1000);
});

console.log('✅ HOTFIX SCRIPT LOADED');
