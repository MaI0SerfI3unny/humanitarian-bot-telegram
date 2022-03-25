const TelegaBot = require("node-telegram-bot-api")
const mongoose = require('mongoose')
const config = require('config')
const User = require('./models/Users')
const Orders = require('./models/Orders')
const locale = require('./locale/locale.js')


const bot = new TelegaBot(config.get('API_TELEGRAM_BOT'), {
    polling: {
      interval: 100,
      autoStart: true,
      params:{
        timeout: 2
      }
    }
  })

  var answerCallbacks = {};

  bot.on('message', function (msg) {
      var callback = answerCallbacks[msg.chat.id];
      if (callback) {
          delete answerCallbacks[msg.chat.id];
          return callback(msg);
      }
  });

  bot.on('message', async(msg) => {
    const id = msg.chat.id
    const findUser = await User.findOne({ id_chat: id })
    if(msg.text === "Гроші" || msg.text === "Money"){
     bot.sendMessage(id, locale[findUser.language].moneyReqisit, {reply_markup:{remove_keyboard: true}})
     menu(id,findUser)
    }else if(msg.text === 'Послуги' || msg.text === 'Services'){
      bot.sendMessage(id, locale[findUser.language].typePib,{reply_markup:{remove_keyboard: true}}).then(function () {
        answerCallbacks[id] = function (answer) {
            const pib = answer.text;
            bot.sendMessage(id, locale[findUser.language].whatYouDo).then(function () {
                answerCallbacks[id] = function (answer) {
                    const proffesion = answer.text;
                    bot.sendMessage(id, locale[findUser.language].howMuch).then(function () {
                        answerCallbacks[id] = function (answer) {
                            const hours = answer.text;
                            bot.sendMessage(id, locale[findUser.language].didYouSave).then(function () {
                              answerCallbacks[id] = async function (answer) {
                                const from = answer.text
                                bot.sendMessage(id, locale[findUser.language].thxForRequest)
                                const createnewOrder = new Orders({
                                  chat_id: id,
                                  category: "uslugi",
                                  pib: pib,
                                  proffesion: proffesion,
                                  time_work: hours,
                                  city: from,
                                  type: 'canhelp'
                                })
                                await createnewOrder.save()
                                menu(id,findUser)
                              }
                            })
                        }
                    })
                }
            })
        }
    })
    }else if(msg.text === "Руки/Люди" || msg.text === "Hands/People"){
      bot.sendMessage(id, locale[findUser.language].whatYouCanHelp,{reply_markup:{remove_keyboard: true}}).then(function () {
        answerCallbacks[id] = function (answer) {
        const whatDoYouDo = answer.text;
          bot.sendMessage(id, locale[findUser.language].howMuchPeople).then(function () {
            answerCallbacks[id] = function (answer) {
              const howMuch = answer.text;
              bot.sendMessage(id, locale[findUser.language].whenYouCanStart).then(function () {
                answerCallbacks[id] = async function (answer) {
                  const when = answer.text
                  bot.sendMessage(id, locale[findUser.language].thxForRequest)
                  const createnewOrder = new Orders({
                    chat_id: msg.chat.id,
                    category: "hands",
                    whatDoYouDo: whatDoYouDo,
                    howMuch: howMuch,
                    when: when,
                    type: 'canhelp'
                  })
                  await createnewOrder.save()
                  menu(id,findUser)
                }
              })
            }
          })
        }
    })
  }else if(msg.text === 'Товар' || msg.text === "Products"){
    bot.sendMessage(id, locale[findUser.language].whatExactly,{reply_markup:{remove_keyboard: true}}).then(function () {
      answerCallbacks[id] = function (answer) {
        const product = answer.text;
        bot.sendMessage(id, locale[findUser.language].typeSend).then(function () {
          answerCallbacks[id] = function (answer) {
            const typeSend = answer.text;
            bot.sendMessage(id, locale[findUser.language].location).then(function () {
              answerCallbacks[id] = function (answer) {
                const city = answer.text;
                bot.sendMessage(id, locale[findUser.language].weigh).then(function () {
                  answerCallbacks[id] = async function (answer) {
                    const mass = answer.text
                    bot.sendMessage(id, locale[findUser.language].thxForRequest)
                    const createnewOrder = new Orders({
                      chat_id: msg.chat.id,
                      category: "product",
                      product: product,
                      typeSend: typeSend,
                      city: city,
                      mass: mass,
                      type: 'canhelp'
                    })
                    await createnewOrder.save()
                    menu(id,findUser)
                  }
                })
              }
            })
          }
        })
      }
    })
  }else if(msg.text === 'Need money' || msg.text === 'Потрібні гроші'){
    bot.sendMessage(id, locale[findUser.language].howMuchMoney,{reply_markup:{remove_keyboard: true}}).then(function () {
      answerCallbacks[id] = function (answer) {
        const howMuchNeed = answer.text;
        bot.sendMessage(id, locale[findUser.language].whyNeedMoney).then(function () {
          answerCallbacks[id] = async function (answer) {
          const whyNeed = answer.text;
          bot.sendMessage(id, locale[findUser.language].moneyComplete)
          const createnewOrder = new Orders({
              chat_id: id,
              category: "money",
              howMuchNeed: howMuchNeed,
              whyNeed: whyNeed,
              type: 'needhelp'
            })
            await createnewOrder.save()
            menu(id,findUser)
          
          }
        })
      }
    })
  }else if(msg.text === 'Потрібні люди' || msg.text === 'Need people'){
    bot.sendMessage(id, locale[findUser.language].whatNeedPeople,{reply_markup:{remove_keyboard: true}}).then(function () {
      answerCallbacks[id] = function (answer) {
        const whatPeopleNeed = answer.text;
        bot.sendMessage(id, locale[findUser.language].whyNeedPeople).then(function () {
          answerCallbacks[id] = async function (answer) {
            const whyNeed = answer.text;
            bot.sendMessage(id, locale[findUser.language].peopleComplete)
            const createnewOrder = new Orders({
              chat_id: id,
              category: "people",
              whatPeopleNeed: whatPeopleNeed,
              whyNeed: whyNeed,
              type: 'needhelp'
            })
            await createnewOrder.save()
            menu(id,findUser)
          }
        })
      }
    })
  }else if(msg.text === 'Потрібен продукт' || msg.text === 'Need product'){
    bot.sendMessage(id, locale[findUser.language].whatProductNeed,{reply_markup:{remove_keyboard: true}}).then(function () {
      answerCallbacks[id] = async function (answer) {
        const whatProductNeed = answer.text;
        bot.sendMessage(id, locale[findUser.language].productComplete)
        const createnewOrder = new Orders({
          chat_id: id,
          category: "product",
          whatProductNeed: whatProductNeed,
          type: 'needhelp'
        })
        await createnewOrder.save()
        menu(id,findUser)
      }
    })
  }else if(msg.text === 'Потрібна послуга' || msg.text === 'Need services'){
    bot.sendMessage(id, locale[findUser.language].whatServicesNeed,{reply_markup:{remove_keyboard: true}}).then(function () {
      answerCallbacks[id] = async function (answer) {
        const whatServiceNeed = answer.text;
        bot.sendMessage(id, locale[findUser.language].serviceComplete)
        const createnewOrder = new Orders({
          chat_id: id,
          category: "service",
          whatServiceNeed: whatServiceNeed,
          type: 'needhelp'
        })
        await createnewOrder.save()
        menu(id,findUser)
      }
    })
  }
  })

  bot.on("contact",async(msg)=>{
    const findUser = await User.findOne({ id_chat: msg.chat.id })
    if(findUser){
      findUser.overwrite({
        id_chat: findUser.id_chat,
        language: findUser.language,
        phone: msg.contact.phone_number
      });
      await findUser.save();
    }
    bot.sendMessage(msg.chat.id, locale[findUser.language].descComplete)
    menu(msg.chat.id,findUser)  
})

