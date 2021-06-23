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
        users: [],
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

roomRouter.put('/comment/:id', async(request,response,next) => {
    try {
        let commentedNote = await Note.findById(request.params.id)
        if(!commentedNote)
        {
            response.status(404)
        }
    } catch (error) {
        next(error)
    }
    const body = request.body
    const notes = 
    [
        ...commentedNote.comments,
        {   
            title: body.title,
            content: body.content,
            date: body.date || Date.now,
            comments: [],
            username: body.name,
            mail: body.mail
        }
    ]
    commentedNote = {...commentedNote, comments: notes}
    try {
        const updateNote = await Note.findByIdAndUpdate(request.params.id, commentedNote,{ new: true})
        response.json(updateNote)
    } catch (error) {
        next(error)
    }
})
roomRouter.delete('/:id',(request,response,next) =>{
    Note.findByIdAndRemove(request.params.id)
    .then(()=> {
        response.status(204).end()
    })
    .catch(error => (error))
})

roomRouter.put('/:id',async(request,response,next) => {
    const body = request.body
    
    const note = {   
        title: body.title,
        content: body.content,
        date: body.date || Date.now,
        comments: [...body.comments],
        username: body.name,
        mail: body.mail
    }

    try {
        const updateNote = await Note.findByIdAndUpdate(request.params.id, note,{ new: true})
        response.json(updateNote)
    } catch (error) {
        next(error)
    }
})

module.exports = roomRouter
