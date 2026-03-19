/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          FAZZA PLAY — Cloudflare Worker Auth Backend            ║
 * ║                    auth-worker.js                               ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  HOW TO DEPLOY:                                                  ║
 * ║  1. npm install -g wrangler                                      ║
 * ║  2. wrangler login                                               ║
 * ║  3. Create KV namespace: wrangler kv:namespace create USERS_KV   ║
 * ║  4. Update wrangler.toml with KV id                              ║
 * ║  5. wrangler secret put JWT_SECRET  (enter any long secret)      ║
 * ║  6. wrangler deploy                                              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 * 
 * wrangler.toml content:
 * ─────────────────────
 * name = "fazzaplay-auth"
 * main = "auth-worker.js"
 * compatibility_date = "2024-01-01"
 *
 * [[kv_namespaces]]
 * binding = "USERS_KV"
 * id = "YOUR_KV_NAMESPACE_ID"
 *
 * [vars]
 * ALLOWED_ORIGIN = "https://fazzaplay.com"
 */

// ================================================================
//  CORS HEADERS
// ================================================================
const ALLOWED_ORIGINS = ['https://fazzaplay.com', 'https://www.fazzaplay.com'];
const CORS = (origin) => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : (origin || '*'),
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
});

function corsResponse(body, status = 200, origin) {
  return new Response(
    typeof body === 'string' ? body : JSON.stringify(body),
    { status, headers: CORS(origin) }
  );
}

