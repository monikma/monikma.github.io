---
layout: post
title: AWS Certified Solutions Architect - Associate (SAA-C03) - General & IAM
date: '2024-03-04'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 43
type: certification
draft: true
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about some general exam information as well some topics that did not fit in other sections.
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


# AWS Well-Architected Tool
- the Well-Architected Framework has 6 pillars:
  - **Operational Excellence**
  - **Reliability**
  - **Security**
  - **Performance Efficiency**
  - **Cost Optimization**
  - **Sustainability**
- AWS Well-Architected Tool is **measuring your architecture according to AWS best practices**
- enables **assistance with documenting workloads and architecture**
- comes with guides for making workloads **reliable, secure, efficient and cost effective**
- intended for **technical teams, CTOs, architecture and operational teams**

# General knowledge

## Global Infrastructure
- around **31 Regions** - region = physical location, with 2 or more AZs
- around **99 Availability Zones** (AZs) - AZ = cluster of data centers within 100km, data center is a building with servers
- plus **215 edge locations** - edge locations are endpoints for caching - Cloud Front (content delivery)

(roughly knowing the numbers may matter)

## Shared responsibility model
- Customer: **customer data, configuration, encryption, IAM, security in the cloud** (anything you can control in the UI)
- AWS: **security of the cloud**
- **Encryption is a shared responsibility** - you check the checkboxes, but AWS should make it happen

# AWS Backup
- why to use it - **you can backup many things in one place**, consistency (mostly EC2 stuff with their various storage options)
- can create **automations, lifecycle policies to expire backups**, **encryption** of backup, overview for **audits** 
- can be used with **AWS Organizations (multiple accounts)**

# Scaling
- horizontal scaling is good for availability
- in the exam 
    - always assume high availability for DB is needed, unless mentioned that it is not (multiple AZs is good)
    - always assume cost effective
    - assume switching to another DB is not as costly as in real life ;)
    - aim for predictive rather than reactive solutions
    - for faster boot up consider AMIs

# Disaster Recovery Strategy
- RPO - Recovery Point Objective - how much time back can you afford your data to be lost
- RTO - Recovery Time Objective - how much time before fail over is activated
- Disaster Recovery Strategies
  - backup and restore - e.g. restore EC2 from a snapshot
  - pilot light - e.g. you already start replicating your DB to another region, but only in case of an outage you add all other components in that new region
  - warm standby - in another region you have a copy of your system just scaled down
  - Active/Active fail over - most expensive, you have 2 productions in different regions/AZs

## Elastic MapReduce (EMR)
- **ETL stands for "extract, transform and load"** and are critical components of data management and analysis
  - extraction from various sources
  - transforming is reshaping that data
  - loading is storing it in the data warehouse
- we want to gain insights from that data
- EMR is an easy way to manage infrastructure for and tun ETL processes, big data platform
  - you can use open source tools like **Spark, Hive, HBase, Flink, Hudi, Presto, ..**
- storage types:
  - **Hadoop Distributed File System (HDFS)** - **distributed, scalable** for Hadoop, used for **caching results during processing**
  - **EMR File System (EMRFS)** - allows Hadoop to access **S3** as if it was another HDFS, typically for **input and output data, but not intermediate data**
  - **Local file system** - the EC2 instance's storage, wiped down when EC2 goes down
- each instance is a **node**, and they are grouped in **clusters**; node types:
  - **primary** - **manages the cluster, coordinates distribution of data and tasks, health checks**
  - **core** - **runs tasks and stores data in HDFS**, **long running**
  - **task** (optional) - **runs tasks with no storage**, usually **Spot Instances**
- pricing options:
  - **On demand** - most reliable but also expensive
  - **Reserved** - minimum `1` year, typically used for primary and core nodes
  - **Spot** - but can be terminated with little warning, for task nodes
- clusters can be **long-running or transient** (temporary)
- how to architect: the cluster will be in the subnet and VPC, the EMR service and any s3 buckets are outside, use VPC endpoint to avoid public traffic
- how to create:
  - Amazon EMR -> EMR on EC2 Clusters -> you can pick EMR release and cherry pick which tools to add
  - .. AWS Glue - *use the AWS Glue Data Catalog to provide an external metastore to your application*, and you can pick *Use for <tool name> table metadata*
  - .. cluster configuration - **groups** or **fleets**, fleets can contain a mix of instance types -> there you can configure for each node type
  - .. cluster scaling - set manually, EMR-managed or custom automatic
  - .. subnet and VPC, **security group per node type**
  - .. termination - manually or after certain idle time
  - .. bootstrap actions - for customization, adding more tools / libraries
  - .. logs - **can publish them to S3**, **can encrypt with KMS**
  - .. software settings - configuration for the toolsets
  - .. security, SHH key pair
  - .. pick an IAM role, can create a new role
  - .. pick an instance profile, can create a new profile, you need it for S3 access
  
