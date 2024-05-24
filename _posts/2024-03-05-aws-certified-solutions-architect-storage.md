---
layout: post
title: AWS SAA-C03 - Storage
date: '2024-03-05'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 44
type: certification
customColor: true
fgColor: "#1b4bad"
bgColor: "#cce6ff"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview) course.
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS Storage and AWS Databases.
</div>

<h1>Table of contents</h1>

<a href="#simple-storage-service-s3" class="mindmap mindmap-new-section" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `S3` `object < 5 TB` `min 3 AZ` `Bucket Policy` `ACL List` `12-48 h, 7-10 years for Deep Archive` `Compliance/Governance Object Lock`
  `Legal Hold` `Glacier Vault Lock` `Replication` `Lifecycle Management` `strong read after write consistency` `SSE-S3, KMS, or SSE-C at rest` 
  `x-amz-server-side-encryption` `Multipart upload` `S3 Byte-Range Fetches` 
</a>
<a href="#elastic-block-store-ebs" class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `Elastic Block Store (EBS)` `replicated within 1 AZ` `same AZ as EC2` `deleted on Termination by default` `Throughput optimized HDD (st1) (big data)`
  `Provisioned IOPS (io2)` `General Purpose SSD (gp3)` `Cold HDD (SC1)` `incremental Snapshots` `End to end encryption, AES-256`
</a>
<a href="#elastic-file-service-efs" class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `Elastic File Service (EFS)` `central` `Network File System (NFS)` `only Linux` `multiple AZ` 
  `mount target in VPC & subnet` `Lifecycle Management` `read after write consistency` `Lifecycle Management` `General Purpose` `Max/IO (big data)` 
  `encryption at rest with KMS` `default backup and encrypted`
</a>
<a href="#fsx" class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `FSx` `central` `Windows or Lustre` `built on Windows File Server` `Windows Server Message Block (SMB)` `encryption with KMS`
  `AD users` `Lustre High Performance Computing, ML`
</a>
<a href="#rds" class="mindmap mindmap-new-section" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `RDS` `multi AZ support for failover` `read replicas` `OLTP processing` `automated backups` `max 40 instances` 
  `Aurora min 3 AZ` `max 5 replicas, Aurora 15` `Aurora snapshots` `Aurora self healing` `Aurora Serverless`
</a>
<a href="#dynamodb-serverless"  class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `DynamoDB` `3 geographically different DCs` `on SSD` `eventually/strongly consistent reads` `transactional reads/writes` 
   `transactions <100 items <4MB volume` `Global Tables` `encryption at rest with KMS` `BatchWriteItem` `on-demand backup` `PITR 5 mins - 35 days` 
  `DynamoDB Streams` `DAX in VPC` `DAX pay per request`
</a>
<a href="#documentdb" class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `DocumentDB` `MongoDB` `AWS Migration Service` `on-premise Mongo`
</a>
<a href="#amazon-keyspaces-serverless"  class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `Keyspaces` `Cassandra` `Big Data`
</a>
<a href="#amazon-neptune"  class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `Neptune` `graph DB` `ad targeting`
</a>
<a href="#qldb-amazon-quantuum-ledger-database"  class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `QLDB` `ledger DB` `cryptographically verifiable` `blockchain, tracking`
</a>
<a href="#amazon-timestream"  class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `Timestream` `time-series DB` `<trillions events per day`
</a>
<a href="#redshift"  class="mindmap" markdown="1" style="--mindmap-color: #1b4bad; --mindmap-color-lighter: #cce6ff;">
  `RedShift` `Based on PostgreSQL` `OLAP workloads` `<16 PB data` `Columnar, parallel queries` `<=2 AZ` `Incremental backups to S3` 
  `RedShift spectrum` `enhanced VPC routing` `Snapshots, restoration to other regions` `favor large batch inserts`
</a>
  
