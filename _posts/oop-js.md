---
layout: post
title: The Hitchhiker's Guide to OOP in Javascript
subtitle: Lean OOP programming concepts and patterns in Javascript
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [js, oop]
---

## Table of Contents

topics from [javscript oop course, and js oop book] ==> turn into series of blog articles

Objects:
-Object literals
-Factories
-constructors
-Constructor property
-functions are objects
-Value vs refernce types
-Adding or removing properties
-Enumerating proprties
-Abstraction
-Private Properties and methods
-Getters and setters
-Task: Stop watch

prototypes:
-inheritance
-Prototypes and prototypical inheritance
-Mutli level inheritance
-Property Descriptor
-Constructor Prototypes
-Prototypes v instance members
-iterating instance and Prototypes
-Avoid Extending the built-in object methods
Task:

prototypcial inheritance:
creating your own prototypical inheritance
-Resetting the constructor
-calling the super constructor
-intermediate function inheritance
-Methods Overriding
-Polymorphism
-when to use inheritance
-Mixins
Exerecise:
ES6 classes:

Es6 modules

Book:
1-Primitive vs refernce types
2-functions
3-understanding objects
4-constructor and prototypes
5-inheritance
6-Object patterns

Resources:

-V8 internals

-Exectution context and Scope chain

-Asynchonisty in Js

Event Queue and call stack

Resources :

## Classes

```js
class Circle {
  constructor(radius) {
    this.radius = radius;
    this.move = function () {
      //code
      //here are not on the prototype, instead they are on the own properties
    };
  }
  //Instance method
  draw() { 
    //code
    //methods are on the prototype
  }
  //Static method
  static parse(str){
      const radius = JSON.parse(str).radius;
      return new Circle(radius);
  }
}


//Class Declaration 
class Circle {

}
//unlike functions, class [Declarations, Expressions] are not hoisted
//Class Expression
const Square = class {

}

const circle = new Circle.parse('{"radius: 1"}');
console.log(circle);



class Circle {
  constructor(radius){
    this.radius = radius;
    this.move = function(){
      console.log('move')
    }
  }

    draw(){
      console.log('draw');
    }
  static parse(str){
    const radius = JSON.parse(str).radius;
    return new Circle(radius);
  }
  
}
const c1 = new Circle();
c1.draw();
c1.move();
console.log(c1);
console.log(typeof Circle);
const c2 = Circle.parse('{"radius": 1}');
console.log(c2)


//this 
const Square = function(){
  this.draw = function(){
    console.log(this);
  }
}
const sq = new Square();
//notice this behaviour 
//Method call
sq.draw();
//notice also this behaviour 
const draw = sq.draw;
//function call, here 'this' will point to the global object 
//so it ppreferable to use 'use strict' mode to make sure that 'this' will return undefined instead of invoking to the global window
//draw(); //window object 


//by Default, the body of class is excuting on 'strict' mode, to prevent you from modifying the global this accidently 


//private memebers using Symbol


function random(){
  return Math.random().toString(36).slice(-5)
}
const name = 'yousef';
const obj = {
  name,
  [random()]: true
}

console.log(obj);
console.log('----------------------');
const _radius = Symbol();
const _draw = Symbol();
console.log(_radius);
class Triangle {
  constructor(radius){
    this[_radius] = radius;
  }
  [_draw](){
    return 3;
  }
}
const tr = new Triangle(2);
console.log(tr)
console.log(tr._radius);
const key = Object.getOwnPropertySymbols(tr);
console.log(tr[key[0]]);
console.log(key);
console.log('-------------------------------');
//Full private members using WeakMap()

const _diameter = new WeakMap();
const _move = new WeakMap();
const privateProps = new WeakMap();
class Hexa{
  constructor(radius){
    _diameter.set(this, radius);
    //this._diameter = radius ==> under the hood
    // _move.set(this, function(){
    //   console.log('move');
    //   console.log(this); //undefined
    // })
    _move.set(this, _ => {console.log(this)}); //object instance
    //we can define multiple properties instead of individually define it 
    privateProps.set(this, {
      radius: radius,
      start: _ => {
        console.log('starting....');
      }
    });
    //to access 
    privateProp.get(this).radius;
    provateProp.get(this).start()
  }
  
  draw(){
    console.log(_diameter.get(this)); //=> will return the value of this property
    _move.get(this)()
  }
}
const hex = new Hexa(2);
console.log(hex.draw());


//Getters and Setters: in ES6 instead of doing Object.defineProperty(this, 'prop', {get: function(){}}) and so on, we have the set and get keyword that so the same functionalit but simpler , I am gonna copy the code above and try to implement the setter and getter

class Sphinex{
  constructor(radius){
    _diameter.set(this, radius);
    //this._diameter = radius ==> under the hood
    // _move.set(this, function(){
    //   console.log('move');
    //   console.log(this); //undefined
    // })
    _move.set(this, _ => {console.log(this)}); //object instance
    //we can define multiple properties instead of individually define it 
    privateProps.set(this, {
      radius: radius,
      start: _ => {
        console.log('starting....');
      }
    });
    //to access 
    privateProp.get(this).radius;
    provateProp.get(this).start()
  }
  //I am gonna comment out draw that give us access to private properties, and implement get
  /*draw(){
    console.log(_diameter.get(this)); //=> will return the value of this property
    _move.get(this)()
  }*/
  get radius(){
    return _diameter.get(this);
  }
  set radius(value){
    if(value <= 0) throw new Error('invalid radius');
    _diameter.set(this, value);
  }
}
const sp = new Sphinex(2);
console.log(sp.draw());



console.log('-------------------Inheritance------------------');

class Shape{
  constructor(color){
    this.color = color;
  }
  move(){
    console.log('move')
  }
}

class Circle extends Shape{
  constructor(color, radius){
    super(color);
    this.radius = radius;
  }
  draw(){
    console.log('draw');
  }
}

console.log('-------------------Method Overriding------------');
class Shape{
  constructor(color){
    this.color = color;
  }
  move(){
    console.log('move')
  }
}

class Circle extends Shape{
  constructor(color, radius){
    super(color);
    this.radius = radius;
  }
  draw(){
    console.log('draw');
  }
  move(){
    super.move();
    console.log('move circle')
  }
}


```

## Constructor and Prototype

```js
/* Beginning of chapter 4: constructors and prototypes */
function Person(){
    
}
let person1 = new Person;
//you can check the type of an instance using the constructor property, 
//Every object instance is automatically created with constructor property that contains a reference to the constructor function created it
//for generic object(objects created by literal form or Object constructor), the constructor property is set to Object
//for objects created with custom constructor, a construcor prop points back to the constructor function createed it 

console.log(person1.constructor === Person); //true
let person2 = {
    name: 'yousef', 
    age: 21
}
console.log(person2.constructor);
function Person(name){
  // this.name = name;
  // this.sayName = function(){
  //   console.log(this.name);
  // }
  Object.defineProperty(this, "name", {
    get: function(){
      return name;
    },
    set: function(newName){
      name = newName;
    },
    enumerable: true,
    configurable: true
  });
  this.sayName = function(){
    console.log(this.name);
  }
}
let person = new Person('omar');
person.sayName();
console.log(person.constructor);
/*you are still advised to use instanceof to check the type of an
instance. This is because the constructor property can be overwritten and
therefore may not be completely accurate.*/

//what if we instantiate the object from a function constructor without a new keyword
let person3 = Person('meska');
console.log(person3 instanceof Person); //false
console.log(typeof person3); //undefined
console.log(name); //meska
/*the value of this
inside of the constructor is equal to the global this object. The variable
person1 doesn’t contain a value because the Person constructor relies on
new to supply a return value. Without new, Person is just a function without
a return statement. The assignment to this.name actually creates a global variable called name*/


/* Prototypes */
//contructor allow you to configure object instances with the same properties, but constructors alone doesn't eleminate code redundancy
/*In the example code thus far, each instance has had its own sayName()
method even though sayName() doesn’t change. That means if you have
100 instances of an object, then there are 100 copies of a function that
do the exact same thing, just with different data.
It would be much more efficient if all of the instances shared one
method, and then that method could use this.name to retrieve the appropriate
data. This is where prototypes come in.*/
//identifying the prototype property 
function hasPrototypeProperty(object, name){
  return name in object && !object.hasOwnProperty(name);
}

let person = {};
var prototype = Object.getPrototypeOf(person);
console.log(prototype == Object.prototype);

console.log(Object.prototype.isPrototypeOf(person));
//shadowing 
console.log(person.toString());
person.toString = function(){
  return '[object Custom]'
}
console.log(person.toString());
delete person.toString;
console.log(person.toString());
delete person.toString;

//using  prototypes with constructor
function Person(name){
  this.name = name;
}

Person.prototype.sayName = function(){
  console.log(`hello, ${this.name}`);
}
let person1 = new Person('yousef');
let person2 = new Person('meska');
person1.sayName();

//of course you can add any data type you want as a prototype property, but be carreful when you are dealing with reference type, because one instance can change another instance behaviour, like 
Person.prototype.fruits = []; //Array: reference type
person1.fruits.push('pizza');
console.log(person1.fruits); //['pizza'];
person2.fruits.push('apple');
console.log(person1.fruits); //[ 'pizza', 'apple' ]

//instead of adding one property after another on the prototype, it would be easier to add the properties as an object 
Person.prototype = {
  sayName: function(){
    console.log(this.name);
  },
  toString: function(){
    return `[Person ${this.name} ]`;
  }
}
//altought this code eleminate the need to type Person.prototype, however, there is one side effect to be aware of 
let person4 = new Person('Ali');
console.log(person4 instanceof Person); //true
console.log(person4.constructor === Person); //false
console.log(person4.constructor === Object); //true
//but, why?


//ths solution is to put the constructor inside the prototype 
Person.prototype = {
  constructor: Person,
  sayName: function(){
    ///
  }, 
  toString: function(){
    
  }
}
let person5 = new Person('osama');
console.log(person5.constructor == Person);


//Changing prototypes: 

var person6 = new Person("Nicholas");
var person7 = new Person("Greg");
Object.freeze(person6);
Person.prototype.sayHi = function() {
console.log("Hi");
};
person6.sayHi(); // outputs "Hi"
person7.sayHi(); // outputs "Hi"

//Built-in Object prototype:All built-in objects have constructors, and therefore, they have prototypes that you can change

Array.prototype.sum = function(){
  return this.reduce(function(prev, next){
    return prev + next;
  })
}
var number = [1,2,3,4,5];
var result = number.sum();
console.log(result);

String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.substring(1);
}
let name = 'yousef meska';
let resultt = name.capitalize();
console.log(resultt)



let person = {name: 'yousef'};
let objectBase = Object.getPrototypeOf(person);
let propertyDescriptor = Object.getOwnPropertyDescriptor(objectBase, "toString");


function Circle(){
  this.move = function(){
    this.draw(); //from the prototype
    console.log('move');
  }
}
Circle.prototype.draw = function(){
  console.log('draw');
}
let circle = new Circle();
circle.move(); //draw, move 

//Object.keys only return instance[own] members 
console.log(Object.keys(circle)); //move only

//for in loop returns all the instance[own] and prototype members 

//constructor resetting after prototypcial inheritance 

function Shape(color){
  this.color = color;
}
Shape.prototype.duplicate = function(){
  console.log('duplicate');
}
//Circle.prototype.constructor(1) === new Circle(1)
Circle.prototype = Object.create(Shape.prototype);
//Circle.prototype.constructor(1) === new Shape(1);
//the fix:
Circle.prototype.constructor = Circle;

//Calling the super constructor
function Circle(rdius){
  Shape.call(this, color);
  this.radius = radius;
}


//instead of manually do the prototypical inheritance every time we need to, we can make a function to automate this
//this is called intermediate function inhertia
function extend(Child, Parent){
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

function Square(){

}
extend(Square, Shape);

//Method overriding:

Circle.prototype.duplicate = function(){
  //calling the duplicate of Shape 
  Shape.prototype.duplicate.call(this);
  console.log('duplicate circle')
}


//Polymorphism: many form 
const shapes = [
  new Circle(),
  new Square()
];

for(let shape of shapes)
  shape.duplicate();



  //Mixinis 

  function mixin(target, ...sources){
    Object.assign(target, ...sources);
  }
  const canEat = {
    eat: function(){
      this.hunger--;
      console.log('eating')
    }
  };
  const canWalk = {
    walk: function(){
      console.log('walking')
    }
  };
  
  const canSwim = {
    swim: function(){
      console.log('swim');
    }
  }
  function Person (){

  }
//Object.assign(); //copy from object to object
//Object.assign({}, canEat, canWalk)
//Object.assign(Person.prototype, canEat, canWalk);
mixin(Person.prototype, canEat, canWalk);
const person = new Person();
console.log(person);
function Goldfish(){

}
//Object.assign(Goldfish.prototype, canEat, canSwim);
mixin.assign(Goldfish.prototype, canEat, canSwim);
const goldfish = new Goldfish();
console.log(goldfish);
```

## Inheritance

```js
//object inheritance
let book = {
  title: "The Javascript oop concepts",
};
//is the same as
var bookk = Object.create(Object.prototype, {
  title: {
    configurable: true,
    enumerable: true,
    value: "The Javascript oop concepts",
    writable: true,
  },
});

let person1 = {
  name: "yousef",
  sayName: function () {
    console.log(this.name);
  },
};
let person2 = Object.create(person1, {
  name: {
    configurable: true,
    enumerable: true,
    value: "ahmed",
    writable: true,
  },
});
person1.sayName();
person2.sayName();
console.log(person1.hasOwnProperty("sayName")); //true
console.log(person1.isPrototypeOf(person2)); //true
console.log(person2.hasOwnProperty("sayName")); //false

//create a prototypless object
let nakedObject = Object.create(null); //[[prototype]] = null

//Constructor inhertiance

//You write this
function YourConstructor() {
  //your code
}
//Javscript enginer does this for you behind the scenes
YourConstructor.prototype = Object.create(Object.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: YourConstructor,
  },
});
//meaning that any instance of YourConstrcuctor also inherit Object.prototype
//YourConstructor is 'subtype' of Object, and Object is 'supertype' of YourConstructor
/*Because the prototype property is writable, you can change the prototype
  chain by overwriting it. Consider the following example*/
function Rectangle(width, length) {
  this.width = width;
  this.length = length;
}
Rectangle.prototype.getArea = function () {
  return this.width * this.length;
};
function Square(size) {
  this.length = size;
  this.width = size;
}
Square.prototype = Rectangle.prototype; //or new Rectangle();
Square.prototype.constrcutor = Square;
let rect = new Rectangle(5, 6);
let square = new Square(6);
console.log(rect.getArea());
console.log(square.getArea());
console.log(rect instanceof Rectangle); // true
console.log(rect instanceof Object); // true
console.log(square instanceof Square); // true
console.log(square instanceof Rectangle); // true
console.log(square instanceof Object); // true

//we could simplify the code above using Object.create(), I will instantiate another constructor called Square1
function Square(size) {
  this.length = size;
  this.width = size;
}
Square.prototype = Object.create(Rectangle.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: Square,
  },
});

/*Always make sure that you overwrite the prototype before adding properties to it,
  or you will lose the added methods when the overwrite happens.*/

//abstraction: hide the details and expose only the essentials
function Circle(radius) {
  this.radius = radius;
  let defaultLocations = { x: 1, y: 2 };
  // this.getDefaultLocation = function(){
  //   return defaultLocations
  // } old way , the better approah is to use Object.defineProperties
  Object.defineProperty(this, "defaultLocation", {
    get: function () {
      return defaultLocations;
    },
    set: function (value) {
      if (!value.x || !value.y) {
        throw new Error("Invalid locations");
      }
      defaultLocations = value;
    },
  });

  /*this.computeOptimalLocation = function(){
      //some code here
      //here computerOptimalLocation is accessible from outside and we need to prevent this behaviour
      //the solution is to make it a function insde Circle, not a method of an instance, so we can't reach it from outside 

    };*/
  function computeOptimalLocation(factor) {
    //some code
  }
  this.draw = function () {
    //closure determine what variable will be accessbile from inner functions
    computeOptimalLocation(0.1);
    console.log("draw");
  };
}
const circle = new Circle(2);
circle.getDefaultLocation();

/*Constructor stealing:You simply call the supertype constructor
from the subtype constructor using either call() or apply() to
pass in the newly created object*/

function Rectangle(length, width) {
  this.length = length;
  this.width = width;
}
Rectangle.prototype.getArea = function () {
  return this.length * this.width;
};
function Square(size) {
  Rectangle.call(this, size, size);
}
Square.prototype = Object.create(Rectangle.prototype, {
  constructor: {
    writable: true,
    enumerable: true,
    configurable: true,
    value: Square,
  },
});
let square = new Square(6);
console.log(square.getArea());
//this approach called pseudoclassical inheritance

// but you cannot inherit own properties using prototypes.
// To inherit own properties correctly, you can use constructor stealing,
// which is simply calling a constructor function using call() or apply() so
// that any initialization is done on the subtype object
//Accessing SuperType methods
function Rectangle(length, width) {
  this.length = length;
  this.width = width;
}
Rectangle.prototype.getArea = function () {
  return this.length * this.width;
};

function Square(size) {
  Rectangle.call(this, size, size);
}
Square.protototype = Object.create(Rectangle.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: Square,
  },
});
//call the supertype method
Square.prototype.toString = function () {
  let text = Rectangle.prototype.toString.call(this);
  return text.replace("Rectangle", "Square");
};

```

