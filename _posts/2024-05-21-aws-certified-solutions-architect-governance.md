---
layout: post
title: AWS SAA-C03 - Governance
date: '2024-05-21'
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

This section is about everything AWS that has to do with governance: AWS Organisations, Cost Explorer, audits, and so on.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# AWS Organizations
- for **managing multiple AWS account**, streamline processes and centralization, security, billing, and so on
- account types:
  - **Management Account** - the payer account, central administrative and billing account, hosts the AWS Organization
  - **Member Accounts** - linked to the Management Account, e.g. dev/test/prod, but in the end up to you
    - having accounts separate per environments / team ownership is best practice
- **Consolidated Billing** - consolidates bills from all accounts, simplification
    - in **Cost Explorer** you can still see the fine grained stuff
- you can get aggregate **Usage Discounts**
- you can **share Reserved Instances and Saving Plans across accounts**
- you can require specific **tags** to be used in your accounts
- you can group accounts into **Organizational Units (OUs)**
- **Service Control Policies (SCPs)** are JSON policies applied to accounts or OUs, that **restrict/permit certain actions**
  - they do not affect the **Management Account** the same though
  - they look just like IAM Policies
- it is recommended to 
  - create **Centralized logging account** for organizational **CloudTrail** logs
  - **leverage cross-account** roles for accessing accounts
  
# AWS Resource Access Manager (RAM)
- free
- **share AWS resources with other accounts** (in same AWS Organization or not), e.g.
  - **Transit Gateways** - to simplify network connectivity 
  - **VPC Subnets** - more flexible network architecture
    - **Owners** 
      - create and manage the VPC resources which are shared
      - they cannot delete nor modify the participants' resources
      - they control the configuration and management
    - **Participant Accounts** 
      - recipients of shared resources
      - can provision services into the shared VPC resources
      - cannot modify the VPCs or the subnets that got shared
  - **License Manager** resources
  - **Route53 Resolver rules and endpoints**
  - **Dedicated Hosts**
  - ...
- an **alternative to VPC Peering** (Peering is non transitive, RAM is centralized, more suited to complex setups)

# Setting up cross-account access
- you create **cross-account role access**
  - in the **target account, create IAM Role** with a policy with least privileges
  - update this role's **Trust Policy to allow assuming the role from the other account** with another role
    - the **Principal** will be another AWS account, e.g. `"AWS": "arn:aws:iam:12345667:role/theirRole"`
    - the **Action** will be `"sts:AssumeRole"`
    - you can also require **External ID** being passed as a verification
  - in the other account, configure the **permissions to assume the role from the target account**
- you could e.g. replicate this setup to **many accounts using CloudFormation Stack Sets**
- this solution is secure, uses temporary credentials and revokeable roles

# AWS Config
- inventory management and control tool for **infrastructure**
  - maintain **historical record of configuration changes**
  - can create **rules** to adhere to compliance requirements
- **per region basis**, operates in each region where it is enabled independently
- **integrates with SNS** to get notifications when configuration changes or does not comply to the rules
  - also integrates with **EventBridge**
- the results can be **aggregates cross region and cross account**
- you can:
  - **Query** - discover components, you can also see deleted resources
  - **Enforce** - use **rules** to flag when something is wrong, get **alert via SNS**,
    - AWS provides **predefined best practice rules**
    - evaluated on a **schedule or a trigger (config change)**
    - can automatically **remediate using SSM automation**
      - AWS also provides **common remediation documents**, or you can customize, e.g. Lambda functions
      - **remediation can be auto-retried**
  - **Learn** - check the history, who made the change
- **it is a monitoring and assessment tool, it is not preventative**!
- billed by number of **rules and configuration items**
- in AWS Console:
  - AWS Config -> Dashboards - all the rules you see were **configured in AWS Organization's Management Account**
    -> Rules, e.g. "EBS encryption must be enabled for EC2", and remediation would be to enable it
    - you can see the remediation document in **AWS Systems Manager -> Documents**
  
# AWS Directory Service
- fully AWS managed version of **Active Directory**
- types:
  - **Managed Microsoft AD**
    - full fledged AD on AWS
    - when you want to migrate everything to AWS
  - **AD Connector** 
    - creates a tunnel between your AWS and on-premise AD
  - **Simple AD**
    - minimal for authentication, powered by Linux Samba Active Directory-compatible server
- **better than running AD on EC2**

# Cost Explorer
- cost optimization is **part of the Well Architected Framework**
- can generate **custom reports**, e.g. based on **tags**, **services**, **hourly or monthly**
- up to `12` months **forecast**
- by default report filters include all accounts in your Organization
- **Organization Payer can break down the costs by account**

# AWS Budgets
- **plan** for Organizations costs
- create **alerts when spendings get too high**
- budget types:
  - Cost Budget - how much to spend on a service
  - Usage Budget - how many resources to use on one or many services 
  - RI Utilization Budget - utilization threshold (birth directions)
  - RI Coverage Budget - how much of insurance is covered by reservation
  - Savings Plans Utilization/Coverage Budget - like with RI but for Savings Plans

# AWS Cost and Usage Reports (CUR)
- most comprehensive cost and usage data available for AWS spending 
- publishes billing reports to S3
  - in CSV format
  - updates at least once a day, but you can't exactly control it, only enable the refresh or not
    - pick if a new report version will be uploaded on update or overwritten
- costs broken down by hour, month, service, tag, etc 
- integrations with Athena, RedShift, QuickSight
- use cases: 
  - AWS Organizations for accounts or OU
  - tracking of Savings Plans, Reserved Instances
  - break down your AWS data transfer charges (external and inter-region), e.g. if too high you'd implement VPC endpoints
    - days transfer charges are there in many services that send days from and to the internet, even EC2 HTTP requests are charged!
- how to enable: 
  - Billing -> Cost § Usage Reports 
  - put report name, content
  - delivery options - data granularity
  - pick bucket and path prefix
  - pick integrations, they affect how the data is stored
  - pick file compression, if you're using 3rd party SaaS for analysis, can be useful to consider
- exam: look for detailed cost breakdowns, daily delivery of usage reports, tracking Savings Plans utilizations

# AWS Compute Optimizer
- 