# Kinesis
- ingest, process, and analyse **real-time streaming data**
- types:
  - **Data Streams** - **real time**, you need to implement the consumers and scale the stream yourself
  - **Data Firehose** - `~60` sec delay, **transfer data to S3, Redshift, Elasticsearch, Splunk**
    - handles scaling for you
- both types can be paired with **Kinesis Data Analytics** to transform/analyse the data realtime (using `SQL`)
  - AWS handles scaling, you pay for amount of data you pass through
- **SQS vs Kinesis**
  - **pick Kinesis when real time, even though more complicated than SQS**
  - **nearly real time -> Firehose**, **real time -> Data Streams**
  - **Kinesis can store data for up to a year**

# AWS Athena #serverless
- for analysing data in `S3` using `SQL`, **serverless**
- can also query **logs** from S3 bucket

# AWS Glue #serverless
- for **running ETL workloads without having to spin up EMR, serverless**
- you can use it with Athena:
  - **transform the S3 data with AWS Glue** - first Glue Crawlers, and then Glue Data Catalog
  - query the Glue Data Catalog with Athena
  - you can also put the data into Redshift Spectrum instead of / on top of querying it with Athena
- **Amazon QuickSight** will help to visualise the data
- you can **specify the number of DPUs (data processing units)** you want to allocate to an ETL job

# Amazon QuickSight #serverless
- **serverless BI visualisations**, create dashboards, share
- **SPICE** - robust **in-memory engine used to perform advanced calculations**, powering the Quickight
- **Column-level Security (CLS)** - only with **Enterprise** offering, better data safeguarding
- pricing is **per session and per user** basis
- you an create **users** and in Enterprise version also **groups**, that you can share **dasboards** with
- if a user sees the dashboard they can also see the **underlying data**
- you can integrate it with **Athena**, but also RDS, S3, and more

# AWS Data Pipeline
- is a **managed ETL service for data transformation, data-driven workflows**
- integrates with **EC2 and EMR**, **DynamoDB, RedShift, RDS, and S3**, **SNS for notifications**
- has **automatic retries**
- you can **schedule** each stuff independently
- you define **parameters** for the workflows, you have **Pipelines**, **Managed Compute (EC2)**, **Task Runners (EC2) poll for tasks**, **Data Nodes** with locations and data types for input/output, **Activities** are the components that define the work to perform
- **highly available**, **distributed** and **fault tolerant**
- use cases:
  - **Processing data in EMR using Hadoop streaming**
  - **Importing or exporting DynamoDB data**
  - **Copy CSV files between S3 buckets**
  - **Export RDS data to S3**
  - **Copying data from S3 to RedShift**
  
# Amazon Managed Streaming for Apache Kafka (Amazon MSK)
- (this lesson in Cloud Guru is just a disaster)
- ingest and process streaming data in real time with **fully managed Apache Kafka**
- **control plane operations**: something creates, updates and deletes clusters for you
- **data plane operations**: you care about this part only
- support for existing apps, tools and plugins, something with open source Kafka, don't get it
- concepts:
  - **Clusters**, containing Broker Nodes  
  - **Broker Nodes** - you specify the **amount per AZ**
  - **ZooKeeper Nodes** - are created for you
  - **Producers**, **Consumers** and **Topics** - that is also data plane something
- **resilient**: **automatic detection and recovery from failures** (mitigation or replacement of unhealthy nodes)
  - IP stays the same
- **MSK Serverless** - offers **serverless cluster management**, provisioning and scaling
- **MSK Connect** - stream data from/to **AWS services** and/or **external sources**
- encryption:
  - **encryption at rest by default, Server Side Encryption with KMS**
  - **encryption by default in transit TLS 1.2** between brokers in clusters
- logging to CloudWatch, S3, Kinesis Firehose
- logs all **API calls to AWS CloudTrail**
- metrics sent to CloudWatch by default

