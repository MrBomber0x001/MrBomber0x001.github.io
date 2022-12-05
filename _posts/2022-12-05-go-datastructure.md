---
layout: post
title: A Deeper look into Go's fundmental data structures
subtitle: see how Arrays, Slices and Maps are represented internally and how we can optimize them
cover-img: /assets/img/t-sql.jpg
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [go]
---


# Introduction

This is a test

### Arrays

* Fixed-size collection of the same type of data, once the array is declared, neither the type or the length can be changed, to add more elements you need to make a new array with the length you need and copy from an old array,

* all the array elements are initialized with their respective zero-value

```go
var array[n] T var a = [n]T{V1, V2, V3, ... , Vn}
```

#### Working with Arrays

```go
func main(){ 
var arr = [4]int {1,2,3,4} 
arr := [4] int {1,2,3,4} 
// looping: 
//1. len() 2. range 
for i := 0; i < len(arr); i++ { 
fmt.Prinf("Index: %d, Element: %d\n", i, arr[i]) 
} 
for i, e:= range arr { 
fmt.Prinf("index %d, Element: %d\n", i, e) 
} 
for range arr { } 
// multi-dimensional 
arr := [2][4]int { {1,2,3,4}, {5,6,7,8} } 
for i, e := range arr { 
fmt.Prinf("Index: %d, Element: %d\n", i, e) 
} 
// let the compiler infer the length of the array and by using [...] instead 
arr := [...][4]int { {1,2,3,4}, {4,5,6,7}  }
```

#### Array's properties

Those Properties are really important to consider when dealing with arrays

* Arrays' length is part of their type

* An Array can be assigned to an array of the same type

```go
array := [5]* int {0: new(int), 1: new(int)}
*array[0] = 10
*array[1] = 20
```

> Arrays with different sizes are not equal, this mean we can't resize an array because we are producing a new type

so `array type = length + type of data that can be store in each element`

```go
var array1 [5]string
array2 := [5]string {"Red", "Blue", "Green", "Yellow", "Pink"}
array1 = array2
```

> copying an array of pointers copies the pointer values and not the values that the pointers are pointint to

```go
var array1 [3]*string
array2 := [3]*string{new(string), new(string), new(string)}
*array2[0] = "Red"
*array2[1] = "Blue"
*array3[2] = "Green"

array1 = array2
```

After copying, you'll have two arrays pointers to the same strings

#### Multi-dimensional Arrays

> Arrays are always one-dimensional.

But they can be composed to create multi-dimensional ones.

```go
// Declare a two dimensional integer array of four elements
// by two elements.
var array [4][2]int
// Use an array literal to declare and initialize a two
// dimensional integer array.
array := [4][2]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
// Declare and initialize index 1 and 3 of the outer array.
array := [4][2]int{1: {20, 21}, 3: {40, 41}}
// Declare and initialize individual elements of the outer
// and inner array.
array := [4][2]int{1: {0: 20}, 3: {1: 41}}
```

#### Passing arrays between functions

> Passing arrays between functions can be an expensive operations in term of memory and performance

Arrays are value types not a reference one, so when you pass an array to a function, the entire array elements are copied first and then passed to an array.

imaging an array of one million elements of type int, on a 64-bit machine, this would require about 8 million bytes :"D (8MB) of memory

```go
var array [1e6] int
foo(array)

func foo(array[1e6]int){

}
```

this means, every time you call that function, an 8MB of memory has to be allocated on the stack, then the value of the array has to be copied into that stack

> 🎉 There's a hack around this problem, just pass the pointer, and now everytime you call the function, it will only allocate about 8 bytes :"D

```go
var array [1e6] int
foo(array)

func foo(array *[1e6]int){

}
```

🔴 But be careful here, because you're passing a pointer, your data is shared within the function, any changes from the function will change the original data on the array

## Slices

> Slices internally used array, it's built upon the concept of dynamic arrays.

* shrinking: by slicing the underlying memory

* growing: using append (will see later)

> the underlying memory of slices are contiguous blocks

### 3 fields

* pointer to the underlying array

* length of the number of elements the slice has access to

* capacity or number of elements the slice has available for growth

> Knowing the capacity you need ahead of time will usually determine how you go about creating your slice.

#### Creating

* make() method

* slice literal

