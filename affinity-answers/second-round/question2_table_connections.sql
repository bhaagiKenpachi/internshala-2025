-- =====================================================
-- QUESTION 2: Table Connection Columns
-- =====================================================
-- (2) Find all the columns that can be used to connect the tables in the given database.

-- Optimized query to show connection columns with summary
SELECT 
    REFERENCED_TABLE_NAME AS primary_table,
    REFERENCED_COLUMN_NAME AS primary_key,
    COUNT(*) AS connection_count,
    GROUP_CONCAT(DISTINCT TABLE_NAME ORDER BY TABLE_NAME SEPARATOR ', ') AS connected_tables
FROM information_schema.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = 'Rfam'
  AND REFERENCED_TABLE_NAME IS NOT NULL
GROUP BY REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
ORDER BY connection_count DESC, REFERENCED_TABLE_NAME;
