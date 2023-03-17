// module imports 
const axios = require('axios')
// const moment = require('moment')
// mongoose model for database queries
// const AirframeDataModel = require('./airframeModel')
// scheduled function and unknown airframe list
const cronjobs = require('./cronjobs')

// human readable keys mapping for data from goFlightLabs
// eslint-disable-next-line no-unused-vars
const humanReadableDataKeys = {
  airplaneIataType: 'Aircraft Type',
  airplaneId: 'Manufacturers ID',
  codeIataAirline: 'Airline Code',
  codeIataPlaneLong: 'Aircraft Type Code',
  codeIataPlaneShort: 'Aircraft Type Code abbr.',
  codeIcaoAirline: 'ICAO Airline Code',
  constructionNumber: 'Construction Number',
  deliveryDate: 'Date Delivered',
  enginesType: 'Engine Type',
  firstFlight: 'First Flight',
  hexIcaoAirplane: 'Aircraft Hex Code',
  lineNumber: 'Aircraft Line Number',
  modelCode: 'Aircraft Model Code',
  numberRegistration: 'Registration',
  numberTestRgistration: 'Test Registration',
  planeAge: 'Aircraft Age',
  planeClass: 'Aircraft Class',
  planeModel: 'Aircraft Model',
  planeOwner: 'Aircraft Owner',
  planeSeries: 'Aircraft Series',
  planeStatus: 'Airframe Status',
  productionLine: 'Production Line',
  registrationDate: 'Registration Date',
  rolloutDate: 'Roll out Date'
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
    console.log(`scheduled arrivals data fetched for ${scheduledArrivalsResponse.data.scheduled_arrivals.length} flights`)
    scheduledArrivalsResponse.data.scheduled_arrivals.forEach(flight => console.log(flight.ident))
   
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
    console.log(error)
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
        link: aircraftPhoto.data.photos[0].link,
        credit: aircraftPhoto.data.photos[0].photographer,
      })
    } else return null
  } catch (error) {
    console.log(error.data)    
    return null
  }
}

// get airframe data from database or goflightlabs
// eslint-disable-next-line no-unused-vars
async function getAirframeData(tailNumber, unfindableAirframes) {
// currently disabled: goflightlabs API unavailable
  return null

  // if airframe previously searched and failed, don't try again
  //   if (unfindableAirframes.includes(tailNumber)) {
  //     console.log(`airframe data for ${tailNumber} is unfindable`)
  //     return null
  //   }
  //   // find airframe data in database
  //   const airframeData = await AirframeDataModel.find({registration: tailNumber})
  //   if (airframeData.length > 0) {
  //     console.log(`airframe data for ${tailNumber} from database`)
  //     return airframeData[0].data
  //   } else {
  //     // query goflightlabs api for airframe data
  //     try {
  //       const airframeDataGoFlightLabs = await axios.get(`https://app.goflightlabs.com/airplanes?access_key=${process.env.flightlabs_api_key}&numberRegistration=${tailNumber}`)
  //       if (airframeDataGoFlightLabs.data.success){
  //         console.log(`airframe data for ${tailNumber} from goflightlabs`)
  //         // js magic to remove entries with no data. 
  //         // use Object.entries to split each key, value pair into an array.
  //         // use filter to remove any pair where value[1].length is not greater than 1
  //         // use map to convert valid iso 8601 dates into date strings
  //         // also map returned keys into human readable keys
  //         // use Object.fromEntries to create a new object with the returned values
  //         const goflightlabsdata = Object.fromEntries(
  //           Object.entries(airframeDataGoFlightLabs.data.data[0])
  //             .filter(value => value[1] && value[1].length > 1)
  //             .map((value) => {
  //               if (Object.keys(humanReadableDataKeys).includes(value[0])){
  //                 value[0] = humanReadableDataKeys[value[0]]
  //               }
  //               if (moment(value[1], 'YYYY-MM-DDTHH:mm:ss.sssZ', true).isValid()){
  //                 return [value[0], new Date(value[1]).toDateString()]
  //               }else return [value[0],value[1]]
  //             }))
  //         // save airframe data to database to avoid repeated queries
  //         const newAirframe = new AirframeDataModel({
  //           registration: tailNumber,
  //           data: goflightlabsdata
  //         })
  //         console.log('Saving airframe data to database')
  //         newAirframe.save()
  //         return goflightlabsdata
  //       }  else {
  //         // if airframe data not found, schedule for scraping
  //         console.log(`moving ${tailNumber} to scheduled cronjob`)
  //         cronjobs.unknownAirframes(tailNumber)
  //         return null
  //       }
  //     } catch (error) {
  //       // if airframe data not found, schedule for scraping
  //       console.log(`moving ${tailNumber} to scheduled cronjob`)
  //       cronjobs.unknownAirframes(tailNumber)
  //       return null
  //     }
  //   }
}

