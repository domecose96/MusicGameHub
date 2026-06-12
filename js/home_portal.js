// ==================== INTRO MUSICALE PRO ====================
const MELODY = [
  { name: "Do", freq: 261.63, y: 150 },
  { name: "Sol", freq: 392.00, y: 110 },
  { name: "La", freq: 440.00, y: 100 },
  { name: "Mi alto", freq: 659.25, y: 70 },
  { name: "Re alto", freq: 587.33, y: 80 },
  { name: "Sol", freq: 392.00, y: 110 },
  { name: "Mi", freq: 329.63, y: 130 },
  { name: "Do", freq: 261.63, y: 150 }
];

const X_START = 148;
const X_END = 820;
const X_STEP = 44;
const NOTE_MS = 520;
const FADE_MS = 900;
const INTRO_SEEN_KEY = "musicGameHubIntroSeen";
const WEB3FORMS_ACCESS_KEY = "b72ee878-1ec1-47e2-adfa-2cc026b69a63";
const SUPABASE_URL = "https://scyvwnzrykwejflbbmjx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zk2mItmcS4M2XIw2nDJk5w_z2ZqZtpg";
const AUTH_USER_KEY = "mgh_auth_user";
const AUTH_TOKEN_KEY = "mgh_auth_token";
const AUTH_REFRESH_KEY = "mgh_auth_refresh_token";
const PASSWORD_RECOVERY_TOKEN_KEY = "mgh_password_recovery_token";

let currentX = X_START;
let melodyIndex = 0;
let noteInterval = null;
let audioCtx = null;
let audioEnabled = false;

const noteGroup = document.getElementById("notesGroup");
const shouldSkipIntro = sessionStorage.getItem(INTRO_SEEN_KEY) === "true";
const resourceData = window.MusicGameHubResources;

function unlockIntroAudio() {
  if (audioEnabled) return;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  audioCtx.resume();
  audioEnabled = true;
}

["click", "touchstart", "keydown", "pointerdown"].forEach(eventName => {
  document.addEventListener(eventName, unlockIntroAudio, { once: true });
});

function playTone(freq) {
  if (!audioEnabled || !audioCtx) return;

  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.7);
}

function createNoteSVG(x, y) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.style.opacity = "0";
  g.style.transition = "opacity 0.25s ease";

  if (y >= 150) {
    const lr = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lr.setAttribute("x1", x - 16);
    lr.setAttribute("x2", x + 16);
    lr.setAttribute("y1", 140);
    lr.setAttribute("y2", 140);
    lr.setAttribute("stroke", "#ff6600");
    lr.setAttribute("stroke-width", "1.5");
    g.appendChild(lr);
  }

  if (y <= 50) {
    const lr = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lr.setAttribute("x1", x - 16);
    lr.setAttribute("x2", x + 16);
    lr.setAttribute("y1", 60);
    lr.setAttribute("y2", 60);
    lr.setAttribute("stroke", "#ff6600");
    lr.setAttribute("stroke-width", "1.5");
    g.appendChild(lr);
  }

  const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  el.setAttribute("cx", x);
  el.setAttribute("cy", y);
  el.setAttribute("rx", "11");
  el.setAttribute("ry", "7.5");
  el.setAttribute("fill", "#ff6600");
  el.setAttribute("stroke", "#ff6600");
  el.setAttribute("stroke-width", "1.5");
  g.appendChild(el);

  const stemUp = y >= 100;
  const stemX = stemUp ? x + 11 : x - 11;
  const stemY2 = stemUp ? y - 36 : y + 36;

  const st = document.createElementNS("http://www.w3.org/2000/svg", "line");
  st.setAttribute("x1", stemX);
  st.setAttribute("y1", y);
  st.setAttribute("x2", stemX);
  st.setAttribute("y2", stemY2);
  st.setAttribute("stroke", "#ff6600");
  st.setAttribute("stroke-width", "2");
  g.appendChild(st);

  return g;
}

