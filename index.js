/* eslint-disable no-irregular-whitespace */
// module imports
require('dotenv').config()
const cors = require('cors') 
const mongoose = require('mongoose')
const path = require('path')
const cron = require('node-cron')

// initialize express server
const express = require('express')
const app = express()

// setup mongoDB connection
mongoose.set('strictQuery',false)
mongoose.connect(`${process.env.mongoDB_url}`)
console.log('connected to MongoDB')

// request counter
let requestCounter = 0

// get data function
const getData = require('./getData')

// unknown endpoint
const unknownEndpoint = (request, response) => {
  response.sendFile(path.resolve('build/index.html'))
}

// middleware 
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

// schedule cronjob every 30 mins past the hour
const scheduledFunctions = require('./cronjobs')
cron.schedule('0 * * * *', function() {
  scheduledFunctions.resetCacheUpdateFlag()
})

// route handling
app.get('/data', async(request, response) => {
  requestCounter = requestCounter + 1

  const data = await getData()

  if (data === 'error') {
    response.statusCode = 503
    response.json({error:'flightaware API unavailable'}).end()
  } else {
    response.json(data)
  }
})

app.use(unknownEndpoint)

// port declaration and server start
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// close connection to mongoDB when server stopped
const cleanUp = (eventType) => {
  mongoose.connection.close(() => {
    console.log(eventType)
    console.log('database connection closed')
  })
};
  
['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
  process.on(eventType, cleanUp.bind(null, eventType))
})