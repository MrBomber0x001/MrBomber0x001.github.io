---
layout: post
title: Fuck you typescript
subtitle: 
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [js, oop]
---

## From udacity

<https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html>  
[Performance · microsoft/TypeScript Wiki · GitHub](https://github.com/microsoft/TypeScript/wiki/Performance)  
[Strategies for migrating to TypeScript](https://2ality.com/2020/04/migrating-to-typescript.html)

## Typescript

Typescript helps us clarify our intentions.

Typescript is *compiled* language, the real benefit of using compiled language, you know the error while typing the programs

Typescript is not used on the production stage.

<strong>Transpile</strong>: Convert a language to a similarly abstracted language ex: ES6 to ES6

for further reading and deep diving into typescript

- Tackling Typescript

- Ultimatecourses [beginner and advanced one]

Appyling types :

- variable

- function parameter

- function return

- object values [ array, classes]

Typescript is not needed for all cases, sometimes it's better not to use it if you have:

- Test-Driven Development

- Frequent code reviews

- Thorough documentation

- Well-configured IDE

### configurig Typescript

read more about npx  [npm documentation](https://docs.npmjs.com/cli/v7/commands/npx).

```bash
npm install ts-node @types/node
```

```json
"scripts":{
    "build": "npx tsc"
}
```

you have `tsconfig.json` also can be named `jsconfig.json` to install it, the file tell how strict typescript will be

```bash
npx tsc --init
```

you should check your output directory can be named `dist`, `build`, `prod` and `server`

#### importing and exporting

```js
import 'name' from 'module';
import {func1, func2} from 'module';


export const myFunction = () => {};
export default object;
export default {object1, object2}
```

inside tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",   // what version of js TS will be transpiled to                        
    "module": "commonjs",  // module system to be used                    
    "lib": ["ES2018", "DOM"], // What libraries your code is using, DOM API and ES2018
    "outDir": "./build",                        
    "strict": true,                           
    "noImplicitAny": true,                 
  },
  "exclude": ["node_modules", "tests"]
}
```

```js
npm run build
```

![](/home/yousef/Documents/typescript-migration-strategies.png)

### Typescript Basics

[TypeScript vs. JavaScript: Your Go-to Guide | Toptal](https://www.toptal.com/typescript/typescript-vs-javascript-guide)

Typescript has two typing mechanisms:

1. Implict typing : let typescript assume the type

2. explicit typing: we add the type to the parameter

- number

- string

- boolean

> it's best practice to use implicit typing whenthe app is self-contained or variables are immutable
>
> `self-contained`: does not depend on other application or APIS, receives data from no external sources

```js
let myNumbr:number;
myNumber = '5';
const squared = (num: number): number => {
    return num * num;
}
```

`union` types

- used when data could be more than one type

- often used with `null` and `undefined` subtypes

`null`: a variable is not declared yet

`undefined`: a variables is declared but not defined

```js
let myVar: (number | string);
const myFunc = (param: number | undefined) => {
    if(param === undefined){
    // do somethingt
}
}
const getCaptial = (str: string): string[] | null =>{
    const capitals = str.match(/A-Z/);
    return capitals
}
console.log(getCapitals("something"));
// returns null
console.log(getCapitals("SomethinG"));
// returns ['S', 'G'];
```

is is reasonable, while it's true by the way?

```js
let myNum: null = null;
let myNumb2: undefined = undefined;
```

No, it's not, because instead of defining variable with `null` I could've not declared it from the beginining

for `undefined` I could let typescript decide 'implicitly'.

`void`

- typically a `return` type

- used when function does not have a `return` statement

```js
function sayMyName(name: string): void => {
    console.log(name);
}
```

`never`

- always a `return` type

- used when function can't return

`never` has two main cases

1. functions that throws error

   ```js
   function throwError = (message: string): never =>{
       throw new Error(message)
   }
   ```

2. functions with endless loop

   ```js
   const neverEndingLoop = (): never => {
       while(true){
   
   }
   }
   ```

`any` and `unknown`

- used when you are unsure about the type

- *any* can be any type

- *unknown* when the type is now knowable ahead of time

> it's dangerous to use `any` to make errors go away, it's equiavlent to not using types at all
>
> `noImplicitAny` disables the use of any
>
> so use `unknown` instead because it's considered more type safe, it's used heavily for type assertion

```js
let myVal1: any = 'cat';
let myVal2: unknown = 'dog';
let myVal3 : string = 'mouse';

const myFunc = (val: string) => {}; // will accept 1 and 3
const myFunc = (val: any) => {}; // will accept all variables
```

#### Type assertion

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

#### Type Checking with typeof

- helpful when using third-party libraries

- Example
  
  - ```js
    console.log(typeof myFunc(param))
    ```
  
  - `null` and `Promise` will return as `object` type

#### Object-Like Types

##### array

```js
let arr : string[] = ["yousef", "meska"];
let arr2: (string | number)[] = [1,2, "yousef"];
```

##### Tuples

Tuples are specific to typescript only, use tuples when the length is known and you allow for typinf of specific elements in an array

```js
let arr: [string, number, string, string] = ['ousef', 4,' dof', 'sdfdf']
```

##### Enum

not also related to js, but typescript only

used for a set of predefined values

it can be <strong>mimicked</strong> using Object.freeze

it's best practice to use PascalCase for both variable name and value

```js
const compass = {
    points: [North, South, East, West]
}
Object.freeze(myObj)
```

```js
Enum Compass = {North, South, East, West};
const move = {dist: number, direction: Compass} => {
    return `walk ${dist} paces ${direction}`
}
```

#### Objects

translating js object directly into typescript is diffuclt to read and not extendable  

```js
const student = {
 name: 'yousef',
age: 22,
faculty: "Engineering"   
}
student.name = 'omar';
student.course = "math"; // changing or extendin is normal 

const student1: = {name: string, age: number, faculty: string} = {
    name: 'yousef',
age: 22,
faculty: "engineering"
}
student1.name = 'omar'; //true
student1.course = 'math'; //will fail
```

so it's better to use `Interfaces` or `Type Aliases`

### Interfaces

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

#### Extending Interface is Like Extending Classes

extending interfaces is much like extending classes, and reduce more typing

```js
interfce Underfrad extends Student {
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

<b>Optiona Properties</b>

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

<b>readonly properties</b>

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

<b>Access Modifiers</b>

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

<b>Asyncronous Typescript</b>

- async/await always return a promise

- use **Promise<type>** to set the type returned

```js
const myFunc = async(): Promise<void> => {
    const result = await asyncFunc();
    console.log(result);
}
```

Generic: a way to write a function that is reusable across different types

let arr: number[] is shorthand for let arr: Array<number> generic

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

/*Type Assertion*/

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

/*Interfaces: another type of typescript*/
Interfaces is more prefered when invovling complex data structures
we can combine interfaces together

```ts
type Pizza = {
  name: string;
  sizes: string[]
}
let pizza: Pizza;
function createPizza(name: string, sizes: string[]): Pizza{
  return {
    name,
    sizes
  }
}
pizza = createPizza('Pepporni', ['small', 'large']);
interface Person{
  name: string;
  age: number;
  militaryStatus: boolean
}

let person: Person = {
  name: 'yousef',
  age: 24,
  militaryStatus: true
};
function updatePerson(name: string, age: number): Person{
  person.name = name;
  person.age = age;
  return person;
}
console.log(updatePerson('omar', 19));
// Combining Interfaces Together 
interface Persons {
  data: Person[]
}
```
