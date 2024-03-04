---
layout: post
title: AWS Certified Solutions Architect - Associate (SAA-C03)
date: '2024-03-04'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 41
type: course
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
- check that whitepaper before the exam (not too early): [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)

Now I will go topic by topic/service by service.

# General knowledge

## Global Infrastructure
- around **31 Regions** - region = physical location, with 2 or more AZs
- around **99 Availability Zones** (AZs) - AZ = cluster of data centers within 100km, data center is a building with servers
- plus **215 edge locations** - edge locations are endpoints for caching - Cloud Front (content delivery)

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
- Unlimited storage, each object up to **5TB**
- URLs look like this: **https://bucket-name.s3.region.amazonaws.com/key-name**
  - Key is the key, object is the file; it's still object-based not file-based
- Version ID, metadata (content type, last modified, etc)
- Data is **spread across multiple devices** to ensure: 
  - availability (99.95%-99.99%) 
  - durability (9.9999999999%, *"eleven nines"*)
- AWS CLI returns 200 on successful upload
- Static website on S3 - good when you need quick scale
    - on the bucket properties there's sth like *”host static website”*

### S3 Tiers
- Standard - default, minimum **3 AZ**, for frequently accessed data
- With Lifecycle Management you can automatically move your objects to cheaper Tier, or delete

### S3 Versioning
- if enabled, versioning is there even for deletion

### S3 Securing
- You can have:
  - Server side encryption
  - Access Control lists (ACLs), per object, accounts and groups can have specified access type
  - Bucket policies, per operation, but bucket wide
  - By default buckets are private. How to make a bucket public:
    - enable this option on both the bucket and the object (option 1)
      - uncheck “block public access” (that is done by a policy)
      - pick “ACLs enabled” in Object Ownership tab
      - bucket actions -> “make public using ACL”

### S3 Consistency Model
- strong "read after write" consistency - it will not read outdated file, also list operations won't

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







