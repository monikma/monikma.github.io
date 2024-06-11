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
customColor: true
fgColor: "#996633"
bgColor: "#f2e6d9"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about some general exam information as well some topics that did not fit in other sections.
</div>

<h1>Table of contents</h1>
<div markdown="1">
  <a href="#exam-guide" class="mindmap mindmap-new-section" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Exam Guide`
  </a>
  <a href="#aws-well-architected-tool" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Well-Architected Tool`
  </a>
  <a href="#general-knowledge" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `General knowledge`
  </a>
  <a href="#global-infrastructure" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Global Infrastructure`
  </a>
  <a href="#shared-responsibility-model" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Shared responsibility model`
  </a>
  <a href="#aws-backup" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Backup`
  </a>
  <a href="#scaling" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Scaling`
  </a>
  <a href="#disaster-recovery-strategy" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Disaster Recovery Strategy`
  </a>
  <a href="#cloudformation" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `CloudFormation`
  </a>
  <a href="#elasticbeanstalk" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `ElasticBeanstalk`
  </a>
  <a href="#cloudfront" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `CloudFront`
  </a>
  <a href="#elasticache-memcached-redis" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `ElastiCache (Memcached / Redis)`
  </a>
  <a href="#global-accelerator-ga" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Global Accelerator (GA)`
  </a>
</div>

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
