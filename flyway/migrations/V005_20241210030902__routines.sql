CREATE TABLE routines (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       created_by UUID NOT NULL REFERENCES pd_users(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       title TEXT NOT NULL,
       description TEXT NULL
);

CREATE VIEW piledriver.routines AS
SELECT
	id,
	created_by,
	created_at,
	archived_at,
	title,
	description
FROM routines
WHERE
	archived_at IS NULL;

ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_routines ON routines
USING (created_by = (select current_user_id()));

GRANT ALL ON routines TO piledriver_user;
GRANT ALL ON piledriver.routines TO piledriver_user;


CREATE TABLE routine_subtasks (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       routine_id UUID NULL REFERENCES routines(id),
       parent_subtask_id UUID NULL REFERENCES routine_subtasks(id),
       created_by UUID NOT NULL REFERENCES pd_users(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       task_order INT NOT NULL,
       title TEXT NOT NULL
);

CREATE VIEW piledriver.routine_subtasks AS
SELECT
	id,
	routine_id,
	parent_subtask_id,
	created_by,
	created_at,
	archived_at,
	task_order,
	title
FROM routine_subtasks
WHERE
	archived_at IS NULL;

ALTER TABLE routine_subtasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_routine_subtasks ON routine_subtasks
USING (created_by = (select current_user_id()));

GRANT ALL ON routine_subtasks TO piledriver_user;
GRANT ALL ON piledriver.routine_subtasks TO piledriver_user;