```go
slice := make([]T, length, capacity)

slice := make([]string, 5)
```

> When using a slice literal, you can set the initial length and capacity. All you need to do is initialize the index that represents the length and capacity you need

create a capacity of 100 elements

```go
slice := []string{99: ""}
```

```go
a := [5]int{1, 2, 3, 4, 5} 
s := a[1:4] 
fmt.Printf("Array: %v, Length: %d, Capacity: %d\n", a, len(a), cap(a)) 
fmt.Printf("Slice: %v, Length: %d, Capacity: %d\n", s, len(s), cap(s)) }
```

#### Nil slices

> nil slice is the most common way you create slices in Go. They can be used with many of the standard library and built-in functions that work with slices. They’re useful when you want to represent a slice that doesn’t exist, such as when an exception occurs in a function that returns a slice

```go
var slice []int
nil pointer
```

* 0 length and capacity

#### empty slice

> An empty slice contains a zero-element underlying array that allocates no storage. Empty slices are useful when you want to represent an empty collection, such as when a database query returns zero results

```go
slice := make([]int, 0)
slice := []int
```

### Operation with Slices

#### Appending and slicing

* slicing portion of the underlying arrays

```go
slice := []int {1,2,3,4,5}
newSlice := slice[1:3]
```

> we have two slices that are **<mark>sharing</mark>** the same underlying array. However, each slice views the underlying array in a different way

Now we've two slices **sharing** the same underlying array

