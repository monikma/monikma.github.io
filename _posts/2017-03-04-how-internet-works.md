---
layout: post
title: How Internet works
date: '2017-03-04'
author: Monik
tags:
- Internet
commentIssueId: 35
---
<div class="bg-info panel-body" markdown="1">
Summary of [How Does the Internet Work?](http://www.theshulers.com/whitepapers/internet_whitepaper/).
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

<img src="http://www.snipe.net/wp-content/uploads/2013/07/maxresdefault.jpg" height="170" width="300"/>

## IP Address

Internet Address (IP Address, Internet Protocol Address) is **unique** to each computer. It can be assigned as:

- temporary address assigned by ISP (Internet Service Provider)
- permament address from LAN (Local Area Network)
- temporary address from DHCP (Dynamic Host Configuration Protocol) server, also in LAN

## Protocol stack

The messages are send from computer to computer using TCP/IP protocol stack. There are following layers:

1. Hardware layer - network card, modem - converts data to signal
2. IP Layer - packets (data chunks) sent between computers using IP
3. TCP (Transmission Control Protocol) Layer - packets sent between applications; each packet is assigned a port number
4. Application Protocols Layer - application protocols, e.g. WWW, SMTP, FTP

The data is split into packets and packets are directed using ISP routers.

## Internet infrastructure

Internet backbone is made up of many IXs (Internet Exchange Points), which are NSP (Network Service Provider) and private MAE (Metropolitan Area Exchanges) networks, connected via NAPs (Network Access Points). There are 3 NAPs per NSP.

### Routing hierarchy

Routers are packet switches. Each router has a **routing table**, which contains addresses of it's sub-networks. When a packet arrives (with an IP assigned) it either finds a network that contains the target computer, or passes it further to the backbone's router.

### DNS

DNS (Domain Name Service) is a distributed database that keeps the computer name and its IP address. DNS servers are computers on the network that hold part of this database. It's a tree-like structure. When an Internet connection is setup 2 DNS addresses have to be extablished.

## Application Protocols

Are specified by RFC (Request For Comments) documents.

### HTTP

Is protocols that Web Browsers and Web Servers use (client - server). It is connectionless. 

_(I skip the part of how the Web page is requested, sent and rendeded in the browser.)_

`HTTP/2` was published in May 2015.

### SMTP

SMTP (Simple Mail Transfer Protocol) is used by mail client. It is connection oriented protocol - the client maintains the connection.  

## TCP/IP Protocol

The IP (Internet Protocol) sends packets from IP to IP. Is not reliable and connectionless. Packets do not have to arrive in order. TCP assures the order and adds its own headers.
