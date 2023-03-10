const cronJob = require('node-cron')
const moment = require('moment')
const getArrivalsData = require('./arrivalsData')

let scheduledArrivalsData = {'error': 'Server data not yet initialized'}

const initScheduledJobs = () => {
  const scheduledJobFunction = cronJob.schedule('*/6 */1 * * *', async () => {
    function delay (ms) {
      return new Promise((resolve,reject) => setTimeout(resolve,ms))
    }

    // fetch scheduled arrivals
    const arrivalsData = await getArrivalsData.getScheduledArrivals()
    if(arrivalsData === 'error') return
    console.log(`scheduled arrivals data with registration fetched for ${arrivalsData.length} flights`)
    
    // fetch aircraft photos
    for (let i=0; i < arrivalsData.length; i++) {
      await delay(1000)
      const photo = await getArrivalsData.getPhotoData(arrivalsData[i].registration)
      console.log(`photo fetched for ${arrivalsData[i].ident} (${arrivalsData[i].registration}) [${i+1}/${arrivalsData.length}]`)
      arrivalsData[i]['photo'] = photo
    }

    // sample arrivalsData with photos fetched
    // const sampleArrivalsData = [
    //   {
    //     ident: 'UAL1231',
    //     registration: 'N776UA',
    //     aircraft_type: 'B772 ',
    //     origin_airport: 'LaGuardia',
    //     origin_city: 'New York',
    //     destination_airport: 'LaGuardia',
    //     destination_city: 'New York',
    //     scheduled_off: '2023-03-09T23:10:00Z',
    //     estimated_off: '2023-03-09T23:40:28Z',
    //     scheduled_on: '2023-03-10T03:14:00Z',
    //     estimated_on: '2023-03-10T04:05:49Z',
    //     status: 'En Route / Delayed',
    //     route_distance: 2555,
    //     filed_ete: 14640,
    //     filed_altitude: 350,
    //     photo: 'https://t.plnspttrs.net/35055/1158250_0f663c8491_280.jpg'
    //   },
    //   {
    //     ident: 'ASA581',
    //     registration: 'N516AS',
    //     aircraft_type: 'B738 ',
    //     origin_airport: 'LaGuardia',
    //     origin_city: 'New York',
    //     destination_airport: 'LaGuardia',
    //     destination_city: 'New York',
    //     scheduled_off: '2023-03-09T22:20:00Z',
    //     estimated_off: '2023-03-09T22:45:48Z',
    //     scheduled_on: '2023-03-10T03:34:00Z',
    //     estimated_on: '2023-03-10T04:06:00Z',
    //     status: 'En Route / Delayed',
    //     route_distance: 2341,
    //     filed_ete: 18840,
    //     filed_altitude: 340,
    //     photo: 'https://t.plnspttrs.net/32787/1392606_05c17b47fd_280.jpg'
    //   },
    //   {
    //     ident: 'SWA1719',
    //     registration: 'N751SW',
    //     aircraft_type: 'B737 ',
    //     origin_airport: 'LaGuardia',
    //     origin_city: 'New York',
    //     destination_airport: 'LaGuardia',
    //     destination_city: 'New York',
    //     scheduled_off: '2023-03-10T02:45:00Z',
    //     estimated_off: '2023-03-10T03:24:05Z',
    //     scheduled_on: '2023-03-10T03:27:00Z',
    //     estimated_on: '2023-03-10T04:06:00Z',
    //     status: 'En Route / Delayed',
    //     route_distance: 236,
    //     filed_ete: 2520,
    //     filed_altitude: 250,
    //     photo: 'https://t.plnspttrs.net/18650/1302878_77601ce341_280.jpg'
    //   },
    //   {
    //     ident: 'JBU2073',
    //     registration: 'N980JT',
    //     aircraft_type: 'A321 ',
    //     origin_airport: 'LaGuardia',
    //     origin_city: 'New York',
    //     destination_airport: 'LaGuardia',
    //     destination_city: 'New York',
    //     scheduled_off: '2023-03-09T22:12:00Z',
    //     estimated_off: '2023-03-09T22:13:08Z',
    //     scheduled_on: '2023-03-10T04:02:00Z',
    //     estimated_on: '2023-03-10T04:07:00Z',
    //     status: 'En Route / On Time',
    //     route_distance: 2484,
    //     filed_ete: 21000,
    //     filed_altitude: 320,
    //     photo: 'https://t.plnspttrs.net/07315/1371395_c222810d86_280.jpg'
    //   },
    //   {
    //     ident: 'AAL162',
    //     registration: 'N446AN',
    //     aircraft_type: 'A21N ',
    //     origin_airport: 'LaGuardia',
    //     origin_city: 'New York',
    //     destination_airport: 'LaGuardia',
    //     destination_city: 'New York',
    //     scheduled_off: '2023-03-09T23:22:00Z',
    //     estimated_off: '2023-03-09T23:38:16Z',
    //     scheduled_on: '2023-03-10T04:09:00Z',
    //     estimated_on: '2023-03-10T04:08:00Z',
    //     status: 'En Route / On Time',
    //     route_distance: 2555,
    //     filed_ete: 17220,
    //     filed_altitude: 330,
    //     photo: 'https://t.plnspttrs.net/26614/1357023_5b7fae0a9f_280.jpg'
    //   }
    // ]
    
    const arrivalsDataWithPhotos = arrivalsData.filter(data => data.photo)
    console.log(`scheduled arrivals data and photos fetched for ${arrivalsDataWithPhotos.length} flights`)
    console.log(`photos missing for ${arrivalsDataWithPhotos.length - arrivalsData.length} aircraft(s)`)
    
    // fetch airframe data
    let counter = 0
    for (let i=0; i < arrivalsDataWithPhotos.length; i++){
      await delay(10000)
      console.log(`fetching airframe data for ${arrivalsDataWithPhotos[i].registration} [${i+1}/${arrivalsDataWithPhotos.length}]`)
      const airframeData = await getArrivalsData.getAirframeData(arrivalsDataWithPhotos[i].registration)
      if(!airframeData) counter++
      arrivalsDataWithPhotos[i]['airframeData'] = airframeData
    }

    const formattedData = arrivalsDataWithPhotos.map(eachFlight => {
      if (!eachFlight.airframeData) return null 
      eachFlight.airframeData = Object.fromEntries(Object.entries(eachFlight.airframeData).map((value) => {
        if (moment(value[1], moment.ISO_8601).isValid()){
          return [value[0], new Date(value[1]).toDateString()]
        }else return [value[0],value[1]]
      }))
      return eachFlight
    })
    console.log(`airframe data missing for ${counter} aircraft(s)`)
    

    // store formatted arrivals data to be called when needed
    scheduledArrivalsData = formattedData
    
    console.log(formattedData)
  })
  scheduledJobFunction.start()
}