![](<https://cdn.hashnode.com/res/hashnode/image/upload/v1670176715050/ntIRy8E1O.png> align="left")

The following formula is used to calculate the length and capacity of slices

```go
For slice[i:j] with an underlying array of capacity k
Length: j - i
Capacity: k - i
```

#### Growing

> #### One of the advantages of using a slice over using an array is that you can grow the capacity of your slice as needed

* append() call return a new slice with the changes made

> The append function will always increase the length of the new slice. The capacity, on the other hand, may or may not be affected, **<mark>depending on the available capacity of the source slice</mark>**

```go
slice := []int{1,2,3,4,5}
newSlice := slice[1:3]

newSlice = append(newSlice, 60)
```

![](<https://cdn.hashnode.com/res/hashnode/image/upload/v1670177236053/fxV3krZBU.png> align="left")

> When there’s no available capacity in the underlying array for a slice, the append function will create a new underlying array, copy the existing values that are being referenced, and assign the new value

```go
// Create a slice of integers.
// Contains a length and capacity of 4 elements.
slice := []int{10, 20, 30, 40}
// Append a new value to the slice.
// Assign the value of 50 to the new element.
newSlice := append(slice, 50)
```

🟢 After this append operation, newSlice is given its own underlying array, and the capacity of the array is doubled from its original size

![](<https://cdn.hashnode.com/res/hashnode/image/upload/v1670179079062/YlfUWDCl2.png> align="left")

> Capacity is always doubled when the existing capacity of the slice is under 1,000 elements. Once the number of elements goes over 1,000, the capacity is grown by a factor of 1.25, or 25%. This growth algorithm may change in the language over time

Take this example

```go
slice := []int{10, 20, 30, 40, 50}
 newSlice := slice[1:3]
 fmt.Println(`old`, newSlice)
 newSlice[1] = 35
 fmt.Println(`new`, newSlice)
 fmt.Println(`original slice`, slice)
 newSlice = append(newSlice, 60, 70, 80, 90)
 fmt.Println(`after appending`, newSlice)
 fmt.Println(`original slice`, slice)
}
```

Try and guess the output!

#### Three index slices

There’s a third index option we haven’t mentioned yet that you can use when you’re slicing. This third index **<mark>gives you control over the capacity of the new slice</mark>**

> As you’ll see, being able to restrict the capacity of a new slice provides a level of protection to the underlying array and gives you more control over append operations

```go
source := []string{"Apple", "Orange", "Plum", "Banana", "Grape"}
slice := source[2:3:4]
```

`slice` now has only one element, and a capacity of two elements, we can calculate using this formula

```go
For slice[i:j:k] or [2:3:4]
Length: j - i or 3 - 2 = 1
Capacity: k - i or 4 - 2 = 2
```

![](<https://cdn.hashnode.com/res/hashnode/image/upload/v1670212588169/Q4Rdrov9y.png> align="left")

🔴 if we try and set a capacity larger than existing capacity, we'll get a runtime error

```go
// This slicing operation attempts to set the capacity to 4.
// This is greater than what is available.
slice := [2:3:6]
```

> By having the option to set the capacity of a new slice to be the same as the length, you can force the first operation to detach the new slice from the underlying append array

Try and guess the output of those operations

```go

 source := []string{"Apple", "Orange", "Plum", "Banana", "Grape"}
 slice := source[2:3:4]
 fmt.Println(slice)
 slice = append(slice, "Kiwi")
 fmt.Println(`slice`, slice)
 fmt.Println(`source`, source)
------------------------------
source := []string{"Apple", "Orange", "Plum", "Banana", "Grape"}
 slice := source[2:3:3]
 fmt.Println(slice)
 slice = append(slice, "Kiwi", "Grapes")
 fmt.Println(`slice`, slice)
 fmt.Println(`source`, source)
```

our append function is also **variadic**

```go
// Create two slices each initialized with two integers.
s1 := []int{1, 2}
s2 := []int{3, 4}
// Append the two slices together and display the results.
fmt.Printf("%v\n", append(s1, s2...))
```

#### Iterating over slices

this section is the most important one because we're going to be introduced to some problems

```go
slice := []int{10,20,30,40,50}
for index, value := range slice {
    fmt.Println("Value: %d Value-Addre: %X ElemAddr: %X\n", value, &value, &slice[index])
slice[index] = value + 1
}
fmt.Println(slice)
```

the output will be

```bash
Output:
Value: 10 Value-Addr: 10500168 ElemAddr: 1052E100
Value: 20 Value-Addr: 10500168 ElemAddr: 1052E104
Value: 30 Value-Addr: 10500168 ElemAddr: 1052E108
Value: 40 Value-Addr: 10500168 ElemAddr: 1052E10C
[11 21 31 41 51]
```

* address of **value** variable is always the same **<mark>because it’s a variable that contains a copy.</mark>**

* The address of each individual element can be captured using the slice variable and the index value.

> It’s important to know that range is **<mark>making a copy of the value</mark>**, not returning a reference. If you use the address of the value variable as a pointer to each element, you’ll be making a mistake

#### Multi-dimensional slices

```go
// Create a slice of a slice of integers.
slice := [][]int{{10}, {100, 200}}
// Append the value of 20 to the first slice of integers.
slice[0] = append(slice[0], 20)
```

![](<https://cdn.hashnode.com/res/hashnode/image/upload/v1670213637629/sZdqn0qyz.png> align="left")

and this after appending

![](<https://cdn.hashnode.com/res/hashnode/image/upload/v1670213697976/73GgRcK40.png> align="left")

an entire new slice of integers and a new underlying array is allocated and then copied back into index 0 of the outer slice

#### Passing slices between functions

> Passing slices between functions is cheap, because we slices itself contains nothing more than a pointer, len and cap.
>
> the underlying array is not copied, just the pointer to it from the slice

```go
slice := make([]int, 1e6)
slice = foo(slice)

func foo(slice []int)[]int{
...
return slice 
}
```

![](<https://cdn.hashnode.com/res/hashnode/image/upload/v1670213906836/tv6f08MgA.png> align="left")

#### Operations

* copy

* append

* remove

## Maps

> an unordered collection of key/value pairs.

The strength of a map is its ability to retrieve data quickly based on the key.

there’s no way to predict the order in which the key/value pairs will be returned, this is because maps are implemented using hash tables

![](<https://cdn.hashnode.com/res/hashnode/image/upload/v1670214089808/KzTyinOEh.png> align="left")

The map's hash table contains

* collection of buckets

> everything starts with selecting a buckets when it comes to looking up, removing and storing

This is performed by passing the key—specified in your map operation—to the map’s hash function.

The purpose of the hash function is to generate an index that evenly distributes key/value pairs across all available buckets

> The better the distribution, the quicker you can find your key/value pairs as the map grows.

### Internals

### Creating and Initializing

### Working with Maps

### Passing Maps between functions

### Keynote

Practice, Practice, and Practice because knowing is not enough!

> Here's a gitub repo where you can find some application I've built as a practice for such topics, You can pick what you want if you've any other ideas.
