---
layout: post
title: Clutter to To Be DeCluttered
subtitle: 
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [nodejs]
---
Topics:

- Event Loop And It's phases
- Child Process
- V8 and Libuv
- Streams
- Events and Buffers
- Execution Context
- Closures
- Prototypical Inheritance

Most _but not all_ of the Questions are based on my real journey, you could also take a look here <a href="https://www.fullstack.cafe/interview-questions/nodejs">Node.Js Interview Questions</a>
---------------------------------------------------------------------------

<details>
<summary><strong>Event Loop and It's phases</strong></summary>

--------------------------------------------------------------------

<details>
    <summary><strong>misc</strong></summary>
Node Globals

setTimeout()

clearTimeout()

clearInterval()

setInterva()

we've also global

global.setTimeout();

variable are not added to the global object

```js
let my_var = 13;
_;

console.log(global.my_var); // undefine
```
