// ==================== CONFIG SUPABASE ====================

const SUPABASE_URL = "https://scyvwnzrykwejflbbmjx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zk2mItmcS4M2XIw2nDJk5w_z2ZqZtpg";

const RANKED_TABLE = "ranked_scores";
const RANKED_DEFAULT_QUESTIONS = 10;
const RANKED_GAME_LABELS = {
  pentagramma: "Pentagramma",
  note: "Note",
  figure: "Figure musicali",
  ritmo: "Conta le pulsazioni",
  scale: "Ordina la scala",
  guanto: "Guanto di sfida",
  wordle: "Music Wordle",
  strumenti: "Strumenti musicali",
  detective_suono: "Detective del suono"
};

function getRankedGameLabel(gameName) {
  return RANKED_GAME_LABELS[gameName] || gameName || "Gioco";
}

const RECENT_RANDOM_PICK_KEYS = new Map();

function getRankedDifficultyForQuestion(questionNumber = 1) {
  if (questionNumber <= 3) return "easy";
  if (questionNumber <= 7) return "medium";
  return "hard";
}

function getRankedDifficultyForIndex(questionIndex = 0) {
  return getRankedDifficultyForQuestion(Number(questionIndex) + 1);
}

function getRankedDifficultyMultiplier(difficulty) {
  if (difficulty === "easy") return 1;
  if (difficulty === "medium") return 1.5;
  if (difficulty === "hard") return 2;
  return 1;
}

function getRankedAnswerScoreParts({ isCorrect, elapsed = 0, timeTaken = elapsed, difficulty = "easy" } = {}) {
  const multiplier = getRankedDifficultyMultiplier(difficulty);
  const safeTime = Math.max(0, Number(timeTaken) || 0);
  const baseScore = isCorrect ? 100 * multiplier : 0;
  let bonusSpeed = 0;

  if (isCorrect && safeTime <= 2) bonusSpeed = 25 * multiplier;
  else if (isCorrect && safeTime <= 5) bonusSpeed = 10 * multiplier;

  return {
    baseScore: Math.round(baseScore),
    bonusSpeed: Math.round(bonusSpeed),
    totalScore: Math.round(baseScore + bonusSpeed)
  };
}

function getRankedAnswerScore(options = {}) {
  return getRankedAnswerScoreParts(options).totalScore;
}

function getNoRepeatKey(item, keyFn) {
  if (typeof keyFn === "function") return String(keyFn(item));
  if (item && typeof item === "object") {
    return String(item.id ?? item.name ?? item.label ?? item.title ?? JSON.stringify(item));
  }
  return String(item);
}

function pickRandomNoRepeat(items, options = {}) {
  const pool = Array.isArray(items) ? items.filter(item => item !== undefined && item !== null) : [];
  if (!pool.length) return null;

  const namespace = options.namespace || "default";
  const keyFn = options.key;
  const previousKey = RECENT_RANDOM_PICK_KEYS.get(namespace);
  const available = pool.length > 1
    ? pool.filter(item => getNoRepeatKey(item, keyFn) !== previousKey)
    : pool;

  const selected = available[Math.floor(Math.random() * available.length)] || pool[0];
  RECENT_RANDOM_PICK_KEYS.set(namespace, getNoRepeatKey(selected, keyFn));
  return selected;
}

