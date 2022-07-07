---
layout: post
title: Typescript in Depth
subtitle: Learn to use Typescript features in depth
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [js]
---

### Table of Content

- Fundmentals
  - number
  - string
  - boolean
  - any (avoid using it as much as you can)
  - implict [infere typing i.e const] vs explict typing
  - void (has no returning value at all, either for values, or functions)
  - never (commonly with errors)
  - null and undefind (it's better to enforce strictNullChecks)
  - union types (tell typescript choose one of these types) | | |
  - function type with optional parameter and default parameter[Function keyword or using signature [you don't have to follow the same names for parameters list]]
  - object
  - arrays
  - tuples
- type alias, type assertion
- enum, inline members
- generics
- interface and with extends
- class with access modifiers, setters and getters, extends, abstract, implements, static
- this, call, apply, bind, arrow function
- Lexical Scope and Arrow function
- Type Query
- Type Safe Checking using keyof and extends (Important)
- Map Types: Partial Type
  - Required Map Type
  - PickMapped Type
- Record Type
- Type Guard
- Instance of Type Guard
- User Defined Type Guard
- Literal Type Guard and the in operator
- Intersection types
- Discimniated Unio Types
- Interfaces vs Type Aliases
- Generic
- Function Overload
- Declaration files
- Augmenting modules
- Promise
- namespaces (how with Express is applicable (use-cases))

- type guards
- type aliases
- Recursive types
- Interfaces
- Parameter Type Annotations
- Union types
- Type Aliases & Extends
- Type Predicates
- Generics

- [ ] Duck Typing
- [ ] Type Assertion
- [ ] Type Alias
- [ ] Enums and It's cases
- [ ] Types & Interfaces
- [ ] never & void
- [ ] Union types and Tuples
- [ ] Class
- [ ] `this` and type checking
- [ ] Lexical Scoping and Arrow functions
- [ ] `typeof` and `keyof`
- [ ] Generics
- [ ] Asyncronous Javascript

### Duck Typing

### Type Assertion

what if we don't know the type: maybe it' assigned dynamically or not sure of the content type

- similar to *typecasting* in other languages, but in the other languages it actually affect the type value

- does not affect the value in js- just allow you to pass an unknown type as a string  into a parameter that only accept string

- Two syntaxes:
  
  - as keyword

    ```js
    const myVar = (req.query.param as unknown) as string;
    ```
  
  - angle bracket notation

    ```js
    const myVar = <string>(<unknown>req.params.param)
    ```

--------------------------

You can think of it as casting.

```js
type Pizza = { name: string, toppings: number };
const pizza: Pizza = { name: "Meska", toppings: 3 };
const serialized = JSON.stringify(pizza);
console.log(serialized);
function getNameFromJSON(obj: string) {
    return (<Pizza>JSON.parse(obj)).name; // or the new method r
    return (JSON.parse(obj) as Pizza).name
}
console.log(getNameFromJSON(serialized));
```

### Type Alias

Instead of attaching type directly to the variable when creating it, use a placeholder
Type alias is not going to be compiled down to vaniall js, it's a virtual [concept].

```js
type Size = 'small' | 'large' | 'medium';
type Callback = (size: Size) => void;
let selectedSize: Size = 'small';
let selectSize: Callback = (x) => {
    selectedSize = x;
}
selectSize("large")
```

<b> Type alisas</b>

does not create new types, just rename it

can be used with primitive type for documentation

`type Name = string;`

works with unions and tuples

   `type Input = string | number; type Coord = [number, number];`

we can use for Typing Objects, just like `interfaces` but once it's used it cannot be changed

- not open for new Fields

```ts
type Student = {
    name : string;
    age: number
}
```

- Extendable
  
  ```ts
  Type phD = Student & {
      field: string;
  }
  const stud: PhD = {name: 'Harvey', age: 42, field: 'clinical psychology'}
  ```

`Duck typing` is also avaiable here

### Enums and it's cases

By Default we get numeric values from enum and we can lookup using string lookup or numeric lookup, it works the two ways!
But this not always the case, we can customize enum to use anythin instead of numerics

```js
enum Sizes {
    Small,
    Large,
    Medium
}
console.log(Sizes.Small, Sizes[Sizes.Small]);
```

Enum follows `reverse_mapping` technique

```js
// reverse mapping in simple terms
let names = 'yousef,mahmoud,meska';
let arr = [];
let counter = 0;
names.split(',').map((item) => {
    arr[arr[item] = counter++] = String(item);
})

console.log(arr);
console.log(arr[0]);
console.log(arr['yousef']);
```

we can also *extend* enum

```js
enum Sizes {
    ExtendedLarge = 3
}
```

Using String Enums, we can't use #reverse_mapping

```js
enum Sizes {
    Small = 'small',
    Large = 'large'
}
let selectesSize: Sizes = Sizes.Large;
function updateSize(size: Sizes): void {
    selectedSize = size;
}
updateSize(Sizes.Small);
```

If we take a closer look at the compiled typescript file, we will see

```js
var Sizes;
(function(Sizes){
    Sizes["Small"] = "small";
    Sizes["Large"] = "large";
})(Sizes || (Sizes = {}));
let selectedSize = Sizes.Large;
function updateSize(size){
    selectedSize = size;
}
updateSize(Size.Small);
```

To avoid this generated code, we could use **inline enum members**
By adding *const* before enum declaration

```js
const enum Sizes {
    ...the code 
}
```

the generated js code will be

```js
let selectedSize = "large" /* Large */;
function updateSize(size) {
    selectedSize = size;
}
updateSize("small" /* Small */);
```

### Type & Interface

Interface is blue print for objects, it can be used to create function but this is not quite common seen

you can declare that interface a second time and add additional properties to it

- Prefered type for objects

- Extendable

- Open for adding new fields

- Use PascalCase for names

```js
interface Student{
    name: string,
    age: number;
enrolled: boolean
}
const stud2: Student {
    name: 'kara', age: 18, enrolled: false
}
```

=> What's difference type vs interface? and what's the perfect usage [when to use perfectly]?

Interface is a special type in typescript, allow us shape the structure of partivualr objectwe can get extended feature using interfaces over types. [will be discussed later]
Interfaces is virual also like type, it's not going to be compiled down
we can compose interfaces together, or extending [inheriting]

```ts
interface Pizza {
    name: string;
    sizes: string[];
    getAvaibleSizes(): string;
}
interface Pizzas{
    pizzas: Pizza[];
}
let pizza: Pizza;

type getAvaibleSizes = () => string[];
function createPizza(name: string, sizes: string[]): Pizza {
    return {
        name, 
        sizes,
        getAvaibleSizes(){
            return this.sizes;
        }
    } // or as Pizza
}
pizza = createPizza("Pepporin", ["small", "medium"])
```

**Dynamic Properties**
if we need to use a dynmaic property that does not exist on the interface like `person['xyz'] = 'some value'`,
what we can do is define this structure also on the interface

```ts
interface Size {
    
}
interface Pizza extends Size{
    name: string;
    getAvaibleSize(): string;
    [key: number]: string;
    [key: string]: any
}

let pizza: Pizza;
pizza[1] = 'yousef'
pizza['xyz'] = 'meska';

```

#### Extending Interface is Like Extending Classes

Extending interfaces is much like extending classes, and reduce more typing

```js
interface Undergrad extends Student {
    major : string
}
const stud: Undegrad ={
    name: "Kim",
    age: 18,
    enrolled: true,
    major: "chemisry"
}
```

Interfaces are based on `Duck Typing`

> if it walks like a duck and it quacks like a duck, then it must be a duck

- interfaces define the shape of an object using types

- an object that matches those types must be valid!

what does this mean if I have two interfaces having the same shape and passed one of those to a function that it's parameter accept one of them, they are both are gonna work

```js
function myFunc(person: Student): void => {
    console.log(person)
}

interface Student{
    name: string,
    id: number
}
const yousef: Student {
    name: "Yousef",
    id: 3434
}
myFunc(yousef) ;// will work
interface Teacher{
    name: string,
    id: number
}
const myTeacher: Teacher = {
    name :"Dr. Alex",
    id: 343
}
myFunc(myTeacher); //will work also
```

since myTeacher walks and quacks like the Student interface, it's duck or in this case a student

**Optional Properties**

Create by adding `?` after the property name - `propName?`

Allow you to include properties that are aviable but not requird

prevent use of properties that are not part of the interface

```js
interface Student{
    course?: string
} // we used the same interface we created before to add the optional property
const student2: Stuent{
    name: "sds", age: 23,
    enrolled: true, course: "math"
}
```

**readonly properties**

can be only modifed when first created

`readonly propName`

```js
interface Student{
    course?: string,
readonly id: number
}
const stud2: Student {
    name: "yfdf",
age: 13, enrolled: false, course: 'math', id: 3434
}
stud2.id = 3434 // throws readonly error
```

### never & void

`never` is used when we've a non-reachable code i.e (never going to return a value)

```js
function onError(error: string): never {
    throw new Error(error);
    // the rest is not reachable
}
```

`void` is perfectly used when the function does not return anything

```js
let x:number = 1;
function changeX(y: number): void{
    x =y;
}
changeX(2);
```

### Union types and Tuples

union type is way of telling typescript to choose one of serveral types

```js
let x: string = 'meska';

function mutateX(size: 'medium' | 'large' | 'small'): void {
    x = size;
}
mutateX('large');
```

#### what's tuples and specify a use case? does it differes from union types?

Tuples is an array-like data structure which give us the flexibility of creating array of different types,
it's useful when we're dealing with 3rd party apis or libs
it differes from union types, tuples specifiy types inside an array and we must conform to the order we've written, while union type give us the flexibity of optionality!

```js
let apiReturns: [string, number, boolean];
apiReturns = ['ypusef', 1, true];
```

### Class

**Access Modifiers**

access modifiers don't get compiled down to js, because it's only on typescript world<br>
access modifiers are applicable to methods and properties
`public`, `private`, `readonly`, `protected`

```ts
class Pizza {
    name: string;
    toppings: string[] = [];
    constructor(name: string){
        this.name = name;
    }
    public addTopping(topping: string){
        return this.toppings.push(topping);
    }
    private listToppings(){
        return this.toppings;
    }
}
let pizza = new Pizza("Meska");
pizza.addTopping("welcome");
```

if you don't specify `public` it will be the same.

For `private properties` we can do this

```ts
class Pizza {
    private toppings: string[] = [];
    constructor(private name: string, readonly age: number){};
    public addTopping(topping: string){
        return this.toppings.push(topping);
    }
    private listToppings(){P
    
        return this.toppings;
    }
}
```

**Setters and Getters**
Setters and Getters are always public.

```ts
class Sizes {
    constructor(public sizes: string[]){}
    set avSizes(sizes: string){
        this.sizes = sizes;
    }
    get avSizes(){
        return this.sizes;
    }
}
let sizes = new Sizes(['small', 'large']);
sizes.avSizes = ['sm', 'lg', 'xlg']; // invoke setter
console.log(sizes.avSizes); // invoke getter

```

In plain old js this was approached by

```js
var Sizes = (function(){
    function Sizes(sizes){
        this.sizes = sizes;
    }
    Object.defineProperty(Sizes.prototype, "avSize", {
        get: function(){
            return this.sizes;
        },
        set: function(sizes){
            this.sizes = sizes;
        },
        enumerable: true,
        configurable: true
        
    })
    return Sizes
})()
```

**Inheriting From Base Class**

```ts
class Sizes {
    constructor(public sizes: string[]) { }
    set availableSizes(sizes: string[]) {
        this.sizes = sizes;
    }
    get availableSizes() {
        return this.sizes;
    }
}

class Person extends Sizes {
    toppings: string[] = [];
    constructor(private name: string, public sizes: string[]) {
        super(sizes);
    }
    addTopping(topping: string) {
        this.toppings.push(topping);
    }
}

let y = new Person('yousef meska', ['x', 'l']);
console.log(y.availableSizes);
```

well, altought this approach is working, but one thing is not fully controlled
we still can instantiate from Sizes class, and we don't need this behaviour

```ts
new Size(['small', 'large']);
```

the solution is
**Abstract Class**
A class we can inherit from, and cannot instantiate from.

```ts
abstract class ClassName{}
```

what if we need to access sizes to update it from Person class, if sizes was private on Sizes class?
`protected` comes into play, the ability to access private member when we extend a class

```ts
class Sizes {
    constructor(protected sizes: string[]){}
}
```

**Interface with Classes**
we can't create specific describtion for setters and getters, but the function itself can be, we can just describe that those properties are avaiable.

```ts
interface SizesInterface{
    size: string[]; // this would generate an error, since size is protected member
    availableSi zes: string[]; // the correct way
    availableSizes(): string[]; // this would generate an error
}
```

🔺a quick note:
if you've a `protected` or `private` member on your class, you can't add it on interface, you can use `readonly`

```ts
abstract class Sizes implements SizesInterface{

}

```

We've extended class Pizza from Sizes, so some of the properties on Pizza Comes from Sizes, so we can extend interface too

```ts
interface PizzaInterface extends SizesInterface{
    readonly name :string; // removing 'readonly' key word will not affec anything, but for type safey it's there
    topping: string[];
    updateSize(sizes: string[]): void;
    addTopping(topping: string): void;
}
```

**Static Properties and Methods**

```js
class Coupon {
    static allowed = ['xff454', '54fgf'];
    static create(precentage: number): string{
        return `PIZZA_COUPON_${precentage}`
    }
}
```

**Combining it all together**

```js
interface SizesInterface {
    availableSizes: string[];
}
abstract class Sizes implements SizesInterface {
    constructor(protected sizes: string[]) { }
    set availableSizes(sizes: string[]) {
        this.sizes = sizes;
    }
    get availableSizes() {
        return this.sizes;
    }
}

interface PizzaInterface extends SizesInterface {
    readonly name: string;
    updateSizes(size: string[]): void;
    addTopping(topping: string): void;
}

class Pizza extends Sizes implements PizzaInterface {
    toppings: string[] = [];
    constructor(readonly name: string, sizes: string[]) {
        super(sizes);
    }
    addTopping(topping: string) {
        this.toppings.push(topping);
    }
    updateSizes(sizes: string[]) {
        this.sizes = sizes;
    }
}

let y = new Pizza('yousef meska', ['x', 'l']);
console.log(`first ${y.availableSizes}`);
y.updateSizes(['hghg', 'hghg'])
console.log(`second ${y.availableSizes}`); // still 'x', 'l'
```

### Generics

a way to create a dynamic type
**Generic**: a way to write a function that is reusable across different types

you can think of *Generics* as an `any` type, but a more defined and strict one.

we can define the value at the point of call
so we don't care about hard coding a particular type

```js
let arr: number[] is shorthand for let arr: Array<number> generic
```

```ts
class Pizza {
    constructor(private name: string, private price: number) {

    }
}
class Coupon {
    constructor(private price: number) {

    }
}
class List<T> { // passing the dynamic type down to the class
    public list: T[] = []; 
    addItem(item: T): void {
        this.list.push(item);
    }
    getList(): T[] {

        return this.list;
    }
}
const list = new List<Pizza>(); // here out list is a list of Pizzas only
for (let i = 0; i < 10; i++) {
    list.addItem(new Pizza(`mesk_${i + 1}`, i + 1))
}
list.addItem(new Pizza("meska", 14)); // right
list.addItem({ coupon: 'pizza25' }) // error
list.addItem(new Coupon(13)); // error

const pizzas = list.getList();
console.log(pizzas)

const anotherList = new List<Coupon>(); 
anotherList.addItem(new Coupon("Pizzas25")) // right
anotherList.addItem(new Pizza("name", 24)); // error
```

To Demonstrate the benfit from using `generics` we are going to introduct `function overloading`

#### Function Overloading

We benefit from function overloading when it comes to create a utility functions that typically return a different data structure based on the argument you supplied

> we are providing different implementation to the same utility functions. and we ge the benefit from using a generic type

```js
/* 
* Declaring the different type the function will return as function overloading
*/
function reverse(str: string): string;
// function reverse(arr: any[]): any[];
function reverse<T>(arr: T[]): T[];

/**
 * @desc the actual body
 * @param stringOrArray 
 * @returns 
 */
function reverse(stringOrArray: string | any[]): string | any[] {
    if (typeof stringOrArray === "string") {
        return stringOrArray.split(" ").reverse().join();
    }
    return stringOrArray.slice().reverse(); // to avoid mututing using reverse() only
}

// Arrays and objects are passed by reference, to avoid mutating the original one, choose the methods 
// which are mututing
reverse("yousf");
reverse(["yousef", "ahmed", "abdo"]);
```

### this and type checking

```js
const elem = document.querySelector(".click");

// event is still the first element.
function handleClick(this: HTMLAnchorElement, event: Event) {
    event.preventDefault()
    console.log(this);
    console.log(this.href)
}

elem?.addEventListener('click', handleClick, false);

```

### Lexical Scoping and Arrow functions

```js
class MyClass {
    myMethod() {
        const foo = 123;
        const that = this;
        console.log('1', this);
        setTimeout(function () {
            console.log('2', this);
            console.log('3', that)
        }, 2000)

        setTimeout(() => {
            console.log('4', this);
        }, 3000)
    }
}
const instance = new MyClass();
instance.myMethod();
```

### typeof & keyof

#### typeof

helpful when using third-party libraries

```js
    console.log(typeof myFunc(param))
```

`null` and `Promise` will return as `object` type

**type query using typeof**

```js
const person = {
    name: 'yousef',
    age: 22
}

// getting the the type of person which is {name: string; age: number;}
type Person = typeof person;
const anotherPerson: Person = {
    name: 'john',
    age: 30
}
const anotherPersonn: typeof person = {
    name: 'xx',
    age: 22
}

// Javascript
typeof person // 'object'
```

#### keyof

```Js
let person = {
    name: "Yousef",
    age: 24
}

type Person = typeof person;
type PersonKeys = keyof Person;
type PersonTypes = Person[PersonKeys];

function getProperty(){
    
}
```

### Asyncronous Typescript

- async/await always return a promise

- use **Promise<type>** to set the type returned

```js
const myFunc = async(): Promise<void> => {
    const result = await asyncFunc();
    console.log(result);
}
```

### Resources

After finishing, read REST API with Typescript from Toptal [and apply for TopTal].

### CRAP

#### Typescript Classes

just like js classes, but with two differences

1. constructor variable are defined outside

2. introduces access modifiers

```js
class Teacher {
    garde: number;
    constructor(grade: number){
    this.grade = grade;
}
}
```

**Access Modifiers**

on js, we use `setters and getters` to restrict access to variables

on ts, we use `private` and `protected`

on other languages like c#, c++, java, variables valuea are truly private when using acess modifiers

on ts or js, properties' values cannot be accessed but can be viewed

`number` on classes are public by default, but we can mark them explicitly

`private` members cannot be accessed outside the class

`protected` members can be accessed from the parent or child class

```ts
class Student{
    protected studentGrade: number;
    private studentId: number;
public constructor(grade: number, id: number){
    this.studentGrade = grade;
    this.studentId = studentId;
}
id(){
    return this.studentId;
}
}
class Graduate extends Student {
    studentMajor: string
    public constructor(grade: number, id: number, major: string){
    super(grade, id);
    this.studentId = id; // Typescript error, private member can only be accessed from the parent class
    this.studentGrade = grade; //accessible because grade is protteced
    this.studentMajor = major;
}

}
const myStudent = new Gradudate(3, 1234, 'computer science');
console.log(myStudent.id()); //1234
myStudent.studentId = 1235; //Typescript error
console.log(myStudent.id()); //1235 ? wat???? remember not actually private xD
```

**Factory function**

- used in js to return new objects

- in ts create an interface and use the interface as the return type

```ts
interface Student{
    name: string;
    age: number;
    greet(): void;
}
const studentFactory= (name: string, age: number: Student) => {
    const greet = (): void => console.log("hello");
return {name, age, greet};
}
const student1 = studentFactory("Hana", 16);
```

**Generics and async typescript**

- generics are component (reusable) that you might use couple of times on your application **but with different types**

- this allow us to use **generic types as parameters**

- used angle bracket syntax <T> where the T is the type parameter

let's say we have to create a function that returns a second item on the array, it might be string, or number

```js
const getItemString = (arr: string[]): string => {
    return arr[1];
}
const getItemNum = (arr: number[]): number => {
    return arr[1];
}
const getItem = (arr: string[] | number[]): number | string => {
    return arr[1];
}
```

it's obvious we wrote a hell lot of code to this simple task, but we can optimize it using `Generics`

```ts
const getItemString = <T>(arr: T[]): T => {
    return arr[1];
}
getItem(['cat', 'dog']); // 'dog';
getItem([5, 6]); // 6
// If we need to ensure our function will return a number
getItem<number>([5,6])
```

**Integrating Typescript with third-party libs**

@types/dependency-name Or

```ts
// dropRight in use 
// dropRight takes in an array and then the amount of numbers to drop as arguments
console.log(_.dropRight([1, 2, 3, 4, 5], 2));
console.log(_.dropRight(['cat', 'dog', 'rabbit', 'horse'], 1));

// dropRight type definition
dropRight<T>(array: List<T> | null | undefined, n?: number): T[];
```

sometimes there are packages that comes with no type definitions, and to reduce erorrs you should explicitly define it

```bash
mkdir types 
cd types & mkdir 3rdparty
touch index.d.ts
```

but inside tsconfig.json, uncomment "typeRoots": ["./types"]

**Dos and Don'ts with typescript**

Typescript configuration best practice

- it's always best practice to use `noImplicitAny`

- set `strict` to `true`

when to use Implicit typing?

- when using const, because the value is immutable, so the type won't change

- single line arrow function

- function with controlled input

when to use explicit?

- long function

- let

**Migrating to Typescript**

1. look at the project structure (Monolith or Microervices)

2. Decide whether to migrate all at once or file-by-file

in case of monolith:

- Migrate to `src/dist` architecture to keep woeking folders seperate from compiled javsacript

- use configuration file tp exclude folders that shoulld not be migrated

- don't forget to add type definition for third party libs

- set `allowJs` to true, this allows for compiling js extenstion also

-------------------------------

```bash
tsc --outDir dist
tsc --watch
```

why favor using webpack over tsc directly?

lesson 5 -> problem with running webpack-dev-server

it's common that most programmers document parameters

```js
/**
 * @param {number} num - the number to convert to string
 * @returns {string} `num`, converted to string
 */
function toString(num: number): string{
    return String(num);
}
```

Babel compile js => js
Typescript compiles ts => js

Don't overdo generics and type variables for more simplicitly

/*Enum: data type*/
Enum uses reverse mapping!
by default we get numeric values from enum
we can use the numerical lookup to get the string value
or use the string lookup to get the numeric value
let's say we have an enum

```ts
enum Sizes = {
    Small, 
    Medium,
    Large
}
console.log(Sizes.Small, Sizes[Sizes.Small]); //reverse mapping
```

what if we need to extend this enum later on without returning to the original one?
we can redeclare it but, one important thing, you need to specifify an index because you are not starting from zero anymore

```ts
enum Sizes = {
    ExtraLarge = 3;
}
const selectedSize = 3;
console.log(Sizes[selectedSize]);
```

we've talked the default [using numeric enum] now we are going to use string enum
but there is no reverse mapping here!

```ts
enum Sizes {
  Small = 'small',
  Large = 'large'
}

let selected: Sizes = Sizes.Small;
console.log(selected)
function updateSize(size: Sizes){
  selected = size;
}
updateSize(Sizes.Large);
console.log(selected);
```

we can use inline member to reduce code generated by the compiler when using enum  just by adding const before the enum

```ts
const enum Size {

}
```
