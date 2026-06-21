const SUPABASE_URL = "https://scyvwnzrykwejflbbmjx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zk2mItmcS4M2XIw2nDJk5w_z2ZqZtpg";
const STUDENT_ACCOUNT_API_URL = "https://musicgamehub-stats-api.vercel.app/api/student-account";
const AUTH_TOKEN_KEY = "mgh_auth_token";
const AUTH_REFRESH_KEY = "mgh_auth_refresh_token";

let classesState = [];
let selectedClassId = "";
let activityState = [];
let studentSortKey = "name";
let studentSortDirection = 1;

const classForm = document.getElementById("classForm");
const studentForm = document.getElementById("studentForm");
const classList = document.getElementById("classList");
const studentList = document.getElementById("studentList");
const classCountBadge = document.getElementById("classCountBadge");
const studentCountBadge = document.getElementById("studentCountBadge");
const selectedClassTitle = document.getElementById("selectedClassTitle");
const selectedClassMeta = document.getElementById("selectedClassMeta");
const emptyClassState = document.getElementById("emptyClassState");
const classDetail = document.getElementById("classDetail");
const classesStatus = document.getElementById("classesStatus");
const inviteOverlay = document.getElementById("inviteOverlay");
const inviteLinkInput = document.getElementById("inviteLinkInput");
const inviteText = document.getElementById("inviteText");
const inviteCopyStatus = document.getElementById("inviteCopyStatus");
const analyticsRange = document.getElementById("analyticsRange");
const activeStudentsBadge = document.getElementById("activeStudentsBadge");
const activeStudentsValue = document.getElementById("activeStudentsValue");
const completedExercisesValue = document.getElementById("completedExercisesValue");
const activeStudentsBar = document.getElementById("activeStudentsBar");
const completedExercisesBar = document.getElementById("completedExercisesBar");
const classLeaderboard = document.getElementById("classLeaderboard");
const studentsProgressBody = document.getElementById("studentsProgressBody");
const subjectFilter = document.getElementById("subjectFilter");
const studentFilter = document.getElementById("studentFilter");
const subjectsProgress = document.getElementById("subjectsProgress");

const SUBJECTS = [
  { id: "suono", label: "Suono" },
  { id: "pentagramma", label: "Pentagramma" },
  { id: "note", label: "Note" },
  { id: "ritmo", label: "Ritmo" },
  { id: "scale", label: "Scale" }
];

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

function getRefreshToken() {
  return localStorage.getItem(AUTH_REFRESH_KEY) || "";
}

function getAuthUserId() {
  return MGH.getStoredAuthUser()?.id || "";
}

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

function normalizeUsernamePart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
}

function getShortSchoolYear(value) {
  const match = String(value || "").match(/\d{4}/);
  if (!match) return "";
  return match[0].slice(-2);
}

function getClassUsernamePart(value) {
  const firstPart = String(value || "").trim().split(/\s+/)[0] || "";
  return normalizeUsernamePart(firstPart).slice(0, 8);
}

function buildSuggestedUsername() {
  const firstName = normalizeUsernamePart(document.getElementById("studentFirstName")?.value);
  const lastName = normalizeUsernamePart(document.getElementById("studentLastName")?.value);
  const selectedClass = getSelectedClass();
  const className = getClassUsernamePart(selectedClass?.name || document.getElementById("className")?.value);
  const year = getShortSchoolYear(selectedClass?.year || document.getElementById("classYear")?.value);

  return [firstName, lastName, className, year].filter(Boolean).join(".").slice(0, 32);
}

function updateSuggestedUsername() {
  const input = document.getElementById("studentUsername");
  if (!input || input.dataset.userEdited === "true") return;

  input.value = buildSuggestedUsername();
}

function makeInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function setStatus(message = "") {
  if (!classesStatus) return;
  classesStatus.textContent = message;
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
  const requestOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${token || SUPABASE_ANON_KEY}`,
      "Prefer": "return=representation",
      ...(options.headers || {})
    }
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...requestOptions
  });

  if (response.status === 401 && getRefreshToken()) {
    const refreshedToken = await refreshAuthSession();
    if (refreshedToken) {
      return supabaseRequest(path, options);
    }
  }

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = { message: text };
  }

  if (!response.ok) {
    const message = data?.message || data?.msg || data?.hint || "Operazione Supabase non riuscita.";
    throw new Error(`Supabase ${response.status}: ${message}`);
  }

  return data;
}

async function studentAccountRequest(action, body = {}) {
  if (!getAuthToken()) {
    await refreshAuthSession();
  }

  const token = getAuthToken();
  if (!token) {
    throw new Error("Accedi come docente prima di gestire gli account alunni.");
  }

  const response = await fetch(STUDENT_ACCOUNT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ action, ...body })
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Operazione account alunno non riuscita.");
  }

  return data;
}

function fromClassRow(row, students = []) {
  return {
    id: row.id,
    name: row.name,
    year: row.school_year || "",
    inviteCode: row.invite_code,
    createdAt: row.created_at,
    students
  };
}

function fromStudentRow(row) {
  return {
    id: row.id,
    classId: row.class_id,
    firstName: row.first_name,
    lastName: row.last_name,
    username: row.username || row.email_or_code || "",
    email: row.email_or_code || "",
    mustChangePassword: Boolean(row.must_change_password),
    userId: row.user_id || "",
    joinedAt: row.joined_at,
    createdAt: row.created_at
  };
}

async function loadClasses() {
  if (!getAuthToken() || !getAuthUserId()) {
    const refreshedToken = await refreshAuthSession();
    if (refreshedToken && getAuthUserId()) {
      return loadClasses();
    }

    classesState = [];
    selectedClassId = "";
    activityState = [];
    setStatus("Accedi dalla home, poi torna qui per creare classi e invitare alunni.");
    render();
    return;
  }

  setStatus("Caricamento classi...");

  const classRows = await supabaseRequest(
    "teacher_classes?select=id,name,school_year,invite_code,created_at&order=created_at.desc"
  );
  const classIds = classRows.map(item => item.id);
  const encodedIds = classIds.join(",");
  const studentRows = classIds.length
    ? await supabaseRequest(`class_students?select=*&class_id=in.(${encodedIds})&order=last_name.asc`)
    : [];
  activityState = classIds.length
    ? await supabaseRequest(`class_activity?select=*&class_id=in.(${encodedIds})&order=created_at.desc`)
    : [];

  classesState = classRows.map(classRow => {
    const students = studentRows
      .filter(student => student.class_id === classRow.id)
      .map(fromStudentRow);
    return fromClassRow(classRow, students);
  });

  selectedClassId = classesState.some(item => item.id === selectedClassId)
    ? selectedClassId
    : classesState[0]?.id || "";

  setStatus(classesState.length ? "" : "Crea la prima classe.");
  render();
}

function getSelectedClass() {
  return classesState.find(item => item.id === selectedClassId) || null;
}

function getStudentFullName(student) {
  return `${student.lastName} ${student.firstName}`.trim();
}

function getStudentStats(student) {
  const rows = activityState.filter(row => row.student_id === student.id);
  const subjects = SUBJECTS.map(subject => {
    const subjectRows = rows.filter(row => row.subject === subject.id);
    return {
      ...subject,
      completed: subjectRows.filter(row => row.completed).length,
      score: Math.max(0, ...subjectRows.map(row => Number(row.score || 0)))
    };
  });
  const completed = subjects.reduce((total, subject) => total + subject.completed, 0);
  const bestScore = Math.max(0, ...subjects.map(subject => subject.score));

  return {
    active: completed > 0,
    completed,
    bestScore,
    subjects
  };
}

function getInviteUrl(currentClass) {
  const base = new URL("classi_invito.html", window.location.href);
  base.searchParams.set("codice", currentClass.inviteCode);
  return base.toString();
}

function renderClassList() {
  classCountBadge.textContent = String(classesState.length);
  classList.innerHTML = "";

  if (!classesState.length) {
    classList.innerHTML = '<p class="studentEmpty">Nessuna classe creata.</p>';
    return;
  }

  classesState.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `classListItem${item.id === selectedClassId ? " active" : ""}`;
    button.innerHTML = `
      <strong>${escapeHTML(item.name)}</strong>
      <span>${escapeHTML(item.year || "Anno non indicato")} · ${item.students.length} alunni</span>
    `;
    button.addEventListener("click", () => {
      selectedClassId = item.id;
      render();
      updateSuggestedUsername();
    });
    classList.appendChild(button);
  });
}

function renderStudentList(currentClass) {
  studentCountBadge.textContent = String(currentClass.students.length);
  studentList.innerHTML = "";

  if (!currentClass.students.length) {
    studentList.innerHTML = '<p class="studentEmpty">Aggiungi il primo alunno o condividi il link invito.</p>';
    return;
  }

  [...currentClass.students]
    .sort((a, b) => getStudentFullName(a).localeCompare(getStudentFullName(b), "it"))
    .forEach(student => {
      const row = document.createElement("article");
      row.className = "studentRow";
      row.innerHTML = `
          <div>
            <div class="studentName">${escapeHTML(getStudentFullName(student))}</div>
          <div class="studentMeta">User: ${escapeHTML(student.username || "non assegnato")}${student.mustChangePassword ? " · password temporanea" : ""}</div>
        </div>
        <div class="studentActions">
          <button type="button" class="iconTextButton" data-reset-student-id="${student.id}">Reset password</button>
          <button type="button" class="iconTextButton danger" data-student-id="${student.id}">Rimuovi</button>
        </div>
      `;
      row.querySelector("[data-student-id]")?.addEventListener("click", () => deleteStudent(student.id));
      row.querySelector("[data-reset-student-id]")?.addEventListener("click", () => resetStudentPassword(student));
      studentList.appendChild(row);
    });
}

function renderDetail() {
  const currentClass = getSelectedClass();
  emptyClassState.classList.toggle("hidden", Boolean(currentClass));
  classDetail.classList.toggle("hidden", !currentClass);

  if (!currentClass) return;

  selectedClassTitle.textContent = currentClass.name;
  selectedClassMeta.textContent = `${currentClass.year || "Anno non indicato"} · ${currentClass.students.length} alunni`;
  renderStudentList(currentClass);
  renderAnalytics(currentClass);
}

function render() {
  renderClassList();
  renderDetail();
}

async function createClass(event) {
  event.preventDefault();

  if (!getAuthToken()) {
    await refreshAuthSession();
  }

  const ownerId = getAuthUserId();
  if (!ownerId || !getAuthToken()) {
    setStatus("Accedi dalla home prima di creare una classe.");
    return;
  }

  const formData = new FormData(classForm);
  const name = cleanText(formData.get("className"), 40);
  const year = cleanText(formData.get("classYear"), 20);

  if (!name) {
    setStatus("Inserisci il nome della classe.");
    return;
  }

  try {
    const rows = await supabaseRequest("teacher_classes", {
      method: "POST",
      body: JSON.stringify({
        owner_id: ownerId,
        name,
        school_year: year,
        invite_code: makeInviteCode()
      })
    });
    selectedClassId = rows?.[0]?.id || "";
    classForm.reset();
    setStatus(`Classe ${name} creata.`);
    await loadClasses();
  } catch (error) {
    setStatus(error.message);
  }
}

async function addStudent(event) {
  event.preventDefault();

  const currentClass = getSelectedClass();
  if (!currentClass) return;

  const formData = new FormData(studentForm);
  const firstName = cleanText(formData.get("firstName"), 40);
  const lastName = cleanText(formData.get("lastName"), 40);
  const username = cleanUsername(formData.get("username"));
  const temporaryPassword = cleanText(formData.get("temporaryPassword"), 40);

  if (!firstName || !lastName) {
    setStatus("Inserisci nome e cognome dell'alunno.");
    return;
  }

  if (!username) {
    setStatus("Inserisci uno user valido: lettere, numeri, punto, trattino o underscore.");
    return;
  }

  if (temporaryPassword.length < 8) {
    setStatus("La password temporanea deve avere almeno 8 caratteri.");
    return;
  }

  try {
    await studentAccountRequest("createStudent", {
      classId: currentClass.id,
      firstName,
      lastName,
      username,
      temporaryPassword
    });
    studentForm.reset();
    document.getElementById("studentUsername")?.removeAttribute("data-user-edited");
    setStatus(`${firstName} ${lastName} aggiunto. User: ${username}. Password temporanea da cambiare al primo accesso.`);
    await loadClasses();
  } catch (error) {
    setStatus(error.message);
  }
}

async function resetStudentPassword(student) {
  const temporaryPassword = window.prompt(`Nuova password temporanea per ${getStudentFullName(student)}:`);
  if (!temporaryPassword) return;

  const cleanPassword = cleanText(temporaryPassword, 40);
  if (cleanPassword.length < 8) {
    setStatus("La password temporanea deve avere almeno 8 caratteri.");
    return;
  }

  try {
    await studentAccountRequest("resetStudentPassword", {
      studentId: student.id,
      temporaryPassword: cleanPassword
    });
    setStatus(`Password temporanea aggiornata per ${getStudentFullName(student)}. Al prossimo accesso dovrà cambiarla.`);
    await loadClasses();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteStudent(studentId) {
  try {
    await supabaseRequest(`class_students?id=eq.${studentId}`, { method: "DELETE" });
    setStatus("Alunno rimosso.");
    await loadClasses();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteSelectedClass() {
  const currentClass = getSelectedClass();
  if (!currentClass) return;

  const confirmed = window.confirm(`Eliminare la classe ${currentClass.name}?`);
  if (!confirmed) return;

  try {
    await supabaseRequest(`teacher_classes?id=eq.${currentClass.id}`, { method: "DELETE" });
    selectedClassId = "";
    setStatus("Classe eliminata.");
    await loadClasses();
  } catch (error) {
    setStatus(error.message);
  }
}

function exportSelectedClass() {
  const currentClass = getSelectedClass();
  if (!currentClass) return;

  const rows = [
    ["Classe", "Anno", "Cognome", "Nome", "User", "Password da cambiare"],
    ...currentClass.students.map(student => [
      currentClass.name,
      currentClass.year || "",
      student.lastName,
      student.firstName,
      student.username || "",
      student.mustChangePassword ? "Sì" : "No"
    ])
  ];
  const csv = rows.map(row => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `${currentClass.name.replace(/\W+/g, "_").toLowerCase()}_alunni.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 250);
}

