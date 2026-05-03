
// ==================== IMPOSTAZIONI ====================
const settingsStorageKey = "musicWordleSettings";

function getSettings() {
  try {
    return Object.assign(
      { hardMode: false, darkMode: false, highContrast: false },
      JSON.parse(localStorage.getItem(settingsStorageKey)) || {}
    );
  } catch(e) {
    return { hardMode: false, darkMode: false, highContrast: false };
  }
}

function saveSettingsToStorage(s) {
  localStorage.setItem(settingsStorageKey, JSON.stringify(s));
}

function applySettings() {
  const s = {
    hardMode: document.getElementById("settingHardMode")?.checked || false,
    darkMode: document.getElementById("settingDarkMode")?.checked || false,
    highContrast: document.getElementById("settingHighContrast")?.checked || false,
  };
  saveSettingsToStorage(s);

  document.body.classList.toggle("darkMode", s.darkMode);
  document.body.classList.toggle("highContrast", s.highContrast);
}

function loadAndApplySettings() {
  const s = getSettings();
  const hardEl = document.getElementById("settingHardMode");
  const darkEl = document.getElementById("settingDarkMode");
  const contrastEl = document.getElementById("settingHighContrast");
  if (hardEl) hardEl.checked = s.hardMode;
  if (darkEl) darkEl.checked = s.darkMode;
  if (contrastEl) contrastEl.checked = s.highContrast;

  document.body.classList.toggle("darkMode", s.darkMode);
  document.body.classList.toggle("highContrast", s.highContrast);
}

function showSettingsModal() {
  loadAndApplySettings(); // sincronizza toggle con stato salvato
  document.getElementById("settingsModal")?.classList.remove("hidden");
}

function closeSettingsModal() {
  document.getElementById("settingsModal")?.classList.add("hidden");
}

// ==================== HARD MODE: VALIDAZIONE AVANZATA ====================
// Sovrascrive submitGuess per aggiungere il controllo hard mode
const _originalSubmitGuess = submitGuess;
submitGuess = function() {
  const s = getSettings();
  if (s.hardMode && currentRow > 0) {
    const errorMsg = checkHardModeConstraints();
    if (errorMsg) {
      showMessage(errorMsg, 2400);
      shakeCurrentRow();
      return;
    }
  }
  _originalSubmitGuess();
};

function checkHardModeConstraints() {
  // Raccoglie tutte le lettere "correct" e "present" dai tentativi precedenti
  const cells = document.querySelectorAll(".cell");
  const guess = normalizeWord(currentGuess);

  for (let r = 0; r < currentRow; r++) {
    for (let c = 0; c < wordLength; c++) {
      const cell = cells[r * wordLength + c];
      const letter = cell.textContent.trim().toUpperCase();
      if (!letter) continue;

      if (cell.classList.contains("correct")) {
        // La lettera DEVE essere nella stessa posizione
        if (guess[c] !== letter) {
          return `La posizione ${c + 1} deve essere ${letter}`;
        }
      } else if (cell.classList.contains("present")) {
        // La lettera DEVE essere presente da qualche parte
        if (!guess.includes(letter)) {
          return `Il tentativo deve contenere ${letter}`;
        }
      }
    }
  }
  return null;
}

// ==================== AGGIUNGI BOTTONE IMPOSTAZIONI AL showGame ====================
const _originalShowGame = showGame;
showGame = function(label) {
  _originalShowGame(label);

  const settingsBtn = document.getElementById("gameSettingsBtn");
  if (settingsBtn) {
    settingsBtn.classList.remove("hidden");
  }
};

// ==================== CHIUDI IMPOSTAZIONI CON ESC ====================
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeSettingsModal();
  }
});

// ==================== INIT IMPOSTAZIONI ALL'AVVIO ====================
loadAndApplySettings();
