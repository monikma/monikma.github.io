---
layout: post
title: Algorithms
date: '2017-02-19'
author: Monik
tags:
- Programming
- Algorithms
commentIssueId: 34
---
<div class="bg-info panel-body" markdown="1">
Complexity analysis and the most important algorithms.
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
_Input_ :The algorithm must have input(atleast one) from the specified set.

_Output_ : The algorithm must have atleast one output from the specified set of inputs.

_Finiteness_ : The algorithm must terminate after finite number of steps.

_Definiteness_ : All steps of algorithm must be precisely defined.

_Effectiveness_: It must be possible to perform each step of algorithm correctly and 
in finite amount of time.


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
5. Sort the part before and after the pivot/marker separately.

Time complexity: average is Θ(`n*logn`), worst is O(`n`<sup>`2`</sup>) (in case the pivot happens to be always the smallest/the largest number). We can avoid the worst complexity by pre-randominzing the data set first, or simply choosing the pivot at random each time.

### Bucket sort

We put elements into `k` baskets of some ranges, and sort data in each basket (in another way), and then but the data back into the array.

Distributing the elements into the baskets is `O(n)` time. There are some catches though when it comes to the complexity of assembling the array back:

- if we can afford one basket per value we store only element counts in each basket instead of list of elements. If the data is uniformly distributed, then indeed the average complexity will be equal to `Θ(n+k)`. Why? Because first we iterate through every of `k` buckets and for every bucket we check on average `n/k` elements. That is `Θ(k*(n/k+c)) = Θ(n+k)`, where `c` is the cost of looking into that basket (the original explanation is [here](http://stackoverflow.com/questions/7311415/how-is-the-complexity-of-bucket-sort-is-onk-if-we-implement-buckets-using-lin)).

- if we cannot afford one basket per value, then each basket we have to sort additionally, which is usually done by insertion sort that has complexity `O(n^2)`, hence the worst case time complexity is `O(n^2)`.

### Radix sort

Similar to bucket sort, but we do it like that:

- have 10 buckets (queue style)
- put numbers to baskets using least significant digit
- put numbers back to the array
- put numbers to baskets using second least significant digit
- put numbers back to the array
- ...

By repeating it until we process all digits we actually end up with a sorted array.

Instead we can start from most significant digit (use recursion), and that is how strings can be efficiently sorted.

The time complexity is `O(w*n)`, where `w` is the max length of numbers/words.

## Graph algorithms

### Minimum spanning tree

This is done in a weighted graph. In an unweighted graph each tree is a tree with minimum number of edges already (`n-1` edges).

#### Prim's algorithm

It goes like BFT and on each depth it chooses the minimum cost edge. Even though it is greedy it actually does always find the minimum spanning tree. The complexity is O(`n^2`) but if we use e.g. heap instead of linked list we can reduce it to O(`m*logn`) where `m` is the number of all vertices.

#### Kruskal algorithm

Start from cheapest to most expensive edges and before adding each of them check if we are still having a tree here (we shall not be adding to the same connected component). Time complexity: sorting edges is O(`m*logm`), building the tree O(`m*n`) and with a better data structure for testing connected component it is O(`m*logm`), which is better for sparse graphs.

### Shortest path in weighted graph

We look for a cheapest path between 2 vertices. In an unweighted graph we just do BFT starting from one of the edges.

#### Djikstra's algorithm

Similar to Prim's algorithm, but for each vertex we record tentative cost of travelling to it from the starting vertex. At the beginning the starting vertex has a cost of 0 and all other vertices have cost of infinity. When we find a lower cost for a vertex, we update it.

We also move in a BFT fashion, but always pick the vertex with the cheapest tentative cost first. We finish when we have traversed all the graph.

Usually uses heap to keep track of the minimum distance for each vertex.

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
