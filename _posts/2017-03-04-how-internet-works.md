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

## How Does the Internet Work?

[source](http://www.theshulers.com/whitepapers/internet_whitepaper/)

<img src="http://www.snipe.net/wp-content/uploads/2013/07/maxresdefault.jpg" height="170" width="300"/>

### IP Address

Internet Address (IP Address, Internet Protocol Address) is **unique** to each computer. It can be assigned as:

- temporary address assigned by ISP (Internet Service Provider)
- permament address from LAN (Local Area Network)
- temporary address from DHCP (Dynamic Host Configuration Protocol) server, also in LAN

### Protocol stack

The messages are send from computer to computer using TCP/IP protocol stack. There are following layers:

1. Hardware layer - network card, modem - converts data to signal
2. IP Layer - packets (data chunks) sent between computers using IP
3. TCP (Transmission Control Protocol) Layer - packets sent between applications; each packet is assigned a port number
4. Application Protocols Layer - application protocols, e.g. WWW, SMTP, FTP

The data is split into packets and packets are directed using ISP routers.

### Internet infrastructure

Internet backbone is made up of many IXs (Internet Exchange Points), which are NSP (Network Service Provider) and private MAE (Metropolitan Area Exchanges) networks, connected via NAPs (Network Access Points). There are 3 NAPs per NSP.

#### Routing hierarchy

Routers are packet switches. Each router has a **routing table**, which contains addresses of it's sub-networks. When a packet arrives (with an IP assigned) it either finds a network that contains the target computer, or passes it further to the backbone's router.

#### DNS

DNS (Domain Name Service) is a distributed database that keeps the computer name and its IP address. DNS servers are computers on the network that hold part of this database. It's a tree-like structure. When an Internet connection is setup 2 DNS addresses have to be extablished.

### Application Protocols

Are specified by RFC (Request For Comments) documents.

#### HTTP

Is protocols that Web Browsers and Web Servers use (client - server). It is connectionless.

_(I skip the part of how the Web page is requested, sent and rendeded in the browser.)_

`HTTP/2` was published in May 2015.

#### SMTP

SMTP (Simple Mail Transfer Protocol) is used by mail client. It is connection oriented protocol - the client maintains the connection.

### TCP/IP Protocol

The IP (Internet Protocol) sends packets from IP to IP. Is not reliable and connectionless. Packets do not have to arrive in order. TCP assures the order and adds its own headers.

## Cookies and sessions

A piece of data that a website stores on the user's computer using Web Browser's mechanism.

It can be used to authenticate an already logged in user. The cookie's data should be of course encrypted. It's visible here how important role the browser has.

Cookies have expiration date.

Session cookie has no expiration date and is present on the disk only as the user is navigating a website. It is removed when the browser is closed.

Cookies can also be used for sticky sessions (a mechanism to have session even despite a load balancer in the front).

## Digital Certificate

It is an electronic document used to prove the ownership of a public key. Public key is bound to a respective entity by a process of registration by a certificate authority. A certificate contains:

- information about the key
- information about the identity of its owner
- digital signature of the certificate issuer

A client can verify that the signature is correct and decide if it trusts the issuer.

There also exists a client certificate, which is bound to a person by the email address or name, and is issued by the server's own certificate authority. It's an alternative method of client authentication, next to passwords and cookies.

## Caching HTTP Requests

ETag is protocol that allows the client to make conditional requests, and save the bandwith:

- Client asks
- Server responds `200` and `ETag: "686897696a7c876b7e"`
- Client asks with `If-None-Match: "686897696a7c876b7e"`
- Server responds `304 Not Modified`

`Cache-Control` header can be sent by the server with a value e.g. `no-cache` to express that the client should always ask for a new value (browsers have HTTP cache), or `max-age` that says after how much time it should ask again. There are more values possible.

Both mechanisms can be used simultaneously, and it is actually a good idea.

## Web Sockets

WebSocket is a computer communications protocol, providing both ways simultaneous communication channels over a single TCP connection. TCP is one level lower than the HTTP request in the TCP/IP protocol.

The TCP connection is established by initiating a HTTP hanshake request by the client, and server responding. The connection remains open on port `80`, or port `443` for TSL (=SSL, encrypted connection, part of HTTPS protocol).

HTTP is still better option when client is likely to make only single requests, or when caching is desirable, or when it is important to maintain resilience despite communication failure.

## Firewalls

Firewall is a system that filters network traffic according to some predefined rules. They can operate at different levels of the TCP/IP protocol.

## Multi-tier architecture

In Web Applications is implemented in layers. This increases flexibility and reusability, and probably some more things. Those layers can (but don't have to) be on different physical machines = tiers.

Two layer architecture consists of presentation layer and a data storage layer. Usually presentation on client side and data storage on server side.

Three layer architecture consists of presentation layer, a domain logic layer, and a data storage layer.

Three tier architecture is client–server software architecture pattern where all the above 3 layers are part of different and independent modules. The presentation layer is the client, most often a web browser.

## String encoding

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



