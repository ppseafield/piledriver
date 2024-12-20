CREATE TABLE IF NOT EXISTS journals (
    id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
    created_by UUID NOT NULL REFERENCES pd_users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL,
    archived_at TIMESTAMP WITH TIME ZONE NULL,
    title TEXT NOT NULL,
    text_body TEXT NOT NULL,
    json_body JSONB NOT NULL
);

CREATE VIEW piledriver.journals AS
    SELECT
        id,
        created_by,
        created_at,
	    updated_at,
        archived_at,
        title,
        text_body,
	    json_body
    FROM journals
    WHERE archived_at IS NULL;

ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_journals ON journals
USING (created_by = (select current_user_id()));

GRANT ALL ON journals TO piledriver_user;
GRANT ALL ON piledriver.journals TO piledriver_user;