# Simple Storage Service (S3)
- Buckets must be **globally unique**
- But deployed to **specific regions**
- *Secure, durable and highly scalable object storage* - scalable because available whenever/whatever and cheap
- Only static flies, no running anything there
- Unlimited storage, each object up to **5 TB**
- URLs look like this: https://`bucket-name`.s3.`region`.amazonaws.com/`key-name`
  - Key is the key, object is the file; it's still called object-based not file-based
  - universal namespace - all bucket names must be unique across all AWS accounts
  - value is the actual data
- also can have **Version ID**, **metadata** (content type, last modified, etc)
- Data is **spread across multiple devices** (minimum **3 AZ**) to ensure: 
  - availability (`99.95%-99.99%`) 
  - durability (`9.9999999999%`, *"eleven nines"*)
- AWS CLI returns `HTTP 200` on successful upload (`PUT`)
- **consistency model**: strong "read after write" consistency - it will not read outdated file, also list operations won't
    
## Static website on S3
- good when you need to scale quick, when you are not sure about the demand
  - on the bucket properties there's sth like ”host static website”
  - you specify the index and error html
  - upload files
  - then you need to **make the bucket public** (see S3 Securing below)

## S3 Versioning
- if enabled, versioning is there **even for deletion**
- you **cannot disable once enabled, only suspend**
- properties -> bucket versioning
  - first version is null
  - previous versions are not public even if the bucket was made public
  - how to **recover deleted object** - show versions, check the "delete marker" and delete this one (permanently)
- can be integrated with lifecycle rules
- another way to **protect from accidental deletion is MFA**
- you pay per storage and access just like any other object (TODO verify)
      
## How to make a bucket public
1. you can enable this option on **both the bucket and the object** (option 1)
  - uncheck “block public access” (that is done by a policy)
  - pick “ACLs enabled” in Object Ownership tab
  - bucket actions -> “make public using ACL”
2. or you can **enable it for the whole bucket**: permissions -> bucket policy (option 2)
```json
{
  "Version": "2012-10-17",
  "Statement": [
      {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": [
           "s3:GetObject"
        ],
        "Resource": [
           "arn:aws:s3:::BUCKET_NAME/*"
        ]
      }
  ]
}
```

