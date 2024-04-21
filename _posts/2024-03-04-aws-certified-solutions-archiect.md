---
layout: post
title: AWS Certified Solutions Architect - Associate (SAA-C03)
date: '2024-03-04'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 43
type: certification
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March 2024.
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

# Compute

## EC2
- Elastic Compute Cloud
- virtual machine in AWS, needs web server installed on it next
- instances completely controlled by you
- revolutionising: pay per use, no wasted capacity, no long term planning for how many machines you need
- quick server provisioning (minutes not days)
- when it starts:
  - OS boots up
  - User data script is run
  - Applications start

### EC2 Hibernation
- instance memory (RAM) is saved to EBS root volume, and any data volumes are persisted
  - max 150 GB RAM
  - max 60 days
  - supported instances:
    - families: General Purpose, Compute, Memory and Storage Optimized Groups, and more
    - types: On-Demand and Reserved
  - supported OS:
    - Windows, Amazon Linux 2 AMI, Ubuntu
- on restoring from hibernation
  - EC2 instance is restored, with same ID
  - RAM is reloaded, processes resumed
  - data volumes are reattached
- this boots way faster, useful for long running processes or long initializing ones

### EC2 Pricing Options

| Name                   | Description                                                         | Use case                                                    |
|------------------------|---------------------------------------------------------------------|-------------------------------------------------------------|
| On-Demand              | Pay per hour/second                                                 | Just starting a project, checking out, short time, flexible |
| Reserved               | Reserved capacity for 1-3 years, <72% cheaper                       | When you understand your usage patterns, and you have money |
| Reserved - convertible | Can switch to a different RI of equal or better value, <54% cheaper |                                                             |
| Reserved - scheduled   | Switch to a different RIon schedule                                 |                                                             |
| Spot                   | Purchase unused capacity, <90% cheaper but fluctuates               | 
| Dedicated Hosts        | Physical EC2 Server just for you, most expensive                    |

#### Reserved instances
- work just on a regional level
- can be also used with lambda or Fargate

#### Spot instances
- basically you define your preferred maximum price and they go on and off for you 
  - if the price goes too much up, you have 2 minutes to choose whether to stop (and resume later) or terminate the instance (via metadata)
  - you can view the spot pricing history from AWS
- when you don't know when you will need a large amount of instances, or you know you can do with an unpopular time
- big data, high performance computing (HPC), tests and development workloads, image rendering
  - not for anything that requires persistent storage
- Spot Request (check out the [documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html))
  - contains max price and target capacity (for persistent requests)
  - can be one-time or persistent (from/to)
    - persistent can be active or disabled, will keep creating instances even if you terminate them, to stop you need to cancel the Spot Request
- Spot Fleet - Spot and On-Demand instances mixed, to fill the requirement
  - Strategies
    - `capacityOptimized` - instances come from a pool with optimal capacity for the number of instances launching
    - `diversified` - distributed across all pools
    - `lowestPrice` (default) - instances come from a pool with lowest price
      - optionally, with `InstancePoolsToUseCount` - how many pools to distribute across
- "*You can block Spot instances from terminating by using Spot Block*" - what?
  - no longer supported

#### Dedicated Hosts
- Compliance/licensing, e.g. not allowing mutitenant virtualisation, cloud deployments
- Can be reserved or on-demand (this one is really expensive)
- Use when you need to use your licenses that don't allow anything else..

### Launching
- Launch an instance
  - give it a name
  - pick OS image (AMI = Amazon Machine Image) - Linux, MacOS, Ubuntu, Windows, ...
  - pick architecture `x86` or `Arm`
  - pick instance type - how much CPU and GB Memory
  - create key pair, to connect via ssh, download the key pair
  - create Security Group (like a virtual firewall)
  - allow SSH traffic (port `22`), HTTP (port `80`) and HTTPs (port `443`)
  - configure storage
  - Launch instance, see the state is pending
  - The AZ will be a random one, within the region
- Connect - you can use EC2 Instance Connect from the console, or SSH client
- You can also terminate the instance

### AWS CLI
- e.g. `aws <service> ls`
- create user group that has admin access to s3, add `AmazonS3FullAccess`
- create a user, add them to that group
  - Least privilege, only CLI, use User Groups!
- user -> Security Credentials -> Create access key -> CLI
- Connect to your EC2 instance, and:
  ```
    sudo su
    dnf update -y
    aws configure
    AWS Access Key: ****
    AWS Secret Key: ****
    aws s3 ls
    aws s3 mb s3://sdfgfgdsgdfg
    aws s3 ls
  ```
- instead of having a user with these permissions, you can have a role and attach it to EC2 itself!
  - trusted entity - AWS Service
  - permission `AmazonS3FullAccess`
  - launch the instance again -> Actions -> Security -> Modify IAM Role, and pick that new role
  - this is better as the credentials are not stored on EC2
