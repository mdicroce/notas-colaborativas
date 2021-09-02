const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Note = require('../models/note')
const Room = require('../models/room')
const { findByIdAndDelete } = require('../models/user')

usersRouter.delete('/deleteAll', async(request,response) => {
  await User.deleteMany({})
  await Room.deleteMany({})
  await Note.deleteMany({})
  response.send("vamos menem").end()
})
usersRouter.get('/search/:user', async (request,response,next) => {
  try {
    const requestToFind = new RegExp(request.params.user,'i')
    const user = await User.find({username: requestToFind})
    if(user)
    {
      response.json(user)
    }
    else
    {
      user = await User.find({mail: requestToFind})
      response.json(user)
    }
  } catch (error) {
    next(error)
  }
})
usersRouter.get('/notes', async(request,response,next) => {
  try{
    const notes = await Note.find({owner: request.body.userId})
    response.json(notes)
  }
  catch ( error)
  {
    next(error)
  }
})
usersRouter.post('/', async (request, response, next) => {
  const body = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  const user = new User({
    username: body.username,
    email: body.email,
    passwordHash
  })
  console.log(user)

  try {
    const savedUser = await user.save()
    const room = new Room({
    roomName: savedUser.username + " personal Room",
    owner: savedUser.id,
    users: [savedUser.id],
    pass: ''
  })
    const savedRoom = await room.save()
    
    const updatedUser = await User.findByIdAndUpdate(savedUser.id, {personalRoom: savedRoom._id}, {new: true})
    response.json(updatedUser)
  } catch (error) {
    next(error)
  }
  
})

module.exports = usersRouter