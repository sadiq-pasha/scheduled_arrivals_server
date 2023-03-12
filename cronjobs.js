const cronJob = require('node-cron')
const moment = require('moment')
const getArrivalsData = require('./arrivalsData')

let scheduledArrivalsData = {'error': 'Server data not yet initialized'}

const initScheduledJobs = () => {
  const scheduledJobFunction = cronJob.schedule('*/27 */1 * * *', async () => {
    function delay (ms) {
      return new Promise((resolve,reject) => setTimeout(resolve,ms))
    }

    // fetch scheduled arrivals
    const arrivalsData = await getArrivalsData.getScheduledArrivals()
    if(arrivalsData === 'error') return
    console.log(`scheduled arrivals data with registration fetched for ${arrivalsData.length} flights`)
    
    // fetch aircraft photos
    for (let i=0; i < arrivalsData.length; i++) {
      await delay(500)
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
      await delay(20000)
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
    
    console.log('----END DATA FETCH----')
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
      ident: 'JBU723',
      registration: 'N946JL',
      aircraft_type: 'A321 ',
      origin_airport: 'John F Kennedy Intl',
      origin_city: 'New York',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T11:20:00Z',
      estimated_off: '2023-03-12T11:24:54Z',
      scheduled_on: '2023-03-12T17:00:00Z',
      estimated_on: '2023-03-12T17:01:00Z',
      status: 'En Route / On Time',
      route_distance: 2517,
      filed_ete: 16800,
      filed_altitude: 280,
      photo: {
        photo: 'https://t.plnspttrs.net/18550/1340135_6ad0cd6d11_280.jpg',
        width: 419,
        link: 'https://www.planespotters.net/photo/1340135/n946jl-jetblue-airways-airbus-a321-231wl?utm_source=api',
        credit: 'Hector Antonio -HR Planespotter'
      },
      airframeData: {
        airplaneIataType: 'A321-200',
        codeIataAirline: 'B6',
        codeIataPlaneLong: 'A321',
        codeIataPlaneShort: '32B',
        constructionNumber: 'Tue Dec 31 6424',
        deliveryDate: 'Thu Jan 15 2015',
        enginesType: 'JET',
        firstFlight: 'Wed Jan 07 2015',
        hexIcaoAirplane: 'AD2445',
        modelCode: 'A321-231(SL)',
        numberRegistration: 'N946JL',
        numberTestRgistration: 'D-AZAS',
        planeModel: 'A321',
        planeSeries: '231(SL)',
        planeStatus: 'active',
        productionLine: 'Airbus A318/A319/A32',
        registrationDate: 'Thu Jan 15 2015',
        rolloutDate: '0000-00-00'
      }
    },
    {
      ident: 'AMX646',
      registration: 'XA-DRA',
      aircraft_type: 'B738 ',
      origin_airport: 'Lic. Benito Juarez Int\'l',
      origin_city: 'Mexico City',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T13:10:00Z',
      estimated_off: '2023-03-12T13:26:08Z',
      scheduled_on: '2023-03-12T17:16:00Z',
      estimated_on: '2023-03-12T17:02:00Z',
      status: 'En Route / On Time',
      route_distance: 1555,
      filed_ete: 11160,
      filed_altitude: 400,
      photo: {
        photo: 'https://t.plnspttrs.net/15410/1359646_3411b935bf_280.jpg',
        width: 497,
        link: 'https://www.planespotters.net/photo/1359646/xa-dra-aeromxico-boeing-737-852wl?utm_source=api',
        credit: 'KirkXWB'
      },
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '737-852',
        'Year built': 'Sat Dec 31 2005',
        'Construction Number (C/N)': '35114',
        'Line Number (L/N)': 'Wed Dec 31 2036',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '160',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'CFM International CFM56-7B-27B1',        
        'Also Registered As': 'N1779B  Manufacturer test registered  Delivery',    
        'Registration Number': 'XA-DRA',
        'Mode S (ICAO24) Code': '0D0B66',
        'Current Status': 'Registered',
        'Delivery Date': 'Sun Jan 13 2019',
        Owner: 'Aeromexico',
        Address: 'Mexico City,  Mexico'
      }
    },
    {
      ident: 'NKS1719',
      registration: 'N679NK',
      aircraft_type: 'A321 ',
      origin_airport: 'Harry Reid Intl',
      origin_city: 'Las Vegas',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T15:40:00Z',
      estimated_off: '2023-03-12T16:20:06Z',
      scheduled_on: '2023-03-12T16:25:00Z',
      estimated_on: '2023-03-12T17:03:00Z',
      status: 'En Route / Delayed',
      route_distance: 236,
      filed_ete: 2700,
      filed_altitude: 240,
      photo: {
        photo: 'https://t.plnspttrs.net/19098/1244250_40620086bd_280.jpg',
        width: 419,
        link: 'https://www.planespotters.net/photo/1244250/n679nk-spirit-airlines-airbus-a321-231wl?utm_source=api',
        credit: 'Wilfredo Torres'
      },
      airframeData: {
        Manufacturer: 'Airbus',
        Model: 'A321-231SL',
        'Year built': 'Sat Dec 31 2016',
        'Construction Number (C/N)': 'Fri Dec 31 7824',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '220',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'IAE V2533-A5',
        'Also Registered As': 'F-WZMP  Manufacturer\'s registration',
        'Registration Number': 'N679NK',
        'Mode S (ICAO24) Code': 'A8FE5D',
        'Current Status': 'Registered',
        'Delivery Date': 'Tue Oct 24 2017',
        Owner: 'Spirit Airlines',
        Address: 'Miramar, FL United States'
      }
    },
    {
      ident: 'AAL1674',
      registration: 'N134AN',
      aircraft_type: 'A321 ',
      origin_airport: 'Charlotte/Douglas Intl',
      origin_city: 'Charlotte',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T11:35:00Z',
      estimated_off: '2023-03-12T11:58:00Z',
      scheduled_on: '2023-03-12T16:39:00Z',
      estimated_on: '2023-03-12T17:04:00Z',
      status: 'En Route / On Time',
      route_distance: 2130,
      filed_ete: 14640,
      filed_altitude: 320,
      photo: {
        photo: 'https://t.plnspttrs.net/39338/1310302_0b1d996a95_280.jpg',
        width: 497,
        link: 'https://www.planespotters.net/photo/1310302/n134an-american-airlines-airbus-a321-231wl?utm_source=api',
        credit: 'OCFLT_OMGcat'
      },
      airframeData: {
        Manufacturer: 'Airbus',
        Model: 'A321-231',
        'Year built': 'Wed Dec 31 2014',
        'Construction Number (C/N)': 'Fri Dec 31 6494',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '180',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'IAE V2500',
        'Registration Number': 'N134AN',
        'Mode S (ICAO24) Code': 'A08A1A',
        'Current Status': 'registered',
        'Delivery Date': 'Tue Mar 24 2015',
        Owner: 'American Airlines',
        Address: ',  United States'
      }
    },
    {
      ident: 'SKW3320',
      registration: 'N176SY',
      aircraft_type: 'E75L ',
      origin_airport: 'Roberts Fld',
      origin_city: 'Redmond',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T15:05:00Z',
      estimated_off: '2023-03-12T15:23:44Z',
      scheduled_on: '2023-03-12T16:44:00Z',
      estimated_on: '2023-03-12T17:05:00Z',
      status: 'En Route / On Time',
      route_distance: 770,
      filed_ete: 5940,
      filed_altitude: 350,
      photo: {
        photo: 'https://t.plnspttrs.net/49269/1338093_d77594f7af_280.jpg',
        width: 420,
        link: 'https://www.planespotters.net/photo/1338093/n176sy-alaska-airlines-embraer-erj-175lr-erj-170-200-lr?utm_source=api',
        credit: 'Justin Stöckel'
      },
      airframeData: {
        Manufacturer: 'Embraer',
        Model: '175LR (ERJ-170-200LR)',
        'Year built': 'Wed Dec 31 2014',
        'Construction Number (C/N)': '17000533',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '76',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'General Electric CF34-8E5',
        'Registration Number': 'N176SY',
        'Mode S (ICAO24) Code': 'A1311E',
        'Current Status': 'Valid',
        'Delivery Date': 'Wed Jan 20 2016',
        Owner: 'SkyWest Airlines/Alaska Airlines',
        Address: ',  United States'
      }
    },
    {
      ident: 'DAL520',
      registration: 'N172DN',
      aircraft_type: 'B763 ',
      origin_airport: 'John F Kennedy Intl',
      origin_city: 'New York',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T11:10:00Z',
      estimated_off: '2023-03-12T11:29:12Z',
      scheduled_on: '2023-03-12T16:54:00Z',
      estimated_on: '2023-03-12T17:06:00Z',
      status: 'En Route / On Time',
      route_distance: 2538,
      filed_ete: 17040,
      filed_altitude: 340,
      photo: {
        photo: 'https://t.plnspttrs.net/42302/1372873_9b20334608_280.jpg',
        width: 497,
        link: 'https://www.planespotters.net/photo/1372873/n172dn-delta-air-lines-boeing-767-332erwl?utm_source=api',
        credit: 'Baigiver-0764'
      },
      airframeData: {
        airplaneIataType: 'B767-300',
        codeIataAirline: 'DL',
        codeIataPlaneLong: 'B763',
        codeIataPlaneShort: '76W',
        constructionNumber: '24775',
        deliveryDate: 'Thu Jun 21 1990',
        enginesType: 'JET',
        firstFlight: 'Mon Jun 04 1990',
        hexIcaoAirplane: 'A120F3',
        lineNumber: 'Sun Dec 31 0311',
        modelCode: 'B767-332(ER) WIN.',
        numberRegistration: 'N172DN',
        planeAge: '27',
        planeModel: '767',
        planeSeries: '332ER',
        planeStatus: 'active',
        productionLine: 'Boeing 767',
        registrationDate: 'Thu Jun 21 1990'
      }
    },
    {
      ident: 'UAL2084',
      registration: 'N76514',
      aircraft_type: 'B738 ',
      origin_airport: 'San Francisco Int\'l',
      origin_city: 'San Francisco',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T15:35:00Z',
      estimated_off: '2023-03-12T16:10:25Z',
      scheduled_on: '2023-03-12T16:32:00Z',
      estimated_on: '2023-03-12T17:06:00Z',
      status: 'En Route / Delayed',
      route_distance: 338,
      filed_ete: 3420,
      filed_altitude: 310,
      photo: {
        photo: 'https://t.plnspttrs.net/26026/641393_e280e921b2_280.jpg',
        width: 420,
        link: 'https://www.planespotters.net/photo/641393/n76514-united-airlines-boeing-737-824wl?utm_source=api',
        credit: 'Jan Seba'
      },
      airframeData: {
        airplaneIataType: 'B737-800',
        codeIataAirline: 'UA',
        codeIataPlaneLong: 'B738',
        codeIataPlaneShort: '7S8',
        constructionNumber: '31626',
        deliveryDate: 'Sun Jul 27 2008',
        enginesType: 'JET',
        firstFlight: 'Thu Jul 10 2008',
        hexIcaoAirplane: 'AA56B3',
        lineNumber: 'Wed Dec 31 2679',
        modelCode: 'B737-824(ET) SSWIN.',
        numberRegistration: 'N76514',
        planeModel: '737',
        planeSeries: '824',
        planeStatus: 'active',
        productionLine: 'Boeing 737 NG',
        registrationDate: 'Sun Jul 27 2008',
        rolloutDate: 'Sun Jun 29 2008'
      }
    },
    {
      ident: 'UAL2105',
      registration: 'N68834',
      aircraft_type: 'B739 ',
      origin_airport: 'Chicago O\'Hare Intl',
      origin_city: 'Chicago',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T13:00:00Z',
      estimated_off: '2023-03-12T13:06:19Z',
      scheduled_on: '2023-03-12T17:02:00Z',
      estimated_on: '2023-03-12T17:08:00Z',
      status: 'En Route / On Time',
      route_distance: 1774,
      filed_ete: 10920,
      filed_altitude: 320,
      photo: {
        photo: 'https://t.plnspttrs.net/01805/1350885_8151cfab5d_280.jpg',
        width: 497,
        link: 'https://www.planespotters.net/photo/1350885/n68834-united-airlines-boeing-737-924erwl?utm_source=api',
        credit: 'KirkXWB'
      },
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '737-924/ER',
        'Year built': 'Tue Dec 31 2013',
        'Construction Number (C/N)': '44564',
        'Line Number (L/N)': 'Thu Dec 31 5091',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'CFM International CFM56-7B26',
        'Registration Number': 'N68834',
        'Mode S (ICAO24) Code': 'A923CD',
        'Current Status': 'Registered',
        'Delivery Date': 'Mon Sep 22 2014',
        Owner: 'United Airlines',
        Address: ',  United States'
      }
    },
    {
      ident: 'SCX8515',
      registration: 'N713SY',
      aircraft_type: 'B737 ',
      origin_airport: 'Metro Oakland Intl',
      origin_city: 'Oakland',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T15:30:00Z',
      estimated_off: '2023-03-12T16:14:50Z',
      scheduled_on: '2023-03-12T16:21:00Z',
      estimated_on: '2023-03-12T17:08:00Z',
      status: 'En Route / Delayed',
      route_distance: 338,
      filed_ete: 3060,
      filed_altitude: 330,
      photo: {
        photo: 'https://t.plnspttrs.net/40142/943250_81e3b31a58_280.jpg',
        width: 420,
        link: 'https://www.planespotters.net/photo/943250/n713sy-sun-country-airlines-boeing-737-7q8?utm_source=api',
        credit: 'Hector Antonio -HR Planespotter'
      },
      airframeData: {
        airplaneIataType: 'B737-700',
        codeIataAirline: 'SY',
        codeIataPlaneLong: 'B737',
        codeIataPlaneShort: '73G',
        constructionNumber: '30635',
        deliveryDate: 'Tue Nov 28 2000',
        enginesType: 'JET',
        firstFlight: 'Mon Nov 13 2000',
        hexIcaoAirplane: 'A988D9',
        lineNumber: 'Tue Dec 31 0712',
        modelCode: 'B737-7Q8',
        numberRegistration: 'N713SY',
        planeAge: '16',
        planeModel: '737',
        planeOwner: 'Wilmington Trust Company',
        planeSeries: '7Q8',
        planeStatus: 'active',
        productionLine: 'Boeing 737 NG',
        registrationDate: 'Mon Oct 24 2011',
        rolloutDate: 'Thu Oct 26 2000'
      }
    },
    {
      ident: 'ACA785',
      registration: 'C-FVLU',
      aircraft_type: 'B789 ',
      origin_airport: 'Toronto Pearson Int\'l',
      origin_city: 'Toronto',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T12:10:00Z',
      estimated_off: '2023-03-12T12:39:50Z',
      scheduled_on: '2023-03-12T17:10:00Z',
      estimated_on: '2023-03-12T17:09:00Z',
      status: 'En Route / On Time',
      route_distance: 2222,
      filed_ete: 14400,
      filed_altitude: 360,
      photo: {
        photo: 'https://t.plnspttrs.net/30534/1372413_8d6cb43f3a_280.jpg',
        width: 420,
        link: 'https://www.planespotters.net/photo/1372413/c-fvlu-air-canada-boeing-787-9-dreamliner?utm_source=api',
        credit: 'Marcel Rudolf'
      },
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '787-9 Dreamliner',
        'Year built': 'Sun Dec 31 2017',
        'Construction Number (C/N)': '38360',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'General Electric GEnx-1B',
        'Registration Number': 'C-FVLU',
        'Mode S (ICAO24) Code': 'C038A7',
        'Current Status': 'Registered',
        'Delivery Date': 'Thu Feb 01 2018',
        Owner: 'Air Canada',
        Address: ',  Canada'
      }
    },
    {
      ident: 'FLE1710',
      registration: 'C-FFFX',
      aircraft_type: 'B38M ',
      origin_airport: 'Edmonton Int\'l',
      origin_city: 'Edmonton Capital Region',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T13:55:00Z',
      estimated_off: '2023-03-12T14:12:15Z',
      scheduled_on: '2023-03-12T17:10:00Z',
      estimated_on: '2023-03-12T17:09:00Z',
      status: 'En Route / On Time',
      route_distance: 1415,
      filed_ete: 8100,
      filed_altitude: 350,
      photo: {
        photo: 'https://t.plnspttrs.net/20130/1264566_1c4492a1fe_280.jpg',
        width: 420,
        link: 'https://www.planespotters.net/photo/1264566/c-fffx-flair-airlines-boeing-737-8-max?utm_source=api',
        credit: 'Nick Dean'
      },
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '737-8 MAX',
        'Year built': 'Mon Dec 31 2018',
        'Construction Number (C/N)': '61809',
        'Line Number (L/N)': 'Sun Dec 31 7854',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'CFMI LEAP-1B',
        'Registration Number': 'C-FFFX',
        'Current Status': 'Registered',
        'Delivery Date': 'Wed Apr 13 2022',
        Address: ',  Canada'
      }
    },
    {
      ident: 'ASA1218',
      registration: 'N927VA',
      aircraft_type: 'A21N ',
      origin_airport: 'Seattle-Tacoma Intl',
      origin_city: 'Seattle',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T14:10:00Z',
      estimated_off: '2023-03-12T15:07:01Z',
      scheduled_on: '2023-03-12T16:18:00Z',
      estimated_on: '2023-03-12T17:10:00Z',
      status: 'En Route / Delayed',
      route_distance: 999,
      filed_ete: 7680,
      filed_altitude: 350,
      photo: {
        photo: 'https://t.plnspttrs.net/38256/1373766_d1acf87c04_280.jpg',
        width: 497,
        link: 'https://www.planespotters.net/photo/1373766/n927va-alaska-airlines-airbus-a321-253n?utm_source=api',
        credit: 'OCFLT_OMGcat'
      },
      airframeData: {
        Manufacturer: 'Airbus',
        Model: 'A321-253N',
        'Year built': 'Sun Dec 31 2017',
        'Construction Number (C/N)': 'Mon Dec 31 8125',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'CFM International LEAP-1A33',
        'Also Registered As': 'D-AZAH  Manufacturer\'s registration',
        'Registration Number': 'N927VA',
        'Mode S (ICAO24) Code': 'ACDA07',
        'Current Status': 'Registered',
        'Delivery Date': 'Tue Mar 27 2018',
        Owner: 'AFS Investments 70 Llc',
        Address: 'Norwalk, Connecticut 06851United States'
      }
    },
    {
      ident: 'QTR8171',
      registration: 'A7-BFV',
      aircraft_type: 'B772 ',
      origin_airport: 'Lic. Benito Juarez Int\'l',
      origin_city: 'Mexico City',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T11:30:00Z',
      estimated_off: '2023-03-12T14:06:23Z',
      scheduled_on: '2023-03-12T15:10:00Z',
      estimated_on: '2023-03-12T17:10:55Z',
      status: 'En Route / Delayed',
      route_distance: 1555,
      filed_ete: 9600,
      filed_altitude: 400,
      photo: {
        photo: 'https://t.plnspttrs.net/48104/1393257_f92b3d7745_280.jpg',
        width: 448,
        link: 'https://www.planespotters.net/photo/1393257/a7-bfv-qatar-airways-cargo-boeing-777-f?utm_source=api',
        credit: 'TommyNG'
      },
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '777-F',
        'Year built': 'Tue Dec 31 2019',
        'Construction Number (C/N)': '66340',
        'Line Number (L/N)': 'Mon Dec 31 1657',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'General Electric GE90-115B',
        'Registration Number': 'A7-BFV',
        'Mode S (ICAO24) Code': '06A2E3',
        'Current Status': 'Registered',
        'Delivery Date': 'Wed Dec 30 2020',
        Owner: 'Qatar Airways Cargo',
        Address: ',  Qatar'
      }
    },
    {
      ident: 'DAL2253',
      registration: 'N337NB',
      aircraft_type: 'A319 ',
      origin_airport: 'Harry Reid Intl',
      origin_city: 'Las Vegas',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T16:25:00Z',
      estimated_off: '2023-03-12T16:30:00Z',
      scheduled_on: '2023-03-12T17:11:00Z',
      estimated_on: '2023-03-12T17:16:00Z',
      status: 'Taxiing / Left Gate',
      route_distance: 236,
      filed_ete: 2760,
      filed_altitude: 240,
      photo: {
        photo: 'https://t.plnspttrs.net/30459/1121812_0d9147026f_280.jpg',
        width: 466,
        link: 'https://www.planespotters.net/photo/1121812/n337nb-delta-air-lines-airbus-a319-114?utm_source=api',
        credit: 'Michael Rodeback'
      },
      airframeData: {
        airplaneIataType: 'A319-100',
        codeIataAirline: 'DL',
        codeIataPlaneLong: 'A319',
        codeIataPlaneShort: '319',
        constructionNumber: 'Sun Dec 31 1684',
        deliveryDate: 'Sun Feb 24 2002',
        enginesType: 'JET',
        firstFlight: 'Thu Jan 31 2002',
        hexIcaoAirplane: 'A3B0FE',
        modelCode: 'A319-114',
        numberRegistration: 'N337NB',
        numberTestRgistration: 'D-AVWL',
        planeAge: '15',
        planeModel: 'A319',
        planeOwner: 'Delta Air Lines Inc',
        planeSeries: '114',
        planeStatus: 'active',
        productionLine: 'Airbus A318/A319/A32',
        registrationDate: 'Sun Feb 24 2002',
        rolloutDate: 'Mon Jan 31 2000'
      }
    },
    {
      ident: 'UAL2607',
      registration: 'N37506',
      aircraft_type: 'B39M ',
      origin_airport: 'Orlando Intl',
      origin_city: 'Orlando',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-12T12:10:00Z',
      estimated_off: '2023-03-12T12:21:33Z',
      scheduled_on: '2023-03-12T17:10:00Z',
      estimated_on: '2023-03-12T17:21:00Z',
      status: 'En Route / On Time',
      route_distance: 2260,
      filed_ete: 14400,
      filed_altitude: 280,
      photo: {
        photo: 'https://t.plnspttrs.net/25207/1331300_1fa61eabc1_280.jpg',
        width: 421,
        link: 'https://www.planespotters.net/photo/1331300/n37506-united-airlines-boeing-737-9-max?utm_source=api',
        credit: 'Donato Bolelli'
      },
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '737-9 MAX',
        'Year built': 'Sun Dec 31 2017',
        'Construction Number (C/N)': '43432',
        'Line Number (L/N)': 'Fri Dec 31 6934',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'CFMI LEAP-1B',
        'Registration Number': 'N37506',
        'Mode S (ICAO24) Code': 'A448D5',
        'Current Status': 'Registered',
        'Delivery Date': 'Tue May 29 2018',
        Owner: 'United Airlines',
        Address: ',  United States'
      }
    }
  ]
    
  return scheduledArrivalsData
}

module.exports = {
  initScheduledJobs: initScheduledJobs,
  getData: getData,
}