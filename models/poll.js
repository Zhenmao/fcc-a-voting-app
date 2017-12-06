const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    pollText: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    options: [{
        optionText: {
            type: String,
            required: true,
            trim: true
        },
        count: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = mongoose.model("Poll", pollSchema);