---
layout: post
title: AWS Certified Solutions Architect - Associate (SAA-C03)
date: '2024-03-04'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 43
type: certification
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March 2024.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# Exam Guide

They put a lot of emphasis on how to pass the exam in the first place, not sure how I feel about this.
In nutshell:

- be familiar with exam structure and how different chapters are weighted for the final score
- there will be random questions about stuff that is not covered, and they are ignored for scoring
- check that whitepaper before the exam (not too early not to forget): [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)

Now I will go topic by topic/service by service.

# General knowledge

## Global Infrastructure
- around **31 Regions** - region = physical location, with 2 or more AZs
- around **99 Availability Zones** (AZs) - AZ = cluster of data centers within 100km, data center is a building with servers
- plus **215 edge locations** - edge locations are endpoints for caching - Cloud Front (content delivery)

(roughly knowing the numbers may matter)

## Shared responsibility model
- Customer: customer data, configuration, encryption, IAM, security in the cloud (anything you can control in the UI)
- AWS: security of the cloud
- Encryption is a shared responsibility - you check the checkboxes, but AWS should make it happen

# Compute
# EC2
# Lambda
# Elastic Beanstalk

# Storage

## S3 - Simple Storage Service
- Buckets must be globally unique
- But deployed to specific regions
- *Secure, durable and highly scalable object storage* - scalable because available whenever/whatever and cheap
- Only static flies, no running anything there
- Unlimited storage, each object up to **5 TB**
- URLs look like this: https://`bucket-name`.s3.`region`.amazonaws.com/`key-name`
  - Key is the key, object is the file; it's still called object-based not file-based
  - universal namespace - all bucket names must be unique across all AWS accounts
  - value is the actual data
- also can have Version ID, metadata (content type, last modified, etc)
- Data is **spread across multiple devices** to ensure: 
  - availability (99.95%-99.99%) 
  - durability (9.9999999999%, *"eleven nines"*)
- AWS CLI returns `HTTP 200` on successful upload (`PUT`)
- Static website on S3 - good when you need to scale quick, when you are not sure about the demand
    - on the bucket properties there's sth like *”host static website”*
    - you specify the index and error html
    - upload files
    - then you need to make the bucket public (see *S3 Securing* below)

### S3 Tiers
- Standard - default, minimum **3 AZ**, for frequently accessed data
- With Lifecycle Management you can automatically move your objects to cheaper Tier, or delete

### S3 Versioning
- if enabled, versioning is there even for deletion
- you cannot disable once enabled, only suspend
- properties -> bucked versioning
  - first version is null
  - previous versions are not public even if the bucket was made public
  - how to recover deleted object - show versions, check the "delete marker" and delete this one (permanently)
- can be integrated with lifecycle rules
- another way to protect from accidental deletion is MFA
- you pay per storage and access just like any other object (TODO verify)

### S3 Securing
- You can have:
  - Server side encryption
  - Access Control lists (ACLs), per object, accounts and groups can have specified access type
  - Bucket policies, per operation, but bucket wide
    - By default buckets are private. How to make a bucket public:
      - you can enable this option on both the bucket and the object (option 1)
        - uncheck “block public access” (that is done by a policy)
        - pick “ACLs enabled” in Object Ownership tab
        - bucket actions -> “make public using ACL”
      - or you can enable it for the whole bucket: permissions -> bucket policy (option 2)
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

### S3 Consistency Model
- strong "read after write" consistency - it will not read outdated file, also list operations won't
      
### S3 Storage Classes
- S3 Standard - high availability and durability - >=AZs, 99.99% availability, 99.9999..999 (11 9s)
  - websites, videos
  - as of 2024 0.023$ per GB
  - S3 Standard-IA - infrequently accessed data, 2x cheaper
    - still, rapid access
    - you pay more per access (per GB) than for the storage
    - long term storage: backups, disaster recovery
  - S3 Standard-IA with 1 AZ
    - 20% cheaper from above, for non critical data
  - S3 Intelligent Tiering - as much as Standard plus small fee for monitoring each object
    - automatically moves objects between tiers to make it cheaper, based on access patterns
