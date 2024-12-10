CREATE OR REPLACE FUNCTION piledriver.create_session(username_text text, password_text text)
RETURNS TABLE(user_id uuid, username varchar(64), email text, session_id uuid, expires_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
DECLARE founduser piledriver.pd_users%ROWTYPE;
BEGIN
    SELECT u.*
    INTO founduser
   FROM piledriver.pd_users u
   INNER JOIN piledriver.pd_passwords p
   ON u.id = p.user_id
   WHERE username_text = u.username
   AND p.password_hash = public.crypt(password_text, p.password_hash);

  IF NOT FOUND THEN
      RAISE SQLSTATE 'PT401' USING
          message = 'Username and password combination not found';
  else
      return QUERY
      WITH newsession AS (
          INSERT INTO piledriver.pd_sessions (user_id) VALUES (founduser.id) RETURNING *
      )
      SELECT founduser.id, founduser.username, founduser.email, newsession.id, newsession.expires_at
      FROM newsession;
  END IF;
end;
$$;
GRANT ALL ON FUNCTION piledriver.create_session TO web_anon;

CREATE OR REPLACE FUNCTION piledriver.restore_session()
RETURNS TABLE(user_id uuid, username varchar(64), email text, session_id uuid, expires_at timestamp with time zone)
    LANGUAGE sql IMMUTABLE
    AS $$
    SELECT
        u.id AS user_id,
        u.username,
        u.email,
        s.id AS session_id,
        s.expires_at
    FROM piledriver.pd_sessions s
    INNER JOIN piledriver.pd_users u ON
        s.user_id = u.id
    WHERE s.id = CAST(current_setting('request.jwt.claims', true)::json->>'session_id' AS uuid);
$$;
GRANT ALL ON function piledriver.restore_session TO piledriver_user;

CREATE OR REPLACE FUNCTION piledriver.current_user_id()
RETURNS uuid
LANGUAGE sql IMMUTABLE
AS $$
    SELECT CAST(current_setting('request.jwt.claims', true)::json->>'user_id' AS uuid);
$$;
GRANT ALL ON function piledriver.current_user_id TO piledriver_user;


CREATE OR REPLACE FUNCTION piledriver.logout_session() RETURNS void AS $$
DECLARE
  session_id UUID := current_setting('request.jwt.claims', true)::json->>'session_id';

BEGIN
    UPDATE piledriver.pd_sessions
    SET logged_out_at = NOW()
    WHERE id = session_id;
END
$$ language plpgsql;
GRANT ALL ON function piledriver.logout_session TO piledriver_user;


-- TODO: make this work???
CREATE OR REPLACE FUNCTION piledriver.check_session_expiration() RETURNS void AS $$
DECLARE
  session_id UUID := current_setting('request.jwt.claims', true)::json->>'session_id';

BEGIN
  IF session_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM piledriver.pd_sessions
      WHERE id = session_id
      AND (expires_at < NOW() OR logged_out_at IS NOT NULL)
    ) THEN
      RAISE SQLSTATE 'PT401' USING
          message = 'Session not valid: please log in again.';
    END IF;
  END IF;
END
$$ language plpgsql;
GRANT ALL ON function piledriver.check_session_expiration TO piledriver_user;
