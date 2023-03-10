// module imports 
const axios = require('axios')
const scraperAirportData = require('./ScraperAirportData')
const scraperAirframes = require('./ScraperAirframes')

// get scheduled arrivals data from flightaware.com AeroAPI
async function getScheduledArrivals() {
  // find start and end times for schedule request. Round to next whole hour. Format to ISO string time.
  const fetchTime = new Date()
  let startTime = new Date()
  let endTime = new Date()
  startTime.setUTCHours(startTime.getUTCHours() + Math.ceil(startTime.getMinutes()/60),0, 0, 0)
  endTime.setUTCHours(endTime.getUTCHours() + Math.ceil(endTime.getMinutes()/60) + 1,0, 0, 0)
  // log request time and time bounds for arrival data
  console.log(`Fetching scheduled arrivals data at ${fetchTime.toString()}.\nQuery parameters:\n start time: ${startTime.toString()} (${startTime.toISOString()})\n end time: ${endTime.toString()} (${endTime.toISOString()})`)
  // remove milliseconds from ISO time format as per API guidelines AND url encode the values
  startTime = encodeURIComponent(startTime.toISOString().split('.')[0]+'Z')
  endTime = encodeURIComponent(endTime.toISOString().split('.')[0]+'Z')
  //   console.log(startTime)
  //   console.log(endTime)
  
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
    // test response data
    //   const scheduledArrivalsResponse = {
    //     scheduled_arrivals: [
    //       {
    //         ident: 'UAL1231',
    //         ident_icao: 'UAL1231',
    //         ident_iata: 'UA1231',
    //         fa_flight_id: 'UAL1231-1678155927-fa-0019',
    //         operator: 'UAL',
    //         operator_icao: 'UAL',
    //         operator_iata: 'UA',
    //         flight_number: '1231',
    //         registration: 'N776UA',
    //         atc_ident: null,
    //         inbound_fa_flight_id: 'UAL253-1678083313-fa-0008',
    //         codeshares: [Array],
    //         codeshares_iata: [Array],
    //         blocked: false,
    //         diverted: false,
    //         cancelled: false,
    //         position_only: false,
    //         'origin': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         'destination': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         departure_delay: -120,
    //         arrival_delay: 109,
    //         filed_ete: 14640,
    //         scheduled_out: '2023-03-09T23:00:00Z',
    //         estimated_out: '2023-03-09T23:00:00Z',
    //         actual_out: '2023-03-09T22:58:00Z',
    //         scheduled_off: '2023-03-09T23:10:00Z',
    //         estimated_off: '2023-03-09T23:40:28Z',
    //         actual_off: '2023-03-09T23:40:28Z',
    //         scheduled_on: '2023-03-10T03:14:00Z',
    //         estimated_on: '2023-03-10T04:05:49Z',
    //         actual_on: null,
    //         scheduled_in: '2023-03-10T04:14:00Z',
    //         estimated_in: '2023-03-10T04:15:49Z',
    //         actual_in: null,
    //         progress_percent: 85,
    //         status: 'En Route / Delayed',
    //         aircraft_type: 'B772 ',
    //         route_distance: 2555,
    //         filed_airspeed: 484,
    //         filed_altitude: 350,
    //         route: 'MKK5 CODDY FITES R578 FICKY GOATZ1',
    //         baggage_claim: '2',
    //         seats_cabin_business: null,
    //         seats_cabin_coach: null,
    //         seats_cabin_first: 28,
    //         gate_origin: 'G3',
    //         gate_destination: '74',
    //         terminal_origin: '2',
    //         terminal_destination: '7',
    //         type: 'Airline'
    //       },
    //       {
    //         ident: 'ASA581',
    //         ident_icao: 'ASA581',
    //         ident_iata: 'AS581',
    //         fa_flight_id: 'ASA581-1678227111-airline-0223',
    //         operator: 'ASA',
    //         operator_icao: 'ASA',
    //         operator_iata: 'AS',
    //         flight_number: '581',
    //         registration: 'N516AS',
    //         atc_ident: null,
    //         inbound_fa_flight_id: 'ASA582-1678205400-schedule-0003',
    //         codeshares: [Array],
    //         codeshares_iata: [Array],
    //         blocked: false,
    //         diverted: false,
    //         cancelled: false,
    //         position_only: false,
    //         'origin': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         'destination': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         departure_delay: 900,
    //         arrival_delay: -180,
    //         filed_ete: 18840,
    //         scheduled_out: '2023-03-09T22:10:00Z',
    //         estimated_out: '2023-03-09T22:10:00Z',
    //         actual_out: '2023-03-09T22:25:00Z',
    //         scheduled_off: '2023-03-09T22:20:00Z',
    //         estimated_off: '2023-03-09T22:45:48Z',
    //         actual_off: '2023-03-09T22:45:48Z',
    //         scheduled_on: '2023-03-10T03:34:00Z',
    //         estimated_on: '2023-03-10T04:06:00Z',
    //         actual_on: null,
    //         scheduled_in: '2023-03-10T04:18:00Z',
    //         estimated_in: '2023-03-10T04:15:00Z',
    //         actual_in: null,
    //         progress_percent: 87,
    //         status: 'En Route / Delayed',
    //         aircraft_type: 'B738 ',
    //         route_distance: 2341,
    //         filed_airspeed: 458,
    //         filed_altitude: 340,
    //         route: 'BNICE1 DOLIE Y280 LEV J86 CUZZZ CWK FUSCO PEQ KA12U DMN J184 BXK MESSI ESTWD HLYWD1',
    //         baggage_claim: 'T6-6',
    //         seats_cabin_business: null,
    //         seats_cabin_coach: null,
    //         seats_cabin_first: null,
    //         gate_origin: 'A3',
    //         gate_destination: '68B',
    //         terminal_origin: '1',
    //         terminal_destination: '6',
    //         type: 'Airline'
    //       },
    //       {
    //         ident: 'SWA1719',
    //         ident_icao: 'SWA1719',
    //         ident_iata: 'WN1719',
    //         fa_flight_id: 'SWA1719-1678243121-airline-0393',
    //         operator: 'SWA',
    //         operator_icao: 'SWA',
    //         operator_iata: 'WN',
    //         flight_number: '1719',
    //         registration: 'N751SW',
    //         atc_ident: null,
    //         inbound_fa_flight_id: 'SWA1752-1678217830-airline-0030',
    //         codeshares: [],
    //         codeshares_iata: [],
    //         blocked: false,
    //         diverted: false,
    //         cancelled: false,
    //         position_only: false,
    //         'origin': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         'destination': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         departure_delay: 2040,
    //         arrival_delay: 1560,
    //         filed_ete: 2520,
    //         scheduled_out: '2023-03-10T02:35:00Z',
    //         estimated_out: '2023-03-10T03:06:00Z',
    //         actual_out: '2023-03-10T03:09:00Z',
    //         scheduled_off: '2023-03-10T02:45:00Z',
    //         estimated_off: '2023-03-10T03:24:05Z',
    //         actual_off: '2023-03-10T03:24:05Z',
    //         scheduled_on: '2023-03-10T03:27:00Z',
    //         estimated_on: '2023-03-10T04:06:00Z',
    //         actual_on: null,
    //         scheduled_in: '2023-03-10T03:50:00Z',
    //         estimated_in: '2023-03-10T04:16:00Z',
    //         actual_in: null,
    //         progress_percent: 5,
    //         status: 'En Route / Delayed',
    //         aircraft_type: 'B737 ',
    //         route_distance: 236,
    //         filed_airspeed: 425,
    //         filed_altitude: 250,
    //         route: 'RADYR2 BLAQQ SHTNR ANJLL4',
    //         baggage_claim: null,
    //         seats_cabin_business: null,
    //         seats_cabin_coach: null,
    //         seats_cabin_first: null,
    //         gate_origin: 'C2',
    //         gate_destination: '18B',
    //         terminal_origin: '1',
    //         terminal_destination: '1',
    //         type: 'Airline'
    //       },
    //       {
    //         ident: 'JBU2073',
    //         ident_icao: 'JBU2073',
    //         ident_iata: 'B62073',
    //         fa_flight_id: 'JBU2073-1678226880-schedule-0360',
    //         operator: 'JBU',
    //         operator_icao: 'JBU',
    //         operator_iata: 'B6',
    //         flight_number: '2073',
    //         registration: 'N980JT',
    //         atc_ident: null,
    //         inbound_fa_flight_id: 'JBU1774-1678200300-schedule-0024',
    //         codeshares: [Array],
    //         codeshares_iata: [Array],
    //         blocked: false,
    //         diverted: false,
    //         cancelled: false,
    //         position_only: false,
    //         'origin': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         'destination': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         departure_delay: -600,
    //         arrival_delay: -60,
    //         filed_ete: 21000,
    //         scheduled_out: '2023-03-09T22:02:00Z',
    //         estimated_out: '2023-03-09T22:02:00Z',
    //         actual_out: '2023-03-09T21:52:00Z',
    //         scheduled_off: '2023-03-09T22:12:00Z',
    //         estimated_off: '2023-03-09T22:13:08Z',
    //         actual_off: '2023-03-09T22:13:08Z',
    //         scheduled_on: '2023-03-10T04:02:00Z',
    //         estimated_on: '2023-03-10T04:07:00Z',
    //         actual_on: null,
    //         scheduled_in: '2023-03-10T04:24:00Z',
    //         estimated_in: '2023-03-10T04:23:00Z',
    //         actual_in: null,
    //         progress_percent: 88,
    //         status: 'En Route / On Time',
    //         aircraft_type: 'A321 ',
    //         route_distance: 2484,
    //         filed_airspeed: 454,
    //         filed_altitude: 320,
    //         route: 'ZIMMZ Q42 MIKYG Q480 AIR J110 EMPTY J110 STL BUM ICT CIM J134 DRK J231 HIPPI GABBL HLYWD1',
    //         baggage_claim: null,
    //         seats_cabin_business: null,
    //         seats_cabin_coach: null,
    //         seats_cabin_first: null,
    //         gate_origin: 'A6',
    //         gate_destination: '55A',
    //         terminal_origin: 'A',
    //         terminal_destination: '5',
    //         type: 'Airline'
    //       },
    //       {
    //         ident: 'AAL162',
    //         ident_icao: 'AAL162',
    //         ident_iata: 'AA162',
    //         fa_flight_id: 'AAL162-1678230720-schedule-0000',
    //         operator: 'AAL',
    //         operator_icao: 'AAL',
    //         operator_iata: 'AA',
    //         flight_number: '162',
    //         registration: 'N446AN',
    //         atc_ident: null,
    //         inbound_fa_flight_id: 'AAL31-1678203140-airline-0092',
    //         codeshares: [Array],
    //         codeshares_iata: [Array],
    //         blocked: false,
    //         diverted: false,
    //         cancelled: false,
    //         position_only: false,
    //         'origin': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         'destination': {
    //           'code': 'string',
    //           'code_icao': 'string',
    //           'code_iata': 'string',
    //           'code_lid': 'string',
    //           'timezone': 'America/New_York',
    //           'name': 'LaGuardia',
    //           'city': 'New York',
    //           'airport_info_url': ''
    //         },
    //         departure_delay: 540,
    //         arrival_delay: -960,
    //         filed_ete: 17220,
    //         scheduled_out: '2023-03-09T23:12:00Z',
    //         estimated_out: '2023-03-09T23:28:00Z',
    //         actual_out: '2023-03-09T23:21:00Z',
    //         scheduled_off: '2023-03-09T23:22:00Z',
    //         estimated_off: '2023-03-09T23:38:16Z',
    //         actual_off: '2023-03-09T23:38:16Z',
    //         scheduled_on: '2023-03-10T04:09:00Z',
    //         estimated_on: '2023-03-10T04:08:00Z',
    //         actual_on: null,
    //         scheduled_in: '2023-03-10T04:40:00Z',
    //         estimated_in: '2023-03-10T04:24:00Z',
    //         actual_in: null,
    //         progress_percent: 84,
    //         status: 'En Route / On Time',
    //         aircraft_type: 'A21N ',
    //         route_distance: 2555,
    //         filed_airspeed: 462,
    //         filed_altitude: 330,
    //         route: 'MKK5 CODDY FITES R578 FIZEL R578 FICKY GOATZ1',
    //         baggage_claim: 'T5C5',
    //         seats_cabin_business: null,
    //         seats_cabin_coach: null,
    //         seats_cabin_first: null,
    //         gate_origin: 'E10',
    //         gate_destination: '54A',
    //         terminal_origin: '2',
    //         terminal_destination: '5',
    //         type: 'Airline'
    //       }
    //     ],
    //     links: {
    //       next: '/airports/KLAX/flights/scheduled_arrivals?type=Airline&start=2023-03-10T04%3A00%3A00Z&end=2023-03-10T05%3A00%3A00Z&max_pages=1&cursor=1f9d86c1da2049c'
    //     },
    //     num_pages: 1
    //   }
  
    // extract required flight data from response
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
      }
    })

    // sample flight data 
    //   const flightData = [
    //     {
    //       ident: 'DAL650',
    //       registration: 'N180DN',
    //       aircraft_type: 'B763 ',
    //       origin_airport: 'John F Kennedy Intl',
    //       origin_city: 'New York',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T21:05:00Z',
    //       estimated_off: '2023-03-09T21:13:14Z',
    //       scheduled_on: '2023-03-10T03:03:00Z',
    //       estimated_on: '2023-03-10T03:06:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 2529,
    //       filed_ete: 21480,
    //       filed_altitude: 340
    //     },
    //     {
    //       ident: 'CKS363',
    //       registration: 'N742CK',
    //       aircraft_type: 'B744 ',
    //       origin_airport: 'Orlando Intl',
    //       origin_city: 'Orlando',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T22:30:00Z',
    //       estimated_off: '2023-03-09T22:11:40Z',
    //       scheduled_on: '2023-03-10T03:25:00Z',
    //       estimated_on: '2023-03-10T03:06:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 2263,
    //       filed_ete: 17700,
    //       filed_altitude: 360
    //     },
    //     {
    //       ident: 'AAY762',
    //       registration: 'N326NV',
    //       aircraft_type: 'A319 ',
    //       origin_airport: 'Gowen Field',
    //       origin_city: 'Boise',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-10T01:11:00Z',
    //       estimated_off: '2023-03-10T01:20:38Z',
    //       scheduled_on: '2023-03-10T02:51:00Z',
    //       estimated_on: '2023-03-10T03:06:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 768,
    //       filed_ete: 6000,
    //       filed_altitude: 340
    //     },
    //     {
    //       ident: 'SIA38',
    //       registration: '9V-SMV',
    //       aircraft_type: 'A359 ',
    //       origin_airport: 'Singapore Changi',
    //       origin_city: 'Singapore',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T12:55:00Z',
    //       estimated_off: '2023-03-09T13:09:12Z',
    //       scheduled_on: '2023-03-10T04:05:00Z',
    //       estimated_on: '2023-03-10T03:06:24Z',
    //       status: 'En Route / On Time',
    //       route_distance: 8772,
    //       filed_ete: 54600,
    //       filed_altitude: 410
    //     },
    //     {
    //       ident: 'SWA1773',
    //       registration: 'N7728D',
    //       aircraft_type: 'B737 ',
    //       origin_airport: 'Tucson Intl',
    //       origin_city: 'Tucson',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-10T01:15:00Z',
    //       estimated_off: '2023-03-10T01:58:38Z',
    //       scheduled_on: '2023-03-10T02:25:00Z',
    //       estimated_on: '2023-03-10T03:08:00Z',
    //       status: 'En Route / Delayed',
    //       route_distance: 451,
    //       filed_ete: 4200,
    //       filed_altitude: 380
    //     },
    //     {
    //       ident: 'UAL2038',
    //       registration: 'N13138',
    //       aircraft_type: 'B752 ',
    //       origin_airport: 'Newark Liberty Intl',
    //       origin_city: 'Newark',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T21:10:00Z',
    //       estimated_off: '2023-03-09T21:22:50Z',
    //       scheduled_on: '2023-03-10T02:57:00Z',
    //       estimated_on: '2023-03-10T03:09:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 2467,
    //       filed_ete: 20820,
    //       filed_altitude: 300
    //     },
    //     {
    //       ident: 'AAL1117',
    //       registration: 'N793AN',
    //       aircraft_type: 'B772 ',
    //       origin_airport: 'Charlotte/Douglas Intl',
    //       origin_city: 'Charlotte',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T21:50:00Z',
    //       estimated_off: '2023-03-09T22:25:19Z',
    //       scheduled_on: '2023-03-10T02:51:00Z',
    //       estimated_on: '2023-03-10T03:10:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 2140,
    //       filed_ete: 18060,
    //       filed_altitude: 380
    //     },
    //     {
    //       ident: 'JBU823',
    //       registration: 'N962JT',
    //       aircraft_type: 'A321 ',
    //       origin_airport: 'John F Kennedy Intl',
    //       origin_city: 'New York',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T21:09:00Z',
    //       estimated_off: '2023-03-09T21:23:00Z',
    //       scheduled_on: '2023-03-10T03:01:00Z',
    //       estimated_on: '2023-03-10T03:11:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 2472,
    //       filed_ete: 21120,
    //       filed_altitude: 340
    //     },
    //     {
    //       ident: 'BAW269',
    //       registration: 'G-XLEA',
    //       aircraft_type: 'A388 ',
    //       origin_airport: 'London Heathrow',
    //       origin_city: 'London',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T15:55:00Z',
    //       estimated_off: '2023-03-09T16:58:32Z',
    //       scheduled_on: '2023-03-10T02:32:00Z',
    //       estimated_on: '2023-03-10T03:13:00Z',
    //       status: 'En Route / Delayed',
    //       route_distance: 5449,
    //       filed_ete: 38220,
    //       filed_altitude: 340
    //     },
    //     {
    //       ident: 'DAL2551',
    //       registration: 'N369NB',
    //       aircraft_type: 'A319 ',
    //       origin_airport: 'Portland Intl',
    //       origin_city: 'Portland',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-10T01:14:00Z',
    //       estimated_off: '2023-03-10T01:25:14Z',
    //       scheduled_on: '2023-03-10T03:07:00Z',
    //       estimated_on: '2023-03-10T03:13:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 880,
    //       filed_ete: 6780,
    //       filed_altitude: 330
    //     },
    //     {
    //       ident: 'QXE2495',
    //       registration: 'N653QX',
    //       aircraft_type: 'E75L ',
    //       origin_airport: 'Mahlon Sweet Fld',
    //       origin_city: 'Eugene',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-10T01:30:00Z',
    //       estimated_off: '2023-03-10T01:32:55Z',
    //       scheduled_on: '2023-03-10T03:12:00Z',
    //       estimated_on: '2023-03-10T03:15:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 786,
    //       filed_ete: 6120,
    //       filed_altitude: 330
    //     },
    //     {
    //       ident: 'WJA1698',
    //       registration: 'C-FWJS',
    //       aircraft_type: 'B738 ',
    //       origin_airport: 'Vancouver Int\'l',
    //       origin_city: 'Vancouver',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-10T00:25:00Z',
    //       estimated_off: '2023-03-10T00:42:06Z',
    //       scheduled_on: '2023-03-10T02:59:00Z',
    //       estimated_on: '2023-03-10T03:18:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 1138,
    //       filed_ete: 9240,
    //       filed_altitude: 370
    //     },
    //     {
    //       ident: 'ASA1092',
    //       registration: 'N318AS',
    //       aircraft_type: 'B739 ',
    //       origin_airport: 'Seattle-Tacoma Intl',
    //       origin_city: 'Seattle',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T23:50:00Z',
    //       estimated_off: '2023-03-10T01:11:09Z',
    //       scheduled_on: '2023-03-10T01:54:00Z',
    //       estimated_on: '2023-03-10T03:18:00Z',
    //       status: 'En Route / Delayed',
    //       route_distance: 1000,
    //       filed_ete: 7440,
    //       filed_altitude: 350
    //     },
    //     {
    //       ident: 'FDX3725',
    //       registration: 'N264FE',
    //       aircraft_type: 'B763 ',
    //       origin_airport: 'Indianapolis Intl',
    //       origin_city: 'Indianapolis',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T23:40:00Z',
    //       estimated_off: '2023-03-09T23:03:35Z',
    //       scheduled_on: '2023-03-10T03:55:00Z',
    //       estimated_on: '2023-03-10T03:19:00Z',
    //       status: 'En Route / On Time',
    //       route_distance: 1831,
    //       filed_ete: 15300,
    //       filed_altitude: 380
    //     },
    //     {
    //       ident: 'DAL785',
    //       registration: 'N896DN',
    //       aircraft_type: 'B739 ',
    //       origin_airport: 'Minneapolis/St Paul Intl',
    //       origin_city: 'Minneapolis',
    //       destination_airport: 'Los Angeles Intl',
    //       destination_city: 'Los Angeles',
    //       scheduled_off: '2023-03-09T21:35:00Z',
    //       estimated_off: '2023-03-09T23:54:00Z',
    //       scheduled_on: '2023-03-10T01:03:00Z',
    //       estimated_on: '2023-03-10T03:22:00Z',
    //       status: 'En Route / Delayed',
    //       route_distance: 1563,
    //       filed_ete: 12480,
    //       filed_altitude: 300
    //     }
    //   ]

    // flights with no registration number are undefined. Filter them out.
  
    return flightData.filter(flight => flight)
  }
  catch(error){
    console.log(error)
    return ('error')
  }
}
// getScheduledArrivals()

// get aircraft photo data from planespotters.net
async function getPhotoData(tailNumber) {
  const aircraftPhoto = await axios.get(`https://api.planespotters.net/pub/photos/reg/${tailNumber}`)
  if (aircraftPhoto.data.photos.length > 0) {
    return(aircraftPhoto.data.photos[0].thumbnail_large.src)
  } else return null
}
// getPhotoData()

// get airframe data:
//  1. First try to get data from app.goflightlabs.com
//  2. Then try to scrape data from airport-data.com
//  3. Lastly scrape data from airframes.org
async function getAirframeData(tailNumber) {
  // get airframe data from app.goflightlabs.com
  try{
    console.log('goflightlabs.com')
    const airframeDataGoFlightLabs = await axios.get(`https://app.goflightlabs.com/airplanes?access_key=${process.env.flightlabs_api_key}&numberRegistration=${tailNumber}`)
    if (airframeDataGoFlightLabs.data.success){
      console.log(`airframe data for ${tailNumber} from goflightlabs`)
      // js magic to remove entries with no data. 
      // use Object.entries to split each key, value pair into an array.
      // use filter to remove any pair where value[1].length is not greater than 1
      // use Object.fromEntries to create a new object with the returned values
      return Object.fromEntries(Object.entries(airframeDataGoFlightLabs.data.data[0]).filter(value => value[1] && value[1].length > 1))
    }  else {
      throw new Error('not found at flightlabs')
    }
  }
  catch(error) {
    console.log(error)
    
    // if airframe data not found from flight-labs, scrape data from airport-data.com
    console.log('airport-data')
    const airframeDataAirportData = await scraperAirportData.performScrapingAirportData(tailNumber)
    if(Object.keys(airframeDataAirportData).length > 0) {
      console.log(`airframe data for ${tailNumber} from airport-data`)
      return airframeDataAirportData
    } else {
        
      // if airframe data not found from airport-data.com, scrap airframes.org
      console.log('airframes.org')
      const airframeDataAirframes = await scraperAirframes.performScrapingAirFrames(tailNumber)
      if(Object.keys(airframeDataAirframes).length > 0) {
        console.log(`airframe data for ${tailNumber} from airframes.org`)
        return airframeDataAirframes
      } else {
        
        // airframe data not found
        console.log(`airframe data for ${tailNumber} not found`)
        return null
      }
    }
  }
}

// getAirframeData()


module.exports = {
  getScheduledArrivals: getScheduledArrivals,
  getPhotoData: getPhotoData,
  getAirframeData: getAirframeData
}
// console.log(ident)