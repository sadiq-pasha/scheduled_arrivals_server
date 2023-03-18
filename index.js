// module imports
require('dotenv').config()
const cors = require('cors') 
const mongoose = require('mongoose')
// const cron = require('node-cron')
const path = require('path')

// initialize express server
const express = require('express')
const app = express()

// setup mongoDB connection
mongoose.set('strictQuery',false)
mongoose.connect(`${process.env.mongoDB_url}`)
console.log('connected to MongoDB')

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
// const scheduledFunctions = require('./cronjobs')
// cron.schedule('*/30 * * * *', function() {
//   scheduledFunctions.scrapeUnknownAirframes()
// })

// route handling
app.get('/data', async(request, response) => {
  console.log('Scheduled arrivals data requested')
  const data = [
    {
      'ident': 'QFA17',
      'registration': 'VH-ZNE',
      'aircraft_type': 'B789 ',
      'origin_airport': 'Sydney',
      'origin_city': 'Sydney',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T11:05:00Z',
      'estimated_off': '2023-03-17T11:16:07Z',
      'scheduled_on': '2023-03-18T01:01:00Z',
      'estimated_on': '2023-03-18T00:29:40Z',
      'status': 'En Route / On Time',
      'route_distance': 7690,
      'filed_ete': 50160,
      'filed_altitude': 370,
      'photo': {
        'photo': 'https://t.plnspttrs.net/42840/1343278_356bc6cd73_280.jpg',
        'width': 420,
        'link': 'https://www.planespotters.net/photo/1343278/vh-zne-qantas-boeing-787-9-dreamliner?utm_source=api',
        'credit': 'TommyNG'
      },
      'airframeData': null
    },
    {
      'ident': 'FDX749',
      'registration': 'N145FE',
      'aircraft_type': 'B763 ',
      'origin_airport': 'Memphis Intl',
      'origin_city': 'Memphis',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T20:28:00Z',
      'estimated_off': '2023-03-17T20:45:00Z',
      'scheduled_on': '2023-03-18T00:13:00Z',
      'estimated_on': '2023-03-18T00:30:00Z',
      'status': 'Scheduled / Delayed',
      'route_distance': 1617,
      'filed_ete': 13500,
      'filed_altitude': 380,
      'photo': {
        'photo': 'https://t.plnspttrs.net/00994/1366262_3f48b00594_280.jpg',
        'width': 497,
        'link': 'https://www.planespotters.net/photo/1366262/n145fe-fedex-express-boeing-767-3s2f?utm_source=api',
        'credit': 'OCFLT_OMGcat'
      },
      'airframeData': null
    },
    {
      'ident': 'UPS2900',
      'registration': 'N319UP',
      'aircraft_type': 'B763 ',
      'origin_airport': 'Muhammad Ali Intl',
      'origin_city': 'Louisville',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T19:58:00Z',
      'estimated_off': '2023-03-17T20:14:06Z',
      'scheduled_on': '2023-03-18T00:20:00Z',
      'estimated_on': '2023-03-18T00:30:00Z',
      'status': 'En Route / On Time',
      'route_distance': 1883,
      'filed_ete': 15720,
      'filed_altitude': 360,
      'photo': {
        'photo': 'https://t.plnspttrs.net/24972/1345359_a5a04e39c7_280.jpg',
        'width': 420,
        'link': 'https://www.planespotters.net/photo/1345359/n319up-united-parcel-service-ups-boeing-767-34afwl?utm_source=api',
        'credit': 'GZ-T16'
      },
      'airframeData': null
    },
    {
      'ident': 'SKW5823',
      'registration': 'N601UX',
      'aircraft_type': 'E75L ',
      'origin_airport': 'Friedman Meml',
      'origin_city': 'Hailey',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T22:47:00Z',
      'estimated_off': '2023-03-17T22:46:00Z',
      'scheduled_on': '2023-03-18T00:34:00Z',
      'estimated_on': '2023-03-18T00:31:00Z',
      'status': 'En Route / On Time',
      'route_distance': 822,
      'filed_ete': 6420,
      'filed_altitude': 300,
      'photo': {
        'photo': 'https://t.plnspttrs.net/18504/1118143_d0b2dfc21c_280.jpg',
        'width': 420,
        'link': 'https://www.planespotters.net/photo/1118143/n601ux-united-express-embraer-erj-175ll-erj-170-200-ll?utm_source=api',
        'credit': 'Brady Noble'
      },
      'airframeData': null
    },
    {
      'ident': 'AAL135',
      'registration': 'N735AT',
      'aircraft_type': 'B77W ',
      'origin_airport': 'London Heathrow',
      'origin_city': 'London',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T14:00:00Z',
      'estimated_off': '2023-03-17T14:09:13Z',
      'scheduled_on': '2023-03-18T00:18:00Z',
      'estimated_on': '2023-03-18T00:31:15Z',
      'status': 'En Route / On Time',
      'route_distance': 5449,
      'filed_ete': 37080,
      'filed_altitude': 300,
      'photo': {
        'photo': 'https://t.plnspttrs.net/47607/1387392_b9ac09eb49_280.jpg',
        'width': 419,
        'link': 'https://www.planespotters.net/photo/1387392/n735at-american-airlines-boeing-777-323er?utm_source=api',
        'credit': 'Shon Fridman'
      },
      'airframeData': null
    },
    {
      'ident': 'JBU943',
      'registration': 'N644JB',
      'aircraft_type': 'A320 ',
      'origin_airport': 'Reno/Tahoe Intl',
      'origin_city': 'Reno',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T22:37:00Z',
      'estimated_off': '2023-03-17T23:36:12Z',
      'scheduled_on': '2023-03-17T23:35:00Z',
      'estimated_on': '2023-03-18T00:33:00Z',
      'status': 'En Route / Delayed',
      'route_distance': 392,
      'filed_ete': 3480,
      'filed_altitude': 350,
      'photo': {
        'photo': 'https://t.plnspttrs.net/45736/412480_408f318173_280.jpg',
        'width': 420,
        'link': 'https://www.planespotters.net/photo/412480/n644jb-jetblue-airways-airbus-a320-232?utm_source=api',
        'credit': 'Jan Seba'
      },
      'airframeData': null
    },
    {
      'ident': 'SKW4633',
      'registration': 'N944SW',
      'aircraft_type': 'CRJ2 ',
      'origin_airport': 'Gowen Field',
      'origin_city': 'Boise',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T22:50:00Z',
      'estimated_off': '2023-03-17T22:54:12Z',
      'scheduled_on': '2023-03-18T00:29:00Z',
      'estimated_on': '2023-03-18T00:33:00Z',
      'status': 'En Route / On Time',
      'route_distance': 774,
      'filed_ete': 5940,
      'filed_altitude': 320,
      'photo': {
        'photo': 'https://t.plnspttrs.net/49952/1363023_929730064a_280.jpg',
        'width': 419,
        'link': 'https://www.planespotters.net/photo/1363023/n944sw-united-express-bombardier-crj-200lr-cl-600-2b19?utm_source=api',
        'credit': 'Paul Brito'
      },
      'airframeData': null
    },
    {
      'ident': 'NKS2698',
      'registration': 'N682NK',
      'aircraft_type': 'A321 ',
      'origin_airport': 'Harry Reid Intl',
      'origin_city': 'Las Vegas',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T23:53:00Z',
      'estimated_off': '2023-03-17T23:53:05Z',
      'scheduled_on': '2023-03-18T00:36:00Z',
      'estimated_on': '2023-03-18T00:34:00Z',
      'status': 'En Route / On Time',
      'route_distance': 236,
      'filed_ete': 2580,
      'filed_altitude': 260,
      'photo': {
        'photo': 'https://t.plnspttrs.net/34649/1348938_d1f1f9ed67_280.jpg',
        'width': 497,
        'link': 'https://www.planespotters.net/photo/1348938/n682nk-spirit-airlines-airbus-a321-231wl?utm_source=api',
        'credit': 'OCFLT_OMGcat'
      },
      'airframeData': null
    },
    {
      'ident': 'UAL244',
      'registration': 'N494UA',
      'aircraft_type': 'A320 ',
      'origin_airport': 'Lic. Gustavo Diaz Ordaz Int\'l',
      'origin_city': 'Puerto Vallarta',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T21:30:00Z',
      'estimated_off': '2023-03-17T21:58:42Z',
      'scheduled_on': '2023-03-18T00:12:00Z',
      'estimated_on': '2023-03-18T00:37:00Z',
      'status': 'En Route / On Time',
      'route_distance': 1220,
      'filed_ete': 9720,
      'filed_altitude': 340,
      'photo': {
        'photo': 'https://t.plnspttrs.net/20399/1324634_7ec0432a8a_280.jpg',
        'width': 419,
        'link': 'https://www.planespotters.net/photo/1324634/n494ua-united-airlines-airbus-a320-232?utm_source=api',
        'credit': 'Lukasz'
      },
      'airframeData': null
    },
    {
      'ident': 'DAL753',
      'registration': 'N314DN',
      'aircraft_type': 'A321 ',
      'origin_airport': 'Hartsfield-Jackson Intl',
      'origin_city': 'Atlanta',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T18:25:00Z',
      'estimated_off': '2023-03-17T19:54:12Z',
      'scheduled_on': '2023-03-17T23:08:00Z',
      'estimated_on': '2023-03-18T00:38:00Z',
      'status': 'En Route / Delayed',
      'route_distance': 1981,
      'filed_ete': 16980,
      'filed_altitude': 300,
      'photo': {
        'photo': 'https://t.plnspttrs.net/04093/1294087_5a236b0192_280.jpg',
        'width': 497,
        'link': 'https://www.planespotters.net/photo/1294087/n314dn-delta-air-lines-airbus-a321-211wl?utm_source=api',
        'credit': 'OCFLT_OMGcat'
      },
      'airframeData': null
    },
    {
      'ident': 'AAY772',
      'registration': 'N326NV',
      'aircraft_type': 'A319 ',
      'origin_airport': 'Cincinnati/Northern Kentucky International Airport',
      'origin_city': 'Hebron',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T20:01:00Z',
      'estimated_off': '2023-03-17T20:16:36Z',
      'scheduled_on': '2023-03-18T00:25:00Z',
      'estimated_on': '2023-03-18T00:42:00Z',
      'status': 'En Route / On Time',
      'route_distance': 1938,
      'filed_ete': 15840,
      'filed_altitude': 360,
      'photo': {
        'photo': 'https://t.plnspttrs.net/34720/963707_b4311da556_280.jpg',
        'width': 420,
        'link': 'https://www.planespotters.net/photo/963707/n326nv-allegiant-air-airbus-a319-111?utm_source=api',
        'credit': 'Evan Dougherty'
      },
      'airframeData': null
    },
    {
      'ident': 'UAL1286',
      'registration': 'N420UA',
      'aircraft_type': 'A320 ',
      'origin_airport': 'Los Cabos Int\'l',
      'origin_city': 'Los Cabos',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T21:50:00Z',
      'estimated_off': '2023-03-17T22:31:42Z',
      'scheduled_on': '2023-03-17T23:57:00Z',
      'estimated_on': '2023-03-18T00:42:00Z',
      'status': 'En Route / Delayed',
      'route_distance': 913,
      'filed_ete': 7620,
      'filed_altitude': 340,
      'photo': {
        'photo': 'https://t.plnspttrs.net/07329/1386649_edf9591cf8_280.jpg',
        'width': 497,
        'link': 'https://www.planespotters.net/photo/1386649/n420ua-united-airlines-airbus-a320-232?utm_source=api',
        'credit': 'KirkXWB'
      },
      'airframeData': null
    },
    {
      'ident': 'UAL387',
      'registration': 'N35271',
      'aircraft_type': 'B738 ',
      'origin_airport': 'Vancouver Int\'l',
      'origin_city': 'Vancouver',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T22:10:00Z',
      'estimated_off': '2023-03-17T22:19:24Z',
      'scheduled_on': '2023-03-18T00:30:00Z',
      'estimated_on': '2023-03-18T00:43:00Z',
      'status': 'En Route / On Time',
      'route_distance': 1131,
      'filed_ete': 8400,
      'filed_altitude': 350,
      'photo': {
        'photo': 'https://t.plnspttrs.net/42759/492229_ec9c5b1222_280.jpg',
        'width': 420,
        'link': 'https://www.planespotters.net/photo/492229/n35271-united-airlines-boeing-737-824wl?utm_source=api',
        'credit': 'KMCO Spotter'
      },
      'airframeData': null
    },
    {
      'ident': 'AAL1375',
      'registration': 'N173US',
      'aircraft_type': 'A321 ',
      'origin_airport': 'Chicago O\'Hare Intl',
      'origin_city': 'Chicago',
      'destination_airport': 'Los Angeles Intl',
      'destination_city': 'Los Angeles',
      'scheduled_off': '2023-03-17T20:36:00Z',
      'estimated_off': '2023-03-17T20:46:54Z',
      'scheduled_on': '2023-03-18T00:35:00Z',
      'estimated_on': '2023-03-18T00:44:00Z',
      'status': 'En Route / On Time',
      'route_distance': 1761,
      'filed_ete': 14340,
      'filed_altitude': 300,
      'photo': {
        'photo': 'https://t.plnspttrs.net/06926/1247391_eac83f86be_280.jpg',
        'width': 448,
        'link': 'https://www.planespotters.net/photo/1247391/n173us-american-airlines-airbus-a321-211?utm_source=api',
        'credit': 'Marc Charon'
      },
      'airframeData': null
    }
  ]
  //await getData()
  if (data === 'error') {
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