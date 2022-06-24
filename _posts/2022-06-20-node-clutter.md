---
layout: post
title: Clutter to To Be DeCluttered
subtitle: 
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [node]
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

<details>
<summary>Execution Context</summary>

Execution Context has two main phases:

1. Creation phase
2. Execution Phase

```js
b();
console.log(a);

var a = 'welcome'

function b(){
    console.log("b is called")
}
```

```js
function a(){
    b();
    var c;
}

function b(){
    var b;
}

a();
var d;
```

</details>

---------------------------------------------------------------------------
<details>
<summary><strong>Event Loop and It's phases</strong></summary>

### Some of Node Internals

1. Event Loop

2. V8

3. Libuv and thread pool

Javascript is single threaded and event loop allow for asynchrounus tasks, but does this fact make node single threaded?

First, let's begin with the difference between compiled and interpreted language

| Compiled                                                                              | Interpreted                                                      |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Errors are detected during compiling                                                  | errors found when the code is run                                |
| the code won't compile until it's error free                                          | the interpreter translates and runs code one statement at a time |
| language written and compiled to machine code inside of an appplication [all at once] | interpreted run more slowly                                      |
| c, c++ ,Erlang, Go                                                                    | Node                                                             |
|                                                                                       |                                                                  |

![](./screenshots/compiled.jpg)
You should read those articles to know the journey of executing JS code from your local machine into the browser
<details>
<summary><strong>Read Further</strong></summary>

- <a href="https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c">javascript-event-loop-vs-node-js-event-loop</a>

- <a href="https://blog.insiderattack.net/five-misconceptions-on-how-nodejs-works-edfb56f7b3a6">five-misconceptions-on-how-nodejs-works</a>

- <a href="https://blog.insiderattack.net/deep-dive-into-worker-threads-in-node-js-e75e10546b11">deep-dive-into-worker-threads-in-node-js</a>

- <a href="https://blog.insiderattack.net/crossing-the-js-c-boundary-advanced-nodejs-internals-part-1-cb52957758d8">crossing-the-js-c-boundary-advanced-nodejs-internals (part 1)</a>
- <a href="https://blog.insiderattack.net/promises-next-ticks-and-immediates-nodejs-event-loop-part-3-9226cbe7a6aa">promises-next-ticks-and-immediates-nodejs-event-loop (part 3)</a>

- <a href="https://blog.insiderattack.net/timers-immediates-and-process-nexttick-nodejs-event-loop-part-2-2c53fd511bb3">timers-immediates-and-process-nexttick-nodejs-event-loop-part (part 2)</a>

- <a href="https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810">event-loop-and-the-big-picture-nodejs-event-loop-part-1</a>

- <a href="https://blog.insiderattack.net/nodejs-streams-in-practice-980b3cdf4511">nodejs-streams-in-practice</a>

- <a href="https://blog.insiderattack.net/understanding-async-resources-with-async-hooks-3416de574f30">understanding-async-resources-with-async-hooks</a>

- <a href="https://www.youtube.com/watch?v=_c51fcXRLGw">link</a>

- <a href="https://www.youtube.com/watch?v=zphcsoSJMvM">link</a>

- <a href="https://blog.insiderattack.net/handling-io-nodejs-event-loop-part-4-418062f917d1">link</a>

- <a href="https://soshace.com/16-node-js-lessons-event-loop-libuv-library-pt-1/">16-node-js-lessons-event-loop-libuv-library-pt-1</a>

- <a href="https://soshace.com/16-node-js-lessons-event-loop-libuv-library-pt-2/">16-node-js-lessons-event-loop-libuv-library-pt-2</a>

- <a href="https://www.youtube.com/playlist?list=PLEfl6gYIDWgYmMGpQYYvc49escwlGvDUa">link</a>

- <a href="https://developpaper.com/viewing-nodejs-event-loop-from-libuv/">viewing-nodejs-event-loop-from-libuv</a>

- <a href="https://codingdao.com/libuv-source-analysis/pages/update/2016/04/25/tcp-io.html">link</a>

- <a href="https://github.com/yjhjstz/deep-into-node">deep-into-node</a>

- <a href="https://www.youtube.com/watch?v=LbwUETu7Rgc&list=PLFNSe3O8DiOQwYOUXr08sfaeCWn5SbWPS&index=3">link</a>
- <a href="https://www.telerik.com/blogs/journey-of-javascript-downloading-scripts-to-execution-part-i">link</a>
- <https://www.youtube.com/watch?v=oPo4EQmkjvY> (important)

