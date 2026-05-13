// ==================== CONFIG SUPABASE ====================

const SUPABASE_URL = "https://scyvwnzrykwejflbbmjx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zk2mItmcS4M2XIw2nDJk5w_z2ZqZtpg";

const RANKED_TABLE = "ranked_scores";

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

    this.userId = this.getOrCreateUserId();
    this.username = this.getOrCreateUsername();
  }

  generateSessionId() {
    return "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  }

  getOrCreateUserId() {
    let userId = localStorage.getItem("mgh_userId");

    if (!userId) {
      userId = "user_" + Math.random().toString(36).slice(2, 12);
      localStorage.setItem("mgh_userId", userId);
    }

    return userId;
  }

  getOrCreateUsername() {
    let username = localStorage.getItem("mgh_username");

    if (!username) {
      username = "Player_" + Math.floor(Math.random() * 10000);
      localStorage.setItem("mgh_username", username);
    }

    return username;
  }

  setUsername(username) {
    const cleanUsername = String(username || "").trim().slice(0, 20);

    if (!cleanUsername) return;

    this.username = cleanUsername;
    localStorage.setItem("mgh_username", cleanUsername);
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

    const result = await supabase.insert(RANKED_TABLE, snapshot);

    if (!result) {
      console.error("Salvataggio ranked fallito");
      return null;
    }

    console.log("Risultato ranked salvato:", result);
    return result;
  }
}

// ==================== LEADERBOARD ====================

class RankedLeaderboard {
  async getGameLeaderboard(gameName, limit = 10) {
    const safeGameName = encodeURIComponent(gameName);
    const safeLimit = Number(limit) || 10;

    const path =
      `${RANKED_TABLE}?game_name=eq.${safeGameName}` +
      `&select=username,total_score,accuracy,total_time,created_at` +
      `&order=total_score.desc` +
      `&limit=${safeLimit}`;

    return await supabase.select(path) || [];
  }

  async getUserBestScore(gameName, userId) {
    const safeGameName = encodeURIComponent(gameName);
    const safeUserId = encodeURIComponent(userId);

    const path =
      `${RANKED_TABLE}?game_name=eq.${safeGameName}` +
      `&user_id=eq.${safeUserId}` +
      `&select=username,total_score,accuracy,total_time,created_at` +
      `&order=total_score.desc` +
      `&limit=1`;

    const result = await supabase.select(path);

    return result && result.length ? result[0] : null;
  }

  async getGlobalLeaderboard(limit = 10) {
    const safeLimit = Number(limit) || 10;

    const path =
      `${RANKED_TABLE}?select=user_id,username,total_score,accuracy,game_name` +
      `&order=total_score.desc` +
      `&limit=200`;

    const scores = await supabase.select(path);

    if (!scores) return [];

    const users = {};

    scores.forEach(score => {
      if (!users[score.user_id]) {
        users[score.user_id] = {
          user_id: score.user_id,
          username: score.username,
          best_score: 0,
          total_score: 0,
          games_played: new Set()
        };
      }

      users[score.user_id].best_score = Math.max(
        users[score.user_id].best_score,
        score.total_score
      );

      users[score.user_id].total_score += score.total_score;
      users[score.user_id].games_played.add(score.game_name);
    });

    return Object.values(users)
      .map(user => ({
        user_id: user.user_id,
        username: user.username,
        best_score: user.best_score,
        total_score: user.total_score,
        games_played: user.games_played.size
      }))
      .sort((a, b) => b.best_score - a.best_score)
      .slice(0, safeLimit);
  }
}

const rankedLeaderboard = new RankedLeaderboard();

// ==================== VARIABILI GLOBALI DA USARE NEL GIOCO ====================

let currentRankedSession = null;
let rankedQuestionStartTime = null;

// ==================== FUNZIONI DA CHIAMARE DAL TUO GIOCO ====================

function startRankedMode(gameName) {
  currentRankedSession = new RankedSession(gameName);
  rankedQuestionStartTime = Date.now();

  console.log("Ranked iniziata:", currentRankedSession);

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