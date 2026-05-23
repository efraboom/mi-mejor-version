CREATE TABLE IF NOT EXISTS meta_progreso (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meta_id           uuid        NOT NULL,
  semana            int         NOT NULL,
  habito_index      int         NOT NULL,
  fecha_completado  date        NOT NULL DEFAULT CURRENT_DATE,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE(meta_id, semana, habito_index)
);

ALTER TABLE meta_progreso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own meta_progreso" ON meta_progreso
  FOR ALL USING (auth.uid() = user_id);
