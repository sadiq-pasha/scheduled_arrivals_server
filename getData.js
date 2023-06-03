/* eslint-disable no-unused-vars */
// module imports 
const axios = require('axios')
const moment = require('moment')
const weather = require('./cronjobs')

// mongoose model for database queries
const AirframeDataModel = require('./airframeModel')

// human readable keys mapping for data from aeroDataBox
const humanReadableDataKeys = {
  'id': null,
  'reg': 'Aircraft Tail Number',
  'active':null,
  'serial': 'Serial Number',
  'hexIcao': 'Hex Code',
  'airlineId': null,
  'airlineName': 'Airline',
  'iataCodeShort': null,
  'iataCodeLong': null,
  'model': 'Aircraft Model',
  'modelCode': 'Model Code',
  'numSeats': 'Seating Capacity',
  'rolloutDate': 'Roll Out Date',
  'firstFlightDate': 'First Flight',
  'deliveryDate': 'Delivery Date',
  'registrationDate': 'Registration Date',
  'typeName': 'Aircraft Type',
  'numEngines': 'Number of Engines',
  'engineType': null,
  'isFreighter': null,
  'productionLine': 'Production Line',
  'ageYears': 'Age (years)',
  'verified': 'Verified Information'
}
// get scheduled arrivals data from flightaware.com AeroAPI
async function getScheduledArrivals() {
  const fetchTime = new Date()
  let startTime = new Date()
  let endTime = new Date()
  endTime.setUTCHours(startTime.getUTCHours() + 1)
  console.log(`Fetching scheduled arrivals data on ${fetchTime.toString().slice(0,24)} PST\nQuery parameters:\n start: ${startTime.toString().slice(0,24)} PST (${startTime.toISOString().slice(0,19)}Z)\n end: ${endTime.toString().slice(0,24)} PST (${endTime.toISOString().slice(0,19)}Z)`)
 
  // remove milliseconds from ISO time format as per API guidelines AND url encode the values
  startTime = encodeURIComponent(startTime.toISOString().split('.')[0]+'Z')
  endTime = encodeURIComponent(endTime.toISOString().split('.')[0]+'Z')
  try {
    const scheduledArrivalsResponse = await axios.get(`https://aeroapi.flightaware.com/aeroapi/airports/KLAX/flights/scheduled_arrivals?type=Airline&start=${startTime}&end=${endTime}&max_pages=1`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': `${process.env.flightaware_api_key}`
        }
      })

    // extract required flight data from response
    // if flight registration number not present, remove flight from list
    const flightData = scheduledArrivalsResponse.data.scheduled_arrivals.map(({
      ident = 'unknown',
      registration,
      aircraft_type = 'unknown',
      origin:{
        name: origin_airport = 'unknown',
        city: origin_city = 'unknown'
      },
      destination:{
        name: destination_airport = 'unknown',
        city: destination_city = 'unknown'
      },
      scheduled_off = 'unknown',
      estimated_off = 'unknown',
      scheduled_on = 'unknown',
      estimated_on = 'unknown',
      status = 'unknown',
      route_distance = 'unknown',
      filed_ete = 'unknown',
      filed_altitude = 'unknown'
    }) => {
      if (registration){
        return {
          ident:ident,
          registration: registration,
          aircraft_type: aircraft_type,
          origin_airport: origin_airport,
          origin_city: origin_city,
          destination_airport: destination_airport,
          destination_city: destination_city,
          scheduled_off: scheduled_off,
          estimated_off: estimated_off,
          scheduled_on: scheduled_on,
          estimated_on: estimated_on,
          status: status,
          route_distance: route_distance,
          filed_ete: filed_ete,
          filed_altitude: filed_altitude
        }
      } else {
        return ('registration unknown')
      }
    })

    // flights with no registration number are undefined. Filter them out.
    return flightData.filter(flight => flight.registration)
  }
  catch(error){
    console.log(error.data)
    return ('error')
  }
}

// get photos from planespotters public API
async function getPhotoData(tailNumber) {
  try {
    const aircraftPhoto = await axios.get(`https://api.planespotters.net/pub/photos/reg/${tailNumber}`)
    // if photo available, extract photo link, thumbnail size, href and credits
    if (aircraftPhoto.data.photos.length > 0) {
      return({
        photo: aircraftPhoto.data.photos[0].thumbnail_large.src,
        width: aircraftPhoto.data.photos[0].thumbnail_large.size.width,
        height: aircraftPhoto.data.photos[0].thumbnail_large.size.height,
        link: aircraftPhoto.data.photos[0].link,
        credit: aircraftPhoto.data.photos[0].photographer,
      })
    } else return null
  } catch (error) {
    console.log(error.data)
    return null
  }
}

