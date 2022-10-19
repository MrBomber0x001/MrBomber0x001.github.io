---
layout: post
title: Internals of Arrays, Slices and Maps on Golang
subtitle: Understand how composite types are represented on Go, and how to take advantage of them!
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/go.jpg
share-img: /assets/img/go.jpg
tags: [go]
---

## Arrays

Arrays are typed by size, which is fixed at compile time

```go

var a [3]int
var b [3]int{0,0,0};
var c [...]{0,0,0}; // sized by initializer

var d [3]int
d = b; // elements copied

var m [...]it{1,2,3,4}

c = m // TYPE MISMATCH
```

Arrays are passed by value, thus elements are copied

## Slices

Slices have variable length, backed by some array and a pointer

```go
var a[]int // nil, no storage
var b =[]int{1,2} //initialized

a = append(a, 1) // append to nil OK 
b = append(b,3) //[]int{1,2,3}

a = b //overwrites a

d := make([]int, 5) //[]int{0,0,0,0,0}

e:= a //same storage (alias)
e[0] == b[0] true
```

Slices are passed by reference; no copying, updating OK

## Maps

Maps are dictionaries; indexed by key, returning a value

You can read from a nil map, but inserting will panic

```go
var m map[string]int // nil, no storage, it doesn't point to any hash table
p := make(map[string]int) //non-nil but empty

a := p["the"] // returns 0
b := m["the"] // same thing
m["and"] = 1 // PANIC - nil map
m = p
m["and"]++ // OK, same map as p now
c := p["and"] //returns 1
```

Maps are passed by reference; no copying, updating OK

the type used for key must have == and != defined  (not slices, maps or funcs)

### Difference between Slices and Arrays

```go
func main(){
 var w = [...]int{1,2,3}
 var x = []int{0,0,0}

 y := do(w,x)
 fmt.Println(w,x,y)
}

func do(a [3]int, b [int]) []int{
 a = b // SYNTAX ERROR
 a[0] = 3 // w unchanged
 b[0]=  3 // x changed

 c := make([]int, 5)
 c[4] = 42
 copy(c, b) // copies only 3 element
 return c
}
```

Maps can't be compared to one another, maps can be compared only to nil as a special case

```go
var m = map[string]int{
    "and": 1,
    "the": 1,
    "or": 2,
}
var n map[string]int
b := m == n // SYNTAX ERROR
c := n == nil // true
d := len(m) //3
e := cap(m) // TYPE MISMATCH
```

Maps have a special two-result lookup function
the second variable tells you if the key was there

```go
p := map[string]int{} // non-nil but empty
a := p["the"] // returns 0

b, ok := p["and"] //0, false

p["the"]++
c, ok := p["the"] //1, true

if w, ok := p["the"], ok {
    // do Something
}
```

### Make nil useful

Nil is a type of Zero; it indicates the absence of something
> Make the zero value useful - Rob pike

```go
var s []int
var m map[string]int

l := len(s) // length of nil slice is 0
i, ok := m["int"] 

for _, v := range s{ // skip if s is nil or empty
    // ...
}
```
