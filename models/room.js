const mongoose = require('mongoose')
const noteSchema = require('./note')

const roomSchema = new mongoose.Schema({
    creator: {
        type: String,
        unique: true
    },
    notes: [noteSchema],
    
    
})

noteSchema.set('toJson', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)