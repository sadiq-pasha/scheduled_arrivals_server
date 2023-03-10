// module imports
require('dotenv').config()
const cors = require('cors') 

// initialize express server
const express = require('express')
const app = express()

// schedule data fetch
const scheduledFunctions = require('./cronjobs')

// middleware 
app.use(express.json())
app.use(cors())
// scheduledFunctions.initScheduledJobs()

// route handling
app.get('/', (request, response) => {
  const data = scheduledFunctions.getData()
  response.json(data)
})

// port declaration and server start
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})