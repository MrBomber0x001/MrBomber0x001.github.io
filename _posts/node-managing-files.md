---
layout: post
title: How to Properly manage files using NodeJs
subtitle:
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/t-sql.jpg
share-img: /assets/img/path.jpg
tags: [nodejs]
---

## Table of Contents

- Reading from and to Writing files
  - Partial read/write
  - Full read/write
  - Different methods used (Sync, Async)
- handling streams

Reasons to Read to a file

- load data into database: convering delimited file and loading it onto a database

- display contents of log files

the optiona avaiable to manipulating files are alot ranging from async reading to sync

to partial from full

### Reading Full File

**Reading a file asyncrounsly**

`readFile` open the file and load all the content into memory

`readFile(path, encoding, callback(err, data))`:

if we didn't specify an encoding, the system will default to `Buffer`

```js
const {readFile} = require('fs');
readFile("./data/example.cs", "utf-8", (err, data) => {
    const vals = convertCsv(data);
    console.table(vals);
})
```

**Reading file sync**

```js
const {readFileSync} = require('fs');
try{
    const data = readFileSync("./data/example.cs", "utf-8");
    console.table(convertCsv(data));
} catch(error){
    throw new Error(`An Error occured: ${error}`)
}
```

**Reading file using promisify**

In order to promisify to work, function passed to it must have the standard `callback` which follow the err first then data cb(err, data), if the order is different you'll get unexpected results

```js
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
readFile("./data/pulitzer-circulation-data.csv", "utf-8")
  .then((data) => {
    console.table(convertCsv(data));
  })
  .catch((err) => {
    throw new Error(`Error happend`);
  });

const readAsync = async () => {
    const data = await readFile("./data/example.cs", "utf-8");
    console.table(convertCsv(data));
}
readAsync();
```

### Reading File Partially

sometimes you need to view the last 10 requests of a log file containing 1000000 of  requests

reading the entire file will cause the file to be loaded into the memory which consumes more space and we don't need this type of situation

`open`, `read`

`open(path, (err, fd))`

`read(fd, buffer, bufferOffset, HowMuchToRead, WhereToStartReadingOnTheFile)

bufferOffset is where to start inserting into the Buffer not the file!

if for example specifiy the bufferOffset to be 5, then the first byte read from the file will be stored on the 5 byte on the buffer

what is fd?

the os track the currently opening files on a table  assigning to each opening file an indentifier called file descriptor

on linux: integer

on windows: 32-bit handle

fs library returns numeric descriptor for each opening file

most os have file limit

```js
const { convertCsv } = require("./csv.parse");
const { open, read } = require("fs");

open("./data/app.log", (err, fd) => {
  const buffer = Buffer.alloc(200);
  read(fd, buffer, 0, buffer.length, 0, (err, count, buff) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(count);
    console.table(convertCsv(buff.toString()));
  });
});
```

**Reading A chunk at a time**

you need to know how big is the file, so you know how many bytes you need to read

`fs.stat` give us information about the file

```js
const { open, read, stat } = require("fs");

let totalSize = 0;
stat("./data/app.log", (err, { size }) => (totalSize = size));

open("./data/app.log", (err, fd) => {
  const buffer = Buffer.alloc(200);
  for (let i = 0; i < totalSize / buffer.length; i++) {
    read(
      fd,
      buffer,
      0,
      buffer.length,
      i * buffer.length,
      (err, count, buff) => {
        console.table(buff.toString());
      }
    );
  }
});
```

There's mainly one problem here

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