## Object Patterns

```js
/* The module pattern: creational pattern designed to create singletion object with priviledged data,
Approach: is to use IIFE that returns an object
  priviledged methods: method that access privileged data
  You accomplish this by
creating closure functions as object methods
*/

let person = (function () {
  //private data variable
  let age = 25;
  return {
    //public methods and properties
    name: "yousef",
    getAge: function () {
      return age;
    },
    growOlder: function () {
      age++;
    },
  };
})();

console.log(person.name); // "Nicholas"
console.log(person.getAge()); // 25
person.age = 100;
console.log(person.getAge()); // 25
person.growOlder();
console.log(person.getAge()); // 26

/* revealing module pattern */
let guy = (function () {
  //private data variable
  let age = 25;

  //public methods and properties

  function getAge() {
    return age;
  }
  function growOlder() {
    age++;
  }

  return {
    name: "yousef",
    getAge: getAge,
    growOlder: growOlder,
  };
})();

//Private members for constructor:
function Person(name) {
  var age = 21;
  this.name = name;
  this.getAge = function () {
    return age;
  };
  this.growOlder = function () {
    age++;
  };
}

//---------------------------------
console.log('------making a varible shared across all the instances-----');

var Person = (function(){
  var age = 25;

  function InnerPerson(name){
    this.name = name;
  }
  InnerPerson.prototype.getAge = function(){
    return age;
  }
  InnerPerson.prototype.growOlder = function(){
    age++;
  }
  return InnerPerson;
}());

console.log('---------------');
//person is a singleton object
var pperson = (function(){
  var age = 25;
  
  return {
    getAge: function(){
      return age;
    },
    growAge: function(){
      age++;
    }
  }
}());

console.log(pperson.growAge());
console.log(pperson.getAge());

var Person = (function(){
  var age = 25;
  function InnerPerson(name){
    this.name = name;
  }
  InnerPerson.prototype = {
    getAge: function(){
      return age;
    },
    growAge: function(){
      age++;
    }
  }
  return InnerPerson;
              }())

var person1 = new Person();

//console.log(person1.age); //undefined
person1.getAge();
person1.growAge();
person1.getAge();
person1.growAge();
person1.growAge();
person1.getAge();
var person2 = new Person();
person2.getAge();


function PPerson(name){
  var age = 25;
  this.name = name;
  this.getAge = function(){
    return age;
  }
  this.growAge = function(){
    age++;
  }
}

var person3 = new PPerson();
person3.growAge();
person3.getAge();
var person4 = new PPerson();
person4.getAge();



console.log('----scope-safe constructor----');


function Person(name){
  if (this instanceof Person){
    this.name = name
  } else {
    return new Person(name);
  }
}
const person1 = new Person('yousef');
const person2 = new Person('ahmed');
console.log(person1 instanceof Person); //true
console.log(person2 instanceof Person); //false
```

## Mixins

```js
/* a simple example of a mixin
mixins are oftern used to extend an object functionalites while  avoiding the need of  inheritance 
function mixin(receiver, supplier){
    for(let prop in supplier){
        if(supplier.hasOwnProperty(prop)){
            receiver[prop] = supplier[prop];
        }
    }
}

let supplier = {
    name: 'yousef', 
    age: 21,
    getAge: function(){
        console.log(age);
    }
}
let receiver = {};
mixin(receiver, supplier);
console.log(receiver); */

//A detailed example to get the idea
function EventTarget() {}

EventTarget.prototype = {
  addListener: function (type, listener) {
    //create an array if doesn't exist
    if (!this.hasOwnProperty("_listeners")) {
      this._listeners = [];
    }
    if (typeof this._listeners[type] === "undefined") {
      this._listeners[type] = [];
    }
    this._listeners[type].push(listener);
  },
  fire: function (event) {
    if (!event.target) {
      event.target = this;
    }
    if (!event.type) {
      throw new Error('Event Object missing "type" property');
    }

    if (this._listeners && this._listeners[event.type] instanceof Array) {
      var listeners = this._listeners[event.type];
      for (let i = 0, len = listeners.length; i < len; i++) {
        listeners[i].call(this, event);
      }
    }
  },
  removeListeners: function (type, listener) {
    if (this._listeners && this._listeners[type] instanceof Array) {
      var listeners = this._listeners[type];
      for (let i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i] == listener) {
          listeners.splice(i, 1);
          break;
        }
      }
    }
  },
};

var target = new EventTarget();
target.addListener("message", function (event) {
  console.log("message is " + event.data);
});
target.addListener("age", function (event) {
  console.log("your age is " + event.data);
});
target.fire({
  type: "age",
  data: 21,
});
target.fire({
  type: "message",
  data: "hello world",
});

console.log(target);

//if you want to have a different type of object that also support EventTarget
//firt approach:
var person = new EventTarget();
person.name = "yousef";
person.sayName = function () {
  console.log(this.name);
  this.fire({ type: "namesaid", name: this.name });
};
//second alternative approach:
function Person(name) {
  this.name = name;
}
Person.prototype = Object.create(EventTarget.prototype, {
  constructor: Person,
  sayName: function () {
    console.log(this.name);
    this.fire({ type: "namesaid", name: this.name });
  },
});

const person = new Person();
console.log(person instanceof Person); //true
console.log(person instanceof EventTarget); //true

//third alternative and simpler approach: here there is no inheritance
function Person(name){

}
mixin(Person.prototype, new EventTarget());
mixin(Person.prototype, {
    constructor: Person, 
    sayName: function(){
        console.log(this.name);
        this.fire({type: "namesaid", name: this.name})
    }
})
let person = new Person('meska');
console.log(person instanceof Person); //true, 
console.log(person instanceof EventTarget); //false: //very important to know 

//fourth but related to third approach is to simplify the code above on just one single step 
//in this example a new EverntTarget instance is mixed with some new properties to create the person object without affecting the person' prototype chain 
//now person prototype is dierctly the Object()
let person = mixin(new EventTarget(), {
    name: 'meska',
    sayName: function(){
        console.log(this.name);
        this.fire({type: 'namesaid', name: this.name});
    }
})
console.log(person instanceof Object); //true
console.log(person instanceof EventTarget); //false


//look for this dangrous example
let person = mixin(new EventTarget, {
  get name(){
    return 'nicholas';
  },
  sayname: function(){
    console.log(this.name);
    this.fire({type: 'namesiad', name: name});
  }
});
console.log(person.name); //nicholas
person.name = 'yousef';
console.log(person.name); //yousef, see! a werid behaviour, name must not be changed 

//if you want an accessor property to be copied as an accessor property not a data property , you need a different mixin functionality 
function mixin(receiver, supplier){
  Object.keys(supplier).forEach(function(property){
    var descriptor = Object.getOwnPropertyDescriptor(supplier, property);
    Object.defineProperty(receiver, property, descriptor);
  });
  return receiver;
}
let person = mixin(new EventTarget, {
  get name(){
    return 'nicholas';
  },
  sayname: function(){
    console.log(this.name);
    this.fire({type: 'namesiad', name: name});
  }
});
console.log(person.name); //nicholas
person.name = 'yousef';
console.log(person.name); //nicholas 
```

# NEW

# Articles

-

# things to remember about

- Execution context
- Javascript internals
- V8 optimization techniques

# Functions

# Objects

In this section we're going to deal with object literals

#### Defining Properties

There are two main ways to create objects:

- object literals
- Object constructor

Objects on javascript are dynamic, they are open for modification unless you specifiy otherwise (more on that later)

```js
var person1 = {
  name: "Yousef",
  sayName: function () {
    console.log(this.name);
  },
};

var person2 = new Object();
person2.name = "Meska";

person1.age = 22;
person2.age = 45;
```

\*\* What happens when we add properties to objects? 🤔

Javascript uses an **internal method** called [[Put]] on the object which not only specifiy the initial value, but also some attributes of the Property.
so on the previous code, when age and name are first added, [[Put]] method are invoked for each one, the result of calling [[Put]] is the creation of of an **own property**
Own properties are the properties that indicates that the specific instance of the object owns that property (the property is stored directly on the instance);

When a new value is assigned to an existing property, a ­separate oper-
ation called [[Set]] takes place. This operation replaces the current value
of the property with the new one.

#### Detecting properties

The best way to detect the existance of a property on an object is by using **in** operator, but before going any further, why not doing so

```js
if (person1.age) {
  //do something
}
```

Because an object property can contain one of these falsy values and the condition will not be executed, even if the property exist!

**in** The in operator looks for a property with a given name in a specific
object and returns true if it finds it

```js
console.log("name" in person1); //true
console.log("sayName" in person1); //true
```

sometimes you need to check for a given property whether it is an own property or prototype property, unfortunately **in** can't help you doing so, because it checks for both own and prototype properties on a given object, so we need another solution

**hasOwnProperty()** method come into place and it's present on all objects

```js
console.log("toString" in person1); //true
console.log(person1.hasOwnProperty("toString")); //false;
```

#### Removing properties

setting a property value to null, doesn't remove it instead replacing it's value to null
**delete** operator:
The delete operator works on a single object property and calls an
internal operation named [[Delete]]

```js
delete person1.name;
```

#### Enumeration

By default, all newly added properties to an object are enumerable, which means that you can iterate ober them using for-in loop

Enumerable properties have their internal [[Enumerable]] attributes set to true

iterating over enumerable properties in an object

```js
var property;
for (property in object) {
  console.log("Name: " + property);
  console.log("Value: " + object[property]);
}
```

what happens here is that for every iteration, the **property** variable is filled with the next enumerable property on the object until all such properties have
been used.

let's see mimic this for-in loop in ECMAScript5 using Object.keys() which retrieve the enumerable properties from an object

```js
var propertes = Object.keys(object);

for (var i = 0; (len = properties.length); i++) {
  console.log("Name: " + properties[i]);
  console.log("Value: " + object[properties[i]]);
}
```

\*\*note 🔥 :
There is a difference between the enumerable properties returned in a f ­ or-in loop
and the ones returned by Object.keys() . The for-in loop also enumerates prototype
properties, while Object.keys() returns only own (instance) properties

not all properties are enumerable, in fact the most majority of properties present on an object are non enumerable, we can check this by using **propertyIsEnumerable** method which is present on every object

```js
console.log("name" in person1); // true
console.log(person1.propertyIsEnumerable("name")); // true

var properties = Object.keys(person1);
console.log("length" in properties); //true
console.log(properties.propertyIsEnumerable("length")); //false
```

#### Types of properties

there are two main types of properties:

- Data property: contains a value
- accessor property: doesn't contain a value, but instead define a function to call when the property is read and a function to call when the property is written to (getter/setter)

```js
var person1 = {
  _name: "yousef",

  get name() {
    console.log("reading a name");
    return this._name;
  },
  set name(value) {
    console.log("setting the name to %s", value);
    this._name = value;
  },
};

console.log(person1.name); //'reading a name then 'yousef'
person1.name = "meska";
console.log(person1.name); //setting the name to meska then meska;
```

the \_ is used common convention to indicate that the property is considered to be private, though in reality it is still public

When to use accessor property? 🤔

- when you want the assignment of a value to trigger some sort of behavior
- when reading a value requires the calculation of the desired return value

note 🔥:
you can specifiy either one of them (get or set) or both of them but
when specifiying only get, the property becomes read only
and when specifiying only set, the property becomes write only

### Property attributes

Before ECMAScript5 was born, there was no way to specify whether a property
should be enumerable, In fact, there was no way to access the internal
attributes of a property at all.
In this section we're going to cover🔥

- Common attributes
- Date propterty attributes
- Accessor Property Attributes
- Defining Multiple properties
- Retrieving Property Attributes

#### Common Attributes

There are two property attributes shared between data properties and accessor propterties which are

- [[Enumerable]]:
- [[Configurable]]: determines which the property can be changed or not

those are the internal attributes which we can use later but without [[]] to change the behaviour of of property using **Object.defineProperty()** method
it accepts three arguments:

- object that owns the property,
- the property name
- property descriptor object containing the attributes to set

```js
var person1 = {
  name: "Yousef",
};
Object.defineProperty(person1, "name", {
  enumerable: false,
});
console.log("name" in person1); //true
console.log(person1.propertyIsEnumerable("name")); //false
var properties = Object.keys(person1);
console.log(properties.length); //0
// true
// false
// 0
Object.defineProperty(person1, "name", {
  configurable: false,
});
// try to delete the Property
delete person1.name;
console.log("name" in person1); //true
console.log(person1.name); //"Yousef"
Object.defineProperty(person1, "name", {
  // error!!!! wat? why?
  configurable: true,
});
```

In the last piece of code when we try to convert nonconfigurable property to configurable property, this throws an error, but why? 🤔

note 🔥
you can’t make a
nonconfigurable property configurable again

#### Data Properties Attributes

We have two additional attributes:

- [[Value]]: which holds the value of property, even if it's a function
- [[Writable]]: which is a Boolean value indicating whether the property can be written to

```js
var person1 = {};
Object.defineProperty(person1, "name", {
  value: "Nicholas",
  enumerable: true,
  configurable: true,
  writable: true,
});
```

Tip 📘:
when defining properties using Object.defineProperty(), you should explicity define Boolean values to true, otherwise it will be false by default

#### Accessor Properties Attributes

We have here two additional attributes [[Get]] and [[Set]] which contains the setter and getter function
and ofcourse there's no need for [[Value]] and [[Writable]] here as you might have noticed before

##### Why would I need to define setter or getter using Object.defineProperty()? 🤔

that you can also define
those properties on existing objects, If you want to use object literal nota-
tion, you have to define accessor properties when you create the object

##### note 🔥

As with the object literal form
of getters and setters, you need only define one of these attributes to
create the property.
If you try to create a property with both data and accessor attributes, you will get
an error.

```js
var person1 = {
  _name: "Yousef",
};
Object.defineProperty(person1, "name", {
  get: function () {
    console.log("Reading name");
    return this._name;
  },
  set: function (value) {
    console.log("Setting name to %s", value);
    this._name = value;
  },
  enumerable: true,
  configurable: true,
});
```

notice that get and set are two special keywords

#### Defining Multiple Attributes

We can define mutiple properties with multiple attributes using Object.defineProperties()

```js
var person1 = {};
Object.defineProperties(person1, {
  // data property to store data
  _name: {
    value: "Yousef",
    enumerable: true,
    configurable: true,
    writable: true,
  },
  // accessor property
  name: {
    get: function () {
      console.log("Reading name");
      return this._name;
    },
    set: function (value) {
      console.log("Setting name to %s", value);
      this._name = value;
    },
    enumerable: true,
    configurable: true,
  },
});
```