function spawnNote() {
  if (!noteGroup) return;

  const step = MELODY[melodyIndex];
  const x = currentX;
  const y = step.y;

  playTone(step.freq);

  const g = createNoteSVG(x, y);
  noteGroup.appendChild(g);

  requestAnimationFrame(() => {
    g.style.opacity = "1";
  });

  setTimeout(() => {
    g.style.transition = "opacity 0.5s ease";
    g.style.opacity = "0";

    setTimeout(() => {
      if (g.parentNode) g.parentNode.removeChild(g);
    }, 500);
  }, FADE_MS);

  melodyIndex = (melodyIndex + 1) % MELODY.length;

  currentX += X_STEP;
  if (currentX > X_END) currentX = X_START;
}

if (!shouldSkipIntro) {
  setTimeout(() => {
    if (noteGroup) noteInterval = setInterval(spawnNote, NOTE_MS);
  }, 950);
}

// ==================== ENTRA NEL SITO ====================
function revealSiteImmediately() {
  const intro = document.getElementById("intro");
  const header = document.getElementById("mainHeader");
  const main = document.getElementById("mainContent");

  clearInterval(noteInterval);
  noteInterval = null;

  if (intro) intro.style.display = "none";

  if (header) {
    header.style.opacity = "1";
    header.style.pointerEvents = "auto";
  }

  if (main) main.style.opacity = "1";
}

function enterSite() {
  sessionStorage.setItem(INTRO_SEEN_KEY, "true");
  unlockIntroAudio();

  clearInterval(noteInterval);
  noteInterval = null;

  const intro = document.getElementById("intro");
  const header = document.getElementById("mainHeader");
  const main = document.getElementById("mainContent");

  if (!intro || !header || !main) return;

  intro.classList.add("fadeOut");

  setTimeout(() => {
    intro.style.display = "none";
    header.style.opacity = "1";
    header.style.pointerEvents = "auto";
    main.style.opacity = "1";
    window.scrollTo(0, 0);
  }, 800);
}

// ==================== NAVIGAZIONE ====================
let isScrollingFromClick = false;
const sections = ["portal", "theoryHome", "pathsHome", "games"];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 112;
  const navH = document.getElementById("siteNav")?.offsetHeight || 48;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - navH - 8;

  document.querySelectorAll(".navBtn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.navBtn[onclick="scrollToSection('${id}')"]`)?.classList.add("active");

  isScrollingFromClick = true;
  window.scrollTo({ top, behavior: "smooth" });
  setTimeout(() => {
    isScrollingFromClick = false;
  }, 1400);
}

window.addEventListener("scroll", () => {
  if (isScrollingFromClick) return;

  const intro = document.getElementById("intro");
  if (!intro || (!intro.classList.contains("fadeOut") && intro.style.display !== "none")) return;

  const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 112) + 56;
  let current = sections[0];

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top - offset < 0) current = id;
  });

  document.querySelectorAll(".navBtn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("onclick") === `scrollToSection('${current}')`);
  });
}, { passive: true });

function goTo(page) {
  MGH.goTo(page);
}

// ==================== RICERCA PORTALE ====================
function searchPortal() {
  const input = document.getElementById("portalSearch");
  const noResults = document.getElementById("noSearchResults");
  const cards = document.querySelectorAll(".hubCard, .gameHubCard");

  if (!input || cards.length === 0) return;

  const query = input.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const match = query === "" || text.includes(query);
    card.classList.toggle("searchHidden", !match);
    if (match) visibleCount++;
  });

  if (noResults) {
    noResults.classList.toggle("hidden", query === "" || visibleCount > 0);
  }
}

function switchAccessTab(tabName) {
  document.querySelectorAll(".accessTab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.accessTab === tabName);
  });

  document.querySelector(".accessTabs")?.classList.toggle("hidden", tabName === "reset");

  document.querySelectorAll(".accessPane").forEach(pane => {
    pane.classList.toggle("active", pane.dataset.accessPane === tabName);
  });

  const message = document.getElementById("accessMessage");
  if (message) message.textContent = "";
}

function showPasswordResetPane(messageText = "") {
  switchAccessTab("reset");
  openHomePanel("access");

  const message = document.getElementById("accessMessage");
  if (message) message.textContent = messageText;
}