function shuffleNoImmediateRepeat(items, options = {}) {
  const keyFn = options.key;
  const shuffled = [...items].sort(() => Math.random() - 0.5);

  for (let i = 1; i < shuffled.length; i++) {
    if (getNoRepeatKey(shuffled[i], keyFn) !== getNoRepeatKey(shuffled[i - 1], keyFn)) continue;

    const swapIndex = shuffled.findIndex((item, index) =>
      index > i &&
      getNoRepeatKey(item, keyFn) !== getNoRepeatKey(shuffled[i - 1], keyFn) &&
      (index === shuffled.length - 1 || getNoRepeatKey(shuffled[i], keyFn) !== getNoRepeatKey(shuffled[index + 1], keyFn))
    );

    if (swapIndex > i) {
      [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
    }
  }

  return shuffled;
}

function getOrCreateRankedUserId() {
  const authUser = getRankedAuthUser();
  if (authUser?.id) {
    localStorage.setItem("mgh_userId", authUser.id);
    return authUser.id;
  }

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

function isRankedUserLoggedIn() {
  return Boolean(getRankedAuthUser()?.id);
}

function getOrCreateGuestRankedUsername() {
  let username = localStorage.getItem("mgh_guest_username");

  if (!username) {
    username = "Player_" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("mgh_guest_username", username);
  }

  return username;
}

function getRankedUsernameKey() {
  const user = getRankedAuthUser();
  return user?.id ? `mgh_username_${user.id}` : "mgh_guest_username";
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
  if (!isRankedUserLoggedIn()) {
    const guestUsername = getOrCreateGuestRankedUsername();
    localStorage.setItem("mgh_username", guestUsername);
    return guestUsername;
  }

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
  if (!isRankedUserLoggedIn()) {
    return getOrCreateRankedUsername();
  }

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
    session_id: row.sessionid,
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
    return getRankedDifficultyForQuestion(questionNumber);
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
    return getRankedAnswerScore({ isCorrect, timeTaken, difficulty });
  }

  getDifficultyMultiplier(difficulty) {
    return getRankedDifficultyMultiplier(difficulty);
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

      const scoreParts = getRankedAnswerScoreParts({
        isCorrect: answer.correct,
        timeTaken: answer.timeTaken,
        difficulty: answer.difficulty
      });
      baseScore += scoreParts.baseScore;
      bonusSpeed += scoreParts.bonusSpeed;
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
      `&select=sessionid,userid,username,gamename,totalscore,accuracy,totaltime,created_at` +
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
      `&select=sessionid,userid,username,gamename,totalscore,accuracy,totaltime,created_at` +
      `&order=totalscore.desc` +
      `&limit=1`;

    const result = await supabase.select(path);

    return result && result.length ? fromRankedDbRecord(result[0]) : null;
  }

  async getGlobalLeaderboard(limit = 10) {
    const safeLimit = Number(limit) || 10;

    const path =
      `${RANKED_TABLE}?select=sessionid,userid,username,gamename,totalscore,accuracy,created_at` +
      `&order=totalscore.desc` +
      `&limit=1000`;

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
          best_scores_by_game: new Map(),
          last_played_at: null
        };
      }

      const previousBestForGame = users[score.user_id].best_scores_by_game.get(score.game_name) || 0;
      if (score.total_score > previousBestForGame) {
        users[score.user_id].best_scores_by_game.set(score.game_name, score.total_score);
      }

      users[score.user_id].best_score = Math.max(
        users[score.user_id].best_score,
        score.total_score
      );

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
        total_score: [...user.best_scores_by_game.values()].reduce((sum, score) => sum + score, 0),
        games_played: user.best_scores_by_game.size,
        last_played_at: user.last_played_at
      }))
      .sort((a, b) => b.total_score - a.total_score)
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
  const canEditNickname = isRankedUserLoggedIn();
  const nicknameHint = canEditNickname
    ? "Usa un nickname: evita nome e cognome reali."
    : "Accesso ospite: il nickname viene assegnato automaticamente. Accedi per sceglierlo.";

  modal.innerHTML = `
    <div class="modalOverlay"></div>
    <div class="modalPanel rankedIntroPanel">
      <button class="modalClose" type="button" aria-label="Annulla">×</button>
      <h2>🏆 ${escapeRankedHTML(title)}</h2>
      <p class="rankedIntroText">${text || "Completa la sfida e salva il punteggio nella classifica di Music Game Hub."}</p>
      <label class="rankedNicknameField">
        <span>Nickname in classifica</span>
        <input id="rankedNicknameInput" type="text" maxlength="20" placeholder="Es. MusicPlayer23" autocomplete="nickname" value="${escapeRankedHTML(getOrCreateRankedUsername())}" ${canEditNickname ? "" : "readonly aria-readonly=\"true\""}>
      </label>
      <p class="rankedPrivacyHint">${escapeRankedHTML(nicknameHint)}</p>
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
  document.getElementById("gameModeHelpBtn")?.classList.remove("hidden");
}

function hideLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.add("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.add("hidden");
}

function getInsertedRankedRow(saveResult) {
  return Array.isArray(saveResult) && saveResult.length ? saveResult[0] : null;
}

function createRankedCompletionPayload({
  gameName,
  session,
  saveResult,
  totalScore,
  correct,
  totalQuestions,
  accuracy,
  totalTime,
  saved = true
} = {}) {
  const inserted = getInsertedRankedRow(saveResult);
  const sessionId = session?.sessionId || inserted?.sessionid || inserted?.session_id || null;
  const score = Math.round(Number(session?.totalScore ?? totalScore) || 0);
  const safeCorrect = Number(session?.correct ?? correct) || 0;
  const safeTotal = Number(session?.maxQuestions ?? totalQuestions) || RANKED_DEFAULT_QUESTIONS;
  const safeAccuracy = Number.isFinite(Number(session?.accuracy ?? accuracy))
    ? Math.round(Number(session?.accuracy ?? accuracy))
    : Math.round((safeCorrect / Math.max(1, safeTotal)) * 100);
  const safeTime = Number(session?.totalTime ?? totalTime) || 0;

  return {
    gameName: gameName || session?.gameName || inserted?.gamename || "unknown_game",
    saved: Boolean(saved),
    sessionId,
    userId: session?.userId || inserted?.userid || getOrCreateRankedUserId(),
    totalScore: score,
    correct: safeCorrect,
    totalQuestions: safeTotal,
    accuracy: safeAccuracy,
    totalTime: safeTime,
    summary:
      `Classificata completata! Punteggio: ${score} · ` +
      `Corrette: ${safeCorrect}/${safeTotal} · Accuratezza: ${safeAccuracy}%` +
      (saved ? "" : " · salvataggio non riuscito")
  };
}

function rankedRowMatchesHighlight(row, highlight) {
  if (!row || !highlight) return false;
  if (highlight.sessionId && row.session_id === highlight.sessionId) return true;

  return row.user_id === highlight.userId &&
    Math.round(row.total_score || row.best_score || 0) === Math.round(highlight.totalScore || 0) &&
    Math.round(row.accuracy || 0) === Math.round(highlight.accuracy || 0);
}

function renderGenericLeaderboardRows(rows, userId, highlight = null) {
  if (!rows || rows.length === 0) {
    return `<p class="gameIntro">Nessun punteggio disponibile.</p>`;
  }

  return rows.map((row, index) => {
    const isUser = row.user_id === userId;
    const isFresh = rankedRowMatchesHighlight(row, highlight);
    const rankNumber = row.rank_number || index + 1;
    const scoreDate = row.last_played_at || row.created_at;
    const title = row.last_played_at
      ? `Ultimo aggiornamento: ${formatRankedDate(scoreDate)}`
      : `Partita del: ${formatRankedDate(scoreDate)}`;

    return `
      <div class="leaderboardRow ${isUser ? "userRow" : ""} ${isFresh ? "freshRankedRow" : ""}" title="${escapeRankedHTML(title)}">
        <span class="rank">#${rankNumber}</span>
        <span>${escapeRankedHTML(row.username || "Player")}</span>
        <span class="score">${Math.round(row.total_score || row.best_score || 0)}</span>
      </div>
    `;
  }).join("");
}

function renderUserBestScore(row) {
  if (!row) {
    return `
      <div class="rankedUserSummary muted">
        <strong>Il tuo miglior risultato</strong>
        <span>Non hai ancora punteggi salvati per questo gioco.</span>
      </div>
    `;
  }

  return `
    <div class="rankedUserSummary">
      <strong>Il tuo miglior risultato</strong>
      <div class="leaderboardRow userRow compactUserRow" title="Miglior risultato salvato">
        <span class="rank">★</span>
        <span>${escapeRankedHTML(row.username || "Player")}</span>
        <span class="score">${Math.round(row.total_score || row.best_score || 0)}</span>
      </div>
    </div>
  `;
}

async function showGenericRankedLeaderboardModal(gameName, options = {}) {
  const userId = getOrCreateRankedUserId();
  const highlight = options.highlight || null;
  const gameRows = await rankedLeaderboard.getGameLeaderboard(gameName, highlight ? 200 : 10);
  const highlightedIndex = highlight
    ? gameRows.findIndex(row => rankedRowMatchesHighlight(row, highlight))
    : -1;
  const gameTop = gameRows.slice(0, 10).map((row, index) => ({ ...row, rank_number: index + 1 }));
  if (highlightedIndex >= 10) {
    gameTop.push({
      ...gameRows[highlightedIndex],
      rank_number: highlightedIndex + 1
    });
  }
  const userBest = await rankedLeaderboard.getUserBestScore(gameName, userId);
  const globalTop = await rankedLeaderboard.getGlobalLeaderboard(10);
  const title = getRankedGameLabel(gameName);
  const summary = options.summary || highlight?.summary || "";

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
      ${summary ? `<div class="rankedResultSummary">${escapeRankedHTML(summary)}</div>` : ""}
      ${renderUserBestScore(userBest)}
      <div id="rankedGameTab">${renderGenericLeaderboardRows(gameTop, userId, highlight)}</div>
      <div id="rankedGlobalTab" class="hidden">${renderGenericLeaderboardRows(globalTop, userId, highlight)}</div>
    </div>
  `;

  document.body.appendChild(modal);
}

