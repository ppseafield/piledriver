import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
create or replace function archive_routine_subtask(pd_user_id UUID, archive_routine_subtask_id UUID)
returns table(routine_subtask_id UUID, updated_order INTEGER, updated_archived_at TIMESTAMPTZ)
language plpgsql
as
$$
DECLARE
	old_order INT;
	rs_routine_id UUID;
BEGIN
	SELECT task_order, routine_id INTO old_order, rs_routine_id
    FROM routine_subtasks
	WHERE id = archive_routine_subtask_id;

	RETURN QUERY WITH new_orders AS (
	SELECT id,
		   (task_order - 1) AS new_order
	FROM routine_subtasks
	WHERE routine_subtasks.user_id = pd_user_id
    AND routine_id = rs_routine_id
	AND task_order > old_order
    ),
	updated_rs AS(
	MERGE INTO routine_subtasks AS tgt
	USING new_orders AS src
	ON tgt.id = src.id
	WHEN MATCHED THEN
		UPDATE SET task_order = src.new_order
	RETURNING tgt.id, tgt.task_order, tgt.archived_at
    ),
	newly_archived_rs AS (
		UPDATE routine_subtasks
		SET archived_at = NOW(),
			task_order = NULL
		WHERE id = archive_routine_subtask_id
		AND user_id = pd_user_id
		RETURNING id, task_order, archived_at
    )
	SELECT id, task_order, archived_at FROM updated_rs
	UNION
	SELECT id, task_order, archived_at FROM newly_archived_rs;
END;
$$;
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION archive_routine_subtask;`.execute(db)
}
