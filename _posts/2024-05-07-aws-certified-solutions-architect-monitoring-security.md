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
customColor: true
fgColor: "#6600cc"
bgColor: "#ccccff"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview) course.
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS Monitoring and Security.
</div>

<h3>Table of contents</h3>
<div markdown="1">
  <a href="#cloudwatch" class="mindmap mindmap-new-section" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `CloudWatch` `System Metrics (out of the box)` `Application Metrics (disc, memory)`, `anomaly detection`
    `on alarm triggers` `System Manager trigger` `default metrics (CPU, network througput)` `custom metrics (with agent, memory, EBS)`
    `basic monitoring, 5 minutes` `detailed monitoring, 1 minute` `not real-time` `Log Event` `Log Stream` `Log Group`
    `filter patterns` `Log Insights` `on-premise integration`
  </a>
  <a href="#how-to-configure-cloud-watch-logs-for-ec2" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `CloudWatch config` `IAM must have IAM policies, AmazonSMMManagedInstanceCore` `install the agent` `configure agent` `start agent`
  </a>
  <a href="#iam" class="mindmap mindmap-new-section" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `IAM` `global service` `least privilege principle` `no predefined users, groups, roles, policies, identity providers`
    `no default permissions for new users` `Access Key` `password policy in Account Settings` 
    `login with SSO via Identity Center, e.g. AD, OpenID`
  </a>
  <a href="#securing-root-account" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `Securing root account` `add MFA` `admin user group`
  </a>
  <a href="#iam-policy-document" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `IAM Policies & Roles` `IAM Policy Document` `Action` `Effect` `Resource`
    `user group policy` `115 AWS managed policies` `identity policies` `resource policies` `by default deny`
    `role assumed temporarily` `temporary security credentials` `permissions and trust policy` `principal`
    `cross-account access`
  </a>
  <a href="#aws-key-management-service-kms" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Key Management Service (KMS)` `deletion earliest 7 days after creation` `resource based IAM policies`  `key lifecycle`
    `Hardware Security Module (HSM), cryptoprocessor` `Customer Master Key (CMK), own or AWS` `Cloud HSM, dedicated`
  </a>
  <a href="#aws-secrets-manager" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Secrets Manager` `rotates` `encryption in transit & at rest with KMS` `CloudFormatio can generate passwords`
  </a>
  <a href="#aws-parameter-store" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Parameter Store` `part of Systems Manager` `hierarchical storage` `free` `<10 000 params` `Parameter Policy, e.g. expiration date`
    `String` `StringList` `SecureString`
  </a>
  <a href="#amazon-cognito" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `Amazon Cognito` `auth & user management` `sign in` `sign up` `tokens` `3rd party auth` `user pools for sign in/up`
    `identity pools for AWS resource access` `AWS Security Token Service (STS) uses Cognito for IAM Role validation`
  </a>
  <a href="#amazon---managed-grafana" class="mindmap mindmap-new-section" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `Amazon-managed Grafana` `query, correlate, visualise logs` `workspaces` `pricing per user` `VPC endpoints support` `IoT`
  </a>
  <a href="#amazon-managed-service-for-prometheus" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `Amazon Managed Service for Prometheus` `monitoring at scale` `managed, open source` `PromQL` `data retention 150 days` `3 AZs` 
    `monitor Kubernetes`
  </a>
  <a href="#aws-x-ray" class="mindmap"  style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS X-Ray` `request and response insights` `traces` `tracing headers` `X-Amzn-Trace-Id` `X-Ray daemon`
    `trace segments` `service graph` `X-Ray SDK` `measure response processing time`
  </a>
  <a href="#distributed-denial-of-service-ddos-attack" class="mindmap mindmap-new-section" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `Distributed Denial of Service (DDoS) attack` `SYN flood TCP layer 4` `Amplification attack layer 4` `layer 7 attack`
  </a>
  <a href="#cloudtrail" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `CloudTrail` `AWS actions & API calls` `no RDP & SSH traffic` `logs to S3` `no real-time` `compliance`
    `trigger actions`
  </a>
  <a href="#aws-shield" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Shield` `DDoS protection` `layer 3 & 4 protection` `ELB` `CloudFront` `Route53` `base version free and enabled by default`
    `AWS Shield Advanced, $3000/month, near real-time, 24/7 DDoS Response Team (DRT), AWS bill protection` 
  </a>
  <a href="#aws-web-application-firewall-waf" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Web Application Firewall (WAF)` `DDoS protection` `layer 7 protection` `403 response` `CloudFront` `ALB`
    `allow/bock/count` `regex` `SQL/script injection`
  </a>
  <a href="#aws-firewall-manager" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Firewall Manager` `manage centrally Shield& WAF in AWS Organizations`
  </a>
  <a href="#aws-network-firewall" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Network Firewall` `physical firewall for VPC` `before Internet Gateway` `intrusion prevention system (IPS)`
  </a>
  <a href="#amazon-guardduty" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `Amazon GuardDuty` `monitor unusual/malicious behavior with ML` `baseline 1-2 weeks` `CloudTrail logs, VPC FLow logs, DNS logs`
    `cross account` `CloudWatch Events` `uses 3rd party info` `pricing by volume`
  </a>
  <a href="#aws-macie" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Macie` `detect PII in S3` `GDPR` `HIPAA` `EventBridge integration`
  </a>
  <a href="#amazon-inspector" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `Amazon Inspector` `list of security findings` `Network assesment` `Host assesment, requires Inspector Agent`
    `run once or weekly`
  </a>
  <a href="#aws-certificate-manager" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Certificate Manager` `create/manage/deploy` `public&private SSL certificates` `free` `rotation`
  </a>
  <a href="#aws-audit-manager" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Audit Manager` `Internal Risk Assessments` `reports for auditors`
  </a>
  <a href="#aws-artifact" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Artifact` `downloading compliance documents from AWS` `not for auditors`
  </a>
  <a href="#amazon-detective" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `Amazon Detective` `investigate suspicious activity with ML` `find root cause` `uses graph theory` 
    `incorporates GuardDuty findings` `triage security hunting` `threat hunting`
  </a>
  <a href="#aws-security-hub" class="mindmap" style="--mindmap-color: #6600cc; --mindmap-color-lighter: #ccccff;">
    `AWS Security Hub` `cross account all security findings from other services` `Cloud Security Posture Management (CSPM)`
  </a>