#### Retrieving Properties Attributes

We can retrieve Property attributes using Object.getOwnPropertyDescriptor() which returns an object containing the attributes

```js
var descriptors = Object.getOwnPropertyDescriptor(person1, name);
console.log(descriptors.value);
console.log(descriptors.configurable);
console.log(descriptors.enumerable);
console.log(descriptors.writable);
```

### Preventing Object Modification

Objects, just like properties, have internal attributes that govern their
behavior. One of these attributes is [[Extensible]] , which is a Boolean
value indicating if the object itself can be modified
in this section we're going to cover🔥

- Preventing extension
- Sealing Objects
- Freezing Objects

#### Preventing Extensible Objects

we can prevent new properties from being added by setting [[Extensible]] to false using Object.preventExtensions()

```js
var person1 = {
  name: "Yousef",
};
console.log(Object.isExtensible(person1)); // true
Object.preventExtensions(person1);
console.log(Object.isExtensible(person1)); // false
person1.sayName = function () {
  console.log(this.name);
};
console.log("sayName" in person1);
```

#### Sealing Objects

Sealed object: is an object which is nonextensible and all it's properties are nonconfigurable
we do this by using Object.seal()

we can only read and write to

```js
var person1 = {
  name: "Yousef",
};
console.log(Object.isExtensible(person1)); // true
console.log(Object.isSealed(person1)); // false

Object.seal(person1);
console.log(Object.isExtensible(person1)); //false
console.log(Object.isSealed(person1)); // true
person1.sayName = function () {
  console.log(this.name);
};
console.log("sayName" in person1); // false

person1.name = "Meska";
console.log(person1.name); // "Meska"
delete person1.name;
console.log("name" in person1); //true
console.log(person1.name); // "Meska"
var descriptor = Object.getOwnPropertyDescriptor(person1, "name");
console.log(descriptor.configurable); //false
```

#### Freezing Objects

Frozen objects can't be unfrozen 🙂, so be carefull!
a frozen object is a sealed object where data properties are also read-only
we have two methods Object.freeze() and Object.isFrozen()

```js
var person1 = {
name: "Yousef"
};
console.log(Object.isExtensible(person1));// true
console.log(Object.isSealed(person1)); // false
console.log(Object.isFrozen(person1)); // false


Object.freeze(person1);
console.log(Object.isExtensible(person1));  // false
w console.log(Object.isSealed(person1)); // true
console.log(Object.isFrozen(person1)); // true


person1.sayName = function() {
console.log(this.name);
};
console.log("sayName" in person1); // false
x person1.name = "Meska";
console.log(person1.name); // "Yousef"
delete person1.name;
console.log("name" in person1);
console.log(person1.name); // "Yousef"
var descriptor = Object.getOwnPropertyDescriptor(person1, "name");
console.log(descriptor.configurable); // false

console.log(descriptor.writable); // false
```

# Constructors and Prototypes

In Javascript A constructor is just a function that is used with **new** keyword
Understanding Constructors and prototypes is essentials and crucial to learn the new features of ES6 such classes and inheritance.
But, Why to use Constructors? 🤔
The advantage of constructors is that objects created with the same constructor contain the same proper-
ties and methods, If you want to create multiple similar objects, you can
create your own constructors and therefore your own reference types

```js
function Person() {
  //intentionally empty
}
var person1 = new Person();
var person2 = new Person(); //if there's no parameters to pass
```

Why using new keyword? 🤔
the new keyword created an empty object and returns it, binding the this keyword inside the Constructor to the instance just created
this preven us from accidentally using the global object 'Window'

this means we can check for the instances of Constructors

```js
console.log(person1 instanceof Person); //true
console.log(person2 instanceof Person); //true
```

we can also check the type of an instance using the constructor property
Every object instance is automatically ­created with a ­ constructor prop-
erty that contains a reference to the constructor function that ­created it.

```js
console.log(person1.constructor === Person); //true
```

instanceof vs .constructor: what to use? 🤔
It's a best practice to use instanceof becuase constructor property can be overwritten and not completly accurate

```js
function Person(name) {
  this.name = name;
  this.sayName = function () {
    console.log(this.name);
  };
}
var person1 = new Person("Yousef");
var person2 = new Person("Meska");
console.log(person1.name); // //Yousef
console.log(person2.name); // "Meska"

person1.sayName(); //Yousef
person2.sayName(); // "Meska"
```

tip 📘:
there's no need to return from constructor because actually do this, but you can explicity do this however if the returned value is an object and the newly created object is ignored,
but if the returned value is primitive, it will be ignored and the newly created object will be returned

# Inheritance

# Objects Patterns

Crap
---------------------------

## resources to help me

Javascript.info
Book: Secrets of Javascript Ninja
course: Mosh [object oriented Javascript]
<https://www.educative.io/courses/learn-object-oriented-programming-in-javascript>

# introduction

Javascript OOP is different from many other programming languages' OOP so it requires more focus at first to grasp the concept well and everything after that will be a piece of cake
Referencing Nickolos c.zakas great book: [linktobook](Prinicples of Object oriented Javascript), and other cool resources on the resources section

warning: we will use ES5 of Javascript, some other cool stuf related to object oriented added after then on ES6 and I will discuss those features later

# overview of what will be discussed on this series

Table of contents:

1. Primitive and Reference types
2. Functions
3. Understanding Objects
4. Constructors and prototypes
5. Inheritance
6. Object Patterns
   and many more I don't know yet what this series will contains

## Introduction

You may have come from programming languages like c++ or java, these language requires you to write a class (usually) before doing anything, Javascript has nothing to do with classes, in fact it has no classes at all, due to this weird charactersitcs, people get confused when learning JS OOP

Object-oriented languages have several characteristics:

- Encapuslation: data can be grouped together with functionality that operates on that data aka (Object)
- Aggregation: one object can reference another object
- Inheritance: A newly created object has the same characteristics as another object without explicitly duplicating its functionality
- Polymorphism One interface may be implemented by multiple objects.

  Javascript has these features, but because js has no concept of classes, these features are implemented differently than other class-based programming language

So on this series I will try my best to explain how to implement those feautres using prototype-based and constructors built on JS

let's begin

# 1.Primitive and Reference types

[:quote:] Everything on Javascript is an object
Javascript makes objects the central parts of the language, Almost all data in JavaScript is either an object or accessed through objects. In fact, even functions (which languages traditionally make you jump through hoops to get references to) are represented as objects in JavaScript, which makes them first-class functions
So working and understanding objects is the key to understand javascript as a whole

This article focuses on how to identify and work with the two primary JavaScript data types: primitive types and reference types. Though both are accessed through objects, they behave in different ways that are important to understand

Primitive types are stored as simple data types.
Reference types are stored as objects, which are really just references to locations in memory.
javascript lets you treat primitive types like reference types in order to make the language more consistent for the developer

It's important to get the foundations of Javascript general concepts first before jumping into any library or frameworl, by gaining a solid foundation of Javascript you have the power even to create your own library or framework.
However it's not that easy to sit down and start studying and everything goes as you might expect, the hardest part is it takes time and dedication day after day to really master what you love

Why to learn object oriented paradigm at all?
of course there are many other paradigms outthere but not as popular as object oriented, the most majority of big companies use OOP due to it's capabilites

What is Object-Oriented Programming?

real world examples of object from daily life and from web development perspective

All of this will be refactored!

# references👩

four pillars of object oriented programming:
1-Encapulation:
in oop we combine group of related varaibles and functions into unit, we call this unit an object
we call variable [property] and functions as [method];
when we write code in oop way, our functions end up having fewer and fewer parameters
'the best functions are those with no paramaters' - uncle bob
2-Abstraction:
all the complexity is hidden from you
we hide some variables and method from the outside: the benefits:
Simple interface
reduce impact of change
3-Inheritance:  
eliminate redundant code
40polymorphaism (many forms)
technique to get rid of long if and else's or switch and case statements
the example of Text and Button and CheckBox
element.render()
Encapuslation: reduce complexity + increase resuability
Abstraction: Reduce complexity + isolate impact of changes
Inherticance: Elemincate redundant code
polymprhphism: refactor ugly switch/case statements

Topics:
Objects
Prototypes
Prototypical inheritance
ES6
modules

# Objects

- creating objects
- Factories and constructors
- Primitive and reference types
- working with properties
- private properties
- Getter/Setters

### creating objects

- Object literals
  the most basic way to create objects

\*\*: best practice: use let or const instead of var

```js
const circle = {
  radius: 1,
  locations: {
    x: 1,
    y: 2,
  },
  draw: function () {
    console.log("draw");
  },
};

circle.draw();
```

- Factories
  if an object has one or more method, we say that object has behaviour

why use factory?

```js
function createCircle(radius, x, y){
    return {
        radius,
        location{
            x,
            y
        },
        draw: function(){
            console.log('draw');
        }
    }
}
const circle = createCircle(1, 1, 3)
```

- Constructors

```js
function Circle(radius) {
  this.radius = radius;
  this.draw = function () {
    console.log("draw");
  };
  //'this' is just reference for object that executing this code
}

const another = new Circle(1);
//new will create empty object and set 'this' inside the Constructor function to point to this empty object and then return that object from the constructor function and reference it the variable  we'v just created
```

- Constructor property
  every object in javascript has a property called constructor, and that references the function that is uded to create that object

```js
console.log(another.constructor);
f Circle(){

}
console.log(circle.constructor);
f Object(){}

//under the hood
let x = {};
let x = new Object();

new String() // '', "", ``
new Boolean() // true, false,
new Number()
```

- Functions are objects
  actually everything on js are objects

```js
console.log(Circle.name, Circle.length);
console.log(Circle.constructor);
f Function(){}

const Circle1 = new Function('radius', `
    this.radius = radius;
    this.draw = function(){
        console.log('draw');
    }
`)
const circle1 = new Circle(1);

Circle.call({} /* target of this */, 1); ===
//'this' will reference {};
const another  = new Circle(1);
Circle.apply({}, [1,2,3]); //pass an array
```

- Values types vs Reference Types
  when we use an object, that object is not stored in this variable, that object is stroed on some where in the memory and the address of that memeort location is stored in that variable
  both x and y are storing the same memory
  primitives: number stringboolean symbol undefined null
  reference: object function array

```js
let x = 10;
let y = x;

x = 20;

//primitive are copied by value
let number = 10;
function increase(number) {
  number++;
}
increase(number);
console.log(number); // 10;

let obj = { value: 10 };
function increase(obj) {
  obj.value++;
}
increase(obj);
console.log(obj);

let x = { value: 10 };
let y = x;
x.value = 20;
console.log(y.value); //20
```

- Objects are dynamic
  After creating them we can add or remove properties to the object

```js
circle.location = { x: 1 };
const propertyName = "location";
circle["location"] = { x: 1 };
circle[propertyName] = { x: 2 };

delete circle.location;
```

- Enumertaing properties

```js
for (let key in circle) {
  console.log(circle[key]);
}
const keys = Object.keys(circle); //array of keys
if ("radius" in circle) {
  console.log("circle has a radius");
}
```

- Abstraction: hide the details, show the essentials

```js
function Circle(radius) {
  this.radius = radius;
  this.defaultLocation = { x: 0, y: 0 };
  this.computeOptimumLocation = function (factor) {
    // ...
  };
  this.draw = function () {
    this.computeOptimumLocation();
    console.log("draw");
  };
}
```

how do we implement abstraction?
we make the memeber we need to hide local varaible
scope is temporary and die, but closure stays

```js
function Circle(radius) {
  this.radius = radius;
  let defaultLocation = { x: 0, y: 0 };
  let computeOptimumLocation = function (factor) {
    // ...
  };
  this.draw = function () {
    computeOptimumLocation(0.1);
    console.log("draw");
  };
}
```

- Setter/Getters
  what if we want to disaply defaultLocation outside outside the function
  how would we do that?
  1-one solution is to use a function that returns that local variable

```js
//inside Circle function
this.getDefaultLocation = function () {
  return defaultLocation;
  //the closure of this function is all the variable defined here and all the varaible defined outside
};
```

2-second solution using Object.defineProperty();

```js
//inside Circle()
Object.defineProperty(this, "defaultLocation", {
  get: function () {
    return defaultLocation;
  },
  set: function (value) {
    if (!value.x || !value.y) {
      throw new Error("Invalid location");
    }
    defaultLocation = value;
  },
});
circle.defaultLocation = 1; //error;
```

-- exercise
Design a stopwatch

```js
function StopWatch() {
  let running,
    startTime,
    endTime,
    duratio = 0;
  Object.defineProperties(this, "duration", {
    get: function () {
      return duration;
    },
  });

  this.start = function () {
    if (running) {
      throw new Error("Stop watch already started");
    }
    running = false;
    startTime = new Date();
  };
  this.stop = function () {
    if (!running) {
      throw new Error(`already stopped`);
    }
    running = true;
    endTime = new Date();
    const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
    duration += seconds;
  };
  this.reset = function () {
    startTime = null;
    endTime = null;
    running = false;
    duration = 0;
  };
}
```

# Prototype

let's say we have two classes, Circle and Square, they both have the exact same method computeLocation() with the exact implementation
so we have here a redundant code
(super class, child class)
we don't have in js classes, there comes prototypical inheritance
think of prototype as a parent,
every single object has a prototype, which inherit behaviours from that parents

Object() does not have prototype property , this is the ObjectBase

```js
let x = {};
Object.getPrototypeOf(x);
__proto__ is deprecated
```

- Multi-level inheritance

```js
let arr = [];
Object.getPrototypeOf(arr); Array[] Object
and Array[] has prototype of Object
```

- Property Descriptors

```js
let person = { name: "yousef" };
console.log(person);
for (let key in person) {
  console.log(key);
}
or;
Object.keys(person);
//so how can we access the properties defined in the prototype?
```

well, in javascript, proprteies have attributes attatched to them, that might prevent them from begin accessbiel (enumerated)

```js
let person = { name: "yousef" };
let ObjectBase = Object.getPrototypeOf(person);

let descriptors = Object.getOwnPropertyDescriptr(objectBase, "toString");

Object.defineProperty(person, "name", {
  writable: false,
  enumerable: false,
});
person.name = "meska";
console.log(Object.keys(person));
```

- Constructor prototype
  the proper way to get prototype is using Obkect.getPrototype();

what is the difference between **proto** and .prototype
let's demonstrate by code

```js
let literalObj = {};
console.log(literalObj.__proto__);
__proto__ or Object.getPrototypeOf(literalObj); refere to the Object Constructor that created this object
هات الاب بتاعك من الاخر
```

and this code

```js
function Cirlce(){

}
let circle1 = new Circle();
Circle.prototype
here protottype is just a property on the constructor function that created the object
اللي هو أنا أنا أنا
```

```js
Circle.__proto__
output: Function Object
Circle.__proto__.__proto__
output: Object Object
Circle.__proto__.__proto__.__proto__
output: null
```

- Prototype memebers

```js
function Cirlce() {
  this.move = function () {
    this.draw(); //come from the prototype;
    console.log("moved!");
  };
}
Circle.prototype.draw = function () {
  console.log(`I am a circle`);
};
```

note: Object.keys() only return instance member, because by default prototype members are not iterable but
for in loop return all memebers both instance and prototype
c1.hasOwnProperty('draw'); //flase

note: don't modify or extend the build in objects like Array or Object or Function
exercise: refactor Stopwatch using Prototype
note: in this example we really don't need to do this, because this is 'Premature optimization'

