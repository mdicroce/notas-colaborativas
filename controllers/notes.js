const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const Room = require('../models/room')


notesRouter.get('/user/:username',(request,response) => {
    const userToFind = User.find({'username': request.params.username})
    .then(response=>response)
    Note.find({'owner': userToFind.id})
    .then(note => {
        if(note)
        {
            response.json(note)
        }
        else{
            response.status(404).end()
        }
    })
})
notesRouter.get('/:id',async (request,response,next) => {
    Note.findById(request.params.id).populate('owner').populate('room').populate('moreNotes')
    .then(note => {
        if(note)
        {
            response.json(note)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

notesRouter.post('/',async (request,response,next) => {
    
    const body = request.body
    decodedToken = request.decodedToken

    const note = new Note({
        title: body.title,
        owner: decodedToken.id,
        responsable: body.responsableId ? body.responsableId : decodedToken.id,
        content: body.content,
        moreNotes: [],
        date: new Date(),
        room: body.room
    })
    try {
        
        const savedNote = await note.save()
        const room = await Room.findById(body.room)
        console.log(room)
        room.notes = room.notes.concat(savedNote._id)
        await room.save()
        response.json(savedNote)
    } catch (error) {
        next(error)
    }
})
notesRouter.put('/comment/:id', async(request,response,next) => {
    const body = request.body
    oldNote = await Note.findById(request.params.id)
    const note = {
        title: body.title,
        owner: body.ownerId,
        responsable: body.responsableId || body.ownerId,
        content: body.content,
        moreNotes: body.moreNotes,
        date: new Date()
    }
    console.log(oldNote.moreNotes, "")
    oldNote.moreNotes = oldNote.moreNotes.concat(note)
    
    try {
        const updateNote = await Note.findByIdAndUpdate(request.params.id, oldNote,{ new: true})
        response.json(updateNote)
    } catch (error) {
        next(error)
    }
})
notesRouter.delete('/:id',async (request,response,next) =>{
    Note.findById(request.params.id)
    .then(async (note) => {
        let room = await Room.findById(note.room)
        console.log(room)
        room.notes = room.notes.filter((actual) => actual != request.params.id)
        console.log(room)
        room.save()
        
    })
    Note.deleteOne({"id" : request.params.id})
    .then(()=> {
        response.status(204).end()
    })
    .catch(error => (next(error)))
})

notesRouter.put('/:id',async(request,response,next) => {
    const body = request.body
    
    const note = {
        title: body.title,
        owner: body.ownerId,
        responsable: body.responsableId || body.ownerId,
        content: body.content,
        moreNotes: body.moreNotes,
        date: new Date()
    }
    
    try {
        const updateNote = await Note.findByIdAndUpdate(request.params.id, note,{ new: true})
        response.json(updateNote)
    } catch (error) {
        next(error)
    }
})

module.exports = notesRouter
