import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
create or replace function reorder_routine_subtask(pd_user_id UUID, move_routine_subtask_id UUID, move_new_order INTEGER)
returns table(routine_subtask_id UUID, updated_order INTEGER)
language plpgsql
as
$$
DECLARE
	old_order INT;
	rs_routine_id UUID;
BEGIN
	SELECT task_order, routine_id INTO old_order, rs_routine_id
    FROM routine_subtasks
	WHERE id = move_routine_subtask_id;

	RETURN QUERY WITH new_orders AS (
	SELECT id,
		   (CASE
			   WHEN id = move_routine_subtask_id
				THEN move_new_order
			   WHEN old_order < move_new_order -- moved down
				THEN task_order - 1
			   ELSE task_order + 1  -- moved up
			END) AS new_order
	FROM routine_subtasks
	WHERE routine_subtasks.user_id = pd_user_id
        AND routine_id = rs_routine_id
	AND task_order BETWEEN SYMMETRIC old_order AND move_new_order
    )
	MERGE INTO routine_subtasks AS tgt
	USING new_orders AS src
	ON tgt.id = src.id
	WHEN MATCHED THEN
		UPDATE SET task_order = src.new_order
	RETURNING tgt.id, tgt.task_order;
END;
$$;
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION reorder_routine_subtask;`.execute(db)
}