```js
function StopWatch(){
    let duration = 0, running, startTime, endTime;

    Object.defineProperty(this, 'duration', {
        get: function(){
            return duration;
        }
        set: function(value){
            duration = value;
        }
    })
     Object.defineProperty(this, 'startTime', {
        get: function(){
            return startTime;
        }

    })
     Object.defineProperty(this, 'endTime', {
        get: function(){
            return endTime;
        }
    })
     Object.defineProperty(this, 'running', {
        get: function(){
            return running;
        }
    })
}
StopWatch.prototype.start = function(){
    if (running) {
      throw new Error("Stop watch already started");
    }
    running = false;
    startTime = new Date();
}
StopWatch.prototype.stop = function(){
        if (!running) {
      throw new Error(`already stopped`);
    }
    running = true;
    endTime = new Date();
    const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
    duration += seconds;
}
StopWatch.prototype.reset = function(){
        startTime = null;
    endTime = null;
    running = false;
    duration = 0;
}
```

# Prototypical inheritance: using Object.create() -> takes argument to use as object prototype

```js
function Shape() {}

Shape.prototype.duplicate = function () {
  console.log("duplicate");
};
function Circle() {
  this.radius = radius;
}
Circle.prototype = Object.create(Object.prototype); //before 'implict relationship'
Shape.prototype => ShapeBase.
we want Circle.prototype which is CircleBase to inherit from ShapeBase
Circle.prototype = Object.create(Shape.prototype); //return object that inherit from ShapeBase
Circle.prototype.draw = function () {
  console.log("draw");
};
const c = new Circle(1);
const s = new Shape();

```

but there is pitfall in this current implementation
let's look first at this code

```js
const c = new Circle(1);
//we said that every object has a constructor that was used to construct this object;
new Circle.prototype.constructor(1); //== new Circle(1); we use the shortert for cleaner
//so if we look at c we will get notice that we don't see the constructor property anymore
//and if we look at the __proto__ property we will notice that it returning the Shape funciton not the circle function
//so if we do this
new Circle.prototype.constructor(1);
//we will get
Shape{}
//the reason for this, is because we've reset the prototype of Circle
//so whenever you reset the prototype, we should reset the constructor
Circle.prototype.constructor = Circle;
```

- Calling the super constructor

```js
function Shape(color) {
  this.color = color;
}

function Circle(radius, color) {
  //Shape(color); //window.color;
  //new Shape(color);
  Shape.call(this, color);
  this.radius = radius;
}
const c = new Cirlce(1, "red");
```

- Itermediate function Inheritance
  instead of everytime you need to make inherit child, you repeat your code;

```js
function extend(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}
```

- Method overriding
  we put the method we want to override on the prototype and after extend function

```js
Shape.prototype.duplicate = function () {
  console.log("duplicate");
};
extend(Circle, Shape);
Circle.prototype.duplicate = function () {
  console.log("duplicateed");
};
```

ofcourse we can call another method from Object, inside the prototype of anothe robject

```js
Circle.prototype.duplicate = function () {
  Shape.prototype.duplicate.call(this);
  console.log('duplicate')'
}
```

- Polymorphisms
  we now have many form of the same method (duplicate)

```js
const shapes = [new Circle(), new Square()];
for (let shape of shapes) {
  shape.duplicate();
}
```

tip: do not go more than one level inheritance
if you want to, use Composition (mixin)

- Mixin

```js
const canEat = {
  eat: function () {
    this.hunger__;
    console.log("eating");
  },
};

const canWalk = {
  walk: function () {
    console.log("walking");
  },
};

//Object.assign(); //copy properties from one object to another;
// const person = Object.assign({}, canEat, canWalk);

function Person() {}
Object.assign(Person.prototype, canEat, canWalk);
const person = new Person();
console.log(person);
```

instead of doing this everytime, we will automate it;

```js
function mixin(target, ...sources) {
  Object.assign(target, ...sources);
}
```

exercise

```js
function HTMLElement() {
  this.click = function () {
    console.log("clicked");
  };
}
HTMLElement.prototype.focus = function () {
  console.log("focused");
};
const e = new HTMLElement();

function HTMLSelectElement(arr = []){
  this.items = arr;
  this.addItem = function(item){
    this.items.push(item)
  }
  this.removeItem(item){
    this.items.splice(arr.indexOf(item), 1);
  }
}

// HTMLSelectElement.prototype = object.create(HTMLElement.prototype);
 HTMLSelectElement.prototype = new HTMLElement(); //this is different from the above line
 //we want the click method also to be inherited which is own method not prototypical method, to do so, we have to set the protoype to the instance of HTMLElement();
HTMLSelectElement.prototype.constructor = HTMLSelectElement;
//or
new HTMLSelectElement();
```

exercise 2: polymorphism

# Classes

classes are just sytatic sugar over prototypical inheritance
method that defined on the constructor are not part of the prototype of the object, but own methods

Classes are essentially functions!
typeof(Circle); //function

```js
class Circle {
  constructor() {
    this.move = function () {};
  }
  //instance method
  draw() {
    console.log("draw");
  }
  //Static method: are not tied to specific object, it's on the class itself, will not be available on object
  static parse(str) {
    const radius = JSON.parse(str);
    return new Circle(radius);
  }
}
const circle = Circle.parse('{"radius": 1}');
```

Classes whether declared of expressioned are not hoisted!

- 'this' keyword

```js
function Circle = function(){
  this.draw = function(){
    console.log(this);
  }
}
const c = new Circle();
//Method call
c.draw(); //Circle {draw: f};
const draw = c.draw;
//Function call
draw(); //Window;
```

we can change this behaviour using 'use strict' -> stop modifying the global object

by default our Classes body are executed using strict mode

- Private members using Symbols
  using primitie type called symbol
  a Symbol is just a unique identifier

```js
const _radius = Symbol();
const _draw = Symbol();
class Circle {
  constructor(radius) {
    this[_radius] = radius;
  }
  //using computer property name
  [_draw]() {
    console.log("supposed to be priavte");
  }
}
const c = new Circle(1);
c._radius; //won't work, however there's a hack around this
const key = Object.getOwnPropertySymbols(c)[0];
console.log(c[key]);
```

- Private members using WeakMaps
  the reason for this to be weak, their keys are weak, if there are no references, they will be garbage collected

```js
const _radius = new WeakMap();
const _movie = new WeakMap();
const priateProps = new WeakMap();
class Circle {
  constructor(radius) {
    privateProps.set(this, {
      property1: () => {},
      property2: value,
    });
    _radius.set(this, radius);
    // _movie.set(this, function () {
    //   console.log("welcome", this);
    // }); because the problem of this rebound to undefined 'strict mode'
    _movie.set(this, () => {
      console.log("welcome", this);
    });
  }
  //to get radius property, we should explicitly do this
  draw() {
    console.log(_radius.get(this));
  }
  anotherDraw() {
    _movie.get(this)();
  }
}
```

we can get access to radius property if we can get access to WeakMap, but when dealing with module we can hide the implementation detail, so we can't get to that WeakMap()

- Getters/Setters

```js
class Circle {
  constructor(radius) {
    _radius.set(this, radius);
  }
  get radius() {
    return _radius.get(this);
  }
  set radius(value) {
    if (value < 0) throw new Error("invalid radius");
    _radius.set(this, value);
  }
}
```

- Inherticance
  -> note for me: show how super is implementation under the hood

```js
class Shape {
  constructor(color) {
    this.color = color;
  }
  move() {
    console.log("move coming from shape");
  }
}
class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  draw() {
    console.log("draw");
  }
  //method overriding
  move() {
    super.move();
    console.log("move coming from Circle");
  }
}
const c = new Circle();
```

exerciese: implement Stack data structure

```js
const _items = new WeakMap();
class Stack {
  constructor() {
    _items.set(this, []);
  }
  peek() {
    //shows you what is on top of the stack;
    //Stack is empty
    if (items.get(this).length == 0) {
      console.log("Stack is empty");
    }
    return _items.get(this)[_items.get(this).length - 1];
  }
  pop() {
    //Stack is empty
    if (items.get(this).length == 0) {
      console.log("Stack is empty"); //TODO: redundant code, refactor
    }
    return _items.get(this).pop();
  }
  push(obj) {
    _items.get(this).push(obj);
  }
  get count() {
    return _items.get(this).length;
  }
}
```

# ES6 module

## Further reading

- Learn Javascript OOP, Nickolas Zakas
- Javascript: The Good parts, Douglas Crockford
- JavaScript Patterns, Stoyan Stefanov
- Effective JavaScript\_ 68 Specific Ways to Harness the Power of JavaScript, David Herman
- Eloquent_JavaScript
- You Don't Know Javascript

------------------------------------------

## resources to help me

<https://robotlolita.me/articles/2011/understanding-javascript-oop/>
<https://frontendmasters.com/courses/object-oriented-js/>
Book: Priniciples of Object Oriented Javascript
Javascript.info
Book: Secrets of Javascript Ninja
course: Mosh [object oriented Javascript]
<https://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript/>
<https://www.educative.io/courses/learn-object-oriented-programming-in-javascript>
<https://css-tricks.com/the-flavors-of-object-oriented-programming-in-javascript/>
frontend masters courses:
<https://frontendmasters.com/courses/object-oriented-js/>

# introduction

Javascript OOP is different from many other programming languages' OOP so it requires more focus at first to grasp the concept well and everything after that will be a piece of cake
Referencing Nickolos c.zakas great book: [linktobook](Prinicples of Object oriented Javascript), and other cool resources on the resources section

warning: we will use ES5 of Javascript, some other cool stuf related to object oriented added after then on ES6 and I will discuss those features later

# overview of what will be discussed on this series

Table of contents:

1. Primitive and Reference types
2. Functions
3. Understanding Objects
4. Constructors and prototypes
5. Inheritance
6. Object Patterns
   and many more I don't know yet what this series will contains

## Introduction

You may have come from programming languages like c++ or java, these language requires you to write a class (usually) before doing anything, Javascript has nothing to do with classes, in fact it has no classes at all, due to this weird charactersitcs, people get confused when learning JS OOP

Object-oriented languages have several characteristics:

- Encapuslation: data can be grouped together with functionality that operates on that data aka (Object)

- Aggregation: one object can reference another object

- Inheritance: A newly created object has the same characteristics as another object without explicitly duplicating its functionality

- Polymorphism One interface may be implemented by multiple objects.
  
  Javascript has these features, but because js has no concept of classes, these features are implemented differently than other class-based programming language

So on this series I will try my best to explain how to implement those feautres using prototype-based and constructors built on JS

let's begin

# 1.Primitive and Reference types

[:quote:] Everything on Javascript is an object
Javascript makes objects the central parts of the language, Almost all data in JavaScript is either an object or accessed through objects. In fact, even functions (which languages traditionally make you jump through hoops to get references to) are represented as objects in JavaScript, which makes them first-class functions
So working and understanding objects is the key to understand javascript as a whole

This article focuses on how to identify and work with the two primary JavaScript data types: primitive types and reference types. Though both are accessed through objects, they behave in different ways that are important to understand

Primitive types are stored as simple data types.
Reference types are stored as objects, which are really just references to locations in memory.
javascript lets you treat primitive types like reference types in order to make the language more consistent for the developer

It's important to get the foundations of Javascript general concepts first before jumping into any library or frameworl, by gaining a solid foundation of Javascript you have the power even to create your own library or framework.
However it's not that easy to sit down and start studying and everything goes as you might expect, the hardest part is it takes time and dedication day after day to really master what you love

Why to learn object oriented paradigm at all?
of course there are many other paradigms outthere but not as popular as object oriented, the most majority of big companies use OOP due to it's capabilites

What is Object-Oriented Programming?

real world examples of object from daily life and from web development perspective

All of this will be refactored!

# references👩

four pillars of object oriented programming:
1-Encapulation:
in oop we combine group of related varaibles and functions into unit, we call this unit an object
we call variable [property] and functions as [method];
when we write code in oop way, our functions end up having fewer and fewer parameters
'the best functions are those with no paramaters' - uncle bob
2-Abstraction:
all the complexity is hidden from you
we hide some variables and method from the outside: the benefits:
Simple interface
reduce impact of change
3-Inheritance:  
eliminate redundant code
40polymorphaism (many forms)
technique to get rid of long if and else's or switch and case statements
the example of Text and Button and CheckBox
element.render()
Encapuslation: reduce complexity + increase resuability
Abstraction: Reduce complexity + isolate impact of changes
Inherticance: Elemincate redundant code
polymprhphism: refactor ugly switch/case statements

Topics:
Objects
Prototypes
Prototypical inheritance
ES6
modules

# Objects

- creating objects
- Factories and constructors
- Primitive and reference types
- working with properties
- private properties
- Getter/Setters

### creating objects

- Object literals
  the most basic way to create objects

\*\*: best practice: use let or const instead of var

```js
const circle = {
  radius: 1,
  locations: {
    x: 1,
    y: 2,
  },
  draw: function () {
    console.log("draw");
  },
};

circle.draw();
```

- Factories
  if an object has one or more method, we say that object has behaviour

why use factory?

```js
function createCircle(radius, x, y){
    return {
        radius,
        location{
            x,
            y
        },
        draw: function(){
            console.log('draw');
        }
    }
}
const circle = createCircle(1, 1, 3)
```

- Constructors

```js
function Circle(radius) {
  this.radius = radius;
  this.draw = function () {
    console.log("draw");
  };
  //'this' is just reference for object that executing this code
}

const another = new Circle(1);
//new will create empty object and set 'this' inside the Constructor function to point to this empty object and then return that object from the constructor function and reference it the variable  we'v just created
```

- Constructor property
  every object in javascript has a property called constructor, and that references the function that is uded to create that object

```js
console.log(another.constructor);
f Circle(){

}
console.log(circle.constructor);
f Object(){}

//under the hood
let x = {};
let x = new Object();

new String() // '', "", ``
new Boolean() // true, false,
new Number()
```

- Functions are objects
  actually everything on js are objects

```js
console.log(Circle.name, Circle.length);
console.log(Circle.constructor);
f Function(){}

const Circle1 = new Function('radius', `
    this.radius = radius;
    this.draw = function(){
        console.log('draw');
    }
`)
const circle1 = new Circle(1);

Circle.call({} /* target of this */, 1); ===
//'this' will reference {};
const another  = new Circle(1);
Circle.apply({}, [1,2,3]); //pass an array
```

- Values types vs Reference Types
  when we use an object, that object is not stored in this variable, that object is stroed on some where in the memory and the address of that memeort location is stored in that variable
  both x and y are storing the same memory
  primitives: number stringboolean symbol undefined null
  reference: object function array

```js
let x = 10;
let y = x;

x = 20;

//primitive are copied by value
let number = 10;
function increase(number) {
  number++;
}
increase(number);
console.log(number); // 10;

let obj = { value: 10 };
function increase(obj) {
  obj.value++;
}
increase(obj);
console.log(obj);

let x = { value: 10 };
let y = x;
x.value = 20;
console.log(y.value); //20
```

- Objects are dynamic
  After creating them we can add or remove properties to the object

```js
circle.location = { x: 1 };
const propertyName = "location";
circle["location"] = { x: 1 };
circle[propertyName] = { x: 2 };

delete circle.location;
```

- Enumertaing properties

```js
for (let key in circle) {
  console.log(circle[key]);
}
const keys = Object.keys(circle); //array of keys
if ("radius" in circle) {
  console.log("circle has a radius");
}
```

- Abstraction: hide the details, show the essentials

```js
function Circle(radius) {
  this.radius = radius;
  this.defaultLocation = { x: 0, y: 0 };
  this.computeOptimumLocation = function (factor) {
    // ...
  };
  this.draw = function () {
    this.computeOptimumLocation();
    console.log("draw");
  };
}
```

how do we implement abstraction?
we make the memeber we need to hide local varaible
scope is temporary and die, but closure stays

```js
function Circle(radius) {
  this.radius = radius;
  let defaultLocation = { x: 0, y: 0 };
  let computeOptimumLocation = function (factor) {
    // ...
  };
  this.draw = function () {
    computeOptimumLocation(0.1);
    console.log("draw");
  };
}
```

- Setter/Getters
  what if we want to disaply defaultLocation outside outside the function
  how would we do that?
  1-one solution is to use a function that returns that local variable

