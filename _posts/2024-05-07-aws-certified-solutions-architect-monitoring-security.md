---
layout: post
title: AWS SAA-C03 - Monitoring and Security
date: '2024-05-07'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 47
type: certification
draft: true
customColor: true
fgColor: "#6600cc"
bgColor: "#ccccff"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS Monitoring and Security.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}
  
## CloudWatch
- monitoring and observability platform
- features
  - system metrics - out of the box, not only compute, also s3, SQS, etc
  - application metrics - e.g. Disk utilization/Memory
  - alarms
    - CloudWatch -> Alarms -> Create Alarm -> Select Metric (you can adjust the time span) -> Browse -> EC2 -> ..
      - .. -> Metric: Per-Intance metrics, find your instance with CPU Utilisation, Statistic: Maximum, Period: 5 minutes, Conditions, blabla
      - .. -> Notifications, trigger: in alarm, send notification to: pick email list 
    - supports anomaly detection
    - you can pick how to treat missing data
    - apart from notifications, on an alarm you can trigger
      - autoscaling actions
      - EC2 actions (stop, terminate, reboot
      - Systems Manager action
    - there are no default alarms that are there out of the box
- metric types
  - default metrics
    - CPU utilization
    - Network throughput - how many packets or data is going through
  - custom metrics - for those cloud watch agent must be installed on the host, requires some extra configuration (also permissions), AWS cannot see pat the hypervisor level
    - EC2 Memory Utilisation
    - EBS Store Capacity
- types of monitoring
  - basic (default)) - 5 minute intervals
  - detailed - 1 minute intervals (costs more)
- when you don't use cloud watch
  - you don't have to process the logs, then you can use s3, optionally query with Athena - cheaper
  - you need a real-time solution for logs, then use Kinesis
  - you need to watch for resource changes - then rather use AWS Config

### CloudWatch Logs
- collected by cloud watch agent, central place for logs, allows analysis, visualisation, etc.
- Log Event - a record of what happened - contains a timestamp and the data
- Log Stream - a collection of log events from one source
- Log Group - a collection of log streams, e.g. can be from different hosts / instances
- features
  - filter patterns - filter logs by a term
    - Log Groups -> pick the group -> Subscription filters -> Create, e.g. Lambda -> specify the filter pattern, there is also a testing input -> you can here Start Streaming
  - cloud watch log insights - filter logs with a query language, similar to SQL
  - alarms, can be also triggered on filter patterns
- you can also integrate on-premise with CloudWatch logs

### How to configure Cloud Watch Logs for EC2
- when launching the instance, pick an instance profile that allows to connect to session manager and to put cloudwatch logs, e.g. a role that has the policy like this
  - ```json
    {
       "Version": "2012-10-17",
       "Statement": [{
         "Effect": "Allow",
         "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
            "logs:DescribeLogStreams"
         ],
         "Resource": ["*"]
       }]  
    }
    ```
  - and the `AmazonSMMManagedInstanceCore` amazon managed policy
- you have to install cloud watch agent on your EC2 instance
  - ```bash
    #!/bin/bash

    sudo yum update -y
    sudo yum install amazon-cloudwatch-agent -y
    # here we install rsyslog to have some logs..
    dnf install rsyslog -y
    systemctl enable rsyslog --now
    ```
  - another way (maybe depends on the instance type)
    ```bash
    wget -O awslogs-agent-setup.py https://s3.amazonaws.com/aws-cloudwatch/downloads/latest/awslogs-agent-setup.py
    sudo python ./awslogs-agent-setup.py --region us-east-1
    ```
    you can view the logs on the instance then: `sudo cat {the log path you entered in the wizard}`