function openInviteModal() {
  const currentClass = getSelectedClass();
  if (!currentClass || !inviteOverlay || !inviteLinkInput) return;

  inviteText.textContent = `Condividi questo link con gli alunni della classe ${currentClass.name}.`;
  inviteLinkInput.value = getInviteUrl(currentClass);
  if (inviteCopyStatus) inviteCopyStatus.textContent = "";
  inviteOverlay.classList.add("show");
  inviteOverlay.setAttribute("aria-hidden", "false");
  inviteLinkInput.select();
}

function closeInviteModal() {
  if (!inviteOverlay) return;
  inviteOverlay.classList.remove("show");
  inviteOverlay.setAttribute("aria-hidden", "true");
}

async function copyInviteLink() {
  if (!inviteLinkInput) return;

  try {
    await navigator.clipboard.writeText(inviteLinkInput.value);
    if (inviteCopyStatus) inviteCopyStatus.textContent = "Link copiato.";
  } catch (_) {
    inviteLinkInput.select();
    document.execCommand("copy");
    if (inviteCopyStatus) inviteCopyStatus.textContent = "Link selezionato e copiato.";
  }
}

function renderAnalytics(currentClass) {
  const students = currentClass.students || [];
  const studentStats = students.map(student => ({
    student,
    stats: getStudentStats(student)
  }));
  const activeCount = studentStats.filter(item => item.stats.active).length;
  const completedCount = studentStats.reduce((total, item) => total + item.stats.completed, 0);
  const activePercent = students.length ? Math.round((activeCount / students.length) * 100) : 0;
  const completedPercent = Math.min(100, completedCount * 8);

  activeStudentsBadge.textContent = String(activeCount);
  activeStudentsValue.textContent = String(activeCount);
  completedExercisesValue.textContent = String(completedCount);
  activeStudentsBar.style.width = `${activePercent}%`;
  completedExercisesBar.style.width = `${completedPercent}%`;

  renderStudentFilter(students);
  renderStudentsProgress(studentStats);
  renderLeaderboard(studentStats);
  renderSubjectsProgress(studentStats);
}

