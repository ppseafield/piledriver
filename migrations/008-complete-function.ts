/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
CREATE OR REPLACE FUNCTION complete_task(pd_user_id UUID, completed_task_id UUID)
RETURNS TABLE(task_id UUID, updated_order INTEGER, updated_completed_at TIMESTAMPTZ)
LANGUAGE plpgsql
AS
$$
DECLARE
    old_order INT;
BEGIN
    SELECT task_order INTO old_order
    FROM tasks
    WHERE id = completed_task_id;

   RETURN QUERY 
    WITH new_orders AS (
    SELECT id,
           title,
           (task_order - 1) as new_order
    FROM tasks
    WHERE tasks.user_id = pd_user_id
      AND task_order > old_order
    ),

	updated_tasks AS (
    MERGE INTO tasks AS tgt
    USING new_orders AS src
    ON tgt.id = src.id
    WHEN MATCHED THEN
        UPDATE SET task_order = src.new_order
    WHEN NOT MATCHED THEN DO NOTHING
    RETURNING tgt.id, tgt.task_order, tgt.completed_at
	),

	newly_completed_task AS (
	UPDATE tasks
    SET completed_at = NOW(),
		task_order = NULL
    WHERE
        id = completed_task_id
	AND user_id = pd_user_id
    RETURNING id, task_order, completed_at
    )

	SELECT id, task_order, completed_at FROM updated_tasks
	UNION
	SELECT id, task_order, completed_at FROM newly_completed_task;
END;
$$;
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION complete_task;`.execute(db)
}
