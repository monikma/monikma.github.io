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

### Around Java

- the question structure on the exam
- how to start Java program from command line and what is required for which step (JDK or JRE)
- what is stored on the _heap_ and what is stored on the _stack_

### Operators and primitive types

- what are the bit sizes of each primitive type
- how is a binary, octal or hexadecimal number represented
- what is upcasting
- operator types and operator precedence, have practiced that!
- what is numeric promotion, overflow and underflow
- which types are not allowed as type of `x` in `switch(x)`

### Date and Time

- what are the new classes for that
- how to create a date/time from `String`
- how to create custom date/time
- how to manipulate date/time
- what is `Period` and `Duration`
- how to format date/time; what are the predefined formats

### Java classes

- class / variable valid names
- when will you get compilation error on uninitialized variable and when not
- what happens when you change method visibility while overriding
- method and variable hiding; when is hiding not allowed
- labels
- order of initialization on object creation
- what happens on different kinds of import collisions
- what is the practical difference between `default` and `protected` access
- what happens with static methods / static variables when an instance of the owner's class is created
- can you change the value of a `static` `final` instance variable and if yes then how
- how to do a static import: is it `import static` or `static import`
- according to what and in which order is the right overloaded method determined
- what means _covariant return type_
- what is the difference between `interface` and `abstract interface`
- is it allowed to override a method while the signature doesn't match?
- what modifiers are assumed in an interface
- what is `virtual` method

### Java 8 stuff

- lambda expressions - when can you omit braces, semicolons, variables, etc
- can a lambda expression access the containing class' instance variables
- what is a default method
- `default` methods - what happens on any inheritance collisions
- can `default` method be redeclared `abstract` method
- what is a _functional interface_
- example of using `Predicate`

### String and StringBuilder

- the trick with comparing Strings and string pool
- methods on `String`
- methods on `StringBuilder`
- does `str.replace(oldChar, newChar)` replace all or just the first occurence?

### Arrays

- all variations on how to declare an array, also multidimensional arrays
- all variations on how to declare multiple array variables in one line
- how is the array represented in the memory
- which exception is thrown when the type of object in the array doesn't match the declared type? when can it happen?
- what does `Arrays.binarySearch(array,what)` return in case it did not find the element

### Collections

- available methods on `ArrayList`
- how to sort an `ArrayList`

### Loops

- the `do-while` loop and why to use it at all
- what are a segments of a loop and which one can contain multiple expressions
- where can you use the `continue` keyword

### Exceptions

- errors, checked exceptions and runtime exceptions - who throws what and who catches what
- in implementing/overriding method, can we rather declare more or less exceptions than the superclass has
- give examples of `RuntimeException` (6), checked exception (2) and `Error` (3)

### .. and also, know that

- know that _autoboxing_ does not work with `Predicate`s
- know that there is Java process managed by JVM, and this process executes the `static void main`
- know that `java.lang.*` is automatically imported
- know that this is correct: `double i = 1_000_000.0`, but this not: `double i = 1_000_000_.0` or double `i = _1_000_000.0` (also not)
- know that `System.gc()` is just a suggestion
- know that Oracle claims that _"Java prevents memory leaks"_, and that _"Java is secure because it runs inside JVM"_, and that Java 8 is still an OO language
- know that `^` means XOR
- know that `if(objectOfTypeA==objectOfTypeB)` will not even compile
- know that `String implements CharSequence`
- know that `new StringBuilder(10)` is not `"10"` but it is setting the initial capacity to `10`
- know that `StringBuffer` is just an old, thread-safe, slow version of `StringBuilder`
- know that `System.out.println()` calls the .toString() method ????
- know that `list.toArray()` returns an unmodifiable list ???
- know that default constructors are automatically added to the `*.class` file by the compiler, and as soon as you write a default constructor yourself, it is no longer called a default constructor
- know that `package private` access is synonym for `default access`
- know that _lenient_ means _permissive_, _merciful_ or _tolerant_
- remember that exception thrown from inside `finally` block masks the exception thrown in the `catch` block
- know that it is _allowed_ to catch `Error`s; it should not be done but it is allowed
