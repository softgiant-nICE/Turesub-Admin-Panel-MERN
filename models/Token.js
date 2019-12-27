const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TokenSchema = new Schema({
    token: { type: String, required: true },
    });


module.exports = Token = mongoose.model("tokens", TokenSchema);
