import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwtEncodedKey = new TextEncoder().encode(jwtSecretKey);

const loginExpireSeconds = Number(process.env.LOGIN_EXPIRATION_SECONDS) || 600;
const loginExpiredString = process.env.LOGIN_EXPIRATION_STRING || '10m';
const loginCookieName = process.env.LOGIN_COOKIE_NAME || 'loginSession';

type JwtPayload = {
  username: string;
  expiresAt: Date;
};

export async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 10);
  //Encoded in base64 to avoid issues with environment env, this is not necessary if the hash is stored on a database
  const base64 = Buffer.from(hash).toString('base64');
  return base64;
  //End encode base64
}

export async function verifyPasswordProduction(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}

export async function verifyPassword(
  password: string,
  base64Password: string,
): Promise<boolean> {
  const hashedPassword = Buffer.from(base64Password, 'base64').toString(
    'utf-8',
  );
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}

export async function createLoginSession(username: string) {
  const expiresAt = new Date(Date.now() + loginExpireSeconds * 1000);
  const loginSession = await signJwt({ username, expiresAt });

  const cookieStore = await cookies();

  cookieStore.set(loginCookieName, loginSession, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: expiresAt,
  });
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();

  cookieStore.set(loginCookieName, '', {
    expires: new Date(0),
  });
  cookieStore.delete(loginCookieName);
}

export async function getLoginSession() {
  const cookieStore = await cookies();

  const jwt = cookieStore.get(loginCookieName)?.value;

  if (!jwt) return false;

  return verifyJwt(jwt);
}

export async function verifyLoginSession() {
  const jwtPayload = await getLoginSession();

  if (!jwtPayload) return false;

  return jwtPayload?.username === process.env.LOGIN_USER;
}

export async function requireLoginSessionOrRedirect() {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }
}

export async function signJwt(jwtPayload: JwtPayload) {
  return new SignJWT(jwtPayload)
    .setProtectedHeader({
      alg: 'HS256',
      typ: 'JWT',
    })
    .setIssuedAt(Date.now())
    .setExpirationTime(loginExpiredString)
    .sign(jwtEncodedKey);
}

//If no cookie is received a.k.a. undefined, send an empty string instead
export async function verifyJwt(jwt: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(jwt, jwtEncodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    console.log('Jwt verification failed, invalid token');
    return false;
  }
}