- <a href="https://www.smashingmagazine.com/2020/04/nodejs-internals/">Node Internal</a>
- <a href="https://betterprogramming.pub/javascript-internals-under-the-hood-of-a-browser-f357378cc922">Javascript under the hood of a browser</a> (very important)

</details>

There are six phases of the event loop

1. Timers: executes callbacks using timers

, if there are timers set to `0 ms` or `setImmediate()`, they will run here, Incomplete timers will run in later iterations of the loop

2. Pending -> internal phase

3. Idle/Prepare -> internal phase

4. Poll - process I/O callbacks [fs, and etc]

5. Check - execute any `setImmediate()` timers added in the poll phase

6. Close - if all timers and i/o calls are done; the loop closes and the process ends, if not so, the loop continues till the there are not more timers or I/O calls

![](./screenshots/event-loop-1.jpg)
> `process.nextTick()` will alway run at the end of whichever phase is called and before the next phase
>
> usually the tasks running here are called `microtasks`

exerices for event loop

```js
console.log("Print Fifth");
console.log("print third");
console.log("Print first");
console.log("print second");
console.log("Print Fourth");
```

print them in order using event loop phases

```js
const fs = require("fs");
process.on("beforeExist", () => console.log("Print Fifth"));
setTimeout(() => console.log("Print Third"));

process.nextTick(() => console.log("Print Second"));

console.log("Print First");
fs.readFile(__filename, () => {
  setImmediate(() => console.log("Print Forth"));
});
```

each phase has it's own queue.

</details>

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

### The module system

```js
Module Wrapper Function
(function (exports, require, module, __filename, __dirname){
    // your code
    console.log(__filename);
    console.log(__dirname);
    module.exports = something;
})()
```

require and exports, etc are local to every module (file)

node added new timer called `setImmediate` which allows you to run async code within input-output block without circling back to the start of the event loop

`console.log` on the browser is part of the development tools, on node it's part of node itself and print to the terminal

`process` is not available on the browser APIs, because it relates only to the process of running file with node.js,

the main task of the `process` is to give you information about the current process running and you can add additional events before the process ends

or to give the `process` additional arguments entered when running node [provide input]

console.log(module);

```js
$ node index.js var1 var2
[
    '/usr/local/bin/node',
    '/Users/user/Desktop/app/index.js',
    'var1',
    'var2'
]
const logger = require('utils/logger')
```

> It is standard to name the const the same as the file or module name. Omitting the file extension is safe and common practice

> but it is best practice to log to a file to save the data rather than just logging to the termina

```js
console.log("Server ready"); // show to the terminal using stdout
console.log("Server failed"); // show to the terminal using stderr
```

### process

process is just regular module on node

`beforeExit` allows for asynchronous calls which can make the process continue whereas `exit` only happens once all synchronous and asynchronous code is complete.

`process.stdout` and `console.log` is nearly identiacally the same, but one major difference is `process.stdout` does not enfore line breaks which is useful when creating progress bars

`process.argv` allows you to pass in arguments to your application which can be a common occurrence when needing to parse data from files.

`process.nextTick` allows you to run js between the different phases of the event loop

| Interpreted Language | The language is read by a runtime and executed on the spot and errors are found on execution |
| -------------------- | -------------------------------------------------------------------------------------------- |

```js
process.exitCode = 1;
process.on("beforeExist", () => {
  console.log("beforeExist event");
});
process.on("exit", (code) => {
  console.log(`exit event with code ${code}`);
});
console.log(process.env);

process.stdout.write("Hello world");
console.log(process.argv); // Array of argument passed
```

`path` module allows for cross-platform usage

1. `.resolve` get the absolute path from relative one

2. `.normalize` Normalizes any path by removing instances of `.` , turning double slashes into single slashes and removing a directory when `..` is found.

3. `.join` join strings to a directory

```js
const path = require("path");
console.log(path.resolve("index.js")); //root/bin/desktop/etc
console.log(path.normalize("./app//src//util/.."));
// app/src
console.log(path.join("/app", "src", "util", "..", "/index.js"));

// prints  /app/src/index.js
```

```js
import {promises as fsPromises} from 'fs';
const writeData = async () => {
    try{
    const openedFile = await fsPromises.open("writefile.txt", "a+");
    let newFile = await fsPromises.writeFile("writeFile.txt", "hello world");
    await openedFile.write("welcome");
    } catch(err){
        console.error(err);
    }
}
writeData();


const readFile = async () => {
    try{
        const buff = new Buffer.alloc(26); //space for 26 characters
        let openedFile = fsPromises.open('readFile.txt', "a+");
        await (await openedFile).read(buff, 0, 26);
        let readEntireFile = await fsPromises.readFile("writeFile.txt", "utf-8");
        console.log(readFile);
        console.log(buff);
    } catch(err){
        console.log(err);
    }

}
```

