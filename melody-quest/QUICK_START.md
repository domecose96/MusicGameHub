# 🚀 MELODY QUEST - Quick Start Guide

## ⚡ Avvia in 30 Secondi

### 1️⃣ **Via Python** (Consigliato)
```bash
cd melody-quest/
python -m http.server 8000
# Apri: http://localhost:8000
```

### 2️⃣ **Via Node.js**
```bash
cd melody-quest/
npx http-server
# Apri: http://localhost:8080
```

### 3️⃣ **Via Live Server (VS Code)**
```bash
# Installa extension "Live Server"
# Click destro su index.html → "Open with Live Server"
```

---

## 📂 Struttura File

```
melody-quest/
├── 📄 index.html              ← APRI QUESTO NEL BROWSER
├── 📁 css/
│   └── style.css              ← Stili arcade moderno
├── 📁 js/
│   ├── game-config.js         ← Configurazione + Quiz DB
│   ├── quiz-system.js         ← Sistema Quiz
│   ├── three-scene.js         ← Three.js 3D Scene
│   ├── game-loop.js           ← Game Loop + Input
│   └── game.js                ← Game Manager
├── 📁 assets/
│   ├── images/                ← PNG (27 file)
│   │   ├── Guardian_of_Music.png
│   │   ├── MAESTRI GUIDA/
│   │   ├── BOSS NEMICI/
│   │   ├── SCENARI/
│   │   └── UI ELEMENTS/
│   └── audio/                 ← Audio (future)
├── 📄 package.json            ← Metadata
├── 📄 README.md               ← Documentazione completa
└── 📄 QUICK_START.md          ← Questa guida
```

---

## 🎮 Come Giocare (5 Step)

### Step 1: Avvia il Gioco
1. Apri `index.html` nel browser
2. Vedi il menu principale

### Step 2: Scegli Livello
1. Clicca "INIZIA AVVENTURA"
2. Seleziona un'epoca musicale (1-7)
3. Vedi il quiz di quel livello

### Step 3: Completa Quiz
1. Rispondi a 5 domande sulla storia musicale
2. Devi ottenere ≥80% per passare
3. Se fallisci, puoi riprovarvi

### Step 4: Gioca l'Arcade
1. Note musicali cadono dallo schermo
2. Clicca per colpirle al ritmo giusto
3. Accumula combo e punti
4. Sconfiggi il boss

### Step 5: Vincere Livello
1. Elimina tutte le note del boss
2. Vedi schermata "Livello Completato"
3. Vai al prossimo livello
4. Ripeti fino a completare tutti i 7 livelli!

---

## 🎯 Controlli

| Azione | Come |
|--------|------|
| **Colpisci nota** | Click sinistro su nota |
| **Rispondi quiz** | Click su opzione + bottone "Risposta" |
| **Pausa gioco** | Premi `ESC` o `P` |
| **Torna menù** | Click su pulsante "Menù" durante pausa |

---

## 🔧 Modifica Difficoltà

Apri `js/game-config.js` e modifica questi valori:

```javascript
// Linea ~15-20
GAME_CONFIG = {
    INITIAL_LIVES: 4,           // ← Aumenta per più vite
    SCORE_PER_NOTE: 10,         // ← Aumenta per più punti
    NOTE_FALL_SPEED: 0.015,     // ← Aumenta per note più veloci
    NOTE_SPAWN_RATE: 0.8,       // ← Aumenta per più note
    QUIZ_PASS_SCORE: 80         // ← Diminuisci per quiz più facile
}
```

**Esempio:**
```javascript
// Facile
INITIAL_LIVES: 6
NOTE_FALL_SPEED: 0.008
QUIZ_PASS_SCORE: 60

// Difficile
INITIAL_LIVES: 2
NOTE_FALL_SPEED: 0.025
QUIZ_PASS_SCORE: 90
```

---

## 📝 Aggiungi Nuove Domande Quiz

Apri `js/game-config.js` e cerca la sezione `QUIZZES`:

```javascript
QUIZZES: {
    1: [ // MEDIOEVO
        {
            question: "La tua domanda qui?",
            options: [
                "Opzione A (CORRETTA)",
                "Opzione B",
                "Opzione C",
                "Opzione D"
            ],
            correct: 0  // ← Indice dell'opzione corretta (0-3)
        },
        // ... altre domande
    ]
}
```