# OpenSearch
- is a successor to **Amazon ElasticSearch**, you can see both in the exam, interchangeable
- for running **search and analytics engines**
- commonly part of **ETL** process
- **highly scalable**
- **multi AZ** with master nodes and automated snapshots
- can be queried with **SQL**
- integrates with **CloudWatch, CloudTrail, S3, Kinesis**
- you can feed data from various services to it and then analyse, even real time insights
- good for **visualising logs for BI**

# CloudFormation
- **infrastructure as code**, and all the well known pros of it, and pros of automation
  - **immutable infrastructure**
  - has UI called **CloudFormation Designer**
- not all resources are supported
- **templates are** in `yaml` or `json`
  - you then deploy them as **Stack** or **Stack Set** (multi region/account)
  - you can have first just a **preview** of a Stack
  - a Stack can **be replicated to multiple regions and even accounts** (**portable Stack**)
- **tags** help you track what was created by which Stack
- **template sections**:
  - `AWSTemplateFormatVersion` (optional), now `2010-09-09`
  - `Parameters` (optional), to dynamically create resources based on input values
  - `Mappings` (optional), to look up values, e.g. to map regions to AMI ids
  - `Resources`, the actual resource definition and their configuration
  - `Outputs` (optional), values to reference to by other Stacks in your account
  - `Transform` (optional), to specify **macros (transforms)** that modify the template before it is processed
- in AWS Console:
  - CloudFormation -> Stacks -> Create stack (**you can import from existing resources**) 
  - you can upload a template (with S3), or use the Designer (pick it)
    - in the Designer, click **Validate**, and **Upload** (will **store the Template in S3**)
  - you can next pass **Parameters**
  - you can add tags
  - you can attach an **IAM Role**
  - pick **Stack failure options** - roll back all or keep the ones which succeeded
  - Advanced Options 
    - add **stack policy**, to ignore certain changes to some resources, to protect them
    - **rollback configuration** - can add CloudWatch alarms on failure
    - **notification options** - add notifications, SNS topic
    - **Timeout** - stack creation timeout
    - **Termination protection** - protect Stack from deletion by accident
  - you can then see the progress in **Events** tab, resources in **Resources** tab, also **Outputs**, **Parameters** that were passed in, **Template**, and view **Change sets**
  
# ElasticBeanstalk
- automated deploying and scaling web applications
- it's **PaaS - you only supply the code**, the provider takes care of deploying and managing it
- supports
  - languages: **Java, .NET, PHP, Node.js, Python, Ruby, Go**
  - platforms: **Apache Tomcat and Docker**
- provisions also resources like ELBs, Auto Scaling Groups
- **automatic updates of app servers**, **monitoring**, **metrics**, **health checks** are included
- you can choose **how much administrative control you want to take**
- for simpler scenarios than CloudFormation

# Systems Manager (SSM)
- **manage and maintain EC2 instances**, including **on-premise**
- **System Manager Agent** - installed on the instance
- SSM capabilities:
  - **automation** - streamlines resource management
  - **Run Command** - remotely execute SSH scripts, without SSH
  - **Session Manager** - securely connect to the compute without SSH access
  - **Patch Manager** - automates OS and application patches
  - **Parameter Store** - for secrets and configurations
  - **maintenance windows** - can be scheduled by you, e.g. for patch updates
- **Session Manager**
  - **logs all connections and commands run on instance** to CloudWatch & CloudTrail
  - **SSM Agent** - **both Linux and Windows**, the plus is you don't have to open any ports
    - supports **EC2, edge devices (AWS and non-AWS IoT), on-premise servers, custom VMs**
    - **preinstalled** on many AMIs
    - need to ensure you have the right **IAM permissions**
- AWS Console: 
  - notice we will connect without SSH, even without inbound Security Groups
  - but we **need IAM permissions**: EC2 instance profile has `AmazonSSMManagedINstanceCore` policy attached
  - then you click in EC2 on **Connect -> Session Manager**
  - Systems Manager -> Run Command - there you can see a lot of command types, select shell script
    - enter your script and working directory
    - how to reference a parameter: `{{ssm:/dev/squid_conf}}`
    - select targets: EC2 instances, by tags or by resurce group
    - timeout, rate control, you can enable S3 and/or CloudWatch logs
    - -> Run, you will get an **execution id**
  
# CloudFront
- in general, **caching can be internally (e.g. DB) or externally (e.g. CDN)**, this is **external one**
- **CloudFront is a Content Delivery Network (CDN)**, and is using **AWS edge locations (100+ of them)**
- **defaults to HTTPS connection**, allows **custom SSL certificate**
  - note this way you get a **secure connection** on your S3 buckets for example, e.g. **static website**
