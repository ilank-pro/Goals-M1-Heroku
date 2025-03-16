-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Delete all records in the correct order
DELETE FROM goals;
DELETE FROM documents;
DELETE FROM persons;

-- Re-enable foreign key checks
SET session_replication_role = 'origin'; 