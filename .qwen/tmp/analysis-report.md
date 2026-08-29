# تحلیل معماری پروژه Consultation

---

## 1. ساختار کلی پروژه

```
consultation/
├── backend/              # Django REST API (سمت سرور)
│   ├── config/           # تنظیمات اصلی Django (settings, urls, celery, wsgi, asgi)
│   ├── accounts/         # اپ احراز هویت و مدیریت کاربران
│   ├── core/             # اپ مشترک (BaseModel، permissions، paginations، utils)
│   ├── operations/       # اپ اصلی بیزینس (Lines, Assignments, Contents, Conversations)
│   ├── message/          # اپ پیامک (Celery tasks برای SMS.ir)
│   ├── media/            # فایل‌های آپلودشده
│   ├── static/           # فایل‌های استاتیک
│   ├── manage.py         # Entry point اصلی Django
│   └── req.txt           # وابستگی‌های Python
│
├── frontend/             # Next.js (سمت کلاینت)
│   ├── src/
│   │   ├── app/          # مسیرهای صفحه‌ای Next.js (App Router)
│   │   ├── components/   # کامپوننت‌های UI
│   │   ├── hooks/        # React Query hooks
│   │   ├── services/     # سرویس‌های ارتباط با API
│   │   ├── types/        # تعاریف TypeScript
│   │   ├── schemas/      # Validation schemaها (Zod)
│   │   ├── forms/        # فرم‌ها
│   │   ├── lib/          # ابزارها (axios, auth, date, storage)
│   │   └── data/         # داده‌های استاتیک
│   ├── package.json
│   └── next.config.ts
│
└── .github/workflows/    # CI/CD
```

---

## 2. تکنولوژی‌ها و فریم‌ورک‌ها

### Backend (Django)
| تکنولوژی | نسخه | کاربرد |
|---|---|---|
| Django | 6.0.7 | فریم‌ورک اصلی وب |
| Django REST Framework | 3.17.1 | ساخت API |
| SimpleJWT | 5.5.1 | احراز هویت JWT (access + refresh) |
| Celery | 5.6.3 | صف وظایف غیرهمزمان |
| Redis | 8.1.0 | Broker برای Celery + Caching |
| django-celery-beat | 2.9.0 | زمان‌بندی وظایف دوره‌ای |
| django-cors-headers | 4.9.0 | مدیریت CORS برای فرانت‌اند |
| django-filter | 26.1 | فیلتر و جستجوی API |
| psycopg2-binary | 2.9.12 | درایور PostgreSQL |
| Pillow | 12.3.0 | پردازش تصاویر |
| python-decouple | 3.8 | مدیریت متغیرهای محیطی (.env) |

### Frontend (Next.js)
| تکنولوژی | نسخه | کاربرد |
|---|---|---|
| Next.js | 15.0.0 | فریم‌ورک React با App Router |
| React | 19.0.0 | کتابخانه UI |
| TypeScript | 5.6.3 | تایپ‌اسکریپت |
| TanStack React Query | 5.59.0 | مدیریت state سرور |
| Axios | 1.19.0 | کلاینت HTTP |
| React Hook Form | 7.53.0 | مدیریت فرم‌ها |
| Zod | 3.23.8 | اعتبارسنجی schema-based |
| Tailwind CSS | 3.4.14 | استایل‌دهی Utility-first |
| Framer Motion | 11.11.0 | انیمیشن‌ها |
| Headless UI | 2.2.10 | کامپوننت‌های بدون استایل |
| Sonner | 1.5.0 | Toast notification |

---

## 3. معماری Backend

### الگوی معماری
**Django Monolithic با ساختار اپ‌محور (App-based)**

### اپ‌ها:

**`config`** — پروژه اصلی Django
- `settings.py` — تنظیمات (DB, JWT, CORS, Celery, Redis, Static/Media)
- `urls.py` — روت اصلی URLها
- `celery.py` — پیکربندی Celery با autodiscover
- `wsgi.py` / `asgi.py` — سرور ورودی

**`accounts`** — مدیریت کاربران و احراز هویت
- Models: `User` (AbstractUser), `Staff`, `Role`, `UserRole`, `OTPCode`, `Information`, `Address`, `Club`
- API v1: Login, Register, Refresh, Verify, Logout
- CRUD برای Role، User، Staff
- احراز هویت: JWT (SimpleJWT) با access token در header و refresh token در httpOnly cookie

