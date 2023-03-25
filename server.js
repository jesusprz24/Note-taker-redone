//telling it to use the required dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

// sets up the app using express
const app = express();

// sets the port to be used on localhost:3001 in the browser
const PORT = process.env.PORT || 3001;

// this is the middleware, it is used for requests that will match the public directory (css, html, javascript)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// used as a route to the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// used as a route to the db.json file, should return the saved notes
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

// used as a route to the index.html file
// index.html file should appear as the home page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// this code block will read the db.json file, then uses a post request and assigns it to newNote
app.post('/api/notes', (req, res) => {
    var newNote = req.body;
    var noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    var noteLength = (noteList.length).toString();
    
    newNote.id = noteLength;
    noteList.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    res.join(noteList);
})

// this will delete the saved notes with the linked ids
app.delete('/api/notes/:id', (req, res) => {
    var noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    var noteId = req.params.id;
    var newNote = noteList.filter(note => note.id !== noteId);
    fs.writeFileSync('./db/db.json', JSON.stringify(newNote));
    res.json(newNote);
})

// if deployed correctly should prompt this in the command line, 'Server is listening on PORT (PORT #)'
app.listen(PORT, () => console.log('Server is listening on PORT ' + PORT));