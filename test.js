const moment = require('moment')

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
  'engineType': 'Engine Type',
  'isFreighter': null,
  'productionLine': 'Production Line',
  'ageYears': 'Age',
  'verified': 'Verified Information'
}
  
const test= {
  'id': 1779,
  'reg': 'N390HA',
  'active': true,
  'serial': '1389',
  'hexIcao': 'A48379',
  'airlineName': 'Hawaiian Airlines',
  'iataCodeShort': '332',
  'icaoCode': 'A332',
  'model': 'A332',
  'modelCode': '330-243',
  'numSeats': 278,
  'rolloutDate': '2013-01-18',
  'firstFlightDate': '2013-01-18',
  'deliveryDate': '2013-02-26',
  'registrationDate': '2013-02-25',
  'typeName': 'Airbus A330-200',
  'numEngines': 2,
  'engineType': 'Jet',
  'isFreighter': false,
  'productionLine': 'Airbus A330',
  'ageYears': 10.2,
  'verified': true,
  'numRegistrations': 1
}
const airframedataSanitized =  Object.fromEntries(
  Object.entries(test)
    .filter(value => value[1] && humanReadableDataKeys[value[0]])
    .map((value) => {
      if (Object.keys(humanReadableDataKeys).includes(value[0])){
        value[0] = humanReadableDataKeys[value[0]]
      }
      if (moment(value[1], 'YYYY-MM-DDTHH:mm:ss', true).isValid()){
        return [value[0], new Date(value[1]).toDateString()]
      } else{
        return [value[0],value[1]]
      }
    })
    .sort(function(a,b){return a[0].localeCompare(b[0])})
)

console.log(airframedataSanitized)