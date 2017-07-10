const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Item = require('./models/item');

mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017/vend");

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
  let id = req.params.id
    , paid = req.body.paid
    , change = 0
    , item;
//this is close... it's not updating quantity or purchased though
  Item.findOne({_id: id}).then((_item) => {
    item = _item;
    if (paid > item.price){
      item.quantity -=1;
      quantity = item.quantity;
      item.purchased += 1;
      purchased = item.purchased;
      {$set: {item.quantity = quantity, item.purchased = purchased}};
      change = paid - item.price;
      console.log('purchased: ' + item.name + ' change due: ' + change);
    } else if (paid > item.price) {
      {$set: {item.quantity -= 1, item.purchased +=1}};
      console.log('equal purchased: ' + item.name);
    }
  }).then(res.status(200).json(item));
});

// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
// GET /api/vendor/money - get a total amount of money accepted by the machine
// POST /api/vendor/items - add a new item not previously existing in the machine
// PUT /api/vendor/items/:itemId - update item quantity, description, and cost

app.listen(3000);

// if (require.main === 'module') {
//   app.listen(3000, function () {
//     console.log('Express running');
//   });
// };
//
// module.exports = app;
