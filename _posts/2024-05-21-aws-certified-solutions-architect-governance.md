---
layout: post
title: AWS SAA-C03 - Governance
date: '2024-05-21'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 50
type: certification
draft: true
customColor: true
fgColor: "#99004d"
bgColor: "#ffe6f2"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview) course.
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about everything AWS that has to do with governance: AWS Organisations, Cost Explorer, audits, and so on.
</div>

<h3>Table of contents</h3>
<div markdown="1">
  <a href="#aws-organizations" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Organizations`
  </a>
  <a href="#aws-resource-access-manager-ram" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Resource Access Manager (RAM)`
  </a>
  <a href="#setting-up-cross-account-access" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Setting up cross-account access`
  </a>
  <a href="#aws-config" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Config`
  </a>
  <a href="#aws-directory-service" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Directory Service`
  </a>
  <a href="#cost-explorer" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Cost Explorer`
  </a>
  <a href="#aws-budgets" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Budgets`
  </a>
  <a href="#aws-cost-and-usage-reports-cur" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Cost and Usage Reports (CUR)`
  </a>
  <a href="#aws-compute-optimizer" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Compute Optimizer`
  </a>
  <a href="#aws-savings-plans" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Savings Plans`
  </a>
  <a href="#trusted-advisor" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `Trusted Advisor`
  </a>
  <a href="#aws-control-tower" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Control Tower`
  </a>
  <a href="#aws-license-manager" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS License Manager`
  </a>
  <a href="#aws-personal-health-dashboard-aka-aws-health" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Personal Health Dashboard (aka AWS Health)`
  </a>
  <a href="#aws-service-catalog" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Service Catalog`
  </a>
  <a href="#aws-proton" class="mindmap" style="--mindmap-color: #99004d; --mindmap-color-lighter: #ffe6f2;">
    `AWS Proton`
  </a>
</div>

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
  - they can even stop root users from doing stuff
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
  - this is **not real-time**
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
  - **Cost Budget** - how much to **spend** on a service
  - **Usage Budget** - **how many resources** to use on one or many services 
  - **RI Utilization Budget** - **utilization threshold** (both directions)
  - **RI Coverage Budget** - how much of instance is **covered by reservation**
  - **Savings Plans Utilization/Coverage Budget** - like with RI but for Savings Plans

# AWS Cost and Usage Reports (CUR)
- **most comprehensive cost and usage data available for AWS spending** 
- publishes billing reports to **S3**
  - in `CSV` format
  - updates **at least once a day**, but you can't exactly control it, only enable the refresh or not
    - pick if a **new report version will be uploaded on update or overwritten**
- costs broken down by **hour, month, service, tag**, etc 
- integrations with **Athena, RedShift, QuickSight**
- use cases: 
  - in AWS Organizations, for accounts or OU
  - tracking of Savings Plans, Reserved Instances
  - break down your **AWS data transfer charges** (external and inter-region), e.g. if too high you'd implement VPC endpoints
    - **data transfer charges are there in many services** that send data from and to the internet, even EC2 HTTP requests are charged!
- how to enable: 
  - Billing -> Cost § Usage Reports 
  - put report name, content
  - delivery options - data granularity
  - pick bucket and path prefix
  - pick integrations, they affect how the data is stored
  - pick **file compression**, if you're using 3rd party SaaS for analysis, can be useful to consider
- exam: look for **detailed cost breakdowns**, **daily delivery of usage reports**, **tracking Savings Plans utilizations**

# AWS Compute Optimizer
- analyses **configuration and utilisation metrics** of your AWS resources
- reports usage **optimizations and recommendations**
- visualises data as **graph** with **history**
- provides **projected utilization metrics**
- works with: **EC2, Auto Scaling Groups, EBS, Lambda**, and also with **single accounts, Member Accounts, as well as Management Account** (there you can apply it to the whole Organization)
- **disabled by default**, after enabling you sill have to **enable activation of recommendation preferences**, for more accurate recommendation

