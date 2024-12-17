create or replace function piledriver.create_session(username_text text, password_text text)
    returns TABLE(user_id uuid, username character varying, email text, session_id uuid, expires_at timestamp with time zone)
    language plpgsql
as
$$
DECLARE founduser piledriver.pd_users%ROWTYPE;
BEGIN
    SELECT u.*
    INTO founduser
   FROM piledriver.pd_users u
   INNER JOIN piledriver.pd_passwords p
   ON u.id = p.user_id
   WHERE username_text = u.username
   AND p.password_hash = piledriver.crypt(password_text, p.password_hash);

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

alter function piledriver.create_session(text, text) owner to postgres;

grant execute on function piledriver.create_session(text, text) to web_anon;