const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Note = require('../models/note')

usersRouter.get('/:user', async (request,response,next) => {
  try {
    const user = await User.find({username: request.params.user})
    response.json(user)
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
usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    mail: body.mail,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter