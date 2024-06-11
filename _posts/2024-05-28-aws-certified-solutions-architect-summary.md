---
layout: post
title: AWS SAA-C03 - Summary
date: '2024-06-02'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 53  
type: certification
draft: true
---

<div class="bg-info panel-body" markdown="1">
This is my brain dump for the AWS Certified Solutions Architect - Associate (SAA-C03) certificate preparation, using different sources.
The exam passed with 76%.
The following practice exams were very useful: [Udemy Practice Exams](https://www.udemy.com/course/practice-exams-aws-certified-solutions-architect-associate/).
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}
  
# General
- if a question does not mention high throughput, don't assume it
- if a question mentions a number of AWS services as a solution, they mean this list is exhaustive
- but if they ask which of the following AWS services would you use to build a solution, they mean to pick elements of the solution
- high throughput, high availability and high IO are different things
- spikes in traffic may not only mean performance but also resiliency (that it does not crash)
- availability does not mean spreading the minimum amounts of instances across AZs, you need to have a surplus

# EC2, ECS, Fargate
EC2 is a server in the cloud, you have access to a lot of stuff. Fargate is similar but serverless
and you don't have access to almost anything. ECS is for running dockerized EC2s or Fargate.

AMI is the predefined instance image, it can have Instance Store - emphemeral storage, or EBS. There
are many ready images, but you can add your own.

EBS is just a hard drive for your instance, there are some SSD and some HDD options, some optimized
for Throughput and some for I/O. Cold HDD is cheapest. Only SSDs can boot the system.

Instead of EBS you can also use EFS (Linux) or FSx (Windows or Lustre) for centralized drive,
there it scales automatically for you. Lustre is something with big data (TODO check).

Security Groups are for controlling traffic to your EC2 instances (TODO Fargate too?).
Until you specify your first outbound rule all outbound traffic is allowed. By default, all
inbound traffic is forbidden.

It is worth here to mention EMR and AWS Glue for real big data processing. (TODO figure out).

# Databases

RDS databases run on EC2 instances I think, at least in the background, but you don't have access to
the instances. Except Oracle something Custom something RDS, where they gave you a bit more control.
Theoretically, you could also run your database on EC2 instance, but why would you, if you can use
a ready service.

Database scaling. You can scale vertically or horizontally, depends, right. I vaguely remember RDS
has some vertical autoscaling, at least for storage (I think only up). For horizontal scaling you
use read-replicas. Aurora has many read replicas somehow by default, it has generally a lot of extra
stuff by default, without impact on the price, therefore is most recommended (and "best"). Aurora
serverless is another thing, there you don't care about scaling anymore, and AWS claims it is easy
to switch between both Auroras - so you could start with serverless to see how much you need. Aurora
is based on PostgreSQL dialect.

There are some non RDS databases, mostly for special use cases, except DynamoDB which is the go-to
NoSQL database, also key-value pairs it can do. It is important to remember about RedShift RDS, which
is something for big data (TODO check).

