import request from "supertest"
import express, { Express } from 'express';
import products from '../src/routes/products';
import { prisma } from "../src/client";

const app: Express = express();
app.use(express.json());
app.use('/', products);

describe( "Products API Endpoints", () => {

    describe( "Get products", () => {
        it( "GET /products should return a list of products", async() => {
            const res = await request(app).get('/');
            expect( res.status ).toBe(200);
            expect( res.body ).toMatchObject(await prisma.products.findMany())
        });

        it( "GET /products/:id should return a product by id", async() => {
            const id = '92f1f6f8-55ed-46e8-be88-da1b4067389d'
            const res = await request(app).get(`/${id}`);
            expect( res.status ).toBe(200);
            const product = await prisma.products.findUnique( { where: { id }} ) 
            expect( res.body ).toMatchObject(product!);
        });

        it( "GET /products/:id should return Product not found", async() => {
            const res = await request(app).get('/999999999999999999999');
            expect( res.status ).toBe(404);
            expect( res.body ).toMatchObject({ "error": "Product not found."})
        });
    });

    describe( "Create product", () => {
        it( "POST /product should return 201", async() => {
            const newProduct = {
                id: "asld12391240-asdf",
                name: "Iphone999",
                category: "smartphone",
                price: 99.12,
                stock: 10
            }
            const res = await request(app).post('/').send(newProduct);
            expect( res.status ).toBe(201);
        } );

        it( "POST /product with some data should return name, category, price, and stock are required.", async() => {
            const newProduct = {
                name: "Iphone999",
                category: "smartphone",
                stock: 10
            }
            const res = await request(app).post('/').send(newProduct);
            expect( res.status ).toBe(400);
            expect( res.body ).toMatchObject( { "error": "name, category, price, and stock are required." });
        } );

        it( "POST /product without data should return name, category, price, and stock are required.", async() => {
            const res = await request(app).post('/').send('');
            expect( res.status ).toBe(400);
            expect( res.body ).toMatchObject( { "error": "name, category, price, and stock are required." });
        } );

        it( "POST /product with wrong type of data should Price and stock must be valid numbers.", async() => {
            const newProduct = {
                name: "Iphone999",
                category: "smartphone",
                stock: 10,
                price: "1232,1232"
            }
            const res = await request(app).post('/').send(newProduct);
            expect( res.status ).toBe(400);
            expect( res.body ).toMatchObject( { "error": "Price and stock must be valid numbers." });
        } );

    });

    describe( "Update Product", () => {
        it( "PUT /product/:id should return 201 ", async() => {
            const newProduct = {
                name: "Iphone999",
                price: 99.12,
                stock: 10
            }
            const res = await request(app).put('/92f1f6f8-55ed-46e8-be88-da1b4067389d').send(newProduct);
            expect( res.status ).toBe(200);
        });

        it( "PUT /product/:id without data should return At least one field (name, category, price, or stock) is required for an update.", async() => {
            const res = await request(app).put('/92f1f6f8-55ed-46e8-be88-da1b4067389d').send("");
            expect( res.status ).toBe(400);
            expect( res.body ).toMatchObject( { "error": "At least one field (name, category, price, or stock) is required for an update." });
        });

        it( "PUT /product with wrong type of data should return Price and stock must be valid numbers.", async() => {
            const newProduct = {
                name: "Iphone999",
                price: "19,991AAA",
                stock: 10
            }
            const res = await request(app).put('/92f1f6f8-55ed-46e8-be88-da1b4067389d').send(newProduct);
            expect( res.status ).toBe(400);
            expect( res.body ).toMatchObject( { "error": "Price and stock must be valid numbers." });
        });

        it( "PUT /product with wrong type of data should return Product not found.", async() => {
            const newProduct = {
                name: "Iphone999",
                price: 99.12,
                stock: 10
            }
            const res = await request(app).put('/92f1f6f8-55ed-46e8-be88-da1b4067389dasdfasdfff').send(newProduct);
            expect( res.status ).toBe(404);
            expect( res.body ).toMatchObject( { "error": "Product not found." });
        });

    });

    describe( "Delete Product", () => {
        it( "DELETE /products/:id should return 200", async() => {
            const res = await request(app).delete('/3e3d4397-d72e-4dda-8079-72c8f99b4b91');
            expect( res.status ).toBe(200);
        });

        it( "DELETE /products/:id should return 404", async() => {
            const res = await request(app).delete('/assdfdfdbd27d80a-6370-45be-83d2-8775a1cb8243asdfasdfjaksdfjaksdj');
            expect( res.status ).toBe(404);
        });
    });

})