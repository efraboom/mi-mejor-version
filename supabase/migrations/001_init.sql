-- ══════════════════════════════════════════════════════════════════
-- Mi Mejor Versión – Schema v2 (pegar completo en SQL Editor)
-- ══════════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ─── ENUM plazo de metas ──────────────────────────────────────────
do $$ begin
  create type plazo_meta as enum ('1_semana','1_mes','3_meses','6_meses','1_año');
exception when duplicate_object then null;
end $$;

-- ─── PERFILES ─────────────────────────────────────────────────────
create table if not exists users_profile (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  nombre     text,
  created_at timestamptz not null default now(),
  constraint uq_users_profile_user unique (user_id)
);

-- ─── TRACKER DE HÁBITOS ───────────────────────────────────────────
create table if not exists tracker_entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  habit_index int  not null,
  day_index   int  not null,
  week_start  date not null,
  completed   boolean not null default false,
  updated_at  timestamptz not null default now(),
  constraint uq_tracker unique (user_id, habit_index, day_index, week_start)
);

-- ─── CHECKLIST DIARIA ─────────────────────────────────────────────
create table if not exists checklist_daily (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  fecha      date not null default current_date,
  item_index int  not null,
  completed  boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint uq_checklist unique (user_id, fecha, item_index)
);

-- ─── DIARIO / JOURNAL ─────────────────────────────────────────────
create table if not exists journal_entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  fecha       date not null default current_date,
  texto       text,
  emocion     text,
  prompt_usado text,
  updated_at  timestamptz not null default now(),
  constraint uq_journal unique (user_id, fecha)
);

-- ─── PROGRESO POR ÁREA (calculado automáticamente) ────────────────
create table if not exists progress_scores (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  area_id    text not null,
  valor      int  not null default 0 check (valor between 0 and 100),
  updated_at timestamptz not null default now(),
  constraint uq_progress unique (user_id, area_id)
);

-- ─── RESPUESTAS DE DIAGNÓSTICO ────────────────────────────────────
create table if not exists diagnostico_responses (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  pregunta_key text not null,
  respuesta    text,
  updated_at   timestamptz not null default now(),
  constraint uq_diagnostico unique (user_id, pregunta_key)
);

-- ─── METAS CON PLAN DE IA ─────────────────────────────────────────
create table if not exists metas (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  titulo       text not null,
  plazo        plazo_meta not null,
  fecha_inicio date not null default current_date,
  fecha_limite date,
  pasos        jsonb,
  activa       boolean not null default true,
  updated_at   timestamptz not null default now()
);

-- ─── REVISIONES SEMANALES ─────────────────────────────────────────
create table if not exists weekly_reviews (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  week_start        date not null,
  celebro           text,
  habitos_cumplidos text,
  ajustes           text,
  intencion         text,
  updated_at        timestamptz not null default now(),
  constraint uq_weekly_review unique (user_id, week_start)
);

-- ─── GRATITUD ESPIRITUAL ──────────────────────────────────────────
create table if not exists gratitud_entries (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  fecha      date not null default current_date,
  item1      text,
  item2      text,
  item3      text,
  updated_at timestamptz not null default now(),
  constraint uq_gratitud unique (user_id, fecha)
);

-- ══════════════════════════════════════════════════════════════════
-- ÍNDICES
-- ══════════════════════════════════════════════════════════════════
create index if not exists idx_tracker_user_week     on tracker_entries(user_id, week_start);
create index if not exists idx_checklist_user_fecha  on checklist_daily(user_id, fecha);
create index if not exists idx_journal_user_fecha    on journal_entries(user_id, fecha);
create index if not exists idx_progress_user         on progress_scores(user_id);
create index if not exists idx_diagnostico_user      on diagnostico_responses(user_id);
create index if not exists idx_metas_user            on metas(user_id, activa);
create index if not exists idx_weekly_user_week      on weekly_reviews(user_id, week_start);
create index if not exists idx_gratitud_user_fecha   on gratitud_entries(user_id, fecha);

-- ══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════════
alter table users_profile         enable row level security;
alter table tracker_entries       enable row level security;
alter table checklist_daily       enable row level security;
alter table journal_entries       enable row level security;
alter table progress_scores       enable row level security;
alter table diagnostico_responses enable row level security;
alter table metas                 enable row level security;
alter table weekly_reviews        enable row level security;
alter table gratitud_entries      enable row level security;

-- users_profile
create policy "up_sel" on users_profile for select using (auth.uid() = user_id);
create policy "up_ins" on users_profile for insert with check (auth.uid() = user_id);
create policy "up_upd" on users_profile for update using (auth.uid() = user_id);

-- tracker_entries
create policy "tr_sel" on tracker_entries for select using (auth.uid() = user_id);
create policy "tr_ins" on tracker_entries for insert with check (auth.uid() = user_id);
create policy "tr_upd" on tracker_entries for update using (auth.uid() = user_id);
create policy "tr_del" on tracker_entries for delete using (auth.uid() = user_id);

-- checklist_daily
create policy "ch_sel" on checklist_daily for select using (auth.uid() = user_id);
create policy "ch_ins" on checklist_daily for insert with check (auth.uid() = user_id);
create policy "ch_upd" on checklist_daily for update using (auth.uid() = user_id);

-- journal_entries
create policy "jo_sel" on journal_entries for select using (auth.uid() = user_id);
create policy "jo_ins" on journal_entries for insert with check (auth.uid() = user_id);
create policy "jo_upd" on journal_entries for update using (auth.uid() = user_id);
create policy "jo_del" on journal_entries for delete using (auth.uid() = user_id);

-- progress_scores
create policy "pr_sel" on progress_scores for select using (auth.uid() = user_id);
create policy "pr_ins" on progress_scores for insert with check (auth.uid() = user_id);
create policy "pr_upd" on progress_scores for update using (auth.uid() = user_id);

-- diagnostico_responses
create policy "di_sel" on diagnostico_responses for select using (auth.uid() = user_id);
create policy "di_ins" on diagnostico_responses for insert with check (auth.uid() = user_id);
create policy "di_upd" on diagnostico_responses for update using (auth.uid() = user_id);

-- metas
create policy "me_sel" on metas for select using (auth.uid() = user_id);
create policy "me_ins" on metas for insert with check (auth.uid() = user_id);
create policy "me_upd" on metas for update using (auth.uid() = user_id);
create policy "me_del" on metas for delete using (auth.uid() = user_id);

-- weekly_reviews
create policy "wr_sel" on weekly_reviews for select using (auth.uid() = user_id);
create policy "wr_ins" on weekly_reviews for insert with check (auth.uid() = user_id);
create policy "wr_upd" on weekly_reviews for update using (auth.uid() = user_id);

-- gratitud_entries
create policy "gr_sel" on gratitud_entries for select using (auth.uid() = user_id);
create policy "gr_ins" on gratitud_entries for insert with check (auth.uid() = user_id);
create policy "gr_upd" on gratitud_entries for update using (auth.uid() = user_id);

-- ─── Trigger: auto-crear perfil al registrarse ────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users_profile (user_id, nombre)
  values (new.id, new.raw_user_meta_data->>'nombre')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
