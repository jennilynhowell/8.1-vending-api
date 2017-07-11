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
app.get('/api/customer/items', (req, res) => {
  Item.find((err, items) =>{
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(items);
    };
  });
});

// POST /api/customer/items/:itemId/purchases - purchase an item
app.post('/api/customer/items/:id/purchases', (req, res) => {
  let _id = req.params.id
    , paid = req.body.paid
    , change = 0;

    //fix this to have conditionals inside find; still records purchase if paid too low
  Item.findOneAndUpdate({_id: _id}, {
    //decrement quantity not working
    $inc: {quantity: -1},
    $inc: {purchased: 1},
    $inc: {paid: paid}
  }).then(item => {
    if (paid > item.price) {
      change = paid - item.price;
      res.status(201).json({change: change + ' is your change. Thanks!'});
    } else if (paid < item.price) {
      res.status(404).json({tryagain: 'Transaction cancelled, please try again'});
    } else if (paid = item.price) {
      res.status(201).json({thanks: 'Thanks!'});
    };
  });
});

// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
app.get('/api/vendor/purchases', (req, res) => {
  Item.find({purchased: {$gt: 0}}).then(items => {
    res.status(200).json(items);
  });
});

// GET /api/vendor/money - get a total amount of money accepted by the machine
app.get('/api/vendor/money', (req, res) => {
  Item.find({paid: {$gt: 0}}).then(items => {
    //items.forEach()...?
    res.status(200).json(items);
  });
});

// POST /api/vendor/items - add a new item not previously existing in the machine
app.post('/api/vendor/items', (req, res) => {
  let newItem = new Item(req.body).save().then(item => {
    res.status(201).json(item);
  });

});

// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
  //I'm using PATCH here as I do not wish to replace the entire document
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
