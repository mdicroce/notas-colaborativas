const mongoose = require('mongoose')


const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    responseble: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    complete: {
        type: Boolean,
        default: false
    },
    moreNotes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }],
    date: {
        type: Date,
        default: Date.now
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }
})
noteSchema.pre('remove', (next) => {
    const Note = mongoose.model('note')
    Note.remove({ _id: {$in: $this.Note}}).then(() =>{ next() })
})
noteSchema.set('toJson', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)