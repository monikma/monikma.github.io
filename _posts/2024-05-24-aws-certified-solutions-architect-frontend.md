---
layout: post
title: AWS SAA-C03 - Frontend
date: '2024-05-24'
author: monikma
tags:
- Architecture
- AWS
- Cloud
commentIssueId: 52
type: certification
draft: true
customColor: true
fgColor: "#cc9900"
bgColor: "#ffffb3"
---

<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Guru [AWS Certified Solutions Architect - Associate (SAA-C03)](https://learn.acloud.guru/course/certified-solutions-architect-associate/overview).
Note that the course content changes as the AWS changes. The notes are from March-May 2024.

This section is about AWS services relevant for Frontend development.
</div>

<h1>Table of contents</h1>
<div markdown="1">
  <a href="#aws-amplify" class="mindmap" style="--mindmap-color: #cc9900; --mindmap-color-lighter: #ffffb3;">
    `AWS Amplify`
  </a>
  <a href="#aws-device-farm" class="mindmap" style="--mindmap-color: #cc9900; --mindmap-color-lighter: #ffffb3;">
    `AWS Device Farm`
  </a>
  <a href="#amazon-elastic-transcoder" class="mindmap" style="--mindmap-color: #cc9900; --mindmap-color-lighter: #ffffb3;">
    `Amazon Elastic Transcoder`
  </a>
  <a href="#aws-appsync" class="mindmap"  style="--mindmap-color: #cc9900; --mindmap-color-lighter: #ffffb3;">
    `AWS AppSync` `GraphQL interface` `React, React native, iOS, Android integration`
  </a>
</div>

# AWS Amplify
- tools for frontend and mobile devs to **quickly build full stack apps on AWS**
- **Amplify Hosting**
  - support for **single page application (SPA) frameworks: React, Angular, Vue.js**, also **Gatsby and Hugo** static site generators
  - separate staging and prod env
  - **server-side rendering support, e.g. Next.js** (can't do this just with S3 static website)
- **Amplify Studio**
  - quickly **implement auths in your app**
  - **visual development**
  - **ready to use components**

# AWS Device Farm
- **testing service, for Android, iOS and web**, AWS runs it on actual phones
- testing methods:
  - **automated** - parallel tests based on scripts
  - **remote access** - on the browser you can actually use the phone, for manual testing

# Amazon Elastic Transcoder
- **to change media files format/encoding, to be optimized for target devices**
- scalable on-demand

# AWS AppSync
- **robust and scalable GraphQL interface**
- combining many data sources, e.g. DynamoDB, Lambda, ..
- GraphQL is a data language
- seamless integration with **React, React native, iOS, Android, ..**
- audience is **especially Frontend developers**
- uses **declarative coding**