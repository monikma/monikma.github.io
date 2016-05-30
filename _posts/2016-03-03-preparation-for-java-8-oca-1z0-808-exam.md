---
layout: post
title: Preparation for Java 8 Se OCA 1Z0 808 Exam
date: '2016-03-03T12:14:00.003+01:00'
author: Monik
tags:
- Programming
- Java
modified_time: '2016-05-27T11:08:11.690+02:00'
thumbnail: https://1.bp.blogspot.com/-MvbdBFZac_8/Vva6untWECI/AAAAAAAACWY/K1q-kn9QhZcYyqCkrfWeikVrWUSMgUKoQ/s72-c/notinitialized.png
blogger_id: tag:blogger.com,1999:blog-5940427300271272994.post-2617148401622069827
blogger_orig_url: http://learningmonik.blogspot.com/2016/03/preparation-for-java-8-oca-1z0-808-exam.html
commentIssueId: 30
type: book
---

<div class="bg-info panel-body" markdown="1">
These are my **study notes** taken while preparing for **Java Oracle Certified Associate** exam and reading the ["Oca: Oracle Certified Associate Java Se 8 Programmer I Study Guide: Exam 1z0-808" by Jeanne Boyarsky](http://www.goodreads.com/book/show/23059696-oca). Reading **such study** guide is in my opinion the best way to prepare for the exam, as it actually teaches you things you will need on the exam rather than what you need when you program in Java (which is entirely different than taking an exam, of course). Here I make notes on the stuff I found new, important or surprising.

Some background about me - I have been programming in Java for about 7 years now (plus minus 2 years, I'm not good at memorizing stuff:P). My programming experience I started at Java 5, by reading thoughroughly the first two thirds of [Thinking in Java](http://mindview.net/Books/TIJ4) book (what I didn't read were threading and custom annotations), and then starting my first job. I recently understood some Java 8 stuff, though this came mostly by learning F# aside (a functional language derived from C#).

Very important: please comment if you find an error.
</div>

### Things that surprised me about the exam

- when they ask you about **compilation errors**, they ask you about **all of them**, not the first one
- when they ask for the "output" they can mean **part of the output**, it also counts (facepalm). basically **each bit of output can be a separate answer** - in such case you need to mark them all
- if there is an answer like "_an exception is thrown_" it still **does not mean** that some other outputs are not true as well, that will happen before the exception; exception is not exclusive with other answers
- when there are **no line numbers** in a code snippet assume that **missing imports do** cause compilation errors
- `public void MyClass()` - this is how they may trick you, notice this is **NOT a constructor** since it has `void` return type..
- `StringBuilder str = "bla";` - another way to trick, this **does not compile**
- Vocabulary: _legal_ = _valid_ = _compiles_

### General things that surprised me about Java

#### On the self assesment test (40% correct)

- class/variable name **can** start with `_`
- `$` is a **perfectly valid** variable name, or start of one
- same naming rules apply for methods, variables, fields and classes, and the two above are all the weird exceptions (well except other Unicode letters of weird languages) (**numbers** are also allowed but **not as first**)
- the, compiler, will, fu**ing, **complain about _reading_ any uninitialized _LOCAL_ variable** (**ALSO PRIMITIVE**), but instance variables are ok (if not final)

![][1]

- `string1 ==string2` will render `true` but `stringBuffer1.toString()==s2` (with same string) will render `false` - there's something called **string pool;** also sth like `new String("bla")` will be always created not taken from string pool

![][2]

- printing list without `.toString()` prints only the object ref of course
- `int[] array = {3,5};` - this is also how you can initialize an array (along with `=new int[]{3,5};`), but only **if it is in same line as declaration**!
- it is possible to **override **a protected method with a **public**; if the method is not protected but **private**, there is no compiler error, and the two are **completely separate**;
- writing `super()` in `public F() { super();...` is optional, **`super();` will be invoked anyway (first)** if no super is invoked manually
- `java.lang.Error`: _An Error is a subclass of Throwable that indicates serious problems that a reasonable application should **not** try to catch._
- `RuntimeException` is thrown by both JVM and developer, **Error **is thrown by JVM, both are **not required **to be caught
- Java has fu**ing **GOTO statements** - what the hell?! [http://www.java-examples.com/java-continue-statement-label-example](http://www.java-examples.com/java-continue-statement-label-example)
- `int x = 6, j=8;` - almost forgot this **multiple assigment syntax;** `int i, int j;` - wrong, `int i,j;` - good
- **this loop**: `do {....} while(condition);`
- there is such class as `java.time.LocalDate`, with a **static method**: `of(int year, java.time.Month month, int dayOfMonth)`, which works predicably, throwing `DateTimeException` if the input is messed up; **months numbered from 1**.
- in lambda variations - if `{}` are used, `return` must be used too
- **Autoboxing** (`int`<->`Integer`) works for collections but **not** for inferring `Predicate`s;
- color=color in constructor works of course, except it does nothing, as "this." is missing
- about interface: **`default` method and normal interface method** also do not combine well when implementing 2 interfaces with same method signature (compilation error)

### Chapter 1 Java Building Blocks (83% correct on the test)

- a **method** has input **parameters**
- `/**` is **Javadoc comment**, and `/*` is normal comment
- the **Java process** is managed by **JVM** and within this process the `static void main`'s code **is executed;** JVM allocates the **memory**, **CPU**, **file access**, etc.
- Starting a Java program:

```
$ javac com/bla/Zoo.java
$ java com.bla.Zoo**
```

where `Zoo` has `static void main` of course (**JDK required for javac, for java only JRE**); if **`main` is missing** the **process** will throw exception; if **`main` is wrong signature** the **Java** will throw **exception**; **`args[0]` is not the program name** but the **first input arg**; if an input arg has **a space**, **wrap it in d-quotes**;

- many imports does not slow down the program, compiler figures out what is actually needed
- `java.lang.*` is **automatically imported**
- **asterisk** in package import **does not import child packages**
- if there is class **name conflict in 2 imported packages, you get compilation error**: _The type ... is ambiguous_, but it is ok, if you point to one name explicitly (e.g. `java.util.Date` and `java.sql.*`); if both are **explicit but collide**, you get another compilation error: _The import ... collides with another import ..._
- `{..}` directly in a class is called **instance initilalizer** (may be static or not); instance initilalizer is also a **code block**
- **order of initialization: fields** and **instance initializer** blocks are run in the order they appear in the file, and constructor at the end
- the opposite of **primitive type** is called **reference type**
- there is **eight primitive types:** `byte` (from `-128` to `127`), `short`, `int`, `long` are respectively: `8`, `16`, `32`, `64`-bit; `float` and `double` are `32` and `64`-bit floating-point(=decimal), respectively; `char` is `16`-bit Unicode
- `int num;` - and **the 32 bits is already allocated** by Java
- number formats: **octal**:** **starts with `0`, e.g. `017`, **hexadecimal**: starts with `0x` or `0X`, e.g. `0xFF`, **binary**: starts with `0b` or `0B`, e.g. `0b10`
- from Java 7 **you can add underscores to numbers**, to make them easier to read, e.g. `1_000_000`, or `1_00_0_000` :P but not at beginning/end/touching the decimal point
- instance variable = field, class variable = static field
- **objects** are stored on the **heap,** references may be
- `System.gc()` is only a **suggestion **to run gc, not an order
- object is eligible for gc **also** if **all references to it have gone out of scope**
- they claim that "**Java prevents memory leaks**", ok good to remember
- they say also that it is **secure** because it runs inside JVM
- double values do not have to have `.0`, e.g. `double d = 98;` is ok! (it's called **upcasting**), same for **float**!
- even though Java 8 has functional stuff, it's stil an **OO language**

### Chapter 2 Operators and Statements (70% correct on the test)

- three types of operators: **unary**, **binary**, **ternary**, depending to how many operands they can be applied (1, 2, or 3)
- order of **operator precedence** (most weird ones are not required for this exam):
  - `i++`, `i--`
  - `++i`, `--i`
  - unary `+`, `-`, `!`
  - `*`, `/`, `%`
  - `+`, `-`
  - `<<`, `>>`, `>>>` (shift operators)
  - `<`, `>`, `<=`, `>=`, `instanceof` (relational operators)
  - `==`, `!=`
  - `&`, `^`, `|` (logical operators)
  - `&&`, `||` (short circuit logical operators)
  - ternary `a ? b: c`
  - `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `^=`, `!=`, `<<=`, `>>=`, `>>>=` (assignment operators)
  - `int t = 11/3` = 3! (floor)
- **numeric promotion**
- integer multiplied by double is type double
- numeric promotion occurs actually before the operation, for any operator
- **short multiplied by short is integer** (same for char) for binary operators
- but `short t =9, g=2; t *= g;` works :) - use of compound assignment, casts automatically **after**

> ![][3]

- `(short)1921222 = 20678` - because **overflow **happened
- `int y = (x=3);` - this is **correct**, and the **value** is `3`;
- the boolean operator `^` means **exclusive or**!
- `5 == 5.0` is true (promotion)
- Java statement is **complete unit of execution, terminated by semicolon**
- loops, if, are called **control flow statements**
- **watch out for** tricky **indentation!**
- the `a ? b : c` is also doing **short circuiting**
- `switch` supports: `int`, `byte`, `short`, `char`, their wrappers, `enums` and strings (some since Java 7), **no long**, **no boolean**! and they must be either constants (e.g. literals) or `final`
- `do-while` loop **guarantees that the statement will be executed at least once,** on contrary to the while loop
- the for loop consists of: initialization, booleanExpression and updateStatement; **initialization** and **updateStatement** may contain **mutliple terms**, separated by **commas** (the variables in initialization block have to be of same **type**, variables in the updateStatement **may not reference each other**)
- `for (;;)` is correct, it's an infinite loop
- the variable declared in the initialization of the loop is **scoped only inside the loop**
- `LABEL:` is an optional **pointer to the head of a statement**; does not have to uppercase; can be used after **break**: `break LABEL;` or **continue**: `continue LABEL;`
- `continue` - finish execution only of current loop;
- there is no `continue` or `break` in if!
- `byte y = (int)short1 + short2` - will **not work**, bracket missing!
- in `do-while` - watch out for **variable scope**!!
- the `==` operator **will not compile** if the compared objects are of different type!

![][4]

### Chapter 3 Core Java APIs (69% correct on the test, 23/33 questions)

- API stands for _Application Programming Interface_

**String**

- System.out.println(1 + 2 + "c"); //outputs "3c" (order of operators)
- **Strings are immutable **(so also **final**), so doing operations on them always returns a new String
- str.**indexOf**() - returns first index of occurence, or -1
- str.**substring**(inclusively, exclusively)
- str.**startsWith**() and str.**endsWith**() is case sensitive
- **String implements CharSequence**
- str.**replace**(oldChar, newChar) or oldSequence, newSequence - replaces **all occurences**!
- StringBuilder=new **StringBuilder**(10); // initial capacity, default 16
- strBuilder.**charAt**(), .**indexOf**(), .**length**(), .**substring**(); substring returns a String
- strBuilder.**insert**(offset, string)
- strBuilder.**delete**(startInc, endExc), .**deleteAt**()
- strBuilder.**reverse**()
- **StringBuffer **is just an old, thread-safe, slow version of StringBuilder
- System.out.println(stringBuilder); will actually convert it to String
- watch out for stupid spaces in strings, like " bla" :S
- concatenated literals from string pool is a new string and **will not be "==" equal **to same string from string pool

**Array**

- An **array **is an area of memory on the **heap **with space for a designated number of elements; String is implemented as an array
- int[] numbers = new int[3];
- int[] numbers = new int[]{14,12,53};
- int[] numbers = new int{14,12,53};
- int [] numbers = new int[3];
- int numbers[] = new int[3];
- numbers is a **reference variable **\- it **points **to the array object
- int a[], b; //this is one int array and one int, and is correct!
- [Ljava.lang.String;@160bc7c0 - **array **of** reference type **java.lang.String and 160bc7c0 **hash code**
- Arrays of Strings **does not allocate space for strings**. Only allocates space for references to Strings.
- Arrays will let you cast themselves and put inside it whatever matches the declared type - but gives no shit about runtime errors (ArrayStoreException is thrown on an attempt to store a an object that does not match the **initialized **type)
- java.util.Arrays.**sort**(array)
- java.util.Arrays.**binarySearch**(array, what) - works only for **sorted array**, for non sorted the result will be random; **if the element is not found**, this method returns (-1*i)-1, where i is the index where a new element would have to be put to match
- `int[] vars4 [], space [][]` -** this is one 2D and one 3D array**!
- `int[][] differentSize = { {2},{4,6},{1,2,5,7}}`
- `int[][] args = new int[4][]; args[0] = new int[5]; args[1] = new int[3];`
- `char[]c` - compiles (no space)
- `final int[][] java = new int[][];` - does not **compile! **cannot have more dimensions before first one is specified (only the first one needs to be specified)!![][5]

**ArrayList**

- new ArrayList(10); //**capacity**
- new ArrayList(**anotherList**);
- **Object **arrayList.**remove**(index);
- **boolean **arrayList.**remove**(object); //removes **first **matching
- arrayList.**removeIf**(condition) - new! Java 8!
- ReplaceObject **set**(index, object)
- .**isEmpty**(), .**clear**()
- .**contains**() - calls **equals on elements**!
- .**equals**() - deep comparing
- list.**toArray**() converts not to ArrayList, but something that **does not let you remove**() - it's a fixed size version of a list

![][6]

**Wrappers for Primitives**

- **parseInt**() returns a **primitive**, while **valueOf**() returns a **wrapper class**
- **autoboxing **\- since Java 5 primitives are **automatically **converted to wrappers, if needed (except predicates)
- listOfIntegers.**add**(null) - is legal! but unboxing it into int will cause NullPointerException (as it's not an int), meaning this: **int h = listOfIntegers.get(0); **btw adding **null **is no longer called autoboxing

![][7]

- list.**remove**(2) - will rather treat 2 as index, not object - as int is closer to int than Integer

**Dates and Times**

- completely different in Java 8, **old way is not on the exam **(yuppi!!)
- import java.time.*
- time zones are **out of scope **(yaaay!!)
- **LocalDate **\- date without time and timezone, use e.g. for birthday
- LocalDate.now();
- the output **depends on the locale **where you are, but** in exam US format is used**: 2015-01-20
- LocalDate.**of**(2015, Month.JANUARY, 1), same as LocalDate.**of**(2015, 1, 1)
- **LocalTime **\- time without timezone and without date
- US output: 12:45:16:245
- LocalDateTime.**of**(6, 15);
- LocalDateTime.**of**(6, 15, 30);
- LocalDateTime.**of**(6, 15, 30, 234); - last one is nanoseconds
- **LocalDateTime **\- both date and time but without timezone
- US output: 2015-01-20T12:45:16:245
- Java uses T to separate date from time when converting it to a String
- LocalDateTime.**of**(2015, Month.JANUARY, 16, 15, 30);
- LocalDateTime.**of**(date, time);
- Oracle recommends** avoiding time zones **unless you really need them (yaay!)
- btw, ZonedDateTime is for timezones
- new LocalDate(); - **does not compile**
- **DateTimeException **if the numbers are invalid
- in the past - Date class represented both date and time, always; moths started from 0; actually Calendar was newer way, but still it's old :P and long to use..

**Manipulating Date and Time**

- local**Date**.**plusDays**(2); .**plusWeeks**(), ... - **immutable**!

![][8]

- local**Time**.**minusHours**(3);, ... - **notice, LocalDate does not operate on hours**, and vice versa!
- LocalDate is **immutable**! - chain those methods
- LocalDate.toEpochDay() - number of days since Jan 1 1970
- LocalDateTime.toEpochTime() - number of seconds
- LocalTime.toEpo... - does not exist!
- **Period**.**ofMonths**(1); localDate.**plus**(period); for LocalTime it throws UnsupportedTemporarTypeException
- **Period**.**of**(1,0,7) - every year and 7 days
- chaining does not take any effect, only last will take effect (compiler warns)
- **Duration **is for hours, minutes and seconds, but it's not on the exam
- localDate.**getDayOfWeek**(); //MONDAY
- localDate.**getDayOfYear**(); //30

**Formatting Date and Time**

- java.time.format.**DateTimeFormatter**
- localDate.**format**(DateTimeFormatter.**ISO_LOCAL_DATE**); //2020-02-20
- DateTimeFormatter.**ISO_LOCAL_TIME **//11:12:34
- DateTimeFormatter.**ISO_LOCAL_DATE_TIME **//2020-02-20T11:12:34
- DateTimeFormatter.**ofLocalizedDate**(FormatStyle.SHORT).**format**(dateTime); // 1/20/20 - notice that also has to match, cannot have a time type for localDate (exception)
- **date formatter **can format **dateTime**, but** dateTime formatter **cannot format **date **(exception)
- in other words, formatter is only confused with missing data, it's super fine with too much data ;)
- so can use date.**format**(formatter) as well as formatter.**format**(date)
- FormatStyle.**SHORT**: 1/20/20 11:12 AM
- FormatStyle.**MEDIUM**: Jan 20, 2020 11:12:34 AM
- DateTimeFormatter.**ofPattern**("MMMM dd, yyyy, hh:mm"); //January 20, 2020, 11:12 - but remember, also has to match with the formatted type!
- in the past - SimpleDateFormat, same stuff
- be careful, e.g. DateTimeFormatter.**ofLocalizedTime **outputs only time, even though the formatter is for both dates and times

**Parsing Date and Time**

- LocalDate.**parse**(string, formatter);
- LocalDate.**parse**(string); - uses default

### Chapter 4 Methods And Encapsulation (48% correct, but very very fed up)

- the difference between **default** (i.e., when you don't specify any)** **and **protected **access - default is only available for the classes in same package, knows nothing about inheritance
- **optional specifiers** are: static, abstract, synchronized (out of scope), native (out of scope), strictfp (out of scope), and they come** between **the access modifier and the return type
- **_ and $ are allowed **in method name, cannot start with a number though
- **a vararg must be the last parameter **in the parameter list; so only 1 is allowed; if it's absent it means it is an array of length 0; except you have passed **null explicitly** (works even for primitive types)

![][9]

- it's **not allowed to limit the visibility in subclass**

![][10]

- if the base class has **private methods**, to its children they don't exist; **redeclaring them is not overriding**
- [my own conclusion] **protected does not mean **that subclass can access protected members of an object belonging to its supertype; it means that it inherits the protected members of its parent class, but **only in context of itself**; it can access the protected members of another object **only if it is in the same package**

| ----- |
|  ![][11] |
| bla() is protected in A, A and B are in different packages  |

- **static variables **vs **static methods **\- a copy of **static variable **is copied to each class, the code of the **static method **not
- **static methods **are used e.g. in utility classes where they don't require object's state, or for sharing state among all instances, e.g. counter
- **static methods **can be accesses **even after a null has been assigned **to the object reference! k=null; and next k.callStaticMethod() \- works!

![][12]

- **non-static method can call a static method**, only vice versa is not allowed (watch out for tricky question)
- a **constant **= a **static final variable**
- **final **only means that that variable cannot be reassigned, but if it is a list for example, we can add elements (call methods)
- **static initializer**, is the static {} block, directly in the class; it **runs when the class is first used**; and **here (and only here) the final variables can be reassigned! **(but **not more than once**)
- **static import **is declared**: import static** java.utils.Arrays.asList; in case of conflicts local have precedence; and if two imports collide there's compilation error
- static import **does not import parents **:)
- Java **is a pass-by-value language**, not by reference; it means that changing assignments inside a method has no effect outside the method
- **access modifiers **and **exception lists **are **irreleveant to method overloading**; overloading will not compile when the compiler cannot figure out the difference between 2 methods on calling, e.g.:
- **does not compile **when there's:
- **different return type**
- **static and non static**
- **varargs and array**
- **compiles **when there's
- **int and Integer **\- autoboxing is only done when is neccessary
- **String **and **Object**
- **int **and **long**; even passing "123" to a method accepting long works
- official **order of calling overloaded method**:
- exact match
- larger primitive type
- autoboxing
- varargs
- while trying to find an overload, **Java does max one conversion**, later is compilation error! E.g. calling a method accepting Long with an int argument causes a compilation error!
- in constructor, when you write: this.name = name; it works because local variable has priority
- **default constructors **are actually **generated while compiling** (when applicable); the *.class file has them
- a manually declared constructor that looks like **default constructor **is **not called** "default constructor" anymore
- **constructor chaining** \- is the technique of caling one constructor from another, adding 1 parameter each time
- order of initialization:
- **initialize superclass (**if present)
- **static vars **and **static initializers **in order they appear
- **instance variables **and **instance initializers **in order they appear
- **constructor**
- the fact that **getters for boolean should begin with "is" **is the official JavaBeans rule for naming conventions; same goes for the rest of the name (always camel cased name of the variable, case sensitive!)
- for some reason getNumWings(){return numberWings;} was correct..
- **encapsulation **vs **immutability - **both prevent **uncontrolled changes**; easiest way to achieve immutability is to move everything from setters to constructor (if there are mutable fields with getters, you have to defensive copy them, too)
- **lambda expression **is like an **anonymous method**
- **a labmda expression can use**: instance and static variables, and method and local parameters as long as it doesn't change them
- **functional interface **\- has exactly 1 method
- public interface Predicate{boolean test(T t);} (java.util.function.*)
- ArrayList.removeIf(Predicate p)
- _**lenient **- permissive, merciful, or tolerant_
-  "**package private**" access = "**default**" access !
- methods can also be **final**, don't forget this
- **what happens with instance initializer of the class **when static void main() is called? nothing, they are not executed!
- **static final **variables must be set!
- **short **is bigger than **byte** (8)!
- it is **okay to have a method with the same name as the class name **(and starting with a capital letter)
- it's ok to refer to class variable in same class without the class name in front

![][13]

####

### Chapter 5 Class Design (45% correct)

- in top level classes only **public **or **default **access is allowed
- **hiding static methods **\- when a static method is overridden, this is actually called **hiding**, not overriding ;) ("**static**"** **modifiers **must match**!)
- class/instance **variables are always hidden **when extending - **both **instances exist in memory, within the child class object (and referring them **does not work **like invoking methods polymorphically)

![][14]

- **private **variables / static methods not being accessible in a subclass **is also called hiding**! (so yes it happens always)
- Java (still) implements **single **inheritance (no inheriting from multiple classes), but **multiple level inheritance **(arbitrarily many classes in inheritance hierarchy); as exception to the single inheritance, it allows **implementing multiple interfaces**
- Java **compiler automatically inserts stuff **like "extends java.lang.Object" or "super();" call in constructor
- you can also access fields with **super**, e.g. super.age
- pay attention to the difference between **this **and **this()**, **super **and **super()**
- you can **call super class' method **by calling SuperClassName.doSomething()
- **final **methods cannot be **overridden **or **hidden**
- **exceptions **in implementing classes can be more narrow or **missing(!)**, but **not broader**

![][15]

- **covariant return type** \- in inheriting class the return type must be same or more narrow than in superclass' method
- **abstract class and interface cannot be marked as final **(of course, right..); same with **abstract **method
- an **abstract method cannot be private**; same with **abstract class**
- **interfaces **are assumed to be **abstract**, you can even specify them abstract:

![][16]

- **interfaces **are assumed to have only **public **or **default **access
- **interface**'s variables are assumed to be **public static final **(so must be initialized, even if no **final **is explicitly written!)
- ****interface**'s methods are assumed to be public abstract** **_either abstract, static or default_ **(since Java 8!)
- on exam be careful with "_extending intefaces_" and "_implementing abctract classes_" (both wrong:P)
- extending abstract classes and implementing (multiple) interfaces at the same time, what happens on **method clash**:
- if **signatures match**, no problem (!)
- if not (and it's not an overload), **compilation error** :)
- unless, unless, **exactly one of them** is marked as **default** (Java 8)
- okay, last chance :P also **more than one **can be marked as default, but then all implementing classes must override at least **all of them but one**
- **default method **\- can be defined **only in interface **and **has body**; is **not **assumed to be** abstract**,** nor static**,** nor final**, always assumed to be **public **though
- was introduced to keep **backward compatibility** in Java 8
- implementing classes can override but don't have to
- they **require **implementing class to be invoked (cannot invoke on the interface)

![][17]

- **default method **can be **redeclared **as **abstract **in extending interface/implementing abstract class!
- **static method of an interface **\- also new in Java 8 - just like a static method, but does **not get inherited**! must be declared with word "**static**"; must be referred to using the **interface name **(even in implementing class)
- **virtual method **\- this is connected to plymorphism; it's a method whose implementation is not determined until runtime; all non-final, non-static and non-private methods in Java are **virtual**
- (understanding **polymorphism **\- of course, you need to know that if you create an object and assign it to reference of the type of its **superclass**, and call a method on it, **still the subclass' method** will be invoked)
- this, compiles (aaaarrrgh!):

![][18]



- pay attention to **missing default constructors** when others are present!
- look, a sentence: "_a class implementing an interface must implement all its methods_" is **false**, since the implementing class could be **abstract **(fa-ce-palm)
- getting even better: "_a concrete **sub**class must implement all the methods defined in inherited interface_", also **false**, since it could have been a 2nd level inheritance, and maybe some class in the middle has already implemented some of the methods (ah, seriously?!)
- conclustion - **read each answer separately**, don't keep the context from previous sentences you've just read.. ah, such bastards!
- _"inherit an interface"_, _"override a method of an interface" _\- those seem to be **correct **expressions..
- **method hiding **can be veery tricky:

![][19]

- actually now that I think about it, it's pretty logical, as Bird reference has no chance of knowing that Pelican has declared some method, as there is no link between the two fly() methods (as the Bird one is private)

### Chapter 6 Exceptions (80% correct, 16/20)

- **Errors **\- they are the other subclass of **Throwable**, and are meant to express something that went **very wrong**; **JVM **throws them; you're **not supposed **to catch them, as anyway you won't be able to fix them;
- RuntimeExceptions you may catch
- you **cannot omit braces **with try-catch, like you can with if and with when
- **catch **and **finally **blocks have to be **in the right order**; **at least one **must be present
- finally runs **always**, **except **when System.exit(int code) is called!
- catching a subtype of exception that was caught above **does not compile**
- **at most one catch block runs (first one matching) - remember about it when you read the code, it's easy to forget!**
- **exception thrown from inside finally block masks the exception thrown in the catch block! **the previous exception is as if it was not thrown at all
- RuntimeException examples:
- **ArithmeticException**
- **ArrayIndexOutOfBoundsException**
- **ClassCastException**
- **IllegalArgumentException**
- **NullPointerException **(extends IllegalArgumentException)
- **NumberFormatException**
- checked exception examples:
- **IOException**
- **FileNotFoundException **(extends IOException)
- error examples:
- **ExceptionInitializerError **\- when static initializer block in a class throws an exception
- **StackOverflowError**
- **NoClassDefFoundError**
- overriding/implementing method** can declare less checked exceptions**, but not more; in case of runtime exceptions anything is compiling
- System.out.println(e); has same effect as System.out.println(e.getClass().getName()+": "+e.getMessage());

![][20]

- all of these exceptions have default constructor, yaay!
- **Errors are allowed to be handled or declared **\- this sentence is true; yes, they should not be, but they are allowed to!

**
**

[1]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/notinitialized.png
[2]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/stringpool.png
[3]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/conversion.png
[4]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/incompatibleEquals.png
[5]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/arrays.png
[6]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/toArray.png
[7]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/autoboxing.png
[8]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/immutable.png
[9]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/varargs.png
[10]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/visibility.png
[11]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/visibility3.png
[12]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/nullstatic.png
[13]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/staticreference.png
[14]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/hidingvars.png
[15]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/exceptions.png
[16]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/abstractInterface.png
[17]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/defaultmethod.png
[18]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/spaces.png
[19]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/methodhiding.png
[20]: http://monami555.github.io/pictures/2016-03-03-preparation-for-java-8-oca-1z0-808-exam/exceptionConstrs.png