async function showRankedCompletionModal(payload) {
  const completion = createRankedCompletionPayload(payload);
  await showGenericRankedLeaderboardModal(completion.gameName, {
    highlight: completion,
    summary: completion.summary
  });
}

function getModeHelpContext() {
  if (document.body.classList.contains("pentagrammaGamePage")) return "pentagramma";
  if (document.body.classList.contains("gamePage")) return "note";
  if (document.body.classList.contains("figuresGamePage")) return "figure";
  if (document.body.classList.contains("ritmoPage")) return "ritmo";
  if (document.body.classList.contains("scaleGamePage")) return "scale";
  if (document.body.classList.contains("soundDetectivePage")) return "detective_suono";
  if (document.body.classList.contains("strumentiGamePage")) return "strumenti";
  if (document.body.classList.contains("guantoPage")) return "guanto";
  if (document.body.classList.contains("wordlePage")) return "wordle";
  return "generic";
}

function getSpecificModeHelpText(label, context) {
  const lower = String(label || "").toLowerCase();

  if (context === "pentagramma") {
    if (lower.includes("facile")) {
      return "Domande solo sulle 5 righe e sui 4 spazi dentro il pentagramma.";
    }
    if (lower.includes("medio")) {
      return "Domande solo fuori dal pentagramma: spazi e tagli addizionali sopra e sotto.";
    }
    if (lower.includes("difficile")) {
      return "Domande su tutte le posizioni, dentro e fuori dal pentagramma, con tempo a disposizione.";
    }
    if (lower.includes("classificata")) {
      return "10 domande con difficoltà crescente: prima pentagramma, poi posizioni esterne, infine anche tagli addizionali. Il punteggio premia risposte corrette e velocità.";
    }
  }

  if (context === "note") {
    if (lower.includes("facile")) {
      return "Note dentro il pentagramma, senza tagli addizionali: ideale per ripassare le posizioni principali.";
    }
    if (lower.includes("medio")) {
      return "Note dentro e vicino al pentagramma: aumenta l'estensione e richiede più attenzione alla chiave scelta.";
    }
    if (lower.includes("difficile")) {
      return "Note su un'estensione più ampia, con posizioni sopra e sotto il pentagramma.";
    }
    if (lower.includes("classificata")) {
      return "10 note con difficoltà crescente nella chiave scelta. Il punteggio premia risposta corretta e rapidità.";
    }
  }

  if (context === "figure") {
    if (lower.includes("note")) {
      return "Riconosci solo le figure musicali di durata, come semibreve, minima, semiminima e croma.";
    }
    if (lower.includes("pause")) {
      return "Riconosci solo le pause musicali e collega ogni simbolo al suo nome.";
    }
    if (lower.includes("misto")) {
      return "Alterna figure e pause: serve per distinguere simboli simili e ripassare tutto insieme.";
    }
    if (lower.includes("classificata")) {
      return "10 domande miste su figure e pause. Il punteggio premia precisione e velocità.";
    }
  }

  if (context === "ritmo") {
    if (lower.includes("facile")) {
      return "Sequenze brevi con figure semplici: conti il valore totale in pulsazioni.";
    }
    if (lower.includes("medio")) {
      return "Sequenze più varie: entrano anche crome e pause, quindi il calcolo richiede più attenzione.";
    }
    if (lower.includes("difficile")) {
      return "Sequenze più lunghe e complete, con figure e pause diverse da sommare correttamente.";
    }
    if (lower.includes("classificata")) {
      return "10 sequenze di figure con difficoltà crescente. Il punteggio premia calcolo corretto e velocità.";
    }
  }

  if (context === "scale") {
    if (lower.includes("facile")) {
      return "Ordina le note di scale maggiori e minori con la formula Toni/Semitoni come riferimento.";
    }
    if (lower.includes("medio")) {
      return "La scala è visibile: devi completare correttamente i passaggi T e S tra le note.";
    }
    if (lower.includes("difficile")) {
      return "Costruisci la scala scegliendo le note in ordine sulla tastiera cromatica.";
    }
    if (lower.includes("classificata")) {
      return "10 scale con difficoltà crescente. Il punteggio premia precisione e velocità.";
    }
  }

  if (context === "detective_suono") {
    if (lower.includes("facile")) {
      return "Domande singole: riconosci una caratteristica alla volta, come suono/rumore, grave/acuto, forte/debole o lungo/corto.";
    }
    if (lower.includes("medio")) {
      return "Domande combinate: devi riconoscere due caratteristiche dello stesso indizio sonoro.";
    }
    if (lower.includes("difficile")) {
      return "Analisi completa: osservi e ascolti l'indizio per riconoscere più caratteristiche insieme.";
    }
    if (lower.includes("classificata")) {
      return "10 indizi sonori con difficoltà crescente. Conta la precisione e il tempo di risposta.";
    }
  }

  if (context === "strumenti") {
    if (lower.includes("riconosci")) {
      return "Guardi le immagini e scegli lo strumento corretto tra le opzioni.";
    }
    if (lower.includes("memory")) {
      return "Abbini strumenti e famiglie musicali: serve memoria visiva e conoscenza delle famiglie.";
    }
    if (lower.includes("ascolta")) {
      return "Ascolti l'audio dello strumento e scegli il nome corretto.";
    }
    if (lower.includes("classificata")) {
      return "10 domande miste tra riconoscimento visivo, ascolto e famiglie. Il punteggio premia precisione e velocità.";
    }
  }

  if (context === "guanto") {
    if (lower.includes("10")) {
      return "Sfida breve: 10 domande miste su note, figure e teoria musicale.";
    }
    if (lower.includes("20")) {
      return "Sfida media: 20 domande miste, utile per un allenamento più completo.";
    }
    if (lower.includes("30")) {
      return "Sfida completa: 30 domande per ripassare più argomenti in una sola partita.";
    }
    if (lower.includes("classificata")) {
      return "10 domande miste ufficiali. Il punteggio considera risposte corrette, errori e tempo totale.";
    }
  }

  if (context === "wordle") {
    if (lower.includes("facile")) {
      return "Parole musicali più brevi e accessibili: ideale per iniziare.";
    }
    if (lower.includes("medio")) {
      return "Parole musicali di difficoltà intermedia, con termini più specifici.";
    }
    if (lower.includes("difficile")) {
      return "Parole musicali più lunghe o tecniche: richiede più vocabolario musicale.";
    }
    if (lower.includes("parola") || lower.includes("daily") || lower.includes("giorno")) {
      return "Parola musicale giornaliera uguale per tutti. Si gioca una volta al giorno e salva il risultato nella classifica.";
    }
  }

  return "";
}

