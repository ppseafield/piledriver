create or replace function piledriver.move_task_and_rebalance(move_task_id uuid, move_new_order integer)
    returns TABLE(task_id uuid, updated_order integer)
    language plpgsql
as
$$
DECLARE
    old_order INT;
    user_id UUID = (select current_user_id());
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
    WHERE created_by = user_id
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

alter function piledriver.move_task_and_rebalance(uuid, integer) owner to postgres;
grant execute on function piledriver.move_task_and_rebalance(uuid, integer) to piledriver_user;