Caching. ElastiCache has a Memcache and Redis modes, both can be used for caching, but there are
differences in capabilities (TODO check). On top, Redis could be an independent DB (TODO check, NoSQL?).
FOr DynamoDB you use DAX, but you could also use one of ElastiCache (don't remember which one), but
I don't know why.

RedShift and DAX are in-memory (TODO, anything else in-memory? what does it even mean?).

# Networking

First of all, it is all about VPCs. Some services must be in some VPC, some can be in some VPC but
don't have to (TODO check are any never in a VPC?). Some services when they are not in a VPC, they
are in AWS default VPC (TODO check maybe all?), which you don't have access to. On top you get
default VPC for each region (`172.31.0.0/16`). Generally your EC2 instances, DBs are in a VPC.
The best practice would be to have separate subnets per application tier (so webserver, DB, etc).
Of course, always remember to give the least permissions.

The default VPC is setup such, that stuff for connecting to the Internet just works (e.g. having an
EC2 with a public IP accessible from your browser Internet). However, if you create a Custom VPC,
you will have to do some configuration upfront to achieve that.

For a VPC you need to specify the CIDR block, which is IP range. The bigger the number after the slash,
the less IP addresses it has. Remember, for VPC Peering, the CIDR ranges of your VPCs cannot overlap.
There are some popular address ranges that are typically assigned. And there is a website
to decode the CIDR to concrete IP range. And some of those IPs will be reserved, so you always end up
with a couple less.

Next, you have subnets, at least one per AZ, and they also have Security Groups assigned (like EC2).
A Security Group needs to be attached to a VPC first. A subnet can be private (default) or public
(there is one checkbox for it, but that's not all you have to do to e.g. have an EC2 accessible
from the browser). In order to allow one subnet to talk to another other one, you add SSH rule from
one SG to the other.

There is at least 1 route table per VPC (one is called "main", which is kind of fallback for
unassigned subnets). A route table can have multiple subnets assigned.

If you want to create a Custom VPC, you will have to add all subnets yourself. If you want a public
subnet, don't forget about Internet Gateway. Assign it to the VPC, and add a route in the public
subnet's route table to it (you just pick the concrete IG from drop down).

To allow traffic one way from e.g. private subnet, create NAT Gateway in public subnet and
add a route table route to it from the private one. You can also have a DYI NAT on an EC2 instance,
it is then called NAT Instance (cheaper but less available and more maintenance overhead).

An (N)ACL list sits in front of the subnet, after the route table, and denies particular IPs in
and/or out. It is stateless, so it won't automatically allow an out for something that came in
and vice versa, while Security Group will.

ENI is basic, ENA is better (I/O), most performance with EFA (I/O + fast).

# Bullet points

## S3
- S3 Lifecycle Policy has some special "minimum 30 days" rules for time and paying related to Standard* and Intelligent Tiering classes (complicated)
- allowed transitions follow a [waterfall model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html)
  (basically: Standard, Standard IA, Intelligent, One Zone IA, Glaciers)
- apart from multipart upload you also have S3TA for far geo locations, but you don't pay if it didn't accelerate
- S3 is not for storing files! it is object storage

## EBS
- the SSDs can be used as boot volume, HDDs not, also Instance Store not
- Instance Store based volumes provide high random I/O performance at low cost, as long as you can live with intance loss

## EC2
- user scripts have root privileges; by default, they are not executed on restart

## Kinesis
- Firehose integrates with a lot of stuff but not DynamoDB
- Kinesis Data Streams provides ordering, routing by key, concurrent stream consumption, replay after some time, and real-time  
- Amazon Kinesis Firehose cannot take data from both Amazon Data Streams, and Kinesis Agent (`PutRecord`), then Agent needs to write to the Data Streams
- Firehose can load data into S3, RedShift, Elastisearch, Splunk

## Improving request/response time
- CloudFront is for HTTP, Global Accelerator is for UPD and TCP, games
- CloudFront has edge locations and regional cache (behind edge locations?)
- CloudFront can block countries
- CloudFront can point to on-premise

## Databases
- Aurora read replicas have priority tiers, first lowest number, second biggest gets promoted in the event of failover
- Read replicas and multi region deployments are replicated asynchronously, while Multi AZ deployment synchronously (except Aurora)
  - heck out this table [https://aws.amazon.com/rds/features/read-replicas/](https://aws.amazon.com/rds/features/read-replicas/)
- Amazon RDS Custom for Oracle lets you customize Oracle server without need for using EC2
- DynamoDB is not in-memory, DAX is, ElastiCache for Redis too
- there exists Amazon Aurora Global Database
- to encrypt an RDS database, create encrypted snapshot and restore
- you don't have direct access to db snapshot in s3

## EFS
- EFS can be cross region with inter-region VPC peering
- EFS is for Linux, FSx can be for Windows
- EFS is good for concurrent access from thousands of instances
- There is only EFS Max I/O and General Purpose performance mode (same price)

## DirectConnect
- you need VPN on top to have encryption
- DX has 3 virtual interfaces (VIFs): public, private and transit (for Transit Gateway)
- AWS PrivateLink can be used to privately access AWS services over a Direct Connect link

## Load balancers
- ELB is only within a region, for cross region use Global Accelerator
- ELB means ALB or NLB
- ALB supports content-based routing    

## Ongoing audit and security monitoring
- GuardDuty is based on ML, VPC Flow Logs, DND logs, CloudTrail, can trigger actions
- disabling GuardDuty deletes all the data

## Audit and security findings
- Amazon Inspector for insecure network config and EC2 vulnerabilities

## On-Premise integrations/migrations
- File Gateway (part of Storage Gateway) goes with NFS / SMB and uses S3
- Volume Gateway (part of Storage Gateway) goes with iSCSI and uses EBS
- FxS File Gateway has nothing to dow with File Gateway, you upload as SMB and access as FSx
- DataSync is for data migration both in AWS and on-premise (via DX), fromNFS or SMB, to S3, FSx, EFS

## Big Data
- AWS Glue is to extract, EMR is to process (and storage, EC2)
- You can use AWS glue to compress data before putting in S3 which helps with cost

## Organizations
- to migrate an account, first remove, then send invite, then accept

## Other
- ElastiCache is only for DBses, can also be used for DynamoDB
- AutoScaling group can be configured to automatically create CloudWatch alarms, you don't have to do it manually in CloudWatch
- AutoScaling group tracking policy is for continuous metrics, like memory or CPU
- AutoScaling group will not take action on unhealthy instance, if you put it in Standby mode or disable `ReplaceUnhealthy`
- Use min and max in AutoScaling group when you need a range, otherwise use desired capacity
- FSx for Lustre works with S3 allowing to transparently query and modify in S3, HPC
- if you copy an instance AMI to another region, you also copy the underlying snapshot
- without consolidated billing you can be billed for some services multiple times
- lambda has "account concurrency quota" (now 1000), SNS delivering to it will be throttled
- each Snowball has 80 Terabytes of data
- certificates provided by ACM are automatically renewed, imported not
- AWS Config can check for imported certificate expiration, also CloudWatch/EventBridge can monitor certificates
- a "shared services VPC" is often built on top of Transit Gateway but I don't get why
- Provisioned IOPS SSD (io1) is also good for stuff that needs both OIPS & Throughput (<64,000 IOPS, <1,000 MB/s throughput)
