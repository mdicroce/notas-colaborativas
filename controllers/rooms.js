const roomRouter = require('express').Router()
const Room = require('../models/room')
const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')
roomRouter.get('/', async(request, response) => {
    const decodedToken = request.decodedToken
    const respuesta = await Room.find({'users':decodedToken.id}).populate('owner').populate('users')
    response.json(respuesta)
})
roomRouter.get('/:id',async (request,response) => {
    const decodedToken = request.decodedToken
    const respuesta = await Room.find({'_id':request.params.id ,'users':decodedToken.id}).populate('owner').populate('users').populate('notes')
    response.json(respuesta)
})

roomRouter.post('/',async (request,response,next) => {
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.pass, saltRounds)
    const decodedToken = request.decodedToken

    const room = new Room({
        roomName: body.roomName,
        owner: decodedToken.id,
        users: [decodedToken.id],
        notes: [],
        pass : passwordHash
    })
    try {
        const newRoom = await room.save()
        response.json(newRoom)
    } catch (error) {
        next(error)
    }
})

roomRouter.put('/:id', async(request,response,next) => {
    const room = await Room.findById(request.params.id)
    if(!room)
    {
        response.status(404)
    }
    const newUser = await User.findOne({username: request.body.username})
    room.users = room.users.filter((actual) => {
        return !actual.equals(newUser._id)
    }).concat(newUser._id)
    try {
        await room.save()
        response.json(await Room.find({'_id':request.params.id}).populate('owner').populate('users').populate('notes'))
    } catch (error) {
        next(error)
    }
})
roomRouter.delete('/:id',(request,response,next) =>{
    Room.findById(request.params.id)
    .then((room) => {
        room.notes.forEach(async(actual) => {await Note.deleteOne({"_id" : actual})})
    })
    Room.findByIdAndDelete(request.params.id)
    .then(()=> {
        response.status(204).end()
    })
    .catch(error => (error))
})

module.exports = roomRouter
