const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');
const util = require('util');

const dbFile = require('../db/db.json');

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch (err) {
            return cb && cb(err)
        }
    })
}

module.exports = (app) => {

    app.delete('/api/notes/:id', (req, res) => {
        jsonReader('public/assets/db/db.json', (err, note) => {
            if (err) {
                console.log(err);
                return;
            }

            for (let [i, item] of note.entries()) {
                if (item.id === req.params.id) {
                    note.splice(i, 1);
                    console.log(note);
                    fs.writeFile('public/assets/db/db.json', JSON.stringify(note), err => {
                        if (err) throw err;
                    })
                    
                } else {
                    console.log("Nothing to be deleted");
                }
            }
            return;
        })
    })

    app.post('/api/notes/', (req, res) => {
        jsonReader('public/assets/db/db.json', (err, note) => {
            if (err) {
                console.log(err);
                return;
            }
            res.send(note);
            console.log(note);
            var newObj = {
                "title": req.body.title,
                "text": req.body.text,
                "id": uuidv4()
            };
            dbFile.push(newObj);
            fs.writeFile("public/assets/db/db.json", JSON.stringify(dbFile), err => {
                if (err) throw err;
                console.log("Done Writing")
                return;
            })
        })
        return;

    })

    app.get('/api/notes', (req, res) => {
        jsonReader('public/assets/db/db.json', (err, note) => {
            if (err) {
                console.log(err);
                return;
            }
            res.send(note);
            return;
        })
    })

}