```js
//inside Circle function
this.getDefaultLocation = function () {
  return defaultLocation;
  //the closure of this function is all the variable defined here and all the varaible defined outside
};
```

2-second solution using Object.defineProperty();

```js
//inside Circle()
Object.defineProperty(this, "defaultLocation", {
  get: function () {
    return defaultLocation;
  },
  set: function (value) {
    if (!value.x || !value.y) {
      throw new Error("Invalid location");
    }
    defaultLocation = value;
  },
});
circle.defaultLocation = 1; //error;
```

-- exercise
Design a stopwatch

```js
function StopWatch() {
  let running,
    startTime,
    endTime,
    duratio = 0;
  Object.defineProperties(this, "duration", {
    get: function () {
      return duration;
    },
  });

  this.start = function () {
    if (running) {
      throw new Error("Stop watch already started");
    }
    running = false;
    startTime = new Date();
  };
  this.stop = function () {
    if (!running) {
      throw new Error(`already stopped`);
    }
    running = true;
    endTime = new Date();
    const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
    duration += seconds;
  };
  this.reset = function () {
    startTime = null;
    endTime = null;
    running = false;
    duration = 0;
  };
}
```

# Prototype

let's say we have two classes, Circle and Square, they both have the exact same method computeLocation() with the exact implementation
so we have here a redundant code
(super class, child class)
we don't have in js classes, there comes prototypical inheritance
think of prototype as a parent,
every single object has a prototype, which inherit behaviours from that parents

Object() does not have prototype property , this is the ObjectBase

```js
let x = {};
Object.getPrototypeOf(x);
__proto__ is deprecated
```

- Multi-level inheritance

```js
let arr = [];
Object.getPrototypeOf(arr); Array[] Object
and Array[] has prototype of Object
```

- Property Descriptors

```js
let person = { name: "yousef" };
console.log(person);
for (let key in person) {
  console.log(key);
}
or;
Object.keys(person);
//so how can we access the properties defined in the prototype?
```

well, in javascript, proprteies have attributes attatched to them, that might prevent them from begin accessbiel (enumerated)

```js
let person = { name: "yousef" };
let ObjectBase = Object.getPrototypeOf(person);

let descriptors = Object.getOwnPropertyDescriptr(objectBase, "toString");

Object.defineProperty(person, "name", {
  writable: false,
  enumerable: false,
});
person.name = "meska";
console.log(Object.keys(person));
```

- Constructor prototype
  the proper way to get prototype is using Obkect.getPrototype();

what is the difference between **proto** and .prototype
let's demonstrate by code

```js
let literalObj = {};
console.log(literalObj.__proto__);
__proto__ or Object.getPrototypeOf(literalObj); refere to the Object Constructor that created this object
هات الاب بتاعك من الاخر
```

and this code

```js
function Cirlce(){

}
let circle1 = new Circle();
Circle.prototype
here protottype is just a property on the constructor function that created the object
اللي هو أنا أنا أنا
```

```js
Circle.__proto__
output: Function Object
Circle.__proto__.__proto__
output: Object Object
Circle.__proto__.__proto__.__proto__
output: null
```

- Prototype memebers

```js
function Cirlce() {
  this.move = function () {
    this.draw(); //come from the prototype;
    console.log("moved!");
  };
}
Circle.prototype.draw = function () {
  console.log(`I am a circle`);
};
```

note: Object.keys() only return instance member, because by default prototype members are not iterable but
for in loop return all memebers both instance and prototype
c1.hasOwnProperty('draw'); //flase

note: don't modify or extend the build in objects like Array or Object or Function
exercise: refactor Stopwatch using Prototype
note: in this example we really don't need to do this, because this is 'Premature optimization'

```js
function StopWatch(){
    let duration = 0, running, startTime, endTime;

    Object.defineProperty(this, 'duration', {
        get: function(){
            return duration;
        }
        set: function(value){
            duration = value;
        }
    })
     Object.defineProperty(this, 'startTime', {
        get: function(){
            return startTime;
        }

    })
     Object.defineProperty(this, 'endTime', {
        get: function(){
            return endTime;
        }
    })
     Object.defineProperty(this, 'running', {
        get: function(){
            return running;
        }
    })
}
StopWatch.prototype.start = function(){
    if (running) {
      throw new Error("Stop watch already started");
    }
    running = false;
    startTime = new Date();
}
StopWatch.prototype.stop = function(){
        if (!running) {
      throw new Error(`already stopped`);
    }
    running = true;
    endTime = new Date();
    const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
    duration += seconds;
}
StopWatch.prototype.reset = function(){
        startTime = null;
    endTime = null;
    running = false;
    duration = 0;
}
```

# Prototypical inheritance: using Object.create() -> takes argument to use as object prototype

```js
function Shape() {}

Shape.prototype.duplicate = function () {
  console.log("duplicate");
};
function Circle() {
  this.radius = radius;
}
Circle.prototype = Object.create(Object.prototype); //before 'implict relationship'
Shape.prototype => ShapeBase.
we want Circle.prototype which is CircleBase to inherit from ShapeBase
Circle.prototype = Object.create(Shape.prototype); //return object that inherit from ShapeBase
Circle.prototype.draw = function () {
  console.log("draw");
};
const c = new Circle(1);
const s = new Shape();
```

but there is pitfall in this current implementation
let's look first at this code

```js
const c = new Circle(1);
//we said that every object has a constructor that was used to construct this object;
new Circle.prototype.constructor(1); //== new Circle(1); we use the shortert for cleaner
//so if we look at c we will get notice that we don't see the constructor property anymore
//and if we look at the __proto__ property we will notice that it returning the Shape funciton not the circle function
//so if we do this
new Circle.prototype.constructor(1);
//we will get
Shape{}
//the reason for this, is because we've reset the prototype of Circle
//so whenever you reset the prototype, we should reset the constructor
Circle.prototype.constructor = Circle;
```

- Calling the super constructor

```js
function Shape(color) {
  this.color = color;
}

function Circle(radius, color) {
  //Shape(color); //window.color;
  //new Shape(color);
  Shape.call(this, color);
  this.radius = radius;
}
const c = new Cirlce(1, "red");
```

- Itermediate function Inheritance
  instead of everytime you need to make inherit child, you repeat your code;

```js
function extend(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}
```

- Method overriding
  we put the method we want to override on the prototype and after extend function

```js
Shape.prototype.duplicate = function () {
  console.log("duplicate");
};
extend(Circle, Shape);
Circle.prototype.duplicate = function () {
  console.log("duplicateed");
};
```

ofcourse we can call another method from Object, inside the prototype of anothe robject

```js
Circle.prototype.duplicate = function () {
  Shape.prototype.duplicate.call(this);
  console.log('duplicate')'
}
```

- Polymorphisms
  we now have many form of the same method (duplicate)

```js
const shapes = [new Circle(), new Square()];
for (let shape of shapes) {
  shape.duplicate();
}
```

tip: do not go more than one level inheritance
if you want to, use Composition (mixin)

- Mixin

```js
const canEat = {
  eat: function () {
    this.hunger__;
    console.log("eating");
  },
};

const canWalk = {
  walk: function () {
    console.log("walking");
  },
};

//Object.assign(); //copy properties from one object to another;
// const person = Object.assign({}, canEat, canWalk);

function Person() {}
Object.assign(Person.prototype, canEat, canWalk);
const person = new Person();
console.log(person);
```

instead of doing this everytime, we will automate it;

```js
function mixin(target, ...sources) {
  Object.assign(target, ...sources);
}
```

exercise

```js
function HTMLElement() {
  this.click = function () {
    console.log("clicked");
  };
}
HTMLElement.prototype.focus = function () {
  console.log("focused");
};
const e = new HTMLElement();

function HTMLSelectElement(arr = []){
  this.items = arr;
  this.addItem = function(item){
    this.items.push(item)
  }
  this.removeItem(item){
    this.items.splice(arr.indexOf(item), 1);
  }
}

// HTMLSelectElement.prototype = object.create(HTMLElement.prototype);
 HTMLSelectElement.prototype = new HTMLElement(); //this is different from the above line
 //we want the click method also to be inherited which is own method not prototypical method, to do so, we have to set the protoype to the instance of HTMLElement();
HTMLSelectElement.prototype.constructor = HTMLSelectElement;
//or
new HTMLSelectElement();
```

exercise 2: polymorphism

# Classes

classes are just sytatic sugar over prototypical inheritance
method that defined on the constructor are not part of the prototype of the object, but own methods

Classes are essentially functions!
typeof(Circle); //function

```js
class Circle {
  constructor() {
    this.move = function () {};
  }
  //instance method
  draw() {
    console.log("draw");
  }
  //Static method: are not tied to specific object, it's on the class itself, will not be available on object
  static parse(str) {
    const radius = JSON.parse(str);
    return new Circle(radius);
  }
}
const circle = Circle.parse('{"radius": 1}');
```

Classes whether declared of expressioned are not hoisted!

- 'this' keyword

```js
function Circle = function(){
  this.draw = function(){
    console.log(this);
  }
}
const c = new Circle();
//Method call
c.draw(); //Circle {draw: f};
const draw = c.draw;
//Function call
draw(); //Window;
```

we can change this behaviour using 'use strict' -> stop modifying the global object

by default our Classes body are executed using strict mode

- Private members using Symbols
  using primitie type called symbol
  a Symbol is just a unique identifier

```js
const _radius = Symbol();
const _draw = Symbol();
class Circle {
  constructor(radius) {
    this[_radius] = radius;
  }
  //using computer property name
  [_draw]() {
    console.log("supposed to be priavte");
  }
}
const c = new Circle(1);
c._radius; //won't work, however there's a hack around this
const key = Object.getOwnPropertySymbols(c)[0];
console.log(c[key]);
```

- Private members using WeakMaps
  the reason for this to be weak, their keys are weak, if there are no references, they will be garbage collected

```js
const _radius = new WeakMap();
const _movie = new WeakMap();
const priateProps = new WeakMap();
class Circle {
  constructor(radius) {
    privateProps.set(this, {
      property1: () => {},
      property2: value,
    });
    _radius.set(this, radius);
    // _movie.set(this, function () {
    //   console.log("welcome", this);
    // }); because the problem of this rebound to undefined 'strict mode'
    _movie.set(this, () => {
      console.log("welcome", this);
    });
  }
  //to get radius property, we should explicitly do this
  draw() {
    console.log(_radius.get(this));
  }
  anotherDraw() {
    _movie.get(this)();
  }
}
```

we can get access to radius property if we can get access to WeakMap, but when dealing with module we can hide the implementation detail, so we can't get to that WeakMap()

- Getters/Setters

```js
class Circle {
  constructor(radius) {
    _radius.set(this, radius);
  }
  get radius() {
    return _radius.get(this);
  }
  set radius(value) {
    if (value < 0) throw new Error("invalid radius");
    _radius.set(this, value);
  }
}
```

- Inherticance
  -> note for me: show how super is implementation under the hood

```js
class Shape {
  constructor(color) {
    this.color = color;
  }
  move() {
    console.log("move coming from shape");
  }
}
class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  draw() {
    console.log("draw");
  }
  //method overriding
  move() {
    super.move();
    console.log("move coming from Circle");
  }
}
const c = new Circle();
```

exerciese: implement Stack data structure

```js
const _items = new WeakMap();
class Stack {
  constructor() {
    _items.set(this, []);
  }
  peek() {
    //shows you what is on top of the stack;
    //Stack is empty
    if (items.get(this).length == 0) {
      console.log("Stack is empty");
    }
    return _items.get(this)[_items.get(this).length - 1];
  }
  pop() {
    //Stack is empty
    if (items.get(this).length == 0) {
      console.log("Stack is empty"); //TODO: redundant code, refactor
    }
    return _items.get(this).pop();
  }
  push(obj) {
    _items.get(this).push(obj);
  }
  get count() {
    return _items.get(this).length;
  }
}
```

# ES6 module

##############

## Books

- Learn Javascript OOP, Nickolas Zakas
- Javascript: The Good parts, Douglas Crockford
- JavaScript Patterns, Stoyan Stefanov
- Effective JavaScript\_ 68 Specific Ways to Harness the Power of JavaScript, David Herman
- Eloquent_JavaScript
- You Don't Know Javascript

# Articles

-

# things to remember about

- Execution context
- Javascript internals
- V8 optimization techniques

# Functions

# Objects

In this section we're going to deal with object literals

#### Defining Properties

There are two main ways to create objects:

- object literals
- Object constructor

Objects on javascript are dynamic, they are open for modification unless you specifiy otherwise (more on that later)

```js
var person1 = {
  name: "Yousef",
  sayName: function () {
    console.log(this.name);
  },
};

var person2 = new Object();
person2.name = "Meska";

person1.age = 22;
person2.age = 45;
```

\*\* What happens when we add properties to objects? 🤔

Javascript uses an **internal method** called [[Put]] on the object which not only specifiy the initial value, but also some attributes of the Property.
so on the previous code, when age and name are first added, [[Put]] method are invoked for each one, the result of calling [[Put]] is the creation of of an **own property**
Own properties are the properties that indicates that the specific instance of the object owns that property (the property is stored directly on the instance);

When a new value is assigned to an existing property, a ­separate oper-
ation called [[Set]] takes place. This operation replaces the current value
of the property with the new one.

#### Detecting properties

The best way to detect the existance of a property on an object is by using **in** operator, but before going any further, why not doing so

```js
if (person1.age) {
  //do something
}
```

Because an object property can contain one of these falsy values and the condition will not be executed, even if the property exist!

**in** The in operator looks for a property with a given name in a specific
object and returns true if it finds it

```js
console.log("name" in person1); //true
console.log("sayName" in person1); //true
```

sometimes you need to check for a given property whether it is an own property or prototype property, unfortunately **in** can't help you doing so, because it checks for both own and prototype properties on a given object, so we need another solution

**hasOwnProperty()** method come into place and it's present on all objects

```js
console.log("toString" in person1); //true
console.log(person1.hasOwnProperty("toString")); //false;
```

#### Removing properties

setting a property value to null, doesn't remove it instead replacing it's value to null
**delete** operator:
The delete operator works on a single object property and calls an
internal operation named [[Delete]]

```js
delete person1.name;
```

#### Enumeration

By default, all newly added properties to an object are enumerable, which means that you can iterate ober them using for-in loop

Enumerable properties have their internal [[Enumerable]] attributes set to true

iterating over enumerable properties in an object

```js
var property;
for (property in object) {
  console.log("Name: " + property);
  console.log("Value: " + object[property]);
}
```

what happens here is that for every iteration, the **property** variable is filled with the next enumerable property on the object until all such properties have
been used.

let's see mimic this for-in loop in ECMAScript5 using Object.keys() which retrieve the enumerable properties from an object

```js
var propertes = Object.keys(object);

for (var i = 0; (len = properties.length); i++) {
  console.log("Name: " + properties[i]);
  console.log("Value: " + object[properties[i]]);
}
```

\*\*note 🔥 :
There is a difference between the enumerable properties returned in a f ­ or-in loop
and the ones returned by Object.keys() . The for-in loop also enumerates prototype
properties, while Object.keys() returns only own (instance) properties

not all properties are enumerable, in fact the most majority of properties present on an object are non enumerable, we can check this by using **propertyIsEnumerable** method which is present on every object

```js
console.log("name" in person1); // true
console.log(person1.propertyIsEnumerable("name")); // true

var properties = Object.keys(person1);
console.log("length" in properties); //true
console.log(properties.propertyIsEnumerable("length")); //false
```

#### Types of properties

there are two main types of properties:

- Data property: contains a value
- accessor property: doesn't contain a value, but instead define a function to call when the property is read and a function to call when the property is written to (getter/setter)

```js
var person1 = {
  _name: "yousef",

  get name() {
    console.log("reading a name");
    return this._name;
  },
  set name(value) {
    console.log("setting the name to %s", value);
    this._name = value;
  },
};

console.log(person1.name); //'reading a name then 'yousef'
person1.name = "meska";
console.log(person1.name); //setting the name to meska then meska;
```

