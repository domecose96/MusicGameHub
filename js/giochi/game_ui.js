window.MGHGameUI = (() => {
  function callGlobal(name, ...args) {
    const fn = window[name];
    if (typeof fn === "function") return fn(...args);
    return null;
  }

  function showGame(menu, game) {
    menu?.classList.add("hidden");
    game?.classList.remove("hidden");
  }

  function showMenu(menu, game) {
    game?.classList.add("hidden");
    menu?.classList.remove("hidden");
  }

  function resetSelections(selector = ".selected") {
    document.querySelectorAll(selector).forEach((button) => button.classList.remove("selected"));
  }

  function setWarning(warning, message = "") {
    if (warning) warning.textContent = message;
  }

  function setHeader(label = "") {
    MGH.updateHeaderModeLabel(label);
  }

  function clearFeedback(feedbackEl) {
    MGH.setGameFeedback(feedbackEl, "");
  }

  function ensureRankedHUD(game = document.getElementById("game")) {
    if (!game) return null;

    let rankedUI = document.getElementById("rankedUI");
    if (!rankedUI) {
      rankedUI = document.createElement("div");
      rankedUI.id = "rankedUI";
      rankedUI.className = "rankedUI hidden";
      rankedUI.innerHTML = `
        <div id="rankedScoreDisplay" class="rankedScoreDisplay">Score: <span id="rankedScore">0</span></div>
        <div id="rankedProgressWrapper" class="rankedProgressWrapper">
          <div id="rankedProgressLabel" class="rankedProgressLabel">
            <span>Progressione</span>
            <span id="rankedQuestionCounter">1/10</span>
          </div>
          <div id="rankedProgressBar" class="rankedProgressBar">
            <div id="rankedProgressFill" class="rankedProgressFill"></div>
          </div>
        </div>
      `;
      game.insertBefore(rankedUI, game.firstElementChild);
    }

    let timerBox = document.getElementById("timerBox");
    if (!timerBox) {
      timerBox = document.createElement("div");
      timerBox.id = "timerBox";
      timerBox.className = "hidden";
      timerBox.innerHTML = '⏱ <span id="timer">0</span>s';
      rankedUI.insertAdjacentElement("afterend", timerBox);
    }

    return { rankedUI, timerBox };
  }

  function enterTraining({ menu, game, modeLabel = "", feedbackEl = null } = {}) {
    showGame(menu, game);
    callGlobal("hideLeaderboardButton");
    callGlobal("hideRankedUI");
    setHeader(modeLabel);
    clearFeedback(feedbackEl);
  }

  function enterRanked({ menu, game, modeLabel = "Classificata", score = 0, current = 0, total = 10, feedbackEl = null } = {}) {
    showGame(menu, game);
    callGlobal("hideLeaderboardButton");
    callGlobal("showRankedUI");
    setHeader(modeLabel);
    clearFeedback(feedbackEl);
    callGlobal("updateRankedProgressUI", { score, current, total });
  }

  function returnToMenu({ menu, game, feedbackEl = null, resetSelected = true } = {}) {
    showMenu(menu, game);
    callGlobal("hideRankedUI");
    callGlobal("showLeaderboardButton");
    setHeader("");
    clearFeedback(feedbackEl);
    if (resetSelected) resetSelections();
  }

  return {
    clearFeedback,
    ensureRankedHUD,
    enterRanked,
    enterTraining,
    resetSelections,
    returnToMenu,
    setHeader,
    setWarning,
    showGame,
    showMenu
  };
})();