// get airframe data from database or aerodatabox
async function getAirframeData(tailNumber) {
  // find airframe data in database
  const airframeData = await AirframeDataModel.find({registration: tailNumber})
  if (airframeData.length > 0) {
    console.log(`airframe data for ${tailNumber} from database`)
    return airframeData[0].data
  } else {
    return null
    // query aerodatabox api for airframe data
    // try {
    //   const airframeDataAeroDataBox = await axios.get(`https://aerodatabox.p.rapidapi.com/aircrafts/reg/${tailNumber}`,
    //     {
    //       headers: {
    //         'X-RapidAPI-Key': `${process.env.aerodatabox_api_key}`,
    //         'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    //       }
    //     })

    //   // js magic to remove entries with no data. 
    //   // use Object.entries to split each key, value pair into an array.
    //   // use filter to remove any pair where value doesn't exist or key is defined as null
    //   // use map to convert valid iso 8601 dates into date strings
    //   // also map returned keys into human readable keys
    //   // use Object.fromEntries to create a new object with the returned values
    //   const airframedataSanitized =  Object.fromEntries(
    //     Object.entries(airframeDataAeroDataBox.data)
    //       .filter(value => value[1] && humanReadableDataKeys[value[0]])
    //       .map((value) => {
    //         if (Object.keys(humanReadableDataKeys).includes(value[0])){
    //           value[0] = humanReadableDataKeys[value[0]]
    //         }
    //         if (moment(value[1], 'YYYY-MM-DDTHH:mm:ss', true).isValid()){
    //           return [value[0], new Date(value[1]).toDateString()]
    //         } else{
    //           return [value[0],value[1]]
    //         }
    //       })
    //       .sort(function(a,b){return a[0].localeCompare(b[0])})
    //   )
    //   // save airframe data to database to avoid repeated queries
    //   const newAirframe = new AirframeDataModel({
    //     registration: tailNumber,
    //     data: airframedataSanitized
    //   })
    //   console.log(`Saving ${tailNumber} airframe data to database`)
    //   newAirframe.save()
    //   return airframedataSanitized
    // } catch (error) {
    //   console.log(error.data)
    //   return null
    // }
  }
}

// flag for throttling requests if fetch is in progress
let fetchingInProgress = false

let cachedData = {message:'This is a test'}

// update data when throttle is timed out and new request is made
async function updateData() {
  // set flag to delay other requests in queue
  fetchingInProgress = true
  console.log('updating cached data')
    
  // get list of unfindable airframes, so no redundant queries are made
  //   const unfindableAirframes = await cronjobs.getUnfindableData()
  
  // get scheduled arrivals data
  const scheduledArrivals = await getScheduledArrivals()
  if(scheduledArrivals === 'error') {
    fetchingInProgress = false
    cachedData = 'error'
    return cachedData
  }
  
  // get photos
  for (let i=0; i < scheduledArrivals.length; i++) {
    const photo = await getPhotoData(scheduledArrivals[i].registration)
    scheduledArrivals[i]['photo'] = photo
  }
  const arrivalsWithPhoto = scheduledArrivals.filter(data => data.photo)
  console.log(`scheduled arrivals data and photos fetched for ${arrivalsWithPhoto.length} flights`)
  console.log(`photos missing for ${scheduledArrivals.length - arrivalsWithPhoto.length} aircraft`)
  //   console.log(arrivalsWithPhoto)

  // get airframe data
  let counter = 0
  for (let i=0; i < arrivalsWithPhoto.length; i++){
    const airframeData = await getAirframeData(arrivalsWithPhoto[i].registration)
    if(!airframeData) counter++
    arrivalsWithPhoto[i]['airframeData'] = airframeData
  }
  console.log(`airframe data missing for ${counter} aircraft`)

  // fetch weather data
  const weatherInfo = await weather.weatherThrottle()

  cachedData = {weather: weatherInfo, data: arrivalsWithPhoto}
  fetchingInProgress = false 
  // store cached data and set fetching flag to false
  console.log('cache update complete')
  return cachedData
}

// throttle function to limit data fetches
// timer set to allow new data fetch every 5 minutes
const throttle = (updateData, timeDelay) => {
  // throttle timer initially undefined
  let throttleTimer
  return async () => {
    // if throttle timer undefined and fetching flag is false
    // data is more than 5 minutes old, update data
    if (!throttleTimer && !fetchingInProgress) {
      console.log(`starting throttle timer for ${timeDelay/1000/60} minutes`)
      await updateData()
      // reset throttle function to null after 5 mins to allow cache updates
      throttleTimer = setTimeout(() => {
        console.log('stopping throttle timer')
        throttleTimer = null
      }, timeDelay)
      console.log('updated cache, returning cached data')
      return cachedData
    } else if (throttleTimer && !fetchingInProgress) {
      // throttle timer set: data has been updated within the last 5 minutes
      // return cached data
      console.log('returning cached data')
      return cachedData
    } else {
      // fetching flag is set, data is currently being fetched, delay all requests
      const timeoutWhileFetching = () => {
        return new Promise((resolve) => {
          const intervalId = setInterval(() => {
            if (!fetchingInProgress) {
              clearInterval(intervalId)
              console.log('fetching completed, returning cached data')
              resolve(cachedData)
            } else {
              console.log('data being fetched, timing out request again')
            }
          }, 5000)
        })
      }
      console.log('data fetch in progress, setting timeout for request')
      return await timeoutWhileFetching()
    }
  }
}

// route each request through throttle function
const getData = throttle(updateData, 300000)

// module exports
module.exports = getData