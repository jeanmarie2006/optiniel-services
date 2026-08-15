import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 heures
const SEPARATOR = "|"; // ne peut pas apparaître dans un email, contrairement au "."

function sign(value) {
  const hmac = crypto.createHmac("sha256", process.env.SESSION_SECRET);
  hmac.update(value);
  return hmac.digest("hex");
}

// Crée un jeton de session pour un email admin donné, valable 8h.
export function createSessionToken(email) {
  const expires = Date.now() + SESSION_DURATION_MS;
  const payload = `${email}${SEPARATOR}${expires}`;
  const signature = sign(payload);
  return `${payload}${SEPARATOR}${signature}`;
}

// Vérifie un jeton de session ; retourne l'email si valide, sinon null.
export function verifySessionToken(token) {
  if (!token) return null;
  const parts = token.split(SEPARATOR);
  if (parts.length !== 3) return null;
  const [email, expiresStr, signature] = parts;
  const payload = `${email}${SEPARATOR}${expiresStr}`;
  const expectedSignature = sign(payload);

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  const expires = Number(expiresStr);
  if (Number.isNaN(expires) || Date.now() > expires) return null;

  return email;
}

export function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${SESSION_DURATION_MS / 1000}; SameSite=Lax${isProd ? "; Secure" : ""}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

export function getSessionTokenFromRequest(req) {
  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.split("; ").find((c) => c.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}
