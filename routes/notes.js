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
	readFromFile('db/db.json').then((data) => res.json(JSON.parse(data)));
});

// implement route handler for POST request to /api/notes/
notes.post('/', (req, res) => {
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
	// destructure note_id from the database;
	const { note_id } = req.params;

	// read from the database
	readFromFile('db/db.json')
		// parse the read data into an array
		.then((data) => JSON.parse(data))

		// iterate through the array
		.then((json) => {
			// check that note_id in DELETE request actually exists in the database
			const idExists = json.find((note) => note.note_id === note_id);

			// if note_id doesn't exist in the database
			// respond to the DELETE request with 404
			if (idExists === undefined) {
				res.status(404).json('Note ${note_id} not found in database');
			} else {
				// filter out the note that has been found
				const result = json.filter((note) => note.note_id !== note_id);

				// rewrite database with new array of filtered notes
				writeToFile('db/db.json', result);

				// if note_id existed in the database and has been deleted
				// respond to the DELETE request with 201
				res.status(201).json(`Note ${note_id} has been deleted from database`);
			}
		});
});

module.exports = notes;
