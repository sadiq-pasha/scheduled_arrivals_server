const unknownAirframeNumbers = [1,2,3,4,5,6,7,8,9,12,11]
const unfindableData = [56,45,34,23]
const scrapeDataFor = unknownAirframeNumbers
  .filter(registration => {
    if(unfindableData.includes(registration)){
      console.log(`unfindable airframe ${registration}`)
      return false
    } else {
      return true
    }
  }).slice(0,10)

console.log(scrapeDataFor)
