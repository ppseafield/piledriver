create function piledriver.update_subtask_completion(subtask_id UUID, completed BOOLEAN)
    returns TABLE (st_id UUID, new_completed TIMESTAMP WITH TIME ZONE)
    language plpgsql
as $$
DECLARE
    new_completed_at TIMESTAMP WITH TIME ZONE = CASE
        WHEN completed THEN now()
        ELSE NULL
    END;
BEGIN
    return query with recursive subtask_children as (
        select id, parent_subtask_id
        from piledriver.subtasks
        where id = subtask_id
        union all
        select s.id, s.parent_subtask_id
        from piledriver.subtasks s
        inner join subtask_children sc on sc.id = s.parent_subtask_id
    ), updated_subtasks as (
        update piledriver.subtasks
            set completed_at = new_completed_at
            where id in (select id from subtask_children)
            returning id, completed_at
    )
    select us.id AS st_id, us.completed_at as new_completed_at from updated_subtasks us;
END
$$;
grant execute on function piledriver.update_subtask_completion(UUID, BOOLEAN) to piledriver_user;