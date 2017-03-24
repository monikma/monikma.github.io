---
layout: post
title: Algorithms - revision
date: '2017-02-19'
author: Monik
tags:
- Programming
- Algorithms
commentIssueId: 34
---
<div class="bg-info panel-body" markdown="1">
Revising the most important things about algorithms.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

## Complexity analysis

### Random Access Machine

RAM stands here for _Random Access Machine_, and it is a computation model that we use to talk about algorithm time complexity:

- `+`, `-`, `*`, `=`, if, call - is one step
- memory access - is one step
- loops and subroutines - is as many steps as many of the above they contain in all iterations

### Algorithm properties

_Stability of sorting_: a stable sorting algorithm preserves the order of records with equal keys ([source](https://en.wikipedia.org/wiki/Stable_algorithm)).

_Numerical stability of algorithm_: a numerically stable algorithm avoids magnifying small errors ([source](https://en.wikipedia.org/wiki/Stable_algorithm)).

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
1. `n` - linear
1. `lg(n)` - e.g. binary search, everything where we divide into halves
1. `1` - single operations

## Sorting & Search

### Binary search

In a sorted list: take the middle element and compare to the searched one; either continue with the right or left half of the list (note do not copy the arrays, maintain start and end indices).

Each level of a binary tree has `2`<sup>`level`</sup> branches. The height of the tree with `n` leaves is `log`<sub>`2`</sub>`n`, as log<sub>2</sub>n = h <=> 2<sup>h</sup> = n.

Time complexity: O(`log(n)`)

### [Selection sort](https://en.wikipedia.org/wiki/Selection_sort)

Take first element and look for a "most smaller" one. Swap. Take second, and so on.

Time complexity: Θ(`n`<sup>`2`</sup>)

### [Insertion sort](https://en.wikipedia.org/wiki/Insertion_sort)

Take each element and pull it to the beginning of the array until it's in the right place (constant swapping).

Time complexity: O(`n`<sup>`2`</sup>)

### [Merge sort](https://en.wikipedia.org/wiki/Merge_sort)

Merge sort each half of the array, and then merge 2 parts together in order.

Time complexity: O(`n*logn`)

### [Quick sort](https://www.youtube.com/watch?v=aQiWF4E8flQ)

1. Pick the last element (pivot)
2. Put a marker just before the first element
3. Go from start to end, and whenever there is an element < pivot, put it just in front of the marker and move the marker one element towards the end
4. The element just after the marker is now exactly where the pivot should be in the final sorted array. Swap the pivot and the element after the marker
5. Sort the part before and after the pivot separately.

Time complexity: average is Θ(`n*logn`), worst is O(`n`<sup>`2`</sup>) (in case the pivot happens to be always the smallest/the largest number). We can avoid the worst complexity by pre-randominzing the data set first, or simply choosing the pivot at random each time.

## Strings

### String matching

Compare letter by letter and if a letter of a small text does not match skip to the next letter of the big text.

## NP Completness

The problems to be solved by algorithms have been divided to a number of problem classes:

1. **P** - problems that can be solved in polynomial time (or better)
1. **NP** - binary problems to which solution can be determined in polynomial time
1. **NP-hard** - problems to which any NP problem can be reduced in polynomial time (do not have to be NP problems themselves)
1. **NP-complete** - problems that are both NP and NP hard

<img src="https://i.stack.imgur.com/CFDuq.png" height="300" width="200" style=" margin-left:auto;margin-right:auto;display:block;"/>

Some conclusions:

1. `P != NP`

How to prove that a problem is an **NP-complete** problem do these 2 things:

1. prove that the problem is **NP** - give a polynomial time verification algorithm
2. find another **NP-complete** which reduces to your problem (so such that solution to that problem equals solution to your problem)

## NP Hard problems

### Knapsack problem

Solution is NP Hard.

Decision whether the solution is correct is NP Complete.

Here is the absolutely best [video](https://www.youtube.com/watch?v=EH6h7WA7sDw).

### Travelling salesman problem

Solution is NP Complete.

Exponential time.

Algorithm:

1. write the matrix of cost of travelling between cities (the diagonal will be "-")
1. **row minimisation** - for each row: substract the smallest element in the row from each element in the row
1. **column minimisation** - for each column: substract the smallest element in the column from each element in the column
1. **penalties** - for each zero, sum the minimum element in its row and minimum element in its column
1. cross out the column and row of the zero with the biggest penalty (if mutliple are equal then it does not matter wchich one)
1. the crossed out city pair is part of the solution (keep the direction same)
1. remove the crossed out row and column and go to step 2.
