// ==================== CONFIG SUPABASE ====================

const SUPABASE_URL = "https://scyvwnzrykwejflbbmjx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zk2mItmcS4M2XIw2nDJk5w_z2ZqZtpg";

const RANKED_TABLE = "ranked_scores";
const RANKED_DEFAULT_QUESTIONS = 10;
const RANKED_GAME_LABELS = {
  pentagramma: "Pentagramma",
  note: "Note",
  figure: "Figure musicali",
  ritmo: "Ritmo Challenge",
  guanto: "Guanto di sfida",
  wordle: "Music Wordle",
  strumenti: "Strumenti musicali"
};

function getRankedGameLabel(gameName) {
  return RANKED_GAME_LABELS[gameName] || gameName || "Gioco";
}

function getOrCreateRankedUserId() {
  let userId = localStorage.getItem("mgh_userId");

  if (!userId) {
    userId = "user_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("mgh_userId", userId);
  }

  return userId;
}

function getRankedAuthUser() {
  try {
    return JSON.parse(localStorage.getItem("mgh_auth_user") || "null");
  } catch {
    return null;
  }
}

function getRankedUsernameKey() {
  const user = getRankedAuthUser();
  return user?.id ? `mgh_username_${user.id}` : "mgh_username";
}

function getRankedDisplayName() {
  const user = getRankedAuthUser();
  const metadata = user?.user_metadata || user?.raw_user_meta_data || {};
  const fullName = metadata.full_name || metadata.name;
  const firstName = metadata.first_name || metadata.given_name;
  const emailName = user?.email ? user.email.split("@")[0] : "";
  return (firstName || fullName || emailName || "").trim();
}

function getOrCreateRankedUsername() {
  const usernameKey = getRankedUsernameKey();
  let username = localStorage.getItem(usernameKey) || localStorage.getItem("mgh_username");

  if (!username) {
    username = getRankedDisplayName().slice(0, 20) || "Player_" + Math.floor(Math.random() * 10000);
  }

  localStorage.setItem(usernameKey, username);
  localStorage.setItem("mgh_username", username);
  return username;
}

function setRankedUsername(username) {
  const cleanUsername = String(username || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 20);

  if (!cleanUsername) return getOrCreateRankedUsername();

  localStorage.setItem(getRankedUsernameKey(), cleanUsername);
  localStorage.setItem("mgh_username", cleanUsername);
  return cleanUsername;
}

function toRankedDbRecord(snapshot) {
  return {
    sessionid: snapshot.session_id,
    userid: snapshot.user_id,
    username: snapshot.username,
    gamename: snapshot.game_name,
    mode: snapshot.mode,
    starttime: snapshot.start_time,
    endtime: snapshot.end_time,
    totaltime: snapshot.total_time,
    totalquestions: snapshot.total_questions,
    correct: snapshot.correct,
    wrong: snapshot.wrong,
    accuracy: snapshot.accuracy,
    basescore: snapshot.base_score,
    bonusspeed: snapshot.bonus_speed,
    totalscore: snapshot.total_score,
    answers: snapshot.answers
  };
}

function fromRankedDbRecord(row = {}) {
  return {
    user_id: row.userid,
    username: row.username,
    game_name: row.gamename,
    total_score: row.totalscore,
    accuracy: row.accuracy,
    total_time: row.totaltime,
    created_at: row.created_at
  };
}

// ==================== SUPABASE CLIENT SEMPLICE ====================

class SupabaseClient {
  constructor(url, anonKey) {
    this.url = url;
    this.anonKey = anonKey;
  }

