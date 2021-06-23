const roomRouter = require('express').Router()
const Room = require('../models/room')
const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')

roomRouter.get('/:id',async (request,response) => {
    const pass = await bcrypt.hash(body.pass, saltRounds)
    try {
        const room = await Room.findById(request.params.id).populate('owner','users','notes')
        if(room)
        {
            if(room.pass === pass)
            {
                response.json(room)
            }
            else if(room.users.some((actual)=> actual.id === request.body.userId))
            {
                response.json(room)
            }
            response.status(404).end()
        }
        else
        {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

roomRouter.post('/',async (request,response,next) => {
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.pass, saltRounds)
    const room = new Room({
        owner: body.ownerId,
        users: [body.ownerId],
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
    try {
        let room = await Room.findById(request.params.id)
        if(!room)
        {
            response.status(404)
        }
    } catch (error) {
        next(error)
    }
    const newUser = User.find({username: request.body.username})
    const rooms = 
    {
        ...room,
        users: [...room.users, newUser.id]
    }
    try {
        const updateRoom = await Room.findByIdAndUpdate(request.params.id, rooms,{ new: true})
        response.json(updateRoom)
    } catch (error) {
        next(error)
    }
})
roomRouter.delete('/:id',(request,response,next) =>{
    Room.findByIdAndRemove(request.params.id)
    .then(()=> {
        response.status(204).end()
    })
    .catch(error => (error))
})

module.exports = roomRouter
