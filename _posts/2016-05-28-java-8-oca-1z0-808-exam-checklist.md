---
layout: post
title: Java 8 OCA 1Z0 808 exam checklist
date: '2016-05-28T14:02:00.002+02:00'
author: Monik
tags:
modified_time: '2016-05-28T14:04:00.213+02:00'
blogger_id: tag:blogger.com,1999:blog-5940427300271272994.post-2399890181916792650
blogger_orig_url: http://learningmonik.blogspot.com/2016/05/java-8-oca-1z0-808-exam-checklist.html
commentIssueId: 31
---

### General

- the question structure on the exam
- how to start Java program from command line and what is required for which step (JDK or JRE)
- class / variable valid names
- when will you get compilation error on uninitialized variable and when not
- the trick with comparing Strings and string pool
- what happens when you change method visibility while overriding
- method and variable hiding
- labels
- errors, checked exceptions and runtime exceptions - who throws what and who catches what
- order of initialization on object creation
- lambda expressions - when can you omit braces, semicolons, variables, etc
- default methods - what happens on any inheritance collisions
- what happens on different kinds of import collisions
- what are the bit sizes of each primitive type
- how is a binary, octal or hexadecimal number represented
- what is stored on the heap and what is stored on the stack
- what is upcasting
- operator types and operator precedence, have practiced that!
- what is numeric promotion, overflow and underflow
- which types are not allowed as type of x in switch(x)
- the do-while loop and why to use it at all
- what are a segments of a loop and which one can contain multiple expressions
- where can you use the "continue" keyword
- methods on Strings
- methods on StringBuilder
- does str.replace(oldChar, newChar) replace all or just the first occurence?
- all variations on how to declare an array, also multidimensional arrays




- know that autoboxing does not work with predicates
- know that there is Java process managed by JVM, and this process executes static void main
- know that java.lang.* is automatically imported
- know that this is correct: double i = 1_000_000.0, but this not: double i = 1_000_000_.0 or double i = _1_000_000.0 (also not)
- know that System.gc() is just a suggestion
- know that Oracle claims that "Java prevents memory leaks", and that "Java is secure because it runs inside JVM", and that Java 8 is still an OO language
- know that ^ means XOR
- know that if(objectOfTypeA==objectOfTypeB) will not even compile
- know that String implements CharSequence
- know that new StringBuilder(10) is not "10" but it is setting the initial capacity to 10
- know that StringBuffer is just an old, thread-safe, slow version of StringBuilder
- know that System.out.println() calls the .toString() method ????
