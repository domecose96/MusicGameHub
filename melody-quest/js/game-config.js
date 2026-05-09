/* ==================== GAME CONFIG - MELODY QUEST ==================== */

const GAME_CONFIG = {
    // Impostazioni generali
    GAME_NAME: "MELODY QUEST",
    GAME_VERSION: "1.0.0",
    
    // Gameplay
    INITIAL_LIVES: 4,
    SCORE_PER_NOTE: 10,
    COMBO_MULTIPLIER: 1.5,
    XP_PER_LEVEL: 100,
    QUIZ_PASS_SCORE: 80, // Percentuale minima per passare il quiz

    // Velocità di gioco
    NOTE_FALL_SPEED: 0.015,
    NOTE_SPAWN_RATE: 0.8, // Note per secondo
    COMBO_TIMEOUT: 3000, // ms

    // Livelli
    LEVELS: [
        {
            id: 1,
            name: "MEDIOEVO",
            epoch: "476-1492",
            color: "#8B4513",
            maestro: "Gregorio Magno",
            boss: "Il Purista",
            description: "La musica liturgica domina l'Europa medievale...",
            difficulty: 1,
            enemy: "Corrupted_Gregorian_Monk",
            arena: "Medieval_Cathedral_Arena"
        },
        {
            id: 2,
            name: "RINASCIMENTO",
            epoch: "1492-1600",
            color: "#DAA520",
            maestro: "Josquin des Prez",
            boss: "L'Accademico",
            description: "La musica polifonica raggiunge il suo apice...",
            difficulty: 2,
            enemy: "Corrupted_Renaissance_Scholar",
            arena: "Renaissance_Palace_Arena"
        },
        {
            id: 3,
            name: "BAROCCO",
            epoch: "1600-1750",
            color: "#FFD700",
            maestro: "Johann Sebastian Bach",
            boss: "Lo Spettro Barocco",
            description: "Ornamenti, drammaticità e magnificenza...",
            difficulty: 3,
            enemy: "Corrupted_Aristocrat",
            arena: "Baroque_Concert_Hall_Arena"
        },
        {
            id: 4,
            name: "CLASSICISMO",
            epoch: "1750-1820",
            color: "#87CEEB",
            maestro: "Wolfgang Amadeus Mozart",
            boss: "Il Purificatore Classico",
            description: "Armonia, equilibrio e eleganza raffinata...",
            difficulty: 4,
            enemy: "Classical_Rigid_Master",
            arena: "Classical_Concert_Hall_Arena"
        },
        {
            id: 5,
            name: "ROMANTICISMO",
            epoch: "1820-1910",
            color: "#8B008B",
            maestro: "Ludwig van Beethoven",
            boss: "La Tempesta Romantica",
            description: "Passione, emozione e libertà artistica...",
            difficulty: 5,
            enemy: "Romantic_Stormy_Entity",
            arena: "Romantic_Music_Salon_Arena"
        },
        {
            id: 6,
            name: "IMPRESSIONISMO",
            epoch: "1890-1920",
            color: "#FF69B4",
            maestro: "Claude Debussy",
            boss: "Lo Spettro Impressionista",
            description: "Colori sonori e atmosfere nebbiose...",
            difficulty: 6,
            enemy: "Impressionist_Vague_Spirit",
            arena: "Impressionist_Garden_Arena"
        },
        {
            id: 7,
            name: "MUSICA MODERNA",
            epoch: "1910-Oggi",
            color: "#FF00FF",
            maestro: "Igor Stravinsky",
            boss: "L'Oscurità Musicale",
            description: "Sperimentazione, innovazione e caos creativo...",
            difficulty: 7,
            enemy: "Glitch_Synth_Entity",
            arena: "Modern_Electronic_Studio_Arena"
        }
    ],

    // Quiz Database (domande per livello)
    QUIZZES: {
        1: [ // MEDIOEVO
            {
                question: "Chi è il padre del canto gregoriano?",
                options: ["Papa Gregorio Magno", "Guido d'Arezzo", "Francesco Landini", "Hildegard von Bingen"],
                correct: 0
            },
            {
                question: "Cosa ha inventato Guido d'Arezzo?",
                options: ["La chiave di violino", "La notazione musicale moderna", "L'organo", "La ballata"],
                correct: 1
            },
            {
                question: "Quali sono i due tipi di musica medievale?",
                options: ["Classica e pop", "Vocale e strumentale", "Sacra e profana", "Gregoriana e polifonica"],
                correct: 2
            },
            {
                question: "Cosa cantavano i trovatori?",
                options: ["Canti religiosi in latino", "Canzoni di amor cortese", "Inni liturgici", "Marce militari"],
                correct: 1
            },
            {
                question: "Qual è la caratteristica principale del canto gregoriano?",
                options: ["È polifonico", "È accompagnato da strumenti", "È monodico senza accompagnamento", "Ha ritmo veloce"],
                correct: 2
            }
        ],
        2: [ // RINASCIMENTO
            {
                question: "In quale secolo fiorisce il Rinascimento musicale?",
                options: ["XV-XVI", "XIII-XIV", "XVII-XVIII", "XIX-XX"],
                correct: 0
            },
            {
                question: "Qual è la forma musicale più importante del Rinascimento?",
                options: ["La sinfonia", "Il madrigale", "La concerto", "La serenata"],
                correct: 1
            },
            {
                question: "Chi è il più grande compositore del Rinascimento italiano?",
                options: ["Orlando di Lasso", "Josquin des Prez", "Giovanni Palestrina", "Claudio Monteverdi"],
                correct: 2
            },
            {
                question: "Cosa caratterizza la polifonia rinascimentale?",
                options: ["Una sola melodia", "Voci indipendenti e uguali", "Solo strumenti", "Assenza di armonia"],
                correct: 1
            },
            {
                question: "Quale invenzione ha rivoluzionato la musica nel 1440?",
                options: ["Il pianoforte", "La stampa musicale", "Il metronomo", "Il violino"],
                correct: 1
            }
        ],
        3: [ // BAROCCO
            {
                question: "In quale periodo si sviluppa il Barocco musicale?",
                options: ["1500-1600", "1600-1750", "1750-1850", "1850-1950"],
                correct: 1
            },
            {
                question: "Qual è la forma musicale barocca più importante?",
                options: ["La sinfonia", "La fuga", "La sonata", "Il concerto"],
                correct: 1
            },
            {
                question: "Chi è il compositore barocco più celebre?",
                options: ["Mozart", "Beethoven", "Johann Sebastian Bach", "Vivaldi"],
                correct: 2
            },
            {
                question: "Che cos'è il continuo nel Barocco?",
                options: ["Una melodia continua", "L'accompagnamento costante di basso e armonia", "Un ritmo regolare", "Una forma musicale"],
                correct: 1
            },
            {
                question: "Qual è la caratteristica principale della musica barocca?",
                options: ["Semplicità", "Ornamenti e drammaticità", "Austerità", "Minimalismo"],
                correct: 1
            }
        ],
        4: [ // CLASSICISMO
            {
                question: "Quando fiorisce il Classicismo musicale?",
                options: ["1650-1750", "1750-1820", "1820-1900", "1900-2000"],
                correct: 1
            },
            {
                question: "Chi è il padre della sinfonia?",
                options: ["Mozart", "Beethoven", "Joseph Haydn", "Vivaldi"],
                correct: 2
            },
            {
                question: "Quante sinfonie ha scritto Mozart?",
                options: ["27", "41", "9", "104"],
                correct: 1
            },
            {
                question: "Qual è la forma-sonata nel Classicismo?",
                options: ["Esposizione-sviluppo-riesposizione", "Tema-variazioni", "ABA", "Rondo"],
                correct: 0
            },
            {
                question: "Chi ha rivoluzionato il Classicismo con la 9ª Sinfonia?",
                options: ["Mozart", "Haydn", "Beethoven", "Salieri"],
                correct: 2
            }
        ],
        5: [ // ROMANTICISMO
            {
                question: "Quando inizia il Romanticismo musicale?",
                options: ["1750", "1800", "1820", "1850"],
                correct: 2
            },
            {
                question: "Quale caratteristica contraddistingue il Romanticismo?",
                options: ["Ordine", "Equilibrio", "Passione e emozione", "Semplicità"],
                correct: 2
            },
            {
                question: "Quale è considerato il 'poeta della musica'?",
                options: ["Beethoven", "Chopin", "Schumann", "Brahms"],
                correct: 1
            },
            {
                question: "Che cos'è il Lied nel Romanticismo?",
                options: ["Una danza", "Una canzone per voce e pianoforte", "Una sinfonia", "Un'opera"],
                correct: 1
            },
            {
                question: "Chi è il compositore della 'Sinfonia inacabata'?",
                options: ["Schubert", "Bruckner", "Mahler", "Brahms"],
                correct: 0
            }
        ],
        6: [ // IMPRESSIONISMO
            {
                question: "Quando si sviluppa l'Impressionismo musicale?",
                options: ["1850-1890", "1890-1920", "1920-1950", "1950-1980"],
                correct: 1
            },
            {
                question: "Chi è il padre dell'Impressionismo musicale?",
                options: ["Chopin", "Liszt", "Claude Debussy", "Erik Satie"],
                correct: 2
            },
            {
                question: "Quale caratteristica distingue l'Impressionismo?",
                options: ["Melodie lineari", "Colori sonori e atmosfere", "Struttura formale rigida", "Virtuosismo"],
                correct: 1
            },
            {
                question: "Qual è il brano più celebre di Debussy?",
                options: ["Clair de lune", "Prélude à l'après-midi d'un faune", "La Mer", "Images"],
                correct: 1
            },
            {
                question: "Cosa usa Debussy per creare atmosfere?",
                options: ["Melodie forti", "Accordi paralleli e timbri", "Ritmi regolari", "Forme classiche"],
                correct: 1
            }
        ],
        7: [ // MUSICA MODERNA
            {
                question: "Quando inizia la Musica Moderna?",
                options: ["1900", "1910", "1920", "1930"],
                correct: 1
            },
            {
                question: "Quale è una caratteristica della Musica Moderna?",
                options: ["Tonalità rigorosa", "Atonalità e dodecafonia", "Forme classiche", "Semplicità"],
                correct: 1
            },
            {
                question: "Chi è il compositore della 'Sagra della Primavera'?",
                options: ["Schoenberg", "Stravinsky", "Bartók", "Webern"],
                correct: 1
            },
            {
                question: "Che cos'è la dodecafonia?",
                options: ["Un ritmo", "Un sistema compositivo basato su 12 note", "Una scala", "Una forma musicale"],
                correct: 1
            },
            {
                question: "Quale movimento caratterizza la Musica Moderna?",
                options: ["Conservazione", "Sperimentazione e innovazione", "Tradizione", "Semplicità"],
                correct: 1
            }
        ]
    },

    // Assets paths
    ASSETS: {
        images: 'assets/images/',
        audio: 'assets/audio/'
    }
};

console.log('✅ MELODY QUEST CONFIG LOADED');
