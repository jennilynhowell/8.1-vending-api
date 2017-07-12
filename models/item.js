const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String},
    quantity: {type: Number, required: true},
    purchased: {type: Number, required: true, default: 0},
    purchaseDate: [Date],
    paid: Number
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
