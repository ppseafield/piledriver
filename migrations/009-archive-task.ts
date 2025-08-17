/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
CREATE OR REPLACE FUNCTION archive_task(pd_user_id UUID, archive_task_id UUID)
RETURNS TABLE(task_id UUID, updated_order INTEGER, updated_archived_at TIMESTAMPTZ)
LANGUAGE plpgsql
AS
$$
DECLARE
    old_order INT;
    is_completed BOOLEAN;
BEGIN
SELECT task_order, (completed_at is not null) INTO old_order, is_completed
    FROM tasks
    WHERE id = archive_task_id;

	IF is_completed THEN
		RETURN QUERY
  			UPDATE tasks
			SET archived_at = now()
            WHERE id = archive_task_id
            RETURNING id AS task_id, task_order AS updated_order, archived_at AS updated_archived_at;
    ELSE 
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
	    RETURNING tgt.id, tgt.task_order, tgt.archived_at
		),
	
		newly_archived_task AS (
		UPDATE tasks
	    SET archived_at = NOW(),
			task_order = NULL
	    WHERE
	        id = archive_task_id
		AND user_id = pd_user_id
	    RETURNING id, task_order, archived_at
	    )
	
		SELECT id, task_order, archived_at FROM updated_tasks
		UNION
		SELECT id, task_order, archived_at FROM newly_archived_task;
	END IF;
END;
$$;
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION archive_task;`.execute(db)
}