- you can pick **general areas** but not specific countries to distribute your content to (**groups of continents**)
- can be used with **non AWS endpoints**, can be used with **on-premise**
- can **force expiring** the cache before TTL
- you can **restrict access to your content** using CloudFront, by using **pre-signed URLs or cookies** (only S3?)
- you can **attach a WAF to your CloudFront distribution** (the input is called WAF web ACL)
  - note this is a **valid use case for security** even if the performance was not the requirement
- AWS Console:
  - CloudFront -> distribution -> create 
    - pick **origin** e.g. S3 bucket
    - after creation you can see the **distribution domain name**, which you can open in the browser
- in the exam, use for any **customer website performance issues**

# ElastiCache (Memcached / Redis)
- managed version of 2 opensource technologies: **Memcached** and **Redis**
- for **caching DB queries** (works best with **RDS**)
- **Memcached is just a cache
- **Redis** can also work as a **standalone NoSQL database**, including:
  - **failover**
  - **multi A-z**
  - **backups**
- **Redis** is another in-memory database, next to **DynamoDB** (bur **DynamoDB is usually preferred as standalone**)
  
# Global Accelerator (GA)
- sends user's traffic through **AWS global network infrastructure** via **accelerators** (aka routing points)
  - much faster
  - **UDP and TCP traffic**, not HTTP like CloudFront - **e.g. gaming and IoT**
- terms:
  - **Accelerator** - directs the traffic to the optimal AWS **Endpoints**
  - **Listener** - processes inbound connection based on ports and protocols
- routing type:
  - **Standard** - based on location, health checks and weights
  - **Custom** - traffic routed to specified EC2 instances and ports in a VPC, in the application logic - for gaming, where there are groups of users interacting in a session
- **AWS GA** will create **2 global accelerators** across the globe
  - an accelerator leverages a **point of presence** or an **edge location**
  - you get **2 Anycast IP  addresses assigned**, to be used within your routing logic and DNS configuration
  - you are provided **two Anycast IP addresses** or with dual stack **four: 2 IPv4 and 2 IPv6**
  - **static IPs act as a single**, fixed entry point for ALL client traffic
    - the client can therefore use a **IP caching**, and you are still free to change what's behind (also relevant for **failover**)
  - the accelerators direct traffic to the most optimal UPD / TCP endpoint of your application (according to the routing type)
  
# AWS Snow Family
- moving data to Cloud **over Internet** can have drawbacks (security, speed, reliability)
- **peta-scale**, AWS ships **physical hard drives to you**, and you send tem back
- types of services:
  - **Snowcone** 
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

# AWS Amplify
- tools for frontend and mobile devs to **quickly build full stack apps on AWS**
- **Amplify Hosting**
  - support for **single page application (SPA) frameworks: React, Angular, Vue.js**, also **Gatsby and Hugo** static site generators
  - separate staging and prod env
  - **server-side rendering support, e.g. Next.js** (can't do this just with S3 static website)
- **Amplify Studio**  
  - quickly **implement auths in your app**
  - **visual development**
  - **ready to use components**
  
# AWS Device Farm
- **testing service, for Android, iOS and web**, AWS runs it on actual phones
- testing methods:
  - **automated** - parallel tests based on scripts
  - **remote access** - on the browser you can actually use the phone, for manual testing
  
# Amazon Pinpoint
- **engage with customers over different messaging channels**, **for marketers, business users**, rarely developers
- features:
  - **Projects** - information, segments, campaigns, journeys
  - **Channels** - how you message your clients
  - **Segments** - customer groups, dynamic or imported
  - **Campaigns** - initiatives for specific Segments, using tailored messages
  - **Journeys** - customized, multi-step engagements
  - **Message templates**
- you can leverage ML for user patterns
- use cases:
  - **marketing**, **bulk communication**, **non-bulk communication**

# Amazon Elastic Transcoder
- **to change media files format/encoding, to be optimized for target devices**
- scalable on-demand

# Kinesis Video Streams
- **stream media content from a large number of devices (millions) to AWS**
- can later run **analytics, ML, playback**
  - e.g. those door cameras that recognise when there is a person (**smart home, smart cities**)
  - or, **LIDAR** radar data processing
- **scalable, encrypted and indexed data**

# Amazon Comprehend
- ML for **Natural Language Processing (NLP)**, sentiment analysis
- **call center customer satisfaction, reviews, legal documents search, insurance claims, financial documents**

# Amazon Kendra
- **intelligent search service with ML, search across enterprise data, connecting silos**
- search in **S3 buckets, file servers, websites**
- can be used to **provide better search results to customers, analyse new compliance laws, better internal search in the company**

# Amazon Textract
- **use ML to extract text from handwritten documents**
- use for **processing handwritten applications, health insurance claims, tax return forms**

# Amazon Forecast
- **use ML to predict time-series data**
  - automatically select the **right machine learning algorithm**  
- can use in **IoT, website analytics, devops monitoring** 

# Amazon Fraud Detector
- **AI service to detect fraud in your data**, you train a model first
- e.g. **suspicious online payments, suspicious user accounts, prevent users abusing free trial, account takeover detection**

# Amazon Transcribe
- **convert speech to text**
- **generate subtitles**

# Amazon Polly
- **turns text to speech**, variety of languages and accents

# Amazon Lex
- **build conversational interfaces using natural language models**
- **chat bots at customer service**, also phone bots
- you can use your **existing scripts**
- **A-Lex-a** is using `Amazon Transcribe -> Amazon Lex -> Amazon Polly` :)