- Bootstrap Script
  - runs on EC2 startup, with root level permissions, increases boot up time
    ```bash
    #!/bin/bash
    yum install httpd -y
    # installs apache
    yum service httpd start
    # starts apache
    systemctl enable httpd
    cd /var/www/html
    echo "<html><body><h1>Hello Cloud Gurus</h1></body></html>" > index.html
    ```
  - this creates web server and adds lading page
  - to add it to your EC2 instance: Advanced Details -> User Data, when creating an instance
  - how to access that website - copy the "Public IP address" from the details, assuming you configured the Security Group

### Security groups
- Ports of computer communication
  - HTTP 80
  - HTTPs 443
  - Linux SSH 22
  - Windows RDP 3389 (e.g. for remote desktop)
- security group is like a virtual firewall; by default everything inbound is blocked, outbound is open
- `0.0.0.0/0` - to open up everything, for all IPs, and chosen ports
- changes take effect immediately
- you can have multiple SG attached to your EC2 instances, and multiple EC2 instances attached to your SG
  - if you have several SGs for an instance, the rules are merged, and the most permissive for each port win

### EC2 Metadata
- data about EC2 instance, e.g. public/private address, hostname, security groups, etc.
- the command used to be `http://169.254.169.254/latest/meta-data` (the IP is an address of the IMDS - *Instance metadata and user data*),
  [but now it is](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) (for IMDS2):
  ```
  TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
  && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/
  ```
- you can add this request to your bootstrap script (see above), e.g.
  ```
  TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
  PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)
  ```
  and the metadata will be copied to the ENV variables, e.g. `$PUBLIC_IP`, so you can even add it to your `index.html` output

### EC2 Networking
- 3 types of virtual networking cards that can be attached to your instances:

| Name | Ddescription              | Usage                                                                           |
|------|---------------------------|---------------------------------------------------------------------------------|
| ENI  | Elastic Network Interface | For basic day-to-day networking                                                 |
| EN   | Enhanced Networking       | Uses single root I/O virtualisation for high performance (SR-IOV)               |
| EFA  | Elastic Fabric Adapter    | Accelerates High Performance Computing (HPC) and machine learning applications  |
- ENI is a virtual network card
  - allowing: 
    - private & public IPv4 addresses
    - many IPv6 addresses
    - MAC addresses
    - \>1 Security Groups
  - use cases:
    - create management network, and separate production network, and separate logging network, and so on
    - use network and security appliances in your VPC
    - create dual-homed instances with workloads/roles on distinct subnects
    - low-budget, high-availability solution
- EN
  - higher I/O performance and lower CPU utilisation, `10 Gbps` - `100 Gbps`
  - higher bandwidth, higher packet per second (PPS), lower inter-instance latencies
  - can be enabled using:
    - ENA - Elastic Network Adapter, for `<100 Gbps`
    - INTEL 82599 Virtual Function (VF) Interface, for `<10 Gbps`, typically older instances
- EFA
  - like an extra accelerator
  - can use OS-bypass, only supported by Linux

### EC2 Placement Groups
- Cluster Placement Groups
  - grouping of instances within a single AZ, low latency & high throughput
  - only certain instances are compatible
  - AWS recommends homogenous instances within Cluster Placement Group
  - Can't merge placement groups
  - You can move a stopped instance into a Cluster Placement Group (but only CLI or SDK for now)
- Spread Placement Groups
  - each individual instance on separate hardware, for small critical instances to be kept separate from each other
  - can be across multiple AZs
- Partition Placement Groups
  - each partition has a set of racks (partitions, segments), each rack has its own network and power source
  - it is used to to isolate impact of hardware failure for multiple EC2 instances (e.g. HDFS, HBase, Cassandra)

### VMWare on EC2
- VMWare has been used by people around the world for private (on-premise) cloud deployments
  - some companies want a hybrid cloud strategy, and combine it with AWS Services
    AWS can be then used as an inexpensive disaster recovery
  - others want to migrate to AWS, and can use VMWare built-in tools for that
  - others just want to use some AWS Services that are not available with VMWare
- deploying VMWare on AWS (more specifically deploying vCenter using VMWare)
  - Dedicated Hosts, single account
    - each host has `2` sockets with `18` cores per socket, `512 GiB` RAM, `15.2 TB` Raw SSD storage
    - each host can run hundreds of VMWare instances
    - clusters can start with `2-16` hosts per cluster

### AWS Outposts
- AWS in your private datacenter (the other way round than WMVare on AWS)
- server racks, rack can have 42U, server units of 1U and 2U
- this is another way to get hybrid cloud
  - AWS manages all the infrastructure
  - consistency
- Outpost Family Members
  - Outpost Rack
    - starts with `1` 42U rack and scales up to `96` racks
    - to be used in a datacenter, you need a lot of storage
  - Outpost Servers
    - individual U1 or U2 servers, when you have less space
    - retail stores, branch offices, healthcare provider locations, factory floors
- you order them in AWS Console
  - AWS staff will come to install and deploy the hardware
  - you can manage everything via AWS Console

