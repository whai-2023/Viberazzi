const express = require('express')
const hbs = require('express-handlebars')

const fs = require('node:fs/promises')
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
server.get('/', async (req, res) => {
  const pets = await fs.readFile(
    path.join(__dirname, './data/data.json'),
    'utf8'
  )
  res.render('home', JSON.parse(pets))
})

// pet/:id route
server.get('/pets/:id', async (req, res) => {
  const puppiesId = parseInt(req.params.id)

  const puppyData = await fs.readFile(
    path.join(__dirname, './data/data.json'),
    'utf-8'
  )
  const puppies = JSON.parse(puppyData).puppies
  const puppy = puppies.find((puppy) => puppy.id === puppiesId)

  res.render('details', puppy)
  console.log(puppy)
})

module.exports = server
