const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ExtraSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    // date: {
    //     type: Date,
    //     default: Date.now
    // }
});

ExtraSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

ExtraSchema.set('toJSON', {
    virtuals: true
});

module.exports = Extra = mongoose.model("extras", ExtraSchema);