- and you have to edit the config file for the cloud watch agent on the instance: `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`
  - ```json
    {
       "agent": {
          "metrics_collection_interval": 60,
          "run_as_user": "root",
          "region": "us-east-1",
          "debug": "true"
       },
       "logs": {
          "logs_collected": {
             "files": {
                "collect_list": [
                   {
                      "file_path": "/var/log/messages",
                      "log_group_name": "{instance_id}",
                      "log_stream_name": "messages",
                      "timezone": "UTC"
                   },
                   {
                      "file_path": "/var/log/secure",
                      "log_group_name": "{instance_id}",
                      "log_stream_name": "secure",
                      "timezone": "UTC"
                   }
                ]
             }
          }
       }
    }
    ```    
- next, you have to start the agent: `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`
- next you can see your log group with instance ID in the Cloud Watch, and the logs

### Setting up AWS VPC Flow Logs for security
- VPC Flow logs can be configured at the VPC, Subnet or the Network Interface level (ENI), here we do VPC level
- Send flow logs to s3
  - VPC -> Flow Log -> Create Flow Log, send to S3
  - notice that then the bucket Permissions -> Policy was automatically updated
- Send flow logs to Cloud Watch
  - Cloud Watch -> Log Groups -> Create Log Group
  - VPC -> Flow Log -> Create Flow Log, send to Cloud Watch Logs, pick the log group, pick an IAM role that will allow the Flow Logs to write to Cloud Watch
- generate traffic - it is enough to ssh into the instance; also try ssh after you have disabled SSH on Security group
  - in logs you will see ACCEPT or REJECT, when the SSH was disabled
- the logs can take 5-15 minutes to show up, both in CW and in S3
  - will be one stream per ENI (Elastic Network Interface)
- create CloudWatch metric filter for denied SSH connections and alarm
  - Cloud Watch -> Log groups -> pick your group -> Metric Filter -> Create Metric Filter
  - filter pattern: `[version, account, eni, source, destination, srcport, destport="22", protocol="6", packets, bytes, windowstart, windowend, action="REJECT", flowlogstatus]`
  - then you also need metric name and value (e.g. `1`) - so this will be a metric generated from logs matching that pattern
  - after it is created, click on it's checkbox -> Create alarm -> ... -> create SNS topic, then generate some traffic and see the alarm working (default period is 1 minute)
- create Athena table from the logs in s3 and query
  - find the logs in s3 -> Copy s3 URI. Next Athena -> Query editor -> Edit settings and enter that location you copied
  - create the Athena table:
    ```sql
    CREATE EXTERNAL TABLE IF NOT EXISTS default.vpc_flow_logs (
      version int,
      account string,
      interfaceid string,
      sourceaddress string,
      destinationaddress string,
      sourceport int,
      destinationport int,
      protocol int,
      numpackets int,
      numbytes bigint,
      starttime int,
      endtime int,
      action string,
      logstatus string
    ) PARTITIONED BY (
      dt string
    ) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' LOCATION 's3://cfst-3029-12735640b585b0eeecf119-vpcflowlogsbucket-okxucddutz8q/AWSLogs/825242597096/vpcflowlogs/us-east-1/' TBLPROPERTIES ("skip.header.line.count"="1");
    ```                      
  - partition the table
    ```sql
    ALTER TABLE default.vpc_flow_logs
    ADD PARTITION (dt='2024-05-07') location 's3://cfst-3029-12735640b585b0eeecf119-vpcflowlogsbucket-okxucddutz8q/AWSLogs/825242597096/vpcflowlogs/us-east-1/2024/05/07/';
    ```
  - run queries
    ```sql
    SELECT day_of_week(from_iso8601_timestamp(dt)) AS day,
      dt,
      interfaceid,
      sourceaddress,
      destinationport,
      action,
      protocol
    FROM vpc_flow_logs
    WHERE action = 'REJECT' AND protocol = 6
    order by sourceaddress
    LIMIT 100;
    ```

## Amazon-managed Grafana
- query, correlate and visualise logs, metrics and traces
- AWS managed, has security, you can have different workspaces, scaling, high availability
- pricing per user
- collects data from cloud watch, Amazon Managed Service for Prometheus, AWS Opensearch, AWS Timestream, AWS X-Ray, ...
- good for
  - visualisations
  - IoT (since a lot of different data sources)
  - ops / troubleshooting