const getData = () => {
  // sample formatted data 
  scheduledArrivalsData =[
    {
      ident: 'PAC97',
      registration: 'N703GT',
      aircraft_type: 'B77L ',
      origin_airport: 'Hong Kong Int\'l',
      origin_city: 'Hong Kong',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-09T20:20:00Z',
      estimated_off: '2023-03-09T22:05:20Z',
      scheduled_on: '2023-03-10T08:38:00Z',
      estimated_on: '2023-03-10T10:24:15Z',
      status: 'En Route / Delayed',
      route_distance: 8171,
      filed_ete: 44280,
      filed_altitude: 370,
      photo: 'https://t.plnspttrs.net/36091/1369382_07a88726a4_280.jpg',
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '777-F6N',
        'Year built': 'Sat Dec 31 2011',
        'Construction Number (C/N)': '41518',
        'Line Number (L/N)': 'Mon Dec 31 1049',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'General Electric GE90-110B1',
        'Also Registered As': 'N778LA  Registered  Delivery',
        'Registration Number': 'N703GT',
        Address: ','
      }
    },
    {
      ident: 'DAL886',
      registration: 'N6702',
      aircraft_type: 'B752 ',
      origin_airport: 'Hartsfield-Jackson Intl',
      origin_city: 'Atlanta',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-10T03:59:00Z',
      estimated_off: '2023-03-10T05:54:39Z',
      scheduled_on: '2023-03-10T08:38:00Z',
      estimated_on: '2023-03-10T10:34:00Z',
      status: 'En Route / Delayed',
      route_distance: 2073,
      filed_ete: 16740,
      filed_altitude: 320,
      photo: 'https://t.plnspttrs.net/15609/1250506_1ec0378839_280.jpg',
      airframeData: {
        airplaneIataType: 'B757-200',
        codeIataAirline: 'DL',
        codeIataPlaneLong: 'B752',
        codeIataPlaneShort: '75W',
        constructionNumber: '30188',
        deliveryDate: 'Fri Nov 19 1999',
        enginesType: 'JET',
        firstFlight: 'Thu Oct 28 1999',
        hexIcaoAirplane: 'A8DE56',
        lineNumber: 'Tue Dec 31 0897',
        modelCode: 'B757-232WIN.',
        numberRegistration: 'N6702',
        planeAge: '18',
        planeModel: '757',
        planeSeries: '232',
        planeStatus: 'active',
        productionLine: 'Boeing 757',
        registrationDate: 'Fri Nov 19 1999'
      }
    },
    {
      ident: 'ATN3422',
      registration: 'N359AZ',
      aircraft_type: 'B763 ',
      origin_airport: 'Wilmington Air Park',
      origin_city: 'Wilmington',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-10T06:09:43Z',
      estimated_off: '2023-03-10T05:52:59Z',
      scheduled_on: '2023-03-10T10:55:43Z',
      estimated_on: '2023-03-10T10:36:00Z',
      status: 'En Route / On Time',
      route_distance: 1982,
      filed_ete: 17160,
      filed_altitude: 340,
      photo: 'https://t.plnspttrs.net/43504/1307863_ca4b16945f_280.jpg',
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '767-323/ER',
        'Year built': 'Thu Dec 31 1987',
        'Construction Number (C/N)': '24036',
        'Line Number (L/N)': '221',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'General Electric CF6-80C2B6',
        'Also Registered As': 'N355AA  De-registered\nN388CM  Conv to freighter 8-9-16',
        'Registration Number': 'N359AZ',
        'Mode S (ICAO24) Code': 'A40654',
        'Current Status': 'Valid',
        'Delivery Date': 'Wed Nov 16 2016',
        Owner: 'Cargo Aircraft Management Inc.',
        Address: 'Wilmington, Ohio 45177United States'
      }
    },
    {
      ident: 'ASA1054',
      registration: 'N924VA',
      aircraft_type: 'A21N ',
      origin_airport: 'Seattle-Tacoma Intl',
      origin_city: 'Seattle',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-10T02:25:00Z',
      estimated_off: '2023-03-10T08:49:00Z',
      scheduled_on: '2023-03-10T04:16:00Z',
      estimated_on: '2023-03-10T10:40:00Z',
      status: 'En Route / Delayed',
      route_distance: 956,
      filed_ete: 6660,
      filed_altitude: 370,
      photo: 'https://t.plnspttrs.net/46604/1364597_18410d0d61_280.jpg',
      airframeData: {
        Manufacturer: 'Airbus',
        Model: 'A321-253N',
        'Year built': 'Sun Dec 31 2017',
        'Construction Number (C/N)': 'Wed Dec 31 7941',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'CFM International LEAP-1A33',
        'Also Registered As': 'D-AVZJ  Manufacturer\'s registration',
        'Registration Number': 'N924VA',
        'Mode S (ICAO24) Code': 'ACCEE2',
        'Current Status': 'Registered',
        'Delivery Date': 'Tue Jan 30 2018',
        Owner: 'Alaska Airlines',
        Address: 'Seattle, Washington United States'
      }
    }
  ]
    
  return scheduledArrivalsData
}

module.exports = {
  initScheduledJobs: initScheduledJobs,
  getData: getData,
}