---
layout: post
title: The difference between <i>default</i> and <i>protected</i> access in Java
date: '2016-06-02T16:52:00'
author: Monik
tags:
- Programming
- Java
commentIssueId: 32
---
<div class="bg-info panel-body" markdown="1">
I feel that this topic is a bit under explained, so I attempt here to explain it once and for good.

The four `public`, `protected`, _default_, `private` access modes are most often presented as a list, where the visibility decreases when you move from `public` towards `private`. But this I find very confusing, as in some corner cases this model simply does not work. I want to present an alternative understanding here.
</div>

### Introduction

The `public` and `private` are easy to understand. The first one means _"visible to everyone"_, and the second _"visible only to me"_. No big deal here.

Then comes the `protected`. Oh, that is like something in between, visible only to me and all my subclasses. Okay clear, right.

And finally, the _default_ access. We usually say that it is just like `protected` but plus visibility for classes from the same package.

### The problem

Well and here is a bit of inconsistency, because when we spoke about visibility to subclasses, we meant that this:

```java
package a;
public class A {
    protected int something;
}
```

```java
package b;
public class B extends A {
    void check(){
        int h = this.something;
    }
}
```

but definitely we did not mean this:

```java
package a;
public class A {
    protected int something;
}
```

```java
package b;
public class B extends A {
    void check(){
        A anotherObject = new A();
        int h = anotherObject.something; //COMPILATION ERROR
    }
}
```

even though `B extends A`.

On the other hand, the last example would compile if both classes were in the same package:

```java
package a;
public class A {
    protected int something;
}
```

```java
package a;
public class B extends A {
    void check(){
        A anotherObject = new A();
        int h = anotherObject.something; //compiles!
    }
}
```

It would also compile if both classes were in the same package and `something` would have the _default_ access.

```java
package a;
public class A {
    int something;
}
```

```java
package a;
public class B extends A {
    void check(){
        A anotherObject = new A();
        int h = anotherObject.something; //compiles!
    }
}
```

### Conclusion

So instead of presenting the 4 access modes as a list, I would rather present it as a matrix:

<table border="1">
  <tr>
    <td></td>
    <td>visible to self</td>
    <td>visible to same package</td>
    <td>visible to all packages</td>
  </tr>
  <tr>
    <td>visible to self</td>
    <td>private</td>
    <td>default</td>
    <td></td>
  </tr>
  <tr>
    <td>visible to subclasses</td>
    <td></td>
    <td>protected</td>
    <td></td>
  </tr>
  <tr>
    <td>visible to everyone</td>
    <td></td>
    <td></td>
    <td>public</td>
  </tr>
</table>

Highly illogical, isn't it? But I bet that is why it causes so much confusion when you try to shrink it to a list.

### The solution

One way to remember that is that `protected` and _default_ are both between `public` and `private` but in a different way. As you move from `public` to `private`, the _default_ access decreases the package access only, restricting it to classes only from the same package (not subpackages btw). Next, `protected` builds on top of _default_, allowing access in children even if they are not in the same package:

```
        less access            less access
public -------------> default---------------> private
                        |
                        |
                        | more access
                       \|/
                        V
                     protected

```

Be aware that "visible to subclasses" does not mean that every object has access to `protected` fields and methods of every concrete object that is of its supertype. It has access only to its own inherited fields and methods. May be obvious, but after hours of reading OCA study guide that was no longer that clear..
