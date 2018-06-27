let download = require("download");
let fetch = require("node-fetch")
let fs = require("fs");
let unzip = require("unzip");
let fstream = require("fstream");

function updateProgress(i) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${i - start}/${end - start}`);
}

async function getLatestSong() {
    let response = await fetch(`https://beatsaver.com/api.php?mode=new&off=0`);
    let result = await response.json();
    return result[0].id;
}


async function getSongs() {
    let files = fs.readdirSync(`downloads/`);
    let names = files.map(ele => parseInt(ele.split(".")[0]));
    let start = Math.max(...names);
    let end = await getLatestSong();

    console.log(`Starting at ${start}, ending at ${end}`);

    for (let i = start; i <= end; i++) {
        // updateProgress(i);
        if (!fs.existsSync(`downloads/${i}.zip`)) {
            console.log(`Checking if ${i}.zip exists`);
            try {
                let request = fetch(`https://beatsaver.com/files/${i}.zip`);
                let response = await request;
                if (response.status === 200) {
                    console.log(`Downloading ${i}.zip`)
                    let myDownload = await download(`https://beatsaver.com/files/${i}.zip`, `downloads`);
                    let readStream = fs.createReadStream(`downloads/${i}.zip`);
                    let writeStream = fstream.Writer('unzip/');
                    console.log(`unzipping ${i}.zip`);
                    try {
                        readStream.pipe(unzip.Parse()).pipe(writeStream);
                    } catch (error) {
                        console.log(`Error with extracting ${i}.zip`);
                    }
                }
            } catch (e) {
                console.log(`Error with fetching ${i.zip}`);
            }
        } else {
            console.log(`File ${i}.zip already exists`);
        }
    }
    files = fs.readdirSync(`downloads/`);
    names = files.map(ele => parseInt(ele.split(".")[0]));
    start = Math.max(...names);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Newest file ${start}`);
}

getSongs();

async function unzipDownloads() {
    let files2 = fs.readdirSync(`downloads/`);
    for (let ele in files2) {
        console.log(ele)
        if (fs.existsSync(`downloads/${ele}.zip`)) {
            try {
                console.log(`unzipping ${ele}`);
                let readStream = fs.createReadStream(`downloads/${ele}.zip`);
                let writeStream = fstream.Writer('unzip/');
                await readStream.pipe(unzip.Parse()).pipe(writeStream);
                console.log(`Sucessfully extracted ${ele}.zip`);
            } catch (error) {
                console.log(`Error with extracting ${ele}.zip`);
            }
        }
    }
}

// unzipDownloads();