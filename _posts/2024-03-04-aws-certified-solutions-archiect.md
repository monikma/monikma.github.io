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

# AWS Backup
- why to use it - you can backup many things in one place, consistency (mostly EC2 stuff with their various storage options)
- can create automations, lifecycle policies to expire backups, encryption of backup, overview for audits 
- can be used with AWS Organizations (multiple accounts)

## ELB (Elastic Load Balancing)
- automatically distributing traffic across multiple targets, can be across multiple AZs
- Application Load Balancers
  - HTTP & HTTP traffic, level 7 of [OSI model](https://www.bmc.com/blogs/osi-model-7-layers/) (Open System Interconnection), application aware, intelligent
  - To be configured
    - Listener - you specify protocol and port, has rules
    - Rules - a rule consists of priority, actions and condition(s) (of when is activated), as a result the traffic is sent to a Target Group
    - Target Group - routes traffic to one or more registered targets, e.g. EC2, on given port and protocol, also has a Health Check attached
    - Path Based Routing - you enable path patterns, the decision about target group is based on request path, e.g. a subpath can be routed to another server, in a different AZ
  - to use HTTPS listener you need a SSL/TLS server certificate deployed on your ALB, the ALB then terminates frontend connections, decrypts the requests from clients and sends them to the targets, you will get the certificate if you register your domain with Route53
  - EC2 -> Load Balancing -> Create Load Balancer -> Application Load Balancer -> Internet facing, IPv4, pick your VPC
    - add mappings to all the AZs where your EC2 instances are
    - add SG of your EC2 instances
    - Listener -> Create Target Group -> pick Instances type, HTTP, set up Health Checks -> pick all EC2s to register targets -> Create target Group
    - you can then see if you access the LB DNS name, one of your EC2 instances will be hit
- Network Load Balancers
  - TCP traffic, level 4 of [OSI model](https://www.bmc.com/blogs/osi-model-7-layers/), low latency, performance, millions request per second
  - it has a Target Group, picks a target and opens a connection on given port and protocol
    - supported protocols: UDP, TCP, TCP_UDP, TLS
    - supported ports: 1-65535
  - can use TLS listener for decryption / encryption, for that it also needs a SSL server certificate deployed
  - there are no LB Rules
  - fail-open mode - if all instances are unhealthy, NLB will try to send traffic to all of them
- Gateway Load Balancers
  - Network level, level 3 of [OSI model](https://www.bmc.com/blogs/osi-model-7-layers/), for inline virtual load balancing
  - not appearing in the exam
- Classic Load Balancers
  - legacy, can be used in test and dev
  - HTTP & HTTPS, and TCP
  - X-Forwarded-For header - contains the original IP address of the client, because the instance will get request from the LB
  - if LB cannot make a connection to the targets it will respond with `504 Gateway Timeout`
  - EC2 -> Load Balancers -> Create Load Balancer -> Drop Down -> Classic Load Balancer -> Create, the rest same as ALB 
  - Sticky Sessions - you can tell the LB to bind user session to a specific instance, not good if that instance dies
    - in ALB you can also have them, but on Target Group level, so you can at least have several IPs as the target
- Deregistration Delay (Connection Draining)
  - allows LB to keep existing connections open if EC2 instances are de-registered or become unhealthy, so that it can complete in-flight requests, enabled by default (you put the amount of milliseconds)

### ELB Health checks
- attach it to ELB, queries EC2 instance that is behind the LB -> "In service" / "Out of service"
- LB will stop sending requests to an unhealthy instance, and resume when it's state is healthy again

# Scaling
- horizontal scaling is good for availability
- in the exam 
    - always assume high availability for DB is needed, unless mentioned that it is not (multiple AZs is good)
    - always assume cost effective
    - assume switching to another DB is not as costly as in real life ;)
    - aim for predictive rather than reactive solutions
    - for faster boot up consider AMIs

## Auto Scaling Groups
- Auto Scaling Group is a collection of EC2 instances treated as a collective group for scaling and management
  - Auto Scaling is only for EC2, for other services it is not called like this
- configuration consists of
  - pick the launch template
  - pick purchasing options (On Demand or Spot), choose multiple AZs for availability (AWS wil automatically try to spread across them evenly)
  - ELB can be configured within the Auto Scaling Groups
    - Scaling Groups have their own simple Health Checks, but you can also use the ones from LBs
    - you would have to adjust Security Groups to allow traffic
    - including ELB health checks cause unhealthy instances to be terminated and replaced (you still need some checkbox)
  - set scaling policy: minimum, maximum and desired (=initial amount)
    - you can also build auto scaling policies, on top of this
  - you can set up notifications with SNS
- Lifecycle hooks
  - can happen on scaling out (start up), or scaling in (shut down)
  - the hooks have up to 2 hours waiting, in case you need to run some scripts on the instance before startup, or save some logs before the shut down
  - the hook have wait state (e.g. for running the scripts), and then proceed state (by sending the `complete-lifecycle-action` command)
- how to create Auto Scaling Group
  - EC2 -> Auto Scaling Groups -> Create, pick name and launch template -> select VPC and subnet(s) (remember for availability you need at least 2 AZs) -> ...
    - .. -> Instance type requirements - you can specify max and min for cpu and memory, or add instances manually, with weights
    - .. -> Instance Purchase Options - you can pick a distribution between On-Demand or Spot, if you pick both there is also sth like Allocation Strategy
    - .. -> Load Balancing - pick existing or create new one (NLB or ALB)
    - .. -> Health checks - you can add VPC and/or ELB health checks on top
    - .. -> Metrics - you can enable Auto Scaling Group metrics, and add warmup time (before the metrics get collected after startup)
    - .. -> Group size - this is the min, max, desired
    - .. -> Scaling policies - you can only pick Target Tracking here
      - you can disable scaling in here
    - .. -> Notifications - there are predefined event types
    - .. -> and wait for creation..
  - in Instance Management tab you can see the instances, and add lifecycle hooks
  - in Monitoring you can see monitoring for the auto Scaling Group as well as EC2 instances
  - in Instance Refresh tab - you can start a rolling update
  - under Automatic Scaling tab - you can adjust the scaling policy from Target Tracking to Step or Simple (all 3 of them are called dynamic tracking policies)
    - you can also enable Predictive scaling
    - you can also add scheduled actions
  - if you are changing the network interface settings, remember ([source](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html#change-network-interface))
    - security groups must be configured as part of the interface, not in Security Groups section
    - no secondary private IP addresses
    - you can only specify an existing network interface if it has device index of `0`, and in that case you can launch only 1 instance, use CLI, you have to specify the AZ but not the subnet
    - you cannot assign public IP address if you specify two network interfaces (both must be in the same subnet)
    - the address allocated to network interface comes from CIDR range of the subnet in which the instance is being launched
- Auto Scaling is vital to create a highly available application, allows multiple AZs
- pre-bake AMIs to shorten the startup times
- use Reserved Instances of Savings Plan for the minimum instances to save costs
- CloudWatch is for alerting Auto Scaling Groups to have more or less instances (you don't actually have to create any alerts explicitly)
- what is Stead State Group - when you set min=max=desired=1, this is good to assure AWS will recover it each time it crashes, good e.g. for legacy solutions

## Auto Scaling Policies
- policy types
  - None - you can pick none
  - Stepped Scaling - scaling by certain fixed amount of instances, and that amount depends on the utilization metric
  - Simple Scaling - add/remove certain % of instances, depending on utilization metric
  - Target Tracking - pick a scaling metric and the group will try to maintain it (e.g. CPU utilization should be 50%)
- Avoid Trashing - killing instances that were just created
  - you can add Warm up period, so that the instances are not being killed before they really start
  - you can set up Cooldown that pauses auto scaling for some time, if there is a massive spike, to avoid big costs
- types of scaling
  - reactive - measure the load and determine if a change is needed
  - scheduled - if you know the future workload
  - predictive - AWS uses ML to predict, every 24h updates a 48h forecast
  
## Scaling RDS
- vertical scaling incurs costs, but it's a valid solution
- you can scale storage up but not down
- read only replicas can spread the load (for failover/availability use multi AZ implementations, they will be standby instances not used until needed)
  - you can point your read operations to its endpoint
- or you can use Aurora serverless - for unpredictable workflows
- how to scale a DB
  - RDS -> pick your DB -> Actions -> Create Read Replica (will have same Security and Parameter Groups), you could
    - change the instance class (the `t3.micro` for example)
    - pick a different region
    - pick storage, and you can also pick "Enable storage autoscaling" and "max threshold" so that it does not get too big
    - pick multi AZ
  - creating the read replica will take some time..

## Scaling DynamoDB
- e.g. DynamoDB is easier
  - provisioned capacity - for predictable workloads, most cost effective
  - on demand  - for sporadic workloads, pay per read/write
- Capacity Units
  - RCU - Read Capacity Units, <= `4KB`, one strongly consistent read per second or two eventually consistent reads per second
  - WCU - Write Capacity Units, <= `1KB`, same with consistent reads like RCU
- in the console
  - when he was creating the table, the default was provisioned with 5 WCU and 5 RCU, both with default autoscaling turned on
    - there is a Capacity Calculator built in, if you want to adjust it (also shows the cost)
    - you can also switch to On Demand, you can only change it 2x in 24h
- for design for performance, avoid hot keys, know your access patterns

# Disaster Recovery Strategy
- RPO - Recovery Point Objective - how much time back can you afford your data to be lost
- RTO - Recovery Time Objective - how much time before fail over is activated
- Disaster Recovery Strategies
  - backup and restore - e.g. restore EC2 from a snapshot
  - pilot light - e.g. you already start replicating your DB to another region, but only in case of an outage you add all other components in that new region
  - warm standby - in another region you have a copy of your system just scaled down
  - Active/Active fail over - most expensive, you have 2 productions in different regions/AZs

# AWS Global Accelerator
- Accelerate your audiences against your application in the AWS

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