function handleAccessSubmit(event, mode = "login") {
  event.preventDefault();

  const message = document.getElementById("accessMessage");
  const form = event.currentTarget;
  const email = form.elements.email?.value.trim();
  const password = form.elements.password?.value || "";

  if (mode === "register") {
    const age = Number(form.elements.age?.value || 0);

    if (age < 14) {
      if (message) {
        message.textContent = "Per registrarti autonomamente devi avere almeno 14 anni. Se hai meno di 14 anni, chiedi il supporto di un genitore, tutore o docente.";
      }
      return;
    }

    const passwordError = getPasswordValidationMessage(password);
    if (passwordError) {
      if (message) message.textContent = passwordError;
      return;
    }
  }

  if (mode === "login") {
    signInWithEmail(email, password, message);
    return;
  }

  signUpWithEmail(form, message);
}

function handleGoogleAccess(mode = "login") {
  const redirectTo = encodeURIComponent(window.location.href.split("#")[0]);
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
}

function handlePasswordReset() {
  const message = document.getElementById("accessMessage");
  const email = document.querySelector('[data-access-pane="login"] input[name="email"]')?.value.trim();

  if (!email) {
    if (message) message.textContent = "Inserisci prima la tua email, poi richiedi il ripristino password.";
    return;
  }

  requestPasswordReset(email, message);
}

function getPasswordValidationMessage(password) {
  if (password.length < 8) return "La password deve avere almeno 8 caratteri.";
  if (!/[0-9]/.test(password)) return "La password deve contenere almeno un numero.";
  if (!/[^A-Za-z0-9]/.test(password)) return "La password deve contenere almeno un simbolo.";
  return "";
}

async function supabaseAuthRequest(path, body) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY
    },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.msg || data.message || data.error_description || "Operazione non riuscita.");
  }

  return data;
}

