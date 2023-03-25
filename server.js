const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__filename, '/public/index.html'));
});


app.post('/api/notes', (req, res) => {
    var newNote = req.body;
    var noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    var noteLength = (noteList.length).toString();
    
    newNote.id = noteLength;
    noteList.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    res.join(noteList);
})