-- =====================================================
-- QUESTION 1: Tiger Analysis
-- =====================================================
-- (1) How many types of tigers can be found in the taxonomy table of the dataset? 
--     What is the "ncbi_id" of the Sumatran Tiger? (hint: use the biological name of the tiger)

-- Optimized single query to answer both parts of the question
SELECT 
    COUNT(DISTINCT species) AS tiger_types_count,
    (SELECT ncbi_id FROM taxonomy WHERE species LIKE '%Panthera tigris sumatrae%' LIMIT 1) AS sumatran_tiger_ncbi_id,
    (SELECT species FROM taxonomy WHERE species LIKE '%Panthera tigris sumatrae%' LIMIT 1) AS sumatran_tiger_species
FROM taxonomy 
WHERE species LIKE '%Panthera tigris%';
