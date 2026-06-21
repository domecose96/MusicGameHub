const SUPABASE_URL = process.env.SUPABASE_URL || "https://scyvwnzrykwejflbbmjx.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STUDENT_EMAIL_DOMAIN = process.env.STUDENT_EMAIL_DOMAIN || "mgh-student.local";

function send(res, status, body) {
  res.status(status).json(body);
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
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

function getStudentEmail(username) {
  return `${cleanUsername(username)}@${STUDENT_EMAIL_DOMAIN}`;
}

function requireServiceRole() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY non configurata.");
  }
}

async function supabaseFetch(path, options = {}) {
  requireServiceRole();

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.msg || data?.error_description || "Richiesta Supabase non riuscita.");
  }

  return data;
}

async function getAuthUser(token) {
  if (!token) return null;

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.id) return null;
  return data;
}

async function getTeacherClass(classId, teacherId) {
  const rows = await supabaseFetch(
    `/rest/v1/teacher_classes?id=eq.${encodeURIComponent(classId)}&owner_id=eq.${encodeURIComponent(teacherId)}&select=id,name`
  );
  return rows?.[0] || null;
}

async function getClassByInvite(inviteCode) {
  const rows = await supabaseFetch(
    `/rest/v1/teacher_classes?invite_code=eq.${encodeURIComponent(inviteCode)}&select=id,name`
  );
  return rows?.[0] || null;
}

async function ensureUsernameAvailable(username) {
  const rows = await supabaseFetch(
    `/rest/v1/class_students?username=eq.${encodeURIComponent(username)}&select=id`
  );
  if (rows?.length) {
    const error = new Error("User già usato. Scegline un altro.");
    error.status = 409;
    throw error;
  }
}

async function createAuthStudent({ email, password, firstName, lastName, username, mustChangePassword }) {
  let data = null;

  try {
    data = await supabaseFetch("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "student",
          username,
          first_name: firstName,
          last_name: lastName,
          must_change_password: mustChangePassword
        }
      })
    });
  } catch (error) {
    if (/already|registered|exists|duplicate/i.test(error.message || "")) {
      const duplicateError = new Error("User già usato. Scegline uno diverso.");
      duplicateError.status = 409;
      throw duplicateError;
    }

    throw error;
  }

  return data?.user || data;
}

async function insertStudentRow({ classId, userId, firstName, lastName, username, authEmail, mustChangePassword }) {
  const rows = await supabaseFetch("/rest/v1/class_students", {
    method: "POST",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify({
      class_id: classId,
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      username,
      auth_email: authEmail,
      email_or_code: username,
      must_change_password: mustChangePassword,
      joined_at: new Date().toISOString()
    })
  });

  return rows?.[0] || null;
}

async function updateAuthPassword(userId, password, mustChangePassword) {
  return supabaseFetch(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify({
      password,
      user_metadata: { must_change_password: mustChangePassword }
    })
  });
}

async function createStudent(body, teacher) {
  const classId = cleanText(body.classId, 80);
  const firstName = cleanText(body.firstName, 40);
  const lastName = cleanText(body.lastName, 40);
  const username = cleanUsername(body.username);
  const temporaryPassword = cleanText(body.temporaryPassword, 80);

  if (!teacher) return { status: 401, body: { message: "Accesso docente richiesto." } };
  if (!classId || !firstName || !lastName || !username || temporaryPassword.length < 8) {
    return { status: 400, body: { message: "Dati alunno incompleti." } };
  }

  const targetClass = await getTeacherClass(classId, teacher.id);
  if (!targetClass) return { status: 403, body: { message: "Classe non disponibile per questo docente." } };

  await ensureUsernameAvailable(username);
  const authEmail = getStudentEmail(username);
  const authUser = await createAuthStudent({
    email: authEmail,
    password: temporaryPassword,
    firstName,
    lastName,
    username,
    mustChangePassword: true
  });
  const student = await insertStudentRow({
    classId,
    userId: authUser.id,
    firstName,
    lastName,
    username,
    authEmail,
    mustChangePassword: true
  });

  return { status: 200, body: { student } };
}

async function joinInvite(body) {
  const inviteCode = cleanText(body.inviteCode, 20).toUpperCase();
  const firstName = cleanText(body.firstName, 40);
  const lastName = cleanText(body.lastName, 40);
  const username = cleanUsername(body.username);
  const password = cleanText(body.password, 80);

  if (!inviteCode || !firstName || !lastName || !username || password.length < 8) {
    return { status: 400, body: { message: "Dati invito incompleti." } };
  }

  const targetClass = await getClassByInvite(inviteCode);
  if (!targetClass) return { status: 404, body: { message: "Codice classe non valido." } };

  await ensureUsernameAvailable(username);
  const authEmail = getStudentEmail(username);
  const authUser = await createAuthStudent({
    email: authEmail,
    password,
    firstName,
    lastName,
    username,
    mustChangePassword: false
  });
  const student = await insertStudentRow({
    classId: targetClass.id,
    userId: authUser.id,
    firstName,
    lastName,
    username,
    authEmail,
    mustChangePassword: false
  });

  return { status: 200, body: { student } };
}

async function resetStudentPassword(body, teacher) {
  const studentId = cleanText(body.studentId, 80);
  const temporaryPassword = cleanText(body.temporaryPassword, 80);

  if (!teacher) return { status: 401, body: { message: "Accesso docente richiesto." } };
  if (!studentId || temporaryPassword.length < 8) {
    return { status: 400, body: { message: "Password temporanea non valida." } };
  }

  const rows = await supabaseFetch(
    `/rest/v1/class_students?id=eq.${encodeURIComponent(studentId)}&select=id,class_id,user_id,first_name,last_name,username`
  );
  const student = rows?.[0] || null;
  if (!student?.user_id) return { status: 404, body: { message: "Alunno non trovato." } };

  const targetClass = await getTeacherClass(student.class_id, teacher.id);
  if (!targetClass) return { status: 403, body: { message: "Alunno non disponibile per questo docente." } };

  await updateAuthPassword(student.user_id, temporaryPassword, true);
  await supabaseFetch(`/rest/v1/class_students?id=eq.${encodeURIComponent(studentId)}`, {
    method: "PATCH",
    body: JSON.stringify({ must_change_password: true })
  });

  return { status: 200, body: { ok: true } };
}

async function markPasswordChanged(student) {
  if (!student) return { status: 401, body: { message: "Accesso studente richiesto." } };

  await supabaseFetch(`/auth/v1/admin/users/${encodeURIComponent(student.id)}`, {
    method: "PUT",
    body: JSON.stringify({
      user_metadata: { must_change_password: false }
    })
  });
  await supabaseFetch(`/rest/v1/class_students?user_id=eq.${encodeURIComponent(student.id)}`, {
    method: "PATCH",
    body: JSON.stringify({ must_change_password: false })
  });

  return { status: 200, body: { ok: true } };
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    send(res, 405, { message: "Metodo non consentito." });
    return;
  }

  try {
    requireServiceRole();
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const action = cleanText(body.action, 40);
    const authUser = await getAuthUser(getBearerToken(req));

    const result =
      action === "createStudent" ? await createStudent(body, authUser) :
      action === "joinInvite" ? await joinInvite(body) :
      action === "resetStudentPassword" ? await resetStudentPassword(body, authUser) :
      action === "markPasswordChanged" ? await markPasswordChanged(authUser) :
      { status: 400, body: { message: "Azione non valida." } };

    send(res, result.status, result.body);
  } catch (error) {
    send(res, error.status || 500, { message: error.message || "Errore API account studente." });
  }
};
