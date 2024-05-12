---
layout: post
title: AWS Certified Solutions Architect - Associate (SAA-C03) - AWS Networking
date: '2024-04-29'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 46
type: certification
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS Networking.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# VPC
- Virtual datacenter in the cloud
- every region has a default VPC that is set up automatically
  - all subnets are public
  - route table, main network ACL created by default
  - many subnets are also created, one per AZ
  - EC2 have private and public IP addresses
  - the CIDR block is `172.31.0.0/16`
- for a custom VPC you can configure: IP address range, subnets, route tables and network gateways, VPN
  - with VPN you can extend your data center into an AWS VPC, via a private gateway
- CIDR IP ranges - you need to define such range for your VPC
  - companies usually use `10.0.0.0`, `172.16.0.0`, or `192.168.0.0`, e.g.:
    - `10.0.0.0/16` - 65 536 addresses, biggest possible
    - `10.0.0.0/24` - 256 addresses
    - `10.0.0.0/28` - 16 addresses, smallest possible
  - website: CIDR.xyz, there you can see the ranges easily
- what is in the VPC:
  - Subnet - also needs CIDR range, <= VPC range?, limited to an AZ
    - EC2
    - Security Group
  - Network ACL (NACL) - here you can block specific IPs
  - Route Table, many subnets can be associated with the route table
- The VPC is accessed from the Internet via an Internet Gateway, and router routes to the appropriate Route Table
- Three tier architecture:
  - 1: Web Service, public facing subnet, via port 80 or 443
  - 2: Application, private subnet, can only speak to layer above and below
  - 3: Database, private subnet, can only speak to Application Tier
- IPAM - Amazon VPC IP Manager, helps you with specifying the CIDR range

## Provisioning custom VPC
- we want to have 1 VPC with one public and one private subnet. The private contains a DB server and public one a web server.
- VPC -> Create VPC -> VPC only
  - IPv4 Manual Input -> 10.0.0.0/16
  - Create VPC 
  - Created: Route table, NACL, Security Groups - these are three things
  - No subnets created
- VPC -> Subnets -> Create
  - Select VPC
  - Naming convention proposal: `10.0.1.0/24 - us-east-1a` - so CIDR range and AZ
  - first 4 and the last IP address will be reserved by AWS
  - create subnets for other AZs, at least 1 other
- Set up the Web Server
  - Make one subnet public
    - Actions -> Edit settings -> Enable auto-assign public IPv4 addresses
    - VPC -> Internet gateways -> Create internet gateway
    - Actions -> attach to VPC (btw you cannot have more than 1 IG per VPC)
    - VPC -> Route tables, pick the one related to this VPC -> Subnets associations
      - don't create the new Route here! you would open all subnets to the Internet; instead:
    - VPC -> Route tables -> Create, assign to the VPC (the old one stays "Main Root Table" for this VPC)
      - add Route out to the internet: `0.0.0.0/0`, point to Internet Gateway we created
      - pick the public subnet and associate it to this Route table
  - Test
    - Create EC2 instance in the public subnet
      - Auto assign IP address should be Enabled
      - Create new Security Group
        - add rule to allow HTTP from anywhere
      - User data to create `index.html`
      ```bash
       #!/bin/bash
       yum update -y
       yum install httpd -y
       systemctl start httpd
       systemctl enable httpd
       cd /var/www/html
       echo '<html><h1>Hello Cloud Gurus!</h1></html>' > index.html
       ```
        - Open the public IP in the browser (http not https)
- Set up the DB
  - create Security Group, assign to our VPC
    - add inbound rule, SSH, source the Web Server's Security Group
    - launch another EC2 in that VPC and private subnet, and the new SG
  - Test
    - Connect to the EC2 Web Server instance
    - create `mykey.pem` and copy the private key (from creating the DB EC2)
    - `chmod 400 mykey.pem`
    - `ssh ec2-user@<private IP of the DB EC2> -i mykey.pem`
    - see it works
    - notice you cannot do `yum update`, to be continued
                                                           
# NAT Gateway
- NAT = Network Address Translation
- to allow stuff from private subnet to connect to the Internet but not vice versa (unless Internet is answering)
- you create such NAT Gateway in your public subnet and allow resources from your private subnets to connect to it
- NATs are redundant inside AZ (many instances managed by AWS, NAT is only per AZ)
  - AWS also handles updates to that instances
