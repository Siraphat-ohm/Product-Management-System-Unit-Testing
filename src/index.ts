import express, { NextFunction, Request, Response } from "express";
import products from "./routes/products";

const app = express()
const port = process.env.PORT || 30822

app.use(express.json());
app.use( ( req: Request, res: Response, next: NextFunction ) => {
    console.log( `${req.method} request for ${req.url}` );
    next();
});

app.use('/products', products);

app.listen( port, () => {
    console.log(`server start on port ${port}`)
});