</div>
  
## CloudWatch
- **monitoring and observability** platform
- features
  - **system metrics** - out of the box, not only compute, also s3, SQS, etc
  - **application metrics** - e.g. Disk utilization/Memory
  - **alarms**
    - CloudWatch -> Alarms -> Create Alarm -> Select Metric (you can adjust the time span) -> Browse -> EC2 -> ..
      - .. -> Metric: Per-Intance metrics, find your instance with CPU Utilisation, Statistic: Maximum, Period: 5 minutes, Conditions, blabla
      - .. -> Notifications, trigger: in alarm, send notification to: pick email list 
    - supports **anomaly detection**
    - you can pick **how to treat missing data**
    - apart from notifications, on an alarm you can trigger
      - **autoscaling actions**
      - **EC2 actions** (stop, terminate, reboot)
      - **Systems Manager action**
    - there are **no default alarms** that are there out of the box
- metric types
  - **default metrics**
    - **CPU utilization**
    - **Network throughput** - how many packets or data is going through
  - **custom metrics** - for those cloud watch agent must be installed on the host, requires some extra configuration (also permissions), AWS cannot see pat the hypervisor level
    - **EC2 Memory Utilisation**
    - **EBS Store Capacity**
- types of monitoring
  - **basic (default)** - `5` minute intervals
  - **detailed** - `1` minute intervals (costs more)
- when you don't use cloud watch
  - you don't have to process the logs, then you can **use s3, optionally query with Athena** - cheaper
  - you need a **real-time** solution for logs, then use **Kinesis**
  - you need to watch for **resource changes** - then rather use **AWS Config**

### CloudWatch Logs
- collected by **cloud watch agent**, central place for logs, allows analysis, visualisation, etc.
- **Log Event** - a record of what happened - contains a timestamp and the data
- **Log Stream** - a collection of log events from one source
- **Log Group** - a collection of log streams, e.g. can be from different hosts / instances
- features
  - **filter patterns** - filter logs by a term
    - **Log Groups** -> pick the group -> Subscription filters -> Create, e.g. Lambda -> specify the filter pattern, there is also a testing input -> you can here Start Streaming
  - cloud watch **log insights** - filter logs with a **query language, similar to SQL**
  - alarms, can be also triggered on filter patterns
- you can also integrate **on-premise** with CloudWatch logs

### How to configure Cloud Watch Logs for EC2
- when launching the instance, pick an **instance profile** that allows to connect to session manager and to put cloudwatch logs, e.g. a role that has the policy like this
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
- you have to install **cloud watch agent** on your EC2 instance
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
- and you have to edit the **config file for the cloud watch agent** on the instance: `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`
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
- next, you have to **start the agent**: `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`
- next you can see your **log group with instance ID** in the Cloud Watch, and the logs

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
- roles can allow **cross-account access**
- **role assumption expires**

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
- **AWS Security Token Service (STS)** - validates the assume role request using Cognito

# Amazon-managed Grafana
- **query, correlate and visualise logs, metrics and traces**
- AWS managed, has security, you can have **different workspaces**, scaling, high availability
- **pricing per user**
- collects data from **Cloud Watch, Amazon Managed Service for Prometheus, AWS OpenSearch, AWS TimeStream, AWS X-Ray, ...**
- good for
  - **visualisations**
  - **IoT** (since a lot of different data sources)
  - **ops / troubleshooting**
- works with **VPC endpoints**

# Amazon Managed Service for Prometheus
- **serverless, Prometheus-compatible service** for metrics
  - Prometheus is open source monitoring system, this is the same Prometheus
  - AWS will scale it automatically
  - AWS will replicate in **3 AZs (availability)**
  - can be used to **monitor Kubernetes (self managed or AWS EKS clusters)**
  - uses **PromQL language (open source)** for querying data
  - data retention `150` days
- works with **VPC endpoints**
- pick this also for **monitoring at scale**

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

# Amazon Detective
- **analyse, investigate and identify root causes of security issues / suspicious activity**
- uses **ML, statistical analysis and graph theory**
- sources: **VPC Flow Logs, Cloud Trail logs, EKS audit logs, GuardDuty findings, ..**
- use cases:
  - **triage security findings**, can create visualisations for you
  - **thread hunting** - proactively, create visualisations for you
- in the exam often a distractor, look for **root cause** term
- **use AWS SSO for internal user management, and AWS Cognito for external**

# AWS Security Hub
- single place to view all security alerts from various sources, e.g. **Amazon GuardDuty, Inspector, Macie and Firewall Manager**
- easier **correlation** of security findings
- works **cross-account**
- you can conduct **Cloud Security Posture Management (CSPM)**, to comply with frameworks like **CIS, PCI DSS** to help reduce your risk