# AWS Savings Plans
- **flexible pricing models** to give savings for your AWS usage
- up to `72`% savings!
- for **EC2**, all instance types, **Fargate**, **Lambda**, also **SageMaker** (ML)
- `1` year or `3` year pricing options, with:
  - **all upfront**
  - **partial upfront**
  - **no upfront**
- Savings Plans types:
  - **Compute Savings Plans** - EC2, Fargate and Lambda, up to `66`% savings
  - **EC2 Instance Savings Plans** - for specific EC2 family in specific region, up to `72`%
  - **SageMaker Savings Plans** - any region, family and components, up to `64`% savings
- note that Savings Plans:
  - only take effect **after your Reserved Instances are exhausted**
  - are applied to **account owner** first
- how to come up with a Savings Plan idea:
  - view recommendations in the **Billing Console**
  - you can add to cart from there
  
# Trusted Advisor
- industry and customer-established **best-practices auditing tool**, covering:
  - **Performance**
  - **Cost Optimization**
  - **Security**
  - **Fault tolerance** - resiliency and availability
  - **Service limits** - let you know when you are approaching service limits, e.g. **VPC count**
  - **Operational Excellence** - best practices
- works at an **account level**, just the service (so service or account)
- **Basic/Developer support** has only `6` checks in Security category
- **Business/Enterprise On-Ramp/Enterprise support** get al checks, as well as   **EventBridge** automation
- AWS Console: Trusted Advisor - shows recommendations

# AWS Control Tower
- **extension to AWS Organizations**
- straightforward way to set up and govern AWS multi-account environment
- orchestrates other AWS services
- users can provision new AWS accounts using **central admin established compliance services** (**Account Factory**)
- **secure and compliant** multi-account environment
- terms:
  - **Landing Zone** - holds all accounts and OUs
  - **Guardrails** - governance rules, can be enabled or disabled
    - **preventative** - **service control policies** disable stuff
    - **detective** - detect non compliant resources **leverages AWS Config rules**, **available only in certain regions**
    - **proactive** - prevent non compliant resources from being created, using AWS CloudFormation hooks
  - **Account Factory** - account template
  - **CloudFormation StackSet** - automated deployment of templates for resources
  - **Shared accounts** - created during Landing Zone creation
- **Account types**:
  - Management
  - Log Archive (shared) - for config and CloudTrail logs
  - Audit (shared) - SNS, governance notifications, configuration security and drift notifications

# AWS License Manager
- **managing software licenses**, with many vendors
- **across accounts**, and also **on-premise**, **hybrid**
- allows to set usage limits on the licenses, to **reduce overages penalties**
- versatile, many software types

# AWS Personal Health Dashboard (aka AWS Health)
- visibility of AWS services'/accounts' **performance and availability** 
- see how they affect you, e.g. AWS needs to run some update on your machine
- you can als view **upcoming AWS maintenance tasks**
- **near instant delivery** of notifications and alerts
- can use **EventBridge** for automation
- events:
  - **AWS Health Event** - for AWS services sent by AWS
  - **Account-specific Event** - for your account / organization
    - also e.g. suspension notice due to pending billing charges
  - **Public Event** - events for public services, not specific to accounts
- concepts:
  - **Event type code, event type category, event status** (open, close, upcoming)
  - **AWS Health Dashboard** - account and public events
  - **Affected Entities** - which AWS resources may be affected

# AWS Service Catalog 
- **catalog of pre-approved services, as CloudFormation templates**
  - can be AWS services but also third party
  - e.g. **AMIs, servers, software databases, other preconfigured components**
  - users can deploy them into their own accounts (less operational overhead)
- **centralized in AWS Organizations**
- **used for standarization across organization, self-service for users, bulk version updates**

# AWS Proton
- offers **Infrastructure as Code (IaC) provisioning and deployment**
  - developers can move faster with **self-service** 
  - provision **infrastructure** 
  - manage **code deployments**
  - configure **CI/CD**
- uses **templates** to define and manage **app stacks**
- supports **CLoudFormation** and **Terraform** IaC providers

