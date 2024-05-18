---
layout: post
title: AWS SAA-C03 - Serverless
date: '2024-05-16'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 49
type: certification
draft: true
customColor: true
fgColor: "#99004d"
bgColor: "#ffe6f2"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about everything AWS that has to do with serverless: mostly Lambda and Fargate.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# Lambda
- `1000k` requests and `400k`GBs of Compute in Free Tier, afterwards **pay per request**
- integrates with DynamoDB, S3, EventBridge, SQS/SNS, Kinesis, CloudWatch
- configure **max memory** (up to `10`GB), **CPU scales with memory**
- many runtimes support
- remember to attach needed **IAM Role**
- can **optionally operate in VPC and subnet**, by default it is AWS-owned VPC with Internet access
  - usually you need to configure VPC to integrate with other services, e.g. RDS
- triggers: 
- quotas: 
  - `<1000` concurrent executions
  - `512`MB - `10`GB disc storage, can integrate with **EFS** (this was the central storage) if VPC is configured
  - `<4`KB for env variables
  - `128` - `10`GB memory
  - execution time limit `<900` seconds = `<15` minutes
  - deployment package: compressed `<50`MB, uncompressed `<250`MB
    - or you can put it on S3 and make the function reference it
  - request & response payload `<6`MB
  - streamed responses `<20`MB
- use cases: 
  - **invoke lambda when a file is put in S3** (remember IAM Role)
  - **create EventBridge rule to trigger lambda (CRON)**, and e.g. shut down dev instances

