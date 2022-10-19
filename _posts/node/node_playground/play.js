const { createReadStream, createWriteStream } = require("fs");

const stream = createReadStream("./text.js", { highWaterMark: 1, encoding: "utf-8" });
const writer = createWriteStream("./anotherText.js")

let iteration = 0;
stream.on("data", (data) => {
    stream.pause();
    console.log(iteration++);

    writer.write(data);
    setTimeout(() => { // we are simulating that our coding something before resuming
        stream.resume();
    }, 1000)
})