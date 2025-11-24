/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('tasks')
    .addColumn('split_from_id', 'uuid', (col) => col.references('tasks.id').onDelete('set null').defaultTo(null))
    .execute()

  await sql`
    CREATE OR REPLACE FUNCTION split_task(pd_user_id UUID, split_task_id UUID)
    RETURNS setof tasks
    LANGUAGE plpgsql
    AS
    $$
    DECLARE
	old_order INT;
	old_title TEXT;
	old_project_id UUID;
	new_task_id UUID = gen_random_uuid();
    BEGIN
	SELECT task_order, title, project_id 
	INTO old_order, old_title, old_project_id 
	FROM tasks
	WHERE id = split_task_id;

	    if old_project_id is not null
	    then
	    return query (select * from tasks where false);
	    else
		    update tasks
		    set completed_at = NOW(),
			    task_order = null
		    where id = split_task_id;

		    insert into tasks (id, user_id, routine_from, task_order, title, split_from_id)
								   --- todo: find a better way to handle this, probably counting splits - dedicated table?! overkill?
		    SELECT new_task_id, ot.user_id, ot.routine_from, old_order, CONCAT('* ', ot.title), split_task_id
		    from tasks ot
		    where ot.id = split_task_id;

		    update task_subtasks
		    set task_id = new_task_id
		    where task_id = split_task_id
		    and completed_at is null;

		    return query
			    (select * from tasks where ID in (split_task_id, new_task_id));
	    end if;
    END;
    $$;
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('tasks')
    .dropColumn('split_from_id')
    .execute()

  await sql`DROP FUNCTION split_task;`.execute(db)
}