# Amazon Rekognition
- **analysing images**
- **picture and face recognition, deep learning, neural networks**
- also for **content moderation (family filter)**, recognising **people on camera**, **celebrity recognition**

# Amazon SageMaker
- for **training and deploying ML models in the AWS Cloud**
- sections: 
  - **Ground Truth** - set up and manage labeling jobs for training datasets, active learning and human labeling
  - **Notebook** - managed **Jupyter Notebook environment**, for writing your **python** algorithms
  - **Training** - train models
  - **Inference** - package and deploy models **at scale**
- deployment types:
  - **online usage** - for a model that has to respond to real-time data
    - **synchronous or real-time**
    - uses SageMaker hosting services
    - low latency predictions
    - various inputs, output is always **JSON**  
  - **offline usage** - if you don't need immediate response
    - **asynchronous or batch**
    - uses SageMaker batch transform
    - various inputs and outputs
- stages:
  1. **create a model**
    - **Training**
      - the data can come from **various sources**
      - the ML Training Container (from Container Registry) is started
      - the **Model Artifacts are put in S3**
    - **CreateModel**
      - you put the **data + the training model + inference container** into **SageMaker** and then you actually get the model (online or offline model)
      - you can also **buy ready models**
  2. **configure endpoint (production variant)** - pick the model, inference instance type, instance count, variant name and weight
  3. **create endpoint** - the model is **published and you can invoke** it with `InvokeEndpoint()` method
- **SageMaker Neo** - customize your ML models created by third party (e.g. TensorFlow), for specific hardware, e.g. **ARM, Intel, NVIDIA** (a compiler will convert the model so that it is optimized to the target architecture)
- **Elastic Inference (EI)** 
  - **speeds up throughput and decreases latency of the online models**
  - **only uses CPU-based instances** (not expensive GPU)
  - **good for reducing cost**
  - only for some algorithms
- automatic **scaling**
- high **availability** - you can deploy it in another AZ if the first one fails

# Amazon Translate
- **translate content into different language**
- deep learning and neural network
- continuously improving and highly accurate they say
- easy to integrate
- cost effective compared to human translators
- **scalable**

--------------------------------
Following are the unsupported life cycle transitions for S3 storage classes 
  Any storage class to the Amazon S3 Standard storage class. 
                           Reduced Redundancy storage class. 
  The Amazon S3 Intelligent-Tiering storage class to the Amazon S3 Standard-IA storage class. 
  The Amazon S3 One Zone-IA storage class to the Amazon S3 Standard-IA
                                                 Amazon S3 Intelligent-Tiering storage classes.

Here are the supported life cycle transitions for S3 storage classes - 
  The S3 Standard storage class to any other storage class. 
  Any storage class to the S3 Glacier or S3 Glacier Deep Archive storage classes. 
  The S3 Standard-IA storage class to the S3 Intelligent-Tiering or 
                                          S3 One Zone-IA storage classes. 
  The S3 Intelligent-Tiering storage class to the S3 One Zone-IA storage class. 
  The S3 Glacier storage class to the S3 Glacier Deep Archive storage class.

waterfall model: https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html

Standard, Standard IA, Intelligent, One Zone IA, Glaciers