function renderStudentFilter(students) {
  if (!studentFilter) return;

  const selected = studentFilter.value || "all";
  studentFilter.innerHTML = '<option value="all">Tutti gli studenti</option>';
  students.forEach(student => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = getStudentFullName(student);
    studentFilter.appendChild(option);
  });
  studentFilter.value = students.some(student => student.id === selected) ? selected : "all";
}

function renderStudentsProgress(studentStats) {
  if (!studentsProgressBody) return;

  const sorted = [...studentStats].sort((a, b) => {
    if (studentSortKey === "active") return (Number(a.stats.active) - Number(b.stats.active)) * studentSortDirection;
    if (studentSortKey === "completed") return (a.stats.completed - b.stats.completed) * studentSortDirection;
    if (studentSortKey === "score") return (a.stats.bestScore - b.stats.bestScore) * studentSortDirection;
    return getStudentFullName(a.student).localeCompare(getStudentFullName(b.student), "it") * studentSortDirection;
  });

  if (!sorted.length) {
    studentsProgressBody.innerHTML = '<tr><td colspan="4">Nessun alunno inserito.</td></tr>';
    return;
  }

  studentsProgressBody.innerHTML = sorted.map(({ student, stats }) => `
    <tr>
      <td>${escapeHTML(getStudentFullName(student))}</td>
      <td>${stats.active ? "Sì" : "No"}</td>
      <td>${stats.completed}</td>
      <td>${stats.bestScore}</td>
    </tr>
  `).join("");
}