async function supabaseAuthGetUser(accessToken) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${accessToken}`
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.msg || data.message || "Utente non disponibile.");
  }

  return data;
}

async function supabaseAuthUpdatePassword(accessToken, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({ password })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.msg || data.message || "Password non aggiornata.");
  }

  return data;
}

function getStoredAuthUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function getAuthDisplayName(user) {
  const metadata = user?.user_metadata || user?.raw_user_meta_data || {};
  const fullName = metadata.full_name || metadata.name;
  const firstName = metadata.first_name || metadata.given_name;
  const emailName = user?.email ? user.email.split("@")[0] : "";
  return (firstName || fullName || emailName || "utente").trim();
}

function getUserNicknameKey(user) {
  return user?.id ? `mgh_username_${user.id}` : "mgh_username";
}

function getStoredNickname(user) {
  const userNickname = localStorage.getItem(getUserNicknameKey(user));
  if (userNickname) return userNickname;

  const legacyNickname = localStorage.getItem("mgh_username");
  if (legacyNickname) return legacyNickname;

  return getAuthDisplayName(user).slice(0, 20);
}

function storeNicknameForUser(user, nickname) {
  const cleanNickname = String(nickname || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 20);

  if (!cleanNickname) return "";

  localStorage.setItem(getUserNicknameKey(user), cleanNickname);
  localStorage.setItem("mgh_username", cleanNickname);
  return cleanNickname;
}

function storeAuthSession(user, accessToken, refreshToken = "") {
  if (!user) return;

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (accessToken) localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(AUTH_REFRESH_KEY, refreshToken);

  if (user.id) localStorage.setItem("mgh_userId", user.id);
  storeNicknameForUser(user, getStoredNickname(user));

  updateAccessButton();
  populateAccountPanel();
}

function updateAccessButton() {
  const accessButton = document.querySelector(".navBtnAccess");
  const logoutButton = document.getElementById("accessLogoutButton");
  if (!accessButton) return;

  const user = getStoredAuthUser();

  if (!user) {
    accessButton.textContent = "Accedi";
    accessButton.classList.remove("logged");
    accessButton.title = "Accedi o registrati";
    if (logoutButton) logoutButton.hidden = true;
    return;
  }

  const displayName = getAuthDisplayName(user).split(" ")[0];
  accessButton.textContent = `Ciao ${displayName}`;
  accessButton.classList.add("logged");
  accessButton.title = user.email || "Account attivo";
  if (logoutButton) logoutButton.hidden = false;
}

function populateAccountPanel() {
  const user = getStoredAuthUser();
  if (!user) return;

  const displayName = getAuthDisplayName(user);
  const nickname = getStoredNickname(user);
  const initial = (displayName || "U").trim().charAt(0).toUpperCase();
  const metadata = user.user_metadata || user.raw_user_meta_data || {};

  const nameEl = document.getElementById("accountName");
  const emailEl = document.getElementById("accountEmail");
  const avatarEl = document.getElementById("accountAvatar");
  const nicknameInput = document.getElementById("accountNickname");
  const providerEl = document.getElementById("accountProvider");

  if (nameEl) nameEl.textContent = displayName;
  if (emailEl) emailEl.textContent = user.email || "Email non disponibile";
  if (avatarEl) avatarEl.textContent = initial;
  if (nicknameInput) nicknameInput.value = nickname;
  if (providerEl) providerEl.textContent = metadata.provider === "google" ? "Google" : "Email e password";
}

function openAccountPanel() {
  const user = getStoredAuthUser();

  if (!user) {
    openHomePanel("access");
    return;
  }

  populateAccountPanel();
  openHomePanel("account");
}

function saveAccountSettings(event) {
  event.preventDefault();

  const input = document.getElementById("accountNickname");
  const message = document.getElementById("accountMessage");
  const cleanNickname = String(input?.value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 20);

  if (!cleanNickname) {
    if (message) message.textContent = "Inserisci un nome visibile valido.";
    return;
  }

  const user = getStoredAuthUser();
  storeNicknameForUser(user, cleanNickname);
  if (message) message.textContent = "Impostazioni salvate.";
}

function signOut() {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_KEY);
  updateAccessButton();

  closeHomePanel();
  const message = document.getElementById("accessMessage");
  if (message) message.textContent = "Sei uscito dall'area personale.";
}

async function handleAuthRedirect() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token") || "";
  const authType = hash.get("type");

  if (!accessToken) {
    updateAccessButton();
    return;
  }

  try {
    const user = await supabaseAuthGetUser(accessToken);
    storeAuthSession(user, accessToken, refreshToken);
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);

    if (authType === "recovery") {
      sessionStorage.setItem(PASSWORD_RECOVERY_TOKEN_KEY, accessToken);
      showPasswordResetPane("Inserisci la nuova password per completare il ripristino.");
    }
  } catch (error) {
    console.error("Errore accesso Google:", error);
    updateAccessButton();
  }
}

async function signInWithEmail(email, password, message) {
  if (message) message.textContent = "Accesso in corso...";

  try {
    const data = await supabaseAuthRequest("token?grant_type=password", { email, password });
    storeAuthSession(data.user || {}, data.access_token, data.refresh_token);
    if (message) message.textContent = "Accesso effettuato.";
    closeHomePanel();
  } catch (error) {
    if (message) message.textContent = "Accesso non riuscito: controlla email e password.";
  }
}

async function signUpWithEmail(form, message) {
  if (message) message.textContent = "Registrazione in corso...";

  const email = form.elements.email?.value.trim();
  const password = form.elements.password?.value || "";

  try {
    await supabaseAuthRequest("signup", {
      email,
      password,
      data: {
        first_name: form.elements.firstName?.value.trim() || "",
        last_name: form.elements.lastName?.value.trim() || "",
        age: Number(form.elements.age?.value || 0)
      }
    });

    if (message) {
      message.textContent = "Registrazione inviata. Controlla la mail per confermare l'account, se la conferma email è attiva su Supabase.";
    }
  } catch (error) {
    if (message) message.textContent = `Registrazione non riuscita: ${error.message}`;
  }
}

async function requestPasswordReset(email, message) {
  if (message) message.textContent = "Invio email di ripristino...";

  try {
    await supabaseAuthRequest("recover", {
      email,
      redirect_to: window.location.href.split("#")[0]
    });

    if (message) message.textContent = "Email di ripristino inviata, se l'indirizzo è registrato.";
  } catch (error) {
    if (message) message.textContent = `Ripristino non riuscito: ${error.message}`;
  }
}

async function handlePasswordUpdate(event) {
  event.preventDefault();

  const message = document.getElementById("accessMessage");
  const form = event.currentTarget;
  const password = form.elements.password?.value || "";
  const confirmPassword = form.elements.confirmPassword?.value || "";
  const passwordError = getPasswordValidationMessage(password);
  const recoveryToken = sessionStorage.getItem(PASSWORD_RECOVERY_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);

  if (passwordError) {
    if (message) message.textContent = passwordError;
    return;
  }

  if (password !== confirmPassword) {
    if (message) message.textContent = "Le due password non coincidono.";
    return;
  }

  if (!recoveryToken) {
    if (message) message.textContent = "Link di ripristino non valido o scaduto. Richiedi una nuova email.";
    return;
  }

  if (message) message.textContent = "Aggiornamento password...";

  try {
    const user = await supabaseAuthUpdatePassword(recoveryToken, password);
    sessionStorage.removeItem(PASSWORD_RECOVERY_TOKEN_KEY);
    storeAuthSession(user, recoveryToken, localStorage.getItem(AUTH_REFRESH_KEY) || "");
    form.reset();
    switchAccessTab("login");
    if (message) message.textContent = "Password aggiornata. Ora puoi accedere anche con email e password.";
  } catch (error) {
    if (message) message.textContent = `Aggiornamento non riuscito: ${error.message}`;
  }
}

function handleContactSubmit(event) {
  event.preventDefault();

  const message = document.getElementById("contactMessage");
  const form = event.currentTarget;
  const accessKeyInput = form.querySelector("input[name='access_key']");

  if (!WEB3FORMS_ACCESS_KEY) {
    if (message) {
      message.textContent = "Form pronto: inserisci la tua Web3Forms access key per collegare l'invio.";
    }
    return;
  }

  if (accessKeyInput) {
    accessKeyInput.value = WEB3FORMS_ACCESS_KEY;
  }

  if (message) {
    message.textContent = "Invio in corso...";
  }

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: new FormData(form)
  })
    .then(response => response.json())
    .then(result => {
      if (!result.success) {
        throw new Error(result.message || "Invio non riuscito");
      }

      form.reset();
      if (message) message.textContent = "Messaggio inviato. Grazie!";
    })
    .catch(() => {
      if (message) message.textContent = "Invio non riuscito. Riprova tra poco.";
    });
}

function openHomePanel(panelName) {
  const overlay = document.getElementById("homePanelOverlay");
  if (!overlay) return;

  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");

  document.querySelectorAll(".homePanel").forEach(panel => {
    panel.classList.toggle("active", panel.dataset.panel === panelName);
  });
}

function closeHomePanel() {
  const overlay = document.getElementById("homePanelOverlay");
  if (!overlay) return;

  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  document.querySelectorAll(".homePanel").forEach(panel => panel.classList.remove("active"));
}

// ==================== RISORSE HOME ====================
function createCardElement(item, options = {}) {
  const isDisabled = Boolean(options.disabled);
  const card = document.createElement(isDisabled ? "article" : "a");
  card.className = ["hubCard", options.className, isDisabled ? "disabled" : ""]
    .filter(Boolean)
    .join(" ");

  if (isDisabled) {
    card.setAttribute("aria-disabled", "true");
  } else if (item.target) {
    card.href = `#${item.target}`;
    card.addEventListener("click", event => {
      event.preventDefault();
      scrollToSection(item.target);
    });
  } else {
    card.href = item.url;
  }

  const icon = document.createElement("div");
  icon.className = "hubIcon";
  icon.textContent = item.icon;

  const title = document.createElement("h3");
  title.textContent = item.title;

  const desc = document.createElement("p");
  desc.textContent = item.desc;

  card.append(icon, title, desc);

  if (item.feature) {
    const feature = document.createElement("span");
    feature.className = "hubCardFeature";
    feature.innerHTML = `
      <span class="hubCardFeatureIcon" aria-hidden="true">${item.feature.icon}</span>
      <span>
        <strong>${item.feature.title}</strong>
        <small>${item.feature.text}</small>
      </span>
    `;
    card.appendChild(feature);
  }

  const badge = document.createElement("span");
  badge.className = isDisabled ? "hubBadge" : "hubTag";
  badge.textContent = isDisabled ? "In arrivo" : item.tag;
  card.appendChild(badge);

  return card;
}

