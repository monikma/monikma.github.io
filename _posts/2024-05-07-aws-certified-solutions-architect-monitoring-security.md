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
  
