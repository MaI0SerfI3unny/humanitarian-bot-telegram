const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  id_chat: {type: String, required: true},
  language: {type: String, required: true},
  phone: {type: String, required: false, default: '-'},
})

module.exports = model('Users', schema)
