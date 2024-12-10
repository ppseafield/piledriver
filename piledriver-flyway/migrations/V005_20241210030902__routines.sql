CREATE TABLE piledriver.routines (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       created_by UUID NOT NULL REFERENCES piledriver.pd_users(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       title TEXT NOT NULL,
       description TEXT NULL
);

CREATE VIEW piledriver.vw_routines AS
SELECT
	id,
	created_by,
	created_at,
	archived_at,
	title,
	description
FROM piledriver.routines
WHERE
	archived_at IS NULL;

ALTER TABLE piledriver.routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_routines ON piledriver.routines
USING (created_by = (select piledriver.current_user_id()));

GRANT ALL ON piledriver.routines TO piledriver_user;
GRANT ALL ON piledriver.vw_routines TO piledriver_user;


CREATE TABLE piledriver.routine_subtasks (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       routine_id UUID NULL REFERENCES piledriver.routines(id),
       parent_subtask_id UUID NULL REFERENCES piledriver.routine_subtasks(id),
       created_by UUID NOT NULL REFERENCES piledriver.pd_users(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       task_order INT NOT NULL,
       title TEXT NOT NULL
);

CREATE VIEW piledriver.vw_routine_subtasks AS
SELECT
	id,
	routine_id,
	parent_subtask_id,
	created_by,
	created_at,
	archived_at,
	task_order,
	title
FROM piledriver.routine_subtasks
WHERE
	archived_at IS NULL;

ALTER TABLE piledriver.routine_subtasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_routine_subtasks ON piledriver.routine_subtasks
USING (created_by = (select piledriver.current_user_id()));

GRANT ALL ON piledriver.routine_subtasks TO piledriver_user;
GRANT ALL ON piledriver.vw_routine_subtasks TO piledriver_user;

