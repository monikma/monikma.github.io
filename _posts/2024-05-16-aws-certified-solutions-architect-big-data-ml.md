---
layout: post
title: AWS SAA-C03 - Big Data & ML
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
fgColor: "#4d4d4d"
bgColor: "#d9d9d9"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS solutions related to Big Data/ETL processing and leveraging ML to build your own solutions.
</div>

<h1>Table of contents</h1>
<div markdown="1">
  <a href="#elastic-mapreduce-emr" class="mindmap mindmap-new-section" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Elastic MapReduce (EMR)`
  </a>
  <a href="#aws-glue-serverless" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `AWS Glue`
  </a>
  <a href="#aws-data-pipeline" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `AWS Data Pipeline`
  </a>
  <a href="#open-search" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `OpenSearch`
  </a>
  <a href="#kinesis" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Kinesis`
  </a>
  <a href="#kinesis-video-streams" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Kinesis Video Streams`
  </a>

  <a href="#amazon-sagemaker" class="mindmap mindmap-new-section" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon SageMaker`
  </a>
  <a href="#amazon-comprehend" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Comprehend`
  </a>
  <a href="#amazon-kendra" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Kendra`
  </a>
  <a href="#amazon-fraud-detector" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Fraud Detector`
  </a>
  <a href="#amazon-textract" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Textract`
  </a>
  <a href="#amazon-forecast" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Forecast`
  </a>
  <a href="#amazon-transcribe" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Transcribe`
  </a>
  <a href="#amazon-polly" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Polly`
  </a>
  <a href="#amazon-lex" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Lex`
  </a>
  <a href="#amazon-rekognition" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Rekognition`
  </a>
  <a href="#amazon-translate" class="mindmap" style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Translate`
  </a>
  <a href="#amazon-pinpoint" class="mindmap"  style="--mindmap-color: #4d4d4d; --mindmap-color-lighter: #d9d9d9;">
    `Amazon Pinpoint`
  </a>
</div>  

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

# AWS Glue #serverless
- for **running ETL workloads without having to spin up EMR, serverless**
- you can use it with Athena:
  - **transform the S3 data with AWS Glue** - first Glue Crawlers, and then Glue Data Catalog
  - query the Glue Data Catalog with Athena
  - you can also put the data into Redshift Spectrum instead of / on top of querying it with Athena
- **Amazon QuickSight** will help to visualise the data
- you can **specify the number of DPUs (data processing units)** you want to allocate to an ETL job

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

# Kinesis Video Streams
- **stream media content from a large number of devices (millions) to AWS**
- can later run **analytics, ML, playback**
  - e.g. those door cameras that recognise when there is a person (**smart home, smart cities**)
  - or, **LIDAR** radar data processing
- **scalable, encrypted and indexed data**

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

# Amazon Kendra
- **intelligent search service with ML, search across enterprise data, connecting silos**
- search in **S3 buckets, file servers, websites**
- can be used to **provide better search results to customers, analyse new compliance laws, better internal search in the company**

# Amazon Fraud Detector
- **AI service to detect fraud in your data**, you train a model first
- e.g. **suspicious online payments, suspicious user accounts, prevent users abusing free trial, account takeover detection**

# Amazon Comprehend
- ML for **Natural Language Processing (NLP)**, sentiment analysis
- **call center customer satisfaction, reviews, legal documents search, insurance claims, financial documents**

# Amazon Textract
- **use ML to extract text from handwritten documents**
- use for **processing handwritten applications, health insurance claims, tax return forms**

# Amazon Forecast
- **use ML to predict time-series data**
  - automatically select the **right machine learning algorithm**
- can use in **IoT, website analytics, devops monitoring**

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

# Amazon Translate
- **translate content into different language**
- deep learning and neural network
- continuously improving and highly accurate they say
- easy to integrate
- cost effective compared to human translators
- **scalable**

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
