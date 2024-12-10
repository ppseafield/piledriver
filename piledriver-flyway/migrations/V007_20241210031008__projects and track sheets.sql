CREATE TABLE piledriver.projects (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       created_by UUID NOT NULL REFERENCES piledriver.pd_users(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       title TEXT NOT NULL,
       description TEXT NULL,
       color TEXT NULL,
       icon_name TEXT NULL
);

CREATE VIEW piledriver.vw_projects AS
SELECT
	id,
	created_by,
	created_at,
	archived_at,
	title,
	description,
	color,
	icon_name
FROM piledriver.projects
WHERE
	archived_at IS NULL;

ALTER TABLE piledriver.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_projects ON piledriver.projects
USING (created_by = (select piledriver.current_user_id()));

GRANT ALL ON piledriver.projects TO piledriver_user;
GRANT ALL ON piledriver.vw_projects TO piledriver_user;


CREATE TABLE piledriver.task_sheets (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       project_id UUID NOT NULL REFERENCES piledriver.projects(id),
       created_by UUID NOT NULL REFERENCES piledriver.pd_users(id),
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       title TEXT NOT NULL,
       description TEXT NULL
);

CREATE VIEW piledriver.vw_task_sheets AS
SELECT
	id,
	project_id,
	created_by,
	created_at,
	archived_at,
	title,
	description
FROM piledriver.task_sheets
WHERE
	archived_at IS NULL;

ALTER TABLE piledriver.task_sheets ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_task_sheets ON piledriver.task_sheets
USING (created_by = (select piledriver.current_user_id()));

GRANT ALL ON piledriver.task_sheets TO piledriver_user;
GRANT ALL ON piledriver.vw_task_sheets TO piledriver_user;


CREATE TABLE piledriver.task_sheet_items (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       task_sheet_id UUID NOT NULL REFERENCES piledriver.projects(id),
       created_by UUID NOT NULL REFERENCES piledriver.pd_users(id),
       unit_type_lookup_item_id UUID NOT NULL REFERENCES piledriver.lookup_items(id), -- Track Sheet Unit Type
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       archived_at TIMESTAMP WITH TIME ZONE NULL,
       required BOOLEAN NOT NULL DEFAULT true,
       title TEXT NOT NULL,
       unit_description TEXT NOT NULL,
       item_options JSONB NULL -- Choice options, decimal places, validation, etc.
);

CREATE VIEW piledriver.vw_task_sheet_items AS
SELECT
	id,
	task_sheet_id,
	created_by,
	unit_type_lookup_item_id,
	created_at,
	archived_at,
	required,
	title,
	unit_description,
	item_options
FROM piledriver.task_sheet_items
WHERE
	archived_at IS NULL;

ALTER TABLE piledriver.task_sheet_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_task_sheet_items ON piledriver.task_sheet_items
USING (created_by = (select piledriver.current_user_id()));

GRANT ALL ON piledriver.task_sheet_items TO piledriver_user;
GRANT ALL ON piledriver.vw_task_sheet_items TO piledriver_user;
