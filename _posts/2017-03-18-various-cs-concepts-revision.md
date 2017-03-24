---
layout: post
title: Algorithms - revision
date: '2017-03-18'
author: Monik
tags:
- Programming
commentIssueId: 38
---
<div class="bg-info panel-body" markdown="1">
Revising various Computer Science concepts.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

# Powers of `2`

- `2^3` = `8`
- `2^4` = `16`
- `2^7` = `128`
- `2^8` = `256`
- `2^10` = `1 024`
- `2^20` = `1 048 576`

# Java primitive types

- **byte**: `8`-bit signed two's complement integer, minimum `-128`, maximum `127`
- **short**: `16`-bit signed two's complement integer, minimum`-32,768`, maximum `32,767`
- **int**: `32`-bit signed two's complement integer, minimum `-2^31`, maximum `2^31-1`; from Java 8 can be used to represent an unsigned `32`-bit integer, minimum `0`, maximum value of `2^32-1` (extra method on Integer class)
- **long**: `64`-bit two's complement integer, minimum `-2^63`, maximum `2^63-1`; from Java 8 like with int
- **float**: single-precision `32`-bit IEEE 754 floating point
- **double**: double-precision `64`-bit IEEE 754 floating point
- **boolean**: `1` bit
- **char**: single `16`-bit Unicode character, minimum `'\u0000'` (or `0`), maximum `'\uffff'` (or `65 535`)

# Binary

`0100` equals `4` - the `2^0` is on the **right**.

Floating point number is represented in `32` bits. The most significant bit is the sign bit, then come `8` bits of the exponent, and `23` bits of the fraction, so e.g.: `001100100.01011010110010101110001`.

## Adding in binary

```
    1 1
    0 1 1 0 = 6
  + 0 1 1 1 = 7
    -------
    1 1 0 1 = 13
```

## Substracting in binary

```
                      1           / 1          / / 1
                      1           1 1          1 1 1
    1 0 0 0 = 8     / 0 0 0     / 0 0 0      / 0 0 0
  - 0 0 1 1 = 3   - 0 0 1 1   - 0 0 1 1    - 0 0 1 1
    -------         -------     -------      -------
          ?                                  0 1 0 1 = 5
```

## Left shift (<<)

We move elerything to the left and fill the empty space with `0`. It is equlivalent to *`2`:

`40` << `1` = `80`

## Right shift (>>)

We move everything to the right and fill the empty space with `0`. It is equlivalent to /`2`:

`40` >> `1` = `20`
`40` >> `5` = `1` - we drop the remainder, this is integer division

## Right logical shift (>>>)

Is like right shift but does not preserve the sign. So, 32th bit (`2^31`, the one on the left) is the sign bit. `0` means `+`, `1` means `-`. In normal shift it would be overwritten after the shift, in this shift it stays, so:

`-1` >>> `1` = `2147483647`
`-1` >> `1` = `-1`

## Important properties

- `00001000` - `1` = `00000111`
- x ^ `0000` = x
- x ^ `1111` = ~x
- x ^ x = `0000`
- x & `0000` = `0000`
- x & `1111` = x
- x & x = x
- x | `0000` = x
- x | `1111` = `1111`
- x | x = x

## Important operations

- get bit at i: `return ((num & (1 << i)) != 0)`
- set bit to 1 at i: `return num | (1 << i)`
- clear bit at i: `return num & ~(1 << i)`
- clear all bits from left to i (inclusive): `return num & ((1 << i) - 1)`
- clear all bits from i-1 to right: `return num & ~((1 << i) - 1)`
- update bit at i with bit v: `return num & ~(1 << i) | (v << i)`

# String encoding

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
