---
layout: post
title: AWS SAA-C03 - Compute
date: '2024-04-17'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 45
type: certification
customColor: true
fgColor: "#b30000"
bgColor: "#ffcccc"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview) course.
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS Compute.
</div>

<h1>Table of contents</h1>
<div markdown="1">
  <a href="#elastic-compute-cloud-ec2" class="mindmap mindmap-new-section" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `EC2` `booting: OS, user data, application` `On-Demand` `Reserved 1-3 years` `Reserved regional` `Reserved convertible/scheduled` 
    `Spot` `Spot 2 minutes to stop` `Spot Request, one-time/persistent` `Spot Fleet (mixed)` `Dedicated Hosts, reserved/on-demand`
    `SSH=22, HTTPS=443` `Security Group: inbound blocked outbound open` `Security Groups many-to-many, most permissive wins` `EC2 Metadata`
    `EC2 Hibernation, <60 days, <150 RAM`
  </a>
  <a href="#ec2-amazon-machine-image-ami" class="mindmap" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `EC2 Amazon Machine Image (AMI)` `region based` `EBS` `Instance Store - ephemeral storage` `EC2 Launch Templates` `Instance Profile when IAM role` 
    `ENI, EN (high performance), EFA Networking (ML, OS-bypass) cards` `EC2 Placement Groups: Cluster, Spread, Partition (Cassandra)` 
    `EC2 Hibernation, <60 days, <150 RAM`
  </a>
  <a href="#auto-scaling-groupd" class="mindmap" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `Auto Scaling Groups`
  </a>
  <a href="#ec2-networking" class="mindmap" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `EC2 Networking` `Elastic Network Interface (ENI)` `Enhanced Networking (EN), Single Root I/O Virtualization (SR-IOV), high performance` `Elastic Fabric Adapter (EFA), OS-bypass, e.g. HPC, ML) cards` 
  </a>
  <a href="#ec2-placement-groups" class="mindmap" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `EC2 Placement Groups` `Cluster, single AZ` `Spread, separate hardware` `Partition, racks separate, e.g. Cassandra` `can move stopped instance`
    `only some are compatible`
  </a>
  <a href="#systems-manager-ssm" class="mindmap" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `Systems Manager (SSM)`
  </a>
  <a href="#ec2-practical---step-by-steps" class="mindmap mindmap-new-section" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `EC2 Practical` `Launching EC2 instance` `AWS CLI` `Configuring Instance Profile in EC2 CLI/AWS Console` 
    `Bootstraping EC2 servers` `Installing Wordpress`
  </a>
  <a href="#vmware-on-ec2" class="mindmap mindmap-new-section" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `VMWare on EC2` `vCenter` `hybrid cloud` `disaster recovery` `AWS migration` `cherry pick AWS services` `dedicated hardware` `single account` `512 RAM` 
    `15 TB storage` `2-16 hosts per cluster` 
  </a>
  <a href="#aws-outposts" class="mindmap" style="--mindmap-color: #b30000; --mindmap-color-lighter: #ffcccc;">
    `AWS Outposts` `AWS in private datacenter` `hybrid cloud` `<96 server units` `Outpost Rack (has servers), for datacenter` 
    `Outpost Servers` `AWS staff visits`
  </a>
</div>

# Elastic Compute Cloud (EC2)
- virtual machine in AWS, needs web server installed on it next
- instances completely controlled by you
- revolutionising: pay per use, no wasted capacity, no long term planning for how many machines you need
- quick server provisioning (minutes not days)
- when it starts:
  - **OS boots up**
  - **User data script is run**
  - **Applications start**

## EC2 Pricing Options

| Name                      | Description                                                                | Use case                                                    |
|---------------------------|----------------------------------------------------------------------------|-------------------------------------------------------------|
| **On-Demand**             | Pay per hour/second                                                        | Just starting a project, checking out, short time, flexible |
| **Reserved**              | Reserved capacity for `1-3` years, <`72%` cheaper                          | When you understand your usage patterns, and you have money |
| **Reserved - convertible**| Can switch to a different RI of equal or better value, only <`54%` cheaper |                                                             |
| **Reserved - scheduled**  | Switch to a different RI on schedule                                       |                                                             |
| **Spot**                  | Purchase unused capacity, <`90%` cheaper but fluctuates                    |                                                             |
| **Dedicated Hosts**       | Physical EC2 Server just for you, most expensive                           |                                                             |

