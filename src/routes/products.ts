import express, { Request, Response } from "express"
import { prisma } from "../client";

const router = express();

router.get('/', async( req: Request, res: Response ) => {
    try {
        res.json( await prisma.products.findMany() );
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.get('/:id', async( req: Request, res: Response ) => {
    try {
        const { id } = req.params;
        const foundProduct = await prisma.products.findUnique( { where: { id } } );
        if ( !foundProduct )
            return res.status( 404 ).json( { error: "Product not found." } );
        res.status( 200 ).json( foundProduct );
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post('/', async( req: Request, res: Response ) => {
    try {
        const { name, category, price, stock } = req.body;
        if ( !name || !price || !category || !stock )
            return res.status( 404 ).json( { error: "name, category, price, and stock are required."});
        const newProduct = await prisma.products.create( { data: {
            name, category, price: +price, stock: +stock
        } });

        res.status( 201 ).json( newProduct );
    } catch (error) {
        console.log("Error adding proudct:", error);
        res.status( 500 ).json({ error: "Internal server error."} );
    }
});

router.put('/:id', async( req: Request, res: Response ) => {
    try {
        const { id } = req.params;
        const { name, category, price, stock } = req.body;

        if (!name && !category && !price && !stock)
            return res.status( 400 ).json({ error: "At least one field (name, category, price, or stock) is required for an update." });
        const foundProduct = await prisma.products.findUnique( { where : { id } });

        if ( !foundProduct ) 
            return res.status(404).json({ error: "Product not found."});

        const updaetProduct = await prisma.products.update( { where : { id }, data : {
            name, category, price: price ? +price : foundProduct!.price, stock: stock ? +stock : foundProduct!.stock
        }});

        res.status( 200 ).json(updaetProduct)
    } catch (error) {
        console.error("Error updating product:", error);
        res.status( 500 ).json({ error: "Internal server error." }); 
    }
});

router.delete('/:id', async( req: Request, res: Response ) => {
    try {
        const { id } = req.params;
        const foundProduct = await prisma.products.findUnique( { where : { id } } );
        if ( !foundProduct )
            return res.status( 404 ).json( { error: "Product not found." } );
        const deleteProduct = await prisma.products.delete( { where : { id } } );
        res.status( 200 ).json( deleteProduct );
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status( 500 ).json({ error: "Internal server error." }); 
    }
});

export = router;