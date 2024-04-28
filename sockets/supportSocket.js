const jwt = require('jsonwebtoken')
const sendResponse = require("../utils/sendResponse")
const randomNumber = require('../utils/generateRandomNumber')

const tempStorage = {}
const users = {}
const admins = []

const jsonMessage = (message,room,target,source) => {
  return JSON.stringify({
    message:message,
    room:room,
    target:target,
    source:source
  })
}

const pushTempStorage = (message,room,target,source) => {

  tempStorage[room].messages.push({
    message:message,
    room:room,
    target:target,
    source:source,
  })

}

const sendMessageToAdmins = (message,room,target) => {
  admins.forEach((admin)=>{
    if (admin.room===room){
      admin.ws.send(jsonMessage(
        message,
        room,
        target,
        'user'
      ))
    }
  })
}

const sendClientsToAdmins = () => {
  admins.forEach((admin)=>{
    admin.ws.send(JSON.stringify({clients:Object.keys(users)}))
  })
}


const messageUserHandler = (ws, req) => {

  const {room} = req.query
  const connectionId = !room || room=='undefined' ? randomNumber() : room;
  users[connectionId] = ws;
  
  if(tempStorage[connectionId]?.messages){
    ws.send(
      JSON.stringify(
        tempStorage[connectionId].messages.map(message => {
          return {
            message:message.message,
            room:connectionId,
            target:message.target,
            source:message.source,
          }
        })
      )
    )

    
  }
  else{
    tempStorage[connectionId] = {messages:[]}

    pushTempStorage(
      `Здравствуйте, оператор скоро ответит вам... (Рабочее время 8:00-20:00)`,
      connectionId,
      connectionId,
      'server'
    )

    ws.send(jsonMessage(`Здравствуйте, оператор скоро ответит вам... (Рабочее время 8:00-20:00)`,connectionId,connectionId,'server'))
  }

  sendClientsToAdmins()
  
  users[connectionId].on('message', (msg) => {
    
    msg=JSON.parse(msg)
    
    pushTempStorage(
      msg.message,
      msg.room,
      msg.target,
      'user'
    )

    sendMessageToAdmins( msg.message,msg.room,msg.target)
    
  })

  users[connectionId].on('close', () => {
    delete users[connectionId]
    sendMessageToAdmins('Пользователь закрыл обращение',connectionId,connectionId)
    sendClientsToAdmins()
  })

}

const messageAdminHandler = (ws, req) => {
  const {room,id} = req.query

  admins[id] = {ws:ws,room:room}

  //send messages storage
  if(room) {
    ws.send(JSON.stringify({
      chat:tempStorage[room].messages.map(message => {
        return {
          message:message.message,
          room:room,
          target:message.target,
          source:message.source,
        }
      })
    }))
  }
  ws.send(JSON.stringify({clients:Object.keys(users)}))

  ws.on('message', (msg) => {
    msg=JSON.parse(msg)

    if(!users[msg.room]) return 

    users[msg.room].send(jsonMessage(
      msg.message,
      msg.room,
      msg.target,
      'server'
    ))

    pushTempStorage(
      msg.message,
      msg.room,
      msg.target,
      'server'
    )
    
  })
}

module.exports = {messageUserHandler,messageAdminHandler}