- **Reserved instances**
  - reservations works just on a **regional level**
  - can be also used with lambda or Fargate
- **Spot instances**
  - basically you define your **preferred maximum price** and they go on and off for you 
    - if the price goes too much up, you have `2 minutes` to choose whether to stop (and resume later) or terminate the instance (via metadata)
    - before you buy you can view the **spot pricing history** from AWS
  - when you don't know **when** you will need a large amount of instances, or you know you can do with an **unpopular time**
  - **big data, high performance computing (HPC), tests and development workloads, image rendering**
    - not for anything that requires persistent storage
  - **Spot Request** (check out the [documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html))
    - contains max price and target capacity (for persistent requests)
    - can be **one-time** or **persistent** (you provide min and max amount instances)
      - persistent can be active or disabled, will keep creating instances even if you terminate them, to stop you need to cancel the Spot Request
  - **Spot Fleet** - **Spot and On-Demand instances mixed**, to fill the requirement you provide
    - Strategies
      - **capacityOptimized** - instances come from a pool with optimal capacity for the number of instances launching
      - **diversified** - distributed across all pools
      - **lowestPrice** (default) - instances come from a pool with lowest price
        - optionally, with `InstancePoolsToUseCount` - how many pools to distribute across
  - (no longer supported) "*You can block Spot instances from terminating by using Spot Block*"
- **Dedicated Hosts**
  - **compliance/licensing**, e.g. not allowing multitenant virtualisation, cloud deployments
  - **can be reserved or on-demand** (this one is really expensive)
  - use when you need to use your licenses that don't allow anything else..
- you can use **AWS Pricing Calculator**

## EC2 Amazon Machine Image (AMI)
- information to launch an instance, you specify this when you launch EC2 instance
- can be based on:
  - **region**
  - OS
  - architecture (32 or 64 bit)
  - launch permissions
  - storage for the root device (root device volume, where OS is)
- you can create AMIs from running or stopped EC2 instances: Instance -> right click -> Images -> Create Image (will be rebooted for snapshot)
- root device storage:
  - **EBS** - root device is EBS volume, created from instance snapshot
    - by default you lose your data on termination, but you can change it (funny UI, keep clicking around). You don't lose the data on stopping the instance.
  - **Instance Store** - root device is instance store volume, created from a template stored in **S3**
    - you create it from other AMI with Instance Store
    - this is **ephemeral storage** - the volume **cannot be stopped**. You lose your data on host failure (or termination).
      - **you still don't loose the data on reboot**
    - you can find them in Browse more AMIs -> Community AMIs -> filter by Instance Store

# Auto Scaling Groups
- Auto Scaling Group is a **collection of EC2 instances treated as a collective group for scaling and management**
  - Auto Scaling is **only for EC2**, for other services it is not called like this
- configuration consists of
  - pick the **launch template**
  - pick **purchasing options (On Demand or Spot)**, choose **multiple AZs** for availability (AWS wil automatically try to spread across them evenly)
  - **ELB can be configured within the Auto Scaling Groups**
    - Scaling Groups have their **own simple Health Checks**, but you can also use the ones from LBs
    - you would have to **adjust Security Groups to allow traffic**
    - including **ELB health checks cause unhealthy instances to be terminated and replaced** (you still need some checkbox)
  - set scaling policy: **minimum**, **maximum** and **desired** (initial amount)
    - you can also build **auto scaling policies**, on top of this
  - you can set up **notifications with SNS**
- **Lifecycle hooks**
  - can happen **on scaling out** (start up), or **scaling in** (shut down)
  - the hooks have **up to 2 hours waiting**, in case you need to run some scripts on the instance before startup, or save some logs before the shut down
  - the hook have **wait state** (e.g. for running the scripts), and then **proceed state** (by sending the `complete-lifecycle-action` command)
