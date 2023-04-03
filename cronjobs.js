// const AirframeDataModel = require('./airframeModel')
// const scraperAirportData = require('./ScraperAirportData')
// const scraperAirframes = require('./ScraperAirframes')

// let unknownAirframeNumbers = []
// airframes not found on goflightlabs are sent here
// if not already present in list, add to list
// const unknownAirframes = (tailNumber) => {
//   if (!unknownAirframeNumbers.includes(tailNumber)){
//     unknownAirframeNumbers.push(tailNumber)
//   }
// }

// retrieve list of unfindable airframes
// async function getUnfindableData() {
//   const unfindableAirframeData = await AirframeDataModel.find({registration: 'unavailable'})
//   return unfindableAirframeData[0].data
// }

// async function scrapeUnknownAirframes() {
//   // start scraping function
//   console.log(`Running scraping function on ${new Date().toString().slice(0,24)}`)
//   console.log(`Scheduled to find: ${unknownAirframeNumbers}`)
//   function delay (ms) {
//     // eslint-disable-next-line no-unused-vars
//     return new Promise((resolve,reject) => setTimeout(resolve,ms))
//   }
//   let unfindableData  = await getUnfindableData()
//   let updateFlag = false

//   // if unknown airframe list contains unfindable airframes, remove them
//   // limit scraping to 10 airframes
//   const scrapeDataFor = unknownAirframeNumbers
//     .filter(registration => {
//       if(unfindableData.includes(registration)){
//         console.log(`unfindable airframe ${registration}`)
//         return false
//       } else {
//         return true
//       }
//     }).slice(0,10)
  
//   // reset unknown airframe list
//   unknownAirframeNumbers = []

//   console.log(`scraping data for ${scrapeDataFor}`)
  
//   // scrape airframe data
//   for (let i=0; i < scrapeDataFor.length; i++){
//     // check database if airframe present
//     const checkDatabase = await(AirframeDataModel.find({registration: scrapeDataFor[i]}))
//     if(checkDatabase.length === 0){
//       console.log(`${scrapeDataFor[i]} not found in database. Continuing scraping`)
//     } else {
//       console.log(`${scrapeDataFor[i]} found in database, skipping scraping`)
//       continue
//     }
    
//     // if airframe data not found from flight-labs, scrape data from airport-data.com
//     console.log(`trying airport-data for ${scrapeDataFor[i]}`)
//     const airframeDataAirportData = await scraperAirportData.performScrapingAirportData(scrapeDataFor[i])
//     if(Object.keys(airframeDataAirportData).length > 0) {
//       const newAirframe = new AirframeDataModel({
//         registration: scrapeDataFor[i],
//         data: airframeDataAirportData
//       })
//       await newAirframe.save()
//       console.log(`airframe data for ${scrapeDataFor[i]} from airport-data saved`)

//     } else {
        
//       // if airframe data not found from airport-data.com, scrap airframes.org
//       console.log(`trying airframes.org for ${scrapeDataFor[i]}`)
//       const airframeDataAirframes = await scraperAirframes.performScrapingAirFrames(scrapeDataFor[i])
//       if(Object.keys(airframeDataAirframes).length > 0) {
//         const newAirframe = new AirframeDataModel({
//           registration: scrapeDataFor[i],
//           data: airframeDataAirframes
//         })
//         await newAirframe.save()
//         console.log(`airframe data for ${scrapeDataFor[i]} from airframes saved`)
//       } else {

//         // if no data found by scraping, add to unfindable data
//         unfindableData.push(scrapeDataFor[i])
//         updateFlag = true
//         // airframe data not found
//         console.log(`airframe data for ${scrapeDataFor[i]} not found`)
//       }
//       // set 2 minute time out between scraping
//       await delay(120000)
//     }
//   }
//   // update unfindable airframe list
//   if (updateFlag) {
//     await AirframeDataModel.findOneAndUpdate({registration:'unavailable'}, {registration: 'unavailable', data:unfindableData}, {returnDocument: 'after'})
//       .then(result => {
//         console.log(`updated unfindable data: ${result.data}`)
//       })
//   }
// }

// module.exports = {
//   unknownAirframes: unknownAirframes,
//   //   scrapeUnknownAirframes: scrapeUnknownAirframes,
//   getUnfindableData: getUnfindableData
// }

const axios = require('axios')
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: `${process.env.openAI_api_key}`,
})
const openai = new OpenAIApi(configuration)

let cachedWeatherData
let cacheUpdateFlag = false

const resetCacheUpdateFlag = () => {
  console.log('running scheduled function. resetting cacheupdateflag')
  cacheUpdateFlag = false
}

// function to get metar from flightaware and decode using chatGPT
async function decodeMetar(){
  try {
    const flightawareMetar = await axios.get('https://aeroapi.flightaware.com/aeroapi/airports/KLAX/weather/observations?temperature_units=Fahrenheit&return_nearby_weather=false',
      {
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': `${process.env.flightaware_api_key}`
        }
      })
    const rawMetar = flightawareMetar.data.observations[0].raw_data
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {'role': 'system', 'content': 'Decode this metar and explain its contents'},
        {'role': 'user', 'content': `${rawMetar}`}],
    })
    return [rawMetar, 'Decoded using ChapGPT. If you found this useful please consider supporting the website via the link at the bottom.\n ChatGPT is expensive when used. Thank you!\n\n'+completion.data.choices[0].message.content]
  } catch (error) {
    console.log(error.data)
    return [null,null]        
  }
}

// function to get weather data from openweathermap
async function getWeather() {
  try {
    const laxweather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=33.94&lon=-118.40&appid=${process.env.openweather_api_key}&units=metric`)
    const {weather:[{description, icon}], main:{temp: tempMetric, humidity}, wind:{speed: speedMetric, deg}, sys:{sunrise, sunset}} = laxweather.data
    const weather = {
      weatherDesc: description.charAt(0).toUpperCase()+description.slice(1),
      weatherIcon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      tempCelsius: tempMetric.toString().split('.')[0]+'°C',
      tempFahrenheit: ((tempMetric * 9/5) + 32).toString().split('.')[0]+'°F',
      weatherHumidity: humidity.toString()+' %',
      windspeedMetric: speedMetric.toString().split('.')[0]+' m/s',
      windspeedImperial: (speedMetric * 2.23694).toString().split('.')[0]+' mph',
      windDirection: deg.toString()+'°',
      sunriseTime: new Intl.DateTimeFormat('en', { timeStyle: 'short', timeZone: 'America/Los_Angeles' }).format(new Date(sunrise * 1000)) ?? 'n/a',
      sunsetTime: new Intl.DateTimeFormat('en', { timeStyle: 'short', timeZone: 'America/Los_Angeles' }).format(new Date(sunset * 1000)) ?? 'n/a',
    }
    return weather
  } catch (error) {
    console.log(error.data)
    return {}
  }
}

async function updateWeather() {
  console.log('updating weather')
  const weatherOpenWeather = await getWeather()
  const metar = await decodeMetar()
  weatherOpenWeather['metar'] = metar[0]
  weatherOpenWeather['decodedMetar'] = metar[1] 
  cachedWeatherData = weatherOpenWeather
  cacheUpdateFlag = true
  console.log(cachedWeatherData)
}

async function weatherThrottle() {
  if (!cacheUpdateFlag) {
    console.log('updating weather cache')
    await updateWeather()
    return cachedWeatherData
  } else {
    console.log('returning cached weather data')
    return cachedWeatherData
  }
}

// module exports
module.exports = {
  resetCacheUpdateFlag: resetCacheUpdateFlag,
  weatherThrottle: weatherThrottle
}