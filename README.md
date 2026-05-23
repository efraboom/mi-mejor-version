# Mi Mejor Versión ♡

Aplicación web de desarrollo personal femenino — Next.js 14 + Supabase + OneSignal.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** — Auth, PostgreSQL, RLS
- **Tailwind CSS** + variables CSS custom (paleta del diseño original)
- **OneSignal** — notificaciones push web
- **Vercel** — deploy

---

## Setup paso a paso

### 1. Clonar e instalar

```bash
git clone <repo>
cd mi-mejor-version
npm install
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales (ya incluidas para desarrollo):

```env
NEXT_PUBLIC_SUPABASE_URL=https://oxlxvoudflrhbspxoxpy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_ONESIGNAL_APP_ID=0be941aa-7dc9-4cb9-a81d-9ea45cf90a85
```

### 3. Configurar Supabase

#### 3a. Ejecutar migraciones SQL

1. Ve a [supabase.com](https://supabase.com) → tu proyecto → **SQL Editor**
2. Pega el contenido de `supabase/migrations/001_init.sql`
3. Haz clic en **Run** — creará todas las tablas + RLS policies

#### 3b. Habilitar Google OAuth (opcional)

1. En Supabase → **Authentication** → **Providers** → **Google**
2. Configura con tus credenciales de Google Cloud Console
3. Agrega `http://localhost:3000/auth/callback` a las URLs permitidas

#### 3c. Configurar URL de redirección

En Supabase → **Authentication** → **URL Configuration**:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Configurar OneSignal

1. Ve a [onesignal.com](https://onesignal.com) → tu app
2. **Settings** → **Keys & IDs** → copia el App ID
3. En **Push Notifications** → configura los Service Worker paths:
   - Service Worker Path: `/OneSignalSDKWorker.js`
4. Para producción, agrega tu dominio en Allowed Origins

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Deploy en Vercel

```bash
# 1. Conecta tu repo en vercel.com
# 2. Configura las environment variables en el panel de Vercel
# 3. Deploy automático en cada push a main
```

Variables necesarias en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_ONESIGNAL_APP_ID`

---

## Estructura del proyecto

```
app/
├── (auth)/login/          ← Inicio de sesión
├── (auth)/register/       ← Registro
├── (app)/
│   ├── layout.tsx         ← Layout con nav protegida
│   ├── dashboard/         ← Cover / inicio
│   ├── diagnostico/       ← Diagnóstico inicial
│   ├── areas/             ← Sistema por áreas de vida
│   ├── habitos/           ← Plan de hábitos progresivos
│   ├── rutina/            ← Rutina diaria
│   ├── tracker/           ← Tracker de hábitos semanal
│   ├── semanal/           ← Sistema semanal + revisión
│   ├── emocional/         ← Bienestar emocional + journal
│   ├── espiritual/        ← Vida espiritual + gratitud
│   └── progreso/          ← Progreso por áreas
├── auth/callback/         ← OAuth callback
components/
├── tracker/HabitTracker   ← Grid de hábitos interactivo
├── journal/JournalBox     ← Diario emocional guiado
├── progress/ProgressSliders ← Sliders de progreso
├── nav/StickyNav          ← Navegación sticky
├── Affirmations           ← Carrusel de afirmaciones
└── NotificationPrompt     ← Prompt para push notifications
lib/
├── supabase/              ← Clientes SSR y browser
└── hooks/                 ← useTracker, useJournal, useProgress, etc.
types/database.ts          ← Tipos TypeScript del schema
supabase/migrations/001_init.sql ← Schema completo
```

---

## SQL de migraciones

El archivo `supabase/migrations/001_init.sql` incluye:

- Tablas: `users_profile`, `tracker_entries`, `journal_entries`, `progress_scores`, `diagnostico_responses`, `checklist_daily`, `weekly_reviews`, `gratitud_entries`
- RLS Policies: cada usuario solo accede a sus propios datos
- Índices optimizados por `user_id + fecha`
- Trigger: auto-crea perfil al registrarse

---

## Notas técnicas

- **Auto-guardado**: debounce de 800ms en todos los campos interactivos
- **Optimistic updates**: el UI responde inmediatamente, persiste en background
- **Tracker semanal**: `week_start` = lunes de la semana actual
- **Middleware**: protege todas las rutas `/app/*` — redirige a `/login` si no hay sesión