- works with VPC endpoints

## Amazon Managed Service for Prometheus
- serveless, Prometheus-compatible service for metrics
  - Prometheus is open source, this is the same Prometheus
  - AWS will scale it automatically
  - AWS will replicate in 3 AZs (availability)
  - can be used to monitor Kubernetes (self managed or AWS EKS clusters)
  - uses PromQL language (open source) for querying data
  - data retention 150 days
- works with VPC endpoints
- pick this also for monitoring at scale

# IAM
- `us-east-1` is the region AWS **rolls out their services first** - but **IAM is global**
- by default: `0` users, `0` user groups, `2` roles, `0` policies, `0` identity providers
- one user per person
- **least privilege principle**

## Securing root account
- **add MFA**
- **create user group ‘admin’ and add users**

## Creating users
- **by default the user has no permissions, can only change their password**
- **Access Key** is for command line access
- **password policy you can set up in Account Settings**
- the user can also **login with SSO via Identity Center** - e.g. active directory and stuff like this (SAML), need to set up e.g. ‘Azure Identity Federation’, or OpenID (not needed to know more here)

## IAM policy document
It defines the **permissions**, e.g. full access (aka `AdministratorAccess`) looks like this:
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
  - **action** is the AWS API request
  - **effect** is either **Allow** or **Deny**
  - **resource** is the ARN
- can be attached to: **user (not encouraged), user group or role**
  - assign policies to groups not single users (by job function)
- some are **managed by AWS** (`1115` of them)
- **Amazon Resource Name (ARN)**
  - syntax: `arn:partition:service:region:account_id:...`
  - partition is `aws` or `aws-cn` (AWS China)
  - for global resources you omit the region
  - can use **wildcards** `*` to match more resources
- IAm Policies can be:
  - **identity policies**
  - **resource policies**
- **everything not explicitly allowed is implicitly denied**
  - **explicit deny overrides anything else**

## Roles
- an **IAM role is an AWS identity**, with permissions
- user groups are for users, assigned permanently; **roles are assumed temporarily** (**temporary security credentials**), and can be assumed by users or **AWS architecture**
- **role** consists of
  - **permissions**
  - **trust policy**, which controls who can assume the role
- the role **is assigned / attached permanently but the users/AWS architecture have to assume it**
  - you assign the users to the role in **"add principal", this is the "role-trust relationship"**
- roles can allow **cross-account acces**s

# Distributed Denial of Service (DDoS) attack
- attempt to make the application unavailable to your users
- **SYN flood** - is a DDoS at TCP layer (Layer 4), the server waits for not arriving SYN-ACKs from too many clients, new client can't connect because of open TCP connections limit
- **Amplification attack** - also Layer 4, uses 3rd party service like NTP, SSDP, DNS, CharGEN, SNMP - the attacker is pretending to have the victim's IP address (IP spoofing), takes advantage of the fact that 3rd party response is 28-54 times larger than the request, keeps sending bigger requests, can coordinate from multiple servers
- **Layer 7 attack** - simply flooding the server with too many GET or POST requests

# CloudTrail
- records the AWS Console actions and API calls, except **RDP and SSH traffic**
- logs the following: **caller identity & IP, request & response elements, request metadata & parameters, timestamp**
  - log are stored in **S3**
- used for **investigation after the fact**, or **monitoring real time intrusion** (can integrate e.g. with Lambda)
- can also serve **compliance** purpose

# AWS Shield
- is DDoS protection, **Layers 3 and 4: on ELBs, CloudFront and Route53**
- protects against **SYN/UDP floods**, **reflection attacks**, and others
- is free and enabled by default
- **AWS Shield Advanced** - `$3000` per month
  - protects against more sophisticated attacks
  - always-on, flow-based monitoring, near **real time** DDoS notifications
  - 24/7 access to **DDoS Response Team (DRT)** at AWS
  - protects your **AWS bill** against higher fees due to a DDOS attack
  - how to turn on:
    - WAF & Shield -> AWS Shield -> Subscribe to Shield Advanced

