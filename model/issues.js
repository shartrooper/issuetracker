const mongoose = require('mongoose');

const issueSchema = mongoose.Schema
({
    issue_title: {
        type: String,
        minlength:5,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String
    },
    created_on: {
        type: Date,
        required: true
    },
    updated_on: {
        type: Date,
        required: true
    },
    status_text: {
        type: String
    },
    open: {
        type: Boolean,
		required: true,
		default: true
    }
});

issueSchema.set('toJSON', {
transform: (document, returnedObject) => {
//returnedObject.id = returnedObject._id.toString();
//delete returnedObject._id;
delete returnedObject.__v;
},
});

module.exports = mongoose.model('Issue', issueSchema);
