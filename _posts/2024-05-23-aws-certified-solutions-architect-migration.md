---
layout: post
title: AWS SAA-C03 - Migration
date: '2024-05-23'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 51
type: certification
draft: true
customColor: true
fgColor: "#2d862d"
bgColor: "#c6ecc6"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS solutions that ease data migrations and/or offer hybrid storage.
</div>

<h1>Table of contents</h1>
<div markdown="1">
  <a href="#aws-snow-family" class="mindmap mindmap-new-section" style="--mindmap-color: #2d862d; --mindmap-color-lighter: #c6ecc6;">
    `AWS Snow Family`
  </a>
  <a href="#storage-gateway" class="mindmap" style="--mindmap-color: #2d862d; --mindmap-color-lighter: #c6ecc6;">
    `Storage Gateway`
  </a>
  <a href="#aws-datasync" class="mindmap" style="--mindmap-color: #2d862d; --mindmap-color-lighter: #c6ecc6;">
    `AWS DataSync`
  </a>
  <a href="#aws-transfer-family" class="mindmap" style="--mindmap-color: #2d862d; --mindmap-color-lighter: #c6ecc6;">
    `AWS Transfer Family`
  </a>
  <a href="#aws-migration-hub" class="mindmap" style="--mindmap-color: #2d862d; --mindmap-color-lighter: #c6ecc6;">
    `AWS Migration Hub`
  </a>
  <a href="#aws-application-discovery-service" class="mindmap" style="--mindmap-color: #2d862d; --mindmap-color-lighter: #c6ecc6;">
    `AWS Application Discovery Service`
  </a>
  <a href="#aws-application-migration-service-aws-mgn" class="mindmap" style="--mindmap-color: #2d862d; --mindmap-color-lighter: #c6ecc6;">
    `AWS Application Migration Service (AWS MGN)`
  </a>
  <a href="#amazon-appflow" class="mindmap" style="--mindmap-color: #2d862d; --mindmap-color-lighter: #c6ecc6;">
    `Amazon AppFlow` `data exchange between AWS and SaaS app` `flow` `data mapping` `filters`
    `trigger: on demand, on event, on schedule` `<100 GB`
  </a>
</div>

# AWS Snow Family
- moving data to Cloud **over Internet** can have drawbacks (security, speed, reliability)
- **peta-scale**, AWS ships **physical hard drives to you**, and you send tem back
- types of services:
  - **Snowcone** AWS DataSync
    - you also get a Compute to process and download your data first
    - smallest EC2, `8`TB storage, `4`GB memory, `2`v2CPUs
    - direct **IoT sensor integration**
    - good for edge computing where **power and space are constrained**
  - **Snowball Edge** 
    - storage of `48`-`81`TB
    - optionally small Compute, **GPU flavors**
    - e.g. on a boat where you **don't have good connection, or one time migration**
    - for databases, can be used in conjunction with **Schema Conversion Tool (SCT)** to move data to S3, and DMS can move it from S3 to the AWS DB
      - still compatible with CDC (how?)
  - **Snowmobile**
    - `100`PB of data, **exabyte-scale**
- in exam also **data encrypted at rest and in transit** could qualify for Snow Family
- all offerings works **both directions** (to migrate to and from AWS)
  - usually takes about **a week**

# Storage Gateway
- **hybrid cloud storage service**
- can help with **one time migration** or to **have the hybrid storage permanently**
- AWS **provides VMs**, transfer over **HTTPS**
- offerings:
  - **File Gateway** 
    - **network file share, NFS or SMB**
    - **data backup**
    - put **all data** or still **cache most recently used** on-premise (Cached File Gateway)
      - helps when there is **not enough storage**
    - uses **S3**
  - **Volume Gateway**
    - **iSCSI mount**
    - also **cached or stored mode**
    - **uses EBS snapshots**, you can restore the volume in AWS
  - **Tape Gateway**
    - to move existing **tape-based storage / backup** to AWS
    - uses **S3 / S3 GLacier**
