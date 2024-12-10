CREATE TABLE IF NOT EXISTS piledriver.pd_users (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       username VARCHAR(64) NOT NULL UNIQUE,
       email TEXT NOT NULL,
       avatar_url TEXT NULL,
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- TODO: pd_users - Row level security that works...

CREATE OR REPLACE VIEW piledriver.vw_pd_users
AS
SELECT
	id,
	username,
	email,
	avatar_url,
	created_at,
	archived_at
FROM piledriver.pd_users
WHERE archived_at IS NULL;

GRANT ALL ON piledriver.pd_users TO piledriver_user;
GRANT ALL ON piledriver.vw_pd_users TO piledriver_user;
GRANT SELECT, INSERT ON piledriver.pd_users TO web_anon;
GRANT SELECT, INSERT ON piledriver.vw_pd_users TO web_anon;

-- TODO: pd_passwords - Row level security that works...

CREATE TABLE IF NOT EXISTS piledriver.pd_passwords (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       password_hash TEXT NOT NULL,
       user_id UUID NOT NULL REFERENCES piledriver.pd_users(id)
);
GRANT ALL ON piledriver.pd_passwords TO piledriver_user;
GRANT SELECT, INSERT ON piledriver.pd_passwords TO web_anon;

-- TODO: pd_sessions - Row level security that works...

CREATE TABLE IF NOT EXISTS piledriver.pd_sessions (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       user_id UUID NOT NULL REFERENCES piledriver.pd_users(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + '1 week'::interval,
       logged_out_at TIMESTAMP WITH TIME ZONE NULL
);
GRANT ALL ON piledriver.pd_sessions TO piledriver_user;
GRANT SELECT, INSERT ON piledriver.pd_sessions TO web_anon;

