/* 
notes.js

This script contains necessary code to handle routes to /api/notes:

	It handles GET  	requests to /api/notes
	It handles POST 	requests to /api/notes
	It handles DELETE requests to /api/notes/:node_id

Copyright Leo Wong 2022
*/

// modularize route logic. This utility is exported at the end of this file.
const notes = require('express').Router();

// destructure imported object into utility functions from helper file fsUtils.js
// readFromFile will be used to read database with a promise
// readAndAppend will be used to read database, append data to it, then rewrite the database
// writeToFile will be used to rewrite the database
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// call utility library from NPM that is used to generate a unique id
const { v4: uuidv4 } = require('uuid');

// implement route handler for GET request to /api/notes/
notes.get('/', (req, res) => {
	console.log('hello');
	readFromFile('db/db.json').then((data) => res.json(JSON.parse(data)));
});

// implement route handler for POST request to /api/notes/
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

// implement route handler for DELETE request to /api/notes/:note_id
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