## S3 Storage Classes
- what you pay for ([source](https://aws.amazon.com/s3/pricing/?p=pm&c=s3&z=4))
  - *size of stored objects*, *storage time* during the month, and the *storage class*
  - (mostly for Glacier only) *per-request* ingest charges when using PUT, COPY, or lifecycle rules to move data into any S3 storage class
  - for S3 Intelligent-Tiering *monthly monitoring and automation* charge per object stored in the storage class, but no retrieval and moving between tiers charges
- storage classes
  - **S3 Standard** - high availability and durability
    - websites, videos
    - as of 2024 `0.023$` per GB
    - **S3 Standard-IA** - infrequently accessed data
      - `2x` cheaper
      - still, rapid access
      - you pay more per access (per GB) than for the storage
      - long term storage: backups, disaster recovery
    - **S3 Standard-IA with 1 AZ**
      - `20%` cheaper from above, for non critical data
  - **S3 Glacier** 
    - pay more per access (per GB), storage cheap
    - use only for archiving
    - optimized for very infrequent access
    - data stored in **archives and vaults, not buckets**
    - S3 Glacier types
      - **S3 Glacier Instant Retrieval**
      - **S3 Glacier Flexible Retrieval**
        - just a bit cheaper than Glacier
        - retrieval is no cost, but you may have to wait `12` hours to access
        - e.g. non critical backups
      - **S3 Glacier Deep Archive**
        - cheapest, more than `10x` cheaper than S3 Glacier
        - `12-48` hours to access (single or bulk)
        - retain data for `7-10` years
        - e.g. legal and compliance documents
  - **S3 Intelligent Tiering** 
    - as much as Standard plus small fee for monitoring each object
    - automatically moves objects between tiers to make it cheaper, based on access patterns

| Storage Class                               | Availiabi. | Durabi.| AZs   | Use Case                                                                            |
|---------------------------------------------|------------|--------|-------|-------------------------------------------------------------------------------------|
| S3 Standard                                 | 99.99%     | 11 9s  | >=3   | Most, websites, mobile&gaming apps, big data analytics                              |
| S3 S. Infrequent Access                     | 99.99%     | 11 9s  | >=3   | Long term, infrequently accessed critical data (backups, disaster recovery)         |                 
| S3 One-Zone Infrequent Access               | **99.95%** | 11 9s  | **1** | Long term, infrequently accessed non-critical data                                  |
| S3 Glacier Instant Retrieval                | 99.99%     | 11 9s  | >=3   | Long term, very infrequently accessed, but quick retrieval                          |
| S3 Glacier (aka Glacier Flexible Retrieval) | 99.99%     | 11 9s  | >=3   | Like Glacier Instant R., slower but cheaper retrieval, up to **12h**, e.g. backups  |                                                        
| S3 G. Deep Archive                          | 99.99%     | 11 9s  | >=3   | Rarely accessed, e.g. regulatory, retrieval from **12h**                            |                                                              
| S3 Intelligent Tiering                      | 99.99%     | 11 9s  | >=3   | Unpredictable access patterns                                                       |

## S3 Lifecycle Management
- automatically move files to different tiers, e.g. after a period of not used
- can move versions independently of each other
- bucket -> Management -> **Lifecycle rules**

## WORM storage model
- **WORM storage model** - write once, read many, not allowed to update for fixed amount of time - retention period
  - can be used for regulatory reqs
- implementations
  - **S3 Object Lock**
    - **Compliance mode** - can't be deleted or modified by anyone, even root, for the duration of the **retention period**
      - retention period is put on an **object version** - a timestamp is added to the metadata
    - **Governance mode** - can be updated/deleted by users with permissions, they can also can update the retention period
  - **Legal hold** - like Object Lock, but no retention period, user just needs a permission `s3:PutObjectLegalHold` to add and remove legal hold, also on an **object version**
  - **Glacier Vault Lock** - is WORM model for Glacier vaults, the vault lock policy once locked cannot be changed

## S3 Securing
- You can have:
  - **Encryption**
  - **Access Control lists (ACLs)**, per object, accounts and groups can have specified access type
  - **Bucket policies**, per operation, but bucket wide
    - By default buckets are private.

### S3 Encryption
- **Encryption in Transit** - to and from the bucket
  - SSL certificates/TLS -> means you use HTTPS to access it, port `443`
- **Encryption at Rest: Server-Side encryption**
  - **SSE-S3** - S3 manages the keys, AES-256, happens in the background (**enabled by default**)
  - **SSE-KMS** - AWS Key Management Service
  - **SSE-C** - customer provided keys
- **Encryption at Rest: Client-Side encryption**
  - you do it yourself before uploading
- If they ask you how to enforce server side encryption - is a wrong question as now **server side encryption is by default enforced**, but
  it may just be an old question
  - `x-amz-server-side-encryption` parameter should be included in the `PUT` HTTPS request header, with value `AES256` or `aws:kms`, 
    then the encryption will happen at the time of upload
  - you can also create an S3 bucket policy that denies any S3 upload without this header

## S3 Performance
- the S3 latency is already low, 200-300 milliseconds for first data out
- **the requests per second are per prefix, so spread your prefixes** (`3 500`rps for updates and `5 000`rps for gets)
  - in our bucket, e.g. `mybucket/folder1/subfolder1/myfile.jpg` -> `/folder1/subfolder1` is the prefix
- **KMS also has limit though**, `GenerateDataKey` operation for upload, and `Decrypt` operation for download, `5 500`rps, `10 000`rps, or `30 000`rps depending on region, no quota increase is possible
- **Multipart upload**
  - recommended for >`100 MB`, required for >`5 GB`
  - multipart parallelizes the uploads
- **S3 Byte-Range Fetches** for downloads
  - parallelize downloads, download in chunks in parallel

## S3 Replication (backup)
- used to be cross region but now is even cross bucket
- do it **for bucket**
- needs to be **enabled on source and target buckets**
- did **not work retrospectively**, but now you get a prompt if you want to do it when you create the rule
- **versioning is required** on both buckets
- **delete markers are not replicated** by default, you need to enable it
- Management -> Replication rules
  - you need to specify AIM role (why?)
  - specify path to completion report, e.g. `s3//sourcebucket343425`
  - there may be a **S3 Batch Job** created to replicate existing (or also future?) objects, its folder may be created in source bucket,
    and also replicated into destination bucket -> but I have not seen this in the lab, only course video

# Elastic Block Store (EBS)
- Virtual hard disc attached to VM
- You can attach them to your EC2 instance
- **You can install OS there, install applications, database, etc.**
- **For mission critical data, production, highly available, automatically replicated within 1 AZ**
- Scalable: can dynamically adjust capacity without downtime, you just have to extend the filesystem in the OS, so that it can see it
  - you can also freely change instance type on-the-fly
- Have to be in the **same AZ as EC2** they are attached to
- When you **Stop an instance, the data is kept on EBS, but when you Terminate, the root device volume will also be terminated** (by default)

## IOPS vs Throughput
- **IOPS** (or PIOPS): read/write operations per second, quick transactions, low latency apps, transactions going on simultaneously, if you have transactional DB
  - best fit: Provisioned IOPS SSD (io1 or io2)
- **Throughput**: read/written bits per second, large datasets, large IO sizes, complex queries, large datasets
  - best fit: Throughput Optimized HDD (st1)

## EBS Types
- **General Purpose SSD (gp3)**
  - max performance **4 times faster than gp2**
  - predictable `3k` IOPS performance and `125` MiB/s regardless of size
  - `99.9%` durability
  - for apps requiring **high performance at low cost**, e.g. MySQL, Cassandra, virtual desktops, Hadoop analytics
  - can get `16k` IOPS and `1k` MiB/s for extra fee
  - unlikely to be chosen against gp3
    - Standard
      - previous generation volume, for infrequent access
      - 1 GiB - 1 TiB
      - IOPS 40-200
      - Throughput 40-90 MiB/s
    - General Purpose SSD (gp2)
      - balance of price & performance
      - 3 IOPS / GiB, <16k IOPS per volume
      - for < 1TB, <3k IOPS
      - 99.9% durability
      - good for boot volumes, or development and test applications that are not latency sensitive
- **Provisioned IOPS SSD (io2)**
  - same price as io1
  - `< 64k IOPS` per volume, `500` IOPS / GiB
  - `99.9999%` durability
  - for IO intensive applications, large databases, latency sensitive workloads
  - unlikely to be chosen against io2
    - Provisioned IOPS SSD (io1 legacy)
      - most expensive, high performance
      - < 64k IOPS per volume, 50 IOPS / GiB
      - use if you need more than 16k OIPS
      - usage like io1 but without high durability
- **Throughput optimized HDD (st1)**
  - low cost hard disk drive, a lot of data
  - baseline throughput of `40` MB/s per TB, spiking up to `250` MB/s per TB
  - max throughput `500` MB/s per volume
  - `99.9%` durability
  - frequently accessed, throughput intensive workloads, e.g. big data, data warehouses, ETL, log processing
  - cannot be a boot volume
- **Cold HDD (SC1)**
  - cheapest
  - `12` MB/s per TB, spiking up to `80` MB/s per TB
  - max throughput 250 MB/s per volume
  - `99.9%` durability
  - for data requiring fewer scans per day, performance not a factor, e.g. file server
  - cannot be a boot volume
- Summary:
  - big data, data warehouse, ETLs -> **Throughput Optimized HDD**
  - transactions -> **Provisioned IOPS SSD if you have money (io2), otherwise General Purpose SSD (gp2)**
  - lowest cost -> **Cold HDD**

## EBS Volumes & Snapshots
- an EBS Volume is virtual hard disk = root device volume, where stuff is installed
  - **you need minimum 1 volume per EC2 instance**
- an **EBS Snapshot is an incremental copy of the Volume**, in a point in time, put on S3
  - first Snapshot is going to take longer
  - recommended to take a Snapshot on a stopped instance, to avoid missing data cached in memory
  - taking a Snapshot of an **encrypted Volume will be automatically encrypted**
  - you can share Snapshot within same region, otherwise you have to copy it to another region (**that's how you copy EC2 between regions**)
    - EC2 -> Elastic Block Store -> Volumes -> Actions -> Create Snapshot
    - EC2 -> Elastic Block Store -> Snapshots -> Actions -> Copy Snapshot - pick another region (you can extra encrypt it)
    - go to the other region -> EC2 -> Elastic Block Store -> Snapshots -> Actions -> Create Image from Snapshot (not Volume)
    - EC2 -> Images -> AMIs -> Launch Instance from AMI

## EBS Encryption
- you can **encrypt your volume with an industry standard `AES-256` algorithm**
  - uses KMS's (Key Management Service) CMKs (Customer Master Keys)
- when EBS is encrypted, it is **end-to-end**:
  - => data inside the volume is encrypted
  - => data in transit between instance and volume is encrypted
  - => all snapshots are encrypted
  - => all volumes created from those snapshots are encrypted
- handled transparently
- minimal impact on latency
- you can enable it also while copying unencrypted snapshot, this is **how you encrypt an unencrypted volume**

# Elastic File Service (EFS)
- storing files **centrally**
- uses **Network File System v4 (NFSv4)** protocol, **only Linux**, no Windows    
- can be mounted on many EC2 instances at once, in **multiple AZs**
  - connected via **Mount Target**, which is in the services' VPC & Subnet, but the the file system is outside
- use cases: content management, web servers
- highly available, scalable and expensive
  - pay per use
  - `thousands` of concurrent connections (EC2 instances)
  - `10 GB/s` throughput
  - up to `Petabytes` of storage
  - you can pick
    - **General Purpose** - web server, CMS, etc 
    - **Max I/O** - big data, media processing
- **Read after write consistency**
- **Encryption at Rest using KMS**
- file system scales automatically
- Storage Tiers, also has **lifecycle management** (move to another tier after `x` days)
  - **Standard**
  - **Infrequently Accessed**
- by default **encrypted**, by **default tiny size**, by default **backup** is on
- you can choose performance settings (Enhances, Bursting, Provisioned, ..), but it is out of scope
  
### EFS Lab: replace EBSs with single EFS 
- each web server had EBS storage containing identical data, replace 3 EBSs with one EFS -> cost reduction
  - to see mounted drives -> `df -h`, there you can also see the sizes, or `lsblk`
  - you need to set same security group for the mount point as EC2 is in, and add an Inbound Rule for NFS (`0.0.0.0/0`)
  - to mount the EFS:
    - login to the instance
    - `sudo mkdir /efs`
    - in the console, choose Attach -> by IP -> copy the command, but add slash before `efs`
      `sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport 10.0.0.36:/ /efs`
    - `lsblk` will not show it, but `mount` or `df -h` will
    - to copy files better use `rsync -rav <source> <destination>`
    - to unmount old EBS: `sudo umount /data` (`/data` is where it was mounted)
    - to keep it unmounted on reboot: `sudo nano /etc/fstab`, remove the line with `/data`
    - to mount EFS on reboot to the same dir, add line (with tabs not spaces):
    `<the IP of the EFS from the console>:/     /data     nfs4   <options from the -o arg in the console> 0 0`, in our case:
    `10.0.0.36:/     /data     nfs4    nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport 0 0`
    - unmount `/efs` to be sure it works with `/data` only `sudo umount /efs`
    - `sudo mount -a`, and see `/data` is mounted
    - go to the Console and detach the Volume, and then delete Volume
  
# FSx
- FSx **for Windows**
  - **centralized** storage
  - built on **Windows File Server**, fully managed native Microsoft Windows file system
  - runs **Windows Server Message Block (SMB)** based file services
  - supports AD users, access control lists, groups, security policies, Distributed File System (DFS) namespaces, and replication
  - offers encryption with KMS
  - e.g. **SharePoint, Workspaces, IIS Web Server are also native Microsoft applications**
- FSx **for Lustre**
  - optimized for **compute intensive workloads, HPC (High Performance Computing), AI, machine learning, financial modelling**
  - `hundreds` of GiB/s, `millions` of IOPS, `sub-milliseconds` latencies
  - can store data directly on S3

# Databases

## RDS
- data organized into tables
- SQLServer, PostgreSQL, Oracle, MariaDB, MySQL, Aurora
- RDS is an EC2 instance where you don't have access to OS, only the DB
- **multi AZ support** - primary can be in **different AZ than secondary (stand-by), automated failover**
  - this is not used for lessening load on writer instance, only failover/disaster recovery! 
    - everything happens in the background, stand-by database will be promoted to primary one, DNS address will point to the new one
  - multi AZ deployment clusters offer 2 stand-by instances
  - **Aurora is always multi AZ by default**
- **automated backups**
- RDS is used for **online transaction processing (OLTP processing)**, as opposed to online analytical processing (OLAP processing), where RDS is not suitable (e.g. complex queries, analysis, Big Data) - there RedShift is more appropriate
- **Read replica** - for read queries (e.g BI), **can be multi AZ or even cross region**
  - **must have automated backups** enabled to deploy one
  - up to `5` read replicas per DB, can be different DB type
  - has a separate DNS endpoint
  - can also be promoted to be its own database, useful e.g. before a big querying party
  - RDS -> DB -> Actions -> Create read replica
  - **max 40 Amazon RDS DB instances per account**

### Provisioning RDS
- RDS -> Create Database
  - you can put your credentials into Secret Manager automatically
  - **pick VPC and Subnet** (will show many subnets after creation, why?)
  - Public access usually No
  - Security groups
  - after creating there is a **popup View credential details** - you only see it once

### Amazon Aurora
- is Amazon's DB
- MySQL and PostgreSQL compatible
- `5` times better performance than MySQL and `3` times better than PostgreSQL, also cheaper
- starts with `10 GB` and goes up to `128 TB`, in 10 GB increments
- up to `96 vCPUs` and `768 GB` memory
- in **minimum 3 AZs**, **2 copies each** -> `6` copies!
  - can handle losing up to 2 copies for writes and 3 copies for reads with no downtime
  - max `15` replicas, with Aurora (with automated failover), MySQL or PostgreSQL
- **self healing** - data blocks and discs scanned and repaired automatically
- automated backups enabled automatically
- you can take **snapshots** and share with other accounts
- note there is also **Aurora Serverless**, see the serverless section (this would be **Provisioned**)

## DynamoDB #serverless
- fast flexible non relational, with **consistent millisecond latency**
- supports both **documents and key value data models**
- **IoT, gaming, mobile**
- spread across **3 geographically different data centers, on SSD**
- you can have 3 types of reads
  - **eventually consistent reads** (default, ~<`1`s) 
  - **strongly consistent reads** 
  - **transactional reads** (with transactions enabled)
- you can have 2 types of writes
  - **standard**
  - **transactional writes** (with transactions enabled)
- **partition key (PK), sort key (SK)**
- pricing models
  - **On-Demand** (pay per request) 
  - **provisioned**
- has **CloudWatch and CloudTrail integration**
- if they ask how to spread data across multiple regions - **enable Global tables**, it’s a tab in your table -> create replica, choose region
  - "no application rewrites" - they mean you don’t have to change the code, refactor to enable global tables
- if they ask about **high performance DB** -> is DynamoDB
- supports batch updates with `BatchWriteItem`

### DynamoDB DAX
- **in memory cache**, down to microseconds (<`10`x), **with ttl**
  - **pay per request**
  - you connect to DAX, everything else in the background
  - lives **inside a VPC**
  - you control node size, cluster count, TTL and maintenance windows
- does not support **backups**

### DynamoDB Security
- **encryption at rest with KMS**
- **Site-to-site VPN**
- **Direct Connect (DC)**
- **IAM policies and roles** for fine grained access
- **VPC endpoints** (traffic stays in AWS)

### DynamoDB Transactions
- they are ACID
- across many tables
- <`100` items or <`4` MB data per transaction

### DynamoDB Backups
- on demand backups at any time, no impact on performance / availability
- **same region as the source table**
- you can enable **Point In Time Recovery (PITR)** 
  - it will allow restoring to between `5` minutes ago and `35` days
  - incremental backups

### DynamoDB Streams
- **time ordered sequence of item-level changes in a table, FIFO**
- each change has a **sequence number**, **stored for 24h**
- streams divided into **records (1 record = 1 change?)**, grouped into **shards**, with ids, probably by item key
- can add lambdas, which kinda work as stored procedures

### DynamoDB Global tables
- **multi region tables**, for globally distributed applications, offers disaster recovery and high availability
- can be turned on without need to make code changes
- **based on DynamoDB streams, you need to enable them first**
- **multi master**
- replication latency ~< `1`s
- **how to spread your table across multiple regions**
  - DynamoDB -> Create table -> PK -> Open the table -> Global Tables -> Create replica -> pick region (streams will be automatically enabled)

## DocumentDB
- is **MongoDB on AWS** - document database
- only if you already have MongoDB on premise and want to move it to the Cloud, otherwise DynamoDB is better
- will add scalability and durability, backups, all ops overhead
  - you use **AWS Migration Service**

## Amazon Keyspaces #serverless
- is **Cassandra on AWS** - distributed noSQL DB for **Big Data**
- is serverless

## Amazon Neptune
- is a **graph database**
- use cases: **social graphs, ad targeting, personalisation, analytics, product database, model general information, fraud detection, security risk detection**

## QLDB  (Amazon Quantuum Ledger Database)
- nothing to do with quantuum computing
- **ledger database** - changelog where records cannot be modified, you don't update, only insert
  - **cryptographically verifiable**
  - owned by 1 authority
- usages: **crypto, blockchain, shipping tracking, deliveries, pharmaceutical companies tracking drug distribution, financial transactions, claims history**

## Amazon Timestream
- DB for **data points logged over series of time**
- `trillions` of events per day, up to `1`k faster and `10`x cheaper than RDS
- uses: **IoT, weather stations, web traffic analysis, devops monitoring**

## RedShift
- 3 Vs of Big Data
  - **Volume: tera- to petabytes**
  - **Variety**: wide range of sources
  - **Velocity**: collection and analysis has to happen quick
- RedShift is a petabyte-scale data warehouse AWS service, for **Big Data**
- **relational** DB, **based on PostgreSQL**, but meant to be used **for OLAP workloads**
- up to `16` PB of data
- high performance, 10x better than other offerings
- **column-based** instead of **row-based** => allows efficient parallel queries
- **multi AZ** (for now only 2 AZ), but you have to set it from the start (or copy using Snapshot)
- **incremental backups** manual or automated, S3 used behind the scenes (you can't control the backup)
- always **favor large batch inserts**
- **Redshift Spectrum - retrieve Redshift data from S3 directly - allows parallel queries**, uses Redshift servers independent from your cluster
- **Enhanced VPC routing - all `COPY` and `UNLOAD` traffic between your clusters and data repositories is forced through your VPC**, enables you to use VPC Endpoints, VPC Flow Logs, etc.
- you can use **Snaphots** for PITR, or **restoration to other regions**

[1]: http://monikma.github.io/pictures/2024-03-05-aws-certified-solutions-architect-storage/storage-mindmap.png