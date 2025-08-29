/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
ALTER TABLE task_subtasks ALTER COLUMN task_order DROP NOT NULL;

CREATE OR REPLACE FUNCTION archive_subtask(pd_user_id UUID, archive_subtask_id UUID)
RETURNS TABLE(subtask_id UUID, updated_order INTEGER, updated_archived_at TIMESTAMPTZ)
LANGUAGE plpgsql
AS
$$
DECLARE
    old_order INT;
    parent_task_id UUID;
BEGIN
SELECT task_order, task_id INTO old_order, parent_task_id
    FROM task_subtasks
    WHERE id = archive_subtask_id;

    RETURN QUERY 
    WITH new_orders AS (
    SELECT id,
           title,
           (task_order - 1) as new_order
    FROM task_subtasks st
    WHERE st.user_id = pd_user_id
      AND st.task_id = parent_task_id
      AND st.task_order > old_order
    ),

	updated_subtasks AS (
    MERGE INTO task_subtasks AS tgt
    USING new_orders AS src
    ON tgt.id = src.id
    WHEN MATCHED THEN
        UPDATE SET task_order = src.new_order
    WHEN NOT MATCHED THEN DO NOTHING
    RETURNING tgt.id, tgt.task_order, tgt.archived_at
	),

	newly_archived_subtask AS (
	UPDATE task_subtasks
    SET archived_at = NOW(),
		task_order = NULL
    WHERE
        id = archive_subtask_id
	AND user_id = pd_user_id
    RETURNING id, task_order, archived_at
    )

	SELECT id, task_order, archived_at FROM updated_subtasks
	UNION
	SELECT id, task_order, archived_at FROM newly_archived_subtask;
END;
$$;
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION archive_subtask;`.execute(db)
}