the \_ is used common convention to indicate that the property is considered to be private, though in reality it is still public

When to use accessor property? 🤔

- when you want the assignment of a value to trigger some sort of behavior
- when reading a value requires the calculation of the desired return value

note 🔥:
you can specifiy either one of them (get or set) or both of them but
when specifiying only get, the property becomes read only
and when specifiying only set, the property becomes write only

### Property attributes

Before ECMAScript5 was born, there was no way to specify whether a property
should be enumerable, In fact, there was no way to access the internal
attributes of a property at all.
In this section we're going to cover🔥

- Common attributes
- Date propterty attributes
- Accessor Property Attributes
- Defining Multiple properties
- Retrieving Property Attributes

#### Common Attributes

There are two property attributes shared between data properties and accessor propterties which are

- [[Enumerable]]:
- [[Configurable]]: determines which the property can be changed or not

those are the internal attributes which we can use later but without [[]] to change the behaviour of of property using **Object.defineProperty()** method
it accepts three arguments:

- object that owns the property,
- the property name
- property descriptor object containing the attributes to set

```js
var person1 = {
  name: "Yousef",
};
Object.defineProperty(person1, "name", {
  enumerable: false,
});
console.log("name" in person1); //true
console.log(person1.propertyIsEnumerable("name")); //false
var properties = Object.keys(person1);
console.log(properties.length); //0
// true
// false
// 0
Object.defineProperty(person1, "name", {
  configurable: false,
});
// try to delete the Property
delete person1.name;
console.log("name" in person1); //true
console.log(person1.name); //"Yousef"
Object.defineProperty(person1, "name", {
  // error!!!! wat? why?
  configurable: true,
});
```

In the last piece of code when we try to convert nonconfigurable property to configurable property, this throws an error, but why? 🤔

note 🔥
you can’t make a
nonconfigurable property configurable again

#### Data Properties Attributes

We have two additional attributes:

- [[Value]]: which holds the value of property, even if it's a function
- [[Writable]]: which is a Boolean value indicating whether the property can be written to

```js
var person1 = {};
Object.defineProperty(person1, "name", {
  value: "Nicholas",
  enumerable: true,
  configurable: true,
  writable: true,
});
```

Tip 📘:
when defining properties using Object.defineProperty(), you should explicity define Boolean values to true, otherwise it will be false by default

#### Accessor Properties Attributes

We have here two additional attributes [[Get]] and [[Set]] which contains the setter and getter function
and ofcourse there's no need for [[Value]] and [[Writable]] here as you might have noticed before

##### Why would I need to define setter or getter using Object.defineProperty()? 🤔

that you can also define
those properties on existing objects, If you want to use object literal nota-
tion, you have to define accessor properties when you create the object

##### note 🔥

As with the object literal form
of getters and setters, you need only define one of these attributes to
create the property.
If you try to create a property with both data and accessor attributes, you will get
an error.

```js
var person1 = {
  _name: "Yousef",
};
Object.defineProperty(person1, "name", {
  get: function () {
    console.log("Reading name");
    return this._name;
  },
  set: function (value) {
    console.log("Setting name to %s", value);
    this._name = value;
  },
  enumerable: true,
  configurable: true,
});
```

notice that get and set are two special keywords

#### Defining Multiple Attributes

We can define mutiple properties with multiple attributes using Object.defineProperties()

```js
var person1 = {};
Object.defineProperties(person1, {
  // data property to store data
  _name: {
    value: "Yousef",
    enumerable: true,
    configurable: true,
    writable: true,
  },
  // accessor property
  name: {
    get: function () {
      console.log("Reading name");
      return this._name;
    },
    set: function (value) {
      console.log("Setting name to %s", value);
      this._name = value;
    },
    enumerable: true,
    configurable: true,
  },
});
```

#### Retrieving Properties Attributes

We can retrieve Property attributes using Object.getOwnPropertyDescriptor() which returns an object containing the attributes

```js
var descriptors = Object.getOwnPropertyDescriptor(person1, name);
console.log(descriptors.value);
console.log(descriptors.configurable);
console.log(descriptors.enumerable);
console.log(descriptors.writable);
```

### Preventing Object Modification

Objects, just like properties, have internal attributes that govern their
behavior. One of these attributes is [[Extensible]] , which is a Boolean
value indicating if the object itself can be modified
in this section we're going to cover🔥

- Preventing extension
- Sealing Objects
- Freezing Objects

#### Preventing Extensible Objects

we can prevent new properties from being added by setting [[Extensible]] to false using Object.preventExtensions()

```js
var person1 = {
  name: "Yousef",
};
console.log(Object.isExtensible(person1)); // true
Object.preventExtensions(person1);
console.log(Object.isExtensible(person1)); // false
person1.sayName = function () {
  console.log(this.name);
};
console.log("sayName" in person1);
```

#### Sealing Objects

Sealed object: is an object which is nonextensible and all it's properties are nonconfigurable
we do this by using Object.seal()

we can only read and write to

```js
var person1 = {
  name: "Yousef",
};
console.log(Object.isExtensible(person1)); // true
console.log(Object.isSealed(person1)); // false

Object.seal(person1);
console.log(Object.isExtensible(person1)); //false
console.log(Object.isSealed(person1)); // true
person1.sayName = function () {
  console.log(this.name);
};
console.log("sayName" in person1); // false

person1.name = "Meska";
console.log(person1.name); // "Meska"
delete person1.name;
console.log("name" in person1); //true
console.log(person1.name); // "Meska"
var descriptor = Object.getOwnPropertyDescriptor(person1, "name");
console.log(descriptor.configurable); //false
```

#### Freezing Objects

Frozen objects can't be unfrozen 🙂, so be carefull!
a frozen object is a sealed object where data properties are also read-only
we have two methods Object.freeze() and Object.isFrozen()

```js
var person1 = {
name: "Yousef"
};
console.log(Object.isExtensible(person1));// true
console.log(Object.isSealed(person1)); // false
console.log(Object.isFrozen(person1)); // false


Object.freeze(person1);
console.log(Object.isExtensible(person1));  // false
w console.log(Object.isSealed(person1)); // true
console.log(Object.isFrozen(person1)); // true


person1.sayName = function() {
console.log(this.name);
};
console.log("sayName" in person1); // false
x person1.name = "Meska";
console.log(person1.name); // "Yousef"
delete person1.name;
console.log("name" in person1);
console.log(person1.name); // "Yousef"
var descriptor = Object.getOwnPropertyDescriptor(person1, "name");
console.log(descriptor.configurable); // false

console.log(descriptor.writable); // false
```

# Constructors and Prototypes

In Javascript A constructor is just a function that is used with **new** keyword
Understanding Constructors and prototypes is essentials and crucial to learn the new features of ES6 such classes and inheritance.
But, Why to use Constructors? 🤔
The advantage of constructors is that objects created with the same constructor contain the same proper-
ties and methods, If you want to create multiple similar objects, you can
create your own constructors and therefore your own reference types

```js
function Person() {
  //intentionally empty
}
var person1 = new Person();
var person2 = new Person(); //if there's no parameters to pass
```

Why using new keyword? 🤔
the new keyword created an empty object and returns it, binding the this keyword inside the Constructor to the instance just created
this preven us from accidentally using the global object 'Window'

this means we can check for the instances of Constructors

```js
console.log(person1 instanceof Person); //true
console.log(person2 instanceof Person); //true
```

we can also check the type of an instance using the constructor property
Every object instance is automatically ­created with a ­ constructor prop-
erty that contains a reference to the constructor function that ­created it.

```js
console.log(person1.constructor === Person); //true
```

instanceof vs .constructor: what to use? 🤔
It's a best practice to use instanceof becuase constructor property can be overwritten and not completly accurate

```js
function Person(name) {
  this.name = name;
  this.sayName = function () {
    console.log(this.name);
  };
}
var person1 = new Person("Yousef");
var person2 = new Person("Meska");
console.log(person1.name); // //Yousef
console.log(person2.name); // "Meska"

person1.sayName(); //Yousef
person2.sayName(); // "Meska"
```

tip 📘:
there's no need to return from constructor because actually do this, but you can explicity do this however if the returned value is an object and the newly created object is ignored,
but if the returned value is primitive, it will be ignored and the newly created object will be returned

# Inheritance

# Objects Patterns

--------------------------------------------------------------------------------------------------------------------------------------------------

## Books

- Learn Javascript OOP, Nickolas Zakas
- Javascript: The Good parts, Douglas Crockford
- JavaScript Patterns, Stoyan Stefanov
- Effective JavaScript\_ 68 Specific Ways to Harness the Power of JavaScript, David Herman
- Eloquent_JavaScript
- You Don't Know Javascript

# Articles

-

# things to remember about

- Execution context
- Javascript internals
- V8 optimization techniques

# Functions

# Objects

In this section we're going to deal with object literals

#### Defining Properties

There are two main ways to create objects:

- object literals
- Object constructor

Objects on javascript are dynamic, they are open for modification unless you specifiy otherwise (more on that later)

```js
var person1 = {
  name: "Yousef",
  sayName: function () {
    console.log(this.name);
  },
};

var person2 = new Object();
person2.name = "Meska";

person1.age = 22;
person2.age = 45;
```

\*\* What happens when we add properties to objects? 🤔

Javascript uses an **internal method** called [[Put]] on the object which not only specifiy the initial value, but also some attributes of the Property.
so on the previous code, when age and name are first added, [[Put]] method are invoked for each one, the result of calling [[Put]] is the creation of of an **own property**
Own properties are the properties that indicates that the specific instance of the object owns that property (the property is stored directly on the instance);

When a new value is assigned to an existing property, a ­separate oper-
ation called [[Set]] takes place. This operation replaces the current value
of the property with the new one.

#### Detecting properties

The best way to detect the existance of a property on an object is by using **in** operator, but before going any further, why not doing so

```js
if (person1.age) {
  //do something
}
```

Because an object property can contain one of these falsy values and the condition will not be executed, even if the property exist!

**in** The in operator looks for a property with a given name in a specific
object and returns true if it finds it

```js
console.log("name" in person1); //true
console.log("sayName" in person1); //true
```

sometimes you need to check for a given property whether it is an own property or prototype property, unfortunately **in** can't help you doing so, because it checks for both own and prototype properties on a given object, so we need another solution

**hasOwnProperty()** method come into place and it's present on all objects

```js
console.log("toString" in person1); //true
console.log(person1.hasOwnProperty("toString")); //false;
```

#### Removing properties

setting a property value to null, doesn't remove it instead replacing it's value to null
**delete** operator:
The delete operator works on a single object property and calls an
internal operation named [[Delete]]

```js
delete person1.name;
```

#### Enumeration

By default, all newly added properties to an object are enumerable, which means that you can iterate ober them using for-in loop

Enumerable properties have their internal [[Enumerable]] attributes set to true

iterating over enumerable properties in an object

```js
var property;
for (property in object) {
  console.log("Name: " + property);
  console.log("Value: " + object[property]);
}
```

what happens here is that for every iteration, the **property** variable is filled with the next enumerable property on the object until all such properties have
been used.

let's see mimic this for-in loop in ECMAScript5 using Object.keys() which retrieve the enumerable properties from an object

```js
var propertes = Object.keys(object);

for (var i = 0; (len = properties.length); i++) {
  console.log("Name: " + properties[i]);
  console.log("Value: " + object[properties[i]]);
}
```

\*\*note 🔥 :
There is a difference between the enumerable properties returned in a f ­ or-in loop
and the ones returned by Object.keys() . The for-in loop also enumerates prototype
properties, while Object.keys() returns only own (instance) properties

not all properties are enumerable, in fact the most majority of properties present on an object are non enumerable, we can check this by using **propertyIsEnumerable** method which is present on every object

```js
console.log("name" in person1); // true
console.log(person1.propertyIsEnumerable("name")); // true

var properties = Object.keys(person1);
console.log("length" in properties); //true
console.log(properties.propertyIsEnumerable("length")); //false
```

#### Types of properties

there are two main types of properties:

- Data property: contains a value
- accessor property: doesn't contain a value, but instead define a function to call when the property is read and a function to call when the property is written to (getter/setter)

```js
var person1 = {
  _name: "yousef",

  get name() {
    console.log("reading a name");
    return this._name;
  },
  set name(value) {
    console.log("setting the name to %s", value);
    this._name = value;
  },
};

console.log(person1.name); //'reading a name then 'yousef'
person1.name = "meska";
console.log(person1.name); //setting the name to meska then meska;
```

the \_ is used common convention to indicate that the property is considered to be private, though in reality it is still public

When to use accessor property? 🤔

- when you want the assignment of a value to trigger some sort of behavior
- when reading a value requires the calculation of the desired return value

note 🔥:
you can specifiy either one of them (get or set) or both of them but
when specifiying only get, the property becomes read only
and when specifiying only set, the property becomes write only

### Property attributes

Before ECMAScript5 was born, there was no way to specify whether a property
should be enumerable, In fact, there was no way to access the internal
attributes of a property at all.
In this section we're going to cover🔥

- Common attributes
- Date propterty attributes
- Accessor Property Attributes
- Defining Multiple properties
- Retrieving Property Attributes

#### Common Attributes

There are two property attributes shared between data properties and accessor propterties which are

- [[Enumerable]]:
- [[Configurable]]: determines which the property can be changed or not

those are the internal attributes which we can use later but without [[]] to change the behaviour of of property using **Object.defineProperty()** method
it accepts three arguments:

- object that owns the property,
- the property name
- property descriptor object containing the attributes to set

```js
var person1 = {
  name: "Yousef",
};
Object.defineProperty(person1, "name", {
  enumerable: false,
});
console.log("name" in person1); //true
console.log(person1.propertyIsEnumerable("name")); //false
var properties = Object.keys(person1);
console.log(properties.length); //0
// true
// false
// 0
Object.defineProperty(person1, "name", {
  configurable: false,
});
// try to delete the Property
delete person1.name;
console.log("name" in person1); //true
console.log(person1.name); //"Yousef"
Object.defineProperty(person1, "name", {
  // error!!!! wat? why?
  configurable: true,
});
```

In the last piece of code when we try to convert nonconfigurable property to configurable property, this throws an error, but why? 🤔

note 🔥
you can’t make a
nonconfigurable property configurable again

#### Data Properties Attributes

We have two additional attributes:

- [[Value]]: which holds the value of property, even if it's a function
- [[Writable]]: which is a Boolean value indicating whether the property can be written to

```js
var person1 = {};
Object.defineProperty(person1, "name", {
  value: "Nicholas",
  enumerable: true,
  configurable: true,
  writable: true,
});
```

Tip 📘:
when defining properties using Object.defineProperty(), you should explicity define Boolean values to true, otherwise it will be false by default

#### Accessor Properties Attributes

We have here two additional attributes [[Get]] and [[Set]] which contains the setter and getter function
and ofcourse there's no need for [[Value]] and [[Writable]] here as you might have noticed before

##### Why would I need to define setter or getter using Object.defineProperty()? 🤔

that you can also define
those properties on existing objects, If you want to use object literal nota-
tion, you have to define accessor properties when you create the object

##### note 🔥

As with the object literal form
of getters and setters, you need only define one of these attributes to
create the property.
If you try to create a property with both data and accessor attributes, you will get
an error.

```js
var person1 = {
  _name: "Yousef",
};
Object.defineProperty(person1, "name", {
  get: function () {
    console.log("Reading name");
    return this._name;
  },
  set: function (value) {
    console.log("Setting name to %s", value);
    this._name = value;
  },
  enumerable: true,
  configurable: true,
});
```

notice that get and set are two special keywords

#### Defining Multiple Attributes

We can define mutiple properties with multiple attributes using Object.defineProperties()

```js
var person1 = {};
Object.defineProperties(person1, {
  // data property to store data
  _name: {
    value: "Yousef",
    enumerable: true,
    configurable: true,
    writable: true,
  },
  // accessor property
  name: {
    get: function () {
      console.log("Reading name");
      return this._name;
    },
    set: function (value) {
      console.log("Setting name to %s", value);
      this._name = value;
    },
    enumerable: true,
    configurable: true,
  },
});
```

