create function piledriver.update_subtask_completion(subtask_id UUID, completed BOOLEAN)
    returns TABLE (st_id UUID, new_completed TIMESTAMP WITH TIME ZONE)
    language plpgsql
as $$
BEGIN
    if completed then
        -- If a subtask that is a parent is completed, all of its children
        -- should be completed.
        -- TODO: The completion of a subtask may also complete the task itself.
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
                set completed_at = now()
                where id in (select id from subtask_children)
                returning id, completed_at
        )
        select us.id AS st_id, us.completed_at as new_completed_at from updated_subtasks us;
    else
        -- If a subtask with parents is uncompleted, all of its parents
        -- should be uncompleted. None of its children should be completed
        -- because we don't know if they should be. The user must select
        -- them manually. Uncompletion is usually the result of one thing
        -- still not being done, and we can't know which thing.
        return query with recursive subtask_parents as (
            select s.id, s.parent_subtask_id
            from piledriver.subtasks s
            where s.id = subtask_id
            union all
            select s.id, s.parent_subtask_id
            from piledriver.subtasks s
            inner join subtask_parents sp on
                s.id = sp.parent_subtask_id
        ), updated_subtasks as (
            update piledriver.subtasks
                set completed_at = null
                where id in (select id from subtask_parents)
                returning id, completed_at
        )
        select us.id AS st_id, us.completed_at as new_completed_at from updated_subtasks us;
    end if;
END
$$;
grant execute on function piledriver.update_subtask_completion(UUID, BOOLEAN) to piledriver_user;