**`core`** — لایه زیرساخت مشترک
- `BaseModel` — مدل پایه با UUID primary key، created_at، updated_at، is_active
- `permissions.py` — `IsAdminOrSuperUser`, `IsStaff`
- `paginations.py` — صفحه‌بندی سفارشی
- `utils.py` / `mixins.py` — ابزارهای مشترک

**`operations`** — هسته بیزینس لاجیک
- Models: `Line` (ساختار سلسله‌مراتبی), `LineMember`, `StaffLine`, `Assignment`, `AssignmentRecipient`, `AssignmentSubmission`, `Media`, `Content`, `ContentRecipient`, `Conversation`, `Message`, `ConsultationForm`, `Appointment`, `Feature`, `InviteRule`
- API کامل برای Lines، Assignments (Staff/Member/Admin)، Submissions، Conversations، Contents

**`message`** — سرویس پیامک
- Celery tasks: `send_bulk_sms`, `send_like_to_like_sms`
- اتصال به API سرویس sms.ir

### لایه‌های Backend:
```
URL Routing (config/urls.py)
    ↓
App URL includes (accounts/Api/v1/urls.py, operations/Api/urls.py)
    ↓
API Views (GenericAPIView / ListAPIView / CreateAPIView / RetrieveAPIView)
    ↓
Serializers (ModelSerializer / Serializer)
    ↓
Models (BaseModel → Django ORM)
    ↓
PostgreSQL DB
```

---

## 4. معماری Frontend

### الگوی معماری
**Next.js 15 App Router با Server Components + Client Components**

### ساختار مسیرها (App Router):
```
src/app/
├── layout.tsx              # Layout اصلی (ریشه)
├── (dashboard)/
│   ├── admin/
│   │   └── layout.tsx      # Layout پنل ادمین
│   ├── member/
│   │   └── layout.tsx      # Layout پنل اعضا
│   └── staff/
│       └── layout.tsx       # Layout پنل کارکنان
│       ├── content/        # مدیریت محتوا
│       └── members/        # مدیریت اعضا
└── line/
    └── layout.tsx           # Layout مربوط به Lines
```

### لایه‌های Frontend:
```
Pages/Components (src/app/)
    ↓
React Query Hooks (src/hooks/)
    ↓
Service Layer (src/services/)
    ↓
Axios Client (src/lib/axios.ts) — با interceptor JWT
    ↓
Django REST API (http://localhost:8000/api/)
```

### مدیریت State:
- **TanStack React Query** — state سرور (fetch, cache, invalidate)
- **React Hook Form + Zod** — مدیریت و اعتبارسنجی فرم‌ها
- **Cookies / LocalStorage** — نگهداری token (tokenService)

### احراز هویت Frontend:
- Access token: localStorage/cookies
- Refresh token: httpOnly cookie (سمت سرور Django ست می‌کند)
- Auto-refresh: interceptor axios که 401 را تشخیص داده و token را refresh می‌کند
- Routes محافظت‌شده: layoutهای dashboard

---

## 5. نحوه ارتباط Frontend و Backend

