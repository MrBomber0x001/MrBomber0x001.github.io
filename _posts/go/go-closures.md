## Closures

Closure is simply an inner function that closes over an outer function enviroment.

A simple definition can be that a closure is a function value that references variables from outside its body.
In other words, a closure is an inner function that has access to the variables in the scope in which it was created
This applies even when the outer function finishes execution and the scope gets destroyed.

#### Anonymous functions

```go
func(messge string){
    fmt.Println(message);
}("Hello it's me")
```

- Function that returns an anonymous function

```go
func main(){
    send_func := give_me_fn()
    send_func("Hello it's me")
}
func give_me_fn() func(string){
    return func(messaeg){
        fmt.Println(message)
    }
}
```

#### Closure

But how does it know what i is?
This works because closure is an inner function that has access to all the variables in the scope where it was created. This applies even after the outer function finishes execution

```go
func main(){
    next := increment()
    fmt.Println(next())
    fmt.Println(next())
    fmt.Println(next())

}
func increment() func() int{
    i := 0;

    return func() int {
        i++
        return i
    }
}
```

When the execution of incrementor() finishes, the scope above is destroyed. But the closure is still able to access and update the variable(s) of the scope even though it’s gone.

**Another example**

```go
func main(){
    add_to_sum := give_me_fn()
    add_to_sum(10)
    add_to_sum(20)
    add_to_sum(3)
    sum := 0 
    for i := 0; i < 100; i = i + 10 {
        sum += add_to_sum(i)
    }
    fmt.Prinf(`%i`, sum)
}

func give_me_fn() func(int) int {
    sum := 0
    return fn (int i) int {
        sum += i
        return sum
    } 
}
```
