---
layout: post
title: Java 8 OCA 1Z0 808 exam checklist
date: '2016-05-28T14:02:00.002+02:00'
author: Monik
tags:
- Programming
- Java
modified_time: '2016-05-28T14:04:00.213+02:00'
blogger_id: tag:blogger.com,1999:blog-5940427300271272994.post-2399890181916792650
blogger_orig_url: http://learningmonik.blogspot.com/2016/05/java-8-oca-1z0-808-exam-checklist.html
commentIssueId: 31
---
<div class="bg-info panel-body" markdown="1">
Again, trying to make a summary of the summary ;) (see this [post](/2016/03/03/preparation-for-java-8-oca-1z0-808-exam.html) for more context). Tried to put the main topics together in a form of questions, along with the short answers (click on the "see" links to see them).

Very important: please comment if you find an error.
</div>

### Questions around Java

- the question structure on the exam
<a data-toggle="collapse" data-target="#q1_1">[see]</a>
<div id="q1_1" class="collapse collapsible bg-info" markdown="1">
- when they ask you about **compilation errors**, they ask you about **all of them**, not the first one
- when they ask for the "output" they can mean **any part of the output**
- if there is an answer like "_an exception is thrown_" it still **does not mean** that some other outputs are not true as well, that will happen before the exception
- when there are **no line numbers** in a code snippet assume that **missing imports do** cause compilation errors
</div>

- how to start Java program from command line and what is required for which step (JDK or JRE)
<a data-toggle="collapse" data-target="#q1_2">[see]</a>
<div id="q1_2" class="collapse collapsible bg-info" markdown="1">
- to start a Java program:
  - `$ javac com/bla/Zoo.java` - requires JDK
  - `$ java com.bla.Zoo**` - requires only JRE
- if `main` is missing the **process** will throw exception
- if `main` is wrong signature the **Java** will throw exception
</div>

- what is stored on the _heap_ and what is stored on the _stack_
<a data-toggle="collapse" data-target="#q1_3">[see]</a>
<div id="q1_3" class="collapse collapsible bg-info" markdown="1">
- **heap**: objects, sometimes references to objects, arrays
- **stack**: primitives, references to objects
</div>

### Operators and primitive types

- what are the bit sizes of each primitive type
<a data-toggle="collapse" data-target="#q2_1">[see]</a>
<div id="q2_1" class="collapse collapsible bg-info" markdown="1">
- `byte` (from `-128` to `127`), `short`, `int`, `long` are respectively: `8`, `16`, `32`, `64`-bit;
- `float` and `double` are `32` and `64`-bit floating-point(=decimal), respectively;
- `char` is `16`-bit Unicode
</div>

- how is a binary, octal or hexadecimal number represented
<a data-toggle="collapse" data-target="#q2_2">[see]</a>
<div id="q2_2" class="collapse collapsible bg-info" markdown="1">
- `octal`: starts with `0`, e.g. `017`
- `hexadecimal`: starts with `0x` or `0X`, e.g. `0xFF`
- `binary`: starts with `0b` or `0B`, e.g. `0b10`
</div>

- what is **upcasting**
<a data-toggle="collapse" data-target="#q2_3">[see]</a>
<div id="q2_3" class="collapse collapsible bg-info" markdown="1">
- upcasting happens e.g. here `double d = 98;` - where a number of lower precision is automatically casted to the one of higher precision
</div>