- throughput 5-45 Gbps
- not associated with Security Groups
- automatically assigned a public IP address
- Lab: provision NAT gateway to be able to make updates in DN server in private subnet
  - VPC -> NAT Gateways -> Create
    - pick the public subnet
    - public connectivity type
    - Allocate Elastic IP Address
  - Add a route to the main Route Table - `0.0.0.0/0`, target - the NAT Gateway
  - Test: `yum update -y`
- region-specific - you can share same NAT gateway between AZs, but if that AZ goes down, everything will go down; better 1 NAT Gateway per AZ

# ACL Lists
- Security Group is in the subnet, while ACL List outside it, before the subnet but after the route table (ACL Lists are the first line of defense)
- ACL Lists are stateless, while Security Groups are stateful, meaning:
  - for Security Groups, even if we don't allow a rule in, if there was an allowed request from the Internet, the answer will be allowed to go out, even if there is a blocking rule
  - for ACL List you have to explicitly configure both ways
- in the ACL Lit created by default everything is allowed, but if you create a custom ACL, everything is disabled by default
- each subnet must be associated with exactly 1 network ACL, one ACL can be assigned to several subnets
- to block IP addresses use ACL List, not Security Group
- rules
  - separate inbound and outbound
  - rules have have rule number, and are evaluated in the order of these numbers (start with increments of 100)
  - rules with smaller number override the ones with bigger number (this is called evaluating them "in order")
  - at the end there is a wildcard as the rule number
- ephemeral ports
  - you can open 1024-65535 (use "custom TCP" type) on outbound traffic, to cover all kinda responses
  - it will cover both responses to 80 and 22 too
- how to block a specific IP address - `<ip address>/32`

# VPC Endpoint
- connect your AWS services to your VPC inside AWS, i.e. your instances don't need public IP addresses
- endpoints are virtual devices
- horizontally scaled
- redundant
- highly available
- no bandwidth constraints
- types of VPC endpoints:
  - interface endpoints - elastic network interface with a private IP address leading to the target service
  - gateway endpoints - virtual device you provision, for S3 or DynamoDB
- that VPC endpoint would be in your private subnet, from which you are trying to connect (you also need to sort out IAM permissions for what you want to connect to)
  - EC2 -> Security -> attach IAM Role -> S3_Admin_Access
- creating VPC endpoint
  - VPC -> Endpoints -> Create Endpoint -> S3 Gateway, pick your VPC, pick route table corresponding to the private subnet 
  - now you can log in to your EC2 and do `aws s3 ls`

# VPC Peering
- connect a couple of VPCs via a direct network route, using private IP addresses
  - instances behave as if they were on the same network