---

## 🎨 Customizza Colori

Apri `css/style.css` e modifica la sezione `:root`:

```css
:root {
    --accent: #ff6600;          /* Colore principale (arancio) */
    --accent-light: #ff9933;
    --accent-dark: #cc5200;
    --dark-bg: #0a0e27;         /* Background scuro */
    --dark-surface: #1a1f3a;
    --success: #66cc66;         /* Verde per successo */
    --danger: #ff6666;          /* Rosso per errore */
    --warning: #ffcc00;         /* Giallo per attenzione */
}
```

Cambia i colori HEX per modificare l'aspetto del gioco!

---

## 🐛 Troubleshooting

### ❌ "Canvas non appare"
- Verifica che il browser supporti WebGL
- Prova con Chrome/Firefox/Safari più recenti
- Apri Developer Tools (F12) per vedere errori

### ❌ "Note non cadono"
- Assicurati che Three.js sia caricato
- Verifica console (F12 → Console)
- Controlla che `NOTE_SPAWN_RATE` > 0

### ❌ "Quiz non appare"
- Controlla che `game-config.js` sia caricato
- Verifica QUIZZES object in game-config.js
- Assicurati che levelId esista (1-7)

### ❌ "Errore di carimento PNG"
- Controlla percorso assets: `assets/images/`
- Verifica che PNG siano nello stesso livello
- Controlla console per errori CORS

---

## 📊 Statistiche di Gioco

Durante il gioco vedi:

| Elemento | Significato |
|----------|-------------|
| **LIVELLO** | Epoca attuale (1-7) |
| **VITE** | ❤️ Rimaste (perdi una se nota sfugge) |
| **SCORE** | Punti totali accumulati |
| **XP** | Esperienza verso prossimo upgrade |
| **COMBO** | Moltiplicatore punti corrente |
| **BOSS HP** | Salute boss (diminuisce colpendo note) |

---

## 🚀 Deploy Online

### Su GitHub Pages
```bash
# 1. Crea repo: https://github.com/new
# 2. Clona repo
git clone https://github.com/TUO_USERNAME/melody-quest.git
cd melody-quest

# 3. Copia i file della cartella melody-quest/ qui
cp -r melody-quest/* .

# 4. Commit e push
git add .
git commit -m "Add Melody Quest game"
git push origin main

# 5. Settings → Pages → Deploy from main branch
# 6. Visita: https://TUO_USERNAME.github.io/melody-quest
```

### Su Netlify
```bash
# 1. Drag & drop cartella melody-quest/ su Netlify.app
# 2. Automaticamente deployato!
# URL: https://YOUR-SITE.netlify.app
```

### Su Vercel
```bash
# 1. Installa Vercel CLI
npm install -g vercel

# 2. Naviga cartella
cd melody-quest

# 3. Deploy
vercel

# 4. Segui istruzioni, automaticamente online!
```

---

## 📈 Roadmap Futuro

### Prossimamente ✨
- [ ] Audio e musica per ogni epoca
- [ ] PNG integration + texture mapping
- [ ] Boss unique mechanics
- [ ] Nemici minori durante gioco
- [ ] Effetti particellari avanzati
- [ ] Leaderboard online
- [ ] Mobile touch controls

### Lungo Termine 🚀
- [ ] Story narrative con cutscenes
- [ ] Multiplayer PvP
- [ ] Challenge settimanali
- [ ] Achievements e badges
- [ ] New Game+ difficoltà aumentata
- [ ] Modalità Survival infinito

---

## 💡 Pro Tips

1. **Aumenta combo rapidamente** - Clicca più note di fila senza mancare
2. **Guarda HP boss** - Sa quante note mancano al livello
3. **Leggi le domande** - Studiare prima di affrontare quiz
4. **Personalizza difficoltà** - Modifica config per difficoltà preferita
5. **Speedy run** - Completa livello velocemente per bonus punti

---

## 🤝 Supporto

Domande o problemi?
- Leggi `README.md` completo
- Controlla console browser (F12)
- Verifica tutti i file sono nella cartella

---

## 📜 Licenza

MIT - Libero per uso educativo e commerciale

---

**Buon Gioco! 🎵✨**

Diventa il Custode della Musica leggendario! 🎮