- on exam, favor answers that mention **complete migration**

# AWS DataSync
- **agent-based solution for migrating on-premise to AWS** (from NFS or SMB)
- for **one-time** migration
- transfer between the agent and AWS DataSync is via **TLS**
- pick e.g. **S3, EFS, or FSx** on AWS side

# AWS Transfer Family
- easily move files **in and out** of **S3 / EFS**, using **SFTP, FTPS or FTP**
- the **legacy** client endpoint can still look like **SFTP, FTPS or ~~FTP~~**, but there is another service on AWS side
- the **DNS entry stays the same**

# AWS Migration Hub
- a GUI to **track the progress of SMS and DMS migrations**
- **Server Migration Service (SMS)**
  - you have a VM in your datacenter, and want to move it to AWS
  - you **schedule** when your data will be copied: **S3 -> EBS snapshot -> AMI**
- **Database Migration Service (DMS)**
  - **in or out** of AWS migration
  - **RDS and NoSQL**
  - **one time migration (Full Load), or ongoing replication (Change Data Capture (CDC)), or both**
    - **CDC guarantees transactional integrity of the target DB**
  - you can use **Schema Conversion Tool** for translation to another DB engine
    - that tool supports **OLAP** and **OLTP** dbs, as well as **data warehouses**
    - on AWS side, you can import to any RDS, also RedShift
      - you can run the migrated DB even on EC2
  - you have a **DMS server** which is running the migration software, you **schedule tasks**, you can **create the schema yourself or leave it up to DMS**
  - the source and target are called **endpoints**
- there are als third party solutions available
- AWS Console: **AWS Migration Hub** -> Get started with discovery / Get started migrating
  - discovery: import data, view discovered servers, group servers as applications
    - **discovery agent** - you install it on your VMs
    - **discovery connector** - you install it in your vMWare VCenter, it collects info about your VMs

# AWS Application Discovery Service 
- helps planning of the **migrating to AWS**, by **collecting your on-premise configuration and usage data**
- integrates with **AWS Migration Hub**, simplifies migration tracking
- you can **group discovered servers and view migration status by application**
- discovery types:
  - **agentless** - via an agentless collector: **OVA file within
    the VMWare vCenter**
    - collects **IP and MAC addresses, resource memory/CPU allocations, hostnames, ..**
    - collects many **utilisation data metrics**, including disc I/O
  - **agent-based** - install this agent on eah of the VMs and each of your servers
    - both **Linux and Windows** versions
    - collects more info: on top **static config data, time-series performance info, network connections, OS processes**

# AWS Application Migration Service (AWS MGN)
- **migrate your infrastructure and services to AWS with minimal changes**
- used to **avoid cutover windows and disruptions**
- for **physical, virtual or cloud servers**
- replicates **source servers into AWS and automatically launches them when you are ready**
- **Recovery Time Objective (RTO)** - how quick to restore normal operations, depends on OS boot time, typically minutes
- **Recovery Point Objective (RPO)** - how much data back in time can be lost, sub second range

# Amazon AppFLow
- integration service, for data exchange between AWS and SaaS app
  - e.g. for migrating data from Salesforce to S3
- you define how to **ingest data and put them in an AWS service**, or the other direction (**bi-directional**)
- terms:
  - **Flow** - transfers data between source and destination
  - **Data Mapping** - how source data is stored in the destination
  - **Filters** - criteria which data records are transferred to the destination
  - **Trigger** - how the flow is started: **on demand**, **on event** or **on schedule**
- first you establish a con nection
- can use `<100`GB per flow of data transfer
- use case examples:
  - **transferring Salesforce records to Redshift**
  - **ingesting and analysing Slack conversations and storing them in S3**
  - **migrating Zendesk support tickets to Snowflake**
  - **transfer aggregated data on a scheduled basis to S3**
  - generally, **easy and fast** SaaS/third party data transfer from and to AWS, especially on **schedule**
