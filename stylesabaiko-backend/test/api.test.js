const request = require('supertest');
const app = require('../index');

describe('API Testing', () => {
    it('GET /test | Response with json', async () => {
        const response = await request(app).get('/test');
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual('Hello');
    });

    it('Get Products | Fetch all products', async () => {
        const response = await request(app).get('/api/product/get_products');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBeDefined();
        expect(response.body.message).toEqual('Products fetched successfully');

    
    })

    //get single product
    it('GET Product | Fetch single product', async () => {
        const response = await request(app).get('/api/product/get_product/667ea7d781557d24f7cf806c');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('product');
    })

    //create user
    it('POST /create | Register new user', async () => {
        const response = (await request(app).post('/api/user/create')).setEncoding({
            firstName: 'Princy',
            lastName: 'Agrawal',
            email: 'agrawalprincy151@gmail.com',
            password: 'princy151'
        });

        expect(response.statusCode).toBe(200);
        expect(response.body);
        expect(response.body.message).toEqual('User created successfully');

    });
});