- S3 Glacier - >=AZs, 99.99% availability, 99.9999..999 (11 9s), 5x cheaper than S3 Standard
  - pay per access (per GB), storage cheap
  - use only for archiving
  - optimized for very infrequent access (e.g. once a year)
  - data stored in archives and vaults, not buckets
- S3 Glacier Instant Retrieval
- S3 Glacier Flexible Retrieval - just a bit cheaper than Glacier
  - retrieval is no cost, but you may have to wait 12 hours to access
  - e.g. non critical backups
- S3 Glacier Deep Archive
  - cheapest, more than 10x cheaper than S3 Glacier
  - 12-48 hours to access
  - retain data for 7-10 years
  - e.g. legal and compliance documents

| Storage Class           | Availiability | Durability | AZs   | Use Case                                                                    |
|-------------------------|---------------|------------|-------|-----------------------------------------------------------------------------|
| S3 Standard             | 99.99%        | 11 9s      | >=3   | Most, websites, mobile&gaming apps, big data analytics                      |
| S3 S. Infrequent Access | 99.99%        | 11 9s      | >=3   | Long term, infrequently accessed critical data (backups, disaster recovery) |                 
| S3 One-Zone Inf. Access | **99.95%**    | 11 9s      | **1** | Long term, infrequently accessed non-critical data                          |
| S3 Glacier              | 99.99%        | 11 9s      | >=3   | Long term, very infrequently accessed, but quick retrieval                  |                                                        
| S3 G. Deep Archive      | 99.99%        | 11 9s      | >=3   | Rarely accessed, e.g. regulatory, retrieval from 12h                        |                                                              
| S3 Intelligent Tiering  | 99.99%        | 11 9s      | >=3   | Unpredictable access patterns                                               |

### S3 Lifecycle Management
- automatically move files to different tiers, e.g. after a period of not used (TODO how? i think this is wrong)
- can move versions independently of each other
- bucket -> Management -> Lifecycle rules

### S3 Object Lock 
- WORM model - write once, read many, not allowed to update for fixed amount of time - retention period
  - can be used for regulatory reqs
- **retention period** is put on an object version - a timestamp is added to the metadata
- Compliance mode - can't be deleted or modified by anyone, even root, no update of retention period
- Governance mode - can be updated/deleted by users with permissions, also can update the retention period
- Legal hold - like object lock, but no retention period, user just needs a permission `s3:PutObjectLegalHold` to add and remove legal hold
- **Glacier Vault Lock** - is WORM model for Glacier vaults, the vault lock policy once locked cannot be changed

### S3 Encryption
- Encryption in Transit - to and from the bucket
  - SSL/TLS -> means you use HTTPS to access it, port `443`
- Encryption at Rest - Server-Side encryption
  - SSE-S3 - S3 managed keys, AES-256, happens in the background (enabled by default)
  - SSE-KMS - AWS Key Management Service
  - SSE-C - customer provided keys
- Encryption at Rest - Client-Side encryption
  - you do it yourself before uploading
- If they ask you how to enforce server side encryption - is a wrong question as now it is by default enforced, but
  it may just be an old question
  - `x-amz-server-side-encryption` parameter should be included in the `PUT` HTTPS request header, with value `AES256` or `aws:kms`, 
    then the encryption will happen at the time of upload
  - you can also create an S3 bucket policy that denies any S3 upload without this header

### S3 Performance
- S3 Prefix - are folders in our bucket, e.g. `mybucket/folder1/subfolder1/myfile.jpg` -> `/folder1/subfolder1` is the prefix
- the S3 latency is already low, 200-300 milliseconds for first data out
- the requests per second are per prefix, so spread your prefixes (`3 500`rps for updates and `5 000`rps for gets)
- KMS also has limit though, `GenerateDataKey` for upload, and `Decrypt` for download, `5 500`rps, `10 000`rps, or `30 000`rps depending on region, no quota increase is possible
- Multipart upload
  - recommended for >`100 MB`, required for >`5 GB`
  - multipart parallelizes the uploads
- S3 Byte-Range Fetches
  - parallelize downloads, download in chunks in parallel