#### Retrieving Properties Attributes

We can retrieve Property attributes using Object.getOwnPropertyDescriptor() which returns an object containing the attributes

```js
var descriptors = Object.getOwnPropertyDescriptor(person1, name);
console.log(descriptors.value);
console.log(descriptors.configurable);
console.log(descriptors.enumerable);
console.log(descriptors.writable);
```

### Preventing Object Modification

Objects, just like properties, have internal attributes that govern their
behavior. One of these attributes is [[Extensible]] , which is a Boolean
value indicating if the object itself can be modified
in this section we're going to cover🔥

- Preventing extension
- Sealing Objects
- Freezing Objects

#### Preventing Extensible Objects

we can prevent new properties from being added by setting [[Extensible]] to false using Object.preventExtensions()

```js
var person1 = {
  name: "Yousef",
};
console.log(Object.isExtensible(person1)); // true
Object.preventExtensions(person1);
console.log(Object.isExtensible(person1)); // false
person1.sayName = function () {
  console.log(this.name);
};
console.log("sayName" in person1);
```

#### Sealing Objects

Sealed object: is an object which is nonextensible and all it's properties are nonconfigurable
we do this by using Object.seal()

we can only read and write to

```js
var person1 = {
  name: "Yousef",
};
console.log(Object.isExtensible(person1)); // true
console.log(Object.isSealed(person1)); // false

Object.seal(person1);
console.log(Object.isExtensible(person1)); //false
console.log(Object.isSealed(person1)); // true
person1.sayName = function () {
  console.log(this.name);
};
console.log("sayName" in person1); // false

person1.name = "Meska";
console.log(person1.name); // "Meska"
delete person1.name;
console.log("name" in person1); //true
console.log(person1.name); // "Meska"
var descriptor = Object.getOwnPropertyDescriptor(person1, "name");
console.log(descriptor.configurable); //false
```

#### Freezing Objects

Frozen objects can't be unfrozen 🙂, so be carefull!
a frozen object is a sealed object where data properties are also read-only
we have two methods Object.freeze() and Object.isFrozen()

```js
var person1 = {
name: "Yousef"
};
console.log(Object.isExtensible(person1));// true
console.log(Object.isSealed(person1)); // false
console.log(Object.isFrozen(person1)); // false


Object.freeze(person1);
console.log(Object.isExtensible(person1));  // false
w console.log(Object.isSealed(person1)); // true
console.log(Object.isFrozen(person1)); // true


person1.sayName = function() {
console.log(this.name);
};
console.log("sayName" in person1); // false
x person1.name = "Meska";
console.log(person1.name); // "Yousef"
delete person1.name;
console.log("name" in person1);
console.log(person1.name); // "Yousef"
var descriptor = Object.getOwnPropertyDescriptor(person1, "name");
console.log(descriptor.configurable); // false

console.log(descriptor.writable); // false
```

# Constructors and Prototypes

In Javascript A constructor is just a function that is used with **new** keyword
Understanding Constructors and prototypes is essentials and crucial to learn the new features of ES6 such classes and inheritance.
But, Why to use Constructors? 🤔
The advantage of constructors is that objects created with the same constructor contain the same proper-
ties and methods, If you want to create multiple similar objects, you can
create your own constructors and therefore your own reference types

```js
function Person() {
  //intentionally empty
}
var person1 = new Person();
var person2 = new Person(); //if there's no parameters to pass
```

Why using new keyword? 🤔
the new keyword created an empty object and returns it, binding the this keyword inside the Constructor to the instance just created
this preven us from accidentally using the global object 'Window'

this means we can check for the instances of Constructors

```js
console.log(person1 instanceof Person); //true
console.log(person2 instanceof Person); //true
```

we can also check the type of an instance using the constructor property
Every object instance is automatically ­created with a ­ constructor prop-
erty that contains a reference to the constructor function that ­created it.

```js
console.log(person1.constructor === Person); //true
```

instanceof vs .constructor: what to use? 🤔
It's a best practice to use instanceof becuase constructor property can be overwritten and not completly accurate

```js
function Person(name) {
  this.name = name;
  this.sayName = function () {
    console.log(this.name);
  };
}
var person1 = new Person("Yousef");
var person2 = new Person("Meska");
console.log(person1.name); // //Yousef
console.log(person2.name); // "Meska"

person1.sayName(); //Yousef
person2.sayName(); // "Meska"
```

tip 📘:
there's no need to return from constructor because actually do this, but you can explicity do this however if the returned value is an object and the newly created object is ignored,
but if the returned value is primitive, it will be ignored and the newly created object will be returned

# Inheritance

# Objects Patterns

/**Javascript patterns: stoyan stefanov**/

- Design patterns:
- Coding patterns: JavaScript-specific patterns and good practices related to the unique features of the language
- Anti Patterns: common approach that causes more problems than it solves

Why no classes is sometimes good?
-the problem of Compostion over long inheritance:
if you can create objects out of available pieces you
have lying around, this is a much better approach than creating long parent-child in-
heritance chains and classifications

## Chapter 2: Essentials

this chapter is all about best practices and habits to speed up and maintain your code for the greater good
[1] Maintain your code

- Fix the bug or the problem as you get it, because delaying or moving to another code without solving it will make it harder to fix because it requires: - Time to relearn and understand the problem - Time to understand the code that is supposed to solve the problem
  but let's ask the proper question, what **actually** is a maintable code? 🤔
  Maintable code has these characteristics:
- Readable
- Consistent
- Predictable
- Documented

[2] Minimize your usage of globals
reasons not use globals as possible:
[-] They are shared among all the application code
[-] They live in the same global namespace and there
is always a chance of naming collisions
few global variables as possible
**implied global**: any variable you don’t declare becomes a
property of the global object

```js
function sum(x, y) {
  // antipattern: implied global
  result = x + y;
  return result;
}
```

another antipattern: assignment chaining
the reason for b to be global becuase we havn't declared it

```js
// antipattern, do not use
// a is local, b is global
function foo() {
  var a = (b = 0);
}
//
```

as Stoyan said:
Yet another reason to avoid globals is portability. If you want your code
to run in different environments (hosts), it’s dangerous to use globals
because you can accidentally overwrite a host object that doesn’t exist
in your original environment (so you thought the name was safe to use)
but which does in some of the others

Implied Globals vs explicitly defined ones:
Implied globals are not variable, they are properties on the global object, so they can be deleted using **delete** operator, unlike explicitly defined globals which are variable declared outside any function and can't be deleted

```js
var globa_var = 1;
global_novar = 2; //antipattern
(function () {
  global_fromFunc = 3; //antipattern
})();

// attempt to delete
delete global_var; // false
delete global_novar; // true
delete global_fromfunc; // true
// test the deletion
typeof global_var; // "number"
typeof global_novar; // "undefined"
typeof global_fromfunc; // "undefined"
```

## Single var pattern

always use a single var inside your function, it's a good pattern to follow for better readability and maintaing,
and it's also a good practice to initialize the variables you've declared, this will later save you alot of thinkings about the intention of creating those variables

using Single var pattern will prevent the **Hoisting** problems or minimize it (more on that soon)
Hoisting: All the variable declarations get hoisted to the top of the
function.

```js
function func() {
  var a = 1,
    b = 2,
    sum = a + b,
    myobject = {},
    i,
    j;
  // function body...
}
```

The problem with Hoisting

```js
myname = "global"
function func(){
    alert(myname); //undefined
    var myname = 'local;
    alert(myname); //local;
}
func();
```

you might have expected that these function will alert 'global' at the first and then alert 'local'
but this is not how things go with JS
Becuase as you know all the variables are being hoisted to the top of the function, so the function is supposed to be like that

```js
myname = "global"
function func(){
    var myname = undefined
    alert(myname); //undefined
    myname = 'local;
    alert(myname); //local;
}
func();
```

