const mongoose = require('mongoose')

const airframeDataSchema = new mongoose.Schema({
  registration: String,
  data: Object,
})
    
const AirframeDataModel = mongoose.model('Airframe', airframeDataSchema)
    
module.exports = AirframeDataModel