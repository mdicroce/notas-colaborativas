const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')


notesRouter.get('/:id',async (request,response) => {
    Note.findById(request.params.id).populate('owner','responsable','moreNotes')
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
    const note = new Note({
        title: body.title,
        owner: body.ownerId,
        responsable: body.responsableId || body.ownerId,
        content: body.content,
        moreNotes: [],
        date: new Date()
    })
    try {
        const savedNote = await note.save()
        response.json(savedNote)
    } catch (error) {
        next(error)
    }
})
notesRouter.put('/comment/:id', async(request,response,next) => {
    try {
        let commentedNote = await Note.findById(request.params.id)
        if(!commentedNote)
        {
            response.status(404)
        }
    } catch (error) {
        next(error)
    }
    const note = new Note({
        title: body.title,
        owner: body.ownerId,
        responsable: body.responsableId || body.ownerId,
        content: body.content,
        moreNotes: [],
        date: new Date()
    })
    const newComment = await note.save()
    const noteToUpdate = {...commentedNote, moreNotes: [...moreNotes, newComment.id]}
    try {
        const updateNote = await Note.findByIdAndUpdate(request.params.id, noteToUpdate,{ new: true})
        response.json(updateNote)
    } catch (error) {
        next(error)
    }
})
notesRouter.delete('/:id',(request,response,next) =>{
    Note.findByIdAndRemove(request.params.id)
    .then(()=> {
        response.status(204).end()
    })
    .catch(error => (error))
})

notesRouter.put('/:id',async(request,response,next) => {
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

module.exports = notesRouter
