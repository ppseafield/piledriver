CREATE TABLE piledriver.lookup_categories (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       title TEXT NOT NULL,
       description TEXT NULL
);

INSERT INTO piledriver.lookup_categories (id, title)
VALUES
('0193a8da-f7d8-0c6d-475e-db6010898cbc', 'Track Sheet Unit Types');


CREATE TABLE piledriver.lookup_items (
       id UUID NOT NULL PRIMARY KEY DEFAULT generate_ulid(),
       lookup_category_id UUID NOT NULL REFERENCES piledriver.lookup_categories(id),
       title TEXT NOT NULL,
       description TEXT NULL
);


INSERT INTO piledriver.lookup_items (lookup_category_id, id, title)
VALUES
('0193a8da-f7d8-0c6d-475e-db6010898cbc', '0193a8e1-6310-09e8-a639-aa456059096c', 'integer'),
('0193a8da-f7d8-0c6d-475e-db6010898cbc', '0193a8e1-6310-e2ae-5bde-a5fbf3013d3f', 'short text'),
('0193a8da-f7d8-0c6d-475e-db6010898cbc', '0193a8e1-6310-e2a7-42e5-3c1a17cbbc83', 'long text'),
('0193a8da-f7d8-0c6d-475e-db6010898cbc', '0193a8e1-6310-7105-873e-9c819893e83a', 'choice'),
('0193a8da-f7d8-0c6d-475e-db6010898cbc', '0193a8e6-9157-1ae6-5316-ccdb2604c0ec', 'boolean'),
('0193a8da-f7d8-0c6d-475e-db6010898cbc', '0193a8e6-9157-46dc-9876-f0636e627f68', 'decimal'),
('0193a8da-f7d8-0c6d-475e-db6010898cbc', '0193a8e6-9157-b82a-6833-b4d2aa06cc54', 'checkbox');

