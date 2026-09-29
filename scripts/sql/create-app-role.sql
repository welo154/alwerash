-- Least-privilege runtime role for the web app. NOT a migration: run it once by
-- hand in the Supabase SQL editor after replacing the password placeholder.
--
-- Why: the app currently connects as `postgres`, which owns every table and can
-- run DDL. A SQL injection or a leaked runtime DATABASE_URL would then allow
-- dropping tables. This role can read and write rows but cannot change schema.
--
-- Migrations keep using `postgres` through DIRECT_URL. Only the runtime
-- DATABASE_URL switches to this role, e.g. on the pooler:
--   postgresql://alwerash_app.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres
--
-- Because this role does not own the tables, row-level security applies to it
-- (enabled by migration 20260929130000). The policies below grant it every row;
-- access control stays in the application layer, as today.

CREATE ROLE alwerash_app WITH LOGIN PASSWORD 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;

GRANT USAGE ON SCHEMA public TO alwerash_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO alwerash_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO alwerash_app;

-- Tables created by future migrations (run as postgres) get the same grants.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO alwerash_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO alwerash_app;

-- Migration history is read by nothing at runtime.
REVOKE ALL ON TABLE public._prisma_migrations FROM alwerash_app;

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations' LOOP
    EXECUTE format(
      'CREATE POLICY alwerash_app_all ON public.%I TO alwerash_app USING (true) WITH CHECK (true)',
      r.tablename
    );
  END LOOP;
END $$;

-- A new table added later needs its own policy, or this role will see no rows:
--   CREATE POLICY alwerash_app_all ON public.<table> TO alwerash_app USING (true) WITH CHECK (true);