```
┌─────────────────────────────────────────────┐
│  Frontend (Next.js :3000)                    │
│  ┌───────────────────────────────────────┐   │
│  │  axios interceptor (Bearer JWT)       │   │
│  │  auto-refresh on 401                  │   │
│  └───────────────┬───────────────────────┘   │
└──────────────────┼───────────────────────────┘
                   │ HTTP REST API
                   │ baseURL: http://localhost:8000/api/
                   ▼
┌─────────────────────────────────────────────┐
│  Backend (Django :8000)                      │
│  ┌───────────────────────────────────────┐   │
│  │  JWT Authentication (SimpleJWT)       │   │
│  │  CORS allowed origins                 │   │
│  │  Pagination, Filtering, Search        │   │
│  └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Endpoint Mapping:
| Frontend Service | Backend URL | Backend View |
|---|---|---|
| `auth.login()` | `POST /api/v1/auth/login/` | `LoginView` |
| `auth.register()` | `POST /api/v1/auth/register/` | `RegisterView` |
| `auth.refresh()` | `POST /api/v1/auth/refresh/` | `RefreshTokenView` |
| Staff service | `/api/accounts/staff/` | `StaffListAPIView` et al. |
| Line service | `/api/operations/lines/` | `LineListAPIView` et al. |
| Content service | `/api/operations/contents/` | Content views |

---

## 6. مهم‌ترین پوشه‌ها و فایل‌ها

### Backend:
| فایل/پوشه | نقش |
|---|---|
| `backend/config/settings.py` | تنظیمات اصلی (DB, JWT, CORS, Celery, Redis) |
| `backend/config/urls.py` | روت اصلی URLها |
| `backend/config/celery.py` | پیکربندی Celery |
| `backend/manage.py` | Entry point — `python manage.py runserver` |
| `backend/accounts/models.py` | مدل‌های User, Staff, Role, OTP |
| `backend/accounts/Api/v1/view.py` | Views احراز هویت و CRUD |
| `backend/accounts/Api/v1/urls.py` | URLهای API accounts |
| `backend/operations/models.py` | مدل‌های بیزینس (Line, Assignment, Content, ...) |
| `backend/operations/Api/views.py` | ~1879 خط — Views اصلی API |
| `backend/operations/Api/serializers.py` | ~1437 خط — Serializers |
| `backend/operations/Api/urls.py` | URLهای operations API |
| `backend/message/tasks.py` | Celery tasks پیامک |
| `backend/core/models.py` | BaseModel (UUID, timestamps) |
| `backend/core/permissions.py` — `IsAdminOrSuperUser`, `IsStaff` |

### Frontend:
| فایل/پوشه | نقش |
|---|---|
| `frontend/package.json` | وابستگی‌ها و اسکریپت‌ها |
| `frontend/next.config.ts` | تنظیمات Next.js |
| `frontend/src/app/layout.tsx` | Layout ریشه |
| `frontend/src/app/(dashboard)/{admin,member,staff}/layout.tsx` | Layoutهای نقش‌محور |
| `frontend/src/lib/axios.ts` | کلاینت HTTP با JWT interceptor |
| `frontend/src/services/auth.ts` | سرویس احراز هویت |
| `frontend/src/services/api/endpoints.ts` | آدرس‌های API |
| `frontend/src/hooks/useAuth.ts` | React Query hook احراز هویت |
| `frontend/src/services/contentService.ts` | سرویس مدیریت محتوا |
| `frontend/src/types/` | تعاریف TypeScript |
| `frontend/src/schemas/` | Schemaهای Zod |

---

## 7. Entry Points

### Backend:
- **`backend/manage.py`** — مدیریت Django (`runserver`, `migrate`, `createsuperuser`, ...)
- **`backend/config/wsgi.py`** — ورودی WSGI برای production
- **`backend/config/asgi.py`** — ورودی ASGI
- **`backend/config/settings.py`** — نقطه شروع پیکربندی
- **`backend/config/urls.py`** — نقطه شروع routing

### Frontend:
- **`npm run dev`** — `next dev` (توسعه)
- **`npm run build`** — `next build` (ساخت)
- **`npm run start`** — `next start` (production)
- **`src/app/layout.tsx`** — Layout ریشه
- **`src/lib/axios.ts`** — کلاینت HTTP پایه

---

## 8. فایل‌های Configuration مهم

| فایل | محتوای |
|---|---|
| `backend/.env` | متغیرهای محیطی (SECRET_KEY, DB_*, REDIS_HOST, CORS_ALLOWED_ORIGINS, SMS_IR_*) |
| `backend/config/settings.py` | تنظیمات Django |
| `backend/config/celery.py` | تنظیمات Celery |
| `frontend/next.config.ts` | تنظیمات Next.js (outputFileTracingRoot, ignoreBuildErrors) |
| `frontend/package.json` | وابستگی‌ها و اسکریپت‌ها |
| `backend/req.txt` | وابستگی‌های Python |
| `.github/workflows/` | CI/CD pipeline |
| `.gitignore` | فایل‌های نادیده گرفته‌شده |

---

## 9. زیرساخت‌ها و سرویس‌های خارجی

### ✅ PostgreSQL
- **محل استفاده:** `backend/config/settings.py` → `DATABASES.default`
- **Engine:** `django.db.backends.postgresql`
- **Driver:** `psycopg2-binary`
- **تنظیمات:** از `.env` خوانده می‌شود (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)

### ✅ Redis
- **محل استفاده:** `backend/config/settings.py` → `REDIS_URL`, `CACHES`
- **Caching:** `django_redis.cache.RedisCache`
- **Celery Broker:** `REDIS_URL` → `redis://{REDIS_HOST}:{REDIS_PORT}/0`
- **Celery Backend:** همان Redis

