---
layout: post
title: Concurrency & Concurrency Patterns in Go
subtitle: 
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [go]
---


## Table of contents

1. Intro go CSP Concurrency model in Go (routines, channels, mutex, callback)
2. CSP concurrency patterns
3. Mutex
4. Deadlocks
5. Concurrency Patterns

Go is a multi-paradigm programming language

## Hubmle Introduction to concurrency

- Advantages
- Concept of Concurrency
- Differentiating between Concurrency and Parallelism
- CSP versus actor based Concurrency

Go's Concurrency allows us to:

- Construct `Streaming data pipelines`
- Make efficient use of I/O and multiple CPUs
- Allows complex systems with multiple components
- `Routines` can start, run and complete simultaneously
- Raises the efficiency of the applications

## Goroutines

- Creating first Goroutines
- Launching anonymous functions
- Using WaitGroup

we use goroutine to execute code we need to run concurrently
In go we achieve concurrency by working with `goroutines`, in fact the `main` loop of go could be considered goroutine
goroutines are used in places where we might use actors

- they are not threads, we can create millions of goroutines
- incredibly cheap
- Have small growth of stack

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

| output |
| -- |
| 4 |
**A real world example**

## Progress

- [ ] concurrency
- [ ] Goroutines
- [ ] callbacks
- [ ] Mutexes
- [ ] Channels
- [ ] Using it all  - Concurrent Singleton

## Resources

Academic Resource which I recommend

- [ ] Operating system, three easy pieces
- [ ] Go concurrency, Oreilly

- <a href="https://betterprogramming.pub/deep-dive-into-concurrency-of-go-93002344d37b">Deep Dive into Go Concurrency</a>
- <a href="https://pstree.cc/wtf-is-goroutines/">wtf is goroutines</a>
- <a href="https://www.youtube.com/watch?v=oV9rvDllKEg">Concurrency is not Parallelism Rob Pike</a>
- <a href="https://go.dev/doc/effective_go#concurrency">Effective Go - concurrency </a>
- <a href="https://www.sobyte.net/post/2022-03/go-working-pool-mode/">Go Working Pool Mode</a>
- <a href="https://xie.infoq.cn/article/a0880b7d215f7b82bc3a0380a">Go Concurrency Patterns </a>
- <a href="https://www.karanpratapsingh.com/courses/go/advanced-concurrency-patterns">More on Patterns</a>
