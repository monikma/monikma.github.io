---
layout: post
title: AWS SAA-C03 - Decoupling and Serverless
date: '2024-05-10'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 48
type: certification
draft: true
customColor: true
fgColor: "#996633"
bgColor: "#f2e6d9"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about everything AWS that has to do with decoupling and serverless: SQS, SNS, API Gateway, Lambda, and so on.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# Loose coupling
- **having an ELB in front of your instances is already considered loose coupling**
- apart from it you can have:
  - SQS
  - SNS
  - API Gateway
- in the exam, always choose loose coupling, and make sure it is loose all the way

## AWS SQS
- Poll-Based Messaging - the consumer polls for messages
- **delivery delay** - **default 0**, up to `15` mins
- message size `256` KB by default
- encryption
  - messages are **encrypted at transit by default**
  - encryption **at rest** is called **Server Side Encryption (SSE-SQS)**, 
    - it is not enabled by default? - you can enable it for HTTPS endpoints for free, also FIFO
    - actually this I see IS enabled by default, so it is a bit confusing..
- message **retention, default 4 days, min 1 minute, max 14 days**
- polling
  - **short (default)** - separate connection for each check, also billed for each API call
  - **long (better)** - you specify connection time window, and the app waits a bit for messages
- **queue depth could be a trigger of autoscaling** (of the consumer)
- **visibility timeout** - message is locked for **30 seconds**, when the message is in the queue, but no one can see it, as one instance already said it will process it, only when it is processed it will be deleted
- DLQs - for failed messages, SQS & SNS, for debugging, you can **redrive messages**, a **DLQ for FIFO must also be FIFO**
  - you can set Cloud Watch alarms
    - e.g. DLQ would highlight missing permissions for consumer
  - you can add some identifier to search in logs (did not get that)
  - original message is wrapped in another message in DLQ
  - how to create
    - you create as a normal queue
    - **access policy** - specify who can send and receive from the queue - only the owner, specific accounts/roles/users, or completely custom JSON
      - you also need to configure **role on that resource** that will be sending the messages, with proper policies
    - **redrive policy** - which queues can use it as DQL - all, none or concrete queues
    - when you create a normal queue, then you set in dead-letter-queue section the **DQL for undeliverable messages**
      - **max receives** - how many times can I receive same message before I damn it undeliverable (default `10`)
- remember to set up an alarm on DLQ depth

### FIFO SQS
- normal SQS offers best effort order, so they may be out of order
- FIFO SQS is **in order always**
- FIFO assures **no duplicate messages** (**deduplication id**s during **deduplication interval**, you have to turn it on)
- but only `300` transactions/second (can use batching though, which can increase it to `3000`/s), as compared to unlimited with normal SQS
- you can enable **FIFO High Throughput** (any time), which is `9000` messages/s (even without batching)
- **batching is best practice**
- the name is suffixed with `.fifo`
- you can set up **deduplication scope** (all messages, or with same **message group id**) and FIFO throughput limit, but only if you did not enable FIFO High Throughput
- a **DQL has to be FIFO** too
- in the exam, if you see message ordering, it is probably FIFO
- FIFO is more expensive
- message group id can be used for ordering inside given groups

## SNS
- push-based messaging, sent to consumers (subscribes) immediately, one-to-many
- subscribers can be: **Kinesis Data Firehose, SQS, Lambda, email, HTTP(s), SMS**, etc.
- message size <=`256` KB
- can use **SQS DLQ for failed messages**
- you can have **FIFO topics, but only FIFO SQS can subscribe**, they also offer deduplication
- messages are **encrypted in transit by default**, and can be **encrypted at rest with AWS KMS keys**
- you can add **resource policies** to your SNS topic, e.g. needed for cross account access
- **Large Message Payloads** - SNS Extended Library allows sending messages up to `2`GB, by storing the payload on S3, and publishing the reference to it only
- SNS uses **SNS Fanout** - all subscribers are notified simultaneously
- **message filtering** - by defining **JSON filter policy** you can filter for each subscriber, based on content and message attributes
- creating SNS topic
  - you also specify **access policy** like for SQS
  - server side encryption is here not enabled by default indeed
  - data protection policy - out of scope..
  - **delivery policy** - configure retries when sending to HTTP/S endpoints
    - custom **retry policy** is available only for HTTP(s) endpoints
  - **delivery status logging** - log delivery (you would need to give permissions for SNS to write to Cloud Watch)
  - you can enable **active tracing** - you can enable **AWS X-Ray to trace the request** and see how long SNS it taking 
  - when you add **subscription in the console, the permissions will be added automatically**
    - except email subscriber, then the email owner needs to confirm
  - redrive policy - the DQL
- in the exam
  - **real time alerting, push based message application -> SNS**

# AWS Gateway #serverless
- serverless service to create APIs for your services
- supports **versioning**
- API types:
  - **REST API** - API keys, per-client throttles, validation of requests, WAF integration
  - **HTTP API** (is also REST of course) - cheaper but less options
  - **Web Socket API** - WebSocket routes that can be integrated with AWS services
