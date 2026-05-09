# 🎵 MELODY QUEST - Il Gioco Arcade della Storia Musicale 🎮

## 📖 Descrizione

**MELODY QUEST** è un gioco arcade 3D educativo dove sei il **Custode della Musica**. La tua missione: affrontare i boss di ogni epoca storica, superare quiz sulla storia della musica e sconfiggere nemici rappresentati da periodi storici corrotti per salvare la musica dal silenzio eterno!

Un'avventura che combina:
- 🎮 **Gameplay arcade** (click-to-beat)
- 🎓 **Educazione musicale** (7 epoche, 35 domande di quiz)
- 🎨 **Grafica 3D moderna** (Three.js)
- 🏆 **Sistema di progressione** (XP, Score, Combo)

---

## 🎯 Concetto di Gioco

### Meccaniche Principali

1. **QUIZ SBLOCCA LIVELLO**
   - Prima di ogni livello: 5 domande sulla storia musicale
   - Requisito: ≥80% per procedere
   - Se fallisci: puoi riprovarvi

2. **GAMEPLAY ARCADE**
   - Note musicali cadono dallo schermo
   - Clicca al ritmo giusto per colpirle
   - Combo multiplier per accuratezza
   - Perde una vita se una nota ti sfugge

3. **COMBATTIMENTO BOSS**
   - Boss finale per ogni epoca
   - Sconfiggilo eliminando tutte le note
   - HP counter in tempo reale
   - Vittoria = livello completato

### Livelli (7 Epoche Musicali)

| # | Epoca | Periodo | Maestro | Boss | Difficoltà |
|---|-------|---------|---------|------|-----------|
| 1 | **MEDIOEVO** | 476-1492 | Gregorio Magno | Il Purista | ⭐ |
| 2 | **RINASCIMENTO** | 1492-1600 | Josquin des Prez | L'Accademico | ⭐⭐ |
| 3 | **BAROCCO** | 1600-1750 | J.S. Bach | Lo Spettro Barocco | ⭐⭐⭐ |
| 4 | **CLASSICISMO** | 1750-1820 | Mozart | Il Purificatore Classico | ⭐⭐⭐⭐ |
| 5 | **ROMANTICISMO** | 1820-1910 | Beethoven | La Tempesta Romantica | ⭐⭐⭐⭐⭐ |
| 6 | **IMPRESSIONISMO** | 1890-1920 | Debussy | Lo Spettro Impressionista | ⭐⭐⭐⭐⭐⭐ |
| 7 | **MUSICA MODERNA** | 1910-Oggi | Stravinsky | L'Oscurità Musicale | ⭐⭐⭐⭐⭐⭐⭐ |

---

## 🏗️ Struttura Progetto

```
melody-quest/
├── index.html                 # Entry point
├── css/
│   └── style.css             # Styling arcade moderno
├── js/
│   ├── game-config.js        # Configurazione e dati
│   ├── quiz-system.js        # Sistema quiz con 35 domande
│   ├── three-scene.js        # Setup Three.js 3D
│   ├── game-loop.js          # Game loop e input handling
│   └── game.js               # Game manager principale
├── assets/
│   ├── images/               # PNG dei personaggi/boss/scenari
│   │   ├── Guardian_of_Music.png
│   │   ├── MAESTRI GUIDA/
│   │   ├── BOSS NEMICI/
│   │   ├── SCENARI:BACKGROUND ARENE/
│   │   └── UI ELEMENTS & ICONS/
│   └── audio/                # Audio (da implementare)
└── README.md                 # Questa documentazione
```

---

## 🎮 Come Giocare

### 1. **Avvia il Gioco**
```bash
# Apri index.html nel browser
open index.html
# o usa un server locale
python -m http.server 8000
# Poi visita: http://localhost:8000
```

### 2. **Seleziona Livello**
- Clicca "INIZIA AVVENTURA"
- Scegli l'epoca da affrontare
- Completa il quiz (≥80% per passare)

### 3. **Gameplay**
- **Note cadono** dallo schermo
- **Clicca** per colpirle al momento giusto
- **Accumula combo** per bonus score
- **Batti il boss** eliminando le note

### 4. **Sistema Scoring**
```
Base Score per nota: 10 punti
Bonus Accuratezza: ×0-1x
Bonus Combo: +1.5x ogni 10 combo
Bonus Velocità: 1000 - (tempo_in_secondi × 10)
```

### 5. **Vite e Perdita**
- Inizi con **4 vite ❤️**
- **Perdi una vita** quando una nota sfugge
- **Game Over** se vite raggiungono 0

### 6. **Comandi**
- **Click sinistro**: Colpisci le note
- **ESC o P**: Pausa
- **Scegli opzione**: Rispondi ai quiz

---

## 🎨 Stile Visivo

### Estetica Globale
- **Arcade retro** meets **Modern 3D**
- **Colori neon** su sfondo scuro
- **Particelle magiche** di sfondo
- **UI minimale** ma informativo

### Tema per Epoca
Ogni livello ha colori e atmosfera unici:
- 🏰 **MEDIOEVO**: Marrone/Oro (cattedrale gotica)
- 👑 **RINASCIMENTO**: Oro/Azzurro (palazzo rinascimentale)
- 🎭 **BAROCCO**: Oro/Rosso (sala barocca opulenta)
- 🏛️ **CLASSICISMO**: Azzurro/Bianco (eleganza classica)
- 🌙 **ROMANTICISMO**: Viola/Nero (tormenta romantica)
- 🌸 **IMPRESSIONISMO**: Rosa/Verde (giardino impressionista)
- ⚡ **MODERNA**: Magenta/Cyan (neon cyberpunk)

