const cronJob = require('node-cron')
const moment = require('moment')
const getArrivalsData = require('./arrivalsData')

let scheduledArrivalsData = {'error': 'Server data not yet initialized'}

const initScheduledJobs = () => {
  const scheduledJobFunction = cronJob.schedule('*/45 */1 * * *', async () => {
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
      ident: 'DAL1115',
      registration: 'N387DA',
      aircraft_type: 'B738 ',
      origin_airport: 'New Orleans Intl',
      origin_city: 'New Orleans',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T01:41:00Z',
      estimated_off: '2023-03-11T02:10:12Z',
      scheduled_on: '2023-03-11T05:35:00Z',
      estimated_on: '2023-03-11T06:02:00Z',
      status: 'En Route / On Time',
      route_distance: 1724,
      filed_ete: 14040,
      filed_altitude: 280,
      photo: {
        photo: 'https://t.plnspttrs.net/37317/1358851_295be49998_280.jpg',
        width: 497,
        link: 'https://www.planespotters.net/photo/1358851/n387da-delta-air-lines-boeing-737-832wl?utm_source=api',
        credit: 'OCFLT_OMGcat'
      },
      airframeData: {
        airplaneIataType: 'B737-800',
        codeIataAirline: 'DL',
        codeIataPlaneLong: 'B738',
        codeIataPlaneShort: '73H',
        constructionNumber: '30374',
        deliveryDate: 'Thu Jan 13 2000',
        enginesType: 'JET',
        firstFlight: 'Wed Dec 15 1999',
        hexIcaoAirplane: 'A47597',
        lineNumber: 'Sun Dec 31 0456',
        modelCode: 'B737-832(ET) WIN.',
        numberRegistration: 'N387DA',
        planeAge: '17',
        planeModel: '737',
        planeSeries: '832',
        planeStatus: 'inactive',
        productionLine: 'Boeing 737 NG',
        registrationDate: 'Thu Jan 13 2000'
      }
    },
    {
      ident: 'ASA1419',
      registration: 'N236AK',
      aircraft_type: 'B739 ',
      origin_airport: 'Don Miguel Hidalgo y Costilla Int\'l',
      origin_city: 'Guadalajara',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T02:40:00Z',
      estimated_off: '2023-03-11T03:24:18Z',
      scheduled_on: '2023-03-11T05:44:00Z',
      estimated_on: '2023-03-11T06:02:00Z',
      status: 'En Route / On Time',
      route_distance: 1310,
      filed_ete: 11040,
      filed_altitude: 340,
      photo: {
        photo: 'https://t.plnspttrs.net/24368/1303692_b9cdf8101c_280.jpg',
        width: 420,
        link: 'https://www.planespotters.net/photo/1303692/n236ak-alaska-airlines-boeing-737-990erwl?utm_source=api',
        credit: 'Nick Sheeder'
      },
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '737-990/ER',
        'Year built': 'Thu Dec 31 2015',
        'Construction Number (C/N)': '36351',
        'Line Number (L/N)': 'Sat Dec 31 5881',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '181',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'CFM International CFM56-7B27E',
        'Registration Number': 'N236AK',
        'Mode S (ICAO24) Code': 'A21ED4',
        'Current Status': 'Registered',
        'Delivery Date': 'Wed Apr 27 2016',
        Owner: 'Alaska Airlines',
        Address: 'Seattle, WA United States'
      }
    },
    {
      ident: 'DAL1312',
      registration: 'N3742C',
      aircraft_type: 'B738 ',
      origin_airport: 'Seattle-Tacoma Intl',
      origin_city: 'Seattle',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T03:52:00Z',
      estimated_off: '2023-03-11T04:05:48Z',
      scheduled_on: '2023-03-11T06:04:00Z',
      estimated_on: '2023-03-11T06:06:00Z',
      status: 'En Route / On Time',
      route_distance: 985,
      filed_ete: 7920,
      filed_altitude: 350,
      photo: {
        photo: 'https://t.plnspttrs.net/49331/1382783_faf3566fd6_280.jpg',
        width: 497,
        link: 'https://www.planespotters.net/photo/1382783/n3742c-delta-air-lines-boeing-737-832wl?utm_source=api',
        credit: 'Radim Koblížka'
      },
      airframeData: {
        airplaneIataType: 'B737-800',
        codeIataAirline: 'DL',
        codeIataPlaneLong: 'B738',
        codeIataPlaneShort: '73H',
        constructionNumber: '30835',
        deliveryDate: 'Wed Jan 31 2001',
        enginesType: 'JET',
        firstFlight: 'Tue Jan 09 2001',
        hexIcaoAirplane: 'A44548',
        lineNumber: 'Fri Dec 31 0754',
        modelCode: 'B737-832(ET) WIN.',
        numberRegistration: 'N3742C',
        planeAge: '16',
        planeModel: '737',
        planeSeries: '832',
        planeStatus: 'active',
        productionLine: 'Boeing 737 NG',
        registrationDate: 'Thu Feb 01 2001',
        rolloutDate: 'Wed Dec 20 2000'
      }
    },
    {
      ident: 'SWA705',
      registration: 'N288WN',
      aircraft_type: 'B737 ',
      origin_airport: 'San Jose Int\'l',
      origin_city: 'San Jose',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T05:00:00Z',
      estimated_off: '2023-03-11T05:12:33Z',
      scheduled_on: '2023-03-11T05:58:00Z',
      estimated_on: '2023-03-11T06:06:00Z',
      status: 'En Route / On Time',
      route_distance: 323,
      filed_ete: 3480,
      filed_altitude: 330,
      photo: {
        photo: 'https://t.plnspttrs.net/42773/1369038_275262883b_280.jpg',
        width: 419,
        link: 'https://www.planespotters.net/photo/1369038/n288wn-southwest-airlines-boeing-737-7h4wl?utm_source=api',
        credit: 'Gerrit Griem'
      },
      airframeData: {
        airplaneIataType: 'B737-700',
        codeIataAirline: 'WN',
        codeIataPlaneLong: 'B737',
        codeIataPlaneShort: '73W',
        constructionNumber: '36611',
        deliveryDate: 'Tue Aug 14 2007',
        enginesType: 'JET',
        firstFlight: 'Mon Jul 30 2007',
        hexIcaoAirplane: 'A2EDB4',
        lineNumber: 'Sat Dec 31 2349',
        modelCode: 'B737-7H4WIN.',
        numberRegistration: 'N288WN',
        planeAge: '10',
        planeModel: '737',
        planeSeries: '7H4',
        planeStatus: 'active',
        productionLine: 'Boeing 737 NG',
        registrationDate: 'Tue Sep 04 2007',
        rolloutDate: 'Sun Jul 22 2007'
      }
    },
    {
      ident: 'CKS369',
      registration: 'N703CK',
      aircraft_type: 'B744 ',
      origin_airport: 'Daniel K Inouye Intl',
      origin_city: 'Honolulu',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T00:40:00Z',
      estimated_off: '2023-03-11T02:03:00Z',
      scheduled_on: '2023-03-11T04:50:00Z',
      estimated_on: '2023-03-11T06:07:00Z',
      status: 'En Route / Delayed',
      route_distance: 2593,
      filed_ete: 15000,
      filed_altitude: 360,
      photo: {
        photo: 'https://t.plnspttrs.net/46473/1396293_df73fab596_280.jpg',
        width: 419,
        link: 'https://www.planespotters.net/photo/1396293/n703ck-kalitta-air-boeing-747-412bcf?utm_source=api',
        credit: 'JRC | Aviation Photography'
      },
      airframeData: {
        Manufacturer: 'Boeing',
        Model: '747-146',
        'Year built': 'Wed Dec 31 1969',
        'Construction Number (C/N)': '19727',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '495',
        'Number of Engines': '4',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'Pratt & Whitney JT9D-7A',
        'Also Registered As': 'N40483  Deregistered  Cancel',
        'Registration Number': 'N703CK',
        'Current Status': 'De-registered',
        'Delivery Date': 'Thu Nov 30 2017',
        Owner: 'Kalitta Air Llc',
        Address: ',  United States',
        'Mode S (ICAO24) Code': 'A95FEF',
        'Certification Class': 'Standard',
        'Certification Issued': 'Sun Jan 30 2005',
        'Air Worthiness Test': 'Tue Dec 20 1994',
        'Last Action Taken': 'Mon Feb 18 2008',
        'Registration Type': 'Corporation',
        Region: 'Great Lakes'
      }
    },
    {
      ident: 'DAL2054',
      registration: 'N366NB',
      aircraft_type: 'A319 ',
      origin_airport: 'San Francisco Int\'l',
      origin_city: 'San Francisco',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T04:47:00Z',
      estimated_off: '2023-03-11T05:20:04Z',
      scheduled_on: '2023-03-11T05:38:00Z',
      estimated_on: '2023-03-11T06:07:00Z',
      status: 'En Route / On Time',
      route_distance: 338,
      filed_ete: 3060,
      filed_altitude: 350,
      photo: {
        photo: 'https://t.plnspttrs.net/36970/1124865_ca27f9d1e0_280.jpg',
        width: 420,
        link: 'https://www.planespotters.net/photo/1124865/n366nb-delta-air-lines-airbus-a319-114?utm_source=api',
        credit: 'Wolfgang Kaiser'
      },
      airframeData: {
        airplaneIataType: 'A319-100',
        codeIataAirline: 'DL',
        codeIataPlaneLong: 'A319',
        codeIataPlaneShort: '319',
        constructionNumber: 'Wed Dec 31 2025',
        deliveryDate: 'Wed Sep 03 2003',
        enginesType: 'JET',
        firstFlight: 'Mon Jul 21 2003',
        hexIcaoAirplane: 'A423C4',
        modelCode: 'A319-114',
        numberRegistration: 'N366NB',
        numberTestRgistration: 'D-AVWX',
        planeAge: '14',
        planeModel: 'A319',
        planeOwner: 'Delta Air Lines Inc',
        planeSeries: '114',
        planeStatus: 'active',
        productionLine: 'Airbus A318/A319/A32',
        registrationDate: 'Wed Sep 03 2003',
        rolloutDate: 'Mon Mar 06 2000'
      }
    },
    {
      ident: 'JSX324',
      registration: 'N262JX',
      aircraft_type: 'E135 ',
      origin_airport: 'Harry Reid Intl',
      origin_city: 'Las Vegas',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T03:00:00Z',
      estimated_off: '2023-03-11T05:23:57Z',
      scheduled_on: '2023-03-11T03:40:00Z',
      estimated_on: '2023-03-11T06:08:00Z',
      status: 'En Route / Delayed',
      route_distance: 283,
      filed_ete: 2400,
      filed_altitude: 220,
      photo: {
        photo: 'https://t.plnspttrs.net/44746/1343877_d959b67f11_280.jpg',
        width: 419,
        link: 'https://www.planespotters.net/photo/1343877/n262jx-jsx-embraer-erj-135lr?utm_source=api',
        credit: 'Maarten Dols'
      },
      airframeData: {
        Manufacturer: 'Embraer',
        Model: 'ERJ-135LR (EMB-135LR)',
        'Year built': 'Sun Dec 31 2000',
        'Construction Number (C/N)': '145533',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '37',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'Rolls-Royce AE 3007A1P',
        'Also Registered As': 'N12530  De-registered',
        'Registration Number': 'N262JX',
        'Mode S (ICAO24) Code': 'A28749',
        'Current Status': 'Registered',
        'Delivery Date': 'Tue Nov 27 2001',
        Owner: 'JetSuite X',
        Address: 'Dallas, Texas United States'
      }
    },
    {
      ident: 'VOI920',
      registration: 'XA-VLL',
      aircraft_type: 'A320 ',
      origin_airport: 'General Francisco J. Mujica Int\'l',
      origin_city: 'Morelia',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T02:45:00Z',
      estimated_off: '2023-03-11T03:20:29Z',
      scheduled_on: '2023-03-11T05:23:00Z',
      estimated_on: '2023-03-11T06:09:00Z',
      status: 'En Route / Delayed',
      route_distance: 1445,
      filed_ete: 9480,
      filed_altitude: 360,
      photo: {
        photo: 'https://t.plnspttrs.net/20939/1252660_5d73f38c8f_280.jpg',
        width: 420,
        link: 'https://www.planespotters.net/photo/1252660/xa-vll-volaris-airbus-a320-233wl?utm_source=api',
        credit: 'Jon Marzo'
      },
      airframeData: {
        Manufacturer: 'Airbus',
        Model: 'A320-233',
        'Year built': 'Wed Dec 31 2014',
        'Construction Number (C/N)': 'Sat Dec 31 6777',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': 'N/A',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'IAE V2527-A5',
        'Registration Number': 'XA-VLL',
        'Current Status': 'Registered',
        'Delivery Date': 'Tue Sep 22 2015',
        Address: ',  Mexico'
      }
    },
    {
      ident: 'SKW3421',
      registration: 'N175SY',
      aircraft_type: 'E75L ',
      origin_airport: 'San Francisco Int\'l',
      origin_city: 'San Francisco',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T01:10:00Z',
      estimated_off: '2023-03-11T05:23:00Z',
      scheduled_on: '2023-03-11T01:53:00Z',
      estimated_on: '2023-03-11T06:14:00Z',
      status: 'En Route / Delayed',
      route_distance: 338,
      filed_ete: 2580,
      filed_altitude: 350,
      photo: {
        photo: 'https://t.plnspttrs.net/12656/1399664_d8dc125e5d_280.jpg',
        width: 448,
        link: 'https://www.planespotters.net/photo/1399664/n175sy-alaska-airlines-embraer-erj-175lr-erj-170-200-lr?utm_source=api',
        credit: 'Marc Charon'
      },
      airframeData: {
        Manufacturer: 'Embraer',
        Model: '175LR (ERJ-170-200LR)',
        'Year built': 'Wed Dec 31 2014',
        'Construction Number (C/N)': 'Invalid Date',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '88',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'General Electric CF34-8E5',
        'Also Registered As': 'PR-EPQ  Manufacturer\'s registration',
        'Registration Number': 'N175SY',
        'Mode S (ICAO24) Code': 'A12D67',
        'Current Status': 'Registered',
        'Delivery Date': 'Wed Dec 09 2015',
        Owner: 'SkyWest Airlines/Alaska Airlines',
        Address: 'St. George, Utah 84790United States'
      }
    },
    {
      ident: 'AAL2780',
      registration: 'N915AN',
      aircraft_type: 'B738 ',
      origin_airport: 'Austin-Bergstrom Intl',
      origin_city: 'Austin',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T03:10:00Z',
      estimated_off: '2023-03-11T03:20:42Z',
      scheduled_on: '2023-03-11T06:03:00Z',
      estimated_on: '2023-03-11T06:15:00Z',
      status: 'En Route / On Time',
      route_distance: 1275,
      filed_ete: 10380,
      filed_altitude: 320,
      photo: {
        photo: 'https://t.plnspttrs.net/28749/1214480_7f2fa2f0f4_280.jpg',
        width: 497,
        link: 'https://www.planespotters.net/photo/1214480/n915an-american-airlines-boeing-737-823wl?utm_source=api',
        credit: 'Stephen J Stein'
      },
      airframeData: {
        airplaneIataType: 'B737-800',
        codeIataAirline: 'AA',
        codeIataPlaneLong: 'B738',
        codeIataPlaneShort: '73H',
        constructionNumber: '29516',
        deliveryDate: 'Tue Jul 27 1999',
        enginesType: 'JET',
        firstFlight: 'Thu Jul 08 1999',
        hexIcaoAirplane: 'ACA94B',
        lineNumber: 'Sat Dec 31 0321',
        modelCode: 'B737-823(ET) WIN.',
        numberRegistration: 'N915AN',
        planeAge: '18',
        planeModel: '737',
        planeSeries: '823',
        planeStatus: 'active',
        productionLine: 'Boeing 737 NG',
        registrationDate: 'Tue Jul 27 1999'
      }
    },
    {
      ident: 'VOI926',
      registration: 'XA-VLM',
      aircraft_type: 'A20N ',
      origin_airport: 'Lic. Benito Juarez Int\'l',
      origin_city: 'Mexico City',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T02:23:00Z',
      estimated_off: '2023-03-11T02:39:59Z',
      scheduled_on: '2023-03-11T05:36:00Z',
      estimated_on: '2023-03-11T06:15:08Z',
      status: 'En Route / Delayed',
      route_distance: 1555,
      filed_ete: 11580,
      filed_altitude: 320,
      photo: {
        photo: 'https://t.plnspttrs.net/45551/1362658_b04f7a810b_280.jpg',
        width: 419,
        link: 'https://www.planespotters.net/photo/1362658/xa-vlm-volaris-airbus-a320-233wl?utm_source=api',
        credit: 'Jan Seler'
      },
      airframeData: {
        Manufacturer: 'Airbus',
        Model: 'A320-233',
        'Year built': 'Wed Dec 31 2014',
        'Construction Number (C/N)': 'Thu Dec 31 6905',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '179',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'IAE V2527E-A5',
        'Registration Number': 'XA-VLM',
        'Mode S (ICAO24) Code': '0D0984',
        'Current Status': 'Registered',
        'Delivery Date': 'Tue Dec 08 2015',
        Address: ',  Mexico'
      }
    },
    {
      ident: 'AAL374',
      registration: 'N580UW',
      aircraft_type: 'A321 ',
      origin_airport: 'Chicago O\'Hare Intl',
      origin_city: 'Chicago',
      destination_airport: 'Los Angeles Intl',
      destination_city: 'Los Angeles',
      scheduled_off: '2023-03-11T01:25:00Z',
      estimated_off: '2023-03-11T01:50:54Z',
      scheduled_on: '2023-03-11T05:27:00Z',
      estimated_on: '2023-03-11T06:16:00Z',
      status: 'En Route / Delayed',
      route_distance: 1776,
      filed_ete: 14520,
      filed_altitude: 300,
      photo: {
        photo: 'https://t.plnspttrs.net/48897/1141038_c423a25298_280.jpg',
        width: 422,
        link: 'https://www.planespotters.net/photo/1141038/n580uw-american-airlines-airbus-a321-231?utm_source=api',
        credit: 'Hal Groce'
      },
      airframeData: {
        Manufacturer: 'Airbus',
        Model: 'A321-231',
        'Year built': 'Tue Dec 31 2013',
        'Construction Number (C/N)': 'Wed Dec 31 6132',
        'Aircraft Type': 'Fixed wing multi engine',
        'Number of Seats': '187',
        'Number of Engines': '2',
        'Engine Type': 'Turbofan',
        'Engine Manufacturer and Model': 'IAE V2533-A5',
        'Registration Number': 'N580UW',
        'Current Status': 'registered',
        'Delivery Date': 'Mon Jun 09 2014',
        Owner: 'American Airlines',
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