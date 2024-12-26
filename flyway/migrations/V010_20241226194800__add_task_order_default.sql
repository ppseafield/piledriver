create or replace function piledriver.next_task_order()
    returns integer
    language sql
as
$$
    SELECT
        COALESCE(MAX(task_order), 0) + 1
    FROM tasks
    WHERE created_by = (select current_user_id());
$$;
grant execute on function piledriver.next_task_order() to piledriver_user;
alter table tasks alter column task_order set default piledriver.next_task_order();
