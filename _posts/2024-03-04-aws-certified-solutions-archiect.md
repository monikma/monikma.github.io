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
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about some general exam information as well as AWS IAM and AWS infrastructure.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# Exam Guide

They put a lot of emphasis on how to pass the exam in the first place, not sure how I feel about this.
In nutshell:

- be familiar with exam structure and how different chapters are weighted for the final score
- there will be random questions about stuff that is not covered, and they are ignored for scoring
- check that whitepaper before the exam (not too early not to forget): [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)

Now I will go topic by topic/service by service.

# General knowledge

## Global Infrastructure
- around **31 Regions** - region = physical location, with 2 or more AZs
- around **99 Availability Zones** (AZs) - AZ = cluster of data centers within 100km, data center is a building with servers
- plus **215 edge locations** - edge locations are endpoints for caching - Cloud Front (content delivery)

(roughly knowing the numbers may matter)

## Shared responsibility model
- Customer: customer data, configuration, encryption, IAM, security in the cloud (anything you can control in the UI)
- AWS: security of the cloud
- Encryption is a shared responsibility - you check the checkboxes, but AWS should make it happen

# AWS Backup
- why to use it - you can backup many things in one place, consistency (mostly EC2 stuff with their various storage options)
- can create automations, lifecycle policies to expire backups, encryption of backup, overview for audits 
- can be used with AWS Organizations (multiple accounts)

# Lambda
# Elastic Beanstalk