### ✅ Celery
- **محل استفاده:** `backend/config/celery.py`
- **Tasks:** `backend/message/tasks.py` → `send_bulk_sms`, `send_like_to_like_sms`
- **Scheduler:** `django-celery-beat` (زمان‌بندی دوره‌ای)
- **Config:** `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`, `CELERY_TIMEZONE = "Asia/Tehran"`

### ❌ Docker
- **وضعیت:** فایل Dockerfile یا docker-compose.yml یافت نشد

### ✅ Authentication
- **نوع:** JWT (SimpleJWT)
- **Access Token:** در header به صورت `Bearer {token}`
- **Refresh Token:** در httpOnly cookie
- **Blacklist:** فعال (`ROTATE_REFRESH_TOKENS: True`, `BLACKLIST_AFTER_ROTATION: True`)
- **Custom User Model:** `AUTH_USER_MODEL = "accounts.User"` (extends AbstractUser)
- **OTP:** مدل `OTPCode` برای احراز هویت با کد یکبار مصرف

### ✅ API (REST)
- **فریم‌ورک:** Django REST Framework 3.17.1
- **نسخه‌بندی:** `api/v1/`
- **Pagination:** سفارشی (`core.paginations.DefaultPagination`)
- **Filtering:** `django-filter` + SearchFilter + OrderingFilter
- **CORS:** `django-cors-headers` با `CORS_ALLOWED_ORIGINS` از env

### ✅ SMS Service
- **سرویس:** sms.ir
- **API:** `api.sms.ir/v1/send/bulk` و `v1/send/likeToLike`
- **پیاده‌سازی:** Celery tasks با retry (3 بار)

---

## 10. نقاط قوت و مشکلات معماری

### ✅ نقاط قوت

1. **جداسازی تمیز Frontend/Backend** — ارتباط فقط از طریق REST API
2. **JWT با refresh token امن** — httpOnly cookie برای refresh، Bearer برای access
3. **Redis caching گسترده** — Views اصلی از cache استفاده می‌کنند (`cache.get`, `cache.set`)
4. **UUID Primary Keys** — امنیت بالاتر نسبت به auto-increment IDs
5. **BaseModel مشترک** — timestamps و is_active در همه مدل‌ها
6. **Permission system** — `IsAdminOrSuperUser` و `IsStaff` برای کنترل دسترسی
7. **Celery async tasks** — ارسال SMS غیرهمزمان با retry
8. **React Query** — مدیریت حرفه‌ای state سرور با cache و invalidation
9. **TypeScript + Zod** — تایپ‌سیفتی کامل + اعتبارسنجی runtime
10. **Transaction atomic** — استفاده از `@transaction.atomic` برای عملیات پیچیده
11. **App Router Next.js 15** — معماری مدرن با Server/Client Components
12. **select_related / prefetch_related** — بهینه‌سازی queryها

### ⚠️ مشکلات و نگرانی‌ها

1. **فایل views.py عملیات — 1879 خط** — بسیار بزرگ، باید به چند فایل شکسته شود
2. **فایل serializers.py عملیات — 1437 خط** — همین مشکل، نیاز به split
3. **تنظیمات امنیتی comment شده** — `SECURE_SSL_REDIRECT`, `SECURE_PROXY_SSL_HEADER` و... در settings.py غیرفعال هستند (مناسب توسعه، نه production)
4. **`DEFAULT_PERMISSION_CLASSES` comment شده** — در REST_FRAMEWORK settings، یعنی APIها پیش‌فرض public هستند (هر view باید صریحاً permission ست کند)
5. **CSRF_TRUSTED_ORIGINS هاردکد** — `"http://api.serenityambassadors.org"` مستقیماً در settings
6. **`ignoreBuildErrors: true` و `ignoreDuringBuilds: true`** — در next.config.ts، پنهان‌کردن خطاها
7. **نداشتن Docker** — استقرار بدون containerization سخت‌تر است
8. **نداشتن تست** — فایل‌های `tests.py` وجود دارند اما خالی به نظر می‌رسند
9. **URL inconsistency** — ترکیبی از `/api/v1/` و `/api/accounts/` و `/api/operations/`
10. **نداشتن API documentation** — Swagger/OpenAPI یافت نشد
11. **Error handling یکپارچه نیست** — هر view exception handling خودش را دارد
12. **API versioning ناقص** — فقط `v1` برای accounts، operations نسخه‌بندی ندارد

---

## 11. نقشه ساختار پروژه

