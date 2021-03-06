const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Item = require('./models/item');

mongoose.Promise = require('bluebird');

const nodeEnv = process.env.NODE_ENV || "development";
const config = require('./config.json')[nodeEnv];
mongoose.connect(config.mongoUrl);
app.use(bodyParser.json());


// GET /api/customer/items - get a list of items
//TEST PASSING
app.get('/api/customer/items', (req, res) => {
  Item.find((err, items) =>{
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json({status: 'Success', data: items});
    };
  });
});

// POST /api/customer/items/:itemId/purchases - purchase an item
//TEST PASSING
app.post('/api/customer/items/:id/purchases', (req, res) => {
  let _id = req.params.id
    , paid = req.body.paid
    , purchaseDate = Date.now()
    , change = 0
    , message = '';

  Item.findById(_id).then(item => {
    if (paid === item.price && item.quantity > 0){
      message = 'Thanks!';
      item.quantity -= 1;
      item.purchased += 1;
      item.paid = paid;
      item.purchaseDate.push(purchaseDate);
      item.save();
      return res.status(201).json({status: 'Success', message: message, data: item});

    } else if (paid > item.price && item.quantity > 0) {
      change = paid - item.price;
      message = 'Change due: ' + change;
      item.quantity -= 1;
      item.purchased += 1;
      item.paid = paid;
      item.purchaseDate.push(purchaseDate);
      item.save();
      return res.status(201).json({status: 'Success', message: message, data: item});

    } else if (paid < item.price || item.quantity === 0) {
      message = 'Sorry, something went wrong!';
      return res.status(404).json({status: 'Error', message: message});

    } else {
      message = 'Sorry, something went wrong!';
      return res.status(404).json({status: 'Error', message: message});
    }
  });

});


// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
//TEST PASSING
app.get('/api/vendor/purchases', (req, res) => {
  Item.find({purchased: {$gt: 0}}).then(items => {
    let list = [];
    for (let i = 0; i < items.length; i++) {
      list.push({name: items[i].name, purchasedOn: items[i].purchaseDate});
    };
    res.status(200).json({status: 'Success', list: list, data: items});
  });
});

// GET /api/vendor/money - get a total amount of money accepted by the machine
//TEST PASSING
app.get('/api/vendor/money', (req, res) => {
  Item.find({paid: {$gt: 0}}).then(items => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].paid > 0) {
        total += items[i].paid;
      }
    };
    res.status(200).json({status: 'Success', total: total, data: items});
  });
});

// POST /api/vendor/items - add a new item not previously existing in the machine
//TEST PASSING
app.post('/api/vendor/items', (req, res) => {
  let newItem = new Item(req.body).save().then(item => {
    res.status(201).json({status: 'Success', data: item});
  });

});

// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
  //!!!! I'm using PATCH here as I do not wish to replace the entire document
//TEST PASSING
app.patch('/api/vendor/items/:id', (req, res) => {
  let _id = req.params.id
    , quantity = req.body.quantity
    , price = req.body.price
    , description = req.body.description;

  Item.findOneAndUpdate({_id: _id}, {
    quantity: quantity,
    price: price,
    description: description
  }).then(res.status(202).json({message: 'Update successful'}));
});

//check test connection
app.get('/api/sanity', (req, res) => {
  res.json({hello: 'there'})
});

app.listen(3000);
module.exports = app;
