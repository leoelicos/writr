const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
	console.log('hello');
	readFromFile('db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new UX/UI note
notes.post('/', (req, res) => {
	console.log(`bear`);
	console.log(req.body);

	const { title, text } = req.body;

	if (req.body) {
		const newNote = {
			title,
			text,
			note_id: uuidv4(),
		};

		readAndAppend(newNote, 'db/db.json');
		res.json(`note added successfully 🚀`);
	} else {
		res.error('Error in adding note');
	}
});

// DELETE Route for a specific note
notes.delete('/:note_id', (req, res) => {
	const noteId = req.params.note_id;
	readFromFile('db/db.json')
		.then((data) => JSON.parse(data))
		.then((json) => {
			// Make a new array of all notes except the one with the ID provided in the URL
			const result = json.filter((note) => note.note_id !== noteId);

			// Save that array to the filesystem
			writeToFile('db/db.json', result);

			// Respond to the DELETE request
			res.json(`Item ${noteId} has been deleted 🗑️`);
		});
});

module.exports = notes;
