const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// var autoIncrement = require('mongoose-auto-increment')
// const db = require('../config/keys').mongoURI;

// var connection = mongoose.createConnection(db);
// autoIncrement.initialize(connection);

const CategorySchema = new Schema({
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

// CategorySchema.plugin(autoIncrement.plugin, 'Category');

CategorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

CategorySchema.set('toJSON', {
    virtuals: true
});

module.exports = Category = mongoose.model("categories", CategorySchema);