### Bootstraping EC2 servers
- you can do it manually:
  - `ssh username@public_ip` -> enter password
  - `sudo apt-get update && sudo apt-get upgrade -y` - update packages and install them, `-y` skips confirmations --> again enter password
  - `sudo apt-get install apache2 -y` - install Apache Server -> now you can access it from browser by public IP address (http)
  - `sudo apt-get install unzip -y` - for aws cli
  - `curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"` - download aws cli
  - `unzip awscliv2.zip`
  - `sudo ./aws/install` - run installing script
  - `aws --version`
  - `sudo chmod 777 /var/www/html/index.html` - give full permissions, don't do this in production
  - `curl http://169.254.169.254/latest/meta-data/placement/availability-zone` - get metadata!
  - ```bash
    echo '<html><h1>Bootstrap Demo</h1><h3>Availability Zone: ' > /var/www/html/index.html
    curl http://169.254.169.254/latest/meta-data/placement/availability-zone >> /var/www/html/index.html
    echo '</h3> <h3>Instance Id: ' >> /var/www/html/index.html
    curl http://169.254.169.254/latest/meta-data/instance-id >> /var/www/html/index.html
    echo '</h3> <h3>Public IP: ' >> /var/www/html/index.html
    curl http://169.254.169.254/latest/meta-data/public-ipv4 >> /var/www/html/index.html
    echo '</h3> <h3>Local IP: ' >> /var/www/html/index.html
    curl http://169.254.169.254/latest/meta-data/local-ipv4 >> /var/www/html/index.html
    echo '</h3></html> ' >> /var/www/html/index.html
    ``` 
    -> this will hardcode the metadata in index.html
  - `sudo apt-get install mysql-server -y` - install MySQL Server
  - `systemctl enable mysql`
- or you can do it with bootstrap script
  - remember to check "Auto-assign public IP" when launching the instance
  - you don't end ssh key-pair (unless this was prod)
  - and finall, Advanced Details -> User Data - here you paste the script:
  ```bash
  #!/bin/bash
  sudo apt-get update -y
  sudo apt-get install apache2 unzip -y
  sudo systemctl enable apache2
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  echo '<html><h1>Bootstrap Demo</h1><h3>Availability Zone: ' > /var/www/html/index.html
  curl http://169.254.169.254/latest/meta-data/placement/availability-zone >> /var/www/html/index.html
  echo '</h3> <h3>Instance Id: ' >> /var/www/html/index.html
  curl http://169.254.169.254/latest/meta-data/instance-id >> /var/www/html/index.html
  echo '</h3> <h3>Public IP: ' >> /var/www/html/index.html
  curl http://169.254.169.254/latest/meta-data/public-ipv4 >> /var/www/html/index.html
  echo '</h3> <h3>Local IP: ' >> /var/www/html/index.html
  curl http://169.254.169.254/latest/meta-data/local-ipv4 >> /var/www/html/index.html
  echo '</h3></html> ' >> /var/www/html/index.html
  sudo apt-get install mysql-server
  sudo systemctl enable mysql
  ```
  - `sudo systemctl status apache2`, `ps aux | grep apache` - make sure Apache is running
  - `sudo systemctl status mysql`, `ps aux | grep mysql` - verify MySQL is running - first will say no
  - `sudo systemctl start mysql` - start MySQL - won't work
  - `curl http://169.254.169.254/latest/user-data` - view user data again (if it does not work, see [enhancements to the EC2 Instance Metadata Service](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/))
    - the problem is missing -y at the apt-get, so it was not confirmed
  - `sudo systemctl enable mysql`

### EC2 Instance Profile
- when you assign an IAM role to an EC2 instance, what happens, there is an Instance Profile created behind the scened
  - inside the instance there will also be temporary credentials created for the instance, but they are rotated automatically
- to create a role from ec2 terminal: `aws iam create-role --role-name DEV_ROLE --assume-role-policy-document file://trust_policy_ec2.json` create role from command line of EC2 instance

