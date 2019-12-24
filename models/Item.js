const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Category = require('./Category')
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
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
    sound: {
        type: String,
        required: true
    }
});

ItemSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Schema_Category.virtual('categoryId').get(function() {
//     return this._id;
// });

ItemSchema.set('toJSON', {
    virtuals: true
});

module.exports = Item = mongoose.model("items", ItemSchema);
