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
  // console.log(puppy)
})

server.get('/addpet', (req, res) => {
  res.render('addpet')
})

// localhost:3000/addpet
server.post('/addpet', async (req, res) => {
  // console.log('req.body: ', req.body)

  const newPet = {
    id: Math.floor(Math.random() * 1000 + 4),
    name: req.body.yourPetsName,
    owner: req.body.owner,
    breed: req.body.breed,
    description: req.body.known_for,
  }

  console.log('newPet: ', newPet)

  const puppyData = await fs.readFile(
    path.join(__dirname, './data/data.json'),
    'utf-8'
  )
  const pets = JSON.parse(puppyData)

  const newFileContents = { ...pets }

  newFileContents.puppies.push(newPet)

  res.redirect('/')

  await fs.writeFile(
    path.resolve(__dirname, './data/data.json'),
    JSON.stringify(newFileContents, null, 2)
  )
})

module.exports = server
