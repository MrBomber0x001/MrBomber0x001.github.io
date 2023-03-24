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
