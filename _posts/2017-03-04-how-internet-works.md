---
layout: post
title: How Internet works
date: '2017-03-04'
author: Monik
tags:
- Internet
commentIssueId: 37
---
<div class="bg-info panel-body" markdown="1">
Summary of different sources.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# How Does the Internet Work?

[source](http://www.theshulers.com/whitepapers/internet_whitepaper/)

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

# Cookies and sessions

TODO


# String encoding

**ASCII** defines `128` characters, which map to the numbers `0`–`127`. ASCII is a subset of **Unicode**. Unicode defines up to `2^21` characters (some numbers are unassigned, some are reserved).

The numbers `0`-`127` have the same meanings in ASCII and in Unicode.

ASCII fits in `7`-bits. To make use of the extra bit extended ASCII versions were created that use `8` bits and can hold `256` characters - called **code pages**, e.g. `ISO 8859`, `ISO 8859-1` (`ISO Latin-1`).

Code pages caused problems when a system tried to guess the encoding but guessed wrong. Unicode was supposed to solve this problem.

Unicode does not fit even in a byte. That is why it has to be encoded. After encoding it can use various numbers of bytes, e.g.:

- `UTF-8` uses variable number of bytes: from 1 to 4. If a character uses 1 byte it is same as represented in ASCII.
- `UTF-32` uses always 4 bytes.
- others

An analogical problem to code pages appeared. One solution could be the following, but since it is optional, it is not always used:

- **BOM**, the **Byte Order Mark** - special codepoint (`U+FEFF`, zero width space) at the beginning of a text stream that indicates how the rest of the stream is encoded.



