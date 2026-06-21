const SUPABASE_URL = "https://scyvwnzrykwejflbbmjx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zk2mItmcS4M2XIw2nDJk5w_z2ZqZtpg";
const STUDENT_ACCOUNT_API_URL = "https://musicgamehub-stats-api.vercel.app/api/student-account";
const STUDENT_EMAIL_DOMAIN = "mgh-student.local";
const AUTH_TOKEN_KEY = "mgh_auth_token";
const AUTH_REFRESH_KEY = "mgh_auth_refresh_token";

let inviteClass = null;

const inviteClassTitle = document.getElementById("inviteClassTitle");
const inviteClassText = document.getElementById("inviteClassText");
const inviteJoinForm = document.getElementById("inviteJoinForm");
const inviteStatus = document.getElementById("inviteStatus");

function cleanText(value, maxLength = 120) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32);
}

function getStudentAuthEmail(username) {
  return `${cleanUsername(username)}@${STUDENT_EMAIL_DOMAIN}`;
}

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

function getRefreshToken() {
  return localStorage.getItem(AUTH_REFRESH_KEY) || "";
}

function getAuthUserId() {
  return MGH.getStoredAuthUser()?.id || "";
}

function setStatus(message = "") {
  if (inviteStatus) inviteStatus.textContent = message;
}

async function refreshAuthSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return "";

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) return "";

  localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
  if (data.refresh_token) localStorage.setItem(AUTH_REFRESH_KEY, data.refresh_token);
  if (data.user) MGH.writeStoredJson(MGH.AUTH_USER_KEY, data.user);

  return data.access_token;
}

async function supabaseRequest(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${token || SUPABASE_ANON_KEY}`,
      "Prefer": "return=representation",
      ...(options.headers || {})
    }
  });

  if (response.status === 401 && getRefreshToken()) {
    const refreshedToken = await refreshAuthSession();
    if (refreshedToken) return supabaseRequest(path, options);
  }

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.msg || data?.hint || "Operazione Supabase non riuscita.");
  }

  return data;
}

async function studentAccountRequest(action, body = {}) {
  const response = await fetch(STUDENT_ACCOUNT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...body })
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Operazione account alunno non riuscita.");
  }

  return data;
}

async function signInStudent(username, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY
    },
    body: JSON.stringify({
      email: getStudentAuthEmail(username),
      password
    })
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    throw new Error("Account creato, ma accesso automatico non riuscito. Accedi dalla home con user e password.");
  }

  localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
  if (data.refresh_token) localStorage.setItem(AUTH_REFRESH_KEY, data.refresh_token);
  if (data.user) MGH.writeStoredJson(MGH.AUTH_USER_KEY, data.user);
}

async function loadInvite() {
  const code = cleanText(new URLSearchParams(window.location.search).get("codice"), 20).toUpperCase();

  if (!code) {
    inviteClassTitle.textContent = "Invito non valido";
    inviteClassText.textContent = "Il link non contiene un codice classe.";
    return;
  }

  try {
    const rows = await supabaseRequest("rpc/get_class_invite", {
      method: "POST",
      body: JSON.stringify({ invite_code_input: code })
    });

    inviteClass = rows?.[0] || null;

    if (!inviteClass) {
      inviteClassTitle.textContent = "Classe non trovata";
      inviteClassText.textContent = "Controlla che il link sia corretto o chiedi un nuovo invito al docente.";
      return;
    }

    inviteClassTitle.textContent = inviteClass.name;
    inviteClassText.textContent = `${inviteClass.school_year || "Anno non indicato"} · crea il tuo user e scegli una password.`;
    inviteJoinForm.classList.remove("hidden");
  } catch (error) {
    inviteClassTitle.textContent = "Supabase non configurato";
    inviteClassText.textContent = "Prima bisogna creare le tabelle e le policy dell'area classi.";
    setStatus(error.message);
  }
}

async function joinClass(event) {
  event.preventDefault();
  if (!inviteClass) return;

  const formData = new FormData(inviteJoinForm);
  const firstName = cleanText(formData.get("firstName"), 40);
  const lastName = cleanText(formData.get("lastName"), 40);
  const username = cleanUsername(formData.get("username"));
  const password = cleanText(formData.get("password"), 40);

  if (!firstName || !lastName) {
    setStatus("Inserisci nome e cognome.");
    return;
  }

  if (!username) {
    setStatus("Inserisci uno user valido: lettere, numeri, punto, trattino o underscore.");
    return;
  }

  if (password.length < 8) {
    setStatus("La password deve avere almeno 8 caratteri.");
    return;
  }

  try {
    await studentAccountRequest("joinInvite", {
      inviteCode: inviteClass.invite_code,
      firstName,
      lastName,
      username,
      password
    });
    await signInStudent(username, password);
    inviteJoinForm.classList.add("hidden");
    setStatus(`Sei entrato nella classe ${inviteClass.name}. Ora puoi usare il tuo user per accedere.`);
  } catch (error) {
    setStatus(error.message);
  }
}

inviteJoinForm?.addEventListener("submit", joinClass);
loadInvite();