# AWS Serverless Application Repository
- users can **find, deploy and publish serverless applications, within the AWS account (this is the default private)**
  - can share privately with other organisations, or publicly
  - *publish* means make available to find (you can browse public apps even if you don't have AWS account)
  - *deploy* means actually deploy in your account, don't trust all public apps
- **Manifest file** - also called **AWS SAM Template** (which are actually CloudFormation templates)
- **integration with Lambda**

# Containers
- unit of software that packages up **code with all dependencies**, so that the application runs **quickly and reliably in various computing environments**
- why:
  - you cut down having to configure the OS each time, and include all of it for each deployment - save space
  - easier to move to different environments, "works on my machine"
  - consistent prod and dev
  - in exam rather pick containers
- terms:
  - **Dockerfile** - defines what the container includes
  - **Image** - template built from Dockerfile, immutable, contains all dependencies
  - **Docker Registry** - stores images, which can be private or public
  - **Container** - **running copy of the image**

# Fargate #serverless
- it is a serverless compute engine for running **Docker containers in ECS or EKS**
  - now both Linux and Windows container support
- needs to run on **ECS or EKS**
- EC2 vs Fargate:
  - **EC2 - you are responsible for OS, EC2 pricing model, multiple containers can share same host, long-running containers**
  - **Fargate - no access to OS, pricing by resources and time ran, isolated environment per container (good for multi tenant), for short or long running tasks**
  - both support **mounting an EFS**
  - Fargate may be more expensive
- Lambda vs Fargate:
  - **Lambda is for unpredictable workflows, event-driven, very scalable**

# Amazon Elastic Container Service (ECS)
- for **managing Docker containers**, up to 1000s containers
- will place the containers, register and unregister from LB
- ECS vs Kubernetes
  - **extremely complex large scale operations** for `100 000`s containers
  - no vendor locking, **open source**
  - Kubernetes can be used on premise or the AWS cloud (**Elastic Kubernetes Service (EKS)**)
  - **Open-Source Kubernetes in Amazon EKS Distro (EKS-D)** is a Kubernetes distribution which you can use alternatively with Amazon EKS
    - it is fully **managed by you**, as opposed to Amazon EKS (yes it makes no sense, Cloud Guru is really shitty here)
    - can be run **on premise**, or other cloud
- **can launch containers on both EC2 and Fargate**
  - for Fargate you don't pick the VPC, it's WS VPC, you don't manage the host
- **task definition** is container definition
  - **a task can have IAM role** - for your application
  - **a task has IAM execution roles** - for the ECS container and Fargate agents themselves
- launching container in AWS Console
  - create task definition:
    - pick **EC2 or Fargate**
    - you need to provide **Docker image** URL
    - container port
    - env variables (also for secrets)
    - CPU / memory
    - log collection
    - health check
  - create ECS Cluster
    - pick **EC2 or Fargate**
  - in the cluster, create Service
    - deployment configuration you can pick **service** - group of tasks for long running app, or **task** - just a job that starts and terminates
    - pick **task definition** and its **version**
    - service type: **Replica**, you can pick how many tasks
    - **VPC, subnets and security group**

# Amazon EventBridge
- formerly **CloudWatch Events**, **serverless event bus**
  - in my words - it's like Spring application events but for whole AWS
- passing **events** from different **sources** to **endpoints**
- terms:
  - **Event** - a **recorded change in AWS environment, SaaS partners or your apps, or scheduled**
  - **Rules** - criteria to **match those events** and send them to appropriate targets (based on patterns or schedules)
  - **Event bus** - is the **router**, **one default per account**, but you can create custom ones
    - the default one **always receives all the events**, your custom one can only **filter** for specific events
  - **Rule Triggers**:
    - **Event pattern**, e.g. EC2 Instance terminated, to restart it with a lambda
    - **Scheduled**:
      - **Rate-based**, e.g. every hour
      - **Cron-based**
- creating rules in AWS Console: Amazon EventBridge -> Create rule -> pick an event bus (default) -> event pattern
  - you can now pick events, and their configuration - the pattern JSON will be generated automatically, you can also have a custom one 
  - select targets - e.g. Lambda and SNS (you can pick/transform target input)
  - you can choose to **pass unprocessed events to an SQS queue (as a DLQ)**
- EventBridge is good because it is **near real time**, as real time as you can get
- custom event bus can be used for **cross account** communication

# Elastic Container Registry (Amazon ECR)
- container image registry - **Docker, Open Container Initiative (OCI)** images and artifacts
- private with permissions via IAM
- **one instance per region** in an account, can configure **cross region/account access**
- **auth token is required to pull images**, **repository policy controls all access**
- consider there is also **Amazon ECR Public** for public image repositories
- can specify **Lifecycle Policies** - e.g. rules to clean up unused images
- offers **Image Scanning** for vulnerabilities, on push, later you can retrieve **reports**
- **cache rules** - you can cache public repos privately
- image **tag immutability**, configured per repository
- **integrates with container repositories on premise**, also integrates with ECS and EKS, and **Amazon Linux containers**

# Amazon EKS Anywhere
- separate from Amazon, **on premise EKS**, the one from Amazon, based on **EKS Distro**
- **control place operated by the customer**, updates done my **manual CLI** or **Flux**
- **full lifecycle management of multiple clusters**
- **operates independently of AWS**
- offers **curated packages** that extend core functionalities of Kubernetes clusters (only Enterprise subscription)

# Amazon ECS Anywhere
- part of ECS, **Amazon ECS on premise, on your VM**, you don't have to worry about local container orchestration, completely managed
- **no ELB (load balancer) support**, you have to handle it
- new launch type: `EXTERNAL`
- requirements:
  - you need to have **SSM agent, ECS agent, Docker installed on your server**
  - **register the external instances as System Manager (SSM) Managed instances** (you need SSM activation keys)
  - you can do it all with a startup script

# Aurora Serverless #serverless
- scales up and down according to the needs
- **on demand**
- **per-second billing**
- **Aurora Capacity Units (ACUs)** 
  - each ACU is a combination of approximately `2` gigabytes (GB) of memory, corresponding CPU, and networking
  - storage scales automatically, from `10` GB to `128` TB
  - you can set **min and max ACUs** for scaling
- **AWS-managed warm pools** - for quick allocation, infrastructure shared between customers
- like Aurora Provisioned, **6 copies of data across 3 AZs**
- use cases:
  - **infrequent, intermittent or unpredictable workflows**
  - **multi-tenant apps** - adjusts capacity automatically
  - new apps, **capacity planning**
  - **dev and test** environments
  - **mixed use apps**, which cause unpredictable spikes
- it is easy to **switch between Provisioned and Serverless**

# AWS X-Ray
- gathering and viewing **insights** about application's **requests and responses**
  - also **downstream calls within AWS**
- uses **traces**, correlated by **tracing headers**, **tracing data** or **running an X-Ray daemon**
  - trace id header is called `X-Amzn-Trace-Id`
  - traces contain **Segments** which contain **Subsegments**
- **Service graph** shows all services in the request
- some % of the traces will be **dropped** for cost saving, there is some minimum defined
- **X-Ray daemon** - runs along AWS X-Ray SDK, listens on `UDP 2000`, collects raw segment data and sends to X-Ray, makes it easier
- integrates with **EC2, ECS, Lambda, Elastic Beanstalk, API Gateway, SNS, SQS** 
- uses:
  - **request insights**
  - **view how much time request took, including a queue or topic** 
  - **analyse HTTP responses**
  
# AWS AppSync
- **robust and scalable GraphQL interface**
- combining many data sources, e.g. DynamoDB, Lambda, ..
- GraphQL is a data language
- seamless integration with **React, React native, iOS, Android, ..**
- audience is **especially Frontend developers**
- uses **declarative coding**