# AWS Web Application Firewall (WAF)
- **monitoring HTTP(s) requests against DDoS attacks**, also **control access to your content** (responds with `403` when not allowed)
- happens on **Layer 7: CloudFront or ALBs**
- you can set up conditions based on:
  - **source IP, country**
  - **query parameters**
  - **SQL code / scripts present in the request**
  - you can use **regular expressions**
- modes:
  - **allow** specified requests
  - **block** specified requests
  - **count** specified requests

# AWS Firewall Manager
- cross-account security manager, for **both WAF and AWS Shield**, in **AWS Organisations**
- set security **rules and policies centrally**, also **automatically apply to new resources**

# AWS Network Firewall
- is a **physical firewall to your VPC, managed by AWS**
- includes **firewall rules engine**, that gives you control over your network traffic
- works with **AWS Firewall Manager**
- provides **intrusion prevention system (IPS)**, that gives you **active traffic flow inspection**
- you can:
  - filter internet traffic - with ACL lists, stateful inspection, protocol detection, intrusion prevention
  - filter outbound traffic - e.g. to block malware communication
  - inspect VPC-to-VPC traffic
- exam scenarios: 
  - to filter network traffic even **before it reaches your internet gateway**
  - **intrusion prevention systems**
  - **hardware firewall requirements**

# Amazon GuardDuty
- uses ML to monitor unusual/malicious behavior
  - takes `7-14` days to set a baseline
- monitors **CloudTrail logs**, **VPC FLow logs**, **DNS logs**
- centralized **across multiple AWS accounts**
- alerts you in GuardDuty console and via **CloudWatch Events** that can trigger **Lambdas**
- receives feeds from **3rd party** (e.g. Proofpoint, CrowdStrike), about **known malicious domains and IP addresses**
- **pricing based on amount of CloudTrail events and log volume**
- in the exam: **using AI to monitor your whole AWS account**

# AWS Macie
- for **detecting PII, PHI, and financial data in S3 buckets with ML**
  - also alerts of buckets that are **unencrypted, public, or shared with account outside of your AWS Organisation**
- great for **GDPR and HIPAA** regulations
- alerts you see in Macie AWS Console, and also they are sent to **EventBridge**
  - you can then integrate them with your **security incident and security management system (SIEM)**
  
# Amazon Inspector
- helps improve the security of applications that are deployed on AWS
- produces a list of **security findings** (e.g. you left port `22` open on your Security Group)
- assessment types:
  - **Network assessment** - network configuration analysis, **inspection of ports reachable from outside VPC**
  - **Host assessment** - analyse EC2, **Vulnerable software (CVE), Host hardening (CIS Benchmark), best practices**
    - **requires Inspector Agent** on your host
- steps: 
  - create an **assessment target**
    - for EC2 instances that allow Systems Manager run command, the Inspector agent will be installed automatically
  - create **assessment template**
  - perform **assessment run**
  - review **findings**
- can run **once or weekly**

# AWS Key Management Service (KMS)
- create and control **encryption keys**, integrates with many AWS services
- you can schedule **KMS key deletion** earliest `7` days after creation
- you can **control who can manage keys separately from who can use them**
  - **policies** control access, but they are **resource-based policies** and not **identity-based policies**
  - CMK key **must have a policy** and it is called **key policy**
    - apart from key policy you can optionally use
      - **IAM policy**
      - **grants**, temporary, commonly used by AWS services to encrypt your data at rest
- the keys have a **lifecycle**
- **Hardware Security Module (HSM)**
  - computing device that safeguards and manages the keys (uses cryptoprocessor chips for security)
  - performs the encryption and decryption
- **Customer Master Key (CMK)** - has id, state, creation date, description
  - also contains the key material that is used to encrypt and decrypt the data (did not get that)
  - you **first create CMK before you use KMS**; you can have it:
    - generated by AWS and **stored in HSM**, in this case you can have **AWS rotate it for you once per year**
    - imported from your **own infrastructure**
    - generated and **used in CloudHSM cluster** as part of **custom key store**