// flag for throttling requests if fetch is in progress
let fetchingInProgress = false

let cachedData

// update data when throttle is timed out and new request is made
async function updateData() {
  // set flag to delay other requests in queue
  fetchingInProgress = true
  console.log(`fetching state ${fetchingInProgress}`)
    
  // get list of unfindable airframes, so no redundant queries are made
  const unfindableAirframes = await cronjobs.getUnfindableData()
  console.log(`unfindable airframe numbers ${unfindableAirframes}`)
  // get scheduled arrivals data
  const scheduledArrivals = await getScheduledArrivals()
  if(scheduledArrivals === 'error') return ('error')
  //   console.log(scheduledArrivals)
  
  // get photos
  for (let i=0; i < scheduledArrivals.length; i++) {
    console.log(`fetching photo for ${scheduledArrivals[i].ident} (${scheduledArrivals[i].registration}) [${i+1}/${scheduledArrivals.length}]`)
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
    console.log(`fetching airframe data for ${arrivalsWithPhoto[i].registration} [${i+1}/${arrivalsWithPhoto.length}]`)
    const airframeData = await getAirframeData(arrivalsWithPhoto[i].registration, unfindableAirframes)
    if(!airframeData) counter++
    arrivalsWithPhoto[i]['airframeData'] = airframeData
  }
  console.log(`airframe data missing for ${counter} aircraft`)

  // sample formatted data 
  //   const sampleData =[
  //     {
  //       ident: 'AAL2431',
  //       registration: 'N933NN',
  //       aircraft_type: 'B738 ',
  //       origin_airport: 'Chicago O\'Hare Intl',
  //       origin_city: 'Chicago',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T18:10:00Z',
  //       estimated_off: '2023-03-13T18:40:49Z',
  //       scheduled_on: '2023-03-13T22:07:00Z',
  //       estimated_on: '2023-03-13T22:31:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 1761,
  //       filed_ete: 14220,
  //       filed_altitude: 340,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/06609/1205220_d43e9eb1d0_280.jpg',
  //         width: 420,
  //         link: 'https://www.planespotters.net/photo/1205220/n933nn-american-airlines-boeing-737-823wl?utm_source=api',
  //         credit: 'Jon Marzo'
  //       },
  //       airframeData: {
  //         airplaneIataType: 'B737-800',
  //         codeIataAirline: 'AA',
  //         codeIataPlaneLong: 'B738',
  //         codeIataPlaneShort: '73H',
  //         constructionNumber: '31173',
  //         deliveryDate: 'Wed Jul 24 2013',
  //         enginesType: 'JET',
  //         firstFlight: 'Mon Jul 08 2013',
  //         hexIcaoAirplane: 'ACF207',
  //         lineNumber: 'Thu Dec 31 4539',
  //         modelCode: 'B737-823(ET) WIN.',
  //         numberRegistration: 'N933NN',
  //         planeModel: '737',
  //         planeOwner: 'Wilmington Trust Company',
  //         planeSeries: '823',
  //         planeStatus: 'active',
  //         productionLine: 'Boeing 737 NG',
  //         registrationDate: '0000-00-00'
  //       }
  //     },
  //     {
  //       ident: 'SKW3640',
  //       registration: 'N317SY',
  //       aircraft_type: 'E75L ',
  //       origin_airport: 'San Jose Int\'l',
  //       origin_city: 'San Jose',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T21:36:00Z',
  //       estimated_off: '2023-03-13T21:41:22Z',
  //       scheduled_on: '2023-03-13T22:15:00Z',
  //       estimated_on: '2023-03-13T22:31:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 327,
  //       filed_ete: 2340,
  //       filed_altitude: 330,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/32462/1391945_a68b851542_280.jpg',
  //         width: 419,
  //         link: 'https://www.planespotters.net/photo/1391945/n317sy-delta-connection-embraer-erj-175lr-erj-170-200-lr?utm_source=api',
  //         credit: 'Jan Seler'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'DAL2272',
  //       registration: 'N331NB',
  //       aircraft_type: 'A319 ',
  //       origin_airport: 'San Francisco Int\'l',
  //       origin_city: 'San Francisco',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T20:40:00Z',
  //       estimated_off: '2023-03-13T21:44:00Z',
  //       scheduled_on: '2023-03-13T21:31:00Z',
  //       estimated_on: '2023-03-13T22:32:00Z',
  //       status: 'En Route / Delayed',
  //       route_distance: 359,
  //       filed_ete: 3060,
  //       filed_altitude: 330,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/30949/1389593_fd50818a83_280.jpg',
  //         width: 420,
  //         link: 'https://www.planespotters.net/photo/1389593/n331nb-delta-air-lines-airbus-a319-114?utm_source=api',
  //         credit: 'Jon Marzo'
  //       },
  //       airframeData: {
  //         airplaneIataType: 'A319-100',
  //         codeIataAirline: 'DL',
  //         codeIataPlaneLong: 'A319',
  //         codeIataPlaneShort: '319',
  //         constructionNumber: 'Sat Dec 31 1566',
  //         deliveryDate: 'Wed Aug 22 2001',
  //         enginesType: 'JET',
  //         firstFlight: 'Tue Jul 24 2001',
  //         hexIcaoAirplane: 'A39AB4',
  //         modelCode: 'A319-114',
  //         numberRegistration: 'N331NB',
  //         numberTestRgistration: 'D-AVYU',
  //         planeAge: '16',
  //         planeModel: 'A319',
  //         planeOwner: 'Delta Air Lines Inc',
  //         planeSeries: '114',
  //         planeStatus: 'active',
  //         productionLine: 'Airbus A318/A319/A32',
  //         registrationDate: 'Wed Aug 22 2001',
  //         rolloutDate: 'Thu Jan 06 2000'
  //       }
  //     },
  //     {
  //       ident: 'NKS628',
  //       registration: 'N926NK',
  //       aircraft_type: 'A20N ',
  //       origin_airport: 'Dallas-Fort Worth Intl',
  //       origin_city: 'Dallas-Fort Worth',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T19:25:00Z',
  //       estimated_off: '2023-03-13T19:31:19Z',
  //       scheduled_on: '2023-03-13T22:32:00Z',
  //       estimated_on: '2023-03-13T22:33:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 1276,
  //       filed_ete: 11220,
  //       filed_altitude: 360,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/08752/1394682_077beb0298_280.jpg',
  //         width: 407,
  //         link: 'https://www.planespotters.net/photo/1394682/n926nk-spirit-airlines-airbus-a320-271n?utm_source=api',
  //         credit: 'Cameron Stone'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'SVA41',
  //       registration: 'HZ-AK41',
  //       aircraft_type: 'B773 ',
  //       origin_airport: 'King Abdulaziz Int\'l',
  //       origin_city: 'Jeddah',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T06:25:00Z',
  //       estimated_off: '2023-03-13T06:39:00Z',
  //       scheduled_on: '2023-03-13T22:55:00Z',
  //       estimated_on: '2023-03-13T22:33:59Z',
  //       status: 'En Route / On Time',
  //       route_distance: 8329,
  //       filed_ete: 59400,
  //       filed_altitude: 280,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/28774/1365000_735baddf84_280.jpg',
  //         width: 497,
  //         link: 'https://www.planespotters.net/photo/1365000/hz-ak41-saudi-arabian-airlines-boeing-777-368er?utm_source=api',
  //         credit: 'OCFLT_OMGcat'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'SKW3878',
  //       registration: 'N270SY',
  //       aircraft_type: 'E75L ',
  //       origin_airport: 'San Diego Intl',
  //       origin_city: 'San Diego',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T22:02:00Z',
  //       estimated_off: '2023-03-13T22:12:16Z',
  //       scheduled_on: '2023-03-13T22:17:00Z',
  //       estimated_on: '2023-03-13T22:36:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 109,
  //       filed_ete: 900,
  //       filed_altitude: 100,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/04707/1111473_b84a9f5b49_280.jpg',
  //         width: 497,
  //         link: 'https://www.planespotters.net/photo/1111473/n270sy-delta-connection-embraer-erj-175lr-erj-170-200-lr?utm_source=api',
  //         credit: 'Issac Chan'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'SKW4873',
  //       registration: 'N509SY',
  //       aircraft_type: 'E75L ',
  //       origin_airport: 'San Antonio Intl',
  //       origin_city: 'San Antonio',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T19:31:00Z',
  //       estimated_off: '2023-03-13T19:23:00Z',
  //       scheduled_on: '2023-03-13T22:35:00Z',
  //       estimated_on: '2023-03-13T22:38:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 1229,
  //       filed_ete: 11040,
  //       filed_altitude: 320,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/01315/1386018_232dfd2b6f_280.jpg',
  //         width: 420,
  //         link: 'https://www.planespotters.net/photo/1386018/n509sy-american-eagle-embraer-erj-175lr-erj-170-200-lr?utm_source=api',
  //         credit: 'Ruoyang Yan'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'DAL2265',
  //       registration: 'N323NB',
  //       aircraft_type: 'A319 ',
  //       origin_airport: 'Portland Intl',
  //       origin_city: 'Portland',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T20:35:00Z',
  //       estimated_off: '2023-03-13T20:49:29Z',
  //       scheduled_on: '2023-03-13T22:27:00Z',
  //       estimated_on: '2023-03-13T22:40:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 880,
  //       filed_ete: 6720,
  //       filed_altitude: 330,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/01228/1396743_b1cc3b8246_280.jpg',
  //         width: 448,
  //         link: 'https://www.planespotters.net/photo/1396743/n323nb-delta-air-lines-airbus-a319-114?utm_source=api',
  //         credit: 'Marc Charon'
  //       },
  //       airframeData: {
  //         airplaneIataType: 'A319-100',
  //         codeIataAirline: 'DL',
  //         codeIataPlaneLong: 'A319',
  //         codeIataPlaneShort: '319',
  //         constructionNumber: 'Fri Dec 31 1452',
  //         deliveryDate: 'Wed Mar 14 2001',
  //         enginesType: 'JET',
  //         firstFlight: 'Thu Feb 22 2001',
  //         hexIcaoAirplane: 'A37AA3',
  //         modelCode: 'A319-114',
  //         numberRegistration: 'N323NB',
  //         numberTestRgistration: 'D-AVWE',
  //         planeAge: '16',
  //         planeModel: 'A319',
  //         planeOwner: 'Delta Air Lines Inc',
  //         planeSeries: '114',
  //         planeStatus: 'active',
  //         productionLine: 'Airbus A318/A319/A32',
  //         registrationDate: 'Wed Mar 14 2001',
  //         rolloutDate: 'Sat Jan 01 2000'
  //       }
  //     },
  //     {
  //       ident: 'AAR204',
  //       registration: 'HL8308',
  //       aircraft_type: 'A359 ',
  //       origin_airport: 'Incheon Int\'l',
  //       origin_city: 'Seoul (Incheon)',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T11:50:00Z',
  //       estimated_off: '2023-03-13T12:08:08Z',
  //       scheduled_on: '2023-03-13T22:27:00Z',
  //       estimated_on: '2023-03-13T22:44:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 5988,
  //       filed_ete: 38220,
  //       filed_altitude: 350,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/36193/1331203_28139fca3e_280.jpg',
  //         width: 419,
  //         link: 'https://www.planespotters.net/photo/1331203/hl8308-asiana-airlines-airbus-a350-941?utm_source=api',
  //         credit: 'Wolfgang Kaiser'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'JBU2223',
  //       registration: 'N2142J',
  //       aircraft_type: 'A21N ',
  //       origin_airport: 'John F Kennedy Intl',
  //       origin_city: 'New York',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T16:10:00Z',
  //       estimated_off: '2023-03-13T17:16:06Z',
  //       scheduled_on: '2023-03-13T21:32:00Z',
  //       estimated_on: '2023-03-13T22:44:00Z',
  //       status: 'En Route / Delayed',
  //       route_distance: 2559,
  //       filed_ete: 19320,
  //       filed_altitude: 340,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/48859/1325948_058538d51e_280.jpg',
  //         width: 420,
  //         link: 'https://www.planespotters.net/photo/1325948/n2142j-jetblue-airways-airbus-a321-271nx?utm_source=api',
  //         credit: 'Chris Pitchacaren'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'DAL1017',
  //       registration: 'N920DU',
  //       aircraft_type: 'B739 ',
  //       origin_airport: 'New Orleans Intl',
  //       origin_city: 'New Orleans',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T18:52:00Z',
  //       estimated_off: '2023-03-13T18:48:51Z',
  //       scheduled_on: '2023-03-13T22:46:00Z',
  //       estimated_on: '2023-03-13T22:45:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 1700,
  //       filed_ete: 14040,
  //       filed_altitude: 260,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/26987/1288850_ebcdcf326f_280.jpg',
  //         width: 497,
  //         link: 'https://www.planespotters.net/photo/1288850/n920du-delta-air-lines-boeing-737-932erwl?utm_source=api',
  //         credit: 'OCFLT_OMGcat'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'AAL1459',
  //       registration: 'N904AN',
  //       aircraft_type: 'B738 ',
  //       origin_airport: 'Austin-Bergstrom Intl',
  //       origin_city: 'Austin',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T19:40:00Z',
  //       estimated_off: '2023-03-13T19:47:08Z',
  //       scheduled_on: '2023-03-13T22:40:00Z',
  //       estimated_on: '2023-03-13T22:49:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 1255,
  //       filed_ete: 10800,
  //       filed_altitude: 300,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/02082/774824_93a2ccbe2a_280.jpg',
  //         width: 420,
  //         link: 'https://www.planespotters.net/photo/774824/n904an-american-airlines-boeing-737-823wl?utm_source=api',
  //         credit: 'Jan Seler'
  //       },
  //       airframeData: {
  //         airplaneIataType: 'B737-800',
  //         codeIataAirline: 'AA',
  //         codeIataPlaneLong: 'B738',
  //         codeIataPlaneShort: '73H',
  //         constructionNumber: '29506',
  //         deliveryDate: 'Sun Mar 07 1999',
  //         enginesType: 'JET',
  //         firstFlight: 'Sun Feb 14 1999',
  //         hexIcaoAirplane: 'AC7E15',
  //         lineNumber: 'Wed Dec 31 0206',
  //         modelCode: 'B737-823(ET) WIN.',
  //         numberRegistration: 'N904AN',
  //         planeAge: '18',
  //         planeModel: '737',
  //         planeSeries: '823',
  //         planeStatus: 'active',
  //         productionLine: 'Boeing 737 NG',
  //         registrationDate: 'Sun Mar 07 1999'
  //       }
  //     },
  //     {
  //       ident: 'VOI924',
  //       registration: 'XA-VLN',
  //       aircraft_type: 'A320 ',
  //       origin_airport: 'Lic. Jesus Teran Peredo Int\'l',
  //       origin_city: 'Aguascalientes',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T19:50:00Z',
  //       estimated_off: '2023-03-13T20:01:18Z',
  //       scheduled_on: '2023-03-13T22:41:00Z',
  //       estimated_on: '2023-03-13T22:55:00Z',
  //       status: 'En Route / On Time',
  //       route_distance: 1295,
  //       filed_ete: 10260,
  //       filed_altitude: 370,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/38245/1396654_a02a4005ba_280.jpg',
  //         width: 419,
  //         link: 'https://www.planespotters.net/photo/1396654/xa-vln-volaris-airbus-a320-233wl?utm_source=api',     
  //         credit: 'Felipe Garcia R.'
  //       },
  //       airframeData: null
  //     },
  //     {
  //       ident: 'EVA12',
  //       registration: 'B-16721',
  //       aircraft_type: 'B77W ',
  //       origin_airport: 'Taiwan Taoyuan Int\'l',
  //       origin_city: 'Taipei',
  //       destination_airport: 'Los Angeles Intl',
  //       destination_city: 'Los Angeles',
  //       scheduled_off: '2023-03-13T11:30:00Z',
  //       estimated_off: '2023-03-13T11:53:14Z',
  //       scheduled_on: '2023-03-13T22:52:00Z',
  //       estimated_on: '2023-03-13T22:57:31Z',
  //       status: 'En Route / On Time',
  //       route_distance: 6794,
  //       filed_ete: 40920,
  //       filed_altitude: 350,
  //       photo: {
  //         photo: 'https://t.plnspttrs.net/32374/1392943_7f6f175907_280.jpg',
  //         width: 419,
  //         link: 'https://www.planespotters.net/photo/1392943/b-16721-eva-airways-boeing-777-35eer?utm_source=api', 
  //         credit: 'Jan Seler'
  //       },
  //       airframeData: null
  //     }
  //   ]
  cachedData = arrivalsWithPhoto
  fetchingInProgress = false 
  // store cached data and set fetching flag to false
  console.log(`fetching state ${fetchingInProgress}`)
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
      console.log('updating cached data')
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
        // delay requests by 5 seconds, if fetching flag is still true, delay again
        if(!fetchingInProgress) {
          clearInterval(timeoutInterval)
          console.log('returning cached data')
          return cachedData
        } else {
          console.log('data being fetched, timing out request again')
        }
      }
      console.log('data fetch in progress, setting timeout for request')
      const timeoutInterval = setInterval(timeoutWhileFetching, 5000)
    }
  }
}

// route each request through throttle function
const getData = throttle(updateData, 300000)

// module exports
module.exports = getData