## ELB (Elastic Load Balancing)
- automatically distributing traffic across multiple targets, can be across multiple AZs
- Application Load Balancers
  - HTTP & HTTP traffic, level 7 of [OSI model](https://www.bmc.com/blogs/osi-model-7-layers/) (Open System Interconnection), application aware, intelligent
  - To be configured
    - Listener - you specify protocol and port, has rules
    - Rules - a rule consists of priority, actions and condition(s) (of when is activated), as a result the traffic is sent to a Target Group
    - Target Group - routes traffic to one or more registered targets, e.g. EC2, on given port and protocol, also has a Health Check attached
    - Path Based Routing - you enable path patterns, the decision about target group is based on request path, e.g. a subpath can be routed to another server, in a different AZ
  - to use HTTPS listener you need a SSL/TLS server certificate deployed on your ALB, the ALB then terminates frontend connections, decrypts the requests from clients and sends them to the targets, you will get the certificate if you register your domain with Route53
  - EC2 -> Load Balancing -> Create Load Balancer -> Application Load Balancer -> Internet facing, IPv4, pick your VPC
    - add mappings to all the AZs where your EC2 instances are
    - add SG of your EC2 instances
    - Listener -> Create Target Group -> pick Instances type, HTTP, set up Health Checks -> pick all EC2s to register targets -> Create target Group
    - you can then see if you access the LB DNS name, one of your EC2 instances will be hit
- Network Load Balancers
  - TCP traffic, level 4 of [OSI model](https://www.bmc.com/blogs/osi-model-7-layers/), low latency, performance, millions request per second
  - it has a Target Group, picks a target and opens a connection on given port and protocol
    - supported protocols: UDP, TCP, TCP_UDP, TLS
    - supported ports: 1-65535
  - can use TLS listener for decryption / encryption, for that it also needs a SSL server certificate deployed
  - there are no LB Rules
  - fail-open mode - if all instances are unhealthy, NLB will try to send traffic to all of them
- Gateway Load Balancers
  - Network level, level 3 of [OSI model](https://www.bmc.com/blogs/osi-model-7-layers/), for inline virtual load balancing
  - not appearing in the exam
- Classic Load Balancers
  - legacy, can be used in test and dev
  - HTTP & HTTPS, and TCP
  - X-Forwarded-For header - contains the original IP address of the client, because the instance will get request from the LB
  - if LB cannot make a connection to the targets it will respond with `504 Gateway Timeout`
  - EC2 -> Load Balancers -> Create Load Balancer -> Drop Down -> Classic Load Balancer -> Create, the rest same as ALB 
  - Sticky Sessions - you can tell the LB to bind user session to a specific instance, not good if that instance dies
    - in ALB you can also have them, but on Target Group level, so you can at least have several IPs as the target
- Deregistration Delay (Connection Draining)
  - allows LB to keep existing connections open if EC2 instances are de-registered or become unhealthy, so that it can complete in-flight requests, enabled by default (you put the amount of milliseconds)

### ELB Health checks
- attach it to ELB, queries EC2 instance that is behind the LB -> "In service" / "Out of service"
- LB will stop sending requests to an unhealthy instance, and resume when it's state is healthy again

# Scaling
- horizontal scaling is good for availability
- in the exam 
    - always assume high availability for DB is needed, unless mentioned that it is not (multiple AZs is good)
    - always assume cost effective
    - assume switching to another DB is not as costly as in real life ;)
    - aim for predictive rather than reactive solutions
    - for faster boot up consider AMIs

## Auto Scaling Groups
- Auto Scaling Group is a collection of EC2 instances treated as a collective group for scaling and management
  - Auto Scaling is only for EC2, for other services it is not called like this
- configuration consists of
  - pick the launch template
  - pick purchasing options (On Demand or Spot), choose multiple AZs for availability (AWS wil automatically try to spread across them evenly)
  - ELB can be configured within the Auto Scaling Groups
    - Scaling Groups have their own simple Health Checks, but you can also use the ones from LBs
    - you would have to adjust Security Groups to allow traffic
    - including ELB health checks cause unhealthy instances to be terminated and replaced (you still need some checkbox)
  - set scaling policy: minimum, maximum and desired (=initial amount)
    - you can also build auto scaling policies, on top of this
  - you can set up notifications with SNS
- Lifecycle hooks
  - can happen on scaling out (start up), or scaling in (shut down)
  - the hooks have up to 2 hours waiting, in case you need to run some scripts on the instance before startup, or save some logs before the shut down
  - the hook have wait state (e.g. for running the scripts), and then proceed state (by sending the `complete-lifecycle-action` command)
- how to create Auto Scaling Group
  - EC2 -> Auto Scaling Groups -> Create, pick name and launch template -> select VPC and subnet(s) (remember for availability you need at least 2 AZs) -> ...
    - .. -> Instance type requirements - you can specify max and min for cpu and memory, or add instances manually, with weights
    - .. -> Instance Purchase Options - you can pick a distribution between On-Demand or Spot, if you pick both there is also sth like Allocation Strategy
    - .. -> Load Balancing - pick existing or create new one (NLB or ALB)
    - .. -> Health checks - you can add VPC and/or ELB health checks on top
    - .. -> Metrics - you can enable Auto Scaling Group metrics, and add warmup time (before the metrics get collected after startup)
    - .. -> Group size - this is the min, max, desired
    - .. -> Scaling policies - you can only pick Target Tracking here
      - you can disable scaling in here
    - .. -> Notifications - there are predefined event types
    - .. -> and wait for creation..
  - in Instance Management tab you can see the instances, and add lifecycle hooks
  - in Monitoring you can see monitoring for the auto Scaling Group as well as EC2 instances
  - in Instance Refresh tab - you can start a rolling update
  - under Automatic Scaling tab - you can adjust the scaling policy from Target Tracking to Step or Simple (all 3 of them are called dynamic tracking policies)
    - you can also enable Predictive scaling
    - you can also add scheduled actions
  - if you are changing the network interface settings, remember ([source](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html#change-network-interface))
    - security groups must be configured as part of the interface, not in Security Groups section
    - no secondary private IP addresses
    - you can only specify an existing network interface if it has device index of `0`, and in that case you can launch only 1 instance, use CLI, you have to specify the AZ but not the subnet
    - you cannot assign public IP address if you specify two network interfaces (both must be in the same subnet)
    - the address allocated to network interface comes from CIDR range of the subnet in which the instance is being launched
- Auto Scaling is vital to create a highly available application, allows multiple AZs
- pre-bake AMIs to shorten the startup times
- use Reserved Instances of Savings Plan for the minimum instances to save costs
- CloudWatch is for alerting Auto Scaling Groups to have more or less instances (you don't actually have to create any alerts explicitly)
- what is Stead State Group - when you set min=max=desired=1, this is good to assure AWS will recover it each time it crashes, good e.g. for legacy solutions

## Auto Scaling Policies
- policy types
  - None - you can pick none
  - Stepped Scaling - scaling by certain fixed amount of instances, and that amount depends on the utilization metric
  - Simple Scaling - add/remove certain % of instances, depending on utilization metric
  - Target Tracking - pick a scaling metric and the group will try to maintain it (e.g. CPU utilization should be 50%)
- Avoid Trashing - killing instances that were just created
  - you can add Warm up period, so that the instances are not being killed before they really start
  - you can set up Cooldown that pauses auto scaling for some time, if there is a massive spike, to avoid big costs
- types of scaling
  - reactive - measure the load and determine if a change is needed
  - scheduled - if you know the future workload
  - predictive - AWS uses ML to predict, every 24h updates a 48h forecast
  
## Scaling RDS
- vertical scaling incurs costs, but it's a valid solution
- you can scale storage up but not down
- read only replicas can spread the load (for failover/availability use multi AZ implementations, they will be standby instances not used until needed)
  - you can point your read operations to its endpoint
- or you can use Aurora serverless - for unpredictable workflows
- how to scale a DB
  - RDS -> pick your DB -> Actions -> Create Read Replica (will have same Security and Parameter Groups), you could
    - change the instance class (the `t3.micro` for example)
    - pick a different region
    - pick storage, and you can also pick "Enable storage autoscaling" and "max threshold" so that it does not get too big
    - pick multi AZ
  - creating the read replica will take some time..

## Scaling DynamoDB
- e.g. DynamoDB is easier
  - provisioned capacity - for predictable workloads, most cost effective
  - on demand  - for sporadic workloads, pay per read/write
- Capacity Units
  - RCU - Read Capacity Units, <= `4KB`, one strongly consistent read per second or two eventually consistent reads per second
  - WCU - Write Capacity Units, <= `1KB`, same with consistent reads like RCU
- in the console
  - when he was creating the table, the default was provisioned with 5 WCU and 5 RCU, both with default autoscaling turned on
    - there is a Capacity Calculator built in, if you want to adjust it (also shows the cost)
    - you can also switch to On Demand, you can only change it 2x in 24h
- for design for performance, avoid hot keys, know your access patterns

# Disaster Recovery Strategy
- RPO - Recovery Point Objective - how much time back can you afford your data to be lost
- RTO - Recovery Time Objective - how much time before fail over is activated
- Disaster Recovery Strategies
  - backup and restore - e.g. restore EC2 from a snapshot
  - pilot light - e.g. you already start replicating your DB to another region, but only in case of an outage you add all other components in that new region
  - warm standby - in another region you have a copy of your system just scaled down
  - Active/Active fail over - most expensive, you have 2 productions in different regions/AZs

# AWS Global Accelerator
- Accelerate your audiences against your application in the AWS

# IAM
- `us-east-1` is the region AWS rolls out their services first - but IAM is global
- by default: 0 users, 0 user groups, 2 roles, 0 policies, 0 identity providers 
- one user per person
- least privilege principle

## Securing root account
- add MFA, and
- create user group ‘admin’ and add users

## Creating users
- By default the user has no permissions, can only change their password
- Access Key is for command line access
- password policy you can set up in Account Settings
- the user can also login with SSO via Identity Center - e.g. active directory and stuff like this (SAML), need to set up e.g. ‘Azure Identity Federation’, or OpenID (not needed to know more here)

## IAM policy document
It defines the permissions, e.g. full access (aka `AdministratorAccess`) looks like this:
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
- can be assigned to: user (not encouraged), user group or role
  - assign policies to groups not single users (by job function)
- Some are managed by AWS (1115 of them)
- policy can be shared on inline (just in place of 1 group)

## Roles
- an IAM role is an AWS identity, with permissions
- user groups are for users, assigned permanently; roles are assumed temporarily (temporary security credentials), and can be assumed by users or AWS architecture
- role consists of 
  - permissions 
  - trust policy, which controls who can assume the role 
- the role is assigned / attached permanently but the users/AWS architecture have to assume it
  - you assign the users to the role in "add principal", this is the "role-trust relationship"
- roles can allow cross-account access
