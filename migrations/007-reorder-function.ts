/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
CREATE OR REPLACE FUNCTION reorder_task(pd_user_id UUID, move_task_id UUID, move_new_order INTEGER)
RETURNS TABLE(task_id UUID, updated_order INTEGER)
LANGUAGE plpgsql
AS
$$
DECLARE
    old_order INT;
BEGIN
    SELECT task_order INTO old_order
    FROM tasks
    WHERE id = move_task_id;


   RETURN QUERY WITH new_orders AS (
    SELECT id,
           title,
           (CASE
                WHEN id = move_task_id
                    THEN move_new_order
                WHEN old_order < move_new_order -- moved down
                    THEN task_order - 1
                ELSE task_order + 1 -- moved up
               END) AS new_order
    FROM tasks
    WHERE tasks.user_id = pd_user_id
      AND task_order BETWEEN SYMMETRIC old_order AND move_new_order
    )
    MERGE INTO tasks AS tgt
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
  await sql`DROP FUNCTION reorder_task;`.execute(db)
}
