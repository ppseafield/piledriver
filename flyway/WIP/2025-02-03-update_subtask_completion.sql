create function piledriver.update_subtask_completion(st_id UUID, done BOOLEAN)
    returns setof piledriver.subtasks
    language plpgsql
as $$
DECLARE
    new_completed_at TIMESTAMP WITH TIME ZONE = CASE
        WHEN done THEN now()
        ELSE NULL
    END;
BEGIN
    update piledriver.subtasks
    set completed_at = new_completed_at
    where id = st_id;

    return query with recursive subtask_children as (
        select id, parent_subtask_id
        from piledriver.subtasks
        where id = st_id
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
    select id, completed_at from updated_subtasks;
END
$$;