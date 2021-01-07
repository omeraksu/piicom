const express = require("express");
const Product = require("../models/productModel");
const {
  getAccessToRoute,
  getAdminAccess,
} = require("../middlewares/authorization/auth");
const CustomError = require("../helpers/errors/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const router = express.Router();

//Ürün getirme

router.get("/", getAccessToRoute, getAdminAccess, (req, res, next) => {
  Product.find({}, (error, product) => {
    if (error) {
      res.send("Product is not Found");
    } else {
      next();
      res.json(product);
    }
  });
});

//Ürün Ekleme //Oturum Kontrolü ve Merkezi Hata Ok
router.post(
  "/newProduct",
  getAccessToRoute,
  asyncErrorWrapper(async (req, res, next) => {
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
    return res
      .status(201)
      .send({ message: "New Product created", data: newProduct });
  })
);

// Ürün Güncelleme
//Oturum Kontrolü ve Merkezi Hata Ok
router.post(
  "/update/:id",
  getAccessToRoute,
  asyncErrorWrapper(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.description = req.body.description || product.description;

    const updatedProduct = await product.save();

    return res
      .status(200)
      .send({ message: "Product Updated", data: updatedProduct });
  })
);

// Ürün Silme
//Oturum Kontrolü ve Merkezi Hata Ok
router.delete(
  "/delete/:id",
  getAccessToRoute,
  asyncErrorWrapper(async (req, res) => {
    const deletedProduct = await Product.findById(req.params.id);

    await deletedProduct.delete();
    res.send({ message: "Product Deleted" });
  })
);

module.exports = router;
