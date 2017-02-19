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
Revising the most important things about data structures and algorithms.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=2}

## Complexity analysis

### Maths

<!-- http://docs.mathjax.org/en/latest/start.html -->

First, some mathematics. This is called a summation, more specifically arithmetic progression:

<math xmlns="http://www.w3.org/1998/Math/MathML">
    <munderover>
      <mo>&sum;</mo>
      <mn>i=1</mn>
      <mn>n</mn>
    </munderover>
    <mo>=</mo>
    <mfrac><mi>n(n+1)</mi><mn>2</mn></mfrac>
</math>


because mathematical induction. Important to remember, as this means that the complexity of an algorithm that takes `i` steps with every iteration from `i=0..n` has complexity of `Θ(n^2)` (big theta). This is the case of **selection sort**. And the generified rule is:

<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mi>S(n, p)</mi>
    <mo>=</mo>
    <munderover>
      <mo>&sum;</mo>
      <mi>i</mi>
      <mi>n</mi>
    </munderover>
    <msup>
      <mi>i</mi>
      <mi>p</mi>
    </msup>
    <mo>=</mo>
    <mi>Θ(</mi> 
    <msup>
         <mi>n</mi>
         <mi>p+1</mi>
    </msup>
    <mi>)</mi>
</math>

for `p>=1`.

Geometric series have the index of the loop involved in the exponent:

<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mi>G(n, a)</mi>
    <mo>=</mo>
    <munderover>
      <mo>&sum;</mo>
      <mi>i=0</mi>
      <mi>n</mi>
    </munderover>
    <msup>
      <mi>a</mi>
      <mi>i</mi>
    </msup>
    <mo>=</mo>
    <mfrac>
        <mrow>
            <msup>
              <mi>a</mi>
              <mi>n+1</mi>
            </msup>
            <mo>-</mo>
            <mn>1</mn>
        </mrow>
        <mrow>
            <mi>a</mi>
            <mo>-</mo>
            <mn>1</mn>
        </mrow>
    </mfrac>
    <mo>=</mo>
    <mi>Θ(</mi> 
    <msup>
         <mi>a</mi>
         <mi>n+1</mi>
    </msup>
    <mi>)</mi>
</math>

for for `a>=1`.

What may be also relevant is this factorial formula:

<math xmlns="http://www.w3.org/1998/Math/MathML">
    <munderover>
      <mo>&sum;</mo>
      <mi>i=1</mi>
      <mi>n</mi>
    </munderover>
    <mi>i</mi>
    <mo>×</mo>
    <mi>i!</mi>
    <mo>=</mo>
    <mi>(n+1)!-1</mi>
</math>

### RAM

RAM stands here for _Random Access Machine_, and it is a computation model that we use to talk about algorithm time complexity:

- `+`, `-`, `*`, `=`, if, call - is one step
- memory access - is one step
- loops and subroutines - is as many steps as many of the above they contain in all iterations

### Complexity

We have two types of it:
- time complexity
- space complexity

Complexity is a (simplified) function of problem size (`n`) into time or space. We use the following notations:

| Name   | Symbol    | Meaning                              |
|--------|-----------|--------------------------------------|
| Big Oh | `O(g(n))` | Worst case (upper bound)             |
| Theta  | `Θ(g(n))` | Average case                         |
| Omega  | `Ω(g(n))` | Best case (lower bound)              |

Examples:
- 3n<sup>2</sup>-100n+6 = O(n<sup>2</sup>) = O(n<sup>3</sup>)
- 3n<sup>2</sup>-100n+6 = Ω(n<sup>2</sup>) = Ω(n)
- 3n<sup>2</sup>-100n+6 = Θ(n<sup>2</sup>), because both Ω and O apply

We are usually interested in the pessimistic worst case, which is the "Big Oh notation".

The complexities from worst to best:
1. `n!`, which is all permutations of set of n elements
1. `2`<sup>`n`</sup>, e.g. enumerating all subsets of a set
1. `n`<sup>`3`</sup>, e.g. some dynamic programming algorithms
1. `n`<sup>`2`</sup>, e.g. insertion sort, selection sort
1. `n*lg(n)` - called also superlinear, e.g. quick sort, merge sort
1. `lg(n)` - e.g. binary search
1. `1` - single operations