function renderHomeResources() {
  if (!resourceData) return;

  const theoryGrid = document.getElementById("theoryHubGrid");
  const pathsGrid = document.getElementById("pathsHubGrid");
  const gamesGrid = document.getElementById("gamesHubGrid");

  if (theoryGrid) {
    theoryGrid.replaceChildren(
      ...resourceData.homeCards
        .filter(item => item.homeGroup === "theory")
        .map(item => createCardElement(item))
    );
  }

  if (pathsGrid) {
    pathsGrid.replaceChildren(
      ...resourceData.homeCards
        .filter(item => item.homeGroup === "paths")
        .map(item => createCardElement(item))
    );
  }

  if (gamesGrid) {
    gamesGrid.replaceChildren(
      ...resourceData.playable.map(item => createCardElement(item, { className: "gameHubCard" }))
    );
  }
}

function renderResourceStats() {
  if (!resourceData) return;

  const stats = document.querySelectorAll(".portalStats .portalStat");
  const values = [
    { count: resourceData.playable.length, label: "Giochi" },
    { count: resourceData.theoryTopics.length, label: "Argomenti" },
    { count: resourceData.upcoming.length, label: "In arrivo" }
  ];

  values.forEach((value, index) => {
    const stat = stats[index];
    if (!stat) return;

    stat.querySelector("strong").textContent = value.count;
    stat.querySelector("span").textContent = value.label;
  });
}