- endpoint types:
  - **Edge-optimized** (default) - API requests go via CloudFront edge location, best for global users
  - **Regional** - for clients in the same region, can use CloudFront
  - **Private** - only accessible via **VPC Endpoints**
- security:
  - can use **IAM roles, Amazon Cognito, custom authorizer as a lambda, and many more**
  - **you can configure custom TLS via AWS Certificate Manager (ACM)** 
    - Edge-optimized requires certificates in `us-east-1`, Regional in the same region
  - **API Gateway and Web Application Firewall (WAF)** help protect you from a **DDoS attack** (you can set rate limiting)
- so API Gateway would sit behind a CloudFront, if you want to route to S3 also for big files, you would not pipe it via API Gateway though
- how to create:
  - API Gateway -> APIs -> Create API -> REST API -> New API (you can import from OpenAPI)
    - pick endpoint type, Create
    - pick Create method -> GET -> Integration type e.g. Lambda function -> ..
      - for lambda also check "Lambda proxy integration" to have the event sent as a structured JSON
      - default timeout is `29` seconds
      - in console the permissions for API Gateway to invoke the lambda are added automatically
    - go to the Test tab - there you can test it
    - you now need to **Deploy API** in order for it to be available publicly
      - pick a stage or create a new one (e.g. `dev`)
      - you can now access it from the browser; you could set a custom domain name
- in the exam, always favor **API Gateway** over hardcoding access and secret keys

# AWS Batch
- managed service for running **Batch Compute workloads on AWS**, in simple and scalable way
  - the more jobs the more resources will be provisioned
  - AWS will **optimize the distribution** of the workloads
- runs on **EC2 or ECS/Fargate**
- terminology:
  - **Job** - unit of work sent to AWS, can be a shell script, executable, Docker image
  - **Job Definition** - blueprint for the job resources
  - **Job Queue** - where your job is submitted until scheduled
  - **Compute Environment** - set of Compute resources to run your job
- EC2 vs ECS/Fargate:
  - **ECS/Fargate is recommended for most workloads**, fast start time (`<30`s), `<16`vCPU, no GPU, `<20`GB memory
  - **EC2** - if you need more **control** over instance selection, GPU, Elastic Fabric Adapter (EFA), custom AMI, high concurrency rates, Linux Parameters acces s
- managed vs unmanaged Batch Compute Environments
  - **managed**: AWS manages **instance types** and **capacity** based on your env specs, **you choose VPC and subnets**, **you can use custom AMI (default is most recent approved ECS AWS AMI)**, you can mix in **Fargate*EC2 Spot Instances** to lower the costs
  - **unmanaged**: AMI must meet ECS AMIs specs, you manage everything, **for very specific reqs**
- AWS Batch is an **alternative to AWS Lambda**
  - **time limit** - lambda is max `15`min
  - **disc space** - lambda has limited one, and can only use EFS if it lives in a VPC
  - **lambda has** limited runtimes, AWS Batch has Docker (all runtimes)
- how to design the architecture:
  - for example lambda picks up the file from S3, downloads a Docker image that will process it and submits it to the AWS Batch

# Amazon MQ
- for **migration of existing message broker apps** to the cloud
- many programming languages, operating systems and messaging protocols (e.g. **JMS, AMQP, MQTT, OpenWire, Stomp**)
- **highly available**, supports following engine types:
  - **Apache ActiveMQ** - **1 instance available all the time, with standby/active deployment**, you configure a network of brokers with separate maintenance windows
  - **RabbitMQ** - **cluster deployments**, logical groupings of `3` broker nodes across different AZs
- offers one-to-one or one-to-many messaging
- SNS+SQS vs Amazon MQ:
  - use Amazon MQ only for migrating **existing** app, from scratch better use SQS+SNS
  - **Amazon MQ requires private networking, like VPC, Direct Connect or VPN**
  
# Step Functions #serverless
- is a serverless orchestration service, combining many AWS services, with a graphical console
- meant for **  event driven task executions**
- defined in **Amazon States Language**
- components:
  - **state machine** - workflow with event-driven steps
  - **state** 
    - every step is a state
    - has a unique name (within the state machine)
    - make decisions on input, perform an action, or pass output
      - state types: **Pass**, **Choice**, **Task**, **Wait**, **Succeed** (stops execution successfully), **Fail**, **Parallel**, **Map** (set of steps based on an input array)
  - **task** - state in the workflow that represents a single unit of work
  - **executions** - instances where you run your workflows
- workflow types:
  - **Standard workflow**
    - exactly `1` execution (no duplicates)
    - can run up to `1` year
    - `<2000` executions per second
    - **billed by state transition**
    - **good for long running workflows with auditable history**
  - **Express workflow**
    - at least `1` execution (can get duplicates)
    - can run up to `5` minutes
    - **billed by number of executions, durations and memory consumed**
    - **good for high event rate workloads, e.g. IoT streaming and ingestion**
- in the exam, think of Step Functions when you need a **wait period**

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
  
# Questions to ask yourself in the exam
- is it sync or async
- do you need push/pull, one to one or to many, do you need a workflow
- does message order matter
- what load is expected (consider service limits)

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
- in AWS Console: you also have **Layers**, and **Applications**

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