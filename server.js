const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
let dir = process.cwd();

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.redirect('./public/index.html')
})


//folder searching
app.get('/files/:path?', async(req, res) => {
    let currdir = dir;
    var query = req.params.path || '';
    if (query) {
        currdir = path.join(dir, query);
        dir = currdir;
    }
    console.log("browsing " + currdir);
    fs.readdir(currdir, (err, files) => {
        if (err) {
            res.status(401).json("Error reading the directory : " + currdir);
        }
        let data = [];
        if (files) {
            for (let file of files) {
                let isDirectory = fs.statSync(path.join(currdir, file)).isDirectory();
                if (isDirectory) {
                    data.push({
                        "name": file,
                        "type": "Directory",
                        "directory": currdir
                    });
                } else {
                    let filetype = path.extname(file);
                    data.push({
                        "name": file,
                        "type": "File",
                        "extension": filetype,
                        "directory": currdir
                    });
                }
            }
            res.status(200).json(data);
        } else {
            res.status(401).json({ message: "Error reading the files" });
        }

    })
});


//moving back
app.get('/back', async(req, res) => {
    let currdir = path.join(dir, '../');
    dir = currdir;
    console.log("browsing " + currdir);
    fs.readdir(currdir, (err, files) => {
        if (err) {
            res.status(401).json("Error reading the directory : " + currdir);
        }
        let data = [];
        for (let file of files) {
            let isDirectory = fs.statSync(path.join(currdir, file)).isDirectory();
            if (isDirectory) {
                data.push({
                    "name": file,
                    "type": "Directory",
                });
            } else {
                let filetype = path.extname(file);
                data.push({
                    "name": file,
                    "type": "File",
                    "extension": filetype
                });
            }
        }
        res.status(200).json(data);
    })
})

//create file with timestamp as file name
app.get('/addfile', async(req, res) => {
    let date = new Date() //.replace(/T/, ' ').replace(/\..+/, '');
    let newfilename = `./file-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.txt`;
    fs.writeFile(path.join(dir, newfilename), "New file Created", (err) => {
        if (err) throw err;
        console.log('File Created!!');
        res.status(200).json({ message: "File Created" });
    })
})



app.listen(port, () => { console.log("server started at 4000!!") })