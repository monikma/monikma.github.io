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
draft: true
customColor: true
fgColor: "#ff4d4d"
bgColor: "#ffcccc"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS Compute.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# EC2
- Elastic Compute Cloud
- virtual machine in AWS, needs web server installed on it next
- instances completely controlled by you
- revolutionising: pay per use, no wasted capacity, no long term planning for how many machines you need
- quick server provisioning (minutes not days)
- when it starts:
  - OS boots up
  - User data script is run
  - Applications start
- launch templates - better than old launch configuration
  - configurations were immutable, only certain autoscaling features (also no networking settings possible), templates are versioned, leverage all autoscaling features => use templates
  - creating launch templates: EC2 -> Launch Templates -> (you could base it on a source template to speed up), specify IAM, instance type, key pair, subnet (most things are optional), IAM instance profile, a lot of stuff.. including even user data!
  - how to modify
    -  EC2 -> Launch Templates -> pick your template -> Actions -> Modify template (the previous version will stay default)
  - how to use it
    - EC2 -> Launch Templates -> Launch instance from template (you can override settings still)
  - 

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

## EC2 Pricing Options

| Name                   | Description                                                         | Use case                                                    |
|------------------------|---------------------------------------------------------------------|-------------------------------------------------------------|
| On-Demand              | Pay per hour/second                                                 | Just starting a project, checking out, short time, flexible |
| Reserved               | Reserved capacity for 1-3 years, <72% cheaper                       | When you understand your usage patterns, and you have money |
| Reserved - convertible | Can switch to a different RI of equal or better value, <54% cheaper |                                                             |
| Reserved - scheduled   | Switch to a different RIon schedule                                 |                                                             |
| Spot                   | Purchase unused capacity, <90% cheaper but fluctuates               | 
| Dedicated Hosts        | Physical EC2 Server just for you, most expensive                    |

### Reserved instances
- work just on a regional level
- can be also used with lambda or Fargate

### Spot instances
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

### Dedicated Hosts
- Compliance/licensing, e.g. not allowing mutitenant virtualisation, cloud deployments
- Can be reserved or on-demand (this one is really expensive)
- Use when you need to use your licenses that don't allow anything else..

## Launching
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

## AWS CLI
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

## Security groups
- Ports of computer communication
  - HTTP 80
  - HTTPs 443
  - Linux SSH 22
  - Windows RDP 3389 (e.g. for remote desktop)
- security group is like a virtual firewall; **by default everything inbound is blocked**, outbound is open
- `0.0.0.0/0` - to open up everything, for all IPs, and chosen ports
- changes take effect immediately
- you can have multiple SG attached to your EC2 instances, and multiple EC2 instances attached to your SG
  - if you have several SGs for an instance, the rules are merged, and the most permissive for each port win

## EC2 Metadata
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

## EC2 Networking
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

## EC2 Placement Groups
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

## VMWare on EC2
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

## AWS Outposts
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

## Bootstraping EC2 servers
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

## EC2 Instance Profile
- when you assign an IAM role to an EC2 instance, what happens, there is an Instance Profile created behind the scened
  - inside the instance there will also be temporary credentials created for the instance, but they are rotated automatically
- to create a role from ec2 terminal: `aws iam create-role --role-name DEV_ROLE --assume-role-policy-document file://trust_policy_ec2.json` create role from command line of EC2 instance

### Configuring Instance Profile in ec2 cli
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

## EC2 AMIs
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



