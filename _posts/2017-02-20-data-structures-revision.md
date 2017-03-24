---
layout: post
title: Data structures
date: '2017-02-20'
author: Monik
tags:
- Programming
- Algorithms
commentIssueId: 36
---
<div class="bg-info panel-body" markdown="1">
The most important data structures.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

_Linked data structures_ means the ones that involve pointers: lists, trees, as opposed to arrays, heaps, matrices and hash tables.

- Array - fixed-size, contains data records that can be located using an _index_ (direct memory address).
- Stack - LIFO order. Push adds an item to the top, pop removes and returns the item on the top.
- Queue - FIFO order. Operations can be calles e.g. enqueue and dequeue.
- Linked List - each contains the data plus a pointer to the next (or next and previous) item. No random access to items is possible.

# Hash table

Each element has a function applied that maps it to _array index_. Looking up an index in an array is fast. Of course two elements can map to the same index, that's why:

- the mapping function has to be chosen carefully, so that it maps the values uniformly
- for the duplicates we can use a linked list - so each cell in hash table is actually a list
- another option for duplicates is to put the duplicate in nearest empty space - will be fast enough to find it

The example function for strings is treating the string as a number in a system of base n, where the n is the length of the alphabet:

 H("hello") = n^5*code('h') + n^4*code('e') + ... + n*code('o')

Then we have to apply modulo (arbitrary) m, as otherwise the number would be too big. [This article](https://computinglife.wordpress.com/2008/11/20/why-do-hash-functions-use-prime-numbers/) says why in Java it is `31`.

Hashing can be used for string matching - e.g. Rabin Karp algorithm that hashes each next segment using the information of the has of the previous one, and running in up to Θ(n + m), instead of the naive Θ(nm).

# Priority queue

It works on elements that have priorities assigned. Priority queue has the two operations available:

- **add** element
- **remove** and return element with highest priority

It is most often implemented using *heap*, but can also be implemented using simple array, or binary tree.

# Heap

A heap is a tree but arranged differently than the binary tree. It is normally stored in an array.

_heap property_ - if A is parent of B it is ordered with respect to B with the same ordering across the heap

In the representing array the children of a node at position `n` are at positions `2n` and `2n + 1`.

Most important operations:

- **adding** element: add at the end and move up until heap property is restored
- **removing** top element: remove the top, move the last one to the beginning and move it down until heap property is restored (pick the bigger child if you are removing the maximum)

_Heap sort_ (O(`n*lon(n)`)) is actually a form of selection sort but with a better data structure.

Searching in a heap is very ineffective.

# Binary Search Tree

For every element `x` the following holds: all elements of right subtree of `x` are `>x` and all elements of the left subtree are `<=x`. Watch out: not only immediate children matter, but all the descendants! immediate children can meet this criterion but the grandchildren not anymore.

Operations:

- **search** - is easy: just go left or right
- **traversal** (complexity `O(n)`, space complexity is `O(height)` - for the recursion stack, even though we call the recursive function twice, it cannot be more than `O(n)` as the max height is `n`):
  - _in-order_ - left subtree, me, right subtree
  - _pre-order_ - me, left subtree, right subtree
  - _post-order_ - left subtree, right subtree, me
- **insertion** - perform the search until you find NULL and put it there
- **deletion** - tricky only for a node that has 2 children; replace with the left-most child in it's right subtree or right-most in it's left sub-tree.

Note that insertions/deletions can create unbalanced trees which are no longer so optimal - that's why data randomness is often desired. An example of always balanced trees are the red-black trees.

In a complete tree (all nodes have 2 children or are leaves) the number of nodes is `2^n -1`.

# AVL Tree

Balanced binary tree is such that its right and left subtrees' heights differ by at most 1. AVL tree is an example of a balanced binary tree.

In AVL tree each node has assigned "balance" which is the height of the left subtree minus the height of the right subtree.

After each insert the tree is re-balanced: we rotate - left or right. If the child and grandchild in the unbalancing subtree are on the same side we need to rotate only once, if they are on opposite sides (left and right, or right and left) - we need to rotate twice, in opposite directions.

# Graph

Graph consists of set of vertices and edges. They can be:

- directed or undirected
- weighted or unweighted
- simple or non-simple (e.g. multiedges are not simple)
- sparse or dense (sparse has less edges), fun fact: the number of all possible edges (undirected simple graph) is `n!/2(n-2)` = "n over 2" (combinations)
- cyclic or acyclic, DAG = directed acyclic graph, used for scheduling problems ("x occurs before y")
- implicit or explicit - implicit graph is constructed as it is used
- labelled or unlabelled

## Storing the graph

Graph can be stored in 2 ways:

- **adjacency matrix** - a matrix of `0`s and `1`s - good for lookup and updates
- **adjacency list** - array of linked lists, each list holds vertices connected with the vertex connected with the vertext corresponding to the array index - good for traversal

In adjacency list the order of elements in the list does not matter.

## Breadth-first traversal

We check the node, then we check each of its children, then for each child we check the grandchildren, and so on. Implemented using a queue.

Linear complexity `O(n+m)` on both directed and undirected graph (`m` - number of edges, `n` - number of vertices), if we care about the edges. If we don't then it is `O(n)`.

Applications:

- finding shortest path between `x` and `y` (in an unweighted graph) - for that we need to do the traversal starting from `x`; once we get to `y` we backtrack to `x`,  provided for each node we remembered who the parent is
- finding connected components
- coloring of graph vertices by using the least possible amount of colours; bipartite graphs - only 2 colours.

## Depth-first traversal

We check the node, then we check the first child, then the grandchild, and so on, watching out not to collide with an already visited node. Implemented using stack or recursively.

Complexity is same as for BFT.

Stack implementation is a bit tricky compared to the DFT queue, as the pushing order differs from popping order:

- we process the node on pushing it to the stack
- we push only one non visited child at a time
- we pop a node from the stack only if it has no unvisited children

Applications:

- while using the recursive implementation, if we record the "time" (1 unit of time is one recursion) of entering and exiting each node, we can quickly see who is the ancestor of whom (by comparing the times). It is also easy to see how many descendants each node has.
- **topological sorting** - done on DAG (no back edges), it orders all vertices such that all directed edges go from left to right; if a graph is acyclic this is always possible

It divides edges into tree and back edges (the one that point back to the tree) - don't get it