- **CloudHSM** - cloud based HSM that is dedicated to you, no shared tenancy

# AWS Secrets Manager
- stores, encrypts and **rotates** your security credentials
  - **encryption in transit and at rest using KMS**
  - when you enable the automatic rotation, the **secret will be immediately rotated**, don't rotate if you use embedded credentials
- scalable
- fine grained control with IAM
- you can generate passwords using **CloudFormation**

# AWS Parameter Store
- part of **Systems Manager**
- for storing **configuration parameters** or **passwords**, secure and **hierarchical** storage
- **plain text or encrypted**
  - **no automatic key rotation**
- **free**, but `<10000` parameters
- **parameter policies** - can have expiration date
- types:
  - **String**
    - has data types "text" or "**ec2 image id**" (no idea what it is)
  - **StringList** - comma separated
  - **SecureString**

# S3 Pre-signed URLs
- can **share a private S3 object** by creating a pre-signed URL, using their **own security credentials**, to allow a download for a **limited amount of time**
- the link is valid only for some time
- there are also **pre-signed cookies** which you can use to share several files, the receiver then can browse the shared objects
  - can be used e.g. in non free stock photos, to provide the customer the link only after they have paid
- how to pre-sign an object: `aws s3 presign s3://bucketname/object --expires-in 3600` - `1`h, is default (you need S3 Admin access)

# AWS Certificate Manager
- **create, manage and deploy public and private SSL certificates** for use with other AWS Service
- integrates with many services, e.g. **ELB, CloudFront, API Gateway**
- it is **free**!
- automates **renew and deployment of the certificate, and rotates in respective services**
- easy to set up vs manual process

# AWS Audit Manager
- **continuously audit AWS usage to stay compliant** with industry standards and regulation
- **produces automated reports for auditors, e.g. for PCI compliance, GDPR, HIPAA**
 - for **Internal Risk Assessments**, you can create framework from scratch or customize a prebuilt ones

# AWS Artifact
- for **downloading compliance documents** from AWS, e.g. **AWS security and compliance** reports or selected online agreements, e.g.:
  - AWS Service Organization Control (SOC) reports
  - Payment Card Industry (PCI) reports
  - GDPR, HIPAA, ISO reports
  - ...
- console: you can view **reports** or **agreements**
- often used as a distractor in the exam, if you have to give them to auditors, thi is wrong answer

# Amazon Cognito
- **provides authentication, authorization, user management** - authentication engine, identity broker
- users can **sign in/sign up**, 
  - with username/password (using user pool)
  - with a third party identify provider
- signed in user gets a **token**
- access for **guest users**
- **synchronizes user data across multiple devices**
- recommended for all **mobile apps** that call AWS
- use cases:
  - authentication
  - third-party authentication
  - access server side resources, e.g. AppSync (the GraphQL)
- pools:
  - **user pools** - for sign in and sign up
  - **identity pools** - for access to AWS resources, with **AWS credentials**, that you exchange the token for
- AWS Security Token Service (STS) - validates the assume role request using Cognito

# Amazon Detective
- **analyse, investigate and identify root causes of security issues / suspicious activity**
- uses **ML, statistical analysis and graph theory**
- sources: **VPC Flow Logs, Cloud Trail logs, EKS audit logs, GuardDuty findings, ..**
- use cases:
  - **triage security findings**, can create visualisations for you
  - **thread hunting** - proactively, create visualisations for you
- in the exam often a distractor, look for **root cause** term

# AWS Security Hub
- single place to view all security alerts from various sources, e.g. **Amazon GuardDuty, Inspector, Macie and Firewall Manager**
- easier **correlation** of security findings
- works **cross-account**
- you can conduct **Cloud Security Posture Management (CSPM)**, to comply with frameworks like **CIS, PCI DSS** to help reduce your risk