---

## 🧠 Sistema Quiz Dettagliato

### Database Quiz
- **35 domande totali** (5 per epoca)
- **Domande randomizzate** ogni partita
- **4 opzioni di risposta** per domanda
- **Feedback immediato** (corretto/sbagliato)

### Esempio Domanda
```
Q: "Chi è il padre del canto gregoriano?"
A: Papa Gregorio Magno ✅ CORRETTO
B: Guido d'Arezzo
C: Francesco Landini
D: Hildegard von Bingen
```

### Scoring Quiz
- Risposte corrette: +50 punti quiz
- Percentuale calcolata: `(corrette/totali) × 100`
- Passaggio: **≥80%**
- Se fallisci: Puoi riprovarvi subito

---

## 📊 Sistema Progressione

### XP e Livelli
```
XP per azione:
- Nota colpita: +10-50 XP (basato su accuratezza)
- Combo ×10: +200 XP
- Livello completato: +500 XP

Upgrade ogni 100 XP:
- Aumenta difficoltà spawning note
- Boss ottiene +10 HP
```

### Score Leaderboard (Future)
- High score globale
- Per livello
- Speedrun (tempo minore)
- Perfect combo (max combo)

---

## 🔧 Configurazione (game-config.js)

```javascript
GAME_CONFIG = {
    INITIAL_LIVES: 4,                    // Vite iniziali
    SCORE_PER_NOTE: 10,                  // Punti base per nota
    COMBO_MULTIPLIER: 1.5,               // Moltiplicatore combo
    NOTE_FALL_SPEED: 0.015,              // Velocità caduta note
    NOTE_SPAWN_RATE: 0.8,                // Note per secondo
    COMBO_TIMEOUT: 3000,                 // ms prima di reset combo
    QUIZ_PASS_SCORE: 80                  // % minima per passare
}
```

Modifica questi valori in `game-config.js` per bilanciare difficoltà!

---

## 🚀 Implementazione Futura

### Fase 2 (Prossimamente)
- [ ] Audio music per ogni epoca
- [ ] Boss unique mechanics
- [ ] Nemici minori nel gameplay
- [ ] Animazioni PNG integrate
- [ ] Sistema di combo visuale avanzato
- [ ] Particle effects professionali

### Fase 3
- [ ] Leaderboard online
- [ ] Achievements e badges
- [ ] Modalità Survival (infinito)
- [ ] Challenge settimanali
- [ ] Mobile responsivo (touch controls)
- [ ] Multiplayer PvP

### Fase 4
- [ ] Story narrative con cutscenes
- [ ] Dialoghi con i maestri
- [ ] Upgrade e power-ups
- [ ] New Game+ (difficoltà aumentata)
- [ ] Modalità sandbox (pratica quiz)

---

## 💻 Tecnologie Utilizzate

- **HTML5**: Struttura
- **CSS3**: Styling arcade moderno
- **JavaScript (Vanilla)**: Logica di gioco
- **Three.js r128**: Rendering 3D
- **Canvas API**: Particle effects

### Browser Supportati
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📋 Checklist Sviluppo

### Core Gameplay ✅
- [x] Menu principale
- [x] Selezione livelli
- [x] Quiz system
- [x] Three.js scene
- [x] Note spawning
- [x] Click detection
- [x] Score system
- [x] Combo system
- [x] Boss creation
- [x] Game over logic
- [x] Level complete logic

### UI/UX ✅
- [x] HUD overlay
- [x] Boss HP bar
- [x] Quiz modal
- [x] Menu modals
- [x] Pause menu
- [x] Level complete screen
- [x] Game over screen

### Assets 🔄
- [ ] PNG integration (pronto)
- [ ] Texture mapping
- [ ] Audio implementation
- [ ] Particle effects

### Polish 📝
- [ ] Balance difficoltà
- [ ] Ottimizzazione performance
- [ ] Mobile responsivo
- [ ] Sound design
- [ ] Animation tweening

---

## 🎓 Valore Educativo

**MELODY QUEST** insegna:

1. **Storia Musicale** - 7 epoche dalle origini ai giorni nostri
2. **Compositori Celebri** - 42 musicisti storici
3. **Forme Musicali** - Sinfonia, Concerto, Sonata, ecc.
4. **Teoria Musicale** - Tonalità, cadenze, polifonia
5. **Strumenti Medievali** - 20+ strumenti storici
6. **Evoluzione Musicale** - Come la musica si è sviluppata

---

## 🤝 Contributing

Questo è un progetto open source! Contributi benvenuti:
- Suggerimenti per bilanciamento
- Nuove domande quiz
- Migliorie grafiche
- Ottimizzazioni performance
- Bug reports

---

## 📜 Licenza

MIT License - Libero per uso educativo e commerciale

---

## 👨‍💻 Credits

- **Game Design**: Melody Quest Team
- **Musica e Storia**: Database educativo
- **Grafica 3D**: Three.js
- **Development**: Vanilla JS + Three.js

---

## 🎮 Inizia a Giocare!

```bash
# 1. Clona il repo
git clone https://github.com/musicgamehub/melody-quest.git
cd melody-quest

# 2. Avvia server locale
python -m http.server 8000

# 3. Apri browser
open http://localhost:8000

# 4. INIZIA AVVENTURA! 🎵
```

---

**Sei pronto a diventare il Custode della Musica? 🎵✨**

Buon gioco! 🎮