// ==================== GOATCOUNTER STATS ====================
function createStatsRow(label, count = "—") {
  const row = document.createElement("div");
  row.className = "gcTopItem";

  const labelEl = document.createElement("span");
  labelEl.className = "gcTopLabel";
  labelEl.textContent = label;

  const countEl = document.createElement("span");
  countEl.className = "gcTopCount";
  countEl.textContent = count;

  row.append(labelEl, countEl);
  return row;
}

function renderFallbackStats(message = "Statistiche in caricamento") {
  const total = document.getElementById("gc-total");
  const top = document.getElementById("gc-top");

  if (total) total.textContent = "—";

  if (top) {
    top.replaceChildren(createStatsRow(message));
  }
}

function normalizeStatsPath(path = "") {
  return String(path)
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/[?#].*$/, "")
    .replace(/^\/?MusicGameHub\/?/i, "")
    .replace(/^\/+/, "")
    .replace(/\/index\.html$/i, "/")
    .replace(/^index\.html$/i, "")
    .replace(/\/$/, "");
}

function titleFromSlug(slug = "") {
  return slug
    .replace(/\.html$/i, "")
    .split(/[_-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatsSectionLabel(resource) {
  if (!resource) return "";
  const path = normalizeStatsPath(resource.url);

  if (path.startsWith("educazione_civica/")) return "Educazione civica";
  if (path.startsWith("storia/")) return "Storia";
  if (resource.group === "theory") return "Teoria";
  if (resource.group === "games") return "Giochi";
  if (resource.group === "paths") return "Percorsi";

  return "";
}

function formatStatsLabel(section, title) {
  return section ? `${section} > ${title}` : title;
}

function getStatsDisplayLabel(item) {
  const path = normalizeStatsPath(item.path || "");
  const rawLabel = String(item.label || "").trim();

  if (!path || path === "index") return "Home";

  const matchingResource = resourceData?.items?.find(resource => normalizeStatsPath(resource.url) === path);
  if (matchingResource) {
    return formatStatsLabel(getStatsSectionLabel(matchingResource), matchingResource.title);
  }

  const matchingHomeCard = resourceData?.homeCards?.find(resource => normalizeStatsPath(resource.url) === path);
  if (matchingHomeCard) {
    return formatStatsLabel(getStatsSectionLabel(matchingHomeCard), matchingHomeCard.title);
  }

  const comicMatch = path.match(/^fumetti\/([^/]+)\.html$/i);
  if (comicMatch) return `Vite a fumetti > ${titleFromSlug(comicMatch[1])}`;

  if (path === "fumetti") return "Vite a fumetti";
  if (path === "mappa.html") return "Mappa delle risorse";
  if (path.startsWith("educazione_civica/")) return `Educazione civica > ${titleFromSlug(path.split("/").pop())}`;
  if (path.startsWith("storia/")) return `Storia > ${titleFromSlug(path.split("/").pop())}`;
  if (path.startsWith("giochi/")) return `Giochi > ${titleFromSlug(path.split("/").pop())}`;

  if (rawLabel && !rawLabel.includes("/") && !rawLabel.includes("MusicGameHub")) return rawLabel;

  return titleFromSlug(path.split("/").pop() || "Pagina");
}

function getAggregatedTopPages(topPages = []) {
  const pages = new Map();

  topPages.forEach(item => {
    const path = item.path || "";
    const label = item.label || "";

    if (path.includes("insdex") || label.includes("insdex")) return;
    if (path.includes("404")) return;
    if (path.includes("error")) return;

    const displayLabel = getStatsDisplayLabel(item);
    const current = pages.get(displayLabel) || 0;
    pages.set(displayLabel, current + Number(item.count || 0));
  });

  return Array.from(pages, ([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

async function loadGoatStats() {
  const totalEl = document.getElementById("gc-total");
  const topEl = document.getElementById("gc-top");

  try {
    const response = await fetch("https://musicgamehub-stats-api.vercel.app/api/stats");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (totalEl) {
      totalEl.textContent = Number(data.total || 0).toLocaleString("it-IT");
    }

    if (topEl) {
      topEl.replaceChildren();

      const validPages = getAggregatedTopPages(data.topPages || []);

      if (validPages.length === 0) {
        topEl.replaceChildren(createStatsRow("Nessun dato disponibile"));
        return;
      }

      validPages.slice(0, 5).forEach(item => {
        topEl.appendChild(
          createStatsRow(item.label, Number(item.count || 0).toLocaleString("it-IT"))
        );
      });
    }
  } catch (error) {
    console.error("Errore caricamento statistiche:", error);
    renderFallbackStats("Statistiche non disponibili");
  }
}

window.enterSite = enterSite;
window.scrollToSection = scrollToSection;
window.goTo = goTo;
window.searchPortal = searchPortal;
window.switchAccessTab = switchAccessTab;
window.handleAccessSubmit = handleAccessSubmit;
window.handleGoogleAccess = handleGoogleAccess;
window.handlePasswordReset = handlePasswordReset;
window.handlePasswordUpdate = handlePasswordUpdate;
window.openAccountPanel = openAccountPanel;
window.saveAccountSettings = saveAccountSettings;
window.signOut = signOut;
window.handleContactSubmit = handleContactSubmit;
window.openHomePanel = openHomePanel;
window.closeHomePanel = closeHomePanel;

document.addEventListener("DOMContentLoaded", () => {
  if (shouldSkipIntro) revealSiteImmediately();
  handleAuthRedirect();
  renderHomeResources();
  renderResourceStats();

  const input = document.getElementById("portalSearch");
  const searchBtn = document.querySelector(".portalSearchBtn");

  if (input) {
    input.addEventListener("input", searchPortal);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchPortal();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", e => {
      e.preventDefault();
      searchPortal();
      searchBtn.blur();
    });
  }

  document.getElementById("homePanelOverlay")?.addEventListener("click", event => {
    if (event.target.id === "homePanelOverlay") closeHomePanel();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeHomePanel();
  });

  loadGoatStats();
});
