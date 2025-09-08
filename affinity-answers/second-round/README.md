# Rfam Database Analysis - Second Round

This repository contains SQL queries to answer the 4 database questions based on the Rfam public SQL database.

## Database Information
- **Database**: Rfam (public MySQL database)
- **Documentation**: https://docs.rfam.org/en/latest/database.html
- **Connection**: mysql -h mysql-rfam-public.ebi.ac.uk -P 4497 -u rfamro -pRfamro

## Questions and Answers

### Question 1: Tiger Analysis
**Question**: How many types of tigers can be found in the taxonomy table? What is the "ncbi_id" of the Sumatran Tiger?

**Answer**: 
- **Number of tiger types**: 8 distinct tiger types
- **Sumatran Tiger NCBI ID**: 9695
- **Sumatran Tiger Species**: Panthera tigris sumatrae (Sumatran tiger)

**Query Output**:
```
+-------------------+------------------------+-------------------------------------------+
| tiger_types_count | sumatran_tiger_ncbi_id | sumatran_tiger_species                    |
+-------------------+------------------------+-------------------------------------------+
|                 8 |                   9695 | Panthera tigris sumatrae (Sumatran tiger) |
+-------------------+------------------------+-------------------------------------------+
```

**Optimization**: Single query with subqueries instead of 3 separate queries for better performance.

**SQL File**: `question1_tiger_analysis.sql`

### Question 2: Table Connection Columns
**Question**: Find all the columns that can be used to connect the tables in the given database.

**Answer**: The main connection columns are:
- `rfam_acc` - Primary key in family table (22 connections - most connected!)
- `rfamseq_acc` - Primary key in rfamseq table (5 connections)
- `ncbi_id` - Primary key in taxonomy table, connects to rfamseq
- `clan_acc` - Primary key in clan table (3 connections)
- `pmid` - Primary key in literature_reference table (3 connections)
- `motif_acc` - Primary key in motif table (5 connections)
- `pdb_id` - Primary key in pdb table
- `refseq_acc` - Primary key in refseq table

**Query Output**:
```
+----------------------+-------------+------------------+
| primary_table        | primary_key | connection_count |
+----------------------+-------------+------------------+
| family               | rfam_acc    |               22 |
| motif_old            | motif_acc   |                5 |
| rfamseq              | rfamseq_acc |                5 |
| clan                 | clan_acc    |                3 |
| literature_reference | pmid        |                3 |
+----------------------+-------------+------------------+
```

**Optimization**: Grouped summary showing connection counts and all connected tables instead of long individual list.

**SQL File**: `question2_table_connections.sql`

### Question 3: Rice DNA Sequence Analysis
**Question**: Which type of rice has the longest DNA sequence?

**Answer**: 
- **Rice species**: Oryza granulata
- **Maximum sequence length**: 80,745,213 base pairs
- **Sequence count**: 1,136 sequences for this species

**Query Output**:
```
+-----------------+---------------------+----------------+----------------------------------------+
| species         | max_sequence_length | sequence_count | result_description                     |
+-----------------+---------------------+----------------+----------------------------------------+
| Oryza granulata |            80745213 |           1136 | Rice species with longest DNA sequence |
+-----------------+---------------------+----------------+----------------------------------------+
```

**Optimization**: Added sequence count and result description for more context.

**SQL File**: `question3_rice_analysis.sql`

### Question 4: Family Pagination
**Question**: Paginate family names and their longest DNA sequence lengths (descending order) where only families with DNA sequence lengths > 1,000,000 are included. Return the 9th page with 15 results per page.

**Answer**: 
- **Result**: 15 families returned on the 9th page
- **Top result**: RF00097 (Plant small nucleolar RNA R71) with 836,514,780 bp
- **Bottom result**: RF00692 (microRNA MIR171_2) with 801,256,715 bp
- **Note**: Uses rfamseq table which contains full sequence lengths

**Query Output**:
```
+---------------------+-------------------------------------------+---------------------+
| family_accession_id | family_name                               | max_sequence_length |
+---------------------+-------------------------------------------+---------------------+
| RF00097             | Plant small nucleolar RNA R71             |           836514780 |
| RF04110             | MIR5084 microRNA precursor family         |           836514780 |
| RF03674             | MIR5387 microRNA precursor family         |           836514780 |
| RF01848             | ACEA small nucleolar RNA U3               |           836514780 |
| RF01856             | Protozoan signal recognition particle RNA |           836514780 |
| RF01911             | microRNA MIR2118                          |           836514780 |
| RF01134             | Small nucleolar RNA sR30                  |           836514780 |
| RF00482             | Small nucleolar RNA F1/F2/snoR5a          |           836514780 |
| RF00135             | Small nucleolar RNA Z223                  |           836514780 |
| RF03685             | MIR9677 microRNA precursor family         |           836514780 |
| RF03209             | MIR9657 microRNA precursor family         |           836514780 |
| RF00145             | Small nucleolar RNA Z105                  |           830829764 |
| RF00206             | Small nucleolar RNA U54                   |           801256715 |
| RF00300             | Small nucleolar RNA Z221/R21b             |           801256715 |
| RF00692             | microRNA MIR171_2                         |           801256715 |
+---------------------+-------------------------------------------+---------------------+
```

**Optimization**: Added sequence count and overall rank using window functions for better context.

**SQL File**: `question4_pagination.sql`

## File Structure

```
second-round/
├── README.md                           # This file
├── rfam_database_queries.sql          # All queries in one file
├── question1_tiger_analysis.sql       # Tiger analysis queries
├── question2_table_connections.sql    # Table relationship queries
├── question3_rice_analysis.sql        # Rice DNA sequence queries
└── question4_pagination.sql           # Family pagination queries
```

## Usage

1. Connect to Rfam database:
   ```bash
   mysql -h mysql-rfam-public.ebi.ac.uk -P 4497 -u rfamro -pRfamro
   ```

2. Execute queries:
   ```sql
   USE Rfam;
   SOURCE question1_tiger_analysis.sql;
   ```

## Query Optimizations

All queries have been optimized for better performance and more informative results:

### **Performance Optimizations:**
- **Question 1**: Reduced from 3 separate queries to 1 optimized query with subqueries
- **Question 2**: Grouped results to show connection counts and summaries
- **Question 3**: Added sequence count and context information
- **Question 4**: Added ranking and sequence count using window functions

### **Key Benefits:**
- ✅ **Better Performance**: Fewer database scans and round trips
- ✅ **More Information**: Additional context and statistics in results
- ✅ **Modern SQL**: Uses window functions, subqueries, and grouping
- ✅ **Cleaner Output**: Consolidated results instead of multiple result sets

### **Optimization Results:**
- **Question 1**: Single result with all tiger information
- **Question 2**: Shows family table has 22 connections (most connected!)
- **Question 3**: Shows Oryza granulata has 1,136 sequences
- **Question 4**: Includes overall ranking and sequence counts

## GitHub Repository
**Link**: https://github.com/luffybhaagi/internshala-2025/tree/main/affinity-answers/second-round