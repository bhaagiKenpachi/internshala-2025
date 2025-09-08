-- =====================================================
-- QUESTION 4: Family Pagination Query
-- =====================================================
-- (4) We want to paginate a list of the family names and their longest DNA sequence lengths 
--     (in descending order of length) where only families that have DNA sequence lengths 
--     greater than 1,000,000 are included. Give a query that will return the 9th page 
--     when there are 15 results per page. 
--     (hint: we need the family accession ID, family name and the maximum length in the results)

-- Optimized pagination query for the 9th page (offset = (9-1) * 15 = 120)
-- Using rfamseq table which contains full sequence lengths
-- Note: Window functions (ROW_NUMBER) not supported in MySQL 5.6.36, using simplified version
SELECT 
    f.rfam_acc AS family_accession_id,
    f.description AS family_name,
    MAX(r.length) AS max_sequence_length
FROM family f
JOIN full_region fr ON f.rfam_acc = fr.rfam_acc
JOIN rfamseq r ON fr.rfamseq_acc = r.rfamseq_acc
GROUP BY f.rfam_acc, f.description
HAVING max_sequence_length > 1000000
ORDER BY max_sequence_length DESC
LIMIT 15 OFFSET 120;
