require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');


describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });
    
    // returns all teas
    test('returns teas', async() => {

      const expectation = [
        {
          id: 1,
          tea_name: 'Darjeeling',
          type: 'Black',
          description: 'Derivative of Black Tea with a light, nutty taste to it and a floral smell.',
          north_america_native: false,
          url: 'https://cdn.shopify.com/s/files/1/0415/5182/3016/articles/5e62a4da51beefb68fbc4ae0_AdobeStock_317029222_1024x1024.jpeg?v=1596741272',
          owner_id: 1
        },
        {
          id: 2,
          tea_name: 'English Breakfast',
          type: 'Black',
          description: 'Has a rich and hearty flavor and is often enjoyed with milk and sugar.',
          north_america_native: false,
          url: 'https://cdnimg.webstaurantstore.com/images/products/large/542790/1993727.jpg',
          owner_id: 1
        },
        {
          id: 3,
          tea_name: 'Matcha',
          type: 'Green',
          description: 'Has a rich and hearty flavor and is often enjoyed with milk and sugar.',
          north_america_native: false,
          url: 'https://www.nishikidori.com/579-large_default/organic-matcha-tea-from-nishio-aichi-premium-quality.jpg',
          owner_id: 1
        },
        {
          id: 4,
          tea_name: 'Mint',
          type: 'Green',
          description: 'Tastes like mint leaves and helps to soothe upset stomachs.',
          north_america_native: false,
          url: 'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/325242_1100-1100x628.jpg',
          owner_id: 1
        },
        {
          id: 5,
          tea_name: 'Chamomile',
          type: 'herbal',
          description: 'Is known for its soothing properties with a floral flavoring.',
          north_america_native: false,
          url: 'https://post.healthline.com/wp-content/uploads/2020/09/chamomile-tea-thumb-1-732x549.jpg',
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/teas')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // returns a single tea per ID
    test('returns teas per ID', async() => {

      const expectation = {
        id: 1,
        tea_name: 'Darjeeling',
        type: 'Black',
        description: 'Derivative of Black Tea with a light, nutty taste to it and a floral smell.',
        north_america_native: false,
        url: 'https://cdn.shopify.com/s/files/1/0415/5182/3016/articles/5e62a4da51beefb68fbc4ae0_AdobeStock_317029222_1024x1024.jpeg?v=1596741272',
        owner_id: 1
      };

      const data = await fakeRequest(app)
        .get('/teas/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // Test DELETE
    test('deletes table row per ID', async() => {

      const expectation = {
        id: expect.any(Number),
        tea_name: 'Darjeeling',
        type: 'Black',
        description: 'Derivative of Black Tea with a light, nutty taste to it and a floral smell.',
        north_america_native: false,
        url: 'https://cdn.shopify.com/s/files/1/0415/5182/3016/articles/5e62a4da51beefb68fbc4ae0_AdobeStock_317029222_1024x1024.jpeg?v=1596741272',
        owner_id: 1
      };

      const data = await fakeRequest(app)
        .delete('/teas/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      const data2 = await fakeRequest(app)
        .get('/teas')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
      expect(data2.body).toEqual(expect.not.arrayContaining([expectation]));
    });

    // Test POST
    test('creates a new table row', async() => {

      const expectation = {
        id: expect.any(Number),
        tea_name: 'Darjeeling',
        type: 'Black',
        description: 'Derivative of Black Tea with a light, nutty taste to it and a floral smell.',
        north_america_native: false,
        url: 'https://cdn.shopify.com/s/files/1/0415/5182/3016/articles/5e62a4da51beefb68fbc4ae0_AdobeStock_317029222_1024x1024.jpeg?v=1596741272',
        owner_id: 1
      };

      const returningData = await fakeRequest(app)
        .post('/teas')
        .send({
          id: expect.any(Number),
          tea_name: 'Darjeeling',
          type: 'Black',
          description: 'Derivative of Black Tea with a light, nutty taste to it and a floral smell.',
          north_america_native: false,
          url: 'https://cdn.shopify.com/s/files/1/0415/5182/3016/articles/5e62a4da51beefb68fbc4ae0_AdobeStock_317029222_1024x1024.jpeg?v=1596741272',
          owner_id: 1
        })
        .expect('Content-Type', /json/)
        .expect(200);
  
      const trueData = await fakeRequest(app)
        .get('/teas')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(returningData.body).toEqual(expectation);
      expect(trueData.body).toEqual(expect.arrayContaining([expectation]));
    });

    // TEST put
    test('updates a table row', async() => {

      const expectation = {
        id: 2,
        tea_name: 'Turkey Breakfast',
        type: 'Black',
        description: 'Has a rich and hearty flavor and is often enjoyed with milk and sugar.',
        north_america_native: false,
        url: 'https://cdnimg.webstaurantstore.com/images/products/large/542790/1993727.jpg',
        owner_id: 1
      };

      const returningData = await fakeRequest(app)
        .put('/teas/2')
        .send({
          id: 2,
          tea_name: 'Turkey Breakfast',
          type: 'Black',
          description: 'Has a rich and hearty flavor and is often enjoyed with milk and sugar.',
          north_america_native: false,
          url: 'https://cdnimg.webstaurantstore.com/images/products/large/542790/1993727.jpg',
          owner_id: 1
        })
        .expect('Content-Type', /json/)
        .expect(200);
  
      const trueData = await fakeRequest(app)
        .get('/teas')
        .expect('Content-Type', /json/)
        .expect(200);
      
      
      expect(returningData.body).toEqual(expectation);
      expect(trueData.body).toEqual(expect.arrayContaining([expectation]));
    });

    // https://zellwk.com/blog/endpoint-testing/
    // test PUT throws 500 error
    test('put throws 500 error caused by a missing property', async() => {

      const returningData = await fakeRequest(app)
        .put('/teas/2')
        .send({
          id: 2,
          type: 'Black',
          description: 'Has a rich and hearty flavor and is often enjoyed with milk and sugar.',
          north_america_native: false,
          url: 'https://cdnimg.webstaurantstore.com/images/products/large/542790/1993727.jpg',
          owner_id: 1
        })
        .expect('Content-Type', /json/)
        .expect(500);
      
      expect(returningData.status).toBe(500);
    });

    // test PUT throws 400 error
    test('put throws 400 error caused by a mispelled endpoint', async() => {

      const returningData = await fakeRequest(app)
        .put('/%teas/2')
        .send({
          id: 2,
          // tea_name: 'Turkey Breakquick
          type: 'Black',
          description: 'Has a rich and hearty flavor and is often enjoyed with milk and sugar.',
          north_america_native: false,
          url: 'https://cdnimg.webstaurantstore.com/images/products/large/542790/1993727.jpg',
          owner_id: 1
        })
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(404);
      
      expect(returningData.status).toBe(404);
    });

    // test POST throws 400 error
    test('post throws 400 error caused by a mispelled endpoint', async() => {

      const returningData = await fakeRequest(app)
        .post('/%teas/')
        .send({
          id: 2,
          // tea_name: 'Turkey Breakquick
          type: 'Black',
          description: 'Has a rich and hearty flavor and is often enjoyed with milk and sugar.',
          north_america_native: false,
          url: 'https://cdnimg.webstaurantstore.com/images/products/large/542790/1993727.jpg',
          owner_id: 1
        })
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(404);
      
      expect(returningData.status).toBe(404);
    });

    // test POST throws 500 error
    test('post throws 500 error caused by a missing property', async() => {

      const returningData = await fakeRequest(app)
        .post('/teas/')
        .send({
          id: 2,
          type: 'Black',
          description: 'Has a rich and hearty flavor and is often enjoyed with milk and sugar.',
          north_america_native: false,
          url: 'https://cdnimg.webstaurantstore.com/images/products/large/542790/1993727.jpg',
          owner_id: 1
        })
        .expect('Content-Type', /json/)
        .expect(500);
      
      expect(returningData.status).toBe(500);
    });
    
    // test delete throws 400 error
    test('delete throws 400 error caused by a mispelled endpoint', async() => {

      const returningData = await fakeRequest(app)
        .delete('/%teas/2')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(404);
      
      expect(returningData.status).toBe(404);
    });

    // test get throws 400 error
    test('get all throws 400 error caused by a mispelled endpoint', async() => {

      const returningData = await fakeRequest(app)
        .get('/%teas')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(404);
      
      expect(returningData.status).toBe(404);
    });

    // test get by ID throws 400 error
    test('get by id throws 400 error caused by a mispelled endpoint', async() => {

      const returningData = await fakeRequest(app)
        .get('/%teas/2')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(404);
      
      expect(returningData.status).toBe(404);
    });

    // Can't figure out how to test a 500 error on a delete or get requests.
  });
});