- how to create Auto Scaling Group
  - EC2 -> Auto Scaling Groups -> Create, pick **name and launch template** -> **select VPC and subnet(s)** (remember for availability you need at least 2 AZs) -> ...
    - .. -> Instance type requirements - you can specify **max and min for cpu and memory**, or **add instances manually**, with **weights**
    - .. -> Instance Purchase Options - you can pick a distribution between **On-Demand or Spot**, if you pick both there is also sth like Allocation Strategy
    - .. -> Load Balancing - **pick existing or create new one (NLB or ALB)**
    - .. -> Health checks - you can add VPC and/or ELB health checks on top
    - .. -> Metrics - you can enable Auto Scaling Group **metrics**, and add **warmup time** (before the metrics get collected after startup)
    - .. -> Group size - this is the **min, max, desired**
    - .. -> Scaling policies - you can only pick **Target Tracking** here
      - you can disable scaling in here
    - .. -> **Notifications** - there are predefined event types
    - .. -> and wait for creation..
  - in **Instance Management** tab you can see the **instances**, and add **lifecycle hooks**
  - in **Monitoring** you can see monitoring for the auto Scaling Group as well as EC2 instances
  - in **Instance Refresh** tab - you can start a **rolling update**
  - under Automatic Scaling tab - you can adjust the scaling policy from **Target Tracking to Step or Simple** (all 3 of them are called dynamic tracking policies)
    - you can also enable **Predictive scaling**
    - you can also add **scheduled actions**
  - if you are changing the network interface settings, remember ([source](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html#change-network-interface))
    - **security groups must be configured as part of the interface**, not in Security Groups section
    - **no secondary private IP addresses**
    - you can only specify an **existing network interface if it has device index of `0`**, and in that case you can launch only 1 instance, use CLI, you have to specify the AZ but not the subnet
    - you **cannot assign public IP address if you specify two network interfaces (both must be in the same subnet)**
    - the address allocated to **network interface** comes from CIDR range of the subnet in which the instance is being launched
- Auto Scaling is vital to create a highly available application, **allows multiple AZs**
- pre-bake AMIs to shorten the startup times
- use **Reserved Instances of Savings Plan** for the minimum instances to save costs
- **CloudWatch is for alerting Auto Scaling Groups to have more or less instances** (you don't actually have to create any alerts explicitly)
- what is **Stead State Group** - when you set **min=max=desired=1**, this is good to assure AWS will recover it each time it crashes, good e.g. for legacy solutions

## Auto Scaling Policies
- policy types
  - **None - you can pick none
  - **Stepped Scaling** - scaling by certain fixed amount of instances, and that amount depends on the utilization metric
  - **Simple Scaling** - add/remove certain % of instances, depending on utilization metric
  - **Target Tracking** - pick a scaling metric and the group will try to maintain it (e.g. CPU utilization should be 50%)
- **Avoid Trashing** - killing instances that were just created
  - you can add **Warm up period**, so that the instances are not being killed before they really start
  - you can set up **Cooldown that pauses auto scaling for some time, if there is a massive spike**, to avoid big costs
- types of scaling
  - **reactive** - measure the load and determine if a change is needed
  - **scheduled** - if you know the future workload
  - **predictive** - AWS uses ML to predict, every 24h updates a 48h forecast
  
## EC2 Launch templates
- better than old Launch configuration
  - configurations were immutable, only certain autoscaling features (also no networking settings possible), templates are versioned, leverage all autoscaling features => use templates
- creating launch templates: EC2 -> Launch Templates -> (you could **base it on a source template** to speed up), specify IAM, instance type, key pair, subnet (most things are optional), **IAM instance profile**, a lot of stuff.. including even **user data**!
- how to modify
  -  EC2 -> Launch Templates -> pick your template -> Actions -> Modify template (the **previous version will stay default**)
- how to use it
  - EC2 -> Launch Templates -> **Launch instance from template** (you can override settings still)

## EC2 IAM Roles
- reminder: IAM Role can be assigned temporarily, provides you **temporary security credentials**
  - also **cross-account** access is possible with IAM Roles
  - fr EC2, the **Principal** (JSON) as well as the **Trusted Entity** (Console) type will be EC2
  - you can attach 1 IAM Role to EC2 Instance
  - **always pick IAM roles over storing credentials on EC2**
- when you assign an IAM role to an EC2 instance, what happens, there is an **Instance Profile** created behind the scenes (if you use AWS Console, in CLI you do it manually)
  - inside the instance there will also be **temporary credentials created for the instance**, but they are rotated automatically
    
## EC2 Security Groups
- there are the following ports of computer communication
  - HTTP `80`
  - HTTPs `443`
  - Linux SSH `22`
  - Windows RDP `3389` (e.g. for remote desktop)
- security group is like a virtual firewall; **by default everything inbound is blocked, outbound is open**
- `0.0.0.0/0` - to open up everything, for all IPs, and chosen ports
- changes take effect immediately
- **many-to-many**: you can have multiple SG attached to your EC2 instances, and multiple EC2 instances attached to your SG
  - if you have several SGs for an instance, the rules are merged, and **the most permissive for each port wins**

## EC2 Metadata
- data about EC2 instance, e.g. public/private address, hostname, security groups, etc.
- the command used to be `http://169.254.169.254/latest/meta-data` (the IP is an address of the **Instance metadata and user data (IMDS) service**),
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

## EC2 Networking
- there are 3 types of **virtual networking cards** (networking abstraction?) that can be attached to your instances:

| Name | Description               | Usage                                                                                   |
|------|---------------------------|-----------------------------------------------------------------------------------------|
| ENI  | Elastic Network Interface | For **basic day-to-day networking**                                                         |
| EN   | Enhanced Networking       | Uses **Single Root I/O Virtualization (SR-IOV)** for **high performance**               |
| EFA  | Elastic Fabric Adapter    | Accelerates **High Performance Computing (HPC)** and **machine learning** applications  |

- **Elastic Network Interface (ENI)**
  - allows: 
    - private & public IPv4 addresses
    - many IPv6 addresses
    - MAC addresses
    - \>1 Security Groups
  - use cases:
    - **create management network, and separate production network, logging network, and so on**
    - **use network and security appliances in your VPC**
    - **create dual-homed instances with workloads/roles on distinct subnets**
    - low-budget, high-availability solution
- **Enhanced Networking (EN)**
  - higher **I/O performance** and lower CPU utilisation, `10 Gbps` - `100 Gbps`
  - higher **bandwidth, higher packet per second (PPS), lower inter-instance latencies**
  - can be enabled using:
    - **ENA - Elastic Network Adapter**, for `<100 Gbps`
    - **INTEL 82599 Virtual Function (VF) Interface**, for `<10 Gbps`, typically older instances
- **Elastic Fabric Adapter (EFA)**
  - like an extra accelerator
  - can use **OS-bypass**, **only supported by Linux**

## EC2 Placement Groups
- is a feature where you can control placement of instances within AWS network, to optimize for performance, regulatory, etc
- types:
  - **Cluster Placement Groups**
    - grouping of instances within a **single AZ, low latency & high throughput**
    - AWS **recommends homogenous instances** within Cluster Placement Group
  - **Spread Placement Groups**
    - each individual instance on separate hardware, for **small critical instances to be kept separate** from each other
    - can be across multiple AZs
  - **Partition Placement Groups**
    - each partition has a set of racks (partitions, segments), each rack has its own network and power source
    - it is used to to **isolate impact of hardware failure for multiple EC2 instances** (e.g. **HDFS, HBase, Cassandra**)
    - can be across multiple AZs
- can't merge placement groups
  - but you can move a stopped instance into a Cluster Placement Group (but only CLI or SDK for now)
- only certain instances are compatible

### EC2 Hibernation
- instance memory (RAM) is saved to EBS root volume, and any data volumes are persisted
  - max `150` GB RAM
  - max `60` days
  - supported instances:
    - families: General Purpose, Compute, Memory and Storage Optimized Groups, and more
    - types: On-Demand and Reserved
  - supported OS:
    - Windows, Amazon Linux 2 AMI, Ubuntu
- on restoring from hibernation
  - EC2 instance is restored, **with same ID**
  - RAM is reloaded, processes resumed
  - data volumes are reattached
- this boots way faster, useful **for long running processes or long initializing ones**

# Systems Manager (SSM)
- **manage and maintain EC2 instances**, including **on-premise**
- **System Manager Agent** - installed on the instance
- SSM capabilities:
  - **automation** - streamlines resource management
  - **Run Command** - remotely execute SSH scripts, without SSH
  - **Session Manager** - securely connect to the compute without SSH access
  - **Patch Manager** - automates OS and application patches
  - **Parameter Store** - for secrets and configurations
  - **maintenance windows** - can be scheduled by you, e.g. for patch updates
- **Session Manager**
  - **logs all connections and commands run on instance** to CloudWatch & CloudTrail
  - **SSM Agent** - **both Linux and Windows**, the plus is you don't have to open any ports
    - supports **EC2, edge devices (AWS and non-AWS IoT), on-premise servers, custom VMs**
    - **preinstalled** on many AMIs
    - need to ensure you have the right **IAM permissions**
- AWS Console:
  - notice we will connect without SSH, even without inbound Security Groups
  - but we **need IAM permissions**: EC2 instance profile has `AmazonSSMManagedINstanceCore` policy attached
  - then you click in EC2 on **Connect -> Session Manager**
  - Systems Manager -> Run Command - there you can see a lot of command types, select shell script
    - enter your script and working directory
    - how to reference a parameter: `{{ssm:/dev/squid_conf}}`
    - select targets: EC2 instances, by tags or by resurce group
    - timeout, rate control, you can enable S3 and/or CloudWatch logs
    - -> Run, you will get an **execution id**

## EC2 Practical - Step-by-steps

### Launching EC2 instance
- Launch an instance
  - give it a name
  - pick OS image (AMI = Amazon Machine Image) - Linux, MacOS, Ubuntu, Windows, ...
  - pick architecture `x86` or `Arm`
  - pick instance type - how much CPU and GB Memory
  - create key pair, to connect via ssh, download the key pair
  - create Security Group (like a virtual firewall)
    - allow SSH traffic (port `22`), HTTP (port `80`) and HTTPs (port `443`)
  - configure storage
  - launch instance, see the state is pending
  - **the AZ will be a random one**, within the region
- Connect - you can use EC2 Instance Connect from the console, or SSH client
- you can also terminate the instance

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
  
### Configuring Instance Profile in EC2 CLI
- to create a role from inside an EC2 instance via a SSH terminal:
  - `aws iam create-role --role-name DEV_ROLE --assume-role-policy-document file://trust_policy_ec2.json`
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
- next create policy: 
  - `aws iam create-policy --policy-name DevS3ReadAccess --policy-document file://dev_s3_read_access.json`
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
- next, attach policy to the role (from EC2 terminal):
  - `aws iam attach-role-policy --role-name DEV_ROLE --policy-arn "arn:aws:iam::613967324686:policy/DevS3ReadAccess"`
- verify the above: `aws iam list-attached-role-policies --role-name DEV_ROLE`
- create Instance Profile: `aws iam create-instance-profile --instance-profile-name DEV_PROFILE`
- add role to the Instance Profile: `aws iam add-role-to-instance-profile --instance-profile-name DEV_PROFILE --role-name DEV_ROLE`
- verify the above: `aws iam get-instance-profile --instance-profile-name DEV_PROFILE`
- associate EC2 Instance Profile with the instance id (copy from console): `aws ec2 associate-iam-instance-profile --instance-id i-0f9e1a909dff2df29 --iam-instance-profile Name="DEV_PROFILE"`
- verify the above: `aws ec2 describe-instances --instance-ids i-0f9e1a909dff2df29`, look for IamInstanceProfile
- check if the role is assumed: `aws sts get-caller-identity`

### Configuring Instance Profile in AWS console
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

### Installing Wordpress
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
- and the config:
```php
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
    define( 'DB_COLLATE', '' );
```
- Security Group -> add MySQL inbound rule, from that same SG



# VMWare on EC2
- VMWare has been used by people around the world for private (on-premise) cloud deployments
  - some companies want a **hybrid cloud strategy**, and combine it with AWS Services
  - some want to use AWS as an **inexpensive disaster recovery**
  - others want to **migrate to AWS**, and can use AWS VMWare built-in tools for that
  - others just want to **use some AWS Services** that are not available with VMWare
- deploying VMWare on AWS (more specifically deploying vCenter using VMWare)
  - it runs on **dedicated hardware** hosted in AWS, on a **single account**
    - each host has `2` sockets with `18` cores per socket, `512` GB RAM, `15.2 TB` Raw SSD storage
    - each host can run **hundreds of VMWare instances**
    - clusters can start with `2-16` hosts per cluster

# AWS Outposts
- is **AWS in your private datacenter** (the other way round than WMVare on AWS)
- server racks, rack can have `42`U, server units of `1`U and `2`U
- this is **another way to get hybrid cloud**
  - **AWS manages all the infrastructure**
  - consistency
- Outpost Family Members
  - **Outpost Rack**
    - starts with `1` 42U rack and scales up to `96` racks
    - to be used in a **datacenter**, i.e. when you need a lot of storage
  - **Outpost Servers**
    - individual U1 or U2 servers, when you have less space
    - **retail stores, branch offices, healthcare provider locations, factory floors**
- you **order them in AWS Console**
  - AWS staff will come to install and deploy the hardware
  - you can manage everything via AWS Console
