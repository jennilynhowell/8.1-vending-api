const expect = require('chai').expect;
const request = require('supertest');
const app = require('./app');
const Item = require('./models/item');

describe('basic api endpoint data tests', () => {

  beforeEach((done) => {
    Item.insertMany([
      {name: 'NewItem', price: 1, quantity: 1, purchased: 2, paid: 4, purchased: 4},
      {name: 'NewItem2', price: 1.5, quantity: 1, paid: 1, purchased: 0},
      {name: 'NewItem3', price: 2, quantity: 1, purchased: 1}
    ]).then(done());
  });

  afterEach((done) => {
    Item.deleteMany({}).then(() => done());
  });

  it('lists income at GET /api/vendor/money', (done) => {
    request(app)
      .get('/api/vendor/money')
      .expect(200)
      .expect(res => {
        expect(res.body.data[0].paid).to.equal(4);
      }).end(done);
  });

  it('lists all purchases at GET /api/vendor/purchases', (done) => {
    request(app)
      .get('/api/vendor/purchases')
      .expect(200)
      .expect(res => {
        expect(res.body.data[0].name).to.equal('NewItem')
        expect(res.body.data[0].purchased).to.equal(4);
        expect(res.body.data[0].paid).to.equal(4);
        expect(res.body.data[1].purchased).to.equal(1);
      }).end(done);
  });

  it('allows item to be purchased at POST /api/customer/items/:itemId/purchases', (done) => {
    let item = new Item({name: 'NewItem10', price: 1, quantity: 1, purchased: 0}).save().then((item) => {
      request(app)
        .post('/api/customer/items/' + item._id + '/purchases')
        .send({paid: 2})
        .expect(res => {
          expect(res.body.data.name).to.equal('NewItem10');
          expect(res.body.data.purchased).to.equal(1);
          expect(res.body.message).to.contain('Change');
        })
        .expect(201).end(done);
    });

  });

  //got help w this from https://stackoverflow.com/questions/30109806/how-to-test-put-method-using-supertest-and-jasmine-node
  it('allows update of item at PATCH /api/vendor/items/:id', (done) => {
    let item = new Item({name: 'NewItem', price: 1, quantity: 1, purchased: 0}).save().then(item => {
      request(app)
        .patch('/api/vendor/items/' + item._id)
        .send({price: 5, quantity: 50, description: 'update desc'})
        .expect(res => {
          expect(res.body.message).to.equal('Update successful');
        })
        .expect(202).end(done);
    });

  });

  it('allows item creation at POST /api/vendor/items', (done) => {
    request(app)
      .post('/api/vendor/items')
      .send({name: 'NewItem4', price: 2, quantity: 2})
      .expect(201)
      .expect(res => {
        Item.count().then(count => {
          expect(count).to.equal(4);
        });
      }).end(done);
  });

  it('returns all items as json at GET /api/customer/items', (done) => {
    request(app)
      .get('/api/customer/items')
      .expect(200)
      .expect(res => {
        expect(res.body.data[0].name).to.equal('NewItem');
        expect(res.body.data[1].name).to.equal('NewItem2');
        expect(res.body.data[2].name).to.equal('NewItem3');
        expect(res.body.data.length).to.equal(3);
      }).end(done);
  });
});

//check model
describe('basic model tests', () => {
  beforeEach((done) => {
    Item.deleteMany({}).then(done());
  });

  afterEach((done) => {
    Item.deleteMany({}).then(done());
  });

  it('test should clean up after itself', (done) => {
    const _item = new Item({name: 'NewItem', price: 1, quantity: 1, purchased: 0}).save().then(item => {
      Item.count().then(count => {
        expect(count).to.equal(1);
        done();

      });
    });
  });

  it('can create item in db and find it w mongoose', (done) => {
    const _item = new Item({name: 'NewItem', price: 1, quantity: 1, purchased: 0})
      .save().then(item => {
        expect(item.name).to.equal('NewItem');
        expect(item.quantity).to.equal(1);
        done();

      });
  });
});

describe('basic api endpoint tests', () => {
  it('can access endpoint and receive successful res', (done) => {
    request(app)
      .get('/api/sanity')
      .expect(200, {hello: 'there'}, done);
  });
});

describe('sanity test', () => {
  it('should run test', () => {
    expect(1).to.not.equal(10);
  });
});
