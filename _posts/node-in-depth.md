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

---------------------------------------------------

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
