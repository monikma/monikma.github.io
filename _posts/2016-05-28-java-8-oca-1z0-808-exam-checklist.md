---
layout: post
title: Java 8 Se OCA 1Z0 808 Exam checklist
date: '2016-05-28T14:02:00.002+02:00'
author: Monik
tags:
- Programming
- Java
modified_time: '2016-05-28T14:04:00.213+02:00'
blogger_id: tag:blogger.com,1999:blog-5940427300271272994.post-2399890181916792650
blogger_orig_url: http://learningmonik.blogspot.com/2016/05/java-8-oca-1z0-808-exam-checklist.html
commentIssueId: 31
type: certification
---
<div class="bg-info panel-body" markdown="1">
Again, trying to make a summary of the summary ;) (see this [post](/2016/03/03/preparation-for-java-8-oca-1z0-808-exam.html) for more context). Tried to put the main topics together in a form of questions, along with the short answers (click on the "see" links to see them).

Very important: please comment if you see an error.

Update: I passed :) It was a really really annoying exam to prepare. And yes it was a good idea to do some online mock exams, even as late as on the day before the exam.

</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=2}

### Checklist on **every** question

- are there typos
- do the braces match, and are the semicolons in the right places
- are imports missing (if line numbers start from 1)
- are the method signatures really correct (e.g. constructor should not have return type)
- are the letters `l` or `f` missing at the end of number `long` or `double` literals
- are we not trying to call non-`static` method from a `static` method
- are there any uninitialized local variables or class constants
- is there a method called on an immutable object and not assigned to anything afterwards (look especially at Strings and Dates)
- are the `throws` in checked exceptions propagated correctly
- don't try to compute tricky variable reassignments in memory, that's a trap - take the paper

### Questions around Java

- the question structure on the exam
<button data-toggle="collapse" data-target="#q1_1" class="btn-link">[see]</button>
<div id="q1_1" class="collapse collapsible bg-info" markdown="1">

- when they ask you about **compilation errors**, they ask you about **all of them**, not the first one
- when they ask for the "output" they can mean **any part of the output**
- if there is an answer like "_an exception is thrown_" it still **does not mean** that some other outputs are not true as well, that will happen before the exception
- when there are **no line numbers** in a code snippet assume that **missing imports do** cause compilation errors
</div>

- how to start Java program from command line and what is required for which step (JDK or JRE)
<button data-toggle="collapse" data-target="#q1_2" class="btn-link">[see]</button>
<div id="q1_2" class="collapse collapsible bg-info" markdown="1">

- to start a Java program:
  - `$ javac com/bla/Zoo.java` - requires JDK
  - `$ java com.bla.Zoo` - requires only JRE
- if `main` is missing, the **process** will throw an exception
- if `main` is of wrong signature, **Java** will throw an exception
</div>

- what is stored on the _heap_ and what is stored on the _stack_
<button data-toggle="collapse" data-target="#q1_3" class="btn-link">[see]</button>
<div id="q1_3" class="collapse collapsible bg-info" markdown="1">

- **heap**: objects, sometimes references to objects, arrays
- **stack**: primitives, references to objects
</div>

### Operators and primitive types

- what are the bit sizes of each primitive type
<button data-toggle="collapse" data-target="#q2_1" class="btn-link">[see]</button>
<div id="q2_1" class="collapse collapsible bg-info" markdown="1">

- `byte` (from `-128` to `127`), `short`, `int`, `long` are respectively: `8`, `16`, `32`, `64`-bit;
- `float` and `double` are `32` and `64`-bit floating-point(=decimal), respectively;
- `char` is `16`-bit Unicode
</div>

- how is a binary, octal or hexadecimal number represented
<button data-toggle="collapse" data-target="#q2_2" class="btn-link">[see]</button>
<div id="q2_2" class="collapse collapsible bg-info" markdown="1">

- `octal`: starts with `0`, e.g. `017`
- `hexadecimal`: starts with `0x` or `0X`, e.g. `0xFF`
- `binary`: starts with `0b` or `0B`, e.g. `0b10`
</div>