```
┌──────────────────────────────────────────────────────────┐
│                     CONSULTATION APP                      │
├──────────────────────┬───────────────────────────────────┤
│      BACKEND         │           FRONTEND                │
│   (Django 6.0.7)     │      (Next.js 15 + React 19)      │
├──────────────────────┼───────────────────────────────────┤
│                      │                                   │
│  ┌────────────────┐  │  ┌────────────────────────────┐  │
│  │    config/     │  │  │     src/app/               │  │
│  │ settings.py    │  │  │  (dashboard)/              │  │
│  │ celery.py      │  │  │   admin/ layout.tsx        │  │
│  │ urls.py        │  │  │   member/ layout.tsx       │  │
│  │ wsgi.py/asgi.py│  │  │   staff/ layout.tsx        │  │
│  └───────┬────────┘  │  │   line/ layout.tsx         │  │
│          │           │  └─────────────┬──────────────┘  │
│  ┌───────▼────────┐  │                │                 │
│  │   accounts/    │  │  ┌─────────────▼──────────────┐  │
│  │ Models: User,  │  │  │  src/services/             │  │
│  │ Staff, Role,   │  │  │   auth.ts                  │  │
│  │ OTP            │  │  │   staffService.ts          │  │
│  │ API: login,    │  │  │   linesService.ts          │  │
│  │ register, CRUD │  │  │   contentService.ts        │  │
│  └───────┬────────┘  │  │   booking.ts               │  │
│          │           │  │   api/endpoints.ts         │  │
│  ┌───────▼────────┐  │  └─────────────┬──────────────┘  │
│  │  operations/   │  │                │                 │
│  │ Models: Line,  │  │  ┌─────────────▼──────────────┐  │
│  │ Assignment,    │  │  │  src/hooks/                │  │
│  │ Content,       │  │  │   useAuth.ts               │  │
│  │ Conversation,  │  │  │   useStaff.ts              │  │
│  │ Media, Feature │  │  │   useLines.ts              │  │
│  │ API: CRUD +    │  │  │   useContent.ts            │  │
│  │ RBAC Views     │  │  │   useUsers.ts              │  │
│  └───────┬────────┘  │  └─────────────┬──────────────┘  │
│          │           │                │                 │
│  ┌───────▼────────┐  │  ┌─────────────▼──────────────┐  │
│  │    message/    │  │  │  src/lib/                  │  │
│  │ Celery Tasks:  │  │  │   axios.ts (JWT interceptor│  │
│  │ send_bulk_sms  │  │  │   auth/tokenService.ts     │  │
│  │ likeToLike SMS │  │  │   date.ts (jalaali)        │  │
│  └───────┬────────┘  │  │   storage/                 │  │
│          │           │  └────────────────────────────┘  │
│  ┌───────▼────────┐  │                                  │
│  │     core/      │  │  ┌────────────────────────────┐  │
│  │ BaseModel      │  │  │  src/types/  src/schemas/  │  │
│  │ permissions    │  │  │  TypeScript + Zod          │  │
│  │ paginations    │  │  └────────────────────────────┘  │
│  └───────┬────────┘  │                                  │
│          │           │                                  │
│  ┌───────▼────────┐  │                                  │
│  │   PostgreSQL   │  │                                  │
│  │   + Redis      │  │                                  │
│  │ (Cache/Broker) │  │                                  │
│  └────────────────┘  │                                  │
│                      │                                  │
├──────────────────────┼───────────────────────────────────┤
│    HTTP REST API (JSON + JWT Bearer)                     │
│    baseURL: http://localhost:8000/api/                   │
│    CORS: configured in settings.py                       │
└──────────────────────┴───────────────────────────────────┘
```

### جریان داده (Data Flow):

```
User → Next.js Page → React Query Hook → Service → Axios (JWT)
                                              ↓
                                    Django REST API
                                              ↓
                                    JWT Authentication
                                              ↓
                                    Permission Check (IsStaff/IsAdmin)
                                              ↓
                                    View → Serializer → ORM Query
                                              ↓
                                    PostgreSQL Response
                                              ↓
                                    JSON Response → Frontend → UI
```

### نقش‌ها (Roles):
- **Admin** — دسترسی کامل به همه چیز
- **Staff** — مدیریت Lineهای خود، Assignmentها، Contents
- **Member** — مشاهده و ارسال Assignmentها، Conversations
- **Superuser** — دسترسی نامحدود
