# 🔐 Fazza Play — نظام المصادقة

## الملفات المرفقة

| الملف | الوصف |
|-------|-------|
| `auth.html` | صفحة تسجيل الدخول / إنشاء حساب |
| `dashboard.html` | لوحة تحكم المستخدم الكاملة |
| `auth-worker.js` | Cloudflare Worker — الـ Backend |
| `wrangler.toml` | إعدادات النشر |

---

## 🚀 خطوات النشر (5 دقائق)

### 1. تثبيت Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2. إنشاء KV Namespace
```bash
wrangler kv:namespace create USERS_KV
# انسخ الـ ID الناتج
```

### 3. تحديث wrangler.toml
```toml
[[kv_namespaces]]
binding = "USERS_KV"
id = "PASTE_YOUR_ID_HERE"
```

### 4. إضافة JWT Secret
```bash
wrangler secret put JWT_SECRET
# أدخل نص عشوائي طويل وآمن مثل:
# FazzaPlay@2026!SuperSecretKey#Production
```

### 5. النشر
```bash
wrangler deploy
# ستحصل على: https://fazzaplay-auth.YOUR-NAME.workers.dev
```

### 6. ربط Frontend بالـ Worker
في `auth.html` و `dashboard.html`، غيّر:
```javascript
const API_BASE = 'https://fazzaplay-auth.YOUR-SUBDOMAIN.workers.dev';
```

---

## 📡 API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | `/auth/register` | إنشاء حساب جديد |
| POST | `/auth/login` | تسجيل الدخول |
| GET | `/user/me` | بيانات المستخدم الحالي |
| PUT | `/user/update` | تحديث الملف الشخصي |
| POST | `/user/favorites` | إضافة لعبة للمفضلة |
| POST | `/auth/forgot-password` | استعادة كلمة المرور |
| POST | `/auth/logout` | تسجيل الخروج |
| GET | `/health` | فحص حالة الـ API |

---

## 🔒 الأمان المدمج

- ✅ **JWT** — توكن صالح 30 يوم
- ✅ **Password Hashing** — SHA-256 + Random Salt
- ✅ **Rate Limiting** — 10 محاولات كل 5 دقائق للدخول
- ✅ **Input Sanitization** — تنظيف جميع المدخلات
- ✅ **CORS** — حماية من الطلبات غير المصرح بها
- ✅ **Token Blocklist** — إلغاء التوكن عند الخروج

---

## 🎮 ميزات الـ Dashboard

- **نظرة عامة** — إحصاءات، نشاطات، شارات
- **الملف الشخصي** — تعديل كامل للبيانات، أفاتار، الدولة، نبذة
- **المفضلة** — إضافة وإزالة الألعاب
- **المراجعات** — عرض وإدارة المراجعات
- **الإشعارات** — مع تحديد مقروء
- **الإعدادات** — التبديلات، الأمان، حذف الحساب
- **وضع تجريبي** — يعمل بدون API للاختبار

---

## 🧪 اختبار بدون Deploy

الصفحات تعمل في **وضع تجريبي** تلقائياً إذا لم يكن Worker منشوراً — تخزن البيانات في localStorage للاختبار.

---

## 🔗 ربط الموقع

أضف في هيدر الموقع:
```html
<a href="auth.html" id="login-link">تسجيل الدخول</a>

<script>
// إظهار Dashboard إذا المستخدم مسجل
const token = localStorage.getItem('fp_token') || sessionStorage.getItem('fp_token');
if(token) {
  document.getElementById('login-link').href = 'dashboard.html';
  document.getElementById('login-link').textContent = 'لوحة التحكم';
}
</script>
```

---

**© 2026 Fazza Play — جميع الحقوق محفوظة**