- what is _upcasting_
<button data-toggle="collapse" data-target="#q2_3" class="btn-link">[see]</button>
<div id="q2_3" class="collapse collapsible bg-info" markdown="1">

- upcasting happens e.g. here `double d = 98;` - where a number of lower precision is automatically casted to the one of higher precision
</div>

- operator types and operator precedence, have practiced that!
<button data-toggle="collapse" data-target="#q2_4" class="btn-link">[see]</button>
<div id="q2_4" class="collapse collapsible bg-info" markdown="1">

1. the most popular `i++`, `i--`
2. ..and the reverse `++i`, `--i`
3. "_be or not to be_" unary `+`, `-`, `!`
4. this follows maths `*`, `/`, `%`
5. ..still maths `+`, `-`
6. `<<`, `>>`, `>>>` (shift operators)
7. and now we see that.. `<`, `>`, `<=`, `>=`, <a href="#" data-toggle="tooltip" title="Out of scope for OCA exam :)">`instanceof`</a> (relational operators)
8. ..equality is later than non equality `==`, `!=`
9. logic comes quite late `&`, `^`, `|` (logical operators)
10. ..even later short circuited `&&`, `||` (short circuit logical operators)
11. ternary `a ? b: c`
12. assignment is last `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `^=`, `!=`, `<<=`, `>>=`, `>>>=` (assignment operators)
</div>

- what is _numeric promotion_ and its rules
<button data-toggle="collapse" data-target="#q2_5" class="btn-link">[see]</button>
<div id="q2_5" class="collapse collapsible bg-info" markdown="1">

- it occurs for example here `5==5.0` - even though the numbers are of different type, `5` is first converted to `5.0` and then the comparison is made
- promotion occurs before an operand is applied or before method invocation
- there are 4 rules for numeric promotion:
  - smaller datatypes are promoted to larger ones
  - integral types are promoted to floating point types
  - `short`, `byte` and `char` are **always** promoted to `int` when applying a binary operator
  - the resulting value is of common type of the two operands
</div>

- is it possible to cast from larger numeric type to smaller one?
<button data-toggle="collapse" data-target="#q2_6" class="btn-link">[see]</button>
<div id="q2_6" class="collapse collapsible bg-info" markdown="1">

- yes, it will just result in precision loss/overflow
</div>

- which types are allowed as type of `x` in `switch(x)`
<button data-toggle="collapse" data-target="#q2_7" class="btn-link">[see]</button>
<div id="q2_7" class="collapse collapsible bg-info" markdown="1">

- `int` and `Integer`
- `byte` and `Byte`
- `short` and `Short`
- `char` and `Character`
- `enum`
- `String`
- no ~~long~~, no ~~boolean~~
- all must be `final`
</div>

- is this `9.5` of type `double` or `float`?
<button data-toggle="collapse" data-target="#q2_8" class="btn-link">[see]</button>
<div id="q2_8" class="collapse collapsible bg-info" markdown="1">

- `double`, float would be that: `9.5f`
</div>

- why would you use compound assignment (`a += b`) over a regular one (`a = a + b`)?
<button data-toggle="collapse" data-target="#q2_9" class="btn-link">[see]</button>
<div id="q2_9" class="collapse collapsible bg-info" markdown="1">

- you would use it to save yourself casting back to the smaller data type, in case `a` is of smaller data type than `b`; the casting is done automatically (which also means be careful here)
</div>

### Java methods

- what is the practical difference between `default` and `protected` access
<button data-toggle="collapse" data-target="#q10_1" class="btn-link">[see]</button>
<div id="q10_1" class="collapse collapsible bg-info" markdown="1">

- `default` = `package private` - visible only to classes from the same package
  - subpackage is understood here as another package
- `protected` - visible to classes from the same package and to subclasses
  - _subclass_ means an actual object of subclass type; you cannot access another object's protected field that is in another package, no matter how its type related to yours is
</div>

- can you change the value of a `static final` class variable and if yes then how
<button data-toggle="collapse" data-target="#q10_2" class="btn-link">[see]</button>
<div id="q10_2" class="collapse collapsible bg-info" markdown="1">

- you cannot change it, but if you didn't initialize it right where you defined it, you can still set it in the `static{}` class initializer
</div>

- how to do a static import: is it `import static` or `static import`
<button data-toggle="collapse" data-target="#q10_3" class="btn-link">[see]</button>
<div id="q10_3" class="collapse collapsible bg-info" markdown="1">

- `import static`; `import` must be first
- remember that static imports are only for class memebers, not clases
- remember that statically importing a class member does not import the owning class
</div>

- according to what and in which order is the right overloaded method determined
<button data-toggle="collapse" data-target="#q10_4" class="btn-link">[see]</button>
<div id="q10_4" class="collapse collapsible bg-info" markdown="1">
1. exact match
2. larger primitive type
3. autoboxing
4. varargs
- while trying to find an overload, **Java does max one conversion**, later is compilation error!
</div>

- what means _covariant return type_
<button data-toggle="collapse" data-target="#q10_5" class="btn-link">[see]</button>
<div id="q10_5" class="collapse collapsible bg-info" markdown="1">

- in inheriting class the return type must be same or more narrow than in superclass' method
</div>

- method and variable hiding; when is hiding not allowed
<button data-toggle="collapse" data-target="#q10_6" class="btn-link">[see]</button>
<div id="q10_6" class="collapse collapsible bg-info" markdown="1">

- hiding refers to one of the two cases:
  - when a `static` method is overridden, this is actually called **hiding**, not overriding ;)
  - all fields are always hidden when extending - both instances exist in memory independently, within the child class object; to refer to the parent field you need to write `ParentClassName.fieldName`
- you cannot hide `final` members
</div>

- labels
<button data-toggle="collapse" data-target="#q10_7" class="btn-link">[see]</button>
<div id="q10_7" class="collapse collapsible bg-info" markdown="1">

- `LaBel:` is an optional pointer to the head of a statement
- used like this: `break LABEL;` (break from the statement labelled like this) or `continue LABEL;`
</div>

- what is the difference between `interface` and `abstract interface`
<button data-toggle="collapse" data-target="#q10_8" class="btn-link">[see]</button>
<div id="q10_8" class="collapse collapsible bg-info" markdown="1">

- none, all interfaces are assumed to be `abstract`, and each that is not marked so, will be changed to `abstract interface` by the compiler
</div>

- what modifiers are assumed in an interface
<button data-toggle="collapse" data-target="#q10_10" class="btn-link">[see]</button>
<div id="q10_10" class="collapse collapsible bg-info" markdown="1">

- variables are assumed to be `public static final` (so must be initialized, even if no final is explicitly written!)
- methods are assumed to be `public abstract/default/static`
</div>

- what is `virtual` method
<button data-toggle="collapse" data-target="#q10_11" class="btn-link">[see]</button>
<div id="q10_11" class="collapse collapsible bg-info" markdown="1">

- it's a method whose implementation is not determined until runtime
- all non-final, non-static and non-private methods in Java are virtual
</div>

### Loops

- the `do-while` loop and why to use it at all
<button data-toggle="collapse" data-target="#q11_1" class="btn-link">[see]</button>
<div id="q11_1" class="collapse collapsible bg-info" markdown="1">

- `do{...}while(booleanExpression);` - you can use it when you want that the body is executed **at least once**
- note that `do System.out.println();while(booleanExpression);` is also correct syntax
</div>

- what are a segments of the `for` loop and which one can contain multiple expressions
<button data-toggle="collapse" data-target="#qq11_2" class="btn-link">[see]</button>
<div id="qq11_2" class="collapse collapsible bg-info" markdown="1">

- `for(initialization; booleanExpression; updateStatement){}`
- everything except the booleanExpression in the middle can have multiple expressions, seprarated by a comma `,`
</div>

- where can you use the `continue` and `break` keywords
<button data-toggle="collapse" data-target="#qq11_3" class="btn-link">[see]</button>
<div id="qq11_3" class="collapse collapsible bg-info" markdown="1">

- `continue` only inside loops
- `break` only inside loops and `switch` statement
</div>

### Java classes and variables

- class / variable / method valid names
<button data-toggle="collapse" data-target="#q4_1" class="btn-link">[see]</button>
<div id="q4_1" class="collapse collapsible bg-info" markdown="1">

- must start with a letter (Unicode) or `_` or `$`
- cannot start with a number
- can contain letters, numbers, `_` and `$`
- cannot be same as reserved keyword (if it's different letter case then it's fine though)
</div>

- when will you get compilation error on uninitialized variable and when not
<button data-toggle="collapse" data-target="#q4_2" class="btn-link">[see]</button>
<div id="q4_2" class="collapse collapsible bg-info" markdown="1">

- **required** to initialize local variable (also primitive), or `final` instance and class variable
- **not required** to initialize non-`final` instance and class variable, if they are primitive type they are given the default value for that type
</div>

- what happens when you change method visibility while overriding
<button data-toggle="collapse" data-target="#q4_3" class="btn-link">[see]</button>
<div id="q4_3" class="collapse collapsible bg-info" markdown="1">

- more visibility is allowed
- less visibility is not allowed (compilation error)
</div>

- how many variables are initialised here `int i1,i2,i3=0;`
<button data-toggle="collapse" data-target="#q4_5" class="btn-link">[see]</button>
<div id="q4_5" class="collapse collapsible bg-info" markdown="1">

- one
</div>

- what happens on different kinds of import collisions
<button data-toggle="collapse" data-target="#q4_6" class="btn-link">[see]</button>
<div id="q4_6" class="collapse collapsible bg-info" markdown="1">

- either compiler error saying _The type xxx is ambiguous_, or _The import xxx collides with another import statement_, depending on whether you imported those explicitly or implicitly (with wildcard `*`)
- if you import one implicitly and another explicitly, there's no conflict
</div>

- order of initialization on object creation
<button data-toggle="collapse" data-target="#q4_4" class="btn-link">[see]</button>
<div id="q4_4" class="collapse collapsible bg-info" markdown="1">
1. initialise the superclass
2. class fields and class initializers (so everything `static`) in the order they appear
3. instance fields and instance initializers in the order they appear
4. constructor
</div>

- can an `abstract` class extend a non `abstract` class
<button data-toggle="collapse" data-target="#q4_5" class="btn-link">[see]</button>
<div id="q4_5" class="collapse collapsible bg-info" markdown="1">

- shit, actually yes!
</div>


### Java 8 stuff

- lambda expressions - when can you omit braces, semicolons, variables, etc
<button data-toggle="collapse" data-target="#q12_1" class="btn-link">[see]</button>
<div id="q12_1" class="collapse collapsible bg-info" markdown="1">

- if `{}` are used, `return` and `;` must be used too, they always come together
- if type of input argument is specified, it must be wrapped in `()`
- if there are more than 2 input args, they have to be wrapped in `()` (if one arg has type, then all of them have to have it)
</div>

- can a lambda expression access the containing class' instance variables
<button data-toggle="collapse" data-target="#q12_2" class="btn-link">[see]</button>
<div id="q12_2" class="collapse collapsible bg-info" markdown="1">

- can access everything as long as it doesn't attempt to change them
</div>

- example of using `Predicate`
<button data-toggle="collapse" data-target="#q12_3" class="btn-link">[see]</button>
<div id="q12_3" class="collapse collapsible bg-info" markdown="1">

- `java.util.function.Predicate`
- `bunnyArrayList.removeIf(s->s.charAt(0)!='h');` - removes all bunnies starting with 'h', cool isn't it :D
</div>

- what is a `default` method
<button data-toggle="collapse" data-target="#q12_4" class="btn-link">[see]</button>
<div id="q12_4" class="collapse collapsible bg-info" markdown="1">

- defined in an interface
- has body
- is not `abstract` but still `public`
- it's like default implementation in abstract class - can be overridden but doesn't have to
- cannot be invoked on the interface
</div>

- `default` methods - what happens on any inheritance collisions
<button data-toggle="collapse" data-target="#q12_5" class="btn-link">[see]</button>
<div id="q12_5" class="collapse collapsible bg-info" markdown="1">

- as long as there is no ambiguity which method should be called when (e.g. one of them is overridden in the hierarchy) everything is ok, otherwise compilation error
</div>

- can `default` method be redeclared to be an `abstract` method
<button data-toggle="collapse" data-target="#q12_6" class="btn-link">[see]</button>
<div id="q12_6" class="collapse collapsible bg-info" markdown="1">

- yes, in an extending/implementing interface/class
</div>


- what is a `static` interface method
<button data-toggle="collapse" data-target="#q12_8" class="btn-link">[see]</button>
<div id="q12_8" class="collapse collapsible bg-info" markdown="1">

- is `static` and inside interface
- assumed to be `public`
- must be invoked on the interface, is not inherited
</div>


- what is a _functional interface_
<button data-toggle="collapse" data-target="#q12_7" class="btn-link">[see]</button>
<div id="q12_7" class="collapse collapsible bg-info" markdown="1">

- an interface which has exactly 1 method
- (annotated with `@FunctionalInterface`, but this is out of scope)
</div>

### Java APIs

#### String and StringBuilder

- the trick with comparing Strings and string pool
<button data-toggle="collapse" data-target="#q6_1" class="btn-link">[see]</button>
<div id="q6_1" class="collapse collapsible bg-info" markdown="1">
- `String` literals are stored in _string pool_, so using `==` to compare them will result in `true` if they look the same
- `new String()` is already forcing not using string pool
- the result of `"abc"+"d"` is already a new String, not the one from String pool
- the boolean value of `"s"=="s".trim()` is `true`
</div>

- methods on `String`
<button data-toggle="collapse" data-target="#q6_2" class="btn-link">[see]</button>
<div id="q6_2" class="collapse collapsible bg-info" markdown="1">
- the easy ones:
  - `length()`, `toLowerCase()`, `toUpperCase()`, `trim()`
  - `equals(String)`, `equalsIgnoreCase(String)`
  - `startsWith(String)`, `endsWith(String)`, `contains(String)`
- a bit trickier:
  - `substring(start[, end])`
  - `indexOf(char[, fromIndex])`, `indexOf(String[, fromIndex])`
  - `charAt(int)`
  - `replace(char old, char neww)`, `replace(CharSequence old, CharSequence neww)`
</div>

- methods on `StringBuilder`
<button data-toggle="collapse" data-target="#q6_3" class="btn-link">[see]</button>
<div id="q6_3" class="collapse collapsible bg-info" markdown="1">
- same as in `String`:
  - `length()`, `String substring()`, `indexOf()`, `charAt()`
- new ones:
  - `append(String)`
  - `insert(offset, String)`
  - `delete(start, end)`, `deleteCharAt(int)`
  - `reverse()`
  - `toString()` :)
</div>

- does `str.replace(oldChar, newChar)` replace all or just the first occurence?
<button data-toggle="collapse" data-target="#q6_4" class="btn-link">[see]</button>
<div id="q6_4" class="collapse collapsible bg-info" markdown="1">
- it replaces all the occurences
</div>

#### Arrays

- all variations on how to declare an array, also multidimensional arrays
<button data-toggle="collapse" data-target="#q7_1" class="btn-link">[see]</button>
<div id="q7_1" class="collapse collapsible bg-info" markdown="1">

- ways to instantiate:
  - `int  i[] = new int{1,2};`
  - `int  i[] = {1,2};`- anonymous array
  - `int  i[] = new int[2];`
  - `int i[][]= { {2,3},{1,2,3}};`
  - `int i[][]= new int[2][3];`
  - `int i[][]= new int[2][];`
  - ~~`int i[][]= new int[][];`~~ - this won't compile
- possible placement of the braces:
  - `int[]  i = {1,2};`
  - `int [] i = {1,2};`
  - `int  []i = {1,2};`
  - `int  i[] = {1,2};`
  - `int i [] = {1,2};`
  - and analogically for 2D+
</div>

- how can you get an exception related to object type while operating on arrays? which exception is it?
<button data-toggle="collapse" data-target="#q7_2" class="btn-link">[see]</button>
<div id="q7_2" class="collapse collapsible bg-info" markdown="1">

- when you try to **read** from an array, and the declared type does not match the actual type, you get an `ArrayStoreException`
</div>

- all variations on how to declare multiple array variables in one line
<button data-toggle="collapse" data-target="#q7_3" class="btn-link">[see]</button>
<div id="q7_3" class="collapse collapsible bg-info" markdown="1">

- `int[] a, b;` - two 1D arrays
- `int[] a[], b[][];` - two arrays, one 2D and one 3D
</div>

- how is the array represented in the memory
<button data-toggle="collapse" data-target="#q7_4" class="btn-link">[see]</button>
<div id="q7_4" class="collapse collapsible bg-info" markdown="1">

- a variable of type array holds the the reference to the array object
- the array object holds either a series of primitive values (in case of primitive type array), or series of object references (in case of non primitive type array)
- memory allocation happens on array initialization
</div>

- how to sort an array
<button data-toggle="collapse" data-target="#q7_5" class="btn-link">[see]</button>
<div id="q7_5" class="collapse collapsible bg-info" markdown="1">
- `java.util.Arrays.sort(array)`
</div>

- what does `Arrays.binarySearch(array, what)` return in case it did not find the element
<button data-toggle="collapse" data-target="#q7_6" class="btn-link">[see]</button>
<div id="q7_6" class="collapse collapsible bg-info" markdown="1">

- value that is one smaller than the negative of index where such element would be, if it was there
</div>

#### Collections

- available constructors and methods on `ArrayList`
<button data-toggle="collapse" data-target="#q8_1" class="btn-link">[see]</button>
<div id="q8_1" class="collapse collapsible bg-info" markdown="1">

- constructors:
  - `new ArrayList()`
  - `new ArrayList(capacity)`
  - `new ArrayList(anotherList)`
- methods:
  - `isEmpty()`, `size()`, `clear()`
  - `boolean add(element)` - note the **boolean** there will be questions about it; it always returns `true`
  - `void add(index, element)` - here is no boolean
  - `boolean remove(element)`
  - `Object remove(int index)` - be careful when you remove an `int` element! it will resolve to this method instead of the one above
  - `removeIf(Predicate)`
  - `Object set(index, Object)`
  - `boolean contains(Object)`
  - `equals()` (uses elements' `equals()`)
</div>

- can you add `null` to an `ArrayList`
<button data-toggle="collapse" data-target="#q8_2" class="btn-link">[see]</button>
<div id="q8_2" class="collapse collapsible bg-info" markdown="1">

- yes of course
- be careful though, as if you try to unbox it to a primitive value you will get a `NullPointerException`
</div>

- what's the deal with this conversion to array of custom type `list.toArray(new String[0])`, why would you be forced to create an empty array just to discard it later
<button data-toggle="collapse" data-target="#q8_3" class="btn-link">[see]</button>
<div id="q8_3" class="collapse collapsible bg-info" markdown="1">

- you can actually pass an existing array there, and it will be filled with the elements from the `ArrayList`, as long as it's big enough
- if the array you passed is not big enough, it will be ignored all together
- pay attention that you cannot pass a primitive type array there
</div>

- how to sort a `List`
<button data-toggle="collapse" data-target="#q8_4" class="btn-link">[see]</button>
<div id="q8_4" class="collapse collapsible bg-info" markdown="1">

- `Collections.sort(list);`
</div>

#### Wrapper types

- `parseInt()` and `valueOf()` - which one converts from which to which
<button data-toggle="collapse" data-target="#q9_1" class="btn-link">[see]</button>
<div id="q9_1" class="collapse collapsible bg-info" markdown="1">

- `Integer.parseInt()` creates `int` out of many other types
- `Integer.valueOf()` creates `Integer` out of many other types

- you can remember that the method which creates the object has same name for all wrappers, because objects have common superclass `Object`, and primitive types don't have a superclass; or you can remember that if `parseInt()` returned an `Integer` it should be called ~~`parseInteger()`~~
- remember that `Character` does not participate in this stuff
</div>

#### Date and Time

- what are the new classes for representing date and time
<button data-toggle="collapse" data-target="#q3_1" class="btn-link">[see]</button>
<div id="q3_1" class="collapse collapsible bg-info" markdown="1">

- `LocalDate`, `LocalTime`, `LocalDateTime`, all in `java.time.*` package
- `DateTimeException`
</div>

- how to create custom date/time
<button data-toggle="collapse" data-target="#q3_2" class="btn-link">[see]</button>
<div id="q3_2" class="collapse collapsible bg-info" markdown="1">

- `LocalDate.now();`
- `LocalDate.of(2015, Month.JANUARY, 1)`, same as `LocalDate.of(2015, 1, 1)`
- `LocalTime.of(6, 15);`
- `LocalTime.of(6, 15, 30, 234);` - last one is nanoseconds
- `LocalDateTime.of(2015, Month.JANUARY, 16, 15, 30);`
- `LocalDateTime.of(date, time);`
</div>

- how to manipulate date/time
<button data-toggle="collapse" data-target="#q3_3" class="btn-link">[see]</button>
<div id="q3_3" class="collapse collapsible bg-info" markdown="1">

- `LocalDate date = LocalDate.of(2014,1,23).plusDays(2).minusWeeks(1);` - remember it's immutable!
- remember that you cannot add minutes to a date, or days to time, etc
</div>

- what is `Period` and `Duration`; what tricky thing was mentioned in the book about it
<button data-toggle="collapse" data-target="#q3_4" class="btn-link">[see]</button>
<div id="q3_4" class="collapse collapsible bg-info" markdown="1">

- `Period period = Period.ofMonths(1); date = date.plus(period);`
- `Period.of(1,0,7);` - every year and 7 days
- remember that you cannot pass hours, minutes, etc to a `Period`
- `Duration` is not on the exam
- the tricky part is that the `of..` methods are **not builder methods** but **static helper methods** - so chaining has no effect, like it does in case of `LocalDate/Time/TimeDate`
</div>

- how to format date/time; what are the predefined formats; what is the default
<button data-toggle="collapse" data-target="#q3_5" class="btn-link">[see]</button>
<div id="q3_5" class="collapse collapsible bg-info" markdown="1">

- `dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)` that resolves to `2020-01-20T12:12:34`
- `date.format(DateTimeFormatter.ISO_LOCAL_DATE)`
- `dateTime.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT))` that resolves to `1/20/2020`
- `dateTime.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM))` that resolves to `Jan 20, 2020`
- `DateTimeFormatter.ofLocalizedTime(FormatStyle.SHORT)).format(dateTime)` - also vice versa
- you can use dateTime with date or time formatters, but not time or date with dateTime formatter, etc
- `DateTimeFormatter.ofPattern("MMMM dd,yyy hh:mm")).format(dateTime)`
- default is `2015-01-02T11:22`, and if seconds or nanoseconds were used, they are also appended
</div>

- how to create a date/time from `String`
<button data-toggle="collapse" data-target="#q3_6" class="btn-link">[see]</button>
<div id="q3_6" class="collapse collapsible bg-info" markdown="1">

- by using a `DateTimeFormatter`, e.g. `DateTimeFormatter.ISO_LOCAL_DATE`,  `DateTimeFormatter.ISO_LOCAL_DATE_TIME`
- `LocalDate.parse(string, formatter);`
- `LocalDate.parse(string);` - uses default format (see previous question), it's rather strict
</div>


- what exceptions were mentioned that are related to date/time, and which is thrown when
<button data-toggle="collapse" data-target="#q3_7" class="btn-link">[see]</button>
<div id="q3_7" class="collapse collapsible bg-info" markdown="1">

- there are two:
  - `DateFormatException` - when you pass e.g. January 67th
  - `UnsupportedTemporalTypeException` - when you try to use time with date object, or date with time object
</div>

### Exceptions

- errors, checked exceptions and runtime exceptions - who throws what and who catches what
<button data-toggle="collapse" data-target="#q13_1" class="btn-link">[see]</button>
<div id="q13_1" class="collapse collapsible bg-info" markdown="1">

- `Errors` - thrown by JVM, shouldn't catch
- `RuntimeException` - thrown by JVM or developer, you may catch
- checked exceptions - thrown by developer, you must catch
- if they ask you about programmatic exceptions, then according to [here](https://starblind.org/code/2016/03/13/oca-java-63-common-exceptions-and-errors/), _programmatically thrown exception means an exception thrown by an application/ API developer_
  - `NumberFormatException`, `AssertionError`, `IllegalArgumentException`, `IllegalStateException`
  - custom exceptions
</div>

- in implementing/overriding method, can we rather declare more or less exceptions than the superclass has
<button data-toggle="collapse" data-target="#q13_2" class="btn-link">[see]</button>
<div id="q13_2" class="collapse collapsible bg-info" markdown="1">

- checked exceptions - only less
- unchecked - doesn't matter
</div>

- give examples of `RuntimeException` (6), checked exception (2) and `Error` (3)
<button data-toggle="collapse" data-target="#q13_3" class="btn-link">[see]</button>
<div id="q13_3" class="collapse collapsible bg-info" markdown="1">

- `RuntimeException` examples:
  - `ArithmeticException`
  - `ArrayIndexOutOfBoundsException`
  - `ClassCastException`
  - `IllegalArgumentException`
  - `NullPointerException`(extends IllegalArgumentException)
  - `NumberFormatException`
- checked exception examples:
  - `IOException`
  - `FileNotFoundException` (extends IOException)
- error examples:
  - `ExceptionInitializerError` - when static initializer block in a class throws an exception
  - `StackOverflowError`
  - `NoClassDefFoundError`
</div>

### .. also, know that

- _autoboxing_ does not work with `Predicate`s
- there is Java process managed by JVM, and this process executes the `static void main`
- `java.lang.*` is automatically imported
- this is correct: `double i = 1_000_000.0`, but this not: `double i = 1_000_000_.0` or double `i = _1_000_000.0` (also not)
- Oracle claims that _"Java prevents memory leaks"_, and that _"Java is secure because it runs inside JVM"_, and that Java 8 is still an OO language
- `^` means XOR
- `if(objectOfTypeA==objectOfTypeB)` will not even compile
- `String implements CharSequence`
- `new StringBuilder(10)` is not `"10"` but it is setting the initial capacity to `10`
- `StringBuffer` is just an old, thread-safe, slow version of `StringBuilder`
- default constructors are automatically added to the `*.class` file by the compiler, and as soon as you write a default constructor yourself, it is no longer called a default constructor
- `package private` access is synonym for `default access`
- _lenient_ means _permissive_, _merciful_ or _tolerant_
- it is _allowed_ to catch `Error`s; it should not be done but it is allowed
- `long x=(y=3)` is valid expression and it sets both `x` and `y` to `3`
- if you get a question about number of code blocks, know that whether a block is nested inside another or not one doesn't matter - total number of `{}` pairs counts
- `finalize()` is called only once, on the first attempt to garbage collect the object (I actually just managed to almost freeze my computer by throwing a `RuntimeException` in the `finalize()` method.. not what I expected..)