- operator types and operator precedence, have practiced that!
<a data-toggle="collapse" data-target="#q2_4">[see]</a>
<div id="q2_4" class="collapse collapsible bg-info" markdown="1">
1. the most popular `i++`, `i--`
2. ..and the reverse `++i`, `--i`
3. "_be or not to be_" unary `+`, `-`, `!`
4. this follows maths `*`, `/`, `%`
5. ..still maths `+`, `-`
6. `<<`, `>>`, `>>>` (shift operators)
7. and now we see that.. `<`, `>`, `<=`, `>=`, `instanceof` (relational operators)
8. ..equality is later than non equality `==`, `!=`
9. logic comes quite late `&`, `^`, `|` (logical operators)
10. ..even later short circuited `&&`, `||` (short circuit logical operators)
11. ternary `a ? b: c`
12. assignment is last `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `^=`, `!=`, `<<=`, `>>=`, `>>>=` (assignment operators)
</div>

- what is _numeric promotion_, _overflow_ and _underflow_
<a data-toggle="collapse" data-target="#q2_5">[see]</a>
<div id="q2_5" class="collapse collapsible bg-info" markdown="1">

</div>

- which types are not allowed as type of `x` in `switch(x)`
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

### Date and Time

- what are the new classes for that
<a data-toggle="collapse" data-target="#q3_1">[see]</a>
<div id="q3_1" class="collapse collapsible bg-info" markdown="1">

</div>

- how to create a date/time from `String`
<a data-toggle="collapse" data-target="#q3_1">[see]</a>
<div id="q3_1" class="collapse collapsible bg-info" markdown="1">

</div>

- how to create custom date/time
<a data-toggle="collapse" data-target="#q3_1">[see]</a>
<div id="q3_1" class="collapse collapsible bg-info" markdown="1">

</div>

- how to manipulate date/time
<a data-toggle="collapse" data-target="#q3_1">[see]</a>
<div id="q3_1" class="collapse collapsible bg-info" markdown="1">

</div>

- what is `Period` and `Duration`
<a data-toggle="collapse" data-target="#q3_1">[see]</a>
<div id="q3_1" class="collapse collapsible bg-info" markdown="1">

</div>

- how to format date/time; what are the predefined formats
<a data-toggle="collapse" data-target="#q3_1">[see]</a>
<div id="q3_1" class="collapse collapsible bg-info" markdown="1">

</div>


### Java classes

- class / variable valid names
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- when will you get compilation error on uninitialized variable and when not
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what happens when you change method visibility while overriding
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- method and variable hiding; when is hiding not allowed
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- labels
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- order of initialization on object creation
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what happens on different kinds of import collisions
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what is the practical difference between `default` and `protected` access
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what happens with static methods / static variables when an instance of the owner's class is created
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- can you change the value of a `static` `final` instance variable and if yes then how
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- how to do a static import: is it `import static` or `static import`
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- according to what and in which order is the right overloaded method determined
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what means _covariant return type_
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what is the difference between `interface` and `abstract interface`
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- is it allowed to override a method while the signature doesn't match?
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what modifiers are assumed in an interface
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what is `virtual` method
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>


### Java 8 stuff

- lambda expressions - when can you omit braces, semicolons, variables, etc
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- can a lambda expression access the containing class' instance variables
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what is a default method
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- `default` methods - what happens on any inheritance collisions
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- can `default` method be redeclared `abstract` method
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what is a _functional interface_
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- example of using `Predicate`
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>


### String and StringBuilder

- the trick with comparing Strings and string pool
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- methods on `String`
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- methods on `StringBuilder`
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- does `str.replace(oldChar, newChar)` replace all or just the first occurence?
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>


### Arrays

- all variations on how to declare an array, also multidimensional arrays
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- all variations on how to declare multiple array variables in one line
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- how is the array represented in the memory
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- which exception is thrown when the type of object in the array doesn't match the declared type? when can it happen?
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what does `Arrays.binarySearch(array,what)` return in case it did not find the element
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>


### Collections

- available methods on `ArrayList`
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- how to sort an `ArrayList`
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>


### Loops

- the `do-while` loop and why to use it at all
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- what are a segments of a loop and which one can contain multiple expressions
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- where can you use the `continue` keyword
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>


### Exceptions

- errors, checked exceptions and runtime exceptions - who throws what and who catches what
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- in implementing/overriding method, can we rather declare more or less exceptions than the superclass has
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>

- give examples of `RuntimeException` (6), checked exception (2) and `Error` (3)
<a data-toggle="collapse" data-target="#q2_6">[see]</a>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

</div>


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