- can be cross regions, and can be even cross account
- that connection is not transitive! ("hub-and-spoke model")
- how to create
  - VPC -> Peering Connections, select the VPCs (acceptor is the one who will be accessing the requester - but isn't it symmetrical?)
  - the CIDR ranges must not overlap!
  - then you have certain amount of time to accept -> Actions -> Accept request
  - next, you need to adjust the main route tables on both sides - map the other's CIDR to Peering Connection
  - and lastly, modify requester security group - e.g. allow MySQL traffic from the other VPC CIDR

# AWS PrivateLink
- to expose your VPC to up to thousands of customers VPC
- better than VPC Peering or Internet Gateway because less configuration and more secure
- requires:
  - Load Balancer on your side
  - ENI (Elastic Network Interface) on customer VPC

# AWS VPN CloudHub
- virtual private gateway
- when you have multiple sites, each has VPN, and you want them to connect them together, via that hub
- traffic goes encrypted via public Internet
- not expensive

# Direct Connect
- Directly connecting your on premise to AWS, via a dedicated network connection
- usually better throughput and more consistent than Internet-based connection
- two types
  - dedicated connection - physical ethernet connection associated with a single customer
    - customers can request it via AWS Console, CLI or the API
  - hosted connections - physical ethernet connection provisioned by AWS Direct Connect partner on behalf of customer
    -  customers can request it by contacting an AWS Direct Connect partner
- there are DX (Direct Connect) Locations across the world
  - in such a location you have an "AWS Cage", with a DX (Direct Connect) router, and "Customer Cage", with their own router
  - the customer cage is connected to the customer WLAN/MAN/LAN via a customer provided link, and AWS cage to AWS using the AWS backbone network 
  - the connections there are:
    - AWS to AWS cage - DX connection
    - AWS cage to customer cage - X-Connect (physical internet cable)
    - customer cage to customer site -  Last Mile Pseudowire / LAN extension
- can connect like this to public and private VPCs on AWS side
- why better than VPN - does not go over the internet, can have massive throughput, secure, reliable, very stable
  - you can also have VPN over DX

# Transit Gateway
- connects many VPCs via a central hub, acts as a cloud router
- it is used to simplify network topology (less peerings, VPNs, DXs)
- allows to make VPC peering transitive
  - use route tables to limit how VPCs talk to each other
- works with VPNs, DX
- supports IP multicast (the only service that does), sends a single packet to thousands of hosts
- can be inter-region
- can be inter-account, using RAM (Resource Access Manager)

# AWS Wavelength
- 5G AWS endpoint, for ultra low latency, with compute and storage
- mobile edge computing

# Route53
- DNS service, registering domain names and pointing them at AWS webservice, DNS operates on port `53`
  - DNS converts domain names to IP addresses, which computers use to identify each other on the network
- IPv4 was the old pool of IPs, which are running out (32 bits, 4 billion addresses), this is why we have IPv6 (128 bits, 340 undecilion addresses) (migration is in progress), both are supported by Route53
- Domains
  - In this address: `google.com`, `.com` is the top-level domain (TLD), and `google` would be second-level domain
  - TLDs are controlled by IANA (Internet Assigned Numbers Authority), in a root zone database with all top-level domains
  - Domain registrars are authorities that can assign domain names directly under TLD, with InterNIC (from ICANN), which enforces uniqueness, and stores domains in WHOIS database; examples: GoDaddy, domain.com, AWS, Namecheap
- DNS Resolution
  - First TLD resolution, gives you NS record - name server record, used by top level domain servers to direct traffic to content DNS server, which contains the authoritative DNS records
  - Next, NS Record leads you SOA record, this is the start of the authority, start of your DNS records
    - contains: server name for the zone, administrator of the zone, current version of data file, TTL file on resource records
    - all other records, like
      - A record - the mapping between domain and the IP address, this has the TTL
      - CNAME - resolve one domain name to another, e.g. `m.acloudguru.com`, cannot be used for naked domain names, like `acloudguru.com`
      - AWS Alias Record - is similar to CNAME, maps records to AWS services, can be used for naked domain names, pick this one in the exam
- How to register a domain name
  - AWS is now also a domain registrar, so you only need AWS
  - Route53 -> Register Domain -> Select -> checkout -> Enter personal details -> you will receive status email for each domain
  - EC2 -> create instances in 2 regions, with a simple webpage
  - Route53 -> Hosted Zone (your domain will be the hosted zone name) -> Create record
    - Record name - subdomain in front of your main domain, can keep blank to create for root domain, pick A record
    - Enter the public IP addresses of your EC2s
    - Set TTL
    - Set routing policy
- You can also have private hosted zones with Route53

## Route53 routing policies
- Simple Routing Policy - you can only have 1 record, it returns all record values (IPs) in random order
- Weighted Routing Policy - multiple records, some % of traffic to one set and some % to another, create 1 record per EC2 instance, set weights, pick health check
  - Health Checks - you can set it on records, you can set up SNS alerts
    - Route53 -> Health Checks -> Endpoint -> put your IP, put `index.html` as hostname, no path; create 1 HC per EC2 instance
    - if HC fails, the Weighted Policy will send traffic to other records
- Failover Routing Policy - multiple records, if one fails HC then the other is a fallback; you need to pick Primary / Secondary
- Geolocation Routing Policy - multiple records, returns based on requested IP location; when you create records, you pick location - continents or countries
- Geoproximity Routing Policy - needs Traffic Flow, you can set a `bias` value to adjust the area of geographical zone
  - Route53 Traffic Flow - graphical UI, complex workflow for routing, you can combine other policies, it is using geographical location, latency and availability
- Latency Routing Policy - picks the record with lowest response time, you still have to tell AWS its region; remember latency changes
- Multivalue Answer Policy - multiple records, works like Simple Routing Policy but with Health Check




