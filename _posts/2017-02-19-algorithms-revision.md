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
{:toc max_level=1}

## Complexity analysis

### Maths

<!-- http://docs.mathjax.org/en/latest/start.html -->

First, some mathematics. 

#### Summations

This is called a summation, more specifically arithmetic progression:

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

#### Logarithms

This is what logarithm is:

b<sup>x</sup> = y <=> log <sub>b</sub> y = x

| Important formulas                |
|-----------------------------------|
|e<sup>ln x</sub> = x               |
|b<sup>log<sub> b</sub> y</sup> = y |
|log<sub>a</sub>(x*y) = log<sub>a</sub>(x) + log<sub>a</sub>(y) |
|a<sup>b</sup> = e<sup>ln(a^b)</sup> = e<sup>b*ln(a)</sup> |

The last one can be used for computing a<sup>n</sup> fast. We just make a recursive function that will compute the squares or "squares + 1" of the previous result, and that is just O(`lg(n)`).

<math xmlns="http://www.w3.org/1998/Math/MathML">
    <msub>
        <mi>log</mi>
        <mi>a</mi> 
    </msub>
    <mi>b</mi>
    <mo>=</mo>
    <frac>
        <mrow>
            <msub>
                <mi>log</mi>
                <mi>c</mi> 
            </msub>
            <mi>b</mi>
        </mrow>
        <mrow>
            <msub>
                <mi>log</mi>
                <mi>c</mi> 
            </msub>
            <mi>a</mi>
        </mrow>
    </frac>
</math>

Harmonic summation is another important formula:

<math xmlns="http://www.w3.org/1998/Math/MathML">
    <munderover>
      <mo>&sum;</mo>
      <mi>i=1</mi>
      <mi>n</mi>
    </munderover>
    <frac>
      <mn>1</mn>
      <mi>i</mi>
    </frac>
    <mo>≈</mo>
    <mi>ln(n)</mi>
</math>

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
1. `lg(n)` - e.g. binary search, everything where we divide into halves
1. `1` - single operations

## Data Structures

_Linked data structures_ means the ones that involve pointers: lists, trees, as opposed to arrays, heaps, matrices and hash tables.

- Array - fixed-size, contains data records that can be located using an _index_ (direct memory address).
- Stack - LIFO order. Push adds an item to the top, pop removes and returns the item on the top.
- Queue - FIFO order. Operations can be calles e.g. enqueue and dequeue.
- Linked List - each contains the data plus a pointer to the next (or next and previous) item. No random access to items is possible.

### Binary Tree

For every element `x` the following holds: all elements of right subtree of `x` are `>x` and all elements of the left subtree are `<x`. 

Operations:

- **search** - is easy: just go left or right
- **traversal**:
  - _in-order_ - left subtree, me, right subtree
  - _pre-order_ - me, left subtree, right subtree
  - _post-order_ - left subtree, right subtree, me
- **insertion** - perform the search until you find NULL and put it there
- **deletion** - tricky only for a node that has 2 children; replace with the one which is the most on th left out of all its left subtrees

Note that insertions/deletions can create unbalanced trees which are no longer so optimal - that's why data randomness is often desired. An example of always balanced trees are the red-black trees.

### Priority queue

It works on elements that have priorities assigned. Priority queue has the two operations available:

- **add** element
- **remove** and return element with highest priority

It is most often implemented using *heap*, but can also be implemented using simple array, or binary tree.

### Heaps

A heap is a tree but arranged differently than the binary tree. It is normally stored in an array.

_heap property_ - if A is parent of B it is ordered with respect to B with the same ordering across the heap

In the representing array the children of a node at position `n` are at positions `2n` and `2n + 1`.

Most important operations:

- **adding** element: add at the end and move up until heap property is restored
- **removing** top element: remove the top, move the last one to the beginning and move it down until heap property is restored (always pick the bigger child)

_Heap sort_ (O(`n*lon(n)`)) is actually a form of selection sort but with a better data structure.

Searching in a heap is very ineffective.

### Hash tables

Each element has a function applied that maps it to _array index_. Looking up an index in an array is fast. Of course two elements can map to the same index, that's why:

- the mapping function has to be chosen carefully, so that it maps the values uniformly
- for the duplicates we can use a linked list - so each cell in hash table is actually a list
- another option for duplicates is to put the duplicate in nearest empty space - will be fast enough to find it

The example function for strings is: sum of powers of lengths of the alphabet times the code of the character (in other words the strings are "digits" in a number system of base=size of the alphabet), modulo (arbitrary) m.

Hashing can be used for string matching - e.g. Rabin Karp algorithm that hashes each next segment using the information of the has of the previous one, and running in up to Θ(n + m), instead of the naive Θ(nm).

## Sorting & Search

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

Time complexity: average is O(`n*logn`), worst is O(`n`<sup>`2`</sup>) (in case the pivot happens to be always the smallest/the largest number).

### Binary search

In a sorted list: take the middle element and compare to the searched one; either continue with the right or left half of the list (note do not copy the arrays, maintain start and end indices).

Each level of a binary tree has `2`<sup>`level`</sup> branches. The height of the tree with `n` leaves is `log`<sub>`2`</sub>`n`, as log<sub>2</sub>n = h <=> 2<sup>h</sup> = n.

Time complexity: O(`log(n)`)

## Strings

### String matching

Compare letter by letter and if a letter of a small text does not match skip to the next letter of the big text.

