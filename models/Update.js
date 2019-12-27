const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UpdateSchema = new Schema({
    is_success: { type: Boolean, required: true, default: true },
    errorMessage: { type:String, required: false, default: null},
    message: { type:String, required: false, default: null}, // tells if which category or item is added/edited/deleted
    tokens: [{
            token: { type:String, required: false}
        }],
    state: { type: Number, required: true},  // 0: category-add, 1: category-edit, 2 : category-delete
                                             // 3: extra-item-add, 4: extra-item-edit, 5 : extra-item-delete
                                             // 6: category-item-add, 7: category-item-edit, 8 : category-item-delete
                                             //-1: NOt found update data
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: false, default: null },
    extra_id: { type: Schema.Types.ObjectId, ref: 'Extra', required: false, default: null },
    item_id: { type: Schema.Types.ObjectId, ref: 'Item', required: false, default: null },
    data: {
        name: { type:String, required: false, default: null },
        content: { type:String, required: false, default: null },
        url: { type:String, required: false, default: null },
        sound: { type:String, required: false, default: null },
    },
});

// UpdateSchema.virtual('id').get(function(){
//     return this._id.toHexString();
// });

// UpdateSchema.set('toJSON', {
//     virtuals: true
// });

module.exports = Update = mongoose.model("updates", UpdateSchema);
