const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')


notesRouter.get('/:username/',async(request,response) => {
    const notes = await Note.find({author: {
        username: request.params.username
    }})
    response.json(notes)
})

notesRouter.get('/:id',async (request,response) => {
    Note.findById(request.params.id)
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
    const user = await User.findById(body.userId)
    const note = new Note({
        title: body.title,
        username: body.username,
        mail: body.mail,
        content: body.content,
        comments: [],
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
