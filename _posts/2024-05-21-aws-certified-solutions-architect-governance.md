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
  - 