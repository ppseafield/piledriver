DROP VIEW piledriver.subtasks;
CREATE OR REPLACE VIEW piledriver.subtasks
AS
SELECT
	id,
	task_id,
	parent_subtask_id,
 	task_sheet_item_id,
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

GRANT ALL ON piledriver.subtasks TO piledriver_user;
