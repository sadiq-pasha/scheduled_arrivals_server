const data = [
  {
    airplaneIataType: 'B737-700',
    airplaneId: 17573,
    codeIataAirline: 'WN',
    codeIataPlaneLong: 'B737',
    codeIataPlaneShort: '73W',
    codeIcaoAirline: '',
    constructionNumber: '35554',
    deliveryDate: '2006-10-31T23:00:00.000Z',
    enginesCount: '2',
    enginesType: 'JET',
    firstFlight: '2006-10-22T22:00:00.000Z',
    hexIcaoAirplane: 'A27AEE',
    lineNumber: '2092',
    modelCode: 'B737-7H4WIN.',
    numberRegistration: 'N259WN',
    numberTestRgistration: '',
    planeAge: '11',
    planeClass: null,
    planeModel: '737',
    planeOwner: '',
    planeSeries: '7H4',
    planeStatus: 'active',
    productionLine: 'Boeing 737 NG',
    registrationDate: '2006-12-04T23:00:00.000Z',
    rolloutDate: '2006-10-09T22:00:00.000Z'
  }
]

console.log(Object.fromEntries(Object.entries(data[0]).filter(value => value[1] && value[1].length > 1)))