const menu = (id,findUser) => {
  bot.sendMessage(id, locale[findUser.language].descMainMenu, {
  reply_markup: {
    inline_keyboard:[
      [
        {text: locale[findUser.language].btnNeedHelp, callback_data: 'help'},
        {text: locale[findUser.language].btnHelp, callback_data: 'can_help'}
      ]
    ],
  }
})
}

bot.onText(/\/start/, async(msg) => {
    const {id} = msg.chat

    const findUser = await User.findOne({ id_chat: id })

    if(findUser){
      menu(id,findUser)
    }else{
      bot.sendMessage(id, "Оберіть будь-ласка мову/Please choose your language",{
        reply_markup: {
          inline_keyboard:[
            [
              {text: `🇺🇦 UA`,callback_data: 'ua_set'},
              {text: '🇬🇧 EN',callback_data: 'en_set'}
            ]
          ]
        }})
    }
  })


  bot.on('callback_query', async(query) => {
    const {data} = query
    const id = query.message.chat.id
    const findUser = await User.findOne({ id_chat: id })
    
    if (data === 'help') {
      bot.sendMessage(id, locale[findUser.language].descNeedHelp,{
        reply_markup:{
          keyboard:[
            [locale[findUser.language].needMoney, locale[findUser.language].needPeople],
            [locale[findUser.language].needProduct, locale[findUser.language].needServices],
          ]
        }
      })
      
    }else if(data === 'can_help') {
      bot.sendMessage(id, locale[findUser.language].descCanHelp,{
          reply_markup:{
            keyboard:[
              [locale[findUser.language].money, locale[findUser.language].hand],
              [locale[findUser.language].product,locale[findUser.language].usluga],
            ]
          }
        })
    }else if(data === 'ua_set' || data === 'en_set'){
        const findCandidate = await User.findOne({ id_chat: query.message.chat.id })
        if(!findCandidate){
          const createNewUser = new User({
            id_chat: query.message.chat.id,
            language: data === 'ua_set'? 'ua' : 'en'
           })
         await createNewUser.save() 
        }
        bot.sendMessage(query.message.chat.id, locale[data === 'ua_set'? 'ua' : 'en'].share,{
          "parse_mode": "Markdown",
          "reply_markup": JSON.stringify({
            "keyboard": [
              [{ text: locale[data === 'ua_set'? 'ua' : 'en'].shareBtn, request_contact: true }]
            ],
            "one_time_keyboard" : true
          })
        })  
    }else{
      bot.sendMessage(query.message.chat.id, "Вибачте, не можу обробити інформацію")
    }
  })

  async function start() {
    try {
      await mongoose.connect(config.get('mongoUri'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log("Mongo connected");
    } catch (e) {
      console.log('Server Error', e.message)
      process.exit(1)
    }
  }

  start()