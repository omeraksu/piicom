const express = require('express');

const Product = require('../models/productModel');



const router = express.Router();

//Ürün getirme

router.get("/",(req,res) =>{
    
    Product.find({},(error,product)=>{
        if(error){
            res.send("Product is not Found");
        }
        else{
            res.json(product);
        }
    })
})



//Ürün Ekleme //
router.post('/',async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        countInStock: req.body.countInStock,
        description: req.body.description,

    });
    const newProduct = await product.save();
    if (newProduct) {
        return res
            .status(201)
            .send({ message: 'New Product created', data: newProduct });
    }
    return res
        .status(500)
        .send({ message: 'Error in Creating Product' });
});

// Ürün Güncelleme

router.put('/:id',async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.image = req.body.image || product.image;
        product.brand = req.body.brand || product.brand;
        product.category = req.body.category || product.category;
        product.countInStock = req.body.countInStock || product.countInStock;
        product.description = req.body.description || product.description;

        const updatedProduct = await product.save();
        if (updatedProduct) {
            return res
                .status(200)
                .send({ message: 'Product Updated', data: updatedProduct });
        }

    }
    return res.status(500).send({ message: 'Error in Updating Product.' });
});

// Ürün Silme //Eğer Admin İse
router.delete('/:id',async (req, res) => {
    const deletedProduct = await Product.findById(req.params.id);
    if (deletedProduct) {
        await deletedProduct.delete();
        res.send({ message: 'Product Deleted', });
    } else {
        res.send('Error in Deletion.');
    }
})









module.exports = router