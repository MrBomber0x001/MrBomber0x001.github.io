# Processes and Graceful shutdown

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