function getModeHelpText(label) {
  const clean = String(label || "").replace(/\s+/g, " ").trim();
  const lower = clean.toLowerCase();
  const specificText = getSpecificModeHelpText(clean, getModeHelpContext());

  if (specificText) return specificText;

  if (lower.includes("classificata") || lower.includes("ranked")) {
    return "Sfida ufficiale con punteggio salvato in classifica. Conta precisione e, dove previsto, velocità.";
  }
  if (lower.includes("facile")) return "Allenamento guidato con domande più semplici.";
  if (lower.includes("medio")) return "Allenamento intermedio con più varietà.";
  if (lower.includes("difficile")) return "Allenamento più completo, con richieste più impegnative.";
  if (lower.includes("10")) return "Sfida breve, utile per un ripasso veloce.";
  if (lower.includes("20")) return "Sfida media, con più domande e più continuità.";
  if (lower.includes("30")) return "Sfida completa, pensata per allenarsi più a lungo.";
  if (lower.includes("daily")) return "Sfida giornaliera disponibile una volta al giorno.";
  if (lower.includes("note")) return "Allenamento dedicato alle figure di durata.";
  if (lower.includes("pause")) return "Allenamento dedicato alle pause.";
  if (lower.includes("misto")) return "Domande miste per ripassare più contenuti insieme.";

  return "Modalità di allenamento libera: puoi esercitarti senza salvare il risultato in classifica.";
}