function renderLeaderboard(studentStats) {
  if (!classLeaderboard) return;

  const ranked = [...studentStats]
    .filter(item => item.stats.bestScore > 0)
    .sort((a, b) => b.stats.bestScore - a.stats.bestScore)
    .slice(0, 10);

  if (!ranked.length) {
    classLeaderboard.innerHTML = '<p class="studentEmpty compact">La leaderboard comparirà quando gli alunni avranno completato esercizi.</p>';
    return;
  }

  classLeaderboard.innerHTML = ranked.map((item, index) => `
    <div class="leaderboardRow">
      <strong>${index + 1}</strong>
      <span>${escapeHTML(getStudentFullName(item.student))}</span>
      <em>${item.stats.bestScore}</em>
    </div>
  `).join("");
}

function renderSubjectsProgress(studentStats) {
  if (!subjectsProgress) return;

  const selectedSubject = subjectFilter?.value || "all";
  const selectedStudent = studentFilter?.value || "all";
  const filteredStudents = selectedStudent === "all"
    ? studentStats
    : studentStats.filter(item => item.student.id === selectedStudent);

  const rows = SUBJECTS
    .filter(subject => selectedSubject === "all" || subject.id === selectedSubject)
    .map(subject => {
      const completed = filteredStudents.reduce((total, item) => {
        const subjectStats = item.stats.subjects.find(current => current.id === subject.id);
        return total + Number(subjectStats?.completed || 0);
      }, 0);
      const bestScore = Math.max(0, ...filteredStudents.map(item => {
        const subjectStats = item.stats.subjects.find(current => current.id === subject.id);
        return Number(subjectStats?.score || 0);
      }));

      return { ...subject, completed, bestScore };
    });

  subjectsProgress.innerHTML = rows.map(row => `
    <div class="subjectProgressRow">
      <span>${escapeHTML(row.label)}</span>
      <strong>${row.completed} esercizi</strong>
      <em>${row.bestScore} pt</em>
    </div>
  `).join("");
}

function csvCell(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

classForm?.addEventListener("submit", createClass);
studentForm?.addEventListener("submit", addStudent);
["studentFirstName", "studentLastName", "className", "classYear"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", updateSuggestedUsername);
});
document.getElementById("studentUsername")?.addEventListener("input", event => {
  event.currentTarget.dataset.userEdited = event.currentTarget.value ? "true" : "false";
});
analyticsRange?.addEventListener("change", () => renderDetail());
subjectFilter?.addEventListener("change", () => renderDetail());
studentFilter?.addEventListener("change", () => renderDetail());
inviteOverlay?.addEventListener("click", event => {
  if (event.target === inviteOverlay) closeInviteModal();
});

document.querySelectorAll("[data-sort-students]").forEach(button => {
  button.addEventListener("click", () => {
    const nextKey = button.dataset.sortStudents;
    if (studentSortKey === nextKey) {
      studentSortDirection *= -1;
    } else {
      studentSortKey = nextKey;
      studentSortDirection = nextKey === "name" ? 1 : -1;
    }
    renderDetail();
  });
});

loadClasses().catch(error => {
  setStatus(error.message);
  render();
});

window.deleteSelectedClass = deleteSelectedClass;
window.exportSelectedClass = exportSelectedClass;
window.openInviteModal = openInviteModal;
window.closeInviteModal = closeInviteModal;
window.copyInviteLink = copyInviteLink;
