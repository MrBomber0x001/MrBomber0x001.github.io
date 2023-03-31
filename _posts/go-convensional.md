---
layout: post
title: Concurrency in Go - conventional synchronization
subtitle: synchronization techniques that enable goroutines to communicate together avoiding racing conditions
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/go/concurrency.png
share-img: /assets/img/go/concurrency.png
tags: [go]
---


## Table of contents

1. WaitGroup
2. Locking shared resources [Intro]
    2.1. Atomic functions
    2.2. Mutexes
        2.2.1. Introd
        2.2.2. Types
        2.2.3. Practical!!
3. Channels
    3.1. Introd
    3.2. Buffered Channel
    3.3. UnBuffered Channels
4. Resources

## Locking Shared resources

### Atomic functions

### Mutexes

## channels

In simpler words, they are means to sending information from part of your program to another part of your program

```go
// You can edit this code!
// Click here and start typing.
package main

import (
 "log"
 "math/rand"
 "time"
)

const numPool = 10

func CalculateValue(intChan chan int) {
 randomNumber := RandomNumber(numPool)
 intChan <- randomNumber
}

func main() {
 intChan := make(chan int) // a channel that can hold only int
 defer close(intChan)      // as good practice to close the channel after main finish executing, that's why we use defer

 go CalculateValue(intChan)

 num := <-intChan
 log.Println(num)
}

func RandomNumber(n int) int {
 rand.Seed(time.Now().UnixNano())
 value := rand.Intn(n)
 return value
}

```
