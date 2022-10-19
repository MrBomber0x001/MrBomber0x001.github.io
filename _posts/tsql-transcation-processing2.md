---
layout: post
title: Transcations & Concurrency control - Isolation levels in depth!
subtitle: Humble introduction to isolation leves and how to use them!
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [sql, database]
---

## Table Of Content

1. Transactions in SQL server
   1.1 Transcation Isolation levels
   2.1 Viewing Transactions

2. Concurrency in Transactions
   2.1 Locks
      2.1.1 Granuality
      2.1.2 Locks Types
   2.1 Optimstic vs pesimstic concurrency Controlling
   2.2 Locks and Latching

## Controlling the concurrency: Transaction isolation levels

Concurrency happens when two or more transcatins that read/change **shared** data at the same time

We can we isolate our transactions from other transactions?
We can achieve this isolation on different levels, T-SQL provides more than one level of isolation

**Transaction Isolation Levels**:

- READ COMMITTED (default)
- READ UNCOMMITTED
- REPETABLE READ
- SERIALIZABLE
- SNAPSHOT

```sql
SET TRANSCATION ISOLATION LEVEL
{READ COMMITTED |READ UNCOMMITTED |REPETABLE READ |SERIALIZABLE |SNAPSHOT}

```

To know the isolation levels you currently on

```sql
put the query
```

### READ UNCOMMITTED

the least restrictive isolation level
read rows modified by another transaction _which hasn't been commited or rolled back yet_

```sql
SET TRANSCATION ISOLATION LEVEL READ UNCOMMITTED
```

under this isolation level, it's possible to encounter dirty, non-repeatable or phantom reads!

Those are called concurrency phenomena, they occur when two or more transcations are running concurrency

**Dirt reads**

Dirty reads occurs when a transaction reads data that has been modified by another transaction without been yet committed

Let's suppose we have an account 5 with balance = 35,000$
We are going to refer to transcations by names to simplify understanding what's going on

Transaction 1 => yousef
Transaction 2 => omar

```sql
-- yousef
BEGIN TRAN 
   UPDATE accounts
   SET current_balance = 30000
   WHERE account_id = 5
```

yousef has not commited yet, in the moment, omar will read the accounts table

```sql
-- omar
SET Transaction isolate level READ UNCOMMITTED
SELECT current_balance
FROM accounts WHERE account_id = 5
```

| current_balance |
| --- |
| 300000 |

If yousef then has rollback, the account will still be 35000

```sql
-- yousef
ROLLBACK TRAN
```

However omar will still think the balance is 30000$

**non-repeatable reads**
non-repeatable reads occurs when a transaction reads a record twice, but the first result is different from the second result as a consequence of another committed transaction altered this data.

```sql
--yousef
SET Transaction isolation level read UNCOMMITTED
BEGIN TRAN
   SELECT * FROM accounts WHERE account_id = 5;
```

| current_balance |
| -- |
| 350000|
After that omar updates the current_balance of account 5 to 30000 and commit

```sql
-- omar
BEGIN TRAN
   UPDATE accounts
   SET current_balance = 30000 WHERE account_id = 5
COMMIT TRAN
```

if yousef then select the same account_id, he will see different result

```sql
   SELECT * FROM accounts WHERE account_id = 5
```

| current_balance |
| -- |
| 300000 |

**Phantom reads**

phantom reads that occur when a transaction reads some records twice, but the first result it gets is different from the second result as a consequence of another committed transaction having inserted a row.

```sql
-- yousef
SET Transaction ISOLATION LEVEL READ UNCOMMITTED
BEGIN TRAN
SELECT * FROM accounts
   WHERE current_balance BETWEEN 45000 AND 50000
```

| account_number | ... | current_balance |
| --- | --- | --- |
| 1 | ... | 10000 |

After some seconds, omar open a transcation and insert a new account

