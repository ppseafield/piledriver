CREATE TABLE tasks (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       created_by UUID NOT NULL REFERENCES pd_users(id),
       journaled_by UUID NULL REFERENCES journals(id),
       routine_from UUID NULL REFERENCES routines(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       completed_at TIMESTAMP WITH TIME ZONE NULL,
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       task_order INT NULL,
       title TEXT NOT NULL
);

CREATE VIEW piledriver.tasks AS
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
FROM tasks
WHERE
	archived_at IS NULL;

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_tasks ON tasks
USING (created_by = (select current_user_id()));

GRANT ALL ON tasks TO piledriver_user;
GRANT ALL ON piledriver.tasks TO piledriver_user;


CREATE TABLE subtasks (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       task_id UUID NOT NULL REFERENCES tasks(id),
       parent_subtask_id UUID NULL REFERENCES subtasks(id),
       task_sheet_item_id UUID NULL REFERENCES task_sheet_items(id),
       created_by UUID NOT NULL REFERENCES pd_users(id),
       routine_from UUID NULL REFERENCES routines(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       completed_at TIMESTAMP WITH TIME ZONE NULL,
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       task_order INT NOT NULL,
       title TEXT NOT NULL
);

CREATE VIEW piledriver.subtasks
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
FROM subtasks
WHERE
	archived_at IS NULL;

ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_subtasks ON subtasks
USING (created_by = (select current_user_id()));

GRANT ALL ON subtasks TO piledriver_user;
GRANT ALL ON piledriver.subtasks TO piledriver_user;
