const {Schema, model, Types} = require('mongoose')
const schema = new Schema({
  category: {type: String, required: false,default:'-'},
  type: {type: String, required: false,default:'-'},
  chat_id: {type: String, required: true},
  pib: {type: String, required: false,default:'-'},
  proffesion: {type: String, required: false,default:'-'},
  city: {type: String, required: false,default:'-'},
  time_work: {type: String, required: false,default:'-'},
  whatDoYouDo: {type: String, required: false,default:'-'},
  howMuch: {type: String, required: false,default:'-'},
  when: {type: String, required: false,default:'-'},
  product: {type: String, required: false,default:'-'},
  typeSend: {type: String, required: false,default:'-'},
  mass: {type: String, required: false,default:'-'},
  howMuchNeed: {type: String, required: false,default:'-'},
  whyNeed: {type: String, required: false,default:'-'},
  whatPeopleNeed: {type: String, required: false,default:'-'}
})

module.exports = model('Orders', schema)
