---
layout: post
title: Argument against microservice availability
date: '2016-06-13T16:52:00'
author: Monik
tags:
- Microservices
commentIssueId: 33
---
<div class="bg-info panel-body" markdown="1">
People often say _"How am I supposed to assure 99% availability of my microservice if I use 10 other services as backing services, each of which has at maximum 99% availability?! Simple math - it is not realistic."_
</div>

<br/>

Well and here I would say: as a CEO of my company, how can I make my company be trustworthy to my customers, if I have x employees, and about many of them I don't even know if they are trustworthy at all?

I think here the answer is pretty clear and common sense, and I think the same should apply to microservices. It is all just about a shift in thinking. Don't rely 100% on others, don't create bottlenecks, have backup plans, keep the positive image even when the things are not going quite well at the moment. Same thing. With the fancy name _resiliency_.