```sql
--- omar
BEGIN TRAN
   INSERT INTO accounts VALUES (2, 1, 20000)
COMMIT TRAN
```

if yousef after that, try to read again, he will different results

```sql
SELECT * FROM accounts
   WHERE current_balance BETWEEN 45000 AND 50000
```

| account_number | ... | current_balance |
| --- | --- | --- |
| 1 | ... | 10000 |
| 2 | ... | 20000 |

AS you may've seen, this difference can also cause problems if we make a buisness decision based on the first result.

#### Pros and Cons of READ UNCOMMITTED

_PROS_

- Can be faster, doesn't block other transcations, other isolation levels can block other transactions, so the information may not be returned immediately

_CONS_

- Allows dirty reads, non-repeatable, and phantom reads

_WHEN TO USE IT?_

- Don't want to be blocked by other transactions but don't mind concurrency phenomena
- You explicitly want to watch UNCOMMITTED data

#### Exercise

suppose you've to insert a new account into a bank

```sql
BEGIN TRAN
   INSERT INTO customers (first_name, last_name, email, phone)
   VALUES ('yousef', 'meska', 'yousefmeska123@gmail.com', '0120000')

   DECLARE @cust_id INT = scope_identity()
   -- in this moment just after you've inserted the customer, your peer programmer start to send emails to all customers, including the one you've just entered

   INSERT INTO accounts (account_number, customer_id, current_balance)
  VALUES ('55555555555010121212', @cust_id, 150)

COMMIT TRAN
```

**note:
SCOPE_IDENTITY() returns the IDENTITY value inserted in T1. This was the last insert that occurred in the same scope. The SCOPE_IDENTITY() function returns the null value if the function is invoked before any INSERT statements into an identity column occur in the scope

### READ COMMITED AND REPETABLE READS

#### READ COMMITTED

- default isolation level
- can't read data modified by othere transaction that hasn't commited or rolled back yet
- It doesn't allow dirty reads.

**Preventing dirty reads**

```sql
-- yousef
BEGIN TRAN 
   UPDATE accounts
   SET current_balance = 30000
   WHERE account_id = 5
```

yousef has not commited yet, in the moment, omar will read the accounts table

```sql
-- omar
SET Transaction isolate level READ COMMITTED
SELECT current_balance
FROM accounts WHERE account_id = 5
```

Omar will be blocked, and we not get any output till yousef commit his modifications

```sql
-- yousef
COMMIT TRAN
```

Omar immediately gets his result

| current_balance |
| -- |
| 30000 |

**Selecting without waiting**
The two transaction can read the same data without waiting easily witout any one gets blocked

##### Pros and Cons of READ COMMITTED

_PROS_

- Prevent dirty reads
_CONS_
- allows non-repeatable and phantom reads
- You can be blocked by another transcation

_WHEN TO USE IT?_
if you want to ensure that you only read committed data, not non-repeatable and phantom reads

#### REPETABLE READ

- can't read uncommited data from other transactions
- if a transcations read some data under this isolation level, other transcations cannot modify that data until REPETABLE READ transaction finishes

**Preventing non-repeatable reads**

```sql
-- yousef hasn't commited yet
SET Transaction ISOLATION LEVEL REPETABLE READ
BEGIN TRAN
   SELECT current_balance FROM accounts
   WHERE account_id = 5;
```

|current_balance |
| --- |
| 35,0000|

After that omar start to update the current_balance of account 5 to 30000

```sql
-- omar
UPDATE accounts SET current_balance = 30000 WHERE account_id = 5
```

Omar is blocked and has to wait until yousef commits his transaction
Now if yousef fires the same select statement again, it gets the first result which 35000 without getting non-repeatable reads

```sql
-- yousef
SET Transaction ISOLATION LEVEL REPETABLE READ
BEGIN TRAN
   SELECT current_balance FROM accounts
   WHERE account_id = 5;

   SELECT current_balance FROM accounts
   WHERE account_id = 5;
   -- | current_balance | 
   -- | 350000 | 
COMMIT TRAN
```