// ================================================================
//  JWT IMPLEMENTATION (Pure Edge — No dependencies)
// ================================================================
async function createJWT(payload, secret, expiresInHours = 720) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + (expiresInHours * 3600);
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encode = (obj) => btoa(JSON.stringify(obj))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const headerB64 = encode(header);
  const payloadB64 = encode(fullPayload);
  const sigInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(sigInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${sigInput}.${sigB64}`;
}

async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;
    const sigInput = `${headerB64}.${payloadB64}`;

    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );

    const sigBytes = Uint8Array.from(
      atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      'HMAC', key, sigBytes, new TextEncoder().encode(sigInput)
    );

    if (!valid) return null;

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

// ================================================================
//  PASSWORD HASHING (SHA-256 + salt)
// ================================================================
async function hashPassword(password) {
  const salt = crypto.randomUUID();
  const data = new TextEncoder().encode(salt + password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const data = new TextEncoder().encode(salt + password);
  const computed = await crypto.subtle.digest('SHA-256', data);
  const computedHex = Array.from(new Uint8Array(computed)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computedHex === hash;
}

// ================================================================
//  HELPERS
// ================================================================
function extractToken(request) {
  const auth = request.headers.get('Authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

async function authenticate(request, env) {
  const token = extractToken(request);
  if (!token) return null;
  return await verifyJWT(token, env.JWT_SECRET);
}

function sanitize(str, maxLen = 100) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/<[^>]*>/g, '');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUsername(username) {
  return /^[a-zA-Z0-9_\u0600-\u06FF]{3,20}$/.test(username);
}

// ================================================================
//  RATE LIMITING (using KV)
// ================================================================
async function rateLimit(env, ip, action, maxAttempts = 10, windowSeconds = 300) {
  const key = `ratelimit:${action}:${ip}`;
  const current = await env.USERS_KV.get(key);
  const attempts = current ? parseInt(current) : 0;

  if (attempts >= maxAttempts) {
    return false; // Rate limited
  }

  await env.USERS_KV.put(key, String(attempts + 1), { expirationTtl: windowSeconds });
  return true;
}

// ================================================================
//  MAIN ROUTER
// ================================================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const origin = request.headers.get('Origin') || '*';

    // OPTIONS — CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS(origin) });
    }

    // ── POST /auth/register ────────────────────────────────────────
    if (method === 'POST' && path === '/auth/register') {
      try {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const allowed = await rateLimit(env, ip, 'register', 5, 3600);
        if (!allowed) {
          return corsResponse({ error: 'Too many attempts. Try again in 1 hour.', code: 'RATE_LIMITED' }, 429, origin);
        }

        const body = await request.json();
        const username = sanitize(body.username);
        const email = sanitize(body.email, 200).toLowerCase();
        const password = body.password || '';
        const avatar = sanitize(body.avatar, 10) || '🎮';

        // Validation
        if (!isValidUsername(username)) {
          return corsResponse({ error: 'Invalid username', code: 'INVALID_USERNAME' }, 400, origin);
        }
        if (!isValidEmail(email)) {
          return corsResponse({ error: 'Invalid email', code: 'INVALID_EMAIL' }, 400, origin);
        }
        if (password.length < 8) {
          return corsResponse({ error: 'Password too short', code: 'WEAK_PASSWORD' }, 400, origin);
        }

        // Check duplicates
        const emailExists = await env.USERS_KV.get(`email:${email}`);
        if (emailExists) {
          return corsResponse({ error: 'Email already registered', code: 'EMAIL_EXISTS' }, 409, origin);
        }
        const usernameExists = await env.USERS_KV.get(`username:${username.toLowerCase()}`);
        if (usernameExists) {
          return corsResponse({ error: 'Username taken', code: 'USERNAME_EXISTS' }, 409, origin);
        }

        // Create user
        const userId = `user_${crypto.randomUUID()}`;
        const hashedPassword = await hashPassword(password);
        const user = {
          id: userId,
          username,
          email,
          avatar,
          passwordHash: hashedPassword,
          joined: new Date().toISOString(),
          xp: 0,
          level: 1,
          badges: ['🎮'],
          favorites: [],
          reviews: [],
          country: '',
          bio: '',
          fullname: '',
          isActive: true,
        };

        // Store in KV
        await env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));
        await env.USERS_KV.put(`email:${email}`, userId);
        await env.USERS_KV.put(`username:${username.toLowerCase()}`, userId);

        // Create JWT token
        const token = await createJWT(
          { userId, username, email },
          env.JWT_SECRET
        );

        // Return user without password hash
        const { passwordHash, ...safeUser } = user;
        return corsResponse({ token, user: safeUser }, 201, origin);

      } catch (err) {
        return corsResponse({ error: 'Server error', code: 'SERVER_ERROR' }, 500, origin);
      }
    }

    // ── POST /auth/login ───────────────────────────────────────────
    if (method === 'POST' && path === '/auth/login') {
      try {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const allowed = await rateLimit(env, ip, 'login', 10, 300);
        if (!allowed) {
          return corsResponse({ error: 'Too many login attempts. Wait 5 minutes.', code: 'RATE_LIMITED' }, 429, origin);
        }

        const body = await request.json();
        const email = sanitize(body.email, 200).toLowerCase();
        const password = body.password || '';

        if (!email || !password) {
          return corsResponse({ error: 'Email and password required', code: 'MISSING_FIELDS' }, 400, origin);
        }

        // Find user
        const userId = await env.USERS_KV.get(`email:${email}`);
        if (!userId) {
          return corsResponse({ error: 'Email not found', code: 'NOT_FOUND' }, 404, origin);
        }

        const userData = await env.USERS_KV.get(`user:${userId}`);
        if (!userData) {
          return corsResponse({ error: 'User data not found', code: 'NOT_FOUND' }, 404, origin);
        }

        const user = JSON.parse(userData);
        const valid = await verifyPassword(password, user.passwordHash);

        if (!valid) {
          return corsResponse({ error: 'Invalid password', code: 'WRONG_PASSWORD' }, 401, origin);
        }

        // Create JWT
        const token = await createJWT(
          { userId: user.id, username: user.username, email: user.email },
          env.JWT_SECRET
        );

        // Update last login
        user.lastLogin = new Date().toISOString();
        await env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));

        const { passwordHash, ...safeUser } = user;
        return corsResponse({ token, user: safeUser }, 200, origin);

      } catch (err) {
        return corsResponse({ error: 'Server error', code: 'SERVER_ERROR' }, 500, origin);
      }
    }

    // ── GET /user/me ───────────────────────────────────────────────
    if (method === 'GET' && path === '/user/me') {
      try {
        const payload = await authenticate(request, env);
        if (!payload) {
          return corsResponse({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401, origin);
        }

        const userData = await env.USERS_KV.get(`user:${payload.userId}`);
        if (!userData) {
          return corsResponse({ error: 'User not found', code: 'NOT_FOUND' }, 404, origin);
        }

        const user = JSON.parse(userData);
        const { passwordHash, ...safeUser } = user;
        return corsResponse(safeUser, 200, origin);

      } catch (err) {
        return corsResponse({ error: 'Server error', code: 'SERVER_ERROR' }, 500, origin);
      }
    }

    // ── PUT /user/update ──────────────────────────────────────────
    if (method === 'PUT' && path === '/user/update') {
      try {
        const payload = await authenticate(request, env);
        if (!payload) {
          return corsResponse({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401, origin);
        }

        const userData = await env.USERS_KV.get(`user:${payload.userId}`);
        if (!userData) {
          return corsResponse({ error: 'User not found', code: 'NOT_FOUND' }, 404, origin);
        }

        const user = JSON.parse(userData);
        const body = await request.json();

        // Updatable fields only
        const allowed = ['username','fullname','bio','country','avatar'];
        allowed.forEach(field => {
          if (body[field] !== undefined) {
            user[field] = sanitize(String(body[field]), field === 'bio' ? 500 : 100);
          }
        });

        // If username changed, update index
        if (body.username && body.username !== payload.username) {
          const newUsername = sanitize(body.username);
          if (!isValidUsername(newUsername)) {
            return corsResponse({ error: 'Invalid username', code: 'INVALID_USERNAME' }, 400, origin);
          }
          const taken = await env.USERS_KV.get(`username:${newUsername.toLowerCase()}`);
          if (taken && taken !== user.id) {
            return corsResponse({ error: 'Username taken', code: 'USERNAME_EXISTS' }, 409, origin);
          }
          await env.USERS_KV.delete(`username:${payload.username.toLowerCase()}`);
          await env.USERS_KV.put(`username:${newUsername.toLowerCase()}`, user.id);
          user.username = newUsername;
        }

        user.updatedAt = new Date().toISOString();
        await env.USERS_KV.put(`user:${user.id}`, JSON.stringify(user));

        const { passwordHash, ...safeUser } = user;
        return corsResponse({ success: true, user: safeUser }, 200, origin);

      } catch (err) {
        return corsResponse({ error: 'Server error', code: 'SERVER_ERROR' }, 500, origin);
      }
    }

    // ── POST /user/favorites ──────────────────────────────────────
    if (method === 'POST' && path === '/user/favorites') {
      try {
        const payload = await authenticate(request, env);
        if (!payload) return corsResponse({ error: 'Unauthorized' }, 401, origin);

        const userData = await env.USERS_KV.get(`user:${payload.userId}`);
        const user = JSON.parse(userData);
        const body = await request.json();

        if (!user.favorites) user.favorites = [];
        user.favorites.push({
          name: sanitize(body.name),
          icon: sanitize(body.icon, 10),
          genre: sanitize(body.genre),
          rating: sanitize(body.rating, 5),
          addedAt: new Date().toISOString()
        });
        user.xp = (user.xp || 0) + 10;

        await env.USERS_KV.put(`user:${user.id}`, JSON.stringify(user));
        return corsResponse({ success: true, xp: user.xp }, 200, origin);

      } catch (err) {
        return corsResponse({ error: 'Server error' }, 500, origin);
      }
    }

    // ── POST /auth/forgot-password ────────────────────────────────
    if (method === 'POST' && path === '/auth/forgot-password') {
      try {
        const body = await request.json();
        const email = sanitize(body.email, 200).toLowerCase();

        const userId = await env.USERS_KV.get(`email:${email}`);
        if (!userId) {
          // Don't reveal if email exists
          return corsResponse({ success: true, message: 'If email exists, reset link sent.' }, 200, origin);
        }

        const resetToken = crypto.randomUUID();
        await env.USERS_KV.put(`reset:${resetToken}`, userId, { expirationTtl: 3600 }); // 1 hour

        // Here you would send email via SendGrid/Mailgun/Resend
        // Example with Resend:
        // await fetch('https://api.resend.com/emails', {
        //   method: 'POST',
        //   headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     from: 'Fazza Play <no-reply@fazzaplay.com>',
        //     to: email,
        //     subject: 'استعادة كلمة المرور - Fazza Play',
        //     html: `<p>اضغط هنا لإعادة تعيين كلمة المرور: https://fazzaplay.com/reset?token=${resetToken}</p>`
        //   })
        // });

        return corsResponse({ success: true, message: 'Reset link sent if email exists.' }, 200, origin);
      } catch (err) {
        return corsResponse({ error: 'Server error' }, 500, origin);
      }
    }

    // ── GET /auth/facebook ─────────────────────────────────────────
    if (method === 'GET' && path === '/auth/facebook') {
      try {
        const code = url.searchParams.get('code');
        if (!code) {
          // Redirect to Facebook OAuth
          const appId = env.FACEBOOK_APP_ID || '1408902564262213';
          const redirectUri = `${url.origin}/auth/facebook`;
          const oauthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email,public_profile&response_type=code`;
          return Response.redirect(oauthUrl);
        } else {
          // Exchange code for token
          const appId = env.FACEBOOK_APP_ID || '1408902564262213';
          const appSecret = env.FACEBOOK_APP_SECRET || 'YOUR_APP_SECRET';
          const redirectUri = `${url.origin}/auth/facebook`;
          const tokenUrl = `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;
          const tokenRes = await fetch(tokenUrl);
          const tokenData = await tokenRes.json();
          if (tokenData.error) {
            return corsResponse({ error: 'OAuth error', details: tokenData.error }, 400, origin);
          }
          const accessToken = tokenData.access_token;
          // Get user info
          const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
          const fbUser = await userRes.json();
          if (fbUser.error) {
            return corsResponse({ error: 'Failed to get user info', details: fbUser.error }, 400, origin);
          }
          // Check if user exists by facebook id
          const fbIdKey = `fb:${fbUser.id}`;
          let userId = await env.USERS_KV.get(fbIdKey);
          let user;
          if (userId) {
            // Login existing user
            const userData = await env.USERS_KV.get(`user:${userId}`);
            user = JSON.parse(userData);
          } else {
            // Create new user
            userId = `user_${crypto.randomUUID()}`;
            user = {
              id: userId,
              username: fbUser.name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
              email: fbUser.email || '',
              avatar: '👤',
              passwordHash: '',
              joined: new Date().toISOString(),
              xp: 0,
              level: 1,
              badges: ['👤'],
              favorites: [],
              reviews: [],
              country: '',
              bio: '',
              fullname: fbUser.name,
              isActive: true,
              facebookId: fbUser.id,
            };
            await env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));
            if (user.email) await env.USERS_KV.put(`email:${user.email}`, userId);
            await env.USERS_KV.put(`username:${user.username.toLowerCase()}`, userId);
            await env.USERS_KV.put(fbIdKey, userId);
          }
          const token = await createJWT(
            { userId: user.id, username: user.username, email: user.email },
            env.JWT_SECRET
          );
          // Redirect to dashboard with token
          const baseUrl = url.origin;
          return new Response(
            `<html><body><script>
              localStorage.setItem('fp_token', '${token}');
              window.location.href = '/login/dashboard.html';
            </script></body></html>`,
            { status: 200, headers: { 'Content-Type': 'text/html', ...CORS(origin) } }
          );
        }
      } catch (err) {
        return corsResponse({ error: 'Server error', code: 'SERVER_ERROR' }, 500, origin);
      }
    }

    // ── POST /auth/facebook ─────────────────────────────────────────
    if (method === 'POST' && path === '/auth/facebook') {
      try {
        const body = await request.json();
        const accessToken = body.access_token;
        if (!accessToken) {
          return corsResponse({ error: 'Access token required', code: 'MISSING_TOKEN' }, 400, origin);
        }
        // Get user info
        const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
        const fbUser = await userRes.json();
        if (fbUser.error) {
          return corsResponse({ error: 'Failed to get user info', details: fbUser.error }, 400, origin);
        }
        // Check if user exists by facebook id
        const fbIdKey = `fb:${fbUser.id}`;
        let userId = await env.USERS_KV.get(fbIdKey);
        let user;
        if (userId) {
          // Login existing user
          const userData = await env.USERS_KV.get(`user:${userId}`);
          user = JSON.parse(userData);
        } else {
          // Create new user
          userId = `user_${crypto.randomUUID()}`;
          user = {
            id: userId,
            username: fbUser.name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
            email: fbUser.email || '',
            avatar: '👤',
            passwordHash: '',
            joined: new Date().toISOString(),
            xp: 0,
            level: 1,
            badges: ['👤'],
            favorites: [],
            reviews: [],
            country: '',
            bio: '',
            fullname: fbUser.name,
            isActive: true,
            facebookId: fbUser.id,
          };
          await env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));
          if (user.email) await env.USERS_KV.put(`email:${user.email}`, userId);
          await env.USERS_KV.put(`username:${user.username.toLowerCase()}`, userId);
          await env.USERS_KV.put(fbIdKey, userId);
        }
        const token = await createJWT(
          { userId: user.id, username: user.username, email: user.email },
          env.JWT_SECRET
        );
        const { passwordHash, ...safeUser } = user;
        return corsResponse({ token, user: safeUser }, 200, origin);
      } catch (err) {
        return corsResponse({ error: 'Server error', code: 'SERVER_ERROR' }, 500, origin);
      }
    }

    // ── POST /auth/logout ─────────────────────────────────────────
    if (method === 'POST' && path === '/auth/logout') {
      // JWT is stateless — client deletes token
      // Optional: add token to a blocklist KV
      const token = extractToken(request);
      if (token) {
        await env.USERS_KV.put(`blocked:${token}`, '1', { expirationTtl: 2592000 }); // 30 days
      }
      return corsResponse({ success: true }, 200, origin);
    }

    // ── GET /health ───────────────────────────────────────────────
    if (path === '/health') {
      return corsResponse({
        status: 'ok',
        service: 'FazzaPlay Auth API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }, 200, origin);
    }

    // ── POST /auth/reset-password ─────────────────────────────────
    if (method === 'POST' && path === '/auth/reset-password') {
      try {
        const body = await request.json();
        const token = sanitize(body.token, 100);
        const newPassword = body.password || '';

        if (!token || newPassword.length < 8) {
          return corsResponse({ error: 'Invalid token or password too short', code: 'INVALID_INPUT' }, 400, origin);
        }

        const userId = await env.USERS_KV.get(`reset:${token}`);
        if (!userId) {
          return corsResponse({ error: 'Token expired or invalid', code: 'INVALID_TOKEN' }, 400, origin);
        }

        const userData = await env.USERS_KV.get(`user:${userId}`);
        if (!userData) {
          return corsResponse({ error: 'User not found', code: 'NOT_FOUND' }, 404, origin);
        }

        const user = JSON.parse(userData);
        user.passwordHash = await hashPassword(newPassword);
        user.updatedAt = new Date().toISOString();

        await env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));
        await env.USERS_KV.delete(`reset:${token}`); // Invalidate token

        return corsResponse({ success: true, message: 'Password reset successfully.' }, 200, origin);
      } catch (err) {
        return corsResponse({ error: 'Server error', code: 'SERVER_ERROR' }, 500, origin);
      }
    }

    // ── DELETE /user/account ──────────────────────────────────────
    if (method === 'DELETE' && path === '/user/account') {
      try {
        const payload = await authenticate(request, env);
        if (!payload) return corsResponse({ error: 'Unauthorized' }, 401, origin);

        const userData = await env.USERS_KV.get(`user:${payload.userId}`);
        if (!userData) return corsResponse({ error: 'User not found' }, 404, origin);

        const user = JSON.parse(userData);

        // Delete all KV entries for this user
        await env.USERS_KV.delete(`user:${user.id}`);
        await env.USERS_KV.delete(`email:${user.email}`);
        await env.USERS_KV.delete(`username:${user.username.toLowerCase()}`);
        if (user.facebookId) await env.USERS_KV.delete(`fb:${user.facebookId}`);

        return corsResponse({ success: true, message: 'Account deleted successfully.' }, 200, origin);
      } catch (err) {
        return corsResponse({ error: 'Server error', code: 'SERVER_ERROR' }, 500, origin);
      }
    }

    // 404
    return corsResponse({ error: 'Endpoint not found', code: 'NOT_FOUND' }, 404, origin);
  }
};