function getModeHelpItems() {
  const buttons = document.querySelectorAll("#menu .buttonGroup .menuButton, #config .buttonGroup .menuButton");
  const seen = new Set();

  return Array.from(buttons)
    .map(button => button.textContent.replace(/Ranked/gi, "").replace(/\s+/g, " ").trim())
    .filter(label => {
      if (!label || seen.has(label)) return false;
      seen.add(label);
      return true;
    })
    .map(label => ({ label, text: getModeHelpText(label) }));
}

function showModeHelpModal() {
  const items = getModeHelpItems();
  const modal = document.createElement("div");
  modal.className = "rankedModal modeHelpModal";
  modal.innerHTML = `
    <div class="modalOverlay" onclick="closeGenericRankedLeaderboardModal()"></div>
    <div class="modalPanel modeHelpPanel">
      <button class="modalClose" onclick="closeGenericRankedLeaderboardModal()" aria-label="Chiudi">×</button>
      <h2>Come funzionano le modalità?</h2>
      <p class="rankedIntroText">Scegli una modalità, poi premi Inizia. Le modalità di allenamento servono per esercitarti; la Classificata salva il risultato nella classifica.</p>
      <div class="modeHelpList">
        ${items.map(item => `
          <article class="modeHelpItem">
            <strong>${escapeRankedHTML(item.label)}</strong>
            <span>${escapeRankedHTML(item.text)}</span>
          </article>
        `).join("") || `<p class="gameIntro">Nessuna modalità trovata.</p>`}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function ensureModeHelpButton() {
  if (document.getElementById("gameModeHelpBtn")) return;
  if (!document.querySelector("#menu, #config")) return;

  const button = document.createElement("button");
  button.id = "gameModeHelpBtn";
  button.className = "rankedHelpButton";
  button.type = "button";
  button.setAttribute("aria-label", "Info modalità");
  button.textContent = "?";
  button.addEventListener("click", showModeHelpModal);
  document.body.appendChild(button);
}

document.addEventListener("DOMContentLoaded", ensureModeHelpButton);

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
