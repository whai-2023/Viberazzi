const express = require('express')
const hbs = require('express-handlebars')

const fs = require('fs')
const path = require('path')

const server = express()

// Server configuration
const publicFolder = __dirname + '/public'
server.use(express.static(publicFolder))
server.use(express.urlencoded({ extended: false }))

// Handlebars configuration
server.engine('hbs', hbs.engine({ extname: 'hbs' }))
server.set('view engine', 'hbs')
server.set('views', __dirname + '/views')

// Your routes/router(s) should go here

// homepage route
server.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, './data/data.json'), 'utf8', (err, data) => {
    if (err) {
      res.send('Error reading file')
    } else {
      res.render('home', JSON.parse(data))
    }
  })
})

module.exports = server
