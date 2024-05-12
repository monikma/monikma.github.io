---
layout: post
title: AWS Certified Solutions Architect - Associate (SAA-C03) - Decoupling
date: '2024-05-10'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 48
type: certification
draft: true
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about everything AWS that has to do with decoupling: SQS, SNS, Active MQ, API Gateway, and so on.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# Loose coupling
- having an ELB in front of your instances is already considered loose coupling
- apart from it you can have:
  - SQS
  - SNS
  - API Gateway
- in the exam, always choose loose coupling, and make sure it is loose all the way

## AWS SQS
- Poll-Based Messaging - the consumer polls for messages
- delivery delay - default 0, up to 15 mins
- message size 256 KB by default
- messages are encrypted at transit by default, but not at REST by default (you can enable it for HTTPS endpoints for free, also FIFO, it is called SSE-SQS, Server Side Encryption - actually this I see IS enabled by default, so it is a bit confusing..)
- message retention, default 4 days, min 1 minute, max 14 days
- polling
  - short (default) - separate connection for each check, also billed for each API call
  - long (better) - you specify connection time window, and the app waits a bit for messages
- queue depth could be a trigger of autoscaling (of the consumer)
- visibility timeout - message is locked for 30 seconds, when the message is in the queue, but no one can see it, as one instance already said it will process it, only when it is processed it will be deleted
- DLQs - for failed messages, SQS & SNS, for debugging, you can redrive messages, a DLQ for FIFO must also be FIFO
  - you can set Cloud Watch alarms
  - DLQ would highlight missing permissions for consumer
  - you can add some identifier to search in logs (did not get that)
  - original message is wrapped in another message in DLQ
  - how to create
    - you create as a normal queue
    - access policy - specify who can send and receive from the queue - only the owner, specific accounts/roles/users, or completely custom JSON
      - seems you also need to configure role on that resource with proper policies
    - redrive policy - which queues can use it as DQL - all, none or concrete queues
    - when you create a normal queue, then you set in dead-letter-queue section the DQL for undeliverable messages
      - max receives - how many times can I receive same message before I damn it undeliverable
- remember to set up an alarm on DLQ depth

### FIFO SQS
- normal SQS offers best effort order, so they may be out of order
- FIFO SQS is in order always
- FIFO assures no duplicate messages (deduplication ids during deduplication interval, you have to turn it on)
- but only 300 transactions/second (can use batching though, which can increase it to 3000/s), as compared to unlimited with normal SQS
- you can enable FIFO High Throughput (any time), which is 9000 messages/s (even without batching)
- batching is best practice
- the name is suffixed with `.fifo`
- you can set up deduplication scope (all messages or with same message group id) and FIFO throughput limit, but only if you did not enable FIFO High Throughput
- a DQL has to be FIFO too
- in the exam, if you see message ordering, it is probably FIFO
- FIFO is more expensive
- message group id can be used for ordering inside given groups

## SNS
- push-based messaging, sent to consumers (subscribes) immediately, one-to-many
- subscribers can be: Kinesis Data Firehose, SQS, Lambda, email, HTTP(s), SMS, etc.
- message size <=256 KB
- can use SQS DLQ for failed messages
- you can have FIFO topics, but only FIFO SQS can subscribe, they also offer deduplicatio
- messages encrypted in transit by default, and can be encrypted at rest with AWS KMS keys
- you can add resource policies to your SNS topic, e.g. needed for cross account access
- Large Message Payloads - SNS Extended Library allows sending messages up to 2GB, by storing the payload on S3, and publishing the reference to it only
- SNS Fanout - all subscribers are notified simultaneously
- message filtering - by defining JSON filter policy you can filter for each subscriber, based on content and message attributes
- creating SNS topic
  - you also specify access policy like for SQS
  - server side encryption is here not enabled by default indeed
  - data protection policy - out of scope (hm)
  - delivery policy - number of retries when sending to HTTP/S
  - delivery status logging - log delivery (you would need to give permissions for SNS to write to Cloud Watch)
  - you can enable active tracing - you can enable AWS X-Ray to trace the request and see how long SNS it taking 
  - when you add subscription in the console, the permissions will be added automatically
    - except email subscriber, then the email owner needs to confirm
  - redrive policy - the DQL
- custom retry policy is available only for HTTP(s) endpoints
- in the exam
  - real time alerting, push based message application -> SNS

# AWS Gateway
- Serverless way of replacing your web service
- API Gateway and WAF help protect you from a DDoS attack


