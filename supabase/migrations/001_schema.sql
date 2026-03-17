-- supabase/migrations/001_schema.sql

CREATE TABLE profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name    text,
  role         text,
  linkedin_url text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE assessments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users(id),
  session_token  text NOT NULL UNIQUE,
  status         text DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  started_at     timestamptz DEFAULT now(),
  completed_at   timestamptz
);

CREATE TABLE questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text NOT NULL UNIQUE,
  text           text NOT NULL,
  type           text NOT NULL CHECK (type IN (
                   'likert','forced_choice','situational',
                   'frequency','rank_order','allocation','visual','timed'
                 )),
  dimension      text NOT NULL,
  tier           integer NOT NULL CHECK (tier BETWEEN 1 AND 6),
  options        jsonb NOT NULL,
  weight         float DEFAULT 1.0,
  reverse_scored boolean DEFAULT false,
  calibration    boolean DEFAULT false,
  order_index    integer,
  is_active      boolean DEFAULT true
);
CREATE INDEX questions_dimension_idx ON questions(dimension);
CREATE INDEX questions_calibration_idx ON questions(calibration);

CREATE TABLE question_construct_pairs (
  question_a text REFERENCES questions(code),
  question_b text REFERENCES questions(code),
  PRIMARY KEY (question_a, question_b)
);

CREATE TABLE responses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id    uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_code    text REFERENCES questions(code),
  value            jsonb NOT NULL,
  response_time_ms integer,
  revised          boolean DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  UNIQUE(assessment_id, question_code)
);

CREATE TABLE results (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id  uuid REFERENCES assessments(id) UNIQUE,
  scores         jsonb NOT NULL,
  hpif_profile   jsonb NOT NULL,
  archetype      text NOT NULL,
  match_score    integer NOT NULL,
  inference_data jsonb,
  created_at     timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own" ON assessments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role all" ON assessments
  USING (auth.role() = 'service_role');

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own responses" ON responses
  FOR SELECT USING (
    assessment_id IN (SELECT id FROM assessments WHERE user_id = auth.uid())
  );
CREATE POLICY "service role all" ON responses
  USING (auth.role() = 'service_role');

ALTER TABLE results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own results" ON results
  FOR SELECT USING (
    assessment_id IN (SELECT id FROM assessments WHERE user_id = auth.uid())
  );
CREATE POLICY "service role all" ON results
  USING (auth.role() = 'service_role');

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON questions FOR SELECT USING (true);

ALTER TABLE question_construct_pairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role all" ON question_construct_pairs
  USING (auth.role() = 'service_role');

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users insert own" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own" ON profiles FOR UPDATE USING (auth.uid() = user_id);
