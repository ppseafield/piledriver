/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
CREATE OR REPLACE FUNCTION reorder_subtask(pd_user_id UUID, move_subtask_id UUID, move_new_order INTEGER)
RETURNS TABLE(subtask_id UUID, updated_order INTEGER)
LANGUAGE plpgsql
AS
$$
DECLARE
    old_order INT;
    parent_task_id UUID;
    parent_st_id UUID;
BEGIN
    SELECT task_order, task_id, parent_subtask_id
    INTO old_order, parent_task_id, parent_st_id
    FROM task_subtasks
    WHERE id = move_subtask_id;


   RETURN QUERY WITH new_orders AS (
    SELECT id,
           title,
           (CASE
                WHEN id = move_subtask_id
                    THEN move_new_order
                WHEN old_order < move_new_order -- moved down
                    THEN task_order - 1
                ELSE task_order + 1 -- moved up
               END) AS new_order
    FROM task_subtasks st
    WHERE st.user_id = pd_user_id
      AND st.task_id = parent_task_id
      AND st.task_order BETWEEN SYMMETRIC old_order AND move_new_order
    )
    MERGE INTO task_subtasks AS tgt
    USING new_orders AS src
    ON tgt.id = src.id
    WHEN MATCHED THEN
        UPDATE SET task_order = src.new_order
    WHEN NOT MATCHED THEN DO NOTHING
    RETURNING tgt.id, tgt.task_order;
END;
$$;
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION reorder_subtask;`.execute(db)
}
