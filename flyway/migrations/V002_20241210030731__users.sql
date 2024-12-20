-- TODO: revisit RLS

CREATE TABLE IF NOT EXISTS pd_users (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       username VARCHAR(64) NOT NULL UNIQUE,
       email TEXT NOT NULL,
       avatar_url TEXT NULL,
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL
);

GRANT ALL ON pd_users TO piledriver_user;
GRANT SELECT, INSERT ON pd_users TO web_anon;

CREATE TABLE IF NOT EXISTS pd_passwords (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       password_hash TEXT NOT NULL,
       user_id UUID NOT NULL REFERENCES pd_users(id)
);
GRANT ALL ON pd_passwords TO piledriver_user;
GRANT SELECT, INSERT ON pd_passwords TO web_anon;

CREATE TABLE IF NOT EXISTS pd_sessions (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       user_id UUID NOT NULL REFERENCES pd_users(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + '1 week'::interval,
       logged_out_at TIMESTAMP WITH TIME ZONE NULL
);
GRANT ALL ON pd_sessions TO piledriver_user;
GRANT SELECT, INSERT ON pd_sessions TO web_anon;

