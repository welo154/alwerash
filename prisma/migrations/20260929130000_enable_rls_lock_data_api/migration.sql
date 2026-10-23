-- Close the Supabase Data API (PostgREST) path into application tables.
--
-- The app talks to Postgres only through Prisma, connected as the table owner.
-- Table owners bypass row-level security unless it is FORCEd, so enabling RLS
-- with no policies changes nothing for the app while denying every row to the
-- `anon` and `authenticated` roles that the Data API uses.
--
-- Tables created by later migrations need the same statement; the loop below
-- only covers tables that exist when this runs.

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;

-- The Data API roles exist only on Supabase; skip cleanly elsewhere (for example
-- the shadow database used by `prisma migrate dev`).
DO $$
DECLARE
  role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', role_name);
      EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', role_name);
      EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', role_name);
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM %I', role_name
      );
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', role_name
      );
    END IF;
  END LOOP;
END $$;
