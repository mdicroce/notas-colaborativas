const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/',(request,response) => {
    response.send("hola")
})
notesRouter.get('/:username/',(request,response) => {
    Note.find({author: {
        username: request.params.username
    }}).then(notes => {
        response.json(notes)
    })
})

notesRouter.get('/:id', (request,response) => {
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

notesRouter.post('/',(request,response,next) => {
    const body = request.body
    
    const note = new Note({
        title: body.title,
        username: body.username,
        mail: body.mail,
        content: body.content,
        comments: [],
        date: new Date()
    })
    response.json(note)
    console.log("hola")
    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error=>next(error))
})
notesRouter.put('/comment/:id',(request,response,next) => {
    let commentedNote = Note.findById(request.params.id)
    .then(note => {
        if(note)
        {
            return note
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
    const body = request.body
    const notes = 
    [
        ...commentedNote.comments,
        {   
            title: body.title,
            content: body.content,
            date: body.date || Date.now,
            comments: [],
            username: body.author.name,
            mail: body.author.mail
        }
    ]
    commentedNote = {...commentedNote, comments: notes}
    Note.findByIdAndUpdate(request.params.id, commentedNote,{ new: true})
    .then(updateNote => {
        response.json(updateNote)
    })
    .catch(error => next(error))
})
notesRouter.delete('/:id',(request,response,next) =>{
    Note.findByIdAndRemove(request.params.id)
    .then(()=> {
        response.status(204).end()
    })
    .catch(error => (error))
})

notesRouter.put('/:id',(request,response,next) => {
    const body = request.body
    
    const note = {   
        title: body.title,
        content: body.content,
        date: body.date || Date.now,
        comments: [...body.comments],
        username: body.author.name,
        mail: body.author.mail
    }

    Note.findByIdAndUpdate(request.params.id, note,{ new: true})
    .then(updateNote => {
        response.json(updateNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
