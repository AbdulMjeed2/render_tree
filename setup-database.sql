-- Drop existing tables if they exist
DROP TABLE IF EXISTS global_stats CASCADE;
DROP TABLE IF EXISTS trees CASCADE;
DROP TABLE IF EXISTS total_trees CASCADE;

-- Create the new simplified table
CREATE TABLE total_trees (
    id SERIAL PRIMARY KEY,
    count INTEGER DEFAULT 0
);

-- Insert initial record
INSERT INTO total_trees (id, count) VALUES (1, 0);

-- Verify the table was created
SELECT * FROM total_trees;
