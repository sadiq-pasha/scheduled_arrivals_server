const AirframeDataModel = require('./airframeModel')
// const scraperAirportData = require('./ScraperAirportData')
// const scraperAirframes = require('./ScraperAirframes')

let unknownAirframeNumbers = []
// airframes not found on goflightlabs are sent here
// if not already present in list, add to list
const unknownAirframes = (tailNumber) => {
  if (!unknownAirframeNumbers.includes(tailNumber)){
    unknownAirframeNumbers.push(tailNumber)
  }
}

// retrieve list of unfindable airframes
async function getUnfindableData() {
  const unfindableAirframeData = await AirframeDataModel.find({registration: 'unavailable'})
  return unfindableAirframeData[0].data
}

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

module.exports = {
  unknownAirframes: unknownAirframes,
  //   scrapeUnknownAirframes: scrapeUnknownAirframes,
  getUnfindableData: getUnfindableData
}