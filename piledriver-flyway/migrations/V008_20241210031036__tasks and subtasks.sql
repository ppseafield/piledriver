CREATE TABLE piledriver.tasks (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       created_by UUID NOT NULL REFERENCES piledriver.pd_users(id),
       journaled_by UUID NULL REFERENCES piledriver.journals(id),
       routine_from UUID NULL REFERENCES piledriver.routines(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       completed_at TIMESTAMP WITH TIME ZONE NULL,
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       task_order INT NULL,
       title TEXT NOT NULL
);

CREATE VIEW piledriver.vw_tasks AS
SELECT
	id,
	created_by,
	created_at,
	completed_at,
	archived_at,
	task_order,
	journaled_by,
	routine_from,
	title
FROM piledriver.tasks
WHERE
	archived_at IS NULL;

ALTER TABLE piledriver.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_tasks ON piledriver.tasks
USING (created_by = (select piledriver.current_user_id()));

GRANT ALL ON piledriver.tasks TO piledriver_user;
GRANT ALL ON piledriver.vw_tasks TO piledriver_user;


CREATE TABLE piledriver.subtasks (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       task_id UUID NOT NULL REFERENCES piledriver.tasks(id),
       parent_subtask_id UUID NULL REFERENCES piledriver.subtasks(id),
       task_sheet_item_id UUID NULL REFERENCES piledriver.task_sheet_items(id),
       created_by UUID NOT NULL REFERENCES piledriver.pd_users(id),
       routine_from UUID NULL REFERENCES piledriver.routines(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       completed_at TIMESTAMP WITH TIME ZONE NULL,
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       task_order INT NOT NULL,
       title TEXT NOT NULL
);

CREATE VIEW piledriver.vw_subtasks
AS
SELECT
	id,
	task_id,
	parent_subtask_id,
	created_by,
	routine_from,
	created_at,
	completed_at,
	archived_at,
	task_order,
	title
FROM piledriver.subtasks
WHERE
	archived_at IS NULL;

ALTER TABLE piledriver.subtasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_subtasks ON piledriver.subtasks
USING (created_by = (select piledriver.current_user_id()));

GRANT ALL ON piledriver.subtasks TO piledriver_user;
GRANT ALL ON piledriver.vw_subtasks TO piledriver_user;
