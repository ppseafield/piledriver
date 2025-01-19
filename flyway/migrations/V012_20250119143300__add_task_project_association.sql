ALTER TABLE tasks ADD COLUMN project_id UUID NULL REFERENCES projects(id);
ALTER TABLE tasks ADD COLUMN project_assigned BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE VIEW piledriver.tasks
(id, created_by, created_at, completed_at, archived_at, task_order, journaled_by, routine_from, title, project_id, project_assigned) AS
SELECT id,
       created_by,
       created_at,
       completed_at,
       archived_at,
       task_order,
       journaled_by,
       routine_from,
       title,
       project_id,
       tasks.project_assigned
FROM tasks
WHERE archived_at IS NULL
AND created_by = (select current_user_id());

alter table piledriver.tasks
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on piledriver.tasks to piledriver_user;

