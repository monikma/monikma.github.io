---
layout: post
title: Algorithms - revision
date: '2017-02-19'
author: Monik
tags:
- Algorithms
commentIssueId: 34
---
<div class="bg-info panel-body" markdown="1">
[under construction]<br/>
Revising the most important things about data structures and algorithms.
</div>

# Table of Contents
  * [Complexity analysis](#complexity)

## Complexity analysis <a id="complexity"></a>
<!-- http://docs.mathjax.org/en/latest/start.html -->

First some mathematics:

<math xmlns="http://www.w3.org/1998/Math/MathML">
    <munderover>
      <mo>&sum;</mo>
      <mn>i=1</mn>
      <mn>n</mn>
    </munderover>
    <mo>=</mo>
    <mfrac><mi>n(n+1)</mi><mn>2</mn></mfrac>
</math>

because mathematical induction. Important to remember, as this means that the complexity of something that takes i steps with every iteration from i=0..n has complexity of (bit theta)(n^2). And the generified rule is:

<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mi>S(n, p)</mi>
    <mo>=</mo>
    <munderover>
      <mo>&sum;</mo>
      <mn>i</mn>
      <power>
          <mi>i</mi>
          <mi>p</mi>
      </power>
    </munderover>
    <mo>=</mo>
    <mi>Θ(</mi> 
    <power>
         <mi>n</mi>
         <mi>p</mi>
    </power>
    <mi>)</mi>
</math>
