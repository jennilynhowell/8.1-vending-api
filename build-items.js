const mongoose = require('mongoose');
const Item = require('./models/item');

mongoose.connect('mongodb://localhost:27017/vend');

let item1 = new Item(
  {
    name: 'Green Apples',
    price: 0.5,
    description: 'Crisp, fresh apple'
  }
);

let item2 = new Item(
  {
    name: 'Rx Bars',
    price: 2,
    description: 'Blueberry or Mixed Berry flavored Rx Bar'
  }
);

let item3 = new Item(
  {
    name: 'Roasted mixed nuts',
    price: 2.5,
    description: 'Roasted, lightly-salted mix of almonds, cashews, and pecans'
  }
);

let item4 = new Item(
  {
    name: 'Yogurt',
    price: 1.5,
    description: 'Greek yogurt with blueberries on the bottom'
  }
);

let item5 = new Item(
  {
    name: 'Cheese sticks',
    price: 2,
    description: 'Two sticks of organic mozzarella cheese'
  }
);

let item6 = new Item(
  {
    name: 'Carrots & hummus',
    price: 2.5,
    description: 'Baby carrots with traditional hummus'
  }
);

let item7 = new Item(
  {
    name: 'Bottled water',
    price: 1,
  }
);

let item8 = new Item(
  {
    name: 'La Croix',
    price: 1,
    description: 'Citrus La Croix'
  }
);

item1.save();
item2.save();
item3.save();
item4.save();
item5.save();
item6.save();
item7.save();
item8.save();
