// express is an npm library package which links client requests to server responses
const express = require('express')

// path is a Node standard library package which provides utilities for working with file and directory paths
const path = require('path')

// clog is a custom unmounted middleware which logs all requests to the server
const { clog } = require('./middleware/clog')

// import modular router for /api
const api = require('./routes/index')

// process.env.PORT is a requirement for Heroku deployment: https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error
const PORT = process.env.PORT || 3001

// assign variable for readability
const app = express()

// function to start application
function init() {
  // implement middleware for logging all requests to the server
  app.use(clog)

  // implement middleware for parsing JSON
  app.use(express.json())

  // implement middleware for parsing urlencoded form data
  app.use(express.urlencoded({ extended: true }))

  // implement middleware for handling /api routes
  app.use('/api', api)

  // implement mounted middleware for handling / routes
  app.use(express.static('public'))

  // implement GET Route for notes page
  app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/assets/pages/notes.html')))

  // implement wildcard route to direct users to index.html
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')))

  // implement server
  app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`))
}

// call function to start application
init()
