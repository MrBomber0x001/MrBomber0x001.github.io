---
layout: post
title: Transcations & Concurrency control (Theory and Practice) in T-SQL
subtitle: 
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [sql, database]
---
## Table of Content

1. Humble Intro to Transcations.
2. Transactions in SQL server
   2.1 Transcation Isolation levels
   2.2 Viewing Transactions
3. Concurrency in Transactions
   3.1 Concurrency vs parallism vs asyncrounsly
   3.2 Optimstic vs pesimstic concurrency Controlling
   3.3 Locks and Latching

## Transactions in SQL Server

**Transaction**: _atomic_ unit of work that might include multiple activities that **query** and **modify** data, A one or more statements, all or none of the statment are executed.

Imagine we have a bank account database, we need to transfer $100 from account A to  account B
the procedure as came to your mind is

1. Subtract 100 from A
2. Add those 100 to B
so the operation here needs to be done as all statement , or not

**Genreal Statement**

```sql
BEGIN {TRAN | TRANSACTION }
   [ { transcation_name | @tran_name_variable}
      [ WITH MARK ['description'] ]
  ]
[;]
```

Uou can optionally add a transcation name and WITH MARK

```sql
 COMMIT [ {TRAN | TRANSACTION } [transcation_name | transc_name_variable ]]
[ WITH (DELAYED_DURABILITY = {OFF | ON } )][;]
```

once the commit is executed, the effect of transaction can't be reversed

`ROLLBACK` reverts the transaction to the beginning of it or a `savepoint` inside the transaction

```sql
ROLLBACK {TRAN | TRANSACTION }
[ {transcation_name | @tran_name_variable | savepoint_name | @savepoint_variable } [;]
```

we can define the boundaries (Beginning and end) of the transaction either:

1. Explicitly
The start of a transaction is defined by BEGIN and the end either to be
COMMIT (in case you of success) or ROLLBACK if you need to undo changes

```sql
BEGIN TRAN
         --your query
COMMIT TRAN;
```

2. Implicitly
MS SQL Server automatically commits the transaction at the end of each individual statement, in case you didn't specify this explicitly
we can change this behavior by changing the session option [IMPLICIT_TRANSACTION] to ON, by doing so, we don't need to specify the beginning of tran, but we need to specify the end of the train either committing it or rollbacking it.

### Transaction properties

Transactions have four props: ACID

- Atomicity
- Consistency
- Isolation
- Durability

an example

```sql
BEGIN TRAN;
UPDATE accounts SET current_balance = current_balance - 100 WHERE account_id = 1;
INSERT INTO transactions VALUES (1, -100, GETDATE());
UPDATE accounts SET current_balance = current_balance + 100 WHERE account_id = 5;
INSERT INTO transactions VALUES (5, 100, GETDATE());
COMMIT TRAN;
```

the second example uses rollback

```sql


```

now if we see the output:

```sql
 --put the output from the MSSQL server --really
```

third example with try... catch
we surrond transcation with try and catch

```sql
BEGIN TRY
   BEGIN TRAN;
      UPDATE accounts SET current_balance = current_balance - 100 WHERE account_id = 1;
      INSERT INTO transactions VALUES (1, -100, GETDATE());
      UPDATE accounts SET current_balance = current_balance + 100 WHERE account_id = 5;
      INSERT INTO transactions VALUES (5, 100, GETDATE());
   COMMIT TRAN;
END TRY
BEGIN CATCH
   ROLLBACK TRAN;
END CATCH
```

a fourth example of implicit transaction

```sql
UPDATE accounts SET current_balance = current_balance - 100 WHERE account_id = 1;
INSERT INTO transactions VALUES (1, -100, GETDATE());
UPDATE accounts SET current_balance = current_balance + 100 WHERE account_id = 5;
INSERT INTO transactions VALUES (500, 100, GETDATE()); -- ERROR!
```

resulting in an **inconsistent** state

### Exercises

```sql

BEGIN TRY  
 Begin TRAN;
  UPDATE accounts SET current_balance = current_balance - 100 WHERE account_id = 1;
  INSERT INTO transactions VALUES (1, -100, GETDATE());
        
  UPDATE accounts SET current_balance = current_balance + 100 WHERE account_id = 5;
  INSERT INTO transactions VALUES (5, 100, GETDATE());
 Commit TRAN;
END TRY
BEGIN CATCH  
 rollback TRAN;
END CATCH
```

```sql
BEGIN TRY  
 -- Begin the transaction
 BEGIN tran;
  UPDATE accounts SET current_balance = current_balance - 100 WHERE account_id = 1;
  INSERT INTO transactions VALUES (1, -100, GETDATE());
        
  UPDATE accounts SET current_balance = current_balance + 100 WHERE account_id = 5;
        -- Correct it
  INSERT INTO transactions VALUES (500, 100, GETDATE());
    -- Commit the transaction
 Commit TRAN;    
END TRY
BEGIN CATCH  
 SELECT 'Rolling back the transaction';
    -- Rollback the transaction
 Rollback tran;
END CATCH
```

```sql
-- Begin the transaction
begin tran; 
 UPDATE accounts set current_balance = current_balance + 100
  WHERE current_balance < 5000;
 -- Check number of affected rows
 IF @@ROWCOUNT > 200 
  BEGIN 
         -- Rollback the transaction
    Rollback tran; 
   SELECT 'More accounts than expected. Rolling back'; 
  END
 ELSE
  BEGIN 
         -- Commit the transaction
   commit tran
   ; 
   SELECT 'Updates commited'; 
  END
```

### @TRANCOUNT and savepoints

savepoints:
@@TRANCOUNT returns the number of BEGIN TRAN statements that are active in your current connection
Returns:

- 0 -> no open transactions
- greater than 0 -> open transaction

It's modified by:

- BEGIN TRAN -> @@TRANCOUNT + 1
- COMMIT TRAN -> @@TRANCOUNT - 1
- ROLLBACK TRAN -> @@TRANCOUNT = 0 (except with savepoint_name)

an example of @@TRANCOUNT in nested transaction

```sql
SELECT @@TRANCOUNT AS '@@TRANCOUNT value';
BEGIN TRAN;
    SELECT @@TRANCOUNT AS '@@TRANCOUNT value';
   DELETE  transcations;
   BEGIN TRAN;
          SELECT @@TRANSCOUNT AS '@@TRANCOUNT value';
          DELTE accounts;
    COMMIT TRAN;
    SELECT @@TRANSCOUNT AS '@@TRANSCOUNT value';
ROLLBACk TRAN;
SELECT @@TRANCOUNT AS '@@TRANCOUNT value';
```

## Controlling the concurrency: Transaction isolation levels

What are isolation levels?

## Locks and Blocking

two-phase locking

two-phase locking essential components

deadlocks and starvation

Locks:
looks are control resources obtained by a transaction to guard data resources, preventing conflicting or incompatible access by other transactions,
Locks mode and Compatability:
two main locks modes( exclusive and shared
what are resources?

locking compatibility
Isolation level
deadlocks

Locking & Unlocking:  operation (a mechanism) to allow or prevent reading or writing on the data item