However this is not actually what is done under the hood of implementation
I will come to that later when talking about (Execution context and it's phases)

[3] for loops
Enhancing the performance of your JavaScript code is 80% depened on utilizing using for loops
What might be considered as a bad practice in this piece of code ?

```js
//simple array iteration
for (var i = 0; i < myArr.length; i++) {
  //..
}
```

problem with this pattern is that the length of the array is accessed on every loop
iteration. This can slow down your code, especially when myarray is not an array but
an HTMLCollection object.

What is HTMLCollection?
HTMLCollections are objects returned by DOM methods: e.g
• document.getElementsByName()
• document.getElementsByClassName()
• document.getElementsByTagName()

So what is wrong with looping over DOM elements?
DOM operations are expensive in general
you are querying the live DOM
So the operation of just getting the length is so expensive and will slow your code performance

**Cache your length**
cache the lenght of the array or collection

```js
function looper() {
  var i = 0,
    myArr = [],
    max;
  for (i = 0, max = myArr.length; i < max; i++) {
    //..
  }
}
```

there can be micro-optimzation of the above code is:

- use less variable (no max)
- Count down to 0, which is usually faster because it’s more efficient to compare to 0 than to the length of the array or to anything other than 0
  1-the first pattern

```js
var i = 0,
  myArr = [1, 2, 3];
for (i = myArr.length; i--; ) {
  console.log(myArr[i]);
}
```

2-the second pattern uses a while loop

```js
while (i--) {
  console.log(myArr[i]);
}
```

- Enumerating with for-in loop
  make for-in loops for nonarrays, Technically arrays are also objects, but it might be non desired output when using for-in with arrays
  Don't forget to use .hasOwnProperty() when iterating becuase for-in iterate over the own and prototype properties, conside this code

```js
var human = {
  hands: 2,
  legs: 2,
  head: 1,
};
if (typeof Object.prototype.clone === "undefined") {
  Object.prototype.clone = function () {
    console.log("cloned!");
  };
}
```

not checking using hasOwnProperty() will go deeper into the prototype chains and this is an antipattern.

```js
// 1.
// for-in loop
for (var i in man) {
  if (man.hasOwnProperty(i)) {
    // filter
    console.log(i, ":", man[i]);
  }
}
/*
result in the console
hands : 2
legs : 2
heads : 1
*/
// 2.
// antipattern:
// for-in loop without checking hasOwnProperty()
for (var i in man) {
  console.log(i, ":", man[i]);
}
/*
result in the console
hands : 2
legs : 2
heads : 1
clone: function()
*/
```

----------------------------------------------------------------------------------------------------------------------

   /**Prototypes */
   //'new' keyword adds a link(which we can access as _proto_) between
   //-the object created and the prototype property of the constructor function
//every constructor function has a property on it called 'prototype', which is an object.
//the prototype object has a property on it called 'constructor' which points back to the original constructor.
//Anytime an object is created using 'new' keyword, a property called '**proto**' gets created, , linking the object and prototype property of the constructor function

function Person(name){
    this.name = name;
  }
  let colt = new Person('colt');
  let elie = new Person('elie');

  elie.**proto** == Person.prototype;
  Person.prototype.constructor == Person;
//Protype chain

//the prototype property is an object which can have methods and other propertes
// these methods and properties are shared and accessable aby any object that created form tht contstrucot6 function

function Person(name){
    this.name = name;
  }
  let colt = new Person('colt');
  let elie = new Person('elie');

  Person.prototype.isInstructor = true;
  elie.isInstructor
  //how were we able to access proprties on the prototype??
  //**proto** comes in <3

  let arr = [];
  new Array;
  console.log(arr.**proto**);
  let array = new Array(1,3);
  console.log(array.**proto** == Array.prototype);

  function Vehicle(model, year){

      this.model = model; 
      this.year = year;
      this.isRunning = false;
    this.check =   function(isRunning){
    console.log(`${this.model} is now on ${this.isRunning}`);
    }

  }
  let bmw = new Vehicle('BMW', 2017);
  let x6 = new Vehicle('x6', 2019);
  let toyota = new Vehicle('Toyota', 2011);

  // class_name.prototype.method_name = function(first_argument) {
  //  // body...

  // };
  console.log('---------');
  Vehicle.prototype.turnOn = function(){
      this.isRunning = true;
  }
  Vehicle.prototype.turnOff = function(){
      this.isRunning = false;
  }
  Vehicle.prototype.honk = function(){
      if (this.isRunning) {
          return 'Beep!';
      }
  }
  bmw.turnOn();
  bmw.check();

  toyota.turnOff();
  toyota.check();
  x6.turnOn();
  x6.check();
  x6.honk();

#############
/_Prototype_/
function Car(key) {
    this.carId = key;
}
Car.prototype.start = function (){
    console.log('Start' + this.carId);
}
let car3 = new Car();
car3.start()
//Expanding Objects using Prototype
String.prototype.hello = function(){
    return this.toString() + 'Hello';
}
console.log('Foo'.hello()) //'Foo Hello'

---------------------------------------------------------------------------------------------------------------------------------------------------------------

/**So what the hell is 'this'?
 *resered word in js, usually determined by how a function is called (what we call the execution context):
 *can be determined using four rules(global, object/implicit, explicit, new)

 **when we see 'this' outside the object declaration, so it's the refering to the global object 'Window' object in js
 */
//1-Global context
let person = "Elie";
window.person; //the varibale person is attached to the global object window ('Elie')
window.person === person //(true)
console.log(this) //window

function whatIsThis(){
    return this; //window, because this is still outside an object declaration
}

function variableInThis(){

    this.person = "yousef"; //window.person == yousef

}
//when using 'use strict' mode in js, this allows us to follow the best practices of the languages, meaning that
//now we can't declare a global variable inside functions using this, it makes 'this' as undefined
function whatIsThis(){
    return this;
}
console.log(whatIsThis); //undefined
console.log(person); //yousef
console.log(whatIsThis); //window

//2-Implicit/object rule: llook always for the closest parent object
let person = {
    firstName: 'yousef',
    sayHi(){
        return 'Hi' + this.firstName; //Hi + person.firstName
    },
    determineContext(){
        return this === person //true
    }
}
//what if we have nested objects:
let person = {
    name: 'yousef',
    sayHi(){
      return `Hi ${this.name}`
    },
    determineContext(){
      return person === this
    },
    dog: {
      sayHello(){
        return `Hello ${this.name}` //'this' will look for the closest object which is here the 'dog' object, which also doesn't have a name property
      },
      determineContext(){
      return this === person
      }
    }
  }
  console.log(person.name);
  person.sayHi(); //Hi yousef
  person.determineContext(); //true
  console.log(person.dog.sayHello()); //hello undefined
  console.log(person.dog.determineContext()) //false

//3-Explicit Binding: choose what we want the context of 'this' to be using call, apply or bind
//call, apply, bind are only methods used on functions:
//1-call: (parameters: thisArg, a, b, c, ...), the function is immediately invoked
//to fix this block of code using call
let person = {
    name: 'yousef',
    sayHi(){
      return `Hi ${this.name}`
    },
    determineContext(){
      return person === this
    },
    dog: {
      sayHello(){
        return `Hello ${this.name}`
      },
      determineContext(){
      return this === person
      }
    }
  }
  person.dog.sayHello.call(person); //person here is the 'thisArg'
  person.dog.determineContext(person);

  //another block of duplicated code
  let colt = {
    firstName: 'Colt',
    sayHi(){
        return `Hi ${this.firstName}`;
    }
  }

  let elie = {
      firstName: 'Elie',
      sayHi(){
        return `Hi ${this.firstName}`;
      }
  }
  //the fix
  let colt = {
    firstName: 'Colt',
    sayHi(){
        return `Hi ${this.firstName}`;
    }
}
let elie = {
    firstName: 'Elie'
}
  colt.sayHello();
  colt.sayHello.call(elie);
//2-apply: (parameters: [thisArg, [a,b,c, ...]]), immediately invoked
//apply is alomst identical to call, except the paramters sent as array
let colt = {
    firstName: 'colt',
    sayHi(){
        return 'Hi ' + this.firstName;
    },
    calculateNumbers(a,b,c,d){
        return `${this.firstName} calculated ${a+b+c+d}`;
    }
}
let elie = {
    firstName: 'elie'
}
colt.calculateNumbers.call(elie, 1,2,3,4);
colt.calculateNumbers.apply(elie, [1,2,3,4]);
//3-bind: (parameters: just like call), function is not invoked
//the paramters work like call, but bind returns a functio with the context of 'this' bound already
let colt = {
    firstName: 'colt',
    sayHi(){
        return 'Hi ' + this.firstName;
    },
    calculateNumbers(a,b,c,d){
        return `${this.firstName} calculated ${a+b+c+d}`;
    }
}
let elie = {
    firstName: 'elie'
}
let elieCalc = colt.calculateNumbers.bind(elie, 1,2,3,4);
elieCalc(); //Elie has just calculated 10

//with bind = we don't need to know all the argument up front;
let elieCalc2 = colt.calculateNumbers.bind(elie, 1,2);
elieCalc2(3,4);

//losing the context of 'this' and how to fix it
let colt = {
    name: 'colt',
    sayHi: function(){
      setTimeOut(function(){
        console.log('Hi' + this.name); //since setTimeOut is called on a later point in time, the object that it's attach to is the window object, the context which function is exceuted is the global object
      }, 1000);
    }
  }
  //so the result here is undefined, but we need to set it to the object context, call and apply can't do this job because it invoke the function right way and thi against setTimeOut();
  let colt = {
    name: 'colt',
    sayHi: function(){
      setTimeOut(function(){
        console.log('Hi' + this.name); //since setTimeOut is called on a later point in time, the object that it's attach to is the window object, the context which function is exceuted is the global object
      }.bind(this), 1000); //using bind to set the correct context of this
    }
  }

##############
/*this*/
let o = {
    carId: 123,
    getId: function(){
        console.log(this)
        return this.carId;
    }
};
console.log(o.getId());
/*call and apply: they mainly used to change the value of 'this' based on the context*/
let o = {
    carId: 123,
    getId: function(){
        console.log(this)
        return this.carId;
    }
};
let newCar = {carId: 554645654};
console.log(o.getId.call(newCar)); //'this' now refers to newCar
console.log(o.getId.apply(newCar, ['ID: '])); //the main deffierence from 'call' is it accepts array of arguments
/*Bind: we call bind on a function and makes copy of that function and assign it with new context*/
let o = {
    carId: 123,
    getId: function(){
        console.log(this)
        return this.carId;
    }
};
let newCar = {carId: 554645654};
let newFn = o.getId.bind(newCar); // a new function
console.log(newFn);

#####

  /**

- 'new' keyword: the value of 'this' on global object changes when using new
- now 'this' is refering the object created with new
  */

   --------------------------------------------------------------------------------------

      function Person(first, last){
       this.first = first;
       this.last = last;

   }
   let newPerson = new Person('yousef', 'meska');

```

 ### OOP: before ES versions
```js
   //so js back then didn't have classes, so how they were able to implement it
   //using constructor function
   //'this' put a '_prototype_' into the empty object that created
   function House(bedroom, bathroom ){
       this.bedroom = bedroom;
       this.bathroom = bathroom;
   }
   let newHouse = new House(1,2);

   function Dog(name, age){
       this.name = name;
       this.age = age;
       this.bark = function(){
          console.log(`Hello ${this.name}`); 
       }

   }

   //mulitple constructor: 
   function Car(make, model, year){
       this.make = make;
       this.year = year;
       this.mode = model;
       this.numWheels = 4;
   }
   function MotorCycle(make, model, year){
    this.make = make;
    this.year = year;
    this.mode = model;
    this.numWheels = 2;
   }
   //notice how much duplication is here, is there any way to borrow the car function and invoke it inside the motorcycle constructor?
   function Car(make, model, year){
    this.make = make;
    this.year = year;
    this.mode = model;
    this.numWheels = 4;
}
function MotorCycle(make, model, year){

    Car.call(this, make, model, year);
    this.numWheels = 2;

   }
   //we can do it with apply also
   function MotorCycle(make, model, year){

    Car.apply(this, [make, model, year]);
    this.numWheels = 2;

   }
   //e can do it even better 
   function MotorCycle(make, model, year){

    Car.call(this, arguments);
    this.numWheels = 2;

   }
   let newVechicle = new MotorCycle('hello'); //not completed yet, search for it
```

---------------------------------------------------------------------------------------------------

### Class Basic

```js
class Car{
    constructor(Id){
        this.id = id
    }
    identify(suffix){
        return `Car Id: ${this.id} ${suffix}`
    }
}
let car = new Car(123);
console.log(car.indentify('!!!!'))
/*Inhertience*/
class Vehicle {
    constructor(){
        this.type = 'car';
    }
    start(){
        return `Starting...${this.type}`
    }
}
class Car extends Vehicle{
    constructor(){
        super();
    }
    start(){
        return 'in Car Class' + super.start();
    }
}
let car = new Car();
console.log(car.start); //'Starting...car'
```

############
//Anyyime a constructor function creates a new object, that object is said to be an instance of its constructor, using instanceof operator we can check and compare between the constructor and the object being made using this constructor
function Dog(name, age){
this.name = name;
this.age = age;
this.numLegs = 4;
}
let bubby = new Dog('mikey', 7);
console.log(bubby instanceof Dog); //true
//avoiding duplicate code using prototype
//imagine we have more than 10 thousandds  instances, all share the same property of numLegs = 4; why every time we have 10 thousands of declaring variable of numLeg  everytime
Dog.prototype.numLegs = 4;
//we have two types of properties when using prototype here
//1- is 'own' property that are the props created using the constructor itself or the instance
//2-proptype props that are created using the prototype
let ownProp = [];
let prototypeProps = [];
for(let prop in bubby){
 if(bubby.hasOwnProperty(prop))
 ownProp.push(prop);
 else
 prototypeProps.push(prop);

//it is better to use instanceof rather than using .constructor since the constructor property can be overwritten
//instead of declaring each property on the proytpe individualy, we can do this
Person.prototype = {  tall: 134, sayHello: function(){console.log(`this is my name ${this.name}`);
//but, one side effect of setting the prototype to a new Object, it erases the constructor property,so
bubby.constructor === Dog; //false
bubby.constructor === Object; //true
//to fix this, whenever a prototype is manually set to a new Object, remember to define the constructor property
Dog.prototype = {
constructor: Dog,
//code
}
//using isPrototypeof
Dog.prototype.isPrototypeof(bubby); //true
bubby instanceof Dog; //true => still works
/*understand Prototype chain*/
//All objects in JavaScript (with a few exceptions) have a prototype. Also, an object’s prototype itself is an object.
function Bird(name){
  this.name = name;
}
typeof Bird.prototype
//Because a prototype is an object, a prototype can have its own prototype! In this case, the prototype of Bird.prototype is Object.prototype:
Object.prototype.isPrototypeOf(Bird.prototype);
//How is this useful? You may recall the hasOwnProperty method from a previous challenge:
let duck = new Bird("Donald");
duck.hasOwnProperty("name"); // yields true
//The hasOwnProperty method is defined in Object.prototype, which can be accessed by Bird.prototype, which can then be accessed by duck. This is an example of the prototype chain. In this prototype chain, Bird is the supertype for duck, while duck is the subtype. Object is a supertype for both Bird and duck. Object is a supertype for all objects in JavaScript. Therefore, any object can use the hasOwnProperty method.
/_use inheritance, so you don't repeat your self_/
//let's assume we have these two codes
function Bird(name){
  this.name = name
}
function Cat(name){
  this.name = name;
}
Bird.prototype = {
  constructor: Bird,
  // describe(){
  //   console.log('my name is ' + this.name)
  // }
}
Cat.prototype = {
  constructor: Cat,
  // describe(){
  //   console.log('my name is ' + this.name)
  // }
}
//it's obvious that we have two prototype sharing the same property
//so we can create supertype or parent and the the child can inheriy from it the duplicate code
function Animal(){}
Animal.prototype = {
  constructor: Animal,
  describe(){
    console.log('my name is '+ this.name)
  }
}
//so now we can delete the describe method from bird and cat
//let's go inherit now
let newAnimal = new Animal(); //this is a little disadvantages to do this using new
//so here an alternative method
let newAnimall = Object.create(Animal.prototype);
//second step is to set the child's prototype to an instance of the parent
Bird.prototype = Object.create(newAnimal);
let newBird = new Bird('meska');
newBird.describe();
//When an object inherits its prototype from another object, it also inherits the supertype's constructor property. Here's an example:
function Bird() { }
Bird.prototype = Object.create(Animal.prototype);
let duck = new Bird();
duck.constructor // function Animal(){...}
//to fix this, we should reset it manually
Bird.prototype.constructor = Bird;
//overrideing the methods and property
//It's possible to override an inherited method. It's done the same way - by adding a method to ChildObject.prototype using the same method name as the one to override.

//sometimes inheritance ain't the best solution when it comes to unrelated Objectm Bird and airplanes can both fly yeah, but they are two different type
//for unrelated objet we should use mixins,A mixin allows other objects to use a collection of functions.
let flyMixin = function(obj){
  obj.fly = function(){
    console.log('Flyinnnng, wooooh!')
  }
}
let bird ={ name: 'bird', legs: 2};
let plane = {model: '777', numOfPassengers: 546 };
flyMixin(bird);
flyMixin(plane);

//Use Closure to Protect Properties Within an Object from Being Modified Externally
//we can change bird.name globally, we need to prevent this behaviour
//The simplest way to make this public property private is by creating a variable within the constructor function. This changes the scope of that variable to be within the constructor function versus available globally. This way, the variable can only be accessed and changed by methods also within the constructor function.
function Dog(){
  let weigth = 15;
  this.getWeigth = function(){
    return weigth;
  }
}
let bubby = new Dog();
console.log(bubby.getWeigth());

//understand immediatley invoked functions expression (IIFE)
(function(){}());
//use an IIFE to create a module
//from a previous example we have two methods
function glideMixin(obj){
  obj.glide = function(){
    console.log('Gliding');
  }
}
function flyMixin(obj){
  obj.fly = function(){
    console.log('flying, wosh!');
  }
}
//we can group these mixins into a module as follows:
let motionModule = (function() {
  return {
    glideMixin: function(obj){
      obj.glide = function(){
        console.log('Gliding on the water!');
      }
    },
    flyMixin: function(obj){
      obj.fly = function(){[
        console.log('flying, woosh!');
      ]}
    }
  }
})();
// The advantage of the module pattern is that all of the motion behaviors can be packaged into a single object that can then be used by other parts of your code. Here is an example using it:
motionModule.glideMixin(duck);
duck.glide();
//objects
let person = {
 name: "yousef",
 age: 3
};
console.log(person.name);
person.age = 4;
person['name'] = "John";
let selectedUser = "name"
person[selectedUser] = "Meska";

###########

//objects

const circle={
 radius: 1,
 locatios: {
  x:1,
  y:2
 },
 isVisible: true,
 draw: function(){
  console.log('Draw');
 }
};

circle.draw(); //Method

//factory functions ==> produce products (returning objects here)
function createCircle(radius){
 return {
 radius: radius, //we can remove the value if the value and the key are the same
 locatios: {
  x:1,
  y:2
 },
 isVisible: true,

 draw() {
  console.log('Draw');
 }
 draw: function(){
  console.log('Draw');
 }
};
}
const circle1 = createCircle(2);
console.log(circle1);
circle1.draw();

//contruction function : [pascal notation]
function CreateCircle(radius){
 this.radius = radius;
 this.draw = function(){
  console.log('Draw');
 }
}

const cricle = new CreateCircle(3);
//[1] this [new] operator create new empty js object, something like this (under the hood)
const x = {};
//[2] then [this] is pointing to the empty object called here x
x ={
 radius: radius,
 draw: function(){
  console.log('Draw');
 }
}
//[3] lastly it will return the [this] object

circle.color = "bluegere";
delete circle.color;
//we can't reassign object, but we can always change it's proprties [Dynamic nature of objects]

##########

let circle = {
    raduis: 1,
    location:{
        x: 1,
        y: 3
    },
    isVisisble: true,
    draw: function(){
        console.log('hello from inside circle object');
    }
};
circle.draw(); //if a function  is inside a object, we call it 'method'
//Factory Function ==> it produce
function createObj(raduis, location){
    return {
        raduis: raduis, //if the key and value are the same name, we can remove the key and keep the value
        //so we can do this instead
        raduis,
        location:{
            x: 1,
            y: 3
        },
        isVisisble: true,
        draw: function(){
            console.log('hello from inside circle object');
        }, //we can shorten the function too this way
        draw(){
           console.log('hello from .......');
        }
    };
}
const circle1 = createObj(1);
console.log(circle1);

//constructor function ==> Pascal notation reqiured
function Circle(radius){
    this.radius = radius;
    this.draw = function(){
        console.log("draw");
    }
}
const circlee = new Circle(1);

//Dynamic nature of objects

const square = {
    radius: 1
};
square.color = "yellow";
square.draw = function(){
    console.log("draw");
}
delete square.color;
// we cannot reassign objects but we can add proprties to it

#########

//cloning objects

const another = {};
for (let key in circle){
    another[key] = circle[key];
} //this is the old way
//the newer way
const aontherObj = Object.assign({ color: 'yellow'} //it can be existing object or props or just empty, circle); //here by using .assign method you can add mulitple objects and combine them into one object

//there is another elegent way to do cloning
const anonther = { ...circle }; // ... ==> for clonging the propteries to this {}

#########

//1-using factory function

function createAddress(street, city, zipCode){
    return {
        street,
        city,
        zipCode
    }
}
let Address = createAddress('a', 'b', 'c');
console.log(Address);

//2-using constructor function

function CreateAddress(street, city, zipCode){
    this.street = street;
    this.city = city;
    this.zipCode = zipCode;
}
let x = new CreateAddress('1', '3', '4');
console.log(x);

//checking equality

let address1 = new Address('a', 'b', 'c');
let address2 = new Address('a', 'b', 'c');

console.log(areEqual(address1, address2));
console.log(areSame(address1 ,address2));

function areEqual(address1, address2){
    return address1.street === address2.street &&
    address1.city === address2.city &&
    address1.zipCode === address2.zipCode;
}
function areSame(){
    return address1 === address2;
}

########
//Constructor property
let x = {}; //Every object in Js has a contructor property and refeenece to the function used to create this Object
//let x = new Object();
//instead of doing this every time
new String('Hello'); // "", '', ``
new Boolean; //we use: true or false
new Number(); //1 3.3

//Functios are Objects
function Circle(radius){
    this.radius = radius;
    this.draw = function(){
        console.log("draw");
    }
}

//this is what actually done and represented when we declare a function const Circle1 = new Function('radius',
 `this.radius = radius;
this.draw = function(){
    console.log("draw");
}`
);
const circle = new Circle1(1); //If we don't use 'new' keyword, 'this' will point to the global object 'Window'

Circle.call({} // this empty object refernece to 'this." ", 1); // == const another = new Circle(1);
Circle.apply({}, [1,2,3]); //it's differenet from call in "it pass the arguemntes on array"

#########

//Enumerating proprties of an Object
const circle = {
    radius: 1,
    draw() {
        console.log("Draw");
    }
}
for (const key in circle) {
    console.log(circle[key]);
}
for (const key of circle) {
    console.log(circle[key]); //this will not work becaue objects are not iteritable
}
//but we can do this
for (const key  of Object.keys(circle //we made it look like an arr)) {
    console.log(circle[key]);
}

for (const entry  of Object.entries(circle //we made it look like an arr)) {
    console.log(entry); //return an array of the keys
}

if('radius' in circle ) console.log('yes'); //to see if  given propties of object is exist

############

/_Destructuring Object_/
let cars = {id: '123', style: 'convertable'};
let id, style;
({id, style} = cars); //we do that in (), because an error will cause if not dut to JS can't understand are we intialinzing a code block or destructurting object