### S3 Replication
- used to be cross region but now is even cross bucket, for resilience
- do it for bucket
- needs to be enabled on source and target buckets
- did not work retrospectively, but now you get a prompt if you want to do it when you create the rule
- versioning is required on both buckets
- delete markers are not replicated by default, you need to enable it
- Management -> Replication rules
  - you need to specify AIM role (why?)
  - specify path to completion report, e.g. `s3//sourcebucket343425`
  - there may be a **S3 Batch Job** created to replicate existing (or also future?) objects, its folder will be created in source bucket,
    and also replicated into destination bucket

## EBS - Elastic Block Store
- Virtual hard disc attached to VM

## EFS - Elastic File Service
- Storing files centrally

## FSx
- Storage Gateway

# Databases

## RDS

## DynamoDB

- Fast flexible non relational, with consistent millisecond latency
- Supports both documents and key value data models
- Spread across 3 geographically different data centers, on SSD
- Eventually consistent reads (default, ~<1s) / strongly consistent reads / transactional reads
- Standard and transactional writes
- DAX - in memory cache, down to microseconds (10x) (with ttl)
  - You then connect only to DAX
  - Pay per request
- Partition key (PK), sort key
- "no application rewrites" - they mean you don’t have to change the code, refactor to enable global tables
- if they ask how to spread data across multiple regions - enable Global tables, it’s a tab in your table -> create replica, choose region
- if they ask about high performance DB -> is DynamoDB

### DynamoDB Security
- Encryption at rest with KMS
- Site to site VPN
- Direct Connect (DC)
- IAM policies and roles, fine grained
- CloudWatch and CloudTrail
- VPC endpoints (traffic stays in AWS)

### DynamoDB transactions
- ACID
- Across many tables
- <25 items or <4MB data per transaction

### DynamoDB Backups
- On demand, no impact on performance / availability
- Same region as the source table
- PITR - Point In Time Recovery
- Restore to any point in last 35 days down to 5 minutes, incremental backups, needs to be explicitly enabled

### DynamoDB Streams
- Time ordered sequence of item-level changes in a table, FIFO
- Each change has a sequence number, stored for 24h
- Divided into records, grouped into shards, with ids, probably by item key
- Can add lambdas, which kinda work as stored procedures

### Global tables
- Multi region, for globally distributed applications, disaster recovery and high availability
- Based on DynamoDB streams, you need to enable them first
- Multi master
- Replication latency ~< 1s

## RedShift
- DB warehousing technology

# Networking

## VPC
- Virtual datacenter in the cloud

## Direct Connect
- Directly connecting on premise to AWS

## Route53
- DNS, registering domain names and pointing them at AWS webservice

## AWS Gateway
- Serverless way of replacing your web service

## AWS Global Accelerator
- Accelerate your audiences against your application in the AWS


# IAM
- `us-east-1` is the region AWS rolls out their services first - but IAM is global
- by default: 0 users, 0 user groups, 2 roles, 0 policies, 0 identity providers 
- one user per person
- least privilege principle

## Securing root account
- add MFA, and
- create user group ‘admin’ and add users

## Creating users
- By default the user has no permissions, can only change their password
- Access Key is for command line access
- password policy you can set up in Account Settings
- the user can also login with SSO via Identity Center - e.g. active directory and stuff like this (SAML), need to set up e.g. ‘Azure Identity Federation’, or OpenID (not needed to know more here)

## IAM policy document
It defines the permissions, e.g. full access (aka `AdministratorAccess`) looks like this:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["*"],
            "Resource": ["*"]
        }
    ]
}
```
- can be assigned to: user (not encouraged), user group or role
  - assign policies to groups not single users (by job function)
- Some are managed by AWS (1115 of them)
- policy can be shared on inline (just in place of 1 group)

## Roles
- user groups are for users, assigned permanently; roles are assumed temporarily (temporary security credentials)
- role consists of 
  - permissions 
  - trust policy, which controls who can assume the role 
- the role is assigned / attached permanently but they have to assume it
  - you assign the users to the role in "add principal", this is the "role-trust relationship"