After yousef has commited, the modification of omar transcations will be immediately done

##### Pros and Cons of REPETABLE READ

_PROS_

- Prevent other transcations from modifying the data you are reading, non-repeatable reads
- Prevents dirty reads
_CONS_
- Allows phantom reads
- You can be blocked by a `REPETABLE READ` transcation
_WHEN TO USE?_
When you only want to read committed data and don't want other transcations to modifyiy what you are reading

### SERIALIZABLE

The most restrictive isolation level

#### Locking records with SERIALIZABLE

We can lock records under SERIALIZABLE, using a query with a `WHERE` clause based on an **index range**, so no other transcations can insert or change this data.
If **index range** has not been specified, the query will lock the comlete table

**Query based on an index range**

```sql
-- yousef hasn't commited yet
SET TRANSCATION ISOLATION LEVEL SERIALIZABLE

BEGIN TRAN
   SELECT * FROM customers
   WHERE customer_id BETWEEN 1 AND 3;
```

| customer_id | first_name | last_name | .. | phone |
| -- | --- | --- | --- | --- |
| 1 | yousef | meska | .. | 0121212 |

Those are locked records
After this selection omar need to insert new record into cusomters table with the customer_id == 2

```sql
-- omar
INSERT INTO customers (customer_id, first_name, ...)
VALUES (2, 'ahmed', 'meska', ....)
```

Omar has to wait

```sql
-- yousef will do another select statement
   SELECT * FROM customers WHERE customer_id BETWEEN 1 AND 3
```

| customer_id | first_name | last_name | .. | phone |
| -- | --- | --- | --- | --- |
| 1 | yousef | meska | .. | 0121212 |

```sql
-- yousef will commit
COMMIT TRAN
```

The insert statement of omar will be exectued immediately

**note**:
If omar from the first place was to insert a customer with id equal to 200 for example, it will be inserted immediately as it's out of the index range acquired by yousef

This operation will have to wait, also yousef only returned a single record, but he has a lock on records from 1 to 3

#### Pros an Cons Of SERIALIZABLE

_PROS_

- Good data consistency: Prevents dirty, non-repeatable and phantom reads

_CONS_

- you can be blocked by a `SERIALIZABLE`

_WHEN TO USE IT?_
When data consistency is a must

### SNAPSHOT

Every Modification is stored in the `tempDB` database, the previous version of the committed rows

You can only see comitted changes that occurred before the start of the SNAPSHOT transaction and own changes [changes made by that transcation],
therefore you can't see any changes made by other transactions after the start of the SNAPSHOT transaction

SNAPSHOT transactions that read data don't block other transactions that write data,
and transactions that write data don't block SNAPSHOT transactions that read data

using SNAPSHOT, we can have update conflicts if two transcations try to update the same data at the same time

to activate and use SNAPSHOT

```sql
ALTER DATABASE dbName SET ALLOW_SNAPSHOT_ISOLATION ON;

SET TRANSCATION ISOLATION LEVEL SNAPSHOT
```

| isolation level | Dirty reads | non-repeatable reads | Phantom reads |
| -- | -- | -- | --- |
| READ UNCOMMITTED | yes | yes | yes |
| READ COMMITTED | no| yes | yes |
|  REPETABLE READS | no | no | yes |
| SERIALIZABLE  | no | no | no |
| SNAPSHOT | not | not | not |

1️⃣ The difference between SNAPSHOT and SERIALIZABLE is SNAPSHOT doesn't block transactions as SERIALIZABLE does

### AVOID BEING BLOCKED

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

## Resources

- <https://architecturenotes.co/things-you-should-know-about-databases>
- T-SQL Fundmentals [Books :book:]
- Microsoft T-SQL Documentation
- Datacamp Transcations and Error handling interactive course

### Notes for me

- what if we've distributed databases, how transction will be handled?