#### Configuring Instance Profile in ec2 cli
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"Service": "ec2.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }
  ]
}
```
(trust policy says who can assume this role)
- to create policy from ec2 terminal: `aws iam create-policy --policy-name DevS3ReadAccess --policy-document file://dev_s3_read_access.json`
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
          "Sid": "AllowUserToSeeBucketListInTheConsole",
          "Action": ["s3:ListAllMyBuckets", "s3:GetBucketLocation"],
          "Effect": "Allow",
          "Resource": ["arn:aws:s3:::*"]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::<BUCKET_NAME>/*",
                "arn:aws:s3:::<BUCKET_NAME>"
            ]
        }
    ]
}
```
- attach policy to the role (from ec2 terminal):
  `aws iam attach-role-policy --role-name DEV_ROLE --policy-arn "arn:aws:iam::613967324686:policy/DevS3ReadAccess"`
- verify the above: `aws iam list-attached-role-policies --role-name DEV_ROLE`
- create Instance Profile: `aws iam create-instance-profile --instance-profile-name DEV_PROFILE`
- add role to the Instance Profile: `aws iam add-role-to-instance-profile --instance-profile-name DEV_PROFILE --role-name DEV_ROLE`
- verify the above: `aws iam get-instance-profile --instance-profile-name DEV_PROFILE`
- associate ec2 Instance Profile with the instance id (copy from console): `aws ec2 associate-iam-instance-profile --instance-id i-0f9e1a909dff2df29 --iam-instance-profile Name="DEV_PROFILE"`
- verify the above: `aws ec2 describe-instances --instance-ids i-0f9e1a909dff2df29`, look for IamInstanceProfile
- check if the role is assumed: `aws sts get-caller-identity`

#### Configuring Instance Profile in AWS console
- here Instance Profile creation is handled behind the scenes
- IAM -> Policies -> create Policy -> JSON
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
          "Sid": "AllowUserToSeeBucketListInTheConsole",
          "Action": ["s3:ListAllMyBuckets", "s3:GetBucketLocation"],
          "Effect": "Allow",
          "Resource": ["arn:aws:s3:::*"]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::<BUCKET_NAME>/*",
                "arn:aws:s3:::<BUCKET_NAME>"
            ]
        }
    ]
}
```
- IAM -> Roles -> create role -> EC2 (automatically creating trust policy)
  - find the policy created above, add, create
- EC2 -> Running Instances -> Actions -> Security -> Modify IAM Role -> pick new role
- verify from cli: `aws sts get-caller-identity`

### EC2 AMIs
- stands for Amazon Machine Image, information to launch an instance, you specify this when you launch EC2 instance
- can be based on:
  - region
  - OS
  - Architecture (32 or 64 bit)
  - Launch permissions
  - Storage for the root device (root device volume, where OS is)
- can be backed by:
  - EBS - root device is EBS volume, created from instance snapshot
    - by default you lose your data on termination, but you can change it (funny UI, keep clicking around). You don't lose the data on stopping the instance.
  - Instance Store - root device is instance store volume, created from a template stored in S3
    - this is ephemeral storage - the volume cannot be stopped. You lose your data on host failure (or termination).
      - you don't loose the data on reboot
    - you can find them in Browse more AMIs -> Community AMIs -> filter by Instance Store

### AWS Backup
- why to use it - you can backup many things in one place, consistency (mostly EC2 stuff with their various storage options)
- can create automations, lifecycle policies to expire backups, encryption of backup, overview for audits 
- can be used with AWS Organizations (multiple accounts)

# Lambda
# Elastic Beanstalk

# Storage

## S3 - Simple Storage Service
- Buckets must be globally unique
- But deployed to specific regions
- *Secure, durable and highly scalable object storage* - scalable because available whenever/whatever and cheap
- Only static flies, no running anything there
- Unlimited storage, each object up to **5 TB**
- URLs look like this: https://`bucket-name`.s3.`region`.amazonaws.com/`key-name`
  - Key is the key, object is the file; it's still called object-based not file-based
  - universal namespace - all bucket names must be unique across all AWS accounts
  - value is the actual data
- also can have Version ID, metadata (content type, last modified, etc)
- Data is **spread across multiple devices** to ensure: 
  - availability (99.95%-99.99%) 
  - durability (9.9999999999%, *"eleven nines"*)
- AWS CLI returns `HTTP 200` on successful upload (`PUT`)
- Static website on S3 - good when you need to scale quick, when you are not sure about the demand
    - on the bucket properties there's sth like *”host static website”*
    - you specify the index and error html
    - upload files
    - then you need to make the bucket public (see *S3 Securing* below)

### S3 Tiers
- Standard - default, minimum **3 AZ**, for frequently accessed data
- With Lifecycle Management you can automatically move your objects to cheaper Tier, or delete

### S3 Versioning
- if enabled, versioning is there even for deletion
- you cannot disable once enabled, only suspend
- properties -> bucked versioning
  - first version is null
  - previous versions are not public even if the bucket was made public
  - how to recover deleted object - show versions, check the "delete marker" and delete this one (permanently)
- can be integrated with lifecycle rules
- another way to protect from accidental deletion is MFA
- you pay per storage and access just like any other object (TODO verify)

### S3 Securing
- You can have:
  - Server side encryption
  - Access Control lists (ACLs), per object, accounts and groups can have specified access type
  - Bucket policies, per operation, but bucket wide
    - By default buckets are private. How to make a bucket public:
      - you can enable this option on both the bucket and the object (option 1)
        - uncheck “block public access” (that is done by a policy)
        - pick “ACLs enabled” in Object Ownership tab
        - bucket actions -> “make public using ACL”
      - or you can enable it for the whole bucket: permissions -> bucket policy (option 2)
      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
            {
              "Sid": "PublicReadGetObject",
              "Effect": "Allow",
              "Principal": "*",
              "Action": [
                 "s3:GetObject"
              ],
              "Resource": [
                 "arn:aws:s3:::BUCKET_NAME/*"
              ]
            }
        ]
      }
      ```

### S3 Consistency Model
- strong "read after write" consistency - it will not read outdated file, also list operations won't
      
### S3 Storage Classes
- S3 Standard - high availability and durability - >=AZs, 99.99% availability, 99.9999..999 (11 9s)
  - websites, videos
  - as of 2024 0.023$ per GB
  - S3 Standard-IA - infrequently accessed data, 2x cheaper
    - still, rapid access
    - you pay more per access (per GB) than for the storage
    - long term storage: backups, disaster recovery
  - S3 Standard-IA with 1 AZ
    - 20% cheaper from above, for non critical data
  - S3 Intelligent Tiering - as much as Standard plus small fee for monitoring each object
    - automatically moves objects between tiers to make it cheaper, based on access patterns
- S3 Glacier - >=AZs, 99.99% availability, 99.9999..999 (11 9s), 5x cheaper than S3 Standard
  - pay per access (per GB), storage cheap
  - use only for archiving
  - optimized for very infrequent access (e.g. once a year)
  - data stored in archives and vaults, not buckets
- S3 Glacier Instant Retrieval
- S3 Glacier Flexible Retrieval - just a bit cheaper than Glacier
  - retrieval is no cost, but you may have to wait 12 hours to access
  - e.g. non critical backups
- S3 Glacier Deep Archive
  - cheapest, more than 10x cheaper than S3 Glacier
  - 12-48 hours to access
  - retain data for 7-10 years
  - e.g. legal and compliance documents

| Storage Class                               | Availiabi. | Durabi.| AZs   | Use Case                                                                    |
|---------------------------------------------|------------|--------|-------|-----------------------------------------------------------------------------|
| S3 Standard                                 | 99.99%     | 11 9s  | >=3   | Most, websites, mobile&gaming apps, big data analytics                      |
| S3 S. Infrequent Access                     | 99.99%     | 11 9s  | >=3   | Long term, infrequently accessed critical data (backups, disaster recovery) |                 
| S3 One-Zone Inf. Access                     | **99.95%** | 11 9s  | **1** | Long term, infrequently accessed non-critical data                          |
| S3 Glacier (aka Glacier Flexible Retrieval) | 99.99%     | 11 9s  | >=3   | Long term, very infrequently accessed, but quick retrieval                  |                                                        
| S3 G. Deep Archive                          | 99.99%     | 11 9s  | >=3   | Rarely accessed, e.g. regulatory, retrieval from 12h                        |                                                              
| S3 Intelligent Tiering                      | 99.99%     | 11 9s  | >=3   | Unpredictable access patterns                                               |

### S3 Lifecycle Management
- automatically move files to different tiers, e.g. after a period of not used (TODO how? i think this is wrong)
- can move versions independently of each other
- bucket -> Management -> Lifecycle rules

### S3 Object Lock 
- WORM model - write once, read many, not allowed to update for fixed amount of time - retention period
  - can be used for regulatory reqs
- **retention period** is put on an object version - a timestamp is added to the metadata
- Compliance mode - can't be deleted or modified by anyone, even root, no update of retention period
- Governance mode - can be updated/deleted by users with permissions, also can update the retention period
- Legal hold - like object lock, but no retention period, user just needs a permission `s3:PutObjectLegalHold` to add and remove legal hold
- **Glacier Vault Lock** - is WORM model for Glacier vaults, the vault lock policy once locked cannot be changed

### S3 Encryption
- Encryption in Transit - to and from the bucket
  - SSL/TLS -> means you use HTTPS to access it, port `443`
- Encryption at Rest - Server-Side encryption
  - SSE-S3 - S3 managed keys, AES-256, happens in the background (enabled by default)
  - SSE-KMS - AWS Key Management Service
  - SSE-C - customer provided keys
- Encryption at Rest - Client-Side encryption
  - you do it yourself before uploading
- If they ask you how to enforce server side encryption - is a wrong question as now it is by default enforced, but
  it may just be an old question
  - `x-amz-server-side-encryption` parameter should be included in the `PUT` HTTPS request header, with value `AES256` or `aws:kms`, 
    then the encryption will happen at the time of upload
  - you can also create an S3 bucket policy that denies any S3 upload without this header

### S3 Performance
- S3 Prefix - are folders in our bucket, e.g. `mybucket/folder1/subfolder1/myfile.jpg` -> `/folder1/subfolder1` is the prefix
- the S3 latency is already low, 200-300 milliseconds for first data out
- the requests per second are per prefix, so spread your prefixes (`3 500`rps for updates and `5 000`rps for gets)
- KMS also has limit though, `GenerateDataKey` for upload, and `Decrypt` for download, `5 500`rps, `10 000`rps, or `30 000`rps depending on region, no quota increase is possible
- Multipart upload
  - recommended for >`100 MB`, required for >`5 GB`
  - multipart parallelizes the uploads
- S3 Byte-Range Fetches
  - parallelize downloads, download in chunks in parallel

### S3 Replication
- used to be cross region but now is even cross bucket, for resilience
- do it for bucket
- needs to be enabled on source and target buckets
- did not work retrospectively, but now you get a prompt if you want to do it when you create the rule
- versioning is required on both buckets
- delete markers are not replicated by default, you need to enable it
- Management -> Replication rules
  - you need to specify AIM role (why?)
  - specify path to completion report, e.g. `s3//sourcebucket343425`
  - there may be a **S3 Batch Job** created to replicate existing (or also future?) objects, its folder may be created in source bucket,
    and also replicated into destination bucket -> but I have not seen this in the lab, only course video

## EBS - Elastic Block Store
- Virtual hard disc attached to VM
- You can attach them to your EC2 instance
- You can install OS there, install applications, database, etc.
- For mission critical data, production, highly available, automatically replicated within 1 AZ
- Scalable: can dynamically adjust capacity without downtime, you just have to extend the filesystem in the OS, so that it can see it
  - you can also freely change instance type on-the-fly
- Have to be in the same AZ as EC2 they are attached to
- When you Stop an instance, the data is kept on EBS, but when you Terminate, the root device volume will also be terminated (by default)

### IOPS vs Throughtput
- IOPS (or PIOPS): read/write operations per second, quick transactions, low latency apps, transactions going on simultaneously, if you have transactional DB
  - best fit: Provisioned IOPS SSD (io1 or io2)
- Throughput: read/written bits per second, large datasets, large IO sizes, complex queries, large datasets
  - best fit: Throughput Optimized HDD (st1)

### EBS Types
- `standard`
  - previous generation volume, for infrequent access
  - 1 GiB - 1 TiB
  - IOPS 40-200
  - Throughput 40-90 MiB/s
- `General Purpose SSD (gp2)`
  - balance of price & performance
  - 3 IOPS / GiB, `<16k IOPS` per volume
  - for < 1TB, <3k IOPS
  - 99.9% durability
  - good for boot volumes, or development and test applications that are not latency sensitive
- `General Purpose SSD (gp3)`
  - max performance **4 times faster than gp2**
  - predictable 3k IOPS performance and 125 MiB/s regardless of size
  - 99.9% durability
  - for apps requiring high performance at low cost, e.g. MySQL, Cassandra, virtual desktops, Hadoop analytics
  - can get 16k IOPS and 1k MiB/s for extra fee
  - you don't have to remember numbers, choose gp3 over gp2 always
- `Provisioned IOPS SSD (io1 legacy)`
  - most expensive, high performance
  - `< 64k IOPS` per volume, 50 IOPS / GiB
  - use if you need more than 16k OIPS
  - for IO intensive applications, large databases, latency sensitive workloads
- `Provisioned IOPS SSD (io2)`
  - same price as io1
  - `< 64k IOPS` per volume, 500 IOPS / GiB
  - `99.9999%` durability
  - usage like io1 but high durability
- `Throughput optimized HDD (st1)`
  - low cost hard disk drive, a lot of data
  - baseline throughput of 40 MB/s per TB, spiking up to 250 MB/s per TB
  - max throughput 500 MB/s per volume
  - 99.9% durability
  - frequently accessed, throughput intensive workloads, e.g. big data, data warehouses, ETL, log processing
  - cannot be a boot volume
- `Cold HDD (SC1)`
  - cheapest
  - 12 MB/s per TB, spiking up to 80 MB/s per TB
  - max throughput 250 MB/s per volume
  - 99.9% durability
  - for data requiring fewer scans per day, performance not a factor, e.g. file server
  - cannot be a boot volume
- Summary:
  - big data, data warehouse, ETLs -> Throughput Optimized HDD
  - transactions -> Provisioned IOPS SSD if you have money (io2), otherwise General Purpose SSD (gp2)
  - lowest cost -> Cold HDD

### EBS Volumes & Snapshots
- an EBS Volume is virtual hard disk = root device volume, where stuff is installed
  - you need minimum 1 volume per EC2 instance
- an EBS Snapshot is an incremental copy of the Volume, in a point in time, put on S3
  - first Snapshot is going to take longer
  - recommended to take a Snapshot on a stopped instance, to avoid missing data cached in memory
  - taking a Snapshot of an encrypted Volume will be automatically encrypted
  - you can share Snapshot within same region, otherwise you have to copy it to another region (that's how you copy EC2 between regions!)
    - EC2 -> Elastic Block Store -> Volumes -> Actions -> Create Snapshot
    - EC2 -> Elastic Block Store -> Snapshots -> Actions -> Copy Snapshot - pick another region (you can extra encrypt it)
    - go to the other region -> EC2 -> Elastic Block Store -> Snapshots -> Actions -> Create Image from Snapshot (not Volume)
    - EC2 -> Images -> AMIs -> Launch Instance from AMI

### EBS Encryption
- you can encrypt your Volume with an industry standard AES-256 algorithm
- uses KMS's (Key Management Service) CMKs (Customer Master Keys)
- when EBS is encrypted, it is end-to-end:
  - => data inside the Volume is encrypted
  - => data in transit between instance and Volume is encrypted
  - => all snapshots are encrypted
  - => all Volumes created from those snapshots are encrypted
- handled transparently
- minimal impact on latency
- you can enable it also while copying unencrypted snapshot, this is how you encrypt an unencrypted volume


## EFS - Elastic File Service
- Storing files centrally
- Managed NAS filer based on NFS (Network File System), can be mounted on many EC2 instances at once, in multiple AZs
  - connected via Mount Target, which is in the services' VPC&Subnet, but the NFS is outside
- Highly available, scalable and expensive
  - pay per use
  - thousands of concurrent connections (EC2 instances)
  - 10 GB/s throughput
  - up to Petabytes of storage
  - you can pick: General Purpose (web server, CMS, etc) or Max I/O (big data, media processing)
- Read after write consistency
- Use cases: content management, web servers
- Uses NFSv4 (Network File System v4) protocol, only Linux, no Windows
- Encryption at rest using KMS
- File system scales automatically
- Storage Tiers, also has lifecycle management
  - Standard
  - Infrequently Accessed
- By default Encrypted, by default tiny size
- You can choose backups, performance settings (Enhances, Bursting, Provisioned, ..)
- Lab: each web server had EBS storage containing identical data, replace 3 EBSs with one EFS -> cost reduction
  - to see mounted drives -> `df -h`, there you can also see the sizes, or `lsblk`
  - you need to set same security group for the mount point as EC2 is in, and add an Inbound Rule for NFS (`0.0.0.0/0`)
  - to mount the EFS:
    - login to the instance
    - `sudo mkdir /efs`
    - in the console, choose Attach -> by IP -> copy the command, but add slash before `efs`
      `sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport 10.0.0.36:/ /efs`
    - `lsblk` will not show it, but `mount` or `df -h` will
    - to copy files better use `rsync -rav <source> <destination>`
    - to unmount old EBS: `sudo umount /data` (`/data` is where it was mounted)
    - to keep it unmounted on reboot: `sudo nano /etc/fstab`, remove the line with `/data`
    - to mount EFS on reboot to the same dir, add line (with tabs not spaces):
    `<the IP of the EFS from the console>:/     /data     nfs4   <options from the -o arg in the console> 0 0`, in our case:
    `10.0.0.36:/     /data     nfs4    nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport 0 0`
    - unmount `/efs` to be sure it works with `/data` only `sudo umount /efs`
    - `sudo mount -a`, and see `/data` is mounted
    - go to the Console and detach the Volume, and then delete Volume
  
## FSx
- FSx for Windows
  - centralized storage
  - built on Windows File Server, fully managed native Microsoft Windows file system
  - Runs SMB (Windows Server Message Block) based file services
  - Supports AD users, access control lists, groups, security policies, DFS (Distributed File System) namespaces and replication
  - Offers encryption with KMS
  - E.g. SharePoint, Workspaces, IIS Web Server are also native Microsoft applications
- FSx for Lustre
  - optimized for compute intensive workloads, HPC (High Performance Computing), AI, machine learning, financial modelling
  - hundreds of GiB/s, millions of IOPS, sub-milliseconds latencies
  - can store data directly on S3

# Databases

## RDS
- data organized into tables
- SQLServer, PostgreSQL, Oracle, MariaDB, MySQL, Aurora
- RDS is an EC2 instance where you don't have access to OS, only the DB
- Multi AZ support - primary can be in different AZ than secondary (stand-by), automated failover
  - this is not used for lessening load on writer instance, only failover/disaster recovery! 
    - everything happens in the background, stand-by database will be promoted to primary one, DNS address will point to the new one
  - multi AZ deployment clusters offer 2 stand-by instances
  - Aurora is always multi AZ by default
- Automated backups
- used for OLTP processing (online transaction processing)
  - as opposed to OLAP (online analytical processing), where RDS is not suitable (e.g. complex queries, analysis, Big Data), where RedShift is more appropriate
- Read replica - for read queries (e.g BI), same be multi AZ or even cross region
  - must have automated backups enabled to deploy one
  - up to 5 read replicas per DB, can be different DB type
  - has a separate DNS endpoint
  - can also be promoted to be its own database, useful e.g. before a big querying party
  - RDS -> DB -> Actions -> Create read replica
  - max 40 Amazon RDS DB instances per account

### Provisioning RDS
- RDS -> Create Database
  - you can put your credentials into Secret Manager automatically
  - pick VPC and Subnet (will show many subnets after creation, why?)
  - Public access usually No
  - Security groups
  - after creating there is a popup View credential details - you only see it once

### Amazon Aurora
- is Amazon's DB
- MySQL and PostgreSQL compatible
- 5 times better performance than MySQL and 3 times better than PostgreSQL, also cheaper
- starts with `10 GB` and goes up to `128 TB`, in 10 GB increments
- up to `96 vCPUs` and `768 GB` memory
- in minimum 3 AZ, 2 copies each -> `6` copies!
  - can handle losing up to 2 copies for writes and 3 copies for reads, with no downtime
  - max 15 replicas, with Aurora (with automated failover), MySQL or PostgreSQL
- self healing - data blocks and discs scanned and repaired automatically
- automated backups enabled automatically
- you can take snapshots and share with other accounts

### Aurora Serverless
- scales up and down according to the needs
- for infrequent, intermittent or unpredictable workflows

## DynamoDB
- Fast flexible non relational, with consistent millisecond latency
- Supports both documents and key value data models
- IoT, gaming, mobile
- Spread across 3 geographically different data centers, on SSD
- Eventually consistent reads (default, ~<1s) / strongly consistent reads / transactional reads
- Standard / transactional writes
- DAX - in memory cache, down to microseconds (<10x) (with ttl)
  - You then connect only to DAX
  - Pay per request
  - you connect to DAX, everything else in the background
- Partition key (PK), sort key
- "no application rewrites" - they mean you don’t have to change the code, refactor to enable global tables
- On-Demand (pay per request) or provisioned
- if they ask how to spread data across multiple regions - enable Global tables, it’s a tab in your table -> create replica, choose region
- if they ask about high performance DB -> is DynamoDB

### DynamoDB Security
- Encryption at rest with KMS
- Site to site VPN
- Direct Connect (DC)
- IAM policies and roles, fine grained access
- CloudWatch and CloudTrail integration
- VPC endpoints (traffic stays in AWS)

### DynamoDB transactions
- ACID
- Across many tables
- <100 items or <4MB data per transaction

### DynamoDB Backups
- On demand, no impact on performance / availability
- Same region as the source table
- PITR - Point In Time Recovery
- Restore to any point in last 35 days down to 5 minutes, incremental backups, needs to be explicitly enabled

### DynamoDB Streams
- Time ordered sequence of item-level changes in a table, FIFO
- Each change has a sequence number, stored for 24h
- Streams divided into records (1 record = 1 change?), grouped into shards, with ids, probably by item key
- Can add lambdas, which kinda work as stored procedures

### Global tables
- Multi region tables, for globally distributed applications, offers disaster recovery and high availability
- Can be turned on without need to make code changes
- Based on DynamoDB streams, you need to enable them first
- Multi master
- Replication latency ~< 1s
- How to spread your table across multiple regions
  - DynamoDB -> Create table -> PK -> Open the table -> Global Tables -> Create replica -> pick region (streams will be automatically enabled)

## DocumentDB
- is MongoDB on AWS - document database
- only if you already have MongoDB on premise and want to move it to the Cloud, otherwise DynamoDB is better
- will add scalability and durability, backups, all ops overhread
  - you use AWS Migration Service

## Amazon Keyspaces
- is Cassandra on AWS - distributed noSQL DB for Big Data
- is serverless

## Amazon Neptune
- is a graph database
- use cases: social graphs, ad targeting, personalisation, analytics, product database, model general information, fraud detection, security risk detection

## QLDB (Amazon Quantuum Ledger Database)
- nothing to do with quantuum computing
- ledger database - changelog where records cannot be modified, you don't update, only insert
  - cryptographically verifiable
  - owned by 1 authority
- usages: crypto, blockchain, shipping tracking, deliveries, pharmaceutical companies tracking drug distribution, financial transactions, claims history

## Amazon Timestream
- DB for data points logged over series of time
- trillions of events per day, up to 1k faster and 10x cheaper than RDS
- uses: IoT, weather stations, web traffic analysis, devops monitoring

## RedShift
- DB warehousing technology

# Networking

## VPC
- Virtual datacenter in the cloud

## Direct Connect
- Directly connecting on premise to AWS

## Route53
- DNS, registering domain names and pointing them at AWS webservice

## AWS Gateway
- Serverless way of replacing your web service

## AWS Global Accelerator
- Accelerate your audiences against your application in the AWS

## Installing Wordpress
- create RDS DB
- create EC2, inside:
```bash
sudo apt install apache2 libapache2-mod-php php-mysql
# (install wordpress - skipped)
cd /var/www/
ls
sudo mv /wordpress .
cd wordpress
sudo mv 000-default.conf /etc/apache2/sites-enabled/ #apache configuration, to serve from /var/www/wordpress
sudo apache2ctl restart
sudo nano wp-config.php
```
```
...
// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** MySQL database username */
define( 'DB_USER', 'wordpress' );

/** MySQL database password */
define( 'DB_PASSWORD', 'wordpress' );

/** MySQL hostname */
define( 'DB_HOST', '<the RDS Endpoint>' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );\
...
```
- Security Group -> add MySQL inbound rule, from that same SG

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