1. .write()

   1. does not overwrite content

   2. file must be open first

      ```js
      write(data, options)
      ```

2. .writeFile()

   1. overwrites existing file

      ```js
      writeFile(path, data, options)
      ```

***reading***

1. .read()

   1. read entire file

   2. read part of a file

   3. file must be openeed first

   4. requires a buffer to store read data

      ```js
      .read(buffer, options)
      ```

2. .readFile()

   1. read entire file

   2. more popular choice

      ```js
      .readFile(path, options)
      ```

**moving and renaming**

- renaming and moving are the same

- .rename()

- change path argument

- use .mkdir() if the directroy doesn't exist

`.rename(original_path, new_path)`

**Deleting files and directories**

- `.unlink()` method to remove file

- `.rmdir()` remove dir, will fail if the dir is not empty

- you can use 3rd path module `rimraf` to delete directories with files

`unlink(path), rmdir(path)`

</details>

--------------------------------------------------------------------

<details>
    <summary><strong>Internals</strong></summary>

<https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c>
<https://blog.insiderattack.net/five-misconceptions-on-how-nodejs-works-edfb56f7b3a6>
<https://blog.insiderattack.net/deep-dive-into-worker-threads-in-node-js-e75e10546b11>
<https://blog.insiderattack.net/crossing-the-js-c-boundary-advanced-nodejs-internals-part-1-cb52957758d8>
<https://blog.insiderattack.net/promises-next-ticks-and-immediates-nodejs-event-loop-part-3-9226cbe7a6aa>
<https://blog.insiderattack.net/timers-immediates-and-process-nexttick-nodejs-event-loop-part-2-2c53fd511bb3>
<https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810>
<https://blog.insiderattack.net/nodejs-streams-in-practice-980b3cdf4511>

<https://blog.insiderattack.net/understanding-async-resources-with-async-hooks-3416de574f30>
<https://www.youtube.com/watch?v=_c51fcXRLGw>
<https://www.youtube.com/watch?v=zphcsoSJMvM>
<https://blog.insiderattack.net/handling-io-nodejs-event-loop-part-4-418062f917d1>
<https://soshace.com/16-node-js-lessons-event-loop-libuv-library-pt-1/>
<https://soshace.com/16-node-js-lessons-event-loop-libuv-library-pt-2/>
<https://www.youtube.com/playlist?list=PLEfl6gYIDWgYmMGpQYYvc49escwlGvDUa>
<https://developpaper.com/viewing-nodejs-event-loop-from-libuv/>
<https://codingdao.com/libuv-source-analysis/pages/update/2016/04/25/tcp-io.html>
<https://github.com/yjhjstz/deep-into-node>
<https://www.youtube.com/watch?v=LbwUETu7Rgc&list=PLFNSe3O8DiOQwYOUXr08sfaeCWn5SbWPS&index=3>

<https://www.youtube.com/watch?v=oPo4EQmkjvY> (important)

</details>

------------------------------------------

<details>

<summary><strong>Child Process</strong></summary>

</details>

------------------------------------------

<details>

<summary><strong>Stream</strong></summary>

</details>

------------------------------------------

<details>

<summary><strong>Event And Buffers</strong></summary>

</details>

------------------------------------------

<details>

<summary><strong>V8 and Libuv</strong></summary>

</details>

--------------------------------

<details>
<summary><strong>Closures</strong></summary>

```js
function greet(x){
    return function(name){
        console.log(`${x}, {name}`);
    }
}
let hi = greet('hi');
hi('yousef');
```

```js
function buildFunctions(){
    var arr = [];
    for(var i = 0; i < 3; i++){
        arr.push(function(){
            console.log(i);
        })
    }
    return arr;
}
var fs = buildFunctions();
fs[0]();
fs[1]();
fs[2]();
```

```js
function buildFunctions(){
    var arr = [];
    for(var i = 0; i < 3; i++){
        let j = i;
        arr.push(function(){
            console.log(j);
        })
    }
    return arr;
}
```

using ES5, we can get around this problem

```js
function buildFunctions(){
    var arr  = [];
    for(var i = 0; i < 3; i++){
        arr.push(
            (function(j){
                console.log(j);
            })(i)
        )
    }
    return arr;
}
```

</details>

----------------------------------------------------------------------------

<details>
<summary>Prototypical Inheritance</summary>

</details>
### References

Resources To get You up and Running

- Node.Js in action [Book]

-