  async request(path, options = {}) {
    const response = await fetch(`${this.url}/rest/v1/${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "apikey": this.anonKey,
        "Authorization": `Bearer ${this.anonKey}`,
        "Prefer": "return=representation",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Errore Supabase:", response.status, errorText);
      return null;
    }

    return await response.json();
  }

  async insert(table, data) {
    return this.request(table, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  async select(path) {
    return this.request(path, {
      method: "GET"
    });
  }
}

const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== RANKED SESSION ====================

class RankedSession {
  constructor(gameName) {
    this.sessionId = this.generateSessionId();
    this.gameName = gameName || "unknown_game";
    this.mode = "ranked";

    this.maxQuestions = 10;
    this.currentQuestion = 0;

    this.startTime = Date.now();
    this.endTime = null;
    this.totalTime = 0;

    this.correct = 0;
    this.wrong = 0;
    this.accuracy = 0;

    this.baseScore = 0;
    this.bonusSpeed = 0;
    this.totalScore = 0;

    this.answers = [];

    this.userId = getOrCreateRankedUserId();
    this.username = getOrCreateRankedUsername();
  }

  generateSessionId() {
    return "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  }

  getOrCreateUserId() {
    return getOrCreateRankedUserId();
  }

  getOrCreateUsername() {
    return getOrCreateRankedUsername();
  }

  setUsername(username) {
    this.username = setRankedUsername(username);
  }

  getDifficultyForQuestion(questionNumber = this.currentQuestion + 1) {
    if (questionNumber <= 3) return "easy";
    if (questionNumber <= 7) return "medium";
    return "hard";
  }

  getCurrentDifficulty() {
    return this.getDifficultyForQuestion(this.currentQuestion + 1);
  }

  getQuestionNumber() {
    return this.currentQuestion + 1;
  }

  recordAnswer(isCorrect, timeTaken) {
    if (this.isComplete()) return;

    const questionNumber = this.currentQuestion + 1;
    const difficulty = this.getDifficultyForQuestion(questionNumber);

    const safeTimeTaken = Number(timeTaken) || 0;
    const correct = Boolean(isCorrect);

    this.currentQuestion++;

    if (correct) {
      this.correct++;
    } else {
      this.wrong++;
    }

    this.answers.push({
      questionNumber,
      correct,
      timeTaken: safeTimeTaken,
      difficulty,
      score: this.getScoreForAnswer(correct, safeTimeTaken, difficulty),
      timestamp: new Date().toISOString()
    });

    this.updateMetrics();

    if (this.isComplete()) {
      this.endSession();
    }
  }

  getScoreForAnswer(isCorrect, timeTaken, difficulty) {
    if (!isCorrect) return 0;

    const multiplier = this.getDifficultyMultiplier(difficulty);

    let score = 100 * multiplier;

    if (timeTaken <= 2) {
      score += 25 * multiplier;
    } else if (timeTaken <= 5) {
      score += 10 * multiplier;
    }

    return Math.round(score);
  }

  getDifficultyMultiplier(difficulty) {
    if (difficulty === "easy") return 1;
    if (difficulty === "medium") return 1.5;
    if (difficulty === "hard") return 2;
    return 1;
  }

  updateMetrics() {
    this.accuracy = this.currentQuestion > 0
      ? Math.round((this.correct / this.currentQuestion) * 100)
      : 0;

    this.calculateScore();
  }

  calculateScore() {
    let baseScore = 0;
    let bonusSpeed = 0;

    this.answers.forEach(answer => {
      if (!answer.correct) return;

      const multiplier = this.getDifficultyMultiplier(answer.difficulty);

      baseScore += 100 * multiplier;

      if (answer.timeTaken <= 2) {
        bonusSpeed += 25 * multiplier;
      } else if (answer.timeTaken <= 5) {
        bonusSpeed += 10 * multiplier;
      }
    });

    this.baseScore = Math.round(baseScore);
    this.bonusSpeed = Math.round(bonusSpeed);
    this.totalScore = this.baseScore + this.bonusSpeed;
  }

  isComplete() {
    return this.currentQuestion >= this.maxQuestions;
  }

  endSession() {
    if (this.endTime) return;

    this.endTime = Date.now();
    this.totalTime = Math.round((this.endTime - this.startTime) / 1000);

    this.updateMetrics();
  }

  getSnapshot() {
    if (!this.endTime) {
      this.endSession();
    }

    return {
      session_id: this.sessionId,
      user_id: this.userId,
      username: this.username,
      game_name: this.gameName,
      mode: this.mode,

      start_time: new Date(this.startTime).toISOString(),
      end_time: new Date(this.endTime).toISOString(),
      total_time: this.totalTime,

      total_questions: this.maxQuestions,
      correct: this.correct,
      wrong: this.wrong,
      accuracy: this.accuracy,

      base_score: this.baseScore,
      bonus_speed: this.bonusSpeed,
      total_score: this.totalScore,

      answers: this.answers
    };
  }

  async saveToSupabase() {
    const snapshot = this.getSnapshot();
    const dbRecord = toRankedDbRecord(snapshot);

    const result = await supabase.insert(RANKED_TABLE, dbRecord);

    if (!result) {
      console.error("Salvataggio ranked fallito");
      return null;
    }

    return result;
  }
}

// ==================== LEADERBOARD ====================

class RankedLeaderboard {
  async getGameLeaderboard(gameName, limit = 10) {
    const safeGameName = encodeURIComponent(gameName);
    const safeLimit = Number(limit) || 10;

    const path =
      `${RANKED_TABLE}?gamename=eq.${safeGameName}` +
      `&select=userid,username,gamename,totalscore,accuracy,totaltime,created_at` +
      `&order=totalscore.desc` +
      `&limit=${safeLimit}`;

    const rows = await supabase.select(path) || [];
    return rows.map(fromRankedDbRecord);
  }

  async getUserBestScore(gameName, userId) {
    const safeGameName = encodeURIComponent(gameName);
    const safeUserId = encodeURIComponent(userId);

    const path =
      `${RANKED_TABLE}?gamename=eq.${safeGameName}` +
      `&userid=eq.${safeUserId}` +
      `&select=userid,username,gamename,totalscore,accuracy,totaltime,created_at` +
      `&order=totalscore.desc` +
      `&limit=1`;

    const result = await supabase.select(path);

    return result && result.length ? fromRankedDbRecord(result[0]) : null;
  }

  async getGlobalLeaderboard(limit = 10) {
    const safeLimit = Number(limit) || 10;

    const path =
      `${RANKED_TABLE}?select=userid,username,gamename,totalscore,accuracy,created_at` +
      `&order=totalscore.desc` +
      `&limit=200`;

    const scores = (await supabase.select(path) || []).map(fromRankedDbRecord);

    if (!scores.length) return [];

    const users = {};

    scores.forEach(score => {
      if (!users[score.user_id]) {
        users[score.user_id] = {
          user_id: score.user_id,
          username: score.username,
          best_score: 0,
          total_score: 0,
          games_played: new Set(),
          last_played_at: null
        };
      }

      users[score.user_id].best_score = Math.max(
        users[score.user_id].best_score,
        score.total_score
      );

      users[score.user_id].total_score += score.total_score;
      users[score.user_id].games_played.add(score.game_name);

      if (score.created_at && (!users[score.user_id].last_played_at ||
        new Date(score.created_at) > new Date(users[score.user_id].last_played_at))) {
        users[score.user_id].last_played_at = score.created_at;
      }
    });

    return Object.values(users)
      .map(user => ({
        user_id: user.user_id,
        username: user.username,
        best_score: user.best_score,
        total_score: user.total_score,
        games_played: user.games_played.size,
        last_played_at: user.last_played_at
      }))
      .sort((a, b) => b.best_score - a.best_score)
      .slice(0, safeLimit);
  }
}

const rankedLeaderboard = new RankedLeaderboard();

async function saveRankedScore({
  gameName,
  username = "",
  totalScore = 0,
  correct = 0,
  wrong = 0,
  totalQuestions = RANKED_DEFAULT_QUESTIONS,
  totalTime = 0,
  mode = "ranked",
  accuracy,
  answers = []
}) {
  const now = new Date().toISOString();
  const safeCorrect = Number(correct) || 0;
  const safeWrong = Number(wrong) || 0;
  const safeTotalQuestions = Number(totalQuestions) || RANKED_DEFAULT_QUESTIONS;
  const safeTotalScore = Math.max(0, Math.round(Number(totalScore) || 0));
  const safeTotalTime = Math.max(0, Math.round(Number(totalTime) || 0));
  const safeAccuracy = Number.isFinite(Number(accuracy))
    ? Math.round(Number(accuracy))
    : Math.round((safeCorrect / Math.max(1, safeTotalQuestions)) * 100);

  const snapshot = {
    session_id: "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10),
    user_id: getOrCreateRankedUserId(),
    username: setRankedUsername(username),
    game_name: gameName || "unknown_game",
    mode,
    start_time: now,
    end_time: now,
    total_time: safeTotalTime,
    total_questions: safeTotalQuestions,
    correct: safeCorrect,
    wrong: safeWrong,
    accuracy: safeAccuracy,
    base_score: safeTotalScore,
    bonus_speed: 0,
    total_score: safeTotalScore,
    answers
  };

  return await supabase.insert(RANKED_TABLE, toRankedDbRecord(snapshot));
}

function escapeRankedHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatRankedDate(value) {
  if (!value) return "Data non disponibile";

  try {
    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function showRankedIntro({ gameName, title = "Modalità Classificata", text = "", onStart }) {
  const modal = document.createElement("div");
  modal.className = "rankedModal rankedIntroModal";

  modal.innerHTML = `
    <div class="modalOverlay"></div>
    <div class="modalPanel rankedIntroPanel">
      <button class="modalClose" type="button" aria-label="Annulla">×</button>
      <h2>🏆 ${escapeRankedHTML(title)}</h2>
      <p class="rankedIntroText">${text || "Completa la sfida e salva il punteggio nella classifica di Music Game Hub."}</p>
      <label class="rankedNicknameField">
        <span>Nickname in classifica</span>
        <input id="rankedNicknameInput" type="text" maxlength="20" placeholder="Es. MusicPlayer23" autocomplete="nickname" value="${escapeRankedHTML(getOrCreateRankedUsername())}">
      </label>
      <p class="rankedPrivacyHint">Usa un nickname: evita nome e cognome reali.</p>
      <button class="rankedIntroStartBtn" type="button">Inizia</button>
    </div>
  `;

  modal.querySelector(".modalClose")?.addEventListener("click", () => {
    modal.remove();
  });

  modal.querySelector(".modalOverlay")?.addEventListener("click", () => {
    modal.remove();
  });

  modal.querySelector(".rankedIntroStartBtn")?.addEventListener("click", () => {
    const nickname = modal.querySelector("#rankedNicknameInput")?.value || "";
    modal.remove();
    if (typeof onStart === "function") onStart(setRankedUsername(nickname), gameName);
  });

  document.body.appendChild(modal);
}

function updateRankedProgressUI({ score = 0, current = 0, total = RANKED_DEFAULT_QUESTIONS } = {}) {
  const scoreEl = document.getElementById("rankedScore");
  const counterEl = document.getElementById("rankedQuestionCounter");
  const fillEl = document.getElementById("rankedProgressFill");

  if (scoreEl) scoreEl.textContent = Math.max(0, Math.round(score));
  if (counterEl) counterEl.textContent = `${Math.min(current + 1, total)}/${total}`;
  if (fillEl) fillEl.style.width = `${Math.min(100, (current / Math.max(1, total)) * 100)}%`;
}

function showRankedUI() {
  document.getElementById("rankedUI")?.classList.remove("hidden");
}

function hideRankedUI() {
  document.getElementById("rankedUI")?.classList.add("hidden");
}

function showLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.remove("hidden");
}

function hideLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.add("hidden");
}

function renderGenericLeaderboardRows(rows, userId) {
  if (!rows || rows.length === 0) {
    return `<p class="gameIntro">Nessun punteggio disponibile.</p>`;
  }

  return rows.map((row, index) => {
    const isUser = row.user_id === userId;
    const scoreDate = row.last_played_at || row.created_at;
    const title = row.last_played_at
      ? `Ultimo aggiornamento: ${formatRankedDate(scoreDate)}`
      : `Partita del: ${formatRankedDate(scoreDate)}`;

    return `
      <div class="leaderboardRow ${isUser ? "userRow" : ""}" title="${escapeRankedHTML(title)}">
        <span class="rank">#${index + 1}</span>
        <span>${escapeRankedHTML(row.username || "Player")}</span>
        <span class="score">${Math.round(row.total_score || row.best_score || 0)}</span>
      </div>
    `;
  }).join("");
}

async function showGenericRankedLeaderboardModal(gameName) {
  const userId = localStorage.getItem("mgh_userId");
  const gameTop = await rankedLeaderboard.getGameLeaderboard(gameName, 10);
  const globalTop = await rankedLeaderboard.getGlobalLeaderboard(10);
  const title = getRankedGameLabel(gameName);

  const modal = document.createElement("div");
  modal.className = "rankedModal";
  modal.innerHTML = `
    <div class="modalOverlay" onclick="closeGenericRankedLeaderboardModal()"></div>
    <div class="modalPanel">
      <button class="modalClose" onclick="closeGenericRankedLeaderboardModal()" aria-label="Chiudi">×</button>
      <h2>🏆 Classifiche</h2>
      <div class="rankedTabs">
        <button class="rankedTab active" onclick="switchGenericRankedTab(this, 'game')">${escapeRankedHTML(title)}</button>
        <button class="rankedTab" onclick="switchGenericRankedTab(this, 'global')">Generale</button>
      </div>
      <div id="rankedGameTab">${renderGenericLeaderboardRows(gameTop, userId)}</div>
      <div id="rankedGlobalTab" class="hidden">${renderGenericLeaderboardRows(globalTop, userId)}</div>
    </div>
  `;

  document.body.appendChild(modal);
}

function switchGenericRankedTab(button, tab) {
  document.querySelectorAll(".rankedTab").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  document.getElementById("rankedGameTab")?.classList.toggle("hidden", tab !== "game");
  document.getElementById("rankedGlobalTab")?.classList.toggle("hidden", tab !== "global");
}

function closeGenericRankedLeaderboardModal() {
  document.querySelector(".rankedModal")?.remove();
}

// ==================== VARIABILI GLOBALI DA USARE NEL GIOCO ====================

let currentRankedSession = null;
let rankedQuestionStartTime = null;

// ==================== FUNZIONI DA CHIAMARE DAL TUO GIOCO ====================

function startRankedMode(gameName) {
  currentRankedSession = new RankedSession(gameName);
  rankedQuestionStartTime = Date.now();

  return currentRankedSession;
}

function getRankedDifficulty() {
  if (!currentRankedSession) return "easy";

  return currentRankedSession.getCurrentDifficulty();
}

function startRankedQuestionTimer() {
  rankedQuestionStartTime = Date.now();
}

function answerRankedQuestion(isCorrect) {
  if (!currentRankedSession) {
    console.error("Nessuna sessione ranked attiva");
    return null;
  }

  const timeTaken = rankedQuestionStartTime
    ? (Date.now() - rankedQuestionStartTime) / 1000
    : 0;

  currentRankedSession.recordAnswer(isCorrect, timeTaken);

  rankedQuestionStartTime = Date.now();

  return currentRankedSession;
}

async function finishRankedMode() {
  if (!currentRankedSession) {
    console.error("Nessuna sessione ranked da terminare");
    return null;
  }

  currentRankedSession.endSession();

  const result = await currentRankedSession.saveToSupabase();

  return {
    session: currentRankedSession,
    saved: Boolean(result),
    result
  };
}

function resetRankedMode() {
  currentRankedSession = null;
  rankedQuestionStartTime = null;
}
