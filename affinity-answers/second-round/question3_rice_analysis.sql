-- =====================================================
-- QUESTION 3: Rice DNA Sequence Analysis
-- =====================================================
-- (3) Which type of rice has the longest DNA sequence? 
--     (hint: use the rfamseq and the taxonomy tables)

-- Optimized query to find rice with longest DNA sequence
SELECT 
    t.species,
    MAX(r.length) AS max_sequence_length,
    COUNT(r.rfamseq_acc) AS sequence_count,
    'Rice species with longest DNA sequence' AS result_description
FROM rfamseq r
JOIN taxonomy t ON r.ncbi_id = t.ncbi_id
WHERE t.species LIKE '%Oryza%'
GROUP BY t.species
ORDER BY max_sequence_length DESC
LIMIT 1;
